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
    VDFNode.prototype.AddItem = function (value) {
        this.SetItem(this.items.length, value);
    };
    VDFNode.prototype.InsertItem = function (index, value) {
        var oldItems = this.items;
        for (var i = 0; i < oldItems.length; i++)
            delete this[i];
        for (var i = 0; i < oldItems.length + 1; i++)
            this.AddItem(i == 0 ? value : (i < index ? oldItems[i] : oldItems[i - 1]));
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
                if (this.properties[propName].popOutToOwnLine)
                    builder.Append(propName + "{#}");
                else if (this.properties[propName].items.filter(function (item) {
                    return item.popOutToOwnLine;
                }).length)
                    builder.Append(propName + "{" + this.properties[propName].GetInLineItemText() + "#}");
                else
                    builder.Append(propName + "{" + this.properties[propName].GetInLineItemText() + "}");

        if (this.isListItem && this.isList)
            builder.Append("}");

        return builder.ToString();
    };
    VDFNode.RawDataStringToFinalized = function (rawDataStr) {
        var result = rawDataStr;
        if (rawDataStr.contains(">") || rawDataStr.contains("}") || rawDataStr.contains("@@") || rawDataStr.contains("\n"))
            if (rawDataStr.endsWith("@") || rawDataStr.endsWith("|"))
                result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "|@@";
            else
                result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "@@";
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
            return new List(genericParameters[0]);
        if (typeName.startsWith("Dictionary["))
            return new Dictionary(genericParameters[0], genericParameters[1]);
        return new window[typeName];
    };
    VDFNode.GetCompatibleTypeNameForNode = function (node) {
        return node.propertyCount ? "object" : (node.items.length ? "List[object]" : "string");
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

        var finalMetadata_type = this.metadata_type;
        if (finalMetadata_type == "") {
            if (this.baseValue == "null")
                finalMetadata_type = "null";
            else if (["true", "false"].contains(this.baseValue))
                finalMetadata_type = "bool";
            else if (this.baseValue.contains("."))
                finalMetadata_type = "float";
            else
                finalMetadata_type = "int";
        } else if (finalMetadata_type == null && this.baseValue != null && (declaredTypeName == null || declaredTypeName == "object"))
            finalMetadata_type = "string";

        if (finalMetadata_type == "null")
            return null;

        var finalTypeName = finalMetadata_type != null ? finalMetadata_type : declaredTypeName;
        if (["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal"].contains(finalTypeName))
            finalTypeName = "number";
        else if (finalTypeName == "char")
            finalTypeName = "string";

        if (finalTypeName == null)
            finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
        var finalTypeName_root = finalTypeName.contains("[") ? finalTypeName.substring(0, finalTypeName.indexOf("[")) : finalTypeName;
        if (!VDF.typeImporters_inline[finalTypeName] && !EnumValue.IsEnum(finalTypeName) && !(window[finalTypeName_root] instanceof Function) && !["bool", "number", "string"].contains(finalTypeName_root))
            if (loadOptions.inferCompatibleTypesForUnknownTypes)
                finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this); // infer a compatible, anonymous-like type from the node-data
            else
                throw new Error("Type \"" + finalMetadata_type + "\" not found.");

        var result;
        if (VDF.typeImporters_inline[finalTypeName])
            result = VDF.typeImporters_inline[finalTypeName](this.baseValue);
        else if (EnumValue.IsEnum(finalTypeName))
            result = EnumValue.GetEnumIntForStringValue(finalTypeName, this.baseValue);
        else if (finalTypeName == "bool")
            result = this.baseValue == "true" ? true : false;
        else if (finalTypeName == "number")
            result = parseFloat(this.baseValue);
        else if (finalTypeName == "string")
            result = this.baseValue;
        else {
            result = VDFNode.CreateNewInstanceOfType(finalTypeName, loadOptions);
            this.IntoObject(result, loadOptions);
        }

        return result;
    };
    VDFNode.prototype.IntoObject = function (obj, loadOptions) {
        loadOptions = loadOptions || new VDFLoadOptions();
        var finalTypeName = VDF.GetVTypeNameOfObject(obj);
        if (finalTypeName == null)
            finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
        var typeGenericParameters = VDF.GetGenericParametersOfTypeName(finalTypeName);
        var finalTypeInfo = VDF.GetTypeInfo(finalTypeName);
        for (var i = 0; i < this.items.length; i++)
            obj.push(this.items[i].ToObject(typeGenericParameters[0], loadOptions));
        for (var propName in this.properties)
            try  {
                if (obj instanceof Dictionary)
                    obj.Set(VDF.typeImporters_inline[typeGenericParameters[0]] ? VDF.typeImporters_inline[typeGenericParameters[0]](propName) : propName, this.properties[propName].ToObject(typeGenericParameters[1], loadOptions));
                else
                    obj[propName] = this.properties[propName].ToObject(finalTypeInfo && finalTypeInfo.propInfoByName[propName] ? finalTypeInfo.propInfoByName[propName].propVTypeName : null, loadOptions);
            } catch (ex) {
                throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error loading key-value-pair or property '" + propName + "'.") + "\n");
            }

        if (obj && obj.VDFPostDeserialize)
            obj.VDFPostDeserialize(loadOptions.message);
    };
    return VDFNode;
})();
VDFUtils.MakePropertiesNonEnumerable(VDFNode.prototype, true);
//# sourceMappingURL=VDFNode.js.map
