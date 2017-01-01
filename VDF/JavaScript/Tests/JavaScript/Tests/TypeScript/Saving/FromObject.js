System.register(["../../../Source/TypeScript/VDF", "../../../Source/TypeScript/VDFTypeInfo", "../../../Source/TypeScript/VDFSaver", "../../../Source/TypeScript/VDFNode", "../../../Source/TypeScript/VDFExtras", "../GeneralInit"], function (exports_1, context_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    function test(name, func) { tests.push({ name: name, func: func }); }
    var VDF_1, VDFTypeInfo_1, VDFSaver_1, VDFNode_1, VDFExtras_1, GeneralInit_1, tests, VDFTests;
    return {
        setters: [
            function (VDF_1_1) {
                VDF_1 = VDF_1_1;
            },
            function (VDFTypeInfo_1_1) {
                VDFTypeInfo_1 = VDFTypeInfo_1_1;
            },
            function (VDFSaver_1_1) {
                VDFSaver_1 = VDFSaver_1_1;
            },
            function (VDFNode_1_1) {
                VDFNode_1 = VDFNode_1_1;
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
                var Saving_FromObject;
                (function (Saving_FromObject) {
                    // from object
                    // ==========
                    test("D0_Null", function () { VDF_1.VDF.Serialize(null).Should().Be("null"); });
                    test("D0_EmptyString", function () { VDF_1.VDF.Serialize("").Should().Be("\"\""); });
                    var D1_IgnoreDefaultValues_Class = (function () {
                        function D1_IgnoreDefaultValues_Class() {
                            this.bool1 = null;
                            this.bool2 = true;
                            this.bool3 = true;
                            this.string1 = null;
                            this.string2 = "value1";
                            this.string3 = "value1";
                        }
                        return D1_IgnoreDefaultValues_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P(), VDFTypeInfo_1.D()
                    ], D1_IgnoreDefaultValues_Class.prototype, "bool1", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P(), VDFTypeInfo_1.D(true)
                    ], D1_IgnoreDefaultValues_Class.prototype, "bool2", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], D1_IgnoreDefaultValues_Class.prototype, "bool3", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("string"), VDFTypeInfo_1.D()
                    ], D1_IgnoreDefaultValues_Class.prototype, "string1", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("string"), VDFTypeInfo_1.D("value1")
                    ], D1_IgnoreDefaultValues_Class.prototype, "string2", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("string")
                    ], D1_IgnoreDefaultValues_Class.prototype, "string3", void 0);
                    D1_IgnoreDefaultValues_Class = __decorate([
                        VDFTypeInfo_1.TypeInfo("^(?!_)")
                    ], D1_IgnoreDefaultValues_Class);
                    test("D1_IgnoreDefaultValues", function () {
                        VDF_1.VDF.Serialize(new D1_IgnoreDefaultValues_Class(), "D1_IgnoreDefaultValues_Class").Should().Be("{bool3:true string3:\"value1\"}");
                    });
                    var D1_NullValues_Class = (function () {
                        function D1_NullValues_Class() {
                            this.obj = null;
                            this.strings = null;
                            this.strings2 = new VDFExtras_1.List("string");
                        }
                        return D1_NullValues_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("object"), VDFTypeInfo_1.P()
                    ], D1_NullValues_Class.prototype, "obj", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P()
                    ], D1_NullValues_Class.prototype, "strings", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P()
                    ], D1_NullValues_Class.prototype, "strings2", void 0);
                    test("D1_NullValues", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new D1_NullValues_Class());
                        ok(a["obj"].metadata == null); //a["obj"].metadata.Should().Be(null);
                        ok(a["obj"].primitiveValue == null); //a["obj"].primitiveValue.Should().Be(null);
                        ok(a["strings"].metadata == null); //a["strings"].metadata.Should().Be(null);
                        ok(a["strings"].primitiveValue == null); //a["strings"].primitiveValue.Should().Be(null);
                        //ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // unmarked type
                        ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // old: auto-marked as list (needed, to specify sort of type, as required)
                        ok(a["strings2"].primitiveValue == null); //a["strings2"].primitiveValue.Should().Be(null); // it's a List, so it shouldn't have a base-value
                        a["strings2"].listChildren.Count.Should().Be(0);
                        a.ToVDF().Should().Be("D1_NullValues_Class>{obj:null strings:null strings2:[]}");
                    });
                    var TypeWithDefaultStringProp = (function () {
                        function TypeWithDefaultStringProp() {
                            this.defaultString = null;
                        }
                        return TypeWithDefaultStringProp;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("string"), VDFTypeInfo_1.P(true), VDFTypeInfo_1.D()
                    ], TypeWithDefaultStringProp.prototype, "defaultString", void 0);
                    test("D1_IgnoreEmptyString", function () { VDF_1.VDF.Serialize(new TypeWithDefaultStringProp(), "TypeWithDefaultStringProp").Should().Be("{}"); });
                    var TypeWithNullProps = (function () {
                        function TypeWithNullProps() {
                            this.obj = null;
                            this.strings = null;
                            this.strings2 = new VDFExtras_1.List("string");
                        }
                        return TypeWithNullProps;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("object"), VDFTypeInfo_1.P()
                    ], TypeWithNullProps.prototype, "obj", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P()
                    ], TypeWithNullProps.prototype, "strings", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P()
                    ], TypeWithNullProps.prototype, "strings2", void 0);
                    test("D1_NullValues", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new TypeWithNullProps());
                        ok(a["obj"].metadata == null); //a["obj"].metadata.Should().Be(null);
                        ok(a["obj"].primitiveValue == null); //a["obj"].primitiveValue.Should().Be(null);
                        ok(a["strings"].metadata == null); //a["strings"].metadata.Should().Be(null);
                        ok(a["strings"].primitiveValue == null); //a["strings"].primitiveValue.Should().Be(null);
                        //ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // unmarked type
                        ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // old: auto-marked as list (needed, to specify sort of type, as required)
                        ok(a["strings2"].primitiveValue == null); //a["strings2"].primitiveValue.Should().Be(null); // it's a List, so it shouldn't have a base-value
                        a["strings2"].listChildren.Count.Should().Be(0);
                        a.ToVDF().Should().Be("TypeWithNullProps>{obj:null strings:null strings2:[]}");
                    });
                    var TypeWithList_PopOutItemData = (function () {
                        function TypeWithList_PopOutItemData() {
                            this.list = new VDFExtras_1.List("string", "A", "B");
                        }
                        return TypeWithList_PopOutItemData;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P(true, true)
                    ], TypeWithList_PopOutItemData.prototype, "list", void 0);
                    test("D1_ListItems_PoppedOutChildren", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new TypeWithList_PopOutItemData(), "TypeWithList_PopOutItemData");
                        a.ToVDF().Should().Be("{list:[^]}\n\
	\"A\"\n\
	\"B\"".replace(/\r/g, ""));
                    });
                    test("D1_ListItems_Null", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("string", null));
                        ok(a[0].metadata == null); //a[0].metadata.Should().Be(null);
                        ok(a[0].primitiveValue == null); //a[0].primitiveValue.Should().Be(null);
                        a.ToVDF().Should().Be("List(string)>[null]");
                    });
                    test("D1_SingleListItemWithAssemblyKnownTypeShouldStillSpecifySortOfType", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("string", "hi"), "List(string)");
                        a.ToVDF().Should().Be("[\"hi\"]");
                    });
                    test("D1_StringAndArraysInArray", function () { VDF_1.VDF.Serialize(new VDFExtras_1.List("object", "text", new VDFExtras_1.List("string", "a", "b"))).Should().Be("[\"text\" List(string)>[\"a\" \"b\"]]"); });
                    test("D1_DictionaryValues_Null", function () {
                        var dictionary = new VDFExtras_1.Dictionary("string", "string");
                        dictionary.Add("key1", null);
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(dictionary);
                        ok(a["key1"].metadata == null); //a["key1"].metadata.Should().Be(null);
                        ok(a["key1"].primitiveValue == null); //a["key1"].primitiveValue.Should().Be(null);
                        a.ToVDF().Should().Be("Dictionary(string string)>{key1:null}");
                    });
                    test("D1_AnonymousTypeProperties_MarkNoTypes", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
                        a["Bool"].primitiveValue.Should().Be(false);
                        a["Int"].primitiveValue.Should().Be(5);
                        a["Double"].primitiveValue.Should().Be(.5);
                        a["String"].primitiveValue.Should().Be("Prop value string.");
                        a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
                    });
                    test("D1_AnonymousTypeProperties_MarkAllTypes", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.External }));
                        a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
                    });
                    var D1_PreSerialize_Class = (function () {
                        function D1_PreSerialize_Class() {
                            this.preSerializeWasCalled = false;
                        }
                        D1_PreSerialize_Class.prototype.PreSerialize = function () { this.preSerializeWasCalled = true; };
                        return D1_PreSerialize_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], D1_PreSerialize_Class.prototype, "preSerializeWasCalled", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFPreSerialize()
                    ], D1_PreSerialize_Class.prototype, "PreSerialize", null);
                    test("D1_PreSerialize", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new D1_PreSerialize_Class(), "D1_PreSerialize_Class");
                        a["preSerializeWasCalled"].primitiveValue.Should().Be(true);
                        a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
                    });
                    var D1_SerializePropMethod_Class = (function () {
                        function D1_SerializePropMethod_Class() {
                            this.prop1 = 0;
                        }
                        D1_SerializePropMethod_Class.prototype.SerializeProp = function (propPath, options) { return new VDFNode_1.VDFNode(1); };
                        return D1_SerializePropMethod_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1._VDFSerializeProp()
                    ], D1_SerializePropMethod_Class.prototype, "SerializeProp", null);
                    __decorate([
                        VDFTypeInfo_1.P()
                    ], D1_SerializePropMethod_Class.prototype, "prop1", void 0);
                    test("D1_SerializePropMethod", function () {
                        var a = VDF_1.VDF.Serialize(new D1_SerializePropMethod_Class(), "D1_SerializePropMethod_Class");
                        a.Should().Be("{prop1:1}");
                    });
                    var TypeWithPostSerializeCleanupMethod = (function () {
                        function TypeWithPostSerializeCleanupMethod() {
                            this.postSerializeWasCalled = false;
                        }
                        TypeWithPostSerializeCleanupMethod.prototype.PostSerialize = function () { this.postSerializeWasCalled = true; };
                        return TypeWithPostSerializeCleanupMethod;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], TypeWithPostSerializeCleanupMethod.prototype, "postSerializeWasCalled", void 0);
                    __decorate([
                        VDFTypeInfo_1._VDFPostSerialize()
                    ], TypeWithPostSerializeCleanupMethod.prototype, "PostSerialize", null);
                    test("D1_PostSerializeCleanup", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
                        a["postSerializeWasCalled"].primitiveValue.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
                        a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
                    });
                    var TypeWithMixOfProps = (function () {
                        function TypeWithMixOfProps() {
                            this.Bool = true;
                            this.Int = 5;
                            this.Double = .5;
                            this.String = "Prop value string.";
                            this.list = new VDFExtras_1.List("string", "2A", "2B");
                            this.nestedList = new VDFExtras_1.List("List(string)", new VDFExtras_1.List("string", "1A"));
                        }
                        return TypeWithMixOfProps;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], TypeWithMixOfProps.prototype, "Bool", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("int"), VDFTypeInfo_1.P()
                    ], TypeWithMixOfProps.prototype, "Int", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("double"), VDFTypeInfo_1.P()
                    ], TypeWithMixOfProps.prototype, "Double", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("string"), VDFTypeInfo_1.P()
                    ], TypeWithMixOfProps.prototype, "String", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P()
                    ], TypeWithMixOfProps.prototype, "list", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("List(List(string))"), VDFTypeInfo_1.P()
                    ], TypeWithMixOfProps.prototype, "nestedList", void 0);
                    test("D1_TypeProperties_MarkForNone", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
                        a["Bool"].primitiveValue.Should().Be(true);
                        a["Int"].primitiveValue.Should().Be(5);
                        a["Double"].primitiveValue.Should().Be(.5);
                        a["String"].primitiveValue.Should().Be("Prop value string.");
                        a["list"][0].primitiveValue.Should().Be("2A");
                        a["list"][1].primitiveValue.Should().Be("2B");
                        a["nestedList"][0][0].primitiveValue.Should().Be("1A");
                        a.ToVDF().Should().Be("{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
                    });
                    test("D1_TypeProperties_MarkForInternal", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.Internal }));
                        a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
                    });
                    test("D1_TypeProperties_MarkForExternal", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.External }));
                        a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:List(string)>[\"2A\" \"2B\"] nestedList:List(List(string))>[[\"1A\"]]}");
                    });
                    test("D1_TypeProperties_MarkForExternalNoCollapse", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.ExternalNoCollapse }));
                        a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:bool>true Int:int>5 Double:double>.5 String:string>\"Prop value string.\" list:List(string)>[string>\"2A\" string>\"2B\"] nestedList:List(List(string))>[List(string)>[string>\"1A\"]]}");
                    });
                    var D1_Object_DictionaryPoppedOutThenBool_Class1 = (function () {
                        function D1_Object_DictionaryPoppedOutThenBool_Class1() {
                            this.messages = new VDFExtras_1.Dictionary("string", "string", { title1: "message1", title2: "message2" });
                            this.otherProperty = true;
                        }
                        return D1_Object_DictionaryPoppedOutThenBool_Class1;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("Dictionary(string string)"), VDFTypeInfo_1.P(true, true)
                    ], D1_Object_DictionaryPoppedOutThenBool_Class1.prototype, "messages", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("Dictionary(string string)"), VDFTypeInfo_1.P()
                    ], D1_Object_DictionaryPoppedOutThenBool_Class1.prototype, "otherProperty", void 0);
                    test("D1_DictionaryPoppedOutThenBool", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new D1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
                        a.ToVDF().Should().Be("{messages:{^} otherProperty:true}\n\
	title1:\"message1\"\n\
	title2:\"message2\"".replace(/\r/g, ""));
                    });
                    var D1_Map_PoppedOutDictionary_PoppedOutPairs_Class = (function () {
                        function D1_Map_PoppedOutDictionary_PoppedOutPairs_Class() {
                            this.messages = new VDFExtras_1.Dictionary("string", "string", {
                                title1: "message1",
                                title2: "message2"
                            });
                            this.otherProperty = true;
                        }
                        return D1_Map_PoppedOutDictionary_PoppedOutPairs_Class;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("Dictionary(string string)"), VDFTypeInfo_1.P(true, true)
                    ], D1_Map_PoppedOutDictionary_PoppedOutPairs_Class.prototype, "messages", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], D1_Map_PoppedOutDictionary_PoppedOutPairs_Class.prototype, "otherProperty", void 0);
                    D1_Map_PoppedOutDictionary_PoppedOutPairs_Class = __decorate([
                        VDFTypeInfo_1.TypeInfo(null, true)
                    ], D1_Map_PoppedOutDictionary_PoppedOutPairs_Class);
                    test("D1_Map_PoppedOutDictionary_PoppedOutPairs", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new D1_Map_PoppedOutDictionary_PoppedOutPairs_Class(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
                        a.ToVDF().Should().Be("{^}\n\
	messages:{^}\n\
		title1:\"message1\"\n\
		title2:\"message2\"\n\
	otherProperty:true".replace(/\r/g, ""));
                    });
                    var T1_Depth1 = (function () {
                        function T1_Depth1() {
                            this.level2 = new T1_Depth2();
                        }
                        return T1_Depth1;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("T1_Depth2"), VDFTypeInfo_1.P()
                    ], T1_Depth1.prototype, "level2", void 0);
                    var T1_Depth2 = (function () {
                        function T1_Depth2() {
                            this.messages = new VDFExtras_1.List("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
                            this.otherProperty = true;
                        }
                        return T1_Depth2;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P(true, true)
                    ], T1_Depth2.prototype, "messages", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], T1_Depth2.prototype, "otherProperty", void 0);
                    test("D2_Map_ListThenBool_PoppedOutStringsWithOneMultiline", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
                        a.ToVDF().Should().Be("{level2:{messages:[^] otherProperty:true}}\n\
	\"<<DeepString1_Line1\n\
	DeepString1_Line2>>\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
                    });
                    var Level1 = (function () {
                        function Level1() {
                            this.level2 = new Level2();
                        }
                        return Level1;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("Level2"), VDFTypeInfo_1.P()
                    ], Level1.prototype, "level2", void 0);
                    var Level2 = (function () {
                        function Level2() {
                            this.level3_first = new Level3();
                            this.level3_second = new Level3();
                        }
                        return Level2;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("Level3"), VDFTypeInfo_1.P()
                    ], Level2.prototype, "level3_first", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("Level3"), VDFTypeInfo_1.P()
                    ], Level2.prototype, "level3_second", void 0);
                    var Level3 = (function () {
                        function Level3() {
                            this.messages = new VDFExtras_1.List("string", "DeepString1", "DeepString2");
                        }
                        return Level3;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P(true, true)
                    ], Level3.prototype, "messages", void 0);
                    test("D3_Map_Map_Maps_Lists_PoppedOutStrings", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new Level1(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
                        a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[^]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"\n\
	^\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
                    });
                    test("D3_Map_Map_Maps_ListsWithOneEmpty_PoppedOutStrings", function () {
                        var obj = new Level1();
                        obj.level2.level3_second.messages = new VDFExtras_1.List("string");
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(obj, new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
                        a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
                    });
                    var T4_Depth1 = (function () {
                        function T4_Depth1() {
                            this.level2 = new T4_Depth2();
                        }
                        return T4_Depth1;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("T4_Depth2"), VDFTypeInfo_1.P()
                    ], T4_Depth1.prototype, "level2", void 0);
                    var T4_Depth2 = (function () {
                        function T4_Depth2() {
                            this.level3_first = new T4_Depth3();
                            this.level3_second = new T4_Depth3();
                        }
                        return T4_Depth2;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("T4_Depth3"), VDFTypeInfo_1.P()
                    ], T4_Depth2.prototype, "level3_first", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("T4_Depth3"), VDFTypeInfo_1.P()
                    ], T4_Depth2.prototype, "level3_second", void 0);
                    var T4_Depth3 = (function () {
                        function T4_Depth3() {
                            this.level4s = new VDFExtras_1.List("T4_Depth4", new T4_Depth4(), new T4_Depth4());
                        }
                        return T4_Depth3;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("List(T4_Depth4)"), VDFTypeInfo_1.P(true, true)
                    ], T4_Depth3.prototype, "level4s", void 0);
                    var T4_Depth4 = (function () {
                        function T4_Depth4() {
                            this.messages = new VDFExtras_1.List("string", "text1", "text2");
                            this.otherProperty = false;
                        }
                        return T4_Depth4;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("List(string)"), VDFTypeInfo_1.P(true, true)
                    ], T4_Depth4.prototype, "messages", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], T4_Depth4.prototype, "otherProperty", void 0);
                    test("D4_Map_Map_Maps_Lists_PoppedOutMaps_ListsThenBools_PoppedOutStrings", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.None }));
                        a.ToVDF().Should().Be("{level2:{level3_first:{level4s:[^]} level3_second:{level4s:[^]}}}\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	^{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"".replace(/\r/g, ""));
                    });
                    var T5_Depth2 = (function () {
                        function T5_Depth2() {
                            this.firstProperty = false;
                            this.otherProperty = false;
                        }
                        return T5_Depth2;
                    }());
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], T5_Depth2.prototype, "firstProperty", void 0);
                    __decorate([
                        VDFTypeInfo_1.T("bool"), VDFTypeInfo_1.P()
                    ], T5_Depth2.prototype, "otherProperty", void 0);
                    T5_Depth2 = __decorate([
                        VDFTypeInfo_1.TypeInfo(null, true)
                    ], T5_Depth2);
                    test("D4_List_Map_PoppedOutBools", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("T5_Depth2", new T5_Depth2()), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.External }));
                        a.ToVDF().Should().Be("List(T5_Depth2)>[{^}]\n\
	firstProperty:false\n\
	otherProperty:false".replace(/\r/g, ""));
                    });
                    // export all classes/enums to global scope
                    GeneralInit_1.ExportInternalClassesTo(window, function (str) { return eval(str); });
                    /*var names = V.GetMatches(arguments.callee.toString(), /        var (\w+) = \(function \(\) {/g, 1);
                    debugger;*/
                })(Saving_FromObject || (Saving_FromObject = {}));
            })(VDFTests || (VDFTests = {}));
        }
    };
});
//# sourceMappingURL=FromObject.js.map