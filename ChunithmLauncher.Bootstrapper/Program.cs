using System.Diagnostics;
using System.Globalization;
using System.Runtime.InteropServices;
using System.Text;

const string AppExeName = "ChunithmLauncher.App.exe";
const string AppDirectoryName = "app";
const string DotnetDesktopRuntimeDownloadUrl = "https://dotnet.microsoft.com/zh-cn/download/dotnet/10.0";

var baseDirectory = AppContext.BaseDirectory;
var appPath = Path.Combine(baseDirectory, AppDirectoryName, AppExeName);

if (!IsDotnetDesktopRuntimeInstalled())
{
    var result = MessageBoxW(
        IntPtr.Zero,
        "未检测到 .NET Desktop Runtime 10。\n\n为精简发布包体积，CHUNITHM Launcher 需要使用系统已安装的 .NET 桌面运行时。\n\n是否现在打开官方下载页？",
        "缺少运行时",
        MessageBoxType.YesNo | MessageBoxType.IconWarning);

    if (result == MessageBoxResult.Yes)
    {
        OpenUrl(DotnetDesktopRuntimeDownloadUrl);
    }

    return;
}

if (!File.Exists(appPath))
{
    MessageBoxW(
        IntPtr.Zero,
        $"未找到主程序：{Path.Combine(AppDirectoryName, AppExeName)}\n\n请重新解压完整发布包后再运行。",
        "启动失败",
        MessageBoxType.Ok | MessageBoxType.IconError);
    return;
}

try
{
    Process.Start(new ProcessStartInfo
    {
        FileName = appPath,
        Arguments = JoinArguments(Environment.GetCommandLineArgs().Skip(1)),
        WorkingDirectory = Path.GetDirectoryName(appPath) ?? baseDirectory,
        UseShellExecute = false,
    });
}
catch (Exception ex)
{
    MessageBoxW(
        IntPtr.Zero,
        $"启动主程序失败：\n{ex.Message}",
        "启动失败",
        MessageBoxType.Ok | MessageBoxType.IconError);
}

static bool IsDotnetDesktopRuntimeInstalled()
{
    return HasRuntimeInProgramFiles(Environment.SpecialFolder.ProgramFiles);
}

static bool HasRuntimeInProgramFiles(Environment.SpecialFolder folder)
{
    var programFiles = Environment.GetFolderPath(folder);
    if (string.IsNullOrWhiteSpace(programFiles))
    {
        return false;
    }

    var runtimeRoot = Path.Combine(programFiles, "dotnet", "shared", "Microsoft.WindowsDesktop.App");
    if (!Directory.Exists(runtimeRoot))
    {
        return false;
    }

    foreach (var versionDirectory in Directory.EnumerateDirectories(runtimeRoot))
    {
        var versionText = Path.GetFileName(versionDirectory);
        if (Version.TryParse(versionText, out var version) && version.Major == 10)
        {
            return true;
        }
    }

    return false;
}

static void OpenUrl(string url)
{
    try
    {
        Process.Start(new ProcessStartInfo
        {
            FileName = url,
            UseShellExecute = true,
        });
    }
    catch
    {
        // The dialog already told the user what is missing.
    }
}

static string JoinArguments(IEnumerable<string> arguments)
{
    return string.Join(" ", arguments.Select(QuoteArgument));
}

static string QuoteArgument(string argument)
{
    if (argument.Length == 0)
    {
        return "\"\"";
    }

    if (!argument.Any(char.IsWhiteSpace) && !argument.Contains('"'))
    {
        return argument;
    }

    var builder = new StringBuilder();
    builder.Append('"');

    var backslashes = 0;
    foreach (var c in argument)
    {
        if (c == '\\')
        {
            backslashes++;
            continue;
        }

        if (c == '"')
        {
            builder.Append('\\', backslashes * 2 + 1);
            builder.Append('"');
            backslashes = 0;
            continue;
        }

        builder.Append('\\', backslashes);
        backslashes = 0;
        builder.Append(c);
    }

    builder.Append('\\', backslashes * 2);
    builder.Append('"');
    return builder.ToString();
}

[DllImport("user32.dll", CharSet = CharSet.Unicode)]
static extern MessageBoxResult MessageBoxW(IntPtr hWnd, string text, string caption, MessageBoxType type);

[Flags]
internal enum MessageBoxType : uint
{
    Ok = 0x00000000,
    YesNo = 0x00000004,
    IconError = 0x00000010,
    IconWarning = 0x00000030,
}

internal enum MessageBoxResult
{
    Yes = 6,
}
