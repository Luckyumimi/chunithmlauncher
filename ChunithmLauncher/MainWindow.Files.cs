// start.bat/背景图选择、segatools.ini 与 AppleChu 文件操作。
// 由 MainWindow.xaml.cs 按职责拆分(partial class),行为不变。
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Windows;

namespace ChunithmLauncher;

public partial class MainWindow
{
    private void PickStartBat(bool previewOnly = false)
    {
        var dialog = new Microsoft.Win32.OpenFileDialog
        {
            Title = "选择批处理文件",
            Filter = "Batch Files|*.bat",
            CheckFileExists = true,
        };

        if (dialog.ShowDialog() == true)
        {
            if (previewOnly)
            {
                PostMessage("update-start-bat", new { path = dialog.FileName, appleChuEnabled = IsAppleChuEnabled(dialog.FileName) });
                SetStatus("已暂存 start.bat，点击“保存设置”后生效", "#ffb36a");
                return;
            }

            _startBatPath = dialog.FileName;
            PersistConfig();
            SetStatus("已选择 start.bat", "#7dffa0");
            SendInit();
        }
    }

    private void PickBackgroundImage(bool previewOnly = false)
    {
        var dialog = new Microsoft.Win32.OpenFileDialog
        {
            Title = "选择背景图片",
            Filter = "Image Files|*.jpg;*.jpeg;*.png;*.bmp;*.webp|All Files|*.*",
            CheckFileExists = true,
        };

        if (dialog.ShowDialog() == true)
        {
            if (previewOnly)
            {
                PostMessage("update-background-image", new { path = dialog.FileName });
                SetStatus("已暂存背景图片，点击“保存设置”后生效", "#ffb36a");
                return;
            }

            _backgroundImagePath = dialog.FileName;
            PersistConfig();
            PostMessage("update-background-image", new { path = _backgroundImagePath });
        }
    }

    private void OpenGameFolder()
    {
        if (string.IsNullOrWhiteSpace(_startBatPath))
        {
            SetStatus("尚未选择 start.bat", "#ff5a6a");
            return;
        }

        var args = $"/select,\"{_startBatPath}\"";
        Process.Start(new ProcessStartInfo("explorer", args) { UseShellExecute = true });
    }

    private void OpenSegatoolsIniInVsCode()
    {
        var iniPath = TryGetSegatoolsIniPath();
        if (iniPath is null)
        {
            return;
        }

        var opened = TryOpenInPreferredEditor(iniPath);
        if (opened)
        {
            SetStatus("已打开 segatools.ini", "#7dffa0");
        }
        else
        {
            System.Windows.MessageBox.Show(
                "你电脑连个可视化编辑器都没有？😅\n赶紧去下一个vscode！！！",
                "缺少编辑器",
                System.Windows.MessageBoxButton.OK,
                System.Windows.MessageBoxImage.Warning);

            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = "https://code.visualstudio.com/",
                    UseShellExecute = true,
                });
            }
            catch
            {
                // ignore browser open failures
            }

            SetStatus("未检测到可用编辑器，已打开 VS Code 下载页", "#ff5a6a");
        }
    }

    private void ApplyRecommendedSegatoolsGfxConfig()
    {
        var iniPath = TryGetSegatoolsIniPath();
        if (iniPath is null)
        {
            return;
        }

        var result = System.Windows.MessageBox.Show(
            "我们建议将segatools的gfx部分更改为\n[gfx]\n\nwindowed=1\n\nframed=0\n\nmonitor=0\n\n需要进行更改吗？",
            "使用推荐配置",
            System.Windows.MessageBoxButton.OKCancel,
            System.Windows.MessageBoxImage.Question);

        if (result != System.Windows.MessageBoxResult.OK)
        {
            return;
        }

        try
        {
            var content = File.ReadAllText(iniPath);
            var updated = ApplyRecommendedGfxSection(content);
            if (string.Equals(content, updated, StringComparison.Ordinal))
            {
                SetStatus("segatools.ini 已是推荐配置", "#7dffa0");
                return;
            }

            File.WriteAllText(iniPath, updated);
            SetStatus("已应用 segatools 推荐配置", "#7dffa0");
        }
        catch
        {
            SetStatus("修改 segatools.ini 失败", "#ff5a6a");
        }
    }

    private string? TryGetSegatoolsIniPath()
    {
        if (string.IsNullOrWhiteSpace(_startBatPath))
        {
            SetStatus("尚未选择 start.bat", "#ff5a6a");
            return null;
        }

        var gameDir = Path.GetDirectoryName(_startBatPath);
        if (string.IsNullOrWhiteSpace(gameDir))
        {
            SetStatus("无法解析游戏目录", "#ff5a6a");
            return null;
        }

        var iniPath = Path.Combine(gameDir, "segatools.ini");
        if (!File.Exists(iniPath))
        {
            SetStatus("未找到 segatools.ini", "#ff5a6a");
            return null;
        }

        return iniPath;
    }

    private static string ApplyRecommendedGfxSection(string content)
    {
        var lines = content.Replace("\r\n", "\n").Replace('\r', '\n').Split('\n').ToList();
        var gfxStart = -1;
        var gfxEnd = lines.Count;

        for (var i = 0; i < lines.Count; i++)
        {
            if (string.Equals(lines[i].Trim(), "[gfx]", StringComparison.OrdinalIgnoreCase))
            {
                gfxStart = i;
                break;
            }
        }

        if (gfxStart < 0)
        {
            if (lines.Count > 0 && !string.IsNullOrWhiteSpace(lines[^1]))
            {
                lines.Add(string.Empty);
            }

            lines.Add("[gfx]");
            lines.Add("windowed=1");
            lines.Add("framed=0");
            lines.Add("monitor=0");
            return string.Join(Environment.NewLine, lines);
        }

        for (var i = gfxStart + 1; i < lines.Count; i++)
        {
            var trimmed = lines[i].Trim();
            if (trimmed.StartsWith("[", StringComparison.Ordinal) && trimmed.EndsWith("]", StringComparison.Ordinal))
            {
                gfxEnd = i;
                break;
            }
        }

        var foundWindowed = false;
        var foundFramed = false;
        var foundMonitor = false;

        for (var i = gfxStart + 1; i < gfxEnd; i++)
        {
            var trimmed = lines[i].Trim();
            if (string.IsNullOrWhiteSpace(trimmed) || trimmed.StartsWith(";", StringComparison.Ordinal))
            {
                continue;
            }

            if (TryMatchIniKey(trimmed, "windowed"))
            {
                lines[i] = ReplaceIniValue(lines[i], "1");
                foundWindowed = true;
                continue;
            }

            if (TryMatchIniKey(trimmed, "framed"))
            {
                lines[i] = ReplaceIniValue(lines[i], "0");
                foundFramed = true;
                continue;
            }

            if (TryMatchIniKey(trimmed, "monitor"))
            {
                lines[i] = ReplaceIniValue(lines[i], "0");
                foundMonitor = true;
            }
        }

        var insertIndex = gfxEnd;
        if (!foundWindowed)
        {
            lines.Insert(insertIndex++, "windowed=1");
        }

        if (!foundFramed)
        {
            lines.Insert(insertIndex++, "framed=0");
        }

        if (!foundMonitor)
        {
            lines.Insert(insertIndex, "monitor=0");
        }

        return string.Join(Environment.NewLine, lines);
    }

    private static bool TryMatchIniKey(string line, string key)
    {
        var equalsIndex = line.IndexOf('=');
        if (equalsIndex <= 0)
        {
            return false;
        }

        var currentKey = line[..equalsIndex].Trim();
        return string.Equals(currentKey, key, StringComparison.OrdinalIgnoreCase);
    }

    private static string ReplaceIniValue(string originalLine, string value)
    {
        var equalsIndex = originalLine.IndexOf('=');
        if (equalsIndex < 0)
        {
            return originalLine;
        }

        return $"{originalLine[..equalsIndex]}={value}";
    }

    private static bool TryOpenInPreferredEditor(string filePath)
    {
        var candidates = new[]
        {
            // VS Code
            "code",
            "code.cmd",
            "code.exe",
            @"C:\Program Files\Microsoft VS Code\Code.exe",
            @"C:\Program Files (x86)\Microsoft VS Code\Code.exe",

            // Notepad++
            "notepad++",
            "notepad++.exe",
            @"C:\Program Files\Notepad++\notepad++.exe",
            @"C:\Program Files (x86)\Notepad++\notepad++.exe",

            // Sublime Text
            "subl",
            "subl.exe",
            "sublime_text",
            "sublime_text.exe",
            @"C:\Program Files\Sublime Text\sublime_text.exe",
            @"C:\Program Files\Sublime Text 3\sublime_text.exe",
            @"C:\Program Files\Sublime Text 4\sublime_text.exe",
        };

        foreach (var candidate in candidates)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = candidate,
                    Arguments = $"\"{filePath}\"",
                    UseShellExecute = true,
                });
                return true;
            }
            catch
            {
                // try next candidate
            }
        }

        return false;
    }

    private void ApplyAppleChuOverlay()
    {
        var result = System.Windows.MessageBox.Show(
            "这会先备份现有游戏文件，再将随启动器附带的 AppleChu 文件覆盖到 bin 目录（包括 chusanApp.exe）。是否继续？",
            "使用 AppleChu",
            MessageBoxButton.OKCancel,
            MessageBoxImage.Warning);
        if (result != MessageBoxResult.OK)
        {
            return;
        }

        if (CopyAppleChuFiles())
        {
            SetStatus("AppleChu 覆盖包已应用", "#7dffa0");
        }
    }

    private void MigrateSegatoolsToAppleChu()
    {
        if (string.IsNullOrWhiteSpace(_startBatPath))
        {
            SetStatus("尚未选择批处理文件", "#ff5a6a");
            return;
        }

        var binDirectory = Path.GetDirectoryName(_startBatPath);
        var segatoolsPath = string.IsNullOrWhiteSpace(binDirectory) ? null : Path.Combine(binDirectory, "segatools.ini");
        if (segatoolsPath is null || !File.Exists(segatoolsPath))
        {
            SetStatus("未找到 segatools.ini", "#ff5a6a");
            return;
        }

        var result = System.Windows.MessageBox.Show(
            "这会备份现有游戏文件、部署 AppleChu，并迁移 segatools.ini 中可识别的显示、DNS、keychip 和 IO DLL 配置。原 segatools.ini 会保留。是否继续？",
            "从segatool迁移至Applechu",
            MessageBoxButton.OKCancel,
            MessageBoxImage.Warning);
        if (result != MessageBoxResult.OK || !CopyAppleChuFiles())
        {
            return;
        }

        try
        {
            var values = ReadIniValues(File.ReadAllText(segatoolsPath));
            var tomlPath = Path.Combine(binDirectory!, "AppleChu.toml");
            var toml = File.ReadAllText(tomlPath);
            CopyIniValue(values, "gfx", "windowed", "Window", "windowed", value => ToTomlBoolean(value));
            CopyIniValue(values, "gfx", "framed", "Window", "framed", value => ToTomlBoolean(value));
            CopyIniValue(values, "gfx", "monitor", "Window", "monitor", value => value);
            CopyIniValue(values, "keychip", "id", "Keychip", "id", ToTomlString);
            CopyIniValue(values, "dns", "default", "Dns", "default", ToTomlString);
            CopyIniValue(values, "dns", "router", "Dns", "router", ToTomlString);
            CopyIniValue(values, "dns", "startup", "Dns", "startup", ToTomlString);
            CopyIniValue(values, "dns", "billing", "Dns", "billing", ToTomlString);
            CopyIniValue(values, "dns", "aimedb", "Dns", "aimedb", ToTomlString);
            CopyIniValue(values, "dns", "title", "Dns", "title", ToTomlString);
            CopyIniValue(values, "chuniio", "path", "ChuniIo", "path", ToTomlString);
            CopyIniValue(values, "aimeio", "path", "AimeIo", "path", ToTomlString);
            File.WriteAllText(tomlPath, toml);

            var backupPath = Path.Combine(GetAppleChuBackupDirectory(), "segatools.ini.bak");
            if (!File.Exists(backupPath))
            {
                File.Copy(segatoolsPath, backupPath);
            }

            // AppleChu's overlay ships its own administrator-aware launcher.
            // After migration, point the launcher at that batch file in the
            // same bin directory instead of leaving the old start.bat path.
            var appleChuStartBat = Path.Combine(binDirectory!, "启动.bat");
            if (File.Exists(appleChuStartBat))
            {
                _startBatPath = appleChuStartBat;
                PersistConfig();
            }

            SetStatus("已迁移 segatools 配置到 AppleChu", "#7dffa0");
            SendInit();
            System.Windows.MessageBox.Show(
                $"已完成迁移。\n\n原游戏文件及 segatools.ini 的备份位于：\n{GetAppleChuBackupDirectory()}\n\n原 segatools.ini 也仍保留在游戏目录中。",
                "迁移完毕",
                MessageBoxButton.OK,
                MessageBoxImage.Information);

            void CopyIniValue(
                Dictionary<string, Dictionary<string, string>> source,
                string iniSection,
                string iniKey,
                string tomlSection,
                string tomlKey,
                Func<string, string> formatValue)
            {
                if (source.TryGetValue(iniSection, out var section) && section.TryGetValue(iniKey, out var value))
                {
                    toml = SetTomlValue(toml, tomlSection, tomlKey, formatValue(value));
                }
            }
        }
        catch
        {
            SetStatus("迁移 segatools 配置失败", "#ff5a6a");
        }
    }

    private void OpenAppleChuEditor()
    {
        if (string.IsNullOrWhiteSpace(_startBatPath))
        {
            SetStatus("尚未选择批处理文件", "#ff5a6a");
            return;
        }

        var binDirectory = Path.GetDirectoryName(_startBatPath);
        var tomlPath = string.IsNullOrWhiteSpace(binDirectory) ? null : Path.Combine(binDirectory, "AppleChu.toml");
        if (tomlPath is null || !File.Exists(tomlPath))
        {
            SetStatus("未找到 AppleChu.toml，请先完成迁移", "#ff5a6a");
            return;
        }

        try
        {
            PostMessage("applechu-config", new { content = File.ReadAllText(tomlPath), path = tomlPath });
        }
        catch
        {
            SetStatus("读取 AppleChu.toml 失败", "#ff5a6a");
        }
    }

    private void SaveAppleChuConfig(ContentPayload payload)
    {
        if (string.IsNullOrWhiteSpace(_startBatPath) || payload.Content is null)
        {
            SetStatus("保存 AppleChu.toml 失败", "#ff5a6a");
            return;
        }

        var binDirectory = Path.GetDirectoryName(_startBatPath);
        var tomlPath = string.IsNullOrWhiteSpace(binDirectory) ? null : Path.Combine(binDirectory, "AppleChu.toml");
        if (tomlPath is null || !File.Exists(tomlPath))
        {
            SetStatus("未找到 AppleChu.toml", "#ff5a6a");
            return;
        }

        try
        {
            var content = SetTomlValue(payload.Content, "BypassAppUser", "enable", "true");
            File.WriteAllText(tomlPath, content);
            SetStatus("AppleChu.toml 已保存", "#7dffa0");
        }
        catch
        {
            SetStatus("保存 AppleChu.toml 失败", "#ff5a6a");
        }
    }

    private bool CopyAppleChuFiles()
    {
        if (string.IsNullOrWhiteSpace(_startBatPath))
        {
            SetStatus("尚未选择批处理文件", "#ff5a6a");
            return false;
        }

        var binDirectory = Path.GetDirectoryName(_startBatPath);
        var sourceDirectory = Path.Combine(AppContext.BaseDirectory, "assets", "AppleChu");
        if (string.IsNullOrWhiteSpace(binDirectory) || !Directory.Exists(sourceDirectory))
        {
            SetStatus("未找到 AppleChu 文件", "#ff5a6a");
            return false;
        }

        if (!File.Exists(Path.Combine(binDirectory, "chusanApp.exe")))
        {
            SetStatus("所选目录未找到 chusanApp.exe", "#ff5a6a");
            return false;
        }

        try
        {
            var backupDirectory = GetAppleChuBackupDirectory();
            Directory.CreateDirectory(backupDirectory);
            foreach (var fileName in new[] { "chusanApp.exe", "winhttp.dll", "winmm.dll" })
            {
                var originalPath = Path.Combine(binDirectory, fileName);
                var backupPath = Path.Combine(backupDirectory, fileName + ".bak");
                if (File.Exists(originalPath) && !File.Exists(backupPath))
                {
                    File.Copy(originalPath, backupPath);
                }
            }

            foreach (var sourceFile in Directory.EnumerateFiles(sourceDirectory, "*", SearchOption.AllDirectories))
            {
                var relativePath = Path.GetRelativePath(sourceDirectory, sourceFile);
                var targetPath = Path.Combine(binDirectory, relativePath);
                var targetDirectory = Path.GetDirectoryName(targetPath);
                if (!string.IsNullOrWhiteSpace(targetDirectory))
                {
                    Directory.CreateDirectory(targetDirectory);
                }

                File.Copy(sourceFile, targetPath, overwrite: true);
            }

            return true;
        }
        catch
        {
            SetStatus("应用 AppleChu 覆盖包失败", "#ff5a6a");
            return false;
        }
    }

    private static Dictionary<string, Dictionary<string, string>> ReadIniValues(string content)
    {
        var values = new Dictionary<string, Dictionary<string, string>>(StringComparer.OrdinalIgnoreCase);
        Dictionary<string, string>? section = null;
        foreach (var rawLine in content.Split('\n'))
        {
            var line = rawLine.Trim();
            if (line.Length == 0 || line.StartsWith(';') || line.StartsWith('#'))
            {
                continue;
            }

            if (line.StartsWith('[') && line.EndsWith(']'))
            {
                var sectionName = line[1..^1].Trim();
                section = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                values[sectionName] = section;
                continue;
            }

            var separator = line.IndexOf('=');
            if (section is not null && separator > 0)
            {
                section[line[..separator].Trim()] = line[(separator + 1)..].Trim();
            }
        }

        return values;
    }

    private static string SetTomlValue(string content, string section, string key, string value)
    {
        var sectionPattern = $"(?ms)^\\[{Regex.Escape(section)}\\]\\s*$.*?(?=^\\[|\\z)";
        var sectionMatch = Regex.Match(content, sectionPattern);
        if (!sectionMatch.Success)
        {
            return content.TrimEnd() + $"{Environment.NewLine}{Environment.NewLine}[{section}]{Environment.NewLine}{key} = {value}{Environment.NewLine}";
        }

        var block = sectionMatch.Value;
        var keyPattern = $"(?m)^\\s*#?\\s*{Regex.Escape(key)}\\s*=.*$";
        var updatedBlock = Regex.IsMatch(block, keyPattern)
            ? Regex.Replace(block, keyPattern, $"{key} = {value}")
            : block.TrimEnd() + $"{Environment.NewLine}{key} = {value}{Environment.NewLine}";
        return content[..sectionMatch.Index] + updatedBlock + content[(sectionMatch.Index + sectionMatch.Length)..];
    }

    private static string ToTomlBoolean(string value)
    {
        return value.Trim().Equals("1", StringComparison.OrdinalIgnoreCase) ||
               value.Trim().Equals("true", StringComparison.OrdinalIgnoreCase) ||
               value.Trim().Equals("on", StringComparison.OrdinalIgnoreCase)
            ? "true"
            : "false";
    }

    private static string ToTomlString(string value) => $"\"{value.Trim().Replace("\\", "\\\\").Replace("\"", "\\\"")}\"";

    private static string GetAppleChuBackupDirectory()
    {
        var launcherDirectory = Directory.GetParent(AppContext.BaseDirectory)?.FullName ?? AppContext.BaseDirectory;
        return Path.Combine(launcherDirectory, "AppleChuBackup");
    }

    private static bool IsAppleChuEnabled(string? startBatPath)
    {
        var gameDirectory = string.IsNullOrWhiteSpace(startBatPath) ? null : Path.GetDirectoryName(startBatPath);
        return !string.IsNullOrWhiteSpace(gameDirectory) && File.Exists(Path.Combine(gameDirectory, "AppleChu.toml"));
    }
}
