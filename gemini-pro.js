import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables from .env file
dotenv.config();

// Check if API key is loaded correctly
console.log('API Key:', process.env.API_KEY);

if (!process.env.API_KEY) {
    console.error("API key is missing. Please check your .env file.");
    process.exit(1); 
}

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Define the new prompt for generating 5 interview questions
        const prompt = `
        I'm applying for a backend developer at Infosys, what all hard level coding questions that might be asked? give me tops 5 with no explanations or headings
        `;

        // Generate the content based on the prompt
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Print the generated interview questions
        console.log("Generated Interview Questions:\n", text);
    } catch (error) {
        console.error("Error during content generation:", error);
    }
}

run();
