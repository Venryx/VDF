var VDFNode = (function () {
    function VDFNode(baseValue) {
        this.items = [];
        this.properties = new Map();
        this.baseValue = baseValue;
    }
    VDFNode.prototype.GetInLineItemText = function () {
        var builder = new StringBuilder();
        if (this.isFirstItemOfNonFirstPopOutGroup)
            builder.Append("#");
        if (this.isArrayItem_nonFirst && !this.popOutToOwnLine)
            builder.Append("|");
        if ((this.isKeyValuePairPseudoNode && !this.popOutToOwnLine) || this.isArrayItem_array)
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

        if ((this.isKeyValuePairPseudoNode && !this.popOutToOwnLine) || this.isArrayItem_array)
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
    return VDFNode;
})();
