var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Test1;
(function (Test1) {
    function CreateWorld() {
        var world = new World("Main");
        world.listOfStringLists.pushAll([new_List("string", "1A", "1B", "1C"), new_List("string", "2A", "2B", "2C"), new_List("string", "3A", "3B", "3C")]);

        var soils = world.vObjectRoot.AddChild(new VObject("Soils"));
        var grass = soils.AddChild(new VObject("Grass"));
        grass.AddDuty(new HoldSoil("Grass.png"));
        var dirt = soils.AddChild(new VObject("Dirt"));
        dirt.AddDuty(new HoldSoil("Dirt.png"));

        var items = world.vObjectRoot.AddChild(new VObject("Items"));
        items.AddDuty(new Special1(4 /* White */, .5));
        items.AddChild(new VObject("NameThat{NeedsEscaping@gmail.com}"));
        var camera = items.AddChild(new VObject("Camera"));
        camera.AddDuty(new HoldTransform(new Vector3(1, 9, 2), new Vector3(25.5, 28.9, 2404.765), new Vector3(3, 4, 1)));
        camera.AddDuty(new HoldMesh(new_List("Vector3", new Vector3(9, 4, 2.5), new Vector3(1, 8, 9.5435), new Vector3(25, 15, 5)), new_Dictionary("Vector3", "Color", [new Vector3(9, 4, 2.5), 6 /* Black */], [new Vector3(1, 8, 9.5435), 5 /* Gray */], [new Vector3(25, 15, 5), 4 /* White */])));
        var holdDuties1A = camera.AddDuty(new HoldDuties("SelfIsInWorld"));
        holdDuties1A.AddDuty(new MoveSelfToInventory());
        holdDuties1A.AddDuty(new RenderMesh());
        var holdDuties1B = camera.AddDuty(new HoldDuties("!SelfIsInWorld"));
        holdDuties1B.AddDuty(new MoveSelfToWorld());
        var gardenHoe = items.AddChild(new VObject("GardenHoe"));
        gardenHoe.AddDuty(new HoldTransform());
        gardenHoe.AddDuty(new HoldMesh(new_List("Vector3"), new_Dictionary("Vector3", "Color")));

        return world;
    }
    Test1.CreateWorld = CreateWorld;
})(Test1 || (Test1 = {}));

var World = (function () {
    function World(name) {
        this.name = name;
        this.vObjectRoot = new VObject("VObjectRoot");
        this.listOfStringLists = new_List("List[string]");
    }
    World.typeInfo = new VDFTypeInfo(false, {
        name: new VDFPropInfo("string", true),
        vObjectRoot: new VDFPropInfo("VObject", true),
        listOfStringLists: new VDFPropInfo("List[List[string]]", true)
    });
    return World;
})();

var VObject = (function () {
    function VObject(name) {
        this.id = new Guid();
        this.name = name;
        this.duties = new_List("Duty");
        this.children = new_List("VObject");
    }
    VObject.prototype.AddDuty = function (duty) {
        this.duties.push(duty);
        return duty;
    };
    VObject.prototype.RemoveDuty = function (duty) {
        this.duties.remove(duty);
    };
    VObject.prototype.AddChild = function (child) {
        this.children.push(child);
        child.parent = this;
        return child;
    };
    VObject.prototype.RemoveChild = function (child) {
        this.children.remove(child);
        child.parent = null;
    };
    VObject.typeInfo = new VDFTypeInfo(false, {
        id: new VDFPropInfo("Guid", true),
        name: new VDFPropInfo("string", true),
        duties: new VDFPropInfo("List[Duty]", true, true, true),
        children: new VDFPropInfo("List[VObject]", true, true, true)
    });
    return VObject;
})();

var Duty = (function () {
    function Duty() {
    }
    return Duty;
})();
var HoldSoil = (function (_super) {
    __extends(HoldSoil, _super);
    function HoldSoil(texturePath) {
        _super.call(this);
        this.texturePath = texturePath;
    }
    HoldSoil.typeInfo = new VDFTypeInfo(false, { texturePath: new VDFPropInfo("string", true) });
    return HoldSoil;
})(Duty);
var Color;
(function (Color) {
    Color[Color["_IsEnum"] = 0] = "_IsEnum";
    Color[Color["Red"] = 1] = "Red";
    Color[Color["Green"] = 2] = "Green";
    Color[Color["Blue"] = 3] = "Blue";
    Color[Color["White"] = 4] = "White";
    Color[Color["Gray"] = 5] = "Gray";
    Color[Color["Black"] = 6] = "Black";
})(Color || (Color = {}));
var Special1 = (function (_super) {
    __extends(Special1, _super);
    function Special1(color, brightness) {
        _super.call(this);
        this.color = color;
        this.brightness = brightness;
    }
    Special1.typeInfo = new VDFTypeInfo(false, {
        color: new VDFPropInfo("Color", true),
        brightness: new VDFPropInfo("float", true)
    });
    return Special1;
})(Duty);
var HoldTransform = (function (_super) {
    __extends(HoldTransform, _super);
    function HoldTransform(position, rotation, scale) {
        _super.call(this);
        this.position = position || new Vector3(0, 0, 0);
        this.rotation = rotation || new Vector3(0, 0, 0);
        this.scale = scale || new Vector3(0, 0, 0);
    }
    HoldTransform.typeInfo = new VDFTypeInfo(false, {
        position: new VDFPropInfo("Vector3", true),
        rotation: new VDFPropInfo("Vector3", true),
        scale: new VDFPropInfo("Vector3", true)
    });
    return HoldTransform;
})(Duty);
var HoldMesh = (function (_super) {
    __extends(HoldMesh, _super);
    function HoldMesh(vertexes, vertexColors) {
        _super.call(this);
        this.vertexes = vertexes;
        this.vertexColors = vertexColors;
    }
    HoldMesh.typeInfo = new VDFTypeInfo(false, {
        vertexes: new VDFPropInfo("List[Vector3]", true),
        vertexColors: new VDFPropInfo("Dictionary[Vector3,Color]", true)
    });
    return HoldMesh;
})(Duty);
var HoldDuties = (function (_super) {
    __extends(HoldDuties, _super);
    function HoldDuties(dutiesEnabledWhen) {
        _super.call(this);
        this.dutiesEnabledWhen = dutiesEnabledWhen;
        this.duties = new_List("Duty");
    }
    HoldDuties.prototype.AddDuty = function (duty) {
        this.duties.push(duty);
        return duty;
    };
    HoldDuties.prototype.RemoveDuty = function (duty) {
        this.duties.remove(duty);
    };
    HoldDuties.typeInfo = new VDFTypeInfo(false, {
        dutiesEnabledWhen: new VDFPropInfo("string", true),
        duties: new VDFPropInfo("List[Duty]", true, true, true)
    });
    return HoldDuties;
})(Duty);

var MoveSelfToInventory = (function (_super) {
    __extends(MoveSelfToInventory, _super);
    function MoveSelfToInventory() {
        _super.apply(this, arguments);
    }
    return MoveSelfToInventory;
})(Duty);
var RenderMesh = (function (_super) {
    __extends(RenderMesh, _super);
    function RenderMesh() {
        _super.apply(this, arguments);
    }
    return RenderMesh;
})(Duty);
var MoveSelfToWorld = (function (_super) {
    __extends(MoveSelfToWorld, _super);
    function MoveSelfToWorld() {
        _super.apply(this, arguments);
    }
    return MoveSelfToWorld;
})(Duty);

var Vector3 = (function () {
    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    Vector3.typeInfo = new VDFTypeInfo(true);
    return Vector3;
})();

var Guid = (function () {
    function Guid(dataString) {
        this.dataString = dataString || (Math.random() * 1000).toString();
    }
    return Guid;
})();
//# sourceMappingURL=TestData.js.map
