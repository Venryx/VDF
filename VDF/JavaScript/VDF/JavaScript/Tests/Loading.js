/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: ()=> any) => // overwrite/wrap actual test func
{
Loading.Init();
window["oldTest"](title, testFunc);
}*/
var TypeWithPostDeserializeMethod = (function () {
    function TypeWithPostDeserializeMethod() {
        this.flag = false;
    }
    TypeWithPostDeserializeMethod.prototype.VDFPostDeserialize = function () {
        this.flag = true;
    };
    TypeWithPostDeserializeMethod.typeInfo = new VDFTypeInfo(false, {
        flag: new VDFPropInfo("bool", true)
    });
    return TypeWithPostDeserializeMethod;
})();
var TypeWithPostDeserializeMethod_CustomMessageRequired = (function () {
    function TypeWithPostDeserializeMethod_CustomMessageRequired() {
        this.flag = false;
    }
    TypeWithPostDeserializeMethod_CustomMessageRequired.prototype.VDFPostDeserialize = function (message) {
        if (message == "RequiredMessage")
            this.flag = true;
    };
    TypeWithPostDeserializeMethod_CustomMessageRequired.typeInfo = new VDFTypeInfo(false, {
        flag: new VDFPropInfo("bool", true)
    });
    return TypeWithPostDeserializeMethod_CustomMessageRequired;
})();
var TypeInstantiatedManuallyThenFilled = (function () {
    function TypeInstantiatedManuallyThenFilled() {
    }
    TypeInstantiatedManuallyThenFilled.typeInfo = new VDFTypeInfo(false, {
        flag: new VDFPropInfo("bool", true)
    });
    return TypeInstantiatedManuallyThenFilled;
})();
var Loading = (function () {
    function Loading() {
    }
    Loading.Init = function () {
        if (this.initialized)
            return;
        this.initialized = true;
        Object.prototype._AddFunction_Inline = function Should() {
            var _this = this;
            return 0 || {
                Be: function (value, message) {
                    equal(_this instanceof Number ? parseFloat(_this) : (_this instanceof String ? _this.toString() : _this), value, message);
                },
                BeExactly: function (value, message) {
                    strictEqual(_this instanceof Number ? parseFloat(_this) : (_this instanceof String ? _this.toString() : _this), value, message);
                }
            };
        };
        VDF.RegisterTypeExporter_Inline("Guid", function (id) {
            return id.ToString();
        });
        VDF.RegisterTypeImporter_Inline("Guid", function (str) {
            return new Guid(str);
        });
        VDF.RegisterTypeExporter_Inline("Vector3", function (point) {
            return point.x + "," + point.y + "," + point.z;
        });
        VDF.RegisterTypeImporter_Inline("Vector3", function (str) {
            var parts = str.split(',');
            return new Vector3(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
        });
    };

    Loading.RunTests = function () {
        // ToVDFNode
        // ==================
        test("ToVDFNode_Level0_Comment", function () {
            var a = VDFLoader.ToVDFNode("// comment\n\
			Root string.");
            a.baseValue.Should().Be("			Root string.");
        });
        test("ToVDFNode_Level0_BaseValue", function () {
            var a = VDFLoader.ToVDFNode("Root string.");
            a.baseValue.Should().Be("Root string."); // note; remember that for ambiguous cases like this, the base-like-value is added both as the obj's base-value and as its solitary item
        });
        test("ToVDFNode_Level0_BaseValue_SaveThenLoad", function () {
            var vdf = VDF.Serialize("Root string.");
            var a = VDFLoader.ToVDFNode(vdf);
            a.baseValue.Should().Be("Root string.");
            a.items.length.Should().Be(0); // it should assume it's a base-value, unless indicated otherwise
            a.ToVDF().Should().Be("Root string.");
        });
        test("ToVDFNode_Level0_BaseValue_Literal", function () {
            var a = VDFLoader.ToVDFNode("@@Base-value string that {needs escaping}.@@");
            a.baseValue.Should().Be("Base-value string that {needs escaping}.");
        });
        test("ToVDFNode_Level0_Metadata_Type", function () {
            var a = VDFLoader.ToVDFNode("string>Root string.");
            a.metadata_type.Should().Be("string");
        });
        test("ToVDFNode_Level0_ArrayItems", function () {
            var a = VDFLoader.ToVDFNode("Root string 1.|Root string 2.");
            a[0].baseValue.Should().Be("Root string 1.");
            a[1].baseValue.Should().Be("Root string 2.");
        });
        test("ToVDFNode_Level0_ArrayItems_Objects", function () {
            var a = VDFLoader.ToVDFNode("name{Dan}age{50}|name{Bob}age{60}", "List[object]");
            a[0]["name"].AsString.Should().Be("Dan");
            a[0]["age"].AsInt.Should().Be(50);
            a[1]["name"].AsString.Should().Be("Bob");
            a[1]["age"].AsInt.Should().Be(60);
        });
        test("ToVDFNode_Level0_ArrayItems_Empty", function () {
            var a = VDFLoader.ToVDFNode("|", "List[object]");
            ok(a[0].baseValue == null);
            ok(a[1].baseValue == null);
        });
        test("ToVDFNode_Level0_ArrayItems_None", function () {
            var a = VDFLoader.ToVDFNode("", "List[object]");
            a.items.length.Should().Be(0);
            a = VDFLoader.ToVDFNode(">>");
            a.items.length.Should().Be(0);
        });
        test("ToVDFNode_Level0_ArrayMetadata1", function () {
            var a = VDFLoader.ToVDFNode("SpecialList[int]>>1|2");
            a.metadata_type.Should().Be("SpecialList[int]");
            ok(a[0].metadata_type == null);
            ok(a[1].metadata_type == null);
        });
        test("ToVDFNode_Level0_ArrayMetadata2", function () {
            var a = VDFLoader.ToVDFNode("SpecialList[int]>>int>1|int>2");
            a.metadata_type.Should().Be("SpecialList[int]");
            a[0].metadata_type.Should().Be("int");
            a[1].metadata_type.Should().Be("int");
        });
        test("ToVDFNode_Level0_DictionaryItems", function () {
            var a = VDFLoader.ToVDFNode("key1{Simple string.}key2{name{Dan}age{50}}");
            a["key1"].baseValue.Should().Be("Simple string.");
            a["key2"]["age"].AsFloat.Should().Be(50);
        });
        test("ToVDFNode_Level0_DictionaryItems_GetByKey", function () {
            var a = VDFLoader.ToVDFNode("key 1{value 1}key 2{value 2}");
            a["key 1"].baseValue.Should().Be("value 1");
            a["key 2"].baseValue.Should().Be("value 2");
        });
        test("ToVDFNode_Level0_InferDepth2", function () {
            var a = VDF.Deserialize(">>>false", "List[object]");
            a[0].Should().Be(false);
        });
        test("ToVDFNode_Level0_InferUnmarkedTypeToBeString", function () {
            var a = VDF.Deserialize(">>SimpleString", "List[object]");
            a[0].Should().Be("SimpleString");
        });
        test("ToVDFNode_Level0_MultilineString", function () {
            var a = VDFLoader.ToVDFNode("@@This is a\nmultiline string\nof three lines in total.@@");
            a.baseValue.Should().Be("This is a\nmultiline string\nof three lines in total.");
        });

        test("ToVDFNode_Level1_BaseValuesWithExplicitCasting", function () {
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
        test("ToVDFNode_Level1_BaseValuesWithMarkedTypes", function () {
            var a = VDFLoader.ToVDFNode("bool{bool>false}int{int>5}float{float>.5}string{string>Prop value string.}");
            a["bool"].AsBool.Should().Be(false);
            a["int"].AsInt.Should().Be(5);
            a["float"].AsFloat.Should().Be(.5);
            a["string"].AsString.Should().Be("Prop value string.");
        });
        test("ToVDFNode_Level1_Literal", function () {
            var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@}");
            a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.");
        });
        test("ToVDFNode_Level1_TroublesomeLiteral1", function () {
            var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@@|@@}");
            a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@");
        });
        test("ToVDFNode_Level1_TroublesomeLiteral2", function () {
            var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@||@@}");
            a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@|");
        });
        test("ToVDFNode_Level1_VDFWithVDFWithVDF", function () {
            var a = VDFLoader.ToVDFNode("level1{@@level2{@@@level3{Base string.}@@@}@@}");
            a["level1"].baseValue.Should().Be("level2{@@level3{Base string.}@@}");
            VDFLoader.ToVDFNode(a["level1"].baseValue)["level2"].baseValue.Should().Be("level3{Base string.}");
            VDFLoader.ToVDFNode(VDFLoader.ToVDFNode(a["level1"].baseValue)["level2"].baseValue)["level3"].baseValue.Should().Be("Base string.");
        });
        test("ToVDFNode_Level1_PoppedOutBaseValue", function () {
            var a = VDFLoader.ToVDFNode("name{#}\n\
	Dan");
            a["name"].baseValue.Should().Be("Dan");
        });
        test("ToVDFNode_Level1_PoppedOutNodes", function () {
            var a = VDFLoader.ToVDFNode("names{#}\n\
	Dan\n\
	Bob");
            a["names"][0].baseValue.Should().Be("Dan");
            a["names"][1].baseValue.Should().Be("Bob");
        });
        test("ToVDFNode_Level1_ArrayItemsInArrayItems", function () {
            var a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}|{3A}");
            a[0][0].baseValue.Should().Be("1A");
            a[0][1].baseValue.Should().Be("1B");
            a[1][0].baseValue.Should().Be("2A");
            a[1][1].baseValue.Should().Be("2B");
            a[2][0].baseValue.Should().Be("3A");
        });
        test("ToVDFNode_Level1_ArrayItemsInArrayItems_ValueEmpty", function () {
            var a = VDFLoader.ToVDFNode("{1A|}|{2A|}");
            a[0][0].baseValue.Should().Be("1A");
            ok(a[0][1].baseValue == null);
            a[1][0].baseValue.Should().Be("2A");
            ok(a[1][1].baseValue == null);
        });
        test("ToVDFNode_Level1_ArrayItemsInArrayItems_BothEmpty", function () {
            var a = VDFLoader.ToVDFNode("{|}|{|}");
            ok(a[0][0].baseValue == null);
            ok(a[0][1].baseValue == null);
            ok(a[1][0].baseValue == null);
            ok(a[1][1].baseValue == null);
        });
        test("ToVDFNode_Level1_DictionaryItems", function () {
            var a = VDFLoader.ToVDFNode("key1{value1}key2{value2}");
            a["key1"].baseValue.Should().Be("value1");
            a["key2"].baseValue.Should().Be("value2");
        });
        test("ToVDFNode_Level1_DictionaryItems_Complex", function () {
            var a = VDFLoader.ToVDFNode("uiPrefs{toolOptions{@@Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{>null}size{7}}@@}liveTool{Select}}");
            a["uiPrefs"]["toolOptions"].baseValue.Should().Be("Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{>null}size{7}}");
            a["uiPrefs"]["liveTool"].baseValue.Should().Be("Select");
        });
        test("ToVDFNode_Level1_DictionaryItems_TypesInferredFromGenerics", function () {
            var a = VDFLoader.ToVDFNode("HoldMesh>vertexColors{Dictionary[Vector3,Color]>>9,4,2.5{Black}1,8,9.5435{Gray}25,15,5{White}}");
            a["vertexColors"]["9,4,2.5"].baseValue.Should().Be("Black");
            a["vertexColors"]["1,8,9.5435"].baseValue.Should().Be("Gray");
            a["vertexColors"]["25,15,5"].baseValue.Should().Be("White");
        });
        test("ToVDFNode_Level1_PoppedOutItemGroups", function () {
            var a = VDFLoader.ToVDFNode("names{#}ages{#}\n\
	Dan\n\
	Bob\n\
	#10\n\
	20");
            a["names"][0].baseValue.Should().Be("Dan");
            a["names"][1].baseValue.Should().Be("Bob");
            a["ages"][0].baseValue.Should().Be("10");
            a["ages"][1].baseValue.Should().Be("20");
        });
        test("ToVDFNode_Level5_DeepNestedPoppedOutData", function () {
            var vdf = "\
Pack>name{Main}Scenarios>worlds{string,World>>Test1{vObjectRoot{VObject>name{VObjectRoot}children{VObject>>#}}}Test2{vObjectRoot{VObject>name{VObjectRoot}children{VObject>>#}}}}\n\
	id{System.Guid>025f28a5-a14b-446d-b324-2d274a476a63}name{#Types}children{}\n\
	#id{System.Guid>08e84f18-aecf-4b80-9c3f-ae0697d9033a}name{#Types}children{}";
            var livePackNode = VDFLoader.ToVDFNode(vdf, new VDFLoadOptions(null, true));
            livePackNode["worlds"]["Test1"].vObjectRoot.children[0].id.baseValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
            livePackNode["worlds"]["Test2"].vObjectRoot.children[0].id.baseValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
            var livePack = livePackNode.ToObject(new VDFLoadOptions(null, true));
            livePack.worlds["Test1"].vObjectRoot.children[0].id.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
            livePack.worlds["Test2"].vObjectRoot.children[0].id.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
        });

        // ToObject
        // ==================
        test("ToObject_Level0_Bool", function () {
            VDF.Deserialize("true", "bool").Should().Be(true);
        });
        test("ToObject_Level0_Float", function () {
            VDF.Deserialize("1.5", "float").Should().Be(1.5);
        });
        test("ToObject_Level1_PostDeserializeMethod", function () {
            var a = VDF.Deserialize("", "TypeWithPostDeserializeMethod");
            a.flag.Should().Be(true);
        });
        test("ToObject_Level1_PostDeserializeMethod_CustomMessageRequired", function () {
            VDF.Deserialize("", "TypeWithPostDeserializeMethod_CustomMessageRequired", new VDFLoadOptions("WrongMessage")).flag.Should().Be(false);
        });
        test("ToObject_Level1_InstantiateTypeManuallyThenFill", function () {
            var a = new TypeInstantiatedManuallyThenFilled();
            VDF.DeserializeInto("flag{true}", a);
            a.flag.Should().Be(true);
        });

        // unique to JavaScript version
        // ==================
        test("ToVDFNode_Level0_InferCompatibleTypeForUnknownType_Object", function () {
            var a = VDFLoader.ToVDFNode("UnknownType>string{Prop value string.}", new VDFLoadOptions(null, true));
            a["string"].baseValue.Should().Be("Prop value string.");
        });
        test("ToVDFNode_Level0_InferCompatibleTypeForUnknownType_BaseValue", function () {
            var a = VDFLoader.ToVDFNode("string{UnkownBaseType>Prop value string.}", new VDFLoadOptions(null, true));
            a["string"].baseValue.Should().Be("Prop value string.");
        });
        test("ToObject_AsObject", function () {
            var a = VDF.Deserialize("bool{bool>false}float{float>3.5}", "object");
            a.bool.Should().Be(false);
            a.float.Should().BeExactly(3.5);
        });
        test("ToObject_AsObject_NestedList", function () {
            var a = VDF.Deserialize("name{Soils}children{id{1.1.1.1}name{Grass}|id{1.1.1.2}name{Dirt}|id{1.1.1.3}name{Snow}}");
            a["children"].length.Should().Be(3);
        });
    };
    return Loading;
})();
//# sourceMappingURL=Loading.js.map
