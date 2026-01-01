import React, { useState, useRef, useEffect } from "react";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter,
  AlignRight,
  Link, 
  Image, 
  Code,
  Undo,
  Redo,
  Tag,
  Zap,
  Type,
  Highlighter,
  Paperclip,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Sample custom fields
const CUSTOM_FIELDS = [
  { id: "contact.first_name", label: "Contact First Name", category: "Contact" },
  { id: "contact.last_name", label: "Contact Last Name", category: "Contact" },
  { id: "contact.email", label: "Contact Email", category: "Contact" },
  { id: "contact.phone", label: "Contact Phone", category: "Contact" },
  { id: "contact.company", label: "Contact Company", category: "Contact" },
  { id: "user.name", label: "User Name", category: "User" },
  { id: "user.email", label: "User Email", category: "User" },
  { id: "location.name", label: "Location Name", category: "Location" },
  { id: "location.address", label: "Location Address", category: "Location" },
];

// Trigger variables
const TRIGGER_VARIABLES = [
  { id: "trigger.name", label: "Trigger Name" },
  { id: "trigger.timestamp", label: "Trigger Timestamp" },
  { id: "trigger.source", label: "Trigger Source" },
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your message..."
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [customFieldOpen, setCustomFieldOpen] = useState(false);
  const [triggerVarOpen, setTriggerVarOpen] = useState(false);
  const [customFieldSearch, setCustomFieldSearch] = useState("");
  const customFieldRef = useRef<HTMLDivElement>(null);
  const triggerVarRef = useRef<HTMLDivElement>(null);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customFieldRef.current && !customFieldRef.current.contains(event.target as Node)) {
        setCustomFieldOpen(false);
        setCustomFieldSearch("");
      }
      if (triggerVarRef.current && !triggerVarRef.current.contains(event.target as Node)) {
        setTriggerVarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      onChange(editorRef.current.innerHTML);
      setCharCount(text.length);
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertText = (text: string) => {
    document.execCommand("insertText", false, text);
    editorRef.current?.focus();
    handleInput();
  };

  const handleSelectField = (field: { id: string }) => {
    insertText(`{{${field.id}}}`);
    setCustomFieldOpen(false);
    setCustomFieldSearch("");
  };

  const handleSelectTriggerVar = (variable: { id: string }) => {
    insertText(`{{${variable.id}}}`);
    setTriggerVarOpen(false);
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      const link = `<a href="${linkUrl}" target="_blank">${linkText || linkUrl}</a>`;
      document.execCommand('insertHTML', false, link);
      handleInput();
    }
    setLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
  };

  const handleInsertImage = () => {
    if (imageUrl) {
      execCommand('insertImage', imageUrl);
    }
    setImageDialogOpen(false);
    setImageUrl("");
  };

  const handleAddAttachment = (file: File) => {
    setAttachments(prev => [...prev, file.name]);
    setAttachmentDialogOpen(false);
  };

  const filteredFields = CUSTOM_FIELDS.filter(
    (field) =>
      field.label.toLowerCase().includes(customFieldSearch.toLowerCase()) ||
      field.id.toLowerCase().includes(customFieldSearch.toLowerCase())
  );

  const groupedFields = filteredFields.reduce((acc, field) => {
    if (!acc[field.category]) acc[field.category] = [];
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, typeof CUSTOM_FIELDS>);

  const ToolbarButton = ({ icon: Icon, command, title }: { icon: React.ElementType; command: string; title: string }) => (
    <button
      type="button"
      onClick={() => execCommand(command)}
      className="p-1.5 hover:bg-muted rounded transition-colors"
      title={title}
    >
      <Icon className="w-4 h-4 text-muted-foreground" />
    </button>
  );

  return (
    <div className="space-y-2">
      {/* Templates dropdown */}
      <div className="space-y-1">
        <label className="text-sm font-medium">Templates</label>
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Please Select" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="welcome">Welcome Email</SelectItem>
            <SelectItem value="follow_up">Follow Up</SelectItem>
            <SelectItem value="confirmation">Confirmation</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Select Template</p>
      </div>

      {/* Message label */}
      <label className="text-sm font-medium">Message</label>

      {/* Toolbar */}
      <div className="border rounded-t-lg bg-muted/30">
        <div className="flex flex-wrap items-center gap-0.5 p-1 border-b">
          {/* Custom Fields Button */}
          <div className="relative" ref={customFieldRef}>
            <button 
              className={cn("p-1.5 hover:bg-muted rounded", customFieldOpen && "bg-muted")} 
              title="Custom Fields"
              onClick={() => {
                setCustomFieldOpen(!customFieldOpen);
                setTriggerVarOpen(false);
              }}
            >
              <Tag className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {customFieldOpen && (
              <div className="absolute z-50 top-full left-0 mt-1 w-64 bg-background border rounded-lg shadow-lg max-h-[300px] overflow-hidden">
                <div className="p-2 border-b">
                  <Input
                    value={customFieldSearch}
                    onChange={(e) => setCustomFieldSearch(e.target.value)}
                    placeholder="Search custom fields..."
                    className="h-8"
                    autoFocus
                  />
                </div>
                <div className="overflow-y-auto max-h-[240px]">
                  {Object.entries(groupedFields).length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No fields found
                    </div>
                  ) : (
                    Object.entries(groupedFields).map(([category, fields]) => (
                      <div key={category}>
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase bg-muted/50">
                          {category}
                        </div>
                        {fields.map((field) => (
                          <button
                            key={field.id}
                            type="button"
                            onClick={() => handleSelectField(field)}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                          >
                            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>{field.label}</span>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Trigger Variables Button */}
          <div className="relative" ref={triggerVarRef}>
            <button 
              className={cn("p-1.5 hover:bg-muted rounded", triggerVarOpen && "bg-muted")} 
              title="Trigger Variables"
              onClick={() => {
                setTriggerVarOpen(!triggerVarOpen);
                setCustomFieldOpen(false);
              }}
            >
              <Zap className="w-4 h-4 text-muted-foreground" />
            </button>
            
            {triggerVarOpen && (
              <div className="absolute z-50 top-full left-0 mt-1 w-56 bg-background border rounded-lg shadow-lg overflow-hidden">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase bg-muted/50">
                  Trigger Variables
                </div>
                {TRIGGER_VARIABLES.map((variable) => (
                  <button
                    key={variable.id}
                    type="button"
                    onClick={() => handleSelectTriggerVar(variable)}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{variable.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="w-px h-5 bg-border mx-1" />
          <button className="p-1.5 hover:bg-muted rounded" title="Undo" onClick={() => execCommand('undo')}>
            <Undo className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="Redo" onClick={() => execCommand('redo')}>
            <Redo className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton icon={Bold} command="bold" title="Bold" />
          <ToolbarButton icon={Italic} command="italic" title="Italic" />
          <ToolbarButton icon={Underline} command="underline" title="Underline" />
          <div className="w-px h-5 bg-border mx-1" />
          <Select defaultValue="verdana" onValueChange={(v) => execCommand('fontName', v)}>
            <SelectTrigger className="w-[80px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="verdana">Verdana</SelectItem>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="times">Times</SelectItem>
              <SelectItem value="georgia">Georgia</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="16" onValueChange={(v) => execCommand('fontSize', v)}>
            <SelectTrigger className="w-[60px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="1">12px</SelectItem>
              <SelectItem value="2">14px</SelectItem>
              <SelectItem value="3">16px</SelectItem>
              <SelectItem value="4">18px</SelectItem>
              <SelectItem value="5">24px</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-0.5 p-1">
          <Select defaultValue="paragraph" onValueChange={(v) => execCommand('formatBlock', v)}>
            <SelectTrigger className="w-[80px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="p">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="1">
            <SelectTrigger className="w-[50px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="1.5">1.5</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-px h-5 bg-border mx-1" />
          <button className="p-1.5 hover:bg-muted rounded" title="Text Color" onClick={() => {
            const color = prompt("Enter a color (e.g., red, #ff0000):");
            if (color) execCommand('foreColor', color);
          }}>
            <Type className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="Highlight" onClick={() => {
            const color = prompt("Enter highlight color (e.g., yellow, #ffff00):");
            if (color) execCommand('hiliteColor', color);
          }}>
            <Highlighter className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
          <div className="w-px h-5 bg-border mx-1" />
          <button className="p-1.5 hover:bg-muted rounded" title="Link" onClick={() => setLinkDialogOpen(true)}>
            <Link className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="Image" onClick={() => setImageDialogOpen(true)}>
            <Image className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="HTML" onClick={() => {
            const html = prompt("Enter HTML code:");
            if (html) document.execCommand('insertHTML', false, html);
            handleInput();
          }}>
            <Code className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className={cn(
          "min-h-[200px] p-3 border border-t-0 rounded-b-lg focus:outline-none",
          "prose prose-sm max-w-none",
          !value && "text-muted-foreground"
        )}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Character/word count */}
      <div className="text-xs text-muted-foreground text-right">
        {charCount} characters | {wordCount} words
      </div>

      {/* Add attachment button */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setAttachmentDialogOpen(true)}>
          <Paperclip className="w-4 h-4" />
          Add attachment
        </Button>
        
        {attachments.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            {attachments.map((name, i) => (
              <span key={i} className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1">
                {name}
                <button 
                  onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                  className="hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Test email section */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Test Emails</label>
          <span className="text-destructive">*</span>
        </div>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="Test Emails"
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
          />
          <Button variant="outline" size="sm">
            Send Test Mail
          </Button>
        </div>
      </div>

      {/* Link Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Link Text (optional)</Label>
              <Input
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="Click here"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertLink}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setImageDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInsertImage}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attachment Dialog */}
      <Dialog open={attachmentDialogOpen} onOpenChange={setAttachmentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attachment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddAttachment(file);
                }}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-sm text-muted-foreground hover:text-foreground"
              >
                <Paperclip className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                Click to select a file
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAttachmentDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};