using System;
using System.Collections;
using System.Collections.Generic;
using FluentAssertions;
using VDFN;
using Xunit;

namespace VDFTests {
	public class Saving_General {
		// prop-inclusion by regex
		// ==========

		/*class D1_Map_PropWithTagInSaveOptionsIncludeTags_Class
		{
			public bool withoutTag = true;
			[Tags("include")] public bool withTag = true;
		}
		[Fact] void D1_Map_PropWithTagInSaveOptionsIncludeTags()
			{ VDF.Serialize<D1_Map_PropWithTagInSaveOptionsIncludeTags_Class>(new D1_Map_PropWithTagInSaveOptionsIncludeTags_Class(), new VDFSaveOptions(includeTags: new[] {"include"})).Should().Be("{withTag:true}"); }*/

		[VDFType(propIncludeRegexL1: "^[^_]")] class D1_Map_PropWithNameMatchingIncludeRegex_Class {
			public bool _notMatching = true;
			public bool matching = true;
		}
		[Fact] void D1_Map_PropWithNameMatchingIncludeRegex() { VDF.Serialize<D1_Map_PropWithNameMatchingIncludeRegex_Class>(new D1_Map_PropWithNameMatchingIncludeRegex_Class()).Should().Be("{matching:true}"); }

		[VDFType(propIncludeRegexL1: "^[^_]")] class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base {
		}
		[VDFType] class D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived : D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base {
			public bool _notMatching = true;
			public bool matching = true;
		}
		[Fact] void D1_Map_PropWithNameMatchingBaseClassIncludeRegex() { VDF.Serialize<D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived>(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived()).Should().Be("{matching:true}"); }

		// serialize-related methods
		// ==========

		class D1_MapWithEmbeddedSerializeMethod_Prop_Class {
			public bool notIncluded = true;
			public bool included = true;

			[VDFSerialize] VDFNode Serialize() //PInfo prop, VDFSaveOptions options)
			{
				var result = new VDFNode();
				result.mapChildren["included"] = new VDFNode(included);
				return result;
			}
		}
		[Fact] void D1_MapWithEmbeddedSerializeMethod_Prop() { VDF.Serialize<D1_MapWithEmbeddedSerializeMethod_Prop_Class>(new D1_MapWithEmbeddedSerializeMethod_Prop_Class()).Should().Be("{included:true}"); }

		class D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class {
			[P] public bool boolProp = true;
			[VDFSerialize] VDFNode Serialize() { return VDF.NoActionTaken; }
		}
		[Fact] void D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop() { VDF.Serialize<D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class>(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class()).Should().Be("{boolProp:true}"); }

		class D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class {
			[VDFPreSerializeProp] VDFNode PreSerializeProp(VDFNodePath propPath, VDFSaveOptions options) { return VDF.CancelSerialize; }

			[P] public bool boolProp = true;
		}
		[Fact] void D1_Map_BoolWhoseSerializeIsCanceledFromParent() { VDF.Serialize<D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class>(new D1_Map_BoolWhoseSerializeIsCanceledFromParent_Class()).Should().Be("{}"); }

		class D1_Map_MapThatCancelsItsSerialize_Class_Parent {
			[P] public D1_Map_MapThatCancelsItsSerialize_Class_Child child = new D1_Map_MapThatCancelsItsSerialize_Class_Child();
		}
		class D1_Map_MapThatCancelsItsSerialize_Class_Child {
			[VDFSerialize] VDFNode Serialize() { return VDF.CancelSerialize; }
		}
		[Fact] void D1_Map_MapThatCancelsItsSerialize() { VDF.Serialize<D1_Map_MapThatCancelsItsSerialize_Class_Parent>(new D1_Map_MapThatCancelsItsSerialize_Class_Parent()).Should().Be("{}"); }

		// for JSON compatibility
		// ==========

		class D0_MapWithMetadataDisabled_Class {
		}
		[Fact] void D0_MapWithMetadataDisabled() {
			var a = VDFSaver.ToVDFNode(new D0_MapWithMetadataDisabled_Class(), new VDFSaveOptions(useMetadata: false));
			a.metadata.Should().Be(null);
		}
		class D0_Map_List_BoolsWithPopOutDisabled_Class {
			[P(true, true)] List<int> ints = new List<int> {0, 1};
		}
		[Fact] void D0_Map_List_BoolsWithPopOutDisabled() {
			var a = VDFSaver.ToVDFNode<D0_Map_List_BoolsWithPopOutDisabled_Class>(new D0_Map_List_BoolsWithPopOutDisabled_Class(), new VDFSaveOptions(useChildPopOut: false));
			a.ToVDF().Should().Be("{ints:[0 1]}");
		}
		[Fact] void D1_Map_IntsWithStringKeys() {
			var a = VDFSaver.ToVDFNode(new Dictionary<object, object> {{"key1", 0}, {"key2", 1}}, new VDFSaveOptions(useStringKeys: true));
			a.ToVDF(new VDFSaveOptions(useStringKeys: true)).Should().Be("{\"key1\":0 \"key2\":1}");
		}
		[Fact] void D1_Map_DoublesWithNumberTrimmingDisabled() {
			var a = VDFSaver.ToVDFNode(new List<object> {.1, 1.1}, new VDFSaveOptions(useNumberTrimming: false));
			a.ToVDF(new VDFSaveOptions(useNumberTrimming: false)).Should().Be("[0.1 1.1]");
		}
		[Fact] void D1_List_IntsWithCommaSeparators() {
			var a = VDFSaver.ToVDFNode(new List<object> {0, 1}, new VDFSaveOptions(useCommaSeparators: true));
			a.listChildren.Count.Should().Be(2);
			a.ToVDF(new VDFSaveOptions(useCommaSeparators: true)).Should().Be("[0,1]");
		}

		// unique to C# version
		// ==========

		/*class SpecialList2<T> : List<T> {}
		[Fact] void D1_SpecialListItems()
		{
			VDF.RegisterTypeExporter_Inline(typeof(SpecialList2<>), obj=>"You'll never see the items!"); // example of where exporters/importers that can output/input VDFNode's would be helpful
			var a = new SpecialList2<string>{"A", "B", "C"};
			VDF.Serialize<SpecialList2<string>>(a).Should().Be("\"You'll never see the items!\"");
		}*/
		class D1_ListOfTypeArray_Strings_Class {
			[P] string[] array = {"A", "B"};
		}
		[Fact] void D1_ListOfTypeArray_Strings() {
			var a = VDFSaver.ToVDFNode<D1_ListOfTypeArray_Strings_Class>(new D1_ListOfTypeArray_Strings_Class());
			a.ToVDF().Should().Be("{array:[\"A\" \"B\"]}");
		}
		class D1_ListOfTypeArrayList_Strings_Class {
			[P] ArrayList array = new ArrayList {"A", "B"};
		}
		[Fact] void D1_ListOfTypeArrayList_Strings() {
			var a = VDFSaver.ToVDFNode<D1_ListOfTypeArrayList_Strings_Class>(new D1_ListOfTypeArrayList_Strings_Class());
			a.ToVDF().Should().Be("{array:[\"A\" \"B\"]}");
		}
	}
}