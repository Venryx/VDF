﻿/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: ()=> any) => // overwrite/wrap actual test func
{
Loading.Init();
window["oldTest"](title, testFunc);
}*/
var TypeWithPreDeserializeMethod = (function () {
    function TypeWithPreDeserializeMethod() {
        this.flag = false;
    }
    TypeWithPreDeserializeMethod.prototype.VDFPreDeserialize = function () {
        this.flag = true;
    };
    TypeWithPreDeserializeMethod.typeInfo = new VDFTypeInfo(false, false, {
        flag: new VDFPropInfo("bool")
    });
    return TypeWithPreDeserializeMethod;
})();
var TypeWithPostDeserializeMethod = (function () {
    function TypeWithPostDeserializeMethod() {
        this.flag = false;
    }
    TypeWithPostDeserializeMethod.prototype.VDFPostDeserialize = function () {
        this.flag = true;
    };
    TypeWithPostDeserializeMethod.typeInfo = new VDFTypeInfo(false, false, {
        flag: new VDFPropInfo("bool")
    });
    return TypeWithPostDeserializeMethod;
})();
var TypeInstantiatedManuallyThenFilled = (function () {
    function TypeInstantiatedManuallyThenFilled() {
    }
    TypeInstantiatedManuallyThenFilled.typeInfo = new VDFTypeInfo(false, false, {
        flag: new VDFPropInfo("bool")
    });
    return TypeInstantiatedManuallyThenFilled;
})();
var Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = (function () {
    function Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1() {
        this.messages = new Dictionary("string", "string");
    }
    Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1.typeInfo = new VDFTypeInfo(false, true, {
        messages: new VDFPropInfo("Dictionary[string,string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1;
})();

var TypeWithPostDeserializeMethod_CustomMessageRequired = (function () {
    function TypeWithPostDeserializeMethod_CustomMessageRequired() {
        this.flag = false;
    }
    TypeWithPostDeserializeMethod_CustomMessageRequired.prototype.VDFPostDeserialize = function (message) {
        if (message == "RequiredMessage")
            this.flag = true;
    };
    TypeWithPostDeserializeMethod_CustomMessageRequired.typeInfo = new VDFTypeInfo(false, false, {
        flag: new VDFPropInfo("bool")
    });
    return TypeWithPostDeserializeMethod_CustomMessageRequired;
})();

/*class Loading
{
static initialized: boolean;
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
});*#/
}
}*/
// Init
// ==========
var loading = {};
function Loading_RunTests() {
    for (var name in loading)
        test_old(name, loading[name]);
}

window["test"] = function (name, func) {
    loading[name] = func;
};

// to VDFNode
// ==========
test("Depth0_Comment", function () {
    var a = VDFLoader.ToVDFNode(";; comment\n\
Root string.");
    a.baseValue.Should().Be("Root string.");
});
test("Depth0_Comment2", function () {
    var a = VDFLoader.ToVDFNode("Root string ends here.;; comment");
    a.baseValue.Should().Be("Root string ends here.");
});
test("Depth0_BaseValue", function () {
    var a = VDFLoader.ToVDFNode("Root string.");
    a.baseValue.Should().Be("Root string."); // note; remember that for ambiguous cases like this, the base-like-value is added both as the obj's base-value and as its solitary item
});
test("Depth0_BaseValue_SaveThenLoad", function () {
    var vdf = VDF.Serialize("Root string.");
    var a = VDFLoader.ToVDFNode(vdf);
    a.baseValue.Should().Be("Root string.");
    a.items.length.Should().Be(0); // it should assume it's a base-value, unless indicated otherwise
    a.ToVDF().Should().Be("Root string.");
});
test("Depth0_BaseValue_Literal", function () {
    var a = VDFLoader.ToVDFNode("@@\tBase-value string that {needs escaping}.@@");
    a.baseValue.Should().Be("\tBase-value string that {needs escaping}.");
});
test("Depth0_Metadata_Type", function () {
    var a = VDFLoader.ToVDFNode("string>Root string.");
    a.metadata_type.Should().Be("string");
});
test("Depth0_Array", function () {
    var a = VDFLoader.ToVDFNode("Root string 1.|Root string 2.");
    a[0].baseValue.Should().Be("Root string 1.");
    a[1].baseValue.Should().Be("Root string 2.");
});

/*test("Depth0_Array_ExplicitStartAndEndMarkers", ()=>
{
var a = VDFLoader.ToVDFNode("{Root string 1.}{Root string 2.}", "List[object]");
a[0].baseValue.Should().Be("Root string 1.");
a[1].baseValue.Should().Be("Root string 2.");
});*/
test("Depth0_Array_Objects", function () {
    var a = VDFLoader.ToVDFNode("name{Dan}age{50}|name{Bob}age{60}", "List[object]");
    a[0]["name"].AsString.Should().Be("Dan");
    a[0]["age"].AsInt.Should().Be(50);
    a[1]["name"].AsString.Should().Be("Bob");
    a[1]["age"].AsInt.Should().Be(60);
});
test("Depth0_Array_Literals", function () {
    var a = VDFLoader.ToVDFNode("first|@@second\n\
which is on two lines@@|@@third\n\
which is on\n\
three lines@@", "List[string]");
    a[0].AsString.Should().Be("first");
    a[1].AsString.Should().Be("second\n\
which is on two lines");
    a[2].AsString.Should().Be("third\n\
which is on\n\
three lines");
});

/*test("Depth0_Array_Empty", ()=> // for now at least, it's against the rules to have items without a char of their own
{
var a = VDFLoader.ToVDFNode("|", "List[object]");
ok(a[0].baseValue == null);
ok(a[1].baseValue == null);
});*/
test("Depth0_Array_None_NoType", function () {
    var a = VDFLoader.ToVDFNode("", "List[object]");
    a.items.Count.Should().Be(0);
});
test("Depth0_Array_None_Type", function () {
    var a = VDFLoader.ToVDFNode(">>");
    a.items.Count.Should().Be(0);
});
test("Depth0_ArrayMetadata1", function () {
    var a = VDFLoader.ToVDFNode("List[int]>>1|2");
    a.metadata_type.Should().Be("List[int]");
    ok(a[0].metadata_type == null);
    ok(a[1].metadata_type == null);
});
test("Depth0_ArrayMetadata2", function () {
    var a = VDFLoader.ToVDFNode("List[int]>>int>1|int>2");
    a.metadata_type.Should().Be("List[int]");
    a[0].metadata_type.Should().Be("int");
    a[1].metadata_type.Should().Be("int");
});
test("Depth0_DictionaryItems", function () {
    var a = VDFLoader.ToVDFNode("key1{Simple string.}key2{name{Dan}age{50}}");
    a["key1"].baseValue.Should().Be("Simple string.");
    a["key2"]["age"].AsFloat.Should().Be(50);
});
test("Depth0_DictionaryItems_GetByKey", function () {
    var a = VDFLoader.ToVDFNode("key 1{value 1}key 2{value 2}");
    a["key 1"].baseValue.Should().Be("value 1");
    a["key 2"].baseValue.Should().Be("value 2");
});
test("Depth0_InferDepth2", function () {
    var a = VDF.Deserialize(">>>false", "List[object]");
    a[0].Should().Be(false);
});
test("Depth0_InferUnmarkedBaseValueTypeToBeString", function () {
    var a = VDF.Deserialize(">>SimpleString", "IList");
    a[0].Should().Be("SimpleString");
});
test("Depth0_InferUnmarkedBaseValueTypeToBeString_EvenWhenTypeSpecifiedAsObject", function () {
    var a = VDF.Deserialize(">>SimpleString", "List[object]");
    a[0].Should().Be("SimpleString");
});
test("Depth0_MultilineString", function () {
    var a = VDFLoader.ToVDFNode("@@This is a\nmultiline string\nof three lines in total.@@");
    a.baseValue.Should().Be("This is a\nmultiline string\nof three lines in total.");
});

test("Depth1_BaseValuesWithExplicitCasting", function () {
    var a = VDFLoader.ToVDFNode("bool{false}int{5}float{.5}string{Prop value string.}");
    a["bool"].baseValue.Should().Be("false");
    a["int"].baseValue.Should().Be("5");
    a["float"].baseValue.Should().Be(".5");
    a["string"].baseValue.Should().Be("Prop value string.");

    a["bool"].AsBool.Should().Be(false);
    a["int"].AsInt.Should().Be(5);
    a["float"].AsFloat.Should().Be(.5);
    a["string"].AsString.Should().Be("Prop value string.");
});
test("Depth1_BaseValuesWithMarkedTypes", function () {
    var a = VDFLoader.ToVDFNode("bool{bool>false}int{int>5}float{float>.5}string{string>Prop value string.}");
    a["bool"].AsBool.Should().Be(false);
    a["int"].AsInt.Should().Be(5);
    a["float"].AsFloat.Should().Be(.5);
    a["string"].AsString.Should().Be("Prop value string.");
});
test("Depth1_Literal", function () {
    var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@}");
    a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.");
});
test("Depth1_TroublesomeLiteral1", function () {
    var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@@|@@}");
    a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@");
});
test("Depth1_TroublesomeLiteral2", function () {
    var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@||@@}");
    a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@|");
});
test("Depth1_TroublesomeLiteral3", function () {
    var a = VDFLoader.ToVDFNode("@@@@@Prop value string that needs escaping.@@@|@@");
    a.baseValue.Should().Be("@@Prop value string that needs escaping.@@");
});
test("Depth1_VDFWithVDFWithVDF", function () {
    var a = VDFLoader.ToVDFNode("level1{@@level2{@@@level3{Base string.}@@@}@@}");
    a["level1"].baseValue.Should().Be("level2{@@level3{Base string.}@@}");
    VDFLoader.ToVDFNode(a["level1"].baseValue)["level2"].baseValue.Should().Be("level3{Base string.}");
    VDFLoader.ToVDFNode(VDFLoader.ToVDFNode(a["level1"].baseValue)["level2"].baseValue)["level3"].baseValue.Should().Be("Base string.");
});
test("Depth1_ArraysInArrays", function () {
    var a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}|3A");
    a[0][0].baseValue.Should().Be("1A");
    a[0][1].baseValue.Should().Be("1B");
    a[1][0].baseValue.Should().Be("2A");
    a[1][1].baseValue.Should().Be("2B");
    a[2].baseValue.Should().Be("3A");
});
test("Depth1_ArraysInArrays_SecondsEmpty", function () {
    var a = VDFLoader.ToVDFNode("{1A|}|{2A|}");
    a[0][0].baseValue.Should().Be("1A");
    ok(a[0][1].baseValue == null);
    a[1][0].baseValue.Should().Be("2A");
    ok(a[1][1].baseValue == null);
});
test("Depth1_ArraysInArrays_FirstsAndSecondsEmpty", function () {
    var a = VDFLoader.ToVDFNode("{|}|{|}");
    ok(a[0][0].baseValue == null);
    ok(a[0][1].baseValue == null);
    ok(a[1][0].baseValue == null);
    ok(a[1][1].baseValue == null);
});
test("Depth1_StringAndArraysInArrays", function () {
    var a = VDFLoader.ToVDFNode("text|{2A|}");
    a[0].baseValue.Should().Be("text");
    a[1][0].baseValue.Should().Be("2A");
    ok(a[1][1].baseValue == null);
});
test("Depth1_Dictionary", function () {
    var a = VDFLoader.ToVDFNode("key1{value1}key2{value2}");
    a["key1"].baseValue.Should().Be("value1");
    a["key2"].baseValue.Should().Be("value2");
});
test("Depth1_Dictionary_Complex", function () {
    var a = VDFLoader.ToVDFNode("uiPrefs{toolOptions{@@Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{>null}size{7}}@@}liveTool{Select}}");
    a["uiPrefs"]["toolOptions"].baseValue.Should().Be("Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{>null}size{7}}");
    a["uiPrefs"]["liveTool"].baseValue.Should().Be("Select");
});
test("Depth1_Dictionary_TypesInferredFromGenerics", function () {
    var a = VDFLoader.ToVDFNode("vertexColors{Dictionary[string,Color]>>9,4,2.5{Black}1,8,9.5435{Gray}25,15,5{White}}");
    a["vertexColors"]["9,4,2.5"].baseValue.Should().Be("Black");
    a["vertexColors"]["1,8,9.5435"].baseValue.Should().Be("Gray");
    a["vertexColors"]["25,15,5"].baseValue.Should().Be("White");
});

// note: if only one item (when parsed as List), assume by default obj is an object; if more than one, assume by default obj is a List or Dictionary
test("Depth1_ArrayPoppedOut_NoItems", function () {
    var a = VDFLoader.ToVDFNode("names:");
    a["names"].properties.Count.Should().Be(0);
});
test("Depth1_ArrayPoppedOut", function () {
    var a = VDFLoader.ToVDFNode("names:\n\
	Dan\n\
	Bob");
    a["names"][0].baseValue.Should().Be("Dan");
    a["names"][1].baseValue.Should().Be("Bob");
});
test("Depth1_ArraysPoppedOut", function () {
    var a = VDFLoader.ToVDFNode("names:\n\
	Dan\n\
	Bob\n\
^ages:\n\
	10\n\
	20");
    a["names"][0].baseValue.Should().Be("Dan");
    a["names"][1].baseValue.Should().Be("Bob");
    a["ages"][0].baseValue.Should().Be("10");
    a["ages"][1].baseValue.Should().Be("20");
});
test("Depth1_InferredDictionaryPoppedOut", function () {
    var a = VDFLoader.ToVDFNode("messages:,>>\n\
	title1{message1}\n\
	title2{message2}\n\
^otherProperty{false}");
    a["messages"].properties.Count.Should().Be(2);
    a["messages"]["title1"].baseValue.Should().Be("message1");
    a["messages"]["title2"].baseValue.Should().Be("message2");
    a["otherProperty"].baseValue.Should().Be("false");
});
test("Depth1_DictionaryPoppedOut", function () {
    /*
    Written As:
    
    messages:,>>
    title1{message1}
    title2{message2}
    ^otherProperty{false}
    
    Parsed As:
    
    messages:{,>>
    title1{message1}
    title2{message2}
    }^otherProperty{false}
    */
    var a = VDFLoader.ToVDFNode("messages:,>>\n\
	title1{message1}\n\
	title2{message2}\n\
^otherProperty{false}");
    a["messages"].properties.Count.Should().Be(2);
    a["messages"]["title1"].baseValue.Should().Be("message1");
    a["messages"]["title2"].baseValue.Should().Be("message2");
    a["otherProperty"].baseValue.Should().Be("false");
});

test("Depth1_Object_MultilineStringThenProperty", function () {
    var a = VDFLoader.ToVDFNode("text{@@This is a\n\
multiline string\n\
of three lines in total.@@}bool{>true}");
    a["text"].baseValue.Should().Be("This is a\nmultiline string\nof three lines in total.");
    a["bool"].AsBool.Should().Be(true);
});
test("Depth1_Object_PoppedOutStringsThenMultilineString", function () {
    var a = VDFLoader.ToVDFNode("childTexts:\n\
	text1\n\
	text2\n\
^text{@@This is a\n\
	multiline string\n\
	of three lines in total.@@}");
    a["childTexts"][0].baseValue.Should().Be("text1");
    a["childTexts"][1].baseValue.Should().Be("text2");
    a["text"].baseValue.Should().Be("This is a\n	multiline string\n	of three lines in total.");
});
test("Depth2_List_Lists_PoppedOutObjects", function () {
    var a = VDFLoader.ToVDFNode("\n\
>>{>>{\n\
	name{Road}\n\
}|{\n\
	name{RoadAndPath}\n\
}|{\n\
	name{SimpleHill}\n\
}}\n\
	".trim());
    a[0].items.Count.Should().Be(3);
});
test("List_PoppedOutObjects_MultilineString", function () {
    var a = VDFLoader.ToVDFNode(">>\n\
	id{1}multilineText{@@line1\n\
	line2\n\
	line3@@}\n\
	id{2}multilineText{@@line1\n\
	line2@@}");
    a.items.Count.Should().Be(2);
});

test("Depth2_Object_PoppedOutObject_PoppedOutObject", function () {
    var a = VDFLoader.ToVDFNode("\n\
name{L0}children:\n\
	name{L1}children:\n\
		name{L2}\n\
	".trim());
    a["children"].items.Count.Should().Be(1);
    a["children"].items[0]["children"].items.Count.Should().Be(1);
});

test("Depth5_DeepNestedPoppedOutData", function () {
    var vdf = "name{Main}worlds{string,object>>Test1{vObjectRoot{name{VObjectRoot}children:\n\
	id{System.Guid>025f28a5-a14b-446d-b324-2d274a476a63}name{#Types}children{}\n\
}}Test2{vObjectRoot{name{VObjectRoot}children:\n\
	id{System.Guid>08e84f18-aecf-4b80-9c3f-ae0697d9033a}name{#Types}children{}\n\
}}}";
    var livePackNode = VDFLoader.ToVDFNode(vdf);
    livePackNode["worlds"]["Test1"]["vObjectRoot"]["children"][0]["id"].baseValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
    livePackNode["worlds"]["Test2"]["vObjectRoot"]["children"][0]["id"].baseValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
});
test("Depth5_SpeedTester", function () {
    var vdf = "id{595880cd-13cd-4578-9ef1-bd3175ac72bb}visible{true}parts:\n\
	id{ba991aaf-447a-4a03-ade8-f4a11b4ea966}typeName{Wood}name{Body}pivotPoint_unit{-0.1875,0.4375,-0.6875}anchorNormal{0,1,0}scale{0.5,0.25,1.5}controller{true}\n\
	id{743f64f2-8ece-4dd3-bdf5-bbb6378ffce5}typeName{Wood}name{FrontBar}pivotPoint_unit{-0.4375,0.5625,0.8125}anchorNormal{0,0,1}scale{1,0.25,0.25}controller{false}\n\
	id{52854b70-c200-478f-bcd2-c69a03cd808f}typeName{Wheel}name{FrontLeftWheel}pivotPoint_unit{-0.5,0.5,0.875}anchorNormal{-1,0,0}scale{1,1,1}controller{false}\n\
	id{971e394c-b440-4fee-99fd-dceff732cd1e}typeName{Wheel}name{BackRightWheel}pivotPoint_unit{0.5,0.5,-0.875}anchorNormal{1,0,0}scale{1,1,1}controller{false}\n\
	id{77d30d72-9845-4b22-8e95-5ba6e29963b9}typeName{Wheel}name{FrontRightWheel}pivotPoint_unit{0.5,0.5,0.875}anchorNormal{1,0,0}scale{1,1,1}controller{false}\n\
	id{21ca2a80-6860-4de3-9894-b896ec77ef9e}typeName{Wheel}name{BackLeftWheel}pivotPoint_unit{-0.5,0.5,-0.875}anchorNormal{-1,0,0}scale{1,1,1}controller{false}\n\
	id{eea2623a-86d3-4368-b4e0-576956b3ef1d}typeName{Wood}name{BackBar}pivotPoint_unit{-0.4375,0.4375,-0.8125}anchorNormal{0,0,-1}scale{1,0.25,0.25}controller{false}\n\
	id{f1edc5a1-d544-4993-bdad-11167704a1e1}typeName{MachineGun}name{Gun1}pivotPoint_unit{0,0.625,0.875}anchorNormal{0,1,0}scale{0.5,0.5,0.5}controller{false\n\
	id{e97f8ee1-320c-4aef-9343-3317accb015b}typeName{Crate}name{Crate}pivotPoint_unit{0,0.625,0}anchorNormal{0,1,0}scale{0.5,0.5,0.5}controller{false}\n\
^tasksScriptText{@@Grab Flag\n\
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
	Gun1 fire@@}";
    VDFLoader.ToVDFNode(vdf);
    ok(true);
});

// to object
// ==================
test("Depth0_Null", function () {
    return ok(VDF.Deserialize(">null") == null);
});
test("Depth0_Nothing", function () {
    return ok(VDF.Deserialize("") == null);
});
test("Depth0_Nothing_TypeSpecified", function () {
    return ok(VDF.Deserialize("string>") == null);
});
test("Depth0_EmptyString", function () {
    return VDF.Deserialize(">empty").Should().Be("");
});
test("Depth0_Bool", function () {
    return VDF.Deserialize("true", "bool").Should().Be(true);
});
test("Depth0_Float", function () {
    return VDF.Deserialize("1.5", "float").Should().Be(1.5);
});

test("Depth1_EmptyStringInList", function () {
    return ok(VDF.Deserialize("text1|", "List[string]")[1] == null);
});
test("Depth1_PreDeserializeMethod", function () {
    var a = VDF.Deserialize("", "TypeWithPreDeserializeMethod");
    a.flag.Should().Be(true);
});
test("Depth1_PostDeserializeMethod", function () {
    var a = VDF.Deserialize("", "TypeWithPostDeserializeMethod");
    a.flag.Should().Be(true);
});
test("Depth1_PostDeserializeMethod_CustomMessageRequired", function () {
    VDF.Deserialize("", "TypeWithPostDeserializeMethod_CustomMessageRequired", new VDFLoadOptions("WrongMessage")).flag.Should().Be(false);
});
test("Depth1_InstantiateTypeManuallyThenFill", function () {
    var a = new TypeInstantiatedManuallyThenFilled();
    VDF.DeserializeInto("flag{true}", a);
    a.flag.Should().Be(true);
});
test("Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", function () {
    var a = VDF.Deserialize("\n\
	messages:\n\
		title1{message1}\n\
		title2{message2}\n\
	otherProperty{true}", "Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1");
    a.messages.Count.Should().Be(2);
    a.messages["title1"].Should().Be("message1");
    a.messages["title2"].Should().Be("message2");
    a.otherProperty.Should().Be(true);
});

// unique to JavaScript version
// ==================
test("Depth0_InferCompatibleTypesForUnknownTypes_Object", function () {
    var a = VDFLoader.ToVDFNode("UnknownType>string{Prop value string.}", new VDFLoadOptions(null, true));
    a["string"].baseValue.Should().Be("Prop value string.");
});
test("Depth0_InferCompatibleTypesForUnknownTypes_BaseValue", function () {
    var a = VDFLoader.ToVDFNode("string{UnkownBaseType>Prop value string.}", new VDFLoadOptions(null, true));
    a["string"].baseValue.Should().Be("Prop value string.");
});
test("AsObject", function () {
    var a = VDF.Deserialize("bool{bool>false}float{float>3.5}", "object");
    a.bool.Should().Be(false);
    a.float.Should().BeExactly(3.5);
});
test("AsObject_NestedList_InferCompatibleTypesOff", function () {
    var a = VDF.Deserialize("name{Soils}children{id{1.1.1.1}name{Grass}|id{1.1.1.2}name{Dirt}|id{1.1.1.3}name{Snow}}");
    ok(a == null);
});
test("AsObject_NestedList_InferCompatibleTypesOn", function () {
    var a = VDF.Deserialize("name{Soils}children{id{1.1.1.1}name{Grass}|id{1.1.1.2}name{Dirt}|id{1.1.1.3}name{Snow}}", new VDFLoadOptions(null, true));
    a["children"].length.Should().Be(3);
});

test("Depth2_ComplexPoppedOutItems", function () {
    var a = VDF.Deserialize("id{595880cd-13cd-4578-9ef1-bd3175ac72bb}visible{true}parts:>>\n\
	id{ba991aaf-447a-4a03-ade8-f4a11b4ea966}typeName{Wood}name{Body}pivotPoint_unit{-0.1875,0.4375,-0.6875}anchorNormal{0,1,0}scale{0.5,0.25,1.5}controller{true}\n\
	id{743f64f2-8ece-4dd3-bdf5-bbb6378ffce5}typeName{Wood}name{FrontBar}pivotPoint_unit{-0.4375,0.5625,0.8125}anchorNormal{0,0,1}scale{1,0.25,0.25}controller{false}\n\
	id{e97f8ee1-320c-4aef-9343-3317accb015b}typeName{Crate}name{Crate}pivotPoint_unit{0,0.625,0}anchorNormal{0,1,0}scale{0.5,0.5,0.5}controller{false}", new VDFLoadOptions(true, true));
    a.parts.Count.Should().Be(3);
});
test("Depth2_ComplexPoppedOutItemsThenBool", function () {
    var a = VDF.Deserialize("id{595880cd-13cd-4578-9ef1-bd3175ac72bb}visible{true}parts:\n\
	id{ba991aaf-447a-4a03-ade8-f4a11b4ea966}typeName{Wood}name{Body}pivotPoint_unit{-0.1875,0.4375,-0.6875}anchorNormal{0,1,0}scale{0.5,0.25,1.5}controller{true}\n\
	id{743f64f2-8ece-4dd3-bdf5-bbb6378ffce5}typeName{Wood}name{FrontBar}pivotPoint_unit{-0.4375,0.5625,0.8125}anchorNormal{0,0,1}scale{1,0.25,0.25}controller{false}\n\
	id{52854b70-c200-478f-bcd2-c69a03cd808f}typeName{Wheel}name{FrontLeftWheel}pivotPoint_unit{-0.5,0.5,0.875}anchorNormal{-1,0,0}scale{1,1,1}controller{false}\n\
	id{971e394c-b440-4fee-99fd-dceff732cd1e}typeName{Wheel}name{BackRightWheel}pivotPoint_unit{0.5,0.5,-0.875}anchorNormal{1,0,0}scale{1,1,1}controller{false}\n\
	id{77d30d72-9845-4b22-8e95-5ba6e29963b9}typeName{Wheel}name{FrontRightWheel}pivotPoint_unit{0.5,0.5,0.875}anchorNormal{1,0,0}scale{1,1,1}controller{false}\n\
	id{21ca2a80-6860-4de3-9894-b896ec77ef9e}typeName{Wheel}name{BackLeftWheel}pivotPoint_unit{-0.5,0.5,-0.875}anchorNormal{-1,0,0}scale{1,1,1}controller{false}\n\
	id{eea2623a-86d3-4368-b4e0-576956b3ef1d}typeName{Wood}name{BackBar}pivotPoint_unit{-0.4375,0.4375,-0.8125}anchorNormal{0,0,-1}scale{1,0.25,0.25}controller{false}\n\
	id{f1edc5a1-d544-4993-bdad-11167704a1e1}typeName{MachineGun}name{Gun1}pivotPoint_unit{0,0.625,0.875}anchorNormal{0,1,0}scale{0.5,0.5,0.5}controller{false}\n\
	id{e97f8ee1-320c-4aef-9343-3317accb015b}typeName{Crate}name{Crate}pivotPoint_unit{0,0.625,0}anchorNormal{0,1,0}scale{0.5,0.5,0.5}controller{false}\n\
^tasksScriptText{@@Grab Flag\n\
	(Crate ensure contains an EnemyFlag) ensure is false\n\
	targetFlag be EnemyFlag_OnEnemyGround [objectRefreshInterval: infinity] [lifetime: infinity]\n\
	targetFlag set tag `taken`\n\
	FrontLeftWheel turn to targetFlag [with: FrontRightWheel]\n\
	FrontLeftWheel roll forward\n\
	FrontRightWheel roll forward\n\
	BackLeftWheel roll forward\n\
	BackRightWheel roll forward\n\
	targetFlag put into Crate\n\
Shoot at Enemy Vehicle\n\
	Gun1 aim at EnemyVehicle_NonBroken\n\
	Gun1 fire@@}", new VDFLoadOptions(true, true));
    a.parts.Count.Should().Be(9);
});

// quick/temp tests
// ==========
test("Load_Quick", function () {
    var a = VDFLoader.ToVDFNode("\n\
>>{Map>>{\n\
	id{System.Guid>e10fffb1-b5f7-4404-9e77-508f8aaa73f3}\n\
	name{Road}\n\
	terrain{VTerrain>}\n\
	regions:Region>>\n\
		id{System.Guid>e5b9f479-deb7-4596-9a6f-910c7e297cbb}name{Base}layer{>0}soilID{System.Guid>b7395b9e-77eb-4c88-92a0-34e2f679bde9}\n\
		id{System.Guid>e908f0c0-c24c-482c-a210-0206e9b4c54f}name{Gravel}layer{>1}soilID{System.Guid>25fb1b3e-5290-420e-a321-6b0811b06816}\n\
		id{System.Guid>bf5b4247-d667-45d2-837b-7e6534627a16}name{Path}layer{>4}soilID{System.Guid>ddc82700-51ca-43c1-b7ae-e53f72c3296b}\n\
		id{System.Guid>f89e76b7-064d-40fc-9369-24c3c0e1a46a}name{DarkGrass}layer{>2}soilID{System.Guid>5fda6e73-3433-496a-b776-6d2906f121a9}\n\
		id{System.Guid>1ca9dac7-ab7e-4610-b84f-a61495c18c34}name{RocksAndGrass}layer{>3}soilID{System.Guid>a015276b-a061-44c5-8f80-b8083222ac8d}\n\
	prefs{string,object>>selectedRegionID{>null}}\n\
	lastCameraPos{Vector3>62.77748,72.13427,-32.98473}\n\
	lastCameraRot{Vector3>43.25,0.2498523,0}\n\
	showRegionOverlay{>false}\n\
}|{\n\
	id{System.Guid>78eff07d-1876-4139-beaf-21822c0dc0cb}\n\
	name{RoadAndPath}\n\
	terrain{VTerrain>}\n\
	regions:Region>>\n\
		id{System.Guid>e5b9f479-deb7-4596-9a6f-910c7e297cbb}name{Base}layer{>0}soilID{System.Guid>b7395b9e-77eb-4c88-92a0-34e2f679bde9}\n\
		id{System.Guid>bf5b4247-d667-45d2-837b-7e6534627a16}name{Path}layer{>7}soilID{System.Guid>188ed914-f208-4adb-a4e6-75867160e7bc}\n\
		id{System.Guid>f89e76b7-064d-40fc-9369-24c3c0e1a46a}name{DarkGrass}layer{>6}soilID{System.Guid>5fda6e73-3433-496a-b776-6d2906f121a9}\n\
		id{System.Guid>65183f26-6c2f-4d25-93e9-3c2e53b9d2fe}name{GravelPath}layer{>6}soilID{System.Guid>25fb1b3e-5290-420e-a321-6b0811b06816}\n\
	prefs{string,object>>selectedRegionID{System.Guid>65183f26-6c2f-4d25-93e9-3c2e53b9d2fe}}\n\
	lastCameraPos{Vector3>53.48114,78.86283,-75.72661}\n\
	lastCameraRot{Vector3>33.75,10.75037,0}\n\
	showRegionOverlay{>false}\n\
}|{\n\
	id{System.Guid>04662d18-0c74-45ad-bddf-755320b08aad}\n\
	name{SimpleHill}\n\
	terrain{VTerrain>}\n\
	regions:Region>>\n\
		id{System.Guid>e7ff881b-3625-4213-a3fb-fb65de4c22a7}name{Base}layer{>0}soilID{System.Guid>b7395b9e-77eb-4c88-92a0-34e2f679bde9}\n\
		id{System.Guid>e53f3844-a12a-4d7c-bff5-0155cbe05f46}name{DarkGrass}layer{>1}soilID{System.Guid>5fda6e73-3433-496a-b776-6d2906f121a9}\n\
	prefs{string,object>>selectedChunkPosition{Vector3i>0,0,0}selectedRegionID{System.Guid>e53f3844-a12a-4d7c-bff5-0155cbe05f46}}\n\
	lastCameraPos{Vector3>102.5171,89.69484,-31.49277}\n\
	lastCameraRot{Vector3>34.50011,12.25032,0}\n\
	showRegionOverlay{>false}\n\
}|{\n\
	id{System.Guid>a2c69a05-1ac0-4dc6-a51b-6f0bbadf8082}\n\
	name{Test1}\n\
	terrain{VTerrain>}\n\
	regions:Region>>\n\
		id{System.Guid>5c2723fb-62d5-4ce3-859a-5c0474026e1b}name{Base}layer{>0}soilID{System.Guid>b7395b9e-77eb-4c88-92a0-34e2f679bde9}\n\
		id{System.Guid>07caffe1-8a40-4a58-880d-d413a1fccaee}name{DarkGrass}layer{>1}soilID{System.Guid>5fda6e73-3433-496a-b776-6d2906f121a9}\n\
	prefs{string,object>>selectedRegionID{System.Guid>07caffe1-8a40-4a58-880d-d413a1fccaee}selectedChunkPosition{Vector3i>4,0,4}}\n\
	lastCameraPos{Vector3>161.7268,43.22983,156.8803}\n\
	lastCameraRot{Vector3>27.24998,167.9989,0}\n\
	showRegionOverlay{>false}\n\
}|{\n\
	id{System.Guid>c18d38e0-61f8-4b3d-a31e-041913b8bad0}\n\
	name{Test1345345}\n\
	terrain{VTerrain>}\n\
	regions:Region>>\n\
		id{System.Guid>15041c99-fac3-44a6-ad2e-098374d56f72}name{Base}layer{>0}soilID{System.Guid>b7395b9e-77eb-4c88-92a0-34e2f679bde9}\n\
		id{System.Guid>3ed40004-8633-46aa-89a4-0bc0016a9e7f}name{Test1}layer{>1}soilID{System.Guid>5fda6e73-3433-496a-b776-6d2906f121a9}\n\
	prefs{string,object>>selectedRegionID{System.Guid>3ed40004-8633-46aa-89a4-0bc0016a9e7f}}\n\
	lastCameraPos{Vector3>91.30679,38.33265,69.90929}\n\
	lastCameraRot{Vector3>45.75002,233.2497,0}\n\
	showRegionOverlay{>false}\n\
}}\n\
	".trim().replace(/    /g, "\t"));
    a[0].items.Count.Should().Be(5);

    var b = VDF.Deserialize("\n\
name{Root}children:\n\
	name{Stories}\n\
	name{Games}children:\n\
		name{CreativeDefense}children:\n\
			name{DevelopmentTree}\n\
	".trim().replace(/    /g, "\t"), new VDFLoadOptions(null, true));
    b["children"][1]["children"][0]["children"][0]["name"].Should().Be("DevelopmentTree");
});
//# sourceMappingURL=Loading.js.map
