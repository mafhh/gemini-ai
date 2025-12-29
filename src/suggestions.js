require("dotenv").config();
const readline = require("readline");
const fs = require("fs");

const GEMINI_KEY = process.env.GEMINI_API_KEY;

// Load Knowledge Base
const kb = JSON.parse(fs.readFileSync("kb.json", "utf-8"));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function suggestReply(customerQuery) {
  // Build a combined KB text for Gemini
  const kbText = kb.map((item, i) => `${i+1}. Q: ${item.question}\n   A: ${item.answer}`).join("\n");

  const prompt = `
You are a customer support assistant. 

Here is the knowledge base:
${kbText}

Customer asked: "${customerQuery}"

Based on the knowledge base, suggest the best possible reply.
Return ONLY the reply text (no JSON, no explanation).
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: { temperature: 0.2 }
      })
    }
  );

  const data = await response.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  if (!reply) {
    console.error("❌ No reply from Gemini");
    return;
  }

  console.log("\n💡 Suggested Reply:");
  console.log(reply);
}

rl.question("\n💬 Enter customer query: ", async (input) => {
  await suggestReply(input);
  rl.close();
});
