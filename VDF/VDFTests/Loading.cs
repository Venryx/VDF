using System;
using FluentAssertions;
using Xunit;

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

		[Fact] void VDFNode_Level0_Comment()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"// comment
			Root string.");
			a.items[0].baseValue.Should().Be("			Root string.");
		}
		[Fact] void VDFNode_Level0_BaseValue()
		{
			VDFNode a = VDFLoader.ToVDFNode("Root string.");
			a.items[0].baseValue.Should().Be("Root string.");
		}
		[Fact] void VDFNode_Level0_Metadata_Type()
		{
			VDFNode a = VDFLoader.ToVDFNode("<string>Root string.");
			a.metadata_type.Should().Be("string");
		}
		[Fact] void VDFNode_Level0_ArrayItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("Root string 1.|Root string 2.");
			a.items[0].baseValue.Should().Be("Root string 1.");
			a.items[1].baseValue.Should().Be("Root string 2.");
		}
		[Fact] void VDFNode_Level0_DictionaryItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("{key 1|value 1}{key 2|value 2}");
			a.items[0].items[0].baseValue.Should().Be("key 1");
			a.items[0].items[1].baseValue.Should().Be("value 1");
			a.items[1].items[0].baseValue.Should().Be("key 2");
			a.items[1].items[1].baseValue.Should().Be("value 2");
		}

		[Fact] void VDFNode_Level1_BaseValues()
		{
			VDFNode a = VDFLoader.ToVDFNode("bool{false}int{5}float{.5}string{He said to me, \"Hello World\".}");
			a.properties["bool"].items[0].baseValue.Should().Be("false");
			a.properties["int"].items[0].baseValue.Should().Be("5");
			a.properties["float"].items[0].baseValue.Should().Be(".5");
			a.properties["string"].items[0].baseValue.Should().Be("He said to me, \"Hello World\".");
		}
	}
}