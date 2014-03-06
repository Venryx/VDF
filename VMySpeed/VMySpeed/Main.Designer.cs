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
            this.label9 = new System.Windows.Forms.Label();
            this.TabControl = new System.Windows.Forms.TabControl();
            this.tabPage1 = new System.Windows.Forms.TabPage();
            this.AttachDetachButton = new System.Windows.Forms.Button();
            this.EnabledCheckbox = new System.Windows.Forms.CheckBox();
            this.StatusLabel = new System.Windows.Forms.Label();
            this.SpeedTrackBar = new System.Windows.Forms.TrackBar();
            this.Speed_10 = new System.Windows.Forms.Button();
            this.Speed_5 = new System.Windows.Forms.Button();
            this.Speed_35 = new System.Windows.Forms.Button();
            this.Speed_25 = new System.Windows.Forms.Button();
            this.Speed_30 = new System.Windows.Forms.Button();
            this.Speed_20 = new System.Windows.Forms.Button();
            this.Speed_15 = new System.Windows.Forms.Button();
            this.tabPage2 = new System.Windows.Forms.TabPage();
            this.tabPage3 = new System.Windows.Forms.TabPage();
            this.StepUp_Key = new System.Windows.Forms.TextBox();
            this.label19 = new System.Windows.Forms.Label();
            this.StepDown_Key = new System.Windows.Forms.TextBox();
            this.label18 = new System.Windows.Forms.Label();
            this.SpeedPreset3_Key = new System.Windows.Forms.TextBox();
            this.label16 = new System.Windows.Forms.Label();
            this.SpeedPreset3_Value = new System.Windows.Forms.NumericUpDown();
            this.label17 = new System.Windows.Forms.Label();
            this.SpeedPreset2_Key = new System.Windows.Forms.TextBox();
            this.label14 = new System.Windows.Forms.Label();
            this.SpeedPreset2_Value = new System.Windows.Forms.NumericUpDown();
            this.label15 = new System.Windows.Forms.Label();
            this.SpeedPreset1_Key = new System.Windows.Forms.TextBox();
            this.label13 = new System.Windows.Forms.Label();
            this.SpeedPreset1_Value = new System.Windows.Forms.NumericUpDown();
            this.label12 = new System.Windows.Forms.Label();
            this.StepSize = new System.Windows.Forms.NumericUpDown();
            this.label11 = new System.Windows.Forms.Label();
            this.tabPage4 = new System.Windows.Forms.TabPage();
            this.ControlMode = new System.Windows.Forms.ComboBox();
            this.label10 = new System.Windows.Forms.Label();
            this.ControlInterval = new System.Windows.Forms.NumericUpDown();
            this.ShowHideMySpeedWindow = new System.Windows.Forms.Button();
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
            this.TabControl.SuspendLayout();
            this.tabPage1.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedTrackBar)).BeginInit();
            this.tabPage2.SuspendLayout();
            this.tabPage3.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedPreset3_Value)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedPreset2_Value)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedPreset1_Value)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.StepSize)).BeginInit();
            this.tabPage4.SuspendLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ControlInterval)).BeginInit();
            this.NotifyIconContextMenu.SuspendLayout();
            this.SuspendLayout();
            // 
            // Setter_Set
            // 
            this.Setter_Set.Location = new System.Drawing.Point(391, 14);
            this.Setter_Set.Name = "Setter_Set";
            this.Setter_Set.Size = new System.Drawing.Size(66, 23);
            this.Setter_Set.TabIndex = 4;
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
            this.groupBox1.Size = new System.Drawing.Size(463, 45);
            this.groupBox1.TabIndex = 3;
            this.groupBox1.TabStop = false;
            this.groupBox1.Text = "Value Setter";
            // 
            // Setter_Value
            // 
            this.Setter_Value.Location = new System.Drawing.Point(265, 16);
            this.Setter_Value.Name = "Setter_Value";
            this.Setter_Value.Size = new System.Drawing.Size(120, 20);
            this.Setter_Value.TabIndex = 3;
            this.Setter_Value.Text = "30;0;0;0";
            // 
            // Setter_Address
            // 
            this.Setter_Address.Location = new System.Drawing.Point(58, 16);
            this.Setter_Address.Name = "Setter_Address";
            this.Setter_Address.Size = new System.Drawing.Size(158, 20);
            this.Setter_Address.TabIndex = 1;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(222, 19);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(37, 13);
            this.label2.TabIndex = 2;
            this.label2.Text = "Value:";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(7, 19);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(48, 13);
            this.label1.TabIndex = 0;
            this.label1.Text = "Address:";
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
            this.groupBox2.Size = new System.Drawing.Size(463, 45);
            this.groupBox2.TabIndex = 4;
            this.groupBox2.TabStop = false;
            this.groupBox2.Text = "Value Searcher";
            // 
            // Searcher_Location
            // 
            this.Searcher_Location.Location = new System.Drawing.Point(351, 16);
            this.Searcher_Location.Name = "Searcher_Location";
            this.Searcher_Location.Size = new System.Drawing.Size(105, 20);
            this.Searcher_Location.TabIndex = 4;
            // 
            // Searcher_Value
            // 
            this.Searcher_Value.Location = new System.Drawing.Point(50, 16);
            this.Searcher_Value.Name = "Searcher_Value";
            this.Searcher_Value.Size = new System.Drawing.Size(166, 20);
            this.Searcher_Value.TabIndex = 1;
            this.Searcher_Value.Text = "30;0;0;0";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(297, 19);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(48, 13);
            this.label3.TabIndex = 3;
            this.label3.Text = "Address:";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(7, 19);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(37, 13);
            this.label4.TabIndex = 0;
            this.label4.Text = "Value:";
            // 
            // Searcher_Search
            // 
            this.Searcher_Search.Location = new System.Drawing.Point(225, 14);
            this.Searcher_Search.Name = "Searcher_Search";
            this.Searcher_Search.Size = new System.Drawing.Size(66, 23);
            this.Searcher_Search.TabIndex = 2;
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
            this.groupBox3.Size = new System.Drawing.Size(463, 45);
            this.groupBox3.TabIndex = 2;
            this.groupBox3.TabStop = false;
            this.groupBox3.Text = "Value Getter";
            // 
            // Getter_Bytes
            // 
            this.Getter_Bytes.Location = new System.Drawing.Point(194, 17);
            this.Getter_Bytes.Name = "Getter_Bytes";
            this.Getter_Bytes.Size = new System.Drawing.Size(41, 20);
            this.Getter_Bytes.TabIndex = 3;
            this.Getter_Bytes.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            // 
            // label8
            // 
            this.label8.AutoSize = true;
            this.label8.Location = new System.Drawing.Point(152, 19);
            this.label8.Name = "label8";
            this.label8.Size = new System.Drawing.Size(36, 13);
            this.label8.TabIndex = 2;
            this.label8.Text = "Bytes:";
            // 
            // Getter_Address
            // 
            this.Getter_Address.Location = new System.Drawing.Point(58, 16);
            this.Getter_Address.Name = "Getter_Address";
            this.Getter_Address.Size = new System.Drawing.Size(88, 20);
            this.Getter_Address.TabIndex = 1;
            // 
            // Getter_Value
            // 
            this.Getter_Value.Location = new System.Drawing.Point(340, 17);
            this.Getter_Value.Name = "Getter_Value";
            this.Getter_Value.Size = new System.Drawing.Size(116, 20);
            this.Getter_Value.TabIndex = 6;
            // 
            // label6
            // 
            this.label6.AutoSize = true;
            this.label6.Location = new System.Drawing.Point(294, 19);
            this.label6.Name = "label6";
            this.label6.Size = new System.Drawing.Size(37, 13);
            this.label6.TabIndex = 5;
            this.label6.Text = "Value:";
            // 
            // Getter_Get
            // 
            this.Getter_Get.Location = new System.Drawing.Point(241, 14);
            this.Getter_Get.Name = "Getter_Get";
            this.Getter_Get.Size = new System.Drawing.Size(45, 23);
            this.Getter_Get.TabIndex = 4;
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
            this.label5.TabIndex = 0;
            this.label5.Text = "Address:";
            this.toolTip1.SetToolTip(this.label5, "Memory address. (in decimal)");
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(5, 16);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(79, 13);
            this.label7.TabIndex = 0;
            this.label7.Text = "Process Name:";
            // 
            // ProcessName
            // 
            this.ProcessName.Location = new System.Drawing.Point(90, 13);
            this.ProcessName.Name = "ProcessName";
            this.ProcessName.Size = new System.Drawing.Size(134, 20);
            this.ProcessName.TabIndex = 1;
            this.ProcessName.Text = "MySpeed";
            // 
            // label9
            // 
            this.label9.AutoSize = true;
            this.label9.Location = new System.Drawing.Point(8, 61);
            this.label9.Name = "label9";
            this.label9.Size = new System.Drawing.Size(81, 13);
            this.label9.TabIndex = 1;
            this.label9.Text = "Control Interval:";
            this.toolTip1.SetToolTip(this.label9, "(the delay between each \'set MySpeed slider value\' action, in milliseconds; only " +
        "applies to \'Set Value\' control mode)");
            // 
            // TabControl
            // 
            this.TabControl.Controls.Add(this.tabPage1);
            this.TabControl.Controls.Add(this.tabPage2);
            this.TabControl.Controls.Add(this.tabPage3);
            this.TabControl.Controls.Add(this.tabPage4);
            this.TabControl.Dock = System.Windows.Forms.DockStyle.Fill;
            this.TabControl.Location = new System.Drawing.Point(0, 0);
            this.TabControl.Name = "TabControl";
            this.TabControl.SelectedIndex = 0;
            this.TabControl.Size = new System.Drawing.Size(487, 222);
            this.TabControl.TabIndex = 0;
            this.TabControl.SelectedIndexChanged += new System.EventHandler(this.TabControl_SelectedIndexChanged);
            // 
            // tabPage1
            // 
            this.tabPage1.Controls.Add(this.AttachDetachButton);
            this.tabPage1.Controls.Add(this.EnabledCheckbox);
            this.tabPage1.Controls.Add(this.StatusLabel);
            this.tabPage1.Controls.Add(this.SpeedTrackBar);
            this.tabPage1.Controls.Add(this.Speed_10);
            this.tabPage1.Controls.Add(this.Speed_5);
            this.tabPage1.Controls.Add(this.Speed_35);
            this.tabPage1.Controls.Add(this.Speed_25);
            this.tabPage1.Controls.Add(this.Speed_30);
            this.tabPage1.Controls.Add(this.Speed_20);
            this.tabPage1.Controls.Add(this.Speed_15);
            this.tabPage1.Location = new System.Drawing.Point(4, 22);
            this.tabPage1.Name = "tabPage1";
            this.tabPage1.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage1.Size = new System.Drawing.Size(479, 196);
            this.tabPage1.TabIndex = 0;
            this.tabPage1.Text = "Main";
            this.tabPage1.UseVisualStyleBackColor = true;
            // 
            // AttachDetachButton
            // 
            this.AttachDetachButton.Location = new System.Drawing.Point(219, 62);
            this.AttachDetachButton.Name = "AttachDetachButton";
            this.AttachDetachButton.Size = new System.Drawing.Size(75, 23);
            this.AttachDetachButton.TabIndex = 3;
            this.AttachDetachButton.Text = "Attach";
            this.AttachDetachButton.UseVisualStyleBackColor = true;
            this.AttachDetachButton.Visible = false;
            this.AttachDetachButton.Click += new System.EventHandler(this.AttachButton_Click);
            // 
            // EnabledCheckbox
            // 
            this.EnabledCheckbox.AutoSize = true;
            this.EnabledCheckbox.Location = new System.Drawing.Point(229, 35);
            this.EnabledCheckbox.Name = "EnabledCheckbox";
            this.EnabledCheckbox.Size = new System.Drawing.Size(65, 17);
            this.EnabledCheckbox.TabIndex = 11;
            this.EnabledCheckbox.Text = "Enabled";
            this.EnabledCheckbox.UseVisualStyleBackColor = true;
            this.EnabledCheckbox.CheckedChanged += new System.EventHandler(this.EnabledCheckbox_CheckedChanged);
            // 
            // StatusLabel
            // 
            this.StatusLabel.Location = new System.Drawing.Point(6, 62);
            this.StatusLabel.Name = "StatusLabel";
            this.StatusLabel.Size = new System.Drawing.Size(176, 23);
            this.StatusLabel.TabIndex = 0;
            this.StatusLabel.Text = "Status: Not Attached";
            this.StatusLabel.TextAlign = System.Drawing.ContentAlignment.MiddleCenter;
            this.StatusLabel.Visible = false;
            // 
            // SpeedTrackBar
            // 
            this.SpeedTrackBar.AutoSize = false;
            this.SpeedTrackBar.LargeChange = 1;
            this.SpeedTrackBar.Location = new System.Drawing.Point(0, 0);
            this.SpeedTrackBar.Maximum = 50;
            this.SpeedTrackBar.Minimum = 3;
            this.SpeedTrackBar.Name = "SpeedTrackBar";
            this.SpeedTrackBar.Size = new System.Drawing.Size(294, 30);
            this.SpeedTrackBar.TabIndex = 2;
            this.SpeedTrackBar.Value = 50;
            this.SpeedTrackBar.ValueChanged += new System.EventHandler(this.SpeedTrackBar_ValueChanged);
            // 
            // Speed_10
            // 
            this.Speed_10.Location = new System.Drawing.Point(45, 29);
            this.Speed_10.Name = "Speed_10";
            this.Speed_10.Size = new System.Drawing.Size(18, 23);
            this.Speed_10.TabIndex = 4;
            this.Speed_10.Text = "1";
            this.Speed_10.UseVisualStyleBackColor = true;
            this.Speed_10.Click += new System.EventHandler(this.Speed_10_Click);
            // 
            // Speed_5
            // 
            this.Speed_5.FlatStyle = System.Windows.Forms.FlatStyle.System;
            this.Speed_5.Location = new System.Drawing.Point(15, 29);
            this.Speed_5.Name = "Speed_5";
            this.Speed_5.Size = new System.Drawing.Size(18, 23);
            this.Speed_5.TabIndex = 3;
            this.Speed_5.Text = ".5";
            this.Speed_5.UseVisualStyleBackColor = true;
            this.Speed_5.Click += new System.EventHandler(this.Speed_5_Click);
            // 
            // Speed_35
            // 
            this.Speed_35.Location = new System.Drawing.Point(180, 29);
            this.Speed_35.Name = "Speed_35";
            this.Speed_35.Size = new System.Drawing.Size(30, 23);
            this.Speed_35.TabIndex = 9;
            this.Speed_35.Text = "3.5";
            this.Speed_35.UseVisualStyleBackColor = true;
            this.Speed_35.Click += new System.EventHandler(this.Speed_35_Click);
            // 
            // Speed_25
            // 
            this.Speed_25.Location = new System.Drawing.Point(123, 29);
            this.Speed_25.Name = "Speed_25";
            this.Speed_25.Size = new System.Drawing.Size(30, 23);
            this.Speed_25.TabIndex = 7;
            this.Speed_25.Text = "2.5";
            this.Speed_25.UseVisualStyleBackColor = true;
            this.Speed_25.Click += new System.EventHandler(this.Speed_25_Click);
            // 
            // Speed_30
            // 
            this.Speed_30.Location = new System.Drawing.Point(157, 29);
            this.Speed_30.Name = "Speed_30";
            this.Speed_30.Size = new System.Drawing.Size(18, 23);
            this.Speed_30.TabIndex = 8;
            this.Speed_30.Text = "3";
            this.Speed_30.UseVisualStyleBackColor = true;
            this.Speed_30.Click += new System.EventHandler(this.Speed_30_Click);
            // 
            // Speed_20
            // 
            this.Speed_20.Location = new System.Drawing.Point(101, 29);
            this.Speed_20.Name = "Speed_20";
            this.Speed_20.Size = new System.Drawing.Size(18, 23);
            this.Speed_20.TabIndex = 6;
            this.Speed_20.Text = "2";
            this.Speed_20.UseVisualStyleBackColor = true;
            this.Speed_20.Click += new System.EventHandler(this.Speed_20_Click);
            // 
            // Speed_15
            // 
            this.Speed_15.Location = new System.Drawing.Point(66, 29);
            this.Speed_15.Name = "Speed_15";
            this.Speed_15.Size = new System.Drawing.Size(30, 23);
            this.Speed_15.TabIndex = 5;
            this.Speed_15.Text = "1.5";
            this.Speed_15.UseVisualStyleBackColor = true;
            this.Speed_15.Click += new System.EventHandler(this.Speed_15_Click);
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
            this.tabPage2.Size = new System.Drawing.Size(479, 196);
            this.tabPage2.TabIndex = 1;
            this.tabPage2.Text = "Memory";
            this.tabPage2.UseVisualStyleBackColor = true;
            // 
            // tabPage3
            // 
            this.tabPage3.Controls.Add(this.StepUp_Key);
            this.tabPage3.Controls.Add(this.label19);
            this.tabPage3.Controls.Add(this.StepDown_Key);
            this.tabPage3.Controls.Add(this.label18);
            this.tabPage3.Controls.Add(this.SpeedPreset3_Key);
            this.tabPage3.Controls.Add(this.label16);
            this.tabPage3.Controls.Add(this.SpeedPreset3_Value);
            this.tabPage3.Controls.Add(this.label17);
            this.tabPage3.Controls.Add(this.SpeedPreset2_Key);
            this.tabPage3.Controls.Add(this.label14);
            this.tabPage3.Controls.Add(this.SpeedPreset2_Value);
            this.tabPage3.Controls.Add(this.label15);
            this.tabPage3.Controls.Add(this.SpeedPreset1_Key);
            this.tabPage3.Controls.Add(this.label13);
            this.tabPage3.Controls.Add(this.SpeedPreset1_Value);
            this.tabPage3.Controls.Add(this.label12);
            this.tabPage3.Controls.Add(this.StepSize);
            this.tabPage3.Controls.Add(this.label11);
            this.tabPage3.Location = new System.Drawing.Point(4, 22);
            this.tabPage3.Name = "tabPage3";
            this.tabPage3.Padding = new System.Windows.Forms.Padding(3);
            this.tabPage3.Size = new System.Drawing.Size(479, 196);
            this.tabPage3.TabIndex = 2;
            this.tabPage3.Text = "Hotkeys";
            this.tabPage3.UseVisualStyleBackColor = true;
            // 
            // StepUp_Key
            // 
            this.StepUp_Key.Location = new System.Drawing.Point(337, 84);
            this.StepUp_Key.Name = "StepUp_Key";
            this.StepUp_Key.Size = new System.Drawing.Size(100, 20);
            this.StepUp_Key.TabIndex = 17;
            this.StepUp_Key.Text = "Ctrl+Alt+]";
            // 
            // label19
            // 
            this.label19.AutoSize = true;
            this.label19.Location = new System.Drawing.Point(307, 86);
            this.label19.Name = "label19";
            this.label19.Size = new System.Drawing.Size(24, 13);
            this.label19.TabIndex = 16;
            this.label19.Text = "Up:";
            // 
            // StepDown_Key
            // 
            this.StepDown_Key.Location = new System.Drawing.Point(201, 83);
            this.StepDown_Key.Name = "StepDown_Key";
            this.StepDown_Key.Size = new System.Drawing.Size(100, 20);
            this.StepDown_Key.TabIndex = 15;
            this.StepDown_Key.Text = "Ctrl+Alt+[";
            // 
            // label18
            // 
            this.label18.AutoSize = true;
            this.label18.Location = new System.Drawing.Point(160, 88);
            this.label18.Name = "label18";
            this.label18.Size = new System.Drawing.Size(38, 13);
            this.label18.TabIndex = 14;
            this.label18.Text = "Down:";
            // 
            // SpeedPreset3_Key
            // 
            this.SpeedPreset3_Key.Location = new System.Drawing.Point(201, 57);
            this.SpeedPreset3_Key.Name = "SpeedPreset3_Key";
            this.SpeedPreset3_Key.Size = new System.Drawing.Size(100, 20);
            this.SpeedPreset3_Key.TabIndex = 11;
            this.SpeedPreset3_Key.Text = "Ctrl+Alt+=";
            // 
            // label16
            // 
            this.label16.AutoSize = true;
            this.label16.Location = new System.Drawing.Point(160, 59);
            this.label16.Name = "label16";
            this.label16.Size = new System.Drawing.Size(28, 13);
            this.label16.TabIndex = 10;
            this.label16.Text = "Key:";
            // 
            // SpeedPreset3_Value
            // 
            this.SpeedPreset3_Value.DecimalPlaces = 1;
            this.SpeedPreset3_Value.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.SpeedPreset3_Value.Location = new System.Drawing.Point(95, 57);
            this.SpeedPreset3_Value.Maximum = new decimal(new int[] {
            5,
            0,
            0,
            0});
            this.SpeedPreset3_Value.Minimum = new decimal(new int[] {
            3,
            0,
            0,
            65536});
            this.SpeedPreset3_Value.Name = "SpeedPreset3_Value";
            this.SpeedPreset3_Value.Size = new System.Drawing.Size(59, 20);
            this.SpeedPreset3_Value.TabIndex = 9;
            this.SpeedPreset3_Value.Value = new decimal(new int[] {
            20,
            0,
            0,
            65536});
            // 
            // label17
            // 
            this.label17.AutoSize = true;
            this.label17.Location = new System.Drawing.Point(6, 59);
            this.label17.Name = "label17";
            this.label17.Size = new System.Drawing.Size(83, 13);
            this.label17.TabIndex = 8;
            this.label17.Text = "Speed Preset 3:";
            // 
            // SpeedPreset2_Key
            // 
            this.SpeedPreset2_Key.Location = new System.Drawing.Point(201, 31);
            this.SpeedPreset2_Key.Name = "SpeedPreset2_Key";
            this.SpeedPreset2_Key.Size = new System.Drawing.Size(100, 20);
            this.SpeedPreset2_Key.TabIndex = 7;
            this.SpeedPreset2_Key.Text = "Ctrl+Alt+-";
            // 
            // label14
            // 
            this.label14.AutoSize = true;
            this.label14.Location = new System.Drawing.Point(160, 33);
            this.label14.Name = "label14";
            this.label14.Size = new System.Drawing.Size(28, 13);
            this.label14.TabIndex = 6;
            this.label14.Text = "Key:";
            // 
            // SpeedPreset2_Value
            // 
            this.SpeedPreset2_Value.DecimalPlaces = 1;
            this.SpeedPreset2_Value.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.SpeedPreset2_Value.Location = new System.Drawing.Point(95, 31);
            this.SpeedPreset2_Value.Maximum = new decimal(new int[] {
            5,
            0,
            0,
            0});
            this.SpeedPreset2_Value.Minimum = new decimal(new int[] {
            3,
            0,
            0,
            65536});
            this.SpeedPreset2_Value.Name = "SpeedPreset2_Value";
            this.SpeedPreset2_Value.Size = new System.Drawing.Size(59, 20);
            this.SpeedPreset2_Value.TabIndex = 5;
            this.SpeedPreset2_Value.Value = new decimal(new int[] {
            15,
            0,
            0,
            65536});
            // 
            // label15
            // 
            this.label15.AutoSize = true;
            this.label15.Location = new System.Drawing.Point(6, 33);
            this.label15.Name = "label15";
            this.label15.Size = new System.Drawing.Size(83, 13);
            this.label15.TabIndex = 4;
            this.label15.Text = "Speed Preset 2:";
            // 
            // SpeedPreset1_Key
            // 
            this.SpeedPreset1_Key.Location = new System.Drawing.Point(201, 5);
            this.SpeedPreset1_Key.Name = "SpeedPreset1_Key";
            this.SpeedPreset1_Key.Size = new System.Drawing.Size(100, 20);
            this.SpeedPreset1_Key.TabIndex = 3;
            this.SpeedPreset1_Key.Text = "Ctrl+Alt+0";
            // 
            // label13
            // 
            this.label13.AutoSize = true;
            this.label13.Location = new System.Drawing.Point(160, 7);
            this.label13.Name = "label13";
            this.label13.Size = new System.Drawing.Size(28, 13);
            this.label13.TabIndex = 2;
            this.label13.Text = "Key:";
            // 
            // SpeedPreset1_Value
            // 
            this.SpeedPreset1_Value.DecimalPlaces = 1;
            this.SpeedPreset1_Value.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.SpeedPreset1_Value.Location = new System.Drawing.Point(95, 5);
            this.SpeedPreset1_Value.Maximum = new decimal(new int[] {
            5,
            0,
            0,
            0});
            this.SpeedPreset1_Value.Minimum = new decimal(new int[] {
            3,
            0,
            0,
            65536});
            this.SpeedPreset1_Value.Name = "SpeedPreset1_Value";
            this.SpeedPreset1_Value.Size = new System.Drawing.Size(59, 20);
            this.SpeedPreset1_Value.TabIndex = 1;
            this.SpeedPreset1_Value.Value = new decimal(new int[] {
            1,
            0,
            0,
            0});
            // 
            // label12
            // 
            this.label12.AutoSize = true;
            this.label12.Location = new System.Drawing.Point(6, 7);
            this.label12.Name = "label12";
            this.label12.Size = new System.Drawing.Size(83, 13);
            this.label12.TabIndex = 0;
            this.label12.Text = "Speed Preset 1:";
            // 
            // StepSize
            // 
            this.StepSize.DecimalPlaces = 1;
            this.StepSize.Increment = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.StepSize.Location = new System.Drawing.Point(95, 84);
            this.StepSize.Maximum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.StepSize.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            this.StepSize.Name = "StepSize";
            this.StepSize.Size = new System.Drawing.Size(59, 20);
            this.StepSize.TabIndex = 13;
            this.StepSize.Value = new decimal(new int[] {
            1,
            0,
            0,
            65536});
            // 
            // label11
            // 
            this.label11.AutoSize = true;
            this.label11.Location = new System.Drawing.Point(6, 86);
            this.label11.Name = "label11";
            this.label11.Size = new System.Drawing.Size(55, 13);
            this.label11.TabIndex = 12;
            this.label11.Text = "Step Size:";
            // 
            // tabPage4
            // 
            this.tabPage4.Controls.Add(this.ControlMode);
            this.tabPage4.Controls.Add(this.label10);
            this.tabPage4.Controls.Add(this.ControlInterval);
            this.tabPage4.Controls.Add(this.label9);
            this.tabPage4.Controls.Add(this.ShowHideMySpeedWindow);
            this.tabPage4.Location = new System.Drawing.Point(4, 22);
            this.tabPage4.Name = "tabPage4";
            this.tabPage4.Size = new System.Drawing.Size(479, 196);
            this.tabPage4.TabIndex = 0;
            this.tabPage4.Text = "Extra";
            this.tabPage4.UseVisualStyleBackColor = true;
            // 
            // ControlMode
            // 
            this.ControlMode.DropDownStyle = System.Windows.Forms.ComboBoxStyle.DropDownList;
            this.ControlMode.FormattingEnabled = true;
            this.ControlMode.Items.AddRange(new object[] {
            "Set Value (keep updating)",
            "Set Range (force once)"});
            this.ControlMode.Location = new System.Drawing.Point(95, 32);
            this.ControlMode.Name = "ControlMode";
            this.ControlMode.Size = new System.Drawing.Size(156, 21);
            this.ControlMode.TabIndex = 4;
            this.ControlMode.SelectedIndexChanged += new System.EventHandler(this.ControlMode_SelectedIndexChanged);
            // 
            // label10
            // 
            this.label10.AutoSize = true;
            this.label10.Location = new System.Drawing.Point(8, 35);
            this.label10.Name = "label10";
            this.label10.Size = new System.Drawing.Size(73, 13);
            this.label10.TabIndex = 3;
            this.label10.Text = "Control Mode:";
            // 
            // ControlInterval
            // 
            this.ControlInterval.Location = new System.Drawing.Point(95, 59);
            this.ControlInterval.Maximum = new decimal(new int[] {
            1000,
            0,
            0,
            0});
            this.ControlInterval.Minimum = new decimal(new int[] {
            1,
            0,
            0,
            0});
            this.ControlInterval.Name = "ControlInterval";
            this.ControlInterval.Size = new System.Drawing.Size(156, 20);
            this.ControlInterval.TabIndex = 2;
            this.ControlInterval.Value = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.ControlInterval.ValueChanged += new System.EventHandler(this.SliderControlFrequency_ValueChanged);
            // 
            // ShowHideMySpeedWindow
            // 
            this.ShowHideMySpeedWindow.Location = new System.Drawing.Point(3, 3);
            this.ShowHideMySpeedWindow.Name = "ShowHideMySpeedWindow";
            this.ShowHideMySpeedWindow.Size = new System.Drawing.Size(248, 23);
            this.ShowHideMySpeedWindow.TabIndex = 0;
            this.ShowHideMySpeedWindow.Text = "Move MySpeed Window Off-Screen";
            this.ShowHideMySpeedWindow.UseVisualStyleBackColor = true;
            this.ShowHideMySpeedWindow.Click += new System.EventHandler(this.ShowHideMySpeedWindow_Click);
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
            this.ClientSize = new System.Drawing.Size(487, 222);
            this.Controls.Add(this.TabControl);
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
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Main_FormClosing);
            this.groupBox1.ResumeLayout(false);
            this.groupBox1.PerformLayout();
            this.groupBox2.ResumeLayout(false);
            this.groupBox2.PerformLayout();
            this.groupBox3.ResumeLayout(false);
            this.groupBox3.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.Getter_Bytes)).EndInit();
            this.TabControl.ResumeLayout(false);
            this.tabPage1.ResumeLayout(false);
            this.tabPage1.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedTrackBar)).EndInit();
            this.tabPage2.ResumeLayout(false);
            this.tabPage2.PerformLayout();
            this.tabPage3.ResumeLayout(false);
            this.tabPage3.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedPreset3_Value)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedPreset2_Value)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.SpeedPreset1_Value)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.StepSize)).EndInit();
            this.tabPage4.ResumeLayout(false);
            this.tabPage4.PerformLayout();
            ((System.ComponentModel.ISupportInitialize)(this.ControlInterval)).EndInit();
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
        private System.Windows.Forms.TabControl TabControl;
        private System.Windows.Forms.TabPage tabPage1;
        private System.Windows.Forms.TabPage tabPage2;
        private System.Windows.Forms.TrackBar SpeedTrackBar;
        private System.Windows.Forms.Button Speed_10;
        private System.Windows.Forms.Button Speed_5;
        private System.Windows.Forms.Button Speed_30;
        private System.Windows.Forms.Button Speed_20;
        private System.Windows.Forms.Button Speed_15;
        private System.Windows.Forms.NotifyIcon NotifyIcon;
        private System.Windows.Forms.ContextMenuStrip NotifyIconContextMenu;
        private System.Windows.Forms.ToolStripMenuItem ShowWindow;
        private System.Windows.Forms.ToolStripSeparator Separator1;
        private System.Windows.Forms.ToolStripMenuItem Exit;
        private System.Windows.Forms.Timer SpeedApplierTimer;
        private System.Windows.Forms.CheckBox EnabledCheckbox;
        private System.Windows.Forms.Label StatusLabel;
        private System.Windows.Forms.Button AttachDetachButton;
        private System.Windows.Forms.TabPage tabPage4;
        private System.Windows.Forms.Button ShowHideMySpeedWindow;
        private System.Windows.Forms.Label label9;
        private System.Windows.Forms.NumericUpDown ControlInterval;
        private System.Windows.Forms.Button Speed_25;
        private System.Windows.Forms.Button Speed_35;
        private System.Windows.Forms.ComboBox ControlMode;
        private System.Windows.Forms.Label label10;
        private System.Windows.Forms.TabPage tabPage3;
        private System.Windows.Forms.NumericUpDown StepSize;
        private System.Windows.Forms.Label label11;
        private System.Windows.Forms.NumericUpDown SpeedPreset1_Value;
        private System.Windows.Forms.Label label12;
        private System.Windows.Forms.Label label16;
        private System.Windows.Forms.NumericUpDown SpeedPreset3_Value;
        private System.Windows.Forms.Label label17;
        private System.Windows.Forms.TextBox SpeedPreset2_Key;
        private System.Windows.Forms.Label label14;
        private System.Windows.Forms.NumericUpDown SpeedPreset2_Value;
        private System.Windows.Forms.Label label15;
        private System.Windows.Forms.TextBox SpeedPreset1_Key;
        private System.Windows.Forms.Label label13;
        private System.Windows.Forms.TextBox StepUp_Key;
        private System.Windows.Forms.Label label19;
        private System.Windows.Forms.TextBox StepDown_Key;
        private System.Windows.Forms.Label label18;
        private System.Windows.Forms.TextBox SpeedPreset3_Key;
    }
}

