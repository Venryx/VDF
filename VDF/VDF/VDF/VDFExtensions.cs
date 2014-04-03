using System.Drawing;

class VDFExtensions
{
	static bool initialized;
	public static void Init()
	{
		if (initialized)
			return;
		initialized = true;

		// register your custom exporters/importers here; an example is shown below
		VDF.RegisterTypeExporter_Inline<Color>(color=>color.Name);
		VDF.RegisterTypeImporter_Inline<Color>(str=>Color.FromName(str));
	}
}