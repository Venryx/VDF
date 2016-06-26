/*class Loading {
    static initialized = false;
    static Init() {
        if (this.initialized)
            return;
        this.initialized = true;
        Object.prototype._AddFunction_Inline = function Should() {
            return {
                Be: (value, message?: string) => { equal(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); },
                BeExactly: (value, message?: string) => { strictEqual(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); }
            };
        };
    }

    static RunTests() {
        /*test("testName() {
            ok(null == null);
        });*#/
    }
}*/
// init
// ==========
var loading = {};
function Loading_RunTests() {
    for (var name in loading)
        test_old(name, loading[name]);
}
// the normal "test" function actually runs test
// here we replace it with a function that merely "registers the test to be run later on" (when the Loading button is pressed)
window["test"] = function (name, func) { loading[name] = func; };
// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Loading_General;
    (function (Loading_General) {
        // deserialize-related methods
        // ==========
        var D1_MapWithEmbeddedDeserializeMethod_Prop_Class = (function () {
            function D1_MapWithEmbeddedDeserializeMethod_Prop_Class() {
                this.boolProp = Prop(this, "boolProp", "bool", new P()).set = false;
                this.Deserialize.AddTags(new VDFDeserialize());
            }
            D1_MapWithEmbeddedDeserializeMethod_Prop_Class.prototype.Deserialize = function (node) { this.boolProp = node["boolProp"].primitiveValue; };
            return D1_MapWithEmbeddedDeserializeMethod_Prop_Class;
        })();
        test("D1_MapWithEmbeddedDeserializeMethod_Prop", function () { VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethod_Prop_Class").boolProp.Should().Be(true); });
        var D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class = (function () {
            function D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class() {
                this.boolProp = Prop(this, "boolProp", "bool", new P()).set = false;
                this.Deserialize.AddTags(new VDFDeserialize());
            }
            D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class.prototype.Deserialize = function (node) { return VDF.NoActionTaken; };
            return D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class;
        })();
        test("D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop", function () { VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class").boolProp.Should().Be(true); });
        var D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent = (function () {
            function D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent() {
                this.child = Prop(this, "child", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child", new P()).set = null;
            }
            return D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent;
        })();
        var D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child = (function () {
            function D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child() {
            }
            D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize = function (node, path, options) { return null; };
            return D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child;
        })();
        D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize.AddTags(new VDFDeserialize(true));
        test("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop", function () { ok(VDF.Deserialize("{child:{}}", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent").child == null); });
        var D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent = (function () {
            function D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent() {
                this.child = Prop(this, "child", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child", new P()).set = null;
            }
            return D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent;
        })();
        var D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child = (function () {
            function D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child() {
                this.boolProp = Prop(this, "boolProp", "bool", new P()).set = false;
                D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize.AddTags(new VDFDeserialize(true));
            }
            D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child.Deserialize = function (node, path, options) { return VDF.NoActionTaken; };
            return D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child;
        })();
        test("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop", function () { VDF.Deserialize("{child:{boolProp: true}}", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent").child.boolProp.Should().Be(true); });
        var D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent = (function () {
            function D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent() {
                this.withoutTag = Prop(this, "withoutTag", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child", new P()).set = null;
                this.withTag = Prop(this, "withTag", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child", new P()).set = null; // doesn't actually have tag; just pretend it does
            }
            return D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent;
        })();
        var D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child = (function () {
            function D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child() {
                this.methodCalled = Prop(this, "methodCalled", "bool", new P()).set = false;
                this.Deserialize.AddTags(new VDFDeserialize());
            }
            D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child.prototype.Deserialize = function (node, path, options) {
                ok(path.parentNode.obj instanceof D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent);
                if (path.currentNode.prop.name == "withTag")
                    this.methodCalled = true;
            };
            return D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child;
        })();
        test("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag", function () {
            var a = VDF.Deserialize("{withoutTag:{} withTag:{}}", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent");
            a.withoutTag.methodCalled.Should().Be(false);
            a.withTag.methodCalled.Should().Be(true);
        });
        // for JSON compatibility
        // ==========
        test("D1_Map_IntsWithStringKeys", function () {
            var a = VDFLoader.ToVDFNode("{\"key1\":0 \"key2\":1}", new VDFLoadOptions({ allowStringKeys: true }));
            a.mapChildren.Count.Should().Be(2);
            a["key1"].primitiveValue.Should().Be(0);
        });
        test("D1_List_IntsWithCommaSeparators", function () {
            var a = VDFLoader.ToVDFNode("[0,1]", new VDFLoadOptions({ allowCommaSeparators: true }));
            a.listChildren.Count.Should().Be(2);
            a[0].primitiveValue.Should().Be(0);
        });
        test("D3_List_NumbersWithScientificNotation", function () {
            var a = VDFLoader.ToVDFNode("[-7.45058e-09,0.1,-1.49012e-08]", new VDFLoadOptions().ForJSON());
            a[0].primitiveValue.Should().Be(-7.45058e-09);
        });
        // unique to JavaScript version
        // ==========
        var PretendGenericType = (function () {
            function PretendGenericType() {
            }
            return PretendGenericType;
        })();
        test("Depth0_ObjectWithMetadataHavingGenericType", function () { return ok(VDF.Deserialize("PretendGenericType(object)>{}") instanceof PretendGenericType); });
        test("Depth1_UnknownTypeWithFixOn_String", function () {
            var a = VDF.Deserialize("UnknownType>{string:'Prop value string.'}", new VDFLoadOptions({ loadUnknownTypesAsBasicTypes: true }));
            a["string"].Should().Be("Prop value string.");
        });
        test("Depth1_UnknownTypeWithFixOff_String", function () {
            try {
                VDF.Deserialize("UnknownType>{string:'Prop value string.'}");
            }
            catch (ex) {
                ok(ex.message == "Could not find type \"UnknownType\".");
            }
        });
        test("Depth1_Object_UnknownTypeWithFixOn", function () {
            var a = VDF.Deserialize("{string:UnkownBaseType>'Prop value string.'}", new VDFLoadOptions({ loadUnknownTypesAsBasicTypes: true }));
            a["string"].Should().Be("Prop value string.");
        });
        test("AsObject", function () {
            var a = VDF.Deserialize("{bool:bool>false double:double>3.5}", "object");
            a.bool.Should().Be(false);
            a.double.Should().Be(3.5);
        });
        var AsObjectOfType_Class = (function () {
            function AsObjectOfType_Class() {
            }
            return AsObjectOfType_Class;
        })();
        test("AsObjectOfType", function () {
            var a = VDF.Deserialize("AsObjectOfType_Class>{}", "AsObjectOfType_Class");
            ok(a instanceof AsObjectOfType_Class);
        });
        // export all classes/enums to global scope
        ExportInternalClassesTo(window, function (str) { return eval(str); });
    })(Loading_General || (Loading_General = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=L_General.js.map