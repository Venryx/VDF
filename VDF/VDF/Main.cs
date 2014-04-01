using System.IO;
using System.Windows.Forms;

namespace SystemMaker
{
	public partial class Main : Form
	{
		public Main() { InitializeComponent(); }

		private void Save_Click(object sender, System.EventArgs e)
		{
			var testWorld = Test1.CreateWorld();
			
			// serialize it, and save it to file
			string vdf = VDF.ToVDF(testWorld);
			var file = new FileInfo(SavePath.Text);
			if (!file.Directory.Exists)
				file.Directory.Create();
			File.WriteAllText(file.FullName, vdf);
		}

		private void Load_Click(object sender, System.EventArgs e)
		{
			// load from file
			var file = new FileInfo(LoadPath.Text);
			string vdf = File.ReadAllText(file.FullName);
			var testWorld = VDF.FromVDF<World>(vdf);

			// reserialize it, and save it to second file, to check data
			string vdf2 = VDF.ToVDF(testWorld);
			var file2 = new FileInfo(LoadPath.Text.Split(new []{'.'})[0] + "_Resaved.vdf");
			if (!file2.Directory.Exists)
				file2.Directory.Create();
			File.WriteAllText(file2.FullName, vdf2);
		}
	}
}