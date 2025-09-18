import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Conversation } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { MessageSquare, Calendar, Clock, Bookmark, Share, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ConversationListProps {
  userId: string;
  searchQuery: string;
  selectedDocument: string;
  selectedTimeframe: string;
}

export default function ConversationList({
  userId,
  searchQuery,
  selectedDocument,
  selectedTimeframe
}: ConversationListProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ["/api/conversations", userId, searchQuery, selectedDocument, selectedTimeframe],
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (conversationId: string) => {
      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      toast({
        title: "Success",
        description: "Conversation deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete conversation",
        variant: "destructive",
      });
    },
  });

  const handleConversationClick = (conversation: Conversation) => {
    // Navigate to dashboard with conversation loaded
    setLocation(`/dashboard?conversation=${conversation.id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-effect p-6 rounded-2xl animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
            <div className="flex space-x-4">
              <div className="h-3 bg-muted rounded w-20"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
              <div className="h-3 bg-muted rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No conversations found</h3>
        <p className="text-muted-foreground">
          {searchQuery 
            ? "Try adjusting your search criteria" 
            : "Start a conversation by uploading a PDF and asking questions"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation: Conversation, index: number) => (
        <motion.div
          key={conversation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="glass-effect p-6 rounded-2xl hover-glow cursor-pointer transition-all"
          onClick={() => handleConversationClick(conversation)}
          data-testid={`card-conversation-${conversation.id}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <MessageSquare className="text-white text-xs" />
                </div>
                <h3 className="font-semibold" data-testid={`text-conversation-title-${conversation.id}`}>
                  {conversation.title}
                </h3>
                {conversation.fileId && (
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs">
                    Document Chat
                  </span>
                )}
              </div>
              
              <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                {conversation.title}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formatDistanceToNow(new Date(conversation.createdAt!), { addSuffix: true })}
                </span>
                <span className="flex items-center">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  Chat
                </span>
                <span className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  5 min read
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-secondary/50"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement bookmark functionality
                }}
                data-testid={`button-bookmark-${conversation.id}`}
              >
                <Bookmark className="h-4 w-4 text-muted-foreground" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-secondary/50"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement share functionality
                }}
                data-testid={`button-share-${conversation.id}`}
              >
                <Share className="h-4 w-4 text-muted-foreground" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-destructive/20"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversationMutation.mutate(conversation.id);
                }}
                disabled={deleteConversationMutation.isPending}
                data-testid={`button-delete-conversation-${conversation.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
      
      {/* Load More */}
      {conversations.length >= 10 && (
        <div className="text-center mt-8">
          <Button variant="outline" className="glass-effect border-border hover-glow" data-testid="button-load-more">
            Load More Conversations
          </Button>
        </div>
      )}
    </div>
  );
}
