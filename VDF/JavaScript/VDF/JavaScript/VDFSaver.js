var VDFTypeMarking;
(function (VDFTypeMarking) {
    VDFTypeMarking[VDFTypeMarking["None"] = 0] = "None";
    VDFTypeMarking[VDFTypeMarking["Internal"] = 1] = "Internal";
    VDFTypeMarking[VDFTypeMarking["External"] = 2] = "External";
    VDFTypeMarking[VDFTypeMarking["ExternalNoCollapse"] = 3] = "ExternalNoCollapse";
})(VDFTypeMarking || (VDFTypeMarking = {}));
var VDFSaveOptions = (function () {
    function VDFSaveOptions(initializerObj, messages, typeMarking, useMetadata, useChildPopOut, useStringKeys, useNumberTrimming, useCommaSeparators) {
        if (typeof typeMarking === "undefined") { typeMarking = 1 /* Internal */; }
        if (typeof useMetadata === "undefined") { useMetadata = true; }
        if (typeof useChildPopOut === "undefined") { useChildPopOut = true; }
        if (typeof useStringKeys === "undefined") { useStringKeys = false; }
        if (typeof useNumberTrimming === "undefined") { useNumberTrimming = true; }
        if (typeof useCommaSeparators === "undefined") { useCommaSeparators = false; }
        this.messages = messages || [];
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
    VDFSaver.ToVDFNode = function (obj, declaredTypeName_orOptions, options, parent, prop, declaredTypeInParentVDF) {
        if (typeof options === "undefined") { options = new VDFSaveOptions(); }
        if (declaredTypeName_orOptions instanceof VDFSaveOptions)
            return VDFSaver.ToVDFNode(obj, null, declaredTypeName_orOptions);

        var declaredTypeName = declaredTypeName_orOptions;

        var typeName = obj != null ? (EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF.GetTypeNameOfObject(obj)) : null;
        var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
        var typeInfo = typeName && VDFTypeInfo.Get(typeName);

        if (obj && obj.VDFPreSerialize)
            obj.VDFPreSerialize(parent, prop, options);

        var result;
        var serializedByCustomMethod = false;
        if (obj && obj.VDFSerialize) {
            var serializeResult = obj.VDFSerialize(parent, prop, options);
            if (serializeResult == VDF.CancelSerialize)
                return serializeResult;
            if (serializeResult != VDF.NoActionTaken) {
                result = serializeResult;
                serializedByCustomMethod = true;
            }
        }

        if (!serializedByCustomMethod) {
            result = new VDFNode();
            if (obj == null) {
            } else if (VDF.GetIsTypePrimitive(typeName))
                result.primitiveValue = obj;
            else if (EnumValue.IsEnum(typeName))
                result.primitiveValue = new EnumValue(typeName, obj).toString();
            else if (typeName && typeName.startsWith("List(")) {
                result.isList = true;
                var objAsList = obj;
                for (var i = 0; i < objAsList.length; i++) {
                    var itemNode = VDFSaver.ToVDFNode(objAsList[i], typeGenericArgs[0], options, parent, prop, true);
                    if (itemNode == VDF.CancelSerialize)
                        continue;
                    if (itemNode == VDF.CancelSerializeForProp)
                        return VDF.CancelSerialize;
                    result.AddListChild(itemNode);
                }
            } else if (typeName && typeName.startsWith("Dictionary(")) {
                result.isMap = true;
                var objAsDictionary = obj;
                for (var key in objAsDictionary.Keys) {
                    var valueNode = VDFSaver.ToVDFNode(objAsDictionary[key], typeGenericArgs[1], options, parent, prop, true);
                    if (valueNode == VDF.CancelSerialize)
                        continue;
                    if (valueNode == VDF.CancelSerializeForProp)
                        return VDF.CancelSerialize;
                    result.SetMapChild(VDFSaver.ToVDFNode(key, typeGenericArgs[0], options, parent, prop, true).primitiveValue, valueNode);
                }
            } else {
                result.isMap = true;

                for (var propName in typeInfo.props) {
                    if (!(propName in obj))
                        obj[propName] = null;
                }

                for (var propName in obj)
                    try  {
                        var propInfo = typeInfo.props[propName];
                        var include = typeInfo.typeTag != null && typeInfo.typeTag.propIncludeRegexL1 != null ? new RegExp(typeInfo.typeTag.propIncludeRegexL1).test(propName) : false;
                        include = propInfo && propInfo.propTag && propInfo.propTag.includeL2 != null ? propInfo.propTag.includeL2 : include;
                        if (!include)
                            continue;

                        var propValue = obj[propName];
                        if (propInfo && propInfo.IsXValueTheDefault(propValue) && propInfo.propTag && propInfo.propTag.writeDefaultValue == false)
                            continue;

                        var propValueNode = VDFSaver.ToVDFNode(propValue, propInfo ? propInfo.propTypeName : null, options, obj, propInfo);
                        if (propValueNode == VDF.CancelSerialize)
                            continue;
                        propValueNode.childPopOut = options.useChildPopOut && (propInfo && propInfo.propTag && propInfo.propTag.popOutL2 != null ? propInfo.propTag.popOutL2 : propValueNode.childPopOut);
                        result.SetMapChild(propName, propValueNode);
                    } catch (ex) {
                        ex.message += "\n==================\nRethrownAs) " + ("Error saving property '" + propName + "'.") + "\n";
                        throw ex;
                    }
            }
        }

        if (declaredTypeName == null)
            if (result.isList || result.listChildren.Count > 0)
                declaredTypeName = "List(object)";
            else if (result.isMap || result.mapChildren.Count > 0)
                declaredTypeName = "Dictionary(object object)";
            else
                declaredTypeName = "object";
        if (options.useMetadata && typeName != null && !VDF.GetIsTypeAnonymous(typeName) && ((options.typeMarking == 1 /* Internal */ && !VDF.GetIsTypePrimitive(typeName) && typeName != declaredTypeName) || (options.typeMarking == 2 /* External */ && !VDF.GetIsTypePrimitive(typeName) && (typeName != declaredTypeName || !declaredTypeInParentVDF)) || options.typeMarking == 3 /* ExternalNoCollapse */))
            result.metadata = typeName;

        if (options.useChildPopOut && typeInfo && typeInfo.typeTag && typeInfo.typeTag.popOutL1)
            result.childPopOut = true;

        if (obj && obj.VDFPostSerialize)
            obj.VDFPostSerialize(result, parent, prop, options);

        return result;
    };
    return VDFSaver;
})();
//# sourceMappingURL=VDFSaver.js.map
