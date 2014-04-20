interface Object { Should(): { obj: any; Be(value, message?: string); BeExactly(value, message?: string); } }
/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: ()=> any) => // overwrite/wrap actual test func
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
		test("ToVDFNode_Level0_Comment", ()=>
		{
			var a = VDFLoader.ToVDFNode("// comment\n\
			Root string.");
			a.baseValue.Should().Be("			Root string.");
		});
		test("ToVDFNode_Level0_BaseValue", ()=>
		{
			var a = VDFLoader.ToVDFNode("Root string.");
			a.baseValue.Should().Be("Root string."); // note; remember that for ambiguous cases like this, the base-like-value is added both as the obj's base-value and as its solitary item
		});
		test("ToVDFNode_Level0_BaseValue_SaveThenLoad", ()=>
		{
			var vdf = VDF.Serialize("Root string.");
			var a = VDFLoader.ToVDFNode(vdf);
			a.baseValue.Should().Be("Root string.");
			a.items[0].baseValue.Should().Be("Root string.");
			a.ToVDF().Should().Be("Root string."); // it should print only the base-value
		});
		test("ToVDFNode_Level0_Metadata_Type", ()=>
		{
			var a = VDFLoader.ToVDFNode("<string>Root string.");
			a.metadata_type.Should().Be("string");
		});
		test("ToVDFNode_Level0_ArrayItems", ()=>
		{
			var a = VDFLoader.ToVDFNode("Root string 1.|Root string 2.");
			a[0].baseValue.Should().Be("Root string 1.");
			a[1].baseValue.Should().Be("Root string 2.");
		});
		test("ToVDFNode_Level0_ArrayItems_Empty", ()=>
		{
			var a = VDFLoader.ToVDFNode("|");
			a[0].baseValue.Should().Be("");
			a[1].baseValue.Should().Be("");
		});
		test("ToVDFNode_Level0_ArrayMetadata1", ()=>
		{
			var a = VDFLoader.ToVDFNode("<<SpecialList[int]>>1|2", new VDFLoadOptions()); // todo
			a.metadata_type.Should().Be("SpecialList[int]");
			ok(a[0].metadata_type == null);
			ok(a[1].metadata_type == null);
		});
		test("ToVDFNode_Level0_ArrayMetadata2", ()=>
		{
			var a = VDFLoader.ToVDFNode("<<SpecialList[int]>><int>1|<int>2", new VDFLoadOptions()); // todo
			a.metadata_type.Should().Be("SpecialList[int]");
			a[0].metadata_type.Should().Be("int");
			a[1].metadata_type.Should().Be("int");
		});
		test("ToVDFNode_Level0_DictionaryItems", ()=>
		{
			var a = VDFLoader.ToVDFNode("{key 1|value 1}{key 2|value 2}");
			a[0][0].baseValue.Should().Be("key 1");
			a[0][1].baseValue.Should().Be("value 1");
			a[1][0].baseValue.Should().Be("key 2");
			a[1][1].baseValue.Should().Be("value 2");
		});
		test("ToVDFNode_Level0_DictionaryItems_GetByKey", ()=>
		{
			var a = VDFLoader.ToVDFNode("{key 1|value 1}{key 2|value 2}");
			a.GetDictionaryValueNode("key 1").AsString.Should().Be("value 1");
			a.GetDictionaryValueNode("key 2").AsString.Should().Be("value 2");
		});

		test("ToVDFNode_Level1_BaseValues", ()=>
		{
			var a = VDFLoader.ToVDFNode("bool{false}int{5}float{.5}string{Prop value string.}");
			a["bool"].baseValue.Should().Be("false");
			a["int"].baseValue.Should().Be("5");
			a["float"].baseValue.Should().Be(".5");
			a["string"].baseValue.Should().Be("Prop value string.");

			a["bool"].AsBool.Should().Be(false);
			a["float"].AsFloat.Should().Be(.5);
			a["string"].AsString.Should().Be("Prop value string.");
		});
		test("ToVDFNode_Level1_Literal", ()=>
		{
			var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.");
		});
		test("ToVDFNode_Level1_TroublesomeLiteral1", ()=>
		{
			var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@@|@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@");
		});
		test("ToVDFNode_Level1_TroublesomeLiteral2", ()=>
		{
			var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@||@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@|");
		});
		test("ToVDFNode_Level1_PoppedOutNodes", ()=>
		{
			var a = VDFLoader.ToVDFNode("names{#}\n\
	Dan\n\
	Bob\n\
");
			a["names"][0].baseValue.Should().Be("Dan");
			a["names"][1].baseValue.Should().Be("Bob");
		});
		test("ToVDFNode_Level1_ArrayItemsInArrayItems", ()=>
		{
			var a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be("1B");
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be("2B");
		});
		test("ToVDFNode_Level1_ArrayItemsInArrayItems_ValueEmpty", ()=>
		{
			var a = VDFLoader.ToVDFNode("{1A|}|{2A|}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be("");
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be("");
		});
		test("ToVDFNode_Level1_ArrayItemsInArrayItems_BothEmpty", ()=>
		{
			var a = VDFLoader.ToVDFNode("{|}|{|}");
			a[0][0].baseValue.Should().Be("");
			a[0][1].baseValue.Should().Be("");
			a[1][0].baseValue.Should().Be("");
			a[1][1].baseValue.Should().Be("");
		});
		test("ToVDFNode_Level1_DictionaryItems", ()=>
		{
			var a = VDFLoader.ToVDFNode("{1key|1value}{2key|2value}");
			a[0][0].baseValue.Should().Be("1key");
			a[0][1].baseValue.Should().Be("1value");
			a[1][0].baseValue.Should().Be("2key");
			a[1][1].baseValue.Should().Be("2value");
		});
		test("ToVDFNode_Level1_DictionaryItems_Complex", ()=>
		{
			var a = VDFLoader.ToVDFNode("uiPrefs{{toolOptions|@@Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{[#null]}size{7}}@@}{liveTool|Select}}");
			a["uiPrefs"][0][0].baseValue.Should().Be("toolOptions");
			a["uiPrefs"][0][1].baseValue.Should().Be("Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{[#null]}size{7}}");
			a["uiPrefs"][1][0].baseValue.Should().Be("liveTool");
			a["uiPrefs"][1][1].baseValue.Should().Be("Select");
		});
		test("ToVDFNode_Level1_PoppedOutItemGroups", ()=>
		{
			var a = VDFLoader.ToVDFNode("names{#}ages{#}\n\
	Dan\n\
	Bob\n\
	#10\n\
	20");
			a["names"][0].baseValue.Should().Be("Dan");
			a["names"][1].baseValue.Should().Be("Bob");
			a["ages"][0].baseValue.Should().Be("10");
			a["ages"][1].baseValue.Should().Be("20");
		});

		test("ToObject_Level0_Bool", ()=> { VDF.Deserialize<boolean>("true", "bool").Should().Be(true); });
		test("ToObject_Level0_Float", ()=> { VDF.Deserialize<number>("1.5", "float").Should().Be(1.5); });

		// unique to JavaScript version
		test("ToVDFNode_Level0_UnknownTypeAsAnonymous", ()=>
		{
			var a = VDFLoader.ToVDFNode("<UnknownType>string{Prop value string.}", new VDFLoadOptions(true));
			a["string"].baseValue.Should().Be("Prop value string.");
		});
		test("ToObject_AsObject", ()=>
		{
			var a = <any>VDF.Deserialize<Object>("bool{<bool>false}int{<int>3.5}", "object");
			a.bool.Should().Be(false);
			a.int.Should().BeExactly(3.5);
		});
	}
}