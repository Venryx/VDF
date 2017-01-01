// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Saving_FromObject;
    (function (Saving_FromObject) {
        // from object
        // ==========
        test("D0_Null", function () { VDF.Serialize(null).Should().Be("null"); });
        test("D0_EmptyString", function () { VDF.Serialize("").Should().Be("\"\""); });
        var D1_IgnoreDefaultValues_Class = (function () {
            function D1_IgnoreDefaultValues_Class() {
                this._helper = TypeInfo(new VDFType("^(?!_)")).set = this;
                this.bool1 = Prop(this, "bool1", "bool", new D()).set = null;
                this.bool2 = Prop(this, "bool2", "bool", new D(true)).set = true;
                this.bool3 = Prop(this, "bool3", "bool").set = true;
                this.string1 = Prop(this, "string1", "string", new D()).set = null;
                this.string2 = Prop(this, "string2", "string", new D("value1")).set = "value1";
                this.string3 = Prop(this, "string3", "string").set = "value1";
            }
            return D1_IgnoreDefaultValues_Class;
        }());
        test("D1_IgnoreDefaultValues", function () {
            VDF.Serialize(new D1_IgnoreDefaultValues_Class(), "D1_IgnoreDefaultValues_Class").Should().Be("{bool3:true string3:\"value1\"}");
        });
        var D1_NullValues_Class = (function () {
            function D1_NullValues_Class() {
                this.obj = Prop(this, "obj", "object", new P()).set = null;
                this.strings = Prop(this, "strings", "List(string)", new P()).set = null;
                this.strings2 = Prop(this, "strings2", "List(string)", new P()).set = new List("string");
            }
            return D1_NullValues_Class;
        }());
        test("D1_NullValues", function () {
            var a = VDFSaver.ToVDFNode(new D1_NullValues_Class());
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
                this.defaultString = Prop(this, "defaultString", "string", new P(true), new D()).set = null;
            }
            return TypeWithDefaultStringProp;
        }());
        test("D1_IgnoreEmptyString", function () { VDF.Serialize(new TypeWithDefaultStringProp(), "TypeWithDefaultStringProp").Should().Be("{}"); });
        var TypeWithNullProps = (function () {
            function TypeWithNullProps() {
                this.obj = Prop(this, "obj", "object", new P()).set = null;
                this.strings = Prop(this, "strings", "List(string)", new P()).set = null;
                this.strings2 = Prop(this, "strings2", "List(string)", new P()).set = new List("string");
            }
            return TypeWithNullProps;
        }());
        test("D1_NullValues", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
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
                this.list = Prop(this, "list", "List(string)", new P(true, true)).set = new List("string", "A", "B");
            }
            return TypeWithList_PopOutItemData;
        }());
        test("D1_ListItems_PoppedOutChildren", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithList_PopOutItemData(), "TypeWithList_PopOutItemData");
            a.ToVDF().Should().Be("{list:[^]}\n\
	\"A\"\n\
	\"B\"".replace(/\r/g, ""));
        });
        test("D1_ListItems_Null", function () {
            var a = VDFSaver.ToVDFNode(new List("string", null));
            ok(a[0].metadata == null); //a[0].metadata.Should().Be(null);
            ok(a[0].primitiveValue == null); //a[0].primitiveValue.Should().Be(null);
            a.ToVDF().Should().Be("List(string)>[null]");
        });
        test("D1_SingleListItemWithAssemblyKnownTypeShouldStillSpecifySortOfType", function () {
            var a = VDFSaver.ToVDFNode(new List("string", "hi"), "List(string)");
            a.ToVDF().Should().Be("[\"hi\"]");
        });
        test("D1_StringAndArraysInArray", function () { VDF.Serialize(new List("object", "text", new List("string", "a", "b"))).Should().Be("[\"text\" List(string)>[\"a\" \"b\"]]"); });
        test("D1_DictionaryValues_Null", function () {
            var dictionary = new Dictionary("string", "string");
            dictionary.Add("key1", null);
            var a = VDFSaver.ToVDFNode(dictionary);
            ok(a["key1"].metadata == null); //a["key1"].metadata.Should().Be(null);
            ok(a["key1"].primitiveValue == null); //a["key1"].primitiveValue.Should().Be(null);
            a.ToVDF().Should().Be("Dictionary(string string)>{key1:null}");
        });
        test("D1_AnonymousTypeProperties_MarkNoTypes", function () {
            var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
            a["Bool"].primitiveValue.Should().Be(false);
            a["Int"].primitiveValue.Should().Be(5);
            a["Double"].primitiveValue.Should().Be(.5);
            a["String"].primitiveValue.Should().Be("Prop value string.");
            a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
        });
        test("D1_AnonymousTypeProperties_MarkAllTypes", function () {
            var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
            a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
        });
        var D1_PreSerialize_Class = (function () {
            function D1_PreSerialize_Class() {
                this.preSerializeWasCalled = Prop(this, "preSerializeWasCalled", "bool", new P()).set = false;
                this.PreSerialize.AddTags(new VDFPreSerialize());
            }
            D1_PreSerialize_Class.prototype.PreSerialize = function () { this.preSerializeWasCalled = true; };
            return D1_PreSerialize_Class;
        }());
        test("D1_PreSerialize", function () {
            var a = VDFSaver.ToVDFNode(new D1_PreSerialize_Class(), "D1_PreSerialize_Class");
            a["preSerializeWasCalled"].primitiveValue.Should().Be(true);
            a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
        });
        var D1_SerializePropMethod_Class = (function () {
            function D1_SerializePropMethod_Class() {
                this.prop1 = Prop(this, "prop1", new P()).set = 0;
            }
            D1_SerializePropMethod_Class.prototype.SerializeProp = function (propPath, options) { return new VDFNode(1); };
            return D1_SerializePropMethod_Class;
        }());
        D1_SerializePropMethod_Class.prototype.SerializeProp.AddTags(new VDFSerializeProp());
        test("D1_SerializePropMethod", function () {
            var a = VDF.Serialize(new D1_SerializePropMethod_Class(), "D1_SerializePropMethod_Class");
            a.Should().Be("{prop1:1}");
        });
        var TypeWithPostSerializeCleanupMethod = (function () {
            function TypeWithPostSerializeCleanupMethod() {
                this.postSerializeWasCalled = Prop(this, "postSerializeWasCalled", "bool", new P()).set = false;
                this.PostSerialize.AddTags(new VDFPostSerialize());
            }
            TypeWithPostSerializeCleanupMethod.prototype.PostSerialize = function () { this.postSerializeWasCalled = true; };
            return TypeWithPostSerializeCleanupMethod;
        }());
        test("D1_PostSerializeCleanup", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
            a["postSerializeWasCalled"].primitiveValue.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
            a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
        });
        var TypeWithMixOfProps = (function () {
            function TypeWithMixOfProps() {
                this.Bool = Prop(this, "Bool", "bool", new P()).set = true;
                this.Int = Prop(this, "Int", "int", new P()).set = 5;
                this.Double = Prop(this, "Double", "double", new P()).set = .5;
                this.String = Prop(this, "String", "string", new P()).set = "Prop value string.";
                this.list = Prop(this, "list", "List(string)", new P()).set = new List("string", "2A", "2B");
                this.nestedList = Prop(this, "nestedList", "List(List(string))", new P()).set = new List("List(string)", new List("string", "1A"));
            }
            return TypeWithMixOfProps;
        }());
        test("D1_TypeProperties_MarkForNone", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
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
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.Internal }));
            a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
        });
        test("D1_TypeProperties_MarkForExternal", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
            a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:List(string)>[\"2A\" \"2B\"] nestedList:List(List(string))>[[\"1A\"]]}");
        });
        test("D1_TypeProperties_MarkForExternalNoCollapse", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.ExternalNoCollapse }));
            a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:bool>true Int:int>5 Double:double>.5 String:string>\"Prop value string.\" list:List(string)>[string>\"2A\" string>\"2B\"] nestedList:List(List(string))>[List(string)>[string>\"1A\"]]}");
        });
        var D1_Object_DictionaryPoppedOutThenBool_Class1 = (function () {
            function D1_Object_DictionaryPoppedOutThenBool_Class1() {
                this.messages = Prop(this, "messages", "Dictionary(string string)", new P(true, true)).set = new Dictionary("string", "string", { title1: "message1", title2: "message2" });
                this.otherProperty = Prop(this, "otherProperty", "Dictionary(string string)", new P()).set = true;
            }
            return D1_Object_DictionaryPoppedOutThenBool_Class1;
        }());
        test("D1_DictionaryPoppedOutThenBool", function () {
            var a = VDFSaver.ToVDFNode(new D1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
            a.ToVDF().Should().Be("{messages:{^} otherProperty:true}\n\
	title1:\"message1\"\n\
	title2:\"message2\"".replace(/\r/g, ""));
        });
        var D1_Map_PoppedOutDictionary_PoppedOutPairs_Class = (function () {
            function D1_Map_PoppedOutDictionary_PoppedOutPairs_Class() {
                this._helper = TypeInfo(new VDFType(null, true)).set = this;
                this.messages = Prop(this, "messages", "Dictionary(string string)", new P(true, true)).set = new Dictionary("string", "string", {
                    title1: "message1",
                    title2: "message2"
                });
                this.otherProperty = Prop(this, "otherProperty", "bool", new P()).set = true;
            }
            return D1_Map_PoppedOutDictionary_PoppedOutPairs_Class;
        }());
        test("D1_Map_PoppedOutDictionary_PoppedOutPairs", function () {
            var a = VDFSaver.ToVDFNode(new D1_Map_PoppedOutDictionary_PoppedOutPairs_Class(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
            a.ToVDF().Should().Be("{^}\n\
	messages:{^}\n\
		title1:\"message1\"\n\
		title2:\"message2\"\n\
	otherProperty:true".replace(/\r/g, ""));
        });
        var T1_Depth1 = (function () {
            function T1_Depth1() {
                this.level2 = Prop(this, "level2", "T1_Depth2", new P()).set = new T1_Depth2();
            }
            return T1_Depth1;
        }());
        var T1_Depth2 = (function () {
            function T1_Depth2() {
                this.messages = Prop(this, "messages", "List(string)", new P(true, true)).set = new List("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
                this.otherProperty = Prop(this, "otherProperty", "bool", new P()).set = true;
            }
            return T1_Depth2;
        }());
        test("D2_Map_ListThenBool_PoppedOutStringsWithOneMultiline", function () {
            var a = VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
            a.ToVDF().Should().Be("{level2:{messages:[^] otherProperty:true}}\n\
	\"<<DeepString1_Line1\n\
	DeepString1_Line2>>\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
        });
        var Level1 = (function () {
            function Level1() {
                this.level2 = Prop(this, "level2", "Level2", new P()).set = new Level2();
            }
            return Level1;
        }());
        var Level2 = (function () {
            function Level2() {
                this.level3_first = Prop(this, "level3_first", "Level3", new P()).set = new Level3();
                this.level3_second = Prop(this, "level3_second", "Level3", new P()).set = new Level3();
            }
            return Level2;
        }());
        var Level3 = (function () {
            function Level3() {
                this.messages = Prop(this, "messages", "List(string)", new P(true, true)).set = new List("string", "DeepString1", "DeepString2");
            }
            return Level3;
        }());
        test("D3_Map_Map_Maps_Lists_PoppedOutStrings", function () {
            var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
            a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[^]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"\n\
	^\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
        });
        test("D3_Map_Map_Maps_ListsWithOneEmpty_PoppedOutStrings", function () {
            var obj = new Level1();
            obj.level2.level3_second.messages = new List("string");
            var a = VDFSaver.ToVDFNode(obj, new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
            a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
        });
        var T4_Depth1 = (function () {
            function T4_Depth1() {
                this.level2 = Prop(this, "level2", "T4_Depth2)", new P()).set = new T4_Depth2();
            }
            return T4_Depth1;
        }());
        var T4_Depth2 = (function () {
            function T4_Depth2() {
                this.level3_first = Prop(this, "level3_first", "T4_Depth3", new P()).set = new T4_Depth3();
                this.level3_second = Prop(this, "level3_second", "T4_Depth3", new P()).set = new T4_Depth3();
            }
            return T4_Depth2;
        }());
        var T4_Depth3 = (function () {
            function T4_Depth3() {
                this.level4s = Prop(this, "level4s", "List(T4_Depth4)", new P(true, true)).set = new List("T4_Depth4", new T4_Depth4(), new T4_Depth4());
            }
            return T4_Depth3;
        }());
        var T4_Depth4 = (function () {
            function T4_Depth4() {
                this.messages = Prop(this, "messages", "List(string)", new P(true, true)).set = new List("string", "text1", "text2");
                this.otherProperty = Prop(this, "otherProperty", "bool", new P()).set = false;
            }
            return T4_Depth4;
        }());
        test("D4_Map_Map_Maps_Lists_PoppedOutMaps_ListsThenBools_PoppedOutStrings", function () {
            var a = VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaveOptions({ typeMarking: VDFTypeMarking.None }));
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
                this._helper = TypeInfo(new VDFType(null, true)).set = this;
                this.firstProperty = Prop(this, "firstProperty", "bool", new P()).set = false;
                this.otherProperty = Prop(this, "otherProperty", "bool", new P()).set = false;
            }
            return T5_Depth2;
        }());
        test("D4_List_Map_PoppedOutBools", function () {
            var a = VDFSaver.ToVDFNode(new List("T5_Depth2", new T5_Depth2()), new VDFSaveOptions({ typeMarking: VDFTypeMarking.External }));
            a.ToVDF().Should().Be("List(T5_Depth2)>[{^}]\n\
	firstProperty:false\n\
	otherProperty:false".replace(/\r/g, ""));
        });
        // export all classes/enums to global scope
        ExportInternalClassesTo(window, function (str) { return eval(str); });
    })(Saving_FromObject || (Saving_FromObject = {}));
})(VDFTests || (VDFTests = {}));
