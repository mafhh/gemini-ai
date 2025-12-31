import { callGemini } from "../utils/geminiClient.js";

export async function analyzeSentiment(message) {
  const prompt = `
Analyze the sentiment of the following message using Amazon Connect's sentiment scoring system.
Return JSON only.

Message: "${message}"

Format (matching Amazon Connect Contact Lens):
{
  "sentimentScore": -5.0 to 5.0,
  "sentiment": "positive | neutral | negative",
  "emotion": "happy | angry | frustrated | calm | etc"
}

Sentiment Score Guidelines (Amazon Connect range):
- Most negative: -5.0 to -1.0 (negative sentiment)
- Neutral: -1.0 to 1.0 (neutral sentiment)
- Most positive: 1.0 to 5.0 (positive sentiment)

Provide a precise decimal score within the -5.0 to 5.0 range.
`;

  const response = await callGemini(prompt);
  const parsed = JSON.parse(response.replace(/```json|```/g, ""));
  
  // Ensure sentimentScore is within Amazon Connect's range
  if (parsed.sentimentScore !== undefined) {
    parsed.sentimentScore = Math.max(-5.0, Math.min(5.0, parseFloat(parsed.sentimentScore)));
  }
  
  return parsed;
}
