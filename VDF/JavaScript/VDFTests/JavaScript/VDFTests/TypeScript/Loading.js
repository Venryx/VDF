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
function Loading_RunTests() {
    for (var name in loading)
        test_old(name, loading[name]);
}

window["test"] = function (name, func) {
    loading[name] = func;
};

// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Loading;
    (function (Loading) {
        // to VDFNode
        // ==========
        test("D0_Comment", function () {
            var a = VDFLoader.ToVDFNode("## comment\n\
'Root string.'");
            a.primitiveValue.Should().Be("Root string.");
        });
        test("D0_Comment2", function () {
            var a = VDFLoader.ToVDFNode("'Root string ends here.'## comment");
            a.primitiveValue.Should().Be("Root string ends here.");
        });
        test("D0_Int", function () {
            var a = VDFLoader.ToVDFNode("1");
            a.primitiveValue.Should().Be(1);
        });
        test("D0_IntNegative", function () {
            var a = VDFLoader.ToVDFNode("-1");
            a.primitiveValue.Should().Be(-1);
        });
        test("D0_String", function () {
            var a = VDFLoader.ToVDFNode("'Root string.'");
            a.primitiveValue.Should().Be("Root string.");
        });
        test("D0_StringWithSaveThenLoad", function () {
            var vdf = VDF.Serialize("Root string.");
            vdf.Should().Be("\"Root string.\"");
            var a = VDFLoader.ToVDFNode(vdf);
            a.primitiveValue.Should().Be("Root string.");
        });
        test("D0_StringAsNull", function () {
            var a = VDF.Deserialize("null", "string");
            ok(a == null);
        });
        test("D0_BaseValue_Literal", function () {
            var a = VDFLoader.ToVDFNode("'<<\tBase-value string that {needs escaping}.>>'");
            a.primitiveValue.Should().Be("\tBase-value string that {needs escaping}.");
        });
        test("D0_Metadata_Type", function () {
            var a = VDFLoader.ToVDFNode("string>'Root string.'");
            a.metadata.Should().Be("string");
        });
        test("D0_List", function () {
            var a = VDFLoader.ToVDFNode("['Root string 1.' 'Root string 2.']", "List(object)");
            a[0].primitiveValue.Should().Be("Root string 1.");
            a[1].primitiveValue.Should().Be("Root string 2.");
        });

        /*test("D0_List_ExplicitStartAndEndMarkers", ()=>
        {
        var a: VDFNode = VDFLoader.ToVDFNode<List<object>>("{Root string 1.}|{Root string 2.}");
        a[0].primitiveValue.Should().Be("Root string 1.");
        a[1].primitiveValue.Should().Be("Root string 2.");
        });*/
        test("D0_List_Objects", function () {
            var a = VDFLoader.ToVDFNode("[{name:'Dan' age:50} {name:'Bob' age:60}]", "List(object)");
            a[0]["name"].primitiveValue.Should().Be("Dan");
            a[0]["age"].primitiveValue.Should().Be(50);
            a[1]["name"].primitiveValue.Should().Be("Bob");
            a[1]["age"].primitiveValue.Should().Be(60);
        });
        test("D0_List_Literals", function () {
            var a = VDFLoader.ToVDFNode("['first' '<<second\n\
which is on two lines>>' '<<third\n\
which is on\n\
three lines>>']", "List(string)");
            a[0].primitiveValue.Should().Be("first");
            a[1].primitiveValue.Should().Be("second\n\
which is on two lines".Fix());
            a[2].primitiveValue.Should().Be("third\n\
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
        test("D0_EmptyList", function () {
            VDF.Deserialize("[]").Count.Should().Be(0);
        });
        test("D0_ListMetadata", function () {
            var a = VDFLoader.ToVDFNode("List(int)>[1 2]");
            a.metadata.Should().Be("List(int)");
            ok(a[0].metadata == null); //a[0].metadata.Should().Be(null);
            ok(a[1].metadata == null); //a[1].metadata.Should().Be(null);
        });
        test("D0_ListMetadata2", function () {
            var a = VDFLoader.ToVDFNode("List(object)>[string>\"1\" string>\"2\"]");
            a.metadata.Should().Be("List(object)");
            a[0].metadata.Should().Be("string");
            a[1].metadata.Should().Be("string");
        });
        test("D0_EmptyMap", function () {
            VDF.Deserialize("{}").Count.Should().Be(0);
        });
        test("D0_Map_ChildMetadata", function () {
            var a = VDFLoader.ToVDFNode("Dictionary(object object)>[a:string>\"1\" b:string>\"2\"]");
            a.metadata.Should().Be("Dictionary(object object)");
            a["a"].metadata.Should().Be("string");
            a["b"].metadata.Should().Be("string");
        });
        test("D0_MultilineString", function () {
            var a = VDFLoader.ToVDFNode("'<<This is a\n\
multiline string\n\
of three lines in total.>>'");
            a.primitiveValue.Should().Be("This is a\n\
multiline string\n\
of three lines in total.".Fix());
        });

        test("D1_Map_Children", function () {
            var a = VDFLoader.ToVDFNode("{key1:'Simple string.' key2:{name:'Dan' age:50}}");
            a["key1"].primitiveValue.Should().Be("Simple string.");
            a["key2"]["age"].primitiveValue.Should().Be(50);
        });
        test("D1_Map_ChildrenThatAreRetrievedByKey", function () {
            var a = VDFLoader.ToVDFNode("{key 1:'value 1' key 2:'value 2'}");
            a["key 1"].primitiveValue.Should().Be("value 1");
            a["key 2"].primitiveValue.Should().Be("value 2");
        });
        test("D1_List_StringThatKeepsStringTypeFromVDFEvenWithObjectTypeFromCode", function () {
            var a = VDF.Deserialize("['SimpleString']", "List(object)");
            a[0].Should().Be("SimpleString");
        });
        test("D1_BaseValuesWithImplicitCasting", function () {
            var a = VDFLoader.ToVDFNode("{bool:false int:5 double:.5 string:'Prop value string.'}");
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
        test("D1_BaseValuesWithMarkedTypes", function () {
            var a = VDFLoader.ToVDFNode("{bool:bool>false int:int>5 double:double>.5 string:string>'Prop value string.'}");
            a["bool"].primitiveValue.Should().Be(false);
            a["int"].primitiveValue.Should().Be(5);
            a["double"].primitiveValue.Should().Be(.5);
            a["string"].primitiveValue.Should().Be("Prop value string.");
        });
        test("D1_Literal", function () {
            var a = VDFLoader.ToVDFNode("{string:'<<<Prop value string that <<needs escaping>>.>>>'}");
            a["string"].primitiveValue.Should().Be("Prop value string that <<needs escaping>>.");
        });
        test("D1_TroublesomeLiteral1", function () {
            var a = VDFLoader.ToVDFNode("{string:'<<<#<<Prop value string that <<needs escaping>>.>>#>>>'}");
            a["string"].primitiveValue.Should().Be("<<Prop value string that <<needs escaping>>.>>");
        });
        test("D1_TroublesomeLiteral2", function () {
            var a = VDFLoader.ToVDFNode("{string:'<<<##Prop value string that <<needs escaping>>.##>>>'}");
            a["string"].primitiveValue.Should().Be("#Prop value string that <<needs escaping>>.#");
        });
        test("D1_VDFWithVDFWithVDF", function () {
            var a = VDFLoader.ToVDFNode("{level1:'<<<{level2:'<<{level3:'Base string.'}>>'}>>>'}");
            a["level1"].primitiveValue.Should().Be("{level2:'<<{level3:'Base string.'}>>'}");
            VDFLoader.ToVDFNode(a["level1"].primitiveValue)["level2"].primitiveValue.Should().Be("{level3:'Base string.'}");
            VDFLoader.ToVDFNode(VDFLoader.ToVDFNode(a["level1"].primitiveValue)["level2"].primitiveValue)["level3"].primitiveValue.Should().Be("Base string.");
        });
        test("D1_ArraysInArrays", function () {
            var a = VDFLoader.ToVDFNode("[['1A' '1B'] ['2A' '2B'] '3A']");
            a[0][0].primitiveValue.Should().Be("1A");
            a[0][1].primitiveValue.Should().Be("1B");
            a[1][0].primitiveValue.Should().Be("2A");
            a[1][1].primitiveValue.Should().Be("2B");
            a[2].primitiveValue.Should().Be("3A");
        });
        test("D1_ArraysInArrays_SecondsNullAndEmpty", function () {
            var a = VDFLoader.ToVDFNode("[['1A' null] ['2A' '']]");
            a[0][0].primitiveValue.Should().Be("1A");
            ok(a[0][1].primitiveValue == null); //a[0][1].primitiveValue.Should().Be(null);
            a[1][0].primitiveValue.Should().Be("2A");
            a[1][1].primitiveValue.Should().Be("");
        });
        test("D1_StringAndArraysInArrays", function () {
            var a = VDFLoader.ToVDFNode("['text' ['2A' null]]");
            a[0].primitiveValue.Should().Be("text");
            a[1][0].primitiveValue.Should().Be("2A");
            ok(a[1][1].primitiveValue == null); //a[1][1].primitiveValue.Should().Be(null);
        });
        test("D1_Dictionary", function () {
            var a = VDFLoader.ToVDFNode("{key1:'value1' key2:'value2'}");
            a["key1"].primitiveValue.Should().Be("value1");
            a["key2"].primitiveValue.Should().Be("value2");
        });
        test("D1_Dictionary_Complex", function () {
            var a = VDFLoader.ToVDFNode("{uiPrefs:{toolOptions:'<<{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}>>' liveTool:'Select'}}");
            a["uiPrefs"]["toolOptions"].primitiveValue.Should().Be("{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}");
            a["uiPrefs"]["liveTool"].primitiveValue.Should().Be("Select");
        });
        test("D1_Dictionary_TypesInferredFromGenerics", function () {
            var a = VDFLoader.ToVDFNode("{vertexColors:Dictionary(string Color)>{9,4,2.5:'Black' 1,8,9.5435:'Gray' 25,15,5:'White'}}");
            a["vertexColors"]["9,4,2.5"].primitiveValue.Should().Be("Black");
            a["vertexColors"]["1,8,9.5435"].primitiveValue.Should().Be("Gray");
            a["vertexColors"]["25,15,5"].primitiveValue.Should().Be("White");
        });

        test("D1_ArrayPoppedOut_NoItems", function () {
            var a = VDFLoader.ToVDFNode("{names:[^]}");
            a["names"].listChildren.Count.Should().Be(0);
            a["names"].mapChildren.Count.Should().Be(0);
        });
        test("D1_ArrayPoppedOut", function () {
            var a = VDFLoader.ToVDFNode("{names:[^]}\n\
	'Dan'\n\
	'Bob'");
            a["names"][0].primitiveValue.Should().Be("Dan");
            a["names"][1].primitiveValue.Should().Be("Bob");
        });
        test("D1_ArraysPoppedOut", function () {
            var a = VDFLoader.ToVDFNode("{names:[^] ages:[^]}\n\
	'Dan'\n\
	'Bob'\n\
	^10\n\
	20");
            a["names"][0].primitiveValue.Should().Be("Dan");
            a["names"][1].primitiveValue.Should().Be("Bob");
            a["ages"][0].primitiveValue.Should().Be(10);
            a["ages"][1].primitiveValue.Should().Be(20);
        });
        test("D1_InferredDictionaryPoppedOut", function () {
            var a = VDFLoader.ToVDFNode("{messages:{^} otherProperty:false}\n\
	title1:'message1'\n\
	title2:'message2'");
            a["messages"].mapChildren.Count.Should().Be(2);
            a["messages"]["title1"].primitiveValue.Should().Be("message1");
            a["messages"]["title2"].primitiveValue.Should().Be("message2");
            a["otherProperty"].primitiveValue.Should().Be(false);
        });
        test("D1_Map_PoppedOutMap", function () {
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
            var a = VDFLoader.ToVDFNode("{messages:{^} otherProperty:false}\n\
	title1:'message1'\n\
	title2:'message2'");
            a["messages"].mapChildren.Count.Should().Be(2);
            a["messages"]["title1"].primitiveValue.Should().Be("message1");
            a["messages"]["title2"].primitiveValue.Should().Be("message2");
            a["otherProperty"].primitiveValue.Should().Be(false);
        });

        test("D1_Object_MultilineStringThenProperty", function () {
            var a = VDFLoader.ToVDFNode("{text:'<<This is a\n\
multiline string\n\
of three lines in total.>>' bool:true}");
            a["text"].primitiveValue.Should().Be("This is a\n\
multiline string\n\
of three lines in total.".Fix());
            a["bool"].primitiveValue.Should().Be(true);
        });
        test("D1_Object_PoppedOutStringsThenMultilineString", function () {
            var a = VDFLoader.ToVDFNode("{childTexts:[^] text:'<<This is a\n\
multiline string\n\
of three lines in total.>>'}\n\
	'text1'\n\
	'text2'");
            a["childTexts"][0].primitiveValue.Should().Be("text1");
            a["childTexts"][1].primitiveValue.Should().Be("text2");
            a["text"].primitiveValue.Should().Be("This is a\n\
multiline string\n\
of three lines in total.".Fix());
        });
        test("D2_List_Lists_PoppedOutObjects", function () {
            var a = VDFLoader.ToVDFNode("[[^] [^] [^]]\n\
	{name:'Road'}\n\
	^{name:'RoadAndPath'}\n\
	^{name:'SimpleHill'}");
            a.listChildren.Count.Should().Be(3);
        });
        test("D2_List_PoppedOutObjects_MultilineString", function () {
            var a = VDFLoader.ToVDFNode("[^]\n\
	{id:1 multilineText:'<<line1\n\
	line2\n\
	line3>>'}\n\
	{id:2 multilineText:'<<line1\n\
	line2>>'}");
            a.listChildren.Count.Should().Be(2);
        });

        test("D2_Object_PoppedOutObject_PoppedOutObject", function () {
            var a = VDFLoader.ToVDFNode("{name:'L0' children:[^]}\n\
	{name:'L1' children:[^]}\n\
		{name:'L2'}");
            a["children"].listChildren.Count.Should().Be(1);
            a["children"].listChildren[0]["children"].listChildren.Count.Should().Be(1);
        });

        test("D5_TokenTextPreservation", function () {
            var vdf1 = "{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^] tasksScriptText:'<<Shoot at Enemy Vehicle\n\
	Gun1 aim at EnemyVehicle_NonBroken\n\
	Gun1 fire>>'}\n\
	{id:'ba991aaf-447a-4a03-ade8-f4a11b4ea966' typeName:'Wood' name:'Body' pivotPoint_unit:'-0.1875,0.4375,-0.6875' anchorNormal:'0,1,0' scale:'0.5,0.25,1.5' controller:true}\n\
	{id:'743f64f2-8ece-4dd3-bdf5-bbb6378ffce5' typeName:'Wood' name:'FrontBar' pivotPoint_unit:'-0.4375,0.5625,0.8125' anchorNormal:'0,0,1' scale:'1,0.25,0.25' controller:false}".replace(/\r\n/g, "\n");
            var tokens = VDFTokenParser.ParseTokens(vdf1, null, true, false);
            var vdf2 = "";
            for (var i in tokens.Indexes())
                vdf2 += tokens[i].text;
            vdf1.Should().Be(vdf2);
        });
        test("D5_DeepNestedPoppedOutData", function () {
            var vdf = "{name:'Main' worlds:Dictionary(string object)>{Test1:{vObjectRoot:{name:'VObjectRoot' children:[^]}} Test2:{vObjectRoot:{name:'VObjectRoot' children:[^]}}}}\n\
	{id:System.Guid>'025f28a5-a14b-446d-b324-2d274a476a63' name:'#Types' children:[]}\n\
	^{id:System.Guid>'08e84f18-aecf-4b80-9c3f-ae0697d9033a' name:'#Types' children:[]}";
            var livePackNode = VDFLoader.ToVDFNode(vdf);
            livePackNode["worlds"]["Test1"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
            livePackNode["worlds"]["Test2"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
        });
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

        // to object
        // ==========
        test("D0_Null", function () {
            ok(VDF.Deserialize("null") == null);
            //VDF.Deserialize("null").Should().Be(null);
        });

        //test("D0_Nothing() { VDF.Deserialize("").Should().Be(null); });
        //test("D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); });
        test("D0_EmptyString", function () {
            VDF.Deserialize("''").Should().Be("");
        });
        test("D0_Bool", function () {
            VDF.Deserialize("true", "bool").Should().Be(true);
        });
        test("D0_Double", function () {
            VDF.Deserialize("1.5").Should().Be(1.5);
        });

        //test("D0_Float", ()=> { VDF.Deserialize<float>("1.5").Should().Be(1.5f); });
        var TypeWithPreDeserializeMethod = (function () {
            function TypeWithPreDeserializeMethod() {
                this.flag = Prop(this, "flag", "bool", new VDFProp()).set = false;
            }
            TypeWithPreDeserializeMethod.prototype.VDFPreDeserialize = function () {
                this.flag = true;
            };
            return TypeWithPreDeserializeMethod;
        })();
        test("D1_PreDeserializeMethod", function () {
            var a = VDF.Deserialize("{}", "TypeWithPreDeserializeMethod");
            a.flag.Should().Be(true);
        });
        var TypeWithPostDeserializeMethod = (function () {
            function TypeWithPostDeserializeMethod() {
                this.flag = Prop(this, "flag", "bool", new VDFProp()).set = false;
            }
            TypeWithPostDeserializeMethod.prototype.VDFPostDeserialize = function () {
                this.flag = true;
            };
            return TypeWithPostDeserializeMethod;
        })();
        test("D1_PostDeserializeMethod", function () {
            var a = VDF.Deserialize("{}", "TypeWithPostDeserializeMethod");
            a.flag.Should().Be(true);
        });
        var ObjectWithPostDeserializeMethodRequiringCustomMessage_Class = (function () {
            function ObjectWithPostDeserializeMethodRequiringCustomMessage_Class() {
                this.flag = Prop(this, "flag", "bool", new VDFProp()).set = false;
            }
            ObjectWithPostDeserializeMethodRequiringCustomMessage_Class.prototype.VDFPostDeserialize = function (node, prop, options) {
                if (options.messages[0] == "RequiredMessage")
                    this.flag = true;
            };
            return ObjectWithPostDeserializeMethodRequiringCustomMessage_Class;
        })();
        test("D0_ObjectWithPostDeserializeMethodRequiringCustomMessage", function () {
            VDF.Deserialize("{}", "ObjectWithPostDeserializeMethodRequiringCustomMessage_Class", new VDFLoadOptions(null, ["WrongMessage"])).flag.Should().Be(false);
        });

        /*class ObjectWithPostDeserializeConstructor_Class
        {
        static typeInfo = new VDFTypeInfo(
        {
        flag: new VDFPropInfo("bool")
        });
        flag = false;
        ObjectWithPostDeserializeConstructor_Class() { flag = true; }
        }
        test("D1_ObjectWithPostDeserializeConstructor", ()=> { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); });*/
        var TypeInstantiatedManuallyThenFilled = (function () {
            function TypeInstantiatedManuallyThenFilled() {
                this.flag = Prop(this, "flag", "bool", new VDFProp()).set = false;
            }
            return TypeInstantiatedManuallyThenFilled;
        })();
        test("D1_InstantiateTypeManuallyThenFill", function () {
            var a = new TypeInstantiatedManuallyThenFilled();
            VDF.DeserializeInto("{flag:true}", a);
            a.flag.Should().Be(true);
        });
        var D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = (function () {
            function D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1() {
                this._helper = Type(new VDFType(null, true)).set = this;
                this.messages = Prop(this, "messages", "Dictionary(string string)", new VDFProp()).set = new Dictionary("string", "string", {
                    title1: "message1",
                    title2: "message2"
                });
                this.otherProperty = Prop(this, "otherProperty", "bool", new VDFProp()).set = false;
            }
            return D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1;
        })();
        test("D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", function () {
            var a = VDF.Deserialize("{^}\n\
	messages:{^}\n\
		title1:'message1'\n\
		title2:'message2'\n\
	otherProperty:true", "D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1");
            a.messages.Count.Should().Be(2);
            a.messages["title1"].Should().Be("message1");
            a.messages["title2"].Should().Be("message2");
            a.otherProperty.Should().Be(true);
        });

        // tag stuff
        // ==========
        var D1_MapWithEmbeddedDeserializeMethod_Prop_Class = (function () {
            function D1_MapWithEmbeddedDeserializeMethod_Prop_Class() {
                this.boolProp = Prop(this, "boolProp", "bool", new VDFProp()).set = false;
            }
            D1_MapWithEmbeddedDeserializeMethod_Prop_Class.prototype.VDFDeserialize = function (node) {
                this.boolProp = node["boolProp"].primitiveValue;
            };
            return D1_MapWithEmbeddedDeserializeMethod_Prop_Class;
        })();
        test("D1_MapWithEmbeddedDeserializeMethod_Prop", function () {
            VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethod_Prop_Class").boolProp.Should().Be(true);
        });

        var D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class = (function () {
            function D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class() {
                this.boolProp = Prop(this, "boolProp", "bool", new VDFProp()).set = false;
            }
            D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class.prototype.VDFDeserialize = function (node) {
                return VDF.NoActionTaken;
            };
            return D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class;
        })();
        test("D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop", function () {
            VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class").boolProp.Should().Be(true);
        });

        var D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent = (function () {
            function D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent() {
                this.child = Prop(this, "child", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child", new VDFProp()).set = null;
            }
            return D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent;
        })();
        var D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child = (function () {
            function D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child() {
            }
            D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.VDFDeserialize = function (node, prop, options) {
                return null;
            };
            return D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child;
        })();
        test("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop", function () {
            ok(VDF.Deserialize("{child:{}}", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent").child == null);
        });

        var D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent = (function () {
            function D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent() {
                this.child = Prop(this, "child", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child", new VDFProp()).set = null;
            }
            return D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent;
        })();
        var D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child = (function () {
            function D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child() {
                this.boolProp = Prop(this, "boolProp", "bool", new VDFProp()).set = false;
            }
            D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child.VDFDeserialize = function (node, prop, options) {
                return VDF.NoActionTaken;
            };
            return D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child;
        })();
        test("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop", function () {
            VDF.Deserialize("{child:{boolProp: true}}", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent").child.boolProp.Should().Be(true);
        });

        var D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent = (function () {
            function D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent() {
                this.withoutTag = Prop(this, "withoutTag", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child", new VDFProp()).set = null;
                this.withTag = Prop(this, "withTag", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child", new VDFProp()).set = null;
            }
            return D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent;
        })();
        var D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child = (function () {
            function D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child() {
                this.methodCalled = Prop(this, "methodCalled", "bool", new VDFProp()).set = false;
            }
            D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child.prototype.VDFDeserialize = function (node, prop, options) {
                if (prop.propName == "withTag")
                    this.methodCalled = true;
            };
            return D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child;
        })();
        test("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag", function () {
            var a = VDF.Deserialize("{withoutTag:{} withTag:{}}", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent");
            a.withoutTag.methodCalled.Should().Be(false);
            a.withTag.methodCalled.Should().Be(true);
        });

        // for JSON compatibility
        // ==========
        test("D1_Map_IntsWithStringKeys", function () {
            var a = VDFLoader.ToVDFNode("{\"key1\":0 \"key2\":1}", new VDFLoadOptions({ allowStringKeys: true }));
            a.mapChildren.Count.Should().Be(2);
            a["key1"].primitiveValue.Should().Be(0);
        });
        test("D1_List_IntsWithCommaSeparators", function () {
            var a = VDFLoader.ToVDFNode("[0,1]", new VDFLoadOptions({ allowCommaSeparators: true }));
            a.listChildren.Count.Should().Be(2);
            a[0].primitiveValue.Should().Be(0);
        });
        test("D3_List_NumbersWithScientificNotation", function () {
            var a = VDFLoader.ToVDFNode("[-7.45058e-09,0.1,-1.49012e-08]", new VDFLoadOptions().ForJSON());
            a[0].primitiveValue.Should().Be(-7.45058e-09);
        });

        // unique to JavaScript version
        // ==========
        var PretendGenericType = (function () {
            function PretendGenericType() {
            }
            return PretendGenericType;
        })();
        test("Depth0_ObjectWithMetadataHavingGenericType", function () {
            return ok(VDF.Deserialize("PretendGenericType(object)>{}") instanceof PretendGenericType);
        });

        test("Depth1_UnknownTypeWithFixOn_String", function () {
            var a = VDF.Deserialize("UnknownType>{string:'Prop value string.'}", new VDFLoadOptions({ loadUnknownTypesAsBasicTypes: true }));
            a["string"].Should().Be("Prop value string.");
        });
        test("Depth1_UnknownTypeWithFixOff_String", function () {
            try  {
                VDF.Deserialize("UnknownType>{string:'Prop value string.'}");
            } catch (ex) {
                ok(ex.message == "Could not find type \"UnknownType\".");
            }
        });
        test("Depth1_Object_UnknownTypeWithFixOn", function () {
            var a = VDF.Deserialize("{string:UnkownBaseType>'Prop value string.'}", new VDFLoadOptions({ loadUnknownTypesAsBasicTypes: true }));
            a["string"].Should().Be("Prop value string.");
        });
        test("AsObject", function () {
            var a = VDF.Deserialize("{bool:bool>false double:double>3.5}", "object");
            a.bool.Should().Be(false);
            a.double.Should().Be(3.5);
        });

        var AsObjectOfType_Class = (function () {
            function AsObjectOfType_Class() {
            }
            return AsObjectOfType_Class;
        })();
        test("AsObjectOfType", function () {
            var a = VDF.Deserialize("AsObjectOfType_Class>{}", "AsObjectOfType_Class");
            ok(a instanceof AsObjectOfType_Class);
        });

        // export all classes/enums to global scope
        var arguments;
        var names = V.GetMatches(arguments.callee.toString(), /        var (\w+) = \(function \(\) {/g, 1);
        for (var i = 0; i < names.length; i++)
            try  {
                window[names[i]] = eval(names[i]);
            } catch (e) {
            }
        var enumNames = V.GetMatches(arguments.callee.toString(), /        }\)\((\w+) \|\| \(\w+ = {}\)\);/g, 1);
        for (var i = 0; i < enumNames.length; i++)
            try  {
                window[enumNames[i]] = eval(enumNames[i]);
            } catch (e) {
            }
    })(Loading || (Loading = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=Loading.js.map
