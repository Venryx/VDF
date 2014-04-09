module Test1
{
	export function CreateWorld(): World
	{
		var world = new World("Main");

		var soils = world.vObjectRoot.AddChild(new VObject("Soils"));
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
		(function ()
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
		holdDuties2B.AddDuty(new MoveSelfToWorld());

		return world;
	}
}

class World
{
	public name: string;
	public vObjectRoot: VObject;
	public listOfStringLists: Array<Array<string>>;

	constructor(name:string)
	{
		this.name = name;
		this.vObjectRoot = new VObject("VObjectRoot");
		this.listOfStringLists = [["1A", "1B", "1C"], ["2A", "2B", "2C"], ["3A", "3B", "3C"]];
	}
}

class VObject
{
	public id: number; // note; this prop is not marked to be included here, but ends up being added anyway, by being marked in the VDFSaveOptions object of the VDF.Serialize method call
	public name: string;
	public duties: Array<Duty>;
	public children: Array<VObject>;

	constructor(name: string)
	{
		this.id = parseInt((Math.random() * 1000).toString());
		this.name = name;
		this.duties = [];
		this.children = [];
	}

	AddDuty(duty: Duty):Duty
	{
		this.duties.push(duty);
		return duty;
	}
	RemoveDuty(duty: Duty) { this.duties.remove(duty); }
	public AddChild(child: VObject): VObject
	{
		this.children.push(child);
		return child;
	}
	RemoveChild(child: VObject)
	{
		this.children.remove(child);
	}
}

class Duty {}
class HoldSoil extends Duty
{
	public texturePath: string;
	constructor(texturePath: string)
	{
		super();
		this.texturePath = texturePath;
	}
}
enum Color { Red, Green, Blue, White, Gray, Black }
class Special1 extends Duty
{
	public color: Color;
	public brightness: number;
	constructor(color: Color, brightness: number)
	{
		super();
		this.color = color;
		this.brightness = brightness;
	}
}
class HoldTransform extends Duty
{
	public position: Vector3;
	public rotation: Vector3;
	public scale: Vector3;
	constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3)
	{
		super();
		this.position = position;
		this.rotation = rotation;
		this.scale = scale;
	}
}
class HoldMesh extends Duty
{
	public vertexes: Array<Vector3>;
	public vertexColors: Map<Vector3, Color>;
	constructor(vertexes: Array<Vector3>, vertexColors: Map<Vector3, Color>)
	{
		super();
		this.vertexes = vertexes;
		this.vertexColors = vertexColors;
	}
}
class HoldDuties extends Duty
{
	public dutiesEnabledWhen: string;
	public duties: Array<Duty>;

	constructor(dutiesEnabledWhen: string)
	{
		super();
		this.dutiesEnabledWhen = dutiesEnabledWhen;
		this.duties = [];
	}

	AddDuty(duty: Duty): Duty
	{
		this.duties.push(duty);
		return duty;
	}
	RemoveDuty(duty: Duty) { this.duties.remove(duty); }
}
class MoveSelfToInventory extends Duty {}
class RenderMesh extends Duty {}
class MoveSelfToWorld extends Duty {}

class Vector3
{
	public x: number;
	public y: number;
	public z: number;
	constructor(x: number, y: number, z: number)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
}