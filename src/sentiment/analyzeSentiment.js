import { callGemini } from "../utils/geminiClient.js";

export async function analyzeSentiment(message) {
  const prompt = `
Analyze the sentiment of the following message.
Return JSON only.

Message: "${message}"

Format:
{
  "sentiment": "positive | neutral | negative",
  "confidence": 0-1,
  "emotion": "happy | angry | frustrated | calm | etc"
}
`;

  const response = await callGemini(prompt);
  return JSON.parse(response.replace(/```json|```/g, ""));
}
