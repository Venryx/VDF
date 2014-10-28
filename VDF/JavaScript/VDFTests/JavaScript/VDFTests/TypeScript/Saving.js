/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
Saving.Init();
window["oldTest"](title, testFunc);
}*/
var TypeWithEmptyStringProp = (function () {
    function TypeWithEmptyStringProp() {
        this.emptyString = "";
    }
    TypeWithEmptyStringProp.typeInfo = new VDFTypeInfo(false, false, {
        emptyString: new VDFPropInfo("string", true, false, false)
    });
    return TypeWithEmptyStringProp;
})();
var TypeWithNullProps = (function () {
    function TypeWithNullProps() {
        this.strings2 = new List("string");
    }
    TypeWithNullProps.typeInfo = new VDFTypeInfo(false, false, {
        obj: new VDFPropInfo("object"),
        strings: new VDFPropInfo("List[string]"),
        strings2: new VDFPropInfo("List[string]")
    });
    return TypeWithNullProps;
})();
var TypeWithList_PopOutItemData = (function () {
    function TypeWithList_PopOutItemData() {
        this.list = new List("string", "A", "B");
    }
    TypeWithList_PopOutItemData.typeInfo = new VDFTypeInfo(false, false, {
        list: new VDFPropInfo("List[string]", true, true)
    });
    return TypeWithList_PopOutItemData;
})();
var TypeWithPreSerializePrepMethod = (function () {
    function TypeWithPreSerializePrepMethod() {
    }
    TypeWithPreSerializePrepMethod.prototype.VDFPreSerialize = function () {
        this.preSerializeWasCalled = true;
    };
    TypeWithPreSerializePrepMethod.typeInfo = new VDFTypeInfo(false, false, {
        preSerializeWasCalled: new VDFPropInfo("bool")
    });
    return TypeWithPreSerializePrepMethod;
})();
var TypeWithPostSerializeCleanupMethod = (function () {
    function TypeWithPostSerializeCleanupMethod() {
        this.postSerializeWasCalled = false;
    }
    TypeWithPostSerializeCleanupMethod.prototype.VDFPostSerialize = function () {
        this.postSerializeWasCalled = true;
    };
    TypeWithPostSerializeCleanupMethod.typeInfo = new VDFTypeInfo(false, false, {
        postSerializeWasCalled: new VDFPropInfo("bool")
    });
    return TypeWithPostSerializeCleanupMethod;
})();
var TypeWithMixOfProps = (function () {
    function TypeWithMixOfProps() {
        this.Bool = true;
        this.Int = 5;
        this.Float = .5;
        this.String = "Prop value string.";
        this.list = new List("string", "2A", "2B");
        this.nestedList = new List("List[string]", new List("string", "1A"));
    }
    TypeWithMixOfProps.typeInfo = new VDFTypeInfo(false, false, {
        Bool: new VDFPropInfo("bool"),
        Int: new VDFPropInfo("int"),
        Float: new VDFPropInfo("float"),
        String: new VDFPropInfo("string"),
        list: new VDFPropInfo("List[string]"),
        nestedList: new VDFPropInfo("List[List[string]]")
    });
    return TypeWithMixOfProps;
})();
var Enum1;
(function (Enum1) {
    Enum1[Enum1["_IsEnum"] = 0] = "_IsEnum";
    Enum1[Enum1["A"] = 1] = "A";
    Enum1[Enum1["B"] = 2] = "B";
    Enum1[Enum1["C"] = 3] = "C";
})(Enum1 || (Enum1 = {}));

var FromObject_Level1_Object_DictionaryPoppedOutThenBool_Class1 = (function () {
    function FromObject_Level1_Object_DictionaryPoppedOutThenBool_Class1() {
        this.messages = new Dictionary("string", "string", ["title1", "message1"], ["title2", "message2"]);
        this.otherProperty = true;
    }
    FromObject_Level1_Object_DictionaryPoppedOutThenBool_Class1.typeInfo = new VDFTypeInfo(false, false, {
        messages: new VDFPropInfo("Dictionary[string,string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return FromObject_Level1_Object_DictionaryPoppedOutThenBool_Class1;
})();
var FromObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = (function () {
    function FromObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1() {
        this.messages = new Dictionary("string", "string", ["title1", "message1"], ["title2", "message2"]);
        this.otherProperty = true;
    }
    FromObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1.typeInfo = new VDFTypeInfo(false, true, {
        messages: new VDFPropInfo("Dictionary[string,string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return FromObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1;
})();

var T1_Level1 = (function () {
    function T1_Level1() {
        this.level2 = new T1_Level2();
    }
    T1_Level1.typeInfo = new VDFTypeInfo(false, false, {
        level2: new VDFPropInfo("T1_Level2")
    });
    return T1_Level1;
})();
var T1_Level2 = (function () {
    function T1_Level2() {
        this.messages = new List("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
        this.otherProperty = true;
    }
    T1_Level2.typeInfo = new VDFTypeInfo(false, false, {
        messages: new VDFPropInfo("Dictionary[string,string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return T1_Level2;
})();

var Level1 = (function () {
    function Level1() {
        this.level2 = new Level2();
    }
    Level1.typeInfo = new VDFTypeInfo(false, false, {
        level2: new VDFPropInfo("Level2")
    });
    return Level1;
})();
var Level2 = (function () {
    function Level2() {
        this.level3_first = new Level3();
        this.level3_second = new Level3();
    }
    Level2.typeInfo = new VDFTypeInfo(false, false, {
        level3_first: new VDFPropInfo("Level3"),
        level3_second: new VDFPropInfo("Level3")
    });
    return Level2;
})();
var Level3 = (function () {
    function Level3() {
        this.messages = new List("string", "DeepString1", "DeepString2");
    }
    Level3.typeInfo = new VDFTypeInfo(false, false, {
        messages: new VDFPropInfo("List[string]", true, true)
    });
    return Level3;
})();

var T4_Level1 = (function () {
    function T4_Level1() {
        this.level2 = new T4_Level2();
    }
    T4_Level1.typeInfo = new VDFTypeInfo(false, false, {
        level2: new VDFPropInfo("T4_Level2_level2")
    });
    return T4_Level1;
})();
var T4_Level2 = (function () {
    function T4_Level2() {
        this.level3_first = new T4_Level3();
        this.level3_second = new T4_Level3();
    }
    T4_Level2.typeInfo = new VDFTypeInfo(false, false, {
        level3_first: new VDFPropInfo("T4_Level3"),
        level3_second: new VDFPropInfo("T4_Level3")
    });
    return T4_Level2;
})();
var T4_Level3 = (function () {
    function T4_Level3() {
        this.level4s = new List("T4_Level4", new T4_Level4(), new T4_Level4());
    }
    T4_Level3.typeInfo = new VDFTypeInfo(false, false, {
        level4s: new VDFPropInfo("List[T4_Level4]", true, true)
    });
    return T4_Level3;
})();
var T4_Level4 = (function () {
    function T4_Level4() {
        this.messages = new List("string", "text1", "text2");
        this.otherProperty = false;
    }
    T4_Level4.typeInfo = new VDFTypeInfo(false, false, {
        messages: new VDFPropInfo("List[string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return T4_Level4;
})();

var T5_Level2 = (function () {
    function T5_Level2() {
        this.firstProperty = false;
        this.otherProperty = false;
    }
    T5_Level2.typeInfo = new VDFTypeInfo(false, true, {
        firstProperty: new VDFPropInfo("bool"),
        otherProperty: new VDFPropInfo("bool")
    });
    return T5_Level2;
})();

var Saving = (function () {
    function Saving() {
    }
    Saving.Init = function () {
        if (this.initialized)
            return;
        this.initialized = true;
        Object.prototype._AddFunction_Inline = function Should() {
            var _this = this;
            return 0 || {
                Be: function (value, message) {
                    equal(_this instanceof Number ? parseFloat(_this) : (_this instanceof String ? _this.toString() : _this), value, message);
                },
                BeExactly: function (value, message) {
                    strictEqual(_this instanceof Number ? parseFloat(_this) : (_this instanceof String ? _this.toString() : _this), value, message);
                }
            };
        };
    };

    Saving.RunTests = function () {
        // from VDFNode
        // ==========
        test("FromVDFNode_Level0_BaseValue", function () {
            var a = new VDFNode();
            a.baseValue = "Root string.";
            a.ToVDF().Should().Be("Root string.");

            a = new VDFNode();
            a.SetItem(0, new VDFNode("Root string also."));
            a.ToVDF().Should().Be("Root string also.");
        });
        test("FromVDFNode_Level0_Metadata_Type", function () {
            var a = new VDFNode();
            a.metadata_type = "string";
            a.baseValue = "Root string.";
            a.ToVDF().Should().Be("string>Root string.");
        });
        test("FromVDFNode_Level0_Metadata_Type_Collapsed", function () {
            var a = VDFSaver.ToVDFNode(new List("string"), new VDFSaveOptions(null, 2 /* AssemblyExternal */));
            a.ToVDF().Should().Be("string>>");
            a = VDFSaver.ToVDFNode(new List("List[string]", new List("string", "1A", "1B", "1C")), new VDFSaveOptions(null, 2 /* AssemblyExternal */));
            a.ToVDF().Should().Be("List[List[string]]>>{1A|1B|1C}"); // only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
        });
        test("FromVDFNode_Level0_EnumDefault", function () {
            var a = VDFSaver.ToVDFNode(1 /* A */, "Enum1");
            a.ToVDF().Should().Be("A");
        });
        test("FromVDFNode_Level0_MultilineString", function () {
            var a = VDFSaver.ToVDFNode("This is a\nmultiline string\nof three lines in total.", "string");
            a.ToVDF().Should().Be("@@This is a\nmultiline string\nof three lines in total.@@");
        });
        test("FromVDFNode_Level1_TroublesomeLiteral", function () {
            var a = new VDFNode();
            a.SetItem(0, new VDFNode("This is a list item that|needs|escaping."));
            a.SetItem(1, new VDFNode("Here's;;another."));
            a.SetItem(2, new VDFNode("This is a list item that doesn't need escaping."));
            a.ToVDF().Should().Be("@@This is a list item that|needs|escaping.@@|@@Here's;;another.@@|This is a list item that doesn't need escaping.");
        });

        test("FromVDFNode_Level1_BaseValues", function () {
            var a = new VDFNode();
            a.SetProperty("bool", new VDFNode("false"));
            a.SetProperty("int", new VDFNode("5"));
            a.SetProperty("float", new VDFNode(".5"));
            a.SetProperty("string", new VDFNode("Prop value string."));
            a.ToVDF().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
        });
        test("FromVDFNode_Level1_BaseValuesThatNeedEscaping", function () {
            var a = new VDFNode("string>In-string VDF data.");
            a.ToVDF().Should().Be("@@string>In-string VDF data.@@");
            a = new VDFNode("C:/path/with/colon/char/that/needs/escaping");
            a.ToVDF().Should().Be("@@C:/path/with/colon/char/that/needs/escaping@@");
        });

        // from object
        // ==========
        test("FromObject_Level0_Null", function () {
            VDF.Serialize(null).Should().Be(">null");
        });
        test("FromObject_Level0_EmptyString", function () {
            VDF.Serialize("").Should().Be(">empty");
        });

        test("FromObject_Level1_IgnoreEmptyString", function () {
            VDF.Serialize(new TypeWithEmptyStringProp(), "TypeWithEmptyStringProp").Should().Be("");
        });
        test("FromObject_Level1_NullValues", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
            a["obj"].metadata_type.Should().Be(""); // type "null" should be collapsed
            a["obj"].baseValue.Should().Be("null");
            a["strings"].metadata_type.Should().Be("");
            a["strings"].baseValue.Should().Be("null");
            equal(a["strings2"].metadata_type, null); // unmarked type
            equal(a["strings2"].baseValue, null); // it's a List, so it shouldn't have a base-value
            a["strings2"].items.length.Should().Be(0);
            a.ToVDF().Should().Be("TypeWithNullProps>obj{>null}strings{>null}strings2{}");
        });
        test("FromObject_Level1_ListItems_PoppedOutChildren", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithList_PopOutItemData(), "TypeWithList_PopOutItemData");
            a.ToVDF().Should().Be("list:\n\
	A\n\
	B".replace(/\r/g, ""));
        });
        test("FromObject_Level1_ListItems_Null", function () {
            var a = VDFSaver.ToVDFNode(new List("string", null));
            a[0].metadata_type.Should().Be("");
            a[0].baseValue.Should().Be("null");
            a.ToVDF().Should().Be("string>>>null");
        });
        test("FromObject_Level1_StringAndArraysInArray", function () {
            return VDF.Serialize(new List("object", "text", new List("string", "a", "b"))).Should().Be(">>{text}|{string>>a|b}");
        });
        test("FromObject_Level1_DictionaryValues_Null", function () {
            var a = VDFSaver.ToVDFNode(new Dictionary("string", "string", ["key1", null]));
            a["key1"].metadata_type.Should().Be("");
            a["key1"].baseValue.Should().Be("null");
            a.ToVDF().Should().Be("string,string>>key1{>null}");
        });
        test("FromObject_Level1_AnonymousTypeProperties_MarkNoTypes", function () {
            var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Float: .5, String: "Prop value string." }, new VDFSaveOptions(null, 0 /* None */));
            a["Bool"].baseValue.Should().Be("false");
            a["Int"].baseValue.Should().Be("5");
            a["Float"].baseValue.Should().Be(".5");
            a["String"].baseValue.Should().Be("Prop value string.");
            a.ToVDF().Should().Be("Bool{false}Int{5}Float{.5}String{Prop value string.}");
        });
        test("FromObject_Level1_AnonymousTypeProperties_MarkAllTypes", function () {
            var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Float: .5, String: "Prop value string." }, new VDFSaveOptions(null, 2 /* AssemblyExternal */));
            a.ToVDF().Should().Be("Bool{>false}Int{>5}Float{>.5}String{Prop value string.}");
        });
        test("FromObject_Level1_PreSerializePreparation", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod(), "TypeWithPreSerializePrepMethod");
            a["preSerializeWasCalled"].AsBool.Should().Be(true);
            a.ToVDF().Should().Be("preSerializeWasCalled{true}");
        });
        test("FromObject_Level1_PostSerializeCleanup", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
            a["postSerializeWasCalled"].AsBool.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
            a.ToVDF().Should().Be("postSerializeWasCalled{false}");
        });
        test("FromObject_Level1_TypeProperties_MarkForNone", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, 0 /* None */));
            a["Bool"].baseValue.Should().Be("true");
            a["Int"].baseValue.Should().Be("5");
            a["Float"].baseValue.Should().Be(".5");
            a["String"].baseValue.Should().Be("Prop value string.");
            a["list"][0].baseValue.Should().Be("2A");
            a["list"][1].baseValue.Should().Be("2B");
            a["nestedList"][0][0].baseValue.Should().Be("1A");
            a.ToVDF().Should().Be("Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
        });
        test("FromObject_Level1_TypeProperties_MarkForAssembly", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, 1 /* Assembly */));
            a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
        });
        test("FromObject_Level1_TypeProperties_MarkForAssemblyExternal", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, 2 /* AssemblyExternal */));
            a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{>true}Int{>5}Float{>.5}String{Prop value string.}list{string>>2A|2B}nestedList{List[List[string]]>>{string>>1A}}");
        });
        test("FromObject_Level1_TypeProperties_MarkForAssemblyExternalNoCollapse", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions(null, 3 /* AssemblyExternalNoCollapse */));
            a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{bool>true}Int{int>5}Float{float>.5}String{string>Prop value string.}list{List[string]>>string>2A|string>2B}nestedList{List[List[string]]>>{List[string]>>string>1A}}");
        });

        test("FromObject_Level1_DictionaryPoppedOutThenBool", function () {
            var a = VDFSaver.ToVDFNode(new FromObject_Level1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions(null, 0 /* None */));
            a.ToVDF().Should().Be("messages:\n\
	title1{message1}\n\
	title2{message2}\n\
^otherProperty{true}".replace(/\r/g, ""));
        });
        test("FromObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", function () {
            var a = VDFSaver.ToVDFNode(new FromObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1(), new VDFSaveOptions(null, 0 /* None */));
            a.ToVDF().Should().Be("\n\
	messages:\n\
		title1{message1}\n\
		title2{message2}\n\
	otherProperty{true}".replace(/\r/g, ""));
        });

        test("FromObject_Level2_Object_ArrayPoppedOutWithMultilineLiteralThenBool", function () {
            var a = VDFSaver.ToVDFNode(new T1_Level1(), new VDFSaveOptions(null, 0 /* None */));
            a.ToVDF().Should().Be("level2{messages:\n\
	@@DeepString1_Line1\n\
	DeepString1_Line2@@\n\
	DeepString2\n\
^otherProperty{true}}".replace(/\r/g, ""));
        });

        test("FromObject_Level3_Object_Array_ArrayPoppedOut", function () {
            var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions(null, 0 /* None */));
            a.ToVDF().Should().Be("level2{level3_first{messages:\n\
	DeepString1\n\
	DeepString2\n\
}level3_second{messages:\n\
	DeepString1\n\
	DeepString2\n\
}}".replace(/\r/g, ""));
        });

        test("FromObject_Level4_Object_Array_ArrayPoppedOut_ArrayPoppedOutThenBool", function () {
            var a = VDFSaver.ToVDFNode(new T4_Level1(), new VDFSaveOptions(null, 0 /* None */));
            a.ToVDF().Should().Be("level2{level3_first{level4s:\n\
	messages:\n\
		text1\n\
		text2\n\
	^otherProperty{false}\n\
	messages:\n\
		text1\n\
		text2\n\
	^otherProperty{false}\n\
}level3_second{level4s:\n\
	messages:\n\
		text1\n\
		text2\n\
	^otherProperty{false}\n\
	messages:\n\
		text1\n\
		text2\n\
	^otherProperty{false}\n\
}}".replace(/\r/g, ""));
        });

        test("FromObject_Level4_Object_ArrayPoppedOut_Object", function () {
            var a = VDFSaver.ToVDFNode(new List("T5_Level2", new T5_Level2()), new VDFSaveOptions(null, 2 /* AssemblyExternal */));
            a.ToVDF().Should().Be("T5_Level2>>{\n\
	firstProperty{>false}\n\
	otherProperty{>false}\n\
}".replace(/\r/g, ""));
        });
    };
    return Saving;
})();
//# sourceMappingURL=Saving.js.map
