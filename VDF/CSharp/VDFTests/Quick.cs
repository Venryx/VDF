using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Windows.Forms;
using SystemMaker;
using FluentAssertions;
using Xunit;

namespace VDFTests
{
	public class Quick
	{
		// temp
		// ==========

		[VDFType(VDF.PropRegex_Any, true)] public class FrameData
		{
			public FrameSettings settings = new FrameSettings();
			public Dictionary<string, object> prefs = new Dictionary<string, object>();
			public string liveWorldName;

			// designer
			public string lastLivePackName;
		}
		public enum ShadowType
		{
			None,
			Hard,
			Soft
		}

		[VDFType(VDF.PropRegex_Any, true)] public class FrameSettings
		{
			public bool showTooltips = true;
			public List<string> autoOpenSubmenus = new List<string> {"Frame2", "CreativeDefense"};
			public string autoOpenPage = "";
		}

		[Fact] void Load()
		{
			var a = VDFLoader.ToVDFNode(@"{^}
	objects:{^}
		Armature:{^}
			position:[0 0 0]
			rotation:[90 -180 0]
			scale:[.01 .01 .01]
			armature:{^}
				bones:{^}
					ELEPHANT_:{position:[.0000002 -1.13378 2.71886] rotation:[.0000136 85 90.0001] scale:[.01 .01 .01] children:[^]}
						ELEPHANT__Pelvis:{position:[.0000525 0 -.0000134] rotation:[-89.9999 -89.9999 0] scale:[1 1 1] children:[^]}
							ELEPHANT__Spine:{position:[69.527 15.435 .0000553] rotation:[-.0002384 -.0000841 .0456287] scale:[1 1 1] children:[^]}
								ELEPHANT__Spine1:{position:[96.0497 -.0765972 -.0000021] rotation:[.0000003 -.0000001 .0000047] scale:[1 1 1] children:[^]}
									ELEPHANT__Neck:{position:[92.9396 -20.7568 -.0000307] rotation:[-.0000003 .0000157 -4.99998] scale:[1 1 1] children:[^]}
										ELEPHANT__Neck1:{position:[58.8623 -.0338745 .0000004] rotation:[-.0000003 .000011 -5.00001] scale:[1 1 1] children:[^]}
											ELEPHANT__Head:{position:[49.002 14.4849 .0000194] rotation:[-.0000826 .0001256 -65.0457] scale:[1 1 1] children:[^]}
												ELEPHANT__Queue_de_cheval_1:{position:[-41.3283 74.7818 .0000909] rotation:[-.000275 -.0000647 162.955] scale:[1 1 1] children:[^]}
													ELEPHANT__Queue_de_cheval_11:{position:[42.8605 -.0225582 .0000002] rotation:[.0000684 -.0000112 5.62101] scale:[1 1 1] children:[^]}
														ELEPHANT__Queue_de_cheval_12:{position:[28.4011 -.0211816 .0000015] rotation:[-.0003068 -.0000058 1.98022] scale:[1 1 1] children:[^]}
															ELEPHANT__Queue_de_cheval_13:{position:[26.684 -.0209695 -.0000002] rotation:[.0001736 -.0000144 2.07649] scale:[1 1 1] children:[^]}
																ELEPHANT__Queue_de_cheval_14:{position:[26.3027 -.0220537 -.0000005] rotation:[.0000983 .0000207 -4.9735] scale:[1 1 1] children:[^]}
																	ELEPHANT__Queue_de_cheval_15:{position:[27.8345 -.0205369 .0000009] rotation:[-.0000353 .0000066 -4.84419] scale:[1 1 1] children:[^]}
																		ELEPHANT__Queue_de_cheval_16:{position:[25.8568 -.018878 .0000003] rotation:[-.0000083 .0000102 -5.18565] scale:[1 1 1] children:[^]}
																			ELEPHANT__Queue_de_cheval_17:{position:[23.7711 -.0116062 -.000001] rotation:[-.0000089 .0000341 -12.3641] scale:[1 1 1] children:[^]}
																				ELEPHANT__Queue_de_cheval_18:{position:[14.8927 -.0138741 .0000002] rotation:[-.0000032 .0000232 -8.72244] scale:[1 1 1]}
												ELEPHANT__Queue_de_cheval_2:{position:[-11.2656 -17.1077 -.0000848] rotation:[-.0002717 -.0000895 152.733] scale:[1 1 1] children:[^]}
													ELEPHANT__Queue_de_cheval_21:{position:[48.0012 -.0300064 -.0000017] rotation:[-.0000371 .0000924 -38.2416] scale:[1 1 1]}
												Factice002:{position:[11.5153 -1.12839 55.2] rotation:[-2.67542 -89.9998 174.231] scale:[.999994 1 1] children:[^]}
													ELEPHANt_ear_R_1:{position:[-.0000057 -.0000667 -.0001119] rotation:[89.0704 .543898 53.1164] scale:[1 1 1] children:[^]}
														ELEPHANt_ear_R_2:{position:[71.0854 .00611 -.0000468] rotation:[-.0145897 23.6371 1.34571] scale:[1 1 1]}
												Factice001:{position:[11.5155 -1.12809 -55.1788] rotation:[13.6437 -89.9997 157.627] scale:[.999992 1 1] children:[^]}
													ELEPHANt_ear_L_1:{position:[-.0211467 .0000132 -.0000785] rotation:[-89.0703 .543569 126.884] scale:[1 1 1] children:[^]}
														ELEPHANt_ear_L_2:{position:[71.1205 -.005423 .0494243] rotation:[.0156396 23.6324 -1.34592] scale:[1 1 1]}
										ELEPHANT__L_Clavicle:{position:[-.0932992 -4.17182 12.885] rotation:[75.5938 -57.8167 111.838] scale:[1 1 1] children:[^]}
											ELEPHANT__L_UpperArm:{position:[65.9939 .0001183 -.000034] rotation:[-76.4885 15.958 -56.8626] scale:[1 1 1] children:[^]}
												ELEPHANT__L_Forearm:{position:[120.575 -.000011 .000041] rotation:[-.0000259 -.0000137 -11.4826] scale:[1 1 1] children:[^]}
													ELEPHANT__L_Hand:{position:[98.2879 .0000255 .0000012] rotation:[-99.9544 .000008 -5.00001] scale:[1 1 1]}
										ELEPHANT__R_Clavicle:{position:[-.093312 -4.17172 -12.8851] rotation:[-75.5943 57.8164 111.837] scale:[1 1 .999999] children:[^]}
											ELEPHANT__R_UpperArm:{position:[65.9939 .0001068 .0000218] rotation:[76.4885 -15.958 -56.8626] scale:[1 1 1] children:[^]}
												ELEPHANT__R_Forearm:{position:[120.575 .0000196 .0000129] rotation:[-.0000027 .0000088 -11.4826] scale:[1 1 1] children:[^]}
													ELEPHANT__R_Hand:{position:[98.2879 .0000055 .0000119] rotation:[99.9546 -.0000032 -4.99998] scale:[1 1 1]}
								ELEPHANT__L_Thigh:{position:[-69.5392 -15.3801 74.5555] rotation:[.0002224 -178.451 -80.2079] scale:[1 1 1] children:[^]}
									ELEPHANT__L_Calf:{position:[141.548 .0000526 .0000129] rotation:[.0000002 -.0000068 -.0442476] scale:[1 1 1] children:[^]}
										ELEPHANT__L_Foot:{position:[85.8501 -.0000264 .0000094] rotation:[-.131142 -1.54322 4.88369] scale:[1 1 1]}
								ELEPHANT__R_Thigh:{position:[-69.5392 -15.3794 -74.5555] rotation:[-.0000492 178.452 -80.2079] scale:[1 1 1] children:[^]}
									ELEPHANT__R_Calf:{position:[141.548 .0000266 -.0000197] rotation:[.0000027 .0000074 -.044237] scale:[1 1 1] children:[^]}
										ELEPHANT__R_Foot:{position:[85.85 .0000308 .0000323] rotation:[.131195 1.54306 4.88371] scale:[1 1 1]}
								ELEPHANT__Tail:{position:[-157.348 -72.3511 -.0002025] rotation:[-.0002484 -.000136 122.999] scale:[1 1 1] children:[^]}
									ELEPHANT__Tail1:{position:[32.4099 -.0227814 .0000019] rotation:[-.0000046 .0000214 -9.04431] scale:[1 1 1] children:[^]}
										ELEPHANT__Tail2:{position:[28.9149 -.0263748 -.0000014] rotation:[-.0000055 .0000222 -7.56492] scale:[1 1 1] children:[^]}
											ELEPHANT__Tail3:{position:[33.4506 -.0284195 -.0000007] rotation:[-.0000053 .0000077 -3.34804] scale:[1 1 1] children:[^]}
												ELEPHANT__Tail4:{position:[35.6797 -.0281143 -.0000022] rotation:[-.0000111 .0000156 -3.34798] scale:[1 1 1] children:[^]}
													ELEPHANT__Tail5:{position:[35.4252 -.026082 .0000012] rotation:[-.0000171 .0000068 -1.88931] scale:[1 1 1] children:[^]}
														ELEPHANT__Tail6:{position:[32.7845 -.0310726 .0000016] rotation:[-.0000848 .0000012 -1.88937] scale:[1 1 1]}");
			V.DoNothing();
		}

		/*[Fact] void Save()
		{
			var a = VDF.Deserialize<FrameData>(@"
	settings{showTooltips{true}autoOpenSubmenus{Frame2|CreativeDefense}autoOpenPage{>empty}}
	prefs{Types_toolOptions{@@Select{}Add{}Resize{}Remove{}@@}Types_liveTool{Select}}
	liveWorldName{>null}
	lastLivePackName{>null}", new VDFLoadOptions(null, null, new Dictionary<Type, string>
			{
				{typeof(Vector3), "Vector3"}
			}));
			VDF.Serialize<FrameData>(a).Should().Be(@"
	settings:
		showTooltips{true}
		autoOpenSubmenus{Frame2|CreativeDefense}
		autoOpenPage{>empty}
	prefs{Types_toolOptions{@@Select{}Add{}Resize{}Remove{}@@}Types_liveTool{Select}}
	liveWorldName{>null}
	lastLivePackName{>null}".Replace("\r\n", "\n"));
		}*/
	}
}

class Vector3 {}