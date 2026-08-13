// 游戏启动、进程监控与窗口检测。
// 由 MainWindow.xaml.cs 按职责拆分(partial class),行为不变。
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Windows;

namespace ChunithmLauncher;

public partial class MainWindow
{
    private async Task LaunchGameAsync()
    {
        if (_isLaunching)
        {
            Log("启动被忽略:上一次启动流程尚未结束");
            return;
        }

        if (string.IsNullOrWhiteSpace(_startBatPath) || !File.Exists(_startBatPath))
        {
            Log("启动被忽略:start.bat 无效");
            SetStatus("start.bat 无效", "#ff5a6a");
            return;
        }

        var title = string.IsNullOrWhiteSpace(_gameWindowTitle) ? DefaultGameWindowTitle : _gameWindowTitle;
        if (FindWindow(null, title) != IntPtr.Zero)
        {
            Log("启动被忽略:检测到游戏窗口已存在");
            SetStatus("游戏已在运行", "#7dffa0");
            return;
        }

        _isLaunching = true;
        Log("开始启动游戏");

        // 清理残留的 amdaemon(AppleChu 守护进程)。上次游戏若异常退出,amdaemon 会残留,
        // 导致下次启动时 amdaemon 端口/实例冲突,游戏闪退。启动前先杀掉残留。
        await TerminateAmdaemonAsync();

        if (_terminateCmdBeforeLaunch)
        {
            SetStatus("正在关闭现有 CMD...", "#ffb36a");
            Log("清理残留 CMD");
            if (!await TerminateAllCommandPromptsAsync())
            {
                Log("清理残留 CMD 失败,中止启动");
                SetStatus("无法关闭全部 CMD，启动失败", "#ff5a6a");
                _isLaunching = false;
                System.Windows.MessageBox.Show(
                    "无法关闭系统中现有的 CMD 进程，游戏未启动。请手动关闭 CMD 后重试。",
                    "启动失败",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return;
            }
        }

        var deviceName = ResolveDisplayDeviceName();
        if (deviceName is null)
        {
            SetStatus("未找到显示器", "#ff5a6a");
            _isLaunching = false;
            return;
        }

        _ = DisplayModeHelper.TryGetCurrentMode(deviceName, out _, out var currentStruct);
        _originalMode = currentStruct;
        List<DisplayModeHelper.DisplayState>? originalDisplayStates = null;

        if (_smartDisplayEnabled)
        {
            originalDisplayStates = DisplayModeHelper.CaptureCurrentDisplayStates();
            if (originalDisplayStates.Count == 0)
            {
                originalDisplayStates = null;
                SetStatus("独占显示器：读取当前显示配置失败", "#ffb36a");
            }
            else
            {
                var primaryToApply = deviceName;
                SetStatus("独占显示器：正在关闭其他显示器...", "#5ee7ff");
                if (!DisplayModeHelper.TryApplyPrimaryOnly(primaryToApply))
                {
                    await RestoreDisplayStatesWithFallback(originalDisplayStates);
                    SetStatus("独占显示器：切换失败，继续启动", "#ffb36a");
                    originalDisplayStates = null;
                }
                else
                {
                    await Task.Delay(1200);
                    if (!DisplayModeHelper.TryGetCurrentMode(deviceName, out _, out currentStruct))
                    {
                        await RestoreDisplayStatesWithFallback(originalDisplayStates);
                        SetStatus("独占显示器：目标显示器被关闭，已恢复布局", "#ff5a6a");
                        _isLaunching = false;
                        return;
                    }

                    _originalMode = currentStruct;
                    DetectDisplays();
                    SendInit();
                }
            }
        }

        if (_launchMode == "smart")
        {
            if (!DisplayMode.TryParse(_targetMode, out var target))
            {
                SetStatus("目标分辨率格式错误", "#ff5a6a");
                if (originalDisplayStates is not null)
                {
                    await RestoreDisplayStatesWithFallback(originalDisplayStates);
                }
                _isLaunching = false;
                return;
            }

            SetStatus("正在切换分辨率...", "#5ee7ff");
            Log($"切换分辨率到 {target}");
            if (!DisplayModeHelper.TrySetMode(deviceName, target))
            {
                Log("切换分辨率失败");
                SetStatus("切换分辨率失败", "#ff5a6a");
                ShowResolutionSwitchFailedDialog();
                if (originalDisplayStates is not null)
                {
                    await RestoreDisplayStatesWithFallback(originalDisplayStates);
                }
                _isLaunching = false;
                return;
            }

            SetStatus("分辨率已切换，3秒后启动游戏...", "#5ee7ff");
            await Task.Delay(3000);
        }

        try
        {
            SetStatus("游戏启动中...", "#5ee7ff");
            Log($"启动游戏命令: {_startBatPath}");
            var psi = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                // /d disables cmd AutoRun hooks; /s /c call runs the selected
                // batch as its own command and is independent of other CMDs.
                Arguments = $"/d /s /c call \"{_startBatPath}\"",
                UseShellExecute = true,
                WindowStyle = ProcessWindowStyle.Hidden,
                WorkingDirectory = Path.GetDirectoryName(_startBatPath),
            };

            if (_runBatAsAdministrator)
            {
                psi.Verb = "runas";
            }

            _gameCommandProcess = Process.Start(psi);
            if (_gameCommandProcess is not null)
            {
                _ = MonitorGameCommandAsync(_gameCommandProcess);
            }
        }
        catch (Exception ex)
        {
            Log("启动游戏失败", ex);
            SetStatus("启动失败", "#ff5a6a");
            if (originalDisplayStates is not null)
            {
                await RestoreDisplayStatesWithFallback(originalDisplayStates);
            }
            _isLaunching = false;
            return;
        }

        if (_launchMode == "smart")
        {
            SetStatus("等待游戏窗口...", "#5ee7ff");
            Log("等待游戏窗口,同时监控启动命令进程");
            // 同时等待"游戏窗口出现"和"启动命令进程退出":若命令进程先退出而窗口未出现,
            // 说明游戏启动失败(如 chusanApp 闪退),立即恢复分辨率并重置状态,
            // 而不是干等到 60 秒超时——这样用户能马上重试,分辨率也不会一直卡在切换后。
            var windowTask = WaitForWindowAsync(title, TimeSpan.FromSeconds(10));
            var cmdExitTask = _gameCommandProcess is null
                ? Task.Delay(Timeout.Infinite)
                : WaitForCommandProcessExitAsync(_gameCommandProcess);

            if (await Task.WhenAny(windowTask, cmdExitTask) == cmdExitTask)
            {
                Log("游戏启动失败:启动命令进程已退出,恢复分辨率");
                SetStatus("游戏启动失败", "#ff5a6a");
                await RestoreOriginalAsync();
                if (originalDisplayStates is not null)
                {
                    await RestoreDisplayStatesWithFallback(originalDisplayStates);
                }

                _isLaunching = false;
                _gameCommandProcess = null;
                return;
            }

            var windowFound = await windowTask;
            if (windowFound == IntPtr.Zero)
            {
                Log("未检测到游戏窗口(等待超时),恢复分辨率");
                SetStatus("未检测到游戏窗口", "#ff5a6a");
                await RestoreOriginalAsync();
                if (originalDisplayStates is not null)
                {
                    await RestoreDisplayStatesWithFallback(originalDisplayStates);
                }
                _isLaunching = false;
                return;
            }

            SetStatus("游戏运行中...", "#7dffa0");
            Log("游戏窗口出现,游戏运行中");
            await WaitForGameExitAsync(windowFound, title);
            await RestoreOriginalAsync();
            if (originalDisplayStates is not null)
            {
                await RestoreDisplayStatesWithFallback(originalDisplayStates);
            }
        }
        else if (originalDisplayStates is not null)
        {
            _ = RestoreDisplayStatesAfterGameExitAsync(title, originalDisplayStates);
        }

        if (_launchMode != "smart" && _gameCommandProcess is not null)
        {
            await WaitForCommandProcessExitAsync(_gameCommandProcess);
            if (originalDisplayStates is not null)
            {
                await RestoreDisplayStatesWithFallback(originalDisplayStates);
            }
        }

        _isLaunching = false;
        _gameCommandProcess = null;
    }

    private static async Task TerminateAmdaemonAsync()
    {
        try
        {
            foreach (var process in Process.GetProcessesByName("amdaemon"))
            {
                try
                {
                    if (!process.HasExited)
                    {
                        process.Kill(entireProcessTree: true);
                    }

                    await process.WaitForExitAsync();
                }
                catch
                {
                    // 单个残留进程清理失败时继续处理其余进程。
                }
                finally
                {
                    process.Dispose();
                }
            }
        }
        catch (Exception ex)
        {
            Log("关闭残留 amdaemon 失败", ex);
        }
    }

    private static async Task<bool> TerminateAllCommandPromptsAsync()
    {
        try
        {
            var processes = Process.GetProcessesByName("cmd");
            foreach (var process in processes)
            {
                try
                {
                    if (!process.HasExited)
                    {
                        process.Kill(entireProcessTree: true);
                    }

                    await process.WaitForExitAsync();
                }
                catch
                {
                    return false;
                }
                finally
                {
                    process.Dispose();
                }
            }

            return Process.GetProcessesByName("cmd").Length == 0;
        }
        catch (Exception ex)
        {
            Log("关闭残留 CMD 失败", ex);
            return false;
        }
    }

    private static async Task WaitForCommandProcessExitAsync(Process process)
    {
        while (true)
        {
            try
            {
                if (process.HasExited) return;
            }
            catch
            {
                return;
            }

            await Task.Delay(500);
        }
    }

    private async Task MonitorGameCommandAsync(Process process)
    {
        await WaitForCommandProcessExitAsync(process);
        if (ReferenceEquals(_gameCommandProcess, process))
        {
            _gameCommandProcess = null;
        }
    }

    private async Task RestoreDisplayStatesAfterGameExitAsync(string title, IReadOnlyCollection<DisplayModeHelper.DisplayState> states)
    {
        var windowFound = await WaitForWindowAsync(title, TimeSpan.FromSeconds(180));
        if (windowFound != IntPtr.Zero)
        {
            await WaitForGameExitAsync(windowFound, title);
        }

        await RestoreDisplayStatesWithFallback(states);
    }

    private static async Task<IntPtr> WaitForWindowAsync(string title, TimeSpan timeout)
    {
        var end = DateTime.UtcNow + timeout;
        while (DateTime.UtcNow < end)
        {
            var handle = FindWindow(null, title);
            if (handle != IntPtr.Zero)
            {
                return handle;
            }

            await Task.Delay(500);
        }

        return IntPtr.Zero;
    }

    private static async Task WaitForWindowCloseAsync(string title, TimeSpan missingGracePeriod)
    {
        DateTime? missingSince = null;

        while (true)
        {
            var handle = FindWindow(null, title);
            if (handle != IntPtr.Zero)
            {
                missingSince = null;
                await Task.Delay(1000);
                continue;
            }

            missingSince ??= DateTime.UtcNow;
            if (DateTime.UtcNow - missingSince.Value >= missingGracePeriod)
            {
                return;
            }

            await Task.Delay(1000);
        }
    }

    private static async Task WaitForGameExitAsync(IntPtr windowHandle, string title)
    {
        if (TryGetProcessIdFromWindow(windowHandle, out var processId))
        {
            try
            {
                using var process = Process.GetProcessById(processId);
                while (!process.HasExited)
                {
                    await Task.Delay(1000);
                }

                return;
            }
            catch
            {
                // fallback to window-title based detection
            }
        }

        await WaitForWindowCloseAsync(title, TimeSpan.FromSeconds(8));
    }

    private static bool TryGetProcessIdFromWindow(IntPtr windowHandle, out int processId)
    {
        processId = 0;
        if (windowHandle == IntPtr.Zero)
        {
            return false;
        }

        _ = GetWindowThreadProcessId(windowHandle, out var pid);
        if (pid == 0)
        {
            return false;
        }

        processId = (int)pid;
        return true;
    }

    [DllImport("user32.dll", CharSet = CharSet.Auto)]
    private static extern IntPtr FindWindow(string? lpClassName, string? lpWindowName);

    [DllImport("user32.dll")]
    private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
}
