import { motion } from "framer-motion";
import { User } from "@shared/schema";
import Navigation from "@/components/navigation";
import ConversationList from "@/components/conversation-list";
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface HistoryProps {
  user: User;
  setUser: (user: User | null) => void;
}

export default function History({ user, setUser }: HistoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation user={user} setUser={setUser} />
      
      <div className="container mx-auto px-6 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2" data-testid="text-history-title">Conversation History</h1>
              <p className="text-muted-foreground">Review your past conversations and insights</p>
            </div>
            <button className="glass-effect p-3 rounded-lg hover-glow transition-all" data-testid="button-search">
              <Search className="text-muted-foreground" />
            </button>
          </div>

          {/* Search and Filter */}
          <div className="glass-effect p-6 rounded-2xl mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-input border-border"
                  data-testid="input-search-conversations"
                />
              </div>
              <div className="flex gap-2">
                <Select value={selectedDocument} onValueChange={setSelectedDocument}>
                  <SelectTrigger className="w-48 bg-input border-border">
                    <SelectValue placeholder="All Documents" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Documents</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-48 bg-input border-border">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Conversation List */}
          <ConversationList
            userId={user.id}
            searchQuery={searchQuery}
            selectedDocument={selectedDocument}
            selectedTimeframe={selectedTimeframe}
          />
        </motion.div>
      </div>
    </div>
  );
}
