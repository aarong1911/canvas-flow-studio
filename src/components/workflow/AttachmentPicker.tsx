import React, { useState, useRef } from "react";
import { Paperclip, Upload, Image, FileText, File, X, Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  thumbnail?: string;
}

interface AttachmentPickerProps {
  attachments: AttachmentFile[];
  onChange: (attachments: AttachmentFile[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
}

// Mock media library files
const MEDIA_LIBRARY: AttachmentFile[] = [
  { id: "lib_1", name: "Company Brochure.pdf", size: 2500000, type: "application/pdf" },
  { id: "lib_2", name: "Product Catalog 2024.pdf", size: 5200000, type: "application/pdf" },
  { id: "lib_3", name: "Welcome Guide.pdf", size: 1800000, type: "application/pdf" },
  { id: "lib_4", name: "Terms of Service.pdf", size: 450000, type: "application/pdf" },
  { id: "lib_5", name: "Logo.png", size: 150000, type: "image/png", thumbnail: "https://via.placeholder.com/100x100?text=Logo" },
  { id: "lib_6", name: "Banner Image.jpg", size: 850000, type: "image/jpeg", thumbnail: "https://via.placeholder.com/100x100?text=Banner" },
  { id: "lib_7", name: "Team Photo.jpg", size: 1200000, type: "image/jpeg", thumbnail: "https://via.placeholder.com/100x100?text=Team" },
  { id: "lib_8", name: "Office Location.png", size: 320000, type: "image/png", thumbnail: "https://via.placeholder.com/100x100?text=Office" },
  { id: "lib_9", name: "Pricing Sheet.xlsx", size: 180000, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
  { id: "lib_10", name: "Contract Template.docx", size: 95000, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type.includes("pdf")) return FileText;
  return File;
}

export const AttachmentPicker: React.FC<AttachmentPickerProps> = ({
  attachments,
  onChange,
  maxFiles = 10,
  maxSizeMB = 25,
}) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"library" | "upload">("library");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLibraryFiles, setSelectedLibraryFiles] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredLibrary = MEDIA_LIBRARY.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !attachments.some((a) => a.id === file.id)
  );

  const handleRemoveAttachment = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  const handleToggleLibraryFile = (fileId: string) => {
    setSelectedLibraryFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleAddFromLibrary = () => {
    const filesToAdd = MEDIA_LIBRARY.filter((f) => selectedLibraryFiles.includes(f.id));
    const newAttachments = [...attachments, ...filesToAdd].slice(0, maxFiles);
    onChange(newAttachments);
    setSelectedLibraryFiles([]);
    setOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: AttachmentFile[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxBytes) continue;
      if (attachments.length + newFiles.length >= maxFiles) break;

      newFiles.push({
        id: `upload_${Date.now()}_${i}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
      });
    }

    onChange([...attachments, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Attached files display */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((file) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div
                key={file.id}
                className="flex items-center gap-3 p-2 rounded-lg border bg-muted/30 group"
              >
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                  <FileIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{formatFileSize(file.size)}</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveAttachment(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add attachment button */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full gap-2"
            disabled={attachments.length >= maxFiles}
          >
            <Paperclip className="w-4 h-4" />
            {attachments.length === 0 ? "Add Attachments" : "Add More Attachments"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Attachments</DialogTitle>
          </DialogHeader>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "library" | "upload")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="library" className="gap-2">
                <FolderOpen className="w-4 h-4" />
                Media Library
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <Upload className="w-4 h-4" />
                Upload New
              </TabsTrigger>
            </TabsList>

            <TabsContent value="library" className="space-y-4">
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <ScrollArea className="h-[300px]">
                <div className="grid grid-cols-2 gap-2">
                  {filteredLibrary.map((file) => {
                    const FileIcon = getFileIcon(file.type);
                    const isSelected = selectedLibraryFiles.includes(file.id);

                    return (
                      <div
                        key={file.id}
                        onClick={() => handleToggleLibraryFile(file.id)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                            : "border-border hover:border-muted-foreground/50"
                        )}
                      >
                        <div className="w-10 h-10 rounded bg-muted flex items-center justify-center flex-shrink-0">
                          <FileIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredLibrary.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-muted-foreground">
                      No files found
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddFromLibrary}
                  disabled={selectedLibraryFiles.length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add {selectedLibraryFiles.length > 0 && `(${selectedLibraryFiles.length})`}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-10 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/50 transition-colors"
              >
                <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
                <div className="text-sm font-medium mb-1">Click to upload files</div>
                <div className="text-xs text-muted-foreground">
                  PDF, DOC, XLS, Images up to {maxSizeMB}MB each
                </div>
              </div>

              <div className="text-xs text-muted-foreground text-center">
                Max {maxFiles} files per email • {maxFiles - attachments.length} remaining
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <div className="text-xs text-muted-foreground">
        {attachments.length} / {maxFiles} attachments
      </div>
    </div>
  );
};
