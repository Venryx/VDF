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

		[Fact] void ToString_Level0_BaseValue()
		{
			var a = new VDFNode();
			a.baseValue = "Root string.";
			a.ToString().Should().Be("Root string.");

			a = new VDFNode();
			a[0] = new VDFNode {baseValue = "Root string also."};
			a.ToString().Should().Be("Root string also.");
		}
		[Fact] void ToString_Level0_Metadata_Type()
		{
			var a = new VDFNode();
			a.metadata_type = "string";
			a.baseValue = "Root string.";
			a.ToString().Should().Be("<string>Root string.");
		}

		[Fact] void ToString_Level1_BaseValues()
		{
			var a = new VDFNode();
			a["bool"] = new VDFNode {baseValue = "false"};
			a["int"] = new VDFNode {baseValue = "5"};
			a["float"] = new VDFNode {baseValue = ".5"};
			a["string"] = new VDFNode {baseValue = "Prop value string."};
			a.ToString().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
		}
		[Fact] void ToString_Level1_AnonymousTypeProperties_MarkNoTypes()
		{
			var a = VDFSaver.ToVDFNode(new {Bool = false, Int = 5, Float = .5f, String = "Prop value string."}, new VDFSaveOptions{saveTypesFor = VDFTypes.None});
			a["Bool"].baseValue.Should().Be("false");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a.ToString().Should().Be("Bool{false}Int{5}Float{.5}String{Prop value string.}");
		}
		[Fact] void ToString_Level1_AnonymousTypeProperties_MarkAllTypes()
		{
			var a = VDFSaver.ToVDFNode(new {Bool = false, Int = 5, Float = .5f, String = "Prop value string."}, new VDFSaveOptions{saveTypesFor = VDFTypes.All});
			a.ToString().Should().Be("Bool{<bool>false}Int{<int>5}Float{<float>.5}String{<string>Prop value string.}");
		}
		class TypeWithNullProps { [VDFProp] public object obj; [VDFProp] public List<string> strings; [VDFProp] public List<string> strings2 = new List<string>(); }
		[Fact] void ToString_Level1_NullValues()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
			a["obj"].baseValue.Should().Be("[#null]");
			a["strings"].baseValue.Should().Be("[#null]");
			a["strings2"].baseValue.Should().Be(null); // it's just a VDFNode, with no children, representing a List
			a.ToString().Should().Be("obj{[#null]}strings{[#null]}strings2{}");
		}
		[Fact] void ToString_Level1_ListItems_Null()
		{
			var a = VDFSaver.ToVDFNode(new List<string>{null});
			a[0].baseValue.Should().Be("[#null]");
			a.ToString().Should().Be("[#null]");
		}
		[Fact] void ToString_Level1_DictionaryValues_Null()
		{
			var dictionary = new Dictionary<string, string>();
			dictionary.Add("key1", null);
			var a = VDFSaver.ToVDFNode(dictionary);
			a.GetDictionaryValueNode("key1").baseValue.Should().Be("[#null]");
			a.ToString().Should().Be("{key1|[#null]}");
		}
	}
}