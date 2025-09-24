// // // Import config first to ensure environment variables are loaded
// // import { config } from "./config";
// // import { 
// //   type User, 
// //   type InsertUser, 
// //   type File, 
// //   type InsertFile,
// //   type Conversation,
// //   type InsertConversation,
// //   type Message,
// //   type InsertMessage,
// //   users,
// //   files,
// //   conversations,
// //   messages
// // } from "@shared/schema";
// // import pkg from 'pg';
// // const { Pool } = pkg;
// // import { drizzle } from "drizzle-orm/node-postgres";
// // import { eq, desc } from "drizzle-orm";
// // import { randomUUID } from "crypto";

// // // Configure PostgreSQL connection with better reliability
// // let pool = null;
// // let db = null;

// // if (config.DATABASE_URL) {
// //   try {
// //     pool = new Pool({
// //       connectionString: config.DATABASE_URL,
// //       // Let the connection string handle SSL configuration
// //       ...(config.NODE_ENV === 'development' && {
// //         ssl: {
// //           rejectUnauthorized: false,
// //         },
// //       }),
// //       connectionTimeoutMillis: 30000,
// //       idleTimeoutMillis: 30000,
// //       max: 10, // Maximum number of clients in pool
// //       min: 2,  // Minimum number of clients in pool
// //     });
// //     
// //     db = drizzle(pool, {
// //       logger: config.NODE_ENV === 'development'
// //     });
// //     
// //     console.log('✅ PostgreSQL database connection configured');
// //   } catch (error) {
// //     console.log('❌ Database connection failed, falling back to in-memory storage:', error.message);
// //     pool = null;
// //     db = null;
// //   }
// // } else {
// //   console.log('⚠️  DATABASE_URL not set, using in-memory storage');
// // }

// // export interface IStorage {
// //   // User methods
// //   getUser(id: string): Promise<User | undefined>;
// //   getUserByEmail(email: string): Promise<User | undefined>;
// //   createUser(user: InsertUser): Promise<User>;
// //   
// //   // File methods
// //   getFile(id: string): Promise<File | undefined>;
// //   getFilesByUser(userId: string): Promise<File[]>;
// //   createFile(file: InsertFile): Promise<File>;
// //   deleteFile(id: string): Promise<void>;
// //   
// //   // Conversation methods
// //   getConversation(id: string): Promise<Conversation | undefined>;
// //   getConversationsByUser(userId: string): Promise<Conversation[]>;
// //   createConversation(conversation: InsertConversation): Promise<Conversation>;
// //   deleteConversation(id: string): Promise<void>;
// //   
// //   // Message methods
// //   getMessagesByConversation(conversationId: string): Promise<Message[]>;
// //   createMessage(message: InsertMessage): Promise<Message>;
// // }

// // export class DatabaseStorage implements IStorage {
// //   async getUser(id: string): Promise<User | undefined> {
// //     if (!db) throw new Error('Database not configured');
// //     const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
// //     return result[0];
// //   }

// //   async getUserByEmail(email: string): Promise<User | undefined> {
// //     if (!db) throw new Error('Database not configured');
// //     const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
// //     return result[0];
// //   }

// //   async createUser(insertUser: InsertUser): Promise<User> {
// //     if (!db) throw new Error('Database not configured');
// //     const result = await db.insert(users).values(insertUser).returning();
// //     return result[0];
// //   }

// //   async getFile(id: string): Promise<File | undefined> {
// //     if (!db) throw new Error('Database not configured');
// //     const result = await db.select().from(files).where(eq(files.id, id)).limit(1);
// //     return result[0];
// //   }

// //   async getFilesByUser(userId: string): Promise<File[]> {
// //     if (!db) throw new Error('Database not configured');
// //     return db.select().from(files).where(eq(files.userId, userId)).orderBy(desc(files.uploadedAt));
// //   }

// //   async createFile(insertFile: InsertFile): Promise<File> {
// //     if (!db) throw new Error('Database not configured');
// //     const result = await db.insert(files).values(insertFile).returning();
// //     return result[0];
// //   }

// //   async deleteFile(id: string): Promise<void> {
// //     if (!db) throw new Error('Database not configured');
// //     await db.delete(files).where(eq(files.id, id));
// //   }

// //   async getConversation(id: string): Promise<Conversation | undefined> {
// //     if (!db) throw new Error('Database not configured');
// //     const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
// //     return result[0];
// //   }

// //   async getConversationsByUser(userId: string): Promise<Conversation[]> {
// //     if (!db) throw new Error('Database not configured');
// //     return db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.createdAt));
// //   }

// //   async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
// //     if (!db) throw new Error('Database not configured');
// //     const result = await db.insert(conversations).values(insertConversation).returning();
// //     return result[0];
// //   }

// //   async deleteConversation(id: string): Promise<void> {
// //     if (!db) throw new Error('Database not configured');
// //     // Delete messages first
// //     await db.delete(messages).where(eq(messages.conversationId, id));
// //     // Then delete conversation
// //     await db.delete(conversations).where(eq(conversations.id, id));
// //   }

// //   async getMessagesByConversation(conversationId: string): Promise<Message[]> {
// //     if (!db) throw new Error('Database not configured');
// //     return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
// //   }

// //   async createMessage(insertMessage: InsertMessage): Promise<Message> {
// //     if (!db) throw new Error('Database not configured');
// //     const result = await db.insert(messages).values(insertMessage).returning();
// //     return result[0];
// //   }
// // }

// // // Fallback in-memory storage for development
// // export class MemStorage implements IStorage {
// //   private users: Map<string, User> = new Map();
// //   private files: Map<string, File> = new Map();
// //   private conversations: Map<string, Conversation> = new Map();
// //   private messages: Map<string, Message> = new Map();

// //   async getUser(id: string): Promise<User | undefined> {
// //     return this.users.get(id);
// //   }

// //   async getUserByEmail(email: string): Promise<User | undefined> {
// //     return Array.from(this.users.values()).find(user => user.email === email);
// //   }

// //   async createUser(insertUser: InsertUser): Promise<User> {
// //     const id = randomUUID();
// //     const user: User = { ...insertUser, id, createdAt: new Date() };
// //     this.users.set(id, user);
// //     return user;
// //   }

// //   async getFile(id: string): Promise<File | undefined> {
// //     return this.files.get(id);
// //   }

// //   async getFilesByUser(userId: string): Promise<File[]> {
// //     return Array.from(this.files.values())
// //       .filter(file => file.userId === userId)
// //       .sort((a, b) => new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime());
// //   }

// //   async createFile(insertFile: InsertFile): Promise<File> {
// //     const id = randomUUID();
// //     const file: File = { ...insertFile, id, uploadedAt: new Date() };
// //     this.files.set(id, file);
// //     return file;
// //   }

// //   async deleteFile(id: string): Promise<void> {
// //     this.files.delete(id);
// //   }

// //   async getConversation(id: string): Promise<Conversation | undefined> {
// //     return this.conversations.get(id);
// //   }

// //   async getConversationsByUser(userId: string): Promise<Conversation[]> {
// //     return Array.from(this.conversations.values())
// //       .filter(conv => conv.userId === userId)
// //       .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
// //   }

// //   async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
// //     const id = randomUUID();
// //     const conversation: Conversation = { 
// //       ...insertConversation, 
// //       id, 
// //       createdAt: new Date(),
// //       fileId: insertConversation.fileId ?? null
// //     };
// //     this.conversations.set(id, conversation);
// //     return conversation;
// //   }

// //   async deleteConversation(id: string): Promise<void> {
// //     // Delete associated messages
// //     Array.from(this.messages.entries()).forEach(([msgId, msg]) => {
// //       if (msg.conversationId === id) {
// //         this.messages.delete(msgId);
// //       }
// //     });
// //     this.conversations.delete(id);
// //   }

// //   async getMessagesByConversation(conversationId: string): Promise<Message[]> {
// //     return Array.from(this.messages.values())
// //       .filter(msg => msg.conversationId === conversationId)
// //       .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
// //   }

// //   async createMessage(insertMessage: InsertMessage): Promise<Message> {
// //     const id = randomUUID();
// //     const message: Message = { 
// //       ...insertMessage, 
// //       id, 
// //       createdAt: new Date(),
// //       metadata: insertMessage.metadata ?? null
// //     };
// //     this.messages.set(id, message);
// //     return message;
// //   }
// // }

// // export const storage = config.DATABASE_URL ? new DatabaseStorage() : new MemStorage();
// // Import config first to ensure environment variables are loaded
// import { config } from "./config";
// import { 
//   type User, 
//   type InsertUser, 
//   type File, 
//   type InsertFile,
//   type Conversation,
//   type InsertConversation,
//   type Message,
//   type InsertMessage
// } from "@shared/schema";
// import { createClient } from '@supabase/supabase-js';
// import { randomUUID } from "crypto";

// // Configure Supabase client (works reliably in all environments)
// let supabase = null;

// if (config.SUPABASE_URL && config.SUPABASE_ANON_KEY) {
//   try {
//     supabase = createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
//     console.log('✅ Supabase client configured (HTTPS-based, deployment-ready)');
//   } catch (error) {
//     console.log('❌ Supabase client configuration failed:', error.message);
//   }
// } else {
//   console.log('⚠️  Supabase credentials not set, using in-memory storage');
// }

// export interface IStorage {
//   // User methods
//   getUser(id: string): Promise<User | undefined>;
//   getUserByEmail(email: string): Promise<User | undefined>;
//   createUser(user: InsertUser): Promise<User>;
  
//   // File methods
//   getFile(id: string): Promise<File | undefined>;
//   getFilesByUser(userId: string): Promise<File[]>;
//   createFile(file: InsertFile): Promise<File>;
//   deleteFile(id: string): Promise<void>;
  
//   // Conversation methods
//   getConversation(id: string): Promise<Conversation | undefined>;
//   getConversationsByUser(userId: string): Promise<Conversation[]>;
//   createConversation(conversation: InsertConversation): Promise<Conversation>;
//   deleteConversation(id: string): Promise<void>;
  
//   // Message methods
//   getMessagesByConversation(conversationId: string): Promise<Message[]>;
//   createMessage(message: InsertMessage): Promise<Message>;
// }

// export class SupabaseStorage implements IStorage {
//   async getUser(id: string): Promise<User | undefined> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) {
//       if (error.code === 'PGRST116') return undefined; // Not found
//       throw new Error(`Failed to get user: ${error.message}`);
//     }
    
//     // Map snake_case to camelCase
//     return {
//       id: data.id,
//       email: data.email,
//       password: data.password,
//       createdAt: data.created_at
//     };
//   }

//   async getUserByEmail(email: string): Promise<User | undefined> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('users')
//       .select('*')
//       .eq('email', email)
//       .single();
    
//     if (error) {
//       if (error.code === 'PGRST116') return undefined; // Not found
//       throw new Error(`Failed to get user by email: ${error.message}`);
//     }
    
//     // Map snake_case to camelCase
//     return {
//       id: data.id,
//       email: data.email,
//       password: data.password,
//       createdAt: data.created_at
//     };
//   }

//   async createUser(insertUser: InsertUser): Promise<User> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('users')
//       .insert(insertUser)
//       .select()
//       .single();
    
//     if (error) {
//       throw new Error(`Failed to create user: ${error.message}`);
//     }
    
//     // Map snake_case to camelCase
//     return {
//       id: data.id,
//       email: data.email,
//       password: data.password,
//       createdAt: data.created_at
//     };
//   }

//   // File methods
//   async getFile(id: string): Promise<File | undefined> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('files')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) {
//       if (error.code === 'PGRST116') return undefined; // Not found
//       throw new Error(`Failed to get file: ${error.message}`);
//     }
    
//     // Map snake_case to camelCase
//     return {
//       id: data.id,
//       userId: data.user_id,
//       fileName: data.file_name,
//       filePath: data.file_path,
//       fileSize: data.file_size,
//       uploadedAt: data.uploaded_at
//     };
//   }

//   async getFilesByUser(userId: string): Promise<File[]> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('files')
//       .select('*')
//       .eq('user_id', userId)
//       .order('uploaded_at', { ascending: false });
    
//     if (error) {
//       throw new Error(`Failed to get files by user: ${error.message}`);
//     }
    
//     // Map snake_case to camelCase for each file
//     return (data || []).map(file => ({
//       id: file.id,
//       userId: file.user_id,
//       fileName: file.file_name,
//       filePath: file.file_path,
//       fileSize: file.file_size,
//       uploadedAt: file.uploaded_at
//     }));
//   }

//   async createFile(insertFile: InsertFile): Promise<File> {
//     if (!supabase) throw new Error('Supabase not configured');
    
//     // Map camelCase to snake_case for Supabase
//     const supabaseFile = {
//       user_id: insertFile.userId,
//       file_name: insertFile.fileName,
//       file_path: insertFile.filePath,
//       file_size: insertFile.fileSize
//     };
    
//     const { data, error } = await supabase
//       .from('files')
//       .insert(supabaseFile)
//       .select()
//       .single();
    
//     if (error) {
//       throw new Error(`Failed to create file: ${error.message}`);
//     }
    
//     // Map snake_case back to camelCase
//     return {
//       id: data.id,
//       userId: data.user_id,
//       fileName: data.file_name,
//       filePath: data.file_path,
//       fileSize: data.file_size,
//       uploadedAt: data.uploaded_at
//     };
//   }

//   async deleteFile(id: string): Promise<void> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { error } = await supabase
//       .from('files')
//       .delete()
//       .eq('id', id);
    
//     if (error) {
//       throw new Error(`Failed to delete file: ${error.message}`);
//     }
//   }

//   // Conversation methods
//   async getConversation(id: string): Promise<Conversation | undefined> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('conversations')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) {
//       if (error.code === 'PGRST116') return undefined; // Not found
//       throw new Error(`Failed to get conversation: ${error.message}`);
//     }
    
//     // Map snake_case to camelCase
//     return {
//       id: data.id,
//       userId: data.user_id,
//       fileId: data.file_id,
//       title: data.title,
//       createdAt: data.created_at
//     };
//   }

//   async getConversationsByUser(userId: string): Promise<Conversation[]> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('conversations')
//       .select('*')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false });
    
//     if (error) {
//       throw new Error(`Failed to get conversations by user: ${error.message}`);
//     }
    
//     // Map snake_case to camelCase for each conversation
//     return (data || []).map(conversation => ({
//       id: conversation.id,
//       userId: conversation.user_id,
//       fileId: conversation.file_id,
//       title: conversation.title,
//       createdAt: conversation.created_at
//     }));
//   }

//   async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
//     if (!supabase) throw new Error('Supabase not configured');
    
//     // Map camelCase to snake_case for Supabase
//     const supabaseConversation = {
//       user_id: insertConversation.userId,
//       file_id: insertConversation.fileId,
//       title: insertConversation.title
//     };
    
//     const { data, error } = await supabase
//       .from('conversations')
//       .insert(supabaseConversation)
//       .select()
//       .single();
    
//     if (error) {
//       throw new Error(`Failed to create conversation: ${error.message}`);
//     }
    
//     // Map snake_case back to camelCase
//     return {
//       id: data.id,
//       userId: data.user_id,
//       fileId: data.file_id,
//       title: data.title,
//       createdAt: data.created_at
//     };
//   }

//   async deleteConversation(id: string): Promise<void> {
//     if (!supabase) throw new Error('Supabase not configured');
    
//     // Delete messages first
//     const { error: messagesError } = await supabase
//       .from('messages')
//       .delete()
//       .eq('conversation_id', id);
    
//     if (messagesError) {
//       throw new Error(`Failed to delete conversation messages: ${messagesError.message}`);
//     }
    
//     // Then delete conversation
//     const { error: conversationError } = await supabase
//       .from('conversations')
//       .delete()
//       .eq('id', id);
    
//     if (conversationError) {
//       throw new Error(`Failed to delete conversation: ${conversationError.message}`);
//     }
//   }

//   // Message methods
//   async getMessagesByConversation(conversationId: string): Promise<Message[]> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('messages')
//       .select('*')
//       .eq('conversation_id', conversationId)
//       .order('created_at', { ascending: true });
    
//     if (error) {
//       throw new Error(`Failed to get messages by conversation: ${error.message}`);
//     }
    
//     // Map snake_case to camelCase for each message
//     return (data || []).map(message => ({
//       id: message.id,
//       conversationId: message.conversation_id,
//       sender: message.sender,
//       content: message.content,
//       metadata: message.metadata,
//       createdAt: message.created_at
//     }));
//   }

//   async createMessage(insertMessage: InsertMessage): Promise<Message> {
//     if (!supabase) throw new Error('Supabase not configured');
//     const { data, error } = await supabase
//       .from('messages')
//       .insert({
//         conversation_id: insertMessage.conversationId,
//         sender: insertMessage.sender,
//         content: insertMessage.content,
//         metadata: insertMessage.metadata || null
//       })
//       .select()
//       .single();
    
//     if (error) {
//       throw new Error(`Failed to create message: ${error.message}`);
//     }
    
//     // Map snake_case back to camelCase
//     return {
//       id: data.id,
//       conversationId: data.conversation_id,
//       sender: data.sender,
//       content: data.content,
//       metadata: data.metadata,
//       createdAt: data.created_at
//     };
//   }
// }

// // Fallback in-memory storage for development
// export class MemStorage implements IStorage {
//   private users: Map<string, User> = new Map();
//   private files: Map<string, File> = new Map();
//   private conversations: Map<string, Conversation> = new Map();
//   private messages: Map<string, Message> = new Map();

//   async getUser(id: string): Promise<User | undefined> {
//     return this.users.get(id);
//   }

//   async getUserByEmail(email: string): Promise<User | undefined> {
//     return Array.from(this.users.values()).find(user => user.email === email);
//   }

//   async createUser(insertUser: InsertUser): Promise<User> {
//     const id = randomUUID();
//     const user: User = { ...insertUser, id, createdAt: new Date() };
//     this.users.set(id, user);
//     return user;
//   }

//   async getFile(id: string): Promise<File | undefined> {
//     return this.files.get(id);
//   }

//   async getFilesByUser(userId: string): Promise<File[]> {
//     return Array.from(this.files.values())
//       .filter(file => file.userId === userId)
//       .sort((a, b) => new Date(b.uploadedAt!).getTime() - new Date(a.uploadedAt!).getTime());
//   }

//   async createFile(insertFile: InsertFile): Promise<File> {
//     const id = randomUUID();
//     const file: File = { ...insertFile, id, uploadedAt: new Date() };
//     this.files.set(id, file);
//     return file;
//   }

//   async deleteFile(id: string): Promise<void> {
//     this.files.delete(id);
//   }

//   async getConversation(id: string): Promise<Conversation | undefined> {
//     return this.conversations.get(id);
//   }

//   async getConversationsByUser(userId: string): Promise<Conversation[]> {
//     return Array.from(this.conversations.values())
//       .filter(conv => conv.userId === userId)
//       .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
//   }

//   async createConversation(insertConversation: InsertConversation): Promise<Conversation> {
//     const id = randomUUID();
//     const conversation: Conversation = { 
//       ...insertConversation, 
//       id, 
//       createdAt: new Date(),
//       fileId: insertConversation.fileId ?? null
//     };
//     this.conversations.set(id, conversation);
//     return conversation;
//   }

//   async deleteConversation(id: string): Promise<void> {
//     // Delete associated messages
//     Array.from(this.messages.entries()).forEach(([msgId, msg]) => {
//       if (msg.conversationId === id) {
//         this.messages.delete(msgId);
//       }
//     });
//     this.conversations.delete(id);
//   }

//   async getMessagesByConversation(conversationId: string): Promise<Message[]> {
//     return Array.from(this.messages.values())
//       .filter(msg => msg.conversationId === conversationId)
//       .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
//   }

//   async createMessage(insertMessage: InsertMessage): Promise<Message> {
//     const id = randomUUID();
//     const message: Message = { 
//       ...insertMessage, 
//       id, 
//       createdAt: new Date(),
//       metadata: insertMessage.metadata ?? null
//     };
//     this.messages.set(id, message);
//     return message;
//   }
// }

// export const storage = supabase ? new SupabaseStorage() : new MemStorage();

// console.log(`Using storage: ${supabase ? 'SupabaseStorage (HTTPS)' : 'MemStorage (in-memory)'}`);

// import { and, eq, desc } from "drizzle-orm";
// import {db} from "./db.ts";
// import {
//   users,
//   files,
//   conversations,
//   messages,
//   type InsertUser,
//   type InsertFile,
//   type InsertConversation,
//   type InsertMessage,
//   type User,
//   type File,
//   type Conversation,
//   type Message
// } from "@shared/schema";
// import { downloadFromSupabase } from "./services/supabase"; // Assuming this exists

// export class SupabaseStorage {
//   // --- USER METHODS ---
//   async getUserByEmail(email: string): Promise<User | undefined> {
//     const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
//     return result[0];
//   }

//   async getUser(id: string): Promise<User | undefined> {
//     const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
//     return result[0];
//   }

//   async createUser(data: InsertUser): Promise<User> {
//     const [user] = await db.insert(users).values(data).returning();
//     return user;
//   }

//   // --- FILE METHODS ---
//   async getFile(id: string): Promise<File | undefined> {
//     const result = await db.select().from(files).where(eq(files.id, id)).limit(1);
//     return result[0];
//   }

//   async getFilesByUser(userId: string): Promise<File[]> {
//     return db.select().from(files).where(eq(files.userId, userId)).orderBy(desc(files.uploadedAt));
//   }

//   async createFile(data: InsertFile): Promise<File> {
//     const [file] = await db.insert(files).values(data).returning();
//     return file;
//   }

//   async deleteFile(id: string): Promise<void> {
//     await db.delete(files).where(eq(files.id, id));
//   }
  
//   async downloadFromSupabase(filePath: string): Promise<string> {
//     return downloadFromSupabase(filePath);
//   }

//   // --- CONVERSATION & MESSAGE METHODS ---
//   async getConversation(id: string): Promise<Conversation | undefined> {
//     const result = await db.select().from(conversations).where(eq(conversations.id, id)).limit(1);
//     return result[0];
//   }

//   async getConversationsByUser(userId: string): Promise<Conversation[]> {
//     return db.select().from(conversations).where(eq(conversations.userId, userId)).orderBy(desc(conversations.createdAt));
//   }

//   // THIS IS THE NEW METHOD
//   async getConversationsWithFiles(userId: string) {
//     try {
//       const result = await db
//         .select({
//           id: conversations.id,
//           userId: conversations.userId,
//           fileId: conversations.fileId,
//           title: conversations.title,
//           createdAt: conversations.createdAt,
//           fileName: files.fileName, // Include the file name
//         })
//         .from(conversations)
//         .leftJoin(files, eq(conversations.fileId, files.id)) // Join with files table
//         .where(eq(conversations.userId, userId))
//         .orderBy(desc(conversations.createdAt));
//       return result;
//     } catch (error) {
//       console.error("Error getting conversations with files:", error);
//       throw new Error("Failed to get conversations with files");
//     }
//   }

//   async createConversation(data: InsertConversation): Promise<Conversation> {
//     const [convo] = await db.insert(conversations).values(data).returning();
//     return convo;
//   }

//   async deleteConversation(id: string): Promise<void> {
//     await db.delete(conversations).where(eq(conversations.id, id));
//   }

//   async getMessagesByConversation(conversationId: string): Promise<Message[]> {
//     return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
//   }

//   async createMessage(data: InsertMessage): Promise<Message> {
//     const [message] = await db.insert(messages).values(data).returning();
//     return message;
//   }
// }

// export const storage = new SupabaseStorage();

import { createClient } from '@supabase/supabase-js';
import { config } from './config.js';
import {
  type InsertUser,
  type InsertFile,
  type InsertConversation,
  type InsertMessage,
  type User,
  type File,
  type Conversation,
  type Message,
} from "../shared/schema.js";
import { downloadFromSupabase } from "./services/supabase.js";

// Create Supabase client
const supabase = createClient(config.SUPABASE_URL!, config.SUPABASE_ANON_KEY!);

export class SupabaseStorage {
  // --- USER METHODS ---
  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      createdAt: new Date(data.created_at)
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      email: data.email,
      password: data.password,
      createdAt: new Date(data.created_at)
    };
  }

  async createUser(data: InsertUser): Promise<User> {
    const { data: result, error } = await supabase
      .from('users')
      .insert(data)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    
    return {
      id: result.id,
      email: result.email,
      password: result.password,
      createdAt: new Date(result.created_at)
    };
  }

  // --- FILE METHODS ---
  async getFile(id: string): Promise<File | undefined> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      userId: data.user_id,
      fileName: data.file_name,
      filePath: data.file_path,
      fileSize: data.file_size,
      uploadedAt: new Date(data.uploaded_at)
    };
  }

  async getFilesByUser(userId: string): Promise<File[]> {
    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false });
    
    if (error) return [];
    
    return (data || []).map(file => ({
      id: file.id,
      userId: file.user_id,
      fileName: file.file_name,
      filePath: file.file_path,
      fileSize: file.file_size,
      uploadedAt: new Date(file.uploaded_at)
    }));
  }

  async createFile(data: InsertFile): Promise<File> {
    const { data: result, error } = await supabase
      .from('files')
      .insert({
        user_id: data.userId,
        file_name: data.fileName,
        file_path: data.filePath,
        file_size: data.fileSize
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create file: ${error.message}`);
    
    return {
      id: result.id,
      userId: result.user_id,
      fileName: result.file_name,
      filePath: result.file_path,
      fileSize: result.file_size,
      uploadedAt: new Date(result.uploaded_at)
    };
  }

  async deleteFile(id: string): Promise<void> {
    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`Failed to delete file: ${error.message}`);
  }

  async downloadFromSupabase(filePath: string): Promise<string> {
    return downloadFromSupabase(filePath);
  }

  // --- CONVERSATION & MESSAGE METHODS ---
  async getConversation(id: string): Promise<Conversation | undefined> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return undefined;
    
    return {
      id: data.id,
      userId: data.user_id,
      fileId: data.file_id,
      title: data.title,
      createdAt: new Date(data.created_at)
    };
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    
    return (data || []).map(conversation => ({
      id: conversation.id,
      userId: conversation.user_id,
      fileId: conversation.file_id,
      title: conversation.title,
      createdAt: new Date(conversation.created_at)
    }));
  }

  async getConversationsWithFiles(userId: string) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          user_id,
          file_id,
          title,
          created_at,
          files!left(file_name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(conversation => ({
        id: conversation.id,
        userId: conversation.user_id,
        fileId: conversation.file_id,
        title: conversation.title,
        createdAt: new Date(conversation.created_at),
        fileName: Array.isArray(conversation.files) && conversation.files.length > 0
          ? conversation.files[0].file_name
          : null
      }));
    } catch (error) {
      console.error("Error getting conversations with files:", error);
      throw new Error("Failed to get conversations with files");
    }
  }

  async createConversation(data: InsertConversation): Promise<Conversation> {
    const { data: result, error } = await supabase
      .from('conversations')
      .insert({
        user_id: data.userId,
        file_id: data.fileId,
        title: data.title
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create conversation: ${error.message}`);
    
    return {
      id: result.id,
      userId: result.user_id,
      fileId: result.file_id,
      title: result.title,
      createdAt: new Date(result.created_at)
    };
  }

  async deleteConversation(id: string): Promise<void> {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);
    
    if (error) throw new Error(`Failed to delete conversation: ${error.message}`);
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) return [];
    
    return (data || []).map(message => ({
      id: message.id,
      conversationId: message.conversation_id,
      sender: message.sender,
      content: message.content,
      metadata: message.metadata,
      createdAt: new Date(message.created_at)
    }));
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const { data: result, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: data.conversationId,
        sender: data.sender,
        content: data.content,
        metadata: data.metadata || null
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create message: ${error.message}`);
    
    return {
      id: result.id,
      conversationId: result.conversation_id,
      sender: result.sender,
      content: result.content,
      metadata: result.metadata,
      createdAt: new Date(result.created_at)
    };
  }
}

export const storage = new SupabaseStorage();