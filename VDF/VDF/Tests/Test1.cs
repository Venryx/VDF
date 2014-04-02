using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;

static class Test1
{
	public static World CreateWorld()
	{
		var world = new World("Main");
		var types = world.vObjectRoot.AddChild(new VObject("#Types"));

		var soils = types.AddChild(new VObject("Soils"));
		var grass = soils.AddChild(new VObject("Grass"));
		grass.AddDuty(new HoldSoil("Grass.png"));
		var dirt = soils.AddChild(new VObject("Dirt"));
		dirt.AddDuty(new HoldSoil("Dirt.png"));

		var items = types.AddChild(new VObject("Items"));
		items.AddDuty(new Special1(Color.White, .5f));
		items.AddChild(new VObject("NameThat{NeedsEscaping}"));
		var camera = items.AddChild(new VObject("Camera"));
		camera.AddDuty(new HoldTransform(new Vector3(1, 9, 2), new Vector3(25.5f, 28.9f, 2404.765f), new Vector3(3, 4, 1)));
		camera.AddDuty(new HoldMesh(new List<Vector3> {new Vector3(9, 4, 2.5f), new Vector3(1, 8, 9.5435f), new Vector3(25, 15, 5)}));
		var holdDuties1A = (HoldDuties)camera.AddDuty(new HoldDuties("SelfIsInWorld"));
		holdDuties1A.AddDuty(new MoveSelfToInventory());
		holdDuties1A.AddDuty(new RenderMesh());
		var holdDuties1B = (HoldDuties)camera.AddDuty(new HoldDuties("!SelfIsInWorld"));
		holdDuties1B.AddDuty(new MoveSelfToWorld());
		var gardenHoe = items.AddChild(new VObject("GardenHoe"));
		gardenHoe.AddDuty(new HoldTransform());
		gardenHoe.AddDuty(new HoldMesh(new List<Vector3>()));
		var holdDuties2A = (HoldDuties)gardenHoe.AddDuty(new HoldDuties("SelfIsInWorld"));
		holdDuties2A.AddDuty(new MoveSelfToInventory());
		holdDuties2A.AddDuty(new RenderMesh());
		var holdDuties2B = (HoldDuties)gardenHoe.AddDuty(new HoldDuties("!SelfIsInWorld"));
		holdDuties2B.AddDuty(new MoveSelfToWorld());

		return world;
	}
}

class World
{
	public string name;
	public VObject vObjectRoot;

	public World(string name)
	{
		this.name = name;
		vObjectRoot = new VObject("VObjectRoot");
	}
}

class VObject
{
	[VDFProp(false)] public VObject parent;

	public Guid id;
	public string name;
	[VDFProp(true, true, true)] public List<Duty> duties;
	[VDFProp(true, true, true)] public List<VObject> children;

	public VObject(string name)
	{
		id = Guid.NewGuid();
		this.name = name;
		duties = new List<Duty>();
		children = new List<VObject>();
	}

	public Duty AddDuty(Duty duty)
	{
		duties.Add(duty);
		return duty;
	}
	public void RemoveDuty(Duty duty) { duties.Remove(duty); }
	public VObject AddChild(VObject child)
	{
		children.Add(child);
		child.parent = this;
		return child;
	}
	public void RemoveChild(VObject child)
	{
		children.Remove(child);
		child.parent = null;
	}
}

class Duty {}
class HoldSoil : Duty
{
	public string texturePath;
	public HoldSoil(string texturePath) { this.texturePath = texturePath; }
}
class Special1 : Duty
{
	public Color color;
	public float brightness;
	public Special1(Color color, float brightness)
	{
		this.color = color;
		this.brightness = brightness;
	}
}
class HoldTransform : Duty
{
	public Vector3 position;
	public Vector3 rotation;
	public Vector3 scale;
	public HoldTransform(Vector3 position = default(Vector3), Vector3 rotation = default(Vector3), Vector3 scale = default(Vector3))
	{
		this.position = position;
		this.rotation = rotation;
		this.scale = scale;
	}
}
class HoldMesh : Duty
{
	public List<Vector3> vertexes;
	public HoldMesh(List<Vector3> vertexes) { this.vertexes = vertexes; }
}
class HoldDuties : Duty
{
	public string dutiesEnabledWhen;
	[VDFProp(true, true, true)] public List<Duty> duties;

	public HoldDuties(string dutiesEnabledWhen)
	{
		this.dutiesEnabledWhen = dutiesEnabledWhen; 
		duties = new List<Duty>();
	}

	public Duty AddDuty(Duty duty)
	{
		duties.Add(duty);
		return duty;
	}
	public void RemoveDuty(Duty duty) { duties.Remove(duty); }
}
class MoveSelfToInventory : Duty {}
class RenderMesh : Duty {}
class MoveSelfToWorld : Duty {}

struct Vector3
{
	public float x;
	public float y;
	public float z;
	public Vector3(float x, float y, float z)
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
}