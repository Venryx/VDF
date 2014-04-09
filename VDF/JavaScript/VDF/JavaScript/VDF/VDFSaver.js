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
        if (VDF.typeExporters_inline[obj.GetTypeName()]) {
            var str = VDF.typeExporters_inline[obj.GetTypeName()](obj);
            objNode.items.push(new VDFNode(str.contains("}") ? "@@@" + str + "@@@" : str));
        } else if (obj.GetTypeName() == "Number" && obj.toString().contains("."))
            objNode.items.push(new VDFNode(obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString()));
        else if (obj.GetTypeName() == "Number" || obj.GetTypeName() == "String")
            objNode.items.push(new VDFNode(obj.toString().contains("}") ? "@@@" + obj + "@@@" : obj.toString()));
        else if (obj.GetTypeName() == "Array") {
            objNode.isListOrDictionary = true;
            var objAsList = obj;
            for (var i = 0; i < objAsList.length; i++) {
                var item = objAsList[i];
                var typeDerivedFromDeclaredType = !obj.GetTypeName().contains(item.GetTypeName());
                var itemValueNode = VDFSaver.ToVDFNode(item, saveOptions);
                if (item.GetTypeName() == "Array")
                    itemValueNode.isArrayItem_array = true;
                if (i > 0)
                    itemValueNode.isArrayItem_nonFirst = true;
                if (typeDerivedFromDeclaredType)
                    itemValueNode.metadata_type = VDF.GetVNameOfType(item.GetTypeName(), saveOptions);
                objNode.items.push(itemValueNode);
            }
        } else if (obj.GetTypeName() == "Map") {
            objNode.isListOrDictionary = true;
            var objAsDictionary = obj;
            objAsDictionary.forEach(function (value, key, map) {
                var keyValuePairPseudoNode = new VDFNode();
                keyValuePairPseudoNode.isKeyValuePairPseudoNode = true;

                var keyTypeDerivedFromDeclaredType = !obj.GetTypeName().contains(key.GetTypeName() + ",");
                var keyNode = VDFSaver.ToVDFNode(key, saveOptions);
                if (keyTypeDerivedFromDeclaredType)
                    keyNode.metadata_type = VDF.GetVNameOfType(key.GetTypeName(), saveOptions);
                keyValuePairPseudoNode.items.push(keyNode);

                var valueTypeDerivedFromDeclaredType = !obj.GetTypeName().contains(key.GetTypeName());
                var valueNode = VDFSaver.ToVDFNode(value, saveOptions);
                valueNode.isArrayItem_nonFirst = true;
                if (valueTypeDerivedFromDeclaredType)
                    valueNode.metadata_type = VDF.GetVNameOfType(value.GetTypeName(), saveOptions);
                keyValuePairPseudoNode.items.push(valueNode);

                objNode.items.push(keyValuePairPseudoNode);
            });
        } else if (typeof obj == "object") {
            var typeInfo = obj["typeInfo"] || new VDFTypeInfo();
            var popOutGroupsAdded = 0;
            for (var propName in obj) {
                if (typeof obj[propName] == "function")
                    continue;

                var propInfo = typeInfo.propInfoByPropName.get(propName) || new VDFPropInfo(null);
                var include = typeInfo.props_includeL1;
                include = propInfo.includeL2 != null ? propInfo.includeL2 : include;
                if (!include)
                    continue;

                var propValue = obj[propName];
                if (propInfo.IsXIgnorableValue(propValue))
                    continue;

                var propType = propValue.GetTypeName();
                var typeDerivedFromDeclaredType = propType != propInfo.propType && propType != "Array" && propType != "Map";
                if (propInfo.popOutItemsToOwnLines) {
                    var propValueNode = VDFSaver.ToVDFNode(propValue, saveOptions);
                    propValueNode.isNamedPropertyValue = true;
                    propValueNode.items.insert(0, new VDFNode("#")); // add in-line marker, indicating that items are popped-out
                    if (popOutGroupsAdded > 0 && propValueNode.items.length > 1)
                        propValueNode.items[1].isFirstItemOfNonFirstPopOutGroup = true;
                    if (typeDerivedFromDeclaredType)
                        propValueNode.metadata_type = VDF.GetVNameOfType(propType, saveOptions);
                    for (var key in propValueNode.items)
                        if (propValueNode.items[key].baseValue != "#")
                            propValueNode.items[key].popOutToOwnLine = true;
                    objNode.properties[propName] = propValueNode;
                    popOutGroupsAdded++;
                } else {
                    var propValueNode = VDFSaver.ToVDFNode(propValue, saveOptions);
                    propValueNode.isNamedPropertyValue = true;
                    if (typeDerivedFromDeclaredType)
                        propValueNode.metadata_type = VDF.GetVNameOfType(propType, saveOptions);
                    objNode.properties[propName] = propValueNode;
                }
            }
        }

        return objNode;
    };
    return VDFSaver;
})();
//# sourceMappingURL=VDFSaver.js.map
