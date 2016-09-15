// tests
// ==========

module VDFTests { // added to match C# indentation
	module Saving_FromObject {
		// from object
		// ==========

		test("D0_Null", ()=> { VDF.Serialize(null).Should().Be("null"); });
		test("D0_EmptyString", ()=> { VDF.Serialize("").Should().Be("\"\""); });

		class D1_IgnoreDefaultValues_Class {
			_helper = TypeInfo(new VDFType("^(?!_)")).set = this;

			bool1: boolean = Prop(this, "bool1", "bool", new D()).set = null;
			bool2: boolean = Prop(this, "bool2", "bool", new D(true)).set = true;
			bool3: boolean = Prop(this, "bool3", "bool").set = true;

			string1: string = Prop(this, "string1", "string", new D()).set = null;
			string2: string = Prop(this, "string2", "string", new D("value1")).set = "value1";
			string3: string = Prop(this, "string3", "string").set = "value1";
		}
		test("D1_IgnoreDefaultValues", ()=>{
			VDF.Serialize(new D1_IgnoreDefaultValues_Class(), "D1_IgnoreDefaultValues_Class").Should().Be("{bool3:true string3:\"value1\"}");
		});
		class D1_NullValues_Class {
			obj: any = Prop(this, "obj", "object", new P()).set = null;
			strings: List<string> = Prop(this, "strings", "List(string)", new P()).set = null;
			strings2 = Prop(this, "strings2", "List(string)", new P()).set = new List<string>("string");
		}
		test("D1_NullValues", () => {
			var a = VDFSaver.ToVDFNode(new D1_NullValues_Class());
			ok(a["obj"].metadata == null); //a["obj"].metadata.Should().Be(null);
			ok(a["obj"].primitiveValue == null); //a["obj"].primitiveValue.Should().Be(null);
			ok(a["strings"].metadata == null); //a["strings"].metadata.Should().Be(null);
			ok(a["strings"].primitiveValue == null); //a["strings"].primitiveValue.Should().Be(null);
			//ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // unmarked type
			ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // old: auto-marked as list (needed, to specify sort of type, as required)
			ok(a["strings2"].primitiveValue == null); //a["strings2"].primitiveValue.Should().Be(null); // it's a List, so it shouldn't have a base-value
			a["strings2"].listChildren.Count.Should().Be(0);
			a.ToVDF().Should().Be("D1_NullValues_Class>{obj:null strings:null strings2:[]}");
		});
		class TypeWithDefaultStringProp
		{
			defaultString: string = Prop(this, "defaultString", "string", new P(true), new D()).set = null;
		}
		test("D1_IgnoreEmptyString", ()=> { VDF.Serialize(new TypeWithDefaultStringProp(), "TypeWithDefaultStringProp").Should().Be("{}"); });
		class TypeWithNullProps
		{
			obj: any = Prop(this, "obj", "object", new P()).set = null;
			strings: List<string> = Prop(this, "strings", "List(string)", new P()).set = null;
			strings2 = Prop(this, "strings2", "List(string)", new P()).set = new List<string>("string");
		}
		test("D1_NullValues", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
			ok(a["obj"].metadata == null); //a["obj"].metadata.Should().Be(null);
			ok(a["obj"].primitiveValue == null); //a["obj"].primitiveValue.Should().Be(null);
			ok(a["strings"].metadata == null); //a["strings"].metadata.Should().Be(null);
			ok(a["strings"].primitiveValue == null); //a["strings"].primitiveValue.Should().Be(null);
			//ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // unmarked type
			ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // old: auto-marked as list (needed, to specify sort of type, as required)
			ok(a["strings2"].primitiveValue == null); //a["strings2"].primitiveValue.Should().Be(null); // it's a List, so it shouldn't have a base-value
			a["strings2"].listChildren.Count.Should().Be(0);
			a.ToVDF().Should().Be("TypeWithNullProps>{obj:null strings:null strings2:[]}");
		});
		class TypeWithList_PopOutItemData
		{
			list = Prop(this, "list", "List(string)", new P(true, true)).set = new List<string>("string", "A", "B");
		}
		test("D1_ListItems_PoppedOutChildren", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithList_PopOutItemData(), "TypeWithList_PopOutItemData");
			a.ToVDF().Should().Be("{list:[^]}\n\
	\"A\"\n\
	\"B\"".replace(/\r/g, ""));
		});
		test("D1_ListItems_Null", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<string>("string", null));
			ok(a[0].metadata == null); //a[0].metadata.Should().Be(null);
			ok(a[0].primitiveValue == null); //a[0].primitiveValue.Should().Be(null);
			a.ToVDF().Should().Be("List(string)>[null]");
		});
		test("D1_SingleListItemWithAssemblyKnownTypeShouldStillSpecifySortOfType", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<string>("string", "hi"), "List(string)");
			a.ToVDF().Should().Be("[\"hi\"]");
		});
		test("D1_StringAndArraysInArray", ()=> { VDF.Serialize(new List<object>("object", "text", new List<string>("string", "a", "b"))).Should().Be("[\"text\" List(string)>[\"a\" \"b\"]]"); });
		test("D1_DictionaryValues_Null", ()=>
		{
			var dictionary = new Dictionary<string, string>("string", "string");
			dictionary.Add("key1", null);
			var a = VDFSaver.ToVDFNode(dictionary);
			ok(a["key1"].metadata == null); //a["key1"].metadata.Should().Be(null);
			ok(a["key1"].primitiveValue == null); //a["key1"].primitiveValue.Should().Be(null);
			a.ToVDF().Should().Be("Dictionary(string string)>{key1:null}");
		});
		test("D1_AnonymousTypeProperties_MarkNoTypes", ()=> {
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Double: .5, String: "Prop value string."}, new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a["Bool"].primitiveValue.Should().Be(false);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
		});
		test("D1_AnonymousTypeProperties_MarkAllTypes", ()=> {
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Double: .5, String: "Prop value string."}, new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
		});
		class D1_PreSerialize_Class {
			preSerializeWasCalled = Prop(this, "preSerializeWasCalled", "bool", new P()).set = false;
			PreSerialize(): void { this.preSerializeWasCalled = true; }
			constructor() { this.PreSerialize.AddTags(new VDFPreSerialize()); }
		}
		test("D1_PreSerialize", ()=> {
			var a = VDFSaver.ToVDFNode(new D1_PreSerialize_Class(), "D1_PreSerialize_Class");
			a["preSerializeWasCalled"].primitiveValue.Should().Be(true);
			a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
		});
		class D1_SerializePropMethod_Class {
			SerializeProp(propPath: VDFNodePath, options: VDFSaveOptions) { return new VDFNode(1); }
			prop1 = Prop(this, "prop1", new P()).set = 0;
		}
		D1_SerializePropMethod_Class.prototype.SerializeProp.AddTags(new VDFSerializeProp());
		test("D1_SerializePropMethod", ()=> {
			var a = VDF.Serialize(new D1_SerializePropMethod_Class(), "D1_SerializePropMethod_Class");
			a.Should().Be("{prop1:1}");
		});
		class TypeWithPostSerializeCleanupMethod {
			postSerializeWasCalled = Prop(this, "postSerializeWasCalled", "bool", new P()).set = false;
			PostSerialize(): void { this.postSerializeWasCalled = true; }
			constructor() { this.PostSerialize.AddTags(new VDFPostSerialize()); }
		}
		test("D1_PostSerializeCleanup", ()=> {
			var a = VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
			a["postSerializeWasCalled"].primitiveValue.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
			a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
		});
		class TypeWithMixOfProps {
			Bool = Prop(this, "Bool", "bool", new P()).set = true;
			Int = Prop(this, "Int", "int", new P()).set = 5;
			Double = Prop(this, "Double", "double", new P()).set = .5;
			String = Prop(this, "String", "string", new P()).set = "Prop value string.";
			list = Prop(this, "list", "List(string)", new P()).set = new List<string>("string", "2A", "2B");
			nestedList = Prop(this, "nestedList", "List(List(string))", new P()).set = new List<List<string>>("List(string)", new List<string>("string", "1A"));
		}
		test("D1_TypeProperties_MarkForNone", ()=> {
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a["Bool"].primitiveValue.Should().Be(true);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a["list"][0].primitiveValue.Should().Be("2A");
			a["list"][1].primitiveValue.Should().Be("2B");
			a["nestedList"][0][0].primitiveValue.Should().Be("1A");
			a.ToVDF().Should().Be("{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
		});
		test("D1_TypeProperties_MarkForInternal", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({typeMarking: VDFTypeMarking.Internal}));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
		});
		test("D1_TypeProperties_MarkForExternal", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:List(string)>[\"2A\" \"2B\"] nestedList:List(List(string))>[[\"1A\"]]}");
		});
		test("D1_TypeProperties_MarkForExternalNoCollapse", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({typeMarking: VDFTypeMarking.ExternalNoCollapse}));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:bool>true Int:int>5 Double:double>.5 String:string>\"Prop value string.\" list:List(string)>[string>\"2A\" string>\"2B\"] nestedList:List(List(string))>[List(string)>[string>\"1A\"]]}");
		});

		class D1_Object_DictionaryPoppedOutThenBool_Class1
		{
			messages = Prop(this, "messages", "Dictionary(string string)", new P(true, true)).set = new Dictionary<string, string>("string", "string", {title1: "message1", title2:"message2"});
			otherProperty = Prop(this, "otherProperty", "Dictionary(string string)", new P()).set = true;
		}
		test("D1_DictionaryPoppedOutThenBool", ()=>
		{
			var a = VDFSaver.ToVDFNode(new D1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a.ToVDF().Should().Be("{messages:{^} otherProperty:true}\n\
	title1:\"message1\"\n\
	title2:\"message2\"".replace(/\r/g, ""));
		});
		class D1_Map_PoppedOutDictionary_PoppedOutPairs_Class {
			_helper = TypeInfo(new VDFType(null, true)).set = this;

			messages = Prop(this, "messages", "Dictionary(string string)", new P(true, true)).set = new Dictionary<string, string>("string", "string",
			{
				title1: "message1",
				title2: "message2"
			});
			otherProperty = Prop(this, "otherProperty", "bool", new P()).set = true;
		}
		test("D1_Map_PoppedOutDictionary_PoppedOutPairs", ()=>
		{
			var a = VDFSaver.ToVDFNode(new D1_Map_PoppedOutDictionary_PoppedOutPairs_Class(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a.ToVDF().Should().Be("{^}\n\
	messages:{^}\n\
		title1:\"message1\"\n\
		title2:\"message2\"\n\
	otherProperty:true".replace(/\r/g, ""));
		});

		class T1_Depth1
		{
			level2 = Prop(this, "level2", "T1_Depth2", new P()).set = new T1_Depth2();
		}
		class T1_Depth2
		{
			messages = Prop(this, "messages", "List(string)", new P(true, true)).set = new List<string>("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
			otherProperty = Prop(this, "otherProperty", "bool", new P()).set = true;
		}
		test("D2_Map_ListThenBool_PoppedOutStringsWithOneMultiline", ()=>
		{
			var a = VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a.ToVDF().Should().Be("{level2:{messages:[^] otherProperty:true}}\n\
	\"<<DeepString1_Line1\n\
	DeepString1_Line2>>\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
		});

		class Level1
		{
			level2 = Prop(this, "level2", "Level2", new P()).set = new Level2();
		}
		class Level2
		{
			level3_first = Prop(this, "level3_first", "Level3", new P()).set = new Level3();
			level3_second = Prop(this, "level3_second", "Level3", new P()).set = new Level3();
		}
		class Level3
		{
			messages = Prop(this, "messages", "List(string)", new P(true, true)).set = new List<string>("string", "DeepString1", "DeepString2");
		}
		test("D3_Map_Map_Maps_Lists_PoppedOutStrings", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[^]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"\n\
	^\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
		});
		test("D3_Map_Map_Maps_ListsWithOneEmpty_PoppedOutStrings", ()=>
		{
			var obj = new Level1();
			obj.level2.level3_second.messages = new List<string>("string");
			var a = VDFSaver.ToVDFNode(obj, new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
		});

		class T4_Depth1 {
			level2 = Prop(this, "level2", "T4_Depth2)", new P()).set = new T4_Depth2();
		}
		class T4_Depth2 {
			level3_first = Prop(this, "level3_first", "T4_Depth3", new P()).set = new T4_Depth3();
			level3_second = Prop(this, "level3_second", "T4_Depth3", new P()).set = new T4_Depth3();
		}
		class T4_Depth3 {
			level4s = Prop(this, "level4s", "List(T4_Depth4)", new P(true, true)).set = new List<T4_Depth4>("T4_Depth4", new T4_Depth4(), new T4_Depth4());
		}
		class T4_Depth4 {
			messages = Prop(this, "messages", "List(string)", new P(true, true)).set = new List<string>("string", "text1", "text2");
			otherProperty = Prop(this, "otherProperty", "bool", new P()).set = false;
		}
		test("D4_Map_Map_Maps_Lists_PoppedOutMaps_ListsThenBools_PoppedOutStrings", ()=> {
			var a = VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a.ToVDF().Should().Be("{level2:{level3_first:{level4s:[^]} level3_second:{level4s:[^]}}}\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	^{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"".replace(/\r/g, ""));
		});

		class T5_Depth2 {
			_helper = TypeInfo(new VDFType(null, true)).set = this;

			firstProperty = Prop(this, "firstProperty", "bool", new P()).set = false;
			otherProperty = Prop(this, "otherProperty", "bool", new P()).set = false;
		}
		test("D4_List_Map_PoppedOutBools", ()=> {
			var a = VDFSaver.ToVDFNode(new List<T5_Depth2>("T5_Depth2", new T5_Depth2()), new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("List(T5_Depth2)>[{^}]\n\
	firstProperty:false\n\
	otherProperty:false".replace(/\r/g, ""));
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
	}
}