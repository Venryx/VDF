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
`.trim();
			//for (var i = 0; i < 100; i++)
			VDFLoader.ToVDFNode(vdf);
			ok(true);
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
	}
}