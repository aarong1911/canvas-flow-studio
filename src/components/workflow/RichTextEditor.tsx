import React, { useState, useRef, useCallback } from "react";
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
  AlignJustify
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onTemplateSelect?: (template: string) => void;
  onSendTestEmail?: (email: string) => void;
  attachmentsSection?: React.ReactNode;
}

const TEMPLATES = {
  welcome: `<h2>Welcome to our platform!</h2>
<p>We're excited to have you on board. Here's what you can expect:</p>
<ul>
<li>Easy-to-use interface</li>
<li>24/7 customer support</li>
<li>Regular updates and improvements</li>
</ul>
<p>Best regards,<br>The Team</p>`,
  follow_up: `<p>Hi there,</p>
<p>I wanted to follow up on our previous conversation. Have you had a chance to review our proposal?</p>
<p>Please let me know if you have any questions or need additional information.</p>
<p>Best regards</p>`,
  confirmation: `<h2>Confirmation</h2>
<p>Thank you for your submission. We have received your request and will process it shortly.</p>
<p>Your reference number is: <strong>[REF-NUMBER]</strong></p>
<p>If you have any questions, please don't hesitate to contact us.</p>`
};

const CUSTOM_FIELDS = [
  { label: "First Name", value: "{{first_name}}" },
  { label: "Last Name", value: "{{last_name}}" },
  { label: "Email", value: "{{email}}" },
  { label: "Phone", value: "{{phone}}" },
  { label: "Company", value: "{{company}}" },
];

const TRIGGER_VARIABLES = [
  { label: "Trigger Date", value: "{{trigger_date}}" },
  { label: "Trigger Time", value: "{{trigger_time}}" },
  { label: "Workflow Name", value: "{{workflow_name}}" },
  { label: "Contact ID", value: "{{contact_id}}" },
];

const TEXT_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#ef4444" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#22c55e" },
  { label: "Orange", value: "#f97316" },
  { label: "Purple", value: "#a855f7" },
];

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
];

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your message...",
  onTemplateSelect,
  onSendTestEmail,
  attachmentsSection
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [testEmail, setTestEmail] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showHtmlMode, setShowHtmlMode] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [font, setFont] = useState("verdana");
  const [fontSize, setFontSize] = useState("16");
  const [blockFormat, setBlockFormat] = useState("paragraph");
  const [lineHeight, setLineHeight] = useState("1");

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const text = editorRef.current.innerText || "";
      onChange(editorRef.current.innerHTML);
      setCharCount(text.length);
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const handleUndo = useCallback(() => {
    execCommand("undo");
  }, [execCommand]);

  const handleRedo = useCallback(() => {
    execCommand("redo");
  }, [execCommand]);

  const handleFontChange = useCallback((fontFamily: string) => {
    setFont(fontFamily);
    execCommand("fontName", fontFamily);
  }, [execCommand]);

  const handleFontSizeChange = useCallback((size: string) => {
    setFontSize(size);
    // Font size command uses 1-7, so we map pixel sizes
    const sizeMap: Record<string, string> = {
      "12": "2",
      "14": "3",
      "16": "4",
      "18": "5",
      "24": "6",
    };
    execCommand("fontSize", sizeMap[size] || "4");
  }, [execCommand]);

  const handleBlockFormatChange = useCallback((format: string) => {
    setBlockFormat(format);
    const formatMap: Record<string, string> = {
      paragraph: "p",
      h1: "h1",
      h2: "h2",
      h3: "h3",
    };
    execCommand("formatBlock", formatMap[format] || "p");
  }, [execCommand]);

  const handleLineHeightChange = useCallback((height: string) => {
    setLineHeight(height);
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const element = container.nodeType === 3 ? container.parentElement : container as HTMLElement;
        if (element) {
          element.style.lineHeight = height;
          handleInput();
        }
      }
    }
  }, [handleInput]);

  const handleTextColor = useCallback((color: string) => {
    execCommand("foreColor", color);
  }, [execCommand]);

  const handleHighlight = useCallback((color: string) => {
    execCommand("hiliteColor", color);
  }, [execCommand]);

  const insertCustomField = useCallback((field: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      execCommand("insertText", field);
    }
  }, [execCommand]);

  const insertTriggerVariable = useCallback((variable: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      execCommand("insertText", variable);
    }
  }, [execCommand]);

  const handleInsertLink = useCallback(() => {
    if (linkUrl) {
      const text = linkText || linkUrl;
      const linkHtml = `<a href="${linkUrl}" target="_blank">${text}</a>`;
      execCommand("insertHTML", linkHtml);
      setLinkUrl("");
      setLinkText("");
      toast.success("Link inserted");
    }
  }, [linkUrl, linkText, execCommand]);

  const handleInsertImage = useCallback(() => {
    if (imageUrl) {
      execCommand("insertImage", imageUrl);
      setImageUrl("");
      toast.success("Image inserted");
    }
  }, [imageUrl, execCommand]);

  const handleTemplateChange = useCallback((templateKey: string) => {
    setSelectedTemplate(templateKey);
    const templateContent = TEMPLATES[templateKey as keyof typeof TEMPLATES];
    if (templateContent && editorRef.current) {
      editorRef.current.innerHTML = templateContent;
      handleInput();
      onTemplateSelect?.(templateKey);
      toast.success("Template applied");
    }
  }, [handleInput, onTemplateSelect]);

  const toggleHtmlMode = useCallback(() => {
    if (showHtmlMode) {
      // Switching back to visual mode
      if (editorRef.current) {
        editorRef.current.innerHTML = htmlContent;
        handleInput();
      }
    } else {
      // Switching to HTML mode
      setHtmlContent(editorRef.current?.innerHTML || "");
    }
    setShowHtmlMode(!showHtmlMode);
  }, [showHtmlMode, htmlContent, handleInput]);

  const handleHtmlChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlContent(e.target.value);
  }, []);

  const handleSendTestEmail = useCallback(() => {
    if (!testEmail) {
      toast.error("Please enter a test email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    onSendTestEmail?.(testEmail);
    toast.success(`Test email sent to ${testEmail}`);
  }, [testEmail, onSendTestEmail]);


  const ToolbarButton = ({ 
    icon: Icon, 
    command, 
    title,
    value: cmdValue 
  }: { 
    icon: React.ElementType; 
    command: string; 
    title: string;
    value?: string;
  }) => (
    <button
      type="button"
      onClick={() => execCommand(command, cmdValue)}
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
        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
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
          {/* Custom Fields Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 hover:bg-muted rounded" title="Custom Fields">
                <Tag className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="text-xs font-medium mb-2">Insert Custom Field</div>
              {CUSTOM_FIELDS.map((field) => (
                <button
                  key={field.value}
                  onClick={() => insertCustomField(field.value)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded"
                >
                  {field.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Trigger Variables Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 hover:bg-muted rounded" title="Trigger Variables">
                <Zap className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="text-xs font-medium mb-2">Insert Trigger Variable</div>
              {TRIGGER_VARIABLES.map((variable) => (
                <button
                  key={variable.value}
                  onClick={() => insertTriggerVariable(variable.value)}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded"
                >
                  {variable.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <div className="w-px h-5 bg-border mx-1" />
          
          <button onClick={handleUndo} className="p-1.5 hover:bg-muted rounded" title="Undo">
            <Undo className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={handleRedo} className="p-1.5 hover:bg-muted rounded" title="Redo">
            <Redo className="w-4 h-4 text-muted-foreground" />
          </button>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <ToolbarButton icon={Bold} command="bold" title="Bold" />
          <ToolbarButton icon={Italic} command="italic" title="Italic" />
          <ToolbarButton icon={Underline} command="underline" title="Underline" />
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <Select value={font} onValueChange={handleFontChange}>
            <SelectTrigger className="w-[80px] h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verdana">Verdana</SelectItem>
              <SelectItem value="arial">Arial</SelectItem>
              <SelectItem value="times new roman">Times</SelectItem>
              <SelectItem value="georgia">Georgia</SelectItem>
              <SelectItem value="courier new">Courier</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={fontSize} onValueChange={handleFontSizeChange}>
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
          <Select value={blockFormat} onValueChange={handleBlockFormatChange}>
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
          
          <Select value={lineHeight} onValueChange={handleLineHeightChange}>
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
          
          {/* Text Color Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 hover:bg-muted rounded" title="Text Color">
                <Type className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-2">
              <div className="text-xs font-medium mb-2">Text Color</div>
              <div className="grid grid-cols-3 gap-1">
                {TEXT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleTextColor(color.value)}
                    className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Highlight Color Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 hover:bg-muted rounded" title="Highlight">
                <Highlighter className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-2">
              <div className="text-xs font-medium mb-2">Highlight Color</div>
              <div className="grid grid-cols-3 gap-1">
                {HIGHLIGHT_COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleHighlight(color.value)}
                    className="w-8 h-8 rounded border hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.value }}
                    title={color.label}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="w-px h-5 bg-border mx-1" />
          
          <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
          <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" />
          <ToolbarButton icon={AlignJustify} command="justifyFull" title="Justify" />
          
          <div className="w-px h-5 bg-border mx-1" />
          
          {/* Insert Link Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 hover:bg-muted rounded" title="Insert Link">
                <Link className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-3">
                <div className="text-sm font-medium">Insert Link</div>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">URL</Label>
                    <Input
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Link Text (optional)</Label>
                    <Input
                      value={linkText}
                      onChange={(e) => setLinkText(e.target.value)}
                      placeholder="Click here"
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <Button size="sm" onClick={handleInsertLink} className="w-full">
                  Insert Link
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Insert Image Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-1.5 hover:bg-muted rounded" title="Insert Image">
                <Image className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-3">
                <div className="text-sm font-medium">Insert Image</div>
                <div>
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="h-8 text-sm"
                  />
                </div>
                <Button size="sm" onClick={handleInsertImage} className="w-full">
                  Insert Image
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* HTML Mode Toggle */}
          <button 
            onClick={toggleHtmlMode} 
            className={cn(
              "p-1.5 hover:bg-muted rounded transition-colors",
              showHtmlMode && "bg-muted"
            )} 
            title="Toggle HTML Mode"
          >
            <Code className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Editable area or HTML textarea */}
      {showHtmlMode ? (
        <textarea
          value={htmlContent}
          onChange={handleHtmlChange}
          className="min-h-[200px] w-full p-3 border border-t-0 rounded-b-lg focus:outline-none font-mono text-sm bg-muted/30"
          placeholder="Enter HTML content..."
        />
      ) : (
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
      )}

      {/* Character/word count */}
      <div className="text-xs text-muted-foreground text-right">
        {charCount} characters | {wordCount} words
      </div>

      {/* Attachments section - rendered above Test Emails */}
      {attachmentsSection}

      {/* Test email section */}
      <div className="space-y-2 pt-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Test Emails</label>
          <span className="text-destructive">*</span>
        </div>
        <div className="flex gap-2">
          <Input 
            type="email" 
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Test Emails"
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={handleSendTestEmail}>
            Send Test Mail
          </Button>
        </div>
      </div>
    </div>
  );
};
