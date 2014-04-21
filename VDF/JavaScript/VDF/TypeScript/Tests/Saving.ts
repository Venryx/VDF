interface Object { Should(): { obj: any; Be(value, message?: string); } }
/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
	Saving.Init();
	window["oldTest"](title, testFunc);
}*/
class TypeWithNullProps
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		obj: new VDFPropInfo("object", true),
		strings: new VDFPropInfo("List[string]", true),
		strings2: new VDFPropInfo("List[string]", true)
	});
	obj: any;
	strings: List<string>;
	strings2: List<string> = new List<string>("string");
}
class Saving
{
	static initialized: boolean;
	static Init()
	{
		if (this.initialized)
			return;
		this.initialized = true;
		Object.prototype._AddFunction_Inline = function Should()
		{
			return 0 || // fix for auto-semicolon-insertion
			{
				Be: (value, message?: string) => { equal(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); },
				BeExactly: (value, message?: string) => { strictEqual(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); }
			};
		};
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
		test("ToVDF_Level0_BaseValue", ()=>
		{
			var a = new VDFNode();
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("Root string.");

			a = new VDFNode();
			a[0] = new VDFNode("Root string also.");
			a.ToVDF().Should().Be("Root string also.");
		});
		test("ToVDF_Level0_Metadata_Type", ()=>
		{
			var a = new VDFNode();
			a.metadata_type = "string";
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("<string>Root string.");
		});

		test("ToVDF_Level1_BaseValues", ()=>
		{
			var a = new VDFNode();
			a["bool"] = new VDFNode("false");
			a["int"] = new VDFNode("5");
			a["float"] = new VDFNode(".5");
			a["string"] = new VDFNode("Prop value string.");
			a.ToVDF().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
		});
		test("ToVDF_Level1_AnonymousTypeProperties", ()=>
		{
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Float: .5, String: "Prop value string." });
			a["Bool"].baseValue.Should().Be("false");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("Bool{<bool>false}Int{<int>5}Float{<float>.5}String{<string>Prop value string.}");
		});
		test("ToVDF_Level1_NullValues", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
			a["obj"].baseValue.Should().Be("[#null]");
			a["strings"].baseValue.Should().Be("[#null]");
			equal(a["strings2"].baseValue, null); // it's just a VDFNode, with no children, representing a List
			a.ToVDF().Should().Be("obj{[#null]}strings{[#null]}strings2{}");
		});
		test("ToVDF_Level1_ListItems_Null", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<string>("string", null));
			a[0].baseValue.Should().Be("[#null]");
			a.ToVDF().Should().Be("[#null]");
		});
		test("ToVDF_Level1_DictionaryValues_Null", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Dictionary<string, string>("string", "string", ["key1", null]));
			a.GetDictionaryValueNode("key1").baseValue.Should().Be("[#null]");
			a.ToVDF().Should().Be("{key1|[#null]}");
		});
	}
}