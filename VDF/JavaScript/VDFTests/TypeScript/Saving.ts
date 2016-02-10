/*class Saving
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
		/*test("testName()
		{
			ok(null == null);
		});*#/
	}
}*/

// general init // note: this runs globally, so no need to duplicate in the Loading.ts file
// ==========

interface Object { Should(): { obj: any; Be(value, message?: string); } }
Object.prototype._AddFunction_Inline = function Should()
{
	return 0 || // fix for auto-semicolon-insertion
	{
		Be: (value, message?: string) => { equal(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); },
		BeExactly: (value, message?: string) => { strictEqual(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); }
	};
};
interface String { Fix(): string; }
String.prototype._AddFunction_Inline = function Fix() { return this.toString(); }; // filler function for C# method to allow for copying, with fewer manual changes
//interface Object { AddTest(testFunc: Function): void; }
//Object.prototype._AddGetterSetter(null, function AddTest/*Inline*/(testFunc) { saving[testFunc.name] = testFunc; });
//saving.AddTest = function testName() { ok(null == null); };

var test_old = test;

// init
// ==========

var saving = {};
function Saving_RunTests()
{
	for (var name in saving)
		test_old(name, saving[name]);
}

window["test"] = function(name, func) { saving[name] = func; };

// tests
// ==========

module VDFTests // added to match C# indentation
{
	module Saving
	{
		// from VDFNode
		// ==========

		test("D0_BaseValue", ()=>
		{
			var a = new VDFNode();
			a.primitiveValue = "Root string.";
			a.ToVDF().Should().Be("\"Root string.\"");
		});
		test("D0_Infinity", ()=>
		{
			new VDFNode(Infinity).ToVDF().Should().Be("Infinity");
			new VDFNode(-Infinity).ToVDF().Should().Be("-Infinity");
		});
		test("D0_MetadataType", ()=>
		{
			var a = new VDFNode();
			a.metadata = "string";
			a.primitiveValue = "Root string.";
			a.ToVDF().Should().Be("string>\"Root string.\"");
		});
		test("D0_MetadataTypeCollapsed", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<string>("string"), new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("List(string)>[]");
			a = VDFSaver.ToVDFNode(new List<List<string>>("List(string)", new List<string>("string", "1A", "1B", "1C")), new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("List(List(string))>[[\"1A\" \"1B\" \"1C\"]]"); // old: only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
		});
		test("D0_MetadataTypeNoCollapse", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<string>("string"), new VDFSaveOptions({typeMarking: VDFTypeMarking.ExternalNoCollapse}));
			a.ToVDF().Should().Be("List(string)>[]");
			a = VDFSaver.ToVDFNode(new List<List<string>>("List(string)", new List<string>("string", "1A", "1B", "1C")), new VDFSaveOptions({typeMarking: VDFTypeMarking.ExternalNoCollapse}));
			a.ToVDF().Should().Be("List(List(string))>[List(string)>[string>\"1A\" string>\"1B\" string>\"1C\"]]");
		});
		enum Enum1 { _IsEnum, A, B, C }
		//enum Enum1 { A, B, C }
		test("D0_EnumDefault", ()=>
		{
			var a = VDFSaver.ToVDFNode(Enum1.A, "Enum1");
			a.ToVDF().Should().Be("\"A\"");
		});
		test("D0_EnumDefault_IncludeType", ()=>
		{
			var a = VDFSaver.ToVDFNode(Enum1.A, "Enum1", new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("Enum1>\"A\"");
		});
		test("D0_EscapedString", ()=>
		{
			var a = VDFSaver.ToVDFNode(
"Multiline string\n\
that needs escaping.".Fix(), "string");
			a.ToVDF().Should().Be(
"\"<<Multiline string\n\
that needs escaping.>>\"".Fix());

			a = VDFSaver.ToVDFNode("String \"that needs escaping\".", "string");
			a.ToVDF().Should().Be("\"<<String \"that needs escaping\".>>\"");

			a = VDFSaver.ToVDFNode("String <<that needs escaping>>.", "string");
			a.ToVDF().Should().Be("\"<<<String <<that needs escaping>>.>>>\"");
		});
		test("D0_EmptyArray", ()=>{ VDF.Serialize([]).Should().Be("[]"); });

		test("D1_ListInferredFromHavingItem_String", ()=>
		{
			var a = new VDFNode();
			a.SetListChild(0, new VDFNode("String item."));
			a.ToVDF().Should().Be("[\"String item.\"]");
		});
		test("D1_Object_Primitives", ()=>
		{
			var a = new VDFNode();
			a.SetMapChild(new VDFNode("bool"), new VDFNode(false));
			a.SetMapChild(new VDFNode("int"), new VDFNode(5));
			a.SetMapChild(new VDFNode("double"), new VDFNode(.5));
			a.SetMapChild(new VDFNode("string"), new VDFNode("Prop value string."));
			a.ToVDF().Should().Be("{bool:false int:5 double:.5 string:\"Prop value string.\"}");
		});
		test("D1_List_EscapedStrings", ()=>
		{
			var a = new VDFNode();
			a.SetListChild(0, new VDFNode("This is a list item \"that needs escaping\"."));
			a.SetListChild(1, new VDFNode("Here's <<another>>."));
			a.SetListChild(2, new VDFNode("This one doesn't need escaping."));
			a.ToVDF().Should().Be("[\"<<This is a list item \"that needs escaping\".>>\" \"<<<Here's <<another>>.>>>\" \"This one doesn't need escaping.\"]");
		});
		test("D1_List_EscapedStrings2", ()=>
		{
			var a = new VDFNode();
			a.SetListChild(0, new VDFNode("ok {}"));
			a.SetListChild(1, new VDFNode("ok []"));
			a.SetListChild(2, new VDFNode("ok :"));
			a.ToVDF().Should().Be("[\"ok {}\" \"ok []\" \"ok :\"]");
		});
		test("D1_Map_EscapedStrings", ()=>
		{
			var a = new VDFNode();
			a.SetMapChild(new VDFNode("escape {}"), new VDFNode());
			a.SetMapChild(new VDFNode("escape []"), new VDFNode());
			a.SetMapChild(new VDFNode("escape :"), new VDFNode());
			a.ToVDF().Should().Be("{<<escape {}>>:null <<escape []>>:null <<escape :>>:null}");
		});
		class TypeTest
		{
			Serialize(): VDFNode
			{
				var result = new VDFNode("Object");
				result.metadata_override = "Type";
				return result;
			}
			constructor() { this.Serialize.AddTags(new VDFSerialize()); }
		}
		test("D1_MetadataShowingNodeToBeOfTypeType", ()=>
		{
			//VDFTypeInfo.AddSerializeMethod<Type>(a=>new VDFNode(a.Name, "Type"));
			//VDFTypeInfo.AddDeserializeMethod_FromParent<Type>(node=>Type.GetType(node.primitiveValue.ToString()));

			//var type_object = {Serialize: function() { return new VDFNode("System.Object", "Type"); }.AddTags(new VDFSerialize())}
			var type_object = new TypeTest();

			var map = new Dictionary<object, object>("object", "object");
			map.Add(type_object, "hi there");
			VDF.Serialize(map).Should().Be("{Type>Object:\"hi there\"}");
		});

		// from object
		// ==========

		test("D0_Null", ()=> { VDF.Serialize(null).Should().Be("null"); });
		test("D0_EmptyString", ()=> { VDF.Serialize("").Should().Be("\"\""); });

		class TypeWithDefaultStringProp
		{
			defaultString: string = Prop(this, "defaultString", "string", new VDFProp(true, false)).set = null;
		}
		test("D1_IgnoreEmptyString", ()=> { VDF.Serialize(new TypeWithDefaultStringProp(), "TypeWithDefaultStringProp").Should().Be("{}"); });
		class TypeWithNullProps
		{
			obj: any = Prop(this, "obj", "object", new VDFProp()).set = null;
			strings: List<string> = Prop(this, "strings", "List(string)", new VDFProp()).set = null;
			strings2 = Prop(this, "strings2", "List(string)", new VDFProp()).set = new List<string>("string");
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
			list = Prop(this, "list", "List(string)", new VDFProp(true, true, true)).set = new List<string>("string", "A", "B");
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
		test("D1_AnonymousTypeProperties_MarkNoTypes", ()=>
		{
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Double: .5, String: "Prop value string."}, new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a["Bool"].primitiveValue.Should().Be(false);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
		});
		test("D1_AnonymousTypeProperties_MarkAllTypes", ()=>
		{
			var a = VDFSaver.ToVDFNode({Bool: false, Int: 5, Double: .5, String: "Prop value string."}, new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
		});
		class TypeWithPreSerializePrepMethod
		{
			preSerializeWasCalled = Prop(this, "preSerializeWasCalled", "bool", new VDFProp()).set = false;
			PreSerialize(): void { this.preSerializeWasCalled = true; }
			constructor() { this.PreSerialize.AddTags(new VDFPreSerialize()); }
		}
		test("D1_PreSerializePreparation", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod(), "TypeWithPreSerializePrepMethod");
			a["preSerializeWasCalled"].primitiveValue.Should().Be(true);
			a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
		});
		class TypeWithPostSerializeCleanupMethod
		{
			postSerializeWasCalled = Prop(this, "postSerializeWasCalled", "bool", new VDFProp()).set = false;
			PostSerialize(): void { this.postSerializeWasCalled = true; }
			constructor() { this.PostSerialize.AddTags(new VDFPostSerialize()); }
		}
		test("D1_PostSerializeCleanup", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
			a["postSerializeWasCalled"].primitiveValue.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
			a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
		});
		class TypeWithMixOfProps
		{
			Bool = Prop(this, "Bool", "bool", new VDFProp()).set = true;
			Int = Prop(this, "Int", "int", new VDFProp()).set = 5;
			Double = Prop(this, "Double", "double", new VDFProp()).set = .5;
			String = Prop(this, "String", "string", new VDFProp()).set = "Prop value string.";
			list = Prop(this, "list", "List(string)", new VDFProp()).set = new List<string>("string", "2A", "2B");
			nestedList = Prop(this, "nestedList", "List(List(string))", new VDFProp()).set = new List<List<string>>("List(string)", new List<string>("string", "1A"));
		}
		test("D1_TypeProperties_MarkForNone", ()=>
		{
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
			messages = Prop(this, "messages", "Dictionary(string string)", new VDFProp(true, true, true)).set = new Dictionary<string, string>("string", "string", {title1: "message1", title2:"message2"});
			otherProperty = Prop(this, "otherProperty", "Dictionary(string string)", new VDFProp()).set = true;
		}
		test("D1_DictionaryPoppedOutThenBool", ()=>
		{
			var a = VDFSaver.ToVDFNode(new D1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a.ToVDF().Should().Be("{messages:{^} otherProperty:true}\n\
	title1:\"message1\"\n\
	title2:\"message2\"".replace(/\r/g, ""));
		});
		class D1_Map_PoppedOutDictionary_PoppedOutPairs_Class
		{
			_helper = Type(new VDFType(null, true)).set = this;

			messages = Prop(this, "messages", "Dictionary(string string)", new VDFProp(true, true, true)).set = new Dictionary<string, string>("string", "string",
			{
				title1: "message1",
				title2: "message2"
			});
			otherProperty = Prop(this, "otherProperty", "bool", new VDFProp()).set = true;
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
			level2 = Prop(this, "level2", "T1_Depth2", new VDFProp()).set = new T1_Depth2();
		}
		class T1_Depth2
		{
			messages = Prop(this, "messages", "List(string)", new VDFProp(true, true, true)).set = new List<string>("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
			otherProperty = Prop(this, "otherProperty", "bool", new VDFProp()).set = true;
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
			level2 = Prop(this, "level2", "Level2", new VDFProp()).set = new Level2();
		}
		class Level2
		{
			level3_first = Prop(this, "level3_first", "Level3", new VDFProp()).set = new Level3();
			level3_second = Prop(this, "level3_second", "Level3", new VDFProp()).set = new Level3();
		}
		class Level3
		{
			messages = Prop(this, "messages", "List(string)", new VDFProp(true, true, true)).set = new List<string>("string", "DeepString1", "DeepString2");
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

		class T4_Depth1
		{
			level2 = Prop(this, "level2", "T4_Depth2)", new VDFProp()).set = new T4_Depth2();
		}
		class T4_Depth2
		{
			level3_first = Prop(this, "level3_first", "T4_Depth3", new VDFProp()).set = new T4_Depth3();
			level3_second = Prop(this, "level3_second", "T4_Depth3", new VDFProp()).set = new T4_Depth3();
		}
		class T4_Depth3
		{
			level4s = Prop(this, "level4s", "List(T4_Depth4)", new VDFProp(true, true, true)).set = new List<T4_Depth4>("T4_Depth4", new T4_Depth4(), new T4_Depth4());
		}
		class T4_Depth4
		{
			messages = Prop(this, "messages", "List(string)", new VDFProp(true, true, true)).set = new List<string>("string", "text1", "text2");
			otherProperty = Prop(this, "otherProperty", "bool", new VDFProp()).set = false;
		}
		test("D4_Map_Map_Maps_Lists_PoppedOutMaps_ListsThenBools_PoppedOutStrings", ()=>
		{
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

		class T5_Depth2
		{
			_helper = Type(new VDFType(null, true)).set = this;

			firstProperty = Prop(this, "firstProperty", "bool", new VDFProp()).set = false;
			otherProperty = Prop(this, "otherProperty", "bool", new VDFProp()).set = false;
		}
		test("D4_List_Map_PoppedOutBools", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<T5_Depth2>("T5_Depth2", new T5_Depth2()), new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("List(T5_Depth2)>[{^}]\n\
	firstProperty:false\n\
	otherProperty:false".replace(/\r/g, ""));
		});

		// prop-inclusion by regex
		// ==========

		class D1_Map_PropWithNameMatchingIncludeRegex_Class
		{
			_helper = Type(new VDFType("^[^_]")).set = this;

			_notMatching = Prop(this, "_notMatching", "bool").set = true;
			matching = Prop(this, "matching", "bool").set = true;
		}
		test("D1_Map_PropWithNameMatchingIncludeRegex", ()=>{ VDF.Serialize(new D1_Map_PropWithNameMatchingIncludeRegex_Class(), "D1_Map_PropWithNameMatchingIncludeRegex_Class").Should().Be("{matching:true}"); });

		class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base
		{
			_helper = Type(new VDFType("^[^_]")).set = this;
		}
		class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived
		{
			_helper = Type(new VDFType()).set = this;

			_notMatching = Prop(this, "_notMatching", "bool").set = true;
			matching = Prop(this, "matching", "bool").set = true;
		}
		D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype["__proto__"] = D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base.prototype;
		test("D1_Map_PropWithNameMatchingBaseClassIncludeRegex", ()=>{ VDF.Serialize(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived(), "D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived").Should().Be("{matching:true}"); });

		// serialize-related methods
		// ==========

		class D1_MapWithEmbeddedSerializeMethod_Prop_Class
		{
			notIncluded = Prop(this, "notIncluded", "bool").set = true;
			included = Prop(this, "included", "bool").set = true;

			Serialize(): VDFNode //VDFPropInfo prop, VDFSaveOptions options)
			{
				var result = new VDFNode();
				result.SetMapChild(new VDFNode("included"), new VDFNode(this.included));
				return result;
			}
			constructor() { this.Serialize.AddTags(new VDFSerialize()); }
		}
		//AddAttributes().type = D1_MapWithEmbeddedSerializeMethod_Prop_Class;
		test("D1_MapWithEmbeddedSerializeMethod_Prop", ()=>{ VDF.Serialize(new D1_MapWithEmbeddedSerializeMethod_Prop_Class(), "D1_MapWithEmbeddedSerializeMethod_Prop_Class").Should().Be("{included:true}"); });

		class D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class
		{
			boolProp = Prop(this, "boolProp", "bool", new VDFProp()).set = true;
			Serialize() { return VDF.NoActionTaken; }
			constructor() { this.Serialize.AddTags(new VDFSerialize()); }
		}
		test("D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop", ()=>{ VDF.Serialize(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class(), "D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class").Should().Be("{boolProp:true}"); });

		class D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class
		{
			PreSerializeProp(propPath: VDFNodePath, options: VDFSaveOptions) { return VDF.CancelSerialize; }
			constructor() { this.PreSerializeProp.AddTags(new VDFPreSerializeProp()); }
			
			boolProp = Prop(this, "boolProp", "D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class", new VDFProp()).set = true;
		}
		test("D1_Map_BoolWhoseSerializeIsCanceledFromParent", ()=>{ VDF.Serialize(new D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class(), "D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class").Should().Be("{}"); });

		class D1_Map_MapThatCancelsItsSerialize_Class_Parent
			{ child = Prop(this, "child", "D1_Map_MapThatCancelsItsSerialize_Class_Child", new VDFProp()).set = new D1_Map_MapThatCancelsItsSerialize_Class_Child(); }
		class D1_Map_MapThatCancelsItsSerialize_Class_Child
		{
			Serialize() { return VDF.CancelSerialize; }
			constructor() { this.Serialize.AddTags(new VDFSerialize()); }
		}
		test("D1_Map_MapThatCancelsItsSerialize", ()=> { VDF.Serialize(new D1_Map_MapThatCancelsItsSerialize_Class_Parent(), "D1_Map_MapThatCancelsItsSerialize_Class_Parent").Should().Be("{}"); });

		// for JSON compatibility
		// ==========

		class D0_MapWithMetadataDisabled_Class {}
		test("D0_MapWithMetadataDisabled", ()=>
		{
			var a = VDFSaver.ToVDFNode(new D0_MapWithMetadataDisabled_Class(), new VDFSaveOptions({useMetadata: false}));
			ok(a.metadata == null); //a.metadata.Should().Be(null);
		});
		class D0_Map_List_BoolsWithPopOutDisabled_Class
		{
			ints = Prop(this, "ints", "List(int)", new VDFProp()).set = new List<number>("int", 0, 1);
		}
		test("D0_Map_List_BoolsWithPopOutDisabled", ()=>
		{
			var a = VDFSaver.ToVDFNode(new D0_Map_List_BoolsWithPopOutDisabled_Class(), "D0_Map_List_BoolsWithPopOutDisabled_Class", new VDFSaveOptions({useChildPopOut: false}));
			a.ToVDF().Should().Be("{ints:[0 1]}");
		});
		test("D1_Map_IntsWithStringKeys", ()=>
		{
			var a = VDFSaver.ToVDFNode(new Dictionary<object, object>("object", "object",
			{
				key1: 0,
				key2: 1
			}), new VDFSaveOptions({useStringKeys: true}));
			a.ToVDF(new VDFSaveOptions({useStringKeys: true})).Should().Be("{\"key1\":0 \"key2\":1}");
		});
		test("D1_Map_DoublesWithNumberTrimmingDisabled", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<object>("object", .1, 1.1), new VDFSaveOptions({useNumberTrimming: false}));
			a.ToVDF(new VDFSaveOptions({useNumberTrimming: false})).Should().Be("[0.1 1.1]");
		});
		test("D1_List_IntsWithCommaSeparators", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<object>("object", 0, 1), new VDFSaveOptions({useCommaSeparators: true}));
			a.listChildren.Count.Should().Be(2);
			a.ToVDF(new VDFSaveOptions({useCommaSeparators: true})).Should().Be("[0,1]");
		});

		// export all classes/enums to global scope
		var arguments;
		var classNames = V.GetMatches(arguments.callee.toString(), /        var (\w+) = \(function \(\) {/g, 1);
		for (var i = 0; i < classNames.length; i++)
			try { window[classNames[i]] = eval(classNames[i]); } catch(e) {}
		var enumNames = V.GetMatches(arguments.callee.toString(), /        }\)\((\w+) \|\| \(\w+ = {}\)\);/g, 1);
		for (var i = 0; i < enumNames.length; i++)
			try { window[enumNames[i]] = eval(enumNames[i]); } catch(e) {}

		(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base()).toString(); // make sure we create one instance, so that the type-info attachment code can run
	}
}