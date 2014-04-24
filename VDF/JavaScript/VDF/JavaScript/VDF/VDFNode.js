var VDFNode = (function () {
    function VDFNode(baseValue, metadata_type) {
        VDFUtils.SetUpStashFields(this, "metadata_type", "baseValue", "isList", "isDictionary", "popOutToOwnLine", "isFirstItemOfNonFirstPopOutGroup", "isListItem", "isListItem_nonFirst");
        this.baseValue = baseValue;
        this.metadata_type = metadata_type;
    }
    Object.defineProperty(VDFNode.prototype, "items", {
        get: function () {
            var result = [];
            for (var key in this)
                if (!(this[key] instanceof Function) && parseInt(key) == key)
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
                if (!(this[key] instanceof Function) && parseInt(key) != key)
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
            builder.Append(VDFNode.RawDataStringToFinalized(this.baseValue));
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
    VDFNode.RawDataStringToFinalized = function (rawDataStr) {
        var result = rawDataStr;
        if (rawDataStr.contains(">") || rawDataStr.contains("}"))
            if (rawDataStr.endsWith("@") || rawDataStr.endsWith("|"))
                result = "@@" + rawDataStr.replace(/@@(?=\n|}|$)/g, "@@@") + "|@@";
            else
                result = "@@" + rawDataStr.replace(/@@(?=\n|}|$)/g, "@@@") + "@@";
        return result;
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
        loadOptions = loadOptions || new VDFLoadOptions();
        if (this.metadata_type == "null")
            return null;

        var finalTypeName = this.metadata_type != null ? this.metadata_type : declaredTypeName;
        if (finalTypeName == null)
            finalTypeName = this.propertyCount ? "object" : (this.items.length ? "List[object]" : "string");

        var result;
        if (VDF.typeImporters_inline[finalTypeName])
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
            this.IntoObject(result, loadOptions);
        }

        if (result && result.VDFPostDeserialize)
            result.VDFPostDeserialize();

        return result;
    };
    VDFNode.prototype.IntoObject = function (obj, loadOptions) {
        loadOptions = loadOptions || new VDFLoadOptions();
        var finalTypeName = VDF.GetVTypeNameOfObject(obj);
        if (finalTypeName == null)
            finalTypeName = this.propertyCount ? "object" : (this.items.length ? "List[object]" : "string");
        var typeGenericParameters = VDF.GetGenericParametersOfTypeName(finalTypeName);
        var finalTypeInfo = VDF.GetTypeInfo(finalTypeName);
        for (var i = 0; i < this.items.length; i++)
            obj.push(this.items[i].ToObject(typeGenericParameters[0], loadOptions));
        for (var propName in this.properties)
            if (obj instanceof Dictionary)
                obj.Set(VDF.typeImporters_inline[typeGenericParameters[0]] ? VDF.typeImporters_inline[typeGenericParameters[0]](propName) : propName, this.properties[propName].ToObject(typeGenericParameters[1], loadOptions));
            else
                obj[propName] = this.properties[propName].ToObject(finalTypeInfo && finalTypeInfo.propInfoByName[propName] ? finalTypeInfo.propInfoByName[propName].propVTypeName : null, loadOptions);
    };
    return VDFNode;
})();
VDFUtils.MakePropertiesNonEnumerable(VDFNode.prototype, true);
//# sourceMappingURL=VDFNode.js.map
