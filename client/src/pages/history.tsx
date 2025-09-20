// import { motion } from "framer-motion";
// import { User } from "@shared/schema";
// import Navigation from "@/components/navigation";
// import ConversationList from "@/components/conversation-list";
// import { useState } from "react";
// import { Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// interface HistoryProps {
//   user: User;
//   setUser: (user: User | null) => void;
// }

// export default function History({ user, setUser }: HistoryProps) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedDocument, setSelectedDocument] = useState<string>("all");
//   const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");

//   return (
//     <div className="min-h-screen gradient-bg">
//       <Navigation user={user} setUser={setUser} />
      
//       <div className="container mx-auto px-6 py-8 pt-24">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           {/* Page Header */}
//           <div className="flex items-center justify-between mb-8">
//             <div>
//               <h1 className="text-3xl font-bold mb-2" data-testid="text-history-title">Conversation History</h1>
//               <p className="text-muted-foreground">Review your past conversations and insights</p>
//             </div>
//             <button className="glass-effect p-3 rounded-lg hover-glow transition-all" data-testid="button-search">
//               <Search className="text-muted-foreground" />
//             </button>
//           </div>

//           {/* Search and Filter */}
//           <div className="glass-effect p-6 rounded-2xl mb-8">
//             <div className="flex flex-col md:flex-row gap-4">
//               <div className="flex-1">
//                 <Input
//                   type="text"
//                   placeholder="Search conversations..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="bg-input border-border"
//                   data-testid="input-search-conversations"
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <Select value={selectedDocument} onValueChange={setSelectedDocument}>
//                   <SelectTrigger className="w-48 bg-input border-border">
//                     <SelectValue placeholder="All Documents" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Documents</SelectItem>
//                   </SelectContent>
//                 </Select>
                
//                 <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
//                   <SelectTrigger className="w-48 bg-input border-border">
//                     <SelectValue placeholder="All Time" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Time</SelectItem>
//                     <SelectItem value="7days">Last 7 days</SelectItem>
//                     <SelectItem value="30days">Last 30 days</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {/* Conversation List */}
//           <ConversationList
//             userId={user.id}
//             searchQuery={searchQuery}
//             selectedDocument={selectedDocument}
//             selectedTimeframe={selectedTimeframe}
//           />
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import ConversationList from "../components/conversation-list"; // Corrected import
// import Navigation from "../components/navigation"; // Corrected import
// import { User } from "../../../shared/schema"; // Corrected import path
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Search } from "lucide-react";

// interface HistoryProps {
//   user: User;
//   setUser: (user: User | null) => void;
// }

// export default function History({ user, setUser }: HistoryProps) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedDocument, setSelectedDocument] = useState("all");
//   const [selectedTimeframe, setSelectedTimeframe] = useState("all");

//   return (
//     <div className="flex flex-col h-screen">
//       <Navigation user={user} setUser={setUser} />
//       <div className="flex-1 pt-20 container mx-auto px-6 py-8">
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Conversation History</h1>
//           <p className="text-muted-foreground">
//             Review and manage your past interactions.
//           </p>
//         </header>

//         <div className="mb-6 flex flex-col md:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search conversations..."
//               className="pl-9"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           <Select value={selectedDocument} onValueChange={setSelectedDocument}>
//             <SelectTrigger className="w-full md:w-[180px]">
//               <SelectValue placeholder="All Documents" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Documents</SelectItem>
//               {/* TODO: Populate with actual documents */}
//             </SelectContent>
//           </Select>
//           <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
//             <SelectTrigger className="w-full md:w-[180px]">
//               <SelectValue placeholder="All Time" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">All Time</SelectItem>
//               <SelectItem value="last7days">Last 7 days</SelectItem>
//               <SelectItem value="last30days">Last 30 days</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         <ConversationList
//           userId={user.id}
//           searchQuery={searchQuery}
//           selectedDocument={selectedDocument}
//           selectedTimeframe={selectedTimeframe}
//         />
//       </div>
//     </div>
//   );
// }

// import { useQuery } from "@tanstack/react-query";
// import { User } from "../../../shared/schema";
// import { apiRequest } from "@/lib/queryClient";
// import Navigation from "@/components/navigation";
// import { Loader2, MessageSquare, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { formatDistanceToNow } from "date-fns";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useToast } from "@/hooks/use-toast";

// // Define a more specific type for the conversation data we expect from the API
// interface ConversationWithFile extends Conversation {
//   fileName?: string; // fileName can be optional if a conversation has no file
// }

// interface HistoryProps {
//   user: User;
//   setUser: (user: User | null) => void;
//   onConversationSelect: (conversationId: string, fileId: string | null) => void;
// }

// export default function History({ user, setUser, onConversationSelect }: HistoryProps) {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   const { data: conversations = [], isLoading } = useQuery<ConversationWithFile[]>({
//     queryKey: ["conversations", user.id],
//     queryFn: () => apiRequest("GET", "/api/conversations").then((res) => res.json()),
//   });
  
//   const deleteConversationMutation = useMutation({
//     mutationFn: (conversationId: string) =>
//       apiRequest("DELETE", `/api/conversations/${conversationId}`),
//     onSuccess: () => {
//       toast({ title: "Success", description: "Conversation deleted." });
//       queryClient.invalidateQueries({ queryKey: ["conversations", user.id] });
//     },
//     onError: () => {
//       toast({ title: "Error", description: "Failed to delete conversation.", variant: "destructive" });
//     },
//   });

//   return (
//     <div className="flex flex-col h-screen">
//       <Navigation user={user} setUser={setUser} />
//       <div className="flex-1 pt-20 container mx-auto px-6 py-8">
//         <header className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Conversation History</h1>
//           <p className="text-muted-foreground">Review and manage your past interactions.</p>
//         </header>

//         {isLoading ? (
//           <div className="text-center py-12">
//             <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
//           </div>
//         ) : conversations.length === 0 ? (
//           <div className="text-center py-12">
//             <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No History Found</h3>
//             <p className="text-muted-foreground">
//               Chats you have on the dashboard will appear here.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {conversations.map((convo) => (
//               <div
//                 key={convo.id}
//                 className="glass-effect p-4 rounded-lg flex items-center justify-between"
//               >
//                 <div className="flex-1 cursor-pointer" onClick={() => onConversationSelect(convo.id, convo.fileId)}>
//                   <p className="font-semibold">{convo.title}</p>
//                   <p className="text-sm text-muted-foreground">
//                     {convo.fileName ? `Related to: ${convo.fileName}` : "General Chat"} -{" "}
//                     {formatDistanceToNow(new Date(convo.createdAt!), { addSuffix: true })}
//                   </p>
//                 </div>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => deleteConversationMutation.mutate(convo.id)}
//                   disabled={deleteConversationMutation.isPending}
//                 >
//                   <Trash2 className="h-4 w-4 text-destructive" />
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../../../shared/schema";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { Loader2, MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

// Define a more specific type for the conversation data we expect from the API
interface ConversationWithFile {
  id: string;
  userId: string;
  fileId: string | null;
  title: string;
  createdAt: string; // The database sends this as an ISO 8601 string (UTC)
  fileName?: string;
}

interface HistoryProps {
  user: User;
  setUser: (user: User | null) => void;
  onConversationSelect: (conversationId: string, fileId: string | null) => void;
}

export default function History({ user, setUser, onConversationSelect }: HistoryProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: conversations = [], isLoading } = useQuery<ConversationWithFile[]>({
    queryKey: ["conversations", user.id],
    queryFn: () => apiRequest("GET", "/api/conversations").then((res) => res.json()),
  });

  const deleteConversationMutation = useMutation({
    mutationFn: (conversationId: string) =>
      apiRequest("DELETE", `/api/conversations/${conversationId}`),
    onSuccess: () => {
      toast({ title: "Success", description: "Conversation deleted." });
      queryClient.invalidateQueries({ queryKey: ["conversations", user.id] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete conversation.", variant: "destructive" });
    },
  });

  return (
    <div className="flex flex-col h-screen">
      <Navigation user={user} setUser={setUser} />
      <div className="flex-1 pt-20 container mx-auto px-6 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Conversation History</h1>
          <p className="text-muted-foreground">Review and manage your past interactions.</p>
        </header>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No History Found</h3>
            <p className="text-muted-foreground">
              Chats you have on the dashboard will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className="glass-effect p-4 rounded-lg flex items-center justify-between transition-all hover:ring-2 hover:ring-primary/50"
              >
                <div className="flex-1 cursor-pointer" onClick={() => onConversationSelect(convo.id, convo.fileId)}>
                  <p className="font-semibold">{convo.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {convo.fileName ? `Related to: ${convo.fileName}` : "General Chat"} -{" "}
                    {/* --- THIS IS THE FIX FOR THE TIMESTAMP --- */}
                    {/* By creating a new Date object from the UTC string, formatDistanceToNow
                        can correctly compare it against the user's local time (IST). */}
                    {formatDistanceToNow(new Date(convo.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteConversationMutation.mutate(convo.id)}
                  disabled={deleteConversationMutation.isPending}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}