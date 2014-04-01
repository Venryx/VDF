using System;
using System.Drawing;

class VDFExtensions
{
	static bool initialized;
	public static void Init()
	{
		if (initialized)
			return;
		initialized = true;

		VDF.RegisterTypeExporter_Inline<Guid>(id=>""); //obj.ToString());
		VDF.RegisterTypeImporter_Inline<Guid>(str=>new Guid(str));
		VDF.RegisterTypeExporter_Inline<Color>(color=>color.Name);
		VDF.RegisterTypeImporter_Inline<Color>(str=>Color.FromName(str));
		VDF.RegisterTypeExporter_Inline<Vector3>(point=>point.x + "," + point.y + "," + point.z);
		VDF.RegisterTypeImporter_Inline<Vector3>(str=>
		{
			string[] parts = str.Split(new[] {','});
			return new Vector3(float.Parse(parts[0]), float.Parse(parts[1]), float.Parse(parts[2]));
		});
	}
}