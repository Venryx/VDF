using System;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public class Loading
	{
		static Loading()
		{
			VDF.RegisterTypeExporter_Inline<Guid>(id=>""); //id.ToString());
			VDF.RegisterTypeImporter_Inline<Guid>(str=>new Guid(str));
			VDF.RegisterTypeExporter_Inline<Vector3>(point=>point.x + "," + point.y + "," + point.z);
			VDF.RegisterTypeImporter_Inline<Vector3>(str=>
			{
				string[] parts = str.Split(new[] {','});
				return new Vector3(float.Parse(parts[0]), float.Parse(parts[1]), float.Parse(parts[2]));
			});
		}

		/*[Fact]
		public void Full()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"//
name{Main}vObjectRoot{id{}name{VObjectRoot}children{#}}listOfStringLists{{1A|1B|1C}|{2A|2B|2C}|{3A|3B|3C}}
	id{}name{Soils}children{#}
		id{}name{Grass}duties{#}
			<HoldSoil>texturePath{Grass.png}
		id{}name{Dirt}duties{#}
			<HoldSoil>texturePath{Dirt.png}
	id{}name{Items}duties{#}children{#}
		<Special1>color{White}brightness{.5}
		#id{}name{@@@NameThat{NeedsEscaping}@@@}
		id{}name{Camera}duties{#}
			<HoldTransform>position{1,9,2}rotation{25.5,28.9,2404.765}scale{3,4,1}
			<HoldMesh>vertexes{9,4,2.5|1,8,9.5435|25,15,5}vertexColors{{9,4,2.5|Black}{1,8,9.5435|Gray}{25,15,5|White}}
			<HoldDuties>dutiesEnabledWhen{SelfIsInWorld}duties{#}
				<MoveSelfToInventory>
				<RenderMesh>
			<HoldDuties>dutiesEnabledWhen{!SelfIsInWorld}duties{#}
				<MoveSelfToWorld>
		id{}name{GardenHoe}duties{#}
			<HoldTransform>position{0,0,0}rotation{0,0,0}scale{0,0,0}
			<HoldMesh>vertexes{}vertexColors{}
			<HoldDuties>dutiesEnabledWhen{SelfIsInWorld}duties{#}
				<MoveSelfToInventory>
				<RenderMesh>
			<HoldDuties>dutiesEnabledWhen{!SelfIsInWorld}duties{#}
				<MoveSelfToWorld>
");
		}*/

		[Fact] void VDFNode_Level0_BaseValue()
		{
			VDFNode a = VDFLoader.ToVDFNode("He said to me, \"Hello World\".");
			a.items[0].Should().Be("He said to me, \"Hello World\".");
		}
		[Fact] void VDFNode_Level0_Metadata_Type()
		{
			VDFNode a = VDFLoader.ToVDFNode("<SuperString>Root string value.");
			a.metadata_type.Should().Be("SuperString");
		}

		[Fact] void VDFNode_Level1_BaseValues()
		{
			VDFNode a = VDFLoader.ToVDFNode("bool{false}int{5}float{.5}string{He said to me, \"Hello World\".}");
			a.properties["bool"].baseValue.Should().Be("false");
			a.properties["int"].baseValue.Should().Be("5");
			a.properties["float"].baseValue.Should().Be(".5");
			a.properties["string"].baseValue.Should().Be("He said to me, \"Hello World\".");
		}
	}
}