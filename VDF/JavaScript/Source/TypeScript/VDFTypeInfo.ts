class VDFType {
	propIncludeRegexL1: string;
	popOutL1: boolean;
	constructor(propIncludeRegexL1?: string, popOutL1?: boolean) {
		this.propIncludeRegexL1 = propIncludeRegexL1;
		this.popOutL1 = popOutL1;
	}

	AddDataOf(typeTag: VDFType) {
		if (typeTag.propIncludeRegexL1 != null)
			this.propIncludeRegexL1 = typeTag.propIncludeRegexL1;
		if (typeTag.popOutL1 != null)
			this.popOutL1 = typeTag.popOutL1;
	}
}
class VDFTypeInfo {
	static Get(type_orTypeName: any): VDFTypeInfo {
		//var type = type_orTypeName instanceof Function ? type_orTypeName : window[type_orTypeName];
		var typeName = type_orTypeName instanceof Function ? type_orTypeName.name : type_orTypeName;

		var typeNameBase = typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName;
		if (VDF.GetIsTypeAnonymous(typeNameBase)) {
			var result = new VDFTypeInfo();
			result.typeTag = new VDFType(VDF.PropRegex_Any);
			return result;
		}

		var typeBase = type_orTypeName instanceof Function ? type_orTypeName : window[typeNameBase];
        /*if (typeBase == null)
			throw new Error("Could not find constructor for type: " + typeNameBase);*/
        if (typeBase && !typeBase.hasOwnProperty("typeInfo")) {
            var result = new VDFTypeInfo();
            result.typeTag = new VDFType();
            var currentType = typeBase;
            while (currentType != null) {
				var currentTypeInfo = currentType.typeInfo;
                // load type-tag from base-types
                var typeTag2 = (currentTypeInfo || {}).typeTag;
                for (var key in typeTag2)
                    if (result.typeTag[key] == null)
                        result.typeTag[key] = typeTag2[key];
                // load prop-info from base-types
                if (currentTypeInfo)
                    for (var propName in currentTypeInfo.props)
                        result.props[propName] = currentTypeInfo.props[propName];
                currentType = currentType.prototype && currentType.prototype.__proto__ && currentType.prototype.__proto__.constructor;
            }
            typeBase.typeInfo = result;
        }
        return typeBase && typeBase.typeInfo;
	}

	props = {};
	//chainProps_cache = {}; // all props
	tags: any[];
	typeTag: VDFType;

	GetProp(propName: string): VDFPropInfo {
		if (!(propName in this.props))
			this.props[propName] = new VDFPropInfo(propName, null, []);
		return this.props[propName];
	}
}

class VDFProp {
	includeL2: boolean;
	popOutL2: boolean;
	constructor(includeL2 = true, popOutL2?: boolean) {
		this.includeL2 = includeL2;
		this.popOutL2 = popOutL2;
	}
}
class P extends VDFProp {
	constructor(includeL2 = true, popOutL2?: boolean) {
		super(includeL2, popOutL2);
	}
}
class DefaultValue {
	defaultValue;
	constructor(defaultValue = D.DefaultDefault) {
		this.defaultValue = defaultValue;
	}
}
class D extends DefaultValue {
	//static NoDefault = new object(); // i.e. the prop has no default, so whatever value it has is always saved [commented out, since: if you want no default, just don't add the D tag]
	static DefaultDefault = new object(); // i.e. the default value for the type (not the prop) ['false' for a bool, etc.]
	static NullOrEmpty = new object(); // i.e. null, or an empty string or collection
	static Empty = new object(); // i.e. an empty string or collection

	constructor(defaultValue = D.DefaultDefault) {
		super(defaultValue);
	}
}
class VDFPropInfo {
	name: string;
	typeName: string;
	tags: any[];
	propTag: VDFProp;
	defaultValueTag: DefaultValue;
	constructor(propName: string, propTypeName: string, tags: any[]) {
		this.name = propName;
		this.typeName = propTypeName;
		this.tags = tags;
		this.propTag = tags.First(a=>a instanceof VDFProp);
		this.defaultValueTag = tags.First(a=>a instanceof DefaultValue);
	}

	AddTags(...tags) {
		this.tags.push(...tags);
		this.propTag = tags.First(a=>a instanceof VDFProp);
		this.defaultValueTag = tags.First(a=>a instanceof DefaultValue);
	}

	ShouldValueBeSaved(val: any) {
		//if (this.defaultValueTag == null || this.defaultValueTag.defaultValue == D.NoDefault)
		if (this.defaultValueTag == null)
			return true;

		if (this.defaultValueTag.defaultValue == D.DefaultDefault) {
			if (val == null) // if null
				return false;
			if (val === false || val === 0) // if struct, and equal to struct's default value
				return true;
		}
		if (this.defaultValueTag.defaultValue == D.NullOrEmpty && val === null)
			return false;
		if (this.defaultValueTag.defaultValue == D.NullOrEmpty || this.defaultValueTag.defaultValue == D.Empty) {
			var typeName = VDF.GetTypeNameOfObject(val);
			if (typeName && typeName.startsWith("List(") && val.length == 0) // if list, and empty
				return false;
			if (typeName == "string" && !val.length) // if string, and empty
				return false;
		}
		if (val === this.defaultValueTag.defaultValue)
			return false;

		return true;
	}
}

class VDFSerializeProp {}
class VDFDeserializeProp {}

class VDFPreSerialize {}
class VDFSerialize {}
class VDFPostSerialize {}
class VDFPreDeserialize {}
class VDFDeserialize {
	fromParent: boolean;
	constructor(fromParent = false) { this.fromParent = fromParent; }
}
class VDFPostDeserialize {}
/*class VDFMethodInfo {
	tags: any[];
	constructor(tags: any[]) { this.tags = tags; }
}*/