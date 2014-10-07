using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using SystemMaker;
using FluentAssertions;
using Xunit;

public class SpecialList<T> : List<T> {}
namespace VDFTests
{
	public class Loading
	{
		static Loading()
		{
			VDF.RegisterTypeExporter_Inline<Guid>(id=>id.ToString());
			VDF.RegisterTypeImporter_Inline<Guid>(str=>new Guid(str));
			VDF.RegisterTypeExporter_Inline<Vector3>(point=>point.x + "," + point.y + "," + point.z);
			VDF.RegisterTypeImporter_Inline<Vector3>(str=>
			{
				string[] parts = str.Split(new[] {','});
				return new Vector3(float.Parse(parts[0]), float.Parse(parts[1]), float.Parse(parts[2]));
			});
		}

		// to VDFNode
		// ==========
		
		[Fact] void ToVDFNode_Level0_Comment()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"// comment
			Root string.");
			a.baseValue.Should().Be("			Root string.");
		}
		[Fact] void ToVDFNode_Level0_BaseValue()
		{
			VDFNode a = VDFLoader.ToVDFNode("Root string.");
			a.baseValue.Should().Be("Root string."); // note; remember that for ambiguous cases like this, the base-like-value is added both as the obj's base-value and as its solitary item
		}
		[Fact] void ToVDFNode_Level0_BaseValue_SaveThenLoad()
		{
			var vdf = VDF.Serialize("Root string.");
			var a = VDFLoader.ToVDFNode(vdf);
			a.baseValue.Should().Be("Root string.");
			a.items.Count.Should().Be(0); // it should assume it's a base-value, unless indicated otherwise
			a.ToVDF().Should().Be("Root string.");
		}
		[Fact] void ToVDFNode_Level0_BaseValue_Literal()
		{
			VDFNode a = VDFLoader.ToVDFNode("@@Base-value string that {needs escaping}.@@");
			a.baseValue.Should().Be("Base-value string that {needs escaping}.");
		}
		[Fact] void ToVDFNode_Level0_Metadata_Type()
		{
			VDFNode a = VDFLoader.ToVDFNode("string>Root string.");
			a.metadata_type.Should().Be("string");
		}
		[Fact] void ToVDFNode_Level0_Array()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("Root string 1.|Root string 2.");
			a[0].baseValue.Should().Be("Root string 1.");
			a[1].baseValue.Should().Be("Root string 2.");
		}
		[Fact] void ToVDFNode_Level0_Array_ExplicitStartAndEndMarkers()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("{Root string 1.}|{Root string 2.}");
			a[0].baseValue.Should().Be("Root string 1.");
			a[1].baseValue.Should().Be("Root string 2.");
		}
		[Fact] void ToVDFNode_Level0_Array_Objects()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("name{Dan}age{50}|name{Bob}age{60}");
			((string)a[0]["name"]).Should().Be("Dan");
			((int)a[0]["age"]).Should().Be(50);
			((string)a[1]["name"]).Should().Be("Bob");
			((int)a[1]["age"]).Should().Be(60);
		}
		[Fact] void ToVDFNode_Level0_Array_Literals()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<string>>(@"first|@@second
which is on two lines@@|@@third
which is on
three lines@@");
			((string)a[0]).Should().Be("first");
			((string)a[1]).Should().Be(@"second
which is on two lines".Replace("\r", ""));
			((string)a[2]).Should().Be(@"third
which is on
three lines".Replace("\r", ""));
		}
		[Fact] void ToVDFNode_Level0_Array_Empty()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("|");
			//a.properties.Count.Should().Be(0);
			a[0].baseValue.Should().Be(null);
			a[1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level0_Array_None()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("");
			a.items.Count.Should().Be(0);
			a = VDFLoader.ToVDFNode(">>");
			a.items.Count.Should().Be(0);
		}
		[Fact] void ToVDFNode_Level0_ArrayMetadata1()
		{
			VDFNode a = VDFLoader.ToVDFNode("SpecialList[int]>>1|2", new VDFLoadOptions(null, null, new Dictionary<Type, string>{{typeof(SpecialList<>), "SpecialList"}}));
			a.metadata_type.Should().Be("SpecialList[int]");
			a[0].metadata_type.Should().Be(null);
			a[1].metadata_type.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level0_ArrayMetadata2()
		{
			VDFNode a = VDFLoader.ToVDFNode("SpecialList[int]>>int>1|int>2", new VDFLoadOptions(null, null, new Dictionary<Type, string>{{typeof(SpecialList<>), "SpecialList"}}));
			a.metadata_type.Should().Be("SpecialList[int]");
			a[0].metadata_type.Should().Be("int");
			a[1].metadata_type.Should().Be("int");
		}
		[Fact] void ToVDFNode_Level0_DictionaryItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("key1{Simple string.}key2{name{Dan}age{50}}");
			a["key1"].baseValue.Should().Be("Simple string.");
			((int)a["key2"]["age"]).Should().Be(50);
		}
		[Fact] void ToVDFNode_Level0_DictionaryItems_GetByKey()
		{
			VDFNode a = VDFLoader.ToVDFNode("key 1{value 1}key 2{value 2}");
			a["key 1"].baseValue.Should().Be("value 1");
			a["key 2"].baseValue.Should().Be("value 2");
		}
		[Fact] void ToVDFNode_Level0_InferDepth2()
		{
			var a = VDF.Deserialize<List<object>>(">>>false");
			a[0].Should().Be(false);
		}
		[Fact] void ToVDFNode_Level0_InferUnmarkedTypeToBeString()
		{
			var a = VDF.Deserialize<IList>(">>SimpleString");
			a[0].Should().Be("SimpleString");
		}
		[Fact] void ToVDFNode_Level0_KeepDeclaredType()
		{
			var a = VDF.Deserialize<List<object>>(">>SimpleString");
			a[0].GetType().Should().Be(typeof(object));
		}
		[Fact] void ToVDFNode_Level0_MultilineString()
		{
			VDFNode a = VDFLoader.ToVDFNode("@@This is a\nmultiline string\nof three lines in total.@@");
			a.baseValue.Should().Be("This is a\nmultiline string\nof three lines in total.");
		}

		[Fact] void ToVDFNode_Level1_BaseValuesWithImplicitCasting()
		{
			VDFNode a = VDFLoader.ToVDFNode("bool{false}int{5}float{.5}string{Prop value string.}");
			a["bool"].baseValue.Should().Be("false");
			a["int"].baseValue.Should().Be("5");
			a["float"].baseValue.Should().Be(".5");
			a["string"].baseValue.Should().Be("Prop value string.");

			// uses implicit casting
			Assert.True(a["bool"] == false);
			Assert.True(a["int"] == 5);
			Assert.True(a["float"] == .5f);
			Assert.True(a["string"] == "Prop value string.");
		}
		[Fact]
		void ToVDFNode_Level1_BaseValuesWithMarkedTypes()
		{
			VDFNode a = VDFLoader.ToVDFNode("bool{bool>false}int{int>5}float{float>.5}string{string>Prop value string.}");
			((bool)a["bool"]).Should().Be(false);
			((int)a["int"]).Should().Be(5);
			((float)a["float"]).Should().Be(.5f);
			((string)a["string"]).Should().Be("Prop value string.");
		}
		[Fact] void ToVDFNode_Level1_Literal()
		{
			VDFNode a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.");
		}
		[Fact] void ToVDFNode_Level1_TroublesomeLiteral1()
		{
			VDFNode a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@@|@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@");
		}
		[Fact] void ToVDFNode_Level1_TroublesomeLiteral2()
		{
			VDFNode a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@||@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@|");
		}
		[Fact] void ToVDFNode_Level1_VDFWithVDFWithVDF()
		{
			VDFNode a = VDFLoader.ToVDFNode("level1{@@level2{@@@level3{Base string.}@@@}@@}");
			a["level1"].baseValue.Should().Be("level2{@@level3{Base string.}@@}");
			VDFLoader.ToVDFNode(a["level1"])["level2"].baseValue.Should().Be("level3{Base string.}");
			VDFLoader.ToVDFNode(VDFLoader.ToVDFNode(a["level1"])["level2"])["level3"].baseValue.Should().Be("Base string.");
		}
		[Fact] void ToVDFNode_Level1_PoppedOutBaseValue()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"name{#}
	Dan");
			a["name"].baseValue.Should().Be("Dan");
		}
		[Fact] void ToVDFNode_Level1_PoppedOutNodes()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"names{#}
	Dan
	Bob");
			a["names"][0].baseValue.Should().Be("Dan");
			a["names"][1].baseValue.Should().Be("Bob");
		}
		[Fact]
		void ToVDFNode_Level1_ArraysInArrays()
		{
			VDFNode a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}|{3A}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be("1B");
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be("2B");
			a[2].baseValue.Should().Be("3A");
		}
		[Fact] void ToVDFNode_Level1_ArraysInArrays_SecondsEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("{1A|}|{2A|}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be(null);
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level1_ArraysInArrays_FirstsAndSecondsEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("{|}|{|}");
			a[0][0].baseValue.Should().Be(null);
			a[0][1].baseValue.Should().Be(null);
			a[1][0].baseValue.Should().Be(null);
			a[1][1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level1_Dictionary()
		{
			VDFNode a = VDFLoader.ToVDFNode("key1{value1}key2{value2}");
			a["key1"].baseValue.Should().Be("value1");
			a["key2"].baseValue.Should().Be("value2");
		}
		[Fact] void ToVDFNode_Level1_Dictionary_Complex()
		{
			VDFNode a = VDFLoader.ToVDFNode("uiPrefs{toolOptions{@@Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{>null}size{7}}@@}liveTool{Select}}");
			a["uiPrefs"]["toolOptions"].baseValue.Should().Be("Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{>null}size{7}}");
			a["uiPrefs"]["liveTool"].baseValue.Should().Be("Select");
		}
		[Fact] void ToVDFNode_Level1_Dictionary_TypesInferredFromGenerics()
		{
			VDFNode a = VDFLoader.ToVDFNode("HoldMesh>vertexColors{Dictionary[Vector3,Color]>>9,4,2.5{Black}1,8,9.5435{Gray}25,15,5{White}}", new VDFLoadOptions
			{
				typeAliasesByType = new Dictionary<Type, string> {{typeof(Color), "Color"}}
			});
			a["vertexColors"]["9,4,2.5"].baseValue.Should().Be("Black");
			a["vertexColors"]["1,8,9.5435"].baseValue.Should().Be("Gray");
			a["vertexColors"]["25,15,5"].baseValue.Should().Be("White");
		}
		[Fact] void ToVDFNode_Level1_PoppedOutItemGroups() // each 'group' is actually just the value-data of one of the parent's properties
		{
			VDFNode a = VDFLoader.ToVDFNode(@"names{#}ages{#}
	Dan
	Bob
	#10
	20");
			a["names"][0].baseValue.Should().Be("Dan");
			a["names"][1].baseValue.Should().Be("Bob");
			a["ages"][0].baseValue.Should().Be("10");
			a["ages"][1].baseValue.Should().Be("20");
		}
		[Fact] void ToVDFNode_Level1_MultilineStringThenProperties()
		{
			var a = VDFLoader.ToVDFNode(@"text{@@This is a
multiline string
of three lines in total.@@}bool{>true}");
			a["text"].baseValue.Should().Be("This is a\nmultiline string\nof three lines in total.");
			((bool)a["bool"]).Should().Be(true);
		}
		[Fact] void ToVDFNode_Level1_MultilineStringWithIndentsThenChildData()
		{
			var a = VDFLoader.ToVDFNode(@"childTexts{#}text{@@This is a
	multiline string
	of three lines in total.@@}
	text1
	text2");
			a["text"].baseValue.Should().Be("This is a\n	multiline string\n	of three lines in total.");
			a["childTexts"][0].baseValue.Should().Be("text1");
			a["childTexts"][1].baseValue.Should().Be("text2");
		}

		[Fact] void ToVDFNode_Level5_DeepNestedPoppedOutData()
		{
			var vdf = @"name{Main}worlds{string,object>>Test1{vObjectRoot{name{VObjectRoot}children{>>#}}}Test2{vObjectRoot{name{VObjectRoot}children{>>#}}}}
	id{System.Guid>025f28a5-a14b-446d-b324-2d274a476a63}name{#Types}children{}
	#id{System.Guid>08e84f18-aecf-4b80-9c3f-ae0697d9033a}name{#Types}children{}";
			var livePackNode = VDFLoader.ToVDFNode(vdf);
			livePackNode["worlds"]["Test1"]["vObjectRoot"]["children"][0]["id"].baseValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
			livePackNode["worlds"]["Test2"]["vObjectRoot"]["children"][0]["id"].baseValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
		}

		// to object
		// ==========

		[Fact] void ToObject_Level0_Null() { VDF.Deserialize(">null").Should().Be(null); }
		[Fact] void ToObject_Level0_Nothing() { VDF.Deserialize("").Should().Be(null); }
		[Fact] void ToObject_Level0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); }
		[Fact] void ToObject_Level0_EmptyString() { VDF.Deserialize(">empty").Should().Be(""); }
		[Fact] void ToObject_Level0_Bool() { VDF.Deserialize<bool>("true").Should().Be(true); }
		[Fact] void ToObject_Level0_Float() { VDF.Deserialize<float>("1.5").Should().Be(1.5f); }
		class TypeWithPostDeserializeMethod
		{
			[VDFProp] public bool flag;
			[VDFPostDeserialize] void VDFPostDeserialize() { flag = true; }
		}

		[Fact] void ToObject_Level1_EmptyStringInList() { VDF.Deserialize<List<string>>("text1|")[1].Should().Be(null); }
		[Fact] void ToObject_Level1_PostDeserializeMethod()
		{
			var a = VDF.Deserialize<TypeWithPostDeserializeMethod>("");
			a.flag.Should().Be(true);
		}
		class TypeWithPostDeserializeMethod_CustomMessageRequired
		{
			public bool flag;
			[VDFPostDeserialize] void VDFPostDeserialize(object message) { if ((string)message == "RequiredMessage") flag = true; }
		}
		[Fact] void ToObject_Level1_PostDeserializeConstructor_CustomMessageRequired() { VDF.Deserialize<TypeWithPostDeserializeMethod_CustomMessageRequired>("", new VDFLoadOptions("WrongMessage")).flag.Should().Be(false); }
		class TypeWithConstructorAsPostDeserializeMethod
		{
			public bool flag;
			[VDFPostDeserialize] TypeWithConstructorAsPostDeserializeMethod() { flag = true; }
		}
		[Fact] void ToObject_Level1_PostDeserializeConstructor() { VDF.Deserialize<TypeWithConstructorAsPostDeserializeMethod>("").flag.Should().Be(true); }
		class TypeInstantiatedManuallyThenFilled { public bool flag; }
		[Fact] void ToObject_Level1_InstantiateTypeManuallyThenFill()
		{
			var a = new TypeInstantiatedManuallyThenFilled();
			VDF.DeserializeInto("flag{true}", a);
			a.flag.Should().Be(true);
		}

		// unique to C# version
		// ==========

		[Fact] void ToVDFNode_Level1_PropLoadError_DuplicateDictionaryKeys()
		{
			Action act = ()=>VDFLoader.ToVDFNode("scores{Dan{0}Dan{1}}");
			act.ShouldThrow<ArgumentException>().WithMessage("*same key*");
		}
		class SpecialList3<T> : List<T> {}
		[Fact] void ToVDFNode_Level1_SpecialListItem()
		{
			VDF.RegisterTypeImporter_Inline(typeof(SpecialList3<>), obj=>new SpecialList3<string>{"Obvious first-item data."}); // note; example of where exporters/importers that can output/input VDFNode's would be helpful
			VDF.Deserialize<SpecialList3<string>>("String that doesn't matter.").Should().BeEquivalentTo(new SpecialList3<string>{"Obvious first-item data."});
		}
		[Fact] void ToVDFNode_Level1_SpecialListItem_GenericTypeArgs()
		{
			VDF.RegisterTypeImporter_Inline(typeof(SpecialList3<>), (obj, genericArgs)=>new SpecialList3<string>{"Obvious first-item data; of type: " + genericArgs.First().Name.ToLower()}); // note; example of where exporters/importers that can output/input VDFNode's would be helpful
			VDF.Deserialize<SpecialList3<string>>("String that doesn't matter.").Should().BeEquivalentTo(new SpecialList3<string>{"Obvious first-item data; of type: string"});
		}
	}
}