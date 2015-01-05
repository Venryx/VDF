var VDFTypeMarking;
(function (VDFTypeMarking) {
    VDFTypeMarking[VDFTypeMarking["None"] = 0] = "None";
    VDFTypeMarking[VDFTypeMarking["Internal"] = 1] = "Internal";
    VDFTypeMarking[VDFTypeMarking["External"] = 2] = "External";
    VDFTypeMarking[VDFTypeMarking["ExternalNoCollapse"] = 3] = "ExternalNoCollapse";
})(VDFTypeMarking || (VDFTypeMarking = {}));
var VDFSaveOptions = (function () {
    function VDFSaveOptions(initializerObj, message, typeMarking, useMetadata, useChildPopOut, useStringKeys, useNumberTrimming, useCommaSeparators) {
        if (typeof typeMarking === "undefined") { typeMarking = 1 /* Internal */; }
        if (typeof useMetadata === "undefined") { useMetadata = true; }
        if (typeof useChildPopOut === "undefined") { useChildPopOut = true; }
        if (typeof useStringKeys === "undefined") { useStringKeys = false; }
        if (typeof useNumberTrimming === "undefined") { useNumberTrimming = true; }
        if (typeof useCommaSeparators === "undefined") { useCommaSeparators = false; }
        this.message = message;
        this.typeMarking = typeMarking;
        this.useMetadata = useMetadata;
        this.useChildPopOut = useChildPopOut;
        this.useStringKeys = useStringKeys;
        this.useNumberTrimming = useNumberTrimming;
        this.useCommaSeparators = useCommaSeparators;

        if (initializerObj)
            for (var key in initializerObj)
                this[key] = initializerObj[key];
    }
    VDFSaveOptions.prototype.ForJSON = function () {
        this.useMetadata = false;
        this.useChildPopOut = false;
        this.useStringKeys = true;
        this.useNumberTrimming = false;
        this.useCommaSeparators = true;
        return this;
    };
    return VDFSaveOptions;
})();

var VDFSaver = (function () {
    function VDFSaver() {
    }
    VDFSaver.ToVDFNode = function (obj, declaredTypeName_orOptions, options_orDeclaredTypeFromParent, declaredTypeFromParent_orNothing) {
        if (declaredTypeName_orOptions instanceof VDFSaveOptions)
            return VDFSaver.ToVDFNode(obj, null, declaredTypeName_orOptions, options_orDeclaredTypeFromParent);

        var declaredTypeName = declaredTypeName_orOptions;
        var options = options_orDeclaredTypeFromParent || new VDFSaveOptions();
        var declaredTypeFromParent = declaredTypeFromParent_orNothing;

        var node = new VDFNode();
        var typeName = obj != null ? (EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF.GetTypeNameOfObject(obj)) : null;
        var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
        var typeInfo = VDFTypeInfo.Get(typeName);

        if (obj && obj.VDFPreSerialize)
            obj.VDFPreSerialize(options.message);

        if (VDF.typeExporters_inline[typeName])
            node.primitiveValue = VDF.typeExporters_inline[typeName](obj);
        else if (obj == null)
            node.primitiveValue = null;
        else if (VDF.GetIsTypePrimitive(typeName))
            node.primitiveValue = obj;
        else if (EnumValue.IsEnum(typeName))
            node.primitiveValue = new EnumValue(typeName, obj).toString();
        else if (typeName && typeName.startsWith("List(")) {
            node.isList = true;
            var objAsList = obj;
            for (var i = 0; i < objAsList.length; i++)
                node.AddListChild(VDFSaver.ToVDFNode(objAsList[i], typeGenericArgs[0], options, true));
        } else if (typeName && typeName.startsWith("Dictionary(")) {
            node.isMap = true;
            var objAsDictionary = obj;
            for (var key in objAsDictionary.Keys)
                node.SetMapChild(VDFSaver.ToVDFNode(key, typeGenericArgs[0], options, true).primitiveValue, VDFSaver.ToVDFNode(objAsDictionary[key], typeGenericArgs[1], options, true));
        } else {
            node.isMap = true;

            // special fix; we need to write something for each declared prop (of those included anyway), so insert empty props for those not even existent on the instance
            var oldObj = obj;
            obj = {};
            for (var propName in typeInfo.propInfoByName)
                obj[propName] = null; // first, clear each declared prop to a null value, to ensure that the code below can process each declared property
            for (var propName in oldObj)
                obj[propName] = oldObj[propName];

            for (var propName in obj)
                try  {
                    var propInfo = typeInfo.propInfoByName[propName];
                    var include = typeInfo.props_includeL1;
                    include = propInfo && propInfo.includeL2 != null ? propInfo.includeL2 : include;
                    if (!include)
                        continue;

                    var propValue = obj[propName];
                    if (propInfo && propInfo.IsXValueTheDefault(propValue) && !propInfo.writeDefaultValue)
                        continue;

                    var propValueNode = VDFSaver.ToVDFNode(propValue, propInfo ? propInfo.propTypeName : null, options);
                    propValueNode.popOutChildren = options.useChildPopOut && (propInfo && propInfo.popOutChildrenL2 != null ? propInfo.popOutChildrenL2 : propValueNode.popOutChildren);
                    node.SetMapChild(propName, propValueNode);
                } catch (ex) {
                    throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error saving property '" + propName + "'.") + "\n");
                }
        }

        if (declaredTypeName == null)
            if (node.isList || node.listChildren.Count > 0)
                declaredTypeName = "List(object)";
            else if (node.isMap || node.mapChildren.Count > 0)
                declaredTypeName = "Dictionary(object object)";
            else
                declaredTypeName = "object";
        if (options.useMetadata && typeName != null && !VDF.GetIsTypeAnonymous(typeName) && ((options.typeMarking == 1 /* Internal */ && !VDF.GetIsTypePrimitive(typeName) && typeName != declaredTypeName) || (options.typeMarking == 2 /* External */ && !VDF.GetIsTypePrimitive(typeName) && (typeName != declaredTypeName || !declaredTypeFromParent)) || options.typeMarking == 3 /* ExternalNoCollapse */))
            node.metadata = typeName;

        if (options.useChildPopOut && typeInfo != null && typeInfo.popOutChildrenL1)
            node.popOutChildren = true;

        if (obj && obj.VDFPostSerialize)
            obj.VDFPostSerialize(options.message);

        return node;
    };
    return VDFSaver;
})();
//# sourceMappingURL=VDFSaver.js.map
