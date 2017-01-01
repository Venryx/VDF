System.register(["../../../Source/TypeScript/VDFTypeInfo", "../../../Source/TypeScript/VDFNode", "../../../Source/TypeScript/VDFSaver", "../../../Source/TypeScript/VDFExtras", "../../../Source/TypeScript/VDF", "../GeneralInit", "./FromObject", "./FromVDFNode", "./SpeedTests"], function (exports_1, context_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    function test(name, func) { tests.push({ name: name, func: func }); }
    var VDFTypeInfo_1, VDFNode_1, VDFSaver_1, VDFExtras_1, VDF_1, GeneralInit_1, FromObject_1, FromVDFNode_1, SpeedTests_1, tests, VDFTests;
    return {
        setters: [
            function (VDFTypeInfo_1_1) {
                VDFTypeInfo_1 = VDFTypeInfo_1_1;
            },
            function (VDFNode_1_1) {
                VDFNode_1 = VDFNode_1_1;
            },
            function (VDFSaver_1_1) {
                VDFSaver_1 = VDFSaver_1_1;
            },
            function (VDFExtras_1_1) {
                VDFExtras_1 = VDFExtras_1_1;
            },
            function (VDF_1_1) {
                VDF_1 = VDF_1_1;
            },
            function (GeneralInit_1_1) {
                GeneralInit_1 = GeneralInit_1_1;
            },
            function (FromObject_1_1) {
                FromObject_1 = FromObject_1_1;
            },
            function (FromVDFNode_1_1) {
                FromVDFNode_1 = FromVDFNode_1_1;
            },
            function (SpeedTests_1_1) {
                SpeedTests_1 = SpeedTests_1_1;
            }
        ],
        execute: function () {
            exports_1("tests", tests = FromObject_1.tests.concat(FromVDFNode_1.tests).concat(SpeedTests_1.tests));
            // tests
            // ==========
            (function (VDFTests) {
                var Saving_General;
                (function (Saving_General) {
                    // general
                    // ==========
                    test("NodePathToStringReturnsX", function () {
                        var path = new VDFExtras_1.VDFNodePath(new VDFExtras_1.List("VDFNodePathNode"));
                        path.nodes.push(new VDFExtras_1.VDFNodePathNode(null, new VDFTypeInfo_1.VDFPropInfo("prop1", null, [])));
                        path.nodes.push(new VDFExtras_1.VDFNodePathNode(null, null, 1));
                        path.nodes.push(new VDFExtras_1.VDFNodePathNode(null, null, null, 2));
                        path.nodes.push(new VDFExtras_1.VDFNodePathNode(null, null, null, null, "key1"));
                        path.toString().Should().Be("prop1/i:1/ki:2/k:key1");
                    });
                    // prop-inclusion by regex
                    // ==========
                    var D1_Map_PropWithNameMatchingIncludeRegex_Class = (function () {
                        function D1_Map_PropWithNameMatchingIncludeRegex_Class() {
                            this._notMatching = true;
                            this.matching = true;
                        }
                        return D1_Map_PropWithNameMatchingIncludeRegex_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool")
                    ], D1_Map_PropWithNameMatchingIncludeRegex_Class.prototype, "_notMatching", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool")
                    ], D1_Map_PropWithNameMatchingIncludeRegex_Class.prototype, "matching", void 0);
                    D1_Map_PropWithNameMatchingIncludeRegex_Class = __decorate([
                        VDFTypeInfo_1.TypeInfo("^[^_]")
                    ], D1_Map_PropWithNameMatchingIncludeRegex_Class);
                    test("D1_Map_PropWithNameMatchingIncludeRegex", function () {
                        VDF_1.VDF.Serialize(new D1_Map_PropWithNameMatchingIncludeRegex_Class(), "D1_Map_PropWithNameMatchingIncludeRegex_Class").Should().Be("{matching:true}");
                    });
                    var D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base = (function () {
                        function D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base() {
                        }
                        return D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base;
                    }());
                    D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base = __decorate([
                        VDFTypeInfo_1.TypeInfo("^[^_]")
                    ], D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base);
                    var D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived = (function (_super) {
                        __extends(D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived, _super);
                        function D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived() {
                            var _this = _super.apply(this, arguments) || this;
                            _this._notMatching = true;
                            _this.matching = true;
                            return _this;
                        }
                        return D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived;
                    }(D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base));
                    __decorate([
                        VDFTypeInfo_1.T("bool")
                    ], D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype, "_notMatching", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool")
                    ], D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype, "matching", void 0);
                    D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived = __decorate([
                        VDFTypeInfo_1.TypeInfo()
                    ], D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived);
                    test("D1_Map_PropWithNameMatchingBaseClassIncludeRegex", function () {
                        VDF_1.VDF.Serialize(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived(), "D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived").Should().Be("{matching:true}");
                    });
                    // serialize-related methods
                    // ==========
                    var D1_MapWithEmbeddedSerializeMethod_Prop_Class = (function () {
                        function D1_MapWithEmbeddedSerializeMethod_Prop_Class() {
                            this.notIncluded = true;
                            this.included = true;
                        }
                        D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype.Serialize = function () {
                            var result = new VDFNode_1.VDFNode();
                            result.SetMapChild(new VDFNode_1.VDFNode("included"), new VDFNode_1.VDFNode(this.included));
                            return result;
                        };
                        return D1_MapWithEmbeddedSerializeMethod_Prop_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool")
                    ], D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype, "notIncluded", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool")
                    ], D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype, "included", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFSerialize()
                    ], D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype, "Serialize", null);
                    //AddAttributes().type = D1_MapWithEmbeddedSerializeMethod_Prop_Class;
                    test("D1_MapWithEmbeddedSerializeMethod_Prop", function () {
                        VDF_1.VDF.Serialize(new D1_MapWithEmbeddedSerializeMethod_Prop_Class(), "D1_MapWithEmbeddedSerializeMethod_Prop_Class").Should().Be("{included:true}");
                    });
                    var D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class = (function () {
                        function D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class() {
                            this.boolProp = true;
                        }
                        D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class.prototype.Serialize = function () { return; };
                        return D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class.prototype, "boolProp", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFSerialize()
                    ], D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class.prototype, "Serialize", null);
                    test("D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop", function () {
                        VDF_1.VDF.Serialize(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class(), "D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class").Should().Be("{boolProp:true}");
                    });
                    var D1_Map_MapThatCancelsItsSerialize_Class_Parent = (function () {
                        function D1_Map_MapThatCancelsItsSerialize_Class_Parent() {
                            this.child = new D1_Map_MapThatCancelsItsSerialize_Class_Child();
                        }
                        return D1_Map_MapThatCancelsItsSerialize_Class_Parent;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("D1_Map_MapThatCancelsItsSerialize_Class_Child"), VDFTypeInfo_1.P()
                    ], D1_Map_MapThatCancelsItsSerialize_Class_Parent.prototype, "child", void 0);
                    var D1_Map_MapThatCancelsItsSerialize_Class_Child = (function () {
                        function D1_Map_MapThatCancelsItsSerialize_Class_Child() {
                        }
                        D1_Map_MapThatCancelsItsSerialize_Class_Child.prototype.Serialize = function () { return VDF_1.VDF.CancelSerialize; };
                        return D1_Map_MapThatCancelsItsSerialize_Class_Child;
                    }());
                    __decorate([
                        VDFTypeInfo_1._VDFSerialize()
                    ], D1_Map_MapThatCancelsItsSerialize_Class_Child.prototype, "Serialize", null);
                    test("D1_Map_MapThatCancelsItsSerialize", function () {
                        VDF_1.VDF.Serialize(new D1_Map_MapThatCancelsItsSerialize_Class_Parent(), "D1_Map_MapThatCancelsItsSerialize_Class_Parent").Should().Be("{}");
                    });
                    // for JSON compatibility
                    // ==========
                    var D0_MapWithMetadataDisabled_Class = (function () {
                        function D0_MapWithMetadataDisabled_Class() {
                        }
                        return D0_MapWithMetadataDisabled_Class;
                    }());
                    test("D0_MapWithMetadataDisabled", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new D0_MapWithMetadataDisabled_Class(), new VDFSaver_1.VDFSaveOptions({ useMetadata: false }));
                        ok(a.metadata == null); //a.metadata.Should().Be(null);
                    });
                    var D0_Map_List_BoolsWithPopOutDisabled_Class = (function () {
                        function D0_Map_List_BoolsWithPopOutDisabled_Class() {
                            this.ints = new VDFExtras_1.List("int", 0, 1);
                        }
                        return D0_Map_List_BoolsWithPopOutDisabled_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("List(int)"), VDFTypeInfo_1.P()
                    ], D0_Map_List_BoolsWithPopOutDisabled_Class.prototype, "ints", void 0);
                    test("D0_Map_List_BoolsWithPopOutDisabled", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new D0_Map_List_BoolsWithPopOutDisabled_Class(), "D0_Map_List_BoolsWithPopOutDisabled_Class", new VDFSaver_1.VDFSaveOptions({ useChildPopOut: false }));
                        a.ToVDF().Should().Be("{ints:[0 1]}");
                    });
                    test("D1_Map_IntsWithStringKeys", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.Dictionary("object", "object", {
                            key1: 0,
                            key2: 1
                        }), new VDFSaver_1.VDFSaveOptions({ useStringKeys: true }));
                        a.ToVDF(new VDFSaver_1.VDFSaveOptions({ useStringKeys: true })).Should().Be("{\"key1\":0 \"key2\":1}");
                    });
                    test("D1_Map_DoublesWithNumberTrimmingDisabled", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("object", .1, 1.1), new VDFSaver_1.VDFSaveOptions({ useNumberTrimming: false }));
                        a.ToVDF(new VDFSaver_1.VDFSaveOptions({ useNumberTrimming: false })).Should().Be("[0.1 1.1]");
                    });
                    test("D1_List_IntsWithCommaSeparators", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("object", 0, 1), new VDFSaver_1.VDFSaveOptions({ useCommaSeparators: true }));
                        a.listChildren.Count.Should().Be(2);
                        a.ToVDF(new VDFSaver_1.VDFSaveOptions({ useCommaSeparators: true })).Should().Be("[0,1]");
                    });
                    // export all classes/enums to global scope
                    GeneralInit_1.ExportInternalClassesTo(window, function (str) { return eval(str); });
                    // make sure we create one instance, so that the type-info attachment code can run
                    (new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base()).toString();
                })(Saving_General || (Saving_General = {}));
            })(VDFTests || (VDFTests = {}));
        }
    };
});
//# sourceMappingURL=S_General.js.map