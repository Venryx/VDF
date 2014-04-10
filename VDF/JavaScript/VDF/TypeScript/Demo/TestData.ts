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
		items.AddChild(new VObject("NameThat{NeedsEscaping@gmail.com}"));
		var camera = items.AddChild(new VObject("Camera"));
		camera.AddDuty(new HoldTransform(new Vector3(1, 9, 2), new Vector3(25.5, 28.9, 2404.765), new Vector3(3, 4, 1)));
		camera.AddDuty(new HoldMesh
		(
			new_List("Vector3", new Vector3(9, 4, 2.5), new Vector3(1, 8, 9.5435), new Vector3(25, 15, 5)),
			new_Dictionary<Vector3, Color>("Vector3", "Color", [new Vector3(9, 4, 2.5), Color.Black], [new Vector3(1, 8, 9.5435), Color.Gray], [new Vector3(25, 15, 5), Color.White]
		)));
		var holdDuties1A = <HoldDuties>camera.AddDuty(new HoldDuties("SelfIsInWorld"));
		holdDuties1A.AddDuty(new MoveSelfToInventory());
		holdDuties1A.AddDuty(new RenderMesh());
		var holdDuties1B = <HoldDuties>camera.AddDuty(new HoldDuties("!SelfIsInWorld"));
		holdDuties1B.AddDuty(new MoveSelfToWorld());
		var gardenHoe = items.AddChild(new VObject("GardenHoe"));
		gardenHoe.AddDuty(new HoldTransform());
		gardenHoe.AddDuty(new HoldMesh(new_List<Vector3>("Vector3"), new_Dictionary<Vector3, Color>("Vector3", "Color")));

		return world;
	}
}

class World
{
	name: string;
	vObjectRoot: VObject;
	listOfStringLists: List<List<string>>;

	constructor(name: string)
	{
		this.name = name;
		this.vObjectRoot = new VObject("VObjectRoot");
		this.listOfStringLists = new_List("List[string]", new_List("string", "1A", "1B", "1C"), new_List("string", "2A", "2B", "2C"), new_List("string", "3A", "3B", "3C"));
		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("name", new VDFPropInfo("string", true));
		typeInfo.SetPropInfo("vObjectRoot", new VDFPropInfo("VObject", true));
		typeInfo.SetPropInfo("listOfStringLists", new VDFPropInfo("List[List[string]]", true));
		this.SetTypeInfo(typeInfo);
	}
}

class VObject
{
	parent: VObject;

	id: Guid; // note; this prop is not marked to be included here, but ends up being added anyway, by being marked in the VDFSaveOptions object of the VDF.Serialize method call; todo; implement this system, as in C# version
	name: string;
	duties: List<Duty>;
	children: List<VObject>;

	constructor(name: string)
	{
		this.id = new Guid();
		this.name = name;
		this.duties = new_List("Duty");
		this.children = new_List<VObject>("VObject");

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("id", new VDFPropInfo("Guid", true)); // todo; rather than marking this here manually, have it marked by the at-runtime system described above
		typeInfo.SetPropInfo("name", new VDFPropInfo("string", true));
		typeInfo.SetPropInfo("duties", new VDFPropInfo("List[Duty]", true, true, true));
		typeInfo.SetPropInfo("children", new VDFPropInfo("List[VObject]", true, true, true));
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
		typeInfo.SetPropInfo("texturePath", new VDFPropInfo("string", true));
		this.SetTypeInfo(typeInfo);
	}
}
enum Color { _IsEnum, Red, Green, Blue, White, Gray, Black }
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
		typeInfo.SetPropInfo("brightness", new VDFPropInfo("float", true));
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
	vertexes: List<Vector3>;
	vertexColors: Dictionary<Vector3, Color>;
	constructor(vertexes: List<Vector3>, vertexColors: Dictionary<Vector3, Color>)
	{
		super();
		this.vertexes = vertexes;
		this.vertexColors = vertexColors;

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("vertexes", new VDFPropInfo("List[Vector3]", true));
		typeInfo.SetPropInfo("vertexColors", new VDFPropInfo("Dictionary[Vector3,Color]", true));
		this.SetTypeInfo(typeInfo);
	}
}
class HoldDuties extends Duty
{
	dutiesEnabledWhen: string;
	duties: List<Duty>;

	constructor(dutiesEnabledWhen: string)
	{
		super();
		this.dutiesEnabledWhen = dutiesEnabledWhen;
		this.duties = new_List("Duty");

		var typeInfo = new VDFTypeInfo();
		typeInfo.SetPropInfo("dutiesEnabledWhen", new VDFPropInfo("string", true));
		typeInfo.SetPropInfo("duties", new VDFPropInfo("List[Duty]", true, true, true));
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
		this.SetTypeInfo(typeInfo);
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