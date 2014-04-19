// Object: base
// ==================

// the below lets you do stuff like this: Array.prototype._AddFunction(function AddX(value) { this.push(value); }); [].AddX("newItem");
Object.defineProperty(Object.prototype, "_AddItem", {
    enumerable: false,
    value: function (name, value, forceAdd) {
        if (this[name] && forceAdd)
            delete this[name];
        if (!this[name])
            Object.defineProperty(this, name, {
                enumerable: false,
                value: value
            });
    }
});
Object.prototype._AddItem("_AddFunction", function (func, forceAdd) {
    this._AddItem(func.name || func.toString().match(/^function\s*([^\s(]+)/)[1], func, forceAdd);
});

// the below lets you do stuff like this: Array.prototype._AddGetterSetter("AddX", null, function(value) { this.push(value); }); [].AddX = "newItem";
Object.prototype._AddFunction(function _AddGetterSetter(getter, setter, forceAdd) {
    var name = (getter || setter).name || (getter || setter).toString().match(/^function\s*([^\s(]+)/)[1];
    if (this[name] && forceAdd)
        delete this[name];
    if (!this[name])
        if (getter && setter)
            Object.defineProperty(this, name, { enumerable: false, get: getter, set: setter });
        else if (getter)
            Object.defineProperty(this, name, { enumerable: false, get: getter });
        else
            Object.defineProperty(this, name, { enumerable: false, set: setter });
});

// the below lets you do stuff like this: Array.prototype._AddFunction_Inline = function AddX(value) { this.push(value); }; [].AddX = "newItem";
Object.prototype._AddGetterSetter(null, function _AddFunction_Inline(func) {
    this._AddFunction(func);
});
Object.prototype._AddGetterSetter(null, function _AddGetter_Inline(func) {
    this._AddGetterSetter(func, null);
});
Object.prototype._AddGetterSetter(null, function _AddSetter_Inline(func) {
    this._AddGetterSetter(null, func);
});


Object.prototype._AddSetter_Inline = function ExtendWith_Inline(value) {
    this.ExtendWith(value);
};
Object.prototype._AddFunction_Inline = function ExtendWith(value) {
    $.extend(this, value);
};
Object.prototype._AddFunction_Inline = function GetItem_SetToXIfNull(itemName, /*;optional:*/ defaultValue) {
    if (!this[itemName])
        this[itemName] = defaultValue;
    return this[itemName];
};
Object.prototype._AddFunction_Inline = function CopyXChildrenAsOwn(x) {
    $.extend(this, x);
};
Object.prototype._AddFunction_Inline = function CopyXChildrenToClone(x) {
    return $.extend($.extend({}, this), x);
};
Object.prototype._AddFunction_Inline = function Keys() {
    var result = [];
    for (var key in this)
        if (this.hasOwnProperty(key))
            result.push(key);
    return result;
};
Object.prototype._AddFunction_Inline = function Items() {
    var result = [];
    for (var key in this)
        if (this.hasOwnProperty(key))
            result.push(this[key]);
    return result;
};
Object.prototype._AddFunction_Inline = function ToJson() {
    return JSON.stringify(this);
};


String.prototype._AddFunction_Inline = function startsWith(str) {
    return this.lastIndexOf(str, 0) === 0;
};
String.prototype._AddFunction_Inline = function endsWith(str) {
    var pos = this.length - str.length;
    return this.indexOf(str, pos) === pos;
};
String.prototype._AddFunction_Inline = function contains(str, startIndex) {
    return -1 !== String.prototype.indexOf.call(this, str, startIndex);
};
String.prototype._AddFunction_Inline = function hashCode() {
    var hash = 0;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
String.prototype._AddFunction_Inline = function matches(regex, index) {
    index = index || 1; // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(this))
        matches.push(match[index]);
    return matches;
};
String.prototype._AddFunction_Inline = function IndexOf_Xth(str, x) {
    var currentPos = -1;
    for (var i = 0; i < x; i++) {
        var subIndex = this.indexOf(str, currentPos + 1);
        if (subIndex == -1)
            return -1;
        currentPos = subIndex;
    }
    return currentPos;
};
String.prototype._AddFunction_Inline = function indexOfAny() {
    if (arguments[0] instanceof Array)
        arguments = arguments[0];

    var lowestIndex = -1;
    for (var i = 0; i < arguments.length; i++) {
        var indexOfChar = this.indexOf(arguments[i]);
        if (indexOfChar != -1 && (indexOfChar < lowestIndex || lowestIndex == -1))
            lowestIndex = indexOfChar;
    }
    return lowestIndex;
};
String.prototype._AddFunction_Inline = function containsAny() {
    for (var i = 0; i < arguments.length; i++)
        if (this.contains(arguments[i]))
            return true;
    return false;
};
String.prototype._AddFunction_Inline = function splitByAny() {
    if (arguments[0] instanceof Array)
        arguments = arguments[0];

    var splitStr = "/";
    for (var i = 0; i < arguments.length; i++)
        splitStr += (splitStr.length > 1 ? "|" : "") + arguments[i];
    splitStr += "/";

    return this.split(splitStr);
};
String.prototype._AddFunction_Inline = function splice(index, removeCount, insert) {
    return this.slice(0, index) + insert + this.slice(index + Math.abs(removeCount));
};


Array.prototype._AddFunction_Inline = function contains(str) {
    return this.indexOf(str) != -1;
};
Array.prototype._AddFunction_Inline = function last() {
    return this[this.length - 1];
};

Array.prototype._AddFunction_Inline = function pushAll(array) {
    for (var i in array.indexes())
        this.push(array[i]);
};
Array.prototype._AddFunction_Inline = function indexes() {
    var result = {};
    for (var i = 0; i < this.length; i++)
        result[i] = this[i];
    return result;
};
Array.prototype._AddFunction_Inline = function strings() {
    var result = {};
    for (var key in this) {
        if (this.hasOwnProperty(key))
            result[this[key]] = null;
    }
    return result;
};
Array.prototype._AddFunction_Inline = function remove(obj) {
    for (var i = this.length; ; i--)
        if (this[i] === obj)
            return this.splice(i, 1);
};

/*Array.prototype._AddFunction_Inline = function filter(matchFunc)
{
var result = [];
for (var i in this.indexes())
if (matchFunc.call(this[i], this[i])) // call, having the item be "this", as well as the first argument
result.push(this[i]);
return result;
};*/
Array.prototype._AddFunction_Inline = function clear() {
    while (this.length > 0)
        this.pop();
};
Array.prototype._AddFunction_Inline = function first(matchFunc) {
    if (typeof matchFunc === "undefined") { matchFunc = function () {
        return true;
    }; }
    return this.filter(matchFunc)[0];
};
Array.prototype._AddFunction_Inline = function insert(index, obj) {
    //for (var i = this.length - 1; i >= index; i--) // shift each item that will be over us, up one
    //	this[i + 1] = this[i];
    //this[index] = obj; // place the item into the now-available slot
    this.splice(index, 0, obj);
};
//# sourceMappingURL=ClassExtensions.js.map
