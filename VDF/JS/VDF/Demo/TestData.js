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

        /*var soils = world.vObjectRoot.AddChild(new VObject("Soils"));
        var grass = soils.AddChild(new VObject("Grass"));
        grass.AddDuty(new HoldSoil("Grass.png"));
        var dirt = soils.AddChild(new VObject("Dirt"));
        dirt.AddDuty(new HoldSoil("Dirt.png"));
        
        var items = world.vObjectRoot.AddChild(new VObject("Items"));
        items.AddDuty(new Special1(Color.White, .5));
        items.AddChild(new VObject("NameThat{NeedsEscaping}"));
        var camera = items.AddChild(new VObject("Camera"));
        camera.AddDuty(new HoldTransform(new Vector3(1, 9, 2), new Vector3(25.5, 28.9, 2404.765), new Vector3(3, 4, 1)));
        camera.AddDuty(new HoldMesh(
        [
        new Vector3(9, 4, 2.5), new Vector3(1, 8, 9.5435), new Vector3(25, 15, 5)
        ],
        (() =>
        {
        var newMap = new Map<Vector3, Color>();
        newMap.set(new Vector3(9, 4, 2.5), Color.Black);
        newMap.set(new Vector3(1, 8, 9.5435), Color.Gray);
        newMap.set(new Vector3(25, 15, 5), Color.White);
        return newMap;
        })()));
        var holdDuties1A = <HoldDuties>camera.AddDuty(new HoldDuties("SelfIsInWorld"));
        holdDuties1A.AddDuty(new MoveSelfToInventory());
        holdDuties1A.AddDuty(new RenderMesh());
        var holdDuties1B = <HoldDuties>camera.AddDuty(new HoldDuties("!SelfIsInWorld"));
        holdDuties1B.AddDuty(new MoveSelfToWorld());
        var gardenHoe = items.AddChild(new VObject("GardenHoe"));
        gardenHoe.AddDuty(new HoldTransform());
        gardenHoe.AddDuty(new HoldMesh([], new Map<Vector3, Color>()));
        var holdDuties2A = <HoldDuties>gardenHoe.AddDuty(new HoldDuties("SelfIsInWorld"));
        holdDuties2A.AddDuty(new MoveSelfToInventory());
        holdDuties2A.AddDuty(new RenderMesh());
        var holdDuties2B = <HoldDuties>gardenHoe.AddDuty(new HoldDuties("!SelfIsInWorld"));
        holdDuties2B.AddDuty(new MoveSelfToWorld());*/
        return world;
    }
    Test1.CreateWorld = CreateWorld;
})(Test1 || (Test1 = {}));

var World = (function () {
    function World(name) {
        this.name = name;
        this.vObjectRoot = new VObject("VObjectRoot");
        this.listOfStringLists = [["1A", "1B", "1C"], ["2A", "2B", "2C"], ["3A", "3B", "3C"]];
    }
    return World;
})();

var VObject = (function () {
    function VObject(name) {
        this.id = parseInt((Math.random() * 1000).toString());
        this.name = name;
        this.duties = [];
        this.children = [];
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
        return child;
    };
    VObject.prototype.RemoveChild = function (child) {
        this.children.remove(child);
    };
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
    return HoldSoil;
})(Duty);
var Color;
(function (Color) {
    Color[Color["Red"] = 0] = "Red";
    Color[Color["Green"] = 1] = "Green";
    Color[Color["Blue"] = 2] = "Blue";
    Color[Color["White"] = 3] = "White";
    Color[Color["Gray"] = 4] = "Gray";
    Color[Color["Black"] = 5] = "Black";
})(Color || (Color = {}));
var Special1 = (function (_super) {
    __extends(Special1, _super);
    function Special1(color, brightness) {
        _super.call(this);
        this.color = color;
        this.brightness = brightness;
    }
    return Special1;
})(Duty);
var HoldTransform = (function (_super) {
    __extends(HoldTransform, _super);
    function HoldTransform(position, rotation, scale) {
        _super.call(this);
        this.position = position;
        this.rotation = rotation;
        this.scale = scale;
    }
    return HoldTransform;
})(Duty);
var HoldMesh = (function (_super) {
    __extends(HoldMesh, _super);
    function HoldMesh(vertexes, vertexColors) {
        _super.call(this);
        this.vertexes = vertexes;
        this.vertexColors = vertexColors;
    }
    return HoldMesh;
})(Duty);
var HoldDuties = (function (_super) {
    __extends(HoldDuties, _super);
    function HoldDuties(dutiesEnabledWhen) {
        _super.call(this);
        this.dutiesEnabledWhen = dutiesEnabledWhen;
        this.duties = [];
    }
    HoldDuties.prototype.AddDuty = function (duty) {
        this.duties.push(duty);
        return duty;
    };
    HoldDuties.prototype.RemoveDuty = function (duty) {
        this.duties.remove(duty);
    };
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
    return Vector3;
})();
//# sourceMappingURL=TestData.js.map
