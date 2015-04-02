using System;

[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)] public class Tags : Attribute
{
	public string[] tags;
	public Tags(params string[] tags) { this.tags = tags; }
}

static class V
{
	public static void DoNothing() {}
}