// import { useState } from "react";
// import { motion } from "framer-motion";
// import { User } from "@shared/schema";
// import Navigation from "@/components/navigation";
// import FileUpload from "@/components/file-upload";
// import ChatInterface from "@/components/chat-interface";
// import { useQuery } from "@tanstack/react-query";

// interface DashboardProps {
//   user: User;
//   setUser: (user: User | null) => void;
// }

// export default function Dashboard({ user, setUser }: DashboardProps) {
//   const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
//   const [conversationId, setConversationId] = useState<string | null>(null);

//   const { data: files = [], refetch: refetchFiles } = useQuery({
//     queryKey: ["/api/files"],
//   });

//   return (
//     <div className="min-h-screen gradient-bg">
//       <Navigation user={user} setUser={setUser} />
      
//       <div className="container mx-auto px-6 py-8 pt-24">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           {/* Dashboard Header */}
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
//             <div>
//               <h1 className="text-3xl font-bold mb-2" data-testid="text-dashboard-title">Dashboard</h1>
//               <p className="text-muted-foreground">
//                 Welcome back, <span data-testid="text-username">{user.email}</span>
//               </p>
//             </div>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* File Management Sidebar */}
//             <div className="lg:col-span-1">
//               <FileUpload 
//                 onFileUploaded={refetchFiles}
//                 files={files}
//                 selectedFileId={selectedFileId}
//                 onFileSelect={setSelectedFileId}
//               />
//             </div>

//             {/* Chat Interface */}
//             <div className="lg:col-span-2">
//               <ChatInterface
//                 user={user}
//                 selectedFileId={selectedFileId}
//                 conversationId={conversationId}
//                 onConversationCreate={setConversationId}
//               />
//             </div>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { User } from "../../../shared/schema"; // Corrected import path
// import FileUpload from "../components/file-upload";
// import ChatInterface from "../components/chat-interface";
// import Navigation from "../components/navigation"; // Corrected import
// import { useLocation } from "wouter";

// interface DashboardProps {
//   user: User;
//   setUser: (user: User | null) => void;
// }

// export default function Dashboard({ user, setUser }: DashboardProps) {
//   const [location] = useLocation();
//   const params = new URLSearchParams(location.search);
//   const conversationIdFromUrl = params.get("conversation");

//   const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
//   const [conversationId, setConversationId] = useState<string | null>(conversationIdFromUrl);

//   return (
//     <div className="flex flex-col h-screen">
//       <Navigation user={user} setUser={setUser} />
//       <div className="flex-1 pt-20">
//         <div className="p-4 border-b">
//           <h1 className="text-2xl font-bold">Dashboard</h1>
//         </div>
//         <div className="flex-1 p-4 overflow-auto">
//           <FileUpload
//             onFileSelect={setSelectedFileId}
//             setConversationId={setConversationId}
//           />
//           {(selectedFileId || conversationId) && (
//             <ChatInterface
//               fileId={selectedFileId}
//               conversationId={conversationId}
//               setConversationId={setConversationId}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from "react";
// import { User } from "../../../shared/schema"; // Ensure this import path is correct
// import Navigation from "@/components/navigation";
// import FileUpload from "@/components/file-upload";
// import ChatInterface from "@/components/chat-interface";
// import { AlertCircle } from "lucide-react";

// interface DashboardProps {
//   user: User;
//   setUser: (user: User | null) => void;
// }

// export default function Dashboard({ user, setUser }: DashboardProps) {
//   const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
//   const [conversationId, setConversationId] = useState<string | null>(null);

//   // This function is the key to fixing the chat.
//   // It resets the conversation when a new file is selected.
//   const handleFileSelect = (fileId: string) => {
//     setSelectedFileId(fileId);
//     setConversationId(null);
//   };

//   return (
//     <div className="flex h-screen flex-col">
//       <Navigation user={user} setUser={setUser} />
//       <main className="flex flex-1 pt-16">
//         {/* Left-Side Column: File Management */}
//         <div className="w-1/3 border-r overflow-y-auto p-6">
//           <FileUpload
//             // The props in your FileUpload might be different, but onFileSelect is crucial
//             onFileSelect={handleFileSelect}
//             setConversationId={setConversationId} // Pass this if needed
//           />
//         </div>

//         {/* Right-Side Column: Chat Interface */}
//         <div className="w-2/3 flex flex-col">
//           {selectedFileId ? (
//             <ChatInterface
//               user={user}
//               selectedFileId={selectedFileId}
//               conversationId={conversationId}
//               onConversationCreate={setConversationId}
//             />
//           ) : (
//             // This message shows when no file is selected
//             <div className="flex flex-1 items-center justify-center text-center text-muted-foreground p-4">
//               <div>
//                 <AlertCircle className="h-12 w-12 mx-auto mb-4" />
//                 <h2 className="text-xl font-semibold">Select a document to begin</h2>
//                 <p>Your chat with the AI will appear here.</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

import { User } from "../../../shared/schema";
import Navigation from "@/components/navigation";
import FileUpload from "@/components/file-upload";
import ChatInterface from "@/components/chat-interface";
import { AlertCircle } from "lucide-react";

interface DashboardProps {
  user: User;
  setUser: (user: User | null) => void;
  selectedFileId: string | null;
  setSelectedFileId: (id: string | null) => void;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
}

export default function Dashboard({
  user,
  setUser,
  selectedFileId,
  setSelectedFileId,
  conversationId,
  setConversationId,
}: DashboardProps) {

  // THE FIX: This function now correctly resets the conversation when a new file is chosen.
  const handleFileSelect = (fileId: string) => {
    setSelectedFileId(fileId);
    setConversationId(null); // This is key to starting a fresh chat
  };

  return (
    <div className="flex h-screen flex-col">
      <Navigation user={user} setUser={setUser} />
      <main className="flex flex-1 pt-16">
        {/* Left-Side Column: File Management */}
        <div className="w-1/3 border-r overflow-y-auto p-6">
          <FileUpload
            selectedFileId={selectedFileId} // Pass down for highlighting
            onFileSelect={handleFileSelect}
          />
        </div>

        {/* Right-Side Column: Chat Interface */}
        <div className="w-2/3 flex flex-col">
          {selectedFileId ? (
            <ChatInterface
              user={user}
              selectedFileId={selectedFileId}
              conversationId={conversationId}
              onConversationCreate={setConversationId}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center text-center text-muted-foreground p-4">
              <div>
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-xl font-semibold">Select a document to begin</h2>
                <p>Your chat with the AI will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}