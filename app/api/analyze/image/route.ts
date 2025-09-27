import { geminiImage } from "@/lib/gemini";
import { parseGeminiResponse } from "@/lib/responseParser";
import { computeRiskLevel } from "@/lib/risk";


// Optionally extend execution time on Vercel (if needed):
export const maxDuration = 30; // seconds (Vercel hint)


//========================================================

//========================================================
export async function POST(req: Request) {

  try{
    const contentType = req.headers.get("content-type") || "";

    if(!contentType.includes("multipart/form-data")){
      return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    const formData = await req.formData();

    const file = formData.get("file") as File | null;

    
    //========================= 
    // Error Handlings
    //=========================
    if(!file){
      return Response.json({ error: "Image file is required (field 'file')" }, { status: 400 });
    }

    if(!file.type.startsWith("image/")){
      return Response.json({ error: "File must be an image" }, { status: 400 });
    }

    if(file.size > 10 * 1024 * 1024){
      return Response.json({ error: "File size must be less than 10MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");


    //========================= 
    // Prompt
    //=========================
    const prompt = `
    There are two possible cases. 
    
    The first case is when the image is not terrain image and when it is not street view image.
    In this case, just provide:
    1. Risk Level (UNKNOWN)
    2. Short notice to let user know that it is not a proper image to analyze for flood risk assessment.
    3. Just a string value "UNKNOWN"
    4. Just a string value "FALSE"
    5. Tell the user that there is no water bodies or flood risks found in the image

    Format your response strictly as JSON with these fields:
    - "risk_level"
    - "description"
    - "elevation" (string)
    - "sfhaTF" (string)
    - "image_analysis" (string)


    Otherwise, in the second case when the image is a terrain image or a street view image, 
    analyze the image for flood risk assessment. 
    
    
    Please provide:
    1. Potential flood risk level (Low/Medium/High/Very High)
    2. Description of potential flood risks based on what you see. Describe it in 2-3 sentences.
    3. Estimated elevation in feet.
    4. Estimated string value of FEMA SFHA for Special Flood Hazard Area (TRUE/FALSE/UNKNOWN) for potential flood risks.
    5. What water bodies or flood risks you can identify in the image. Factors to consider from the image can be topography and elevation to look for low-lying areas, depressions, 
    concave surfaces where water is likely to collect, 
    proximity to water bodies, land use/cover, impervious surfaces, vegetation, 
    drainage patterns, density, Infrastructure, building characteristics, building materials, and flood defense measures. Explain the likely flood risk in 6-8 sentences. 

    Format your response strictly as JSON with these fields:
    - "risk_level" (string)
    - "description" (array of strings)
    - "elevation" (number)
    - "sfhaTF" (string)
    - "image_analysis" (string)
        `.trim();


    //========================= 
    // Answer
    //=========================
    let aiText = "";

    try{
      const ai = await geminiImage(prompt, base64, file.type);
      aiText = ai.text || "";
    } 
    catch{
      aiText = "";
    }

    let parsed = parseGeminiResponse(aiText);
    console.log(parsed);

    const risk_level = computeRiskLevel(parsed.elevation, parsed.sfhaTF);


    //========================= 
    // Default Answer
    //=========================
    if(!aiText){

      parsed = {
        risk_level: "UNKNOWN",
        description: "No description available",
        elevation: "UNKNOWN",
        sfhaTF: "UNKNOWN",
        image_analysis: "Image analysis was not available. Try again."
      };
    }

    //====================================================
    // Return JSON
    //====================================================
    return Response.json({
      risk_level: risk_level,
      description: parsed.description,
      elevation: parsed.elevation,
      sfhaTF: parsed.sfhaTF,
      ai_analysis: parsed.image_analysis + " For more accurate analysis, providing address is highly recommended." || ""
    });

  }
  catch(err){
    console.error("image error:", err);

    //====================================================
    // Return JSON
    //====================================================
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

}



