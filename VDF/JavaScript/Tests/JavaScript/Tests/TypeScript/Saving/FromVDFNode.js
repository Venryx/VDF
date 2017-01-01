// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Saving_FromVDFNode;
    (function (Saving_FromVDFNode) {
        // from VDFNode
        // ==========
        test("D0_BaseValue", function () {
            var a = new VDFNode();
            a.primitiveValue = "Root string.";
            a.ToVDF().Should().Be("\"Root string.\"");
        });
        test("D0_Infinity", function () {
            new VDFNode(Infinity).ToVDF().Should().Be("Infinity");
            new VDFNode(-Infinity).ToVDF().Should().Be("-Infinity");
        });
        test("D0_MetadataType", function () {
            var a = new VDFNode();
            a.metadata = "string";
            a.primitiveValue = "Root string.";
            a.ToVDF().Should().Be("string>\"Root string.\"");
        });
        test("D0_MetadataTypeCollapsed", function () {
            var a = VDFSaver.ToVDFNode(new List("string"), new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
            a.ToVDF().Should().Be("List(string)>[]");
            a = VDFSaver.ToVDFNode(new List("List(string)", new List("string", "1A", "1B", "1C")), new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
            a.ToVDF().Should().Be("List(List(string))>[[\"1A\" \"1B\" \"1C\"]]"); // old: only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
        });
        test("D0_MetadataTypeNoCollapse", function () {
            var a = VDFSaver.ToVDFNode(new List("string"), new VDFSaveOptions({ typeMarking: VDFTypeMarking.ExternalNoCollapse }));
            a.ToVDF().Should().Be("List(string)>[]");
            a = VDFSaver.ToVDFNode(new List("List(string)", new List("string", "1A", "1B", "1C")), new VDFSaveOptions({ typeMarking: VDFTypeMarking.ExternalNoCollapse }));
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
            var a = VDFSaver.ToVDFNode(Enum1.A, "Enum1");
            a.ToVDF().Should().Be("\"A\"");
        });
        test("D0_EnumDefault_IncludeType", function () {
            var a = VDFSaver.ToVDFNode(Enum1.A, "Enum1", new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
            a.ToVDF().Should().Be("Enum1>\"A\"");
        });
        test("D0_EscapedString", function () {
            var options = new VDFSaveOptions(null, null, VDFTypeMarking.None);
            // escape line-breaks
            var a = VDFSaver.ToVDFNode("this\nneeds escaping", options);
            a.ToVDF().Should().Be("\"<<this\nneeds escaping>>\"");
            // escape single-quotes
            a = VDFSaver.ToVDFNode("this 'needs' escaping", options);
            a.ToVDF().Should().Be("\"<<this 'needs' escaping>>\"");
            // escape double-quotes
            a = VDFSaver.ToVDFNode("this \"needs\" escaping", options);
            a.ToVDF().Should().Be("\"<<this \"needs\" escaping>>\"");
            // escape double angle-brackets
            a = VDFSaver.ToVDFNode("this<<needs escaping", options);
            a.ToVDF().Should().Be("\"<<<this<<needs escaping>>>\"");
            a = VDFSaver.ToVDFNode("this>>needs escaping", options);
            a.ToVDF().Should().Be("\"<<<this>>needs escaping>>>\"");
        });
        test("D0_EscapedStringIfNonQuoted", function () {
            var options = new VDFSaveOptions(null, null, VDFTypeMarking.None);
            VDF.Serialize(new Dictionary("string", "string", { "{": "val1" }), options).Should().Be("{<<{>>:\"val1\"}");
            VDF.Serialize(new Dictionary("string", "string", { "^": "val1" }), options).Should().Be("{<<^>>:\"val1\"}");
            VDF.Serialize(new Dictionary("string", "string", { "3": "val1" }), options).Should().Be("{<<3>>:\"val1\"}");
        });
        test("D0_EmptyArray", function () { VDF.Serialize([]).Should().Be("[]"); });
        test("D1_ListInferredFromHavingItem_String", function () {
            var a = new VDFNode();
            a.SetListChild(0, new VDFNode("String item."));
            a.ToVDF().Should().Be("[\"String item.\"]");
        });
        test("D1_Object_Primitives", function () {
            var a = new VDFNode();
            a.SetMapChild(new VDFNode("bool"), new VDFNode(false));
            a.SetMapChild(new VDFNode("int"), new VDFNode(5));
            a.SetMapChild(new VDFNode("double"), new VDFNode(.5));
            a.SetMapChild(new VDFNode("string"), new VDFNode("Prop value string."));
            a.ToVDF().Should().Be("{bool:false int:5 double:.5 string:\"Prop value string.\"}");
        });
        test("D1_List_EscapedStrings", function () {
            var a = new VDFNode();
            a.SetListChild(0, new VDFNode("This is a list item \"that needs escaping\"."));
            a.SetListChild(1, new VDFNode("Here's another."));
            a.SetListChild(2, new VDFNode("And <<another>>."));
            a.SetListChild(3, new VDFNode("This one does not need escaping."));
            a.ToVDF().Should().Be("[\"<<This is a list item \"that needs escaping\".>>\" \"<<Here's another.>>\" \"<<<And <<another>>.>>>\" \"This one does not need escaping.\"]");
        });
        test("D1_List_EscapedStrings2", function () {
            var a = new VDFNode();
            a.SetListChild(0, new VDFNode("ok {}"));
            a.SetListChild(1, new VDFNode("ok []"));
            a.SetListChild(2, new VDFNode("ok :"));
            a.ToVDF().Should().Be("[\"ok {}\" \"ok []\" \"ok :\"]");
        });
        test("D1_Map_EscapedStrings", function () {
            var a = new VDFNode();
            a.SetMapChild(new VDFNode("escape {}"), new VDFNode());
            a.SetMapChild(new VDFNode("escape []"), new VDFNode());
            a.SetMapChild(new VDFNode("escape :"), new VDFNode());
            a.SetMapChild(new VDFNode("escape \""), new VDFNode());
            a.SetMapChild(new VDFNode("escape '"), new VDFNode());
            a.ToVDF().Should().Be("{<<escape {}>>:null <<escape []>>:null <<escape :>>:null <<escape \">>:null <<escape '>>:null}");
        });
        var TypeTest = (function () {
            function TypeTest() {
                this.Serialize.AddTags(new VDFSerialize());
            }
            TypeTest.prototype.Serialize = function () {
                var result = new VDFNode("Object");
                result.metadata_override = "Type";
                return result;
            };
            return TypeTest;
        }());
        test("D1_MetadataShowingNodeToBeOfTypeType", function () {
            //VDFTypeInfo.AddSerializeMethod<Type>(a=>new VDFNode(a.Name, "Type"));
            //VDFTypeInfo.AddDeserializeMethod_FromParent<Type>(node=>Type.GetType(node.primitiveValue.ToString()));
            //var type_object = {Serialize: function() { return new VDFNode("System.Object", "Type"); }.AddTags(new VDFSerialize())}
            var type_object = new TypeTest();
            var map = new Dictionary("object", "object");
            map.Add(type_object, "hi there");
            VDF.Serialize(map).Should().Be("{Type>Object:\"hi there\"}");
        });
        // export all classes/enums to global scope
        ExportInternalClassesTo(window, function (str) { return eval(str); });
    })(Saving_FromVDFNode || (Saving_FromVDFNode = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=FromVDFNode.js.map