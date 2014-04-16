var Main;
(function (Main) {
    // methods
    // ==================
    function GetUrlVars(url) {
        if (!url.contains('?'))
            return { length: 0 };

        var vars = {};

        var urlVarStr = url.contains("?") ? url.slice(url.indexOf('?') + 1).split("#")[0] : "";
        var parts = urlVarStr.split("&");
        for (var i = 0; i < parts.length; i++)
            vars[parts[i].substring(0, parts[i].indexOf("="))] = parts[i].substring(parts[i].indexOf("=") + 1);

        return vars;
    }

    // startup
    // ==================
    VDF.RegisterTypeExporter_Inline("Vector3", function (point) {
        return point.x + "," + point.y + "," + point.z;
    });
    VDF.RegisterTypeImporter_Inline("Vector3", function (str) {
        var parts = str.split(',');
        return new Vector3(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
    });
    VDF.RegisterTypeExporter_Inline("Guid", function (id) {
        return "";
    }); //id.ToString());
    VDF.RegisterTypeImporter_Inline("Guid", function (str) {
        return new Guid(str);
    });

    $(function () {
        var urlVars = GetUrlVars(window.location.href);
        if (urlVars.activeTab != null)
            $($("#tabs").children("div").children()[urlVars.activeTab]).addClass("active");
        else
            $($("#tabs").children("div").children()[0]).addClass("active");
        $("#tabs").VTabView();

        $("#makeOutputA").click(function (event, ui) {
            var testWorld = Test1.CreateWorld();

            // serialize it, and save it to file
            var vdf = VDF.Serialize(testWorld, new VDFSaveOptions());
            $("#outputA").val(vdf);
        });
        $("#makeOutputB").click(function (event, ui) {
            // load from output-a textbox
            var vdf = decodeURIComponent($("#outputA").val()).replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            var testWorld = VDF.Deserialize(vdf, "World", new VDFLoadOptions());

            // reserialize it, and save it to second file, to check data
            var vdf2 = VDF.Serialize(testWorld, new VDFSaveOptions());
            $("#outputB").val(vdf2);
        });
    });
})(Main || (Main = {}));
//# sourceMappingURL=Main.js.map
