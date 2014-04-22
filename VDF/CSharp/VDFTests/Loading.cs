using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
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
		[Fact] void ToVDFNode_Level0_Metadata_Type()
		{
			VDFNode a = VDFLoader.ToVDFNode("string>Root string.");
			a.metadata_type.Should().Be("string");
		}
		[Fact] void ToVDFNode_Level0_ArrayItems()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("Root string 1.|Root string 2.");
			a[0].baseValue.Should().Be("Root string 1.");
			a[1].baseValue.Should().Be("Root string 2.");
		}
		[Fact] void ToVDFNode_Level0_ArrayItems_Objects()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("name{Dan}age{50}|name{Bob}age{60}");
			((string)a[0]["name"]).Should().Be("Dan");
			((int)a[0]["age"]).Should().Be(50);
			((string)a[1]["name"]).Should().Be("Bob");
			((int)a[1]["age"]).Should().Be(60);
		}
		[Fact] void ToVDFNode_Level0_ArrayItems_Empty()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("|");
			a[0].baseValue.Should().Be(null);
			a[1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level0_ArrayItems_None()
		{
			VDFNode a = VDFLoader.ToVDFNode<IList>("");
			a.items.Count.Should().Be(0);
			a = VDFLoader.ToVDFNode(">>");
			a.items.Count.Should().Be(0);
		}
		[Fact] void ToVDFNode_Level0_ArrayMetadata1()
		{
			VDFNode a = VDFLoader.ToVDFNode("SpecialList[int]>>1|2", new VDFLoadOptions(null, new Dictionary<Type, string>{{typeof(SpecialList<>), "SpecialList"}}));
			a.metadata_type.Should().Be("SpecialList[int]");
			a[0].metadata_type.Should().Be(null);
			a[1].metadata_type.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level0_ArrayMetadata2()
		{
			VDFNode a = VDFLoader.ToVDFNode("SpecialList[int]>>int>1|int>2", new VDFLoadOptions(null, new Dictionary<Type, string> { { typeof(SpecialList<>), "SpecialList" } }));
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
		[Fact] void ToVDFNode_Level1_PoppedOutNodes()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"names{#}
	Dan
	Bob
");
			a["names"][0].baseValue.Should().Be("Dan");
			a["names"][1].baseValue.Should().Be("Bob");
		}
		[Fact] void ToVDFNode_Level1_ArrayItemsInArrayItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}|{3A}"); // should be able to infer the "{3A}" text represents an array, by that it has braces without a prop-name
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be("1B");
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be("2B");
			a[2][0].baseValue.Should().Be("3A");
		}
		[Fact] void ToVDFNode_Level1_ArrayItemsInArrayItems_ValueEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("{1A|}|{2A|}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be(null);
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level1_ArrayItemsInArrayItems_BothEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("{|}|{|}");
			a[0][0].baseValue.Should().Be(null);
			a[0][1].baseValue.Should().Be(null);
			a[1][0].baseValue.Should().Be(null);
			a[1][1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level1_DictionaryItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("key1{value1}key2{value2}");
			a["key1"].baseValue.Should().Be("value1");
			a["key2"].baseValue.Should().Be("value2");
		}
		[Fact] void ToVDFNode_Level1_DictionaryItems_Complex()
		{
			VDFNode a = VDFLoader.ToVDFNode("uiPrefs{toolOptions{@@Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{[#null]}size{7}}@@}liveTool{Select}}");
			a["uiPrefs"]["toolOptions"].baseValue.Should().Be("Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{[#null]}size{7}}");
			a["uiPrefs"]["liveTool"].baseValue.Should().Be("Select");
		}
		[Fact] void ToVDFNode_Level1_DictionaryItems_TypesInferredFromGenerics()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"HoldMesh>vertexColors{Dictionary[Vector3,Color]>>9,4,2.5{Black}1,8,9.5435{Gray}25,15,5{White}}", new VDFLoadOptions
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

		[Fact] void ToObject_Level0_Bool() { VDF.Deserialize<bool>("true").Should().Be(true); }
		[Fact] void ToObject_Level0_Float() { VDF.Deserialize<float>("1.5").Should().Be(1.5f); }
		class TypeWithPostDeserializeInitMethod
		{
			[VDFProp] public bool postDeserializeWasCalled;
			[VDFPostDeserialize] void PostDeserialize() { postDeserializeWasCalled = true; }
		}
		[Fact] void ToObject_Level1_PostDeserializeInitialization()
		{
			var a = VDF.Deserialize<TypeWithPostDeserializeInitMethod>("");
			a.postDeserializeWasCalled.Should().Be(true);
		}
	}
}