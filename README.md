# VDF
###### Like JSON, but with type metadata, indent-based children, and a rich tagging and override system. (versions in C# and JS)

The entire serializer/deserializer system is contained in 6 files, and is implemented in two languages (C# and JS) using almost exactly the same structure. (so it's easy to update one alongside the other)

#### Features
++++++++++
##### Type Metadata
```
[Color>"Blue" double>0 int>"1050"]
```
```
var list = (List<object>)VDF.Deserialize("[...]"));
list[0].Should().Be(Color.Blue);
list[1].Should().Be(0d);
list[2].Should().Be(1050);
```

##### Indent-Based Children (i.e. 'popped out' contents)
```
{^} ;; This is a comment. To the left, the brackets mark the start and end of the object, and the caret symbol (^) marks the object's content as 'popped out', i.e. its properties laid out on the lines below it, with indentation.
	terrain:{size:Vector2>"100 100"}
	regions:[^] ;; Same thing here for a List, except its items are laid out below, rather than its properties.
		{name:"Grass" soil:"Grass" enabled:true}
		{name:"Dirt" soil:"Dirt" enabled:true}
	structures:[^]
		{^}
			objectType:"Palisade Wall"
			owner:Player>"Andy"
			position:"63 97 4"
			rotation:"0 0 0.923879504203796 0.382683426141739"
			canBeRotated:true
	units:[^]
		{^}
			objectType:"Wolf"
			owner:Player>"Andy"
			position:"48.5 95.5 4"
			canBeDrafted:{^}
				draftTime:1
				undraftTime:1
		{^}
			objectType:"Zebra"
			owner:Player>"Bob"
			position:"37 115.5 4"
			canBeDrafted:{^}
				draftTime:2
				undraftTime:2
```
```
var map = VDF.Deserialize<Map>("[...]");
map.terrain.size.Should().Be(new Vector2(100, 100));
map.regions[0].soil.GetType().Should().Be(typeof(Soil));
map.units[1].owner.name.Should().Be("Bob");
map.units[1].canBeDrafted.draftTime.Should().Be(2);
```

##### Tagging and Override System
```
TODO
```

### Info
Author: Stephen Wicklund (Venryx)  
Language: C#  
Code: Open source (GPLv3) at: http://github.com/Venryx/VDF