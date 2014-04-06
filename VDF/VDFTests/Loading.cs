using System;
using Xunit;

namespace VDFTests
{
	public class Loading
	{
		static Loading()
		{
			VDF.RegisterTypeExporter_Inline<Guid>(id => ""); //id.ToString());
			VDF.RegisterTypeImporter_Inline<Guid>(str => new Guid(str));
			VDF.RegisterTypeExporter_Inline<Vector3>(point => point.x + "," + point.y + "," + point.z);
			VDF.RegisterTypeImporter_Inline<Vector3>(str =>
			{
				string[] parts = str.Split(new[] { ',' });
				return new Vector3(float.Parse(parts[0]), float.Parse(parts[1]), float.Parse(parts[2]));
			});
		}

		[Fact]
		public void ToVDFNodeTest()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"a{1}b{2}");
			var b = new VDFNode();
			b.properties.Add("a", new VDFNode { baseValue = "1" });
			b.properties.Add("b", new VDFNode { baseValue = "2" });
			Assert.Equal(a.ToString(), b.ToString());
		}
	}
}