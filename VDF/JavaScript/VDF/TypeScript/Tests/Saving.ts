interface Object { Should(): { obj: any; Be(value, message?: string); } }
/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
	Saving.Init();
	window["oldTest"](title, testFunc);
}*/
class TypeWithEmptyStringProp
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		emptyString: new VDFPropInfo("string", null, null, null, false)
	});
	emptyString: string = "";
}
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
class TypeWithList_PopOutData
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		list: new VDFPropInfo("List[string]", true, true)
	});
	list: List<string> = new List("string", "A", "B");
}
class TypeWithList_PopOutItemData
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		list: new VDFPropInfo("List[string]", true, false, true)
	});
	list: List<string> = new List("string", "A", "B");
}
class TypeWithPreSerializePrepMethod
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		preSerializeWasCalled: new VDFPropInfo("bool", true)
	});
	preSerializeWasCalled: boolean;
	VDFPreSerialize(): void { this.preSerializeWasCalled = true; }
}
class TypeWithMixOfProps
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		Bool: new VDFPropInfo("bool", true),
		Int: new VDFPropInfo("int", true),
		Float: new VDFPropInfo("float", true),
		String: new VDFPropInfo("string", true),
		list: new VDFPropInfo("List[string]", true),
		nestedList: new VDFPropInfo("List[List[string]]", true),
	});
	Bool = true;
	Int = 5;
	Float = .5;
	String = "Prop value string.";
	list = new List<string>("string", "2A", "2B");
	nestedList = new List<List<string>>("List[string]", new List<string>("string", "1A"));
}
enum Enum1 { _IsEnum, A, B, C }
class Level1
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		level2: new VDFPropInfo("Level2", true)
	});
	level2: Level2 = new Level2();
}
class Level2
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		level3_first: new VDFPropInfo("Level3", true),
		level3_second: new VDFPropInfo("Level3", true)
	});
	level3_first: Level3 = new Level3();
	level3_second: Level3 = new Level3();
}
class Level3
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		message: new VDFPropInfo("string", true, true)
	});
	message: string = "DeepString";
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
		// ToVDF
		// ==================

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
			a.ToVDF().Should().Be("string>Root string.");
		});
		test("ToVDF_Level0_Metadata_Type_Collapsed", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List("string"), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("string>>");
			a = VDFSaver.ToVDFNode(new List("List[string]", new List("string", "1A", "1B", "1C")), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("List[List[string]]>>{1A|1B|1C}"); // only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
		});
		test("ToVDF_Level0_EnumDefault", () =>
		{
			var a = VDFSaver.ToVDFNode(Enum1.A, "Enum1");
			a.ToVDF().Should().Be("A");
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
		test("ToVDF_Level1_BaseValuesThatNeedEscaping", ()=>
		{
			var a = new VDFNode("string>In-string VDF data.");
			a.ToVDF().Should().Be("@@string>In-string VDF data.@@");
		});
		test("ToVDF_Level1_IgnoreEmptyString", ()=>{ VDF.Serialize(new TypeWithEmptyStringProp(), "TypeWithEmptyStringProp").Should().Be(""); });
		test("ToVDF_Level1_NullValues", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
			a["obj"].metadata_type.Should().Be(""); // type "null" should be collapsed
			a["obj"].baseValue.Should().Be("null");
			a["strings"].metadata_type.Should().Be("");
			a["strings"].baseValue.Should().Be("null");
			equal(a["strings2"].metadata_type, null); // unmarked type
			equal(a["strings2"].baseValue, null); // it's a List, so it shouldn't have a base-value
			a["strings2"].items.length.Should().Be(0);
			a.ToVDF().Should().Be("TypeWithNullProps>obj{>null}strings{>null}strings2{}");
		});
		test("ToVDF_Level1_ListItems_PopOutData", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithList_PopOutData(), "TypeWithList_PopOutData");
			a.ToVDF().Should().Be("list{#}\n\
	A|B");
		});
		test("ToVDF_Level1_ListItems_PopOutItemData", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithList_PopOutItemData(), "TypeWithList_PopOutItemData");
			a.ToVDF().Should().Be("list{#}\n\
	A\n\
	B");
		});
		test("ToVDF_Level1_ListItems_Null", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List("string", null));
			a[0].metadata_type.Should().Be("");
			a[0].baseValue.Should().Be("null");
			a.ToVDF().Should().Be("string>>>null");
		});
		test("ToVDF_Level1_DictionaryValues_Null", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Dictionary("string", "string", ["key1", null]));
			a["key1"].metadata_type.Should().Be("");
			a["key1"].baseValue.Should().Be("null");
			a.ToVDF().Should().Be("string,string>>key1{>null}");
		});
		test("ToVDF_Level1_AnonymousTypeProperties_MarkNoTypes", ()=>
		{
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Float: .5, String: "Prop value string."}, new VDFSaveOptions(null, VDFTypeMarking.None));
			a["Bool"].baseValue.Should().Be("false");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("Bool{false}Int{5}Float{.5}String{Prop value string.}");
		});
		test("ToVDF_Level1_AnonymousTypeProperties_MarkAllTypes", ()=>
		{
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Float: .5, String: "Prop value string."}, new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("Bool{>false}Int{>5}Float{>.5}String{Prop value string.}");
		});
		test("ToVDF_Level1_PreSerializePreparation", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod());
			a["preSerializeWasCalled"].AsBool.Should().Be(true);
			a.ToVDF().Should().Be("TypeWithPreSerializePrepMethod>preSerializeWasCalled{true}");
		});
		test("ToVDF_Level1_TypeProperties_MarkForNone", () =>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, VDFTypeMarking.None));
			a["Bool"].baseValue.Should().Be("true");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a["list"][0].baseValue.Should().Be("2A");
			a["list"][1].baseValue.Should().Be("2B");
			a["nestedList"][0][0].baseValue.Should().Be("1A");
			a.ToVDF().Should().Be("Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
		});
		test("ToVDF_Level1_TypeProperties_MarkForAssembly", () =>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, VDFTypeMarking.Assembly));
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
		});
		test("ToVDF_Level1_TypeProperties_MarkForAssemblyExternal", () =>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{>true}Int{>5}Float{>.5}String{Prop value string.}list{string>>2A|2B}nestedList{List[List[string]]>>{string>>1A}}");
		});
		test("ToVDF_Level1_TypeProperties_MarkForAssemblyExternalNoCollapse", () =>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternalNoCollapse));
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{bool>true}Int{int>5}Float{float>.5}String{string>Prop value string.}list{List[string]>>string>2A|string>2B}nestedList{List[List[string]]>>{List[string]>>string>1A}}");
		});
		test("ToVDF_Level3_DeepNestedPoppedOutData", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions(null, VDFTypeMarking.None));
			a.ToVDF().Should().Be("level2{level3_first{message{#}}level3_second{message{#}}}\n\
	DeepString\n\
	#DeepString".replace(/\r/g, ""));
		});
	}
}