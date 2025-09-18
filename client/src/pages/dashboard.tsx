import { useState } from "react";
import { motion } from "framer-motion";
import { User } from "@shared/schema";
import Navigation from "@/components/navigation";
import FileUpload from "@/components/file-upload";
import ChatInterface from "@/components/chat-interface";
import { useQuery } from "@tanstack/react-query";

interface DashboardProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function Dashboard({ user, setUser }: DashboardProps) {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const { data: files = [], refetch: refetchFiles } = useQuery({
    queryKey: ["/api/files"],
  });

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation user={user} setUser={setUser} />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, <span data-testid="text-username">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* File Management Sidebar */}
            <div className="lg:col-span-1">
              <FileUpload 
                onFileUploaded={refetchFiles}
                files={files}
                selectedFileId={selectedFileId}
                onFileSelect={setSelectedFileId}
              />
            </div>

            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <ChatInterface
                user={user}
                selectedFileId={selectedFileId}
                conversationId={conversationId}
                onConversationCreate={setConversationId}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
