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
			var a = VDFLoader.ToVDFNode(@"{'name':'Main','vObjectRoot':{'name':'VObjectRoot','children':[
	{'name':'Soils','children':[
		{'name':'Grass','duties':[
			{'texturePath':'Grass.png'}
		]},
		{'name':'Dirt','duties':[
			{'texturePath':'Dirt.png'}
	]}]},
	{'name':'Items','duties':[
		{'color':'White','brightness':0.5}
		],
		'children':[
		{'name':'name that {\'needs\' escaping}'},
		{'name':'Camera','duties':[
			{'position':'1,9,2','rotation':'25.52,8.9240,4.765','scale':'341'},
			{'vertexes':['9,4,2.5','1,8,9.5435','25,15,5'],'vertexColors':{'9,4,2.5':'Black','1,8,9.5435':'Gray','25,15,5':'White'}},
			{'dutiesEnabledWhen':'SelfIsInWorld','duties':[
				{},
				{}
		]}]},
		{'name':'GardenHoe','duties':[
			{'position':'0,0,0','rotation':'0,0,0','scale':'0,0,0'},
			{'vertexes':[],'vertexColors':[]}
]}]}]},'stringPropNull':null,'simpleFlag':true,'simpleEnum':'A','listOfStringLists':[['1A','1B','1C'],['2A','2B','2C'],['3A','3B','3C']]}", new VDFLoadOptions().ForJSON());
			V.Nothing();
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