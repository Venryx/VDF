/// <reference path="../../../../VDF/TypeScript/VDF/VDF.ts"/>
/// <reference path="../../../../VDF/TypeScript/VDF/VDFLoader.ts"/>
/// <reference path="../../../../VDF/TypeScript/VDF/VDFNode.ts"/>
/// <reference path="../../../../VDF/TypeScript/VDF/VDFSaver.ts"/>
/// <reference path="../../../../VDF/TypeScript/VDF/VDFTokenParser.ts"/>
/// <reference path="../../../../VDF/TypeScript/VDF/VDFTypeInfo.ts"/>
var V = new function () {
    var self = this;

    /*function AddClosureFunctionsToX(newHolder)
    {
    var names = arguments.callee.caller.toString().matches(/function\s*([\w\d]+)\s*\(/g);
    for (var name in names.strings())
    try { newHolder[name] = eval(name); } catch(e) {}
    }
    AddClosureFunctionsToX(self);*/
    self.CloneObject = function (obj) {
        return $.extend({}, obj);
    }; //deep: JSON.parse(JSON.stringify(obj));
    self.CloneArray = function (array) {
        return Array.prototype.slice.call(array, 0);
    }; //array.slice(0); //deep: JSON.parse(JSON.stringify(array));

    //self.Multiline = function (functionWithInCommentMultiline) { return functionWithInCommentMultiline.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, ''); };
    // example:
    // alert(V.Multiline(function()
    //{/*
    // Text that...
    // spans multiple...
    // lines.
    //*/}));
    self.Multiline = function (functionWithInCommentMultiline) {
        return functionWithInCommentMultiline.toString().replace(/^[^\/]+\/\*/, '').replace(/\*\/(.|\n)*/, '');
    };

    self.ExtendWith = function (value) {
        $.extend(this, value);
    };
};
//# sourceMappingURL=V.js.map
