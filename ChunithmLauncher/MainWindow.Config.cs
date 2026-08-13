// 配置加载/持久化。
// 由 MainWindow.xaml.cs 按职责拆分(partial class),行为不变。
using System.IO;
using System.Text.Json;

namespace ChunithmLauncher;

public partial class MainWindow
{
    private static readonly object LogLock = new();

    /// <summary>写入极简日志到程序运行目录下的 logs\,失败时静默。</summary>
    private static void Log(string message, Exception? ex = null)
    {
        try
        {
            var root = Path.Combine(AppContext.BaseDirectory, "logs");
            Directory.CreateDirectory(root);
            var path = Path.Combine(root, $"launcher-{DateTime.Now:yyyyMMdd}.log");
            var line = $"{DateTime.Now:yyyy-MM-dd HH:mm:ss} {message}{(ex is null ? string.Empty : " | " + ex)}";
            lock (LogLock)
            {
                File.AppendAllText(path, line + Environment.NewLine);
            }
        }
        catch
        {
            // 日志写入失败时静默,不影响主流程。
        }
    }

    private void LoadConfig()
    {
        try
        {
            var path = GetConfigPath();
            if (File.Exists(path))
            {
                var json = File.ReadAllText(path);
                _config = JsonSerializer.Deserialize<Config>(json, JsonOptions) ?? new Config();
            }
        }
        catch (Exception ex)
        {
            Log("加载配置失败", ex);
            _config = new Config();
        }
    }

    private void PersistConfig()
    {
        _config.StartBatPath = _startBatPath;
        _config.PrimaryDisplayId = _primaryDisplayId;
        _config.OriginalMode = _originalMode?.ToString();
        _config.TargetMode = _targetMode;
        _config.LaunchMode = _launchMode;
        _config.SmartDisplayEnabled = _smartDisplayEnabled;
        _config.RunBatAsAdministrator = _runBatAsAdministrator;
        _config.TerminateCmdBeforeLaunch = _terminateCmdBeforeLaunch;
        _config.ThemeColor = _themeColor;
        _config.GameWindowTitle = _gameWindowTitle;
        _config.BackgroundImagePath = _backgroundImagePath;

        try
        {
            var path = GetConfigPath();
            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            var json = JsonSerializer.Serialize(_config, JsonOptions);
            File.WriteAllText(path, json);
        }
        catch (Exception ex)
        {
            Log("保存配置失败", ex);
        }
    }

    private void ApplyConfigToState()
    {
        if (!string.IsNullOrWhiteSpace(_config.StartBatPath)) _startBatPath = _config.StartBatPath;
        if (!string.IsNullOrWhiteSpace(_config.PrimaryDisplayId)) _primaryDisplayId = _config.PrimaryDisplayId;
        if (!string.IsNullOrWhiteSpace(_config.OriginalMode)
            && DisplayMode.TryParse(_config.OriginalMode, out var originalMode))
        {
            _originalMode = originalMode;
        }
        if (!string.IsNullOrWhiteSpace(_config.LaunchMode)) _launchMode = _config.LaunchMode;
        _smartDisplayEnabled = _config.SmartDisplayEnabled;
        _runBatAsAdministrator = _config.RunBatAsAdministrator;
        _terminateCmdBeforeLaunch = _config.TerminateCmdBeforeLaunch;
        if (!string.IsNullOrWhiteSpace(_config.ThemeColor)) _themeColor = _config.ThemeColor;
        if (!string.IsNullOrWhiteSpace(_config.GameWindowTitle)) _gameWindowTitle = _config.GameWindowTitle;
        if (!string.IsNullOrWhiteSpace(_config.BackgroundImagePath)) _backgroundImagePath = _config.BackgroundImagePath;
        if (!string.IsNullOrWhiteSpace(_config.TargetMode)) _targetMode = _config.TargetMode;
        else _targetMode = DefaultTargetMode;

        if (!_originalMode.HasValue)
        {
            ReadCurrentMode();
            PersistConfig();
        }
    }

    private static string GetConfigPath()
    {
        var root = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
        return Path.Combine(root, "ChunithmLauncher", "config.json");
    }

    private sealed class Config
    {
        public string? StartBatPath { get; set; }
        public string? PrimaryDisplayId { get; set; }
        public string? OriginalMode { get; set; }
        public string? TargetMode { get; set; }
        public string? LaunchMode { get; set; }
        public bool SmartDisplayEnabled { get; set; }
        public bool RunBatAsAdministrator { get; set; } = true;
        public bool TerminateCmdBeforeLaunch { get; set; } = true;
        public string? ThemeColor { get; set; }
        public string? GameWindowTitle { get; set; }
        public string? BackgroundImagePath { get; set; }
    }
}
