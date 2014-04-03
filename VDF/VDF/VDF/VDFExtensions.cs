using System;
using Color = System.Drawing.Color;

static class VDFExtensions
{
	public static void Init() {} // forces the static initializer below to run
	static VDFExtensions() // register your custom exporters/importers here
	{
		VDF.RegisterTypeExporter_Inline<Color>(color => color.Name);
		VDF.RegisterTypeImporter_Inline<Color>(str => Color.FromName(str));
		VDF.RegisterTypeExporter_Inline<Guid>(id => id.ToString());
		VDF.RegisterTypeImporter_Inline<Guid>(str => new Guid(str));
	}
}