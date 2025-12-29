import readline from "readline";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
import { analyzeSentiment } from "./sentiment/analyzeSentiment.js";
import { suggestReply } from "./suggestion/suggestReply.js";

dotenv.config();

console.log("🚀 ResolveCX AI POC Started");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("🏢 Tenant (tenant1 / tenant2): ", (tenantId) => {
  const customerId = uuid();

  const ask = async () => {
    rl.question("\n💬 Customer Message (type 'exit' to quit): ", async (msg) => {
      if (msg.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      const sentiment = await analyzeSentiment(msg);
      const reply = await suggestReply(tenantId, customerId, msg);

      console.log("\n📊 Sentiment:", sentiment);
      console.log("\n🤖 Suggested Reply:", reply);

      ask();
    });
  };

  ask();
});
