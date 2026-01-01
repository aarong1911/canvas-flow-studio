import React, { useState, useRef } from "react";
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
  Palette,
  Highlighter,
  Paperclip
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
          <SelectContent>
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
          <button className="p-1.5 hover:bg-muted rounded" title="Custom Fields">
            <Tag className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="Trigger Variables">
            <Zap className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <button className="p-1.5 hover:bg-muted rounded" title="Undo">
            <Undo className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="Redo">
            <Redo className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton icon={Bold} command="bold" title="Bold" />
          <ToolbarButton icon={Italic} command="italic" title="Italic" />
          <ToolbarButton icon={Underline} command="underline" title="Underline" />
          <div className="w-px h-5 bg-border mx-1" />
          <Select defaultValue="verdana">
            <SelectTrigger className="w-[80px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verdana">Verdana</SelectItem>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="times">Times</SelectItem>
              <SelectItem value="georgia">Georgia</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="16">
            <SelectTrigger className="w-[60px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="14">14px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="18">18px</SelectItem>
              <SelectItem value="24">24px</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-0.5 p-1">
          <Select defaultValue="paragraph">
            <SelectTrigger className="w-[80px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="h1">Heading 1</SelectItem>
              <SelectItem value="h2">Heading 2</SelectItem>
              <SelectItem value="h3">Heading 3</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="1">
            <SelectTrigger className="w-[50px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="1.5">1.5</SelectItem>
              <SelectItem value="2">2</SelectItem>
            </SelectContent>
          </Select>
          <div className="w-px h-5 bg-border mx-1" />
          <button className="p-1.5 hover:bg-muted rounded" title="Text Color">
            <Type className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="Highlight">
            <Highlighter className="w-4 h-4 text-muted-foreground" />
          </button>
          <div className="w-px h-5 bg-border mx-1" />
          <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
          <div className="w-px h-5 bg-border mx-1" />
          <button className="p-1.5 hover:bg-muted rounded" title="Link">
            <Link className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="Image">
            <Image className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-1.5 hover:bg-muted rounded" title="HTML">
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
      <Button variant="outline" size="sm" className="gap-2">
        <Paperclip className="w-4 h-4" />
        Add attachment
      </Button>

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
            className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Button variant="outline" size="sm">
            Send Test Mail
          </Button>
        </div>
      </div>
    </div>
  );
};
