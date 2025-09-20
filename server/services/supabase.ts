// import { createClient } from "@supabase/supabase-js";
// import fs from "fs";
// import path from "path";
// import { config } from "../config";

// const supabaseUrl = config.SUPABASE_URL || "";
// const supabaseKey = config.SUPABASE_ANON_KEY || "";

// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function uploadToSupabase(localFilePath: string, fileName: string): Promise<string> {
//   try {
//     const fileBuffer = fs.readFileSync(localFilePath);
//     const fileExt = path.extname(fileName);
//     const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExt}`;
    
//     const { data, error } = await supabase.storage
//       .from('pdfs')
//       .upload(uniqueFileName, fileBuffer, {
//         contentType: 'application/pdf',
//         upsert: false
//       });

//     if (error) {
//       throw error;
//     }

//     return data.path;
//   } catch (error) {
//     console.error("Supabase upload error:", error);
//     throw new Error("Failed to upload file to storage");
//   }
// }

// export async function deleteFromSupabase(filePath: string): Promise<void> {
//   try {
//     const { error } = await supabase.storage
//       .from('pdfs')
//       .remove([filePath]);

//     if (error) {
//       throw error;
//     }
//   } catch (error) {
//     console.error("Supabase delete error:", error);
//     throw new Error("Failed to delete file from storage");
//   }
// }

// export async function getFileUrl(filePath: string): Promise<string> {
//   try {
//     const { data } = supabase.storage
//       .from('pdfs')
//       .getPublicUrl(filePath);

//     return data.publicUrl;
//   } catch (error) {
//     console.error("Supabase URL error:", error);
//     throw new Error("Failed to get file URL");
//   }
// }
import { createClient } from "@supabase/supabase-js";
import { config } from "../config";
import fs from "fs";
import path from "path";
import os from "os";

// --- THIS IS THE FIX ---
// The config uses SUPABASE_ANON_KEY, so we use that here.
// We also now correctly check for the new SUPABASE_BUCKET variable.
if (!config.SUPABASE_URL || !config.SUPABASE_ANON_KEY || !config.SUPABASE_BUCKET) {
  throw new Error("Supabase environment variables are not set completely.");
}

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);

export async function uploadToSupabase(
  filePath: string,
  fileName: string
): Promise<string> {
  try {
    const fileContent = fs.readFileSync(filePath);
    const uniqueFileName = `${Date.now()}-${fileName}`;

    const { data, error } = await supabase.storage
      .from(config.SUPABASE_BUCKET!)
      .upload(uniqueFileName, fileContent, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    return data.path;
  } catch (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload file to Supabase");
  }
}

export async function deleteFromSupabase(filePath: string): Promise<void> {
  try {
    const { error } = await supabase.storage
      .from(config.SUPABASE_BUCKET!)
      .remove([filePath]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Supabase delete error:", error);
    throw new Error("Failed to delete file from Supabase");
  }
}

export async function downloadFromSupabase(
  filePath: string
): Promise<string> {
  try {
    const { data, error } = await supabase.storage
      .from(config.SUPABASE_BUCKET!)
      .download(filePath);

    if (error) {
      throw error;
    }

    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, path.basename(filePath));
    
    const fileBuffer = Buffer.from(await data.arrayBuffer());
    fs.writeFileSync(tempFilePath, fileBuffer);

    return tempFilePath;
  } catch (error) {
    console.error("Supabase download error:", error);
    throw new Error("Failed to download file from Supabase");
  }
}