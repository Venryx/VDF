using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Windows.Forms;
using FluentAssertions;
using VDFN;
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

		/*[Fact] void Load()
		{
			//var a = VDFLoader.ToVDFNode("BlockRunInfo_AllRuns>{method:true name:\"Root\" runTime:0 children:Dictionary(string BlockRunInfo_AllRuns)>{Local_Room-StartMatch:{method:true name:\"Local_Room-StartMatch\" runTime:13835.0598 children:Dictionary(string BlockRunInfo_AllRuns)>{clone map:{method:false name:\"clone map\" runTime:5749.591 children:Dictionary(string BlockRunInfo_AllRuns)>{}} basic setup:{method:false name:\"basic setup\" runTime:.1736 children:Dictionary(string BlockRunInfo_AllRuns)>{}} player init:{method:false name:\"player init\" runTime:753.0159 children:Dictionary(string BlockRunInfo_AllRuns)>{Module-Clone:{method:true name:\"Module-Clone\" runTime:752.8207 children:Dictionary(string BlockRunInfo_AllRuns)>{to vdf:{method:false name:\"to vdf\" runTime:332.8488 children:Dictionary(string BlockRunInfo_AllRuns)>{}} from vdf:{method:false name:\"from vdf\" runTime:419.96 children:Dictionary(string BlockRunInfo_AllRuns)>{}}}}}} for disabled player-setups, remove the players themselves from the map, and make all their stuff neutral:{method:false name:\"for disabled player-setups, remove the players themselves from the map, and make all their stuff neutral\" runTime:.3137 children:Dictionary(string BlockRunInfo_AllRuns)>{}} <<start loading match [and await its completion]>>:{method:false name:\"start loading match [and await its completion]\" runTime:6823.4292 children:Dictionary(string BlockRunInfo_AllRuns)>{Live-LoadMatch:{method:true name:\"Live-LoadMatch\" runTime:13642.5 children:Dictionary(string BlockRunInfo_AllRuns)>{set live match:{method:false name:\"set live match\" runTime:2708.9861 children:Dictionary(string BlockRunInfo_AllRuns)>{Match-StartBuilding:{method:true name:\"Match-StartBuilding\" runTime:174.4855 children:Dictionary(string BlockRunInfo_AllRuns)>{Match-BuildMap:{method:true name:\"Match-BuildMap\" runTime:162.2901 children:Dictionary(string BlockRunInfo_AllRuns)>{Map-StartBuilding:{method:true name:\"Map-StartBuilding\" runTime:135.543 children:Dictionary(string BlockRunInfo_AllRuns)>{build chunks:{method:false name:\"build chunks\" runTime:28.116 children:Dictionary(string BlockRunInfo_AllRuns)>{VTerrain-StartBuilding:{method:true name:\"VTerrain-StartBuilding\" runTime:21.2283 children:Dictionary(string BlockRunInfo_AllRuns)>{create cells - a:{method:false name:\"create cells - a\" runTime:5.044 children:Dictionary(string BlockRunInfo_AllRuns)>{}} create cells - c:{method:false name:\"create cells - c\" runTime:11.2951 children:Dictionary(string BlockRunInfo_AllRuns)>{}} build chunks:{method:false name:\"build chunks\" runTime:4.8608 children:Dictionary(string BlockRunInfo_AllRuns)>{}} sub 1:{method:true name:\"sub 1\" runTime:2348.094 children:Dictionary(string BlockRunInfo_AllRuns)>{calculate blobs:{method:false name:\"calculate blobs\" runTime:532.2632 children:Dictionary(string BlockRunInfo_AllRuns)>{}} calculate cell-b terrain heights:{method:false name:\"calculate cell-b terrain heights\" runTime:473.2974 children:Dictionary(string BlockRunInfo_AllRuns)>{}} calculate cell-c terrain heights:{method:false name:\"calculate cell-c terrain heights\" runTime:906.0374 children:Dictionary(string BlockRunInfo_AllRuns)>{}} calculate cache:{method:false name:\"calculate cache\" runTime:436.4389 children:Dictionary(string BlockRunInfo_AllRuns)>{}}}}}}}} add objects:{method:false name:\"add objects\" runTime:106.7854 children:Dictionary(string BlockRunInfo_AllRuns)>{}}}}}}}}}} Wait for map build to complete:{method:false name:\"Wait for map build to complete\" runTime:4111.7443 children:Dictionary(string BlockRunInfo_AllRuns)>{Chunk-PostBuild:{method:true name:\"Chunk-PostBuild\" runTime:29113.2783 children:Dictionary(string BlockRunInfo_AllRuns)>{if mesh filter and mesh collider don't exist, create them:{method:false name:\"if mesh filter and mesh collider don't exist, create them\" runTime:7.2574 children:Dictionary(string BlockRunInfo_AllRuns)>{}} add MeshRenderer component:{method:false name:\"add MeshRenderer component\" runTime:174.7314 children:Dictionary(string BlockRunInfo_AllRuns)>{}} create chunk material:{method:false name:\"create chunk material\" runTime:3902.7479 children:Dictionary(string BlockRunInfo_AllRuns)>{}} add MeshFilter and MeshCollider components:{method:false name:\"add MeshFilter and MeshCollider components\" runTime:179.2472 children:Dictionary(string BlockRunInfo_AllRuns)>{}} apply textures:{method:false name:\"apply textures\" runTime:941.5368 children:Dictionary(string BlockRunInfo_AllRuns)>{}} update mesh filter and mesh collider:{method:false name:\"update mesh filter and mesh collider\" runTime:18323.2774 children:Dictionary(string BlockRunInfo_AllRuns)>{}} apply mesh geometry changes:{method:false name:\"apply mesh geometry changes\" runTime:2885.4641 children:Dictionary(string BlockRunInfo_AllRuns)>{}} start another build:{method:false name:\"start another build\" runTime:3.7789 children:Dictionary(string BlockRunInfo_AllRuns)>{}}}}}} On map loaded:{method:false name:\"On map loaded\" runTime:.4893 children:Dictionary(string BlockRunInfo_AllRuns)>{}}}}}} add standard objects:{method:false name:\"add standard objects\" runTime:459.0903 children:Dictionary(string BlockRunInfo_AllRuns)>{}} notify post-core-map-init:{method:false name:\"notify post-core-map-init\" runTime:11.7076 children:Dictionary(string BlockRunInfo_AllRuns)>{}} set up minimap:{method:false name:\"set up minimap\" runTime:3.6357 children:Dictionary(string BlockRunInfo_AllRuns)>{}} refresh visualizations if enabled:{method:false name:\"refresh visualizations if enabled\" runTime:.0029 children:Dictionary(string BlockRunInfo_AllRuns)>{}} actually start match, and open Live page:{method:false name:\"actually start match, and open Live page\" runTime:5.1487 children:Dictionary(string BlockRunInfo_AllRuns)>{}}}}}}");
			//var a = VDFLoader.ToVDFNode("{method:true name:\"Root\" runTime:0 children:{Local_Room-StartMatch:{method:true name:\"Local_Room-StartMatch\" runTime:13835.0598 children:{clone map:{method:false name:\"clone map\" runTime:5749.591 children:{}} basic setup:{method:false name:\"basic setup\" runTime:.1736 children:{}} player init:{method:false name:\"player init\" runTime:753.0159 children:{Module-Clone:{method:true name:\"Module-Clone\" runTime:752.8207 children:{to vdf:{method:false name:\"to vdf\" runTime:332.8488 children:{}} from vdf:{method:false name:\"from vdf\" runTime:419.96 children:{}}}}}} for disabled player-setups, remove the players themselves from the map, and make all their stuff neutral:{method:false name:\"for disabled player-setups, remove the players themselves from the map, and make all their stuff neutral\" runTime:.3137 children:{}} <<start loading match [and await its completion]>>:{method:false name:\"start loading match [and await its completion]\" runTime:6823.4292 children:{Live-LoadMatch:{method:true name:\"Live-LoadMatch\" runTime:13642.5 children:{set live match:{method:false name:\"set live match\" runTime:2708.9861 children:{Match-StartBuilding:{method:true name:\"Match-StartBuilding\" runTime:174.4855 children:{Match-BuildMap:{method:true name:\"Match-BuildMap\" runTime:162.2901 children:{Map-StartBuilding:{method:true name:\"Map-StartBuilding\" runTime:135.543 children:{build chunks:{method:false name:\"build chunks\" runTime:28.116 children:{VTerrain-StartBuilding:{method:true name:\"VTerrain-StartBuilding\" runTime:21.2283 children:{create cells - a:{method:false name:\"create cells - a\" runTime:5.044 children:{}} create cells - c:{method:false name:\"create cells - c\" runTime:11.2951 children:{}} build chunks:{method:false name:\"build chunks\" runTime:4.8608 children:{}} sub 1:{method:true name:\"sub 1\" runTime:2348.094 children:{calculate blobs:{method:false name:\"calculate blobs\" runTime:532.2632 children:{}} calculate cell-b terrain heights:{method:false name:\"calculate cell-b terrain heights\" runTime:473.2974 children:{}} calculate cell-c terrain heights:{method:false name:\"calculate cell-c terrain heights\" runTime:906.0374 children:{}} calculate cache:{method:false name:\"calculate cache\" runTime:436.4389 children:{}}}}}}}} add objects:{method:false name:\"add objects\" runTime:106.7854 children:{}}}}}}}}}} Wait for map build to complete:{method:false name:\"Wait for map build to complete\" runTime:4111.7443 children:{Chunk-PostBuild:{method:true name:\"Chunk-PostBuild\" runTime:29113.2783 children:{if mesh filter and mesh collider don't exist, create them:{method:false name:\"if mesh filter and mesh collider don't exist, create them\" runTime:7.2574 children:{}} add MeshRenderer component:{method:false name:\"add MeshRenderer component\" runTime:174.7314 children:{}} create chunk material:{method:false name:\"create chunk material\" runTime:3902.7479 children:{}} add MeshFilter and MeshCollider components:{method:false name:\"add MeshFilter and MeshCollider components\" runTime:179.2472 children:{}} apply textures:{method:false name:\"apply textures\" runTime:941.5368 children:{}} update mesh filter and mesh collider:{method:false name:\"update mesh filter and mesh collider\" runTime:18323.2774 children:{}} apply mesh geometry changes:{method:false name:\"apply mesh geometry changes\" runTime:2885.4641 children:{}} start another build:{method:false name:\"start another build\" runTime:3.7789 children:{}}}}}} On map loaded:{method:false name:\"On map loaded\" runTime:.4893 children:{}}}}}} add standard objects:{method:false name:\"add standard objects\" runTime:459.0903 children:{}} notify post-core-map-init:{method:false name:\"notify post-core-map-init\" runTime:11.7076 children:{}} set up minimap:{method:false name:\"set up minimap\" runTime:3.6357 children:{}} refresh visualizations if enabled:{method:false name:\"refresh visualizations if enabled\" runTime:.0029 children:{}} actually start match, and open Live page:{method:false name:\"actually start match, and open Live page\" runTime:5.1487 children:{}}}}}}");
			//var a = VDFLoader.ToVDFNode("{method:true name:\"Root\" runTime:0 children:{Local_RoomStartMatch:{method:true name:\"Local_RoomStartMatch\" runTime:13835.0598 children:{clone map:{method:false name:\"clone map\" runTime:5749.591 children:{}} basic setup:{method:false name:\"basic setup\" runTime:.1736 children:{}} player init:{method:false name:\"player init\" runTime:753.0159 children:{ModuleClone:{method:true name:\"ModuleClone\" runTime:752.8207 children:{to vdf:{method:false name:\"to vdf\" runTime:332.8488 children:{}} from vdf:{method:false name:\"from vdf\" runTime:419.96 children:{}}}}}} for disabled playersetups remove the players themselves from the map and make all their stuff neutral:{method:false name:\"for disabled playersetups remove the players themselves from the map and make all their stuff neutral\" runTime:.3137 children:{}} start loading match:{method:false name:\"start loading match\" runTime:6823.4292 children:{LiveLoadMatch:{method:true name:\"LiveLoadMatch\" runTime:13642.5 children:{set live match:{method:false name:\"set live match\" runTime:2708.9861 children:{MatchStartBuilding:{method:true name:\"MatchStartBuilding\" runTime:174.4855 children:{MatchBuildMap:{method:true name:\"MatchBuildMap\" runTime:162.2901 children:{MapStartBuilding:{method:true name:\"MapStartBuilding\" runTime:135.543 children:{build chunks:{method:false name:\"build chunks\" runTime:28.116 children:{VTerrainStartBuilding:{method:true name:\"VTerrainStartBuilding\" runTime:21.2283 children:{create cells  a:{method:false name:\"create cells  a\" runTime:5.044 children:{}} create cells  c:{method:false name:\"create cells  c\" runTime:11.2951 children:{}} build chunks:{method:false name:\"build chunks\" runTime:4.8608 children:{}} sub 1:{method:true name:\"sub 1\" runTime:2348.094 children:{calculate blobs:{method:false name:\"calculate blobs\" runTime:532.2632 children:{}} calculate cellb terrain heights:{method:false name:\"calculate cellb terrain heights\" runTime:473.2974 children:{}} calculate cellc terrain heights:{method:false name:\"calculate cellc terrain heights\" runTime:906.0374 children:{}} calculate cache:{method:false name:\"calculate cache\" runTime:436.4389 children:{}}}}}}}} add objects:{method:false name:\"add objects\" runTime:106.7854 children:{}}}}}}}}}} Wait for map build to complete:{method:false name:\"Wait for map build to complete\" runTime:4111.7443 children:{ChunkPostBuild:{method:true name:\"ChunkPostBuild\" runTime:29113.2783 children:{if mesh filter and mesh collider don't exist create them:{method:false name:\"if mesh filter and mesh collider don't exist create them\" runTime:7.2574 children:{}} add MeshRenderer component:{method:false name:\"add MeshRenderer component\" runTime:174.7314 children:{}} create chunk material:{method:false name:\"create chunk material\" runTime:3902.7479 children:{}} add MeshFilter and MeshCollider components:{method:false name:\"add MeshFilter and MeshCollider components\" runTime:179.2472 children:{}} apply textures:{method:false name:\"apply textures\" runTime:941.5368 children:{}} update mesh filter and mesh collider:{method:false name:\"update mesh filter and mesh collider\" runTime:18323.2774 children:{}} apply mesh geometry changes:{method:false name:\"apply mesh geometry changes\" runTime:2885.4641 children:{}} start another build:{method:false name:\"start another build\" runTime:3.7789 children:{}}}}}} On map loaded:{method:false name:\"On map loaded\" runTime:.4893 children:{}}}}}} add standard objects:{method:false name:\"add standard objects\" runTime:459.0903 children:{}} notify postcoremapinit:{method:false name:\"notify postcoremapinit\" runTime:11.7076 children:{}} set up minimap:{method:false name:\"set up minimap\" runTime:3.6357 children:{}} refresh visualizations if enabled:{method:false name:\"refresh visualizations if enabled\" runTime:.0029 children:{}} actually start match and open Live page:{method:false name:\"actually start match and open Live page\" runTime:5.1487 children:{}}}}}}");
			var a = VDFLoader.ToVDFNode("{method:true name:\"Root\" runTime:0 children:{Local_RoomStartMatch:{method:true name:\"Local_RoomStartMatch\" runTime:13835.0598 children:{clone map:{method:false name:\"clone map\" runTime:5749.591 children:{}} basic setup:{method:false name:\"basic setup\" runTime:.1736 children:{}} player init:{method:false name:\"player init\" runTime:753.0159 children:{ModuleClone:{method:true name:\"ModuleClone\" runTime:752.8207 children:{to vdf:{method:false name:\"to vdf\" runTime:332.8488 children:{}} from vdf:{method:false name:\"from vdf\" runTime:419.96 children:{}}}}}} for disabled playersetups remove the players themselves from the map and make all their stuff neutral:{method:false name:\"for disabled playersetups remove the players themselves from the map and make all their stuff neutral\" runTime:.3137 children:{}} start loading match:{method:false name:\"start loading match\" runTime:6823.4292 children:{LiveLoadMatch:{method:true name:\"LiveLoadMatch\" runTime:13642.5 children:{set live match:{method:false name:\"set live match\" runTime:2708.9861 children:{MatchStartBuilding:{method:true name:\"MatchStartBuilding\" runTime:174.4855 children:{MatchBuildMap:{method:true name:\"MatchBuildMap\" runTime:162.2901 children:{MapStartBuilding:{method:true name:\"MapStartBuilding\" runTime:135.543 children:{build chunks:{method:false name:\"build chunks\" runTime:28.116 children:{VTerrainStartBuilding:{method:true name:\"VTerrainStartBuilding\" runTime:21.2283 children:{create cells  a:{method:false name:\"create cells  a\" runTime:5.044 children:{}} create cells  c:{method:false name:\"create cells  c\" runTime:11.2951 children:{}} build chunks:{method:false name:\"build chunks\" runTime:4.8608 children:{}} sub 1:{method:true name:\"sub 1\" runTime:2348.094 children:{calculate blobs:{method:false name:\"calculate blobs\" runTime:532.2632 children:{}} calculate cellb terrain heights:{method:false name:\"calculate cellb terrain heights\" runTime:473.2974 children:{}} calculate cellc terrain heights:{method:false name:\"calculate cellc terrain heights\" runTime:906.0374 children:{}} calculate cache:{method:false name:\"calculate cache\" runTime:436.4389 children:{}}}}}}}} add objects:{method:false name:\"add objects\" runTime:106.7854 children:{}}}}}}}}}} Wait for map build to complete:{method:false name:\"Wait for map build to complete\" runTime:4111.7443 children:{ChunkPostBuild:{method:true name:\"ChunkPostBuild\" runTime:29113.2783 children:{if mesh filter and mesh collider don't exist create them:true}}}}}}}} add standard objects:{method:false name:\"add standard objects\" runTime:459.0903 children:{}}}}}}");
			//var b = a["children"]["Local_Room-StartMatch"]["children"];
			var b = a["children"]["Local_RoomStartMatch"]["children"];
			b["add standard objects"].Should().NotBeNull();
			V.DoNothing();
		}*/

		[Fact] void Test1()
		{
			var vdf = @"
{^}
	types:[^]
		{variables:[^] subscripts:[^] selectedMember:'/subscripts/i:1'}
			{name:'our squad'}
			^{^}
				variables:[^]
					{name:'enemy unit'}
				name:'is done'
	scripts:[^]
		{^}
			name:'configuration'
".Trim();
			var tokens = VDFTokenParser.ParseTokens(vdf);
			var node = VDFLoader.ToVDFNode(vdf, new VDFLoadOptions(loadUnknownTypesAsBasicTypes: true));
			V.DoNothing();
		}

		/*class Base { bool baseProp; }
		class Derived : Base { bool derivedProp; }
		[Fact] void Test()
		{
			var members = typeof(Derived).GetMembers_Full(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Instance);
			members.IndexOf(typeof(Base).GetField("baseProp")).Should().BeLessThan(members.IndexOf(typeof(Derived).GetField("derivedProp")));
		}*/

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