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

		test("D1_ListInferredFromHavingItem_String", ()=>
		{
			var a = new VDFNode();
			a.SetListChild(0, new VDFNode("String item."));
			a.ToVDF().Should().Be("[\"String item.\"]");
		});
		test("D1_Object_Primitives", ()=>
		{
			var a = new VDFNode();
			a.SetMapChild("bool", new VDFNode(false));
			a.SetMapChild("int", new VDFNode(5));
			a.SetMapChild("double", new VDFNode(.5));
			a.SetMapChild("string", new VDFNode("Prop value string."));
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

		// from object
		// ==========

		test("D0_Null", ()=> { VDF.Serialize(null).Should().Be("null"); });
		test("D0_EmptyString", ()=> { VDF.Serialize("").Should().Be("\"\""); });

		class TypeWithDefaultStringProp
		{
			static typeInfo = new VDFTypeInfo(
			{
				defaultString: new VDFPropInfo("string", true, false, false)
			});
			defaultString: string;
		}
		test("D1_IgnoreEmptyString", ()=> { VDF.Serialize(new TypeWithDefaultStringProp(), "TypeWithDefaultStringProp").Should().Be("{}"); });
		class TypeWithNullProps
		{
			static typeInfo = new VDFTypeInfo(
			{
				obj: new VDFPropInfo("object", true),
				strings: new VDFPropInfo("List(string)", true),
				strings2: new VDFPropInfo("List(string)", true)
			});
			obj: any;
			strings: List<string>;
			strings2 = new List<string>("string");
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
			static typeInfo = new VDFTypeInfo(
			{
				list: new VDFPropInfo("List(string)", true, true)
			});
			list = new List<string>("string", "A", "B");
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
			static typeInfo = new VDFTypeInfo(
			{
				preSerializeWasCalled: new VDFPropInfo("bool", true)
			});
			preSerializeWasCalled;
			VDFPreSerialize(): void { this.preSerializeWasCalled = true; }
		}
		test("D1_PreSerializePreparation", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod(), "TypeWithPreSerializePrepMethod");
			a["preSerializeWasCalled"].primitiveValue.Should().Be(true);
			a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
		});
		class TypeWithPostSerializeCleanupMethod
		{
			static typeInfo = new VDFTypeInfo(
			{
				postSerializeWasCalled: new VDFPropInfo("bool", true)
			});
			postSerializeWasCalled = false;
			VDFPostSerialize(): void { this.postSerializeWasCalled = true; }
		}
		test("D1_PostSerializeCleanup", ()=>
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
			a["postSerializeWasCalled"].primitiveValue.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
			a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
		});
		class TypeWithMixOfProps
		{
			static typeInfo = new VDFTypeInfo(
			{
				Bool: new VDFPropInfo("bool", true),
				Int: new VDFPropInfo("int", true),
				Double: new VDFPropInfo("double", true),
				String: new VDFPropInfo("string", true),
				list: new VDFPropInfo("List(string)", true),
				nestedList: new VDFPropInfo("List(List(string))", true)
			});
			Bool = true;
			Int = 5;
			Double = .5;
			String = "Prop value string.";
			list = new List<string>("string", "2A", "2B");
			nestedList = new List<List<string>>("List(string)", new List<string>("string", "1A"));
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
			static typeInfo = new VDFTypeInfo(
			{
				messages: new VDFPropInfo("Dictionary(string string)", true, true),
				otherProperty: new VDFPropInfo("bool", true)
			});
			messages = new Dictionary<string, string>("string", "string", {title1: "message1", title2:"message2"});
			otherProperty = true;
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
			static typeInfo = new VDFTypeInfo(
			{
				messages: new VDFPropInfo("Dictionary(string string)", true, true),
				otherProperty: new VDFPropInfo("bool", true)
			}, null, true);
			messages = new Dictionary<string, string>("string", "string",
			{
				title1: "message1",
				title2: "message2"
			});
			otherProperty = true;
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
			static typeInfo = new VDFTypeInfo(
			{
				level2: new VDFPropInfo("T1_Depth2", true)
			});
			level2 = new T1_Depth2();
		}
		class T1_Depth2
		{
			static typeInfo = new VDFTypeInfo(
			{
				messages: new VDFPropInfo("List(string)", true, true),
				otherProperty: new VDFPropInfo("bool", true),
			});
			messages = new List<string>("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
			otherProperty = true;
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
			static typeInfo = new VDFTypeInfo(
			{
				level2: new VDFPropInfo("Level2", true)
			});
			level2 = new Level2();
		}
		class Level2
		{
			static typeInfo = new VDFTypeInfo(
			{
				level3_first: new VDFPropInfo("Level3", true),
				level3_second: new VDFPropInfo("Level3", true)
			});
			level3_first = new Level3();
			level3_second = new Level3();
		}
		class Level3
		{
			static typeInfo = new VDFTypeInfo(
			{
				messages: new VDFPropInfo("List(string)", true, true)
			});
			messages = new List<string>("string", "DeepString1", "DeepString2");
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
			static typeInfo = new VDFTypeInfo(
			{
				level2: new VDFPropInfo("T4_Depth2", true)
			});
			level2 = new T4_Depth2();
		}
		class T4_Depth2
		{
			static typeInfo = new VDFTypeInfo(
			{
				level3_first: new VDFPropInfo("T4_Depth3", true),
				level3_second: new VDFPropInfo("T4_Depth3", true)
			});
			level3_first = new T4_Depth3();
			level3_second = new T4_Depth3();
		}
		class T4_Depth3
		{
			static typeInfo = new VDFTypeInfo(
			{
				level4s: new VDFPropInfo("List(T4_Depth4)", true, true)
			});
			level4s = new List<T4_Depth4>("T4_Depth4", new T4_Depth4(), new T4_Depth4());
		}
		class T4_Depth4
		{
			static typeInfo = new VDFTypeInfo(
			{
				messages: new VDFPropInfo("List(string)", true, true),
				otherProperty: new VDFPropInfo("bool", true)
			});
			messages = new List<string>("string", "text1", "text2");
			otherProperty = false;
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
			static typeInfo = new VDFTypeInfo(
			{
				firstProperty: new VDFPropInfo("bool", true),
				otherProperty: new VDFPropInfo("bool", true)
			}, null, true);
			firstProperty = false;
			otherProperty = false;
		}
		test("D4_List_Map_PoppedOutBools", ()=>
		{
			var a = VDFSaver.ToVDFNode(new List<T5_Depth2>("T5_Depth2", new T5_Depth2()), new VDFSaveOptions({typeMarking: VDFTypeMarking.External}));
			a.ToVDF().Should().Be("List(T5_Depth2)>[{^}]\n\
	firstProperty:false\n\
	otherProperty:false".replace(/\r/g, ""));
		});

		// tag stuff
		// ==========

		class D1_Map_PropWithNameMatchingIncludeRegex_Class
		{
			static typeInfo = new VDFTypeInfo(
			{
				_notMatching: new VDFPropInfo("bool"),
				matching: new VDFPropInfo("bool")
			}, "^[^_]");
			_notMatching = true;
			matching = true;
		}
		test("D1_Map_PropWithNameMatchingIncludeRegex", ()=>{ VDF.Serialize(new D1_Map_PropWithNameMatchingIncludeRegex_Class(), "D1_Map_PropWithNameMatchingIncludeRegex_Class").Should().Be("{matching:true}"); });

		class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base
		{
			static typeInfo = new VDFTypeInfo(null, "^[^_]");
		}
		class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived
		{
			static typeInfo = new VDFTypeInfo(
			{
				_notMatching: new VDFPropInfo("bool"),
				matching: new VDFPropInfo("bool")
			});
			_notMatching = true;
			matching = true;
		}
		D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype["__proto__"] = D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base.prototype;
		test("D1_Map_PropWithNameMatchingBaseClassIncludeRegex", ()=>{ VDF.Serialize(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived(), "D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived").Should().Be("{matching:true}"); });

		class D1_MapWithEmbeddedSerializeMethod_Prop_Class
		{
			static typeInfo = new VDFTypeInfo(
			{
				notIncluded: new VDFPropInfo("bool"),
				included: new VDFPropInfo("bool")
			});
			notIncluded = true;
			included = true;

			VDFSerialize(): VDFNode //VDFPropInfo prop, VDFSaveOptions options)
			{
				var result = new VDFNode();
				result.SetMapChild("included", new VDFNode(this.included));
				return result;
			}
		}
		//AddAttributes().type = D1_MapWithEmbeddedSerializeMethod_Prop_Class;
		test("D1_MapWithEmbeddedSerializeMethod_Prop", ()=>{ VDF.Serialize(new D1_MapWithEmbeddedSerializeMethod_Prop_Class(), "D1_MapWithEmbeddedSerializeMethod_Prop_Class").Should().Be("{included:true}"); });

		class D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class
		{
			static typeInfo = new VDFTypeInfo(
			{
				boolProp: new VDFPropInfo("bool", true)
			});
			boolProp = true;
			VDFSerialize() { return VDF.NoActionTaken; }
		}
		test("D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop", ()=>{ VDF.Serialize(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class(), "D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class").Should().Be("{boolProp:true}"); });


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
			static typeInfo = new VDFTypeInfo(
			{
				ints: new VDFPropInfo("List(int)", true, true)
			});
			ints = new List<number>("int", 0, 1);
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
	}
}