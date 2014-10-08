using System;
using System.Collections.Generic;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public class Saving
	{
		static Saving()
		{
			VDF.RegisterTypeExporter_Inline<Guid>(id => id.ToString());
			VDF.RegisterTypeImporter_Inline<Guid>(str => new Guid(str));
			VDF.RegisterTypeExporter_Inline<Vector3>(point => point.x + "," + point.y + "," + point.z);
			VDF.RegisterTypeImporter_Inline<Vector3>(str =>
			{
				string[] parts = str.Split(new[] { ',' });
				return new Vector3(float.Parse(parts[0]), float.Parse(parts[1]), float.Parse(parts[2]));
			});
		}

		// from VDFNode
		// ==========

		[Fact] void FromVDFNode_Level0_BaseValue()
		{
			var a = new VDFNode();
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("Root string.");

			a = new VDFNode();
			a[0] = new VDFNode {baseValue = "Root string also."};
			a.ToVDF().Should().Be("Root string also.");
		}
		[Fact] void FromVDFNode_Level0_Metadata_Type()
		{
			var a = new VDFNode();
			a.metadata_type = "string";
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("string>Root string.");
		}
		[Fact] void FromVDFNode_Level0_Metadata_Type_Collapsed()
		{
			var a = VDFSaver.ToVDFNode(new List<string>(), new VDFSaveOptions{typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("string>>");
			a = VDFSaver.ToVDFNode(new List<List<string>> {new List<string> {"1A", "1B", "1C"}}, new VDFSaveOptions {typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("List[List[string]]>>{1A|1B|1C}"); // only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
		}
		enum Enum1 { A, B, C }
		[Fact] void FromVDFNode_Level0_EnumDefault()
		{
			var a = VDFSaver.ToVDFNode<Enum1>(Enum1.A);
			a.ToVDF().Should().Be("A");
		}
		[Fact] void FromVDFNode_Level0_MultilineString()
		{
			var a = VDFSaver.ToVDFNode<string>("This is a\nmultiline string\nof three lines in total.");
			a.ToVDF().Should().Be("@@This is a\nmultiline string\nof three lines in total.@@");
		}

		[Fact] void FromVDFNode_Level1_BaseValues()
		{
			var a = new VDFNode();
			a["bool"] = new VDFNode {baseValue = "false"};
			a["int"] = new VDFNode {baseValue = "5"};
			a["float"] = new VDFNode {baseValue = ".5"};
			a["string"] = new VDFNode {baseValue = "Prop value string."};
			a.ToVDF().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
		}
		[Fact] void FromVDFNode_Level1_BaseValuesThatNeedEscaping()
		{
			var a = new VDFNode{baseValue = "string>In-string VDF data."};
			a.ToVDF().Should().Be("@@string>In-string VDF data.@@");
		}

		// from object
		// ==========

		[Fact] void FromVDFNode_Level0_Null() { VDF.Serialize(null).Should().Be(">null"); }
		[Fact] void FromVDFNode_Level0_EmptyString() { VDF.Serialize("").Should().Be(">empty"); }

		class TypeWithEmptyStringProp { [VDFProp(writeEmptyValue = false)] string emptyString = ""; }
		[Fact] void ToVDF_Level1_IgnoreEmptyString() { VDF.Serialize<TypeWithEmptyStringProp>(new TypeWithEmptyStringProp()).Should().Be(""); }
		class TypeWithNullProps { [VDFProp] public object obj; [VDFProp] public List<string> strings; [VDFProp] public List<string> strings2 = new List<string>(); }
		[Fact] void ToVDF_Level1_NullValues()
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
		class TypeWithList_PopOutItemData { [VDFProp(popOutChildren = true)] List<string> list = new List<string>{"A", "B"}; }
		[Fact] void ToVDF_Level1_ListItems_PoppedOutChildren()
		{
			var a = VDFSaver.ToVDFNode<TypeWithList_PopOutItemData>(new TypeWithList_PopOutItemData());
			a.ToVDF().Should().Be(@"list:
	A
	B".Replace("\r", ""));
		}
		[Fact] void ToVDF_Level1_ListItems_Null()
		{
			var a = VDFSaver.ToVDFNode(new List<string>{null});
			a[0].metadata_type.Should().Be("");
			a[0].baseValue.Should().Be("null");
			a.ToVDF().Should().Be("string>>>null");
		}
		[Fact] void ToVDF_Level1_DictionaryValues_Null()
		{
			var dictionary = new Dictionary<string, string>();
			dictionary.Add("key1", null);
			var a = VDFSaver.ToVDFNode(dictionary);
			a["key1"].metadata_type.Should().Be(""); 
			a["key1"].baseValue.Should().Be("null");
			a.ToVDF().Should().Be("string,string>>key1{>null}");
		}
		[Fact] void ToVDF_Level1_AnonymousTypeProperties_MarkNoTypes()
		{
			var a = VDFSaver.ToVDFNode(new {Bool = false, Int = 5, Float = .5f, String = "Prop value string."}, new VDFSaveOptions{typeMarking = VDFTypeMarking.None});
			a["Bool"].baseValue.Should().Be("false");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a.ToVDF().Should().Be("Bool{false}Int{5}Float{.5}String{Prop value string.}");
		}
		[Fact] void ToVDF_Level1_AnonymousTypeProperties_MarkAllTypes()
		{
			var a = VDFSaver.ToVDFNode(new {Bool = false, Int = 5, Float = .5f, String = "Prop value string."}, new VDFSaveOptions{typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("Bool{>false}Int{>5}Float{>.5}String{Prop value string.}");
		}
		class TypeWithPreSerializePrepMethod
		{
			[VDFProp] bool preSerializeWasCalled;
			[VDFPreSerialize] void VDFPreSerialize() { preSerializeWasCalled = true; }
		}
		[Fact] void ToVDF_Level1_PreSerializePreparation()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod());
			((bool)a["preSerializeWasCalled"]).Should().Be(true);
			a.ToVDF().Should().Be("TypeWithPreSerializePrepMethod>preSerializeWasCalled{true}");
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
		[Fact] void ToVDF_Level1_TypeProperties_MarkForNone()
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
		[Fact] void ToVDF_Level1_TypeProperties_MarkForAssembly()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions{typeMarking = VDFTypeMarking.Assembly});
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
		}
		[Fact] void ToVDF_Level1_TypeProperties_MarkForAssemblyExternal()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions{typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{>true}Int{>5}Float{>.5}String{Prop value string.}list{string>>2A|2B}nestedList{List[List[string]]>>{string>>1A}}");
		}
		[Fact] void ToVDF_Level1_TypeProperties_MarkForAssemblyExternalNoCollapse()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions{typeMarking = VDFTypeMarking.AssemblyExternalNoCollapse});
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{bool>true}Int{int>5}Float{float>.5}String{string>Prop value string.}list{List[string]>>string>2A|string>2B}nestedList{List[List[string]]>>{List[string]>>string>1A}}");
		}

		class Level1_1 { [VDFProp] Level2_1 level2 = new Level2_1(); }
		class Level2_1
		{
			[VDFProp(true, true)] List<string> messages = new List<string> { "DeepString1", "DeepString2" };
			[VDFProp] bool otherProperty = false;
		}
		[Fact] void ToVDF_Level2_Simple_PoppedOutChildrenThenProperties()
		{
			var a = VDFSaver.ToVDFNode(new Level1_1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a.ToVDF().Should().Be(@"level2{messages:
	DeepString1
	DeepString2
^otherProperty{false}}".Replace("\r", ""));
		}

		class Level1 { [VDFProp] Level2 level2 = new Level2(); }
		class Level2 { [VDFProp] Level3 level3_first = new Level3(); [VDFProp] Level3 level3_second = new Level3(); }
		class Level3 { [VDFProp(true, true)] List<string> messages = new List<string>{"DeepString1", "DeepString2"}; }
		[Fact] void ToVDF_Level3_Simple_Children_PoppedOutChildren()
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

		class T4_Level1 { [VDFProp] T4_Level2 level2 = new T4_Level2(); }
		class T4_Level2 { [VDFProp] T4_Level3 level3_first = new T4_Level3(); [VDFProp] T4_Level3 level3_second = new T4_Level3(); }
		class T4_Level3 { [VDFProp(true, true)] List<T4_Level4> level4s = new List<T4_Level4>{new T4_Level4(), new T4_Level4()}; }
		class T4_Level4
		{
			[VDFProp(true, true)] List<string> messages = new List<string>{"text1", "text2"};
			[VDFProp] bool otherProperty = false;
		}
		[Fact] void ToVDF_Level4_Simple_Children_PoppedOutChildren_PoppedOutChildrenThenProperty()
		{
			var a = VDFSaver.ToVDFNode(new T4_Level1(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
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

		// unique to C# version
		// ==========

		class SpecialList2<T> : List<T> {}
		[Fact] void ToVDF_Level1_SpecialListItems()
		{
			VDF.RegisterTypeExporter_Inline(typeof(SpecialList2<>), obj=>"You'll never see the items!"); // (example of where exporters/importers that can output/input VDFNode's would be helpful)
			var a = new SpecialList2<string>{"A", "B", "C"};
			VDF.Serialize<SpecialList2<string>>(a).Should().Be("You'll never see the items!");
		}
	}
}