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

		[VDFType(VDF.PropRegex_Any, true)] public class FrameData
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

		[VDFType(VDF.PropRegex_Any, true)] public class FrameSettings
		{
			public bool showTooltips = true;
			public List<string> autoOpenSubmenus = new List<string> {"Frame2", "CreativeDefense"};
			public string autoOpenPage = "";
		}

		[Fact] void Load()
		{
			var a = VDFLoader.ToVDFNode(@"List(object)>[{value:{lastCameraPos:""0,0,0"" finished:false map:{^} structures:[{^} {^}] framesPerSecond:30} propName:""liveMatch""} ""Local_UI""]
	id:""fbebafd1-400f-4b69-bbca-c4c6add2e093""
	name:""Hills_Test_2""
	terrain:{chunks:Dictionary(object object)>{0,-1,0:{position:""0,-1,0"" showLines:false showGrid:false} 0,-1,1:{position:""0,-1,1"" showLines:false showGrid:false} 3,3,7:{position:""3,3,7"" showLines:false showGrid:false}} selectedChunk:null}
	regions:List(object)>[^]
		{id:""5c2723fb-62d5-4ce3-859a-5c0474026e1b"" name:""Base"" opacityMap:""iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAiklEQVR4Ae3VAREAIAwDsYF/z8Bh44OD9Rq6znsTfjt8+z9dABoQTwCBeAFGAzQgngAC8QL4BBFAIJ4AAvECWAEEEIgngEC8AFYAAQTiCSAQL4AVQACBeAIIxAtgBRBAIJ4AAvECWAEEEIgngEC8AFYAAQTiCSAQL4AVQACBeAIIxAtgBRBAIJ7ABVU6BHxd3cFgAAAAAElFTkSuQmCC"" layer:0 soil:""Soil>Grass""}
		{id:""07caffe1-8a40-4a58-880d-d413a1fccaee"" name:""DarkGrass"" opacityMap:""iVBORw0KGgoAVORK5CYII="" layer:1 soil:""DarkGrass""}
	showRegionOverlay:false
	plants:[^]
		{^}
			id:""d66d33c2-8e2d-4cdb-a601-6bc9d460e16e""
			owner:null
			pierceAttack:0
		{^}
			id:""3ad4eda9-f3ec-4517-a6ff-10dff1f3e9fd""
			owner:null
			trampleDamage:0
			range:0
			pierceAttack:0
	^id:""31eec245-8f5b-443a-a254-8c831b36a22f""
	owner:""#/players[0]""
	name:""Outpost""
	range:0
	pierceAttack:0
	^id:""d9f929d1-44af-466b-b0a8-d85848f8639d""
	owner:""#/players[1]""
	name:""Outpost""
	range:0
	pierceAttack:0");
			V.DoNothing();
		}

		[Fact] void Load_Short()
		{
			var a = VDFLoader.ToVDFNode(@"List(object)>[map:{^} structures:[{^} {^}]]
	id:""fbebafd1-400f-4b69-bbca-c4c6add2e093""
	plants:[^]
		{^}
			id:""d66d33c2-8e2d-4cdb-a601-6bc9d460e16e""
			owner:null
		{^}
			id:""3ad4eda9-f3ec-4517-a6ff-10dff1f3e9fd""
			owner:null
	^range:0
	pierceAttack:0
	^range:0
	pierceAttack:0");
			V.DoNothing();
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