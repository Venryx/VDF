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

var StringBuilder = (function () {
    function StringBuilder() {
        this.data = [];
        this.counter = 0;
    }
    StringBuilder.prototype.Append = function (str) {
        this.data[this.counter++] = str;
        return this;
    };
    StringBuilder.prototype.Remove = function (i, j) {
        this.data.splice(i, j || 1);
        return this;
    };
    StringBuilder.prototype.Insert = function (i, str) {
        this.data.splice(i, 0, str);
        return this;
    };
    StringBuilder.prototype.ToString = function (joinerString) {
        return this.data.join(joinerString || "");
    };
    return StringBuilder;
})();
//# sourceMappingURL=Main.js.map
