System.register(["../../../Source/TypeScript/VDFTypeInfo", "../../../Source/TypeScript/VDF", "../../../Source/TypeScript/VDFLoader", "../GeneralInit", "./SpeedTests", "./ToObject", "./ToVDFNode"], function (exports_1, context_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    function test(name, func) { tests.push({ name: name, func: func }); }
    var VDFTypeInfo_1, VDF_1, VDFLoader_1, GeneralInit_1, SpeedTests_1, ToObject_1, ToVDFNode_1, tests, VDFTests;
    return {
        setters: [
            function (VDFTypeInfo_1_1) {
                VDFTypeInfo_1 = VDFTypeInfo_1_1;
            },
            function (VDF_1_1) {
                VDF_1 = VDF_1_1;
            },
            function (VDFLoader_1_1) {
                VDFLoader_1 = VDFLoader_1_1;
            },
            function (GeneralInit_1_1) {
                GeneralInit_1 = GeneralInit_1_1;
            },
            function (SpeedTests_1_1) {
                SpeedTests_1 = SpeedTests_1_1;
            },
            function (ToObject_1_1) {
                ToObject_1 = ToObject_1_1;
            },
            function (ToVDFNode_1_1) {
                ToVDFNode_1 = ToVDFNode_1_1;
            }
        ],
        execute: function () {
            exports_1("tests", tests = SpeedTests_1.tests.concat(ToObject_1.tests).concat(ToVDFNode_1.tests));
            // tests
            // ==========
            (function (VDFTests) {
                var Loading_General;
                (function (Loading_General) {
                    // deserialize-related methods
                    // ==========
                    var D1_MapWithEmbeddedDeserializeMethod_Prop_Class = (function () {
                        function D1_MapWithEmbeddedDeserializeMethod_Prop_Class() {
                            this.boolProp = false;
                        }
                        D1_MapWithEmbeddedDeserializeMethod_Prop_Class.prototype.Deserialize = function (node) { this.boolProp = node["boolProp"].primitiveValue; };
                        return D1_MapWithEmbeddedDeserializeMethod_Prop_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.P()
                    ], D1_MapWithEmbeddedDeserializeMethod_Prop_Class.prototype, "boolProp", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFDeserialize()
                    ], D1_MapWithEmbeddedDeserializeMethod_Prop_Class.prototype, "Deserialize", null);
                    test("D1_MapWithEmbeddedDeserializeMethod_Prop", function () { VDF_1.VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethod_Prop_Class").boolProp.Should().Be(true); });
                    var D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class = (function () {
                        function D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class() {
                            this.boolProp = false;
                        }
                        D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class.prototype.Deserialize = function (node) { return; };
                        return D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.P()
                    ], D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class.prototype, "boolProp", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFDeserialize()
                    ], D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class.prototype, "Deserialize", null);
                    test("D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop", function () { VDF_1.VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class").boolProp.Should().Be(true); });
                    var D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent = (function () {
                        function D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent() {
                            this.child = null;
                        }
                        return D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child"), VDFTypeInfo_1.P()
                    ], D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent.prototype, "child", void 0);
                    var D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child = (function () {
                        function D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child() {
                        }
                        D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize = function (node, path, options) { return null; };
                        return D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child;
                    }());
                    __decorate([
                        VDFTypeInfo_1._VDFDeserialize(true)
                    ], D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child, "Deserialize", null);
                    test("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop", function () { ok(VDF_1.VDF.Deserialize("{child:{}}", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent").child == null); });
                    var D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent = (function () {
                        function D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent() {
                            this.child = null;
                        }
                        return D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child"), VDFTypeInfo_1.P()
                    ], D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent.prototype, "child", void 0);
                    var D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child = (function () {
                        function D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child() {
                            this.boolProp = false;
                        }
                        D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child.Deserialize = function (node, path, options) { return; };
                        return D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child.prototype, "boolProp", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFDeserialize(true)
                    ], D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child, "Deserialize", null);
                    test("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop", function () { VDF_1.VDF.Deserialize("{child:{boolProp: true}}", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent").child.boolProp.Should().Be(true); });
                    var D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent = (function () {
                        function D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent() {
                            this.withoutTag = null;
                            this.withTag = null; // doesn't actually have tag; just pretend it does
                        }
                        return D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child"), VDFTypeInfo_1.P()
                    ], D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent.prototype, "withoutTag", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child"), VDFTypeInfo_1.P()
                    ], D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent.prototype, "withTag", void 0);
                    var D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child = (function () {
                        function D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child() {
                            this.methodCalled = false;
                        }
                        D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child.prototype.Deserialize = function (node, path, options) {
                            ok(path.parentNode.obj instanceof D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent);
                            if (path.currentNode.prop.name == "withTag")
                                this.methodCalled = true;
                        };
                        return D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child.prototype, "methodCalled", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFDeserialize()
                    ], D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child.prototype, "Deserialize", null);
                    test("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag", function () {
                        var a = VDF_1.VDF.Deserialize("{withoutTag:{} withTag:{}}", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent");
                        a.withoutTag.methodCalled.Should().Be(false);
                        a.withTag.methodCalled.Should().Be(true);
                    });
                    // for JSON compatibility
                    // ==========
                    test("D1_Map_IntsWithStringKeys", function () {
                        var a = VDFLoader_1.VDFLoader.ToVDFNode("{\"key1\":0 \"key2\":1}", new VDFLoader_1.VDFLoadOptions({ allowStringKeys: true }));
                        a.mapChildren.Count.Should().Be(2);
                        a["key1"].primitiveValue.Should().Be(0);
                    });
                    test("D1_List_IntsWithCommaSeparators", function () {
                        var a = VDFLoader_1.VDFLoader.ToVDFNode("[0,1]", new VDFLoader_1.VDFLoadOptions({ allowCommaSeparators: true }));
                        a.listChildren.Count.Should().Be(2);
                        a[0].primitiveValue.Should().Be(0);
                    });
                    test("D3_List_NumbersWithScientificNotation", function () {
                        var a = VDFLoader_1.VDFLoader.ToVDFNode("[-7.45058e-09,0.1,-1.49012e-08]", new VDFLoader_1.VDFLoadOptions().ForJSON());
                        a[0].primitiveValue.Should().Be(-7.45058e-09);
                    });
                    // unique to JavaScript version
                    // ==========
                    var PretendGenericType = (function () {
                        function PretendGenericType() {
                        }
                        return PretendGenericType;
                    }());
                    test("Depth0_ObjectWithMetadataHavingGenericType", function () { return ok(VDF_1.VDF.Deserialize("PretendGenericType(object)>{}") instanceof PretendGenericType); });
                    test("Depth1_UnknownTypeWithFixOn_String", function () {
                        var a = VDF_1.VDF.Deserialize("UnknownType>{string:'Prop value string.'}", new VDFLoader_1.VDFLoadOptions({ loadUnknownTypesAsBasicTypes: true }));
                        a["string"].Should().Be("Prop value string.");
                    });
                    test("Depth1_UnknownTypeWithFixOff_String", function () {
                        try {
                            VDF_1.VDF.Deserialize("UnknownType>{string:'Prop value string.'}");
                        }
                        catch (ex) {
                            ok(ex.message == "Could not find type \"UnknownType\".");
                        }
                    });
                    test("Depth1_Object_UnknownTypeWithFixOn", function () {
                        var a = VDF_1.VDF.Deserialize("{string:UnkownBaseType>'Prop value string.'}", new VDFLoader_1.VDFLoadOptions({ loadUnknownTypesAsBasicTypes: true }));
                        a["string"].Should().Be("Prop value string.");
                    });
                    test("AsObject", function () {
                        var a = VDF_1.VDF.Deserialize("{bool:bool>false double:double>3.5}", "object");
                        a.bool.Should().Be(false);
                        a.double.Should().Be(3.5);
                    });
                    var AsObjectOfType_Class = (function () {
                        function AsObjectOfType_Class() {
                        }
                        return AsObjectOfType_Class;
                    }());
                    test("AsObjectOfType", function () {
                        var a = VDF_1.VDF.Deserialize("AsObjectOfType_Class>{}", "AsObjectOfType_Class");
                        ok(a instanceof AsObjectOfType_Class);
                    });
                    // quick tests
                    // ==========
                    test("QuickTest1", function () {
                        var a = VDF_1.VDF.Deserialize('{^}\n\
	structures:[^]\n\
		{typeVObject:string>"VObject>Flag" id:0}\n\
		{typeVObject:string>"VObject>Flag" id:1}', "object");
                        a.structures[0].typeVObject.Should().Be("VObject>Flag");
                        a.structures[1].id.Should().Be(1);
                    });
                    // export all classes/enums to global scope
                    GeneralInit_1.ExportInternalClassesTo(window, function (str) { return eval(str); });
                })(Loading_General || (Loading_General = {}));
            })(VDFTests || (VDFTests = {}));
        }
    };
});
//# sourceMappingURL=L_General.js.map