var VDFNode = (function () {
    function VDFNode(baseValue, metadata_type) {
        this.items = [];
        this.properties = new Map();
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
        for (var i = 0; i < lines.length; i++)
            builder.Append(i == 0 ? "" : "\n").Append(this.popOutToOwnLine ? "\t" : "").Append(lines[i]); // line-breaks + indents + data
        return builder.ToString();
    };
    VDFNode.prototype.ToString = function () {
        var poppedOutItemText = this.GetPoppedOutItemText();
        return this.GetInLineItemText() + (poppedOutItemText.length > 0 ? "\n" + poppedOutItemText : "");
    };

    // loading
    // ==================
    VDFNode.CreateNewInstanceOfType = function (typeName) {
        if (typeName.startsWith("List["))
            return eval("new_List(" + typeName.match(/\[(.+)\]/)[1] + ")");
        if (typeName.startsWith("Dictionary[")) {
            var parts = typeName.match(/\[(.+?),(.+?)\]/);
            return eval("new_Dictionary(" + parts[1] + "," + parts[2] + ")");
        }
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
                result = EnumValue.GetEnumStringForIntValue(declaredTypeName, parseInt(rawValue.baseValue));
            else
                result = rawValue.baseValue; // todo
        }
        return result;
    };

    VDFNode.prototype.ToObject = function (declaredTypeName, loadOptions) {
        if (declaredTypeName == "string")
            return this.items[0].baseValue == "null" ? null : this.items[0].baseValue;

        var type = this.metadata_type || declaredTypeName;
        var typeInfo = window[declaredTypeName].typeInfo;

        var result = VDFNode.CreateNewInstanceOfType(type);
        for (var i = 0; i < this.items.length; i++)
            if (type.startsWith("List["))
                result[i] = VDFNode.ConvertRawValueToCorrectType(this.items[i], typeInfo.itemType, loadOptions);
            else if (type.startsWith("Dictionary["))
                result.set(VDFNode.ConvertRawValueToCorrectType(this.items[i].items[0], typeInfo.keyType, loadOptions), VDFNode.ConvertRawValueToCorrectType(this.items[i].items[1], typeInfo.valueType, loadOptions));
            else
                result = VDFNode.ConvertRawValueToCorrectType(this.items[i], type, loadOptions);
        for (var propName in this.properties) {
            var propInfo = typeInfo.propInfoByPropName[propName];
            result[propName] = VDFNode.ConvertRawValueToCorrectType(this.properties[propName], propInfo.propVTypeName, loadOptions);
        }

        return result;
    };
    return VDFNode;
})();
//# sourceMappingURL=VDFNode.js.map
