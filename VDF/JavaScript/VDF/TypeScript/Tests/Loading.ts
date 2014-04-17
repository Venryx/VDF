interface Object { Should(): { obj: any; Be(value, message?: string); } }
/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
	Loading.Init();
	window["oldTest"](title, testFunc);
}*/
class Loading
{
	static initialized: boolean;
	static Init()
	{
		if (this.initialized)
			return;
		this.initialized = true;
		Object.AddProtoFunction_Inline = function Should() { return { obj: this, Be: function (value, message?: string) { equal(this.obj, value, message); } }; }
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
		test("VDFNode_Level0_Comment", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("// comment\n\
			Root string.");
			a.items[0].baseValue.Should().Be("			Root string.");
		});
		test("VDFNode_Level0_BaseValue", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("Root string.");
			ok(a.baseValue == null); // base-values should only ever be at one level
			a.items[0].baseValue.Should().Be("Root string.");
		});
		test("VDFNode_Level0_Metadata_Type", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("<string>Root string.");
			a.metadata_type.Should().Be("string");
		});
		test("VDFNode_Level0_ArrayItems", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("Root string 1.|Root string 2.");
			a.items[0].baseValue.Should().Be("Root string 1.");
			a.items[1].baseValue.Should().Be("Root string 2.");
		});
		test("VDFNode_Level0_ArrayItems_Empty", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("|");
			a.items[0].baseValue.Should().Be("");
			a.items[1].baseValue.Should().Be("");
		});
		test("VDFNode_Level0_ArrayMetadata1", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("<<SpecialList[int]>>1|2", new VDFLoadOptions()); // todo
			a.metadata_type.Should().Be("SpecialList[int]");
			ok(a.items[0].metadata_type == null);
			ok(a.items[1].metadata_type == null);
		});
		test("VDFNode_Level0_ArrayMetadata2", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("<<SpecialList[int]>><int>1|<int>2", new VDFLoadOptions()); // todo
			a.metadata_type.Should().Be("SpecialList[int]");
			a.items[0].metadata_type.Should().Be("int");
			a.items[1].metadata_type.Should().Be("int");
		});
		test("VDFNode_Level0_DictionaryItems", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("{key 1|value 1}{key 2|value 2}");
			a.items[0].items[0].baseValue.Should().Be("key 1");
			a.items[0].items[1].baseValue.Should().Be("value 1");
			a.items[1].items[0].baseValue.Should().Be("key 2");
			a.items[1].items[1].baseValue.Should().Be("value 2");
		});
		test("VDFNode_Level1_BaseValues", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("bool{false}int{5}float{.5}string{Prop value string.}");
			a.properties.get("bool").items[0].baseValue.Should().Be("false");
			a.properties.get("int").items[0].baseValue.Should().Be("5");
			a.properties.get("float").items[0].baseValue.Should().Be(".5");
			a.properties.get("string").items[0].baseValue.Should().Be("Prop value string.");
		});
		test("VDFNode_Level1_Literal", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@}");
			a.properties.get("string").items[0].baseValue.Should().Be("Prop value string that {needs escaping}.");
		});
		test("VDFNode_Level1_TroublesomeLiteral1", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@@|@@}");
			a.properties.get("string").items[0].baseValue.Should().Be("Prop value string that {needs escaping}.@@");
		});
		test("VDFNode_Level1_TroublesomeLiteral2", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@||@@}");
			a.properties.get("string").items[0].baseValue.Should().Be("Prop value string that {needs escaping}.@@|");
		});
		test("VDFNode_Level1_PoppedOutNodes", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("names{#}\n\
	Dan\n\
	Bob\n\
");
			a.properties.get("names").items[0].items[0].baseValue.Should().Be("Dan");
			a.properties.get("names").items[1].items[0].baseValue.Should().Be("Bob");
		});
		test("VDFNode_Level1_ArrayItemsInArrayItems", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}");
			a.items[0].items[0].baseValue.Should().Be("1A");
			a.items[0].items[1].baseValue.Should().Be("1B");
			a.items[1].items[0].baseValue.Should().Be("2A");
			a.items[1].items[1].baseValue.Should().Be("2B");
		});
		test("VDFNode_Level1_ArrayItemsInArrayItems_Empty", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("{|}|{|}");
			a.items[0].items[0].baseValue.Should().Be("");
			a.items[0].items[1].baseValue.Should().Be("");
			a.items[1].items[0].baseValue.Should().Be("");
			a.items[1].items[1].baseValue.Should().Be("");
		});
		test("VDFNode_Level1_DictionaryItemsInDictionaryItems", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("{1key|1value}{2key|2value}");
			a.items[0].items[0].baseValue.Should().Be("1key");
			a.items[0].items[1].baseValue.Should().Be("1value");
			a.items[1].items[0].baseValue.Should().Be("2key");
			a.items[1].items[1].baseValue.Should().Be("2value");
		});
		test("VDFNode_Level1_PoppedOutItemGroups", (assert?: QUnitAssert) =>
		{
			var a = VDFLoader.ToVDFNode("names{#}ages{#}\n\
	Dan\n\
	Bob\n\
	#10\n\
	20");
			a.properties.get("names").items[0].items[0].baseValue.Should().Be("Dan");
			a.properties.get("names").items[1].items[0].baseValue.Should().Be("Bob");
			a.properties.get("ages").items[0].items[0].baseValue.Should().Be("10");
			a.properties.get("ages").items[1].items[0].baseValue.Should().Be("20");
		});
	}
}