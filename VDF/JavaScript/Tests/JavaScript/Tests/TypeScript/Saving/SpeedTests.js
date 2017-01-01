System.register(["../../../Source/TypeScript/VDFTypeInfo", "../../../Source/TypeScript/VDFSaver", "../../../Source/TypeScript/VDFExtras", "../GeneralInit"], function (exports_1, context_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    function test(name, func) { tests.push({ name: name, func: func }); }
    var VDFTypeInfo_1, VDFSaver_1, VDFExtras_1, GeneralInit_1, tests, VDFTests;
    return {
        setters: [
            function (VDFTypeInfo_1_1) {
                VDFTypeInfo_1 = VDFTypeInfo_1_1;
            },
            function (VDFSaver_1_1) {
                VDFSaver_1 = VDFSaver_1_1;
            },
            function (VDFExtras_1_1) {
                VDFExtras_1 = VDFExtras_1_1;
            },
            function (GeneralInit_1_1) {
                GeneralInit_1 = GeneralInit_1_1;
            }
        ],
        execute: function () {
            exports_1("tests", tests = []);
            // tests
            // ==========
            (function (VDFTests) {
                var Saving_SpeedTests;
                (function (Saving_SpeedTests) {
                    var SpeedTest1_Class = (function () {
                        function SpeedTest1_Class() {
                            this.Bool = true;
                            this.Int = 5;
                            this.Double = .5;
                            this.String = "Prop value string.";
                            this.list = new VDFExtras_1.List("string", "2A", "2B");
                            this.nestedList = new VDFExtras_1.List("List(string)", new VDFExtras_1.List("string", "1A"));
                        }
                        return SpeedTest1_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], SpeedTest1_Class.prototype, "Bool", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("int"), VDFTypeInfo_1.P()
                    ], SpeedTest1_Class.prototype, "Int", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("double"), VDFTypeInfo_1.P()
                    ], SpeedTest1_Class.prototype, "Double", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("string"), VDFTypeInfo_1.P()
                    ], SpeedTest1_Class.prototype, "String", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P()
                    ], SpeedTest1_Class.prototype, "list", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("List(List(string))"), VDFTypeInfo_1.P()
                    ], SpeedTest1_Class.prototype, "nestedList", void 0);
                    test("SpeedTest1", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new SpeedTest1_Class(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
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
                    GeneralInit_1.ExportInternalClassesTo(window, function (str) { return eval(str); });
                })(Saving_SpeedTests || (Saving_SpeedTests = {}));
            })(VDFTests || (VDFTests = {}));
        }
    };
});
//# sourceMappingURL=SpeedTests.js.map