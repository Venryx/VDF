using System;
using System.Collections.Generic;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public class Saving
	{
		// from VDFNode
		// ==========

		[Fact] void Depth0_BaseValue()
		{
			var a = new VDFNode();
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("Root string.");

			a = new VDFNode();
			a[0] = new VDFNode {baseValue = "Root string also."};
			a.ToVDF().Should().Be("Root string also.");
		}
		[Fact] void Depth0_Metadata_Type()
		{
			var a = new VDFNode();
			a.metadata_type = "string";
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("string>Root string.");
		}
		[Fact] void Depth0_Metadata_Type_Collapsed()
		{
			var a = VDFSaver.ToVDFNode(new List<string>(), new VDFSaveOptions {typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("string>>");
			a = VDFSaver.ToVDFNode(new List<List<string>> {new List<string> {"1A", "1B", "1C"}}, new VDFSaveOptions {typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("List[List[string]]>>{1A|1B|1C}"); // only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
		}
		enum Enum1 { A, B, C }
		[Fact] void Depth0_EnumDefault()
		{
			var a = VDFSaver.ToVDFNode<Enum1>(Enum1.A);
			a.ToVDF().Should().Be("A");
		}
		[Fact] void Depth0_MultilineString()
		{
			var a = VDFSaver.ToVDFNode<string>("This is a\nmultiline string\nof three lines in total.");
			a.ToVDF().Should().Be("@@This is a\nmultiline string\nof three lines in total.@@");
		}
		[Fact] void Depth0_EscapeAsLiteral_1()
		{
			var a = new VDFNode("\tBase value string that needs escaping.");
			a.ToVDF().Should().Be("@@\tBase value string that needs escaping.@@");
		}
		[Fact] void Depth0_EscapeAsLiteral_2()
		{
			var a = new VDFNode("Base value string that {needs escaping}.");
			a.ToVDF().Should().Be("@@Base value string that {needs escaping}.@@");
		}
		[Fact] void Depth1_EscapeAsLiteral_Troublesome()
		{
			var a = new VDFNode();
			a[0] = new VDFNode("This is a list item that|needs|escaping.");
			a[1] = new VDFNode("Here's;;another.");
			a[2] = new VDFNode("This is a list item that doesn't need escaping.");
			a.ToVDF().Should().Be("@@This is a list item that|needs|escaping.@@|@@Here's;;another.@@|This is a list item that doesn't need escaping.");
		}

		[Fact] void Depth1_BaseValues()
		{
			var a = new VDFNode();
			a["bool"] = new VDFNode {baseValue = "false"};
			a["int"] = new VDFNode {baseValue = "5"};
			a["float"] = new VDFNode {baseValue = ".5"};
			a["string"] = new VDFNode {baseValue = "Prop value string."};
			a.ToVDF().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
		}
		[Fact] void Depth1_BaseValuesThatNeedEscaping()
		{
			var a = new VDFNode{baseValue = "string>In-string VDF data."};
			a.ToVDF().Should().Be("@@string>In-string VDF data.@@");
			a = new VDFNode {baseValue = "C:/path/with/colon/char/that/needs/escaping"};
			a.ToVDF().Should().Be("@@C:/path/with/colon/char/that/needs/escaping@@");
		}

		// from object
		// ==========

		[Fact] void Depth0_Null() { VDF.Serialize(null).Should().Be(">null"); }
		[Fact] void Depth0_EmptyString() { VDF.Serialize("").Should().Be(">empty"); }

		class TypeWithEmptyStringProp { [VDFProp(writeEmptyValue = false)] string emptyString = ""; }
		[Fact] void Depth1_IgnoreEmptyString() { VDF.Serialize<TypeWithEmptyStringProp>(new TypeWithEmptyStringProp()).Should().Be(""); }
		class TypeWithNullProps { [VDFProp] public object obj; [VDFProp] public List<string> strings; [VDFProp] public List<string> strings2 = new List<string>(); }
		[Fact] void Depth1_NullValues()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
			a["obj"].metadata_type.Should().Be(""); // type "null" should be collapsed
			a["obj"].baseValue.Should().Be("null");
			a["strings"].metadata_type.Should().Be("");
			a["strings"].baseValue.Should().Be("null");
			a["strings2"].metadata_type.Should().Be(null); // unmarked type
			a["strings2"].baseValue.Should().Be(null); // it's a List, so it shouldn't have a base-value
			a["strings2"].items.Count.Should().Be(0);
			a.ToVDF().Should().Be("TypeWithNullProps>obj{>null}strings{>null}strings2{}");
		}
		class TypeWithList_PopOutItemData { [VDFProp(popOutChildrenL2: true)] List<string> list = new List<string>{"A", "B"}; }
		[Fact] void Depth1_ListItems_PoppedOutChildren()
		{
			var a = VDFSaver.ToVDFNode<TypeWithList_PopOutItemData>(new TypeWithList_PopOutItemData());
			a.ToVDF().Should().Be(@"list:
	A
	B".Replace("\r", ""));
		}
		[Fact] void Depth1_ListItems_Null()
		{
			var a = VDFSaver.ToVDFNode(new List<string>{null});
			a[0].metadata_type.Should().Be("");
			a[0].baseValue.Should().Be("null");
			a.ToVDF().Should().Be("string>>>null");
		}
		[Fact] void Depth1_StringAndArraysInArray() { VDF.Serialize(new List<object> {"text", new List<string> {"a", "b"}}).Should().Be(">>{text}|{string>>a|b}"); }
		[Fact] void Depth1_DictionaryValues_Null()
		{
			var dictionary = new Dictionary<string, string>();
			dictionary.Add("key1", null);
			var a = VDFSaver.ToVDFNode(dictionary);
			a["key1"].metadata_type.Should().Be(""); 
			a["key1"].baseValue.Should().Be("null");
			a.ToVDF().Should().Be("string,string>>key1{>null}");
		}
		[Fact] void Depth1_AnonymousTypeProperties_MarkNoTypes()
		{
			var a = VDFSaver.ToVDFNode(new {Bool = false, Int = 5, Float = .5f, String = "Prop value string."}, new VDFSaveOptions{typeMarking = VDFTypeMarking.None});
			a["Bool"].baseValue.Should().Be("false");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("Bool{false}Int{5}Float{.5}String{Prop value string.}");
		}
		[Fact] void Depth1_AnonymousTypeProperties_MarkAllTypes()
		{
			var a = VDFSaver.ToVDFNode(new {Bool = false, Int = 5, Float = .5f, String = "Prop value string."}, new VDFSaveOptions{typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("Bool{>false}Int{>5}Float{>.5}String{Prop value string.}");
		}
		class TypeWithPreSerializePrepMethod
		{
			[VDFProp] bool preSerializeWasCalled;
			[VDFPreSerialize] void VDFPreSerialize() { preSerializeWasCalled = true; }
		}
		[Fact] void Depth1_PreSerializePreparation()
		{
			var a = VDFSaver.ToVDFNode<TypeWithPreSerializePrepMethod>(new TypeWithPreSerializePrepMethod());
			((bool)a["preSerializeWasCalled"]).Should().Be(true);
			a.ToVDF().Should().Be("preSerializeWasCalled{true}");
		}
		class TypeWithPostSerializeCleanupMethod
		{
			[VDFProp] bool postSerializeWasCalled;
			[VDFPostSerialize] void VDFPostSerialize() { postSerializeWasCalled = true; }
		}
		[Fact] void Depth1_PostSerializeCleanup()
		{
			var a = VDFSaver.ToVDFNode<TypeWithPostSerializeCleanupMethod>(new TypeWithPostSerializeCleanupMethod());
			((bool)a["postSerializeWasCalled"]).Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
			a.ToVDF().Should().Be("postSerializeWasCalled{false}");
		}
		class TypeWithMixOfProps
		{
			[VDFProp] bool Bool = true;
			[VDFProp] int Int = 5;
			[VDFProp] float Float = .5f;
			[VDFProp] string String = "Prop value string.";
			[VDFProp] List<string> list = new List<string>{"2A", "2B"};
			[VDFProp] List<List<string>> nestedList = new List<List<string>>{new List<string>{"1A"}};
		}
		[Fact] void Depth1_TypeProperties_MarkForNone()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions { typeMarking = VDFTypeMarking.None });
			a["Bool"].baseValue.Should().Be("true");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a["list"][0].baseValue.Should().Be("2A");
			a["list"][1].baseValue.Should().Be("2B");
			a["nestedList"][0][0].baseValue.Should().Be("1A");
			a.ToVDF().Should().Be("Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
		}
		[Fact] void Depth1_TypeProperties_MarkForAssembly()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions{typeMarking = VDFTypeMarking.Assembly});
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
		}
		[Fact] void Depth1_TypeProperties_MarkForAssemblyExternal()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions{typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{>true}Int{>5}Float{>.5}String{Prop value string.}list{string>>2A|2B}nestedList{List[List[string]]>>{string>>1A}}");
		}
		[Fact] void Depth1_TypeProperties_MarkForAssemblyExternalNoCollapse()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions{typeMarking = VDFTypeMarking.AssemblyExternalNoCollapse});
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{bool>true}Int{int>5}Float{float>.5}String{string>Prop value string.}list{List[string]>>string>2A|string>2B}nestedList{List[List[string]]>>{List[string]>>string>1A}}");
		}

		class Depth1_Object_DictionaryPoppedOutThenBool_Class1
		{
			[VDFProp(popOutChildrenL2: true)] Dictionary<string, string> messages = new Dictionary<string, string>
			{
				{"title1", "message1"},
				{"title2", "message2"}
			};
			[VDFProp] bool otherProperty = true;
		}
		[Fact] void Depth1_DictionaryPoppedOutThenBool()
		{
			var a = VDFSaver.ToVDFNode(new Depth1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"messages:
	title1{message1}
	title2{message2}
^otherProperty{true}".Replace("\r", ""));
		}
		[VDFType(popOutChildrenL1: true)] class Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1
		{
			[VDFProp(popOutChildrenL2: true)] Dictionary<string, string> messages = new Dictionary<string, string>
			{
				{"title1", "message1"},
				{"title2", "message2"}
			};
			[VDFProp] bool otherProperty = true;
		}
		[Fact] void Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool()
		{
			var a = VDFSaver.ToVDFNode(new Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"
	messages:
		title1{message1}
		title2{message2}
	otherProperty{true}".Replace("\r", ""));
		}

		class T1_Depth1 { [VDFProp] T1_Depth2 level2 = new T1_Depth2(); }
		class T1_Depth2
		{
			[VDFProp(true, true)] List<string> messages = new List<string> {"DeepString1_Line1\n\tDeepString1_Line2", "DeepString2"};
			[VDFProp] bool otherProperty = true;
		}
		[Fact] void Depth2_Object_ArrayPoppedOutWithMultilineLiteralThenBool()
		{
			var a = VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"level2{messages:
	@@DeepString1_Line1
	DeepString1_Line2@@
	DeepString2
^otherProperty{true}}".Replace("\r", ""));
		}

		class Level1 { [VDFProp] Level2 level2 = new Level2(); }
		class Level2 { [VDFProp] Level3 level3_first = new Level3(); [VDFProp] Level3 level3_second = new Level3(); }
		class Level3 { [VDFProp(true, true)] List<string> messages = new List<string>{"DeepString1", "DeepString2"}; }
		[Fact] void Depth3_Object_Array_ArrayPoppedOut()
		{
			var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"level2{level3_first{messages:
	DeepString1
	DeepString2
}level3_second{messages:
	DeepString1
	DeepString2
}}".Replace("\r", ""));
		}

		class T4_Depth1 { [VDFProp] T4_Depth2 level2 = new T4_Depth2(); }
		class T4_Depth2 { [VDFProp] T4_Depth3 level3_first = new T4_Depth3(); [VDFProp] T4_Depth3 level3_second = new T4_Depth3(); }
		class T4_Depth3 { [VDFProp(true, true)] List<T4_Depth4> level4s = new List<T4_Depth4>{new T4_Depth4(), new T4_Depth4()}; }
		class T4_Depth4
		{
			[VDFProp(true, true)] List<string> messages = new List<string>{"text1", "text2"};
			[VDFProp] bool otherProperty = false;
		}
		[Fact] void Depth4_Object_Array_ArrayPoppedOut_ArrayPoppedOutThenBool()
		{
			var a = VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"level2{level3_first{level4s:
	messages:
		text1
		text2
	^otherProperty{false}
	messages:
		text1
		text2
	^otherProperty{false}
}level3_second{level4s:
	messages:
		text1
		text2
	^otherProperty{false}
	messages:
		text1
		text2
	^otherProperty{false}
}}".Replace("\r", ""));
		}

		[VDFType(false, true)] class T5_Depth2
		{
			[VDFProp] bool firstProperty = false;
			[VDFProp] bool otherProperty = false;
		}
		[Fact] void Depth4_Object_ArrayPoppedOut_Object()
		{
			var a = VDFSaver.ToVDFNode(new List<T5_Depth2>{new T5_Depth2()}, new VDFSaveOptions(typeMarking: VDFTypeMarking.AssemblyExternal));
			a.ToVDF().Should().Be(@"T5_Depth2>>{
	firstProperty{>false}
	otherProperty{>false}
}".Replace("\r", ""));
		}

		// unique to C# version
		// ==========

		class SpecialList2<T> : List<T> {}
		[Fact] void Depth1_SpecialListItems()
		{
			VDF.RegisterTypeExporter_Inline(typeof(SpecialList2<>), obj=>"You'll never see the items!"); // (example of where exporters/importers that can output/input VDFNode's would be helpful)
			var a = new SpecialList2<string>{"A", "B", "C"};
			VDF.Serialize<SpecialList2<string>>(a).Should().Be("You'll never see the items!");
		}
		class TypeWithArray { [VDFProp] string[] array = {"A", "B"}; }
		[Fact] void Depth1_ArrayItems()
		{
			var a = VDFSaver.ToVDFNode<TypeWithArray>(new TypeWithArray());
			a.ToVDF().Should().Be("array{A|B}");
		}
	}
}