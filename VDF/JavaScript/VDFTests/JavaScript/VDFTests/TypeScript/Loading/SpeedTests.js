// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Loading_SpeedTests;
    (function (Loading_SpeedTests) {
        test("D5_SpeedTester", function () {
            var vdf = "{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^] tasksScriptText:'<<Grab Flag\n\
	(Crate ensure contains an EnemyFlag) ensure is false\n\
	targetFlag be EnemyFlag_OnEnemyGround [objectRefreshInterval: infinity] [lifetime: infinity]\n\
	targetFlag set tag 'taken'\n\
	FrontLeftWheel turn to targetFlag [with: FrontRightWheel]\n\
	FrontLeftWheel roll forward\n\
	FrontRightWheel roll forward\n\
	BackLeftWheel roll forward\n\
	BackRightWheel roll forward\n\
	targetFlag put into Crate\n\
				\n\
Bring Flag to Safer Allied Ground\n\
	Crate ensure contains an EnemyFlag\n\
	targetLocation be AlliedGround_NoEnemyFlag_Safest [objectRefreshInterval: infinity]\n\
	targetLocation set tag 'taken'\n\
	FrontLeftWheel turn to targetLocation [with: FrontRightWheel]\n\
	FrontLeftWheel roll forward\n\
	FrontRightWheel roll forward\n\
	BackLeftWheel roll forward\n\
	BackRightWheel roll forward\n\
	targetFlag put at targetLocation\n\
				\n\
Shoot at Enemy Vehicle\n\
	Gun1 aim at EnemyVehicle_NonBroken\n\
	Gun1 fire>>'}\n\
	{id:'ba991aaf-447a-4a03-ade8-f4a11b4ea966' typeName:'Wood' name:'Body' pivotPoint_unit:'-0.1875,0.4375,-0.6875' anchorNormal:'0,1,0' scale:'0.5,0.25,1.5' controller:true}\n\
	{id:'743f64f2-8ece-4dd3-bdf5-bbb6378ffce5' typeName:'Wood' name:'FrontBar' pivotPoint_unit:'-0.4375,0.5625,0.8125' anchorNormal:'0,0,1' scale:'1,0.25,0.25' controller:false}\n\
	{id:'52854b70-c200-478f-bcd2-c69a03cd808f' typeName:'Wheel' name:'FrontLeftWheel' pivotPoint_unit:'-0.5,0.5,0.875' anchorNormal:'-1,0,0' scale:'1,1,1' controller:false}\n\
	{id:'971e394c-b440-4fee-99fd-dceff732cd1e' typeName:'Wheel' name:'BackRightWheel' pivotPoint_unit:'0.5,0.5,-0.875' anchorNormal:'1,0,0' scale:'1,1,1' controller:false}\n\
	{id:'77d30d72-9845-4b22-8e95-5ba6e29963b9' typeName:'Wheel' name:'FrontRightWheel' pivotPoint_unit:'0.5,0.5,0.875' anchorNormal:'1,0,0' scale:'1,1,1' controller:false}\n\
	{id:'21ca2a80-6860-4de3-9894-b896ec77ef9e' typeName:'Wheel' name:'BackLeftWheel' pivotPoint_unit:'-0.5,0.5,-0.875' anchorNormal:'-1,0,0' scale:'1,1,1' controller:false}\n\
	{id:'eea2623a-86d3-4368-b4e0-576956b3ef1d' typeName:'Wood' name:'BackBar' pivotPoint_unit:'-0.4375,0.4375,-0.8125' anchorNormal:'0,0,-1' scale:'1,0.25,0.25' controller:false}\n\
	{id:'f1edc5a1-d544-4993-bdad-11167704a1e1' typeName:'MachineGun' name:'Gun1' pivotPoint_unit:'0,0.625,0.875' anchorNormal:'0,1,0' scale:'0.5,0.5,0.5' controller:false}\n\
	{id:'e97f8ee1-320c-4aef-9343-3317accb015b' typeName:'Crate' name:'Crate' pivotPoint_unit:'0,0.625,0' anchorNormal:'0,1,0' scale:'0.5,0.5,0.5' controller:false}";
            VDFLoader.ToVDFNode(vdf);
            ok(true);
        });
        test("D5_SpeedTester2", function () {
            var vdf = "{^}\n\
	mainMenu:{}\n\
	console:{^}\n\
		jsCode:\"<<//Log(BD.live.liveMatch.map.plants[0]._parent.toString())\n\
		//Log(new Vector3(1, 2, 3).Swapped());\n\
		//Log(ToVDF(BD.live.liveMatch.players[0].selectedObjects[0].GetPath()));\n\
		//Log(BD.live.liveMatch.units[0]._pathNode.toString());\n\
		//Log(BD.objects.objects[5].name)\n\
		//Log(BD.live.liveMatch.map.structures[1].typeVObject.type);\n\
		//Log(BD.objects.objects[4].structures.length)\n\
		//Log(BD.objects.objects[6].structures[1].name);\n\
			\n\
//Log(BD.objects.objects[0].overrideBounds_bounds.toString());\n\
Log(BD.maps.maps[1].players.length)>>\"\n\
		logRunJSResult:false\n\
		csCode:\"<<//Debug.Log(BD.main.live.liveMatch.players[0].selectedObjects[0].health);\n\
//Debug.Log(BD.main.objects.objects[0].type);\n\
//Debug.Log(BD.main.maps.selectedMap.plants[0].wood);\n\
//Debug.Log(BD.main.live.liveMatch.map.plants[0].type);\n\
\n\
//Debug.Log(V.Vector3Null.Equals(V.Vector3Null));\n\
//Debug.Log(VConvert.ToVDF(BD.main.live.liveMatch.players[0].selectedObjects[0].GetPath()));\n\
//Debug.Log(BD.main.live.liveMatch.units[0]._pathNode);\n\
//Debug.Log(BD.main.objects.objects[6].structures[1].name);\n\
//Debug.Log(BD.main.objects.objects[0].overrideBounds_bounds.size.x);\n\
//BD.main.live.liveMatch.players[0].waterSupply = 100;\n\
Debug.Log(VInput.WebUIHasMouseFocus);>>\"\n\
		logRunCSResult:false\n\
		callLoggerEnabled:false\n\
		calls_maxEntries:500\n\
		filterEnabled:false\n\
		loggerEnabled:true\n\
		logStackTrace:false\n\
		capture_pathFinding:true\n\
	settings:{^}\n\
		showTooltips:true\n\
		autoOpenPage:\"\n\
		resolutionWidth:0\n\
		resolutionHeight:0\n\
		resolutionRefreshRate:0\n\
		fullscreen:false\n\
		showFPS:true\n\
		masterVolume:0\n\
		dragVSMove_pan:true\n\
		dragVSMove_rotate:false\n\
		dragVSMove_rotate_around:true\n\
		dragVSMove_zoom:false\n\
		thirdPerson_panSpeed:1\n\
		thirdPerson_minMoveToRotate:5\n\
		thirdPerson_rotateSpeed:1\n\
		thirdPerson_zoomSpeed:1\n\
		edgeOfScreenScroll_enabled:false\n\
		edgeOfScreenScroll_maxDistanceFromEdge:10\n\
		edgeOfScreenScroll_scrollSpeed:1\n\
		username:null\n\
		showConsolePage:true\n\
		developerHotkeys:true\n\
		logStartupInfo:true\n\
		logStartupTimes:true\n\
		delayFileSystemDataLoad:false\n\
		loadModels:true\n\
		letOutpostProduceAnyUnit:true\n\
		matchSpeedMultiplier_enabled:false\n\
		matchSpeedMultiplier:10\n\
		unitSpeedMultiplier_enabled:false\n\
		unitSpeedMultiplier:5\n\
		collectSpeedMultiplier_enabled:false\n\
		collectSpeedMultiplier:10\n\
		buildSpeedMultiplier_enabled:true\n\
		buildSpeedMultiplier:500\n\
		showOccupiedSpace:false\n\
		showPathFinderCacheData:false\n\
		showMovementPaths:true\n\
		showPredictedPositions:true\n\
		showOcean:true\n\
		showHealthBarsForYou:true\n\
		showHealthBarsForAllies:true\n\
		showHealthBarsForNeutrals:true\n\
		showHealthBarsForEnemies:true\n\
		healthBarWidth:25\n\
		healthBarHeight:2\n\
		healthBarScale:true\n\
		healthBarScale_baseDistance:10\n\
	maps:{^}\n\
		lastCameraPos:null\n\
		lastCameraRot:null\n\
		ui_main_activeTab:1\n\
		ui_left_width:1.90068278715461\n\
		ui_left_activeTab:1\n\
		ui_right_width:2.79298811799066\n\
		ui_right_activeTab:2\n\
		selectedMap:\"Island_Walls\"\n\
        selectedSoil:null\n\
		tools:{^}\n\
			terrain_resize:{left:0 right:8 back:0 front:8}\n\
			terrain_shape:{brushSize:30 strength:3}\n\
			terrain_selectChunk:{}\n\
			regions_paint:{brushSize:4 strength:3}\n\
			objects_place:{selectedOther:null}\n\
	biomes:{^}\n\
		ui_left_width:18.9297124600639\n\
		ui_right_width:18.7699680511182\n\
	objects:{^}\n\
		ui_left_width:24.6006389776358\n\
		ui_right_width:29.7124600638978\n\
	ais:{^}\n\
		selectedAI:null\n\
	matches:{^}\n\
		local_room:{^}\n\
			playerSetups:[^]\n\
				{enabled:true canBeAI:true ai:null}\n\
				{enabled:true canBeAI:true}\n\
				{enabled:false canBeAI:true ai:null}\n\
				{enabled:false canBeAI:true ai:null}\n\
				{enabled:false canBeAI:true ai:null}\n\
				{enabled:false canBeAI:true ai:null}\n\
			selectedMap:null\n\
			wood:1000\n\
			stone:1000\n\
			grain:1000\n\
			fruit:1000\n\
			salt:1000\n\
			fogOfWar:false\n\
	live:{}";
            VDFLoader.ToVDFNode(vdf);
            ok(true);
        });
        // export all classes/enums to global scope
        ExportInternalClassesTo(window, function (str) { return eval(str); });
    })(Loading_SpeedTests || (Loading_SpeedTests = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=SpeedTests.js.map