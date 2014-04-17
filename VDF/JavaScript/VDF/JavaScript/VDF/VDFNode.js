var VDFNode = (function () {
    function VDFNode(baseValue, metadata_type) {
        this.items = [];
        this.properties = new Dictionary();
        this.baseValue = baseValue;
        this.metadata_type = metadata_type;
    }
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

        builder.Append(this.baseValue);
        for (var key in this.items)
            if (!this.items[key].popOutToOwnLine)
                builder.Append(this.items[key].GetInLineItemText());
        for (var i in this.properties.keys) {
            var propName = this.properties.keys[i];
            if (!this.properties.get(propName).popOutToOwnLine)
                builder.Append(propName + "{" + this.properties.get(propName).GetInLineItemText() + "}");
        }

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
        for (var i in this.properties.keys) {
            var propName = this.properties.keys[i];
            var propValueNode = this.properties.get(propName);
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
    VDFNode.prototype.ToString = function () {
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
    VDFNode.CreateNewInstanceOfType = function (typeName) {
        if (["bool", "float", "string"].contains(typeName) || EnumValue.IsEnum(typeName))
            return null;
        var genericParameters = VDFNode.GetGenericParametersOfTypeName(typeName);
        if (typeName.startsWith("List["))
            return eval("new List(\"" + genericParameters[0] + "\")");
        if (typeName.startsWith("Dictionary["))
            return eval("new Dictionary(\"" + genericParameters[0] + "\",\"" + genericParameters[1] + "\")");
        return eval("new " + typeName + "()");
    };
    VDFNode.ConvertRawValueToCorrectType = function (rawValue, declaredTypeName, loadOptions) {
        var result;
        if (rawValue.GetTypeName() == "VDFNode" && rawValue.baseValue == null)
            result = rawValue.ToObject(rawValue.metadata_type || declaredTypeName, loadOptions); // tell node to return itself as the correct type
        else {
            if (VDF.typeImporters_inline[declaredTypeName])
                result = VDF.typeImporters_inline[declaredTypeName](rawValue.baseValue); //(string)rawValue);
            else if (EnumValue.IsEnum(declaredTypeName))
                result = EnumValue.GetEnumIntForStringValue(declaredTypeName, rawValue.baseValue);
            else
                result = declaredTypeName == "float" ? parseFloat(rawValue.baseValue) : rawValue.baseValue;
        }
        return result;
    };

    VDFNode.prototype.ToObject = function (declaredTypeName, loadOptions) {
        if (declaredTypeName == "string")
            return this.items[0].baseValue == "null" ? null : this.items[0].baseValue;

        var type = this.metadata_type || declaredTypeName;
        var typeGenericParameters = VDFNode.GetGenericParametersOfTypeName(declaredTypeName);
        var typeInfo = (window[declaredTypeName] || {}).typeInfo;

        var result = VDFNode.CreateNewInstanceOfType(type);
        for (var i = 0; i < this.items.length; i++)
            if (type.startsWith("List["))
                result[i] = VDFNode.ConvertRawValueToCorrectType(this.items[i], typeGenericParameters[0], loadOptions);
            else if (type.startsWith("Dictionary["))
                result.set(VDFNode.ConvertRawValueToCorrectType(this.items[i].items[0], typeGenericParameters[0], loadOptions), VDFNode.ConvertRawValueToCorrectType(this.items[i].items[1], typeGenericParameters[1], loadOptions));
            else
                result = VDFNode.ConvertRawValueToCorrectType(this.items[i], type, loadOptions);
        for (var i in this.properties.keys) {
            var propName = this.properties.keys[i];
            result[propName] = VDFNode.ConvertRawValueToCorrectType(this.properties.get(propName), typeInfo.propInfoByPropName[propName].propVTypeName, loadOptions);
        }

        return result;
    };
    return VDFNode;
})();
//# sourceMappingURL=VDFNode.js.map
