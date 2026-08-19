// UI 消息推送与设置消息处理。
// 由 MainWindow.xaml.cs 按职责拆分(partial class),行为不变。
using System.Text.Json;

namespace ChunithmLauncher;

public partial class MainWindow
{
    /// <summary>save-settings 消息的强类型 payload。</summary>
    private sealed record SettingsPayload(
        string? StartBatPath,
        string? PrimaryDisplay,
        string? OriginalMode,
        string? TargetMode,
        string? LaunchMode,
        bool? SmartDisplayEnabled,
        bool? RunBatAsAdministrator,
        bool? TerminateCmdBeforeLaunch,
        string? ThemeColor,
        string? BackgroundImagePath);

    private sealed record PrimaryDisplayPayload(string? PrimaryDisplay);

    private sealed record PreviewDisplayPayload(string? PrimaryDisplay);

    private sealed record ModePayload(string? Mode);

    private sealed record EnabledPayload(bool? Enabled);

    private sealed record UrlPayload(string? Url);

    /// <summary>把消息 payload 反序列化为强类型;无 payload 或空对象时返回 null。</summary>
    private static T? DeserializePayload<T>(WebMessage message) where T : class
    {
        return message.Payload.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null
            ? null
            : message.Payload.Deserialize<T>(JsonOptions);
    }

    private void ApplySettings(SettingsPayload settings)
    {
        if (settings.StartBatPath is not null)
        {
            _startBatPath = settings.StartBatPath;
        }

        if (settings.PrimaryDisplay is not null)
        {
            _primaryDisplayId = settings.PrimaryDisplay;
            UpdateDisplaySelection();
            _primaryDisplayName = _displays.FirstOrDefault(d => d.Id == _primaryDisplayId)?.Name ?? "未选择";
        }

        if (settings.OriginalMode is not null)
        {
            _originalMode = DisplayMode.TryParse(settings.OriginalMode, out var originalMode) ? originalMode : null;
        }

        if (!string.IsNullOrWhiteSpace(settings.TargetMode))
        {
            _targetMode = settings.TargetMode;
        }

        if (settings.BackgroundImagePath is not null)
        {
            _backgroundImagePath = settings.BackgroundImagePath;
        }

        if (!string.IsNullOrWhiteSpace(settings.LaunchMode))
        {
            _launchMode = settings.LaunchMode;
        }

        if (settings.SmartDisplayEnabled is { } smartDisplayEnabled)
        {
            _smartDisplayEnabled = smartDisplayEnabled;
        }

        if (settings.RunBatAsAdministrator is { } runBatAsAdministrator)
        {
            _runBatAsAdministrator = runBatAsAdministrator;
        }

        if (settings.TerminateCmdBeforeLaunch is { } terminateCmdBeforeLaunch)
        {
            _terminateCmdBeforeLaunch = terminateCmdBeforeLaunch;
        }

        if (!string.IsNullOrWhiteSpace(settings.ThemeColor))
        {
            _themeColor = settings.ThemeColor;
        }
    }

    private void ApplyPrimaryDisplay(PrimaryDisplayPayload payload)
    {
        if (string.IsNullOrWhiteSpace(payload.PrimaryDisplay))
        {
            return;
        }

        _primaryDisplayId = payload.PrimaryDisplay;
        UpdateDisplaySelection();
        _primaryDisplayName = _displays.FirstOrDefault(d => d.Id == _primaryDisplayId)?.Name ?? _primaryDisplayId;
    }

    private void SendInit()
    {
        var payload = new
        {
            startBatPath = _startBatPath ?? string.Empty,
            appleChuEnabled = IsAppleChuEnabled(_startBatPath),
            originalMode = _originalMode?.ToString() ?? string.Empty,
            targetMode = _targetMode,
            launchMode = _launchMode,
            primaryDisplayName = _primaryDisplayName ?? "未选择",
            smartDisplayEnabled = _smartDisplayEnabled,
            runBatAsAdministrator = _runBatAsAdministrator,
            terminateCmdBeforeLaunch = _terminateCmdBeforeLaunch,
            themeColor = _themeColor,
            backgroundImagePath = _backgroundImagePath ?? string.Empty,
            version = GetAppVersion(),
            displays = _displays.Select(d => new { id = d.Id, name = d.Name, selected = d.Selected }).ToArray(),
        };

        PostMessage("init", payload);
    }

    private void SetStatus(string text, string color)
    {
        PostMessage("status", new { text, color });
    }

    private void PostDisplays()
    {
        PostMessage("update-displays", new
        {
            primaryDisplayName = _primaryDisplayName ?? "未选择",
            displays = _displays.Select(d => new { id = d.Id, name = d.Name, selected = d.Selected }).ToArray(),
        });
    }

    private void PostMessage(string type, object payload)
    {
        if (WebView.CoreWebView2 is null)
        {
            return;
        }

        var json = JsonSerializer.Serialize(new { type, payload }, JsonOptions);
        WebView.CoreWebView2.PostWebMessageAsJson(json);
    }
}
