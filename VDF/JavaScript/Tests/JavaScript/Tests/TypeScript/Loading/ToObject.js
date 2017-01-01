System.register(["../../../Source/TypeScript/VDFLoader", "../../../Source/TypeScript/VDFTypeInfo", "../../../Source/TypeScript/VDF", "../../../Source/TypeScript/VDFExtras", "../GeneralInit"], function (exports_1, context_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    function test(name, func) { tests.push({ name: name, func: func }); }
    var VDFLoader_1, VDFTypeInfo_1, VDF_1, VDFExtras_1, GeneralInit_1, tests, VDFTests;
    return {
        setters: [
            function (VDFLoader_1_1) {
                VDFLoader_1 = VDFLoader_1_1;
            },
            function (VDFTypeInfo_1_1) {
                VDFTypeInfo_1 = VDFTypeInfo_1_1;
            },
            function (VDF_1_1) {
                VDF_1 = VDF_1_1;
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
                var Loading_ToObject;
                (function (Loading_ToObject) {
                    // to object
                    // ==========
                    test("D0_Null", function () {
                        ok(VDF_1.VDF.Deserialize("null") == null);
                        //VDF.Deserialize("null").Should().Be(null);
                    });
                    //test("D0_Nothing() { VDF.Deserialize("").Should().Be(null); });
                    //test("D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); });
                    test("D0_EmptyString", function () { VDF_1.VDF.Deserialize("''").Should().Be(""); });
                    test("D0_Bool", function () { VDF_1.VDF.Deserialize("true", "bool").Should().Be(true); });
                    test("D0_Double", function () { VDF_1.VDF.Deserialize("1.5").Should().Be(1.5); });
                    //test("D0_Float", ()=> { VDF.Deserialize<float>("1.5").Should().Be(1.5f); });
                    var D1_DeserializePropMethod_Class = (function () {
                        function D1_DeserializePropMethod_Class() {
                            this.prop1 = 0;
                        }
                        D1_DeserializePropMethod_Class.prototype.DeserializeProp = function (node, propPath, options) { return 1; };
                        return D1_DeserializePropMethod_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1._VDFDeserializeProp()
                    ], D1_DeserializePropMethod_Class.prototype, "DeserializeProp", null);
                    __decorate([
                        VDFTypeInfo_1.P()
                    ], D1_DeserializePropMethod_Class.prototype, "prop1", void 0);
                    test("D1_DeserializePropMethod", function () {
                        var a = VDF_1.VDF.Deserialize("{prop1:0}", "D1_DeserializePropMethod_Class");
                        a.prop1.Should().Be(1);
                    });
                    var TypeWithPreDeserializeMethod = (function () {
                        function TypeWithPreDeserializeMethod() {
                            this.flag = false;
                        }
                        TypeWithPreDeserializeMethod.prototype.PreDeserialize = function () { this.flag = true; };
                        return TypeWithPreDeserializeMethod;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], TypeWithPreDeserializeMethod.prototype, "flag", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFPreDeserialize()
                    ], TypeWithPreDeserializeMethod.prototype, "PreDeserialize", null);
                    test("D1_PreDeserializeMethod", function () {
                        var a = VDF_1.VDF.Deserialize("{}", "TypeWithPreDeserializeMethod");
                        a.flag.Should().Be(true);
                    });
                    var TypeWithPostDeserializeMethod = (function () {
                        function TypeWithPostDeserializeMethod() {
                            this.flag = false;
                        }
                        TypeWithPostDeserializeMethod.prototype.PostDeserialize = function () { this.flag = true; };
                        return TypeWithPostDeserializeMethod;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], TypeWithPostDeserializeMethod.prototype, "flag", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFPostDeserialize()
                    ], TypeWithPostDeserializeMethod.prototype, "PostDeserialize", null);
                    test("D1_PostDeserializeMethod", function () {
                        var a = VDF_1.VDF.Deserialize("{}", "TypeWithPostDeserializeMethod");
                        a.flag.Should().Be(true);
                    });
                    var ObjectWithPostDeserializeMethodRequiringCustomMessage_Class = (function () {
                        function ObjectWithPostDeserializeMethodRequiringCustomMessage_Class() {
                            this.flag = false;
                        }
                        ObjectWithPostDeserializeMethodRequiringCustomMessage_Class.prototype.PostDeserialize = function (node, path, options) {
                            if (options.messages[0] == "RequiredMessage")
                                this.flag = true;
                        };
                        return ObjectWithPostDeserializeMethodRequiringCustomMessage_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], ObjectWithPostDeserializeMethodRequiringCustomMessage_Class.prototype, "flag", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFPostDeserialize()
                    ], ObjectWithPostDeserializeMethodRequiringCustomMessage_Class.prototype, "PostDeserialize", null);
                    test("D0_ObjectWithPostDeserializeMethodRequiringCustomMessage", function () { VDF_1.VDF.Deserialize("{}", "ObjectWithPostDeserializeMethodRequiringCustomMessage_Class", new VDFLoader_1.VDFLoadOptions(null, ["WrongMessage"])).flag.Should().Be(false); });
                    /*class ObjectWithPostDeserializeConstructor_Class {
                        static typeInfo = new VDFTypeInfo({
                            flag: new PInfo("bool")
                        });
                        flag = false;
                        ObjectWithPostDeserializeConstructor_Class() { flag = true; }
                    }
                    test("D1_ObjectWithPostDeserializeConstructor", ()=> { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); });*/
                    var ObjectWithPostDeserializeOptionsFunc_Class_Parent = (function () {
                        function ObjectWithPostDeserializeOptionsFunc_Class_Parent() {
                            this.child = null;
                        }
                        return ObjectWithPostDeserializeOptionsFunc_Class_Parent;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("ObjectWithPostDeserializeOptionsFunc_Class_Child")
                    ], ObjectWithPostDeserializeOptionsFunc_Class_Parent.prototype, "child", void 0);
                    var ObjectWithPostDeserializeOptionsFunc_Class_Child = (function () {
                        function ObjectWithPostDeserializeOptionsFunc_Class_Child() {
                        }
                        ObjectWithPostDeserializeOptionsFunc_Class_Child.Deserialize = function (node, path, options) {
                            options.AddObjPostDeserializeFunc(path.rootNode.obj, function () { return ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = true; });
                            return null;
                        };
                        return ObjectWithPostDeserializeOptionsFunc_Class_Child;
                    }());
                    ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = false;
                    __decorate([
                        VDFTypeInfo_1._VDFDeserialize(true)
                    ], ObjectWithPostDeserializeOptionsFunc_Class_Child, "Deserialize", null);
                    test("D1_ObjectWithPostDeserializeOptionsFunc", function () {
                        var options = new VDFLoader_1.VDFLoadOptions();
                        ok(VDF_1.VDF.Deserialize("{child:{}}", "ObjectWithPostDeserializeOptionsFunc_Class_Parent", options).child == null);
                        ObjectWithPostDeserializeOptionsFunc_Class_Child.flag.Should().Be(true);
                    });
                    var TypeInstantiatedManuallyThenFilled = (function () {
                        function TypeInstantiatedManuallyThenFilled() {
                            this.flag = false;
                        }
                        return TypeInstantiatedManuallyThenFilled;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], TypeInstantiatedManuallyThenFilled.prototype, "flag", void 0);
                    test("D1_InstantiateTypeManuallyThenFill", function () {
                        var a = new TypeInstantiatedManuallyThenFilled();
                        VDF_1.VDF.DeserializeInto("{flag:true}", a);
                        a.flag.Should().Be(true);
                    });
                    var D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = (function () {
                        function D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1() {
                            this._helper = this;
                            this.messages = new VDFExtras_1.Dictionary("string", "string", {
                                title1: "message1",
                                title2: "message2"
                            });
                            this.otherProperty = false;
                        }
                        return D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("Dictionary(string string)"), VDFTypeInfo_1.P()
                    ], D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1.prototype, "messages", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1.prototype, "otherProperty", void 0);
                    D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = __decorate([
                        VDFTypeInfo_1.TypeInfo(null, true)
                    ], D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1);
                    test("D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", function () {
                        var a = VDF_1.VDF.Deserialize("{^}\n\
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
                    GeneralInit_1.ExportInternalClassesTo(window, function (str) { return eval(str); });
                })(Loading_ToObject || (Loading_ToObject = {}));
            })(VDFTests || (VDFTests = {}));
        }
    };
});
//# sourceMappingURL=ToObject.js.map