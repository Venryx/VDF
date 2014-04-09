var VDFSaveOptions = (function () {
    function VDFSaveOptions() {
    }
    return VDFSaveOptions;
})();

var VDFSaver = (function () {
    function VDFSaver() {
    }
    VDFSaver.ToVDFNode = function (obj, saveOptions) {
        if (saveOptions == null)
            saveOptions = new VDFSaveOptions();

        var objNode = new VDFNode();
        objNode.metadata_type = typeof obj;
        if (typeof obj == "number" && (typeof obj).contains("."))
            objNode.items.push(new VDFNode(obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString()));
        else if (typeof obj == "number" || typeof obj == "string")
            objNode.items.push(new VDFNode(obj.toString().contains("}") ? "@@@" + obj + "@@@" : obj.toString()));
        else if (obj instanceof Array) {
            objNode.metadata_type = "List[object]";
            objNode.isListOrDictionary = true;
            var objAsList = obj;
            for (var i = 0; i < objAsList.length; i++) {
                var item = objAsList[i];
                var itemValueNode = VDFSaver.ToVDFNode(item, saveOptions);
                if (item instanceof Array)
                    itemValueNode.isArrayItem_array = true;
                if (i > 0)
                    itemValueNode.isArrayItem_nonFirst = true;
                itemValueNode.metadata_type = typeof item;
                objNode.items.push(itemValueNode);
            }
        } else if (obj instanceof Map) {
            objNode.metadata_type = "List[object, object]";
            objNode.isListOrDictionary = true;
            var objAsDictionary = obj;
            for (var key in objAsDictionary) {
                var value = objAsDictionary[key];
                var keyValuePairPseudoNode = new VDFNode();
                keyValuePairPseudoNode.isKeyValuePairPseudoNode = true;

                var keyNode = VDFSaver.ToVDFNode(key, saveOptions);
                keyNode.metadata_type = typeof key;
                keyValuePairPseudoNode.items.push(keyNode);

                var valueNode = VDFSaver.ToVDFNode(value, saveOptions);
                valueNode.isArrayItem_nonFirst = true;
                valueNode.metadata_type = typeof value;
                keyValuePairPseudoNode.items.push(valueNode);

                objNode.items.push(keyValuePairPseudoNode);
            }
        } else if (typeof obj == "object") {
            var popOutGroupsAdded = 0;
            for (var propName in obj) {
                if (typeof obj[propName] == "function")
                    continue;
                var include = true;
                if (!include)
                    continue;

                var propValue = obj[propName];
                if (propValue == null)
                    continue;

                var popOutItemsToOwnLines = typeof propValue == "object";
                if (popOutItemsToOwnLines) {
                    var propValueNode = VDFSaver.ToVDFNode(propValue, saveOptions);
                    propValueNode.isNamedPropertyValue = true;
                    propValueNode.items.insert(0, new VDFNode("#")); // add in-line marker, indicating that items are popped-out
                    if (popOutGroupsAdded > 0 && propValueNode.items.length > 1)
                        propValueNode.items[1].isFirstItemOfNonFirstPopOutGroup = true;
                    for (var key in propValueNode.items)
                        if (propValueNode.items[key].baseValue != "#")
                            propValueNode.items[key].popOutToOwnLine = true;
                    objNode.properties[propName] = propValueNode;
                    popOutGroupsAdded++;
                } else {
                    var propValueNode = VDFSaver.ToVDFNode(propValue, saveOptions);
                    propValueNode.isNamedPropertyValue = true;
                    objNode.properties[propName] = propValueNode;
                }
            }
        }

        return objNode;
    };
    return VDFSaver;
})();
//# sourceMappingURL=VDFSaver.js.map
