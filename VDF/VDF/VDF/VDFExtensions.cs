using System.Drawing;

static class VDFExtensions
{
	public static void Init() {} // forces the static initializer below to run
	static VDFExtensions() // register your custom exporters/importers here
	{
		VDF.RegisterTypeExporter_Inline<Color>(color=>color.Name);
		VDF.RegisterTypeImporter_Inline<Color>(str=>Color.FromName(str));
	}
}