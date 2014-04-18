interface Object { Should(): { obj: any; Be(value, message?: string); } }
/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
	Saving.Init();
	window["oldTest"](title, testFunc);
}*/
class Saving
{
	static initialized: boolean;
	static Init()
	{
		if (this.initialized)
			return;
		this.initialized = true;
		Object.prototype.AddFunction_Inline = function Should() { return { obj: this, Be: function(value, message?: string) { equal(this.obj, value, message); } }; }
		VDF.RegisterTypeExporter_Inline("Guid", id => id.ToString());
		VDF.RegisterTypeImporter_Inline("Guid", str => new Guid(str));
		VDF.RegisterTypeExporter_Inline("Vector3", point => point.x + "," + point.y + "," + point.z);
		VDF.RegisterTypeImporter_Inline("Vector3", str =>
		{
			var parts: Array<string> = str.split(',');
			return new Vector3(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
		});
	}

	static RunTests()
	{
		test("VDFNode_Level0_BaseValue", (assert?: QUnitAssert) =>
		{
			var a = new VDFNode();
			a.baseValue = "Root string.";
			a.ToString().Should().Be("Root string.");

			a = new VDFNode();
			a[0] = new VDFNode("Root string also.");
			a.ToString().Should().Be("Root string also.");
		});

		test("VDFNode_Level0_Metadata_Type", (assert?: QUnitAssert) =>
		{
			var a = new VDFNode();
			a.metadata_type = "string";
			a.baseValue = "Root string.";
			a.ToString().Should().Be("<string>Root string.");
		});

		test("VDFNode_Level1_BaseValues", (assert?: QUnitAssert) =>
		{
			var a = new VDFNode();
			a["bool"] = new VDFNode("false");
			a["int"] = new VDFNode("5");
			a["float"] = new VDFNode(".5");
			a["string"] = new VDFNode("Prop value string.");
			a.ToString().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
		});
	}
}