System.register(["../../../Source/TypeScript/VDFNode", "../../../Source/TypeScript/VDFSaver", "../../../Source/TypeScript/VDF", "../../../Source/TypeScript/VDFTypeInfo", "../../../Source/TypeScript/VDFExtras", "../GeneralInit"], function (exports_1, context_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    function test(name, func) { tests.push({ name: name, func: func }); }
    var VDFNode_1, VDFSaver_1, VDF_1, VDFTypeInfo_1, VDFExtras_1, GeneralInit_1, tests, VDFTests;
    return {
        setters: [
            function (VDFNode_1_1) {
                VDFNode_1 = VDFNode_1_1;
            },
            function (VDFSaver_1_1) {
                VDFSaver_1 = VDFSaver_1_1;
            },
            function (VDF_1_1) {
                VDF_1 = VDF_1_1;
            },
            function (VDFTypeInfo_1_1) {
                VDFTypeInfo_1 = VDFTypeInfo_1_1;
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
                var Saving_FromVDFNode;
                (function (Saving_FromVDFNode) {
                    // from VDFNode
                    // ==========
                    test("D0_BaseValue", function () {
                        var a = new VDFNode_1.VDFNode();
                        a.primitiveValue = "Root string.";
                        a.ToVDF().Should().Be("\"Root string.\"");
                    });
                    test("D0_Infinity", function () {
                        new VDFNode_1.VDFNode(Infinity).ToVDF().Should().Be("Infinity");
                        new VDFNode_1.VDFNode(-Infinity).ToVDF().Should().Be("-Infinity");
                    });
                    test("D0_MetadataType", function () {
                        var a = new VDFNode_1.VDFNode();
                        a.metadata = "string";
                        a.primitiveValue = "Root string.";
                        a.ToVDF().Should().Be("string>\"Root string.\"");
                    });
                    test("D0_MetadataTypeCollapsed", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("string"), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.External }));
                        a.ToVDF().Should().Be("List(string)>[]");
                        a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("List(string)", new VDFExtras_1.List("string", "1A", "1B", "1C")), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.External }));
                        a.ToVDF().Should().Be("List(List(string))>[[\"1A\" \"1B\" \"1C\"]]"); // old: only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
                    });
                    test("D0_MetadataTypeNoCollapse", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("string"), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.ExternalNoCollapse }));
                        a.ToVDF().Should().Be("List(string)>[]");
                        a = VDFSaver_1.VDFSaver.ToVDFNode(new VDFExtras_1.List("List(string)", new VDFExtras_1.List("string", "1A", "1B", "1C")), new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.ExternalNoCollapse }));
                        a.ToVDF().Should().Be("List(List(string))>[List(string)>[string>\"1A\" string>\"1B\" string>\"1C\"]]");
                    });
                    var Enum1;
                    (function (Enum1) {
                        Enum1[Enum1["_IsEnum"] = 0] = "_IsEnum";
                        Enum1[Enum1["A"] = 1] = "A";
                        Enum1[Enum1["B"] = 2] = "B";
                        Enum1[Enum1["C"] = 3] = "C";
                    })(Enum1 || (Enum1 = {}));
                    //enum Enum1 { A, B, C }
                    test("D0_EnumDefault", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(Enum1.A, "Enum1");
                        a.ToVDF().Should().Be("\"A\"");
                    });
                    test("D0_EnumDefault_IncludeType", function () {
                        var a = VDFSaver_1.VDFSaver.ToVDFNode(Enum1.A, "Enum1", new VDFSaver_1.VDFSaveOptions({ typeMarking: VDFSaver_1.VDFTypeMarking.External }));
                        a.ToVDF().Should().Be("Enum1>\"A\"");
                    });
                    test("D0_EscapedString", function () {
                        var options = new VDFSaver_1.VDFSaveOptions(null, null, VDFSaver_1.VDFTypeMarking.None);
                        // escape line-breaks
                        var a = VDFSaver_1.VDFSaver.ToVDFNode("this\nneeds escaping", options);
                        a.ToVDF().Should().Be("\"<<this\nneeds escaping>>\"");
                        // escape single-quotes
                        a = VDFSaver_1.VDFSaver.ToVDFNode("this 'needs' escaping", options);
                        a.ToVDF().Should().Be("\"<<this 'needs' escaping>>\"");
                        // escape double-quotes
                        a = VDFSaver_1.VDFSaver.ToVDFNode("this \"needs\" escaping", options);
                        a.ToVDF().Should().Be("\"<<this \"needs\" escaping>>\"");
                        // escape double angle-brackets
                        a = VDFSaver_1.VDFSaver.ToVDFNode("this<<needs escaping", options);
                        a.ToVDF().Should().Be("\"<<<this<<needs escaping>>>\"");
                        a = VDFSaver_1.VDFSaver.ToVDFNode("this>>needs escaping", options);
                        a.ToVDF().Should().Be("\"<<<this>>needs escaping>>>\"");
                    });
                    test("D0_EscapedStringIfNonQuoted", function () {
                        var options = new VDFSaver_1.VDFSaveOptions(null, null, VDFSaver_1.VDFTypeMarking.None);
                        VDF_1.VDF.Serialize(new VDFExtras_1.Dictionary("string", "string", { "{": "val1" }), options).Should().Be("{<<{>>:\"val1\"}");
                        VDF_1.VDF.Serialize(new VDFExtras_1.Dictionary("string", "string", { "^": "val1" }), options).Should().Be("{<<^>>:\"val1\"}");
                        VDF_1.VDF.Serialize(new VDFExtras_1.Dictionary("string", "string", { "3": "val1" }), options).Should().Be("{<<3>>:\"val1\"}");
                    });
                    test("D0_EmptyArray", function () { VDF_1.VDF.Serialize([]).Should().Be("[]"); });
                    test("D1_ListInferredFromHavingItem_String", function () {
                        var a = new VDFNode_1.VDFNode();
                        a.SetListChild(0, new VDFNode_1.VDFNode("String item."));
                        a.ToVDF().Should().Be("[\"String item.\"]");
                    });
                    test("D1_Object_Primitives", function () {
                        var a = new VDFNode_1.VDFNode();
                        a.SetMapChild(new VDFNode_1.VDFNode("bool"), new VDFNode_1.VDFNode(false));
                        a.SetMapChild(new VDFNode_1.VDFNode("int"), new VDFNode_1.VDFNode(5));
                        a.SetMapChild(new VDFNode_1.VDFNode("double"), new VDFNode_1.VDFNode(.5));
                        a.SetMapChild(new VDFNode_1.VDFNode("string"), new VDFNode_1.VDFNode("Prop value string."));
                        a.ToVDF().Should().Be("{bool:false int:5 double:.5 string:\"Prop value string.\"}");
                    });
                    test("D1_List_EscapedStrings", function () {
                        var a = new VDFNode_1.VDFNode();
                        a.SetListChild(0, new VDFNode_1.VDFNode("This is a list item \"that needs escaping\"."));
                        a.SetListChild(1, new VDFNode_1.VDFNode("Here's another."));
                        a.SetListChild(2, new VDFNode_1.VDFNode("And <<another>>."));
                        a.SetListChild(3, new VDFNode_1.VDFNode("This one does not need escaping."));
                        a.ToVDF().Should().Be("[\"<<This is a list item \"that needs escaping\".>>\" \"<<Here's another.>>\" \"<<<And <<another>>.>>>\" \"This one does not need escaping.\"]");
                    });
                    test("D1_List_EscapedStrings2", function () {
                        var a = new VDFNode_1.VDFNode();
                        a.SetListChild(0, new VDFNode_1.VDFNode("ok {}"));
                        a.SetListChild(1, new VDFNode_1.VDFNode("ok []"));
                        a.SetListChild(2, new VDFNode_1.VDFNode("ok :"));
                        a.ToVDF().Should().Be("[\"ok {}\" \"ok []\" \"ok :\"]");
                    });
                    test("D1_Map_EscapedStrings", function () {
                        var a = new VDFNode_1.VDFNode();
                        a.SetMapChild(new VDFNode_1.VDFNode("escape {}"), new VDFNode_1.VDFNode());
                        a.SetMapChild(new VDFNode_1.VDFNode("escape []"), new VDFNode_1.VDFNode());
                        a.SetMapChild(new VDFNode_1.VDFNode("escape :"), new VDFNode_1.VDFNode());
                        a.SetMapChild(new VDFNode_1.VDFNode("escape \""), new VDFNode_1.VDFNode());
                        a.SetMapChild(new VDFNode_1.VDFNode("escape '"), new VDFNode_1.VDFNode());
                        a.ToVDF().Should().Be("{<<escape {}>>:null <<escape []>>:null <<escape :>>:null <<escape \">>:null <<escape '>>:null}");
                    });
                    var TypeTest = (function () {
                        function TypeTest() {
                        }
                        TypeTest.prototype.Serialize = function () {
                            var result = new VDFNode_1.VDFNode("Object");
                            result.metadata_override = "Type";
                            return result;
                        };
                        return TypeTest;
                    }());
                    __decorate([
                        VDFTypeInfo_1._VDFSerialize()
                    ], TypeTest.prototype, "Serialize", null);
                    test("D1_MetadataShowingNodeToBeOfTypeType", function () {
                        //VDFTypeInfo.AddSerializeMethod<Type>(a=>new VDFNode(a.Name, "Type"));
                        //VDFTypeInfo.AddDeserializeMethod_FromParent<Type>(node=>Type.GetType(node.primitiveValue.ToString()));
                        //var type_object = {Serialize: function() { return new VDFNode("System.Object", "Type"); }.AddTags(new VDFSerialize())}
                        var type_object = new TypeTest();
                        var map = new VDFExtras_1.Dictionary("object", "object");
                        map.Add(type_object, "hi there");
                        VDF_1.VDF.Serialize(map).Should().Be("{Type>Object:\"hi there\"}");
                    });
                    // export all classes/enums to global scope
                    GeneralInit_1.ExportInternalClassesTo(window, function (str) { return eval(str); });
                })(Saving_FromVDFNode || (Saving_FromVDFNode = {}));
            })(VDFTests || (VDFTests = {}));
        }
    };
});
//# sourceMappingURL=FromVDFNode.js.map