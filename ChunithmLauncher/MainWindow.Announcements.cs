// Remote launcher announcement retrieval and validation.
using System.Net;
using System.Net.Http;
using System.Text.Json;

namespace ChunithmLauncher;

public partial class MainWindow
{
    private const string AnnouncementUrl = "https://gg.hatsuneniku.shop/announcement.json";

    private async Task CheckAnnouncementAsync(bool forceShow = false)
    {
        try
        {
            using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(5));
            using var response = await UpdateHttpClient.GetAsync(AnnouncementUrl, timeout.Token);
            if (response.StatusCode == HttpStatusCode.NoContent)
            {
                return;
            }

            response.EnsureSuccessStatusCode();
            await using var stream = await response.Content.ReadAsStreamAsync(timeout.Token);
            var announcement = await JsonSerializer.DeserializeAsync<AnnouncementPayload>(stream, JsonOptions, timeout.Token);
            if (!TryValidateAnnouncement(announcement, out var validated))
            {
                Log("公告格式无效或不适用于当前版本");
                return;
            }

            if (!forceShow && !validated.Force && validated.Id == _config.LastReadAnnouncementId)
            {
                return;
            }

            _config.LastReadAnnouncementId = validated.Id;
            PersistConfig();
            PostMessage("announcement", validated);
        }
        catch (Exception ex)
        {
            Log("获取公告失败", ex);
            if (forceShow)
            {
                SetStatus("检查公告失败", "#ff5a6a");
            }
        }
    }

    private static bool TryValidateAnnouncement(AnnouncementPayload? announcement, out AnnouncementPayload validated)
    {
        validated = default!;
        if (announcement is null || announcement.SchemaVersion != 1 || !announcement.Enabled
            || string.IsNullOrWhiteSpace(announcement.Id) || announcement.Id.Length > 100
            || string.IsNullOrWhiteSpace(announcement.Title) || announcement.Title.Length > 80
            || string.IsNullOrWhiteSpace(announcement.Body) || announcement.Body.Length > 800)
        {
            return false;
        }

        if (announcement.StartsAt is { } startsAt && startsAt > DateTimeOffset.UtcNow
            || announcement.EndsAt is { } endsAt && endsAt < DateTimeOffset.UtcNow)
        {
            return false;
        }

        var current = TryParseVersion(GetAppVersion());
        if (current is null
            || announcement.MinVersion is { Length: > 0 } min && (TryParseVersion(min) is not { } minVersion || current < minVersion)
            || announcement.MaxVersion is { Length: > 0 } max && (TryParseVersion(max) is not { } maxVersion || current > maxVersion))
        {
            return false;
        }

        if (announcement.Action is { } action
            && (string.IsNullOrWhiteSpace(action.Label) || action.Label.Length > 40
                || !Uri.TryCreate(action.Url, UriKind.Absolute, out var uri) || uri.Scheme != Uri.UriSchemeHttps))
        {
            return false;
        }

        validated = announcement;
        return true;
    }

    private sealed record AnnouncementPayload(
        int SchemaVersion,
        string? Id,
        bool Enabled,
        bool Force,
        string? Title,
        string? Body,
        string? MinVersion,
        string? MaxVersion,
        DateTimeOffset? StartsAt,
        DateTimeOffset? EndsAt,
        AnnouncementAction? Action);

    private sealed record AnnouncementAction(string? Label, string? Url);
}
