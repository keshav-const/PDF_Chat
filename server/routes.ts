import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { authMiddleware, requireAuth } from "./services/auth";
import { loginSchema, signupSchema } from "@shared/schema";
import { processMessage } from "./services/gemini";
import { parsePDF } from "./services/pdf-parser";
import { uploadToSupabase, deleteFromSupabase } from "./services/supabase";
import { uploadToLocalStorage, deleteFromLocalStorage, getLocalFilePath } from "./services/local-storage";
import { config } from "./config";
import bcrypt from "bcrypt";
import path from "path";
import fs from "fs";

const upload = multer({ dest: 'uploads/' });

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  app.use(authMiddleware);

  // Auth routes
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);
      
      // Check if user exists
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password and create user
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        email: data.email,
        password: hashedPassword,
      });

      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(data.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const user = await storage.getUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // File upload route
  app.post("/api/upload", requireAuth, upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (req.file.mimetype !== 'application/pdf') {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Only PDF files are allowed" });
      }

      // Parse PDF content
      const pdfText = await parsePDF(req.file.path);
      
      // Upload to storage (local in development, Supabase in production)
      const filePath = config.NODE_ENV === 'development' || !config.DATABASE_URL
        ? await uploadToLocalStorage(req.file.path, req.file.originalname)
        : await uploadToSupabase(req.file.path, req.file.originalname);
      
      // Save file record
      const file = await storage.createFile({
        userId: req.session.userId!,
        fileName: req.file.originalname,
        filePath: filePath,
        fileSize: req.file.size.toString(),
      });

      // Clean up local file
      fs.unlinkSync(req.file.path);

      res.json({ file, content: pdfText });
    } catch (error) {
      console.error("Upload error:", error);
      // Clean up file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ message: "Upload failed" });
    }
  });

  // Get user's files
  app.get("/api/files", requireAuth, async (req, res) => {
    try {
      const files = await storage.getFilesByUser(req.session.userId!);
      res.json(files);
    } catch (error) {
      console.error("Get files error:", error);
      res.status(500).json({ message: "Failed to get files" });
    }
  });

  // Delete file
  app.delete("/api/files/:fileId", requireAuth, async (req, res) => {
    try {
      const file = await storage.getFile(req.params.fileId);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      if (file.userId !== req.session.userId!) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Delete from storage (local in development, Supabase in production)
      if (config.NODE_ENV === 'development' || !config.DATABASE_URL) {
        await deleteFromLocalStorage(file.filePath);
      } else {
        await deleteFromSupabase(file.filePath);
      }
      
      // Delete file record
      await storage.deleteFile(req.params.fileId);

      res.json({ message: "File deleted successfully" });
    } catch (error) {
      console.error("Delete file error:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Chat route
  app.post("/api/chat", requireAuth, async (req, res) => {
    try {
      const { message, fileId, conversationId } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      let conversation;
      let pdfContent = "";

      // Get or create conversation
      if (conversationId) {
        conversation = await storage.getConversation(conversationId);
        if (!conversation || conversation.userId !== req.session.userId!) {
          return res.status(403).json({ message: "Unauthorized" });
        }
      } else if (fileId) {
        // Create new conversation
        const file = await storage.getFile(fileId);
        if (!file || file.userId !== req.session.userId!) {
          return res.status(403).json({ message: "File not found or unauthorized" });
        }
        
        conversation = await storage.createConversation({
          userId: req.session.userId!,
          fileId: fileId,
          title: `Chat about ${file.fileName}`,
        });

        // Get PDF content for context
        const pdfPath = config.NODE_ENV === 'development' || !config.DATABASE_URL
          ? getLocalFilePath(file.filePath)
          : file.filePath;
        pdfContent = await parsePDF(pdfPath);
      } else {
        return res.status(400).json({ message: "Either conversationId or fileId is required" });
      }

      // Save user message
      await storage.createMessage({
        conversationId: conversation.id,
        sender: "user",
        content: message,
      });

      // Get conversation history for context
      const messages = await storage.getMessagesByConversation(conversation.id);
      
      // Process with Gemini AI
      const aiResponse = await processMessage(message, pdfContent, messages);

      // Save AI response
      await storage.createMessage({
        conversationId: conversation.id,
        sender: "ai",
        content: aiResponse,
      });

      res.json({ 
        message: aiResponse, 
        conversationId: conversation.id 
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Get conversations
  app.get("/api/conversations", requireAuth, async (req, res) => {
    try {
      const conversations = await storage.getConversationsByUser(req.session.userId!);
      res.json(conversations);
    } catch (error) {
      console.error("Get conversations error:", error);
      res.status(500).json({ message: "Failed to get conversations" });
    }
  });

  // Get messages for a conversation
  app.get("/api/messages/:conversationId", requireAuth, async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.conversationId);
      if (!conversation || conversation.userId !== req.session.userId!) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const messages = await storage.getMessagesByConversation(req.params.conversationId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to get messages" });
    }
  });

  // Download file from local storage (development only)
  app.get("/api/files/download/:filename", requireAuth, async (req, res) => {
    try {
      if (config.NODE_ENV !== 'development' && config.DATABASE_URL) {
        return res.status(404).json({ message: "File download not available in production" });
      }

      const filePath = getLocalFilePath(req.params.filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      res.sendFile(filePath);
    } catch (error) {
      console.error("File download error:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:conversationId", requireAuth, async (req, res) => {
    try {
      const conversation = await storage.getConversation(req.params.conversationId);
      if (!conversation || conversation.userId !== req.session.userId!) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deleteConversation(req.params.conversationId);
      res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
      console.error("Delete conversation error:", error);
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
