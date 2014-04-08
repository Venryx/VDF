using System;
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

		[Fact] void VDFNode_Level0_BaseValue()
		{
			var a = new VDFNode();
			a.baseValue = "Root string.";
			a.ToString().Should().Be("Root string.");

			a = new VDFNode();
			a.items.Add(new VDFNode {baseValue = "Root string also."});
			a.ToString().Should().Be("Root string also.");
		}
		[Fact] void VDFNode_Level0_Metadata_Type()
		{
			var a = new VDFNode();
			a.metadata_type = "string";
			a.baseValue = "Root string.";
			a.ToString().Should().Be("<string>Root string.");
		}

		[Fact] void VDFNode_Level1_BaseValues()
		{
			var a = new VDFNode();
			a.properties["bool"] = new VDFNode {baseValue = "false"};
			a.properties["int"] = new VDFNode {baseValue = "5"};
			a.properties["float"] = new VDFNode {baseValue = ".5"};
			a.properties["string"] = new VDFNode {baseValue = "Prop value string."};
			a.ToString().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
		}
	}
}