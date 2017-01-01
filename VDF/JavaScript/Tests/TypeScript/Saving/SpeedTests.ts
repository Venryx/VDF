import {P, T} from "../../../Source/TypeScript/VDFTypeInfo";
import {VDFSaver, VDFSaveOptions, VDFTypeMarking} from "../../../Source/TypeScript/VDFSaver";
import {List} from "../../../Source/TypeScript/VDFExtras";
import {ExportInternalClassesTo} from "../GeneralInit";

export var tests = [];
function test(name, func) { tests.push({name, func}); }

// tests
// ==========

module VDFTests { // added to match C# indentation
	module Saving_SpeedTests {
		class SpeedTest1_Class {
			@T("bool") @P() Bool = true;
			@T("int") @P() Int = 5;
			@T("double") @P() Double = .5;
			@T("string") @P() String = "Prop value string.";
			@T("List(string)") @P() list = new List<string>("string", "2A", "2B");
			@T("List(List(string))") @P() nestedList = new List<List<string>>("List(string)", new List<string>("string", "1A"));
		}
		test("SpeedTest1", ()=> {
			var a = VDFSaver.ToVDFNode(new SpeedTest1_Class(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a["Bool"].primitiveValue.Should().Be(true);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a["list"][0].primitiveValue.Should().Be("2A");
			a["list"][1].primitiveValue.Should().Be("2B");
			a["nestedList"][0][0].primitiveValue.Should().Be("1A");
			//for (var i = 0; i < 10000; i++)
			var vdf = a.ToVDF();
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
	}
}