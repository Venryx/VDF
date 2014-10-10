using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using SystemMaker;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public class Loading
	{
		// to VDFNode
		// ==========
		
		[Fact] void ToVDFNode_Level0_Comment()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"// comment
			Root string.");
			a.baseValue.Should().Be("			Root string.");
		}
		[Fact] void ToVDFNode_Level0_BaseValue()
		{
			VDFNode a = VDFLoader.ToVDFNode("Root string.");
			a.baseValue.Should().Be("Root string."); // note; remember that for ambiguous cases like this, the base-like-value is added both as the obj's base-value and as its solitary item
		}
		[Fact] void ToVDFNode_Level0_BaseValue_SaveThenLoad()
		{
			var vdf = VDF.Serialize("Root string.");
			var a = VDFLoader.ToVDFNode(vdf);
			a.baseValue.Should().Be("Root string.");
			a.items.Count.Should().Be(0); // it should assume it's a base-value, unless indicated otherwise
			a.ToVDF().Should().Be("Root string.");
		}
		[Fact] void ToVDFNode_Level0_BaseValue_Literal()
		{
			VDFNode a = VDFLoader.ToVDFNode("@@Base-value string that {needs escaping}.@@");
			a.baseValue.Should().Be("Base-value string that {needs escaping}.");
		}
		[Fact] void ToVDFNode_Level0_Metadata_Type()
		{
			VDFNode a = VDFLoader.ToVDFNode("string>Root string.");
			a.metadata_type.Should().Be("string");
		}
		[Fact] void ToVDFNode_Level0_Array()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("Root string 1.|Root string 2.");
			a[0].baseValue.Should().Be("Root string 1.");
			a[1].baseValue.Should().Be("Root string 2.");
		}
		[Fact] void ToVDFNode_Level0_Array_ExplicitStartAndEndMarkers()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("{Root string 1.}|{Root string 2.}");
			a[0].baseValue.Should().Be("Root string 1.");
			a[1].baseValue.Should().Be("Root string 2.");
		}
		[Fact] void ToVDFNode_Level0_Array_Objects()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("name{Dan}age{50}|name{Bob}age{60}");
			((string)a[0]["name"]).Should().Be("Dan");
			((int)a[0]["age"]).Should().Be(50);
			((string)a[1]["name"]).Should().Be("Bob");
			((int)a[1]["age"]).Should().Be(60);
		}
		[Fact] void ToVDFNode_Level0_Array_Literals()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<string>>(@"first|@@second
which is on two lines@@|@@third
which is on
three lines@@");
			((string)a[0]).Should().Be("first");
			((string)a[1]).Should().Be(@"second
which is on two lines".Replace("\r", ""));
			((string)a[2]).Should().Be(@"third
which is on
three lines".Replace("\r", ""));
		}
		[Fact] void ToVDFNode_Level0_Array_Empty()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("|");
			//a.properties.Count.Should().Be(0);
			a[0].baseValue.Should().Be(null);
			a[1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level0_Array_None()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("");
			a.items.Count.Should().Be(0);
			a = VDFLoader.ToVDFNode(">>");
			a.items.Count.Should().Be(0);
		}
		[Fact] void ToVDFNode_Level0_ArrayMetadata1()
		{
			VDFNode a = VDFLoader.ToVDFNode("List[int]>>1|2");
			a.metadata_type.Should().Be("List[int]");
			a[0].metadata_type.Should().Be(null);
			a[1].metadata_type.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level0_ArrayMetadata2()
		{
			VDFNode a = VDFLoader.ToVDFNode("List[int]>>int>1|int>2");
			a.metadata_type.Should().Be("List[int]");
			a[0].metadata_type.Should().Be("int");
			a[1].metadata_type.Should().Be("int");
		}
		[Fact] void ToVDFNode_Level0_DictionaryItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("key1{Simple string.}key2{name{Dan}age{50}}");
			a["key1"].baseValue.Should().Be("Simple string.");
			((int)a["key2"]["age"]).Should().Be(50);
		}
		[Fact] void ToVDFNode_Level0_DictionaryItems_GetByKey()
		{
			VDFNode a = VDFLoader.ToVDFNode("key 1{value 1}key 2{value 2}");
			a["key 1"].baseValue.Should().Be("value 1");
			a["key 2"].baseValue.Should().Be("value 2");
		}
		[Fact] void ToVDFNode_Level0_InferDepth2()
		{
			var a = VDF.Deserialize<List<object>>(">>>false");
			a[0].Should().Be(false);
		}
		[Fact] void ToVDFNode_Level0_InferUnmarkedTypeToBeString()
		{
			var a = VDF.Deserialize<IList>(">>SimpleString");
			a[0].Should().Be("SimpleString");
		}
		[Fact] void ToVDFNode_Level0_KeepDeclaredType()
		{
			var a = VDF.Deserialize<List<object>>(">>SimpleString");
			a[0].GetType().Should().Be(typeof(object));
		}
		[Fact] void ToVDFNode_Level0_MultilineString()
		{
			VDFNode a = VDFLoader.ToVDFNode("@@This is a\nmultiline string\nof three lines in total.@@");
			a.baseValue.Should().Be("This is a\nmultiline string\nof three lines in total.");
		}

		[Fact] void ToVDFNode_Level1_BaseValuesWithImplicitCasting()
		{
			VDFNode a = VDFLoader.ToVDFNode("bool{false}int{5}float{.5}string{Prop value string.}");
			a["bool"].baseValue.Should().Be("false");
			a["int"].baseValue.Should().Be("5");
			a["float"].baseValue.Should().Be(".5");
			a["string"].baseValue.Should().Be("Prop value string.");

			// uses implicit casting
			Assert.True(a["bool"] == false);
			Assert.True(a["int"] == 5);
			Assert.True(a["float"] == .5f);
			Assert.True(a["string"] == "Prop value string.");
		}
		[Fact]
		void ToVDFNode_Level1_BaseValuesWithMarkedTypes()
		{
			VDFNode a = VDFLoader.ToVDFNode("bool{bool>false}int{int>5}float{float>.5}string{string>Prop value string.}");
			((bool)a["bool"]).Should().Be(false);
			((int)a["int"]).Should().Be(5);
			((float)a["float"]).Should().Be(.5f);
			((string)a["string"]).Should().Be("Prop value string.");
		}
		[Fact] void ToVDFNode_Level1_Literal()
		{
			VDFNode a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.");
		}
		[Fact] void ToVDFNode_Level1_TroublesomeLiteral1()
		{
			VDFNode a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@@|@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@");
		}
		[Fact] void ToVDFNode_Level1_TroublesomeLiteral2()
		{
			VDFNode a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@||@@}");
			a["string"].baseValue.Should().Be("Prop value string that {needs escaping}.@@|");
		}
		[Fact] void ToVDFNode_Level1_VDFWithVDFWithVDF()
		{
			VDFNode a = VDFLoader.ToVDFNode("level1{@@level2{@@@level3{Base string.}@@@}@@}");
			a["level1"].baseValue.Should().Be("level2{@@level3{Base string.}@@}");
			VDFLoader.ToVDFNode(a["level1"])["level2"].baseValue.Should().Be("level3{Base string.}");
			VDFLoader.ToVDFNode(VDFLoader.ToVDFNode(a["level1"])["level2"])["level3"].baseValue.Should().Be("Base string.");
		}
		void ToVDFNode_Level1_ArraysInArrays()
		{
			VDFNode a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}|{3A}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be("1B");
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be("2B");
			a[2].baseValue.Should().Be("3A");
		}
		[Fact] void ToVDFNode_Level1_ArraysInArrays_SecondsEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("{1A|}|{2A|}");
			a[0][0].baseValue.Should().Be("1A");
			a[0][1].baseValue.Should().Be(null);
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level1_ArraysInArrays_FirstsAndSecondsEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("{|}|{|}");
			a[0][0].baseValue.Should().Be(null);
			a[0][1].baseValue.Should().Be(null);
			a[1][0].baseValue.Should().Be(null);
			a[1][1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level1_StringAndArraysInArrays()
		{
			VDFNode a = VDFLoader.ToVDFNode("{text}|{2A|}");
			a[0].baseValue.Should().Be("text");
			a[1][0].baseValue.Should().Be("2A");
			a[1][1].baseValue.Should().Be(null);
		}
		[Fact] void ToVDFNode_Level1_Dictionary()
		{
			VDFNode a = VDFLoader.ToVDFNode("key1{value1}key2{value2}");
			a["key1"].baseValue.Should().Be("value1");
			a["key2"].baseValue.Should().Be("value2");
		}
		[Fact] void ToVDFNode_Level1_Dictionary_Complex()
		{
			VDFNode a = VDFLoader.ToVDFNode("uiPrefs{toolOptions{@@Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{>null}size{7}}@@}liveTool{Select}}");
			a["uiPrefs"]["toolOptions"].baseValue.Should().Be("Select{}TerrainShape{showPreview{true}continuousMode{true}strength{.3}size{7}}TerrainTexture{textureName{>null}size{7}}");
			a["uiPrefs"]["liveTool"].baseValue.Should().Be("Select");
		}
		[Fact] void ToVDFNode_Level1_Dictionary_TypesInferredFromGenerics()
		{
			VDFNode a = VDFLoader.ToVDFNode("vertexColors{Dictionary[string,Color]>>9,4,2.5{Black}1,8,9.5435{Gray}25,15,5{White}}", new VDFLoadOptions
			{
				typeAliasesByType = new Dictionary<Type, string> {{typeof(Color), "Color"}}
			});
			a["vertexColors"]["9,4,2.5"].baseValue.Should().Be("Black");
			a["vertexColors"]["1,8,9.5435"].baseValue.Should().Be("Gray");
			a["vertexColors"]["25,15,5"].baseValue.Should().Be("White");
		}

		// note: if only one item (when parsed as List), assume by default obj is an object; if more than one, assume by default obj is a List or Dictionary
		[Fact] void ToVDFNode_Level1_ArrayPoppedOut()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"names:
	Dan
	Bob");
			a["names"][0].baseValue.Should().Be("Dan");
			a["names"][1].baseValue.Should().Be("Bob");
		}
		[Fact] void ToVDFNode_Level1_ArraysPoppedOut() // each 'group' is actually just the value-data of one of the parent's properties
		{
			VDFNode a = VDFLoader.ToVDFNode(@"names:
	Dan
	Bob
^ages:
	10
	20");
			a["names"][0].baseValue.Should().Be("Dan");
			a["names"][1].baseValue.Should().Be("Bob");
			a["ages"][0].baseValue.Should().Be("10");
			a["ages"][1].baseValue.Should().Be("20");
		}
		[Fact] void ToVDFNode_Level1_InferredDictionaryPoppedOut()
		{
			VDFNode a = VDFLoader.ToVDFNode(@"messages:,>>
	title1{message1}
	title2{message2}
^otherProperty{false}");
			a["messages"].properties.Count.Should().Be(2);
			a["messages"]["title1"].baseValue.Should().Be("message1");
			a["messages"]["title2"].baseValue.Should().Be("message2");
			a["otherProperty"].baseValue.Should().Be("false");
		}
		[Fact] void ToVDFNode_Level1_DictionaryPoppedOut()
		{
/*
Written As:

messages:,>>
	title1{message1}
	title2{message2}
^otherProperty{false}

Parsed As:

messages:{,>>
	title1{message1}
	title2{message2}
}^otherProperty{false}
 */
			VDFNode a = VDFLoader.ToVDFNode(@"messages:,>>
	title1{message1}
	title2{message2}
^otherProperty{false}");
			a["messages"].properties.Count.Should().Be(2);
			a["messages"]["title1"].baseValue.Should().Be("message1");
			a["messages"]["title2"].baseValue.Should().Be("message2");
			a["otherProperty"].baseValue.Should().Be("false");
		}

		[Fact] void ToVDFNode_Level1_MultilineStringThenProperty()
		{
			var a = VDFLoader.ToVDFNode(@"text{@@This is a
multiline string
of three lines in total.@@}bool{>true}");
			a["text"].baseValue.Should().Be("This is a\nmultiline string\nof three lines in total.");
			((bool)a["bool"]).Should().Be(true);
		}
		[Fact] void ToVDFNode_Level1_ArrayPoppedOutThenMultilineString()
		{
			var a = VDFLoader.ToVDFNode(@"childTexts:
	text1
	text2
^text{@@This is a
	multiline string
	of three lines in total.@@}");
			a["childTexts"][0].baseValue.Should().Be("text1");
			a["childTexts"][1].baseValue.Should().Be("text2");
			a["text"].baseValue.Should().Be("This is a\n	multiline string\n	of three lines in total.");
		}

		[Fact] void ToVDFNode_Level5_DeepNestedPoppedOutData()
		{
			var vdf = @"name{Main}worlds{string,object>>Test1{vObjectRoot{name{VObjectRoot}children:>>
	id{System.Guid>025f28a5-a14b-446d-b324-2d274a476a63}name{#Types}children{}
}}Test2{vObjectRoot{name{VObjectRoot}children:>>
	id{System.Guid>08e84f18-aecf-4b80-9c3f-ae0697d9033a}name{#Types}children{}
}}}";
			var livePackNode = VDFLoader.ToVDFNode(vdf);
			livePackNode["worlds"]["Test1"]["vObjectRoot"]["children"][0]["id"].baseValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
			livePackNode["worlds"]["Test2"]["vObjectRoot"]["children"][0]["id"].baseValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
		}
		[Fact] void ToVDFNode_Level5_SpeedTester()
		{
			var vdf = @"id{595880cd-13cd-4578-9ef1-bd3175ac72bb}visible{true}parts:
	id{ba991aaf-447a-4a03-ade8-f4a11b4ea966}typeName{Wood}name{Body}pivotPoint_unit{-0.1875,0.4375,-0.6875}anchorNormal{0,1,0}scale{0.5,0.25,1.5}controller{true}
	id{743f64f2-8ece-4dd3-bdf5-bbb6378ffce5}typeName{Wood}name{FrontBar}pivotPoint_unit{-0.4375,0.5625,0.8125}anchorNormal{0,0,1}scale{1,0.25,0.25}controller{false}
	id{52854b70-c200-478f-bcd2-c69a03cd808f}typeName{Wheel}name{FrontLeftWheel}pivotPoint_unit{-0.5,0.5,0.875}anchorNormal{-1,0,0}scale{1,1,1}controller{false}
	id{971e394c-b440-4fee-99fd-dceff732cd1e}typeName{Wheel}name{BackRightWheel}pivotPoint_unit{0.5,0.5,-0.875}anchorNormal{1,0,0}scale{1,1,1}controller{false}
	id{77d30d72-9845-4b22-8e95-5ba6e29963b9}typeName{Wheel}name{FrontRightWheel}pivotPoint_unit{0.5,0.5,0.875}anchorNormal{1,0,0}scale{1,1,1}controller{false}
	id{21ca2a80-6860-4de3-9894-b896ec77ef9e}typeName{Wheel}name{BackLeftWheel}pivotPoint_unit{-0.5,0.5,-0.875}anchorNormal{-1,0,0}scale{1,1,1}controller{false}
	id{eea2623a-86d3-4368-b4e0-576956b3ef1d}typeName{Wood}name{BackBar}pivotPoint_unit{-0.4375,0.4375,-0.8125}anchorNormal{0,0,-1}scale{1,0.25,0.25}controller{false}
	id{f1edc5a1-d544-4993-bdad-11167704a1e1}typeName{MachineGun}name{Gun1}pivotPoint_unit{0,0.625,0.875}anchorNormal{0,1,0}scale{0.5,0.5,0.5}controller{false}
	id{e97f8ee1-320c-4aef-9343-3317accb015b}typeName{Crate}name{Crate}pivotPoint_unit{0,0.625,0}anchorNormal{0,1,0}scale{0.5,0.5,0.5}controller{false}
^tasksScriptText{@@Grab Flag
	(Crate ensure contains an EnemyFlag) ensure is false
	targetFlag be EnemyFlag_OnEnemyGround [objectRefreshInterval: infinity] [lifetime: infinity]
	targetFlag set tag 'taken'
	FrontLeftWheel turn to targetFlag [with: FrontRightWheel]
	FrontLeftWheel roll forward
	FrontRightWheel roll forward
	BackLeftWheel roll forward
	BackRightWheel roll forward
	targetFlag put into Crate

Bring Flag to Safer Allied Ground
	Crate ensure contains an EnemyFlag
	targetLocation be AlliedGround_NoEnemyFlag_Safest [objectRefreshInterval: infinity]
	targetLocation set tag 'taken'
	FrontLeftWheel turn to targetLocation [with: FrontRightWheel]
	FrontLeftWheel roll forward
	FrontRightWheel roll forward
	BackLeftWheel roll forward
	BackRightWheel roll forward
	targetFlag put at targetLocation

Shoot at Enemy Vehicle
	Gun1 aim at EnemyVehicle_NonBroken
	Gun1 fire@@}";
			VDFLoader.ToVDFNode(vdf);
		}

		// to object
		// ==========

		[Fact] void ToObject_Level0_Null() { VDF.Deserialize(">null").Should().Be(null); }
		[Fact] void ToObject_Level0_Nothing() { VDF.Deserialize("").Should().Be(null); }
		[Fact] void ToObject_Level0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); }
		[Fact] void ToObject_Level0_EmptyString() { VDF.Deserialize(">empty").Should().Be(""); }
		[Fact] void ToObject_Level0_Bool() { VDF.Deserialize<bool>("true").Should().Be(true); }
		[Fact] void ToObject_Level0_Float() { VDF.Deserialize<float>("1.5").Should().Be(1.5f); }
		class TypeWithPostDeserializeMethod
		{
			[VDFProp] public bool flag;
			[VDFPostDeserialize] void VDFPostDeserialize() { flag = true; }
		}

		[Fact] void ToObject_Level1_EmptyStringInList() { VDF.Deserialize<List<string>>("text1|")[1].Should().Be(null); }
		[Fact] void ToObject_Level1_PostDeserializeMethod()
		{
			var a = VDF.Deserialize<TypeWithPostDeserializeMethod>("");
			a.flag.Should().Be(true);
		}
		class TypeWithPostDeserializeMethod_CustomMessageRequired
		{
			public bool flag;
			[VDFPostDeserialize] void VDFPostDeserialize(object message) { if ((string)message == "RequiredMessage") flag = true; }
		}
		[Fact] void ToObject_Level1_PostDeserializeConstructor_CustomMessageRequired() { VDF.Deserialize<TypeWithPostDeserializeMethod_CustomMessageRequired>("", new VDFLoadOptions("WrongMessage")).flag.Should().Be(false); }
		class TypeWithConstructorAsPostDeserializeMethod
		{
			public bool flag;
			[VDFPostDeserialize] TypeWithConstructorAsPostDeserializeMethod() { flag = true; }
		}
		[Fact] void ToObject_Level1_PostDeserializeConstructor() { VDF.Deserialize<TypeWithConstructorAsPostDeserializeMethod>("").flag.Should().Be(true); }
		class TypeInstantiatedManuallyThenFilled { [VDFProp] public bool flag; }
		[Fact] void ToObject_Level1_InstantiateTypeManuallyThenFill()
		{
			var a = new TypeInstantiatedManuallyThenFilled();
			VDF.DeserializeInto("flag{true}", a);
			a.flag.Should().Be(true);
		}
		[VDFType(popOutChildrenL1: true)] class ToObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1
		{
			[VDFProp(popOutChildrenL2: true)] public Dictionary<string, string> messages = new Dictionary<string, string>
			{
				{"title1", "message1"},
				{"title2", "message2"}
			};
			[VDFProp] public bool otherProperty;
		}
		[Fact] void ToObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool()
		{
			var a = VDF.Deserialize<ToObject_Level1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1>(@"
	messages:
		title1{message1}
		title2{message2}
	otherProperty{true}");
			a.messages.Count.Should().Be(2);
			a.messages["title1"].Should().Be("message1");
			a.messages["title2"].Should().Be("message2");
			a.otherProperty.Should().Be(true);
		}

		// unique to C# version
		// ==========

		[Fact] void ToVDFNode_Level1_PropLoadError_DuplicateDictionaryKeys() { ((Action)(()=>VDFLoader.ToVDFNode("scores{Dan{0}Dan{1}}"))).ShouldThrow<ArgumentException>().WithMessage("*same key*"); }
		class SpecialList3<T> : List<T> {}
		[Fact] void ToVDFNode_Level1_SpecialListItem()
		{
			VDF.RegisterTypeImporter_Inline(typeof(SpecialList3<>), obj=>new SpecialList3<string>{"Obvious first-item data."}); // note; example of where exporters/importers that can output/input VDFNode's would be helpful
			VDF.Deserialize<SpecialList3<string>>("String that doesn't matter.").Should().BeEquivalentTo(new SpecialList3<string>{"Obvious first-item data."});
		}
		[Fact] void ToVDFNode_Level1_SpecialListItem_GenericTypeArgs()
		{
			VDF.RegisterTypeImporter_Inline(typeof(SpecialList3<>), (obj, genericArgs)=>new SpecialList3<string>{"Obvious first-item data; of type: " + genericArgs.First().Name.ToLower()}); // note; example of where exporters/importers that can output/input VDFNode's would be helpful
			VDF.Deserialize<SpecialList3<string>>("String that doesn't matter.").Should().BeEquivalentTo(new SpecialList3<string>{"Obvious first-item data; of type: string"});
		}
	}
}