import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Create uploads directory if it doesn't exist
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function uploadToLocalStorage(localFilePath: string, fileName: string): Promise<string> {
  try {
    const fileExt = path.extname(fileName);
    const uniqueFileName = `${Date.now()}-${randomUUID()}${fileExt}`;
    const destinationPath = path.join(uploadsDir, uniqueFileName);
    
    // Copy file to uploads directory
    fs.copyFileSync(localFilePath, destinationPath);
    
    return uniqueFileName; // Return just the filename as the path
  } catch (error) {
    console.error("Local storage upload error:", error);
    throw new Error("Failed to upload file to local storage");
  }
}

export async function deleteFromLocalStorage(filePath: string): Promise<void> {
  try {
    const fullPath = path.join(uploadsDir, filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error("Local storage delete error:", error);
    throw new Error("Failed to delete file from local storage");
  }
}

export function getLocalFileUrl(filePath: string): string {
  // Return a local file URL that can be served by express
  return `/api/files/download/${filePath}`;
}

export function getLocalFilePath(filePath: string): string {
  return path.join(uploadsDir, filePath);
}