// general init // note: this runs globally, so no need to duplicate in the Loading.ts file
// ==========

declare global {
	interface Object {
		Should(): {
			obj: any;
			Be(value, message?: string);
			BeExactly(value, message?: string);
			BeEquivalentTo(otherCollection: Array<any>, message?: string);
		}
	}
}
Object.prototype._AddFunction_Inline = function Should() {
	return {
		Be: (value, message?: string)=> {
			equal(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message);
		},
		BeExactly: (value, message?: string)=> {
			strictEqual(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message);
		},
		BeEquivalentTo: (otherCollection, message?: string) => {
			this.length.Should().Be(otherCollection.length, `Our length ${this.length} does not match other length ${otherCollection.length}.`);
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				var itemInOther = otherCollection[i];
				item.Should().Be(itemInOther, message);
			}
		}
	};
};
declare global {
	interface String { Fix(): string; }
}
String.prototype._AddFunction_Inline = function Fix() { return this.toString(); }; // filler function for C# method to allow for copying, with fewer manual changes
//interface Object { AddTest(testFunc: Function): void; }
//Object.prototype._AddGetterSetter(null, function AddTest/*Inline*/(testFunc) { saving[testFunc.name] = testFunc; });
//saving.AddTest = function testName() { ok(null == null); };

var test_old = test;

// saving init
// ==========

var saving = {};
export function Saving_RunTests() {
	for (var name in saving)
		test_old(name, saving[name]);
}

// the normal "test" function actually runs test
// here we replace it with a function that merely "registers the test to be run later on" (when the Saving button is pressed)
window["test"] = function(name, func) { saving[name] = func; };
window["test_custom"] = function(name, func) { saving[name] = func; };
//export function Test(name, func) { saving[name] = func; }

// loading init
// ==========

var loading = {};
export function Loading_RunTests() {
	for (var name in loading)
		test_old(name, loading[name]);
}

// the normal "test" function actually runs test
// here we replace it with a function that merely "registers the test to be run later on" (when the Loading button is pressed)
window["test"] = function(name, func) { loading[name] = func; };

// others
// ==========

//function ExportInternalClassesTo(hostObj, funcWithInternalClasses, evalFunc) {
export function ExportInternalClassesTo(hostObj, evalFunc) {
	var funcWithInternalClasses = arguments.callee.caller;
	var names = V.GetMatches(funcWithInternalClasses.toString(), /        var (\w+) = \(function \(\) {/g, 1);
	for (var i = 0; i < names.length; i++)
		try { hostObj[names[i]] = evalFunc(names[i]); } catch (e) {}
	var enumNames = V.GetMatches(funcWithInternalClasses.toString(), /        }\)\((\w+) \|\| \(\w+ = {}\)\);/g, 1);
	for (var i = 0; i < enumNames.length; i++)
		try { hostObj[enumNames[i]] = evalFunc(enumNames[i]); } catch (e) {}
}