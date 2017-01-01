// tests
// ==========

module VDFTests { // added to match C# indentation
	module Saving_SpeedTests {
		class SpeedTest1_Class {
			Bool = Prop(this, "Bool", "bool", new P()).set = true;
			Int = Prop(this, "Int", "int", new P()).set = 5;
			Double = Prop(this, "Double", "double", new P()).set = .5;
			String = Prop(this, "String", "string", new P()).set = "Prop value string.";
			list = Prop(this, "list", "List(string)", new P()).set = new List<string>("string", "2A", "2B");
			nestedList = Prop(this, "nestedList", "List(List(string))", new P()).set = new List<List<string>>("List(string)", new List<string>("string", "1A"));
		}
		test("SpeedTest1", () => {
			var a = VDFSaver.ToVDFNode(new SpeedTest1_Class(), new VDFSaveOptions({typeMarking: VDFTypeMarking.None}));
			a["Bool"].primitiveValue.Should().Be(true);
			a["Int"].primitiveValue.Should().Be(5);
			a["Double"].primitiveValue.Should().Be(.5);
			a["String"].primitiveValue.Should().Be("Prop value string.");
			a["list"][0].primitiveValue.Should().Be("2A");
			a["list"][1].primitiveValue.Should().Be("2B");
			a["nestedList"][0][0].primitiveValue.Should().Be("1A");
			//for (var i = 0; i < 10000; i++)
			var vdf = a.ToVDF();
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
	}
}