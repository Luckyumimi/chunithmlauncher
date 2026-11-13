using System.Net;
using System.Net.Http;
using System.IO;
using System.Text.Json;

namespace ChunithmLauncher;

public partial class MainWindow
{
    private const string DefaultActivityFeedUrl = "https://activity.example.invalid/api/v1/activity-feed";
    private static readonly HttpClient ActivityHttpClient = CreateActivityHttpClient();
    private readonly SemaphoreSlim _activityFeedLock = new(1, 1);
    private CancellationTokenSource? _activityFeedCts;
    private string _activitySourceMode = "default";
    private string _activitySourceUrl = DefaultActivityFeedUrl;
    private DateTimeOffset? _activityFeedLastUpdated;

    private static HttpClient CreateActivityHttpClient()
    {
        var handler = new HttpClientHandler
        {
            UseProxy = true,
            Proxy = WebRequest.DefaultWebProxy,
            UseCookies = false,
        };
        handler.DefaultProxyCredentials = CredentialCache.DefaultCredentials;
        return new HttpClient(handler) { Timeout = TimeSpan.FromSeconds(8) };
    }

    private string ActivityCachePath => Path.Combine(
        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
        "ChunithmLauncher",
        "activity-feed.json");

    private async Task LoadActivityFeedAsync(bool forceRefresh = false)
    {
        _activityFeedCts?.Cancel();
        _activityFeedCts?.Dispose();
        _activityFeedCts = new CancellationTokenSource();
        var cancellationToken = _activityFeedCts.Token;
        await _activityFeedLock.WaitAsync(cancellationToken);
        try
        {
            if (!forceRefresh && TryReadActivityCache(out var cached))
            {
                PostActivityFeed(cached, fromCache: true);
            }

            var endpoint = ResolveActivityEndpoint();
            if (endpoint is null)
            {
                PostActivityFeedError("活动服务地址未配置", useFallback: !TryReadActivityCache(out _));
                return;
            }

            var requestUri = AddLanguage(endpoint, _language);
            using var response = await ActivityHttpClient.GetAsync(requestUri, cancellationToken);
            response.EnsureSuccessStatusCode();
            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            var document = await JsonSerializer.DeserializeAsync<ActivityFeedResponse>(stream, JsonOptions, cancellationToken);
            if (document is null || document.Version != 1)
            {
                throw new InvalidDataException("活动服务返回的版本不受支持");
            }

            var normalized = NormalizeActivityItems(document.Items, endpoint);
            var normalizedResponse = new ActivityFeedResponse(1, DateTimeOffset.UtcNow, normalized);
            WriteActivityCache(normalizedResponse);
            _activityFeedLastUpdated = DateTimeOffset.UtcNow;
            PersistConfig();
            PostActivityFeed(normalizedResponse, fromCache: false);
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
        }
        catch (Exception ex)
        {
            Log("加载活动服务失败", ex);
            var hasCache = TryReadActivityCache(out var cached);
            if (hasCache) PostActivityFeed(cached, fromCache: true);
            PostActivityFeedError("活动服务暂时不可用，已使用本地内容", useFallback: !hasCache);
        }
        finally
        {
            _activityFeedLock.Release();
        }
    }

    private Uri? ResolveActivityEndpoint()
    {
        if (_activitySourceMode == "default" && DefaultActivityFeedUrl.Contains(".example.invalid", StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        var value = _activitySourceMode == "custom" ? _activitySourceUrl : DefaultActivityFeedUrl;
        return Uri.TryCreate(value, UriKind.Absolute, out var uri) && uri.Scheme is "http" or "https" ? uri : null;
    }

    private static Uri AddLanguage(Uri endpoint, string language)
    {
        var builder = new UriBuilder(endpoint);
        var query = builder.Query.TrimStart('?').Split('&', StringSplitOptions.RemoveEmptyEntries)
            .Where(part => !part.StartsWith("language=", StringComparison.OrdinalIgnoreCase))
            .ToList();
        query.Add($"language={Uri.EscapeDataString(language == "system" ? "zh-CN" : language)}");
        builder.Query = string.Join('&', query);
        return builder.Uri;
    }

    private static IReadOnlyList<ActivityItem> NormalizeActivityItems(IReadOnlyList<ActivityItem>? items, Uri endpoint)
    {
        var now = DateTimeOffset.UtcNow;
        return (items ?? [])
            .Where(item => item.Enabled && !string.IsNullOrWhiteSpace(item.Title) && !string.IsNullOrWhiteSpace(item.ImageUrl))
            .Where(item => item.PublishedAt <= now && (item.ExpiresAt is null || item.ExpiresAt > now))
            .Select(item =>
            {
                var imageUrl = ResolveUrl(item.ImageUrl!, endpoint);
                return imageUrl is null ? null : item with
                {
                    ImageUrl = imageUrl,
                    OriginalUrl = string.IsNullOrWhiteSpace(item.OriginalUrl) ? null : ResolveHttpUrl(item.OriginalUrl, endpoint),
                    Title = item.Title.Trim()[..Math.Min(item.Title.Trim().Length, 120)],
                    Description = item.Description?.Trim()[..Math.Min(item.Description.Trim().Length, 4000)] ?? string.Empty,
                };
            })
            .Where(item => item is not null)
            .Select(item => item!)
            .OrderBy(item => item.SortOrder)
            .ThenByDescending(item => item.PublishedAt)
            .ToArray()!;
    }

    private static string? ResolveUrl(string value, Uri endpoint)
    {
        if (Uri.TryCreate(value, UriKind.Absolute, out var absolute) && absolute.Scheme is "http" or "https") return absolute.ToString();
        if (Uri.TryCreate(endpoint, value, out var relative) && relative.Scheme is "http" or "https") return relative.ToString();
        return null;
    }

    private static string? ResolveHttpUrl(string value, Uri endpoint)
    {
        var resolved = ResolveUrl(value, endpoint);
        return resolved;
    }

    private bool TryReadActivityCache(out ActivityFeedResponse response)
    {
        response = new ActivityFeedResponse(1, _activityFeedLastUpdated ?? DateTimeOffset.MinValue, []);
        try
        {
            if (!File.Exists(ActivityCachePath)) return false;
            var json = File.ReadAllText(ActivityCachePath);
            var parsed = JsonSerializer.Deserialize<ActivityFeedResponse>(json, JsonOptions);
            if (parsed is null || parsed.Version != 1) return false;
            response = parsed;
            return response.Items.Count > 0;
        }
        catch (Exception ex)
        {
            Log("读取活动缓存失败", ex);
            return false;
        }
    }

    private void WriteActivityCache(ActivityFeedResponse response)
    {
        try
        {
            Directory.CreateDirectory(Path.GetDirectoryName(ActivityCachePath)!);
            File.WriteAllText(ActivityCachePath, JsonSerializer.Serialize(response, JsonOptions));
        }
        catch (Exception ex)
        {
            Log("写入活动缓存失败", ex);
        }
    }

    private void PostActivityFeed(ActivityFeedResponse response, bool fromCache)
    {
        PostMessage("activity-feed", new
        {
            version = response.Version,
            generatedAt = response.GeneratedAt,
            fromCache,
            sourceMode = _activitySourceMode,
            sourceUrl = _activitySourceMode == "custom" ? _activitySourceUrl : DefaultActivityFeedUrl,
            lastUpdated = _activityFeedLastUpdated ?? response.GeneratedAt,
            items = response.Items,
        });
    }

    private void PostActivityFeedError(string message, bool useFallback)
    {
        PostMessage("activity-feed-error", new { message, useFallback, sourceMode = _activitySourceMode });
    }

    private sealed record ActivityFeedResponse(int Version, DateTimeOffset GeneratedAt, IReadOnlyList<ActivityItem> Items);
    private sealed record ActivityItem(string Id, string Title, string? Description, string? OriginalUrl, string? ImageUrl, DateTimeOffset PublishedAt, DateTimeOffset? ExpiresAt, int SortOrder, bool Enabled);
}
