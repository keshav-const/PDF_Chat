import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { File } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { CloudUpload, FileText, Eye, Trash2 } from "lucide-react";

interface FileUploadProps {
  onFileUploaded: () => void;
  files: File[];
  selectedFileId: string | null;
  onFileSelect: (fileId: string | null) => void;
}

export default function FileUpload({ 
  onFileUploaded, 
  files, 
  selectedFileId, 
  onFileSelect 
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
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
    },
    onSuccess: () => {
      onFileUploaded();
      toast({
        title: "Success",
        description: "PDF uploaded successfully!",
      });
      setIsUploading(false);
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload PDF",
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fetch(`/api/files/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
    },
    onSuccess: () => {
      onFileUploaded();
      toast({
        title: "Success",
        description: "File deleted successfully!",
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error instanceof Error ? error.message : "Failed to delete file",
        variant: "destructive",
      });
    },
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (selectedFiles: File[]) => {
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast({
        title: "Invalid file type",
        description: "Please select PDF files only.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    pdfFiles.forEach(file => {
      uploadMutation.mutate(file);
    });
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="glass-effect p-6">
      <h3 className="text-xl font-semibold mb-6">Your Documents</h3>
      
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors cursor-pointer ${
          isDragging 
            ? "border-primary/50 bg-primary/5" 
            : "border-border hover:border-primary/50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        data-testid="area-file-upload"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center mx-auto mb-4">
          <CloudUpload className="text-white text-xl" />
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {isDragging ? "Drop your PDFs here" : "Drag & drop your PDFs here"}
        </p>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isUploading}
          data-testid="button-choose-files"
        >
          {isUploading ? "Uploading..." : "Choose Files"}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-file-hidden"
      />

      {/* Document List */}
      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No documents uploaded yet</p>
          </div>
        ) : (
          files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 rounded-lg transition-colors cursor-pointer ${
                selectedFileId === file.id
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-card hover:bg-card/80"
              }`}
              onClick={() => onFileSelect(selectedFileId === file.id ? null : file.id)}
              data-testid={`card-file-${file.id}`}
            >
              <div className="flex items-center space-x-3 flex-1">
                <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center flex-shrink-0">
                  <FileText className="text-white text-xs" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm truncate" data-testid={`text-filename-${file.id}`}>
                    {file.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto hover:bg-secondary/50"
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: Implement file preview
                  }}
                  data-testid={`button-preview-${file.id}`}
                >
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMutation.mutate(file.id);
                  }}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${file.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
