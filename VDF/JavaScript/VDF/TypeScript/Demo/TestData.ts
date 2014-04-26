module Test1
{
	export function CreateWorld(): World
	{
		var world = new World("Main");
		world.simpleFlag = true;
		world.listOfStringLists.pushAll([new List("string", "1A", "1B", "1C"), new List("string", "2A", "2B", "2C"), new List("string", "3A", "3B", "3C")]);

		var soils = world.vObjectRoot.AddChild(new VObject("Soils"));
		var grass = soils.AddChild(new VObject("Grass"));
		grass.AddDuty(new HoldSoil("Grass.png"));
		var dirt = soils.AddChild(new VObject("Dirt"));
		dirt.AddDuty(new HoldSoil("Dirt.png"));

		var items = world.vObjectRoot.AddChild(new VObject("Items"));
		items.AddDuty(new Special1(Color.White, .5));
		items.AddChild(new VObject("NameThat{NeedsEscaping@gmail.com}"));
		var camera = items.AddChild(new VObject("Camera"));
		camera.AddDuty(new HoldTransform(new Vector3(1, 9, 2), new Vector3(25.5, 28.9, 2404.765), new Vector3(3, 4, 1)));
		camera.AddDuty(new HoldMesh
		(
			new List("Vector3", new Vector3(9, 4, 2.5), new Vector3(1, 8, 9.5435), new Vector3(25, 15, 5)),
			new Dictionary<Vector3, Color>("Vector3", "Color", [new Vector3(9, 4, 2.5), Color.Black], [new Vector3(1, 8, 9.5435), Color.Gray], [new Vector3(25, 15, 5), Color.White]
		)));
		var holdDuties1A = <HoldDuties>camera.AddDuty(new HoldDuties("SelfIsInWorld"));
		holdDuties1A.AddDuty(new MoveSelfToInventory());
		holdDuties1A.AddDuty(new RenderMesh());
		var holdDuties1B = <HoldDuties>camera.AddDuty(new HoldDuties("!SelfIsInWorld"));
		holdDuties1B.AddDuty(new MoveSelfToWorld());
		var gardenHoe = items.AddChild(new VObject("GardenHoe"));
		gardenHoe.AddDuty(new HoldTransform());
		gardenHoe.AddDuty(new HoldMesh(new List<Vector3>("Vector3"), new Dictionary<Vector3, Color>("Vector3", "Color")));

		return world;
	}
}

enum SimpleEnum { _IsEnum, A, B, C }
class World
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		name: new VDFPropInfo("string", true),
		vObjectRoot: new VDFPropInfo("VObject", true),
		stringPropNull: new VDFPropInfo("string", true),
		simpleFlag: new VDFPropInfo("bool", true),
		simpleEnum: new VDFPropInfo("SimpleEnum", true),
		listOfStringLists: new VDFPropInfo("List[List[string]]", true)
	});

	name: string;
	vObjectRoot: VObject;
	stringPropNull: string;
	simpleFlag: boolean;
	simpleEnum: SimpleEnum;
	listOfStringLists: List<List<string>>;

	constructor(name: string)
	{
		this.name = name;
		this.vObjectRoot = new VObject("VObjectRoot");
		this.simpleFlag = false; // this has to be initialized to something, right here, to get it ordered/positioned correctly in the save file
		this.simpleEnum = SimpleEnum.A;
		this.listOfStringLists = new List<List<string>>("List[string]");
	}
}

class VObject
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, 
	{
		id: new VDFPropInfo("Guid", true), // todo; rather than marking this here manually, have it marked by the at-runtime system described above
		name: new VDFPropInfo("string", true),
		duties: new VDFPropInfo("List[Duty]", true, false, true, false),
		children: new VDFPropInfo("List[VObject]", true, false, true, false)
	});

	parent: VObject;

	id: Guid; // note; this prop is not marked to be included here, but ends up being added anyway, by being marked in the VDFSaveOptions object of the VDF.Serialize method call; todo; implement this system, as in C# version
	name: string;
	duties: List<Duty>;
	children: List<VObject>;

	constructor(name: string)
	{
		this.id = new Guid();
		this.name = name;
		this.duties = new List("Duty");
		this.children = new List<VObject>("VObject");
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
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false, { texturePath: new VDFPropInfo("string", true) });

	texturePath: string;
	constructor(texturePath: string)
	{
		super();
		this.texturePath = texturePath;
	}
}
enum Color { _IsEnum, Red, Green, Blue, White, Gray, Black }
class Special1 extends Duty
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		color: new VDFPropInfo("Color", true),
		brightness: new VDFPropInfo("float", true)
	});

	color: Color;
	brightness: number;
	constructor(color: Color, brightness: number)
	{
		super();
		this.color = color;
		this.brightness = brightness;
	}
}
class HoldTransform extends Duty
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		position: new VDFPropInfo("Vector3", true),
		rotation: new VDFPropInfo("Vector3", true),
		scale: new VDFPropInfo("Vector3", true)
	});

	position: Vector3;
	rotation: Vector3;
	scale: Vector3;
	constructor(position?: Vector3, rotation?: Vector3, scale?: Vector3)
	{
		super();
		this.position = position || new Vector3(0, 0, 0);
		this.rotation = rotation || new Vector3(0, 0, 0);
		this.scale = scale || new Vector3(0, 0, 0);
	}
}
class HoldMesh extends Duty
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		vertexes: new VDFPropInfo("List[Vector3]", true),
		vertexColors: new VDFPropInfo("Dictionary[Vector3,Color]", true)
	});

	vertexes: List<Vector3>;
	vertexColors: Dictionary<Vector3, Color>;
	constructor(vertexes: List<Vector3>, vertexColors: Dictionary<Vector3, Color>)
	{
		super();
		this.vertexes = vertexes;
		this.vertexColors = vertexColors;
	}
}
class HoldDuties extends Duty
{
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(false,
	{
		dutiesEnabledWhen: new VDFPropInfo("string", true),
		duties: new VDFPropInfo("List[Duty]", true, false, true, false)
	});

	dutiesEnabledWhen: string;
	duties: List<Duty>;

	constructor(dutiesEnabledWhen: string)
	{
		super();
		this.dutiesEnabledWhen = dutiesEnabledWhen;
		this.duties = new List("Duty");
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
	static typeInfo: VDFTypeInfo = new VDFTypeInfo(true);

	x: number;
	y: number;
	z: number;
	constructor(x: number, y: number, z: number)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
}

class Guid
{
	dataString: string;
	constructor(dataString?: string)
	{
		this.dataString = dataString || (Math.random() * 1000).toString();
	}
}