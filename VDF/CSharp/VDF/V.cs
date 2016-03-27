// don't have the VDF system use anything in this file; it's just for quick use while debugging (and it needs to stay in the main VDF project, so it can be called from the VDF files)

using System;
using System.Collections.Generic;
using System.Threading;

static class V
{
	static void Main() {}
	public static void Nothing() {}

	public static void WaitXMillisecondsThenRun(int waitTime, Action action)
	{
		new Thread(()=>
		{
			Thread.Sleep(waitTime);
			action();
		}).Start();
	}
}
static class VDebug_Base
{
	static long timerStart;
	static Dictionary<string, long> sectionTotals = new Dictionary<string, long>();
	public static void StartSection() { timerStart = DateTime.Now.Ticks; }
	public static void EndSection(string name, int waitTimeBeforeResults = /*1000*/0)
	{
		sectionTotals[name] = (sectionTotals.ContainsKey(name) ? sectionTotals[name] : 0) + (DateTime.Now.Ticks - timerStart);
		var oldVal = sectionTotals[name];
		V.WaitXMillisecondsThenRun(waitTimeBeforeResults, () =>
		{
			if (sectionTotals[name] == oldVal)
				Console.WriteLine("Time (in ms)" + (name != null ? " - " + name : "") + ": " + (oldVal / 10000));
		});
	}
}