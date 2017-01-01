var V = new function () {
    var self = this;
    /*self.AddClosureFunctionsToX = function(newHolder, nameMatchStartStr = "")
    {
        var names = arguments.callee.caller.toString().match(new RegExp("function\\s+(" + nameMatchStartStr + "[\\w\\d]+)\\s*\\(", "g"));
        for (var i = 0; i < names.length; i++)
            try { newHolder[names[i]] = eval(names[i]); } catch(e) {}
    }
    AddClosureFunctionsToX(self);*/
    self.CloneObject = function (obj) { return $.extend({}, obj); }; //deep: JSON.parse(JSON.stringify(obj));
    self.CloneArray = function (array) { return Array.prototype.slice.call(array, 0); }; //array.slice(0); //deep: JSON.parse(JSON.stringify(array));
    self.Map = function (list, mapFunc) {
        var result = [];
        for (var i = 0; i < list.length; i++)
            result[i] = mapFunc(list[i]);
        return result;
    };
    self.GetMatches = function (str, regex, groupIndex) {
        groupIndex = groupIndex || 1; // default to the first capturing group
        var matches = [];
        var match;
        while (match = regex.exec(str))
            matches.push(match[groupIndex]);
        return matches;
    };
    //self.Multiline = function (functionWithInCommentMultiline) { return functionWithInCommentMultiline.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, ''); };
    // example:
    // alert(V.Multiline(function()
    //{/*
    // Text that...
    // spans multiple...
    // lines.
    //*/}));
    //self.Multiline = function(functionWithInCommentMultiline) { return functionWithInCommentMultiline.toString().replace(/^[^\/]+\/\*/, '').replace(/\*\/(.|\n)*/, ''); };
    self.Multiline = function (functionWithInCommentMultiline) {
        var text = functionWithInCommentMultiline.toString().replace(/\r/g, "");
        var firstCharPos = text.indexOf("\n", text.indexOf("/*"));
        return text.substring(firstCharPos + 1, text.lastIndexOf("\n"));
    };
    self.ExtendWith = function (value) { $.extend(this, value); };
    self.timerStart = 0;
    self.StartTimer = function () { self.timerStart = new Date().getTime(); };
    self.StopTimerAndMarkTime = function () { console.log("Took (in ms): " + (new Date().getTime() - self.timerStart)); };
};
var VDebug = (function () {
    function VDebug() {
    }
    VDebug.StartTimer = function () { VDebug.timerStart = new Date().getTime(); };
    VDebug.StopTimerAndMarkTime = function (name) { console.log("Time (in ms)" + (name ? " - " + name : "") + ": " + (new Date().getTime() - VDebug.timerStart)); };
    VDebug.StartSection = function () { VDebug.timerStart = new Date().getTime(); };
    VDebug.EndSection = function (name, waitTimeBeforeResults) {
        if (waitTimeBeforeResults === void 0) { waitTimeBeforeResults = 1000; }
        VDebug.sectionTotals[name] = (VDebug.sectionTotals[name] || 0) + (new Date().getTime() - VDebug.timerStart);
        var oldVal = VDebug.sectionTotals[name];
        clearTimeout(VDebug.waitTimerIDs[name]);
        VDebug.waitTimerIDs[name] = setTimeout(function () {
            if (VDebug.sectionTotals[name] == oldVal)
                console.log("Time (in ms)" + (name ? " - " + name : "") + ": " + oldVal);
        }, waitTimeBeforeResults);
    };
    return VDebug;
}());
VDebug.timerStart = 0;
VDebug.sectionTotals = {};
VDebug.waitTimerIDs = {};
//# sourceMappingURL=V.js.map