require("dotenv").config();
const readline = require("readline");

console.log("🚀 ResolveCX Sentiment POC started");

const GEMINI_KEY = process.env.GEMINI_API_KEY;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function analyzeSentiment(message) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `
You are a sentiment analysis engine.

Analyze the message below and return ONLY valid JSON.

{
  "sentiment": "positive | neutral | negative",
  "confidence": 0-1,
  "emotion": "angry | frustrated | happy | confused | calm"
}

Message:
"${message}"
`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2
        }
      })
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    console.error("❌ No response from Gemini");
    return;
  }

  try {
    const cleanText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const sentiment = JSON.parse(cleanText);
    console.log("\n✅ Sentiment Result:");
    console.log(sentiment);
  } catch (err) {
    console.error("❌ Failed to parse JSON:", text);
    console.error(err.message);
  }
}

rl.question("\n💬 Enter customer message: ", async (input) => {
  await analyzeSentiment(input);
  rl.close();
});
