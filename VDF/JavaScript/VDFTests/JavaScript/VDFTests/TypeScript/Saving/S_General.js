/// <reference path="../../../VDF/TypeScript/VDFTypeInfo.ts" />
/*class Saving {
    static initialized: boolean;
    static Init() 	{
        if (this.initialized)
            return;
        this.initialized = true;
        Object.prototype._AddFunction_Inline = function Should() 		{
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
var saving = {};
function Saving_RunTests() {
    for (var name in saving)
        test_old(name, saving[name]);
}
// the normal "test" function actually runs test
// here we replace it with a function that merely "registers the test to be run later on" (when the Saving button is pressed)
window["test"] = function (name, func) { saving[name] = func; };
// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Saving_General;
    (function (Saving_General) {
        // prop-inclusion by regex
        // ==========
        var D1_Map_PropWithNameMatchingIncludeRegex_Class = (function () {
            function D1_Map_PropWithNameMatchingIncludeRegex_Class() {
                this._helper = TypeInfo(new VDFType("^[^_]")).set = this;
                this._notMatching = Prop(this, "_notMatching", "bool").set = true;
                this.matching = Prop(this, "matching", "bool").set = true;
            }
            return D1_Map_PropWithNameMatchingIncludeRegex_Class;
        }());
        test("D1_Map_PropWithNameMatchingIncludeRegex", function () { VDF.Serialize(new D1_Map_PropWithNameMatchingIncludeRegex_Class(), "D1_Map_PropWithNameMatchingIncludeRegex_Class").Should().Be("{matching:true}"); });
        var D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base = (function () {
            function D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base() {
                this._helper = TypeInfo(new VDFType("^[^_]")).set = this;
            }
            return D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base;
        }());
        var D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived = (function () {
            function D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived() {
                this._helper = TypeInfo(new VDFType()).set = this;
                this._notMatching = Prop(this, "_notMatching", "bool").set = true;
                this.matching = Prop(this, "matching", "bool").set = true;
            }
            return D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived;
        }());
        D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype["__proto__"] = D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base.prototype;
        test("D1_Map_PropWithNameMatchingBaseClassIncludeRegex", function () { VDF.Serialize(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived(), "D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived").Should().Be("{matching:true}"); });
        // serialize-related methods
        // ==========
        var D1_MapWithEmbeddedSerializeMethod_Prop_Class = (function () {
            function D1_MapWithEmbeddedSerializeMethod_Prop_Class() {
                this.notIncluded = Prop(this, "notIncluded", "bool").set = true;
                this.included = Prop(this, "included", "bool").set = true;
                this.Serialize.AddTags(new VDFSerialize());
            }
            D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype.Serialize = function () {
                var result = new VDFNode();
                result.SetMapChild(new VDFNode("included"), new VDFNode(this.included));
                return result;
            };
            return D1_MapWithEmbeddedSerializeMethod_Prop_Class;
        }());
        //AddAttributes().type = D1_MapWithEmbeddedSerializeMethod_Prop_Class;
        test("D1_MapWithEmbeddedSerializeMethod_Prop", function () { VDF.Serialize(new D1_MapWithEmbeddedSerializeMethod_Prop_Class(), "D1_MapWithEmbeddedSerializeMethod_Prop_Class").Should().Be("{included:true}"); });
        var D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class = (function () {
            function D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class() {
                this.boolProp = Prop(this, "boolProp", "bool", new P()).set = true;
                this.Serialize.AddTags(new VDFSerialize());
            }
            D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class.prototype.Serialize = function () { return; };
            return D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class;
        }());
        test("D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop", function () { VDF.Serialize(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class(), "D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class").Should().Be("{boolProp:true}"); });
        var D1_Map_MapThatCancelsItsSerialize_Class_Parent = (function () {
            function D1_Map_MapThatCancelsItsSerialize_Class_Parent() {
                this.child = Prop(this, "child", "D1_Map_MapThatCancelsItsSerialize_Class_Child", new P()).set = new D1_Map_MapThatCancelsItsSerialize_Class_Child();
            }
            return D1_Map_MapThatCancelsItsSerialize_Class_Parent;
        }());
        var D1_Map_MapThatCancelsItsSerialize_Class_Child = (function () {
            function D1_Map_MapThatCancelsItsSerialize_Class_Child() {
                this.Serialize.AddTags(new VDFSerialize());
            }
            D1_Map_MapThatCancelsItsSerialize_Class_Child.prototype.Serialize = function () { return VDF.CancelSerialize; };
            return D1_Map_MapThatCancelsItsSerialize_Class_Child;
        }());
        test("D1_Map_MapThatCancelsItsSerialize", function () { VDF.Serialize(new D1_Map_MapThatCancelsItsSerialize_Class_Parent(), "D1_Map_MapThatCancelsItsSerialize_Class_Parent").Should().Be("{}"); });
        // for JSON compatibility
        // ==========
        var D0_MapWithMetadataDisabled_Class = (function () {
            function D0_MapWithMetadataDisabled_Class() {
            }
            return D0_MapWithMetadataDisabled_Class;
        }());
        test("D0_MapWithMetadataDisabled", function () {
            var a = VDFSaver.ToVDFNode(new D0_MapWithMetadataDisabled_Class(), new VDFSaveOptions({ useMetadata: false }));
            ok(a.metadata == null); //a.metadata.Should().Be(null);
        });
        var D0_Map_List_BoolsWithPopOutDisabled_Class = (function () {
            function D0_Map_List_BoolsWithPopOutDisabled_Class() {
                this.ints = Prop(this, "ints", "List(int)", new P()).set = new List("int", 0, 1);
            }
            return D0_Map_List_BoolsWithPopOutDisabled_Class;
        }());
        test("D0_Map_List_BoolsWithPopOutDisabled", function () {
            var a = VDFSaver.ToVDFNode(new D0_Map_List_BoolsWithPopOutDisabled_Class(), "D0_Map_List_BoolsWithPopOutDisabled_Class", new VDFSaveOptions({ useChildPopOut: false }));
            a.ToVDF().Should().Be("{ints:[0 1]}");
        });
        test("D1_Map_IntsWithStringKeys", function () {
            var a = VDFSaver.ToVDFNode(new Dictionary("object", "object", {
                key1: 0,
                key2: 1
            }), new VDFSaveOptions({ useStringKeys: true }));
            a.ToVDF(new VDFSaveOptions({ useStringKeys: true })).Should().Be("{\"key1\":0 \"key2\":1}");
        });
        test("D1_Map_DoublesWithNumberTrimmingDisabled", function () {
            var a = VDFSaver.ToVDFNode(new List("object", .1, 1.1), new VDFSaveOptions({ useNumberTrimming: false }));
            a.ToVDF(new VDFSaveOptions({ useNumberTrimming: false })).Should().Be("[0.1 1.1]");
        });
        test("D1_List_IntsWithCommaSeparators", function () {
            var a = VDFSaver.ToVDFNode(new List("object", 0, 1), new VDFSaveOptions({ useCommaSeparators: true }));
            a.listChildren.Count.Should().Be(2);
            a.ToVDF(new VDFSaveOptions({ useCommaSeparators: true })).Should().Be("[0,1]");
        });
        // export all classes/enums to global scope
        ExportInternalClassesTo(window, function (str) { return eval(str); });
        // make sure we create one instance, so that the type-info attachment code can run
        (new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base()).toString();
    })(Saving_General || (Saving_General = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=S_General.js.map