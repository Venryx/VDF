import {VDFPropInfo, TypeInfo, T, _VDFSerialize, P} from "../../../Source/TypeScript/VDFTypeInfo";
import {VDFNode} from "../../../Source/TypeScript/VDFNode";
import {VDFSaver, VDFSaveOptions} from "../../../Source/TypeScript/VDFSaver";
import {VDFNodePathNode, VDFNodePath, List, Dictionary, object} from "../../../Source/TypeScript/VDFExtras";
import {VDF} from "../../../Source/TypeScript/VDF";
import {ExportInternalClassesTo} from "../GeneralInit";

/*class Saving {
	static initialized: boolean;
	static Init() 	{
		if (this.initialized)
			return;
		this.initialized = true;
		Object.prototype._AddFunction_Inline = function Should() 		{
			return {
				Be: (value, message?: string) => { equal(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); },
				BeExactly: (value, message?: string) => { strictEqual(this instanceof Number ? parseFloat(this) : (this instanceof String ? this.toString() : this), value, message); }
			};
		};
	}

	static RunTests() {
		/*test("testName() {
			ok(null == null);
		});*#/
	}
}*/

// make sure we import all the other saving tests from here (this file's the root)
import {tests as tests1} from "./FromObject";
import {tests as tests2} from "./FromVDFNode";
import {tests as tests3} from "./SpeedTests";

export var tests = tests1.concat(tests2).concat(tests3);
function test(name, func) { tests.push({name, func}); }

// tests
// ==========

module VDFTests { // added to match C# indentation
	module Saving_General {
		// general
		// ==========

		test("NodePathToStringReturnsX", ()=> {
			var path = new VDFNodePath(new List<VDFNodePathNode>("VDFNodePathNode"));
			path.nodes.push(new VDFNodePathNode(null, new VDFPropInfo("prop1", null, [])));
			path.nodes.push(new VDFNodePathNode(null, null, 1));
			path.nodes.push(new VDFNodePathNode(null, null, null, 2));
			path.nodes.push(new VDFNodePathNode(null, null, null, null, <any>"key1"));
			path.toString().Should().Be("prop1/i:1/ki:2/k:key1");
		});

		// prop-inclusion by regex
		// ==========

		@TypeInfo("^[^_]") class D1_Map_PropWithNameMatchingIncludeRegex_Class {
			@T("bool") _notMatching = true;
			@T("bool") matching = true;
		}
		test("D1_Map_PropWithNameMatchingIncludeRegex", ()=> {
			VDF.Serialize(new D1_Map_PropWithNameMatchingIncludeRegex_Class(), "D1_Map_PropWithNameMatchingIncludeRegex_Class").Should().Be("{matching:true}");
		});

		@TypeInfo("^[^_]") class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base {}
		@TypeInfo() class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived extends D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base {
			@T("bool") _notMatching = true;
			@T("bool") matching = true;
		}
		test("D1_Map_PropWithNameMatchingBaseClassIncludeRegex", ()=> {
			VDF.Serialize(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived(), "D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived").Should().Be("{matching:true}");
		});

		// serialize-related methods
		// ==========

		class D1_MapWithEmbeddedSerializeMethod_Prop_Class {
			@T("bool") notIncluded = true;
			@T("bool") included = true;

			@_VDFSerialize() Serialize() { //PInfo prop, VDFSaveOptions options)
				var result = new VDFNode();
				result.SetMapChild(new VDFNode("included"), new VDFNode(this.included));
				return result;
			}
		}
		//AddAttributes().type = D1_MapWithEmbeddedSerializeMethod_Prop_Class;
		test("D1_MapWithEmbeddedSerializeMethod_Prop", ()=> {
			VDF.Serialize(new D1_MapWithEmbeddedSerializeMethod_Prop_Class(), "D1_MapWithEmbeddedSerializeMethod_Prop_Class").Should().Be("{included:true}");
		});

		class D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class {
			@T("bool") @P() boolProp = true;
			@_VDFSerialize() Serialize() { return; }
		}
		test("D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop", ()=> {
			VDF.Serialize(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class(), "D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class").Should().Be("{boolProp:true}");
		});

		class D1_Map_MapThatCancelsItsSerialize_Class_Parent {
			@T("D1_Map_MapThatCancelsItsSerialize_Class_Child") @P() child = new D1_Map_MapThatCancelsItsSerialize_Class_Child();
		}
		class D1_Map_MapThatCancelsItsSerialize_Class_Child {
			@_VDFSerialize() Serialize() { return VDF.CancelSerialize; }
		}
		test("D1_Map_MapThatCancelsItsSerialize", ()=> {
			VDF.Serialize(new D1_Map_MapThatCancelsItsSerialize_Class_Parent(), "D1_Map_MapThatCancelsItsSerialize_Class_Parent").Should().Be("{}");
		});

		// for JSON compatibility
		// ==========

		class D0_MapWithMetadataDisabled_Class {}
		test("D0_MapWithMetadataDisabled", ()=> {
			var a = VDFSaver.ToVDFNode(new D0_MapWithMetadataDisabled_Class(), new VDFSaveOptions({useMetadata: false}));
			ok(a.metadata == null); //a.metadata.Should().Be(null);
		});
		class D0_Map_List_BoolsWithPopOutDisabled_Class {
			@T("List(int)") @P() ints = new List<number>("int", 0, 1);
		}
		test("D0_Map_List_BoolsWithPopOutDisabled", ()=> {
			var a = VDFSaver.ToVDFNode(new D0_Map_List_BoolsWithPopOutDisabled_Class(), "D0_Map_List_BoolsWithPopOutDisabled_Class", new VDFSaveOptions({useChildPopOut: false}));
			a.ToVDF().Should().Be("{ints:[0 1]}");
		});
		test("D1_Map_IntsWithStringKeys", ()=> {
			var a = VDFSaver.ToVDFNode(new Dictionary<object, object>("object", "object", {
				key1: 0,
				key2: 1
			}), new VDFSaveOptions({useStringKeys: true}));
			a.ToVDF(new VDFSaveOptions({useStringKeys: true})).Should().Be("{\"key1\":0 \"key2\":1}");
		});
		test("D1_Map_DoublesWithNumberTrimmingDisabled", ()=> {
			var a = VDFSaver.ToVDFNode(new List<object>("object", .1, 1.1), new VDFSaveOptions({useNumberTrimming: false}));
			a.ToVDF(new VDFSaveOptions({useNumberTrimming: false})).Should().Be("[0.1 1.1]");
		});
		test("D1_List_IntsWithCommaSeparators", ()=> {
			var a = VDFSaver.ToVDFNode(new List<object>("object", 0, 1), new VDFSaveOptions({useCommaSeparators: true}));
			a.listChildren.Count.Should().Be(2);
			a.ToVDF(new VDFSaveOptions({useCommaSeparators: true})).Should().Be("[0,1]");
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
		
		// make sure we create one instance, so that the type-info attachment code can run
		(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base()).toString();
	}
}