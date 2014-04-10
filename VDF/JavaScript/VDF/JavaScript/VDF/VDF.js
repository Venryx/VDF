var VDF_SetUp;
(function (VDF_SetUp) {
    function LoadJSFile(path) {
        var script = document.createElement('script');
        script.setAttribute("src", path);
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    LoadJSFile("../VDF/VDFExtensions.js");
    LoadJSFile("../VDF/VDFTypeInfo.js");
    LoadJSFile("../VDF/VDFNode.js");
    LoadJSFile("../VDF/VDFSaver.js");
    LoadJSFile("../VDF/VDFLoader.js");
    LoadJSFile("../VDF/VDFTokenParser.js");

    // the below let's you add type-info easily (e.g. "obj.SetTypeInfo(new VDFTypeInfo());"), and without that type-info being enumerated as a field/property
    Object.defineProperty(Object.prototype, "SetTypeInfo", {
        enumerable: false,
        value: function (x) {
            if (this["typeInfo"])
                delete this["typeInfo"];
            if (!this["typeInfo"])
                Object.defineProperty(this, "typeInfo", {
                    enumerable: false,
                    value: x
                });
        }
    });
    Object.defineProperty(Object.prototype, "GetTypeName", {
        enumerable: false,
        value: function () {
            var results = this["constructor"].toString().match(/function (.{1,})\(/);
            return (results && results.length > 1) ? results[1] : "";
        }
    });
})(VDF_SetUp || (VDF_SetUp = {}));

var VDF = (function () {
    function VDF() {
    }
    VDF.RegisterTypeExporter_Inline = function (type, exporter) {
        VDF.typeExporters_inline[type] = exporter;
    };
    VDF.RegisterTypeImporter_Inline = function (type, importer) {
        VDF.typeImporters_inline[type] = importer;
    };

    VDF.GetVTypeNameOfObject = function (obj) {
        if (obj["realVTypeName"])
            return obj["realVTypeName"];
        var type = obj.GetTypeName();
        if (type == "Boolean")
            return "bool";
        if (type == "Number")
            return "float";
        if (type == "String")
            return "string";
        return type;
    };

    VDF.Serialize = function (obj, saveOptions) {
        return VDFSaver.ToVDFNode(obj, saveOptions).ToString();
    };
    VDF.typeExporters_inline = {};
    VDF.typeImporters_inline = {};

    VDF.AnyMember = "#AnyMember";
    VDF.AllMembers = ["#AnyMember"];
    return VDF;
})();

var EnumValue = (function () {
    function EnumValue(realVTypeName, intValue) {
        this.realVTypeName = realVTypeName;
        this.intValue = intValue;
        this.stringValue = eval(realVTypeName + "[" + intValue + "]");
    }
    EnumValue.prototype.toString = function () {
        return this.stringValue;
    };
    return EnumValue;
})();

function new_List(itemType) {
    var items = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        items[_i] = arguments[_i + 1];
    }
    var result = items || [];
    result.AddItem("realVTypeName", "List[" + itemType + "]");
    result.itemType = itemType;
    return result;
}

function new_Dictionary(keyType, valueType) {
    var keyValuePairs = [];
    for (var _i = 0; _i < (arguments.length - 2); _i++) {
        keyValuePairs[_i] = arguments[_i + 2];
    }
    var result = new Map();
    result.AddItem("realVTypeName", "Dictionary[" + keyType + "," + valueType + "]");
    result.keyType = keyType;
    result.valueType = valueType;
    if (keyValuePairs)
        for (var i = 0; i < keyValuePairs.length; i++)
            result.set(keyValuePairs[i][0], keyValuePairs[i][1]);
    return result;
}
/*class List<T>
{
itemType: string;
data: T[];
get length() { return this.data.length; }
constructor(itemType: string, ...args: T[])
{
this.itemType = itemType;
this.data = args || [];
}
toString(): string { return this.data.toString(); }
toLocaleString(): string { return this.data.toLocaleString(); }
//concat<U extends T[]>(...items: U[]): T[]
//concat(...items: T[]): T[]
concat(...items): T[] { return this.data.concat.apply(this, items); }
join(separator?: string): string { return this.data.join.apply(separator); }
pop(): T { return this.data.pop(); }
push(...items: T[]): number { return this.data.push.apply(this.data, items); } // note; for some reason had to use 'this.data' instead of 'this'
reverse(): T[] { return this.data.reverse(); }
shift(): T { return this.data.shift(); }
slice(start?: number, end?: number): T[] { return this.data.slice(start, end); }
sort(compareFn?: (a: T, b: T) => number): T[] { return this.data.sort(compareFn); }
//splice(start: number): T[] { return this.data.splice(start); }
//splice(start: number, deleteCount: number, ...items: T[]): T[]
splice(...args): T[] { return this.data.splice.apply(this, args); }
unshift(...items: T[]): number { return this.data.unshift.apply(this, items); }
indexOf(searchElement: T, fromIndex?: number): number { return this.data.indexOf(searchElement, fromIndex); }
lastIndexOf(searchElement: T, fromIndex?: number): number { return this.data.lastIndexOf(searchElement, fromIndex); }
every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean { return this.data.every(callbackfn, thisArg); }
some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean { return this.data.some(callbackfn, thisArg); }
forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void { return this.data.forEach(callbackfn, thisArg); }
map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] { return this.data.map<U>(callbackfn, thisArg); }
filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[] { return this.data.filter(callbackfn, thisArg); }
//reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T
//reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
reduce(...args) { return this.data.reduce.apply(this, args); }
//reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T
//reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
reduceRight(...args) { return this.data.reduceRight.apply(this, args); }
[n: number]: T;
contains(obj: T): boolean { return this.data.contains(obj); }
last(): T { return this.data.last(); }
pushAll(array) { return this.data.pushAll(array); }
indexes(): number[] { return this.data.indexes(); }
strings(): string[] { return this.data.strings(); }
remove(obj: T) { return this.data.remove(obj); }
//filter(matchFunc): T[] { return this.data.filter(matchFunc); }
clear() { return this.data.clear(); }
first(matchFunc?): T { return this.data.first(matchFunc); }
insert(index: number, obj: T) { return this.data.insert(index, obj); }
}
class Dictionary<K, V> implements Map<K, V>
{
itemType: string;
data: Map<K, V>;
get size() { return this.data.size; }
constructor(itemType: string, data: Map<K, V>)
{
this.itemType = itemType;
this.data = data;
}
clear() { this.data.clear(); }
delete(key: K): boolean { return this.data.delete(key); }
forEach(callbackFunc: (value: V, index: K, dictionary: Dictionary<K, V>) => void, thisArg?: any): void
{
this.data.forEach((value: V, key: K, map: Map<K, V>) => callbackFunc(value, key, this));
}
get(key: K): V { return this.data.get(key); }
has(key: K): boolean { return this.data.has(key); }
set(key: K, value: V): Map<K, V> { return this.data.set(key, value); }
}*/
//# sourceMappingURL=VDF.js.map
