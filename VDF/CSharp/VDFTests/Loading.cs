using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public static class Loading_ClassExtensions
	{
		public static string Fix(this string self) { return self.Replace("\r\n", "\n"); } // maybe temp
	}
	public class Loading
	{
		// to VDFNode
		// ==========
		
		[Fact] void D0_Comment()
		{
			VDFNode a = VDFLoader.ToVDFNode(
@"## comment
'Root string.'");
			a.primitiveValue.Should().Be("Root string.");
		}
		[Fact] void D0_Comment2()
		{
			VDFNode a = VDFLoader.ToVDFNode("'Root string ends here.'## comment");
			a.primitiveValue.Should().Be("Root string ends here.");
		}
		[Fact] void D0_Int()
		{
			VDFNode a = VDFLoader.ToVDFNode("1");
			a.primitiveValue.Should().Be(1);
		}
		[Fact] void D0_IntNegative()
		{
			VDFNode a = VDFLoader.ToVDFNode("-1");
			a.primitiveValue.Should().Be(-1);
		}
		[Fact] void D0_PowerNotation()
		{
			VDFLoader.ToVDFNode("1e3").primitiveValue.Should().Be(1000d); //1 * Math.Pow(10, 3));
			VDFLoader.ToVDFNode("1e-3").primitiveValue.Should().Be(.001); //1 * Math.Pow(10, -3));
			VDFLoader.ToVDFNode("-1e3").primitiveValue.Should().Be(-1000d); //-(1 * Math.Pow(10, 3)));
			VDFLoader.ToVDFNode("-1e-3").primitiveValue.Should().Be(-.001); //-(1 * Math.Pow(10, -3)));
		}
		[Fact] void D0_Infinity()
		{
			VDFLoader.ToVDFNode("Infinity").primitiveValue.Should().Be(double.PositiveInfinity);
			VDFLoader.ToVDFNode("-Infinity").primitiveValue.Should().Be(double.NegativeInfinity);
		}
		[Fact] void D0_String()
		{
			VDFNode a = VDFLoader.ToVDFNode("'Root string.'");
			a.primitiveValue.Should().Be("Root string.");
		}
		[Fact] void D0_StringWithSaveThenLoad()
		{
			var vdf = VDF.Serialize("Root string.");
			vdf.Should().Be("\"Root string.\"");
			var a = VDFLoader.ToVDFNode(vdf);
			a.primitiveValue.Should().Be("Root string.");
		}
		[Fact] void D0_StringAsNull()
		{
			var a = VDF.Deserialize<string>("null");
			a.Should().Be(null);
		}
		[Fact] void D0_BaseValue_Literal()
		{
			VDFNode a = VDFLoader.ToVDFNode("'<<\tBase-value string that {needs escaping}.>>'");
			a.primitiveValue.Should().Be("\tBase-value string that {needs escaping}.");
		}
		[Fact] void D0_Metadata_Type()
		{
			VDFNode a = VDFLoader.ToVDFNode("string>'Root string.'");
			a.metadata.Should().Be("string");
		}
		[Fact] void D0_List()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("['Root string 1.' 'Root string 2.']");
			a[0].primitiveValue.Should().Be("Root string 1.");
			a[1].primitiveValue.Should().Be("Root string 2.");
		}
		/*[Fact] void D0_List_ExplicitStartAndEndMarkers()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("{Root string 1.}|{Root string 2.}");
			a[0].primitiveValue.Should().Be("Root string 1.");
			a[1].primitiveValue.Should().Be("Root string 2.");
		}*/
		[Fact] void D0_List_Objects()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("[{name:'Dan' age:50} {name:'Bob' age:60}]");
			a[0]["name"].primitiveValue.Should().Be("Dan");
			a[0]["age"].primitiveValue.Should().Be(50);
			a[1]["name"].primitiveValue.Should().Be("Bob");
			a[1]["age"].primitiveValue.Should().Be(60);
		}
		[Fact] void D0_List_Literals()
		{
			VDFNode a = VDFLoader.ToVDFNode<List<string>>(
@"['first' '<<second
which is on two lines>>' '<<third
which is on
three lines>>']");
			a[0].primitiveValue.Should().Be("first");
			a[1].primitiveValue.Should().Be(
@"second
which is on two lines".Fix());
			a[2].primitiveValue.Should().Be(
@"third
which is on
three lines".Fix());
		}
		/*[Fact] void D0_EmptyList() // for now at least, it's against the rules to have items without a char of their own
		{
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("|");
			//a.mapChildren.Count.Should().Be(0);
			a[0].primitiveValue.Should().Be(null);
			a[1].primitiveValue.Should().Be(null);
		}*/
		[Fact] void D0_EmptyList() { ((List<object>)VDF.Deserialize("[]")).Count.Should().Be(0); }
		[Fact] void D0_ListMetadata()
		{
			VDFNode a = VDFLoader.ToVDFNode("List(int)>[1 2]");
			a.metadata.Should().Be("List(int)");
			a[0].metadata.Should().Be(null);
			a[1].metadata.Should().Be(null);
		}
		[Fact] void D0_ListMetadata2()
		{
			VDFNode a = VDFLoader.ToVDFNode("List(object)>[string>\"1\" string>\"2\"]");
			a.metadata.Should().Be("List(object)");
			a[0].metadata.Should().Be("string");
			a[1].metadata.Should().Be("string");
		}
		[Fact] void D0_EmptyMap() { ((Dictionary<object, object>)VDF.Deserialize("{}")).Count.Should().Be(0); }
		[Fact] void D0_Map_ChildMetadata()
		{
			VDFNode a = VDFLoader.ToVDFNode("Dictionary(object object)>[a:string>\"1\" b:string>\"2\"]");
			a.metadata.Should().Be("Dictionary(object object)");
			a["a"].metadata.Should().Be("string");
			a["b"].metadata.Should().Be("string");
		}
		[Fact] void D0_MultilineString()
		{
			VDFNode a = VDFLoader.ToVDFNode(
@"'<<This is a
multiline string
of three lines in total.>>'");
			a.primitiveValue.Should().Be(
@"This is a
multiline string
of three lines in total.".Fix());
		}

		[Fact] void D1_Map_Children()
		{
			VDFNode a = VDFLoader.ToVDFNode("{key1:'Simple string.' key2:'false' key3:{name:'Dan' age:50}}");
			a["key1"].primitiveValue.Should().Be("Simple string.");
			a["key2"].primitiveValue.Should().Be("false");
			a["key3"]["age"].primitiveValue.Should().Be(50);
		}
		[Fact] void D1_Map_ChildrenThatAreRetrievedByKey()
		{
			VDFNode a = VDFLoader.ToVDFNode("{key 1:'value 1' key 2:'value 2'}");
			a["key 1"].primitiveValue.Should().Be("value 1");
			a["key 2"].primitiveValue.Should().Be("value 2");
		}
		[Fact] void D1_List_StringThatKeepsStringTypeFromVDFEvenWithObjectTypeFromCode()
		{
			var a = VDF.Deserialize<List<object>>("['SimpleString']");
			a[0].Should().Be("SimpleString");
		}
		[Fact] void D1_BaseValuesWithImplicitCasting()
		{
			VDFNode a = VDFLoader.ToVDFNode("{bool:false int:5 double:.5 string:'Prop value string.'}");
			a["bool"].primitiveValue.Should().Be(false);
			a["int"].primitiveValue.Should().Be(5);
			a["double"].primitiveValue.Should().Be(.5);
			a["string"].primitiveValue.Should().Be("Prop value string.");

			// uses implicit casting
			Assert.True(a["bool"] == false);
			Assert.True(a["int"] == 5);
			Assert.True(a["double"] == .5);
			Assert.True(a["string"] == "Prop value string.");
		}
		[Fact] void D1_BaseValuesWithMarkedTypes()
		{
			VDFNode a = VDFLoader.ToVDFNode("{bool:bool>false int:int>5 double:double>.5 string:string>'Prop value string.'}");
			((bool)a["bool"]).Should().Be(false);
			((int)a["int"]).Should().Be(5);
			((double)a["double"]).Should().Be(.5f);
			((string)a["string"]).Should().Be("Prop value string.");
		}
		[Fact] void D1_Literal()
		{
			VDFNode a = VDFLoader.ToVDFNode("{string:'<<<Prop value string that <<needs escaping>>.>>>'}");
			a["string"].primitiveValue.Should().Be("Prop value string that <<needs escaping>>.");
		}
		[Fact] void D1_TroublesomeLiteral1()
		{
			VDFNode a = VDFLoader.ToVDFNode("{string:'<<<#<<Prop value string that <<needs escaping>>.>>#>>>'}");
			a["string"].primitiveValue.Should().Be("<<Prop value string that <<needs escaping>>.>>");
		}
		[Fact] void D1_TroublesomeLiteral2()
		{
			VDFNode a = VDFLoader.ToVDFNode("{string:'<<<##Prop value string that <<needs escaping>>.##>>>'}");
			a["string"].primitiveValue.Should().Be("#Prop value string that <<needs escaping>>.#");
		}
		[Fact] void D1_VDFWithVDFWithVDF()
		{
			VDFNode a = VDFLoader.ToVDFNode("{level1:'<<<{level2:'<<{level3:'Base string.'}>>'}>>>'}");
			a["level1"].primitiveValue.Should().Be("{level2:'<<{level3:'Base string.'}>>'}");
			VDFLoader.ToVDFNode(a["level1"])["level2"].primitiveValue.Should().Be("{level3:'Base string.'}");
			VDFLoader.ToVDFNode(VDFLoader.ToVDFNode(a["level1"])["level2"])["level3"].primitiveValue.Should().Be("Base string.");
		}
		[Fact] void D1_ArraysInArrays()
		{
			VDFNode a = VDFLoader.ToVDFNode("[['1A' '1B'] ['2A' '2B'] '3A']");
			a[0][0].primitiveValue.Should().Be("1A");
			a[0][1].primitiveValue.Should().Be("1B");
			a[1][0].primitiveValue.Should().Be("2A");
			a[1][1].primitiveValue.Should().Be("2B");
			a[2].primitiveValue.Should().Be("3A");
		}
		[Fact] void D1_ArraysInArrays_SecondsNullAndEmpty()
		{
			VDFNode a = VDFLoader.ToVDFNode("[['1A' null] ['2A' '']]");
			a[0][0].primitiveValue.Should().Be("1A");
			a[0][1].primitiveValue.Should().Be(null);
			a[1][0].primitiveValue.Should().Be("2A");
			a[1][1].primitiveValue.Should().Be("");
		}
		[Fact] void D1_StringAndArraysInArrays()
		{
			VDFNode a = VDFLoader.ToVDFNode("['text' ['2A' null]]");
			a[0].primitiveValue.Should().Be("text");
			a[1][0].primitiveValue.Should().Be("2A");
			a[1][1].primitiveValue.Should().Be(null);
		}
		[Fact] void D1_Dictionary()
		{
			VDFNode a = VDFLoader.ToVDFNode("{key1:'value1' key2:'value2' 'key3':'value3' \"key4\":\"value4\"}");
			a["key1"].primitiveValue.Should().Be("value1");
			a["key2"].primitiveValue.Should().Be("value2");
			a["key3"].primitiveValue.Should().Be("value3");
			a["key4"].primitiveValue.Should().Be("value4");
		}
		[Fact] void D1_Dictionary_Complex()
		{
			VDFNode a = VDFLoader.ToVDFNode("{uiPrefs:{toolOptions:'<<{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}>>' liveTool:'Select'}}");
			a["uiPrefs"]["toolOptions"].primitiveValue.Should().Be("{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}");
			a["uiPrefs"]["liveTool"].primitiveValue.Should().Be("Select");
		}
		[Fact] void D1_Dictionary_TypesInferredFromGenerics()
		{
			VDFNode a = VDFLoader.ToVDFNode("{vertexColors:Dictionary(string Color)>{9,4,2.5:'Black' 1,8,9.5435:'Gray' 25,15,5:'White'}}", new VDFLoadOptions
			(
				typeAliasesByType: new Dictionary<Type, string> {{typeof(Color), "Color"}}
			));
			a["vertexColors"]["9,4,2.5"].primitiveValue.Should().Be("Black");
			a["vertexColors"]["1,8,9.5435"].primitiveValue.Should().Be("Gray");
			a["vertexColors"]["25,15,5"].primitiveValue.Should().Be("White");
		}

		[Fact] void D1_ArrayPoppedOut_NoItems()
		{
			VDFNode a = VDFLoader.ToVDFNode("{names:[^]}");
			a["names"].listChildren.Count.Should().Be(0);
			a["names"].mapChildren.Count.Should().Be(0);
		}
		[Fact] void D1_ArrayPoppedOut()
		{
			VDFNode a = VDFLoader.ToVDFNode(
@"{names:[^]}
	'Dan'
	'Bob'");
			a["names"][0].primitiveValue.Should().Be("Dan");
			a["names"][1].primitiveValue.Should().Be("Bob");
		}
		[Fact] void D1_ArraysPoppedOut() // each 'group' is actually just the value-data of one of the parent's properties
		{
			VDFNode a = VDFLoader.ToVDFNode(
@"{names:[^] ages:[^]}
	'Dan'
	'Bob'
	^10
	20");
			a["names"][0].primitiveValue.Should().Be("Dan");
			a["names"][1].primitiveValue.Should().Be("Bob");
			a["ages"][0].primitiveValue.Should().Be(10);
			a["ages"][1].primitiveValue.Should().Be(20);
		}
		[Fact] void D1_InferredDictionaryPoppedOut()
		{
			VDFNode a = VDFLoader.ToVDFNode(
@"{messages:{^} otherProperty:false}
	title1:'message1'
	title2:'message2'");
			a["messages"].mapChildren.Count.Should().Be(2);
			a["messages"]["title1"].primitiveValue.Should().Be("message1");
			a["messages"]["title2"].primitiveValue.Should().Be("message2");
			a["otherProperty"].primitiveValue.Should().Be(false);
		}
		[Fact] void D1_Map_PoppedOutMap()
		{
/*
Written as:

{messages:{^} otherProperty:false}
	title1:"message1"
	title2:"message2"

Parsed as:

{messages:{
	title1:"message1"
	title2:"message2"
} otherProperty:false}
 */
			VDFNode a = VDFLoader.ToVDFNode(
@"{messages:{^} otherProperty:false}
	title1:'message1'
	title2:'message2'");
			a["messages"].mapChildren.Count.Should().Be(2);
			a["messages"]["title1"].primitiveValue.Should().Be("message1");
			a["messages"]["title2"].primitiveValue.Should().Be("message2");
			a["otherProperty"].primitiveValue.Should().Be(false);
		}

		[Fact] void D1_Object_MultilineStringThenProperty()
		{
			var a = VDFLoader.ToVDFNode(
@"{text:'<<This is a
multiline string
of three lines in total.>>' bool:true}");
			a["text"].primitiveValue.Should().Be(
@"This is a
multiline string
of three lines in total.".Fix());
			((bool)a["bool"]).Should().Be(true);
		}
		[Fact] void D1_Object_PoppedOutStringsThenMultilineString()
		{
			var a = VDFLoader.ToVDFNode(
@"{childTexts:[^] text:'<<This is a
multiline string
of three lines in total.>>'}
	'text1'
	'text2'");
			a["childTexts"][0].primitiveValue.Should().Be("text1");
			a["childTexts"][1].primitiveValue.Should().Be("text2");
			a["text"].primitiveValue.Should().Be(
@"This is a
multiline string
of three lines in total.".Fix());
		}

		[Fact] void D2_List_Lists_PoppedOutObjects()
		{
			var a = VDFLoader.ToVDFNode(
@"[[^] [^] [^]]
	{name:'Road'}
	^{name:'RoadAndPath'}
	^{name:'SimpleHill'}"); //, new VDFLoadOptions(inferStringTypeForUnknownTypes: true));
			a.listChildren.Count.Should().Be(3);
		}
		[Fact] void D2_List_PoppedOutObjects_MultilineString()
		{
			var a = VDFLoader.ToVDFNode(
@"[^]
	{id:1 multilineText:'<<line1
	line2
	line3>>'}
	{id:2 multilineText:'<<line1
	line2>>'}");
			a.listChildren.Count.Should().Be(2);
		}

		[Fact] void D2_Object_PoppedOutObject_PoppedOutObject()
		{
			var a = VDFLoader.ToVDFNode(
@"{name:'L0' children:[^]}
	{name:'L1' children:[^]}
		{name:'L2'}");
			a["children"].listChildren.Count.Should().Be(1);
			a["children"].listChildren[0]["children"].listChildren.Count.Should().Be(1);
		}

		[Fact] void D5_TokenTextPreservation()
		{
			var vdf1 = @"{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^] tasksScriptText:'<<Shoot at Enemy Vehicle
	Gun1 aim at EnemyVehicle_NonBroken
	Gun1 fire>>'}
	{id:'ba991aaf-447a-4a03-ade8-f4a11b4ea966' typeName:'Wood' name:'Body' pivotPoint_unit:'-0.1875,0.4375,-0.6875' anchorNormal:'0,1,0' scale:'0.5,0.25,1.5' controller:true}
	{id:'743f64f2-8ece-4dd3-bdf5-bbb6378ffce5' typeName:'Wood' name:'FrontBar' pivotPoint_unit:'-0.4375,0.5625,0.8125' anchorNormal:'0,0,1' scale:'1,0.25,0.25' controller:false}".Replace("\r\n", "\n");
			var tokens = VDFTokenParser.ParseTokens(vdf1, null, true, false);

			// shift each within-string literal-end-marker token to after its containing-string's token
			for (var i = 0; i < tokens.Count; i++)
				if (tokens[i].type == VDFTokenType.LiteralEndMarker && tokens[i + 1].type == VDFTokenType.String)
				{
					var oldFirst = tokens[i];
					tokens[i] = tokens[i + 1];
					tokens[i + 1] = oldFirst;
					i++;
				}

			var vdf2 = "";
			foreach (VDFToken token in tokens)
				vdf2 += token.text;
			vdf1.Should().Be(vdf2);
		}
		[Fact] void D5_DeepNestedPoppedOutData()
		{
			var vdf =
@"{name:'Main' worlds:Dictionary(string object)>{Test1:{vObjectRoot:{name:'VObjectRoot' children:[^]}} Test2:{vObjectRoot:{name:'VObjectRoot' children:[^]}}}}
	{id:System.Guid>'025f28a5-a14b-446d-b324-2d274a476a63' name:'#Types' children:[]}
	^{id:System.Guid>'08e84f18-aecf-4b80-9c3f-ae0697d9033a' name:'#Types' children:[]}";
			var livePackNode = VDFLoader.ToVDFNode(vdf);
			livePackNode["worlds"]["Test1"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
			livePackNode["worlds"]["Test2"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
		}

		// to object
		// ==========

		[Fact] void D0_Null() { VDF.Deserialize("null").Should().Be(null); }
		//[Fact] void D0_Nothing() { VDF.Deserialize("").Should().Be(null); }
		//[Fact] void D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); }
		[Fact] void D0_EmptyString() { VDF.Deserialize("''").Should().Be(""); }
		[Fact] void D0_Bool() { VDF.Deserialize<bool>("true").Should().Be(true); }
		[Fact] void D0_Double() { VDF.Deserialize("1.5").Should().Be(1.5); }
		[Fact] void D0_Float() { VDF.Deserialize<float>("1.5").Should().Be(1.5f); }

		class TypeWithPreDeserializeMethod
		{
			[VDFProp] public bool flag;
			[VDFPreDeserialize] void VDFPreDeserialize() { flag = true; }
		}
		[Fact] void D1_PreDeserializeMethod()
		{
			var a = VDF.Deserialize<TypeWithPreDeserializeMethod>("{}");
			a.flag.Should().Be(true);
		}
		class TypeWithPostDeserializeMethod
		{
			[VDFProp] public bool flag;
			[VDFPostDeserialize] void VDFPostDeserialize() { flag = true; }
		}
		[Fact] void D1_PostDeserializeMethod()
		{
			var a = VDF.Deserialize<TypeWithPostDeserializeMethod>("{}");
			a.flag.Should().Be(true);
		}
		class ObjectWithPostDeserializeMethodRequiringCustomMessage_Class
		{
			public bool flag;
			[VDFPostDeserialize] void VDFPostDeserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options) { if ((string)options.messages[0] == "RequiredMessage") flag = true; }
		}
		[Fact] void D0_ObjectWithPostDeserializeMethodRequiringCustomMessage() { VDF.Deserialize<ObjectWithPostDeserializeMethodRequiringCustomMessage_Class>("{}", new VDFLoadOptions(new List<object>{"WrongMessage"})).flag.Should().Be(false); }
		class ObjectWithPostDeserializeConstructor_Class
		{
			public bool flag;
			[VDFPostDeserialize] ObjectWithPostDeserializeConstructor_Class() { flag = true; }
		}
		[Fact] void D1_ObjectWithPostDeserializeConstructor() { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); }

		/*class D1_MapWithPostDeserializeMethodInBaseClass_Prop_Class_Base
		{
			public bool called;
			[VDFPostDeserialize] public void PostDeserialize() { called = true; } // important: PostDeserialize methods in a base class must be made public // maybe todo: add code to auto-add private base-class members as well
		}
		class D1_MapWithPostDeserializeMethodInBaseClass_Prop_Class_Derived : D1_MapWithPostDeserializeMethodInBaseClass_Prop_Class_Base {}
		[Fact] void D1_MapWithPostDeserializeMethodInBaseClass_Prop() { VDF.Deserialize<D1_MapWithPostDeserializeMethodInBaseClass_Prop_Class_Derived>("{}").called.Should().Be(true); }*/

		class TypeInstantiatedManuallyThenFilled { [VDFProp] public bool flag; }
		[Fact] void D1_InstantiateTypeManuallyThenFill()
		{
			var a = new TypeInstantiatedManuallyThenFilled();
			VDF.DeserializeInto("{flag:true}", a);
			a.flag.Should().Be(true);
		}
		[VDFType(popOutL1: true)] class D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1
		{
			[VDFProp(popOutL2: true)] public Dictionary<string, string> messages = new Dictionary<string, string>
			{
				{"title1", "message1"},
				{"title2", "message2"}
			};
			[VDFProp] public bool otherProperty;
		}
		[Fact] void D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool()
		{
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

		// deserialize-related methods
		// ==========

		class D1_MapWithEmbeddedDeserializeMethod_Prop_Class
		{
			public bool boolProp;
			[VDFDeserialize] void Deserialize(VDFNode node) { boolProp = node["boolProp"]; }
		}
		[Fact] void D1_MapWithEmbeddedDeserializeMethod_Prop()
			{ VDF.Deserialize<D1_MapWithEmbeddedDeserializeMethod_Prop_Class>("{boolProp:true}").boolProp.Should().Be(true); }

		class D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class
		{
			public bool boolProp;
			[VDFDeserialize] object Deserialize(VDFNode node) { return VDF.NoActionTaken; }
		}
		[Fact] void D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop()
			{ VDF.Deserialize<D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class>("{boolProp:true}").boolProp.Should().Be(true); }

		class D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent
			{ public D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child child; }
		class D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child
			{ [VDFDeserialize(fromParent: true)] static D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child Deserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options) { return null; } }
		[Fact] void D1_MapWithEmbeddedDeserializeFromParentMethod_Prop()
			{ VDF.Deserialize<D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent>("{child:{}}").child.Should().Be(null); }

		class D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent
			{ public D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child child; }
		class D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child
		{
			public bool boolProp;
			[VDFDeserialize(fromParent: true)] static object Deserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options) { return VDF.NoActionTaken; }
		}
		[Fact] void D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop()
			{ VDF.Deserialize<D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent>("{child:{boolProp:true}}").child.boolProp.Should().Be(true); }

		class D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent
		{
			[VDFProp] public D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child withoutTag;
			[VDFProp, Tags("tag")] public D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child withTag;
		}
		class D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child
		{
			public bool methodCalled;
			[VDFDeserialize] void Deserialize(VDFNode node, VDFNodePath path, VDFLoadOptions options)
			{
				path.parentNode.obj.Should().BeOfType<D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent>();
				if (path.currentNode.prop.memberInfo.GetCustomAttributes(typeof(Tags), true).OfType<Tags>().Any(a=>a.tags.Contains("tag")))
					methodCalled = true;
			}
		}
		[Fact] void D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag()
		{
			var a = VDF.Deserialize<D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent>("{withoutTag:{} withTag:{}}");
			a.withoutTag.methodCalled.Should().Be(false);
			a.withTag.methodCalled.Should().Be(true);
		}

		class D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Parent
			{ public D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Child child; }
		class D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Child
			{ public bool called; }
		[Fact] void D1_MapWithExtensionDeserializeFromParentMethod_Prop()
		{
			VDFTypeInfo.AddDeserializeMethod_FromParent(node=>new D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Child {called = true});

			VDF.Deserialize<D1_MapWithExtensionDeserializeFromParentMethod_Prop_Class_Parent>("{child:{}}").child.called.Should().Be(true);
		}

		// for JSON compatibility
		// ==========

		[Fact] void D1_Map_IntsWithStringKeys()
		{
			var a = VDFLoader.ToVDFNode("{\"key1\":0 \"key2\":1}", new VDFLoadOptions(allowStringKeys: true));
			a.mapChildren.Count.Should().Be(2);
			a["key1"].primitiveValue.Should().Be(0);
		}
		[Fact] void D1_List_IntsWithCommaSeparators()
		{
			var a = VDFLoader.ToVDFNode("[0,1]", new VDFLoadOptions(allowCommaSeparators: true));
			a.listChildren.Count.Should().Be(2);
			a[0].primitiveValue.Should().Be(0);
		}
		[Fact] void D3_List_NumbersWithScientificNotation()
		{
			var a = VDFLoader.ToVDFNode("[-7.45058e-09,0.1,-1.49012e-08]", new VDFLoadOptions().ForJSON());
			a[0].primitiveValue.Should().Be(-7.45058e-09);
		}

		// unique to C# version
		// ==========

		[Fact] void D0_FloatAutoCastToDouble()
		{
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
		[Fact] void D1_ListOfTypeArray()
		{
			var a = VDF.Deserialize<int[]>("[0 1]");
			a[0].Should().Be(0);
			a[1].Should().Be(1);
		}
		[Fact] void D1_ListOfTypeArrayList()
		{
			var a = VDF.Deserialize<ArrayList>("[0 1]");
			a[0].Should().Be(0);
			a[1].Should().Be(1);
		}
	}

	public class Loading_SpeedTests
	{
		static Loading_SpeedTests()
		{
			VDFLoader.ToVDFNode("false");
			D5_SpeedTester();
			D5_SpeedTester2();
		}

		[Fact] static void D5_SpeedTester()
		{
			var vdf = @"{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^] tasksScriptText:'<<Grab Flag
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
	Gun1 fire>>'}
	{id:'ba991aaf-447a-4a03-ade8-f4a11b4ea966' typeName:'Wood' name:'Body' pivotPoint_unit:'-0.1875,0.4375,-0.6875' anchorNormal:'0,1,0' scale:'0.5,0.25,1.5' controller:true}
	{id:'743f64f2-8ece-4dd3-bdf5-bbb6378ffce5' typeName:'Wood' name:'FrontBar' pivotPoint_unit:'-0.4375,0.5625,0.8125' anchorNormal:'0,0,1' scale:'1,0.25,0.25' controller:false}
	{id:'52854b70-c200-478f-bcd2-c69a03cd808f' typeName:'Wheel' name:'FrontLeftWheel' pivotPoint_unit:'-0.5,0.5,0.875' anchorNormal:'-1,0,0' scale:'1,1,1' controller:false}
	{id:'971e394c-b440-4fee-99fd-dceff732cd1e' typeName:'Wheel' name:'BackRightWheel' pivotPoint_unit:'0.5,0.5,-0.875' anchorNormal:'1,0,0' scale:'1,1,1' controller:false}
	{id:'77d30d72-9845-4b22-8e95-5ba6e29963b9' typeName:'Wheel' name:'FrontRightWheel' pivotPoint_unit:'0.5,0.5,0.875' anchorNormal:'1,0,0' scale:'1,1,1' controller:false}
	{id:'21ca2a80-6860-4de3-9894-b896ec77ef9e' typeName:'Wheel' name:'BackLeftWheel' pivotPoint_unit:'-0.5,0.5,-0.875' anchorNormal:'-1,0,0' scale:'1,1,1' controller:false}
	{id:'eea2623a-86d3-4368-b4e0-576956b3ef1d' typeName:'Wood' name:'BackBar' pivotPoint_unit:'-0.4375,0.4375,-0.8125' anchorNormal:'0,0,-1' scale:'1,0.25,0.25' controller:false}
	{id:'f1edc5a1-d544-4993-bdad-11167704a1e1' typeName:'MachineGun' name:'Gun1' pivotPoint_unit:'0,0.625,0.875' anchorNormal:'0,1,0' scale:'0.5,0.5,0.5' controller:false}
	{id:'e97f8ee1-320c-4aef-9343-3317accb015b' typeName:'Crate' name:'Crate' pivotPoint_unit:'0,0.625,0' anchorNormal:'0,1,0' scale:'0.5,0.5,0.5' controller:false}";
			VDFLoader.ToVDFNode(vdf);
		}
		[Fact] static void D5_SpeedTester2()
		{
			var vdf = @"{^}
	mainMenu:{}
	console:{^}
		jsCode:""<<//Log(BD.live.liveMatch.map.plants[0]._parent.toString())
//Log(new Vector3(1, 2, 3).Swapped());
//Log(ToVDF(BD.live.liveMatch.players[0].selectedObjects[0].GetPath()));
//Log(BD.live.liveMatch.units[0]._pathNode.toString());
//Log(BD.objects.objects[5].name)
//Log(BD.live.liveMatch.map.structures[1].typeVObject.type);
//Log(BD.objects.objects[4].structures.length)
//Log(BD.objects.objects[6].structures[1].name);

//Log(BD.objects.objects[0].overrideBounds_bounds.toString());
Log(BD.maps.maps[1].players.length)>>""
		logRunJSResult:false
		csCode:""<<//Debug.Log(BD.main.live.liveMatch.players[0].selectedObjects[0].health);
//Debug.Log(BD.main.objects.objects[0].type);
//Debug.Log(BD.main.maps.selectedMap.plants[0].wood);
//Debug.Log(BD.main.live.liveMatch.map.plants[0].type);

//Debug.Log(V.Vector3Null.Equals(V.Vector3Null));
//Debug.Log(VConvert.ToVDF(BD.main.live.liveMatch.players[0].selectedObjects[0].GetPath()));
//Debug.Log(BD.main.live.liveMatch.units[0]._pathNode);
//Debug.Log(BD.main.objects.objects[6].structures[1].name);
//Debug.Log(BD.main.objects.objects[0].overrideBounds_bounds.size.x);
//BD.main.live.liveMatch.players[0].waterSupply = 100;
Debug.Log(VInput.WebUIHasMouseFocus);>>""
		logRunCSResult:false
		callLoggerEnabled:false
		calls_maxEntries:500
		filterEnabled:false
		loggerEnabled:true
		logStackTrace:false
		capture_pathFinding:true
	settings:{^}
		showTooltips:true
		autoOpenPage:""
		resolutionWidth:0
		resolutionHeight:0
		resolutionRefreshRate:0
		fullscreen:false
		showFPS:true
		masterVolume:0
		dragVSMove_pan:true
		dragVSMove_rotate:false
		dragVSMove_rotate_around:true
		dragVSMove_zoom:false
		thirdPerson_panSpeed:1
		thirdPerson_minMoveToRotate:5
		thirdPerson_rotateSpeed:1
		thirdPerson_zoomSpeed:1
		edgeOfScreenScroll_enabled:false
		edgeOfScreenScroll_maxDistanceFromEdge:10
		edgeOfScreenScroll_scrollSpeed:1
		username:null
		showConsolePage:true
		developerHotkeys:true
		logStartupInfo:true
		logStartupTimes:true
		delayFileSystemDataLoad:false
		loadModels:true
		letOutpostProduceAnyUnit:true
		matchSpeedMultiplier_enabled:false
		matchSpeedMultiplier:10
		unitSpeedMultiplier_enabled:false
		unitSpeedMultiplier:5
		collectSpeedMultiplier_enabled:false
		collectSpeedMultiplier:10
		buildSpeedMultiplier_enabled:true
		buildSpeedMultiplier:500
		showOccupiedSpace:false
		showPathFinderCacheData:false
		showMovementPaths:true
		showPredictedPositions:true
		showOcean:true
		showHealthBarsForYou:true
		showHealthBarsForAllies:true
		showHealthBarsForNeutrals:true
		showHealthBarsForEnemies:true
		healthBarWidth:25
		healthBarHeight:2
		healthBarScale:true
		healthBarScale_baseDistance:10
	maps:{^}
		lastCameraPos:null
		lastCameraRot:null
		ui_main_activeTab:1
		ui_left_width:1.90068278715461
		ui_left_activeTab:1
		ui_right_width:2.79298811799066
		ui_right_activeTab:2
		selectedMap:""Island_Walls""
        selectedSoil:null
		tools:{^}
			terrain_resize:{left:0 right:8 back:0 front:8}
			terrain_shape:{brushSize:30 strength:3}
			terrain_selectChunk:{}
			regions_paint:{brushSize:4 strength:3}
			objects_place:{selectedOther:null}
	biomes:{^}
		ui_left_width:18.9297124600639
		ui_right_width:18.7699680511182
	objects:{^}
		ui_left_width:24.6006389776358
		ui_right_width:29.7124600638978
	ais:{^}
		selectedAI:null
	matches:{^}
		local_room:{^}
			playerSetups:[^]
				{enabled:true canBeAI:true ai:null}
				{enabled:true canBeAI:true}
				{enabled:false canBeAI:true ai:null}
				{enabled:false canBeAI:true ai:null}
				{enabled:false canBeAI:true ai:null}
				{enabled:false canBeAI:true ai:null}
			selectedMap:null
			wood:1000
			stone:1000
			grain:1000
			fruit:1000
			salt:1000
			fogOfWar:false
	live:{}";
			VDFLoader.ToVDFNode(vdf);
		}
	}
}