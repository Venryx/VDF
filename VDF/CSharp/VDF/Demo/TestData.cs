using System;
using System.Collections.Generic;
using System.Drawing;

static class TestData
{
	public static World CreateWorld()
	{
		var world = new World("Main");
		world.simpleFlag = true;
		world.listOfStringLists.AddRange(new List<List<string>> {new List<string> {"1A", "1B", "1C"}, new List<string> {"2A", "2B", "2C"}, new List<string> {"3A", "3B", "3C"}});

		var soils = world.vObjectRoot.AddChild(new VObject("Soils"));
		var grass = soils.AddChild(new VObject("Grass"));
		grass.AddDuty(new HoldSoil("Grass.png"));
		var dirt = soils.AddChild(new VObject("Dirt"));
		dirt.AddDuty(new HoldSoil("Dirt.png"));


		var items = world.vObjectRoot.AddChild(new VObject("Items"));
		items.AddDuty(new Special1(Color.White, .5f));
		items.AddChild(new VObject("NameThat{NeedsEscaping@gmail.com}"));
		var camera = items.AddChild(new VObject("Camera"));
		camera.AddDuty(new HoldTransform(new Vector3(1, 9, 2), new Vector3(25.5f, 28.9f, 2404.765f), new Vector3(3, 4, 1)));
		camera.AddDuty(new HoldMesh(new List<Vector3>
		{
			new Vector3(9, 4, 2.5f), new Vector3(1, 8, 9.5435f), new Vector3(25, 15, 5)
		}, new Dictionary<Vector3, Color>
		{
			{new Vector3(9, 4, 2.5f), Color.Black},
			{new Vector3(1, 8, 9.5435f), Color.Gray},
			{new Vector3(25, 15, 5), Color.White}
		}));
		var holdDuties1A = (HoldDuties)camera.AddDuty(new HoldDuties("SelfIsInWorld"));
		holdDuties1A.AddDuty(new MoveSelfToInventory());
		holdDuties1A.AddDuty(new RenderMesh());
		var holdDuties1B = (HoldDuties)camera.AddDuty(new HoldDuties("!SelfIsInWorld"));
		holdDuties1B.AddDuty(new MoveSelfToWorld());
		var gardenHoe = items.AddChild(new VObject("GardenHoe"));
		gardenHoe.AddDuty(new HoldTransform());
		gardenHoe.AddDuty(new HoldMesh(new List<Vector3>(), new Dictionary<Vector3, Color>()));

		return world;
	}
}

enum SimpleEnum { A, B, C }
class World
{
	[VDFProp] public string name;
	[VDFProp] public VObject vObjectRoot;
	[VDFProp] public string stringPropNull;
	[VDFProp] public bool simpleFlag;
	[VDFProp] public SimpleEnum simpleEnum;
	[VDFProp] public List<List<string>> listOfStringLists;

	public World(string name)
	{
		this.name = name;
		vObjectRoot = new VObject("VObjectRoot");
		listOfStringLists = new List<List<string>>();
	}
}

class VObject
{
	public VObject parent;

	/*[VDFProp]*/
	public Guid id; // note; this prop is not marked to be included here, but ends up being added anyway, by being marked in the VDFSaveOptions object of the VDF.Serialize method call
	[VDFProp] public string name;
	[VDFProp(true, true, false)] public List<Duty> duties;
	[VDFProp(true, true, false)] public List<VObject> children;

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

class Duty
{
}
class HoldSoil : Duty
{
	[VDFProp] public string texturePath;
	public HoldSoil(string texturePath) { this.texturePath = texturePath; }
}
class Special1 : Duty
{
	[VDFProp] public Color color;
	[VDFProp] public float brightness;
	public Special1(Color color, float brightness)
	{
		this.color = color;
		this.brightness = brightness;
	}
}
class HoldTransform : Duty
{
	[VDFProp] public Vector3 position;
	[VDFProp] public Vector3 rotation;
	[VDFProp] public Vector3 scale;
	public HoldTransform(Vector3 position = default(Vector3), Vector3 rotation = default(Vector3), Vector3 scale = default(Vector3))
	{
		this.position = position;
		this.rotation = rotation;
		this.scale = scale;
	}
}
class HoldMesh : Duty
{
	[VDFProp] public List<Vector3> vertexes;
	[VDFProp] public Dictionary<Vector3, Color> vertexColors;
	public HoldMesh(List<Vector3> vertexes, Dictionary<Vector3, Color> vertexColors)
	{
		this.vertexes = vertexes;
		this.vertexColors = vertexColors;
	}
}
class HoldDuties : Duty
{
	[VDFProp] public string dutiesEnabledWhen;
	[VDFProp(true, true, false)] public List<Duty> duties;

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

[VDFType(true)] struct Vector3
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