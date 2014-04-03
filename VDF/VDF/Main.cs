using System;
using System.IO;
using System.Windows.Forms;

namespace SystemMaker
{
	public partial class Main : Form
	{
		static Main()
		{
			VDFExtensions.Init(); // call this first, so we can overwrite ones, if we need to
			VDF.RegisterTypeExporter_Inline<Guid>(id => ""); //id.ToString());
			VDF.RegisterTypeImporter_Inline<Guid>(str => new Guid(str));
			VDF.RegisterTypeExporter_Inline<Vector3>(point => point.x + "," + point.y + "," + point.z);
			VDF.RegisterTypeImporter_Inline<Vector3>(str =>
			{
				string[] parts = str.Split(new[] { ',' });
				return new Vector3(float.Parse(parts[0]), float.Parse(parts[1]), float.Parse(parts[2]));
			});
		}

		public Main() { InitializeComponent(); }

		private void Save_Click(object sender, System.EventArgs e)
		{
			var testWorld = Test1.CreateWorld();
			
			// serialize it, and save it to file
			string vdf = VDF.Serialize(testWorld, new VDFSaveOptions(new []{typeof(VObject).GetMember("id")[0]}));
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
			var testWorld = VDF.Deserialize<World>(vdf);

			// reserialize it, and save it to second file, to check data
			string vdf2 = VDF.Serialize(testWorld, new VDFSaveOptions(new[] { typeof(VObject).GetMember("id")[0] }));
			var file2 = new FileInfo(LoadPath.Text.Split(new []{'.'})[0] + "_Resaved.vdf");
			if (!file2.Directory.Exists)
				file2.Directory.Create();
			File.WriteAllText(file2.FullName, vdf2);
		}
	}
}