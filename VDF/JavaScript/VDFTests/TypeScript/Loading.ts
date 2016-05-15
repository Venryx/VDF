/*class Loading
{
	static initialized = false;
	static Init()
	{
		if (this.initialized)
			return;
		this.initialized = true;
		Object.prototype._AddFunction_Inline = function Should()
		{
			return 0 || // fix for auto-semicolon-insertion
			{
				Be: (value, message?: string) => { equal(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); },
				BeExactly: (value, message?: string) => { strictEqual(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); }
			};
		};
	}

	static RunTests()
	{
		/*test("testName()
		{
			ok(null == null);
		});*#/
	}
}*/

// init
// ==========

var loading = {};
function Loading_RunTests()
{
	for (var name in loading)
		test_old(name, loading[name]);
}

window["test"] = function(name, func) { loading[name] = func; };

// tests
// ==========

module VDFTests // added to match C# indentation
{
	module Loading
	{
		// to VDFNode
		// ==========

		test("D0_Comment", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode(
"## comment\n\
'Root string.'");
			a.primitiveValue.Should().Be("Root string.");
		});
		test("D0_Comment2", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("'Root string ends here.'## comment");
			a.primitiveValue.Should().Be("Root string ends here.");
		});
		test("D0_Int", ()=>
		{
			var a = VDFLoader.ToVDFNode("1");
			a.primitiveValue.Should().Be(1);
		});
		test("D0_IntNegative", ()=>
		{
			var a = VDFLoader.ToVDFNode("-1");
			a.primitiveValue.Should().Be(-1);
		});
		test("D0_PowerNotation", ()=>
		{
			VDFLoader.ToVDFNode("1e3").primitiveValue.Should().Be(1000); //1 * Math.Pow(10, 3));
			VDFLoader.ToVDFNode("1e-3").primitiveValue.Should().Be(.001); //1 * Math.Pow(10, -3));
			VDFLoader.ToVDFNode("-1e3").primitiveValue.Should().Be(-1000); //-(1 * Math.Pow(10, 3)));
			VDFLoader.ToVDFNode("-1e-3").primitiveValue.Should().Be(-.001); //-(1 * Math.Pow(10, -3)));
		});
		test("D0_Infinity", ()=>
		{
			VDFLoader.ToVDFNode("Infinity").primitiveValue.Should().Be(Infinity);
			VDFLoader.ToVDFNode("-Infinity").primitiveValue.Should().Be(-Infinity);
		});
		test("D0_String", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("'Root string.'");
			a.primitiveValue.Should().Be("Root string.");
		});
		test("D0_StringWithSaveThenLoad", ()=>
		{
			var vdf = VDF.Serialize("Root string.");
			vdf.Should().Be("\"Root string.\"");
			var a = VDFLoader.ToVDFNode(vdf);
			a.primitiveValue.Should().Be("Root string.");
		});
		test("D0_StringAsNull", ()=>
		{
			var a = VDF.Deserialize("null", "string");
			ok(a == null);
		});
		test("D0_BaseValue_Literal", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("'<<\tBase-value string that {needs escaping}.>>'");
			a.primitiveValue.Should().Be("\tBase-value string that {needs escaping}.");
		});
		test("D0_Metadata_Type", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("string>'Root string.'");
			a.metadata.Should().Be("string");
		});
		test("D0_List", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("['Root string 1.' 'Root string 2.']", "List(object)");
			a[0].primitiveValue.Should().Be("Root string 1.");
			a[1].primitiveValue.Should().Be("Root string 2.");
		});
		/*test("D0_List_ExplicitStartAndEndMarkers", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode<List<object>>("{Root string 1.}|{Root string 2.}");
			a[0].primitiveValue.Should().Be("Root string 1.");
			a[1].primitiveValue.Should().Be("Root string 2.");
		});*/
		test("D0_List_Objects", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("[{name:'Dan' age:50} {name:'Bob' age:60}]", "List(object)");
			a[0]["name"].primitiveValue.Should().Be("Dan");
			a[0]["age"].primitiveValue.Should().Be(50);
			a[1]["name"].primitiveValue.Should().Be("Bob");
			a[1]["age"].primitiveValue.Should().Be(60);
		});
		test("D0_List_Literals", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode(
"['first' '<<second\n\
which is on two lines>>' '<<third\n\
which is on\n\
three lines>>']", "List(string)");
			a[0].primitiveValue.Should().Be("first");
			a[1].primitiveValue.Should().Be(
"second\n\
which is on two lines".Fix());
			a[2].primitiveValue.Should().Be(
"third\n\
which is on\n\
three lines".Fix());
		});
		/*test("D0_EmptyList", ()=> // for now at least, it's against the rules to have items without a char of their own
		{
			var a: VDFNode = VDFLoader.ToVDFNode("|", "List(object)");
			//a.mapChildren.Count.Should().Be(0);
			a[0].primitiveValue.Should().Be(null);
			a[1].primitiveValue.Should().Be(null);
		});*/
		test("D0_EmptyList", ()=> { (<List<object>>VDF.Deserialize("[]")).Count.Should().Be(0); });
		test("D0_ListMetadata", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("List(int)>[1 2]");
			a.metadata.Should().Be("List(int)");
			ok(a[0].metadata == null); //a[0].metadata.Should().Be(null);
			ok(a[1].metadata == null); //a[1].metadata.Should().Be(null);
		});
		test("D0_ListMetadata2", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("List(object)>[string>\"1\" string>\"2\"]");
			a.metadata.Should().Be("List(object)");
			a[0].metadata.Should().Be("string");
			a[1].metadata.Should().Be("string");
		});
		test("D0_EmptyMap", ()=> { (<Dictionary<object, object>>VDF.Deserialize("{}")).Count.Should().Be(0); });
		test("D0_Map_ChildMetadata", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("Dictionary(object object)>{a:string>\"1\" b:string>\"2\"}");
			a.metadata.Should().Be("Dictionary(object object)");
			a["a"].metadata.Should().Be("string");
			a["b"].metadata.Should().Be("string");
		});
		test("D0_MultilineString", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode(
"'<<This is a\n\
multiline string\n\
of three lines in total.>>'");
			a.primitiveValue.Should().Be(
"This is a\n\
multiline string\n\
of three lines in total.".Fix());
		});

		test("D1_Map_Children", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{key1:'Simple string.' key2:'false' key3:{name:'Dan' age:50}}");
			a["key1"].primitiveValue.Should().Be("Simple string.");
			a["key2"].primitiveValue.Should().Be("false");
			a["key3"]["age"].primitiveValue.Should().Be(50);
		});
		test("D1_Map_ChildrenThatAreRetrievedByKey", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{key 1:'value 1' key 2:'value 2'}");
			a["key 1"].primitiveValue.Should().Be("value 1");
			a["key 2"].primitiveValue.Should().Be("value 2");
		});
		test("D1_List_StringThatKeepsStringTypeFromVDFEvenWithObjectTypeFromCode", ()=>
		{
			var a = VDF.Deserialize("['SimpleString']", "List(object)");
			a[0].Should().Be("SimpleString");
		});
		test("D1_BaseValuesWithImplicitCasting", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{bool:false int:5 double:.5 string:'Prop value string.'}");
			a["bool"].primitiveValue.Should().Be(false);
			a["int"].primitiveValue.Should().Be(5);
			a["double"].primitiveValue.Should().Be(.5);
			a["string"].primitiveValue.Should().Be("Prop value string.");

			// uses implicit casting
			/*Assert.True(a["bool"] == false);
			Assert.True(a["int"] == 5);
			Assert.True(a["double"] == .5);
			Assert.True(a["string"] == "Prop value string.");*/
		});
		test("D1_BaseValuesWithMarkedTypes", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{bool:bool>false int:int>5 double:double>.5 string:string>'Prop value string.'}");
			a["bool"].primitiveValue.Should().Be(false);
			a["int"].primitiveValue.Should().Be(5);
			a["double"].primitiveValue.Should().Be(.5);
			a["string"].primitiveValue.Should().Be("Prop value string.");
		});
		test("D1_Literal", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{string:'<<<Prop value string that <<needs escaping>>.>>>'}");
			a["string"].primitiveValue.Should().Be("Prop value string that <<needs escaping>>.");
		});
		test("D1_TroublesomeLiteral1", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{string:'<<<#<<Prop value string that <<needs escaping>>.>>#>>>'}");
			a["string"].primitiveValue.Should().Be("<<Prop value string that <<needs escaping>>.>>");
		});
		test("D1_TroublesomeLiteral2", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{string:'<<<##Prop value string that <<needs escaping>>.##>>>'}");
			a["string"].primitiveValue.Should().Be("#Prop value string that <<needs escaping>>.#");
		});
		test("D1_VDFWithVDFWithVDF", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{level1:'<<<{level2:'<<{level3:'Base string.'}>>'}>>>'}");
			a["level1"].primitiveValue.Should().Be("{level2:'<<{level3:'Base string.'}>>'}");
			VDFLoader.ToVDFNode(a["level1"].primitiveValue)["level2"].primitiveValue.Should().Be("{level3:'Base string.'}");
			VDFLoader.ToVDFNode(VDFLoader.ToVDFNode(a["level1"].primitiveValue)["level2"].primitiveValue)["level3"].primitiveValue.Should().Be("Base string.");
		});
		test("D1_ArraysInArrays", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("[['1A' '1B'] ['2A' '2B'] '3A']");
			a[0][0].primitiveValue.Should().Be("1A");
			a[0][1].primitiveValue.Should().Be("1B");
			a[1][0].primitiveValue.Should().Be("2A");
			a[1][1].primitiveValue.Should().Be("2B");
			a[2].primitiveValue.Should().Be("3A");
		});
		test("D1_ArraysInArrays_SecondsNullAndEmpty", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("[['1A' null] ['2A' '']]");
			a[0][0].primitiveValue.Should().Be("1A");
			ok(a[0][1].primitiveValue == null); //a[0][1].primitiveValue.Should().Be(null);
			a[1][0].primitiveValue.Should().Be("2A");
			a[1][1].primitiveValue.Should().Be("");
		});
		test("D1_StringAndArraysInArrays", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("['text' ['2A' null]]");
			a[0].primitiveValue.Should().Be("text");
			a[1][0].primitiveValue.Should().Be("2A");
			ok(a[1][1].primitiveValue == null); //a[1][1].primitiveValue.Should().Be(null);
		});
		test("D1_Dictionary", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{key1:'value1' key2:'value2' 'key3':'value3' \"key4\":\"value4\"}");
			a["key1"].primitiveValue.Should().Be("value1");
			a["key2"].primitiveValue.Should().Be("value2");
			a["key3"].primitiveValue.Should().Be("value3");
			a["key4"].primitiveValue.Should().Be("value4");
		});
		test("D1_Map_KeyWithHash", ()=>
		{
			var a = VDFLoader.ToVDFNode("{#:'value1'}");
			a["#"].primitiveValue.Should().Be("value1");
		});
		test("D1_Map_MixedTypeKeysWithMetadata", ()=>
		{
			var a = VDFLoader.ToVDFNode("{int>1:'value1' int>\"2\":'value2' 'key3':'value3' \"key4\":\"value4\"}");
			var pairs = a.mapChildren.Pairs;
			a["1"].primitiveValue.Should().Be("value1");
			a["2"].primitiveValue.Should().Be("value2");
			a["key3"].primitiveValue.Should().Be("value3");
			a["key4"].primitiveValue.Should().Be("value4");
			var b = a.ToObject();
			ok(b instanceof Dictionary && b.keyType == "object" && b.valueType == "object");
			var bMap = b;
			bMap.Get(1).Should().Be("value1");
			bMap.Get(2).Should().Be("value2");
			bMap.Get("key3").Should().Be("value3");
			bMap.Get("key4").Should().Be("value4");
		});
		test("D1_Dictionary_Complex", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{uiPrefs:{toolOptions:'<<{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}>>' liveTool:'Select'}}");
			a["uiPrefs"]["toolOptions"].primitiveValue.Should().Be("{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}");
			a["uiPrefs"]["liveTool"].primitiveValue.Should().Be("Select");
		});
		test("D1_Dictionary_TypesInferredFromGenerics", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{vertexColors:Dictionary(string Color)>{9,4,2.5:'Black' 1,8,9.5435:'Gray' 25,15,5:'White'}}");
			a["vertexColors"]["9,4,2.5"].primitiveValue.Should().Be("Black");
			a["vertexColors"]["1,8,9.5435"].primitiveValue.Should().Be("Gray");
			a["vertexColors"]["25,15,5"].primitiveValue.Should().Be("White");
		});

		test("D1_ArrayPoppedOut_NoItems", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode("{names:[^]}");
			a["names"].listChildren.Count.Should().Be(0);
			a["names"].mapChildren.Count.Should().Be(0);
		});
		test("D1_ArrayPoppedOut", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode(
"{names:[^]}\n\
	'Dan'\n\
	'Bob'");
			a["names"][0].primitiveValue.Should().Be("Dan");
			a["names"][1].primitiveValue.Should().Be("Bob");
		});
		test("D1_ArraysPoppedOut", ()=> // each 'group' is actually just the value-data of one of the parent's properties
		{
			var a: VDFNode = VDFLoader.ToVDFNode(
"{names:[^] ages:[^]}\n\
	'Dan'\n\
	'Bob'\n\
	^10\n\
	20");
			a["names"][0].primitiveValue.Should().Be("Dan");
			a["names"][1].primitiveValue.Should().Be("Bob");
			a["ages"][0].primitiveValue.Should().Be(10);
			a["ages"][1].primitiveValue.Should().Be(20);
		});
		test("D1_InferredDictionaryPoppedOut", ()=>
		{
			var a: VDFNode = VDFLoader.ToVDFNode(
"{messages:{^} otherProperty:false}\n\
	title1:'message1'\n\
	title2:'message2'");
			a["messages"].mapChildren.Count.Should().Be(2);
			a["messages"]["title1"].primitiveValue.Should().Be("message1");
			a["messages"]["title2"].primitiveValue.Should().Be("message2");
			a["otherProperty"].primitiveValue.Should().Be(false);
		});
		test("D1_Map_PoppedOutMap", ()=>
		{
/*
Written as:

{messages:{^} otherProperty:false}
	title1:"message1"
	title2:"message2"

Parsed as:

{messages:{
	title1:"message1"
	title2:"message2"
} otherProperty:false}
 */
			var a: VDFNode = VDFLoader.ToVDFNode(
"{messages:{^} otherProperty:false}\n\
	title1:'message1'\n\
	title2:'message2'");
			a["messages"].mapChildren.Count.Should().Be(2);
			a["messages"]["title1"].primitiveValue.Should().Be("message1");
			a["messages"]["title2"].primitiveValue.Should().Be("message2");
			a["otherProperty"].primitiveValue.Should().Be(false);
		});

		test("D1_Object_MultilineStringThenProperty", ()=>
		{
			var a = VDFLoader.ToVDFNode(
"{text:'<<This is a\n\
multiline string\n\
of three lines in total.>>' bool:true}");
			a["text"].primitiveValue.Should().Be(
"This is a\n\
multiline string\n\
of three lines in total.".Fix());
			a["bool"].primitiveValue.Should().Be(true);
		});
		test("D1_Object_PoppedOutStringsThenMultilineString", ()=>
		{
			var a = VDFLoader.ToVDFNode(
"{childTexts:[^] text:'<<This is a\n\
multiline string\n\
of three lines in total.>>'}\n\
	'text1'\n\
	'text2'");
			a["childTexts"][0].primitiveValue.Should().Be("text1");
			a["childTexts"][1].primitiveValue.Should().Be("text2");
			a["text"].primitiveValue.Should().Be(
"This is a\n\
multiline string\n\
of three lines in total.".Fix());
		});

		test("D2_List_Lists_PoppedOutObjects", ()=>
		{
			var a = VDFLoader.ToVDFNode(
"[[^] [^] [^]]\n\
	{name:'Road'}\n\
	^{name:'RoadAndPath'}\n\
	^{name:'SimpleHill'}"); //, new VDFLoadOptions({inferStringTypeForUnknownTypes: true}));
			a.listChildren.Count.Should().Be(3);
		});
		test("D2_List_PoppedOutObjects_MultilineString", ()=>
		{
			var a = VDFLoader.ToVDFNode(
"[^]\n\
	{id:1 multilineText:'<<line1\n\
	line2\n\
	line3>>'}\n\
	{id:2 multilineText:'<<line1\n\
	line2>>'}");
			a.listChildren.Count.Should().Be(2);
		});

		test("D2_Object_PoppedOutObject_PoppedOutObject", ()=>
		{
			var a = VDFLoader.ToVDFNode(
"{name:'L0' children:[^]}\n\
	{name:'L1' children:[^]}\n\
		{name:'L2'}");
			a["children"].listChildren.Count.Should().Be(1);
			a["children"].listChildren[0]["children"].listChildren.Count.Should().Be(1);
		});

		test("D5_TokenTextPreservation", ()=>
		{
			var vdf1 = "{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^] tasksScriptText:'<<Shoot at Enemy Vehicle\n\
	Gun1 aim at EnemyVehicle_NonBroken\n\
	Gun1 fire>>'}\n\
	{id:'ba991aaf-447a-4a03-ade8-f4a11b4ea966' typeName:'Wood' name:'Body' pivotPoint_unit:'-0.1875,0.4375,-0.6875' anchorNormal:'0,1,0' scale:'0.5,0.25,1.5' controller:true}\n\
	{id:'743f64f2-8ece-4dd3-bdf5-bbb6378ffce5' typeName:'Wood' name:'FrontBar' pivotPoint_unit:'-0.4375,0.5625,0.8125' anchorNormal:'0,0,1' scale:'1,0.25,0.25' controller:false}".replace(/\r\n/g, "\n");
			var tokens = VDFTokenParser.ParseTokens(vdf1, null, true, false);

			// shift each within-string literal-end-marker token to after its containing-string's token
			for (var i = <any>0; i < tokens.Count; i++)
				if (tokens[i].type == VDFTokenType.LiteralEndMarker && tokens[i + 1].type == VDFTokenType.String)
				{
					var oldFirst = tokens[i];
					tokens[i] = tokens[i + 1];
					tokens[i + 1] = oldFirst;
					i++;
				}

			var vdf2 = "";
			for (var i in tokens.Indexes())
				vdf2 += tokens[i].text;
			vdf1.Should().Be(vdf2);
		});
		test("D5_DeepNestedPoppedOutData", ()=>
		{
			var vdf =
"{name:'Main' worlds:Dictionary(string object)>{Test1:{vObjectRoot:{name:'VObjectRoot' children:[^]}} Test2:{vObjectRoot:{name:'VObjectRoot' children:[^]}}}}\n\
	{id:System.Guid>'025f28a5-a14b-446d-b324-2d274a476a63' name:'#Types' children:[]}\n\
	^{id:System.Guid>'08e84f18-aecf-4b80-9c3f-ae0697d9033a' name:'#Types' children:[]}";
			var livePackNode = VDFLoader.ToVDFNode(vdf);
			livePackNode["worlds"]["Test1"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
			livePackNode["worlds"]["Test2"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
		});

		// to object
		// ==========

		test("D0_Null", ()=>
		{
			ok(VDF.Deserialize("null") == null);
			//VDF.Deserialize("null").Should().Be(null);
		});
		//test("D0_Nothing() { VDF.Deserialize("").Should().Be(null); });
		//test("D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); });
		test("D0_EmptyString", ()=> { VDF.Deserialize("''").Should().Be(""); });
		test("D0_Bool", ()=> { VDF.Deserialize("true", "bool").Should().Be(true); });
		test("D0_Double", ()=> { VDF.Deserialize("1.5").Should().Be(1.5); });
		//test("D0_Float", ()=> { VDF.Deserialize<float>("1.5").Should().Be(1.5f); });

		class TypeWithPreDeserializeMethod
		{
			flag = Prop(this, "flag", "bool", new P()).set = false;
			PreDeserialize(): void { this.flag = true; }
			constructor() { this.PreDeserialize.AddTags(new VDFPreDeserialize()); }
		}
		test("D1_PreDeserializeMethod", ()=>
		{
			var a = VDF.Deserialize("{}", "TypeWithPreDeserializeMethod");
			a.flag.Should().Be(true);
		});
		class TypeWithPostDeserializeMethod
		{
			flag = Prop(this, "flag", "bool", new P()).set = false;
			PostDeserialize(): void { this.flag = true; }
			constructor() { this.PostDeserialize.AddTags(new VDFPostDeserialize()); }
		}
		test("D1_PostDeserializeMethod", ()=>
		{
			var a = VDF.Deserialize("{}", "TypeWithPostDeserializeMethod");
			a.flag.Should().Be(true);
		});
		class ObjectWithPostDeserializeMethodRequiringCustomMessage_Class
		{
			flag = Prop(this, "flag", "bool", new P()).set = false;
			PostDeserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions): void { if (<string>options.messages[0] == "RequiredMessage") this.flag = true; }
			constructor() { this.PostDeserialize.AddTags(new VDFPostDeserialize()); }
		}
		test("D0_ObjectWithPostDeserializeMethodRequiringCustomMessage", ()=> { VDF.Deserialize("{}", "ObjectWithPostDeserializeMethodRequiringCustomMessage_Class", new VDFLoadOptions(null, ["WrongMessage"])).flag.Should().Be(false); });
		/*class ObjectWithPostDeserializeConstructor_Class
		{
			static typeInfo = new VDFTypeInfo(
			{
				flag: new PInfo("bool")
			});
			flag = false;
			ObjectWithPostDeserializeConstructor_Class() { flag = true; }
		}
		test("D1_ObjectWithPostDeserializeConstructor", ()=> { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); });*/
		class ObjectWithPostDeserializeOptionsFunc_Class_Parent { child: ObjectWithPostDeserializeOptionsFunc_Class_Child = Prop(this, "child", "ObjectWithPostDeserializeOptionsFunc_Class_Child").set = null; }
        class ObjectWithPostDeserializeOptionsFunc_Class_Child
		{
			static flag = false;
			static Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions)
			{
				options.AddObjPostDeserializeFunc(path.rootNode.obj, () =>ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = true);
				return null;
			}
		}
		ObjectWithPostDeserializeOptionsFunc_Class_Child.Deserialize.AddTags(new VDFDeserialize(true));
		test("D1_ObjectWithPostDeserializeOptionsFunc", ()=>
		{
			var options = new VDFLoadOptions();
			ok(VDF.Deserialize("{child:{}}", "ObjectWithPostDeserializeOptionsFunc_Class_Parent", options).child == null);
			ObjectWithPostDeserializeOptionsFunc_Class_Child.flag.Should().Be(true);
		});

		class TypeInstantiatedManuallyThenFilled
		{
			flag = Prop(this, "flag", "bool", new P()).set = false;
		}
		test("D1_InstantiateTypeManuallyThenFill", ()=>
		{
			var a = new TypeInstantiatedManuallyThenFilled();
			VDF.DeserializeInto("{flag:true}", a);
			a.flag.Should().Be(true);
		});
		class D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1
		{
			_helper = Type(new VDFType(null, true)).set = this;
			messages = Prop(this, "messages", "Dictionary(string string)", new P()).set = new Dictionary<string, string>("string", "string",
			{
				title1: "message1",
				title2: "message2"
			});
			otherProperty = Prop(this, "otherProperty", "bool", new P()).set = false;
		}
		test("D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", ()=>
		{
			var a = VDF.Deserialize(
"{^}\n\
	messages:{^}\n\
		title1:'message1'\n\
		title2:'message2'\n\
	otherProperty:true", "D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1");
			a.messages.Count.Should().Be(2);
			a.messages["title1"].Should().Be("message1");
			a.messages["title2"].Should().Be("message2");
			a.otherProperty.Should().Be(true);
		});

		// deserialize-related methods
		// ==========

		class D1_MapWithEmbeddedDeserializeMethod_Prop_Class
		{
			boolProp = Prop(this, "boolProp", "bool", new P()).set = false;
			Deserialize(node: VDFNode): void { this.boolProp = node["boolProp"].primitiveValue; }
			constructor() { this.Deserialize.AddTags(new VDFDeserialize()); }
		}
		test("D1_MapWithEmbeddedDeserializeMethod_Prop", ()=>{ VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethod_Prop_Class").boolProp.Should().Be(true); });

		class D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class
		{
			boolProp = Prop(this, "boolProp", "bool", new P()).set = false;
			Deserialize(node: VDFNode) { return VDF.NoActionTaken; }
			constructor() { this.Deserialize.AddTags(new VDFDeserialize()); }
		}
		test("D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop", ()=>{ VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class").boolProp.Should().Be(true); });

		class D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent
		{
			child: D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child = Prop(this, "child", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child", new P()).set = null;
		}
		class D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child
		{
			static Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions): D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child { return null; }
		}
		D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize.AddTags(new VDFDeserialize(true));
		test("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop", ()=>{ ok(VDF.Deserialize("{child:{}}", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent").child == null); });

		class D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent
		{
			child: D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child = Prop(this, "child", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child", new P()).set = null;
		}
		class D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child
		{
			boolProp = Prop(this, "boolProp", "bool", new P()).set = false;
			static Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions) { return VDF.NoActionTaken; }
			constructor() { D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize.AddTags(new VDFDeserialize(true)); }
		}
		test("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop", ()=>{ VDF.Deserialize("{child:{boolProp: true}}", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent").child.boolProp.Should().Be(true); });

		class D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent
		{
			withoutTag: D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child = Prop(this, "withoutTag", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child", new P()).set = null;
			withTag: D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child = Prop(this, "withTag", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child", new P()).set = null; // doesn't actually have tag; just pretend it does
		}
		class D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child
		{
			methodCalled = Prop(this, "methodCalled", "bool", new P()).set = false;
			Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions): void
			{
				ok(path.parentNode.obj instanceof D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent);
				if (path.currentNode.prop.name == "withTag")
					this.methodCalled = true;
			}
			constructor() { this.Deserialize.AddTags(new VDFDeserialize()); }
		}
		test("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag", ()=>
		{
			var a = VDF.Deserialize("{withoutTag:{} withTag:{}}", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent");
			a.withoutTag.methodCalled.Should().Be(false);
			a.withTag.methodCalled.Should().Be(true);
		});

		// for JSON compatibility
		// ==========

		test("D1_Map_IntsWithStringKeys", ()=>
		{
			var a = VDFLoader.ToVDFNode("{\"key1\":0 \"key2\":1}", new VDFLoadOptions({allowStringKeys: true}));
			a.mapChildren.Count.Should().Be(2);
			a["key1"].primitiveValue.Should().Be(0);
		});
		test("D1_List_IntsWithCommaSeparators", ()=>
		{
			var a = VDFLoader.ToVDFNode("[0,1]", new VDFLoadOptions({allowCommaSeparators: true}));
			a.listChildren.Count.Should().Be(2);
			a[0].primitiveValue.Should().Be(0);
		});
		test("D3_List_NumbersWithScientificNotation", ()=>
		{
			var a = VDFLoader.ToVDFNode("[-7.45058e-09,0.1,-1.49012e-08]", new VDFLoadOptions().ForJSON());
			a[0].primitiveValue.Should().Be(-7.45058e-09);
		});

		// unique to JavaScript version
		// ==========

		class PretendGenericType {}
		test("Depth0_ObjectWithMetadataHavingGenericType", ()=>ok(VDF.Deserialize("PretendGenericType(object)>{}") instanceof PretendGenericType));

		test("Depth1_UnknownTypeWithFixOn_String", ()=>
		{
			var a = VDF.Deserialize("UnknownType>{string:'Prop value string.'}", new VDFLoadOptions({loadUnknownTypesAsBasicTypes: true}));
			a["string"].Should().Be("Prop value string.");
		});
		test("Depth1_UnknownTypeWithFixOff_String", ()=>
		{
			try { VDF.Deserialize("UnknownType>{string:'Prop value string.'}"); }
			catch(ex) { ok(ex.message == "Could not find type \"UnknownType\"."); }
		});
		test("Depth1_Object_UnknownTypeWithFixOn", ()=>
		{
			var a = VDF.Deserialize("{string:UnkownBaseType>'Prop value string.'}", new VDFLoadOptions({loadUnknownTypesAsBasicTypes: true}));
			a["string"].Should().Be("Prop value string.");
		});
		test("AsObject", ()=>
		{
			var a = <any>VDF.Deserialize("{bool:bool>false double:double>3.5}", "object");
			a.bool.Should().Be(false);
			a.double.Should().Be(3.5);
		});

		class AsObjectOfType_Class {}
		test("AsObjectOfType", ()=>
		{
			var a = <any>VDF.Deserialize("AsObjectOfType_Class>{}", "AsObjectOfType_Class");
			ok(a instanceof AsObjectOfType_Class);
		});

		// export all classes/enums to global scope
		var arguments;
		var names = V.GetMatches(arguments.callee.toString(), /        var (\w+) = \(function \(\) {/g, 1);
		for (var i = 0; i < names.length; i++)
			try { window[names[i]] = eval(names[i]); } catch(e) {}
		var enumNames = V.GetMatches(arguments.callee.toString(), /        }\)\((\w+) \|\| \(\w+ = {}\)\);/g, 1);
		for (var i = 0; i < enumNames.length; i++)
			try { window[enumNames[i]] = eval(enumNames[i]); } catch(e) {}
	}

	module Loading_SpeedTests
	{
		test("D5_SpeedTester", ()=>
		{
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
		test("D5_SpeedTester2", ()=>
		{
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
	}
}