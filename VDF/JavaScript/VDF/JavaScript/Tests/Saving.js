/*window["oldTest"] = test;
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
        test("VDFNode_Level0_BaseValue", function (assert) {
            var a = new VDFNode();
            a.baseValue = "Root string.";
            a.ToVDF().Should().Be("Root string.");

            a = new VDFNode();
            a[0] = new VDFNode("Root string also.");
            a.ToVDF().Should().Be("Root string also.");
        });

        test("VDFNode_Level0_Metadata_Type", function (assert) {
            var a = new VDFNode();
            a.metadata_type = "string";
            a.baseValue = "Root string.";
            a.ToVDF().Should().Be("<string>Root string.");
        });

        test("VDFNode_Level1_BaseValues", function (assert) {
            var a = new VDFNode();
            a["bool"] = new VDFNode("false");
            a["int"] = new VDFNode("5");
            a["float"] = new VDFNode(".5");
            a["string"] = new VDFNode("Prop value string.");
            a.ToVDF().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
        });

        test("VDFNode_Level1_AnonymousTypeProperties", function () {
            var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Float: .5, String: "Prop value string." });
            a["Bool"].baseValue.Should().Be("false");
            a["Int"].baseValue.Should().Be("5");
            a["Float"].baseValue.Should().Be(".5");
            a["String"].baseValue.Should().Be("Prop value string.");
            a.ToVDF().Should().Be("Bool{<bool>false}Int{<int>5}Float{<float>.5}String{<string>Prop value string.}");
        });

        test("ToString_Level1_NullValues", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
            a["obj"].baseValue.Should().Be("[#null]");
            a["strings"].baseValue.Should().Be("[#null]");
            equal(a["strings2"].baseValue, null); // it's just a VDFNode, with no children, representing a List
            a.ToVDF().Should().Be("obj{[#null]}strings{[#null]}strings2{}");
        });
        test("ToString_Level1_ListItems_Null", function () {
            var a = VDFSaver.ToVDFNode(new List("string", null));
            a[0].baseValue.Should().Be("[#null]");
            a.ToVDF().Should().Be("[#null]");
        });
        test("ToString_Level1_DictionaryValues_Null", function () {
            var a = VDFSaver.ToVDFNode(new Dictionary("string", "string", ["key1", null]));
            a.GetDictionaryValueNode("key1").baseValue.Should().Be("[#null]");
            a.ToVDF().Should().Be("{key1|[#null]}");
        });
    };
    return Saving;
})();
//# sourceMappingURL=Saving.js.map
