// Object: base
// ==================

interface Object
{
	_AddItem(name: string, value, forceAdd?: boolean): void;
	_AddFunction(func: Function, forceAdd?: boolean): void;

	_AddGetterSetter(getter: Function, setter: Function, forceAdd?: boolean): void;
	
	_AddFunction_Inline: Function; // prop with a setter
	_AddGetter_Inline: Function; // prop with a setter
	_AddSetter_Inline: Function; // prop with a setter
}

// the below lets you do stuff like this: Array.prototype._AddFunction(function AddX(value) { this.push(value); }); [].AddX("newItem");
Object.defineProperty(Object.prototype, "_AddItem", // note; these functions should by default add non-enumerable properties/items
{
	enumerable: false,
	value: function(name, value, forceAdd = true)
	{
		if (this[name] && forceAdd)
			delete this[name];
		if (!this[name]) // if item doesn't exist yet
			Object.defineProperty(this, name,
			{
				enumerable: false,
				value: value
			});
	}
});
Object.prototype._AddItem("_AddFunction", function(func, forceAdd = true) { this._AddItem(func.name || func.toString().match(/^function\s*([^\s(]+)/)[1], func, forceAdd); });

// the below lets you do stuff like this: Array.prototype._AddGetterSetter("AddX", null, function(value) { this.push(value); }); [].AddX = "newItem";
Object.prototype._AddFunction(function _AddGetterSetter(getter, setter, forceAdd = true)
{
	var name = (getter || setter).name || (getter || setter).toString().match(/^function\s*([^\s(]+)/)[1];
	if (this[name] && forceAdd)
		delete this[name];
	if (!this[name]) // if item doesn't exist yet
		if (getter && setter)
			Object.defineProperty(this, name, { enumerable: false, get: getter, set: setter });
		else if (getter)
			Object.defineProperty(this, name, { enumerable: false, get: getter });
		else
			Object.defineProperty(this, name, { enumerable: false, set: setter });
});

// the below lets you do stuff like this: Array.prototype._AddFunction_Inline = function AddX(value) { this.push(value); }; [].AddX = "newItem";
Object.prototype._AddGetterSetter(null, function _AddFunction_Inline(func) { this._AddFunction(func, true); });
Object.prototype._AddGetterSetter(null, function _AddGetter_Inline(func) { this._AddGetterSetter(func, null); });
Object.prototype._AddGetterSetter(null, function _AddSetter_Inline(func) { this._AddGetterSetter(null, func); });