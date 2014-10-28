var VDFTypeMarking;
(function (VDFTypeMarking) {
    VDFTypeMarking[VDFTypeMarking["None"] = 0] = "None";
    VDFTypeMarking[VDFTypeMarking["Assembly"] = 1] = "Assembly";
    VDFTypeMarking[VDFTypeMarking["AssemblyExternal"] = 2] = "AssemblyExternal";
    VDFTypeMarking[VDFTypeMarking["AssemblyExternalNoCollapse"] = 3] = "AssemblyExternalNoCollapse";
})(VDFTypeMarking || (VDFTypeMarking = {}));
var VDFSaveOptions = (function () {
    function VDFSaveOptions(message, typeMarking) {
        if (typeof typeMarking === "undefined") { typeMarking = 1 /* Assembly */; }
        this.message = message;
        this.typeMarking = typeMarking;
    }
    return VDFSaveOptions;
})();

var VDFSaver = (function () {
    function VDFSaver() {
    }
    VDFSaver.ToVDFNode = function (obj, declaredTypeName_orSaveOptions, saveOptions_orDeclaredTypeName, isGenericParamValue) {
        var declaredTypeName;
        var saveOptions;
        if (typeof declaredTypeName_orSaveOptions == "string" || saveOptions_orDeclaredTypeName instanceof VDFSaveOptions) {
            declaredTypeName = declaredTypeName_orSaveOptions;
            saveOptions = saveOptions_orDeclaredTypeName;
        } else {
            declaredTypeName = saveOptions_orDeclaredTypeName;
            saveOptions = declaredTypeName_orSaveOptions;
        }
        saveOptions = saveOptions || new VDFSaveOptions();

        var objNode = new VDFNode();
        var objVTypeName = obj != null && (EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF.GetVTypeNameOfObject(obj));
        var isAnonymousType = obj != null && (obj.constructor == {}.constructor || obj.constructor == object);
        var typeInfo = obj != null && (obj.GetType()["typeInfo"] || (isAnonymousType ? new VDFTypeInfo(true) : new VDFTypeInfo()));

        if (obj && obj.VDFPreSerialize)
            obj.VDFPreSerialize(saveOptions.message);

        if (obj == null)
            objNode.baseValue = "null";
        else if (objVTypeName == "string" && obj == "")
            objNode.baseValue = "empty";
        else if (VDF.typeExporters_inline[objVTypeName])
            objNode.baseValue = VDF.typeExporters_inline[objVTypeName](obj);
        else if (EnumValue.IsEnum(objVTypeName))
            objNode.baseValue = new EnumValue(objVTypeName, obj).toString();
        else if (objVTypeName == "bool")
            objNode.baseValue = obj.toString().toLowerCase();
        else if (["float", "double", "decimal"].indexOf(objVTypeName) != -1)
            objNode.baseValue = obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString();
        else if (["char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "string"].indexOf(objVTypeName) != -1)
            objNode.baseValue = obj.toString();
        else if (objVTypeName && objVTypeName.startsWith("List[")) {
            objNode.isList = true;
            var objAsList = obj;
            for (var i = 0; i < objAsList.length; i++)
                objNode.AddItem(VDFSaver.ToVDFNode(objAsList[i], objAsList.itemType, saveOptions, true));
        } else if (objVTypeName && objVTypeName.startsWith("Dictionary[")) {
            objNode.isDictionary = true;
            var objAsDictionary = obj;
            for (var i in objAsDictionary.keys)
                objNode.SetProperty(VDFSaver.ToVDFNode(objAsDictionary.keys[i], objAsDictionary.keyType, saveOptions, true).AsString, VDFSaver.ToVDFNode(objAsDictionary.Get(objAsDictionary.keys[i]), objAsDictionary.valueType, saveOptions, true));
        } else if (typeof obj == "object") {
            // special fix; we need to write something for each declared prop (of those included anyway), so insert empty props for those not even existent on the instance
            var oldObj = obj;
            obj = {};
            for (var propName in typeInfo.propInfoByName)
                obj[propName] = null; // first, clear each declared prop to a null value, to ensure that the code below can process each declared property
            for (var propName in oldObj)
                obj[propName] = oldObj[propName];

            for (var propName in obj)
                try  {
                    if (typeof obj[propName] == "function")
                        continue;

                    var propInfo = typeInfo.propInfoByName[propName] || new VDFPropInfo("object");
                    var include = typeInfo.props_includeL1;
                    include = propInfo.includeL2 != null ? propInfo.includeL2 : include;
                    if (!include)
                        continue;

                    var propValue = obj[propName];
                    if (propInfo.IsXValueEmpty(propValue) && !propInfo.writeEmptyValue)
                        continue;

                    // if obj is an anonymous type, considers its props' declared-types to be 'object'; also, if not popped-out, pass it the same line-info pack that we were given
                    var propValueNode = VDFSaver.ToVDFNode(propValue, !isAnonymousType ? propInfo.propVTypeName : "object", saveOptions);
                    propValueNode.popOutChildren = propInfo.popOutChildrenL2 != null ? propInfo.popOutChildrenL2 : propValueNode.popOutChildren;
                    objNode.SetProperty(propName, propValueNode);
                } catch (ex) {
                    throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error saving property '" + propName + "'.") + "\n");
                }
        }

        // do type-marking at the end, since it depends quite a bit on the actual data (since the data determines how much can be inferred, and how much needs to be specified)
        var markType = saveOptions.typeMarking == 3 /* AssemblyExternalNoCollapse */;
        markType = markType || (saveOptions.typeMarking == 2 /* AssemblyExternal */ && obj instanceof List && objNode.items.length == 1); // if list with only one item (i.e. indistinguishable from base-prop)
        markType = markType || (saveOptions.typeMarking == 2 /* AssemblyExternal */ && obj instanceof Dictionary); // if dictionary (i.e. indistinguishable from prop-set)
        markType = markType || (saveOptions.typeMarking == 2 /* AssemblyExternal */ && !isGenericParamValue); // we're a non-generics-based value (i.e. we have no value-default-type specified)
        markType = markType || ([1 /* Assembly */, 2 /* AssemblyExternal */].indexOf(saveOptions.typeMarking) != -1 && (obj == null || objVTypeName != declaredTypeName)); // if actual type is *derived* from the declared type, we must mark type, even if in the same Assembly
        if (obj == null || (objVTypeName == "string" && obj == ""))
            objNode.metadata_type = "";
        else
            objNode.metadata_type = markType ? objVTypeName : null;
        if (saveOptions.typeMarking != 3 /* AssemblyExternalNoCollapse */) {
            var collapseMap = { "string": null, "bool": "", "int": "", "float": "", "List[object]": "", "Dictionary[object,object]": "" };
            if (objNode.metadata_type != null && collapseMap[objNode.metadata_type] !== undefined)
                objNode.metadata_type = collapseMap[objNode.metadata_type];

            // if List of generic-params-without-generic-params, or Dictionary, chop out name and just include generic-params
            if (objNode.metadata_type != null && ((objNode.metadata_type.indexOf("List[") == 0 && objNode.metadata_type.substring(5).indexOf("[") == -1) || objNode.metadata_type.indexOf("Dictionary[") != -1))
                objNode.metadata_type = objNode.metadata_type.indexOf("List[") == 0 ? objNode.metadata_type.substring(5, objNode.metadata_type.length - 1) : objNode.metadata_type.substring(11, objNode.metadata_type.length - 1);
        }

        if (typeInfo != null && typeInfo.popOutChildrenL1)
            objNode.popOutChildren = true;

        if (obj && obj.VDFPostSerialize)
            obj.VDFPostSerialize(saveOptions.message);

        return objNode;
    };
    return VDFSaver;
})();
//# sourceMappingURL=VDFSaver.js.map
