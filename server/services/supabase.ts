import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { config } from "../config";

const supabaseUrl = config.SUPABASE_URL || "";
const supabaseKey = config.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function uploadToSupabase(localFilePath: string, fileName: string): Promise<string> {
  try {
    const fileBuffer = fs.readFileSync(localFilePath);
    const fileExt = path.extname(fileName);
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('pdfs')
      .upload(uniqueFileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: false
      });

    if (error) {
      throw error;
    }

    return data.path;
  } catch (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload file to storage");
  }
}

export async function deleteFromSupabase(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from('pdfs')
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Supabase delete error:", error);
    throw new Error("Failed to delete file from storage");
  }
}

export async function getFileUrl(filePath: string): Promise<string> {
  try {
    const { data } = supabase.storage
      .from('pdfs')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Supabase URL error:", error);
    throw new Error("Failed to get file URL");
  }
}
