const MODEL = "gemini-2.5-flash";


/**
 * ==============================================================
 * @param prompt 
 * @returns 
 * ==============================================================
 */
export async function geminiText(prompt: string) {

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return { text: "Gemini not configured (GEMINI_API_KEY missing)." };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // role is optional, but fine to include
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
      cache: "no-store",
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    
    return { text: `Gemini API error: ${msg}` };
  }

  const text = json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text)
  .filter(Boolean)
  .join("\n") ?? "";

  return { text: text || "(no text in response)" };
}


/**
 * ==============================================================
 * @param prompt 
 * @param base64 
 * @param mimeType 
 * @returns 
 * ==============================================================
 */
export async function geminiImage(prompt: string, base64: string, mimeType: string) {

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) return { text: "Gemini not configured (GEMINI_API_KEY missing)." };

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              // REST expects snake_case for inline data
              { inline_data: { data: base64, mime_type: mimeType } }
            ]
          }
        ]
      }),
      cache: "no-store",
    }
  );

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;

    return { text: `Gemini API error: ${msg}` };
  }

  const text = json?.candidates?.[0]?.content?.parts?.map((p: any) => p.text)
  .filter(Boolean)
  .join("\n") ?? "";

  return { text: text || "(no text in response)" };

}


