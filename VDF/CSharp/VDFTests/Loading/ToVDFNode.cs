using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using FluentAssertions;
using VDFN;
using Xunit;

namespace VDFTests {
	public class Loading_ToVDFNode {
		[Fact] void D0_Comment() {
			VDFNode a = VDFLoader.ToVDFNode(@"## comment
'Root string.'");
			a.primitiveValue.Should().Be("Root string.");
		}
		[Fact] void D0_Comment2() {
			VDFNode a = VDFLoader.ToVDFNode("'Root string ends here.'## comment");
			a.primitiveValue.Should().Be("Root string ends here.");
		}
		[Fact] void D0_Int() {
			VDFNode a = VDFLoader.ToVDFNode("1");
			a.primitiveValue.Should().Be(1);
		}
		[Fact] void D0_IntNegative() {
			VDFNode a = VDFLoader.ToVDFNode("-1");
			a.primitiveValue.Should().Be(-1);
		}
		[Fact] void D0_PowerNotation() {
			VDFLoader.ToVDFNode("1e3").primitiveValue.Should().Be(1000d); //1 * Math.Pow(10, 3));
			VDFLoader.ToVDFNode("1e-3").primitiveValue.Should().Be(.001); //1 * Math.Pow(10, -3));
			VDFLoader.ToVDFNode("-1e3").primitiveValue.Should().Be(-1000d); //-(1 * Math.Pow(10, 3)));
			VDFLoader.ToVDFNode("-1e-3").primitiveValue.Should().Be(-.001); //-(1 * Math.Pow(10, -3)));
		}
		[Fact] void D0_Infinity() {
			VDFLoader.ToVDFNode("Infinity").primitiveValue.Should().Be(double.PositiveInfinity);
			VDFLoader.ToVDFNode("-Infinity").primitiveValue.Should().Be(double.NegativeInfinity);
		}
		[Fact] void D0_String() {
			VDFNode a = VDFLoader.ToVDFNode("'Root string.'");
			a.primitiveValue.Should().Be("Root string.");
		}
		[Fact] void D0_StringWithSaveThenLoad() {
			var vdf = VDF.Serialize("Root string.");
			vdf.Should().Be("\"Root string.\"");
			var a = VDFLoader.ToVDFNode(vdf);
			a.primitiveValue.Should().Be("Root string.");
		}
		[Fact] void D0_StringAsNull() {
			var a = VDF.Deserialize<string>("null");
			a.Should().Be(null);
		}
		[Fact] void D0_BaseValue_Literal() {
			VDFNode a = VDFLoader.ToVDFNode("'<<\tBase-value string that {needs escaping}.>>'");
			a.primitiveValue.Should().Be("\tBase-value string that {needs escaping}.");
		}
		[Fact] void D0_Metadata_Type() {
			VDFNode a = VDFLoader.ToVDFNode("string>'Root string.'");
			a.metadata.Should().Be("string");
		}
		[Fact] void D0_List() {
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
		[Fact] void D0_List_Objects() {
			VDFNode a = VDFLoader.ToVDFNode<List<object>>("[{name:'Dan' age:50} {name:'Bob' age:60}]");
			a[0]["name"].primitiveValue.Should().Be("Dan");
			a[0]["age"].primitiveValue.Should().Be(50);
			a[1]["name"].primitiveValue.Should().Be("Bob");
			a[1]["age"].primitiveValue.Should().Be(60);
		}
		[Fact] void D0_List_Literals() {
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
		[Fact] void D0_ListMetadata() {
			VDFNode a = VDFLoader.ToVDFNode("List(int)>[1 2]");
			a.metadata.Should().Be("List(int)");
			a[0].metadata.Should().Be(null);
			a[1].metadata.Should().Be(null);
		}
		[Fact] void D0_ListMetadata2() {
			VDFNode a = VDFLoader.ToVDFNode("List(object)>[string>\"1\" string>\"2\"]");
			a.metadata.Should().Be("List(object)");
			a[0].metadata.Should().Be("string");
			a[1].metadata.Should().Be("string");
		}
		[Fact] void D0_EmptyMap() { ((Dictionary<object, object>)VDF.Deserialize("{}")).Count.Should().Be(0); }
		[Fact] void D0_Map_ChildMetadata() {
			VDFNode a = VDFLoader.ToVDFNode("Dictionary(object object)>{a:string>\"1\" b:string>\"2\"}");
			a.metadata.Should().Be("Dictionary(object object)");
			a["a"].metadata.Should().Be("string");
			a["b"].metadata.Should().Be("string");
		}
		[Fact] void D0_MultilineString() {
			VDFNode a = VDFLoader.ToVDFNode(
@"'<<This is a
multiline string
of three lines in total.>>'");
			a.primitiveValue.Should().Be(
@"This is a
multiline string
of three lines in total.".Fix());
		}

		[Fact] void D1_Map_Children() {
			VDFNode a = VDFLoader.ToVDFNode("{key1:'Simple string.' key2:'false' key3:{name:'Dan' age:50}}");
			a["key1"].primitiveValue.Should().Be("Simple string.");
			a["key2"].primitiveValue.Should().Be("false");
			a["key3"]["age"].primitiveValue.Should().Be(50);
		}
		[Fact] void D1_Map_ChildrenThatAreRetrievedByKey() {
			VDFNode a = VDFLoader.ToVDFNode("{key 1:'value 1' key 2:'value 2'}");
			a["key 1"].primitiveValue.Should().Be("value 1");
			a["key 2"].primitiveValue.Should().Be("value 2");
		}
		[Fact] void D1_List_StringThatKeepsStringTypeFromVDFEvenWithObjectTypeFromCode() {
			var a = VDF.Deserialize<List<object>>("['SimpleString']");
			a[0].Should().Be("SimpleString");
		}
		[Fact] void D1_BaseValuesWithImplicitCasting() {
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
		[Fact] void D1_BaseValuesWithMarkedTypes() {
			VDFNode a = VDFLoader.ToVDFNode("{bool:bool>false int:int>5 double:double>.5 string:string>'Prop value string.'}");
			((bool)a["bool"]).Should().Be(false);
			((int)a["int"]).Should().Be(5);
			((double)a["double"]).Should().Be(.5f);
			((string)a["string"]).Should().Be("Prop value string.");
		}
		[Fact] void D1_Literal() {
			VDFNode a = VDFLoader.ToVDFNode("{string:'<<<Prop value string that <<needs escaping>>.>>>'}");
			a["string"].primitiveValue.Should().Be("Prop value string that <<needs escaping>>.");
		}
		[Fact] void D1_TroublesomeLiteral1() {
			VDFNode a = VDFLoader.ToVDFNode("{string:'<<<#<<Prop value string that <<needs escaping>>.>>#>>>'}");
			a["string"].primitiveValue.Should().Be("<<Prop value string that <<needs escaping>>.>>");
		}
		[Fact] void D1_TroublesomeLiteral2() {
			VDFNode a = VDFLoader.ToVDFNode("{string:'<<<##Prop value string that <<needs escaping>>.##>>>'}");
			a["string"].primitiveValue.Should().Be("#Prop value string that <<needs escaping>>.#");
		}
		[Fact] void D1_VDFWithVDFWithVDF() {
			VDFNode a = VDFLoader.ToVDFNode("{level1:'<<<{level2:'<<{level3:'Base string.'}>>'}>>>'}");
			a["level1"].primitiveValue.Should().Be("{level2:'<<{level3:'Base string.'}>>'}");
			VDFLoader.ToVDFNode(a["level1"])["level2"].primitiveValue.Should().Be("{level3:'Base string.'}");
			VDFLoader.ToVDFNode(VDFLoader.ToVDFNode(a["level1"])["level2"])["level3"].primitiveValue.Should().Be("Base string.");
		}
		[Fact] void D1_ArraysInArrays() {
			VDFNode a = VDFLoader.ToVDFNode("[['1A' '1B'] ['2A' '2B'] '3A']");
			a[0][0].primitiveValue.Should().Be("1A");
			a[0][1].primitiveValue.Should().Be("1B");
			a[1][0].primitiveValue.Should().Be("2A");
			a[1][1].primitiveValue.Should().Be("2B");
			a[2].primitiveValue.Should().Be("3A");
		}
		[Fact] void D1_ArraysInArrays_SecondsNullAndEmpty() {
			VDFNode a = VDFLoader.ToVDFNode("[['1A' null] ['2A' '']]");
			a[0][0].primitiveValue.Should().Be("1A");
			a[0][1].primitiveValue.Should().Be(null);
			a[1][0].primitiveValue.Should().Be("2A");
			a[1][1].primitiveValue.Should().Be("");
		}
		[Fact] void D1_StringAndArraysInArrays() {
			VDFNode a = VDFLoader.ToVDFNode("['text' ['2A' null]]");
			a[0].primitiveValue.Should().Be("text");
			a[1][0].primitiveValue.Should().Be("2A");
			a[1][1].primitiveValue.Should().Be(null);
		}
		[Fact] void D1_Dictionary() {
			VDFNode a = VDFLoader.ToVDFNode("{key1:'value1' key2:'value2' 'key3':'value3' \"key4\":\"value4\"}");
			a["key1"].primitiveValue.Should().Be("value1");
			a["key2"].primitiveValue.Should().Be("value2");
			a["key3"].primitiveValue.Should().Be("value3");
			a["key4"].primitiveValue.Should().Be("value4");
		}
		[Fact] void D1_Map_MixedTypeKeysWithMetadata() {
			VDFNode a = VDFLoader.ToVDFNode("{int>1:'value1' int>\"2\":'value2' 'key3':'value3' \"key4\":\"value4\"}");
			var pairs = a.mapChildren.ToList();
			a["1"].primitiveValue.Should().Be("value1");
			a["2"].primitiveValue.Should().Be("value2");
			a["key3"].primitiveValue.Should().Be("value3");
			a["key4"].primitiveValue.Should().Be("value4");
			var b = a.ToObject();
			b.GetType().Should().Be(typeof(Dictionary<object, object>));
			var bMap = b as Dictionary<object, object>;
			bMap[1].Should().Be("value1");
			bMap[2].Should().Be("value2");
			bMap["key3"].Should().Be("value3");
			bMap["key4"].Should().Be("value4");
		}
		[Fact] void D1_Map_KeyWithHash() {
			VDFNode a = VDFLoader.ToVDFNode("{#:'value1'}");
			a["#"].primitiveValue.Should().Be("value1");
		}
		[Fact] void D1_Dictionary_Complex() {
			VDFNode a = VDFLoader.ToVDFNode("{uiPrefs:{toolOptions:'<<{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}>>' liveTool:'Select'}}");
			a["uiPrefs"]["toolOptions"].primitiveValue.Should().Be("{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}");
			a["uiPrefs"]["liveTool"].primitiveValue.Should().Be("Select");
		}
		[Fact] void D1_Dictionary_TypesInferredFromGenerics() {
			VDFNode a = VDFLoader.ToVDFNode("{vertexColors:Dictionary(string Color)>{9,4,2.5:'Black' 1,8,9.5435:'Gray' 25,15,5:'White'}}", new VDFLoadOptions
				(
				typeAliasesByType: new Dictionary<Type, string> {{typeof(Color), "Color"}}
				));
			a["vertexColors"]["9,4,2.5"].primitiveValue.Should().Be("Black");
			a["vertexColors"]["1,8,9.5435"].primitiveValue.Should().Be("Gray");
			a["vertexColors"]["25,15,5"].primitiveValue.Should().Be("White");
		}

		[Fact] void D1_ArrayPoppedOut_NoItems() {
			VDFNode a = VDFLoader.ToVDFNode("{names:[^]}");
			a["names"].listChildren.Count.Should().Be(0);
			a["names"].mapChildren.Count.Should().Be(0);
		}
		[Fact] void D1_ArrayPoppedOut() {
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
		[Fact] void D1_InferredDictionaryPoppedOut() {
			VDFNode a = VDFLoader.ToVDFNode(
@"{messages:{^} otherProperty:false}
	title1:'message1'
	title2:'message2'");
			a["messages"].mapChildren.Count.Should().Be(2);
			a["messages"]["title1"].primitiveValue.Should().Be("message1");
			a["messages"]["title2"].primitiveValue.Should().Be("message2");
			a["otherProperty"].primitiveValue.Should().Be(false);
		}
		[Fact] void D1_Map_PoppedOutMap() {
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

		[Fact] void D1_Object_MultilineStringThenProperty() {
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
		[Fact] void D1_Object_PoppedOutStringsThenMultilineString() {
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

		[Fact] void D2_List_Lists_PoppedOutObjects() {
			var a = VDFLoader.ToVDFNode(
@"[[^] [^] [^]]
	{name:'Road'}
	^{name:'RoadAndPath'}
	^{name:'SimpleHill'}"); //, new VDFLoadOptions(inferStringTypeForUnknownTypes: true));
			a.listChildren.Count.Should().Be(3);
		}
		[Fact] void D2_List_PoppedOutObjects_MultilineString() {
			var a = VDFLoader.ToVDFNode(
@"[^]
	{id:1 multilineText:'<<line1
	line2
	line3>>'}
	{id:2 multilineText:'<<line1
	line2>>'}");
			a.listChildren.Count.Should().Be(2);
		}

		[Fact] void D2_Object_PoppedOutObject_PoppedOutObject() {
			var a = VDFLoader.ToVDFNode(
@"{name:'L0' children:[^]}
	{name:'L1' children:[^]}
		{name:'L2'}");
			a["children"].listChildren.Count.Should().Be(1);
			a["children"].listChildren[0]["children"].listChildren.Count.Should().Be(1);
		}

		[Fact] void D5_TokenTextPreservation() {
			var vdf1 = @"{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^] tasksScriptText:'<<Shoot at Enemy Vehicle
	Gun1 aim at EnemyVehicle_NonBroken
	Gun1 fire>>'}
	{id:'ba991aaf-447a-4a03-ade8-f4a11b4ea966' typeName:'Wood' name:'Body' pivotPoint_unit:'-0.1875,0.4375,-0.6875' anchorNormal:'0,1,0' scale:'0.5,0.25,1.5' controller:true}
	{id:'743f64f2-8ece-4dd3-bdf5-bbb6378ffce5' typeName:'Wood' name:'FrontBar' pivotPoint_unit:'-0.4375,0.5625,0.8125' anchorNormal:'0,0,1' scale:'1,0.25,0.25' controller:false}".Replace("\r\n", "\n");
			var tokens = VDFTokenParser.ParseTokens(vdf1, null, true, false);

			// shift each within-string literal-end-marker token to after its containing-string's token
			for (var i = 0; i < tokens.Count; i++)
				if (tokens[i].type == VDFTokenType.LiteralEndMarker && tokens[i + 1].type == VDFTokenType.String) {
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
		[Fact] void D5_DeepNestedPoppedOutData() {
			var vdf =
@"{name:'Main' worlds:Dictionary(string object)>{Test1:{vObjectRoot:{name:'VObjectRoot' children:[^]}} Test2:{vObjectRoot:{name:'VObjectRoot' children:[^]}}}}
	{id:System.Guid>'025f28a5-a14b-446d-b324-2d274a476a63' name:'#Types' children:[]}
	^{id:System.Guid>'08e84f18-aecf-4b80-9c3f-ae0697d9033a' name:'#Types' children:[]}";
			var livePackNode = VDFLoader.ToVDFNode(vdf);
			livePackNode["worlds"]["Test1"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
			livePackNode["worlds"]["Test2"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
		}
	}
}