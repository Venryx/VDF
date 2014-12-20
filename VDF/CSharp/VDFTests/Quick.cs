using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using SystemMaker;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public class Quick
	{
		// temp
		// ==========

		[VDFType(true, true)] public class FrameData
		{
			public FrameSettings settings = new FrameSettings();
			public Dictionary<string, object> prefs = new Dictionary<string, object>();
			public string liveWorldName;

			// designer
			public string lastLivePackName;
		}
		public enum ShadowType
		{
			None,
			Hard,
			Soft
		}

		[VDFType(true, true)] public class FrameSettings
		{
			public bool showTooltips = true;
			public List<string> autoOpenSubmenus = new List<string> {"Frame2", "CreativeDefense"};
			public string autoOpenPage = "";
		}

		[Fact] void Load()
		{
			var a = VDFLoader.ToVDFNode(@"
id{595880cd-13cd-4578-9ef1-bd3175ac72bb}visible{true}parts:>>
	id{ba991aaf-447a-4a03-ade8-f4a11b4ea966}typeName{Wood}name{Body}pivotPoint_unit{-0.1875,0.4375,-0.6875}anchorNormal{0,1,0}scale{0.5,0.25,1.5}controller{true}
	id{743f64f2-8ece-4dd3-bdf5-bbb6378ffce5}typeName{Wood}name{FrontBar}pivotPoint_unit{-0.4375,0.5625,0.8125}anchorNormal{0,0,1}scale{1,0.25,0.25}controller{false}
	id{e97f8ee1-320c-4aef-9343-3317accb015b}typeName{Crate}name{Crate}pivotPoint_unit{0,0.625,0}anchorNormal{0,1,0}scale{0.5,0.5,0.5}controller{false}
			".Trim());
			a["parts"].items.Count.Should().Be(3);
		}

		/*[Fact] void Save()
		{
			var a = VDF.Deserialize<FrameData>(@"
	settings{showTooltips{true}autoOpenSubmenus{Frame2|CreativeDefense}autoOpenPage{>empty}}
	prefs{Types_toolOptions{@@Select{}Add{}Resize{}Remove{}@@}Types_liveTool{Select}}
	liveWorldName{>null}
	lastLivePackName{>null}", new VDFLoadOptions(null, null, new Dictionary<Type, string>
			{
				{typeof(Vector3), "Vector3"}
			}));
			VDF.Serialize<FrameData>(a).Should().Be(@"
	settings:
		showTooltips{true}
		autoOpenSubmenus{Frame2|CreativeDefense}
		autoOpenPage{>empty}
	prefs{Types_toolOptions{@@Select{}Add{}Resize{}Remove{}@@}Types_liveTool{Select}}
	liveWorldName{>null}
	lastLivePackName{>null}".Replace("\r\n", "\n"));
		}*/
	}
}

class Vector3 {}