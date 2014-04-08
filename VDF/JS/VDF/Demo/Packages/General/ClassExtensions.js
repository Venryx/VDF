var N = {}; // none; empty; "N.[...] = " is just done to make things visible for code-completion, etc.

// attachment: base
// ==================

// the below lets you do stuff like this: Array.AddProtoFunction_Inline = function AddX(value) { this.push(value); }); [].AddX("newItem");
Object.defineProperty(Object.prototype, "AddItem", // 'silent' is implied, as functions added should, by default, not be 'enumerable'
{
	enumerable: false,
	value: function(name, x, /*;optional:*/ forceAdd)
	{
		if (this[name] && forceAdd)
			delete this[name];
		if (!this[name]) // if item doesn't exist yet
			Object.defineProperty(this, name,
			{
				enumerable: false,
				value: x
			});
	}
});
Object.AddProtoItem = Object.prototype.AddItem("AddProtoItem", function(name, x, /*;optional:*/ forceAdd) { this.prototype.AddItem(name, x, forceAdd); });
Object.AddFunction = Object.AddProtoItem("AddFunction", function(value, /*;optional:*/ forceAdd) { this.AddItem(value.name, value, forceAdd); });
Object.AddProtoFunction = Object.AddProtoItem("AddProtoFunction", function(value, /*;optional:*/ forceAdd) { this.prototype.AddFunction(value, forceAdd); });

// the below lets you do stuff like this: Array.AddProtoSetterFunction(function AddX(value) { this.push(value); }); [].AddX = "newItem";
Object.AddSetter = Object.AddProtoFunction(function AddSetter(name, x, /*;optional:*/ forceAdd) // 'silent' is implied, as functions added should, by default, not be 'enumerable'
{
	if (this[name] && forceAdd)
		delete this[name];
	if (!this[name]) // if item doesn't exist yet
		Object.defineProperty(this, name,
		{
			enumerable: false,
			set: x
		});
});
Object.AddProtoSetter = Object.AddProtoFunction(function AddProtoSetter(name, x, /*;optional:*/ forceAdd) { this.prototype.AddSetter(name, x, forceAdd); });
Object.AddSetterFunction = Object.AddProtoFunction(function AddSetterFunction(x, /*;optional:*/ forceAdd) { this.AddSetter(x.name, x, forceAdd); });
Object.AddProtoSetterFunction = Object.AddProtoFunction(function AddProtoSetterFunction(x, /*;optional:*/ forceAdd) { this.prototype.AddSetterFunction(x, forceAdd); });

// attachment: extensions
// ==================

// the below lets you do stuff like this: Array.AddProtoFunction_Inline = function AddX(value) { this.push(value); }; [].AddX = "newItem";
Object.AddProtoFunction_Inline = null; delete Object.AddProtoFunction_Inline; Object.AddProtoSetterFunction(function AddProtoFunction_Inline(value) { this.AddProtoFunction(value); });
Object.AddProtoSetterFunction_Inline = null; delete Object.AddProtoSetterFunction_Inline; Object.AddProtoSetterFunction(function AddProtoSetterFunction_Inline(value) { this.AddProtoSetterFunction(value); });

// polyfills, to ensure existing functions are implemented
// ==================

String.AddProtoFunction_Inline = function startsWith(str) {return this.lastIndexOf(str, 0) === 0;};
String.AddProtoFunction_Inline = function endsWith(str) { var pos = this.length - str.length; return this.indexOf(str, pos) === pos; };
String.AddProtoFunction_Inline = function contains(str, startIndex) { return -1 !== String.prototype.indexOf.call(this, str, startIndex); };
String.AddProtoFunction_Inline = function hashCode()
{
	var hash = 0;
	for (var i = 0; i < this.length; i++)
	{
		var char = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};
String.AddProtoFunction_Inline = function matches(regex, index)
{
	index = index || 1; // default to the first capturing group
	var matches = [];
	var match;
	while (match = regex.exec(this))
		matches.push(match[index]);
	return matches;
};

Array.AddProtoFunction_Inline = function contains(str) { return this.indexOf(str) != -1; };
Array.AddProtoFunction_Inline = function last() { return this[this.length - 1]; };

// custom extensions: inline
// ==================

Object.ExtendWith_Inline = null; Object.AddProtoSetterFunction_Inline = function ExtendWith_Inline(value) { this.ExtendWith(value); };

// custom extensions
// ==================

Object.ExtendWith = Object.AddProtoFunction_Inline = function ExtendWith(value) { $.extend(this, value); };

Object.GetItem_SetToXIfNull = Object.AddProtoFunction_Inline = function GetItem_SetToXIfNull(itemName, /*;optional:*/ defaultValue)
{
	if (!this[itemName])
		this[itemName] = defaultValue;
	return this[itemName];
};
Object.CopyXChildrenAsOwn = Object.AddProtoFunction_Inline = function CopyXChildrenAsOwn(x) { $.extend(this, x); };
Object.CopyXChildrenToClone = Object.AddProtoFunction_Inline = function CopyXChildrenToClone(x) { return $.extend($.extend({}, this), x); };
Object.Keys = Object.AddProtoFunction_Inline = function Keys()
{
	var result = [];
	for (var key in this)
		if (this.hasOwnProperty(key))
			result.push(key);
	return result;
};
Object.CopyXChildrenAsOwn = Object.AddProtoFunction_Inline = function Items()
{
	var result = [];
	for (var key in this)
		if (this.hasOwnProperty(key))
			result.push(this[key]);
	return result;
};
Object.ToJson = Object.AddProtoFunction_Inline = function ToJson() { return JSON.stringify(this); };

Array.pushAll = Array.AddProtoFunction_Inline = function pushAll(array)
{
	for (var i in array.indexes())
		this.push(array[i]);
};
Array.indexes = Array.AddProtoFunction_Inline = function indexes()
{
	var result = {};
	for (var i = 0; i < this.length; i++)
		result[i] = this[i];
	return result;
};
Array.strings = Array.AddProtoFunction_Inline = function strings()
{
	var result = {};
	for (var key in this)
	{
		if (this.hasOwnProperty(key))
			result[this[key]] = null;
	}
	return result;
};
Array.remove = Array.AddProtoFunction_Inline = function remove(obj)
{
	for (var i = this.length;; i--)
		if(this[i] === obj)
			return this.splice(i, 1);
};
Array.filter = Array.AddProtoFunction_Inline = function filter(matchFunc)
{
	var result = [];
	for (var i in this.indexes())
		if (matchFunc.call(this[i], this[i])) // call, having the item be "this", as well as the first argument
			result.push(this[i]);
	return result;
};
Array.clear = Array.AddProtoFunction_Inline = function clear()
{
	while (this.length > 0)
		this.pop();
};
Array.first = Array.AddProtoFunction_Inline = function first(matchFunc) { return this.filter(matchFunc)[0]; };

String.IndexOf_Xth = String.AddProtoFunction_Inline = function IndexOf_Xth(str, x)
{
	var currentPos = -1;
	for (var i = 0; i < x; i++)
	{
		var subIndex = this.indexOf(str, currentPos + 1);
		if (subIndex == -1)
			return -1; // no such xth index
		currentPos = subIndex;
	}
	return currentPos;
};
String.indexOfAny = String.AddProtoFunction_Inline = function indexOfAny()
{
	if (arguments[0] instanceof Array)
		arguments = arguments[0];

	var lowestIndex = -1;
	for (var i = 0; i < arguments.length; i++)
	{
		var indexOfChar = this.indexOf(arguments[i]);
		if (indexOfChar != -1 && (indexOfChar < lowestIndex || lowestIndex == -1))
			lowestIndex = indexOfChar;
	}
	return lowestIndex;
};
String.containsAny = String.AddProtoFunction_Inline = function containsAny()
{
	for (var i = 0; i < arguments.length; i++)
		if (this.contains(arguments[i]))
			return true;
	return false;
};
String.splitByAny = String.AddProtoFunction_Inline = function splitByAny()
{
	if (arguments[0] instanceof Array)
		arguments = arguments[0];

	var splitStr = "/";
	for (var i = 0; i < arguments.length; i++)
		splitStr += (splitStr.length > 1 ? "|" : "") + arguments[i];
	splitStr += "/";

	return this.split(splitStr);
};
String.splice = String.AddProtoFunction_Inline = function splice(index, removeCount, insert) { return this.slice(0, index) + insert + this.slice(index + Math.abs(removeCount)); };