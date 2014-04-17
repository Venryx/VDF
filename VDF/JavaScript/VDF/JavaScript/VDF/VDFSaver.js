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

        var objVTypeName = VDF.GetVTypeNameOfObject(obj);
        var objNode = new VDFNode();
        if (VDF.typeExporters_inline[objVTypeName])
            objNode.items.push(new VDFNode(VDFSaver.RawDataStringToFinalized(VDF.typeExporters_inline[objVTypeName](obj))));
        else if (objVTypeName == "bool")
            objNode.items.push(new VDFNode(obj.toString().toLowerCase()));
        else if (objVTypeName == "float" && obj.toString().contains("."))
            objNode.items.push(new VDFNode(obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString()));
        else if (objVTypeName == "float" || objVTypeName == "string" || obj.GetTypeName() == "EnumValue")
            objNode.items.push(new VDFNode(VDFSaver.RawDataStringToFinalized(obj.toString())));
        else if (objVTypeName.startsWith("List[")) {
            objNode.isListOrDictionary = true;
            var objAsList = obj;
            for (var i = 0; i < objAsList.length; i++) {
                var item = objAsList[i];
                if (eval("window['" + objAsList.itemType + "'] && " + objAsList.itemType + "['_IsEnum'] === 0"))
                    item = new EnumValue(objAsList.itemType, item);

                var itemVTypeName = VDF.GetVTypeNameOfObject(item);
                var typeDerivedFromDeclaredType = itemVTypeName != objAsList.itemType;
                var itemValueNode = VDFSaver.ToVDFNode(item, saveOptions);
                if (itemVTypeName.startsWith("List["))
                    itemValueNode.isListItem_list = true;
                if (i > 0)
                    itemValueNode.isListItem_nonFirst = true;
                if (typeDerivedFromDeclaredType)
                    itemValueNode.metadata_type = itemVTypeName;
                objNode.items.push(itemValueNode);
            }
        } else if (objVTypeName.startsWith("Dictionary[")) {
            objNode.isListOrDictionary = true;
            var objAsDictionary = obj;
            for (var i in objAsDictionary.keys) {
                var key = objAsDictionary.keys[i];
                var value = objAsDictionary.get(key);
                if (eval("window['" + objAsDictionary.keyType + "'] && " + objAsDictionary.keyType + "['_IsEnum'] === 0"))
                    key = new EnumValue(objAsDictionary.keyType, key);
                if (eval("window['" + objAsDictionary.valueType + "'] && " + objAsDictionary.valueType + "['_IsEnum'] === 0"))
                    value = new EnumValue(objAsDictionary.valueType, value);

                var keyValuePairPseudoNode = new VDFNode();
                keyValuePairPseudoNode.isKeyValuePairPseudoNode = true;

                var keyVTypeName = VDF.GetVTypeNameOfObject(key);
                var keyTypeDerivedFromDeclaredType = keyVTypeName != objAsDictionary.keyType;
                var keyNode = VDFSaver.ToVDFNode(key);
                if (keyTypeDerivedFromDeclaredType)
                    keyNode.metadata_type = keyVTypeName;
                keyValuePairPseudoNode.items.push(keyNode);

                var valueVTypeName = VDF.GetVTypeNameOfObject(value);
                var valueTypeDerivedFromDeclaredType = valueVTypeName != objAsDictionary.valueType;
                var valueNode = VDFSaver.ToVDFNode(value);
                valueNode.isListItem_nonFirst = true;
                if (valueTypeDerivedFromDeclaredType)
                    valueNode.metadata_type = valueVTypeName;
                keyValuePairPseudoNode.items.push(valueNode);

                objNode.items.push(keyValuePairPseudoNode);
            }
            ;
        } else if (typeof obj == "object") {
            var typeInfo = obj.GetType()["typeInfo"] || new VDFTypeInfo();
            var popOutGroupsAdded = 0;
            for (var propName in obj) {
                if (typeof obj[propName] == "function")
                    continue;

                var propInfo = typeInfo.propInfoByPropName[propName] || new VDFPropInfo(null);
                var include = typeInfo.props_includeL1;
                include = propInfo.includeL2 != null ? propInfo.includeL2 : include;
                if (!include)
                    continue;

                var propValue = obj[propName];
                if (EnumValue.IsEnum(propInfo.propVTypeName))
                    propValue = new EnumValue(propInfo.propVTypeName, propValue);
                if (propInfo.IsXIgnorableValue(propValue))
                    continue;

                var propVTypeName = VDF.GetVTypeNameOfObject(propValue);
                var typeDerivedFromDeclaredType = propVTypeName != propInfo.propVTypeName;
                if (propInfo.popOutItemsToOwnLines) {
                    var propValueNode = VDFSaver.ToVDFNode(propValue, saveOptions);
                    propValueNode.isNamedPropertyValue = true;
                    propValueNode.items.insert(0, new VDFNode("#")); // add in-line marker, indicating that items are popped-out
                    if (popOutGroupsAdded > 0 && propValueNode.items.length > 1)
                        propValueNode.items[1].isFirstItemOfNonFirstPopOutGroup = true;
                    if (typeDerivedFromDeclaredType)
                        propValueNode.metadata_type = propVTypeName;
                    for (var key in propValueNode.items)
                        if (propValueNode.items[key].baseValue != "#")
                            propValueNode.items[key].popOutToOwnLine = true;
                    objNode.properties.set(propName, propValueNode);
                    popOutGroupsAdded++;
                } else {
                    var propValueNode = VDFSaver.ToVDFNode(propValue, saveOptions);
                    propValueNode.isNamedPropertyValue = true;
                    if (typeDerivedFromDeclaredType)
                        propValueNode.metadata_type = propVTypeName;
                    objNode.properties.set(propName, propValueNode);
                }
            }
        }

        return objNode;
    };

    VDFSaver.RawDataStringToFinalized = function (dataStr) {
        var result = dataStr;
        if (dataStr.contains("}")) {
            if (dataStr.endsWith("@") || dataStr.endsWith("|"))
                result = "@@" + dataStr.replace(/@@(?=\n|}|$)/g, "@@@") + "|@@";
            else
                result = "@@" + dataStr.replace(/@@(?=\n|}|$)/g, "@@@") + "@@";
        }
        return result;
    };
    return VDFSaver;
})();
//# sourceMappingURL=VDFSaver.js.map
