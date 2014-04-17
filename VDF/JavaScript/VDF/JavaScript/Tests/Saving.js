/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
Saving.Init();
window["oldTest"](title, testFunc);
}*/
var Saving = (function () {
    function Saving() {
    }
    Saving.Init = function () {
        if (this.initialized)
            return;
        this.initialized = true;
        Object.prototype.AddFunction_Inline = function Should() {
            return { obj: this, Be: function (value, message) {
                    equal(this.obj, value, message);
                } };
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
            a.ToString().Should().Be("Root string.");

            a = new VDFNode();
            a.items.push(new VDFNode("Root string also."));
            a.ToString().Should().Be("Root string also.");
        });

        test("VDFNode_Level0_Metadata_Type", function (assert) {
            var a = new VDFNode();
            a.metadata_type = "string";
            a.baseValue = "Root string.";
            a.ToString().Should().Be("<string>Root string.");
        });

        test("VDFNode_Level1_BaseValues", function (assert) {
            var a = new VDFNode();
            a.properties.set("bool", new VDFNode("false"));
            a.properties.set("int", new VDFNode("5"));
            a.properties.set("float", new VDFNode(".5"));
            a.properties.set("string", new VDFNode("Prop value string."));
            a.ToString().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
        });
    };
    return Saving;
})();
//# sourceMappingURL=Saving.js.map
