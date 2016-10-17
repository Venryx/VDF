// tests
// ==========

module VDFTests { // added to match C# indentation
	module Loading_SpeedTests {
		// run tests once ahead of time, so VDF-type-data is pre-loaded for profiled tests
		/*loading["D3_SpeedTester"]();
		loading["D5_SpeedTester2"]();*/

		test("D3_SpeedTester", ()=> {
			var vdf = "{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^]}\n\
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
		test("D5_SpeedTester2", ()=>
		{
			var vdf = `
{^}
	createStandardObjects:false
	terrain:{chunks:{<<0 0 -1>>:{} <<0 0 0>>:{} <<0 1 -1>>:{} <<0 1 0>>:{} <<0 2 -1>>:{} <<0 2 0>>:{} <<0 3 -1>>:{} <<0 3 0>>:{} <<0 4 -1>>:{} <<0 4 0>>:{} <<0 5 -1>>:{} <<0 5 0>>:{} <<0 6 -1>>:{} <<0 6 0>>:{} <<0 7 -1>>:{} <<0 7 0>>:{} <<1 0 -1>>:{} <<1 0 0>>:{} <<1 1 -1>>:{} <<1 1 0>>:{} <<1 2 -1>>:{} <<1 2 0>>:{} <<1 3 -1>>:{} <<1 3 0>>:{} <<1 4 -1>>:{} <<1 4 0>>:{} <<1 5 -1>>:{} <<1 5 0>>:{} <<1 6 -1>>:{} <<1 6 0>>:{} <<1 7 -1>>:{} <<1 7 0>>:{} <<2 0 -1>>:{} <<2 0 0>>:{} <<2 1 -1>>:{} <<2 1 0>>:{} <<2 2 -1>>:{} <<2 2 0>>:{} <<2 3 -1>>:{} <<2 3 0>>:{} <<2 4 -1>>:{} <<2 4 0>>:{} <<2 5 -1>>:{} <<2 5 0>>:{} <<2 6 -1>>:{} <<2 6 0>>:{} <<2 7 -1>>:{} <<2 7 0>>:{} <<3 0 -1>>:{} <<3 0 0>>:{} <<3 1 -1>>:{} <<3 1 0>>:{} <<3 2 -1>>:{} <<3 2 0>>:{} <<3 3 -1>>:{} <<3 3 0>>:{} <<3 4 -1>>:{} <<3 4 0>>:{} <<3 5 -1>>:{} <<3 5 0>>:{} <<3 6 -1>>:{} <<3 6 0>>:{} <<3 7 -1>>:{} <<3 7 0>>:{} <<4 0 -1>>:{} <<4 0 0>>:{} <<4 1 -1>>:{} <<4 1 0>>:{} <<4 2 -1>>:{} <<4 2 0>>:{} <<4 3 -1>>:{} <<4 3 0>>:{} <<4 4 -1>>:{} <<4 4 0>>:{} <<4 5 -1>>:{} <<4 5 0>>:{} <<4 6 -1>>:{} <<4 6 0>>:{} <<4 7 -1>>:{} <<4 7 0>>:{} <<5 0 -1>>:{} <<5 0 0>>:{} <<5 1 -1>>:{} <<5 1 0>>:{} <<5 2 -1>>:{} <<5 2 0>>:{} <<5 3 -1>>:{} <<5 3 0>>:{} <<5 4 -1>>:{} <<5 4 0>>:{} <<5 5 -1>>:{} <<5 5 0>>:{} <<5 6 -1>>:{} <<5 6 0>>:{} <<5 7 -1>>:{} <<5 7 0>>:{} <<6 0 -1>>:{} <<6 0 0>>:{} <<6 1 -1>>:{} <<6 1 0>>:{} <<6 2 -1>>:{} <<6 2 0>>:{} <<6 3 -1>>:{} <<6 3 0>>:{} <<6 4 -1>>:{} <<6 4 0>>:{} <<6 5 -1>>:{} <<6 5 0>>:{} <<6 6 -1>>:{} <<6 6 0>>:{} <<6 7 -1>>:{} <<6 7 0>>:{} <<7 0 -1>>:{} <<7 0 0>>:{} <<7 1 -1>>:{} <<7 1 0>>:{} <<7 2 -1>>:{} <<7 2 0>>:{} <<7 3 -1>>:{} <<7 3 0>>:{} <<7 4 -1>>:{} <<7 4 0>>:{} <<7 5 -1>>:{} <<7 5 0>>:{} <<7 6 -1>>:{} <<7 6 0>>:{} <<7 7 -1>>:{} <<7 7 0>>:{} <<2 1 1>>:{} <<2 2 1>>:{} <<3 1 1>>:{} <<3 2 1>>:{} <<4 1 1>>:{} <<4 2 1>>:{} <<5 1 1>>:{} <<5 2 1>>:{} <<3 3 1>>:{} <<4 3 1>>:{} <<5 3 1>>:{} <<3 4 1>>:{} <<4 4 1>>:{} <<2 3 1>>:{} <<2 4 1>>:{} <<2 5 1>>:{} <<3 5 1>>:{} <<4 5 1>>:{} <<1 3 1>>:{} <<1 4 1>>:{} <<1 2 1>>:{} <<5 4 1>>:{} <<5 5 1>>:{} <<1 1 1>>:{} <<2 0 1>>:{} <<3 0 1>>:{} <<4 0 1>>:{} <<0 8 0>>:{} <<0 9 0>>:{} <<0 10 0>>:{} <<0 11 0>>:{} <<0 12 0>>:{} <<0 13 0>>:{} <<0 14 0>>:{} <<0 15 0>>:{} <<1 8 0>>:{} <<1 9 0>>:{} <<1 10 0>>:{} <<1 11 0>>:{} <<1 12 0>>:{} <<1 13 0>>:{} <<1 14 0>>:{} <<1 15 0>>:{} <<2 8 0>>:{} <<2 9 0>>:{} <<2 10 0>>:{} <<2 11 0>>:{} <<2 12 0>>:{} <<2 13 0>>:{} <<2 14 0>>:{} <<2 15 0>>:{} <<3 8 0>>:{} <<3 9 0>>:{} <<3 10 0>>:{} <<3 11 0>>:{} <<3 12 0>>:{} <<3 13 0>>:{} <<3 14 0>>:{} <<3 15 0>>:{} <<4 8 0>>:{} <<4 9 0>>:{} <<4 10 0>>:{} <<4 11 0>>:{} <<4 12 0>>:{} <<4 13 0>>:{} <<4 14 0>>:{} <<4 15 0>>:{} <<5 8 0>>:{} <<5 9 0>>:{} <<5 10 0>>:{} <<5 11 0>>:{} <<5 12 0>>:{} <<5 13 0>>:{} <<5 14 0>>:{} <<5 15 0>>:{} <<6 8 0>>:{} <<6 9 0>>:{} <<6 10 0>>:{} <<6 11 0>>:{} <<6 12 0>>:{} <<6 13 0>>:{} <<6 14 0>>:{} <<6 15 0>>:{} <<7 8 0>>:{} <<7 9 0>>:{} <<7 10 0>>:{} <<7 11 0>>:{} <<7 12 0>>:{} <<7 13 0>>:{} <<7 14 0>>:{} <<7 15 0>>:{} <<8 0 0>>:{} <<8 1 0>>:{} <<8 2 0>>:{} <<8 3 0>>:{} <<8 4 0>>:{} <<8 5 0>>:{} <<8 6 0>>:{} <<8 7 0>>:{} <<8 8 0>>:{} <<8 9 0>>:{} <<8 10 0>>:{} <<8 11 0>>:{} <<8 12 0>>:{} <<8 13 0>>:{} <<8 14 0>>:{} <<8 15 0>>:{} <<9 0 0>>:{} <<9 1 0>>:{} <<9 2 0>>:{} <<9 3 0>>:{} <<9 4 0>>:{} <<9 5 0>>:{} <<9 6 0>>:{} <<9 7 0>>:{} <<9 8 0>>:{} <<9 9 0>>:{} <<9 10 0>>:{} <<9 11 0>>:{} <<9 12 0>>:{} <<9 13 0>>:{} <<9 14 0>>:{} <<9 15 0>>:{} <<10 0 0>>:{} <<10 1 0>>:{} <<10 2 0>>:{} <<10 3 0>>:{} <<10 4 0>>:{} <<10 5 0>>:{} <<10 6 0>>:{} <<10 7 0>>:{} <<10 8 0>>:{} <<10 9 0>>:{} <<10 10 0>>:{} <<10 11 0>>:{} <<10 12 0>>:{} <<10 13 0>>:{} <<10 14 0>>:{} <<10 15 0>>:{} <<11 0 0>>:{} <<11 1 0>>:{} <<11 2 0>>:{} <<11 3 0>>:{} <<11 4 0>>:{} <<11 5 0>>:{} <<11 6 0>>:{} <<11 7 0>>:{} <<11 8 0>>:{} <<11 9 0>>:{} <<11 10 0>>:{} <<11 11 0>>:{} <<11 12 0>>:{} <<11 13 0>>:{} <<11 14 0>>:{} <<11 15 0>>:{} <<12 0 0>>:{} <<12 1 0>>:{} <<12 2 0>>:{} <<12 3 0>>:{} <<12 4 0>>:{} <<12 5 0>>:{} <<12 6 0>>:{} <<12 7 0>>:{} <<12 8 0>>:{} <<12 9 0>>:{} <<12 10 0>>:{} <<12 11 0>>:{} <<12 12 0>>:{} <<12 13 0>>:{} <<12 14 0>>:{} <<12 15 0>>:{} <<13 0 0>>:{} <<13 1 0>>:{} <<13 2 0>>:{} <<13 3 0>>:{} <<13 4 0>>:{} <<13 5 0>>:{} <<13 6 0>>:{} <<13 7 0>>:{} <<13 8 0>>:{} <<13 9 0>>:{} <<13 10 0>>:{} <<13 11 0>>:{} <<13 12 0>>:{} <<13 13 0>>:{} <<13 14 0>>:{} <<13 15 0>>:{} <<14 0 0>>:{} <<14 1 0>>:{} <<14 2 0>>:{} <<14 3 0>>:{} <<14 4 0>>:{} <<14 5 0>>:{} <<14 6 0>>:{} <<14 7 0>>:{} <<14 8 0>>:{} <<14 9 0>>:{} <<14 10 0>>:{} <<14 11 0>>:{} <<14 12 0>>:{} <<14 13 0>>:{} <<14 14 0>>:{} <<14 15 0>>:{} <<15 0 0>>:{} <<15 1 0>>:{} <<15 2 0>>:{} <<15 3 0>>:{} <<15 4 0>>:{} <<15 5 0>>:{} <<15 6 0>>:{} <<15 7 0>>:{} <<15 8 0>>:{} <<15 9 0>>:{} <<15 10 0>>:{} <<15 11 0>>:{} <<15 12 0>>:{} <<15 13 0>>:{} <<15 14 0>>:{} <<15 15 0>>:{} <<8 1 -1>>:{} <<8 2 -1>>:{} <<8 0 -1>>:{} <<9 0 -1>>:{} <<9 1 -1>>:{} <<8 3 -1>>:{} <<8 4 -1>>:{} <<8 5 -1>>:{} <<8 6 -1>>:{} <<8 7 -1>>:{} <<7 8 -1>>:{} <<8 8 -1>>:{} <<6 8 -1>>:{} <<6 9 -1>>:{} <<7 9 -1>>:{} <<5 8 -1>>:{} <<4 8 -1>>:{} <<3 8 -1>>:{} <<2 8 -1>>:{} <<1 8 -1>>:{} <<0 8 -1>>:{} <<8 9 -1>>:{} <<3 9 -1>>:{} <<4 9 -1>>:{}} selectedChunk:null blobs:[]}
	regions:[^]
		{name:"Base" components:[^]}
			ApplySoils>{^}
				soilSetType:"Custom"
				soilSetType_custom_soil:"Grass"
				distributionSeed_randomize:false
		{name:"Trees" components:[^]}
			ApplyPattern>{^}
				seed_randomize:false
				maxCloudSize:50
			GeneratePlants>{^}
				minOpacity:.7
				seed_randomize:false
		{name:"set biome at start" components:[^]}
			SetBiomeAtStart>{^}
				biomeSetType:"Custom"
				biomeSetType_custom_biome:"Savanna"
				seed_randomize:false
	selectedRegion:"@/regions/i:0"
	lastCameraPos:"104.110542297363 -41.6764602661133 93.6785125732422"
	lastCameraRot:"33.5 2.5596236241654E-07 10.50013256073"
	showRegionOverlay:false
	playerCount_min:0
	playerCount_max:6
	players:[^]
		{canBeAI:true name:"Player 1" aiType:null ai:null color:"0 0 0 0" biome:"Boreal Forest/Tundra/Polar" age:"Rodent" wood:0 stone:0 starch:0 sugar:0 salt:0 formations:[] selectedObjects:[] technologiesBeingResearched:{} technologiesResearched:[] actionLastRunFrames:{} autoFindSquads:[]}
		{canBeAI:true name:"Player 2" aiType:null ai:null color:"0 0 0 0" biome:null age:"Rodent" wood:0 stone:0 starch:0 sugar:0 salt:0 formations:[] selectedObjects:[] technologiesBeingResearched:{} technologiesResearched:[] actionLastRunFrames:{} autoFindSquads:[]}
		{canBeAI:true name:"Player 3" aiType:null ai:null color:"0 0 0 0" biome:null age:"Rodent" wood:0 stone:0 starch:0 sugar:0 salt:0 formations:[] selectedObjects:[] technologiesBeingResearched:{} technologiesResearched:[] actionLastRunFrames:{} autoFindSquads:[]}
		{canBeAI:true name:"Player 4" aiType:null ai:null color:"0 0 0 0" biome:null age:"Rodent" wood:0 stone:0 starch:0 sugar:0 salt:0 formations:[] selectedObjects:[] technologiesBeingResearched:{} technologiesResearched:[] actionLastRunFrames:{} autoFindSquads:[]}
		{canBeAI:true name:"Player 5" aiType:null ai:null color:"0 0 0 0" biome:null age:"Rodent" wood:0 stone:0 starch:0 sugar:0 salt:0 formations:[] selectedObjects:[] technologiesBeingResearched:{} technologiesResearched:[] actionLastRunFrames:{} autoFindSquads:[]}
		{canBeAI:true name:"Player 6" aiType:null ai:null color:"0 0 0 0" biome:null age:"Rodent" wood:0 stone:0 starch:0 sugar:0 salt:0 formations:[] selectedObjects:[] technologiesBeingResearched:{} technologiesResearched:[] actionLastRunFrames:{} autoFindSquads:[]}
	objects_place_owner:"@/players/i:0"
	selectedPlayer:"@/players/i:0"
	initialBatchDone:false
	plants:[^]
		{^}
			transform:{^}
				position:"9 406 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"9 412 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"9 416 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"9 486 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"9 490 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"9 495 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"10 398 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"10 402 1"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"10 409 1"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"12 405 2"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"12 407 2"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"12 409 2"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"14 413 3"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"13 401 2.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"13 403 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"14 405 3"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"14 407 3"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"14 409 3"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"16 402 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"17 406 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"16 409 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"22 250 3.99980926513672"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"21 253 3.99976348876953"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"21 255 3.99992370605469"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"23 253 3.99986267089844"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"23 255 3.99992370605469"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"25 245 3.99985504150391"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"25 247 3.9998779296875"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"26 250 3.99990844726563"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"25 253 3.99990844726563"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"25 255 3.99996948242188"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"25 257 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"25 259 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"27 245 3.99989318847656"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"28 254 3.99996948242188"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"27 257 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"28 260 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"28 247 3.99993133544922"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"29 241 3.99992370605469"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"29 243 3.99992370605469"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"29 245 3.99991607666016"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"30 250 3.99996185302734"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"29 257 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"29 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"30 247 3.99994659423828"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"31 241 3.99993896484375"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"31 243 3.99996185302734"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"31 245 3.99996185302734"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"32 254 3.99998474121094"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"31 257 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"31 259 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 263 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 41 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 43 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 45 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"34 48 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 51 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"33 53 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"34 56 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 237 3.99996185302734"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"34 240 3.99990081787109"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 243 3.99997711181641"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"34 246 3.99998474121094"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 249 3.99998474121094"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"33 251 3.99997711181641"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"33 257 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"33 260 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"34 268 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"34 259 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"35 41 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"36 44 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"35 51 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"35 53 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"35 237 3.99996185302734"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"35 243 3.99998474121094"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"35 249 3.99999237060547"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"36 252 3.99998474121094"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"35 255 3.99999237060547"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"36 258 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 37 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 39 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"37 41 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 47 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"37 49 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 51 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 53 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"38 56 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 59 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 61 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"37 63 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 237 3.99703979492188"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 239 3.99697113037109"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 241 3.99952697753906"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"38 244 3.999267578125"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"38 248 3.99997711181641"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"37 261 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"37 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"38 266 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"38 270 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"40 38 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 41 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 43 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"39 45 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 47 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"40 50 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 54 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"40 60 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 63 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 237 3.99703979492188"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"39 239 3.99111938476563"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 241 3.99368286132813"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 251 3.99996948242188"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 253 3.99998474121094"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"39 255 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 257 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 259 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 261 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"39 263 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"42 34 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"42 42 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 45 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"41 47 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"42 54 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 57 3.86945343017578"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 63 3.92586517333984"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"42 66 3.85173034667969"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"42 70 4.72548675537109"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 73 4.41551971435547"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"42 76 4.83103942871094"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"42 80 4.77939605712891"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 83 4.07389068603516"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"41 233 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 235 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 237 3.99819183349609"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"41 239 3.99227142333984"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 241 3.99039459228516"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"41 243 3.99558258056641"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 245 3.9984130859375"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 247 3.99912261962891"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"42 250 3.99836730957031"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"42 254 3.99998474121094"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"43 259 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 265 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"41 267 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"42 270 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"43 37 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"43 39 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"43 45 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"44 48 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"43 51 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"43 57 3.86945343017578"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"44 60 3.47781372070313"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"43 73 5.14100646972656"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"44 84 4.29557037353516"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"44 234 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"43 237 3.99819183349609"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"44 240 3.99275970458984"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"44 244 3.99708557128906"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"43 247 3.99815368652344"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"43 263 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"44 266 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 37 4.20879364013672"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"45 39 4.20879364013672"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"45 41 4.20937347412109"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 43 4.20937347412109"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 51 4.00287628173828"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 53 4.02330017089844"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 55 4.02330017089844"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 57 4.03544616699219"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"46 64 4.71137851017669"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 67 5.50337982177734"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 69 5.83818817138672"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"45 71 5.84939575195313"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 75 6.74217224121094"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 79 5.97611236572266"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"45 87 4.40133666992188"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"45 89 4.49819946289063"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"45 91 4.5694580078125"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"45 238 3.99510192871094"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"46 248 3.99839019775391"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 251 3.99759674072266"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 253 3.99757385253906"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 255 3.99919128417969"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"45 269 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"46 272 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"46 45 4.32740020751953"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"46 81 6.16506958007813"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 38 4.79120635986328"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 41 4.62696838378906"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 43 4.62812805175781"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"47 47 4.35408020019531"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 49 4.23892974853516"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 51 4.00862884521484"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 53 4.029052734375"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 56 4.09320068359375"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 59 4.10633850097656"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"47 61 4.22352532202559"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"47 67 6.14738464355469"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 70 6.89182281494141"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 83 6.20314788818359"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 85 5.54216003417969"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 87 4.85179901123047"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"47 89 4.94866180419922"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"47 91 5.22205352783203"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 234 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 238 3.99383544921875"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 242 3.99224853515625"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 251 3.99861907958984"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"48 254 3.99941253662109"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 257 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 259 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 262 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"47 265 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 268 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 45 4.74615478515625"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"48 79 7.13672461469146"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"48 81 7.1247786078701"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"48 245 3.99730682373047"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 41 5.18635559082031"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"49 43 5.18751525878906"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 49 5.37989044189453"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 54 4.07085418701172"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 59 4.14813995361328"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 61 4.69170288500582"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"50 64 6.03464508056641"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 67 6.44294738769531"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 83 7.69938266204127"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 85 7.34394238179097"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"49 87 6.817580429812"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"49 89 5.46152876954768"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 91 5.73491668701172"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"50 248 3.99862670898438"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 251 3.99854278564453"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 257 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 259 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"49 265 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"49 271 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"50 45 5.45948791503906"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"50 53 4.347900390625"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"50 79 8.63121075076069"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"50 81 8.83076811475225"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"50 245 3.99758148193359"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"51 41 5.50032043457031"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 43 5.88870239257813"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"53 57 4.19117736816406"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 62 5.19688668210223"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 67 6.39008331298828"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"52 70 7.31072152554988"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 73 7.81732625308945"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"52 76 9.64667510986328"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"52 84 10.9526667606263"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 87 9.21038396212089"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"52 90 8.40490492338341"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 237 3.99828338623047"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 239 3.99484252929688"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"52 242 3.99565124511719"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 251 3.99802398681641"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 253 3.99859619140625"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 255 3.99970245361328"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 257 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 259 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 261 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"51 263 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"52 266 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"52 270 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"52 45 6.16066741943359"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"52 53 4.94283294677734"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"52 245 3.99826049804688"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"53 61 4.6299635774004"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"53 63 5.82186126708984"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"54 66 6.68287658691406"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"53 73 8.62631225585938"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"53 79 10.3942031860352"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"53 81 10.720703125"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"53 87 11.0617795972655"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"53 247 3.99829864501953"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"53 249 3.99834442138672"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"54 252 3.99781799316406"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"53 255 3.99944305419922"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"54 258 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"53 261 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"54 45 6.75762939453125"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"54 53 6.01610565185547"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 246 3.99800872802734"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"54 264 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"56 48 6.93965911865234"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 51 6.94816589355469"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 61 4.78268432617188"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"55 63 6.03386688232422"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 69 7.60571302786779"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 71 8.74290196403746"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"57 75 10.5639038085938"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"56 80 11.3876693263666"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 83 12.035365046954"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 85 12.8459769175274"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 87 13.3017165199251"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 249 3.99809265136719"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 255 3.99944305419922"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 261 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"56 264 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 267 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"55 271 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"56 45 7.44325256347656"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"56 53 7.0603620082673"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"58 56 8.29384378382704"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"57 59 5.95536781978714"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"57 61 6.16562307705406"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"58 64 8.21481027631171"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"58 68 8.945190477521"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"57 71 10.3600444598611"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"57 83 13.3208139398192"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"58 258 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"57 261 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"57 267 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"58 338 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"58 53 8.53172573945386"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"59 59 8.45631934852322"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"59 61 8.40587605441735"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"59 71 10.7815322875977"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"60 80 14.3252071876927"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"60 84 15.0097865866601"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"60 262 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"59 265 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"60 268 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"60 53 9.5400671941661"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 57 10.5337103038791"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"61 59 10.2148084673571"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 61 10.3768008841791"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 63 11.0191499905108"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"61 65 11.5140242509634"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"61 67 12.0617993193335"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 69 12.2141558299076"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 71 11.9271764283184"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 73 12.1732733504016"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"61 75 13.0613819275712"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 78 14.5098512191524"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"62 338 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 343 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 345 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"62 348 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"61 351 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"62 77 15.141148945456"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"63 57 12.1720866502878"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"63 59 11.864337707829"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"63 61 12.0077525115873"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"63 63 12.4089788633513"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"63 65 13.0848737765233"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"63 67 13.8649299787774"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"63 69 14.040154426312"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"64 72 14.6297782623477"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"64 76 16.5221481323242"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"64 80 17.3688354492188"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"63 341 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"63 343 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"63 345 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"64 352 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"65 61 13.5794490106611"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"65 63 13.9119320239334"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"65 65 13.7235794067383"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"65 67 14.6741333007813"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"65 337 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"65 339 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"65 341 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"66 344 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"65 347 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"65 349 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"66 356 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"66 69 15.1491622924805"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"68 62 16.4601745605469"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"68 66 15.9914770191919"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"68 72 18.4455775273758"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"68 338 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"67 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"68 348 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"67 351 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"68 69 16.1633133550731"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"70 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"69 345 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"69 351 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"71 355 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"70 360 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"72 338 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"72 346 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"72 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"73 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"73 343 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"74 360 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"75 341 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"75 343 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"75 345 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"75 347 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"76 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"76 354 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"75 357 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"77 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"78 344 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"77 347 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"78 358 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"77 361 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"77 363 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"79 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"80 348 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"80 352 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"79 355 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"79 361 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"80 364 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"81 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"81 355 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"82 358 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"81 361 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"83 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"83 347 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"83 349 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"84 352 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"83 356 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"84 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"84 355 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"85 350 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"85 357 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"85 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"86 366 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"86 355 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"88 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"87 357 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"87 359 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"87 361 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"87 363 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"88 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"88 355 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"89 357 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"89 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"90 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"89 365 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"89 367 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"90 482 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"89 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"89 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"89 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"89 491 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"90 494 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"91 354 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"91 357 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"91 360 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"91 365 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"91 367 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"92 486 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"91 489 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"91 491 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"92 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"93 357 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"93 361 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"93 363 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"94 366 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"93 473 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"94 476 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"94 480 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"93 484 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"93 489 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"94 492 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"93 495 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"93 497 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"94 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"94 483 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"94 499 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"95 358 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"95 361 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"96 486 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"95 490 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"95 495 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"95 497 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"96 357 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"96 360 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"96 363 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"96 483 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"96 489 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"96 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"98 474 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"97 477 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"97 479 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"97 481 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"98 492 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"97 495 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"97 498 1"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"98 497 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"100 478 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"100 482 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"99 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"99 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"99 489 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"99 495 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"99 499 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"100 497 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"101 213 4.86183929443359"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 215 4.66301727294922"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 469 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 471 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 473 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 487 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 491 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"102 494 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"101 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"102 497 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"103 213 5.15068054199219"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"103 215 4.86183929443359"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"104 470 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"103 473 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"104 476 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"103 479 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"104 482 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"104 486 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"104 490 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"103 499 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"106 499 0.5"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"105 209 5.81010437011719"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"105 211 5.71350860595703"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"106 214 5.53748321533203"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"105 479 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"106 494 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"106 473 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"107 209 6.26287078857422"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"108 476 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"108 480 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"107 483 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"107 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"107 487 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"108 490 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"108 211 6.39126586914063"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"108 473 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"109 483 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"109 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"109 493 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"109 495 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"110 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"112 474 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"112 478 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"112 482 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"111 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"112 490 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"111 493 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"112 496 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"113 485 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"115 481 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"116 484 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"115 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"115 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"115 491 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"117 301 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"117 303 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"117 305 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"117 307 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"120 302 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"119 305 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"119 307 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"122 298 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"121 305 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"121 307 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"121 309 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"122 312 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"124 302 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"123 305 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"123 307 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"124 309 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"125 293 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"125 295 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"126 298 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"126 306 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"125 311 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"126 309 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"128 294 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"127 301 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"127 311 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"128 303 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"128 309 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"129 289 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"129 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"130 300 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"129 305 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"129 307 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"129 311 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"130 303 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"131 310 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"132 290 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"131 293 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"132 296 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"132 306 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"134 90 37.820686340332"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"134 94 36.6779098510742"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"133 97 37.064811706543"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"133 99 37.6606479432908"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"133 101 37.091916603909"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"134 104 36.4655306545217"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"133 285 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"133 287 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"133 293 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"133 299 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"133 301 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"133 303 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 310 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 97 37.314333457712"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 99 35.8760654603394"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"135 101 35.3803557402091"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"136 286 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 289 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 291 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 293 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 295 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 297 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 299 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 301 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"136 304 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"135 307 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 85 37.5810394287109"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 87 38.1273651123047"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"138 90 38.2014541625977"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 93 37.020757148205"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 95 36.5691073319767"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 97 35.7428907901616"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 99 34.500373840332"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"137 101 34.5050277709961"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 103 35.1080932617188"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 105 35.0318984985352"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"138 108 34.066032409668"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 281 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"137 289 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"139 293 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"138 300 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"137 307 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"139 310 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"140 86 38.4378814697266"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"140 94 34.977610225"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"139 97 34.611747558193"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"139 99 34.6877136230469"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"139 101 34.6923675537109"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"139 103 34.6257095336914"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"139 105 34.5495147705078"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"140 282 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"139 285 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"140 288 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"139 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"140 304 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"139 308 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"140 307 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"141 89 38.437614440918"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"142 98 35.8976461203448"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"141 101 34.2514416413034"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"141 103 34.1847839355469"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"141 277 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"141 279 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"142 298 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"141 301 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"141 433 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"141 435 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"141 437 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"141 439 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"142 285 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"142 307 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"143 85 36.7133952465227"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"143 87 38.6222813758898"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"143 89 38.5342178344727"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"144 92 38.1998258742961"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"144 102 36.4500200101126"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"143 277 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"143 279 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"144 282 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"143 287 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"143 289 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"144 292 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"143 296 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"143 301 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"144 304 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"143 433 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"144 436 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"144 440 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"144 95 37.4441595355541"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"144 285 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"144 295 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 308 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 81 32.2656326293945"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 83 33.3889923095703"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 85 34.9743686244863"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 87 37.1904555626358"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 89 37.9621658325195"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 97 36.8040014596479"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 99 36.8223717724329"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 273 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 275 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"145 277 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 279 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 287 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 290 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"145 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 299 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"145 301 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"145 433 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"146 95 36.5264606189112"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"146 289 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"146 295 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 81 33.662353515625"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"148 84 32.5466564603454"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 87 36.0600826014858"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"147 89 36.7214643625837"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 91 36.0668727286431"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"148 94 33.483107401998"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"148 98 32.7915485421758"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 101 31.8603453928489"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 103 31.5793315901166"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 273 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 275 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 277 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 279 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 281 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"148 284 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 291 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 293 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"147 297 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"147 299 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"147 301 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 303 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"148 434 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 437 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"147 439 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 288 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 296 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 33 5.69200897216797"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"150 36 6.57164764404297"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"150 40 7.32669830322266"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 43 9.08414446841356"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 81 32.0940971291597"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"150 88 32.0547024382288"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 91 33.4022895340368"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 271 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"150 274 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 277 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"150 280 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 291 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"150 300 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"149 437 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"150 440 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"151 33 5.28865814208984"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"151 43 8.37857031403969"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"152 82 26.3226534208118"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"151 85 27.8253976818065"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"151 91 32.8409334850569"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"152 94 31.9884856217128"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"151 97 31.8800561122282"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"152 100 29.7186481424235"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"151 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"152 284 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"151 291 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"151 293 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"152 434 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"151 438 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"152 277 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"153 288 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"152 295 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"152 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 34 4.79631805419922"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"153 37 6.38954162597656"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 40 6.56273651123047"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 44 8.17892531660993"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"153 47 10.7744140625"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"153 85 26.627082824707"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"153 87 27.9616099392822"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 90 28.6614245641484"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"153 265 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 268 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"153 271 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 274 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 280 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 292 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 277 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"154 295 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"155 37 5.66866302490234"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"156 48 10.7992443588085"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"155 85 25.88037109375"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"155 88 27.8376724858918"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"155 93 28.5014559530353"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"156 96 24.3971248265812"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"155 265 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"155 271 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"155 283 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"156 87 26.6222195245352"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"156 277 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 286 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"156 289 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 296 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 33 4.28835296630859"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"157 35 4.75627899169922"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 37 4.99482727050781"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"158 40 5.79853057861328"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"158 44 6.91531372070313"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 261 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 265 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 267 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"157 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"158 272 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 275 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"157 279 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"158 282 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"158 292 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"158 277 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"158 289 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"160 34 4.34843444824219"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"159 261 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"160 264 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"159 267 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"160 276 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"160 37 4.65242004394531"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"160 269 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"160 285 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"161 288 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"161 39 4.99501800537109"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"161 41 5.16812133789063"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"161 43 5.61412811279297"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"161 271 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"161 273 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"161 279 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"162 282 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"163 33 4.31189727783203"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"163 35 4.50060272216797"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"164 38 4.87611389160156"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"163 41 5.16089630126953"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"164 44 5.15727996826172"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"163 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"163 271 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"164 274 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"163 277 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"163 279 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"170 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"169 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"169 355 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"170 358 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"171 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"174 346 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"174 350 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"173 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"173 355 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"173 357 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"173 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"174 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"175 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"175 355 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"175 358 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"175 360 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"177 341 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"177 343 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"178 346 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"177 349 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"177 351 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"178 354 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"177 357 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"177 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"178 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"180 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"180 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"179 357 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"179 359 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"181 145 8.420654296875"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"181 147 8.74305725097656"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"182 150 8.74508666992188"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"181 337 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"181 340 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"182 346 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"182 354 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"181 357 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"181 359 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"181 361 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"181 363 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"182 339 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"183 145 8.21808624267578"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"183 147 8.29726409912109"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"183 337 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"183 341 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"183 343 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"184 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"183 357 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"184 360 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"183 363 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"184 339 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"185 137 8.1209090487917"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"185 139 8.29969787597656"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"186 142 8.07397921892633"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"186 146 7.89490787466792"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"186 150 8.27881334482551"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"186 154 8.43185495158592"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"185 338 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"186 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"185 345 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"185 347 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"185 353 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"185 355 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"185 357 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"185 363 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"186 337 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"186 340 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"187 137 7.68742529098317"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"187 139 8.08747794911636"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"187 345 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"187 347 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"187 349 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"187 351 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"188 354 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"187 357 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"187 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"187 361 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"188 364 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"188 337 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"188 339 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 137 7.3338623046875"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 139 7.72001532830741"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 141 7.81628355550725"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 143 7.61738543824578"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"190 146 7.23814392089844"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 149 7.42140960693359"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 151 7.78661631500049"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 153 7.82740858506492"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 155 7.53349304199219"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 343 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 347 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"189 349 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 351 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"190 358 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 361 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"190 482 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"189 487 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"190 490 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"190 337 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"190 339 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"192 138 7.40039825439453"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"192 142 7.36885833740234"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"191 149 7.04120635986328"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"191 151 7.12500331450285"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"191 153 7.16236829407154"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"192 156 7.27477264404297"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"192 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"191 345 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"191 347 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"191 349 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"191 351 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"191 353 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"192 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"191 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"191 487 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 338 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 145 7.06883239746094"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"194 148 6.63812255859375"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 151 6.69563293457031"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"193 333 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"193 335 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 347 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"194 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 353 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"194 356 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 473 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"193 475 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"193 477 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 479 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"194 482 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"194 486 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"193 489 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"193 491 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"193 493 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"194 496 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"194 359 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"195 137 6.81254577636719"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"196 140 7.04016876220703"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"196 144 7.07063293457031"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"195 151 6.21709442138672"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"195 333 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"196 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"195 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"195 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"196 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"195 473 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"196 476 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"195 480 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"195 489 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"195 491 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"196 335 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"196 337 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"196 339 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"196 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"196 493 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"197 345 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"198 348 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"197 351 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"197 353 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"198 356 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"197 473 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"198 480 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"197 483 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"197 485 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"197 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"197 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"197 491 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"198 496 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"198 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"198 493 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"198 499 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"199 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"200 344 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"199 351 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"199 473 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"200 476 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"200 484 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"199 487 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"200 490 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"200 353 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"200 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"200 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"201 469 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"201 471 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"201 479 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"201 481 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"201 488 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"201 493 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"202 496 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"202 473 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"202 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"202 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"203 469 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"204 472 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"203 475 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"203 477 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"203 479 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"203 481 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"203 483 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"203 485 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"204 490 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"203 493 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"205 475 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"205 477 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"206 480 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"205 483 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"205 485 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"205 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"205 493 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"205 495 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"205 497 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"206 499 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"207 473 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"207 475 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"207 478 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"207 483 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"207 485 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"207 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"207 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"207 491 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"207 493 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"208 496 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"208 477 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"208 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"210 106 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"210 110 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"210 474 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"210 480 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"210 484 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"209 487 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"209 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"209 491 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"209 494 3"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"210 477 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"210 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"212 488 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"211 491 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"211 493 3.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"212 496 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"212 477 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"214 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"213 105 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"214 108 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"215 113 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"213 481 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"213 483 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"213 486 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"213 491 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"213 493 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"214 485 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"215 105 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"216 482 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"215 487 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"215 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"216 492 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"215 495 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"216 485 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"217 97 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"217 99 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"218 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"218 106 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"217 110 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"218 109 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"219 97 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"219 100 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"219 111 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"220 99 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"220 109 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"221 97 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"221 101 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"222 104 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"221 107 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"222 112 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"223 100 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"223 97 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"223 107 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"224 109 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"225 93 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"225 95 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"225 97 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"225 103 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"225 105 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"226 112 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"226 99 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"227 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"226 107 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"226 109 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"227 93 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"227 95 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"227 97 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"227 105 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"228 99 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"228 109 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"229 89 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"229 91 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"230 94 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"229 97 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"229 105 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"229 107 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"229 111 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"230 99 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"230 101 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"230 103 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"230 109 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"231 89 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"231 91 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"231 97 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"232 106 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"232 112 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"232 99 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"232 101 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"232 103 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"232 110 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"234 90 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"233 93 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"234 96 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"233 109 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"233 241 3.94032287597656"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"234 244 3.94725799560547"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"234 248 3.95748138427734"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"234 99 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"235 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"235 94 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"236 106 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"235 109 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"235 111 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"236 93 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"236 242 3.93834686279297"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"238 9 1.54833221435547"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 89 3.85780334472656"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 91 3.85780334472656"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 95 3.90861511230469"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"238 98 3.85010528564453"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"238 110 3.92202758789063"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 233 3.96499633789063"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 235 3.96499633789063"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"238 238 3.9365234375"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 241 3.90608215332031"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 244 3.97077941894531"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 246 3.97622680664063"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 248 3.9774169921875"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 250 3.95921325683594"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"237 252 3.94065093994141"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"238 93 3.76641845703125"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"238 101 3.84587860107422"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"238 103 3.84164428710938"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"239 89 3.56618499755859"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"240 92 3.43122863769531"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"239 95 3.72583770751953"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"240 106 3.70117950439453"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"239 233 3.89835357666016"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"239 235 3.89498901367188"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"240 242 3.90585327148438"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"239 245 3.95423126220703"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"239 247 3.96394348144531"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 251 3.86581420898438"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"240 7 0.28749298337685"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"240 101 3.69598388671875"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"240 103 3.68751525878906"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"242 7 0.866047779671106"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 10 2.68695068359375"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 12 3.59259796142578"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 89 3.47663879394531"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"242 96 3.65562438964844"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 99 3.68173217773438"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 109 3.76758575439453"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"241 111 3.83007049560547"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 225 3.80294799804688"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 227 3.85976409912109"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 229 3.88287353515625"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 231 3.87600708007813"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 233 3.8779296875"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 235 3.87456512451172"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"241 237 3.87645721435547"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"242 246 3.90373229980469"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"242 101 3.70115661621094"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"242 104 3.69770812988281"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"242 239 3.89619445800781"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"244 11 3.70748901367188"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"244 90 3.57460021972656"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"243 93 3.60513305664063"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"244 100 3.69203948974609"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"244 104 3.71214294433594"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"243 107 3.86648559570313"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"243 109 3.87181854248047"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"244 112 3.9130859375"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"243 225 3.81001281738281"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"243 227 3.87522125244141"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"243 229 3.89832305908203"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"243 231 3.88771057128906"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"243 233 3.88964080810547"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"243 235 3.90036010742188"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"244 242 3.91969299316406"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"244 237 3.91515350341797"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"244 239 3.92230224609375"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"246 5 1.21038044114268"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 93 3.65468597412109"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"245 95 3.66494750976563"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 107 3.87444305419922"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 109 3.92462921142578"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"246 222 3.63578796386719"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 225 3.81566619873047"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 227 3.88087463378906"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 229 3.90544128417969"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 231 3.89482879638672"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"245 233 3.89797973632813"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"246 236 3.91655731201172"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"246 246 3.87924957275391"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 249 3.74209594726563"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"245 251 3.63787078857422"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"246 254 3.83017730712891"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"246 8 3.54549407958984"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"246 97 3.66747283935547"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"246 239 3.92378234863281"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"248 11 3.74961853027344"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 93 3.66281127929688"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"248 96 3.64994812011719"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"248 100 3.66635131835938"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 103 3.73345947265625"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"247 105 3.7843017578125"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"247 107 3.87592315673828"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 109 3.92611694335938"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"247 111 3.91880035400391"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 225 3.77651214599609"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 227 3.88510894775391"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 229 3.90967559814453"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 231 3.89361572265625"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"247 234 3.90522766113281"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"247 241 3.92378997802734"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 243 3.91517639160156"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 249 3.73018646240234"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"247 251 3.48867797851563"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"248 233 3.89616394042969"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"248 239 3.927001953125"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"249 3 1.02045191207435"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"249 5 3.15727996826172"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"249 7 3.46678161621094"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"250 104 3.74380493164063"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"251 109 3.92393493652344"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"250 218 2.9755859375"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"250 222 3.59529876708984"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"249 225 3.75152587890625"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"249 227 3.86013031005859"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"250 230 3.89424133300781"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"250 236 3.91474151611328"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"249 241 3.90451812744141"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"250 244 3.87159729003906"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"249 247 3.80016326904297"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"249 249 3.72422790527344"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"250 252 3.36196899414063"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"249 255 3.84049224853516"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"250 9 3.65073394775391"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"251 240 3.91593933105469"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 5 3.38074493408203"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"251 11 3.70821380615234"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 99 3.74061584472656"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"251 225 3.73424530029297"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"251 228 3.90361785888672"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"252 248 3.59909057617188"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"252 256 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"252 9 3.65259552001953"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"252 233 3.87847900390625"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"254 12 3.7452392578125"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"254 210 3.84514617919922"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 213 2.83048248291016"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"254 216 3.25880432128906"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 219 3.19766235351563"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"253 221 3.35238647460938"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"254 224 3.83403778076172"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 227 3.86611938476563"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 229 3.92366027832031"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 231 3.90888214111328"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 235 3.921142578125"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 237 3.93096160888672"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"254 244 3.91579437255859"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 251 3.58075714111328"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 253 3.52147674560547"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"253 259 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"254 9 3.67041015625"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"254 233 3.934326171875"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"255 240 3.97791290283203"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"256 220 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"255 227 3.91701507568359"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"255 229 3.97455596923828"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"255 231 3.97455596923828"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"256 236 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"255 247 3.95790100097656"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"255 249 3.89977264404297"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"256 252 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"255 255 3.84049224853516"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"255 257 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 261 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"256 9 3.69820404052734"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"256 233 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"259 5 0.84741121673882"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 11 3.73175811767578"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 209 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"257 211 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 213 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 215 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"257 217 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"258 224 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 227 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 229 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"258 232 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"258 244 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 247 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"257 249 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"257 255 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"258 10 3.71044921875"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"258 239 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"258 241 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"258 257 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"260 10 3.61891174316406"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 209 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 211 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 213 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"259 215 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 217 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 219 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"259 221 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"260 228 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 235 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"259 237 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 247 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 249 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"260 252 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"259 255 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"260 239 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"260 241 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"261 221 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"261 223 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"261 225 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"261 231 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"261 233 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"262 236 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"262 244 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"261 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"261 249 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"262 256 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"261 259 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"262 262 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"262 239 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"262 241 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"264 8 2.26346588134766"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"263 11 3.53858184814453"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"264 222 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"264 226 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"264 230 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"263 233 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"263 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"263 249 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"263 251 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"264 239 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"264 241 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"264 253 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"264 259 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"265 11 2.99356079101563"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"266 244 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"266 248 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"265 251 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"265 255 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"265 257 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"265 261 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"265 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"266 241 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"266 254 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"266 259 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"268 9 1.11709594726563"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"267 12 2.84244537353516"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"268 252 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"268 257 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"267 261 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"267 263 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"268 242 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"269 261 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"269 12 2.45432281494141"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"269 249 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"269 255 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"270 265 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"272 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"271 12 2.15144348144531"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"271 249 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"271 251 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"272 254 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"271 257 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"272 259 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"272 262 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"273 12 2"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"276 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"275 12 2"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"277 12 2"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"279 9 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"280 12 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"282 9 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"284 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"283 12 2"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"285 12 2"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"288 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"288 13 2.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"314 202 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"317 197 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"318 200 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"318 204 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"317 207 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"319 197 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"319 207 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"321 197 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"321 199 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"321 201 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"321 203 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"321 205 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"321 207 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"322 210 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"325 199 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"323 203 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"323 205 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"323 207 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"325 193 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"325 195 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"326 204 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"325 207 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"326 210 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"327 193 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"327 195 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"327 207 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"329 189 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"329 191 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"330 194 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"329 197 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"329 199 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"329 201 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"330 204 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"329 207 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"330 210 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"331 190 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"331 197 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"331 199 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"331 202 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"331 207 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"332 189 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"332 192 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"333 191 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"333 194 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"333 196 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"333 198 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"334 201 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"333 204 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"333 206 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"333 208 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"333 210 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"333 212 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"334 189 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"335 191 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"335 193 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"335 195 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"335 197 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"336 205 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"335 208 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"335 210 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"335 212 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"337 190 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"338 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"338 186 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"337 193 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"337 195 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"338 198 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"337 201 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"337 208 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"337 210 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"337 212 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"337 333 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"337 335 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"338 338 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"337 341 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"337 343 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"338 346 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"339 193 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"339 195 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"339 201 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"339 203 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"339 205 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"340 208 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"339 211 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"339 333 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"340 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"340 189 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"340 191 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"340 335 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"341 9 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"341 11 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"341 185 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"342 188 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"341 193 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"342 196 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"341 199 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"341 201 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"341 203 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"341 205 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"342 326 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"343 331 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"342 338 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"343 192 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"342 335 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"343 9 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"343 11 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"344 200 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"343 203 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"343 205 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"344 208 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"343 341 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"344 344 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"344 185 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"345 9 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"345 11 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"345 187 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"345 189 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"345 195 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"346 204 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"346 322 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"345 325 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"345 327 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"345 335 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"346 338 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"345 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"346 185 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"346 191 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"346 197 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"347 9 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"348 12 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"348 188 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"347 193 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"348 196 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"347 199 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"347 325 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"347 327 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"347 329 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"347 331 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"347 333 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"347 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"348 344 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"348 185 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"348 191 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"348 202 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"349 9 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"349 313 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"349 315 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"349 317 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"350 320 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"350 324 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"349 327 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"350 330 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"349 333 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"350 336 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"349 339 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"350 342 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"352 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"351 12 2"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"351 313 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"352 316 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"351 327 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"351 339 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"352 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"352 333 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"353 12 2"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"353 313 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"354 320 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"353 323 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"354 326 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"353 329 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"354 336 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"353 339 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"353 493 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"353 495 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"354 498 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"355 332 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"355 9 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"355 11 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"355 313 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"356 316 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"355 323 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"355 329 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"355 339 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"356 494 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"358 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"358 13 2.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"358 320 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"357 323 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"358 326 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"357 330 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"357 335 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"357 489 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"357 491 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"357 497 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"357 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"358 313 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"358 329 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"358 332 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"360 316 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"359 323 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"360 332 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"359 335 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"359 489 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"360 492 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"359 495 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"359 497 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"359 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"360 313 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"362 10 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"362 150 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"363 155 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"362 160 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"361 319 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"361 321 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"361 323 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"363 327 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"361 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"362 496 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"362 313 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"362 499 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"363 315 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"363 317 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"363 319 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"363 321 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"363 324 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"363 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"364 492 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"364 323 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"364 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"365 9 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"365 11 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"365 145 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"365 147 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"366 150 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"366 160 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"366 164 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"366 246 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"365 249 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"366 252 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"366 256 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"366 318 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"365 485 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"365 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"365 489 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"365 495 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"365 498 1"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"367 498 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"368 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"367 12 2"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"368 146 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"367 153 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"367 155 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"367 157 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"367 485 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"367 487 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"367 489 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"368 492 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"367 495 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"368 249 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"370 13 2.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"369 141 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"369 144 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"369 149 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"369 151 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"369 153 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"370 156 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"369 159 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"370 162 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"370 246 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"369 251 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"370 254 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"369 257 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"369 259 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"369 495 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"370 143 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"370 249 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"370 489 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"371 498 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"371 9 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"372 142 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"371 145 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"371 147 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 151 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"371 159 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"371 251 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"372 258 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"372 492 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"371 495 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"372 249 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"372 489 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 14 3"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"374 146 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 155 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 157 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 159 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"374 162 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"374 242 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 245 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 251 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"373 253 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"373 255 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"373 495 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"374 249 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"374 489 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 498 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 141 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 143 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"376 156 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 159 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 245 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 248 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"376 252 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 255 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 257 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 259 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"375 491 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"375 493 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"375 496 2"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"376 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"376 250 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"377 141 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 143 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 145 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"378 148 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 151 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 154 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"378 160 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 163 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 241 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"377 243 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 249 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"378 256 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"378 260 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"377 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"378 494 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"378 245 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"378 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"378 497 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"378 499 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"379 12 2"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"380 142 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"379 146 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"380 152 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"379 155 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"379 157 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"379 163 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"380 242 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"380 250 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"379 253 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"379 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"381 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"380 145 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"380 245 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"380 247 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"380 497 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"380 499 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"382 13 2.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"381 147 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"381 149 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"381 155 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"381 157 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 160 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 164 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 254 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 258 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"381 261 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"381 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 266 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 145 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 245 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"382 497 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"383 141 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"383 143 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"383 147 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"383 149 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"383 151 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"383 153 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"384 156 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"383 241 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"384 244 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"384 250 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"383 261 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"383 263 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"383 499 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"384 9 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"384 11 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"384 145 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"384 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"384 497 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"386 9 0.5"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"385 147 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"385 149 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"385 151 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"385 153 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"387 161 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"385 241 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"385 253 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"385 255 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"386 258 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"386 262 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"386 266 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"386 12 2"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"386 247 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"388 146 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"388 150 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"387 153 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"387 155 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"387 157 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"388 242 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"388 246 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"387 249 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"387 251 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"388 254 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 13 2.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"390 154 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"390 250 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 257 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 259 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 261 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 263 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 265 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"389 267 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 271 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"389 273 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"390 276 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 149 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 151 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 245 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"391 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"392 254 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 257 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 259 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 261 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"391 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 265 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"392 268 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"391 271 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"392 12 2"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"392 274 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"394 15 3.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"393 245 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"393 247 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"394 250 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"393 257 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"394 260 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"394 264 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"393 271 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"393 273 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"393 276 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"394 279 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"393 282 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"393 284 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"394 9 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"394 12 2"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"395 245 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"395 248 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"395 253 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"395 255 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"395 257 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"395 267 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"395 269 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"395 271 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"395 273 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"395 275 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"396 283 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"396 9 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"396 11 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"396 247 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"396 277 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 13 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 15 3.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"399 251 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"398 256 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 259 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"398 262 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 265 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 267 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"398 270 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 273 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"398 276 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 279 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 281 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 286 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"397 288 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"399 10 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"400 14 3"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"399 259 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"400 266 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"399 273 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"400 280 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"400 284 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"399 287 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 17 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 19 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 255 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"402 258 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 261 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 263 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 269 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"402 272 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 275 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"401 277 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 287 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"401 289 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"401 291 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"402 9 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"402 12 2"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"404 12 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 15 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 17 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 19 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"404 254 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 261 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"405 265 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 275 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 277 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 279 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"403 281 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"404 284 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"404 288 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"403 291 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"404 9 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"405 15 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"406 258 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"405 261 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"405 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"405 271 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"405 273 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"405 275 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"406 278 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"406 292 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"406 9 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"406 281 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"408 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"408 13 2.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"407 16 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"407 261 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"407 269 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"407 271 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"408 274 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"407 283 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"407 285 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"407 287 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"407 289 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"408 281 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"409 16 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"409 277 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"409 279 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"409 283 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"410 286 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"410 290 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"410 281 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"411 9 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"411 11 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"412 14 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"412 274 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"412 278 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"411 283 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"412 281 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"414 9 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"413 283 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"414 286 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"413 289 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"413 291 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"414 281 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"415 283 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"415 289 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"415 291 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"417 282 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"418 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"417 105 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"417 107 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"419 105 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"419 107 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"421 97 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"421 99 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"422 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"421 105 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"422 108 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"421 111 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"421 349 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"422 352 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"421 355 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"423 97 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"423 99 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"423 111 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"423 349 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"424 356 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"424 105 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"425 93 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"425 95 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"426 98 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"425 101 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"426 104 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"426 108 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"425 111 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"426 346 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"426 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"425 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"425 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"427 93 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"427 96 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"428 112 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"427 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"428 356 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"427 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"428 101 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 89 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 91 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 93 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 95 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"430 98 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 103 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"430 106 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 109 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 341 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"429 343 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"430 346 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 349 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 351 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"429 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"430 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"431 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"432 90 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"432 94 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"431 109 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"431 111 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"432 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"432 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"431 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"431 355 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"432 358 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"434 98 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"433 105 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"433 107 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"433 109 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"433 111 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"433 337 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"433 345 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"433 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"433 355 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"433 361 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"434 364 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"433 367 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"435 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"434 339 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"434 347 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"436 90 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"436 94 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"435 105 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"436 108 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"435 111 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"435 337 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"435 341 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"436 344 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"436 350 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"436 354 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"436 358 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"435 361 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"437 369 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"436 339 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"438 86 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"437 97 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"437 99 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"437 105 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"437 111 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"438 234 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"437 237 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"438 240 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"437 337 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"437 341 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"437 361 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"437 363 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"437 365 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"438 101 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"438 103 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"438 339 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"438 347 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 89 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 91 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"439 93 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"440 96 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"440 100 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 105 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 107 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 109 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"440 112 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 237 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"440 338 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 341 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 343 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 349 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"440 352 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"440 356 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"439 361 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"439 363 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"440 103 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"440 347 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"441 85 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"441 87 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 89 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 91 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 93 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 105 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"442 108 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 229 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"442 232 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 235 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"441 237 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 239 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 241 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"442 244 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"442 342 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 349 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"442 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 365 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"441 367 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"441 369 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"443 373 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"442 103 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"442 347 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"443 85 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"443 87 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 89 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 91 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"443 93 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"444 96 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 99 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"444 102 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 229 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"443 235 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 237 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 239 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 241 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"443 337 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 349 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"444 352 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"444 356 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 359 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 365 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 367 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"443 370 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"444 105 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"444 339 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"445 85 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 87 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 89 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 91 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 93 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"445 100 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"446 222 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"446 226 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 229 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"445 231 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 233 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"446 236 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 239 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 241 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 243 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 341 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"446 344 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"446 348 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 361 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"445 363 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 367 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"446 378 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"446 382 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"446 99 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"448 86 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 89 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"448 92 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 95 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"448 98 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 101 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"447 103 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"447 229 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"448 232 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 239 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 241 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"448 244 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 351 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"448 354 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 357 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"447 359 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"448 362 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"448 372 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"447 375 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"448 342 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"449 221 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"449 223 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"450 226 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"450 236 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"449 239 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"449 241 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"449 345 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"449 347 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"449 349 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"449 351 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"449 357 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"449 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"449 375 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"449 377 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"449 379 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"450 382 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"450 229 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"452 222 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 231 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 239 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 241 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 243 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 345 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"452 348 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 351 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 353 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 355 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"452 358 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 361 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"452 364 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 367 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"452 370 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"452 374 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"451 377 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"451 379 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"453 230 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"452 233 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"453 225 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"454 236 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"454 240 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"453 243 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"454 352 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"453 355 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"453 361 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"453 367 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"453 377 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"453 379 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"453 381 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"453 383 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"454 227 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"455 221 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"455 223 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"456 226 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"456 244 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"455 349 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"455 355 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"455 357 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"456 360 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"455 363 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"455 365 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"455 367 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"456 370 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"456 374 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"456 378 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"456 382 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"457 230 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"456 234 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"458 222 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"457 233 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"457 236 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"458 239 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"457 242 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"457 353 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"458 356 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"458 364 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"458 235 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"458 367 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"459 225 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"459 227 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"459 233 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"459 237 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"459 242 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"459 244 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"459 353 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"459 359 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"459 361 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"460 370 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"460 374 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"460 378 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"460 382 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"460 229 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"460 231 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"460 235 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"460 367 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"461 233 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"462 238 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"461 241 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"461 243 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"462 358 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"461 361 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"462 364 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"462 229 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"463 232 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"462 235 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"462 368 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"464 242 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"463 361 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"463 367 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"463 370 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"463 372 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"463 374 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"463 376 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"464 235 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"465 53 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"465 55 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"466 58 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"466 238 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"467 363 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"466 368 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"466 372 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"467 234 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"468 54 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"470 50 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"469 57 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"470 60 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"469 301 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"469 303 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"471 53 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"471 55 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"471 57 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"471 301 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"471 303 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 45 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"474 48 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"474 52 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 55 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 57 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"474 60 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 63 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 293 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 295 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 297 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"473 299 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 301 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"474 304 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"473 307 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"474 310 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"476 56 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"476 64 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"475 293 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"476 296 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"476 300 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"475 307 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"476 45 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"477 41 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"479 45 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"478 50 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"477 53 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"477 59 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"477 61 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"477 293 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"477 303 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"477 305 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"478 308 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"477 311 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"479 41 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"479 53 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"480 56 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"479 59 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"480 62 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"479 293 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"479 295 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"480 298 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"479 301 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"479 303 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"479 305 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"479 311 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"482 38 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 42 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"481 49 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"482 52 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 59 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 289 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 291 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 293 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 301 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 303 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 305 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 309 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 313 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"481 315 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"482 41 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"482 295 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 43 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"484 46 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 49 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 55 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"483 57 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 59 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 61 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"483 63 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"484 290 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 293 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"484 300 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"483 303 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"483 313 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"484 316 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"484 41 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"484 296 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"484 305 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 35 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"485 43 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"486 50 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"485 53 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"485 55 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"485 57 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"485 59 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 63 4"
			type:"Broadleaf_1"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"486 294 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"485 298 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"486 304 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"485 313 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"486 320 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 40 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"486 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 43 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"487 45 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 47 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"487 53 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"487 55 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"487 57 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 59 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"488 290 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"488 300 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 307 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 309 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 311 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 313 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 315 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"487 317 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"488 297 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"489 29 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 31 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 43 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"489 45 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"490 48 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 51 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 53 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 55 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 57 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"489 59 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"489 181 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 183 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"489 185 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 187 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 189 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"489 191 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"490 294 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 303 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"490 306 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 309 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"489 311 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"490 314 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"490 318 4"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"490 39 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"491 42 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"490 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"492 30 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 33 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 35 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 37 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 46 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 51 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 53 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 55 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"491 57 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 59 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 61 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"492 64 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 181 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 183 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 185 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 187 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 189 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 191 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 289 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 291 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"492 300 4"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 303 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 309 4"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"491 312 4"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"492 39 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"492 45 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"492 297 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"492 311 4"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 25 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 27 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 33 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 36 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 47 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 50 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 53 3.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 55 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 58 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 62 3.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 173 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 176 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 179 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"493 181 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 183 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 186 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 189 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 191 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 290 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 293 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 295 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"494 304 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 308 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 313 3.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"494 316 3"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 319 3.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 321 3.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"493 323 3.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 39 3"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 41 3"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 43 3"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 45 3"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"494 297 3"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"494 311 3"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 25 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 27 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 30 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 48 2.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"495 53 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 55 2.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"495 61 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 63 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 173 2.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"495 179 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 181 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 183 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 190 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 293 2.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 295 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 300 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"495 319 2.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 322 2"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 39 2"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 41 2"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 43 2"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"497 46 1.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 297 2"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 311 2"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"496 313 2"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 21 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"497 23 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 26 1"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 34 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 49 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 52 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 55 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 58 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 61 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"497 63 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 165 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 167 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"497 169 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 172 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 175 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"497 177 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 179 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 181 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"497 183 1.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 185 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 293 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 295 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 304 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 307 1.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 310 1"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 316 1"
			type:"Broadleaf_2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"497 319 1.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"499 38 0.5"
			type:"Palm"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 41 1"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 43 1"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 187 1"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 297 1"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"498 313 1"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 21 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 23 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 29 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"499 49 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 55 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 61 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 165 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 167 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"499 169 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 176 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 180 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 182 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 184 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 190 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 192 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"499 293 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 295 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 299 0.5"
			type:"BerryBush16"
			ownerRegion:"@/regions/i:1"
			hasProduce:{^}
				health:0
		{^}
			transform:{^}
				position:"499 307 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 322 0.5"
			type:"Banana Tree"
			ownerRegion:"@/regions/i:1"
		{^}
			transform:{^}
				position:"499 324 0.5"
			type:"Bush2"
			ownerRegion:"@/regions/i:1"
	structures:[^]
		{^}
			transform:{^}
				position:"113 82 38.1060409545898"
			type:"Habitat Center"
			owner:"@/players/i:0"
	units:[]
	projectiles:[]
	selectedObject:null
	module:{^}
		name:"Main"
		type:"None"
		typeModule:null
		scripts:[]
		selectedScript:null
		showElementHostsForTypes:true
		selectedElementHost:null
		selectedElementHost_forSelectedPiece:false
		selectedElement:null
		showModuleCode:false
		showWithProfilingCode:false
		active:false
		compileInfo:null
		runtimeModule:null
`.trim();
			//for (var i = 0; i < 100; i++)
			VDFLoader.ToVDFNode(vdf);
			ok(true);
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
	}
}