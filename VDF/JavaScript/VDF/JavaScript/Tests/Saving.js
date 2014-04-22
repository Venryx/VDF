﻿/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
Saving.Init();
window["oldTest"](title, testFunc);
}*/
var TypeWithNullProps = (function () {
    function TypeWithNullProps() {
        this.strings2 = new List("string");
    }
    TypeWithNullProps.typeInfo = new VDFTypeInfo(false, {
        obj: new VDFPropInfo("object", true),
        strings: new VDFPropInfo("List[string]", true),
        strings2: new VDFPropInfo("List[string]", true)
    });
    return TypeWithNullProps;
})();
var TypeWithPreSerializePrepMethod = (function () {
    function TypeWithPreSerializePrepMethod() {
    }
    TypeWithPreSerializePrepMethod.prototype.VDFPreSerialize = function () {
        this.preSerializeWasCalled = true;
    };
    TypeWithPreSerializePrepMethod.typeInfo = new VDFTypeInfo(false, {
        preSerializeWasCalled: new VDFPropInfo("bool", true)
    });
    return TypeWithPreSerializePrepMethod;
})();
var TypeWithMixOfProps = (function () {
    function TypeWithMixOfProps() {
        this.Bool = true;
        this.Int = 5;
        this.Float = .5;
        this.String = "Prop value string.";
        this.list = new List("string", "2A", "2B");
        this.nestedList = new List("List[string]", new List("string", "1A"));
    }
    TypeWithMixOfProps.typeInfo = new VDFTypeInfo(false, {
        Bool: new VDFPropInfo("bool", true),
        Int: new VDFPropInfo("int", true),
        Float: new VDFPropInfo("float", true),
        String: new VDFPropInfo("string", true),
        list: new VDFPropInfo("List[string]", true),
        nestedList: new VDFPropInfo("List[List[string]]", true)
    });
    return TypeWithMixOfProps;
})();
var Saving = (function () {
    function Saving() {
    }
    Saving.Init = function () {
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

    Saving.RunTests = function () {
        test("ToVDF_Level0_BaseValue", function () {
            var a = new VDFNode();
            a.baseValue = "Root string.";
            a.ToVDF().Should().Be("Root string.");

            a = new VDFNode();
            a[0] = new VDFNode("Root string also.");
            a.ToVDF().Should().Be("Root string also.");
        });
        test("ToVDF_Level0_Metadata_Type", function () {
            var a = new VDFNode();
            a.metadata_type = "string";
            a.baseValue = "Root string.";
            a.ToVDF().Should().Be("string>Root string.");
        });
        test("ToVDF_Level0_Metadata_Type_Collapsed", function () {
            var a = VDFSaver.ToVDFNode(new List("string"), new VDFSaveOptions(2 /* AssemblyExternal */));
            a.ToVDF().Should().Be("string>>");
            a = VDFSaver.ToVDFNode(new List("List[string]", new List("string", "1A", "1B", "1C")), new VDFSaveOptions(2 /* AssemblyExternal */));
            a.ToVDF().Should().Be("List[List[string]]>>{1A|1B|1C}"); // only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
        });

        test("ToVDF_Level1_BaseValues", function () {
            var a = new VDFNode();
            a["bool"] = new VDFNode("false");
            a["int"] = new VDFNode("5");
            a["float"] = new VDFNode(".5");
            a["string"] = new VDFNode("Prop value string.");
            a.ToVDF().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
        });
        test("ToVDF_Level1_NullValues", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
            a["obj"].baseValue.Should().Be("[#null]");
            a["strings"].baseValue.Should().Be("[#null]");
            equal(a["strings2"].baseValue, null); // it's just a VDFNode, with no children, representing a List
            a.ToVDF().Should().Be("TypeWithNullProps>obj{[#null]}strings{[#null]}strings2{}");
        });
        test("ToVDF_Level1_ListItems_Null", function () {
            var a = VDFSaver.ToVDFNode(new List("string", null));
            a[0].baseValue.Should().Be("[#null]");
            a.ToVDF().Should().Be("string>>[#null]");
        });
        test("ToVDF_Level1_DictionaryValues_Null", function () {
            var a = VDFSaver.ToVDFNode(new Dictionary("string", "string", ["key1", null]));
            a["key1"].baseValue.Should().Be("[#null]");
            a.ToVDF().Should().Be("string,string>>key1{[#null]}");
        });
        test("ToVDF_Level1_PreSerializePreparation", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod());
            a["preSerializeWasCalled"].AsBool.Should().Be(true);
            a.ToVDF().Should().Be("TypeWithPreSerializePrepMethod>preSerializeWasCalled{true}");
        });
        test("ToVDF_Level1_TypeProperties_MarkForNone", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(0 /* None */));
            a["Bool"].baseValue.Should().Be("true");
            a["Int"].baseValue.Should().Be("5");
            a["Float"].baseValue.Should().Be(".5");
            a["String"].baseValue.Should().Be("Prop value string.");
            a["list"][0].baseValue.Should().Be("2A");
            a["list"][1].baseValue.Should().Be("2B");
            a["nestedList"][0][0].baseValue.Should().Be("1A");
            a.ToVDF().Should().Be("Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
        });
        test("ToVDF_Level1_TypeProperties_MarkForAssembly", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(1 /* Assembly */));
            a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
        });
        test("ToVDF_Level1_TypeProperties_MarkForAssemblyExternal", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(2 /* AssemblyExternal */));
            a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{>true}Int{>5}Float{>.5}String{Prop value string.}list{string>>2A|2B}nestedList{List[List[string]]>>{string>>1A}}");
        });
        test("ToVDF_Level1_TypeProperties_MarkForAssemblyExternalNoCollapse", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(3 /* AssemblyExternalNoCollapse */));
            a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{bool>true}Int{int>5}Float{float>.5}String{string>Prop value string.}list{List[string]>>string>2A|string>2B}nestedList{List[List[string]]>>{List[string]>>string>1A}}");
        });
    };
    return Saving;
})();
//# sourceMappingURL=Saving.js.map
