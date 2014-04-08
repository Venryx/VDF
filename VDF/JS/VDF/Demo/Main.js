var Main;
(function (Main) {
    // methods
    // ==================
    // startup
    // ==================
    $(function () {
        $("#tabs").VTabView();

        $("#makeOutputA").click(function (event, ui) {
            var testWorld = {};

            // serialize it, and save it to file
            var vdf = VDF.Serialize(testWorld, new VDFSaveOptions());
            $("#outputA").html(vdf);
        });
        $("#makeOutputB").click(function (event, ui) {
        });
    });
})(Main || (Main = {}));
//# sourceMappingURL=Main.js.map
