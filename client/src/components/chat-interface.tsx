import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Message } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, Paperclip, Bot, User as UserIcon, AlertCircle } from "lucide-react";

interface ChatInterfaceProps {
  user: User;
  selectedFileId: string | null;
  conversationId: string | null;
  onConversationCreate: (id: string) => void;
}

export default function ChatInterface({ 
  user, 
  selectedFileId, 
  conversationId,
  onConversationCreate 
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["/api/messages", conversationId],
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; fileId?: string; conversationId?: string }) => {
      const response = await apiRequest("POST", "/api/chat", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.conversationId && !conversationId) {
        onConversationCreate(data.conversationId);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/messages", data.conversationId] });
      setMessage("");
      setIsTyping(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!selectedFileId && !conversationId) {
      toast({
        title: "No document selected",
        description: "Please select a PDF document to start chatting.",
        variant: "destructive",
      });
      return;
    }

    setIsTyping(true);
    sendMessageMutation.mutate({
      message: message.trim(),
      fileId: selectedFileId || undefined,
      conversationId: conversationId || undefined,
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="glass-effect rounded-2xl h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">
              {selectedFileId ? "Ask me anything about your documents" : "Select a document to start chatting"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-4">
          {!conversationId && !selectedFileId ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Upload a PDF and select it to start a conversation</p>
              </div>
            </div>
          ) : !conversationId ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white text-xs" />
              </div>
              <div className="chat-bubble-ai p-4 rounded-2xl rounded-tl-sm max-w-md">
                <p className="text-sm">Hello! I'm ready to help you understand your document. Ask me any questions about the content.</p>
                <span className="text-xs text-muted-foreground mt-2 block">Just now</span>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((msg: Message, index: number) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.sender === 'user' ? (
                    <>
                      <div className="chat-bubble-user p-4 rounded-2xl rounded-tr-sm max-w-md">
                        <p className="text-sm text-white">{msg.content}</p>
                        <span className="text-xs text-white/70 mt-2 block">
                          {new Date(msg.createdAt!).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <UserIcon className="text-white text-xs" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="text-white text-xs" />
                      </div>
                      <div className="chat-bubble-ai p-4 rounded-2xl rounded-tl-sm max-w-md">
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">
                          {new Date(msg.createdAt!).toLocaleTimeString()}
                        </span>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start space-x-3"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white text-xs" />
              </div>
              <div className="chat-bubble-ai p-4 rounded-2xl rounded-tl-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-6 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedFileId ? "Ask me anything about your documents..." : "Select a document first..."}
              disabled={!selectedFileId || sendMessageMutation.isPending}
              className="pr-12 bg-input border-border"
              data-testid="input-chat-message"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-attach-file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
          </div>
          <Button
            type="submit"
            disabled={!message.trim() || !selectedFileId || sendMessageMutation.isPending}
            className="hover-glow transition-all"
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
