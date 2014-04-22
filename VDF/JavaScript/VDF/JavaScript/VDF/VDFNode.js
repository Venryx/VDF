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

    Object.defineProperty(VDFNode.prototype, "AsBool", {
        // in TypeScript/JavaScript we don't have implicit casts, so we have to use these (either that or convert the VDFNode to an anonymous object)
        get: function () {
            return new VDFNode(this.baseValue).ToObject("bool");
        },
        set: function (value) {
            this.baseValue = value.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VDFNode.prototype, "AsInt", {
        get: function () {
            return new VDFNode(this.baseValue).ToObject("int");
        },
        set: function (value) {
            this.baseValue = parseInt(value.toString()).toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VDFNode.prototype, "AsFloat", {
        get: function () {
            return new VDFNode(this.baseValue).ToObject("float");
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
        if (this.isListItem && this.isList)
            builder.Append("{");
        if (this.metadata_type != null)
            builder.Append(this.isList || this.isDictionary ? this.metadata_type.replace(/ /g, "") + ">>" : this.metadata_type.replace(/ /g, "") + ">");

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

        if (this.isListItem && this.isList)
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
    VDFNode.CreateNewInstanceOfType = function (typeName, loadOptions) {
        // no need to "instantiate" primitives, strings, and enums (we create them straight-forwardly later on)
        if (["bool", "char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "string"].contains(typeName) || EnumValue.IsEnum(typeName))
            return null;
        var genericParameters = VDF.GetGenericParametersOfTypeName(typeName);
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

    VDFNode.prototype.ToObject = function (declaredTypeName_orLoadOptions, loadOptions_orDeclaredTypeName) {
        var declaredTypeName;
        var loadOptions;
        if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions) {
            declaredTypeName = declaredTypeName_orLoadOptions;
            loadOptions = loadOptions_orDeclaredTypeName;
        } else {
            declaredTypeName = loadOptions_orDeclaredTypeName;
            loadOptions = declaredTypeName_orLoadOptions;
        }
        if (loadOptions == null)
            loadOptions = new VDFLoadOptions();

        var finalTypeName = this.metadata_type != null ? this.metadata_type : declaredTypeName;
        var finalTypeGenericParameters = VDF.GetGenericParametersOfTypeName(finalTypeName);
        var finalTypeInfo = VDF.GetTypeInfo(finalTypeName);

        var result;
        if (this.baseValue == "[#null]")
            result = null;
        else if (VDF.typeImporters_inline[finalTypeName])
            result = VDF.typeImporters_inline[finalTypeName](this.baseValue);
        else if (EnumValue.IsEnum(finalTypeName))
            result = EnumValue.GetEnumIntForStringValue(finalTypeName, this.baseValue);
        else if (finalTypeName == "bool")
            result = this.baseValue == "true" ? true : false;
        else if (["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal"].contains(finalTypeName))
            result = parseFloat(this.baseValue);
        else if (["string", "char"].contains(finalTypeName))
            result = this.baseValue;
        else {
            result = VDFNode.CreateNewInstanceOfType(finalTypeName, loadOptions);
            for (var i = 0; i < this.items.length; i++)
                if (result instanceof List)
                    result.push(this.items[i].ToObject(finalTypeGenericParameters[0], loadOptions));
            for (var propName in this.properties)
                if (result instanceof Dictionary)
                    result.set(VDF.typeImporters_inline[finalTypeGenericParameters[0]] ? VDF.typeImporters_inline[finalTypeGenericParameters[0]](propName) : propName, this.properties[propName].ToObject(finalTypeGenericParameters[1], loadOptions));
                else
                    result[propName] = this.properties[propName].ToObject(finalTypeInfo && finalTypeInfo.propInfoByName[propName] ? finalTypeInfo.propInfoByName[propName].propVTypeName : "object", loadOptions);
        }

        if (result.VDFPostDeserialize)
            result.VDFPostDeserialize();

        return result;
    };
    VDFNode.builtInProps = [
        "metadata_type", "baseValue", "items", "properties", "propertyCount", "GetDictionaryValueNode", "SetDictionaryValueNode", "AsBool", "AsInt", "AsFloat", "AsString",
        "isNamedPropertyValue", "isList", "isDictionary", "popOutToOwnLine", "isFirstItemOfNonFirstPopOutGroup", "isListItem", "isListItem_nonFirst"];
    return VDFNode;
})();
//# sourceMappingURL=VDFNode.js.map
