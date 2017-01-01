import {VDF} from "../../../Source/TypeScript/VDF";
import {
    _VDFPostSerialize,
    _VDFPreSerialize,
    _VDFSerializeProp,
    D,
    P,
    T,
    TypeInfo
} from "../../../Source/TypeScript/VDFTypeInfo";
import {VDFSaver, VDFSaveOptions, VDFTypeMarking} from "../../../Source/TypeScript/VDFSaver";
import {VDFNode} from "../../../Source/TypeScript/VDFNode";
import {List, object, Dictionary, VDFNodePath} from "../../../Source/TypeScript/VDFExtras";
// tests
// ==========

module VDFTests { // added to match C# indentation
	module Saving_FromObject {
		// from object
		// ==========

		test("D0_Null", () => { VDF.Serialize(null).Should().Be("null"); });
		test("D0_EmptyString", () => { VDF.Serialize("").Should().Be("\"\""); });

		@TypeInfo("^(?!_)")
		class D1_IgnoreDefaultValues_Class {
			@T("bool") @P() @D() bool1: boolean = null;
			@T("bool") @P() @D(true) bool2: boolean = true;
			@T("bool") @P() bool3: boolean = true;

			@T("string") @D() string1: string = null;
			@T("string") @D("value1") string2: string = "value1";
			@T("string") string3: string = "value1";
		}
		test("D1_IgnoreDefaultValues", () => {
			VDF.Serialize(new D1_IgnoreDefaultValues_Class(), "D1_IgnoreDefaultValues_Class").Should().Be("{bool3:true string3:\"value1\"}");
		});
		class D1_NullValues_Class {
			@T("object") @P() obj: any = null;
			@T("List(string)") @P() strings: List<string> = null;
			@T("List(string)") @P() strings2 = new List<string>("string");
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
		class TypeWithDefaultStringProp {
			@T("string") @P(true) @D() defaultString: string = null;
		}
		test("D1_IgnoreEmptyString", ()=> { VDF.Serialize(new TypeWithDefaultStringProp(), "TypeWithDefaultStringProp").Should().Be("{}"); });
		class TypeWithNullProps {
			@T("object") @P() obj: any = null;
			@T("List(string)") @P() strings: List<string> = null;
			@T("List(string)") @P() strings2 = new List<string>("string");
		}
		test("D1_NullValues", ()=> {
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
		class TypeWithList_PopOutItemData {
			@T("List(string)") @P(true, true) list = new List<string>("string", "A", "B");
		}
		test("D1_ListItems_PoppedOutChildren", () => {
			var a = VDFSaver.ToVDFNode(new TypeWithList_PopOutItemData(), "TypeWithList_PopOutItemData");
			a.ToVDF().Should().Be("{list:[^]}\n\
	\"A\"\n\
	\"B\"".replace(/\r/g, ""));
		});
		test("D1_ListItems_Null", () => {
			var a = VDFSaver.ToVDFNode(new List<string>("string", null));
			ok(a[0].metadata == null); //a[0].metadata.Should().Be(null);
			ok(a[0].primitiveValue == null); //a[0].primitiveValue.Should().Be(null);
			a.ToVDF().Should().Be("List(string)>[null]");
		});
		test("D1_SingleListItemWithAssemblyKnownTypeShouldStillSpecifySortOfType", () => {
			var a = VDFSaver.ToVDFNode(new List<string>("string", "hi"), "List(string)");
			a.ToVDF().Should().Be("[\"hi\"]");
		});
		test("D1_StringAndArraysInArray", () => { VDF.Serialize(new List<object>("object", "text", new List<string>("string", "a", "b"))).Should().Be("[\"text\" List(string)>[\"a\" \"b\"]]"); });
		test("D1_DictionaryValues_Null", () => {
			var dictionary = new Dictionary<string, string>("string", "string");
			dictionary.Add("key1", null);
			var a = VDFSaver.ToVDFNode(dictionary);
			ok(a["key1"].metadata == null); //a["key1"].metadata.Should().Be(null);
			ok(a["key1"].primitiveValue == null); //a["key1"].primitiveValue.Should().Be(null);
			a.ToVDF().Should().Be("Dictionary(string string)>{key1:null}");
		});
		test("D1_AnonymousTypeProperties_MarkNoTypes", () => {
			var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
			a["Bool"].primitiveValue.Should().Be(false);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
		});
		test("D1_AnonymousTypeProperties_MarkAllTypes", () => {
			var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
			a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
		});
		class D1_PreSerialize_Class {
			@T("bool") @P() preSerializeWasCalled = false;
			@_VDFPreSerialize() PreSerialize(): void { this.preSerializeWasCalled = true; }
		}
		test("D1_PreSerialize", () => {
			var a = VDFSaver.ToVDFNode(new D1_PreSerialize_Class(), "D1_PreSerialize_Class");
			a["preSerializeWasCalled"].primitiveValue.Should().Be(true);
			a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
		});
		class D1_SerializePropMethod_Class {
			@_VDFSerializeProp() SerializeProp(propPath: VDFNodePath, options: VDFSaveOptions) { return new VDFNode(1); }
			@P() prop1 = 0;
		}
		test("D1_SerializePropMethod", () => {
			var a = VDF.Serialize(new D1_SerializePropMethod_Class(), "D1_SerializePropMethod_Class");
			a.Should().Be("{prop1:1}");
		});
		class TypeWithPostSerializeCleanupMethod {
			@T("bool") @P() postSerializeWasCalled = false;
			@_VDFPostSerialize() PostSerialize(): void { this.postSerializeWasCalled = true; }
		}
		test("D1_PostSerializeCleanup", () => {
			var a = VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
			a["postSerializeWasCalled"].primitiveValue.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
			a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
		});
		class TypeWithMixOfProps {
			@T("bool") @P() Bool = true;
			@T("int") @P() Int = 5;
			@T("double") @P() Double = .5;
			@T("string") @P() String = "Prop value string.";
			@T("List(string") @P() list = new List<string>("string", "2A", "2B");
			@T("List(List(string))") @P() nestedList = new List<List<string>>("List(string)", new List<string>("string", "1A"));
		}
		test("D1_TypeProperties_MarkForNone", () => {
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
			a["Bool"].primitiveValue.Should().Be(true);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a["list"][0].primitiveValue.Should().Be("2A");
			a["list"][1].primitiveValue.Should().Be("2B");
			a["nestedList"][0][0].primitiveValue.Should().Be("1A");
			a.ToVDF().Should().Be("{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
		});
		test("D1_TypeProperties_MarkForInternal", () => {
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.Internal }));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
		});
		test("D1_TypeProperties_MarkForExternal", () => {
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:List(string)>[\"2A\" \"2B\"] nestedList:List(List(string))>[[\"1A\"]]}");
		});
		test("D1_TypeProperties_MarkForExternalNoCollapse", () => {
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.ExternalNoCollapse }));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:bool>true Int:int>5 Double:double>.5 String:string>\"Prop value string.\" list:List(string)>[string>\"2A\" string>\"2B\"] nestedList:List(List(string))>[List(string)>[string>\"1A\"]]}");
		});

		class D1_Object_DictionaryPoppedOutThenBool_Class1 {
			@T("Dictionary(string string)") @P(true, true) messages =
				new Dictionary<string, string>("string", "string", {title1: "message1", title2: "message2"});
			@T("Dictionary(string string)") @P() otherProperty = true;
		}
		test("D1_DictionaryPoppedOutThenBool", () => {
			var a = VDFSaver.ToVDFNode(new D1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
			a.ToVDF().Should().Be("{messages:{^} otherProperty:true}\n\
	title1:\"message1\"\n\
	title2:\"message2\"".replace(/\r/g, ""));
		});
		@TypeInfo(null, true)
		class D1_Map_PoppedOutDictionary_PoppedOutPairs_Class {
			@T("Dictionary(string string)") @P(true, true) messages = new Dictionary<string, string>("string", "string", {
				title1: "message1",
				title2: "message2"
			});
			@T("bool") @P() otherProperty = true;
		}
		test("D1_Map_PoppedOutDictionary_PoppedOutPairs", () => {
			var a = VDFSaver.ToVDFNode(new D1_Map_PoppedOutDictionary_PoppedOutPairs_Class(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
			a.ToVDF().Should().Be("{^}\n\
	messages:{^}\n\
		title1:\"message1\"\n\
		title2:\"message2\"\n\
	otherProperty:true".replace(/\r/g, ""));
		});

		class T1_Depth1 {
			@T("T1_Depth2") @P() level2 = new T1_Depth2();
		}
		class T1_Depth2 {
			@T("List(string)") @P(true, true) messages = new List<string>("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
			@T("bool") @P() otherProperty = true;
		}
		test("D2_Map_ListThenBool_PoppedOutStringsWithOneMultiline", () => {
			var a = VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
			a.ToVDF().Should().Be("{level2:{messages:[^] otherProperty:true}}\n\
	\"<<DeepString1_Line1\n\
	DeepString1_Line2>>\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
		});

		class Level1 {
			@T("Level2") @P() level2 = new Level2();
		}
		class Level2 {
			@T("Level3") @P() level3_first = new Level3();
			@T("Level3") @P() level3_second = new Level3();
		}
		class Level3 {
			@T("List(string)") @P(true, true) messages = new List<string>("string", "DeepString1", "DeepString2");
		}
		test("D3_Map_Map_Maps_Lists_PoppedOutStrings", () => {
			var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
			a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[^]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"\n\
	^\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
		});
		test("D3_Map_Map_Maps_ListsWithOneEmpty_PoppedOutStrings", () => {
			var obj = new Level1();
			obj.level2.level3_second.messages = new List<string>("string");
			var a = VDFSaver.ToVDFNode(obj, new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
			a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
		});

		class T4_Depth1 {
			@T("T4_Depth2") @P() level2 = new T4_Depth2();
		}
		class T4_Depth2 {
			@T("T4_Depth3") @P() level3_first = new T4_Depth3();
			@T("T4_Depth3") @P() level3_second = new T4_Depth3();
		}
		class T4_Depth3 {
			@T("List(T4_Depth4)") @P(true, true) level4s = new List<T4_Depth4>("T4_Depth4", new T4_Depth4(), new T4_Depth4());
		}
		class T4_Depth4 {
			@T("List(string)") @P(true, true) messages = new List<string>("string", "text1", "text2");
			@T("bool") @P() otherProperty = false;
		}
		test("D4_Map_Map_Maps_Lists_PoppedOutMaps_ListsThenBools_PoppedOutStrings", () => {
			var a = VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
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

		@TypeInfo(null, true) class T5_Depth2 {
			@T("bool") @P() firstProperty = false;
			@T("bool") @P() otherProperty = false;
		}
		test("D4_List_Map_PoppedOutBools", () => {
			var a = VDFSaver.ToVDFNode(new List<T5_Depth2>("T5_Depth2", new T5_Depth2()), new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
			a.ToVDF().Should().Be("List(T5_Depth2)>[{^}]\n\
	firstProperty:false\n\
	otherProperty:false".replace(/\r/g, ""));
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str => eval(str));
	}
}