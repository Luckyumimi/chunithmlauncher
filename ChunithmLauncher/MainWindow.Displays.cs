// 显示器枚举、分辨率读写与切换、独占/恢复逻辑。
// 由 MainWindow.xaml.cs 按职责拆分(partial class),行为不变。
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using WinForms = System.Windows.Forms;

namespace ChunithmLauncher;

public partial class MainWindow
{
    private void DetectDisplays()
    {
        _displays.Clear();
        var screens = WinForms.Screen.AllScreens;
        var primary = screens.FirstOrDefault(s => s.Primary) ?? screens.FirstOrDefault();

        if (string.IsNullOrWhiteSpace(_primaryDisplayId))
        {
            _primaryDisplayId = primary?.DeviceName;
        }

        _primaryDisplayName = screens.FirstOrDefault(s => s.DeviceName == _primaryDisplayId)?.DeviceName
            ?? primary?.DeviceName
            ?? "未选择";

        foreach (var screen in screens)
        {
            var width = screen.Bounds.Width;
            var height = screen.Bounds.Height;
            if (DisplayModeHelper.TryGetCurrentMode(screen.DeviceName, out _, out var currentMode))
            {
                width = currentMode.Width;
                height = currentMode.Height;
            }

            var label = $"{screen.DeviceName} ({width}×{height})";
            _displays.Add(new DisplayInfo(screen.DeviceName, label, screen.DeviceName == _primaryDisplayId));
        }
    }

    private void UpdateDisplaySelection()
    {
        for (var i = 0; i < _displays.Count; i++)
        {
            var display = _displays[i];
            _displays[i] = display with { Selected = display.Id == _primaryDisplayId };
        }
    }

    private string? ResolveDisplayDeviceName(string? requestedDisplayId = null, bool preferCurrentPrimary = false)
    {
        var screens = WinForms.Screen.AllScreens;

        if (preferCurrentPrimary)
        {
            var currentPrimary = screens.FirstOrDefault(s => s.Primary)?.DeviceName;
            if (!string.IsNullOrWhiteSpace(currentPrimary))
            {
                return currentPrimary;
            }
        }

        if (!string.IsNullOrWhiteSpace(requestedDisplayId))
        {
            var requestedDisplay = screens.FirstOrDefault(s => string.Equals(s.DeviceName, requestedDisplayId, StringComparison.OrdinalIgnoreCase));
            if (requestedDisplay is not null)
            {
                return requestedDisplay.DeviceName;
            }
        }

        if (!string.IsNullOrWhiteSpace(_primaryDisplayId))
        {
            var matchedDisplay = screens.FirstOrDefault(s => string.Equals(s.DeviceName, _primaryDisplayId, StringComparison.OrdinalIgnoreCase));
            if (matchedDisplay is not null)
            {
                return matchedDisplay.DeviceName;
            }
        }

        return WinForms.Screen.PrimaryScreen?.DeviceName;
    }

    private void ReadCurrentMode(bool previewOnly = false, string? requestedDisplayId = null)
    {
        var deviceName = ResolveDisplayDeviceName(requestedDisplayId);
        if (deviceName is null)
        {
            SetStatus("未找到显示器", "#ff5a6a");
            return;
        }

        if (DisplayModeHelper.TryGetCurrentMode(deviceName, out var mode, out var modeStruct))
        {
            if (previewOnly)
            {
                PostMessage("update-original", new { value = mode });
                SetStatus("已暂存当前分辨率，点击“保存设置”后生效", "#ffb36a");
                return;
            }

            _originalMode = modeStruct;
            SetStatus("已读取当前分辨率", "#7dffa0");
        }
        else
        {
            SetStatus("读取分辨率失败", "#ff5a6a");
        }
    }

    private async Task RestoreDisplayStatesWithFallback(IReadOnlyCollection<DisplayModeHelper.DisplayState> states)
    {
        if (!await DisplayModeHelper.TryRestoreDisplayStates(states))
        {
            DisplayModeHelper.TrySwitchToExtendedMode();
            await DisplayModeHelper.TryRestoreDisplayStates(states);
        }

        DetectDisplays();
        SendInit();
        SetStatus("独占显示器：已恢复显示器布局", "#7dffa0");
    }

    private static void ShowResolutionSwitchFailedDialog()
    {
        System.Windows.MessageBox.Show(
            "切换失败！请确认显示器为16:9布局\n请确保显示器支持1080p120hz",
            "分辨率切换失败",
            System.Windows.MessageBoxButton.OK,
            System.Windows.MessageBoxImage.Warning);
    }

    private async Task TestSwitchAsync()
    {
        var deviceName = ResolveDisplayDeviceName();
        if (deviceName is null)
        {
            SetStatus("未找到显示器", "#ff5a6a");
            SetTestSwitchState(false);
            return;
        }

        if (!DisplayMode.TryParse(_targetMode, out var target))
        {
            SetStatus("目标分辨率格式错误", "#ff5a6a");
            SetTestSwitchState(false);
            return;
        }

        _ = DisplayModeHelper.TryGetCurrentMode(deviceName, out _, out var currentStruct);
        _originalMode = currentStruct;

        SetStatus("测试切换中（15秒后自动恢复）...", "#5ee7ff");
        if (!DisplayModeHelper.TrySetMode(deviceName, target))
        {
            SetStatus("切换失败", "#ff5a6a");
            ShowResolutionSwitchFailedDialog();
            SetTestSwitchState(false);
            return;
        }

        SetTestSwitchState(true, 15);
        _ = StartTestSwitchAutoRestoreAsync(15);
    }

    private async Task RestoreOriginalAsync()
    {
        var deviceName = ResolveDisplayDeviceName(preferCurrentPrimary: _smartDisplayEnabled);
        if (deviceName is null)
        {
            SetStatus("未找到显示器", "#ff5a6a");
            return;
        }

        var restore = _originalMode ?? FallbackOriginalMode;

        SetStatus("正在恢复分辨率...", "#5ee7ff");
        await Task.Delay(100);
        if (!DisplayModeHelper.TrySetMode(deviceName, restore))
        {
            SetStatus("恢复失败", "#ff5a6a");
            return;
        }

        _testSwitchCts?.Cancel();
        SetTestSwitchState(false);
        SetStatus("已恢复分辨率", "#7dffa0");
    }

    private void SafeRestoreOnExit()
    {
        try
        {
            _testSwitchCts?.Cancel();
            if (_launchMode == "smart" && _originalMode.HasValue)
            {
                var deviceName = ResolveDisplayDeviceName(preferCurrentPrimary: _smartDisplayEnabled);
                if (deviceName is not null)
                {
                    DisplayModeHelper.TrySetMode(deviceName, _originalMode.Value);
                }
            }
        }
        catch (Exception ex)
        {
            Log("退出时恢复分辨率失败", ex);
        }
    }

    private async Task StartTestSwitchAutoRestoreAsync(int timeoutSeconds)
    {
        _testSwitchCts?.Cancel();
        _testSwitchCts = new CancellationTokenSource();
        var token = _testSwitchCts.Token;

        try
        {
            await Task.Delay(TimeSpan.FromSeconds(timeoutSeconds), token);
        }
        catch (TaskCanceledException)
        {
            return;
        }

        if (token.IsCancellationRequested || !_testSwitchActive)
        {
            return;
        }

        await RestoreOriginalAsync();
    }

    private void SetTestSwitchState(bool active, int timeoutSeconds = 15)
    {
        _testSwitchActive = active;
        PostMessage("test-switch-state", new { active, timeoutSeconds });
    }

    private sealed record DisplayInfo(string Id, string Name, bool Selected);

    private readonly record struct DisplayMode(int Width, int Height, int Frequency)
    {
        private static readonly Regex ModeRegex = new(@"(\d{3,4})\s*[x×]\s*(\d{3,4})(?:\s*@\s*(\d{2,3}))?", RegexOptions.IgnoreCase);

        public static bool TryParse(string input, out DisplayMode mode)
        {
            mode = default;
            if (string.IsNullOrWhiteSpace(input)) return false;

            var match = ModeRegex.Match(input.Replace("Hz", string.Empty, StringComparison.OrdinalIgnoreCase));
            if (!match.Success) return false;

            if (!int.TryParse(match.Groups[1].Value, out var width)) return false;
            if (!int.TryParse(match.Groups[2].Value, out var height)) return false;
            var freq = 60;
            if (match.Groups[3].Success && int.TryParse(match.Groups[3].Value, out var parsed))
            {
                freq = parsed;
            }

            mode = new DisplayMode(width, height, freq);
            return true;
        }

        public override string ToString() => $"{Width}×{Height} @ {Frequency}Hz";
    }

    private static class DisplayModeHelper
    {
        private const int EnumCurrentSettings = -1;
        private const int DispChangeSuccessful = 0;
        private const int DmPelsWidth = 0x80000;
        private const int DmPelsHeight = 0x100000;
        private const int DmDisplayFrequency = 0x400000;
        private const int DmPosition = 0x20;
        private const int CdsUpdateRegistry = 0x00000001;
        private const int CdsNoReset = 0x10000000;
        private const int CdsFullscreen = 0x00000004;
        private const int DisplayDeviceAttachedToDesktop = 0x00000001;

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern bool EnumDisplaySettings(string deviceName, int modeNum, ref DEVMODE devMode);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern bool EnumDisplayDevices(
            string? lpDevice,
            uint iDevNum,
            ref DISPLAY_DEVICE lpDisplayDevice,
            uint dwFlags);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern int ChangeDisplaySettingsEx(
            string lpszDeviceName,
            ref DEVMODE lpDevMode,
            IntPtr hwnd,
            int dwflags,
            IntPtr lParam);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern int ChangeDisplaySettingsEx(
            string? lpszDeviceName,
            IntPtr lpDevMode,
            IntPtr hwnd,
            int dwflags,
            IntPtr lParam);

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
        private struct DISPLAY_DEVICE
        {
            public int cb;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 32)]
            public string DeviceName;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
            public string DeviceString;
            public int StateFlags;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
            public string DeviceID;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
            public string DeviceKey;
        }

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
        private struct DEVMODE
        {
            private const int CchDeviceName = 32;
            private const int CchFormName = 32;

            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = CchDeviceName)]
            public string dmDeviceName;
            public short dmSpecVersion;
            public short dmDriverVersion;
            public short dmSize;
            public short dmDriverExtra;
            public int dmFields;
            public int dmPositionX;
            public int dmPositionY;
            public int dmDisplayOrientation;
            public int dmDisplayFixedOutput;
            public short dmColor;
            public short dmDuplex;
            public short dmYResolution;
            public short dmTTOption;
            public short dmCollate;
            [MarshalAs(UnmanagedType.ByValTStr, SizeConst = CchFormName)]
            public string dmFormName;
            public short dmLogPixels;
            public int dmBitsPerPel;
            public int dmPelsWidth;
            public int dmPelsHeight;
            public int dmDisplayFlags;
            public int dmDisplayFrequency;
            public int dmICMMethod;
            public int dmICMIntent;
            public int dmMediaType;
            public int dmDitherType;
            public int dmReserved1;
            public int dmReserved2;
            public int dmPanningWidth;
            public int dmPanningHeight;
        }

        public readonly record struct DisplayState(
            string DeviceName,
            int PositionX,
            int PositionY,
            int Width,
            int Height,
            int Frequency);

        public static List<DisplayState> CaptureCurrentDisplayStates()
        {
            var states = new List<DisplayState>();
            foreach (var deviceName in EnumerateAttachedDisplayDeviceNames())
            {
                var devMode = new DEVMODE { dmSize = (short)Marshal.SizeOf(typeof(DEVMODE)) };
                if (!EnumDisplaySettings(deviceName, EnumCurrentSettings, ref devMode))
                {
                    continue;
                }

                states.Add(new DisplayState(
                    deviceName,
                    devMode.dmPositionX,
                    devMode.dmPositionY,
                    devMode.dmPelsWidth,
                    devMode.dmPelsHeight,
                    devMode.dmDisplayFrequency > 0 ? devMode.dmDisplayFrequency : 60));
            }

            return states;
        }

        public static bool TryApplyPrimaryOnly(string primaryDisplayId)
        {
            return TryDisableOtherDisplays(primaryDisplayId);
        }

        private static bool TryDisableOtherDisplays(string primaryDisplayId)
        {
            var deviceNames = EnumerateAttachedDisplayDeviceNames();
            if (deviceNames.Count <= 1)
            {
                return true;
            }

            if (!deviceNames.Any(d => string.Equals(d, primaryDisplayId, StringComparison.OrdinalIgnoreCase)))
            {
                return false;
            }

            foreach (var deviceName in deviceNames)
            {
                if (string.Equals(deviceName, primaryDisplayId, StringComparison.OrdinalIgnoreCase))
                {
                    continue;
                }

                var devMode = new DEVMODE { dmSize = (short)Marshal.SizeOf(typeof(DEVMODE)) };
                if (!EnumDisplaySettings(deviceName, EnumCurrentSettings, ref devMode))
                {
                    continue;
                }

                devMode.dmPositionX = 0;
                devMode.dmPositionY = 0;
                devMode.dmPelsWidth = 0;
                devMode.dmPelsHeight = 0;
                devMode.dmFields = DmPosition | DmPelsWidth | DmPelsHeight;

                var result = ChangeDisplaySettingsEx(
                    deviceName,
                    ref devMode,
                    IntPtr.Zero,
                    CdsUpdateRegistry | CdsNoReset,
                    IntPtr.Zero);
                if (result != DispChangeSuccessful)
                {
                    return false;
                }
            }

            return ChangeDisplaySettingsEx(null, IntPtr.Zero, IntPtr.Zero, 0, IntPtr.Zero) == DispChangeSuccessful;
        }

        public static async Task<bool> TryRestoreDisplayStates(IReadOnlyCollection<DisplayState> states)
        {
            TrySwitchToExtendedMode();
            await Task.Delay(1200);

            var knownDeviceNames = EnumerateDisplayDeviceNames();
            var attempted = false;
            foreach (var state in states)
            {
                if (!knownDeviceNames.Any(d => string.Equals(d, state.DeviceName, StringComparison.OrdinalIgnoreCase)))
                {
                    continue;
                }

                var devMode = new DEVMODE
                {
                    dmSize = (short)Marshal.SizeOf(typeof(DEVMODE)),
                    dmPositionX = state.PositionX,
                    dmPositionY = state.PositionY,
                    dmPelsWidth = state.Width,
                    dmPelsHeight = state.Height,
                    dmDisplayFrequency = state.Frequency,
                    dmFields = DmPosition | DmPelsWidth | DmPelsHeight | DmDisplayFrequency,
                };

                var result = ChangeDisplaySettingsEx(
                    state.DeviceName,
                    ref devMode,
                    IntPtr.Zero,
                    CdsUpdateRegistry | CdsNoReset,
                    IntPtr.Zero);
                if (result != DispChangeSuccessful)
                {
                    return false;
                }

                attempted = true;
            }

            return attempted && ChangeDisplaySettingsEx(null, IntPtr.Zero, IntPtr.Zero, 0, IntPtr.Zero) == DispChangeSuccessful;
        }

        private static List<string> EnumerateAttachedDisplayDeviceNames()
        {
            return EnumerateDisplayDeviceNames(attachedOnly: true);
        }

        private static List<string> EnumerateDisplayDeviceNames(bool attachedOnly = false)
        {
            var deviceNames = new List<string>();
            for (uint index = 0; ; index++)
            {
                var displayDevice = new DISPLAY_DEVICE
                {
                    cb = Marshal.SizeOf(typeof(DISPLAY_DEVICE)),
                };

                if (!EnumDisplayDevices(null, index, ref displayDevice, 0))
                {
                    break;
                }

                if (string.IsNullOrWhiteSpace(displayDevice.DeviceName)
                    || (attachedOnly && (displayDevice.StateFlags & DisplayDeviceAttachedToDesktop) == 0))
                {
                    continue;
                }

                deviceNames.Add(displayDevice.DeviceName);
            }

            if (deviceNames.Count == 0)
            {
                deviceNames.AddRange(WinForms.Screen.AllScreens.Select(s => s.DeviceName));
            }

            return deviceNames;
        }

        public static bool TrySwitchToExtendedMode()
        {
            try
            {
                using var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "DisplaySwitch.exe",
                    Arguments = "/extend",
                    UseShellExecute = true,
                    CreateNoWindow = true,
                    WindowStyle = ProcessWindowStyle.Hidden,
                });
                process?.WaitForExit(5000);
                return true;
            }
            catch (Exception ex)
            {
                Log("切换到扩展模式失败", ex);
                return false;
            }
        }

        public static bool TryGetCurrentMode(string deviceName, out string mode, out DisplayMode modeStruct)
        {
            var devMode = new DEVMODE { dmSize = (short)Marshal.SizeOf(typeof(DEVMODE)) };
            if (EnumDisplaySettings(deviceName, EnumCurrentSettings, ref devMode))
            {
                var hz = devMode.dmDisplayFrequency > 0 ? devMode.dmDisplayFrequency : 60;
                modeStruct = new DisplayMode(devMode.dmPelsWidth, devMode.dmPelsHeight, hz);
                mode = modeStruct.ToString();
                return true;
            }

            modeStruct = default;
            mode = string.Empty;
            return false;
        }

        public static bool TrySetMode(string deviceName, DisplayMode mode)
        {
            var devMode = new DEVMODE { dmSize = (short)Marshal.SizeOf(typeof(DEVMODE)) };
            if (!EnumDisplaySettings(deviceName, EnumCurrentSettings, ref devMode))
            {
                return false;
            }

            devMode.dmPelsWidth = mode.Width;
            devMode.dmPelsHeight = mode.Height;
            devMode.dmDisplayFrequency = mode.Frequency;
            devMode.dmFields = DmPelsWidth | DmPelsHeight | DmDisplayFrequency;

            // Persist resolution changes so they survive app focus switches (e.g. Alt+Tab / Win+D).
            var persistentFlags = CdsUpdateRegistry | CdsFullscreen;
            var result = ChangeDisplaySettingsEx(deviceName, ref devMode, IntPtr.Zero, persistentFlags, IntPtr.Zero);
            if (result == DispChangeSuccessful)
            {
                return true;
            }

            // Fallback to temporary apply if persisting fails on some environments.
            result = ChangeDisplaySettingsEx(deviceName, ref devMode, IntPtr.Zero, CdsFullscreen, IntPtr.Zero);
            return result == DispChangeSuccessful;
        }
    }
}
