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

// temp 1: from
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

var Depth1_Object_DictionaryPoppedOutThenBool_Class1 = (function () {
    function Depth1_Object_DictionaryPoppedOutThenBool_Class1() {
        this.messages = new Dictionary("string", "string", ["title1", "message1"], ["title2", "message2"]);
        this.otherProperty = true;
    }
    Depth1_Object_DictionaryPoppedOutThenBool_Class1.typeInfo = new VDFTypeInfo(false, false, {
        messages: new VDFPropInfo("Dictionary[string,string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return Depth1_Object_DictionaryPoppedOutThenBool_Class1;
})();
var Saving_Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = (function () {
    function Saving_Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1() {
        this.messages = new Dictionary("string", "string", ["title1", "message1"], ["title2", "message2"]);
        this.otherProperty = true;
    }
    Saving_Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1.typeInfo = new VDFTypeInfo(false, true, {
        messages: new VDFPropInfo("Dictionary[string,string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return Saving_Depth1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1;
})();

var T1_Depth1 = (function () {
    function T1_Depth1() {
        this.level2 = new T1_Depth2();
    }
    T1_Depth1.typeInfo = new VDFTypeInfo(false, false, {
        level2: new VDFPropInfo("T1_Depth2")
    });
    return T1_Depth1;
})();
var T1_Depth2 = (function () {
    function T1_Depth2() {
        this.messages = new List("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
        this.otherProperty = true;
    }
    T1_Depth2.typeInfo = new VDFTypeInfo(false, false, {
        messages: new VDFPropInfo("Dictionary[string,string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return T1_Depth2;
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

var T4_Depth1 = (function () {
    function T4_Depth1() {
        this.level2 = new T4_Depth2();
    }
    T4_Depth1.typeInfo = new VDFTypeInfo(false, false, {
        level2: new VDFPropInfo("T4_Depth2_Depth2")
    });
    return T4_Depth1;
})();
var T4_Depth2 = (function () {
    function T4_Depth2() {
        this.level3_first = new T4_Depth3();
        this.level3_second = new T4_Depth3();
    }
    T4_Depth2.typeInfo = new VDFTypeInfo(false, false, {
        level3_first: new VDFPropInfo("T4_Depth3"),
        level3_second: new VDFPropInfo("T4_Depth3")
    });
    return T4_Depth2;
})();
var T4_Depth3 = (function () {
    function T4_Depth3() {
        this.level4s = new List("T4_Depth4", new T4_Depth4(), new T4_Depth4());
    }
    T4_Depth3.typeInfo = new VDFTypeInfo(false, false, {
        level4s: new VDFPropInfo("List[T4_Depth4]", true, true)
    });
    return T4_Depth3;
})();
var T4_Depth4 = (function () {
    function T4_Depth4() {
        this.messages = new List("string", "text1", "text2");
        this.otherProperty = false;
    }
    T4_Depth4.typeInfo = new VDFTypeInfo(false, false, {
        messages: new VDFPropInfo("List[string]", true, true),
        otherProperty: new VDFPropInfo("bool")
    });
    return T4_Depth4;
})();

var T5_Depth2 = (function () {
    function T5_Depth2() {
        this.firstProperty = false;
        this.otherProperty = false;
    }
    T5_Depth2.typeInfo = new VDFTypeInfo(false, true, {
        firstProperty: new VDFPropInfo("bool"),
        otherProperty: new VDFPropInfo("bool")
    });
    return T5_Depth2;
})();

/*class Saving
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
// General Init // note: this runs globally, so no need to duplicate in the Loading.ts file
// ==========
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
    return this;
}; // filler function for C# method to allow for copying, with fewer manual changes

//interface Object { AddTest(testFunc: Function): void; }
//Object.prototype._AddGetterSetter(null, function AddTest/*Inline*/(testFunc) { saving[testFunc.name] = testFunc; });
//saving.AddTest = function testName() { ok(null == null); };
var test_old = test;

// Init
// ==========
var saving = {};
function Saving_RunTests() {
    for (var name in saving)
        test_old(name, saving[name]);
}

window["test"] = function (name, func) {
    saving[name] = func;
};

var VDFTests;
(function (VDFTests) {
    var Saving;
    (function (Saving) {
        test("D0_Comment", function () {
            var a = VDFLoader.ToVDFNode("## comment\n\
'Root string.'");
            a.primitiveValue.Should().Be("Root string.");
        });
        test("D0_Comment2", function () {
            var a = VDFLoader.ToVDFNode("'Root string ends here.'## comment");
            a.primitiveValue.Should().Be("Root string ends here.");
        });
        test("D0_BaseValue", function () {
            var a = VDFLoader.ToVDFNode("'Root string.'");
            a.primitiveValue.Should().Be("Root string."); // note; remember that for ambiguous cases like this, the base-like-value is added both as the obj's base-value and as its solitary item
        });
    })(Saving || (Saving = {}));
})(VDFTests || (VDFTests = {}));
//# sourceMappingURL=Saving.js.map
