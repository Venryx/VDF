// tests
// ==========

module VDFTests { // added to match C# indentation
	module Loading_ToObject {
		// to object
		// ==========

		test("D0_Null", ()=>
		{
			ok(VDF.Deserialize("null") == null);
			//VDF.Deserialize("null").Should().Be(null);
		});
		//test("D0_Nothing() { VDF.Deserialize("").Should().Be(null); });
		//test("D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); });
		test("D0_EmptyString", ()=> { VDF.Deserialize("''").Should().Be(""); });
		test("D0_Bool", ()=> { VDF.Deserialize("true", "bool").Should().Be(true); });
		test("D0_Double", ()=> { VDF.Deserialize("1.5").Should().Be(1.5); });
		//test("D0_Float", ()=> { VDF.Deserialize<float>("1.5").Should().Be(1.5f); });

		class D1_DeserializePropMethod_Class {
			DeserializeProp(propPath: VDFNodePath, options: VDFLoadOptions) { return 1; }
			prop1 = Prop(this, "prop1", "D1_PreDeserializePropMethod_Class", new P()).set = 0;
		}
		D1_DeserializePropMethod_Class.prototype.DeserializeProp.AddTags(new VDFDeserializeProp());
		test("D1_DeserializePropMethod", ()=> {
			var a = VDF.Deserialize("{prop1:0}", "D1_DeserializePropMethod_Class");
			a.prop1.Should().Be(1);
		});

		class TypeWithPreDeserializeMethod {
			flag = Prop(this, "flag", "bool", new P()).set = false;
			PreDeserialize(): void { this.flag = true; }
			constructor() { this.PreDeserialize.AddTags(new VDFPreDeserialize()); }
		}
		test("D1_PreDeserializeMethod", ()=> {
			var a = VDF.Deserialize("{}", "TypeWithPreDeserializeMethod");
			a.flag.Should().Be(true);
		});
		class TypeWithPostDeserializeMethod {
			flag = Prop(this, "flag", "bool", new P()).set = false;
			PostDeserialize(): void { this.flag = true; }
			constructor() { this.PostDeserialize.AddTags(new VDFPostDeserialize()); }
		}
		test("D1_PostDeserializeMethod", ()=>
		{
			var a = VDF.Deserialize("{}", "TypeWithPostDeserializeMethod");
			a.flag.Should().Be(true);
		});
		class ObjectWithPostDeserializeMethodRequiringCustomMessage_Class
		{
			flag = Prop(this, "flag", "bool", new P()).set = false;
			PostDeserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions): void { if (<string>options.messages[0] == "RequiredMessage") this.flag = true; }
			constructor() { this.PostDeserialize.AddTags(new VDFPostDeserialize()); }
		}
		test("D0_ObjectWithPostDeserializeMethodRequiringCustomMessage", ()=> { VDF.Deserialize("{}", "ObjectWithPostDeserializeMethodRequiringCustomMessage_Class", new VDFLoadOptions(null, ["WrongMessage"])).flag.Should().Be(false); });
		/*class ObjectWithPostDeserializeConstructor_Class
		{
			static typeInfo = new VDFTypeInfo(
			{
				flag: new PInfo("bool")
			});
			flag = false;
			ObjectWithPostDeserializeConstructor_Class() { flag = true; }
		}
		test("D1_ObjectWithPostDeserializeConstructor", ()=> { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); });*/
		class ObjectWithPostDeserializeOptionsFunc_Class_Parent { child: ObjectWithPostDeserializeOptionsFunc_Class_Child = Prop(this, "child", "ObjectWithPostDeserializeOptionsFunc_Class_Child").set = null; }
        class ObjectWithPostDeserializeOptionsFunc_Class_Child
		{
			static flag = false;
			static Deserialize(node: VDFNode, path: VDFNodePath, options: VDFLoadOptions)
			{
				options.AddObjPostDeserializeFunc(path.rootNode.obj, () =>ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = true);
				return null;
			}
		}
		ObjectWithPostDeserializeOptionsFunc_Class_Child.Deserialize.AddTags(new VDFDeserialize(true));
		test("D1_ObjectWithPostDeserializeOptionsFunc", ()=>
		{
			var options = new VDFLoadOptions();
			ok(VDF.Deserialize("{child:{}}", "ObjectWithPostDeserializeOptionsFunc_Class_Parent", options).child == null);
			ObjectWithPostDeserializeOptionsFunc_Class_Child.flag.Should().Be(true);
		});

		class TypeInstantiatedManuallyThenFilled
		{
			flag = Prop(this, "flag", "bool", new P()).set = false;
		}
		test("D1_InstantiateTypeManuallyThenFill", ()=>
		{
			var a = new TypeInstantiatedManuallyThenFilled();
			VDF.DeserializeInto("{flag:true}", a);
			a.flag.Should().Be(true);
		});
		class D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1
		{
			_helper = TypeInfo(new VDFType(null, true)).set = this;
			messages = Prop(this, "messages", "Dictionary(string string)", new P()).set = new Dictionary<string, string>("string", "string",
			{
				title1: "message1",
				title2: "message2"
			});
			otherProperty = Prop(this, "otherProperty", "bool", new P()).set = false;
		}
		test("D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", ()=>
		{
			var a = VDF.Deserialize(
"{^}\n\
	messages:{^}\n\
		title1:'message1'\n\
		title2:'message2'\n\
	otherProperty:true", "D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1");
			a.messages.Count.Should().Be(2);
			a.messages["title1"].Should().Be("message1");
			a.messages["title2"].Should().Be("message2");
			a.otherProperty.Should().Be(true);
		});

		// export all classes/enums to global scope
		ExportInternalClassesTo(window, str=>eval(str));
	}
}