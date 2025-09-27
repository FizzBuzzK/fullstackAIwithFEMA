

/*==============================================

  ==============================================*/
export async function fetchElevation(lat: number, lng: number) {

  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      // throw new Error("Google Maps API key is missing");
      console.log("Google Maps API key is missing");
      return null;
    }

    const url = `https://maps.googleapis.com/maps/api/elevation/json?locations=${lat},${lng}&key=${apiKey}`;

    const res = await fetch(url);

    if (!res.ok) {      
      // throw new Error(`HTTP error! Status: ${res.status}`);
      console.log("HTTP error! Status: " + res.status);
      return null;
    }

    const data = await res.json();

    if (data.status === "OK") {
      return data.results[0].elevation;
    }
    else {
      // throw new Error("Elevation API error: " + data.status);
      console.log("Elevation API error: " + data.status);
      return null;
    }
    
  } 
  catch (error) {
    console.error("Error fetching elevation:", error);
    return null; 
  }
}


/*==============================================

  ==============================================*/
// async function getFloodZoneInfo(lat, lon) {
export async function fetchInfo(lat: number, lng: number) {
  
  try {
    const url = "https://hazards.fema.gov/arcgis/rest/services/public/NFHL/MapServer/28/query";

    const params = new URLSearchParams({
      f: "json",
      geometry: JSON.stringify({ x: lng, y: lat, spatialReference: { wkid: 4326 } }),
      geometryType: "esriGeometryPoint",
      inSR: "4326",
      spatialRel: "esriSpatialRelIntersects",
      returnGeometry: "false",
      outFields: "FLD_ZONE, ZONE_SUBTY, SFHA_TF",
    });

    const res = await fetch(`${url}?${params}`);
    const data = await res.json();
    const zone = data?.features?.[0]?.attributes;


    if (zone) {
      console.log(`FEMA Flood Zone Classification (zone.FLD_ZONE): ${zone.FLD_ZONE || "N/A"}`);
      console.log(`FEMA Flood SFHA Flag (zone.SFHA_TF): ${zone.SFHA_TF === "T" ? "Yes (High Risk)" : "No (Lower Risk)"}`);
      console.log(`FEMA Flood Zone Subtype (zone.ZONE_SUBTY): ${zone.ZONE_SUBTY || "N/A"}`);

      const zoneObj = {
        zoneClass: `${zone.FLD_ZONE || "N/A"}`,
        sfha: `${zone.SFHA_TF === "T" ? "TRUE" : "FALSE"}`,
        subClass: `${zone.ZONE_SUBTY || "N/A"}`
      };

      //====================================================
      // Return the created object.
      //====================================================
      return zoneObj;

    } 
    else {
      console.log("No flood hazard zone found at this location.");

      //====================================================
      // No zone record found. Return NULL.
      //====================================================
      return null;
    }

  } 
  catch (err) {
    console.error("Error fetching FEMA data:", err);

    //====================================================
    // Failed to fetch. Return NULL.
    //====================================================
    return null;
  }
  
}














