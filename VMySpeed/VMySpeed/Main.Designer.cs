namespace VMySpeed
{
    partial class Main
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.components = new System.ComponentModel.Container();
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Main));
            this.Setter_Set = new System.Windows.Forms.Button();
            this.groupBox1 = new System.Windows.Forms.GroupBox();
            this.Setter_Value = new System.Windows.Forms.TextBox();
            this.Setter_Address = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.label1 = new System.Windows.Forms.Label();
            this.groupBox2 = new System.Windows.Forms.GroupBox();
            this.Searcher_Location = new System.Windows.Forms.TextBox();
            this.Searcher_Value = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.Searcher_Search = new System.Windows.Forms.Button();
            this.groupBox3 = new System.Windows.Forms.GroupBox();
            this.Getter_Bytes = new System.Windows.Forms.NumericUpDown();
            this.label8 = new System.Windows.Forms.Label();
            this.Getter_Address = new System.Windows.Forms.TextBox();
            this.Getter_Value = new System.Windows.Forms.TextBox();
            this.label6 = new System.Windows.Forms.Label();
            this.Getter_Get = new System.Windows.Forms.Button();
            this.label5 = new System.Windows.Forms.Label();
            this.label7 = new System.Windows.Forms.Label();
            this.ProcessName = new System.Windows.Forms.TextBox();
            this.toolTip1 = new System.Windows.Forms.ToolTip(this.components);
            this.tabControl1 = new System.Windows.Forms.TabControl();
            this.tabPage1 = new System.Windows.Forms.TabPage();
            this.AttachDetachButton = new System.Windows.Forms.Button();
            this.EnabledCheckbox = new System.Windows.Forms.CheckBox();
            this.StatusLabel = new System.Windows.Forms.Label();
            this.panel1 = new System.Windows.Forms.Panel();
            this.Speed_300 = new System.Windows.Forms.Button();
            this.Speed_200 = new System.Windows.Forms.Button();
            this.Speed_150 = new System.Windows.Forms.Button();
            this.Speed_75 = new System.Windows.Forms.Button();
            this.Speed_50 = new System.Windows.Forms.Button();
            this.Speed_100 = new System.Windows.Forms.Button();
            this.SpeedTrackBar = new System.Windows.Forms.TrackBar();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.NotifyIcon = new System.Windows.Forms.NotifyIcon(this.components);
            this.NotifyIconContextMenu = new System.Windows.Forms.ContextMenuStrip(this.components);
            this.ShowWindow = new System.Windows.Forms.ToolStripMenuItem();
            this.Separator1 = new System.Windows.Forms.ToolStripSeparator();
            this.Exit = new System.Windows.Forms.ToolStripMenuItem();
            this.SpeedApplierTimer = new System.Windows.Forms.Timer(this.components);
            this.groupBox1.SuspendLayout();
            this.groupBox2.SuspendLayout();
            this.groupBox3.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Getter_Bytes)).BeginInit();
            this.tabControl1.SuspendLayout();
            this.tabPage1.SuspendLayout();
            this.panel1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedTrackBar)).BeginInit();
            this.tabPage2.SuspendLayout();
            this.NotifyIconContextMenu.SuspendLayout();
            this.SuspendLayout();
            // 
            // Setter_Set
            // 
            this.Setter_Set.Location = new System.Drawing.Point(416, 13);
            this.Setter_Set.Name = "Setter_Set";
            this.Setter_Set.Size = new System.Drawing.Size(66, 23);
            this.Setter_Set.TabIndex = 0;
            this.Setter_Set.Text = "Set";
            this.Setter_Set.UseVisualStyleBackColor = true;
            this.Setter_Set.Click += new System.EventHandler(this.Setter_Set_Click);
            // 
            // groupBox1
            // 
            this.groupBox1.Controls.Add(this.Setter_Value);
            this.groupBox1.Controls.Add(this.Setter_Address);
            this.groupBox1.Controls.Add(this.label2);
            this.groupBox1.Controls.Add(this.label1);
            this.groupBox1.Controls.Add(this.Setter_Set);
            this.groupBox1.Location = new System.Drawing.Point(8, 94);
            this.groupBox1.Name = "groupBox1";
            this.groupBox1.Size = new System.Drawing.Size(488, 45);
            this.groupBox1.TabIndex = 1;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Value Setter";
            // 
            // Setter_Value
            // 
            this.Setter_Value.Location = new System.Drawing.Point(281, 16);
            this.Setter_Value.Name = "Setter_Value";
            this.Setter_Value.Size = new System.Drawing.Size(129, 20);
            this.Setter_Value.TabIndex = 4;
            this.Setter_Value.Text = "30;0;0;0";
            // 
            // Setter_Address
            // 
            this.Setter_Address.Location = new System.Drawing.Point(58, 16);
            this.Setter_Address.Name = "Setter_Address";
            this.Setter_Address.Size = new System.Drawing.Size(177, 20);
            this.Setter_Address.TabIndex = 3;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(238, 19);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(37, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Value:";
            this.label2.Click += new System.EventHandler(this.label2_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(7, 19);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(51, 13);
            this.label1.TabIndex = 1;
            this.label1.Text = "Location:";
            // 
            // groupBox2
            // 
            this.groupBox2.Controls.Add(this.Searcher_Location);
            this.groupBox2.Controls.Add(this.Searcher_Value);
            this.groupBox2.Controls.Add(this.label3);
            this.groupBox2.Controls.Add(this.label4);
            this.groupBox2.Controls.Add(this.Searcher_Search);
            this.groupBox2.Location = new System.Drawing.Point(8, 145);
            this.groupBox2.Name = "groupBox2";
            this.groupBox2.Size = new System.Drawing.Size(488, 45);
            this.groupBox2.TabIndex = 5;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Value Searcher";
            // 
            // Searcher_Location
            // 
            this.Searcher_Location.Location = new System.Drawing.Point(394, 16);
            this.Searcher_Location.Name = "Searcher_Location";
            this.Searcher_Location.Size = new System.Drawing.Size(88, 20);
            this.Searcher_Location.TabIndex = 4;
            this.Searcher_Location.TextChanged += new System.EventHandler(this.textBox3_TextChanged);
            // 
            // Searcher_Value
            // 
            this.Searcher_Value.Location = new System.Drawing.Point(50, 16);
            this.Searcher_Value.Name = "Searcher_Value";
            this.Searcher_Value.Size = new System.Drawing.Size(209, 20);
            this.Searcher_Value.TabIndex = 3;
            this.Searcher_Value.Text = "0;0;0;0;133;32;5;210;3;0;0;0;136;19;0;0";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(337, 19);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(51, 13);
            this.label3.TabIndex = 2;
            this.label3.Text = "Location:";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(7, 19);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(37, 13);
            this.label4.TabIndex = 1;
            this.label4.Text = "Value:";
            // 
            // Searcher_Search
            // 
            this.Searcher_Search.Location = new System.Drawing.Point(265, 14);
            this.Searcher_Search.Name = "Searcher_Search";
            this.Searcher_Search.Size = new System.Drawing.Size(66, 23);
            this.Searcher_Search.TabIndex = 0;
            this.Searcher_Search.Text = "Search";
            this.Searcher_Search.UseVisualStyleBackColor = true;
            this.Searcher_Search.Click += new System.EventHandler(this.Searcher_Search_Click);
            // 
            // groupBox3
            // 
            this.groupBox3.Controls.Add(this.Getter_Bytes);
            this.groupBox3.Controls.Add(this.label8);
            this.groupBox3.Controls.Add(this.Getter_Address);
            this.groupBox3.Controls.Add(this.Getter_Value);
            this.groupBox3.Controls.Add(this.label6);
            this.groupBox3.Controls.Add(this.Getter_Get);
            this.groupBox3.Controls.Add(this.label5);
            this.groupBox3.Location = new System.Drawing.Point(8, 43);
            this.groupBox3.Name = "groupBox3";
            this.groupBox3.Size = new System.Drawing.Size(488, 45);
            this.groupBox3.TabIndex = 6;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Value Getter";
            // 
            // Getter_Bytes
            // 
            this.Getter_Bytes.Location = new System.Drawing.Point(188, 17);
            this.Getter_Bytes.Name = "Getter_Bytes";
            this.Getter_Bytes.Size = new System.Drawing.Size(47, 20);
            this.Getter_Bytes.TabIndex = 6;
            this.Getter_Bytes.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(146, 19);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(36, 13);
            this.label8.TabIndex = 5;
            this.label8.Text = "Bytes:";
            // 
            // Getter_Address
            // 
            this.Getter_Address.Location = new System.Drawing.Point(58, 16);
            this.Getter_Address.Name = "Getter_Address";
            this.Getter_Address.Size = new System.Drawing.Size(82, 20);
            this.Getter_Address.TabIndex = 4;
            this.toolTip1.SetToolTip(this.Getter_Address, "Memory address. (in decimal)");
            this.Getter_Address.TextChanged += new System.EventHandler(this.textBox5_TextChanged);
            // 
            // Getter_Value
            // 
            this.Getter_Value.Location = new System.Drawing.Point(343, 16);
            this.Getter_Value.Name = "Getter_Value";
            this.Getter_Value.Size = new System.Drawing.Size(139, 20);
            this.Getter_Value.TabIndex = 3;
            this.Getter_Value.TextChanged += new System.EventHandler(this.Getter_Value_TextChanged);
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(303, 19);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(37, 13);
            this.label6.TabIndex = 1;
            this.label6.Text = "Value:";
            this.label6.Click += new System.EventHandler(this.label6_Click);
            // 
            // Getter_Get
            // 
            this.Getter_Get.Location = new System.Drawing.Point(241, 14);
            this.Getter_Get.Name = "Getter_Get";
            this.Getter_Get.Size = new System.Drawing.Size(53, 23);
            this.Getter_Get.TabIndex = 0;
            this.Getter_Get.Text = "Get";
            this.Getter_Get.UseVisualStyleBackColor = true;
            this.Getter_Get.Click += new System.EventHandler(this.Getter_Get_Click);
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(7, 19);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(48, 13);
            this.label5.TabIndex = 2;
            this.label5.Text = "Address:";
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(5, 16);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(79, 13);
            this.label7.TabIndex = 7;
            this.label7.Text = "Process Name:";
            // 
            // ProcessName
            // 
            this.ProcessName.Location = new System.Drawing.Point(90, 13);
            this.ProcessName.Name = "ProcessName";
            this.ProcessName.Size = new System.Drawing.Size(134, 20);
            this.ProcessName.TabIndex = 8;
            this.ProcessName.Text = "MySpeed";
            // 
            // tabControl1
            // 
            this.tabControl1.Controls.Add(this.tabPage1);
            this.tabControl1.Controls.Add(this.tabPage2);
            this.tabControl1.Dock = System.Windows.Forms.DockStyle.Fill;
            this.tabControl1.Location = new System.Drawing.Point(0, 0);
            this.tabControl1.Name = "tabControl1";
            this.tabControl1.SelectedIndex = 0;
            this.tabControl1.Size = new System.Drawing.Size(512, 230);
            this.tabControl1.TabIndex = 10;
            this.tabControl1.SelectedIndexChanged += new System.EventHandler(this.tabControl1_SelectedIndexChanged);
            // 
            // tabPage1
            // 
            this.tabPage1.Controls.Add(this.AttachDetachButton);
            this.tabPage1.Controls.Add(this.EnabledCheckbox);
            this.tabPage1.Controls.Add(this.StatusLabel);
            this.tabPage1.Controls.Add(this.panel1);
            this.tabPage1.Location = new System.Drawing.Point(4, 22);
            this.tabPage1.Name = "tabPage1";
            this.tabPage1.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage1.Size = new System.Drawing.Size(504, 204);
            this.tabPage1.TabIndex = 0;
            this.tabPage1.Text = "Main";
            this.tabPage1.UseVisualStyleBackColor = true;
            // 
            // AttachDetachButton
            // 
            this.AttachDetachButton.Location = new System.Drawing.Point(421, 91);
            this.AttachDetachButton.Name = "AttachDetachButton";
            this.AttachDetachButton.Size = new System.Drawing.Size(75, 23);
            this.AttachDetachButton.TabIndex = 8;
            this.AttachDetachButton.Text = "Attach";
            this.AttachDetachButton.UseVisualStyleBackColor = true;
            this.AttachDetachButton.Click += new System.EventHandler(this.AttachButton_Click);
            // 
            // EnabledCheckbox
            // 
            this.EnabledCheckbox.AutoSize = true;
            this.EnabledCheckbox.Location = new System.Drawing.Point(9, 95);
            this.EnabledCheckbox.Name = "EnabledCheckbox";
            this.EnabledCheckbox.Size = new System.Drawing.Size(65, 17);
            this.EnabledCheckbox.TabIndex = 7;
            this.EnabledCheckbox.Text = "Enabled";
            this.EnabledCheckbox.UseVisualStyleBackColor = true;
            this.EnabledCheckbox.CheckedChanged += new System.EventHandler(this.EnabledCheckbox_CheckedChanged);
            // 
            // StatusLabel
            // 
            this.StatusLabel.Location = new System.Drawing.Point(74, 91);
            this.StatusLabel.Name = "StatusLabel";
            this.StatusLabel.Size = new System.Drawing.Size(341, 23);
            this.StatusLabel.TabIndex = 1;
            this.StatusLabel.Text = "Status: Not Attached";
            this.StatusLabel.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.StatusLabel.Click += new System.EventHandler(this.label9_Click);
            // 
            // panel1
            // 
            this.panel1.Controls.Add(this.Speed_300);
            this.panel1.Controls.Add(this.Speed_200);
            this.panel1.Controls.Add(this.Speed_150);
            this.panel1.Controls.Add(this.Speed_75);
            this.panel1.Controls.Add(this.Speed_50);
            this.panel1.Controls.Add(this.Speed_100);
            this.panel1.Controls.Add(this.SpeedTrackBar);
            this.panel1.Location = new System.Drawing.Point(9, 7);
            this.panel1.Name = "panel1";
            this.panel1.Size = new System.Drawing.Size(487, 75);
            this.panel1.TabIndex = 0;
            // 
            // Speed_300
            // 
            this.Speed_300.Location = new System.Drawing.Point(279, 39);
            this.Speed_300.Name = "Speed_300";
            this.Speed_300.Size = new System.Drawing.Size(18, 23);
            this.Speed_300.TabIndex = 6;
            this.Speed_300.Text = "3";
            this.Speed_300.UseVisualStyleBackColor = true;
            this.Speed_300.Click += new System.EventHandler(this.Speed_300_Click);
            // 
            // Speed_200
            // 
            this.Speed_200.Location = new System.Drawing.Point(189, 39);
            this.Speed_200.Name = "Speed_200";
            this.Speed_200.Size = new System.Drawing.Size(18, 23);
            this.Speed_200.TabIndex = 5;
            this.Speed_200.Text = "2";
            this.Speed_200.UseVisualStyleBackColor = true;
            this.Speed_200.Click += new System.EventHandler(this.Speed_200_Click);
            // 
            // Speed_150
            // 
            this.Speed_150.Location = new System.Drawing.Point(138, 39);
            this.Speed_150.Name = "Speed_150";
            this.Speed_150.Size = new System.Drawing.Size(30, 23);
            this.Speed_150.TabIndex = 4;
            this.Speed_150.Text = "1.5";
            this.Speed_150.UseVisualStyleBackColor = true;
            this.Speed_150.Click += new System.EventHandler(this.Speed_150_Click);
            // 
            // Speed_75
            // 
            this.Speed_75.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.Speed_75.Location = new System.Drawing.Point(73, 39);
            this.Speed_75.Name = "Speed_75";
            this.Speed_75.Size = new System.Drawing.Size(23, 23);
            this.Speed_75.TabIndex = 3;
            this.Speed_75.Text = ".75";
            this.Speed_75.UseVisualStyleBackColor = true;
            this.Speed_75.Click += new System.EventHandler(this.Speed_75_Click);
            // 
            // Speed_50
            // 
            this.Speed_50.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.Speed_50.Location = new System.Drawing.Point(53, 39);
            this.Speed_50.Name = "Speed_50";
            this.Speed_50.Size = new System.Drawing.Size(18, 23);
            this.Speed_50.TabIndex = 2;
            this.Speed_50.Text = ".5";
            this.Speed_50.UseVisualStyleBackColor = true;
            this.Speed_50.Click += new System.EventHandler(this.Speed_50_Click);
            // 
            // Speed_100
            // 
            this.Speed_100.Location = new System.Drawing.Point(98, 39);
            this.Speed_100.Name = "Speed_100";
            this.Speed_100.Size = new System.Drawing.Size(18, 23);
            this.Speed_100.TabIndex = 1;
            this.Speed_100.Text = "1";
            this.Speed_100.UseVisualStyleBackColor = true;
            this.Speed_100.Click += new System.EventHandler(this.Speed_100_Click);
            // 
            // SpeedTrackBar
            // 
            this.SpeedTrackBar.AutoSize = false;
            this.SpeedTrackBar.LargeChange = 10;
            this.SpeedTrackBar.Location = new System.Drawing.Point(3, 3);
            this.SpeedTrackBar.Maximum = 500;
            this.SpeedTrackBar.Name = "SpeedTrackBar";
            this.SpeedTrackBar.Size = new System.Drawing.Size(481, 30);
            this.SpeedTrackBar.SmallChange = 5;
            this.SpeedTrackBar.TabIndex = 0;
            this.SpeedTrackBar.TickFrequency = 10;
            this.SpeedTrackBar.Value = 100;
            this.SpeedTrackBar.Scroll += new System.EventHandler(this.SpeedTrackBar_Scroll);
            this.SpeedTrackBar.ValueChanged += new System.EventHandler(this.SpeedTrackBar_ValueChanged);
            // 
            // tabPage2
            // 
            this.tabPage2.Controls.Add(this.label7);
            this.tabPage2.Controls.Add(this.ProcessName);
            this.tabPage2.Controls.Add(this.groupBox1);
            this.tabPage2.Controls.Add(this.groupBox2);
            this.tabPage2.Controls.Add(this.groupBox3);
            this.tabPage2.Location = new System.Drawing.Point(4, 22);
            this.tabPage2.Name = "tabPage2";
            this.tabPage2.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage2.Size = new System.Drawing.Size(504, 204);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "Advanced";
            this.tabPage2.UseVisualStyleBackColor = true;
            // 
            // NotifyIcon
            // 
            this.NotifyIcon.ContextMenuStrip = this.NotifyIconContextMenu;
            this.NotifyIcon.Icon = ((System.Drawing.Icon)(resources.GetObject("NotifyIcon.Icon")));
            this.NotifyIcon.Text = "VMySpeed";
            this.NotifyIcon.Visible = true;
            // 
            // NotifyIconContextMenu
            // 
            this.NotifyIconContextMenu.Items.AddRange(new System.Windows.Forms.ToolStripItem[] {
            this.ShowWindow,
            this.Separator1,
            this.Exit});
            this.NotifyIconContextMenu.Name = "NotifyIconContextMenu";
            this.NotifyIconContextMenu.Size = new System.Drawing.Size(151, 54);
            // 
            // ShowWindow
            // 
            this.ShowWindow.Name = "ShowWindow";
            this.ShowWindow.Size = new System.Drawing.Size(150, 22);
            this.ShowWindow.Text = "Show Window";
            this.ShowWindow.Click += new System.EventHandler(this.ShowWindow_Click);
            // 
            // Separator1
            // 
            this.Separator1.Name = "Separator1";
            this.Separator1.Size = new System.Drawing.Size(147, 6);
            // 
            // Exit
            // 
            this.Exit.Name = "Exit";
            this.Exit.Size = new System.Drawing.Size(150, 22);
            this.Exit.Text = "Exit";
            this.Exit.Click += new System.EventHandler(this.Exit_Click);
            // 
            // SpeedApplierTimer
            // 
            this.SpeedApplierTimer.Interval = 10;
            this.SpeedApplierTimer.Tick += new System.EventHandler(this.SpeedApplierTimer_Tick);
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(512, 230);
            this.Controls.Add(this.tabControl1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.Name = "Main";
            this.ShowIcon = false;
            this.ShowInTaskbar = false;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "VMySpeed - 1.0x";
            this.TopMost = true;
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Form1_FormClosing);
            this.Load += new System.EventHandler(this.Main_Load);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Getter_Bytes)).EndInit();
            this.tabControl1.ResumeLayout(false);
            this.tabPage1.ResumeLayout(false);
            this.tabPage1.PerformLayout();
            this.panel1.ResumeLayout(false);
            ((System.ComponentModel.ISupportInitialize)(this.SpeedTrackBar)).EndInit();
            this.tabPage2.ResumeLayout(false);
            this.tabPage2.PerformLayout();
            this.NotifyIconContextMenu.ResumeLayout(false);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button Setter_Set;
        private System.Windows.Forms.GroupBox groupBox1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.TextBox Setter_Value;
        private System.Windows.Forms.TextBox Setter_Address;
        private System.Windows.Forms.GroupBox groupBox2;
        private System.Windows.Forms.TextBox Searcher_Location;
        private System.Windows.Forms.TextBox Searcher_Value;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.Button Searcher_Search;
        private System.Windows.Forms.GroupBox groupBox3;
        private System.Windows.Forms.TextBox Getter_Address;
        private System.Windows.Forms.TextBox Getter_Value;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.Label label6;
        private System.Windows.Forms.Button Getter_Get;
        private System.Windows.Forms.Label label7;
        private System.Windows.Forms.TextBox ProcessName;
        private System.Windows.Forms.Label label8;
        private System.Windows.Forms.ToolTip toolTip1;
        private System.Windows.Forms.NumericUpDown Getter_Bytes;
        private System.Windows.Forms.TabControl tabControl1;
        private System.Windows.Forms.TabPage tabPage1;
        private System.Windows.Forms.TabPage tabPage2;
        private System.Windows.Forms.Panel panel1;
        private System.Windows.Forms.TrackBar SpeedTrackBar;
        private System.Windows.Forms.Button Speed_100;
        private System.Windows.Forms.Button Speed_75;
        private System.Windows.Forms.Button Speed_50;
        private System.Windows.Forms.Button Speed_300;
        private System.Windows.Forms.Button Speed_200;
        private System.Windows.Forms.Button Speed_150;
        private System.Windows.Forms.NotifyIcon NotifyIcon;
        private System.Windows.Forms.ContextMenuStrip NotifyIconContextMenu;
        private System.Windows.Forms.ToolStripMenuItem ShowWindow;
        private System.Windows.Forms.ToolStripSeparator Separator1;
        private System.Windows.Forms.ToolStripMenuItem Exit;
        private System.Windows.Forms.Timer SpeedApplierTimer;
        private System.Windows.Forms.CheckBox EnabledCheckbox;
        private System.Windows.Forms.Label StatusLabel;
        private System.Windows.Forms.Button AttachDetachButton;
    }
}

