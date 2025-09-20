// import { useState, useRef } from "react";
// import { motion } from "framer-motion";
// import { File } from "@shared/schema";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";
// import { useMutation } from "@tanstack/react-query";
// import { CloudUpload, FileText, Eye, Trash2 } from "lucide-react";

// interface FileUploadProps {
//   onFileUploaded: () => void;
//   files: File[];
//   selectedFileId: string | null;
//   onFileSelect: (fileId: string | null) => void;
// }

// export default function FileUpload({ 
//   onFileUploaded, 
//   files, 
//   selectedFileId, 
//   onFileSelect 
// }: FileUploadProps) {
//   const [isDragging, setIsDragging] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   const uploadMutation = useMutation({
//     mutationFn: async (file: File) => {
//       const formData = new FormData();
//       formData.append('pdf', file);
      
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//         credentials: 'include',
//       });
      
//       if (!response.ok) {
//         throw new Error('Upload failed');
//       }
      
//       return response.json();
//     },
//     onSuccess: () => {
//       onFileUploaded();
//       toast({
//         title: "Success",
//         description: "PDF uploaded successfully!",
//       });
//       setIsUploading(false);
//     },
//     onError: (error) => {
//       toast({
//         title: "Upload failed",
//         description: error instanceof Error ? error.message : "Failed to upload PDF",
//         variant: "destructive",
//       });
//       setIsUploading(false);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (fileId: string) => {
//       const response = await fetch(`/api/files/${fileId}`, {
//         method: 'DELETE',
//         credentials: 'include',
//       });
      
//       if (!response.ok) {
//         throw new Error('Delete failed');
//       }
//     },
//     onSuccess: () => {
//       onFileUploaded();
//       toast({
//         title: "Success",
//         description: "File deleted successfully!",
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "Delete failed",
//         description: error instanceof Error ? error.message : "Failed to delete file",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
    
//     const droppedFiles = Array.from(e.dataTransfer.files);
//     handleFiles(droppedFiles);
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const selectedFiles = Array.from(e.target.files);
//       handleFiles(selectedFiles);
//     }
//   };

//   const handleFiles = (selectedFiles: File[]) => {
//     const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
//     if (pdfFiles.length === 0) {
//       toast({
//         title: "Invalid file type",
//         description: "Please select PDF files only.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsUploading(true);
//     pdfFiles.forEach(file => {
//       uploadMutation.mutate(file);
//     });
//   };

//   const formatFileSize = (bytes: string) => {
//     const size = parseInt(bytes);
//     if (size === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(size) / Math.log(k));
//     return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <Card className="glass-effect p-6">
//       <h3 className="text-xl font-semibold mb-6">Your Documents</h3>
      
//       {/* Upload Area */}
//       <div
//         className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors cursor-pointer ${
//           isDragging 
//             ? "border-primary/50 bg-primary/5" 
//             : "border-border hover:border-primary/50"
//         }`}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//         onClick={() => fileInputRef.current?.click()}
//         data-testid="area-file-upload"
//       >
//         <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
//           <CloudUpload className="text-white text-xl" />
//         </div>
//         <p className="text-sm text-muted-foreground mb-4">
//           {isDragging ? "Drop your PDFs here" : "Drag & drop your PDFs here"}
//         </p>
//         <Button
//           type="button"
//           variant="secondary"
//           size="sm"
//           disabled={isUploading}
//           data-testid="button-choose-files"
//         >
//           {isUploading ? "Uploading..." : "Choose Files"}
//         </Button>
//       </div>

//       <input
//         ref={fileInputRef}
//         type="file"
//         accept=".pdf"
//         multiple
//         onChange={handleFileSelect}
//         className="hidden"
//         data-testid="input-file-hidden"
//       />

//       {/* Document List */}
//       <div className="space-y-3">
//         {files.length === 0 ? (
//           <div className="text-center py-8">
//             <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <p className="text-muted-foreground">No documents uploaded yet</p>
//           </div>
//         ) : (
//           files.map((file, index) => (
//             <motion.div
//               key={file.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.1 }}
//               className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
//                 selectedFileId === file.id
//                   ? "bg-primary/10 border border-primary/30"
//                   : "bg-card hover:bg-card/80"
//               }`}
//               onClick={() => onFileSelect(selectedFileId === file.id ? null : file.id)}
//               data-testid={`card-file-${file.id}`}
//             >
//               <div className="flex items-center space-x-3 flex-1">
//                 <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
//                   <FileText className="text-white text-xs" />
//                 </div>
//                 <div className="min-w-0 flex-1">
//                   <p className="font-medium text-sm truncate" data-testid={`text-filename-${file.id}`}>
//                     {file.fileName}
//                   </p>
//                   <p className="text-xs text-muted-foreground">
//                     {formatFileSize(file.fileSize)}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center space-x-2 flex-shrink-0">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="p-1 h-auto hover:bg-secondary/50"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     // TODO: Implement file preview
//                   }}
//                   data-testid={`button-preview-${file.id}`}
//                 >
//                   <Eye className="h-4 w-4 text-muted-foreground" />
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="p-1 h-auto hover:bg-destructive/20"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     deleteMutation.mutate(file.id);
//                   }}
//                   disabled={deleteMutation.isPending}
//                   data-testid={`button-delete-${file.id}`}
//                 >
//                   <Trash2 className="h-4 w-4 text-destructive" />
//                 </Button>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </Card>
//   );
// }

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { File as FileIcon, Trash2, Upload, Loader2, FileText, X } from "lucide-react";
// import { useDropzone } from "react-dropzone";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { getFiles } from "@/lib/api";
// import { File } from "../../../shared/schema"; // Corrected import path
// import { motion } from "framer-motion";
// import { format } from "date-fns";

// interface FileUploadProps {
//   onFileSelect: (fileId: string) => void;
//   setConversationId: (conversationId: string | null) => void;
// }

// export default function FileUpload({ onFileSelect, setConversationId }: FileUploadProps) {
//   const [uploading, setUploading] = useState(false);
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   // THE FIX: Default `files` to an empty array `[]`
//   const { data: files = [], isLoading: filesLoading } = useQuery({
//     queryKey: ["files"],
//     queryFn: getFiles,
//   });

//   const uploadMutation = useMutation({
//     mutationFn: async (file: File) => {
//       const formData = new FormData();
//       formData.append("pdf", file);

//       const response = await fetch("/api/upload", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Upload failed");
//       }
//       return response.json();
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["files"] });
//       onFileSelect(data.file.id);
//       setConversationId(null); // Start a new conversation for the new file
//       toast({
//         title: "Success",
//         description: "File uploaded successfully!",
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "Upload failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//     onSettled: () => {
//       setUploading(false);
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: async (fileId: string) => {
//       const response = await fetch(`/api/files/${fileId}`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to delete file");
//       }
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["files"] });
//       toast({
//         title: "Success",
//         description: "File deleted successfully!",
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "Delete failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   const onDrop = (acceptedFiles: File[]) => {
//     if (acceptedFiles.length > 0) {
//       setUploading(true);
//       uploadMutation.mutate(acceptedFiles[0]);
//     }
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "application/pdf": [".pdf"] },
//     multiple: false,
//   });

//   return (
//     <div className="space-y-6">
//       {/* Upload Area */}
//       <div
//         {...getRootProps()}
//         className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
//           isDragActive ? "border-primary bg-primary/10" : "border-muted hover:border-primary/50"
//         }`}
//       >
//         <input {...getInputProps()} />
//         {uploading ? (
//           <div className="flex flex-col items-center justify-center">
//             <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
//             <p>Uploading...</p>
//           </div>
//         ) : (
//           <div className="flex flex-col items-center justify-center">
//             <Upload className="h-8 w-8 text-muted-foreground mb-2" />
//             <p className="font-semibold">
//               {isDragActive ? "Drop the file here" : "Drag & drop a PDF here, or click to select"}
//             </p>
//             <p className="text-xs text-muted-foreground">Max file size 10MB</p>
//           </div>
//         )}
//       </div>

//       {/* Document List */}
//       <div className="space-y-3">
//         {filesLoading ? (
//            <div className="text-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
//         ) : files.length === 0 ? (
//           <div className="text-center py-8">
//             <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="font-semibold">No documents uploaded</h3>
//             <p className="text-sm text-muted-foreground">Upload a PDF to get started.</p>
//           </div>
//         ) : (
//           files.map((file: File, index: number) => (
//             <motion.div
//               key={file.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: index * 0.05 }}
//               className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
//             >
//               <div className="flex items-center gap-3">
//                 <FileIcon className="h-5 w-5 text-primary" />
//                 <div className="flex flex-col">
//                   <span className="font-medium text-sm">{file.fileName}</span>
//                   <span className="text-xs text-muted-foreground">
//                      Uploaded on {format(new Date(file.uploadedAt!), "PPP")}
//                   </span>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" size="sm" onClick={() => onFileSelect(file.id)}>
//                   Chat
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="text-muted-foreground hover:text-destructive"
//                   onClick={() => deleteMutation.mutate(file.id)}
//                   disabled={deleteMutation.isPending}
//                 >
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </div>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { File as FileIcon, Trash2, Loader2, Upload } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { getFiles } from "@/lib/api";
// import { File } from "../../../shared/schema";
// import { motion } from "framer-motion";
// import { format } from "date-fns";
// import { useDropzone } from "react-dropzone";

// interface FileUploadProps {
//   selectedFileId: string | null;
//   onFileSelect: (fileId: string) => void;
// }

// export default function FileUpload({ selectedFileId, onFileSelect }: FileUploadProps) {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   const { data: files = [], isLoading } = useQuery<File[]>({
//     queryKey: ["files"],
//     queryFn: getFiles,
//   });

//   const uploadMutation = useMutation({
//     mutationFn: async (file: File) => {
//       const formData = new FormData();
//       formData.append("pdf", file);
//       const response = await fetch("/api/upload", { method: "POST", body: formData, credentials: "include" });
//       if (!response.ok) throw new Error("Upload failed");
//       return response.json();
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ["files"] });
//       onFileSelect(data.file.id);
//       toast({ title: "Success", description: "File uploaded." });
//     },
//     onError: () => toast({ title: "Error", description: "Upload failed.", variant: "destructive" }),
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (fileId: string) => fetch(`/api/files/${fileId}`, { method: "DELETE", credentials: "include" }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["files"] });
//       toast({ title: "Success", description: "File deleted." });
//     },
//     onError: () => toast({ title: "Error", description: "Deletion failed.", variant: "destructive" }),
//   });

//   const onDrop = (acceptedFiles: File[]) => {
//     if (acceptedFiles[0]) uploadMutation.mutate(acceptedFiles[0]);
//   };

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "application/pdf": [".pdf"] }, multiple: false });

//   return (
//     <div className="space-y-6">
//       <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-muted'}`}>
//         <input {...getInputProps()} />
//         {uploadMutation.isPending ? <Loader2 className="h-8 w-8 animate-spin mx-auto" /> : <Upload className="h-8 w-8 mx-auto text-muted-foreground" />}
//         <p className="mt-2 text-sm">Drag & drop a PDF here, or click to select</p>
//       </div>
//       <div className="space-y-3">
//         {isLoading && <Loader2 className="h-6 w-6 animate-spin mx-auto" />}
//         {files.map((file, index) => (
//           <motion.div
//             key={file.id}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.05 }}
//             // THE FIX: Conditional styling for the selected file
//             className={`flex items-center justify-between p-3 rounded-lg transition-colors ${selectedFileId === file.id ? 'bg-primary/20' : 'bg-muted/50'}`}
//           >
//             <div className="flex items-center gap-3">
//               <FileIcon className="h-5 w-5 text-primary" />
//               <div className="flex flex-col">
//                 <span className="font-medium text-sm">{file.fileName}</span>
//                 <span className="text-xs text-muted-foreground">
//                   Uploaded on {format(new Date(file.uploadedAt!), "PPP")}
//                 </span>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <Button variant="outline" size="sm" onClick={() => onFileSelect(file.id)}>
//                 Chat
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => deleteMutation.mutate(file.id)}
//                 disabled={deleteMutation.isPending}
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { File as FileIcon, Trash2, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getFiles } from "@/lib/api";
import { File } from "../../../shared/schema";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  selectedFileId: string | null;
  onFileSelect: (fileId: string) => void;
}

export default function FileUpload({ selectedFileId, onFileSelect }: FileUploadProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: files = [], isLoading } = useQuery<File[]>({
    queryKey: ["files"],
    queryFn: getFiles,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: globalThis.File) => { // Use globalThis.File to avoid conflict
      const formData = new FormData();
      formData.append("pdf", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData, credentials: "include" });
      if (!response.ok) throw new Error("Upload failed");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      onFileSelect(data.file.id);
      toast({ title: "Success", description: "File uploaded." });
    },
    onError: () => toast({ title: "Error", description: "Upload failed.", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (fileId: string) => fetch(`/api/files/${fileId}`, { method: "DELETE", credentials: "include" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast({ title: "Success", description: "File deleted." });
    },
    onError: () => toast({ title: "Error", description: "Deletion failed.", variant: "destructive" }),
  });

  const onDrop = (acceptedFiles: globalThis.File[]) => {
    if (acceptedFiles[0]) uploadMutation.mutate(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { "application/pdf": [".pdf"] }, multiple: false });

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted hover:border-primary/50'}`}>
        <input {...getInputProps()} />
        {uploadMutation.isPending ? <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /> : <Upload className="h-8 w-8 mx-auto text-muted-foreground" />}
        <p className="mt-2 text-sm text-muted-foreground">Drag & drop a PDF here, or click to select</p>
      </div>
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Your Documents</h3>
        {isLoading && <div className="text-center py-4"><Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" /></div>}
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            // --- THIS IS THE FIX FOR HIGHLIGHTING ---
            // It conditionally applies a different background color and glow effect
            className={`flex items-center justify-between p-3 rounded-lg transition-all ${
              selectedFileId === file.id
                ? 'bg-primary/20 ring-2 ring-primary/50'
                : 'bg-muted/50 hover:bg-muted'
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="font-medium text-sm truncate">{file.fileName}</span>
                <span className="text-xs text-muted-foreground">
                  Uploaded {format(new Date(file.uploadedAt!), "PPP")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline" size="sm" onClick={() => onFileSelect(file.id)}>
                Chat
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(file.id); }}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}