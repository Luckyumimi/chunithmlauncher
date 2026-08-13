// 窗口背景/亚克力视觉效果。
// 由 MainWindow.xaml.cs 按职责拆分(partial class),行为不变。
using System.Runtime.InteropServices;
using System.Windows.Interop;

namespace ChunithmLauncher;

public partial class MainWindow
{
    [DllImport("dwmapi.dll")]
    private static extern int DwmSetWindowAttribute(IntPtr hwnd, int dwAttribute, ref int pvAttribute, int cbAttribute);

    [DllImport("user32.dll")]
    private static extern int SetWindowCompositionAttribute(IntPtr hwnd, ref WindowCompositionAttributeData data);

    private void ApplyWindowBackdrop()
    {
        try
        {
            var hwnd = new WindowInteropHelper(this).Handle;
            if (hwnd == IntPtr.Zero)
            {
                return;
            }

            const int DwmwaUseImmersiveDarkMode = 20;
            const int DwmwaSystemBackdropType = 38;
            const int DwmsbtMainWindow = 2;
            const int DwmsbtTransientWindow = 3;

            var dark = 1;
            _ = DwmSetWindowAttribute(hwnd, DwmwaUseImmersiveDarkMode, ref dark, sizeof(int));

            var backdropType = DwmsbtTransientWindow;
            var hr = DwmSetWindowAttribute(hwnd, DwmwaSystemBackdropType, ref backdropType, sizeof(int));
            if (hr != 0)
            {
                backdropType = DwmsbtMainWindow;
                var fallbackHr = DwmSetWindowAttribute(hwnd, DwmwaSystemBackdropType, ref backdropType, sizeof(int));
                if (fallbackHr != 0)
                {
                    ApplyLegacyAcrylic(hwnd);
                }
            }
        }
        catch
        {
            try
            {
                var hwnd = new WindowInteropHelper(this).Handle;
                if (hwnd != IntPtr.Zero)
                {
                    ApplyLegacyAcrylic(hwnd);
                }
            }
            catch
            {
                // best effort on unsupported systems
            }
        }
    }

    private static void ApplyLegacyAcrylic(IntPtr hwnd)
    {
        const int WcaAccentPolicy = 19;
        const int AccentEnableAcrylicBlurBehind = 4;
        const int DrawAllBorders = 0x20 | 0x40 | 0x80 | 0x100;

        // ARGB in AABBGGRR, tuned for dark acrylic.
        var accent = new AccentPolicy
        {
            AccentState = AccentEnableAcrylicBlurBehind,
            AccentFlags = DrawAllBorders,
            GradientColor = unchecked((int)0x88363A30),
            AnimationId = 0,
        };

        var accentSize = Marshal.SizeOf(accent);
        var accentPtr = Marshal.AllocHGlobal(accentSize);
        try
        {
            Marshal.StructureToPtr(accent, accentPtr, false);
            var data = new WindowCompositionAttributeData
            {
                Attribute = WcaAccentPolicy,
                Data = accentPtr,
                SizeOfData = accentSize,
            };
            _ = SetWindowCompositionAttribute(hwnd, ref data);
        }
        finally
        {
            Marshal.FreeHGlobal(accentPtr);
        }
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct AccentPolicy
    {
        public int AccentState;
        public int AccentFlags;
        public int GradientColor;
        public int AnimationId;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct WindowCompositionAttributeData
    {
        public int Attribute;
        public IntPtr Data;
        public int SizeOfData;
    }
}
