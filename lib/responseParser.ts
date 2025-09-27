/*==============================================

  ==============================================*/
export function parseGeminiResponse(responseText: string) {

  try{
    const match = responseText?.match(/\{[\s\S]*\}/);

    if(match){
      const parsed = JSON.parse(match[0]);

      return {
        risk_level: parsed.risk_level ?? "UNKNOWN",
        description: parsed.description ?? "Analysis completed",
        elevation: typeof parsed.elevation === "number" ? parsed.elevation : "UNKNOWN",
        sfhaTF: typeof parsed.sfhaTF === "string" ? parsed.sfhaTF : "UNKNOWN",
        image_analysis: parsed.image_analysis ?? ""
      };
    }
  }
  catch {
    return {
      risk_level: "UNKNOWN",
      description: "Analysis completed",
      elevation: "UNKNOWN",
      sfhaTF: "UNKNOWN",
      image_analysis: responseText || ""
    };

  }

}


