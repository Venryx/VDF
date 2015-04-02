﻿/*class Saving
{
static initialized: boolean;
static Init()
{
if (this.initialized)
return;
this.initialized = true;
Object.prototype._AddFunction_Inline = function Should()
{
return 0 || // fix for auto-semicolon-insertion
{
Be: (value, message?: string) => { equal(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); },
BeExactly: (value, message?: string) => { strictEqual(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); }
};
};
}
static RunTests()
{
/*test("testName()
{
ok(null == null);
});*#/
}
}*/
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

String.prototype._AddFunction_Inline = function Fix() {
    return this.toString();
}; // filler function for C# method to allow for copying, with fewer manual changes

//interface Object { AddTest(testFunc: Function): void; }
//Object.prototype._AddGetterSetter(null, function AddTest/*Inline*/(testFunc) { saving[testFunc.name] = testFunc; });
//saving.AddTest = function testName() { ok(null == null); };
var test_old = test;

// init
// ==========
var saving = {};
function Saving_RunTests() {
    for (var name in saving)
        test_old(name, saving[name]);
}

window["test"] = function (name, func) {
    saving[name] = func;
};

// tests
// ==========
var VDFTests;
(function (VDFTests) {
    var Saving;
    (function (Saving) {
        // from VDFNode
        // ==========
        test("D0_BaseValue", function () {
            var a = new VDFNode();
            a.primitiveValue = "Root string.";
            a.ToVDF().Should().Be("\"Root string.\"");
        });
        test("D0_MetadataType", function () {
            var a = new VDFNode();
            a.metadata = "string";
            a.primitiveValue = "Root string.";
            a.ToVDF().Should().Be("string>\"Root string.\"");
        });
        test("D0_MetadataTypeCollapsed", function () {
            var a = VDFSaver.ToVDFNode(new List("string"), new VDFSaveOptions({ typeMarking: 2 /* External */ }));
            a.ToVDF().Should().Be("List(string)>[]");
            a = VDFSaver.ToVDFNode(new List("List(string)", new List("string", "1A", "1B", "1C")), new VDFSaveOptions({ typeMarking: 2 /* External */ }));
            a.ToVDF().Should().Be("List(List(string))>[[\"1A\" \"1B\" \"1C\"]]"); // old: only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
        });
        test("D0_MetadataTypeNoCollapse", function () {
            var a = VDFSaver.ToVDFNode(new List("string"), new VDFSaveOptions({ typeMarking: 3 /* ExternalNoCollapse */ }));
            a.ToVDF().Should().Be("List(string)>[]");
            a = VDFSaver.ToVDFNode(new List("List(string)", new List("string", "1A", "1B", "1C")), new VDFSaveOptions({ typeMarking: 3 /* ExternalNoCollapse */ }));
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
            var a = VDFSaver.ToVDFNode(1 /* A */, "Enum1");
            a.ToVDF().Should().Be("\"A\"");
        });
        test("D0_EnumDefault_IncludeType", function () {
            var a = VDFSaver.ToVDFNode(1 /* A */, "Enum1", new VDFSaveOptions({ typeMarking: 2 /* External */ }));
            a.ToVDF().Should().Be("Enum1>\"A\"");
        });
        test("D0_EscapedString", function () {
            var a = VDFSaver.ToVDFNode("Multiline string\n\
that needs escaping.".Fix(), "string");
            a.ToVDF().Should().Be("\"<<Multiline string\n\
that needs escaping.>>\"".Fix());

            a = VDFSaver.ToVDFNode("String \"that needs escaping\".", "string");
            a.ToVDF().Should().Be("\"<<String \"that needs escaping\".>>\"");

            a = VDFSaver.ToVDFNode("String <<that needs escaping>>.", "string");
            a.ToVDF().Should().Be("\"<<<String <<that needs escaping>>.>>>\"");
        });

        test("D1_ListInferredFromHavingItem_String", function () {
            var a = new VDFNode();
            a.SetListChild(0, new VDFNode("String item."));
            a.ToVDF().Should().Be("[\"String item.\"]");
        });
        test("D1_Object_Primitives", function () {
            var a = new VDFNode();
            a.SetMapChild("bool", new VDFNode(false));
            a.SetMapChild("int", new VDFNode(5));
            a.SetMapChild("double", new VDFNode(.5));
            a.SetMapChild("string", new VDFNode("Prop value string."));
            a.ToVDF().Should().Be("{bool:false int:5 double:.5 string:\"Prop value string.\"}");
        });
        test("D1_List_EscapedStrings", function () {
            var a = new VDFNode();
            a.SetListChild(0, new VDFNode("This is a list item \"that needs escaping\"."));
            a.SetListChild(1, new VDFNode("Here's <<another>>."));
            a.SetListChild(2, new VDFNode("This one doesn't need escaping."));
            a.ToVDF().Should().Be("[\"<<This is a list item \"that needs escaping\".>>\" \"<<<Here's <<another>>.>>>\" \"This one doesn't need escaping.\"]");
        });

        // from object
        // ==========
        test("D0_Null", function () {
            VDF.Serialize(null).Should().Be("null");
        });
        test("D0_EmptyString", function () {
            VDF.Serialize("").Should().Be("\"\"");
        });

        var TypeWithDefaultStringProp = (function () {
            function TypeWithDefaultStringProp() {
            }
            TypeWithDefaultStringProp.typeInfo = new VDFTypeInfo({
                defaultString: new VDFPropInfo("string", true, false, false)
            });
            return TypeWithDefaultStringProp;
        })();
        test("D1_IgnoreEmptyString", function () {
            VDF.Serialize(new TypeWithDefaultStringProp(), "TypeWithDefaultStringProp").Should().Be("{}");
        });
        var TypeWithNullProps = (function () {
            function TypeWithNullProps() {
                this.strings2 = new List("string");
            }
            TypeWithNullProps.typeInfo = new VDFTypeInfo({
                obj: new VDFPropInfo("object", true),
                strings: new VDFPropInfo("List(string)", true),
                strings2: new VDFPropInfo("List(string)", true)
            });
            return TypeWithNullProps;
        })();
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
                this.list = new List("string", "A", "B");
            }
            TypeWithList_PopOutItemData.typeInfo = new VDFTypeInfo({
                list: new VDFPropInfo("List(string)", true, true)
            });
            return TypeWithList_PopOutItemData;
        })();
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
        test("D1_StringAndArraysInArray", function () {
            VDF.Serialize(new List("object", "text", new List("string", "a", "b"))).Should().Be("[\"text\" List(string)>[\"a\" \"b\"]]");
        });
        test("D1_DictionaryValues_Null", function () {
            var dictionary = new Dictionary("string", "string");
            dictionary.Add("key1", null);
            var a = VDFSaver.ToVDFNode(dictionary);
            ok(a["key1"].metadata == null); //a["key1"].metadata.Should().Be(null);
            ok(a["key1"].primitiveValue == null); //a["key1"].primitiveValue.Should().Be(null);
            a.ToVDF().Should().Be("Dictionary(string string)>{key1:null}");
        });
        test("D1_AnonymousTypeProperties_MarkNoTypes", function () {
            var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaveOptions({ typeMarking: 0 /* None */ }));
            a["Bool"].primitiveValue.Should().Be(false);
            a["Int"].primitiveValue.Should().Be(5);
            a["Double"].primitiveValue.Should().Be(.5);
            a["String"].primitiveValue.Should().Be("Prop value string.");
            a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
        });
        test("D1_AnonymousTypeProperties_MarkAllTypes", function () {
            var a = VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaveOptions({ typeMarking: 2 /* External */ }));
            a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
        });
        var TypeWithPreSerializePrepMethod = (function () {
            function TypeWithPreSerializePrepMethod() {
            }
            TypeWithPreSerializePrepMethod.prototype.VDFPreSerialize = function () {
                this.preSerializeWasCalled = true;
            };
            TypeWithPreSerializePrepMethod.typeInfo = new VDFTypeInfo({
                preSerializeWasCalled: new VDFPropInfo("bool", true)
            });
            return TypeWithPreSerializePrepMethod;
        })();
        test("D1_PreSerializePreparation", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod(), "TypeWithPreSerializePrepMethod");
            a["preSerializeWasCalled"].primitiveValue.Should().Be(true);
            a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
        });
        var TypeWithPostSerializeCleanupMethod = (function () {
            function TypeWithPostSerializeCleanupMethod() {
                this.postSerializeWasCalled = false;
            }
            TypeWithPostSerializeCleanupMethod.prototype.VDFPostSerialize = function () {
                this.postSerializeWasCalled = true;
            };
            TypeWithPostSerializeCleanupMethod.typeInfo = new VDFTypeInfo({
                postSerializeWasCalled: new VDFPropInfo("bool", true)
            });
            return TypeWithPostSerializeCleanupMethod;
        })();
        test("D1_PostSerializeCleanup", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
            a["postSerializeWasCalled"].primitiveValue.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
            a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
        });
        var TypeWithMixOfProps = (function () {
            function TypeWithMixOfProps() {
                this.Bool = true;
                this.Int = 5;
                this.Double = .5;
                this.String = "Prop value string.";
                this.list = new List("string", "2A", "2B");
                this.nestedList = new List("List(string)", new List("string", "1A"));
            }
            TypeWithMixOfProps.typeInfo = new VDFTypeInfo({
                Bool: new VDFPropInfo("bool", true),
                Int: new VDFPropInfo("int", true),
                Double: new VDFPropInfo("double", true),
                String: new VDFPropInfo("string", true),
                list: new VDFPropInfo("List(string)", true),
                nestedList: new VDFPropInfo("List(List(string))", true)
            });
            return TypeWithMixOfProps;
        })();
        test("D1_TypeProperties_MarkForNone", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: 0 /* None */ }));
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
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: 1 /* Internal */ }));
            a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
        });
        test("D1_TypeProperties_MarkForExternal", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: 2 /* External */ }));
            a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:List(string)>[\"2A\" \"2B\"] nestedList:List(List(string))>[[\"1A\"]]}");
        });
        test("D1_TypeProperties_MarkForExternalNoCollapse", function () {
            var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions({ typeMarking: 3 /* ExternalNoCollapse */ }));
            a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:bool>true Int:int>5 Double:double>.5 String:string>\"Prop value string.\" list:List(string)>[string>\"2A\" string>\"2B\"] nestedList:List(List(string))>[List(string)>[string>\"1A\"]]}");
        });

        var D1_Object_DictionaryPoppedOutThenBool_Class1 = (function () {
            function D1_Object_DictionaryPoppedOutThenBool_Class1() {
                this.messages = new Dictionary("string", "string", { title1: "message1", title2: "message2" });
                this.otherProperty = true;
            }
            D1_Object_DictionaryPoppedOutThenBool_Class1.typeInfo = new VDFTypeInfo({
                messages: new VDFPropInfo("Dictionary(string string)", true, true),
                otherProperty: new VDFPropInfo("bool", true)
            });
            return D1_Object_DictionaryPoppedOutThenBool_Class1;
        })();
        test("D1_DictionaryPoppedOutThenBool", function () {
            var a = VDFSaver.ToVDFNode(new D1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaveOptions({ typeMarking: 0 /* None */ }));
            a.ToVDF().Should().Be("{messages:{^} otherProperty:true}\n\
	title1:\"message1\"\n\
	title2:\"message2\"".replace(/\r/g, ""));
        });
        var D1_Map_PoppedOutDictionary_PoppedOutPairs_Class = (function () {
            function D1_Map_PoppedOutDictionary_PoppedOutPairs_Class() {
                this.messages = new Dictionary("string", "string", {
                    title1: "message1",
                    title2: "message2"
                });
                this.otherProperty = true;
            }
            D1_Map_PoppedOutDictionary_PoppedOutPairs_Class.typeInfo = new VDFTypeInfo({
                messages: new VDFPropInfo("Dictionary(string string)", true, true),
                otherProperty: new VDFPropInfo("bool", true)
            }, null, true);
            return D1_Map_PoppedOutDictionary_PoppedOutPairs_Class;
        })();
        test("D1_Map_PoppedOutDictionary_PoppedOutPairs", function () {
            var a = VDFSaver.ToVDFNode(new D1_Map_PoppedOutDictionary_PoppedOutPairs_Class(), new VDFSaveOptions({ typeMarking: 0 /* None */ }));
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
            T1_Depth1.typeInfo = new VDFTypeInfo({
                level2: new VDFPropInfo("T1_Depth2", true)
            });
            return T1_Depth1;
        })();
        var T1_Depth2 = (function () {
            function T1_Depth2() {
                this.messages = new List("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
                this.otherProperty = true;
            }
            T1_Depth2.typeInfo = new VDFTypeInfo({
                messages: new VDFPropInfo("List(string)", true, true),
                otherProperty: new VDFPropInfo("bool", true)
            });
            return T1_Depth2;
        })();
        test("D2_Map_ListThenBool_PoppedOutStringsWithOneMultiline", function () {
            var a = VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaveOptions({ typeMarking: 0 /* None */ }));
            a.ToVDF().Should().Be("{level2:{messages:[^] otherProperty:true}}\n\
	\"<<DeepString1_Line1\n\
	DeepString1_Line2>>\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
        });

        var Level1 = (function () {
            function Level1() {
                this.level2 = new Level2();
            }
            Level1.typeInfo = new VDFTypeInfo({
                level2: new VDFPropInfo("Level2", true)
            });
            return Level1;
        })();
        var Level2 = (function () {
            function Level2() {
                this.level3_first = new Level3();
                this.level3_second = new Level3();
            }
            Level2.typeInfo = new VDFTypeInfo({
                level3_first: new VDFPropInfo("Level3", true),
                level3_second: new VDFPropInfo("Level3", true)
            });
            return Level2;
        })();
        var Level3 = (function () {
            function Level3() {
                this.messages = new List("string", "DeepString1", "DeepString2");
            }
            Level3.typeInfo = new VDFTypeInfo({
                messages: new VDFPropInfo("List(string)", true, true)
            });
            return Level3;
        })();
        test("D3_Map_Map_Maps_Lists_PoppedOutStrings", function () {
            var a = VDFSaver.ToVDFNode(new Level1(), new VDFSaveOptions({ typeMarking: 0 /* None */ }));
            a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[^]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"\n\
	^\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
        });
        test("D3_Map_Map_Maps_ListsWithOneEmpty_PoppedOutStrings", function () {
            var obj = new Level1();
            obj.level2.level3_second.messages = new List("string");
            var a = VDFSaver.ToVDFNode(obj, new VDFSaveOptions({ typeMarking: 0 /* None */ }));
            a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
        });

        var T4_Depth1 = (function () {
            function T4_Depth1() {
                this.level2 = new T4_Depth2();
            }
            T4_Depth1.typeInfo = new VDFTypeInfo({
                level2: new VDFPropInfo("T4_Depth2", true)
            });
            return T4_Depth1;
        })();
        var T4_Depth2 = (function () {
            function T4_Depth2() {
                this.level3_first = new T4_Depth3();
                this.level3_second = new T4_Depth3();
            }
            T4_Depth2.typeInfo = new VDFTypeInfo({
                level3_first: new VDFPropInfo("T4_Depth3", true),
                level3_second: new VDFPropInfo("T4_Depth3", true)
            });
            return T4_Depth2;
        })();
        var T4_Depth3 = (function () {
            function T4_Depth3() {
                this.level4s = new List("T4_Depth4", new T4_Depth4(), new T4_Depth4());
            }
            T4_Depth3.typeInfo = new VDFTypeInfo({
                level4s: new VDFPropInfo("List(T4_Depth4)", true, true)
            });
            return T4_Depth3;
        })();
        var T4_Depth4 = (function () {
            function T4_Depth4() {
                this.messages = new List("string", "text1", "text2");
                this.otherProperty = false;
            }
            T4_Depth4.typeInfo = new VDFTypeInfo({
                messages: new VDFPropInfo("List(string)", true, true),
                otherProperty: new VDFPropInfo("bool", true)
            });
            return T4_Depth4;
        })();
        test("D4_Map_Map_Maps_Lists_PoppedOutMaps_ListsThenBools_PoppedOutStrings", function () {
            var a = VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaveOptions({ typeMarking: 0 /* None */ }));
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
            T5_Depth2.typeInfo = new VDFTypeInfo({
                firstProperty: new VDFPropInfo("bool", true),
                otherProperty: new VDFPropInfo("bool", true)
            }, null, true);
            return T5_Depth2;
        })();
        test("D4_List_Map_PoppedOutBools", function () {
            var a = VDFSaver.ToVDFNode(new List("T5_Depth2", new T5_Depth2()), new VDFSaveOptions({ typeMarking: 2 /* External */ }));
            a.ToVDF().Should().Be("List(T5_Depth2)>[{^}]\n\
	firstProperty:false\n\
	otherProperty:false".replace(/\r/g, ""));
        });

        // tag stuff
        // ==========
        var D1_Map_PropWithNameMatchingIncludeRegex_Class = (function () {
            function D1_Map_PropWithNameMatchingIncludeRegex_Class() {
                this._notMatching = true;
                this.matching = true;
            }
            D1_Map_PropWithNameMatchingIncludeRegex_Class.typeInfo = new VDFTypeInfo({
                _notMatching: new VDFPropInfo("bool"),
                matching: new VDFPropInfo("bool")
            }, "^[^_]");
            return D1_Map_PropWithNameMatchingIncludeRegex_Class;
        })();
        test("D1_Map_PropWithNameMatchingIncludeRegex", function () {
            VDF.Serialize(new D1_Map_PropWithNameMatchingIncludeRegex_Class(), "D1_Map_PropWithNameMatchingIncludeRegex_Class").Should().Be("{matching:true}");
        });

        var D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base = (function () {
            function D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base() {
            }
            D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base.typeInfo = new VDFTypeInfo(null, "^[^_]");
            return D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base;
        })();
        var D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived = (function () {
            function D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived() {
                this._notMatching = true;
                this.matching = true;
            }
            D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.typeInfo = new VDFTypeInfo({
                _notMatching: new VDFPropInfo("bool"),
                matching: new VDFPropInfo("bool")
            });
            return D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived;
        })();
        D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype["__proto__"] = D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base.prototype;
        test("D1_Map_PropWithNameMatchingBaseClassIncludeRegex", function () {
            VDF.Serialize(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived(), "D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived").Should().Be("{matching:true}");
        });

        var D1_MapWithEmbeddedSerializeMethod_Prop_Class = (function () {
            function D1_MapWithEmbeddedSerializeMethod_Prop_Class() {
                this.notIncluded = true;
                this.included = true;
            }
            D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype.VDFSerialize = function () {
                var result = new VDFNode();
                result.SetMapChild("included", new VDFNode(this.included));
                return result;
            };
            D1_MapWithEmbeddedSerializeMethod_Prop_Class.typeInfo = new VDFTypeInfo({
                notIncluded: new VDFPropInfo("bool"),
                included: new VDFPropInfo("bool")
            });
            return D1_MapWithEmbeddedSerializeMethod_Prop_Class;
        })();
        test("D1_MapWithEmbeddedSerializeMethod_Prop", function () {
            VDF.Serialize(new D1_MapWithEmbeddedSerializeMethod_Prop_Class(), "D1_MapWithEmbeddedSerializeMethod_Prop_Class").Should().Be("{included:true}");
        });

        // for JSON compatibility
        // ==========
        var D0_MapWithMetadataDisabled_Class = (function () {
            function D0_MapWithMetadataDisabled_Class() {
            }
            return D0_MapWithMetadataDisabled_Class;
        })();
        test("D0_MapWithMetadataDisabled", function () {
            var a = VDFSaver.ToVDFNode(new D0_MapWithMetadataDisabled_Class(), new VDFSaveOptions({ useMetadata: false }));
            ok(a.metadata == null); //a.metadata.Should().Be(null);
        });
        var D0_Map_List_BoolsWithPopOutDisabled_Class = (function () {
            function D0_Map_List_BoolsWithPopOutDisabled_Class() {
                this.ints = new List("int", 0, 1);
            }
            D0_Map_List_BoolsWithPopOutDisabled_Class.typeInfo = new VDFTypeInfo({
                ints: new VDFPropInfo("List(int)", true, true)
            });
            return D0_Map_List_BoolsWithPopOutDisabled_Class;
        })();
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
        var arguments;
        var classNames = V.GetMatches(arguments.callee.toString(), /        var (\w+) = \(function \(\) {/g, 1);
        for (var i = 0; i < classNames.length; i++)
            try  {
                window[classNames[i]] = eval(classNames[i]);
            } catch (e) {
            }
        var enumNames = V.GetMatches(arguments.callee.toString(), /        }\)\((\w+) \|\| \(\w+ = {}\)\);/g, 1);
        for (var i = 0; i < enumNames.length; i++)
            try  {
                window[enumNames[i]] = eval(enumNames[i]);
            } catch (e) {
            }
    })(Saving || (Saving = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=Saving.js.map
