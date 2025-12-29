import fs from "fs";
import path from "path";
import { callGemini } from "../utils/geminiClient.js";

export async function suggestReply(tenantId, customerId, message) {
  const kbPath = path.join("src", "kb", `${tenantId}.json`);
  const kb = JSON.parse(fs.readFileSync(kbPath, "utf-8"));

  const kbText = kb.knowledgeBase
    .map((k, i) => `${i + 1}. Q: ${k.question}\nA: ${k.answer}`)
    .join("\n");

  const prompt = `
You are a customer support AI for ${kb.company}.

Rules:
- Use ONLY the provided knowledge base
- Respond to customer ${customerId}
- Be professional and helpful

Knowledge Base:
${kbText}

Customer Message:
"${message}"

Provide the best reply.
`;

  return await callGemini(prompt);
}
