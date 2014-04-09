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
            $("#outputA").html(vdf);
        });
        $("#makeOutputB").click(function (event, ui) {
        });
    });
})(Main || (Main = {}));
//# sourceMappingURL=Main.js.map
