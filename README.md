# VDF
Like JSON, but with type metadata, indent-based children, and a rich tagging and override system. (implementations: C#, JS)

Example:
```
{^}
	terrain:{size:Vector2>"100 100"}
	regions:[^]
		{name:"Grass" soil:"Grass" enabled:true}
		{name:"Dirt" soil:"Dirt" enabled:true}
	selectedRegion:NodePath>"#/regions/i:1"
	lastCameraPos:"41 58 57"
	lastCameraRot:"45 -1 44"
	players:[^]
		{canBeAI:true name:"Player 1" aiType:null ai:null color:"0 0 0 0" biome:null age:"Rodent" wood:0 stone:0 grain:0 fruit:0 salt:0 formations:[] selectedObjects:[]}
		{canBeAI:true name:"Player 2" aiType:null ai:null color:"0 0 0 0" biome:null age:"Rodent" wood:0 stone:0 grain:0 fruit:0 salt:0 formations:[] selectedObjects:[]}
	selectedPlayer:NodePath>"#/players/i:0"
	plants:[]
	structures:[^]
		{^}
			objectType:"Palisade Wall"
			owner:NodePath>"#/players/i:0"
			position:"63 97 4"
			rotation:"0 0 0.923879504203796 0.382683426141739"
			canBeRotated:true
	units:[^]
		{^}
			typeVObject:"Wolf"
			owner:NodePath>"#/players/i:0"
			position:"48.5 95.5 4"
			canBeDrafted:{^}
				draftTime:0
				undraftTime:0
				resourceSpace:-1
				resourceCollectSpeed:0
		{^}
			typeVObject:"Zebra"
			owner:NodePath>"#/players/i:1"
			position:"37 115.5 4"
			canBeDrafted:{^}
				draftTime:0
				undraftTime:0
				resourceSpace:-1
				resourceCollectSpeed:0
	projectiles:[]
	module:{^}
		name:"Main"
		scriptContext:{globalContext:false vsData:{^}}
			Type>ScriptContext_Root:{properties:{^}}
				match:{isTrigger:false canRunOnNothing:false allowReplacingPassiveValue:true type:Type>"Match" passiveValue:null userCreated:false}
				map:{isTrigger:false canRunOnNothing:false allowReplacingPassiveValue:true type:Type>"Map" passiveValue:Map>"#" userCreated:false}
				terrain:{isTrigger:false canRunOnNothing:false allowReplacingPassiveValue:true type:Type>"VTerrain" passiveValue:VTerrain>"#/terrain" userCreated:false}
			Type>object:{properties:{}}
			Type>bool:{properties:{}}
			Type>string:{properties:{}}
			Type>Map:{properties:{}}
		scripts:[^]
			{^}
				name:"Main Script"
				nodes:[]
		selectedScript:null
```

Author: Stephen Wicklund (Venryx)

Language: C#

Code: Open source (GPLv3) at: http://github.com/Venryx/VDF