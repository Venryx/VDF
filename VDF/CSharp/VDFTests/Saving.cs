﻿using System;
using System.Collections.Generic;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public class Saving
	{
		static Saving()
		{
			VDF.RegisterTypeExporter_Inline<Guid>(id => id.ToString());
			VDF.RegisterTypeImporter_Inline<Guid>(str => new Guid(str));
			VDF.RegisterTypeExporter_Inline<Vector3>(point => point.x + "," + point.y + "," + point.z);
			VDF.RegisterTypeImporter_Inline<Vector3>(str =>
			{
				string[] parts = str.Split(new[] { ',' });
				return new Vector3(float.Parse(parts[0]), float.Parse(parts[1]), float.Parse(parts[2]));
			});
		}

		[Fact] void ToVDF_Level0_BaseValue()
		{
			var a = new VDFNode();
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("Root string.");

			a = new VDFNode();
			a[0] = new VDFNode {baseValue = "Root string also."};
			a.ToVDF().Should().Be("Root string also.");
		}
		[Fact] void ToVDF_Level0_Metadata_Type()
		{
			var a = new VDFNode();
			a.metadata_type = "string";
			a.baseValue = "Root string.";
			a.ToVDF().Should().Be("string>Root string.");
		}
		[Fact] void ToVDF_Level0_Metadata_Type_Collapsed()
		{
			var a = VDFSaver.ToVDFNode(new List<string>(), new VDFSaveOptions{typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("string>>");
			a = VDFSaver.ToVDFNode(new List<List<string>> {new List<string> {"1A", "1B", "1C"}}, new VDFSaveOptions {typeMarking = VDFTypeMarking.AssemblyExternal});
			a.ToVDF().Should().Be("List[List[string]]>>{1A|1B|1C}"); // only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
		}

		[Fact] void ToVDF_Level1_BaseValues()
		{
			var a = new VDFNode();
			a["bool"] = new VDFNode {baseValue = "false"};
			a["int"] = new VDFNode {baseValue = "5"};
			a["float"] = new VDFNode {baseValue = ".5"};
			a["string"] = new VDFNode {baseValue = "Prop value string."};
			a.ToVDF().Should().Be("bool{false}int{5}float{.5}string{Prop value string.}");
		}
		class TypeWithNullProps { [VDFProp] public object obj; [VDFProp] public List<string> strings; [VDFProp] public List<string> strings2 = new List<string>(); }
		[Fact] void ToVDF_Level1_NullValues()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithNullProps());
			a["obj"].baseValue.Should().Be("[#null]");
			a["strings"].baseValue.Should().Be("[#null]");
			a["strings2"].baseValue.Should().Be(null); // it's just a VDFNode, with no children, representing a List
			a.ToVDF().Should().Be("TypeWithNullProps>obj{[#null]}strings{[#null]}strings2{}");
		}
		[Fact] void ToVDF_Level1_ListItems_Null()
		{
			var a = VDFSaver.ToVDFNode(new List<string>{null});
			a[0].baseValue.Should().Be("[#null]");
			a.ToVDF().Should().Be("string>>[#null]");
		}
		[Fact] void ToVDF_Level1_DictionaryValues_Null()
		{
			var dictionary = new Dictionary<string, string>();
			dictionary.Add("key1", null);
			var a = VDFSaver.ToVDFNode(dictionary);
			a["key1"].baseValue.Should().Be("[#null]");
			a.ToVDF().Should().Be("string,string>>key1{[#null]}");
		}
		class TypeWithPreSerializePrepMethod
		{
			[VDFProp] bool preSerializeWasCalled;
			[VDFPreSerialize] void VDFPreSerialize() { preSerializeWasCalled = true; }
		}
		[Fact] void ToVDF_Level1_PreSerializePreparation()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithPreSerializePrepMethod());
			((bool)a["preSerializeWasCalled"]).Should().Be(true);
			a.ToVDF().Should().Be("TypeWithPreSerializePrepMethod>preSerializeWasCalled{true}");
		}
		class TypeWithMixOfProps
		{
			[VDFProp] bool Bool = true;
			[VDFProp] int Int = 5;
			[VDFProp] float Float = .5f;
			[VDFProp] string String = "Prop value string.";
			[VDFProp] List<string> list = new List<string>{"2A", "2B"};
			[VDFProp] List<List<string>> nestedList = new List<List<string>>{new List<string>{"1A"}};
		}
		[Fact] void ToVDF_Level1_TypeProperties_MarkForNone()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions { typeMarking = VDFTypeMarking.None });
			a["Bool"].baseValue.Should().Be("true");
			a["Int"].baseValue.Should().Be("5");
			a["Float"].baseValue.Should().Be(".5");
			a["String"].baseValue.Should().Be("Prop value string.");
			a["list"][0].baseValue.Should().Be("2A");
			a["list"][1].baseValue.Should().Be("2B");
			a["nestedList"][0][0].baseValue.Should().Be("1A");
			a.ToVDF().Should().Be("Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
		}
		[Fact] void ToVDF_Level1_TypeProperties_MarkForAssembly()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions{typeMarking = VDFTypeMarking.Assembly});
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{true}Int{5}Float{.5}String{Prop value string.}list{2A|2B}nestedList{{1A}}");
		}
		[Fact] void ToVDF_Level1_TypeProperties_MarkForAssemblyExternal()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions { typeMarking = VDFTypeMarking.AssemblyExternal });
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{>true}Int{>5}Float{>.5}String{Prop value string.}list{string>>2A|2B}nestedList{List[List[string]]>>{string>>1A}}");
		}
		[Fact] void ToVDF_Level1_TypeProperties_MarkForAssemblyExternalNoCollapse()
		{
			var a = VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaveOptions { typeMarking = VDFTypeMarking.AssemblyExternalNoCollapse });
			a.ToVDF().Should().Be("TypeWithMixOfProps>Bool{bool>true}Int{int>5}Float{float>.5}String{string>Prop value string.}list{List[string]>>string>2A|string>2B}nestedList{List[List[string]]>>{List[string]>>string>1A}}");
		}
	}
}