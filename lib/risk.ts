
/*==============================================

  ==============================================*/
export function computeRiskLevel(elevation: any, sfhaTF: string) {

  if (sfhaTF === "TRUE"){
    if(elevation === "UNKNOWN"){
      return "High";
    }
    // elevation < 20 ft and the location is in a Special Flood Hazard Area
    else if(elevation < 20){
      return "Very High";
    }
    else{
      return "High";
    }

  }
  else{
    if(elevation === "UNKNOWN"){
      return "UNKNOWN";
    }
    else if(elevation < 20){
      return "High";
    }
    else if(elevation > 20 && elevation < 50){
      return "Medium";
    }
    else{
      return "Low";
    }

  }
}


/*==============================================
  zoneCode = femaInfo.zoneClass;
  subCode = femaInfo.subClass;
  ==============================================*/
export function codeDescription(zoneCode: string) {


  if(zoneCode === "AE"){
    return "This means 1% annual chance flood area with Base Flood Elevations (BFEs) shown. Risk level is HIGH. Note: Standard '100-year floodplain.'"
  }

  if(zoneCode === "A"){
    return "This means 1% annual chance flood, but no detailed study/BFE (Base Flood Elevations) yet. Risk level is HIGH. Note: Less precise mapping."
  }

  if(zoneCode === "AH"){
    return "This means areas of shallow flooding (ponding). Risk level is HIGH. Note: Depths 1–3 ft BFEs given."
  }


  if(zoneCode === "AO"){
    return "This means areas of shallow flooding (sheet flow) Risk level is HIGH Note: Depths 1–3 ft shown as numbers (e.g. Depth 2)."
  }


  if(zoneCode === "VE"){
    return "This means coastal high hazard area. Risk level is HIGH. Note: 1% annual chance + wave action ≥ 3 ft. Stronger building standards."
  }


  if(zoneCode === "A99"){
    return "This means area protected by a levee under construction. Risk level is HIGH. Note: Still regulated as high-risk until levee is accredited."
  }


  if(zoneCode === "V"){
    return "This means coastal area with 1% chance flood, no detailed study yet. Risk level is HIGH. Note: No Base Flood Elevations (BFEs) shown."
  }


  if(zoneCode === "X"){
    return "This means 0.2% annual chance flood (500-year floodplain). Risk level is Moderate. Note: Insurance usually not required."
  }


  if(zoneCode === "D"){ 
    return "This means possible but undetermined risk. FEMA Risk Level is Unknown. Note: No detailed analysis."
  }

  return "Monitor weather conditions. Stay informed about local alerts."
  
}


