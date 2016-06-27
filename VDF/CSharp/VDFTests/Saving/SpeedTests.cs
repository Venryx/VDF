using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using FluentAssertions;
using VDFN;
using Xunit;

namespace VDFTests {
	public class Saving_SpeedTests {
		static Saving_SpeedTests() {
			// run tests once ahead of time, so VDF-type-data is pre-loaded for profiled tests
			var testMethods = VDFTypeInfo.Get(typeof(Saving_SpeedTests)).methods.Values
				.Where(a=>a.memberInfo.DeclaringType == typeof(Saving_SpeedTests) && a.memberInfo.MemberType != MemberTypes.Constructor).ToList();
			foreach (var method in testMethods)
				method.Call(null);
		}

		class SpeedTest1_Class {
			[P] bool Bool = true;
			[P] int Int = 5;
			[P] double Double = .5;
			[P] string String = "Prop value string.";
			[P] List<string> list = new List<string> {"2A", "2B"};
			[P] List<List<string>> nestedList = new List<List<string>> {new List<string> {"1A"}};
		}
		[Fact] static void SpeedTest1() {
			var a = VDFSaver.ToVDFNode(new SpeedTest1_Class(), new VDFSaveOptions(typeMarking: VDFTypeMarking.None));
			a["Bool"].primitiveValue.Should().Be(true);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a["list"][0].primitiveValue.Should().Be("2A");
			a["list"][1].primitiveValue.Should().Be("2B");
			a["nestedList"][0][0].primitiveValue.Should().Be("1A");
			for (var i = 0; i < 10000; i++) {
				var vdf = a.ToVDF();
			}
		}
	}
}