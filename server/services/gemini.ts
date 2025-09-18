import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "@shared/schema";
import { config } from "../config";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY || "");

export async function processMessage(
  userMessage: string,
  pdfContent: string,
  conversationHistory: Message[]
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation context
    let context = "";
    if (pdfContent) {
      context += `Document content:\n${pdfContent}\n\n`;
    }

    // Add conversation history
    if (conversationHistory.length > 0) {
      context += "Conversation history:\n";
      conversationHistory.slice(-10).forEach((msg) => {
        context += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      context += "\n";
    }

    const prompt = `${context}User question: ${userMessage}

Please provide a helpful and accurate response based on the document content and conversation history. If the question is not related to the document, politely guide the user back to document-related questions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "I apologize, but I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error("Failed to process message with AI");
  }
}

export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `Generate a short, descriptive title (max 6 words) for a conversation that starts with this message: "${firstMessage}"

Title:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text()?.trim() || "Document Discussion";
  } catch (error) {
    console.error("Title generation error:", error);
    return "Document Discussion";
  }
}
