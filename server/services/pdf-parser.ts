import fs from "fs";
import pdfParse from "pdf-parse";

export async function parsePDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Clean up the text
    let text = data.text;
    text = text.replace(/\s+/g, ' '); // Replace multiple whitespace with single space
    text = text.replace(/\n+/g, '\n'); // Replace multiple newlines with single newline
    text = text.trim();
    
    if (!text) {
      throw new Error("No text could be extracted from the PDF");
    }
    
    return text;
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to parse PDF content");
  }
}

export function chunkText(text: string, maxChunkSize: number = 4000): string[] {
  const chunks: string[] = [];
  const sentences = text.split(/[.!?]+/);
  
  let currentChunk = "";
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    if (!trimmedSentence) continue;
    
    if (currentChunk.length + trimmedSentence.length > maxChunkSize) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }
    }
    
    currentChunk += trimmedSentence + ". ";
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}
