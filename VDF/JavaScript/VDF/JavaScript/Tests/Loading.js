/*window["oldTest"] = test;
window["test"] = (title: string, testFunc: (assert?: QUnitAssert) => any) => // overwrite/wrap actual test func
{
Loading.Init();
window["oldTest"](title, testFunc);
}*/
var Loading = (function () {
    function Loading() {
    }
    Loading.Init = function () {
        if (this.initialized)
            return;
        this.initialized = true;
        Object.AddProtoFunction_Inline = function Should() {
            return { obj: this, Be: function (value, message) {
                    equal(this.obj, value, message);
                } };
        };
        VDF.RegisterTypeExporter_Inline("Guid", function (id) {
            return id.ToString();
        });
        VDF.RegisterTypeImporter_Inline("Guid", function (str) {
            return new Guid(str);
        });
        VDF.RegisterTypeExporter_Inline("Vector3", function (point) {
            return point.x + "," + point.y + "," + point.z;
        });
        VDF.RegisterTypeImporter_Inline("Vector3", function (str) {
            var parts = str.split(',');
            return new Vector3(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
        });
    };

    Loading.RunTests = function () {
        test("VDFNode_Level0_Comment", function (assert) {
            var a = VDFLoader.ToVDFNode("// comment\n\
			Root string.");
            a.items[0].baseValue.Should().Be("			Root string.");
        });
        test("VDFNode_Level0_BaseValue", function (assert) {
            var a = VDFLoader.ToVDFNode("Root string.");
            ok(a.baseValue == null); // base-values should only ever be at one level
            a.items[0].baseValue.Should().Be("Root string.");
        });
        test("VDFNode_Level0_Metadata_Type", function (assert) {
            var a = VDFLoader.ToVDFNode("<string>Root string.");
            a.metadata_type.Should().Be("string");
        });
        test("VDFNode_Level0_ArrayItems", function (assert) {
            var a = VDFLoader.ToVDFNode("Root string 1.|Root string 2.");
            a.items[0].baseValue.Should().Be("Root string 1.");
            a.items[1].baseValue.Should().Be("Root string 2.");
        });
        test("VDFNode_Level0_ArrayMetadata1", function (assert) {
            var a = VDFLoader.ToVDFNode("<<SpecialList[int]>>1|2", new VDFLoadOptions());
            a.metadata_type.Should().Be("SpecialList[int]");
            ok(a.items[0].metadata_type == null);
            ok(a.items[1].metadata_type == null);
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("<<SpecialList[int]>><int>1|<int>2", new VDFLoadOptions());
            a.metadata_type.Should().Be("SpecialList[int]");
            a.items[0].metadata_type.Should().Be("int");
            a.items[1].metadata_type.Should().Be("int");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("{key 1|value 1}{key 2|value 2}");
            a.items[0].items[0].baseValue.Should().Be("key 1");
            a.items[0].items[1].baseValue.Should().Be("value 1");
            a.items[1].items[0].baseValue.Should().Be("key 2");
            a.items[1].items[1].baseValue.Should().Be("value 2");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("bool{false}int{5}float{.5}string{Prop value string.}");
            a.properties["bool"].items[0].baseValue.Should().Be("false");
            a.properties["int"].items[0].baseValue.Should().Be("5");
            a.properties["float"].items[0].baseValue.Should().Be(".5");
            a.properties["string"].items[0].baseValue.Should().Be("Prop value string.");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@}");
            a.properties["string"].items[0].baseValue.Should().Be("Prop value string that {needs escaping}.");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@@|@@}");
            a.properties["string"].items[0].baseValue.Should().Be("Prop value string that {needs escaping}.@@");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("string{@@Prop value string that {needs escaping}.@@||@@}");
            a.properties["string"].items[0].baseValue.Should().Be("Prop value string that {needs escaping}.@@|");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("names{#}\n\
	Dan\n\
	Bob\n\
");
            a.properties["names"].items[0].items[0].baseValue.Should().Be("Dan");
            a.properties["names"].items[1].items[0].baseValue.Should().Be("Bob");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("{1A|1B}|{2A|2B}");
            a.items[0].items[0].baseValue.Should().Be("1A");
            a.items[0].items[1].baseValue.Should().Be("1B");
            a.items[1].items[0].baseValue.Should().Be("2A");
            a.items[1].items[1].baseValue.Should().Be("2B");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("{1key|1value}{2key|2value}");
            a.items[0].items[0].baseValue.Should().Be("1key");
            a.items[0].items[1].baseValue.Should().Be("1value");
            a.items[1].items[0].baseValue.Should().Be("2key");
            a.items[1].items[1].baseValue.Should().Be("2value");
        });
        test("VDFNode_Level0_ArrayMetadata2", function (assert) {
            var a = VDFLoader.ToVDFNode("names{#}ages{#}\n\
	Dan\n\
	Bob\n\
	#10\n\
	20");
            a.properties["names"].items[0].items[0].baseValue.Should().Be("Dan");
            a.properties["names"].items[1].items[0].baseValue.Should().Be("Bob");
            a.properties["ages"].items[0].items[0].baseValue.Should().Be("10");
            a.properties["ages"].items[1].items[0].baseValue.Should().Be("20");
        });
    };
    return Loading;
})();
//# sourceMappingURL=Loading.js.map
