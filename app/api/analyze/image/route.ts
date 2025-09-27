import { geminiImage } from "@/lib/gemini";
import { parseGeminiResponse } from "@/lib/responseParser";
import { computeRiskLevel } from "@/lib/risk";

export const maxDuration = 30; // seconds (Vercel hint)

type Parsed =
  | {
      risk_level?: string;
      description?: string | string[];
      elevation?: number | string;
      sfhaTF?: string;
      image_analysis?: string;
    }
  | undefined;


/**
 * ===============================================================
 * @param req 
 * @returns 
 * ===============================================================
 */
export async function POST(req: Request) {

  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }


    const formData = await req.formData();
    const file = formData.get("file") as File | null;


    //=========================
    // Error Handlings
    //=========================
    if (!file) {
      return Response.json({ error: "Image file is required (field 'file')" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return Response.json({ error: "File must be an image" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
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


    // Parse and normalize into a guaranteed object
    const candidate: Parsed = parseGeminiResponse(aiText);


    const normalized = {
      risk_level: String(candidate?.risk_level ?? "UNKNOWN"),

      // Normalize description to a single string for consistent downstream usage
      description: Array.isArray(candidate?.description) ? 
      candidate?.description.join(" ") : 
      String(candidate?.description ?? "No description available"),

      // Allow number or string; fall back to "UNKNOWN"
      elevation:
        typeof candidate?.elevation === "number" ? 
        candidate!.elevation : 
        typeof candidate?.elevation === "string" ? 
        candidate!.elevation : 
        "UNKNOWN",

      sfhaTF: String(candidate?.sfhaTF ?? "UNKNOWN"),

      image_analysis: String(
        candidate?.image_analysis ?? "Image analysis was not available. Try again."
      ),
    };


    // Compute risk using normalized values
    const risk_level = computeRiskLevel(normalized.elevation as number | string, normalized.sfhaTF);



    //====================================================
    // Return JSON
    //====================================================
    return Response.json({
      risk_level,
      description: normalized.description,
      elevation: normalized.elevation,
      sfhaTF: normalized.sfhaTF,
      ai_analysis:
        (normalized.image_analysis + " For more accurate analysis, providing address is highly recommended.") ||
        "",
    });
  } 
  catch(err){

    console.error("image error:", err);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }

}


