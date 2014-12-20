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

		[Fact] void ToFormalize_1()
		{
			var a = VDFLoader.ToVDFNode(@"
>>{>>{
	name{Road}
}|{
	name{RoadAndPath}
}|{
	name{SimpleHill}
}|{
	name{Test1}
}|{
	name{Test1345345}
}}
			".Trim()); //, new VDFLoadOptions {inferStringTypeForUnknownTypes = true});
			a[0].items.Count.Should().Be(5);
		}

		[Fact] void Load()
		{
			var a = VDFLoader.ToVDFNode("id{f3f18ce3-6052-45d3-a225-5cf270e0400b}name{Gun1}pivotPoint_unit{-1,0,-0.75}anchorNormal{0,1,0}scale{2,2,2}controller{true}typeName{MachineGun}", typeof(IList)); //, new VDFLoadOptions {inferStringTypeForUnknownTypes = true});
			a.items.Count.Should().Be(1);
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