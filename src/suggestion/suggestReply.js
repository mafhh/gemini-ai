import fs from "fs";
import path from "path";
import { callGemini } from "../utils/geminiClient.js";
import { getSession, addMessage } from "../sessions/sessionStore.js";

export async function suggestReply(tenantId, customerId, message) {
  const kbPath = path.join("src", "kb", `${tenantId}.json`);
  const kb = JSON.parse(fs.readFileSync(kbPath, "utf-8"));

  const kbText = kb.knowledgeBase
    .map((k, i) => `${i + 1}. Q: ${k.question}\nA: ${k.answer}`)
    .join("\n");

  // 🔹 Load session history
  const history = getSession(tenantId, customerId)
    .map(m => `${m.role.toUpperCase()}: ${m.content}`)
    .join("\n");

  const prompt = `
You are a customer support AI for ${kb.company}.

Rules:
- Answer ONLY using the provided knowledge base
- Respond ONLY to this customer
- Be concise and helpful

Knowledge Base:
${kbText}

Conversation History:
${history || "No prior conversation"}

Customer Message:
"${message}"

Provide the best reply.
`;

  // Save user message
  addMessage(tenantId, customerId, "user", message);

  const reply = await callGemini(prompt);

  // Save assistant reply
  addMessage(tenantId, customerId, "assistant", reply);

  return reply;
}
