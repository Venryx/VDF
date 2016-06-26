using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using FluentAssertions;
using VDFN;
using Xunit;

namespace VDFTests {
	public static class Loading_ClassExtensions {
		public static string Fix(this string self) { return self.Replace("\r\n", "\n"); } // maybe temp
	}
	public class Loading_General {
		// deserialize-related methods
		// ==========

		class D1_MapWithEmbeddedDeserializeMethod_Prop_Class {
			public bool boolProp;
			[VDFDeserialize] void Deserialize(VDFNode node) { boolProp = node["boolProp"]; }
		}
		[Fact] void D1_MapWithEmbeddedDeserializeMethod_Prop() { VDF.Deserialize<D1_MapWithEmbeddedDeserializeMethod_Prop_Class>("{boolProp:true}").boolProp.Should().Be(true); }

		class D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class {
			public bool boolProp;
			[VDFDeserialize] object Deserialize(VDFNode node) { return VDF.NoActionTaken; }
		}
		[Fact] void D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop() { VDF.Deserialize<D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class>("{boolProp:true}").boolProp.Should().Be(true); }

		class D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent {
			public D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child child;
		}
		class D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child {
			[VDFDeserialize(fromParent: true)] static D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child Deserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options) { return null; }
		}
		[Fact] void D1_MapWithEmbeddedDeserializeFromParentMethod_Prop() { VDF.Deserialize<D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent>("{child:{}}").child.Should().Be(null); }

		class D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent {
			public D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child child;
		}
		class D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child {
			public bool boolProp;
			[VDFDeserialize(fromParent: true)] static object Deserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options) { return VDF.NoActionTaken; }
		}
		[Fact] void D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop() { VDF.Deserialize<D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent>("{child:{boolProp:true}}").child.boolProp.Should().Be(true); }

		class D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent {
			[P] public D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child withoutTag;
			[P, Tags("tag")] public D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child withTag;
		}
		class D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child {
			public bool methodCalled;
			[VDFDeserialize] void Deserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options) {
				path.parentNode.obj.Should().BeOfType<D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent>();
				if (path.currentNode.prop.memberInfo.GetCustomAttributes(typeof(Tags), true).OfType<Tags>().Any(a=>a.tags.Contains("tag")))
					methodCalled = true;
			}
		}
		[Fact] void D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag() {
			var a = VDF.Deserialize<D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent>("{withoutTag:{} withTag:{}}");
			a.withoutTag.methodCalled.Should().Be(false);
			a.withTag.methodCalled.Should().Be(true);
		}

		class D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Parent {
			public D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Child child;
		}
		class D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Child {
			public bool called;
		}
		[Fact] void D1_MapWithExtensionDeserializeFromParentMethod_Prop() {
			VDFTypeInfo.AddDeserializeMethod_FromParent(node=>new D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Child {called = true});

			VDF.Deserialize<D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Parent>("{child:{}}").child.called.Should().Be(true);
		}

		// for JSON compatibility
		// ==========

		[Fact] void D1_Map_IntsWithStringKeys() {
			var a = VDFLoader.ToVDFNode("{\"key1\":0 \"key2\":1}", new VDFLoadOptions(allowStringKeys: true));
			a.mapChildren.Count.Should().Be(2);
			a["key1"].primitiveValue.Should().Be(0);
		}
		[Fact] void D1_List_IntsWithCommaSeparators() {
			var a = VDFLoader.ToVDFNode("[0,1]", new VDFLoadOptions(allowCommaSeparators: true));
			a.listChildren.Count.Should().Be(2);
			a[0].primitiveValue.Should().Be(0);
		}
		[Fact] void D3_List_NumbersWithScientificNotation() {
			var a = VDFLoader.ToVDFNode("[-7.45058e-09,0.1,-1.49012e-08]", new VDFLoadOptions().ForJSON());
			a[0].primitiveValue.Should().Be(-7.45058e-09);
		}

		// unique to C# version
		// ==========

		[Fact] void D0_FloatAutoCastToDouble() {
			var a = VDFLoader.ToVDFNode("1.5");
			float b = a;
			b.Should().Be(1.5f);
		}
		//[Fact] void D1_PropLoadError_DuplicateDictionaryKeys() { ((Action)(()=>VDFLoader.ToVDFNode("{scores:{Dan:0 Dan:1}}"))).ShouldThrow<ArgumentException>().WithMessage("*same key*"); }
		/*class SpecialList3<T> : List<T> {}
		[Fact] void D1_SpecialListItem()
		{
			VDF.RegisterTypeImporter_Inline(typeof(SpecialList3<>), obj=>new SpecialList3<string>{"Obvious first-item data."}); // example of where exporters/importers that can output/input VDFNode's would be helpful
			VDF.Deserialize<SpecialList3<string>>("'<<Fake data-string that doesn't matter.>>'").Should().BeEquivalentTo(new SpecialList3<string> {"Obvious first-item data."});
		}
		[Fact] void D1_SpecialListItem_GenericTypeArgs()
		{
			VDF.RegisterTypeImporter_Inline(typeof(SpecialList3<>), (obj, genericArgs)=>new SpecialList3<string>{"Obvious first-item data; of type: " + genericArgs.First().Name.ToLower()}); // note; example of where exporters/importers that can output/input VDFNode's would be helpful
			VDF.Deserialize<SpecialList3<string>>("'<<Fake data-string that doesn't matter.>>'").Should().BeEquivalentTo(new SpecialList3<string> {"Obvious first-item data; of type: string"});
		}*/
		[Fact] void D1_ListOfTypeArray() {
			var a = VDF.Deserialize<int[]>("[0 1]");
			a[0].Should().Be(0);
			a[1].Should().Be(1);
		}
		[Fact] void D1_ListOfTypeArrayList() {
			var a = VDF.Deserialize<ArrayList>("[0 1]");
			a[0].Should().Be(0);
			a[1].Should().Be(1);
		}
	}
}