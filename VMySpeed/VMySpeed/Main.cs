using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace VMySpeed
{
    public partial class Main : Form
    {
        public Main()
        {
            InitializeComponent();
            SpeedTrackBar.Value = Properties.Settings.Default.Speed;
            UpdateWindowSize();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //V.StartTest();
        }

        private void label2_Click(object sender, EventArgs e)
        {

        }

        private void textBox3_TextChanged(object sender, EventArgs e)
        {

        }

        private void textBox5_TextChanged(object sender, EventArgs e)
        {

        }

        private void label6_Click(object sender, EventArgs e)
        {

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

            int address = V.FindStartAddressOfByteSequence(process, bytesToSearchFor, 5345076 - 16); //7000000);
            Searcher_Location.Text = address.ToString();
        }

        private void tabControl1_SelectedIndexChanged(object sender, EventArgs e) { UpdateWindowSize(); }
        void UpdateWindowSize()
        {
            if (tabControl1.SelectedIndex == 0)
                this.Size = new Size(518, 180);
            else
                this.Size = new Size(518, 258);
        }

        private void SpeedTrackBar_Scroll(object sender, EventArgs e)
        {
        }

        private void ShowWindow_Click(object sender, EventArgs e)
        {
            Show();
        }
        bool forceClose;
        private void Exit_Click(object sender, EventArgs e)
        {
            forceClose = true;
            Application.Exit();
        }

        void Form1_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (forceClose)
            {
                Properties.Settings.Default.Speed = SpeedTrackBar.Value;
                Properties.Settings.Default.Save();
                return;
            }

            Hide();
            e.Cancel = true;
        }

        private void Getter_Value_TextChanged(object sender, EventArgs e)
        {

        }

        private void Main_Load(object sender, EventArgs e)
        {

        }

        private void Speed_50_Click(object sender, EventArgs e) { SpeedTrackBar.Value = 50; BreakLock(); }
        private void Speed_75_Click(object sender, EventArgs e) { SpeedTrackBar.Value = 75; BreakLock(); }
        private void Speed_100_Click(object sender, EventArgs e) { SpeedTrackBar.Value = 100; BreakLock(); }
        private void Speed_150_Click(object sender, EventArgs e) { SpeedTrackBar.Value = 150; BreakLock(); }
        private void Speed_200_Click(object sender, EventArgs e) { SpeedTrackBar.Value = 200; BreakLock(); }
        private void Speed_300_Click(object sender, EventArgs e) { SpeedTrackBar.Value = 300; BreakLock(); }

        private void SpeedTrackBar_ValueChanged(object sender, EventArgs e) { UpdateSpeed(); }
        int speedBase;
        float speedMultiplier;
        void UpdateSpeed()
        {
            speedBase = SpeedTrackBar.Value;
            speedMultiplier = speedBase / 100f;
            Text = "VMySpeed - " + speedMultiplier + "x";
        }

        private void EnabledCheckbox_CheckedChanged(object sender, EventArgs e)
        {
            if (EnabledCheckbox.Checked)
                StartTimer();
            else
                StopTimer();
        }
        void StartTimer() { SpeedApplierTimer.Enabled = true; }
        void StopTimer() { SpeedApplierTimer.Enabled = false; }

        bool attached = false;
        Process cachedProcess = null;
        int cachedSpeedValueMemoryLocation = -1;
        private void SpeedApplierTimer_Tick(object sender, EventArgs e)
        {
            byte[] bytesToWrite = { (byte)(speedBase / 10), 0, 0, 0 };

            int bytesWritten_count;
            bool worked = V.WriteMemory(cachedProcess, cachedSpeedValueMemoryLocation, bytesToWrite, out bytesWritten_count);
            //BreakLock();
        }
        void BreakLock()
        {
            /*if (speedBase != 10) // if we shouldn't be at 1.0x
            {
                IDictionary<IntPtr, string> windowTitlesByHandle = V.GetOpenWindows();
                KeyValuePair<IntPtr, string> enounceWindow = windowTitlesByHandle.FirstOrDefault(pair=>pair.Value.StartsWith("Enounce MySpeed"));
                if (enounceWindow.Value != null && enounceWindow.Value.Contains("1.0x")) // but it is
                {
                    var slider = V.FindWindowEx(enounceWindow.Key, IntPtr.Zero, "msctls_trackbar32", "");
                    //V.SendMessage(slider, 0xA, new IntPtr(1), IntPtr.Zero);
                    V.SendClick(V.WMessages.WM_LBUTTONDOWN, new Point(100, 5), slider);
                    V.SendClick(V.WMessages.WM_LBUTTONUP, new Point(100, 5), slider);

                    //V.SendMessage_Special(slider, 0x200, IntPtr.Zero, V.MousePoint(10, 20));
                    //V.SendMessage(slider, V.MOUSEDOWN, IntPtr.Zero, IntPtr.Zero);
                    //V.SendMessage(slider, V.MOUSEUP, IntPtr.Zero, IntPtr.Zero);

                    //V.SendMessage(slider, 0x405, new IntPtr(1), new IntPtr(2));
                    //V.SetForegroundWindow(enounceWindow.Key);
                    //SendKeys.SendWait("^%P"); // break it out of the lock by telling MySpeed to jump to preferred speed
                    //V.SetForegroundWindow(Process.GetCurrentProcess().MainWindowHandle);
                    //Focus();
                }
            }*/
        }

        private void label9_Click(object sender, EventArgs e)
        {

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
    }
}