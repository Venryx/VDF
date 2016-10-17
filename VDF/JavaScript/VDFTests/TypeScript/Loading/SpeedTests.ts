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
`.trim();
			//for (var i = 0; i < 100; i++)
			VDFLoader.ToVDFNode(vdf);
			ok(true);
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
	}
}