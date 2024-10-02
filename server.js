import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for specific origins (both localhost and 127.0.0.1)
app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
}));

// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static("public"));
app.use(express.json());

const genAI = new GoogleGenerativeAI(API_KEY);

// Handle chat requests
app.post("/gemini", async (req, res) => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro-002",
        systemInstruction: `You are an intelligent and patient teaching assistant who guides users through self-discovery by asking thought-provoking questions. Your goal is not to provide direct answers but to stimulate critical thinking and reflection. You use the Socratic method by asking a series of questions that lead the user to explore and clarify their own thoughts, deepen their understanding of the subject, and reach conclusions themselves. Be clear, polite, and adaptive, making sure your questions are challenging yet approachable. Just ask one question as a response to the user to teach them the topic. Don't ask very difficult questions keep it simple. Analyze the following conversation, using the Socratic method. Based on the conversation, provide: 1. What the user still needs to learn (\"To Know\"). 2. What the user already understands (\"Known\"). 3. A score from 1 to 100 representing how much the user knows.`,
    });

    const generationConfig = {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            socratic: {
              type: "string"
            },
            toknow: {
              type: "string"
            },
            known: {
              type: "string"
            },
            score: {
              type: "number"
            }
          }
        },
      };

    const chat = model.startChat({
        generationConfig,
        history: req.body.history,
    });

    const msg = req.body.message;
    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = response.text();
    res.send(text);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
