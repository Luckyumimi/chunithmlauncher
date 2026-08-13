using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Interop;
using Microsoft.Web.WebView2.Core;
using WinForms = System.Windows.Forms;

namespace ChunithmLauncher;

public partial class MainWindow : Window
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true,
    };
    private static readonly HttpClient UpdateHttpClient = CreateUpdateHttpClient();
    private const string GithubRepoHomeUrl = "https://github.com/luckyumimi/chunithmlauncher";
    private const string GithubLatestReleaseApi = "https://api.github.com/repos/luckyumimi/chunithmlauncher/releases/latest";
    private const string GithubLatestReleasePage = "https://github.com/luckyumimi/chunithmlauncher/releases/latest";

    private readonly List<DisplayInfo> _displays = new();
    private string? _primaryDisplayId;
    private string? _primaryDisplayName;
    private string? _startBatPath;
    private DisplayMode? _originalMode;
    private const string DefaultTargetMode = "1920×1080 @ 120Hz";
    private string _targetMode = DefaultTargetMode;
    private string _launchMode = "smart";
    private string _themeColor = "#fdd500";
    private const string DefaultGameWindowTitle = "teaGfx DirectX Release";
    private string _gameWindowTitle = DefaultGameWindowTitle;
    private string? _backgroundImagePath;
    private bool _smartDisplayEnabled;
    private bool _runBatAsAdministrator = true;
    private bool _terminateCmdBeforeLaunch = true;
    private bool _isMuNetPage;

    private Config _config = new();
    private bool _isLaunching;
    private Process? _gameCommandProcess;
    private static readonly DisplayMode FallbackOriginalMode = new(1920, 1080, 60);
    private bool _testSwitchActive;
    private CancellationTokenSource? _testSwitchCts;

    public MainWindow()
    {
        InitializeComponent();
        Loaded += OnLoaded;
        Closing += (_, _) => SafeRestoreOnExit();
    }

    private async void OnLoaded(object sender, RoutedEventArgs e)
    {
        Log("启动器启动");
        if (!EnsureWebView2RuntimeInstalled())
        {
            Close();
            return;
        }

        var userDataFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "ChunithmLauncher",
            "WebView2");
        Directory.CreateDirectory(userDataFolder);
        var webViewEnvironment = await CoreWebView2Environment.CreateAsync(userDataFolder: userDataFolder);

        await WebView.EnsureCoreWebView2Async(webViewEnvironment);
        WebView.CoreWebView2.Settings.AreDefaultContextMenusEnabled = false;
        WebView.CoreWebView2.Settings.AreDevToolsEnabled = false;
        WebView.CoreWebView2.Settings.IsZoomControlEnabled = false;
        WebView.CoreWebView2.WebMessageReceived += OnWebMessageReceived;
        WebView.NavigationCompleted += OnNavigationCompleted;

        LoadConfig();
        DetectDisplays();
        ApplyConfigToState();

        WebView.Source = new Uri(ResolveUiIndexPath());
        ApplyWindowBackdrop();
        _ = CheckForUpdatesOnStartupAsync();
    }

    private bool EnsureWebView2RuntimeInstalled()
    {
        try
        {
            var version = CoreWebView2Environment.GetAvailableBrowserVersionString();
            if (!string.IsNullOrWhiteSpace(version))
            {
                return true;
            }
        }
        catch (Exception ex)
        {
            Log("检测 WebView2 Runtime 失败", ex);
        }

        var result = System.Windows.MessageBox.Show(
            "未检测到 WebView2 Runtime。\n\n为精简项目体积，该运行时需要由用户自行安装。\n\n是否现在打开官方下载页？",
            "缺少运行时",
            System.Windows.MessageBoxButton.YesNo,
            System.Windows.MessageBoxImage.Warning);

        if (result == System.Windows.MessageBoxResult.Yes)
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = "https://developer.microsoft.com/microsoft-edge/webview2/",
                UseShellExecute = true,
            });
        }

        return false;
    }

    private void OnWebMessageReceived(object? sender, CoreWebView2WebMessageReceivedEventArgs e)
    {
        WebMessage? message = null;
        try
        {
            message = JsonSerializer.Deserialize<WebMessage>(e.WebMessageAsJson, JsonOptions);
        }
        catch (Exception ex)
        {
            Log("消息解析失败", ex);
            SetStatus("消息解析失败", "#ff5a6a");
            return;
        }

        if (message?.Type is null)
        {
            return;
        }

        switch (message.Type)
        {
            case "pick-start-bat":
                PickStartBat();
                break;
            case "detect-displays":
                DetectDisplays();
                PersistConfig();
                SendInit();
                break;
            case "read-current-mode":
                ReadCurrentMode();
                PersistConfig();
                SendInit();
                break;
            case "reset-target":
                _targetMode = DefaultTargetMode;
                PersistConfig();
                SendInit();
                break;
            case "save-settings":
                if (DeserializePayload<SettingsPayload>(message) is { } settings)
                {
                    ApplySettings(settings);
                    PersistConfig();
                    SetStatus("设置已保存并生效", "#7dffa0");
                    SendInit();
                }

                break;
            case "set-primary-display":
                if (DeserializePayload<PrimaryDisplayPayload>(message) is { } primaryDisplay)
                {
                    ApplyPrimaryDisplay(primaryDisplay);
                    PersistConfig();
                    SetStatus("主显示器已保存", "#7dffa0");
                    PostDisplays();
                }

                break;
            case "pick-start-bat-preview":
                PickStartBat(previewOnly: true);
                break;
            case "pick-background-image-preview":
                PickBackgroundImage(previewOnly: true);
                break;
            case "detect-displays-preview":
                DetectDisplays();
                PostDisplays();
                break;
            case "read-current-mode-preview":
                ReadCurrentMode(
                    previewOnly: true,
                    requestedDisplayId: DeserializePayload<PreviewDisplayPayload>(message)?.PrimaryDisplay);
                break;
            case "test-switch":
                _ = TestSwitchAsync();
                break;
            case "restore-original":
                _ = RestoreOriginalAsync();
                break;
            case "launch-game":
                _ = LaunchGameAsync();
                break;
            case "open-game-folder":
                OpenGameFolder();
                break;
            case "open-segatools-ini":
                OpenSegatoolsIniInVsCode();
                break;
            case "apply-recommended-segatools-gfx":
                ApplyRecommendedSegatoolsGfxConfig();
                break;
            case "apply-applechu":
                ApplyAppleChuOverlay();
                break;
            case "migrate-segatools-to-applechu":
                MigrateSegatoolsToAppleChu();
                break;
            case "open-applechu-editor":
                OpenAppleChuEditor();
                break;
            case "save-applechu-config":
                if (DeserializePayload<ContentPayload>(message) is { } appleChuConfig)
                {
                    SaveAppleChuConfig(appleChuConfig);
                }

                break;
            case "check-update":
                _ = CheckForUpdatesAsync();
                break;
            case "open-github-home":
                OpenGithubHomePage();
                break;
            case "open-munet":
                if (DeserializePayload<UrlPayload>(message) is { } urlPayload)
                {
                    OpenMuNetPage(urlPayload);
                }

                break;
            case "return-to-launcher":
                ReturnToLauncher();
                break;
            case "set-launch-mode":
                if (DeserializePayload<ModePayload>(message) is { } launchModePayload)
                {
                    _launchMode = launchModePayload.Mode ?? "smart";
                    PersistConfig();
                }

                break;
            case "set-smart-display":
                if (DeserializePayload<EnabledPayload>(message) is { Enabled: { } enabled })
                {
                    _smartDisplayEnabled = enabled;
                    PersistConfig();
                }

                break;
            case "pick-background-image":
                PickBackgroundImage(previewOnly: true);
                break;
        }
    }

    private string ResolveUiIndexPath()
    {
        var output = Path.Combine(AppContext.BaseDirectory, "ui", "index.html");
        if (File.Exists(output))
        {
            return output;
        }

        // 开发环境回退:dotnet run / IDE 调试时 BaseDirectory 位于
        // bin\<Configuration>\net10.0-windows\,向上 4 级(..\..\..\..)即回到仓库根,
        // 直接读取 ui\ 源文件。该相对路径依赖开发目录结构,仅开发环境有效;
        // 发布包中 ui\ 已随程序复制到输出目录,上面的分支会先命中,不会走到这里。
        var fallback = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", "ui", "index.html"));
        return fallback;
    }

    private static string GetAppVersion()
    {
        var version = typeof(MainWindow).Assembly.GetName().Version;
        if (version is null)
        {
            return "0.0.0";
        }

        return $"{version.Major}.{version.Minor}.{version.Build}";
    }

    private sealed record WebMessage(string? Type, JsonElement Payload);

}
