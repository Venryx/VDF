interface Object { Should(): { obj: any; Be(value, message?: string); } }
/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
	Saving.Init();
	window["oldTest"](title, testFunc);
}*/
class TypeWithEmptyStringProp
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		emptyString: new VDFPropInfo("string", true, false, false)
	});
	emptyString = "";
}
class TypeWithNullProps
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		obj: new VDFPropInfo("object"),
		strings: new VDFPropInfo("List[string]"),
		strings2: new VDFPropInfo("List[string]")
	});
	obj;
	strings: List<string>;
	strings2 = new List<string>("string");
}
class TypeWithList_PopOutItemData
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		list: new VDFPropInfo("List[string]", true, true)
	});
	list = new List("string", "A", "B");
}
class TypeWithPreSerializePrepMethod
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		preSerializeWasCalled: new VDFPropInfo("bool")
	});
	preSerializeWasCalled: boolean;
	VDFPreSerialize(): void { this.preSerializeWasCalled = true; }
}
class TypeWithPostSerializeCleanupMethod
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		postSerializeWasCalled: new VDFPropInfo("bool")
	});
	postSerializeWasCalled: boolean = false;
	VDFPostSerialize(): void { this.postSerializeWasCalled = true; }
}
class TypeWithMixOfProps
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		Bool: new VDFPropInfo("bool"),
		Int: new VDFPropInfo("int"),
		Float: new VDFPropInfo("float"),
		String: new VDFPropInfo("string"),
		list: new VDFPropInfo("List[string]"),
		nestedList: new VDFPropInfo("List[List[string]]"),
	});
	Bool = true;
	Int = 5;
	Float = .5;
	String = "Prop value string.";
	list = new List<string>("string", "2A", "2B");
	nestedList = new List<List<string>>("List[string]", new List<string>("string", "1A"));
}
enum Enum1 { _IsEnum, A, B, C }

class Depth1_Object_DictionaryPoppedOutThenBool_Class1
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		messages: new VDFPropInfo("Dictionary[string,string]", true, true),
		otherProperty: new VDFPropInfo("bool")
	});
	messages = new Dictionary<string, string>("string", "string", ["title1", "message1"], ["title2", "message2"]);
	otherProperty = true;
}
class Saving_Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, true,
	{
		messages: new VDFPropInfo("Dictionary[string,string]", true, true),
		otherProperty: new VDFPropInfo("bool")
	});
	messages = new Dictionary<string, string>("string", "string", ["title1", "message1"], ["title2", "message2"]);
	otherProperty = true;
}

class T1_Depth1
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		level2: new VDFPropInfo("T1_Depth2")
	});
	level2 = new T1_Depth2();
}
class T1_Depth2
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		messages: new VDFPropInfo("Dictionary[string,string]", true, true),
		otherProperty: new VDFPropInfo("bool")
	});
	messages = new List<string>("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
	otherProperty = true;
}

class Level1
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		level2: new VDFPropInfo("Level2")
	});
	level2 = new Level2();
}
class Level2
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		level3_first: new VDFPropInfo("Level3"),
		level3_second: new VDFPropInfo("Level3")
	});
	level3_first = new Level3();
	level3_second = new Level3();
}
class Level3
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		messages: new VDFPropInfo("List[string]", true, true)
	});
	messages = new List<string>("string", "DeepString1", "DeepString2");
}

class T4_Depth1
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		level2: new VDFPropInfo("T4_Depth2_Depth2")
	});
	level2 = new T4_Depth2();
}
class T4_Depth2
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		level3_first: new VDFPropInfo("T4_Depth3"),
		level3_second: new VDFPropInfo("T4_Depth3")
	});
	level3_first = new T4_Depth3();
	level3_second = new T4_Depth3();
}
class T4_Depth3
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		level4s: new VDFPropInfo("List[T4_Depth4]", true, true)
	});
	level4s = new List<T4_Depth4>("T4_Depth4", new T4_Depth4(), new T4_Depth4());
}
class T4_Depth4
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, false,
	{
		messages: new VDFPropInfo("List[string]", true, true),
		otherProperty: new VDFPropInfo("bool")
	});
	messages = new List<string>("string", "text1", "text2");
	otherProperty = false; 
}

class T5_Depth2
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, true,
	{
		firstProperty: new VDFPropInfo("bool"),
		otherProperty: new VDFPropInfo("bool")
	});
	firstProperty = false;
	otherProperty = false;
}

// note: from now on, while you don't need to specify the *type*, you do need to specify (by some means) the *sort* of type (e.g. object/dictionary or list)
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
	}

	static RunTests()
	{
		// from VDFNode
		// ==========

		test("Depth0_BaseValue", ()=>
		{
			var a = new VDFNode();
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("Root string.");

			a = new VDFNode();
			a.SetItem(0, new VDFNode("Root string also."));
			a.ToVDF().Should().Be("Root string also.");
		});
		test("Depth0_Metadata_Type", ()=>
		{
			var a = new VDFNode();
			a.metadata_type = "string";
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("string>Root string.");
		});
		test("Depth0_Metadata_Type_Collapsed", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List("string"), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("string>>");
			a = VDFSaver.ToVDFNode(new List("List[string]", new List("string", "1A", "1B", "1C")), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("List[List[string]]>>{1A|1B|1C}"); // only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
		});
		test("Depth0_EnumDefault", () =>
		{
			var a = VDFSaver.ToVDFNode(Enum1.A, "Enum1");
			a.ToVDF().Should().Be("A");
		});
		test("Depth0_MultilineString", () =>
		{
			var a = VDFSaver.ToVDFNode("This is a\nmultiline string\nof three lines in total.", "string");
			a.ToVDF().Should().Be("@@This is a\nmultiline string\nof three lines in total.@@");
		});
		test("Depth0_EscapeAsLiteral_1", ()=>
		{
			var a = new VDFNode("\tBase value string that needs escaping.");
			a.ToVDF().Should().Be("@@\tBase value string that needs escaping.@@");
		});
		test("Depth0_EscapeAsLiteral_2", ()=>
		{
			var a = new VDFNode("Base value string that {needs escaping}.");
			a.ToVDF().Should().Be("@@Base value string that {needs escaping}.@@");
		});
		test("Depth1_EscapeAsLiteral_Troublesome", ()=>
		{
			var a = new VDFNode();
			a.SetItem(0, new VDFNode("This is a list item that|needs|escaping."));
			a.SetItem(1, new VDFNode("Here's;;another."));
			a.SetItem(2, new VDFNode("This is a list item that doesn't need escaping."));
			a.ToVDF().Should().Be("@@This is a list item that|needs|escaping.@@|@@Here's;;another.@@|This is a list item that doesn't need escaping.");
		});

		test("Depth1_BaseValues", ()=>
		{
			var a = new VDFNode();
			a.SetProperty("bool", new VDFNode("false"));
			a.SetProperty("int", new VDFNode("5"));
			a.SetProperty("float", new VDFNode(".5"));
			a.SetProperty("string", new VDFNode("Prop value string."));
			a.ToVDF().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
		});
		test("Depth1_BaseValuesThatNeedEscaping", ()=>
		{
			var a = new VDFNode("string>In-string VDF data.");
			a.ToVDF().Should().Be("@@string>In-string VDF data.@@");
			a = new VDFNode("C:/path/with/colon/char/that/needs/escaping");
			a.ToVDF().Should().Be("@@C:/path/with/colon/char/that/needs/escaping@@");
		});

		// from object
		// ==========

		test("Depth0_Null", ()=>{ VDF.Serialize(null).Should().Be(">null"); });
		test("Depth0_EmptyString", ()=>{ VDF.Serialize("").Should().Be(">empty"); });

		test("Depth1_IgnoreEmptyString", ()=>{ VDF.Serialize(new TypeWithEmptyStringProp(), "TypeWithEmptyStringProp").Should().Be(""); });
		test("Depth1_NullValues", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
			a["obj"].metadata_type.Should().Be(""); // type "null" should be collapsed
			a["obj"].baseValue.Should().Be("null");
			a["strings"].metadata_type.Should().Be("");
			a["strings"].baseValue.Should().Be("null");
			//equal(a["strings2"].metadata_type, null); // unmarked type
			a["strings2"].metadata_type.Should().Be(""); // auto-marked as list (needed, to specify sort of type, as required)
			equal(a["strings2"].baseValue, null); // it's a List, so it shouldn't have a base-value
			a["strings2"].items.length.Should().Be(0);
			a.ToVDF().Should().Be("TypeWithNullProps>obj{>null}strings{>null}strings2{>>}");
		});
		test("Depth1_ListItems_PoppedOutChildren", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithList_PopOutItemData(), "TypeWithList_PopOutItemData");
			a.ToVDF().Should().Be("list:\n\
	A\n\
	B".replace(/\r/g, ""));
		});
		test("Depth1_ListItems_Null", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List("string", null));
			a[0].metadata_type.Should().Be("");
			a[0].baseValue.Should().Be("null");
			a.ToVDF().Should().Be("string>>>null");
		});
		test("Depth1_SingleListItemWithAssemblyKnownTypeShouldStillSpecifySortOfType", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<string>("string", "hi"), "List[string]");
			a.ToVDF().Should().Be(">>hi");
		});
		test("Depth1_StringAndArraysInArray", ()=>VDF.Serialize(new List<object>("object", "text", new List<string>("string", "a", "b"))).Should().Be(">>text|{string>>a|b}"));
		test("Depth1_DictionaryValues_Null", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Dictionary("string", "string", ["key1", null]));
			a["key1"].metadata_type.Should().Be("");
			a["key1"].baseValue.Should().Be("null");
			a.ToVDF().Should().Be("string,string>>key1{>null}");
		});
		test("Depth1_AnonymousTypeProperties_MarkNoTypes", ()=>
		{
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Float: .5, String: "Prop value string."}, new VDFSaveOptions(null, VDFTypeMarking.None));
			a["Bool"].baseValue.Should().Be("false");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("Bool{false}Int{5}Float{.5}String{Prop value string.}");
		});
		test("Depth1_AnonymousTypeProperties_MarkAllTypes", ()=>
		{
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Float: .5, String: "Prop value string."}, new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("Bool{>false}Int{>5}Float{>.5}String{Prop value string.}");
		});
		test("Depth1_PreSerializePreparation", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod(), "TypeWithPreSerializePrepMethod");
			a["preSerializeWasCalled"].AsBool.Should().Be(true);
			a.ToVDF().Should().Be("preSerializeWasCalled{true}");
		});
		test("Depth1_PostSerializeCleanup", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
			a["postSerializeWasCalled"].AsBool.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
			a.ToVDF().Should().Be("postSerializeWasCalled{false}");
		});
		test("Depth1_TypeProperties_MarkForNone", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, VDFTypeMarking.None));
			a["Bool"].baseValue.Should().Be("true");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a["list"][0].baseValue.Should().Be("2A");
			a["list"][1].baseValue.Should().Be("2B");
			a["nestedList"][0][0].baseValue.Should().Be("1A");
			a.ToVDF().Should().Be("Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{>>{>>1A}}");
		});
		test("Depth1_TypeProperties_MarkForAssembly", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, VDFTypeMarking.Assembly));
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{>>{>>1A}}");
		});
		test("Depth1_TypeProperties_MarkForAssemblyExternal", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{>true}Int{>5}Float{>.5}String{Prop value string.}list{string>>2A|2B}nestedList{List[List[string]]>>{string>>1A}}");
		});
		test("Depth1_TypeProperties_MarkForAssemblyExternalNoCollapse", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternalNoCollapse));
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{bool>true}Int{int>5}Float{float>.5}String{string>Prop value string.}list{List[string]>>string>2A|string>2B}nestedList{List[List[string]]>>{List[string]>>string>1A}}");
		});

		test("Depth1_DictionaryPoppedOutThenBool", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Depth1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions(null, VDFTypeMarking.None));
			a.ToVDF().Should().Be("messages:\n\
	title1{message1}\n\
	title2{message2}\n\
^otherProperty{true}".replace(/\r/g, ""));
		});
		test("Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Saving_Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1(), new VDFSaveOptions(null, VDFTypeMarking.None));
			a.ToVDF().Should().Be("\n\
	messages:\n\
		title1{message1}\n\
		title2{message2}\n\
	otherProperty{true}".replace(/\r/g, ""));
		});

		test("Depth2_Object_ArrayPoppedOutWithMultilineLiteralThenBool", ()=>
		{
			var a = VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaveOptions(null, VDFTypeMarking.None));
			a.ToVDF().Should().Be("level2{messages:\n\
	@@DeepString1_Line1\n\
	DeepString1_Line2@@\n\
	DeepString2\n\
^otherProperty{true}}".replace(/\r/g, ""));
		});

		test("Depth3_Object_Array_ArrayPoppedOut", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions(null, VDFTypeMarking.None));
			a.ToVDF().Should().Be("level2{level3_first{messages:\n\
	DeepString1\n\
	DeepString2\n\
}level3_second{messages:\n\
	DeepString1\n\
	DeepString2\n\
}}".replace(/\r/g, ""));
		});

		test("Depth4_Object_Array_ArrayPoppedOut_ArrayPoppedOutThenBool", ()=>
		{
			var a = VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaveOptions(null, VDFTypeMarking.None));
			a.ToVDF().Should().Be("level2{level3_first{level4s:\n\
	messages:\n\
		text1\n\
		text2\n\
	^otherProperty{false}\n\
	messages:\n\
		text1\n\
		text2\n\
	^otherProperty{false}\n\
}level3_second{level4s:\n\
	messages:\n\
		text1\n\
		text2\n\
	^otherProperty{false}\n\
	messages:\n\
		text1\n\
		text2\n\
	^otherProperty{false}\n\
}}".replace(/\r/g, ""));
		});

		test("Depth4_Object_ArrayPoppedOut_Object", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<T5_Depth2>("T5_Depth2", new T5_Depth2()), new VDFSaveOptions(null, VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be("T5_Depth2>>{\n\
	firstProperty{>false}\n\
	otherProperty{>false}\n\
}".replace(/\r/g, ""));
		});
	}
}