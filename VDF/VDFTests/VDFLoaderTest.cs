using System;
using System.Linq;
using System.Reflection;
using SystemMaker;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace VDFTests
{
	[TestClass]
	public class VDFLoaderTest
	{
		#region Additional test attributes
		// 
		//You can use the following additional attributes as you write your tests:
		//
		//Use ClassInitialize to run code before running the first test in the class
		//[ClassInitialize()]
		//public static void MyClassInitialize(TestContext testContext)
		//{
		//}
		//
		//Use ClassCleanup to run code after all tests in a class have run
		//[ClassCleanup()]
		//public static void MyClassCleanup()
		//{
		//}
		//
		//Use TestInitialize to run code before running each test
		//[TestInitialize()]
		//public void MyTestInitialize()
		//{
		//}
		//
		//Use TestCleanup to run code after each test has run
		//[TestCleanup()]
		//public void MyTestCleanup()
		//{
		//}
		//
		#endregion

		[ClassInitialize]
		public static void MyClassInitialize(TestContext testContext)
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

		[TestMethod]
		public void ToVDFNodeTest()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"a{1}b{2}");
			var b = new VDFNode();
			b.properties.Add("a", new VDFNode{baseValue = "1"});
			b.properties.Add("b", new VDFNode{baseValue = "2"});
			Assert.AreEqual(a.ToString(), b.ToString());
		}
	}

	[TestClass]
	public class VDFSpeedTests
	{
		[ClassInitialize]
		public static void MyClassInitialize(TestContext testContext)
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

		[TestMethod]
		public void SpeedTest()
		{
			var a = VDF.Deserialize<World>(@"<World>name{<string>Main}vObjectRoot{<VObject>id{<Guid>}name{<string>VObjectRoot}children{<<List[VObject]>>#}}listOfStringLists{<<List[List[string]]>>{<<List[string]>><string>1A|<string>1B|<string>1C}|{<<List[string]>><string>2A|<string>2B|<string>2C}|{<<List[string]>><string>3A|<string>3B|<string>3C}}
	<VObject>id{<Guid>}name{<string>Soils}children{<<List[VObject]>>#}
		<VObject>id{<Guid>}name{<string>Grass}duties{<<List[Duty]>>#}
			<HoldSoil>texturePath{<string>Grass.png}
		<VObject>id{<Guid>}name{<string>Dirt}duties{<<List[Duty]>>#}
			<HoldSoil>texturePath{<string>Dirt.png}
	<VObject>id{<Guid>}name{<string>Items}duties{<<List[Duty]>>#}children{<<List[VObject]>>#}
		<Special1>color{<Color>White}brightness{<float>.5}
		#<VObject>id{<Guid>}name{<string>@@@NameThat{NeedsEscaping}@@@}
		<VObject>id{<Guid>}name{<string>Camera}duties{<<List[Duty]>>#}
			<HoldTransform>position{<Vector3>1,9,2}rotation{<Vector3>25.5,28.9,2404.765}scale{<Vector3>3,4,1}
			<HoldMesh>vertexes{<<List[Vector3]>><Vector3>9,4,2.5|<Vector3>1,8,9.5435|<Vector3>25,15,5}vertexColors{<<Dictionary[Vector3,Color]>>{<Vector3>9,4,2.5|<Color>Black}{<Vector3>1,8,9.5435|<Color>Gray}{<Vector3>25,15,5|<Color>White}}
			<HoldDuties>dutiesEnabledWhen{<string>SelfIsInWorld}duties{<<List[Duty]>>#}
				<MoveSelfToInventory>
				<RenderMesh>
			<HoldDuties>dutiesEnabledWhen{<string>!SelfIsInWorld}duties{<<List[Duty]>>#}
				<MoveSelfToWorld>
		<VObject>id{<Guid>}name{<string>GardenHoe}duties{<<List[Duty]>>#}
			<HoldTransform>position{<Vector3>0,0,0}rotation{<Vector3>0,0,0}scale{<Vector3>0,0,0}
			<HoldMesh>vertexes{<<List[Vector3]>>}vertexColors{<<Dictionary[Vector3,Color]>>}
			<HoldDuties>dutiesEnabledWhen{<string>SelfIsInWorld}duties{<<List[Duty]>>#}
				<MoveSelfToInventory>
				<RenderMesh>
			<HoldDuties>dutiesEnabledWhen{<string>!SelfIsInWorld}duties{<<List[Duty]>>#}
				<MoveSelfToWorld>");
		}
	}
}