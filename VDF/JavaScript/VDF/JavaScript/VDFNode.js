var VDFNode = (function () {
    function VDFNode(baseValue, metadata_type) {
        this.items = new List("VDFNode");
        this.properties = new Dictionary("string", "VDFNode");
        this.baseValue = baseValue;
        this.metadata_type = metadata_type;
    }
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
        this.properties.Set(key, value);
        this[key] = value;
    };

    VDFNode.RawDataStringToFinalized = function (rawDataStr, disallowRawPipe) {
        var result = rawDataStr;
        if (rawDataStr.indexOf(":") != -1 || rawDataStr.indexOf(">") != -1 || rawDataStr.indexOf("}") != -1 || (disallowRawPipe && rawDataStr.indexOf("|") != -1) || rawDataStr.indexOf("@@") != -1 || rawDataStr.indexOf(";;") != -1 || rawDataStr.indexOf("\n") != -1 || rawDataStr.indexOf("\t") != -1)
            if (rawDataStr.lastIndexOf("@") == rawDataStr.length - 1 || rawDataStr.lastIndexOf("|") == rawDataStr.length - 1)
                result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "|@@";
            else
                result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "@@";
        return result;
    };
    VDFNode.AddIndentToChildText = function (childText) {
        var builder = new StringBuilder();
        builder.Append("\t");
        var inLiteralMarkers = false;
        for (var i = 0; i < childText.length; i++) {
            var lastChar = i - 1 >= 0 ? childText[i - 1] : null;
            var ch = childText[i];
            var nextChar = i + 1 < childText.length ? childText[i + 1] : null;
            var nextNextChar = i + 2 < childText.length ? childText[i + 2] : null;
            var nextNextNextChar = i + 3 < childText.length ? childText[i + 3] : null;

            if (!inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@')
                inLiteralMarkers = true;
            else if (inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@' && ((nextNextChar == '|' && nextNextNextChar != '|') || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null))
                inLiteralMarkers = false;

            if (lastChar == '\n' && !inLiteralMarkers)
                builder.Append("\t");

            builder.Append(ch);
        }
        return builder.ToString();
    };
    VDFNode.prototype.ToVDF = function (disallowRawPipe) {
        var builder = new StringBuilder();
        if (this.metadata_type != null)
            builder.Append(this.isList || this.isDictionary ? this.metadata_type.replace(/ /g, "") + ">>" : this.metadata_type.replace(/ /g, "") + ">");

        if (this.baseValue != null)
            builder.Append(VDFNode.RawDataStringToFinalized(this.baseValue, disallowRawPipe));
        else if (this.items.length > 0) {
            var hasItemWeMustBracket = this.items.filter(function (a) {
                return a.isList || a.popOutChildren;
            }).length;
            for (var i = 0; i < this.items.length; i++) {
                var lastItem = i > 0 ? this.items[i - 1] : null;
                var item = this.items[i];

                if (lastItem != null && lastItem.guardingItsLastLine) {
                    builder.Append("\n");
                    lastItem.guardingItsLastLine = false;
                }

                if (this.popOutChildren)
                    builder.Append("\n" + VDFNode.AddIndentToChildText(item.ToVDF()));
                else if (hasItemWeMustBracket) {
                    var itemVDF = item.ToVDF();
                    var beforeEndBracketExtraText = "";
                    if (item.guardingItsLastLine) {
                        beforeEndBracketExtraText = "\n";
                        item.guardingItsLastLine = false;
                    }
                    builder.Append((i > 0 ? "|" : "") + "{" + itemVDF + beforeEndBracketExtraText + "}");
                } else
                    builder.Append((i > 0 ? "|" : "") + item.ToVDF(item.baseValue != null && item.baseValue.indexOf("@@") != 0 && item.baseValue.indexOf("|") != -1));
            }
        } else {
            var lastPropName = null;
            for (var propName in this.properties.Keys) {
                var lastPropValue = lastPropName != null ? this.properties.Get(lastPropName) : null;
                var propValue = this.properties.Get(propName);

                if (lastPropValue != null && lastPropValue.guardingItsLastLine)
                    if (this.popOutChildren)
                        lastPropValue.guardingItsLastLine = false;
                    else {
                        builder.Append("\n");
                        lastPropValue.guardingItsLastLine = false;
                        if (lastPropValue.popOutChildren)
                            builder.Append("^");
                    }

                var propNameAndValueVDF;
                if (propValue.popOutChildren)
                    propNameAndValueVDF = propName + ":" + propValue.ToVDF();
                else {
                    var propValueVDF = propValue.ToVDF();
                    if (propValue.guardingItsLastLine) {
                        propValueVDF += "\n";
                        propValue.guardingItsLastLine = false;
                    }
                    propNameAndValueVDF = propName + "{" + propValueVDF + "}";
                }
                if (this.popOutChildren)
                    builder.Append("\n" + VDFNode.AddIndentToChildText(propNameAndValueVDF));
                else
                    builder.Append(propNameAndValueVDF);

                lastPropName = propName;
            }
        }

        this.guardingItsLastLine = (this.popOutChildren && (this.items.length > 0 || this.properties.Count > 0));
        if (this.items.filter(function (a) {
            return a.guardingItsLastLine;
        }).length > 0) {
            this.guardingItsLastLine = true;
            for (var i = 0; i < this.items.length; i++)
                if (this.items[i].guardingItsLastLine) {
                    this.items[i].guardingItsLastLine = false; // we've taken it as our own
                    break;
                }
        } else
            for (var key in this.properties.Keys)
                if (this.properties.Get(key).guardingItsLastLine) {
                    this.guardingItsLastLine = true;
                    this.properties.Get(key).guardingItsLastLine = false; // we've taken it as our own
                    break;
                }

        return builder.ToString();
    };

    // loading
    // ==================
    VDFNode.CreateNewInstanceOfType = function (typeName, loadOptions) {
        // no need to "instantiate" primitives, strings, and enums (we create them straight-forwardly later on)
        if (["bool", "char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "string"].indexOf(typeName) != -1 || EnumValue.IsEnum(typeName))
            return null;
        var genericParameters = VDF.GetGenericParametersOfTypeName(typeName);
        if (typeName.indexOf("List[") == 0)
            return new List(genericParameters[0]);
        if (typeName.indexOf("Dictionary[") == 0)
            return new Dictionary(genericParameters[0], genericParameters[1]);
        return new window[typeName];
    };
    VDFNode.GetCompatibleTypeNameForNode = function (node) {
        return node.properties.Count ? "object" : (node.items.length ? "List[object]" : "string");
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
                return null;
            if (this.baseValue == "empty")
                return "";
            if (["true", "false"].indexOf(this.baseValue) != -1)
                finalMetadata_type = "bool";
            else if (this.baseValue.indexOf(".") != -1)
                finalMetadata_type = "float";
            else
                finalMetadata_type = "int";
        } else if (finalMetadata_type == "IList")
            finalMetadata_type = "List[object]";
        else if (finalMetadata_type == "IDictionary")
            finalMetadata_type = "Dictionary[object,object]";

        var finalTypeName = declaredTypeName;
        if (finalMetadata_type != null && finalMetadata_type.length > 0) {
            // porting-note: this is only a limited implementation of CS functionality of making sure metadata-type (finalMetadata_type) is more specific than declared-type (finalTypeName)
            if (finalTypeName == null || ["object", "IList", "IDictionary"].indexOf(finalTypeName) != -1)
                finalTypeName = finalMetadata_type;
        }

        // porting-added; special type-mapping from C# types to JS types
        if (["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal"].indexOf(finalTypeName) != -1)
            finalTypeName = "number";
        else if (finalTypeName == "char")
            finalTypeName = "string";

        var finalTypeName_root = finalTypeName != null && (finalTypeName.indexOf("[") != -1 ? finalTypeName.substring(0, finalTypeName.indexOf("[")) : finalTypeName);
        if (finalTypeName_root) {
            if (!VDF.typeImporters_inline[finalTypeName] && !EnumValue.IsEnum(finalTypeName) && !(window[finalTypeName_root] instanceof Function) && ["bool", "number", "string"].indexOf(finalTypeName_root) == -1)
                if (loadOptions.inferCompatibleTypesForUnknownTypes)
                    finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this); // infer a compatible, anonymous-like type from the node-data
                else
                    throw new Error("Type \"" + finalMetadata_type + "\" not found.");
        } else if (loadOptions.inferCompatibleTypesForUnknownTypes)
            finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
        else
            finalTypeName = "string"; // string is the default/fallback type

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
        else if (this.baseValue != null)
            result = this.baseValue;
        else {
            result = VDFNode.CreateNewInstanceOfType(finalTypeName, loadOptions);
            this.IntoObject(result, loadOptions, (declaredTypeName != null && (declaredTypeName.indexOf("List[") == 0 || declaredTypeName.indexOf("Dictionary[") == 0)) || (this.metadata_type != "IList" && this.metadata_type != "IDictionary"));
        }

        return result;
    };
    VDFNode.prototype.IntoObject = function (obj, loadOptions, typeGenericArgumentsAreReal) {
        if (typeof typeGenericArgumentsAreReal === "undefined") { typeGenericArgumentsAreReal = true; }
        loadOptions = loadOptions || new VDFLoadOptions();

        if (obj && obj.VDFPreDeserialize)
            obj.VDFPreDeserialize(loadOptions.message);

        var finalTypeName = VDF.GetVTypeNameOfObject(obj);
        if (finalTypeName == null)
            finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
        var typeGenericParameters = VDF.GetGenericParametersOfTypeName(finalTypeName);
        var finalTypeInfo = VDFTypeInfo.Get(finalTypeName);
        if (obj.push)
            for (var i = 0; i < this.items.length; i++)
                obj.push(this.items[i].ToObject(typeGenericArgumentsAreReal ? typeGenericParameters[0] : null, loadOptions));
        for (var propName in this.properties.Keys)
            try  {
                if (obj instanceof Dictionary) {
                    var key = propName;
                    if (typeGenericArgumentsAreReal)
                        if (VDF.typeImporters_inline[typeGenericParameters[0]])
                            key = VDF.typeImporters_inline[typeGenericParameters[0]](propName);
                    obj.Set(key, this.properties.Get(propName).ToObject(typeGenericArgumentsAreReal ? typeGenericParameters[1] : null, loadOptions));
                } else
                    obj[propName] = this.properties.Get(propName).ToObject(typeGenericArgumentsAreReal ? finalTypeInfo && finalTypeInfo.propInfoByName[propName] && finalTypeInfo.propInfoByName[propName].propVTypeName : null, loadOptions);
            } catch (ex) {
                throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error loading key-value-pair or property '" + propName + "'.") + "\n");
            }

        if (obj && obj.VDFPostDeserialize)
            obj.VDFPostDeserialize(loadOptions.message);
    };
    return VDFNode;
})();
VDFUtils.MakePropertiesHidden(VDFNode.prototype, true);
//# sourceMappingURL=VDFNode.js.map
