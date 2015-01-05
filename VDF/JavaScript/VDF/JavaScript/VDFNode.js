var VDFNode = (function () {
    function VDFNode(primitiveValue, metadata) {
        this.listChildren = new List("VDFNode");
        this.mapChildren = new Dictionary("string", "VDFNode");
        this.primitiveValue = primitiveValue;
        this.metadata = metadata;
    }
    VDFNode.prototype.SetListChild = function (index, value) {
        this.listChildren[index] = value;
        this[index] = value;
    };

    /*InsertListChild(index: number, value: any)
    {
    var oldItems = this.listChildren;
    for (var i = 0; i < oldItems.length; i++) // we need to first remove old values, so the slate is clean for manual re-adding/re-ordering
    delete this[i];
    for (var i = 0; i < oldItems.length + 1; i++) // now add them all back in, in the correct order
    this.AddListChild(i == 0 ? value : (i < index ? oldItems[i] : oldItems[i - 1]));
    }*/
    VDFNode.prototype.AddListChild = function (value) {
        this.SetListChild(this.listChildren.length, value);
    };
    VDFNode.prototype.SetMapChild = function (key, value) {
        this.mapChildren.Set(key, value);
        this[key] = value;
    };

    VDFNode.prototype.toString = function () {
        return this.primitiveValue.toString();
    };

    // saving
    // ==================
    VDFNode.PadString = function (unpaddedString) {
        var result = unpaddedString;
        if (result.StartsWith("<") || result.StartsWith("#"))
            result = "#" + result;
        if (result.EndsWith(">") || result.EndsWith("#"))
            result += "#";
        return result;
    };

    VDFNode.prototype.ToVDF = function (options, tabDepth) {
        if (typeof options === "undefined") { options = null; }
        if (typeof tabDepth === "undefined") { tabDepth = 0; }
        return this.ToVDF_InlinePart(options, tabDepth) + this.ToVDF_PoppedOutPart(options, tabDepth);
    };
    VDFNode.prototype.ToVDF_InlinePart = function (options, tabDepth) {
        if (typeof options === "undefined") { options = null; }
        if (typeof tabDepth === "undefined") { tabDepth = 0; }
        options = options || new VDFSaveOptions();

        var builder = new StringBuilder();

        if (options.useMetadata && this.metadata != null)
            builder.Append(this.metadata + ">");

        if (this.primitiveValue == null) {
            if (!this.isMap && this.mapChildren.Count == 0 && !this.isList && this.listChildren.Count == 0)
                builder.Append("null");
        } else if (typeof this.primitiveValue == "boolean")
            builder.Append(this.primitiveValue.toString().toLowerCase());
        else if (typeof this.primitiveValue == "string") {
            var unpaddedString = this.primitiveValue;
            if (unpaddedString.Contains("\"") || unpaddedString.Contains("\n") || unpaddedString.Contains("<<") || unpaddedString.Contains(">>")) {
                var literalStartMarkerString = "<<";
                var literalEndMarkerString = ">>";
                while (unpaddedString.Contains(literalStartMarkerString) || unpaddedString.Contains(literalEndMarkerString)) {
                    literalStartMarkerString += "<";
                    literalEndMarkerString += ">";
                }
                builder.Append("\"" + literalStartMarkerString + VDFNode.PadString(unpaddedString) + literalEndMarkerString + "\"");
            } else
                builder.Append("\"" + unpaddedString + "\"");
        } else if (VDF.GetIsTypePrimitive(VDF.GetTypeNameOfObject(this.primitiveValue)))
            builder.Append(options.useNumberTrimming && this.primitiveValue.toString().StartsWith("0.") ? this.primitiveValue.toString().substr(1) : this.primitiveValue);
        else
            builder.Append("\"" + this.primitiveValue + "\"");

        if (options.useChildPopOut && this.popOutChildren) {
            if (this.isMap || this.mapChildren.Count > 0)
                builder.Append(this.mapChildren.Count > 0 ? "{^}" : "{}");
            if (this.isList || this.listChildren.Count > 0)
                builder.Append(this.listChildren.Count > 0 ? "[^]" : "[]");
        } else {
            if (this.isMap || this.mapChildren.Count > 0) {
                builder.Append("{");
                for (var key in this.mapChildren.Keys)
                    builder.Append((key == Object.keys(this.mapChildren.Keys)[0] ? "" : (options.useCommaSeparators ? "," : " ")) + (options.useStringKeys ? "\"" : "") + key + (options.useStringKeys ? "\"" : "") + ":" + this.mapChildren[key].ToVDF_InlinePart(options, tabDepth));
                builder.Append("}");
            }
            if (this.isList || this.listChildren.Count > 0) {
                builder.Append("[");
                for (var i = 0; i < this.listChildren.Count; i++)
                    builder.Append((i == 0 ? "" : (options.useCommaSeparators ? "," : " ")) + this.listChildren[i].ToVDF_InlinePart(options, tabDepth));
                builder.Append("]");
            }
        }

        return builder.ToString();
    };
    VDFNode.prototype.ToVDF_PoppedOutPart = function (options, tabDepth) {
        if (typeof options === "undefined") { options = null; }
        if (typeof tabDepth === "undefined") { tabDepth = 0; }
        options = options || new VDFSaveOptions();

        var builder = new StringBuilder();

        // include popped-out-content of direct children (i.e. a single directly-under group)
        if (options.useChildPopOut && this.popOutChildren) {
            var childTabStr = "";
            for (var i = 0; i < tabDepth + 1; i++)
                childTabStr += "\t";
            if (this.isMap || this.mapChildren.Count > 0)
                for (var key in this.mapChildren.Keys) {
                    builder.Append("\n" + childTabStr + (options.useStringKeys ? "\"" : "") + key + (options.useStringKeys ? "\"" : "") + ":" + this.mapChildren[key].ToVDF_InlinePart(options, tabDepth + 1));
                    var poppedOutChildText = this.mapChildren[key].ToVDF_PoppedOutPart(options, tabDepth + 1);
                    if (poppedOutChildText.length > 0)
                        builder.Append(poppedOutChildText);
                }
            if (this.isList || this.listChildren.Count > 0)
                for (var i in this.listChildren.Indexes()) {
                    var item = this.listChildren[i];
                    builder.Append("\n" + childTabStr + item.ToVDF_InlinePart(options, tabDepth + 1));
                    var poppedOutChildText = item.ToVDF_PoppedOutPart(options, tabDepth + 1);
                    if (poppedOutChildText.length > 0)
                        builder.Append(poppedOutChildText);
                }
        } else {
            var poppedOutChildTexts = new List("string");
            var poppedOutChildText;
            if (this.isMap || this.mapChildren.Count > 0)
                for (var key in this.mapChildren.Keys)
                    if ((poppedOutChildText = this.mapChildren[key].ToVDF_PoppedOutPart(options, tabDepth)).length)
                        poppedOutChildTexts.Add(poppedOutChildText);
            if (this.isList || this.listChildren.Count > 0)
                for (var i in this.listChildren.Indexes())
                    if ((poppedOutChildText = this.listChildren[i].ToVDF_PoppedOutPart(options, tabDepth)).length)
                        poppedOutChildTexts.Add(poppedOutChildText);
            for (var i = 0; i < poppedOutChildTexts.Count; i++) {
                poppedOutChildText = poppedOutChildTexts[i];
                var insertPoint = 0;
                while (poppedOutChildText[insertPoint] == '\n' || poppedOutChildText[insertPoint] == '\t')
                    insertPoint++;
                builder.Append((insertPoint > 0 ? poppedOutChildText.substr(0, insertPoint) : "") + (i == 0 ? "" : "^") + poppedOutChildText.substr(insertPoint));
            }
        }

        return builder.ToString();
    };

    // loading
    // ==================
    VDFNode.CreateNewInstanceOfType = function (typeName) {
        var genericParameters = VDF.GetGenericArgumentsOfType(typeName);
        if (typeName.StartsWith("List("))
            return new List(genericParameters[0]);
        if (typeName.StartsWith("Dictionary("))
            return new Dictionary(genericParameters[0], genericParameters[1]);
        return new window[typeName];
    };
    VDFNode.GetCompatibleTypeNameForNode = function (node) {
        return node.mapChildren.Count ? "object" : (node.listChildren.length ? "List(object)" : "string");
    };

    VDFNode.prototype.ToObject = function (declaredTypeName_orOptions, options_orNothing) {
        if (declaredTypeName_orOptions instanceof VDFLoadOptions)
            return this.ToObject(null, declaredTypeName_orOptions);

        var declaredTypeName = declaredTypeName_orOptions;
        var options = options_orNothing || new VDFLoadOptions();

        var fromVDFTypeName = "object";
        if (this.metadata != null)
            fromVDFTypeName = this.metadata;
        else if (typeof this.primitiveValue == "boolean")
            fromVDFTypeName = "bool";
        else if (typeof this.primitiveValue == "number")
            fromVDFTypeName = this.primitiveValue.toString().Contains(".") ? "double" : "int";
        else if (typeof this.primitiveValue == "string")
            fromVDFTypeName = "string";
        else if (this.primitiveValue == null)
            if (this.isList || this.listChildren.Count > 0)
                fromVDFTypeName = "List(object)"; //"array";
            else if (this.isMap || this.mapChildren.Count > 0)
                fromVDFTypeName = "Dictionary(object object)"; //"object-anonymous"; //"object";

        var finalTypeName = declaredTypeName;

        // porting-note: this is only a limited implementation of CS functionality of making sure from-vdf-type is more specific than declared-type
        if (finalTypeName == null || ["object", "IList", "IDictionary"].Contains(finalTypeName))
            finalTypeName = fromVDFTypeName;

        var result;
        if (VDF.typeImporters_inline[finalTypeName])
            result = VDF.typeImporters_inline[finalTypeName](this.primitiveValue);
        else if (finalTypeName == "object")
            result = null;
        else if (EnumValue.IsEnum(finalTypeName))
            result = EnumValue.GetEnumIntForStringValue(finalTypeName, this.primitiveValue);
        else if (this.primitiveValue != null)
            result = this.primitiveValue; //Convert.ChangeType(primitiveValue, finalType); //primitiveValue;
        else {
            result = VDFNode.CreateNewInstanceOfType(finalTypeName);
            this.IntoObject(result, options);
        }

        return result;
    };
    VDFNode.prototype.IntoObject = function (obj, loadOptions) {
        if (typeof loadOptions === "undefined") { loadOptions = null; }
        loadOptions = loadOptions || new VDFLoadOptions();

        var typeName = VDF.GetTypeNameOfObject(obj);
        var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
        var typeInfo = VDFTypeInfo.Get(typeName);

        if (obj && obj.VDFPreDeserialize)
            obj.VDFPreDeserialize(loadOptions.message);

        for (var i = 0; i < this.listChildren.Count; i++)
            obj.Add(this.listChildren[i].ToObject(typeGenericArgs[0], loadOptions));
        for (var keyString in this.mapChildren.Keys)
            try  {
                if (obj instanceof Dictionary) {
                    var key = keyString;
                    if (VDF.typeImporters_inline[typeGenericArgs[0]])
                        key = VDF.typeImporters_inline[typeGenericArgs[0]](keyString);
                    obj.Set(key, this.mapChildren[keyString].ToObject(typeGenericArgs[1], loadOptions));
                } else
                    obj[keyString] = this.mapChildren[keyString].ToObject(typeInfo.propInfoByName[keyString].propTypeName, loadOptions);
            } catch (ex) {
                throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error loading map-child with key '" + keyString + "'.") + "\n");
            }

        if (obj && obj.VDFPostDeserialize)
            obj.VDFPostDeserialize(loadOptions.message);
    };
    return VDFNode;
})();
//VDFUtils.MakePropertiesHidden(VDFNode.prototype, true);
//# sourceMappingURL=VDFNode.js.map
