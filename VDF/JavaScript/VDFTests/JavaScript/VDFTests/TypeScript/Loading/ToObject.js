// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Loading_ToObject;
    (function (Loading_ToObject) {
        // to object
        // ==========
        test("D0_Null", function () {
            ok(VDF.Deserialize("null") == null);
            //VDF.Deserialize("null").Should().Be(null);
        });
        //test("D0_Nothing() { VDF.Deserialize("").Should().Be(null); });
        //test("D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); });
        test("D0_EmptyString", function () { VDF.Deserialize("''").Should().Be(""); });
        test("D0_Bool", function () { VDF.Deserialize("true", "bool").Should().Be(true); });
        test("D0_Double", function () { VDF.Deserialize("1.5").Should().Be(1.5); });
        //test("D0_Float", ()=> { VDF.Deserialize<float>("1.5").Should().Be(1.5f); });
        var D1_DeserializePropMethod_Class = (function () {
            function D1_DeserializePropMethod_Class() {
                this.prop1 = Prop(this, "prop1", "D1_PreDeserializePropMethod_Class", new P()).set = 0;
            }
            D1_DeserializePropMethod_Class.prototype.DeserializeProp = function (node, propPath, options) { return 1; };
            return D1_DeserializePropMethod_Class;
        }());
        D1_DeserializePropMethod_Class.prototype.DeserializeProp.AddTags(new VDFDeserializeProp());
        test("D1_DeserializePropMethod", function () {
            var a = VDF.Deserialize("{prop1:0}", "D1_DeserializePropMethod_Class");
            a.prop1.Should().Be(1);
        });
        var TypeWithPreDeserializeMethod = (function () {
            function TypeWithPreDeserializeMethod() {
                this.flag = Prop(this, "flag", "bool", new P()).set = false;
                this.PreDeserialize.AddTags(new VDFPreDeserialize());
            }
            TypeWithPreDeserializeMethod.prototype.PreDeserialize = function () { this.flag = true; };
            return TypeWithPreDeserializeMethod;
        }());
        test("D1_PreDeserializeMethod", function () {
            var a = VDF.Deserialize("{}", "TypeWithPreDeserializeMethod");
            a.flag.Should().Be(true);
        });
        var TypeWithPostDeserializeMethod = (function () {
            function TypeWithPostDeserializeMethod() {
                this.flag = Prop(this, "flag", "bool", new P()).set = false;
                this.PostDeserialize.AddTags(new VDFPostDeserialize());
            }
            TypeWithPostDeserializeMethod.prototype.PostDeserialize = function () { this.flag = true; };
            return TypeWithPostDeserializeMethod;
        }());
        test("D1_PostDeserializeMethod", function () {
            var a = VDF.Deserialize("{}", "TypeWithPostDeserializeMethod");
            a.flag.Should().Be(true);
        });
        var ObjectWithPostDeserializeMethodRequiringCustomMessage_Class = (function () {
            function ObjectWithPostDeserializeMethodRequiringCustomMessage_Class() {
                this.flag = Prop(this, "flag", "bool", new P()).set = false;
                this.PostDeserialize.AddTags(new VDFPostDeserialize());
            }
            ObjectWithPostDeserializeMethodRequiringCustomMessage_Class.prototype.PostDeserialize = function (node, path, options) { if (options.messages[0] == "RequiredMessage")
                this.flag = true; };
            return ObjectWithPostDeserializeMethodRequiringCustomMessage_Class;
        }());
        test("D0_ObjectWithPostDeserializeMethodRequiringCustomMessage", function () { VDF.Deserialize("{}", "ObjectWithPostDeserializeMethodRequiringCustomMessage_Class", new VDFLoadOptions(null, ["WrongMessage"])).flag.Should().Be(false); });
        /*class ObjectWithPostDeserializeConstructor_Class
        {
            static typeInfo = new VDFTypeInfo(
            {
                flag: new PInfo("bool")
            });
            flag = false;
            ObjectWithPostDeserializeConstructor_Class() { flag = true; }
        }
        test("D1_ObjectWithPostDeserializeConstructor", ()=> { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); });*/
        var ObjectWithPostDeserializeOptionsFunc_Class_Parent = (function () {
            function ObjectWithPostDeserializeOptionsFunc_Class_Parent() {
                this.child = Prop(this, "child", "ObjectWithPostDeserializeOptionsFunc_Class_Child").set = null;
            }
            return ObjectWithPostDeserializeOptionsFunc_Class_Parent;
        }());
        var ObjectWithPostDeserializeOptionsFunc_Class_Child = (function () {
            function ObjectWithPostDeserializeOptionsFunc_Class_Child() {
            }
            ObjectWithPostDeserializeOptionsFunc_Class_Child.Deserialize = function (node, path, options) {
                options.AddObjPostDeserializeFunc(path.rootNode.obj, function () { return ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = true; });
                return null;
            };
            ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = false;
            return ObjectWithPostDeserializeOptionsFunc_Class_Child;
        }());
        ObjectWithPostDeserializeOptionsFunc_Class_Child.Deserialize.AddTags(new VDFDeserialize(true));
        test("D1_ObjectWithPostDeserializeOptionsFunc", function () {
            var options = new VDFLoadOptions();
            ok(VDF.Deserialize("{child:{}}", "ObjectWithPostDeserializeOptionsFunc_Class_Parent", options).child == null);
            ObjectWithPostDeserializeOptionsFunc_Class_Child.flag.Should().Be(true);
        });
        var TypeInstantiatedManuallyThenFilled = (function () {
            function TypeInstantiatedManuallyThenFilled() {
                this.flag = Prop(this, "flag", "bool", new P()).set = false;
            }
            return TypeInstantiatedManuallyThenFilled;
        }());
        test("D1_InstantiateTypeManuallyThenFill", function () {
            var a = new TypeInstantiatedManuallyThenFilled();
            VDF.DeserializeInto("{flag:true}", a);
            a.flag.Should().Be(true);
        });
        var D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = (function () {
            function D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1() {
                this._helper = TypeInfo(new VDFType(null, true)).set = this;
                this.messages = Prop(this, "messages", "Dictionary(string string)", new P()).set = new Dictionary("string", "string", {
                    title1: "message1",
                    title2: "message2"
                });
                this.otherProperty = Prop(this, "otherProperty", "bool", new P()).set = false;
            }
            return D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1;
        }());
        test("D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", function () {
            var a = VDF.Deserialize("{^}\n\
	messages:{^}\n\
		title1:'message1'\n\
		title2:'message2'\n\
	otherProperty:true", "D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1");
            a.messages.Count.Should().Be(2);
            a.messages["title1"].Should().Be("message1");
            a.messages["title2"].Should().Be("message2");
            a.otherProperty.Should().Be(true);
        });
        // export all classes/enums to global scope
        ExportInternalClassesTo(window, function (str) { return eval(str); });
    })(Loading_ToObject || (Loading_ToObject = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=ToObject.js.map