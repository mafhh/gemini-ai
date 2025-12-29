import fetch from "node-fetch";

const MODEL = "models/gemini-2.5-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

export async function callGemini(prompt) {
  const url = `${BASE_URL}/${MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  const rawText = await response.text();

  // 🔍 FULL DEBUG (keep for now)
  if (!rawText) {
    console.error("❌ Gemini returned EMPTY body");
    console.error("HTTP Status:", response.status);
    console.error("Endpoint:", url);
    throw new Error("Empty response from Gemini");
  }

  let json;
  try {
    json = JSON.parse(rawText);
  } catch (e) {
    console.error("❌ Failed to parse Gemini response");
    console.error("Raw response:", rawText);
    throw e;
  }

  return json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}
