import {VDFNode} from "../../../Source/TypeScript/VDFNode";
import {VDFDeserialize, P, T} from "../../../Source/TypeScript/VDFTypeInfo";
import {VDF, VDFNodePath} from "../../../Source/TypeScript/VDF";
import {VDFLoader, VDFLoadOptions} from "../../../Source/TypeScript/VDFLoader";

/*class Loading {
	static initialized = false;
	static Init() {
		if (this.initialized)
			return;
		this.initialized = true;
		Object.prototype._AddFunction_Inline = function Should() {
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

var loading = {};
function Loading_RunTests() {
	for (var name in loading)
		test_old(name, loading[name]);
}

// the normal "test" function actually runs test
// here we replace it with a function that merely "registers the test to be run later on" (when the Loading button is pressed)
window["test"] = function(name, func) { loading[name] = func; };

// tests
// ==========

module VDFTests { // added to match C# indentation
	module Loading_General {
		// deserialize-related methods
		// ==========

		class D1_MapWithEmbeddedDeserializeMethod_Prop_Class {
			@P() boolProp = false;
			Deserialize(node: VDFNode): void { this.boolProp = node["boolProp"].primitiveValue; }
			constructor() { this.Deserialize.AddTags(new VDFDeserialize()); }
		}
		test("D1_MapWithEmbeddedDeserializeMethod_Prop", ()=>{ VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethod_Prop_Class").boolProp.Should().Be(true); });

		class D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class {
			@P() boolProp = false;
			Deserialize(node: VDFNode) { return; }
			constructor() { this.Deserialize.AddTags(new VDFDeserialize()); }
		}
		test("D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop", ()=>{ VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class").boolProp.Should().Be(true); });

		class D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent {
			@T("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child") @P()
			child: D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child = null;
		}
		class D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child {
			static Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions): D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child { return null; }
		}
		D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize.AddTags(new VDFDeserialize(true));
		test("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop", ()=>{ ok(VDF.Deserialize("{child:{}}", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent").child == null); });

		class D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent {
			@T("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child") @P()
			child: D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child = null;
		}
		class D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child {
			@T("bool") @P() boolProp = false;
			static Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions) { return; }
			constructor() { D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize.AddTags(new VDFDeserialize(true)); }
		}
		test("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop", ()=>{ VDF.Deserialize("{child:{boolProp: true}}", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent").child.boolProp.Should().Be(true); });

		class D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent {
			@T("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child") @P()
			withoutTag: D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child = null;
			@T("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child") @P()
			withTag: D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child = null; // doesn't actually have tag; just pretend it does
		}
		class D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child {
			@T("bool") @P() methodCalled = false;
			Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions): void {
				ok(path.parentNode.obj instanceof D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent);
				if (path.currentNode.prop.name == "withTag")
					this.methodCalled = true;
			}
			constructor() { this.Deserialize.AddTags(new VDFDeserialize()); }
		}
		test("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag", ()=>{
			var a = VDF.Deserialize("{withoutTag:{} withTag:{}}", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent");
			a.withoutTag.methodCalled.Should().Be(false);
			a.withTag.methodCalled.Should().Be(true);
		});

		// for JSON compatibility
		// ==========

		test("D1_Map_IntsWithStringKeys", ()=>{
			var a = VDFLoader.ToVDFNode("{\"key1\":0 \"key2\":1}", new VDFLoadOptions({allowStringKeys: true}));
			a.mapChildren.Count.Should().Be(2);
			a["key1"].primitiveValue.Should().Be(0);
		});
		test("D1_List_IntsWithCommaSeparators", ()=>{
			var a = VDFLoader.ToVDFNode("[0,1]", new VDFLoadOptions({allowCommaSeparators: true}));
			a.listChildren.Count.Should().Be(2);
			a[0].primitiveValue.Should().Be(0);
		});
		test("D3_List_NumbersWithScientificNotation", ()=>{
			var a = VDFLoader.ToVDFNode("[-7.45058e-09,0.1,-1.49012e-08]", new VDFLoadOptions().ForJSON());
			a[0].primitiveValue.Should().Be(-7.45058e-09);
		});

		// unique to JavaScript version
		// ==========

		class PretendGenericType {}
		test("Depth0_ObjectWithMetadataHavingGenericType", ()=>ok(VDF.Deserialize("PretendGenericType(object)>{}") instanceof PretendGenericType));

		test("Depth1_UnknownTypeWithFixOn_String", ()=>{
			var a = VDF.Deserialize("UnknownType>{string:'Prop value string.'}", new VDFLoadOptions({loadUnknownTypesAsBasicTypes: true}));
			a["string"].Should().Be("Prop value string.");
		});
		test("Depth1_UnknownTypeWithFixOff_String", ()=>{
			try { VDF.Deserialize("UnknownType>{string:'Prop value string.'}"); }
			catch(ex) { ok(ex.message == "Could not find type \"UnknownType\"."); }
		});
		test("Depth1_Object_UnknownTypeWithFixOn", ()=>{
			var a = VDF.Deserialize("{string:UnkownBaseType>'Prop value string.'}", new VDFLoadOptions({loadUnknownTypesAsBasicTypes: true}));
			a["string"].Should().Be("Prop value string.");
		});
		test("AsObject", ()=>{
			var a = <any>VDF.Deserialize("{bool:bool>false double:double>3.5}", "object");
			a.bool.Should().Be(false);
			a.double.Should().Be(3.5);
		});

		class AsObjectOfType_Class {}
		test("AsObjectOfType", ()=>{
			var a = <any>VDF.Deserialize("AsObjectOfType_Class>{}", "AsObjectOfType_Class");
			ok(a instanceof AsObjectOfType_Class);
		});

		// quick tests
		// ==========

		test("QuickTest1", () => {
			var a = <any>VDF.Deserialize(
'{^}\n\
	structures:[^]\n\
		{typeVObject:string>"VObject>Flag" id:0}\n\
		{typeVObject:string>"VObject>Flag" id:1}', "object");
			a.structures[0].typeVObject.Should().Be("VObject>Flag");
			a.structures[1].id.Should().Be(1);
		});
		
		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
	}
}