using System;
using System.Collections;
using System.Collections.Generic;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public class Saving
	{
		// from VDFNode
		// ==========

		[Fact] void D0_BaseValue()
		{
			var a = new VDFNode();
			a.primitiveValue = "Root string.";
			a.ToVDF().Should().Be("\"Root string.\"");
		}
		[Fact] void D0_Infinity()
		{
			new VDFNode(double.PositiveInfinity).ToVDF().Should().Be("Infinity");
			new VDFNode(double.NegativeInfinity).ToVDF().Should().Be("-Infinity");
		}
		[Fact] void D0_MetadataType()
		{
			var a = new VDFNode();
			a.metadata = "string";
			a.primitiveValue = "Root string.";
			a.ToVDF().Should().Be("string>\"Root string.\"");
		}
		[Fact] void D0_MetadataTypeCollapsed()
		{
			var a = VDFSaver.ToVDFNode(new List<string>(), new VDFSaveOptions {typeMarking = VDFTypeMarking.External});
			a.ToVDF().Should().Be("List(string)>[]");
			a = VDFSaver.ToVDFNode(new List<List<string>> {new List<string> {"1A", "1B", "1C"}}, new VDFSaveOptions {typeMarking = VDFTypeMarking.External});
			a.ToVDF().Should().Be("List(List(string))>[[\"1A\" \"1B\" \"1C\"]]"); // old: only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
		}
		[Fact] void D0_MetadataTypeNoCollapse()
		{
			var a = VDFSaver.ToVDFNode(new List<string>(), new VDFSaveOptions {typeMarking = VDFTypeMarking.ExternalNoCollapse});
			a.ToVDF().Should().Be("List(string)>[]");
			a = VDFSaver.ToVDFNode(new List<List<string>> {new List<string> {"1A", "1B", "1C"}}, new VDFSaveOptions {typeMarking = VDFTypeMarking.ExternalNoCollapse});
			a.ToVDF().Should().Be("List(List(string))>[List(string)>[string>\"1A\" string>\"1B\" string>\"1C\"]]");
		}
		enum Enum1 { A, B, C }
		[Fact] void D0_EnumDefault()
		{
			var a = VDFSaver.ToVDFNode<Enum1>(Enum1.A);
			a.ToVDF().Should().Be("\"A\"");
		}
		[Fact] void D0_EscapedString()
		{
			var a = VDFSaver.ToVDFNode<string>(
@"Multiline string
that needs escaping.".Fix());
			a.ToVDF().Should().Be(
@"""<<Multiline string
that needs escaping.>>""".Fix());

			a = VDFSaver.ToVDFNode<string>("String \"that needs escaping\".");
			a.ToVDF().Should().Be("\"<<String \"that needs escaping\".>>\"");

			a = VDFSaver.ToVDFNode<string>("String <<that needs escaping>>.");
			a.ToVDF().Should().Be("\"<<<String <<that needs escaping>>.>>>\"");
		}

		[Fact] void D1_ListInferredFromHavingItem_String()
		{
			var a = new VDFNode();
			a[0] = new VDFNode {primitiveValue = "String item."};
			a.ToVDF().Should().Be("[\"String item.\"]");
		}
		[Fact] void D1_Object_Primitives()
		{
			var a = new VDFNode();
			a["bool"] = new VDFNode {primitiveValue = false};
			a["int"] = new VDFNode {primitiveValue = 5};
			a["double"] = new VDFNode {primitiveValue = .5f};
			a["string"] = new VDFNode {primitiveValue = "Prop value string."};
			a.ToVDF().Should().Be("{bool:false int:5 double:.5 string:\"Prop value string.\"}");
		}
		[Fact] void D1_List_EscapedStrings()
		{
			var a = new VDFNode();
			a[0] = new VDFNode("This is a list item \"that needs escaping\".");
			a[1] = new VDFNode("Here's <<another>>.");
			a[2] = new VDFNode("This one doesn't need escaping.");
			a.ToVDF().Should().Be("[\"<<This is a list item \"that needs escaping\".>>\" \"<<<Here's <<another>>.>>>\" \"This one doesn't need escaping.\"]");
		}
		[Fact] void D0_EmptyArray() { VDF.Serialize(new object[0]).Should().Be("[]"); }

		// from object
		// ==========

		[Fact] void D0_Null() { VDF.Serialize(null).Should().Be("null"); }
		[Fact] void D0_EmptyString() { VDF.Serialize("").Should().Be("\"\""); }

		class TypeWithDefaultStringProp { [VDFProp(writeDefaultValue = false)] string defaultString; }
		[Fact] void D1_IgnoreEmptyString() { VDF.Serialize<TypeWithDefaultStringProp>(new TypeWithDefaultStringProp()).Should().Be("{}"); }
		class TypeWithNullProps { [VDFProp] public object obj; [VDFProp] public List<string> strings; [VDFProp] public List<string> strings2 = new List<string>(); }
		[Fact] void D1_NullValues()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
			a["obj"].metadata.Should().Be(null);
			a["obj"].primitiveValue.Should().Be(null);
			a["strings"].metadata.Should().Be(null);
			a["strings"].primitiveValue.Should().Be(null);
			//a["strings2"].metadata.Should().Be(null); // unmarked type
			a["strings2"].metadata.Should().Be(null); // old: auto-marked as list (needed, to specify sort of type, as required)
			a["strings2"].primitiveValue.Should().Be(null); // it's a List, so it shouldn't have a base-value
			a["strings2"].listChildren.Count.Should().Be(0);
			a.ToVDF().Should().Be("TypeWithNullProps>{obj:null strings:null strings2:[]}");
		}
		class TypeWithList_PopOutItemData { [VDFProp(popOutL2: true)] List<string> list = new List<string>{"A", "B"}; }
		[Fact] void D1_ListItems_PoppedOutChildren()
		{
			var a = VDFSaver.ToVDFNode<TypeWithList_PopOutItemData>(new TypeWithList_PopOutItemData());
			a.ToVDF().Should().Be(@"{list:[^]}
	""A""
	""B""".Replace("\r", ""));
		}
		[Fact] void D1_ListItems_Null()
		{
			var a = VDFSaver.ToVDFNode(new List<string>{null});
			a[0].metadata.Should().Be(null);
			a[0].primitiveValue.Should().Be(null);
			a.ToVDF().Should().Be("List(string)>[null]");
		}
		[Fact] void D1_SingleListItemWithAssemblyKnownTypeShouldStillSpecifySortOfType()
		{
			var a = VDFSaver.ToVDFNode<List<string>>(new List<string>{"hi"});
			a.ToVDF().Should().Be("[\"hi\"]");
		}
		[Fact] void D1_StringAndArraysInArray() { VDF.Serialize(new List<object> {"text", new List<string> {"a", "b"}}).Should().Be("[\"text\" List(string)>[\"a\" \"b\"]]"); }
		[Fact] void D1_DictionaryValues_Null()
		{
			var dictionary = new Dictionary<string, string>();
			dictionary.Add("key1", null);
			var a = VDFSaver.ToVDFNode(dictionary);
			a["key1"].metadata.Should().Be(null); 
			a["key1"].primitiveValue.Should().Be(null);
			a.ToVDF().Should().Be("Dictionary(string string)>{key1:null}");
		}
		[Fact] void TypeW()
		{
			var a = VDFSaver.ToVDFNode(new {Bool = false, Int = 5, Double = .5, String = "Prop value string."}, new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a["Bool"].primitiveValue.Should().Be(false);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
		}
		[Fact] void D1_AnonymousTypeProperties_MarkAllTypes()
		{
			var a = VDFSaver.ToVDFNode(new {Bool = false, Int = 5, Double = .5, String = "Prop value string."}, new VDFSaveOptions(typeMarking: VDFTypeMarking.External));
			a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
		}
		class TypeWithPreSerializePrepMethod
		{
			[VDFProp] bool preSerializeWasCalled;
			[VDFPreSerialize] void VDFPreSerialize() { preSerializeWasCalled = true; }
		}
		[Fact] void D1_PreSerializePreparation()
		{
			var a = VDFSaver.ToVDFNode<TypeWithPreSerializePrepMethod>(new TypeWithPreSerializePrepMethod());
			((bool)a["preSerializeWasCalled"]).Should().Be(true);
			a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
		}
		class TypeWithPostSerializeCleanupMethod
		{
			[VDFProp] bool postSerializeWasCalled;
			[VDFPostSerialize] void VDFPostSerialize() { postSerializeWasCalled = true; }
		}
		[Fact] void D1_PostSerializeCleanup()
		{
			var a = VDFSaver.ToVDFNode<TypeWithPostSerializeCleanupMethod>(new TypeWithPostSerializeCleanupMethod());
			((bool)a["postSerializeWasCalled"]).Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
			a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
		}
		class TypeWithMixOfProps
		{
			[VDFProp] bool Bool = true;
			[VDFProp] int Int = 5;
			[VDFProp] double Double = .5;
			[VDFProp] string String = "Prop value string.";
			[VDFProp] List<string> list = new List<string>{"2A", "2B"};
			[VDFProp] List<List<string>> nestedList = new List<List<string>>{new List<string>{"1A"}};
		}
		[Fact] void D1_TypeProperties_MarkForNone()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a["Bool"].primitiveValue.Should().Be(true);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a["list"][0].primitiveValue.Should().Be("2A");
			a["list"][1].primitiveValue.Should().Be("2B");
			a["nestedList"][0][0].primitiveValue.Should().Be("1A");
			a.ToVDF().Should().Be("{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
		}
		[Fact] void D1_TypeProperties_MarkForInternal()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(typeMarking: VDFTypeMarking.Internal));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
		}
		[Fact] void D1_TypeProperties_MarkForExternal()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(typeMarking: VDFTypeMarking.External));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:List(string)>[\"2A\" \"2B\"] nestedList:List(List(string))>[[\"1A\"]]}");
		}
		[Fact] void D1_TypeProperties_MarkForExternalNoCollapse()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(typeMarking: VDFTypeMarking.ExternalNoCollapse));
			a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:bool>true Int:int>5 Double:double>.5 String:string>\"Prop value string.\" list:List(string)>[string>\"2A\" string>\"2B\"] nestedList:List(List(string))>[List(string)>[string>\"1A\"]]}");
		}

		class D1_Object_DictionaryPoppedOutThenBool_Class1
		{
			[VDFProp(popOutL2: true)] Dictionary<string, string> messages = new Dictionary<string, string>
			{
				{"title1", "message1"},
				{"title2", "message2"}
			};
			[VDFProp] bool otherProperty = true;
		}
		[Fact] void D1_DictionaryPoppedOutThenBool()
		{
			var a = VDFSaver.ToVDFNode(new D1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"{messages:{^} otherProperty:true}
	title1:""message1""
	title2:""message2""".Replace("\r", ""));
		}
		[VDFType(popOutL1: true)] class D1_Map_PoppedOutDictionary_PoppedOutPairs_Class
		{
			[VDFProp(popOutL2: true)] Dictionary<string, string> messages = new Dictionary<string, string>
			{
				{"title1", "message1"},
				{"title2", "message2"}
			};
			[VDFProp] bool otherProperty = true;
		}
		[Fact] void D1_Map_PoppedOutDictionary_PoppedOutPairs()
		{
			var a = VDFSaver.ToVDFNode(new D1_Map_PoppedOutDictionary_PoppedOutPairs_Class(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"{^}
	messages:{^}
		title1:""message1""
		title2:""message2""
	otherProperty:true".Replace("\r", ""));
		}

		class T1_Depth1 { [VDFProp] T1_Depth2 level2 = new T1_Depth2(); }
		class T1_Depth2
		{
			[VDFProp(popOutL2: true)] List<string> messages = new List<string> {"DeepString1_Line1\n\tDeepString1_Line2", "DeepString2"};
			[VDFProp] bool otherProperty = true;
		}
		[Fact] void D2_Map_ListThenBool_PoppedOutStringsWithOneMultiline()
		{
			var a = VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"{level2:{messages:[^] otherProperty:true}}
	""<<DeepString1_Line1
	DeepString1_Line2>>""
	""DeepString2""".Replace("\r", ""));
		}

		class Level1 { [VDFProp] public Level2 level2 = new Level2(); }
		class Level2 { [VDFProp] Level3 level3_first = new Level3(); [VDFProp] public Level3 level3_second = new Level3(); }
		class Level3 { [VDFProp(popOutL2: true)] public List<string> messages = new List<string> { "DeepString1", "DeepString2" }; }
		[Fact] void D3_Map_Map_Maps_Lists_PoppedOutStrings()
		{
			var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"{level2:{level3_first:{messages:[^]} level3_second:{messages:[^]}}}
	""DeepString1""
	""DeepString2""
	^""DeepString1""
	""DeepString2""".Replace("\r", ""));
		}
		[Fact] void D3_Map_Map_Maps_ListsWithOneEmpty_PoppedOutStrings()
		{
			var obj = new Level1();
			obj.level2.level3_second.messages.Clear();
			var a = VDFSaver.ToVDFNode(obj, new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"{level2:{level3_first:{messages:[^]} level3_second:{messages:[]}}}
	""DeepString1""
	""DeepString2""".Replace("\r", ""));
		}

		class T4_Depth1 { [VDFProp] T4_Depth2 level2 = new T4_Depth2(); }
		class T4_Depth2 { [VDFProp] T4_Depth3 level3_first = new T4_Depth3(); [VDFProp] T4_Depth3 level3_second = new T4_Depth3(); }
		class T4_Depth3 { [VDFProp(popOutL2: true)] List<T4_Depth4> level4s = new List<T4_Depth4> { new T4_Depth4(), new T4_Depth4() }; }
		class T4_Depth4
		{
			[VDFProp(popOutL2: true)] List<string> messages = new List<string>{"text1", "text2"};
			[VDFProp] bool otherProperty = false;
		}
		[Fact] void D4_Map_Map_Maps_Lists_PoppedOutMaps_ListsThenBools_PoppedOutStrings()
		{
			var a = VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"{level2:{level3_first:{level4s:[^]} level3_second:{level4s:[^]}}}
	{messages:[^] otherProperty:false}
		""text1""
		""text2""
	{messages:[^] otherProperty:false}
		""text1""
		""text2""
	^{messages:[^] otherProperty:false}
		""text1""
		""text2""
	{messages:[^] otherProperty:false}
		""text1""
		""text2""".Replace("\r", ""));
		}

		[VDFType(popOutL1: true)] class T5_Depth2
		{
			[VDFProp] bool firstProperty = false;
			[VDFProp] bool otherProperty = false;
		}
		[Fact] void D4_List_Map_PoppedOutBools()
		{
			var a = VDFSaver.ToVDFNode(new List<T5_Depth2>{new T5_Depth2()}, new VDFSaveOptions(typeMarking: VDFTypeMarking.External));
			a.ToVDF().Should().Be(@"List(T5_Depth2)>[{^}]
	firstProperty:false
	otherProperty:false".Replace("\r", ""));
		}

		// prop-inclusion by regex
		// ==========

		/*class D1_Map_PropWithTagInSaveOptionsIncludeTags_Class
		{
			public bool withoutTag = true;
			[Tags("include")] public bool withTag = true;
		}
		[Fact] void D1_Map_PropWithTagInSaveOptionsIncludeTags()
			{ VDF.Serialize<D1_Map_PropWithTagInSaveOptionsIncludeTags_Class>(new D1_Map_PropWithTagInSaveOptionsIncludeTags_Class(), new VDFSaveOptions(includeTags: new[] {"include"})).Should().Be("{withTag:true}"); }*/

		[VDFType(propIncludeRegexL1: "^[^_]")] class D1_Map_PropWithNameMatchingIncludeRegex_Class
		{
			public bool _notMatching = true;
			public bool matching = true;
		}
		[Fact] void D1_Map_PropWithNameMatchingIncludeRegex()
			{ VDF.Serialize<D1_Map_PropWithNameMatchingIncludeRegex_Class>(new D1_Map_PropWithNameMatchingIncludeRegex_Class()).Should().Be("{matching:true}"); }

		[VDFType(propIncludeRegexL1: "^[^_]")] class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base {}
		[VDFType] class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived : D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base
		{
			public bool _notMatching = true;
			public bool matching = true;
		}
		[Fact] void D1_Map_PropWithNameMatchingBaseClassIncludeRegex()
			{ VDF.Serialize<D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived>(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived()).Should().Be("{matching:true}"); }

		// serialize-related methods
		// ==========

		class D1_MapWithEmbeddedSerializeMethod_Prop_Class
		{
			public bool notIncluded = true;
			public bool included = true;

			[VDFSerialize] VDFNode Serialize() //VDFPropInfo prop, VDFSaveOptions options)
			{
				var result = new VDFNode();
				result.mapChildren["included"] = new VDFNode(included);
				return result;
			}
		}
		[Fact] void D1_MapWithEmbeddedSerializeMethod_Prop()
			{ VDF.Serialize<D1_MapWithEmbeddedSerializeMethod_Prop_Class>(new D1_MapWithEmbeddedSerializeMethod_Prop_Class()).Should().Be("{included:true}"); }

		class D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class
		{
			[VDFProp] public bool boolProp = true;
			[VDFSerialize] VDFNode Serialize() { return VDF.NoActionTaken; }
		}
		[Fact] void D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop()
			{ VDF.Serialize<D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class>(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class()).Should().Be("{boolProp:true}"); }

		class D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class
		{
			[VDFPreSerializeProp] VDFNode PreSerializeProp(VDFNodePath propPath, VDFSaveOptions options) { return VDF.CancelSerialize; }
			
			[VDFProp] public bool boolProp = true;
		}
		[Fact] void D1_Map_BoolWhoseSerializeIsCanceledFromParent() { VDF.Serialize<D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class>(new D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class()).Should().Be("{}"); }

		class D1_Map_MapThatCancelsItsSerialize_Class_Parent { [VDFProp] public D1_Map_MapThatCancelsItsSerialize_Class_Child child = new D1_Map_MapThatCancelsItsSerialize_Class_Child(); }
		class D1_Map_MapThatCancelsItsSerialize_Class_Child { [VDFSerialize] VDFNode Serialize() { return VDF.CancelSerialize; } }
		[Fact] void D1_Map_MapThatCancelsItsSerialize() { VDF.Serialize<D1_Map_MapThatCancelsItsSerialize_Class_Parent>(new D1_Map_MapThatCancelsItsSerialize_Class_Parent()).Should().Be("{}"); }

		// for JSON compatibility
		// ==========

		class D0_MapWithMetadataDisabled_Class {}
		[Fact] void D0_MapWithMetadataDisabled()
		{
			var a = VDFSaver.ToVDFNode(new D0_MapWithMetadataDisabled_Class(), new VDFSaveOptions(useMetadata: false));
			a.metadata.Should().Be(null);
		}
		class D0_Map_List_BoolsWithPopOutDisabled_Class { [VDFProp(true, true)] List<int> ints = new List<int>{0, 1}; }
		[Fact] void D0_Map_List_BoolsWithPopOutDisabled()
		{
			var a = VDFSaver.ToVDFNode<D0_Map_List_BoolsWithPopOutDisabled_Class>(new D0_Map_List_BoolsWithPopOutDisabled_Class(), new VDFSaveOptions(useChildPopOut: false));
			a.ToVDF().Should().Be("{ints:[0 1]}");
		}
		[Fact] void D1_Map_IntsWithStringKeys()
		{
			var a = VDFSaver.ToVDFNode(new Dictionary<object, object>{{"key1", 0}, {"key2", 1}}, new VDFSaveOptions(useStringKeys: true));
			a.ToVDF(new VDFSaveOptions(useStringKeys: true)).Should().Be("{\"key1\":0 \"key2\":1}");
		}
		[Fact] void D1_Map_DoublesWithNumberTrimmingDisabled()
		{
			var a = VDFSaver.ToVDFNode(new List<object>{.1, 1.1}, new VDFSaveOptions(useNumberTrimming: false));
			a.ToVDF(new VDFSaveOptions(useNumberTrimming: false)).Should().Be("[0.1 1.1]");
		}
		[Fact] void D1_List_IntsWithCommaSeparators()
		{
			var a = VDFSaver.ToVDFNode(new List<object>{0, 1}, new VDFSaveOptions(useCommaSeparators: true));
			a.listChildren.Count.Should().Be(2);
			a.ToVDF(new VDFSaveOptions(useCommaSeparators: true)).Should().Be("[0,1]");
		}

		// unique to C# version
		// ==========

		/*class SpecialList2<T> : List<T> {}
		[Fact] void D1_SpecialListItems()
		{
			VDF.RegisterTypeExporter_Inline(typeof(SpecialList2<>), obj=>"You'll never see the items!"); // example of where exporters/importers that can output/input VDFNode's would be helpful
			var a = new SpecialList2<string>{"A", "B", "C"};
			VDF.Serialize<SpecialList2<string>>(a).Should().Be("\"You'll never see the items!\"");
		}*/
		class D1_ListOfTypeArray_Strings_Class { [VDFProp] string[] array = {"A", "B"}; }
		[Fact] void D1_ListOfTypeArray_Strings()
		{
			var a = VDFSaver.ToVDFNode<D1_ListOfTypeArray_Strings_Class>(new D1_ListOfTypeArray_Strings_Class());
			a.ToVDF().Should().Be("{array:[\"A\" \"B\"]}");
		}
		class D1_ListOfTypeArrayList_Strings_Class { [VDFProp] ArrayList array = new ArrayList{ "A", "B" }; }
		[Fact] void D1_ListOfTypeArrayList_Strings()
		{
			var a = VDFSaver.ToVDFNode<D1_ListOfTypeArrayList_Strings_Class>(new D1_ListOfTypeArrayList_Strings_Class());
			a.ToVDF().Should().Be("{array:[\"A\" \"B\"]}");
		}
	}
}