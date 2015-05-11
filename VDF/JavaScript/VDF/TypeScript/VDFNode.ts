class VDFNode
{
	metadata: string;
	primitiveValue: any;
	listChildren = new List<VDFNode>("VDFNode");
	mapChildren = new Dictionary<string, VDFNode>("string", "VDFNode"); // this also holds Dictionaries' keys/values
	
	constructor(primitiveValue?: any, metadata?: string)
	{
		this.primitiveValue = primitiveValue;
		this.metadata = metadata;
	}

	SetListChild(index: number, value: any)
	{
		this.listChildren[index] = value;
		this[index] = value;
	}
	/*InsertListChild(index: number, value: any)
	{
		var oldItems = this.listChildren;
		for (var i = 0; i < oldItems.length; i++) // we need to first remove old values, so the slate is clean for manual re-adding/re-ordering
			delete this[i];
		for (var i = 0; i < oldItems.length + 1; i++) // now add them all back in, in the correct order
			this.AddListChild(i == 0 ? value : (i < index ? oldItems[i] : oldItems[i - 1]));
	}*/
	AddListChild(value: any) { this.SetListChild(this.listChildren.length, value); }
	SetMapChild(key: string, value: any)
	{
		this.mapChildren.Set(key, value);
		this[key] = value;
	}

	toString() { return this.primitiveValue.toString(); } // helpful for debugging

	// saving
	// ==================

	static PadString(unpaddedString: string): string
	{
		var result = unpaddedString;
		if (result.StartsWith("<") || result.StartsWith("#"))
			result = "#" + result;
		if (result.EndsWith(">") || result.EndsWith("#"))
			result += "#";
		return result;
	}

	isList: boolean; // can also be inferred from use of list-children collection
	isMap: boolean; // can also be inferred from use of map-children collection
	childPopOut: boolean;
	ToVDF(options: VDFSaveOptions = null, tabDepth = 0): string { return this.ToVDF_InlinePart(options, tabDepth) + this.ToVDF_PoppedOutPart(options, tabDepth); }
	ToVDF_InlinePart(options: VDFSaveOptions = null, tabDepth = 0): string
	{
		options = options || new VDFSaveOptions();

		var builder = new StringBuilder();

		if (options.useMetadata && this.metadata != null)
			builder.Append(this.metadata + ">");

		if (this.primitiveValue == null)
		{
			if (!this.isMap && this.mapChildren.Count == 0 && !this.isList && this.listChildren.Count == 0)
				builder.Append("null");
		}
		else if (typeof this.primitiveValue == "boolean")
			builder.Append(this.primitiveValue.toString().toLowerCase());
		else if (typeof this.primitiveValue == "string")
		{
			var unpaddedString = <string>this.primitiveValue;
			if (unpaddedString.Contains("\"") || unpaddedString.Contains("\n") || unpaddedString.Contains("<<") || unpaddedString.Contains(">>")) // the parser doesn't actually need '<<' and '>>' wrapped for single-line strings, but we do so for consistency
			{
				var literalStartMarkerString = "<<";
				var literalEndMarkerString = ">>";
				while (unpaddedString.Contains(literalStartMarkerString) || unpaddedString.Contains(literalEndMarkerString))
				{
					literalStartMarkerString += "<";
					literalEndMarkerString += ">";
				}
				builder.Append("\"" + literalStartMarkerString + VDFNode.PadString(unpaddedString) + literalEndMarkerString + "\"");
			}
			else
				builder.Append("\"" + unpaddedString + "\"");
		}
		else if (VDF.GetIsTypePrimitive(VDF.GetTypeNameOfObject(this.primitiveValue))) // if number
			builder.Append(options.useNumberTrimming && this.primitiveValue.toString().StartsWith("0.") ? this.primitiveValue.toString().substr(1) : this.primitiveValue);
		else
			builder.Append("\"" + this.primitiveValue + "\"");

		if (options.useChildPopOut && this.childPopOut)
		{
			if (this.isMap || this.mapChildren.Count > 0)
				builder.Append(this.mapChildren.Count > 0 ? "{^}" : "{}");
			if (this.isList || this.listChildren.Count > 0)
				builder.Append(this.listChildren.Count > 0 ? "[^]" : "[]");
		}
		else
		{
			if (this.isMap || this.mapChildren.Count > 0)
			{
				builder.Append("{");
				for (var key in this.mapChildren.Keys)
					builder.Append((key == Object.keys(this.mapChildren.Keys)[0] ? "" : (options.useCommaSeparators ? "," : " ")) + (options.useStringKeys ? "\"" : "") + key + (options.useStringKeys ? "\"" : "") + ":" + this.mapChildren[key].ToVDF_InlinePart(options, tabDepth));
				builder.Append("}");
			}
			if (this.isList || this.listChildren.Count > 0)
			{
				builder.Append("[");
				for (var i = 0; i < this.listChildren.Count; i++)
					builder.Append((i == 0 ? "" : (options.useCommaSeparators ? "," : " ")) + this.listChildren[i].ToVDF_InlinePart(options, tabDepth));
				builder.Append("]");
			}
		}

		return builder.ToString();
	}
	ToVDF_PoppedOutPart(options: VDFSaveOptions = null, tabDepth = 0): string
	{
		options = options || new VDFSaveOptions();

		var builder = new StringBuilder();

		// include popped-out-content of direct children (i.e. a single directly-under group)
		if (options.useChildPopOut && this.childPopOut)
		{
			var childTabStr = "";
			for (var i = 0; i < tabDepth + 1; i++)
				childTabStr += "\t";
			if (this.isMap || this.mapChildren.Count > 0)
				for (var key in this.mapChildren.Keys)
				{
					builder.Append("\n" + childTabStr + (options.useStringKeys ? "\"" : "") + key + (options.useStringKeys ? "\"" : "") + ":" + this.mapChildren[key].ToVDF_InlinePart(options, tabDepth + 1));
					var poppedOutChildText: string = this.mapChildren[key].ToVDF_PoppedOutPart(options, tabDepth + 1);
					if (poppedOutChildText.length > 0)
						builder.Append(poppedOutChildText);
				}
			if (this.isList || this.listChildren.Count > 0)
				for (var i in this.listChildren.Indexes())
				{
					var item = this.listChildren[i];
					builder.Append("\n" + childTabStr + item.ToVDF_InlinePart(options, tabDepth + 1));
					var poppedOutChildText = item.ToVDF_PoppedOutPart(options, tabDepth + 1);
					if (poppedOutChildText.length > 0)
						builder.Append(poppedOutChildText);
				}
		}
		else // include popped-out-content of inline-items' descendents (i.e. one or more pulled-up groups)
		{
			var poppedOutChildTexts = new List<string>("string");
			var poppedOutChildText: string;
			if (this.isMap || this.mapChildren.Count > 0)
				for (var key in this.mapChildren.Keys)
					if ((poppedOutChildText = this.mapChildren[key].ToVDF_PoppedOutPart(options, tabDepth)).length)
						poppedOutChildTexts.Add(poppedOutChildText);
			if (this.isList || this.listChildren.Count > 0)
				for (var i in this.listChildren.Indexes())
					if ((poppedOutChildText = this.listChildren[i].ToVDF_PoppedOutPart(options, tabDepth)).length)
						poppedOutChildTexts.Add(poppedOutChildText);
			for (var i = 0; i < poppedOutChildTexts.Count; i++)
			{
				poppedOutChildText = poppedOutChildTexts[i];
				var insertPoint = 0;
				while (poppedOutChildText[insertPoint] == '\n' || poppedOutChildText[insertPoint] == '\t')
					insertPoint++;
				builder.Append((insertPoint > 0 ? poppedOutChildText.substr(0, insertPoint) : "") + (i == 0 ? "" : "^") + poppedOutChildText.substr(insertPoint));
			}
		}

		return builder.ToString();
	}

	// loading
	// ==================

	public static CreateNewInstanceOfType(typeName: string)
	{
		var typeNameRoot = VDF.GetTypeNameRoot(typeName);
		var genericParameters = VDF.GetGenericArgumentsOfType(typeName);
		if (typeNameRoot == "List")
			return new List(genericParameters[0]);
		if (typeNameRoot == "Dictionary")
			return new Dictionary(genericParameters[0], genericParameters[1]);
		if (!(window[typeNameRoot] instanceof Function))
			throw new Error("Could not find type \"" + typeName + "\".");
		return new window[typeNameRoot]; // maybe todo: add code that resets props to their nulled-out/zeroed-out values (or just don't use any constructors, and just remember to set the __proto__ property afterward)
	}
	static GetCompatibleTypeNameForNode(node: VDFNode) { return node.mapChildren.Count ? "object" : (node.listChildren.length ? "List(object)" : "string"); }

	ToObject(options: VDFLoadOptions): any;
	ToObject(declaredTypeName?: string, options?: VDFLoadOptions, path?: VDFNodePath): any;
	ToObject(declaredTypeName_orOptions?: any, options = new VDFLoadOptions(), path?: VDFNodePath): any
	{
		if (declaredTypeName_orOptions instanceof VDFLoadOptions)
			return this.ToObject(null, declaredTypeName_orOptions);

		var declaredTypeName: string = declaredTypeName_orOptions;

		path = path || new VDFNodePath(new VDFNodePathNode());

		var fromVDFTypeName = "object";
		if (this.metadata != null && (window[VDF.GetTypeNameRoot(this.metadata)] instanceof Function || !options.loadUnknownTypesAsBasicTypes))
			fromVDFTypeName = this.metadata;
		else if (typeof this.primitiveValue == "boolean")
			fromVDFTypeName = "bool";
		else if (typeof this.primitiveValue == "number")
			fromVDFTypeName = this.primitiveValue.toString().Contains(".") ? "double" : "int";
		else if (typeof this.primitiveValue == "string")
			fromVDFTypeName = "string";
		else if (this.primitiveValue == null)
			if (this.isList || this.listChildren.Count > 0)
				fromVDFTypeName = "List(object)"; //"array";
			else if (this.isMap || this.mapChildren.Count > 0)
				fromVDFTypeName = "Dictionary(object object)"; //"object-anonymous"; //"object";

		var finalTypeName;
        if (window[VDF.GetTypeNameRoot(declaredTypeName)] instanceof Function || !options.loadUnknownTypesAsBasicTypes)
			finalTypeName = declaredTypeName;
		// porting-note: this is only a limited implementation of CS functionality of making sure from-vdf-type is more specific than declared-type
		if (finalTypeName == null || ["object", "IList", "IDictionary"].Contains(finalTypeName)) // if there is no declared type, or the from-metadata type is more specific than the declared type
			finalTypeName = fromVDFTypeName;
		
		var result;
		var deserializedByCustomMethod = false;
		if (window[finalTypeName] && window[finalTypeName].VDFDeserialize)
		{
			var deserializeResult = window[finalTypeName].VDFDeserialize(this, path, options);
			if (deserializeResult != VDF.NoActionTaken)
			{
				result = deserializeResult;
				deserializedByCustomMethod = true;
			}
		}

		if (!deserializedByCustomMethod)
			if (finalTypeName == "object") {} //result = null;
			else if (EnumValue.IsEnum(finalTypeName)) // helper importer for enums
				result = EnumValue.GetEnumIntForStringValue(finalTypeName, this.primitiveValue);
			else if (VDF.GetIsTypePrimitive(finalTypeName)) //primitiveValue != null)
				result = this.primitiveValue; //Convert.ChangeType(primitiveValue, finalType); //primitiveValue;
			else
				if (this.primitiveValue != null || this.isList || this.isMap)
				{
					result = VDFNode.CreateNewInstanceOfType(finalTypeName);
					path.currentNode.obj = result;
					this.IntoObject(result, options, path);
				}
		path.currentNode.obj = result; // in case post-deserialize method was attached as extra-method to the object, that makes use of the (basically useless) path.currentNode.obj property
		
		return result;
	}
	IntoObject(obj: any, options: VDFLoadOptions = null, path?: VDFNodePath): void
	{
		options = options || new VDFLoadOptions();
		path = path || new VDFNodePath(new VDFNodePathNode(obj));

		var typeName = VDF.GetTypeNameOfObject(obj);
		var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
		var typeInfo = VDFTypeInfo.Get(typeName);

		if (obj && obj.VDFPreDeserialize)
			obj.VDFPreDeserialize(this, path, options);

		var deserializedByCustomMethod2 = false;
		if (obj.VDFDeserialize)
		{
			var deserializeResult = obj.VDFDeserialize(this, path, options);
			if (deserializeResult != VDF.NoActionTaken)
				deserializedByCustomMethod2 = true;
		}

		if (!deserializedByCustomMethod2)
		{
			for (var i = 0; i < this.listChildren.Count; i++)
			//obj.Add(this.listChildren[i].ToObject(typeGenericArgs[0], options, path.ExtendAsListChild(i, this.listChildren[i])));
            {
            	var item = this.listChildren[i].ToObject(typeGenericArgs[0], options, path.ExtendAsListChild(i, this.listChildren[i]));
	            if (obj.Count == i) // maybe temp; allow child to have already attached itself (by way of the VDF event methods)
		            obj.Add(item);
            }
			for (var keyString in this.mapChildren.Keys)
				try
				{
					if (obj instanceof Dictionary) //is IDictionary)
					{
						var key = VDF.Deserialize("\"" + keyString + "\"", typeGenericArgs[0], options);
						//obj.Add(key, this.mapChildren[keyString].ToObject(typeGenericArgs[1], options, path.ExtendAsMapChild(key, null)));
						obj.Set(key, this.mapChildren[keyString].ToObject(typeGenericArgs[1], options, path.ExtendAsMapChild(key, null))); // "obj" prop to be filled in at end of ToObject method // maybe temp; allow child to have already attached itself (by way of the VDF event methods)
					}
					else
						obj[keyString] = this.mapChildren[keyString].ToObject(typeInfo.props[keyString] && typeInfo.props[keyString].propTypeName, options, path.ExtendAsChild(typeInfo.props[keyString] || {propName: keyString}, null));
				}
			catch(ex) { ex.message += "\n==================\nRethrownAs) " + ("Error loading map-child with key '" + keyString + "'.") + "\n"; throw ex; }
		}

		if (obj && obj.VDFPostDeserialize)
			obj.VDFPostDeserialize(this, path, options);
	}
}
//VDFUtils.MakePropertiesHidden(VDFNode.prototype, true);

VDF.NoActionTaken = new VDFNode();
VDF.CancelSerialize = new VDFNode();
VDF.CancelSerializeForProp = new VDFNode();