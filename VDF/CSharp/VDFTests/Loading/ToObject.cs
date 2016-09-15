using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using FluentAssertions;
using VDFN;
using Xunit;

namespace VDFTests {
	public class Loading_ToObject {
		// to object
		// ==========

		[Fact] void D0_Null() { VDF.Deserialize("null").Should().Be(null); }
		//[Fact] void D0_Nothing() { VDF.Deserialize("").Should().Be(null); }
		//[Fact] void D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); }
		[Fact] void D0_EmptyString() { VDF.Deserialize("''").Should().Be(""); }
		[Fact] void D0_Bool() { VDF.Deserialize<bool>("true").Should().Be(true); }
		[Fact] void D0_Double() { VDF.Deserialize("1.5").Should().Be(1.5); }
		[Fact] void D0_Float() { VDF.Deserialize<float>("1.5").Should().Be(1.5f); }

		class D1_DeserializePropMethod_Class {
			[VDFDeserializeProp] object DeserializeProp(VDFNode node, VDFNodePath propPath, VDFLoadOptions options) { return 1; }
			[P] public object prop1 = 0;
		}
		[Fact] void D1_DeserializePropMethod() {
			var a = VDF.Deserialize<D1_DeserializePropMethod_Class>("{prop1:0}");
			a.prop1.Should().Be(1);
		}

		class TypeWithPreDeserializeMethod {
			[P] public bool flag;
			[VDFPreDeserialize] void VDFPreDeserialize() { flag = true; }
		}
		[Fact] void D1_PreDeserializeMethod() {
			var a = VDF.Deserialize<TypeWithPreDeserializeMethod>("{}");
			a.flag.Should().Be(true);
		}
		class TypeWithPostDeserializeMethod {
			[P] public bool flag;
			[VDFPostDeserialize] void VDFPostDeserialize() { flag = true; }
		}
		[Fact] void D1_PostDeserializeMethod() {
			var a = VDF.Deserialize<TypeWithPostDeserializeMethod>("{}");
			a.flag.Should().Be(true);
		}
		class ObjectWithPostDeserializeMethodRequiringCustomMessage_Class {
			public bool flag;
			[VDFPostDeserialize] void VDFPostDeserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options) {
				if ((string)options.messages[0] == "RequiredMessage")
					flag = true;
			}
		}
		[Fact] void D0_ObjectWithPostDeserializeMethodRequiringCustomMessage() { VDF.Deserialize<ObjectWithPostDeserializeMethodRequiringCustomMessage_Class>("{}", new VDFLoadOptions(new List<object> {"WrongMessage"})).flag.Should().Be(false); }
		class ObjectWithPostDeserializeConstructor_Class {
			public bool flag;
			[VDFPostDeserialize] ObjectWithPostDeserializeConstructor_Class() { flag = true; }
		}
		[Fact] void D1_ObjectWithPostDeserializeConstructor() { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); }
		class ObjectWithPostDeserializeOptionsFunc_Class_Parent {
			public ObjectWithPostDeserializeOptionsFunc_Class_Child child;
		}
		class ObjectWithPostDeserializeOptionsFunc_Class_Child {
			public static bool flag;
			[VDFDeserialize(fromParent: true)] static object Deserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options) {
				options.AddObjPostDeserializeFunc(path.rootNode.obj, ()=>flag = true);
				return null;
			}
		}
		[Fact] void D1_ObjectWithPostDeserializeOptionsFunc() {
			VDFLoadOptions options = new VDFLoadOptions();
			VDF.Deserialize<ObjectWithPostDeserializeOptionsFunc_Class_Parent>("{child:{}}", options).child.Should().Be(null);
			ObjectWithPostDeserializeOptionsFunc_Class_Child.flag.Should().Be(true);
		}

		/*class D1_MapWithPostDeserializeMethodInBaseClass_Prop_Class_Base
		{
			public bool called;
			[VDFPostDeserialize] public void PostDeserialize() { called = true; } // important: PostDeserialize methods in a base class must be made public // maybe todo: add code to auto-add private base-class members as well
		}
		class D1_MapWithPostDeserializeMethodInBaseClass_Prop_Class_Derived : D1_MapWithPostDeserializeMethodInBaseClass_Prop_Class_Base {}
		[Fact] void D1_MapWithPostDeserializeMethodInBaseClass_Prop() { VDF.Deserialize<D1_MapWithPostDeserializeMethodInBaseClass_Prop_Class_Derived>("{}").called.Should().Be(true); }*/

		class TypeInstantiatedManuallyThenFilled {
			[P] public bool flag;
		}
		[Fact] void D1_InstantiateTypeManuallyThenFill() {
			var a = new TypeInstantiatedManuallyThenFilled();
			VDF.DeserializeInto("{flag:true}", a);
			a.flag.Should().Be(true);
		}
		[VDFType(popOutL1: true)] class D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 {
			[P(popOutL2: true)] public Dictionary<string, string> messages = new Dictionary<string, string> {
				{"title1", "message1"},
				{"title2", "message2"}
			};
			[P] public bool otherProperty;
		}
		[Fact] void D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool() {
			var a = VDF.Deserialize<D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1>(
@"{^}
	messages:{^}
		title1:'message1'
		title2:'message2'
	otherProperty:true");
			a.messages.Count.Should().Be(2);
			a.messages["title1"].Should().Be("message1");
			a.messages["title2"].Should().Be("message2");
			a.otherProperty.Should().Be(true);
		}
	}
}