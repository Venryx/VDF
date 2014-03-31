namespace SystemMaker
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
			System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(Main));
			this.Save = new System.Windows.Forms.Button();
			this.Load = new System.Windows.Forms.Button();
			this.SavePath = new System.Windows.Forms.TextBox();
			this.LoadPath = new System.Windows.Forms.TextBox();
			this.SuspendLayout();
			// 
			// Save
			// 
			this.Save.Location = new System.Drawing.Point(217, 13);
			this.Save.Name = "Save";
			this.Save.Size = new System.Drawing.Size(76, 23);
			this.Save.TabIndex = 0;
			this.Save.Text = "Save";
			this.Save.UseVisualStyleBackColor = true;
			this.Save.Click += new System.EventHandler(this.Save_Click);
			// 
			// Load
			// 
			this.Load.Location = new System.Drawing.Point(217, 42);
			this.Load.Name = "Load";
			this.Load.Size = new System.Drawing.Size(76, 23);
			this.Load.TabIndex = 1;
			this.Load.Text = "Load";
			this.Load.UseVisualStyleBackColor = true;
			this.Load.Click += new System.EventHandler(this.Load_Click);
			// 
			// SavePath
			// 
			this.SavePath.Location = new System.Drawing.Point(13, 15);
			this.SavePath.Name = "SavePath";
			this.SavePath.Size = new System.Drawing.Size(198, 20);
			this.SavePath.TabIndex = 2;
			this.SavePath.Text = "Test1/Save1.vdf";
			// 
			// LoadPath
			// 
			this.LoadPath.Location = new System.Drawing.Point(13, 44);
			this.LoadPath.Name = "LoadPath";
			this.LoadPath.Size = new System.Drawing.Size(198, 20);
			this.LoadPath.TabIndex = 3;
			this.LoadPath.Text = "Test1/Save1.vdf";
			// 
			// Main
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(305, 77);
			this.Controls.Add(this.LoadPath);
			this.Controls.Add(this.Load);
			this.Controls.Add(this.Save);
			this.Controls.Add(this.SavePath);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
			this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
			this.MaximizeBox = false;
			this.MinimizeBox = false;
			this.Name = "Main";
			this.ShowIcon = false;
			this.ShowInTaskbar = false;
			this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
			this.Text = "SystemMaker";
			this.TopMost = true;
			this.ResumeLayout(false);
			this.PerformLayout();

		}

		#endregion

		private System.Windows.Forms.Button Save;
		private System.Windows.Forms.Button Load;
		private System.Windows.Forms.TextBox SavePath;
		private System.Windows.Forms.TextBox LoadPath;

	}
}