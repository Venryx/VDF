// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Loading_ToVDFNode;
    (function (Loading_ToVDFNode) {
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
        test("D0_PowerNotation", function () {
            VDFLoader.ToVDFNode("1e3").primitiveValue.Should().Be(1000); //1 * Math.Pow(10, 3));
            VDFLoader.ToVDFNode("1e-3").primitiveValue.Should().Be(.001); //1 * Math.Pow(10, -3));
            VDFLoader.ToVDFNode("-1e3").primitiveValue.Should().Be(-1000); //-(1 * Math.Pow(10, 3)));
            VDFLoader.ToVDFNode("-1e-3").primitiveValue.Should().Be(-.001); //-(1 * Math.Pow(10, -3)));
        });
        test("D0_Infinity", function () {
            VDFLoader.ToVDFNode("Infinity").primitiveValue.Should().Be(Infinity);
            VDFLoader.ToVDFNode("-Infinity").primitiveValue.Should().Be(-Infinity);
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
        /*test("D0_List_ExplicitStartAndEndMarkers", ()=> {
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
        test("D0_EmptyList", function () { VDF.Deserialize("[]").Count.Should().Be(0); });
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
        test("D0_EmptyMap", function () { VDF.Deserialize("{}").Count.Should().Be(0); });
        test("D0_Map_ChildMetadata", function () {
            var a = VDFLoader.ToVDFNode("Dictionary(object object)>{a:string>\"1\" b:string>\"2\"}");
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
            var a = VDFLoader.ToVDFNode("{key1:'Simple string.' key2:'false' key3:{name:'Dan' age:50}}");
            a["key1"].primitiveValue.Should().Be("Simple string.");
            a["key2"].primitiveValue.Should().Be("false");
            a["key3"]["age"].primitiveValue.Should().Be(50);
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
            var a = VDFLoader.ToVDFNode("{key1:'value1' key2:'value2' 'key3':'value3' \"key4\":\"value4\"}");
            a["key1"].primitiveValue.Should().Be("value1");
            a["key2"].primitiveValue.Should().Be("value2");
            a["key3"].primitiveValue.Should().Be("value3");
            a["key4"].primitiveValue.Should().Be("value4");
        });
        test("D1_Map_KeyWithHash", function () {
            var a = VDFLoader.ToVDFNode("{#:'value1'}");
            a["#"].primitiveValue.Should().Be("value1");
        });
        test("D1_Map_MixedTypeKeysWithMetadata", function () {
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
            var vdf = "{names:[^]}\n\t'Dan'\n\t'Bob'";
            var tokens = VDFTokenParser.ParseTokens(vdf);
            var tokenTypes = tokens.Select(function (b) { return VDFTokenType[b.type]; });
            tokenTypes.Should().BeEquivalentTo(new List("VDFTokenType", VDFTokenType.MapStartMarker, VDFTokenType.Key, VDFTokenType.ListStartMarker, VDFTokenType.String, VDFTokenType.String, VDFTokenType.ListEndMarker, VDFTokenType.MapEndMarker).Select(function (a) { return VDFTokenType[a]; }));
            var a = VDFLoader.ToVDFNode(vdf);
            a["names"][0].primitiveValue.Should().Be("Dan");
            a["names"][1].primitiveValue.Should().Be("Bob");
        });
        test("D1_ArraysPoppedOut", function () {
            var vdf = "{names:[^] ages:[^]}\n\t'Dan'\n\t'Bob'\n\t^10\n\t20";
            var tokens = VDFTokenParser.ParseTokens(vdf);
            var tokenTypes = tokens.Select(function (b) { return VDFTokenType[b.type]; });
            tokenTypes.Should().BeEquivalentTo(new List("VDFTokenType", VDFTokenType.MapStartMarker, VDFTokenType.Key, VDFTokenType.ListStartMarker, VDFTokenType.String, VDFTokenType.String, VDFTokenType.ListEndMarker, VDFTokenType.Key, VDFTokenType.ListStartMarker, VDFTokenType.Number, VDFTokenType.Number, VDFTokenType.ListEndMarker, VDFTokenType.MapEndMarker).Select(function (a) { return VDFTokenType[a]; }));
            var a = VDFLoader.ToVDFNode(vdf);
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
	^{name:'SimpleHill'}"); //, new VDFLoadOptions({inferStringTypeForUnknownTypes: true}));
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
            // shift each within-string literal-end-marker token to after its containing-string's token
            for (var i = 0; i < tokens.Count; i++) {
                if (tokens[i].type == VDFTokenType.LiteralEndMarker && tokens[i + 1].type == VDFTokenType.String) {
                    var oldFirst = tokens[i];
                    tokens[i] = tokens[i + 1];
                    tokens[i + 1] = oldFirst;
                    i++;
                }
            }
            var vdf2 = "";
            for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                var token = tokens_1[_i];
                vdf2 += token.text;
            }
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
        // export all classes/enums to global scope
        ExportInternalClassesTo(window, function (str) { return eval(str); });
    })(Loading_ToVDFNode || (Loading_ToVDFNode = {}));
})(VDFTests || (VDFTests = {}));
