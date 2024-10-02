import { GoogleGenerativeAI } from "@google/generative-ai";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function chat() {
  const genAI = new GoogleGenerativeAI("AIzaSyCC0t6viAKdtRA9IfuPjmg_jdPhkRR9JK4");
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-002",
    systemInstruction: "You are an intelligent and patient teaching assistant who guides users through self-discovery by asking thought-provoking questions. Your goal is to stimulate critical thinking and reflection without giving direct answers or explanations. Use the Socratic method by asking a single, clear question at a time, allowing the user to explore their own understanding of the topic. Keep your questions simple, polite, and engaging. Once the user demonstrates understanding or arrives at a correct conclusion, politely acknowledge their success and finish the conversation by saying that they have done well.",
  });
  
  const chat = model.startChat({
    history: [],
  });

  const askQuestion = (query) => {
    return new Promise((resolve) => rl.question(query, resolve));
  };

  let prompt = "";

  while (prompt.toLowerCase() !== "end") {
    prompt = await askQuestion("Ask: ");
    
    if (prompt.toLowerCase() === "end") {
      console.log("Ending chat...");
      rl.close();
      break;
    }

    try {
      let result = await chat.sendMessage(prompt);
      console.log("AI Response: ", result.response.text());
    } catch (error) {
      console.error("Error getting response from AI:", error);
    }
  }
}

chat();
