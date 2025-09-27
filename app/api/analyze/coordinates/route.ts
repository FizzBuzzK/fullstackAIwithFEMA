import { geminiText } from "@/lib/gemini";
import { codeDescription, computeRiskLevel } from "@/lib/risk";
import { fetchElevation, fetchInfo } from "@/lib/externalTerrain";


/*==============================================

  ==============================================*/
export async function POST(req: Request) {

  try{
    const { latitude, longitude } = await req.json();
    const lat = Number(latitude);
    const lng = Number(longitude);

    if(
      Number.isNaN(lat) || Number.isNaN(lng) ||
      lat < -90 || lat > 90 || 
      lng < -180 || lng > 180
    ){
      return Response.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    // Elevation
    let elevation: any;

    // FEMA Info
    let femaInfo: any;
    let sfhaTF: any;
    let zoneCode: any;
    let subCode: any;

    
    //===============================
    // Fetch Elevation
    //===============================
    try{
      let unformattedElevation = await fetchElevation(lat, lng);
      unformattedElevation = unformattedElevation * 3.281;
      elevation = unformattedElevation.toFixed(2);
    }
    catch(error){ 
      console.error("Error fetching elevation:", error);
      elevation = "UNKNOWN";
    }


    //===============================
    // Fetch FEMA Info
    //===============================
    try{ 
      femaInfo = await fetchInfo(lat, lng);
      sfhaTF = femaInfo.sfha;
      zoneCode = femaInfo.zoneClass;
      subCode = femaInfo.subClass;

    }
    catch(error){
      console.error("Error fetching SFHA:", error);
      sfhaTF = "UNKNOWN";
    }


    // Decide UNKNOWN, Low, Medium, High, Very High
    const risk_level = computeRiskLevel(elevation, sfhaTF);

    const code_info = codeDescription(zoneCode);
    
    const prompt =
      `You are a flood risk expert. ` +
      `Refer to FEMA zone code, SFHA Flag, and Zone Subtype. ` +
      `FEMA zone code is for flood zone classification. Each code corresponds to a level of flood risk. For example, 
      if the code is AE, AO, VE, A, AH, A99, or V, that means High-risk zones (insurance mandatory).
      If the code is X shaded or X unshaded, that means Lower/moderate risk (insurance optional).
      If the code is D, that means Risk undetermined (uncertain). ` +
      `SFHA Flag (SFHA_TF) is FEMA’s simple “Yes or No” indicator of whether the location is inside the Special Flood Hazard Area (SFHA).
      For example,
      if the flag is True, that means the location is in the SFHA (high-risk, 1% annual chance flood zone), 
      which includes AE, A, AO, AH, VE, V, A99. And insurance required (if federally backed mortgage).
      If the flag is False, that means the location is not in the SFHA (lower risk), which includes Zone X (shaded or unshaded). 
      And insurance usually optional but still recommended. ` +
      `Zone Subtype field adds extra context about the flood zone polygon. ZONE_SUBTY helps refine the meaning of the FLD_ZONE. 
      For example, 
      AE zone with subtype Regulatory Floodway means it’s not just in Zone AE but also in the floodway, 
      which has stricter building rules.
      If the zone subtype is Regulatory Floodway, that means the channel of a river + adjacent land reserved for flood flow. 
      Building is very restricted.
      If the zone subtype is Shaded X, that means moderate risk (0.2% chance). 
      Sometimes appears here instead of FLD_ZONE.
      If the zone subtype is Unshaded X, that means low risk (outside flood hazard). 
      Sometimes appears here instead of FLD_ZONE.
      If the zone subtype is Coastal Barrier Resource System (CBRS), that means protected coastal zones 
      where federal flood insurance is not available.
      If the zone subtype is Levee-Related Area, that means area behind a levee (accredited or not).
      If the zone subtype is Future Conditions, that means flood zones mapped for future climate scenarios.
      If the zone subtype is No subtype (null), that means for standard zones like AE where no extra subtype is needed.` +
      `Given the fact that elevation is ${elevation} ft 
      and FEMA zone code is ${zoneCode} 
      and SFHA Flag (SFHA_TF) is ${sfhaTF} 
      and Zone Subtype is ${subCode} according to FEMA, ` +
      `explain the likely flood risk in 6-8 sentences. `;

    
      const ai = await geminiText(prompt);
      const ai_analysis = (ai.text || "").trim();


    //====================================================
    // Return JSON
    //====================================================
    return Response.json({
      risk_level,
      description: `The elevation of the location (${lat.toFixed(4)}, ${lng.toFixed(4)}) is ${elevation} ft. 
      According to FEMA, it is ${sfhaTF} that the location is within a Special Flood Hazard Area. 
      Flood Zone Classification is ${zoneCode}. ${code_info} Zone Subtype is ${subCode}.`,
      elevation,
      sfhaTF,
      ai_analysis
    });
  }
  catch(err){
    console.error("coordinates error:", err);

    //====================================================
    // Return
    //====================================================
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

}



