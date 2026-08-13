// GitHub 更新检查。
// 由 MainWindow.xaml.cs 按职责拆分(partial class),行为不变。
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace ChunithmLauncher;

public partial class MainWindow
{
    private async Task CheckForUpdatesAsync()
    {
        SetStatus("正在检查更新...", "#5ee7ff");

        LatestReleaseInfo latestRelease;
        try
        {
            latestRelease = await FetchLatestReleaseAsync();
        }
        catch (Exception ex)
        {
            SetStatus("检查更新失败", "#ff5a6a");
            System.Windows.MessageBox.Show(
                $"{ex.Message}\n中国内地网络环境下可能无法正常访问 GitHub API，请检查网络环境后重试。",
                "检查更新",
                System.Windows.MessageBoxButton.OK,
                System.Windows.MessageBoxImage.Warning);
            return;
        }

        var currentVersion = TryParseVersion(GetAppVersion());
        var latestVersion = TryParseVersion(latestRelease.Tag);
        if (currentVersion is null || latestVersion is null)
        {
            SetStatus("版本解析失败", "#ff5a6a");
            System.Windows.MessageBox.Show(
                "检查到的版本信息无效。",
                "检查更新",
                System.Windows.MessageBoxButton.OK,
                System.Windows.MessageBoxImage.Warning);
            return;
        }

        if (latestVersion <= currentVersion)
        {
            SetStatus("当前已是最新版本", "#7dffa0");
            System.Windows.MessageBox.Show(
                "已经是最新版本！",
                "检查更新",
                System.Windows.MessageBoxButton.OK,
                System.Windows.MessageBoxImage.Information);
            return;
        }

        if (!ShowUpdateAvailableDialog(latestVersion, latestRelease.ReleaseUrl))
        {
            SetStatus("已取消前往更新页面", "#ffb36a");
            return;
        }

        SetStatus($"已打开 v{latestVersion} 发布页面", "#7dffa0");
    }

    private async Task CheckForUpdatesOnStartupAsync()
    {
        const int maxRetryCount = 3;

        for (var retry = 0; retry <= maxRetryCount; retry++)
        {
            try
            {
                var latestRelease = await FetchLatestReleaseAsync();
                var currentVersion = TryParseVersion(GetAppVersion());
                var latestVersion = TryParseVersion(latestRelease.Tag);
                if (currentVersion is null || latestVersion is null)
                {
                    throw new InvalidOperationException("版本解析失败。");
                }

                if (latestVersion > currentVersion)
                {
                    ShowUpdateAvailableDialog(latestVersion, latestRelease.ReleaseUrl);
                }

                return;
            }
            catch (Exception ex)
            {
                if (retry >= maxRetryCount)
                {
                    Log("启动时检查更新失败", ex);
                    return;
                }

                await Task.Delay(TimeSpan.FromSeconds(3));
            }
        }
    }

    private static async Task<LatestReleaseInfo> FetchLatestReleaseAsync()
    {
        using var response = await UpdateHttpClient.GetAsync(GithubLatestReleaseApi);
        if (!response.IsSuccessStatusCode)
        {
            if (response.StatusCode == HttpStatusCode.Forbidden)
            {
                return await FetchLatestReleaseFromPageAsync();
            }

            throw new InvalidOperationException($"检查更新失败：HTTP {(int)response.StatusCode}");
        }

        await using var stream = await response.Content.ReadAsStreamAsync();
        using var json = await JsonDocument.ParseAsync(stream);
        var root = json.RootElement;
        var latestTag = root.TryGetProperty("tag_name", out var tagElement)
            ? tagElement.GetString()
            : null;

        if (string.IsNullOrWhiteSpace(latestTag))
        {
            throw new InvalidOperationException("检查到的版本信息无效。");
        }

        var latestReleaseUrl = root.TryGetProperty("html_url", out var htmlUrlElement)
            ? htmlUrlElement.GetString() ?? GithubLatestReleasePage
            : GithubLatestReleasePage;

        return new LatestReleaseInfo(latestTag, latestReleaseUrl);
    }

    private static async Task<LatestReleaseInfo> FetchLatestReleaseFromPageAsync()
    {
        using var response = await UpdateHttpClient.GetAsync(GithubLatestReleasePage);
        if (!response.IsSuccessStatusCode)
        {
            throw new InvalidOperationException($"检查更新失败：HTTP {(int)response.StatusCode}");
        }

        var finalUri = response.RequestMessage?.RequestUri;
        var tagMarker = "/releases/tag/";
        var finalPath = finalUri?.AbsolutePath ?? string.Empty;
        var tagIndex = finalPath.IndexOf(tagMarker, StringComparison.OrdinalIgnoreCase);
        if (tagIndex >= 0)
        {
            var tag = Uri.UnescapeDataString(finalPath[(tagIndex + tagMarker.Length)..].Trim('/'));
            if (!string.IsNullOrWhiteSpace(tag))
            {
                return new LatestReleaseInfo(tag, finalUri!.AbsoluteUri);
            }
        }

        var html = await response.Content.ReadAsStringAsync();
        var match = Regex.Match(
            html,
            @"/luckyumimi/chunithmlauncher/releases/tag/([^""'<>\s]+)",
            RegexOptions.IgnoreCase);
        if (match.Success)
        {
            var tag = Uri.UnescapeDataString(match.Groups[1].Value);
            return new LatestReleaseInfo(tag, $"{GithubRepoHomeUrl}/releases/tag/{Uri.EscapeDataString(tag)}");
        }

        throw new InvalidOperationException("无法从 GitHub Releases 页面读取版本信息。");
    }

    private static bool ShowUpdateAvailableDialog(Version latestVersion, string latestReleaseUrl)
    {
        var result = System.Windows.MessageBox.Show(
            $"发现新版本：v{latestVersion}，是否前往更新？",
            "发现新版本",
            System.Windows.MessageBoxButton.YesNo,
            System.Windows.MessageBoxImage.Question);

        if (result != System.Windows.MessageBoxResult.Yes)
        {
            return false;
        }

        return TryOpenUrl(latestReleaseUrl);
    }

    private void OpenGithubHomePage()
    {
        const string url = GithubRepoHomeUrl;
        if (TryOpenUrl(url))
        {
            SetStatus("已打开 GitHub 主页", "#7dffa0");
            return;
        }

        SetStatus("打开 GitHub 主页失败", "#ff5a6a");
    }

    private static bool TryOpenUrl(string url)
    {
        try
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = url,
                UseShellExecute = true,
            });
            return true;
        }
        catch
        {
            return false;
        }
    }

    private static HttpClient CreateUpdateHttpClient()
    {
        var handler = new HttpClientHandler
        {
            UseProxy = true,
            Proxy = WebRequest.DefaultWebProxy,
            DefaultProxyCredentials = CredentialCache.DefaultCredentials,
            AutomaticDecompression = DecompressionMethods.All,
        };
        var client = new HttpClient(handler);
        client.Timeout = TimeSpan.FromSeconds(15);
        client.DefaultRequestHeaders.UserAgent.ParseAdd("ChunithmLauncher/1.0");
        client.DefaultRequestHeaders.Accept.ParseAdd("application/vnd.github+json");
        return client;
    }

    private static Version? TryParseVersion(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
        {
            return null;
        }

        var cleaned = raw.Trim();
        if (cleaned.StartsWith("v", StringComparison.OrdinalIgnoreCase))
        {
            cleaned = cleaned[1..];
        }

        var plusIndex = cleaned.IndexOf('+');
        if (plusIndex >= 0)
        {
            cleaned = cleaned[..plusIndex];
        }

        return Version.TryParse(cleaned, out var version) ? version : null;
    }

    private sealed record LatestReleaseInfo(string Tag, string ReleaseUrl);
}
