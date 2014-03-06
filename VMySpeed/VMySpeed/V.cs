using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Windows.Forms;

class V
{
    public static IDictionary<IntPtr, string> GetOpenWindows(bool includeHidden)
    {
        IntPtr lShellWindow = GetShellWindow();
        Dictionary<IntPtr, string> lWindows = new Dictionary<IntPtr, string>();

        EnumWindows(delegate(IntPtr IntPtr, int lParam)
        {
            if (IntPtr == lShellWindow) return true;
            if (!includeHidden && !IsWindowVisible(IntPtr)) return true;

            int lLength = GetWindowTextLength(IntPtr);
            if (lLength == 0) return true;

            StringBuilder lBuilder = new StringBuilder(lLength);
            GetWindowText(IntPtr, lBuilder, lLength + 1);

            lWindows[IntPtr] = lBuilder.ToString();
            return true;

        }, 0);

        return lWindows;
    }
    delegate bool EnumWindowsProc(IntPtr IntPtr, int lParam);
    [DllImport("USER32.DLL")] static extern bool EnumWindows(EnumWindowsProc enumFunc, int lParam);
    [DllImport("USER32.DLL")] static extern int GetWindowText(IntPtr IntPtr, StringBuilder lpString, int nMaxCount);
    [DllImport("USER32.DLL")] static extern int GetWindowTextLength(IntPtr IntPtr);
    [DllImport("USER32.DLL")] static extern bool IsWindowVisible(IntPtr IntPtr);
    [DllImport("USER32.DLL")] static extern IntPtr GetShellWindow();

    [DllImport("USER32.DLL")] public static extern bool SetForegroundWindow(IntPtr hWnd);

    public const int BM_CLICK = 0x00F5;
    public const int MOUSEDOWN = 0x201;
    public const int MOUSEUP = 0x202;
    [DllImport("user32.dll", CharSet = CharSet.Auto)] public static extern IntPtr SendMessage(IntPtr hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);
    [DllImport("user32.dll", SetLastError = true)] public static extern IntPtr FindWindowEx(IntPtr parentHandle, IntPtr childAfter, string className, string windowTitle);

    public enum WMessages : int
    {
        WM_LBUTTONDOWN = 0x201,
        WM_LBUTTONUP = 0x202,

        WM_KEYDOWN = 0x100,
        WM_KEYUP = 0x101,

        WH_KEYBOARD_LL = 13,
        WH_MOUSE_LL = 14,
    }
    [return: MarshalAs(UnmanagedType.Bool)] [DllImport("user32.dll", SetLastError = true)] static extern int PostMessage(HandleRef hWnd, UInt32 Msg, IntPtr wParam, IntPtr lParam);
    public static void SendClick(WMessages type, Point pos, IntPtr windowHandle)
    {
        switch (type)
        {
                case WMessages.WM_LBUTTONDOWN:
                SendMessage(windowHandle, (UInt32)WMessages.WM_LBUTTONDOWN, (IntPtr)0x1, (IntPtr)((pos.Y << 16) | (pos.X & 0xFFFF)));
                return;
            case WMessages.WM_LBUTTONUP:
                SendMessage(windowHandle, (UInt32)WMessages.WM_LBUTTONDOWN, (IntPtr)0x1, (IntPtr)((pos.Y << 16) | (pos.X & 0xFFFF)));
                return;
            default:
                return;
            /*case WMessages.WM_LBUTTONDOWN:
                PostMessage(new HandleRef(null, windowHandle),
                    (UInt32)WMessages.WM_LBUTTONDOWN, (IntPtr)0x1,
                    (IntPtr)((pos.Y << 16) | (pos.X & 0xFFFF)));
                return;
            case WMessages.WM_LBUTTONUP:
                PostMessage(new HandleRef(null, windowHandle),
                    (UInt32)WMessages.WM_LBUTTONDOWN, (IntPtr)0x1,
                    (IntPtr)((pos.Y << 16) | (pos.X & 0xFFFF)));
                return;
            default:
                return;*/
        }
    }

    [DllImport("user32.dll", SetLastError = true)] public static extern bool GetLayeredWindowAttributes(IntPtr hwnd, out uint crKey, out byte bAlpha, out uint dwFlags);
    [DllImport("user32.dll")] public static extern bool SetLayeredWindowAttributes(IntPtr hwnd, uint crKey, byte bAlpha, uint dwFlags);

    [DllImport("user32.dll", SetLastError = true)] public static extern UInt32 GetWindowLong(IntPtr hWnd, int nIndex);
    [DllImport("user32.dll")] public static extern int SetWindowLong(IntPtr hWnd, int nIndex, UInt32 dwNewLong);

    public const int GWL_EXSTYLE = -20;
    public const int WS_EX_LAYERED = 0x80000;
    public const int LWA_ALPHA = 0x2;
    public const int LWA_COLORKEY = 0x1;

    [DllImport("user32.dll", EntryPoint = "SetWindowPos")] public static extern IntPtr SetWindowPos(IntPtr hWnd, int hWndInsertAfter, int x, int Y, int cx, int cy, int wFlags);
    public const short SWP_NOMOVE = 0X2;
    public const short SWP_NOSIZE = 1;
    public const short SWP_NOZORDER = 0X4;
    public const int SWP_SHOWWINDOW = 0x0040;

    [DllImport("user32.dll", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    public static extern bool GetWindowRect(IntPtr hWnd, ref RECT lpRect);
    [StructLayout(LayoutKind.Sequential)]
    public struct RECT
    {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }
}