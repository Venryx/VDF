import { VDFLoadOptions } from "../../../Source/TypeScript/VDFLoader";
import {VDFDeserializeProp, P, _VDFPreDeserialize, T, _VDFPostDeserialize, _VDFDeserialize, TypeInfo, _VDFDeserializeProp} from "../../../Source/TypeScript/VDFTypeInfo";
import { VDFNode } from "../../../Source/TypeScript/VDFNode";
import {VDF} from "../../../Source/TypeScript/VDF";
import {VDFNodePath, Dictionary} from "../../../Source/TypeScript/VDFExtras";
import {ExportInternalClassesTo} from "../GeneralInit";

export var tests = [];
function test(name, func) { tests.push({name, func}); }

// tests
// ==========

module VDFTests { // added to match C# indentation
	module Loading_ToObject {
		// to object
		// ==========

		test("D0_Null", () => {
			ok(VDF.Deserialize("null") == null);
			//VDF.Deserialize("null").Should().Be(null);
		});
		//test("D0_Nothing() { VDF.Deserialize("").Should().Be(null); });
		//test("D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); });
		test("D0_EmptyString", () => { VDF.Deserialize("''").Should().Be(""); });
		test("D0_Bool", () => { VDF.Deserialize("true", "bool").Should().Be(true); });
		test("D0_Double", () => { VDF.Deserialize("1.5").Should().Be(1.5); });
		//test("D0_Float", ()=> { VDF.Deserialize<float>("1.5").Should().Be(1.5f); });

		class D1_DeserializePropMethod_Class {
			@_VDFDeserializeProp() DeserializeProp(node: VDFNode, propPath: VDFNodePath, options: VDFLoadOptions) { return 1; }
			@P() prop1 = 0;
		}
		test("D1_DeserializePropMethod", () => {
			var a = VDF.Deserialize("{prop1:0}", "D1_DeserializePropMethod_Class");
			a.prop1.Should().Be(1);
		});

		class TypeWithPreDeserializeMethod {
			@T("bool") @P() flag = false;
			@_VDFPreDeserialize() PreDeserialize(): void { this.flag = true; }
		}
		test("D1_PreDeserializeMethod", () => {
			var a = VDF.Deserialize("{}", "TypeWithPreDeserializeMethod");
			a.flag.Should().Be(true);
		});
		class TypeWithPostDeserializeMethod {
			@T("bool") @P() flag = false;
			@_VDFPostDeserialize() PostDeserialize(): void { this.flag = true; }
		}
		test("D1_PostDeserializeMethod", () => {
			var a = VDF.Deserialize("{}", "TypeWithPostDeserializeMethod");
			a.flag.Should().Be(true);
		});
		class ObjectWithPostDeserializeMethodRequiringCustomMessage_Class {
			@T("bool") @P() flag = false;
			@_VDFPostDeserialize() PostDeserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions): void {
				if (<string>options.messages[0] == "RequiredMessage") this.flag = true;
			}
		}
		test("D0_ObjectWithPostDeserializeMethodRequiringCustomMessage", () => { VDF.Deserialize("{}", "ObjectWithPostDeserializeMethodRequiringCustomMessage_Class", new VDFLoadOptions(null, ["WrongMessage"])).flag.Should().Be(false); });
		/*class ObjectWithPostDeserializeConstructor_Class {
			static typeInfo = new VDFTypeInfo({
				flag: new PInfo("bool")
			});
			flag = false;
			ObjectWithPostDeserializeConstructor_Class() { flag = true; }
		}
		test("D1_ObjectWithPostDeserializeConstructor", ()=> { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); });*/
		class ObjectWithPostDeserializeOptionsFunc_Class_Parent {
			@T("ObjectWithPostDeserializeOptionsFunc_Class_Child")
			child: ObjectWithPostDeserializeOptionsFunc_Class_Child = null;
		}
		class ObjectWithPostDeserializeOptionsFunc_Class_Child {
			static flag = false;
			@_VDFDeserialize(true) static Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions) {
				options.AddObjPostDeserializeFunc(path.rootNode.obj, () => ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = true);
				return null;
			}
		}
		test("D1_ObjectWithPostDeserializeOptionsFunc", () => {
			var options = new VDFLoadOptions();
			ok(VDF.Deserialize("{child:{}}", "ObjectWithPostDeserializeOptionsFunc_Class_Parent", options).child == null);
			ObjectWithPostDeserializeOptionsFunc_Class_Child.flag.Should().Be(true);
		});

		class TypeInstantiatedManuallyThenFilled {
			@T("bool") @P() flag = false;
		}
		test("D1_InstantiateTypeManuallyThenFill", () => {
			var a = new TypeInstantiatedManuallyThenFilled();
			VDF.DeserializeInto("{flag:true}", a);
			a.flag.Should().Be(true);
		});
		@TypeInfo(null, true)
		class D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 {
			_helper = this;
			@T("Dictionary(string string)") @P() messages = new Dictionary<string, string>("string", "string", {
				title1: "message1",
				title2: "message2"
			});
			@T("bool") @P() otherProperty = false;
		}
		test("D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", () => {
			var a = VDF.Deserialize(
				"{^}\n\
	messages:{^}\n\
		title1:'message1'\n\
		title2:'message2'\n\
	otherProperty:true", "D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1");
			a.messages.Count.Should().Be(2);
			a.messages["title1"].Should().Be("message1");
			a.messages["title2"].Should().Be("message2");
			a.otherProperty.Should().Be(true);
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str => eval(str));
	}
}