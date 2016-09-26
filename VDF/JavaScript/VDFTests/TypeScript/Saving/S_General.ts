/// <reference path="../../../VDF/TypeScript/VDFTypeInfo.ts" />
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

// init
// ==========

var saving = {};
function Saving_RunTests() {
	for (var name in saving)
		test_old(name, saving[name]);
}

// the normal "test" function actually runs test
// here we replace it with a function that merely "registers the test to be run later on" (when the Saving button is pressed)
window["test"] = function(name, func) { saving[name] = func; };

// tests
// ==========

module VDFTests { // added to match C# indentation
	module Saving_General {
		// general
		// ==========

		test("NodePathToStringReturnsX", ()=> {
			var path = new VDFNodePath(new List<VDFNodePathNode>("VDFNodePathNode"));
			path.nodes.Add(new VDFNodePathNode(null, new VDFPropInfo("prop1", null, [])));
			path.nodes.Add(new VDFNodePathNode(null, null, 1));
			path.nodes.Add(new VDFNodePathNode(null, null, null, 2));
			path.nodes.Add(new VDFNodePathNode(null, null, null, null, <any>"key1"));
			path.toString().Should().Be("prop1/i:1/ki:2/k:key1");
		});

		// prop-inclusion by regex
		// ==========

		class D1_Map_PropWithNameMatchingIncludeRegex_Class {
			_helper = TypeInfo(new VDFType("^[^_]")).set = this;

			_notMatching = Prop(this, "_notMatching", "bool").set = true;
			matching = Prop(this, "matching", "bool").set = true;
		}
		test("D1_Map_PropWithNameMatchingIncludeRegex", ()=> {
			VDF.Serialize(new D1_Map_PropWithNameMatchingIncludeRegex_Class(), "D1_Map_PropWithNameMatchingIncludeRegex_Class").Should().Be("{matching:true}");
		});

		class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base {
			_helper = TypeInfo(new VDFType("^[^_]")).set = this;
		}
		class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived {
			_helper = TypeInfo(new VDFType()).set = this;

			_notMatching = Prop(this, "_notMatching", "bool").set = true;
			matching = Prop(this, "matching", "bool").set = true;
		}
		D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype["__proto__"] = D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base.prototype;
		test("D1_Map_PropWithNameMatchingBaseClassIncludeRegex", ()=> {
			VDF.Serialize(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived(), "D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived").Should().Be("{matching:true}");
		});

		// serialize-related methods
		// ==========

		class D1_MapWithEmbeddedSerializeMethod_Prop_Class {
			notIncluded = Prop(this, "notIncluded", "bool").set = true;
			included = Prop(this, "included", "bool").set = true;

			Serialize(): VDFNode { //PInfo prop, VDFSaveOptions options)
				var result = new VDFNode();
				result.SetMapChild(new VDFNode("included"), new VDFNode(this.included));
				return result;
			}
			constructor() { this.Serialize.AddTags(new VDFSerialize()); }
		}
		//AddAttributes().type = D1_MapWithEmbeddedSerializeMethod_Prop_Class;
		test("D1_MapWithEmbeddedSerializeMethod_Prop", ()=> {
			VDF.Serialize(new D1_MapWithEmbeddedSerializeMethod_Prop_Class(), "D1_MapWithEmbeddedSerializeMethod_Prop_Class").Should().Be("{included:true}");
		});

		class D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class {
			boolProp = Prop(this, "boolProp", "bool", new P()).set = true;
			Serialize() { return; }
			constructor() { this.Serialize.AddTags(new VDFSerialize()); }
		}
		test("D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop", ()=> {
			VDF.Serialize(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class(), "D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class").Should().Be("{boolProp:true}");
		});

		class D1_Map_MapThatCancelsItsSerialize_Class_Parent
			{ child = Prop(this, "child", "D1_Map_MapThatCancelsItsSerialize_Class_Child", new P()).set = new D1_Map_MapThatCancelsItsSerialize_Class_Child(); }
		class D1_Map_MapThatCancelsItsSerialize_Class_Child {
			Serialize() { return VDF.CancelSerialize; }
			constructor() { this.Serialize.AddTags(new VDFSerialize()); }
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
			ints = Prop(this, "ints", "List(int)", new P()).set = new List<number>("int", 0, 1);
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