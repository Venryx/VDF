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
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
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

        private void tabPage2_Click(object sender, EventArgs e)
        {

        }

        private void tabControl1_SelectedIndexChanged(object sender, EventArgs e) { UpdateWindowSize(); }
        void UpdateWindowSize()
        {
            if (tabControl1.SelectedIndex == 0)
                this.Size = this.Size;
            else
                this.Size = this.Size;
        }
    }
}