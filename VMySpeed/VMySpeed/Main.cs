using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Security.Policy;
using System.Text;
using System.Windows.Forms;
using Utilities;

namespace VMySpeed
{
    public partial class Main : Form
    {
        GlobalKeyboardHook keyHook = new GlobalKeyboardHook();

        public Main()
        {
            InitializeComponent();
            SpeedTrackBar.Value = Properties.Settings.Default.Speed;
            ControlMode.SelectedIndex = Properties.Settings.Default.ControlMode;
            ControlInterval.Value = Properties.Settings.Default.ControlInterval;
            SpeedPreset1_Value.Value = Properties.Settings.Default.SpeedPreset1_Value;
            SpeedPreset1_Key.Text = Properties.Settings.Default.SpeedPreset1_Key;
            SpeedPreset2_Value.Value = Properties.Settings.Default.SpeedPreset2_Value;
            SpeedPreset2_Key.Text = Properties.Settings.Default.SpeedPreset2_Key;
            SpeedPreset3_Value.Value = Properties.Settings.Default.SpeedPreset3_Value;
            SpeedPreset3_Key.Text = Properties.Settings.Default.SpeedPreset3_Key;
            StepSize.Value = Properties.Settings.Default.StepSize;
            StepDown_Key.Text = Properties.Settings.Default.StepDown_Key;
            StepUp_Key.Text = Properties.Settings.Default.StepUp_Key;
            UpdateSpeed();
            UpdateWindowSize();

            // hotkeys
            keyHook.KeyDown += OnKeyDown;
        }
        void OnKeyDown(object sender, KeyEventArgs e)
        {
            //Console.WriteLine(String.Join(";", keyHook.keysDown));
            if (GetAreKeysOfTextInList(SpeedPreset1_Key.Text, keyHook.keysDown))
                ChangeSpeed(SpeedPreset1_Value.Value);
            if (GetAreKeysOfTextInList(SpeedPreset2_Key.Text, keyHook.keysDown))
                ChangeSpeed(SpeedPreset2_Value.Value);
            if (GetAreKeysOfTextInList(SpeedPreset3_Key.Text, keyHook.keysDown))
                ChangeSpeed(SpeedPreset3_Value.Value);
            if (GetAreKeysOfTextInList(StepDown_Key.Text, keyHook.keysDown))
                ChangeSpeed(speed - StepSize.Value);
            if (GetAreKeysOfTextInList(StepUp_Key.Text, keyHook.keysDown))
                ChangeSpeed(speed + StepSize.Value);
        }
        Dictionary<string, List<Keys>> stringToKeyMap = new Dictionary<string, List<Keys>>
        {
            {"0", new List<Keys> {Keys.D0}},
            {"1", new List<Keys> {Keys.D1}},
            {"2", new List<Keys> {Keys.D2}},
            {"3", new List<Keys> {Keys.D3}},
            {"4", new List<Keys> {Keys.D4}},
            {"5", new List<Keys> {Keys.D5}},
            {"6", new List<Keys> {Keys.D6}},
            {"7", new List<Keys> {Keys.D7}},
            {"8", new List<Keys> {Keys.D8}},
            {"9", new List<Keys> {Keys.D9}},
            {"Ctrl", new List<Keys> {Keys.LControlKey, Keys.RControlKey}},
            {"Shift", new List<Keys> {Keys.LShiftKey, Keys.RShiftKey}},
            {"Alt", new List<Keys> {Keys.Alt, Keys.LMenu, Keys.RMenu}},
            {"-", new List<Keys> {Keys.OemMinus}},
            {"=", new List<Keys> {Keys.Oemplus}},
            {"[", new List<Keys> {Keys.OemOpenBrackets}},
            {"]", new List<Keys> {Keys.Oem6}},
            {"\\", new List<Keys> {Keys.Oem5}}
        };
        bool GetAreKeysOfTextInList(string text, HashSet<Keys> list)
        {
            bool result = true;
            string[] parts = text.Split(new[]{'+'});
            foreach (string part in parts)
            {
                var keysForPart = new List<Keys>();
                if (stringToKeyMap.ContainsKey(part))
                    keysForPart = stringToKeyMap[part];
                else
                {
                    Keys val;
                    if (Enum.TryParse(part, true, out val))
                        keysForPart = new List<Keys> {val};
                }
                if (!keysForPart.Any(key=>list.Contains(key))) // found no in-list-key to match this string-part
                    result = false;
            }
            return result;
        }
        
        private void TabControl_SelectedIndexChanged(object sender, EventArgs e) { UpdateWindowSize(); }
        void UpdateWindowSize()
        {
            if (TabControl.SelectedIndex == 0)
                Size = new Size(307, 105);
            else if (TabControl.SelectedIndex == 1)
                Size = new Size(493, 250);
            else if (TabControl.SelectedIndex == 2)
                Size = new Size(457, 163);
            else
                Size = new Size(269, 137);
        }
        bool forceClose;
        private void Exit_Click(object sender, EventArgs e)
        {
            forceClose = true;
            Application.Exit();
        }
        void Main_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (forceClose)
            {
                Properties.Settings.Default.Speed = SpeedTrackBar.Value;
                Properties.Settings.Default.ControlMode = ControlMode.SelectedIndex;
                Properties.Settings.Default.ControlInterval = (int)ControlInterval.Value;
                Properties.Settings.Default.SpeedPreset1_Value = SpeedPreset1_Value.Value;
                Properties.Settings.Default.SpeedPreset1_Key = SpeedPreset1_Key.Text;
                Properties.Settings.Default.SpeedPreset2_Value = SpeedPreset2_Value.Value;
                Properties.Settings.Default.SpeedPreset2_Key = SpeedPreset2_Key.Text;
                Properties.Settings.Default.SpeedPreset3_Value = SpeedPreset3_Value.Value;
                Properties.Settings.Default.SpeedPreset3_Key = SpeedPreset3_Key.Text;
                Properties.Settings.Default.StepSize = StepSize.Value;
                Properties.Settings.Default.StepDown_Key = StepDown_Key.Text;
                Properties.Settings.Default.StepUp_Key = StepUp_Key.Text;
                Properties.Settings.Default.Save();
                return;
            }

            Hide();
            e.Cancel = true;
        }

        private void Getter_Get_Click(object sender, EventArgs e)
        {
            Process process = Process.GetProcessesByName(ProcessName.Text).FirstOrDefault();

            int address = int.Parse(Getter_Address.Text);
            int bytesToRead = (int)Getter_Bytes.Value;

            int bytesRead_count;
            byte[] bytesRead = V.ReadMemory(process, address, bytesToRead, out bytesRead_count);

            Getter_Value.Text = String.Join(";", bytesRead);
        }

        private void Setter_Set_Click(object sender, EventArgs e)
        {
            Process process = Process.GetProcessesByName(ProcessName.Text).FirstOrDefault();

            int address = int.Parse(Setter_Address.Text);
            string bytesToWrite_string = Setter_Value.Text;
            byte[] bytesToWrite = bytesToWrite_string.Split(new []{';'}).Select(valStr=>byte.Parse(valStr)).ToArray();

            int bytesWritten_count;
            bool worked = V.WriteMemory(process, address, bytesToWrite, out bytesWritten_count);
        }

        private void Searcher_Search_Click(object sender, EventArgs e)
        {
            Process process = Process.GetProcessesByName(ProcessName.Text).FirstOrDefault();

            string bytesToSearchFor_string = Searcher_Value.Text;
            int[] bytesToSearchFor = bytesToSearchFor_string.Split(new[] { ';' }).Select(valStr => int.Parse(valStr)).ToArray();

            int address = V.FindStartAddressOfByteSequence(process, bytesToSearchFor, 0); //5345076 - 16); //7000000);
            Searcher_Location.Text = address.ToString();
        }

        private void ShowWindow_Click(object sender, EventArgs e)
        {
            Show();
        }

        bool enabled;
        private void EnabledCheckbox_CheckedChanged(object sender, EventArgs e)
        {
            enabled = EnabledCheckbox.Checked;
            if (enabled)
                StartApplyingSpeed(speed);
            else
                StopApplyingSpeed();
        }
        void StartTimer() { SpeedApplierTimer.Enabled = true; }
        void StopTimer() { SpeedApplierTimer.Enabled = false; }

        void Speed_5_Click(object sender, EventArgs e) { ChangeSpeed(.5m); }
        void Speed_10_Click(object sender, EventArgs e) { ChangeSpeed(1); }
        void Speed_15_Click(object sender, EventArgs e) { ChangeSpeed(1.5m); }
        void Speed_20_Click(object sender, EventArgs e) { ChangeSpeed(2); }
        void Speed_25_Click(object sender, EventArgs e) { ChangeSpeed(2.5m); }
        void Speed_30_Click(object sender, EventArgs e) { ChangeSpeed(3); }
        void Speed_35_Click(object sender, EventArgs e) { ChangeSpeed(3.5m); }

        void ChangeSpeed(decimal speed) { SpeedTrackBar.Value = Math.Max(Math.Min((int)(speed * 10), SpeedTrackBar.Maximum), SpeedTrackBar.Minimum); }
        private void SpeedTrackBar_ValueChanged(object sender, EventArgs e) { UpdateSpeed(); }
        decimal speed;
        void UpdateSpeed()
        {
            speed = SpeedTrackBar.Value / 10m;
            Text = "VMySpeed - " + speed + "x";
            if (enabled)
                StartApplyingSpeed(speed);
        }
        void StartApplyingSpeed(decimal speed)
        {
            if (ControlMode.SelectedIndex == 0)
                StartTimer();
            else
                ApplySpeed(speed); // for set-range mode, just apply on speed-change
        }
        void StopApplyingSpeed()
        {
            StopTimer();
            SetMySpeedSliderRange(.3m, 5m); // reset range
            SetMySpeedSliderValue(1); // reset value
        }

        bool attached = false;
        Process cachedProcess = null;
        int cachedSpeedValueMemoryLocation = -1;
        private void SpeedApplierTimer_Tick(object sender, EventArgs e)
        {
            /*byte[] bytesToWrite = { (byte)(speedBase / 10), 0, 0, 0 };

            int bytesWritten_count;
            bool worked = V.WriteMemory(cachedProcess, cachedSpeedValueMemoryLocation, bytesToWrite, out bytesWritten_count);
            //BreakLock();*/

            ApplySpeed(speed);
        }
        void ApplySpeed(decimal speedToApply)
        {
            if (ControlMode.SelectedIndex == 0)
            {
                BreakLock();
                SetMySpeedSliderValue(speedToApply);
            }
            else
            {
                if (speedToApply == 1) // normal speed, so we can reset the range
                {
                    SetMySpeedSliderRange(.3m, 5m);
                    SetMySpeedSliderValue(1);
                }
                else
                {
                    SetMySpeedSliderRange(speedToApply, speedToApply);
                    BreakLock();
                }
            }
        }
        void SetMySpeedSliderRange(decimal min, decimal max)
        {
            IDictionary<IntPtr, string> windowTitlesByHandle = V.GetOpenWindows(true);
            KeyValuePair<IntPtr, string> enounceWindow = windowTitlesByHandle.FirstOrDefault(pair => pair.Value.StartsWith("Enounce MySpeed"));
            if (enounceWindow.Value != null)
            {
                var slider = V.FindWindowEx(enounceWindow.Key, IntPtr.Zero, "msctls_trackbar32", "");
                V.SendMessage(slider, 0x407, IntPtr.Zero, new IntPtr((int)(min * 10)));
                V.SendMessage(slider, 0x408, IntPtr.Zero, new IntPtr((int)(max * 10)));
                V.SendMessage(slider, 0x405, new IntPtr(1), new IntPtr(10));
            }
        }
        void SetMySpeedSliderValue(decimal value)
        {
            IDictionary<IntPtr, string> windowTitlesByHandle = V.GetOpenWindows(true);
            KeyValuePair<IntPtr, string> enounceWindow = windowTitlesByHandle.FirstOrDefault(pair => pair.Value.StartsWith("Enounce MySpeed"));
            if (enounceWindow.Value != null)
            {
                var slider = V.FindWindowEx(enounceWindow.Key, IntPtr.Zero, "msctls_trackbar32", "");
                V.SendMessage(slider, 0x405, new IntPtr(1), new IntPtr((int)(value * 10)));
            }
        }
        void BreakLock()
        {
            if (speed != 1) // if we shouldn't be at 1.0x
            {
                IDictionary<IntPtr, string> windowTitlesByHandle = V.GetOpenWindows(true);
                KeyValuePair<IntPtr, string> mySpeedWindow = windowTitlesByHandle.FirstOrDefault(pair => pair.Value.StartsWith("Enounce MySpeed"));
                if (mySpeedWindow.Value != null && mySpeedWindow.Value.Contains("1.0x")) // but MySpeed's current actual-speed is 1.0x
                {
                    var slider = V.FindWindowEx(mySpeedWindow.Key, IntPtr.Zero, "msctls_trackbar32", "");
                    //V.SendMessage(slider, 0xA, new IntPtr(1), IntPtr.Zero);
                    //V.SendMessage(slider, 0x407, new IntPtr(1), new IntPtr(500));
                    V.SendClick(V.WMessages.WM_LBUTTONDOWN, speed < 1 ? new Point(12, 5) : new Point(100, 5), slider);
                    V.SendClick(V.WMessages.WM_LBUTTONUP, speed < 1 ? new Point(12, 5) : new Point(100, 5), slider);

                    //V.SendMessage_Special(slider, 0x200, IntPtr.Zero, V.MousePoint(10, 20));
                    //V.SendMessage(slider, V.MOUSEDOWN, IntPtr.Zero, IntPtr.Zero);
                    //V.SendMessage(slider, V.MOUSEUP, IntPtr.Zero, IntPtr.Zero);

                    //V.SendMessage(slider, 0x405, new IntPtr(1), new IntPtr(2));
                    //V.SetForegroundWindow(enounceWindow.Key);
                    //SendKeys.SendWait("^%P"); // break it out of the lock by telling MySpeed to jump to preferred speed
                    //V.SetForegroundWindow(Process.GetCurrentProcess().MainWindowHandle);
                    //Focus();
                }
            }
        }

        private void AttachButton_Click(object sender, EventArgs e)
        {
            if (attached)
                Detach();
            else
                Attach();
        }
        void Attach()
        {
            cachedProcess = Process.GetProcessesByName("MySpeed").FirstOrDefault();
            if (cachedProcess == null) // did not find process
            {
                StatusLabel.Text = "Status: Not Attached (error: couldn't find process)";
                EnabledCheckbox.Checked = false;
                StopTimer();
                return;
            }

            string byteSequenceString = "32;0;67;0;111;0;110;0;116;0;114;0;97;0;115;0"; //"210;4;0;0;-1;0;0;0"; //"0;0;0;0;133;32;5;210;3;0;0;0;136;19;0;0";
            int[] byteSequence = byteSequenceString.Split(new[] { ';' }).Select(valStr => int.Parse(valStr)).ToArray(); // use int[] to allow negatives
            var addressOfMarker = V.FindStartAddressOfByteSequence(cachedProcess, byteSequence, 0, 0);
            var addressOfFiles = V.FindStartAddressOfByteSequence(cachedProcess, new[] {/*70, 0, */105, 0, 108, 0, 101, 0, 115, 0}, addressOfMarker - (16 * 20));
            if (addressOfFiles == -1)
            {
                StatusLabel.Text = "Status: Not Attached (error: couldn't find sequence)";
                EnabledCheckbox.Checked = false;
                return;
            }

            cachedSpeedValueMemoryLocation = addressOfFiles + (16 * 5) + 4; //addressOf255s - 20; //addressOfMarker - (16 * 6); //5345076 - 16) + byteSequence.Length;
            StatusLabel.Text = "Status: Attached (" + cachedSpeedValueMemoryLocation + ")";
            toolTip1.SetToolTip(StatusLabel, null);
            attached = true;
            AttachDetachButton.Text = "Detach";
        }
        void Detach()
        {
            StatusLabel.Text = "Status: Not Attached";
            toolTip1.SetToolTip(StatusLabel, "");
            attached = false;
            AttachDetachButton.Text = "Attach";
        }

        private void ShowHideMySpeedWindow_Click(object sender, EventArgs e)
        {
            IDictionary<IntPtr, string> windowTitlesByHandle = V.GetOpenWindows(true);
            KeyValuePair<IntPtr, string> enounceWindow = windowTitlesByHandle.FirstOrDefault(pair=>pair.Value.StartsWith("Enounce MySpeed"));
            if (enounceWindow.Value != null)
            {
                /*uint crKey;
                byte bAlpha;
                uint dwFlags;
                V.GetLayeredWindowAttributes(enounceWindow.Key, out crKey, out bAlpha, out dwFlags);*/

                V.RECT rct = new V.RECT();
                V.GetWindowRect(enounceWindow.Key, ref rct);
                if (rct.Left >= 5000) // if hidden
                {
                    V.SetWindowPos(enounceWindow.Key, 0, rct.Left - 10000, rct.Top, 0, 0, V.SWP_NOZORDER | V.SWP_NOSIZE); // | V.SWP_SHOWWINDOW);
                    //V.SetWindowLong(Handle, V.GWL_EXSTYLE, V.GetWindowLong(Handle, V.GWL_EXSTYLE) ^ V.WS_EX_LAYERED);
                    //V.SetLayeredWindowAttributes(Handle, 0, 255, V.LWA_ALPHA);
                    ShowHideMySpeedWindow.Text = "Move MySpeed Window Off-Screen";
                }
                else
                {;
                    V.SetWindowPos(enounceWindow.Key, 0, 10000 + rct.Left, rct.Top, 0, 0, V.SWP_NOZORDER | V.SWP_NOSIZE); // | V.SWP_SHOWWINDOW);
                    //V.SetWindowLong(Handle, V.GWL_EXSTYLE, V.GetWindowLong(Handle, V.GWL_EXSTYLE) ^ V.WS_EX_LAYERED);
                    //V.SetLayeredWindowAttributes(Handle, 0, 0, V.LWA_ALPHA);
                    ShowHideMySpeedWindow.Text = "Move MySpeed Window Back On-Screen";
                }
            }
        }

        private void SliderControlFrequency_ValueChanged(object sender, EventArgs e) { SpeedApplierTimer.Interval = (int)ControlInterval.Value; }
        void ControlMode_SelectedIndexChanged(object sender, EventArgs e)
        {
            ControlInterval.Enabled = ControlMode.SelectedIndex == 0;
            if (enabled)
            {
                StopApplyingSpeed();
                StartApplyingSpeed(speed);
            }
        }
    }
}