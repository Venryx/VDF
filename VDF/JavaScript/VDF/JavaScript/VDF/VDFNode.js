var VDFNode = (function () {
    function VDFNode(baseValue, metadata_type) {
        this.baseValue = baseValue;
        this.metadata_type = metadata_type;
    }
    Object.defineProperty(VDFNode.prototype, "items", {
        get: function () {
            var result = [];
            for (var key in this)
                if (!VDFNode.builtInProps.contains(key) && !(this[key] instanceof Function) && parseInt(key) == key)
                    result.push(this[key]);
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VDFNode.prototype, "properties", {
        get: function () {
            var objWithPropKeys = {};
            for (var key in this)
                if (!VDFNode.builtInProps.contains(key) && !(this[key] instanceof Function) && parseInt(key) != key)
                    objWithPropKeys[key] = this[key];
            return objWithPropKeys;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VDFNode.prototype, "propertyCount", {
        get: function () {
            var result = 0;
            for (var key in this.properties)
                result++;
            return result;
        },
        enumerable: true,
        configurable: true
    });

    VDFNode.prototype.SetItem = function (index, value) {
        this.items[index] = value;
        this[index] = value;
    };
    VDFNode.prototype.PushItem = function (value) {
        this.SetItem(this.items.length, value);
    };
    VDFNode.prototype.InsertItem = function (index, value) {
        var oldItems = this.items;
        for (var i = 0; i < oldItems.length; i++)
            delete this[i];
        for (var i = 0; i < oldItems.length + 1; i++)
            this.PushItem(i == 0 ? value : (i < index ? oldItems[i] : oldItems[i - 1]));
    };
    VDFNode.prototype.SetProperty = function (key, value) {
        this.properties[key] = value;
        this[key] = value;
    };

    VDFNode.prototype.GetDictionaryValueNode = function (key) {
        return this.items.filter(function (item, index, array) {
            return item.items[0].ToVDF() == VDFSaver.ToVDFNode(key).ToVDF();
        })[0].items[1];
    };
    VDFNode.prototype.SetDictionaryValueNode = function (key, valueNode) {
        var keyNode = VDFSaver.ToVDFNode(key);
        if (this.items.contains(keyNode))
            this.items.filter(function (item, index, array) {
                return item.items[0].ToVDF() == VDFSaver.ToVDFNode(key).ToVDF();
            })[0].SetItem(1, valueNode);
        else {
            var newNode = new VDFNode();
            newNode.isKeyValuePairPseudoNode = true;
            newNode.PushItem(keyNode);
            newNode.PushItem(valueNode);
            this.PushItem(newNode);
        }
    };

    Object.defineProperty(VDFNode.prototype, "AsBool", {
        // in TypeScript/JavaScript we don't have implicit casts, so we have to use these (either that or convert the VDFNode to an anonymous object)
        get: function () {
            return VDFNode.ConvertVDFNodeToCorrectType(new VDFNode(this.baseValue), "bool", null);
        },
        set: function (value) {
            this.baseValue = value.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VDFNode.prototype, "AsFloat", {
        get: function () {
            return VDFNode.ConvertVDFNodeToCorrectType(new VDFNode(this.baseValue), "float", null);
        },
        set: function (value) {
            this.baseValue = value.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VDFNode.prototype, "AsString", {
        get: function () {
            return this.baseValue;
        },
        set: function (value) {
            this.baseValue = value;
        },
        enumerable: true,
        configurable: true
    });
    VDFNode.prototype.toString = function () {
        return this.AsString;
    };

    VDFNode.prototype.GetInLineItemText = function () {
        var builder = new StringBuilder();
        if (this.isFirstItemOfNonFirstPopOutGroup)
            builder.Append("#");
        if (this.isListItem_nonFirst && !this.popOutToOwnLine)
            builder.Append("|");
        if ((this.isKeyValuePairPseudoNode && !this.popOutToOwnLine) || this.isListItem_list)
            builder.Append("{");
        if (this.metadata_type != null)
            builder.Append("<" + (this.isListOrDictionary ? "<" + this.metadata_type.replace(/ /g, "") + ">" : this.metadata_type.replace(/ /g, "")) + ">");

        if (this.baseValue != null)
            builder.Append(this.baseValue);
        else if (this.items.length > 0) {
            for (var key in this.items)
                if (!this.items[key].popOutToOwnLine)
                    builder.Append(this.items[key].GetInLineItemText());
        } else
            for (var propName in this.properties)
                if (!this.properties[propName].popOutToOwnLine)
                    builder.Append(propName + "{" + this.properties[propName].GetInLineItemText() + "}");

        if ((this.isKeyValuePairPseudoNode && !this.popOutToOwnLine) || this.isListItem_list)
            builder.Append("}");

        return builder.ToString();
    };
    VDFNode.prototype.GetPoppedOutItemText = function () {
        var lines = new Array();
        if (this.popOutToOwnLine)
            lines.push(this.GetInLineItemText());
        for (var key in this.items) {
            var item = this.items[key];
            var poppedOutText = item.GetPoppedOutItemText();
            if (poppedOutText.length > 0) {
                var poppedOutLines = poppedOutText.split('\n');
                for (var index in poppedOutLines)
                    if (poppedOutLines[index].length)
                        lines.push(poppedOutLines[index]);
            }
        }
        for (var propName in this.properties) {
            var propValueNode = this.properties[propName];
            var poppedOutText = propValueNode.GetPoppedOutItemText();
             {
                var poppedOutLines = poppedOutText.split('\n');
                for (var index in poppedOutLines)
                    if (poppedOutLines[index].length)
                        lines.push(poppedOutLines[index]);
            }
        }
        var builder = new StringBuilder();
        for (var i2 = 0; i2 < lines.length; i2++)
            builder.Append(i2 == 0 ? "" : "\n").Append(this.popOutToOwnLine ? "\t" : "").Append(lines[i2]); // line-breaks + indents + data
        return builder.ToString();
    };
    VDFNode.prototype.ToVDF = function () {
        var poppedOutItemText = this.GetPoppedOutItemText();
        return this.GetInLineItemText() + (poppedOutItemText.length > 0 ? "\n" + poppedOutItemText : "");
    };

    // loading
    // ==================
    VDFNode.GetGenericParametersOfTypeName = function (typeName) {
        var genericArgumentTypes = new Array();
        var depth = 0;
        var lastStartBracketPos = -1;
        for (var i = 0; i < typeName.length; i++) {
            var ch = typeName[i];
            if (ch == ']')
                depth--;
            if ((depth == 0 && ch == ']') || (depth == 1 && ch == ','))
                genericArgumentTypes.push(typeName.substring(lastStartBracketPos + 1, i)); // get generic-parameter type-str
            if ((depth == 0 && ch == '[') || (depth == 1 && ch == ','))
                lastStartBracketPos = i;
            if (ch == '[')
                depth++;
        }
        return genericArgumentTypes;
    };
    VDFNode.CreateNewInstanceOfType = function (typeName, loadOptions) {
        // no need to "instantiate" primitives, strings, and enums (we create them straight-forwardly later on)
        if (["bool", "char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "string"].contains(typeName) || EnumValue.IsEnum(typeName))
            return null;
        var genericParameters = VDFNode.GetGenericParametersOfTypeName(typeName);
        if (typeName.startsWith("List["))
            return eval("new List(\"" + genericParameters[0] + "\")");
        if (typeName.startsWith("Dictionary["))
            return eval("new Dictionary(\"" + genericParameters[0] + "\",\"" + genericParameters[1] + "\")");
        if (window[typeName] instanceof Function)
            return new window[typeName];
        else if (loadOptions.loadUnknownTypesAsAnonymous)
            return {};
        throw new Error("Class \"" + typeName + "\" not found.");
    };
    VDFNode.ConvertVDFNodeToCorrectType = function (vdfNode, declaredTypeName, loadOptions) {
        var finalTypeName = vdfNode.metadata_type || declaredTypeName;
        var result;
        if (vdfNode.baseValue == null)
            result = vdfNode.ToObject(finalTypeName, loadOptions); // tell node to return itself as the correct type
        else {
            if (vdfNode.baseValue == "[#null]")
                result = null;
            else if (VDF.typeImporters_inline[finalTypeName])
                result = VDF.typeImporters_inline[finalTypeName](vdfNode.baseValue); //(string)vdfNode);
            else if (EnumValue.IsEnum(finalTypeName))
                result = EnumValue.GetEnumIntForStringValue(finalTypeName, vdfNode.baseValue);
            else if (finalTypeName == "bool")
                result = vdfNode.baseValue == "true" ? true : false;
            else if (["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal"].contains(finalTypeName))
                result = parseFloat(vdfNode.baseValue);
            else
                result = vdfNode.baseValue;
        }
        return result;
    };

    VDFNode.prototype.ToObject = function (declaredTypeName, loadOptions) {
        if (!loadOptions)
            loadOptions = new VDFLoadOptions();

        var type = this.metadata_type || declaredTypeName;

        //if (this.items && this.items.length > 1) // we can infer we're a list; todo; look more carefully into how to implement type inference
        //	type = "List[object]";
        var typeGenericParameters = VDFNode.GetGenericParametersOfTypeName(type);
        var typeInfo = (window[type] || {}).typeInfo;

        var result = VDFNode.CreateNewInstanceOfType(type, loadOptions);
        for (var i = 0; i < this.items.length; i++)
            if (type.startsWith("List["))
                result[i] = VDFNode.ConvertVDFNodeToCorrectType(this.items[i], typeGenericParameters[0], loadOptions);
            else if (type.startsWith("Dictionary["))
                result.set(VDFNode.ConvertVDFNodeToCorrectType(this.items[i].items[0], typeGenericParameters[0], loadOptions), VDFNode.ConvertVDFNodeToCorrectType(this.items[i].items[1], typeGenericParameters[1], loadOptions));
            else
                result = VDFNode.ConvertVDFNodeToCorrectType(this.items[i], type, loadOptions);
        for (var propName in this.properties)
            result[propName] = VDFNode.ConvertVDFNodeToCorrectType(this.properties[propName], typeInfo && typeInfo.propInfoByPropName[propName] ? typeInfo.propInfoByPropName[propName].propVTypeName : "object", loadOptions);

        return result;
    };
    VDFNode.builtInProps = [
        "metadata_type", "baseValue", "items", "properties", "propertyCount", "GetDictionaryValueNode", "SetDictionaryValueNode", "AsBool", "AsFloat", "AsString",
        "isNamedPropertyValue", "isListOrDictionary", "popOutToOwnLine", "isFirstItemOfNonFirstPopOutGroup", "isListItem_list", "isListItem_nonFirst", "isKeyValuePairPseudoNode"];
    return VDFNode;
})();
//# sourceMappingURL=VDFNode.js.map
