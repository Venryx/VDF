﻿using System;
using System.Collections.Generic;
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
			a.items[0].baseValue.Should().Be("Root string.");
			a.ToVDF().Should().Be("Root string."); // it should print only the base-value
		}
		[Fact] void ToVDFNode_Level0_Metadata_Type()
		{
			VDFNode a = VDFLoader.ToVDFNode("<string>Root string.");
			a.metadata_type.Should().Be("string");
		}
		[Fact] void ToVDFNode_Level0_ArrayItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("Root string 1.|Root string 2.");
			a[0].baseValue.Should().Be("Root string 1.");
			a[1].baseValue.Should().Be("Root string 2.");
		}
		[Fact] void ToVDFNode_Level0_ArrayItems_Empty()
		{
			VDFNode a = VDFLoader.ToVDFNode("|");
			a[0].baseValue.Should().Be("");
			a[1].baseValue.Should().Be("");
		}
		[Fact] void ToVDFNode_Level0_ArrayMetadata1()
		{
			VDFNode a = VDFLoader.ToVDFNode("<<SpecialList[int]>>1|2", new VDFLoadOptions(null, new Dictionary<Type, string>{{typeof(SpecialList<>), "SpecialList"}}));
			a.metadata_type.Should().Be("SpecialList[int]");
			a[0].metadata_type.Should().Be(null);
			a[1].metadata_type.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level0_ArrayMetadata2()
		{
			VDFNode a = VDFLoader.ToVDFNode("<<SpecialList[int]>><int>1|<int>2", new VDFLoadOptions(null, new Dictionary<Type, string> { { typeof(SpecialList<>), "SpecialList" } }));
			a.metadata_type.Should().Be("SpecialList[int]");
			a[0].metadata_type.Should().Be("int");
			a[1].metadata_type.Should().Be("int");
		}
		[Fact] void ToVDFNode_Level0_DictionaryItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("{key 1|value 1}{key 2|value 2}");
			a[0][0].baseValue.Should().Be("key 1");
			a[0][1].baseValue.Should().Be("value 1");
			a[1][0].baseValue.Should().Be("key 2");
			a[1][1].baseValue.Should().Be("value 2");
		}
		[Fact] void ToVDFNode_Level0_DictionaryItems_GetByKey()
		{
			VDFNode a = VDFLoader.ToVDFNode("{key 1|value 1}{key 2|value 2}");
			a.GetDictionaryValueNode("key 1").baseValue.Should().Be("value 1");
			a.GetDictionaryValueNode("key 2").baseValue.Should().Be("value 2");
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
			VDFNode a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be("1B");
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be("2B");
		}
		[Fact] void ToVDFNode_Level1_ArrayItemsInArrayItems_ValueEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("{1A|}|{2A|}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be("");
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be("");
		}
		[Fact] void ToVDFNode_Level1_ArrayItemsInArrayItems_BothEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("{|}|{|}");
			a[0][0].baseValue.Should().Be("");
			a[0][1].baseValue.Should().Be("");
			a[1][0].baseValue.Should().Be("");
			a[1][1].baseValue.Should().Be("");
		}
		[Fact] void ToVDFNode_Level1_DictionaryItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("{1key|1value}{2key|2value}");
			a[0][0].baseValue.Should().Be("1key");
			a[0][1].baseValue.Should().Be("1value");
			a[1][0].baseValue.Should().Be("2key");
			a[1][1].baseValue.Should().Be("2value");
		}
		[Fact] void ToVDFNode_Level1_DictionaryItems_Complex()
		{
			VDFNode a = VDFLoader.ToVDFNode("uiPrefs{{toolOptions|@@Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{[#null]}size{7}}@@}{liveTool|Select}}");
			a["uiPrefs"][0][0].baseValue.Should().Be("toolOptions");
			a["uiPrefs"][0][1].baseValue.Should().Be("Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{[#null]}size{7}}");
			a["uiPrefs"][1][0].baseValue.Should().Be("liveTool");
			a["uiPrefs"][1][1].baseValue.Should().Be("Select");
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
	}
}