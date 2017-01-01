// general init // note: this runs globally, so no need to duplicate in the Loading.ts file
// ==========
System.register([], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    //interface Object { AddTest(testFunc: Function): void; }
    //Object.prototype._AddGetterSetter(null, function AddTest/*Inline*/(testFunc) { saving[testFunc.name] = testFunc; });
    //saving.AddTest = function testName() { ok(null == null); };
    // others
    // ==========
    //function ExportInternalClassesTo(hostObj, funcWithInternalClasses, evalFunc) {
    function ExportInternalClassesTo(hostObj, evalFunc) {
        var funcWithInternalClasses = arguments.callee.caller;
        var names = V.GetMatches(funcWithInternalClasses.toString(), /        var (\w+) = \(function \(\) {/g, 1);
        for (var i = 0; i < names.length; i++)
            try {
                hostObj[names[i]] = evalFunc(names[i]);
            }
            catch (e) { }
        var enumNames = V.GetMatches(funcWithInternalClasses.toString(), /        }\)\((\w+) \|\| \(\w+ = {}\)\);/g, 1);
        for (var i = 0; i < enumNames.length; i++)
            try {
                hostObj[enumNames[i]] = evalFunc(enumNames[i]);
            }
            catch (e) { }
    }
    exports_1("ExportInternalClassesTo", ExportInternalClassesTo);
    return {
        setters: [],
        execute: function () {// general init // note: this runs globally, so no need to duplicate in the Loading.ts file
            // ==========
            Object.prototype._AddFunction_Inline = function Should() {
                var _this = this;
                return {
                    Be: function (value, message) {
                        equal(_this instanceof Number ? parseFloat(_this) : (_this instanceof String ? _this.toString() : _this), value, message);
                    },
                    BeExactly: function (value, message) {
                        strictEqual(_this instanceof Number ? parseFloat(_this) : (_this instanceof String ? _this.toString() : _this), value, message);
                    },
                    BeEquivalentTo: function (otherCollection, message) {
                        _this.length.Should().Be(otherCollection.length, "Our length " + _this.length + " does not match other length " + otherCollection.length + ".");
                        for (var i = 0; i < _this.length; i++) {
                            var item = _this[i];
                            var itemInOther = otherCollection[i];
                            item.Should().Be(itemInOther, message);
                        }
                    }
                };
            };
            String.prototype._AddFunction_Inline = function Fix() { return this.toString(); }; // filler function for C# method to allow for copying, with fewer manual changes
        }
    };
});
//# sourceMappingURL=GeneralInit.js.map