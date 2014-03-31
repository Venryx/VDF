using System.IO;
using System.Windows.Forms;

namespace SystemMaker
{
	public partial class Main : Form
	{
		public Main() { InitializeComponent(); }

		private void Save_Click(object sender, System.EventArgs e)
		{
			var testPerson = Test1.CreateTestPerson();
			string vdf = VDF.ToVDF(testPerson);
			var file = new FileInfo(SavePath.Text);
			if (!file.Directory.Exists)
				file.Directory.Create();
			File.WriteAllText(file.FullName, vdf);
			V.Nothing();
		}

		private void Load_Click(object sender, System.EventArgs e)
		{
			var file = new FileInfo(LoadPath.Text);
			string vdf = File.ReadAllText(file.FullName);
			var testRoot = VDF.FromVDF<VObject>(vdf);
			V.Nothing();
		}
	}
}