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

		return world;
	}
}

class World
{
	name: string;
	vObjectRoot: VObject;
	listOfStringLists: Array<Array<string>>;

	constructor(name: string)
	{
		this.name = name;
		this.vObjectRoot = new VObject("VObjectRoot");
		this.listOfStringLists = [["1A", "1B", "1C"], ["2A", "2B", "2C"], ["3A", "3B", "3C"]];

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("name", new VDFPropInfo("String", true));
		typeInfo.SetPropInfo("vObjectRoot", new VDFPropInfo("VObject", true));
		typeInfo.SetPropInfo("listOfStringLists", new VDFPropInfo("Array[Array[string]]", true)); // todo; fix [within-array-items array-items]-not-knowing-their-declared-type issue.
		this.SetTypeInfo(typeInfo);
	}
}

class VObject
{
	parent: VObject;

	id: number; // note; this prop is not marked to be included here, but ends up being added anyway, by being marked in the VDFSaveOptions object of the VDF.Serialize method call; todo
	name: string;
	duties: Array<Duty>;
	children: Array<VObject>;

	constructor(name: string)
	{
		this.id = parseInt((Math.random() * 1000).toString());
		this.name = name;
		this.duties = [];
		this.children = [];

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("name", new VDFPropInfo("String", true));
		typeInfo.SetPropInfo("duties", new VDFPropInfo("Array[Duty]", true, true, true));
		typeInfo.SetPropInfo("children", new VDFPropInfo("Array[VObject]", true, true, true));
		this.SetTypeInfo(typeInfo);
	}

	AddDuty(duty: Duty):Duty
	{
		this.duties.push(duty);
		return duty;
	}
	RemoveDuty(duty: Duty) { this.duties.remove(duty); }
	AddChild(child: VObject): VObject
	{
		this.children.push(child);
		child.parent = this;
		return child;
	}
	RemoveChild(child: VObject)
	{
		this.children.remove(child);
		child.parent = null;
	}
}

class Duty {}
class HoldSoil extends Duty
{
	texturePath: string;
	constructor(texturePath: string)
	{
		super();
		this.texturePath = texturePath;

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("texturePath", new VDFPropInfo("String", true));
		this.SetTypeInfo(typeInfo);
	}
}
enum Color { Red, Green, Blue, White, Gray, Black }
class Special1 extends Duty
{
	color: Color;
	brightness: number;
	constructor(color: Color, brightness: number)
	{
		super();
		this.color = color;
		this.brightness = brightness;

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("color", new VDFPropInfo("Color", true));
		typeInfo.SetPropInfo("brightness", new VDFPropInfo("Number", true));
		this.SetTypeInfo(typeInfo);
	}
}
class HoldTransform extends Duty
{
	position: Vector3;
	rotation: Vector3;
	scale: Vector3;
	constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3)
	{
		super();
		this.position = position || new Vector3(0, 0, 0);
		this.rotation = rotation || new Vector3(0, 0, 0);
		this.scale = scale || new Vector3(0, 0, 0);

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("position", new VDFPropInfo("Vector3", true));
		typeInfo.SetPropInfo("rotation", new VDFPropInfo("Vector3", true));
		typeInfo.SetPropInfo("scale", new VDFPropInfo("Vector3", true));
		this.SetTypeInfo(typeInfo);
	}
}
class HoldMesh extends Duty
{
	vertexes: Array<Vector3>;
	vertexColors: Map<Vector3, Color>;
	constructor(vertexes: Array<Vector3>, vertexColors: Map<Vector3, Color>)
	{
		super();
		this.vertexes = vertexes;
		this.vertexColors = vertexColors;

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("vertexes", new VDFPropInfo("Array[Vector3]", true));
		typeInfo.SetPropInfo("vertexColors", new VDFPropInfo("VMap[Vector3, Color]", true));
		this.SetTypeInfo(typeInfo);
	}
}
class HoldDuties extends Duty
{
	dutiesEnabledWhen: string;
	duties: Array<Duty>;

	constructor(dutiesEnabledWhen: string)
	{
		super();
		this.dutiesEnabledWhen = dutiesEnabledWhen;
		this.duties = [];

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("dutiesEnabledWhen", new VDFPropInfo("String", true));
		typeInfo.SetPropInfo("duties", new VDFPropInfo("Array[Duty]", true, true, true));
		this.SetTypeInfo(typeInfo);
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
	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number)
	{
		this.x = x;
		this.y = y;
		this.z = z;

		var typeInfo = new VDFTypeInfo(true);
		typeInfo.SetPropInfo("x", new VDFPropInfo("Number"));
		typeInfo.SetPropInfo("y", new VDFPropInfo("Number"));
		typeInfo.SetPropInfo("z", new VDFPropInfo("Number"));
		this.SetTypeInfo(typeInfo);
	}
}