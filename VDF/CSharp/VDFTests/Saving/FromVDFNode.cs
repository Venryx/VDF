using System;
using System.Collections;
using System.Collections.Generic;
using FluentAssertions;
using VDFN;
using Xunit;

namespace VDFTests {
	public class Saving_FromVDFNode {
		// from VDFNode
		// ==========

		[Fact] void D0_BaseValue() {
			var a = new VDFNode();
			a.primitiveValue = "Root string.";
			a.ToVDF().Should().Be("\"Root string.\"");
		}
		[Fact] void D0_Infinity() {
			new VDFNode(double.PositiveInfinity).ToVDF().Should().Be("Infinity");
			new VDFNode(double.NegativeInfinity).ToVDF().Should().Be("-Infinity");
		}
		[Fact] void D0_MetadataType() {
			var a = new VDFNode();
			a.metadata = "string";
			a.primitiveValue = "Root string.";
			a.ToVDF().Should().Be("string>\"Root string.\"");
		}
		[Fact] void D0_MetadataTypeCollapsed() {
			var a = VDFSaver.ToVDFNode(new List<string>(), new VDFSaveOptions {typeMarking = VDFTypeMarking.External});
			a.ToVDF().Should().Be("List(string)>[]");
			a = VDFSaver.ToVDFNode(new List<List<string>> {new List<string> {"1A", "1B", "1C"}}, new VDFSaveOptions {typeMarking = VDFTypeMarking.External});
			a.ToVDF().Should().Be("List(List(string))>[[\"1A\" \"1B\" \"1C\"]]"); // old: only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
		}
		[Fact] void D0_MetadataTypeNoCollapse() {
			var a = VDFSaver.ToVDFNode(new List<string>(), new VDFSaveOptions {typeMarking = VDFTypeMarking.ExternalNoCollapse});
			a.ToVDF().Should().Be("List(string)>[]");
			a = VDFSaver.ToVDFNode(new List<List<string>> {new List<string> {"1A", "1B", "1C"}}, new VDFSaveOptions {typeMarking = VDFTypeMarking.ExternalNoCollapse});
			a.ToVDF().Should().Be("List(List(string))>[List(string)>[string>\"1A\" string>\"1B\" string>\"1C\"]]");
		}
		enum Enum1 {
			A,
			B,
			C
		}
		[Fact] void D0_EnumDefault() {
			var a = VDFSaver.ToVDFNode<Enum1>(Enum1.A);
			a.ToVDF().Should().Be("\"A\"");
		}
		[Fact] void D0_EscapedString() {
			var a = VDFSaver.ToVDFNode<string>(
@"Multiline string
that needs escaping.".Fix());
			a.ToVDF().Should().Be(
@"""<<Multiline string
that needs escaping.>>""".Fix());

			a = VDFSaver.ToVDFNode<string>("String \"that needs escaping\".");
			a.ToVDF().Should().Be("\"<<String \"that needs escaping\".>>\"");

			a = VDFSaver.ToVDFNode<string>("String <<that needs escaping>>.");
			a.ToVDF().Should().Be("\"<<<String <<that needs escaping>>.>>>\"");
		}

		[Fact] void D1_ListInferredFromHavingItem_String() {
			var a = new VDFNode();
			a[0] = new VDFNode {primitiveValue = "String item."};
			a.ToVDF().Should().Be("[\"String item.\"]");
		}
		[Fact] void D1_Object_Primitives() {
			var a = new VDFNode();
			a["bool"] = new VDFNode {primitiveValue = false};
			a["int"] = new VDFNode {primitiveValue = 5};
			a["double"] = new VDFNode {primitiveValue = .5f};
			a["string"] = new VDFNode {primitiveValue = "Prop value string."};
			a.ToVDF().Should().Be("{bool:false int:5 double:.5 string:\"Prop value string.\"}");
		}
		[Fact] void D1_List_EscapedStrings() {
			var a = new VDFNode();
			a[0] = new VDFNode("This is a list item \"that needs escaping\".");
			a[1] = new VDFNode("Here's another.");
			a[2] = new VDFNode("And <<another>>.");
			a[3] = new VDFNode("This one does not need escaping.");
			a.ToVDF().Should().Be("[\"<<This is a list item \"that needs escaping\".>>\" \"<<Here's another.>>\" \"<<<And <<another>>.>>>\" \"This one does not need escaping.\"]");
		}
		[Fact] void D1_List_EscapedStrings2() {
			var a = new VDFNode();
			a[0] = new VDFNode("ok {}");
			a[1] = new VDFNode("ok []");
			a[2] = new VDFNode("ok :");
			a.ToVDF().Should().Be("[\"ok {}\" \"ok []\" \"ok :\"]");
		}
		[Fact] void D1_Map_EscapedStrings() {
			var a = new VDFNode();
			a.mapChildren.Add(new VDFNode("escape {}"), new VDFNode());
			a.mapChildren.Add(new VDFNode("escape []"), new VDFNode());
			a.mapChildren.Add(new VDFNode("escape :"), new VDFNode());
			a.mapChildren.Add(new VDFNode("escape \""), new VDFNode());
			a.mapChildren.Add(new VDFNode("escape '"), new VDFNode());
			a.ToVDF().Should().Be("{<<escape {}>>:null <<escape []>>:null <<escape :>>:null <<escape \">>:null <<escape '>>:null}");
		}
		[Fact] void D1_MetadataShowingNodeToBeOfTypeType() {
			/*VDFTypeInfo.AddSerializeMethod<Type>(a=>new VDFNode(a.Name, "Type"));
			VDFTypeInfo.AddDeserializeMethod_FromParent<Type>(node=>Type.GetType(node.primitiveValue.ToString()));*/
			VDFTypeInfo.Get(Type.GetType("System.RuntimeType")).AddExtraMethod((Type a)=>new VDFNode(a.Name) {metadata_override = "Type"}, new VDFSerialize());
			VDFTypeInfo.Get(Type.GetType("System.RuntimeType")).AddExtraMethod((VDFNode node)=>Type.GetType(node.primitiveValue.ToString()), new VDFDeserialize(true));

			var map = new Dictionary<object, object>();
			map.Add(typeof(object), "hi there");
			VDF.Serialize(map).Should().Be("{Type>Object:\"hi there\"}");
		}
		[Fact] void D0_EmptyArray() { VDF.Serialize(new object[0]).Should().Be("[]"); }
	}
}