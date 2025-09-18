import { apiRequest } from "./queryClient";

export async function uploadFile(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('pdf', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Upload failed');
  }
  
  return response.json();
}

export async function sendMessage(data: {
  message: string;
  fileId?: string;
  conversationId?: string;
}): Promise<any> {
  const response = await apiRequest("POST", "/api/chat", data);
  return response.json();
}

export async function getFiles(): Promise<any[]> {
  const response = await apiRequest("GET", "/api/files");
  return response.json();
}

export async function getConversations(userId: string): Promise<any[]> {
  const response = await apiRequest("GET", `/api/conversations?userId=${userId}`);
  return response.json();
}

export async function getMessages(conversationId: string): Promise<any[]> {
  const response = await apiRequest("GET", `/api/messages?conversationId=${conversationId}`);
  return response.json();
}
