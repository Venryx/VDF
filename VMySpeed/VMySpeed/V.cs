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
    /*[DllImport("kernel32.dll", SetLastError = true)] static extern bool ReadProcessMemory(IntPtr hProcess, IntPtr lpBaseAddress, [Out] byte[] lpBuffer, int dwSize, out int lpNumberOfBytesRead);
    [DllImport("kernel32.dll")] public static extern IntPtr OpenProcess(int dwDesiredAccess, bool bInheritHandle, int dwProcessId);
    [DllImport("kernel32.dll", SetLastError = true)] [return: MarshalAs(UnmanagedType.Bool)] static extern bool CloseHandle(IntPtr hObject);

    public static void StartTest()
    {
        Process[] procs = Process.GetProcessesByName("explorer");
        if (procs.Length <= 0) //proces not found
            return; //can replace with exit nag(message)+exit;
        IntPtr p = OpenProcess(0x10 | 0x20, true, procs[0].Id); //0x10-read 0x20-write

        uint PTR = 0x0; //begin of memory
        byte[] bit2search1 = {0xEB, 0x20, 0x68, 0x21, 0x27, 0x65}; //your bit array until ??
        int k = 1; //numer of missing array (??)
        byte[] bit2search2 = {0x21, 0x64, 0xA1}; //your bit array after ??
        byte[] buff = new byte[bit2search1.Length + 1 + bit2search2.Length]; //your array lenght;
        int bytesReaded;
        bool finded = false;

        while (PTR != 0xFF000000) //end of memory // u can specify to read less if u know he does not fill it all
        {
            ReadProcessMemory(p, (IntPtr)PTR, buff, buff.Length, out bytesReaded);
            if (SpecialByteCompare(buff, bit2search1, bit2search2, k))
            {
                //do your stuff
                finded = true;
                break;
            }
            PTR += 0x1;
        }
        if (!finded)
            Console.WriteLine(@"Sorry, byte array not found.");
    }
    static bool SpecialByteCompare(byte[] b1, byte[] b2, byte[] b3, int k) //readed memory, first byte array, second byte array, number of missing byte's
    {
        if (b1.Length != (b2.Length + k + b3.Length))
            return false;
        for (int i = 0; i < b2.Length; i++)
            if (b1[i] != b2[i])
                return false;

        for (int i = 0; i < b3.Length; i++)
            if (b1[b2.Length + k + i] != b3[i])
                return false;
        return true;
    }*/

    [Flags]
    public enum ProcessAccessFlags : uint
    {
        All = 0x001F0FFF,
        Terminate = 0x00000001,
        CreateThread = 0x00000002,
        VMOperation = 0x00000008,
        VMRead = 0x00000010,
        VMWrite = 0x00000020,
        DupHandle = 0x00000040,
        SetInformation = 0x00000200,
        QueryInformation = 0x00000400,
        Synchronize = 0x00100000
    }
    [DllImport("kernel32.dll")] static extern IntPtr OpenProcess(ProcessAccessFlags dwDesiredAccess, [MarshalAs(UnmanagedType.Bool)] bool bInheritHandle, int dwProcessId);
    [DllImport("kernel32.dll", SetLastError = true)] static extern bool WriteProcessMemory(IntPtr hProcess, IntPtr lpBaseAddress, byte[] lpBuffer, uint nSize, out int lpNumberOfBytesWritten);
    [DllImport("kernel32.dll", SetLastError = true)] static extern bool ReadProcessMemory(IntPtr hProcess, IntPtr lpBaseAddress, [Out] byte[] lpBuffer, int dwSize, out int lpNumberOfBytesRead);
    [DllImport("kernel32.dll")] public static extern Int32 CloseHandle(IntPtr hProcess);

    public static byte[] ReadMemory(Process process, int address, int numOfBytes, out int bytesRead)
    {
        IntPtr hProc = OpenProcess(ProcessAccessFlags.All, false, process.Id);

        byte[] buffer = new byte[numOfBytes];

        ReadProcessMemory(hProc, new IntPtr(address), buffer, numOfBytes, out bytesRead);
        return buffer;
    }
    /*Process process = Process.GetProcessesByName("My Apps Name").FirstOrDefault();          
    int address = 0x02ED2910;
 
    int bytesRead;
    byte[] value = ReadMemory(process, address, 4, out bytesRead);*/

    /*public static bool WriteMemory(Process process, int address, long value, out int bytesWritten)
    {
        IntPtr hProc = OpenProcess(ProcessAccessFlags.All, false, process.Id);
        byte[] val = BitConverter.GetBytes(value);
        bool worked = WriteProcessMemory(hProc, new IntPtr(address), val, (UInt32)val.LongLength, out bytesWritten);
        CloseHandle(hProc);
        return worked;
    }*/
    public static bool WriteMemory(Process process, int address, byte[] values, out int bytesWritten)
    {
        IntPtr hProc = OpenProcess(ProcessAccessFlags.All, false, process.Id);
        bool worked = WriteProcessMemory(hProc, new IntPtr(address), values, (UInt32)values.Length, out bytesWritten);
        CloseHandle(hProc);
        return worked;
    }
    /*Process process = Process.GetProcessesByName("My Apps Name").FirstOrDefault();          
    int address = 0x02ED2910;
 
    int bytesWritten;
    bool worked = WriteMemory(process, address, value, out bytesWritten);*/

    public static int FindStartAddressOfByteSequence(Process process, int[] sequence, int startAddress = 0, int indexOfOneToKeep = 0) // note; is only able to find sequence at start-addresses that are multiples of the sequence length (not anymore)
    {
        startAddress -= (startAddress % sequence.Length); // set startAddress back a bit, to be multiple of sequence

        int currentMemorySearchAddress = startAddress; //7966516 - 16; //0x0; // beginning of memory
        var readBytesBuffer = new byte[sequence.Length];    // your array length

        int currentMatchIndex = -1;
        bool found = false;
        while (currentMemorySearchAddress < 10000000) //0xFF000000)   // end of memory // you can specify to read less if you know he does not fill it all
        {
            int bytesRead_count;
            readBytesBuffer = ReadMemory(process, currentMemorySearchAddress, readBytesBuffer.Length, out bytesRead_count);
            if (AreByteArraysEqual(sequence, readBytesBuffer))
            {
                currentMatchIndex++;
                if (currentMatchIndex == indexOfOneToKeep)
                {
                    found = true;
                    break;
                }
            }
            currentMemorySearchAddress += sequence.Length;
        }
        return found ? currentMemorySearchAddress : -1;
    }
    static bool AreByteArraysEqual(int[] array1, byte[] array2) // array1 can use -1 for byte to have it match anything
    {
        if (array1.Length != array2.Length)
            return false;
        for (int i = 0; i < array1.Length; i++)
            if (array1[i] != array2[i] && array1[i] != -1) // -1 matches anything
                return false;
        return true;
    }

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