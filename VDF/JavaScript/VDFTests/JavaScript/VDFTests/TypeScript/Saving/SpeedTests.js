// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Saving_SpeedTests;
    (function (Saving_SpeedTests) {
        var SpeedTest1_Class = (function () {
            function SpeedTest1_Class() {
                this.Bool = Prop(this, "Bool", "bool", new P()).set = true;
                this.Int = Prop(this, "Int", "int", new P()).set = 5;
                this.Double = Prop(this, "Double", "double", new P()).set = .5;
                this.String = Prop(this, "String", "string", new P()).set = "Prop value string.";
                this.list = Prop(this, "list", "List(string)", new P()).set = new List("string", "2A", "2B");
                this.nestedList = Prop(this, "nestedList", "List(List(string))", new P()).set = new List("List(string)", new List("string", "1A"));
            }
            return SpeedTest1_Class;
        })();
        test("SpeedTest1", function () {
            var a = VDFSaver.ToVDFNode(new SpeedTest1_Class(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
            a["Bool"].primitiveValue.Should().Be(true);
            a["Int"].primitiveValue.Should().Be(5);
            a["Double"].primitiveValue.Should().Be(.5);
            a["String"].primitiveValue.Should().Be("Prop value string.");
            a["list"][0].primitiveValue.Should().Be("2A");
            a["list"][1].primitiveValue.Should().Be("2B");
            a["nestedList"][0][0].primitiveValue.Should().Be("1A");
            //for (var i = 0; i < 10000; i++)
            var vdf = a.ToVDF();
        });
        // export all classes/enums to global scope
        ExportInternalClassesTo(window, function (str) { return eval(str); });
    })(Saving_SpeedTests || (Saving_SpeedTests = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=SpeedTests.js.map