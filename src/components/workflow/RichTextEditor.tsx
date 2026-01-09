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

// Email templates with full body content - organized by category
const EMAIL_BODY_TEMPLATES: Record<string, { label: string; category: string; body: string }> = {
  // Welcome & Onboarding
  welcome_new_lead: {
    label: "Welcome - New Lead",
    category: "Welcome",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Thank you for your interest in {{company.name}}! We're excited to have you here.</p>
<p>I wanted to personally reach out and let you know that I'm here to help with anything you need.</p>
<p>What brought you to us today? I'd love to learn more about your goals so I can point you in the right direction.</p>
<p>Looking forward to connecting!</p>
<p>Best regards,<br/>{{user.name}}</p>`,
  },
  welcome_customer: {
    label: "Welcome - New Customer",
    category: "Welcome",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Congratulations and welcome to the {{company.name}} family!</p>
<p>We're thrilled to have you as a customer. Here's what happens next:</p>
<ul>
<li>You'll receive your login credentials shortly</li>
<li>Our team will reach out within 24 hours for onboarding</li>
<li>Check out our getting started guide: [Link]</li>
</ul>
<p>If you have any questions, don't hesitate to reach out!</p>
<p>Cheers,<br/>{{user.name}}</p>`,
  },
  onboarding_day_1: {
    label: "Onboarding - Day 1",
    category: "Onboarding",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Welcome to Day 1! Let's get you set up for success.</p>
<p><strong>Today's Quick Win:</strong></p>
<p>Complete your profile setup - it takes just 2 minutes and unlocks all features.</p>
<p><a href="{{profile.setup_link}}">Complete Your Profile →</a></p>
<p>Need help? Reply to this email or schedule a call with our team.</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  // Follow-up Emails
  follow_up_no_response: {
    label: "Follow-up - No Response",
    category: "Follow-up",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I wanted to follow up on my previous message. I know things get busy!</p>
<p>Is there anything I can help clarify or answer for you?</p>
<p>If now isn't the right time, just let me know and I'll check back later.</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  follow_up_after_meeting: {
    label: "Follow-up - After Meeting",
    category: "Follow-up",
    body: `<p>Hi {{contact.first_name}},</p>
<p>It was great speaking with you today!</p>
<p>As discussed, here's a quick recap:</p>
<ul>
<li>[Key point 1]</li>
<li>[Key point 2]</li>
<li>Next steps: [Action items]</li>
</ul>
<p>I'll follow up on {{follow_up_date}}. In the meantime, feel free to reach out with any questions.</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  follow_up_proposal: {
    label: "Follow-up - Proposal Sent",
    category: "Follow-up",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I wanted to check in regarding the proposal I sent over.</p>
<p>Have you had a chance to review it? I'd be happy to walk through any questions or make adjustments based on your feedback.</p>
<p>What's the best way to move forward?</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  // Reviews
  review_request: {
    label: "Review - Request",
    category: "Reviews",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Thank you for choosing {{company.name}}! We hope you had a great experience.</p>
<p>Would you mind taking a moment to share your feedback? It helps us improve and helps others find us.</p>
<p><a href="{{review.link}}">Leave a Review →</a></p>
<p>Thank you so much for your time!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  review_post_service: {
    label: "Review - Post Service Request",
    category: "Reviews",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We hope you're enjoying your recent experience with {{company.name}}!</p>
<p>Your feedback means the world to us. Would you take just 30 seconds to share your thoughts?</p>
<p style="text-align: center;"><a href="{{review.link}}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Leave a Review ⭐</a></p>
<p>Your review helps other customers find us and helps us improve our service.</p>
<p>Thank you so much!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  review_thank_you_positive: {
    label: "Review - Thank You (Positive)",
    category: "Reviews",
    body: `<p>Hi {{contact.first_name}},</p>
<p>WOW! Thank you so much for the wonderful review you left us!</p>
<p>Reviews like yours make our entire team smile. We're so grateful to have you as a customer.</p>
<p>As a thank you, here's a special discount for your next visit:</p>
<p style="text-align: center;"><strong style="font-size: 18px;">{{promo.code}} - {{promo.discount}}% OFF</strong></p>
<p>We can't wait to see you again!</p>
<p>With gratitude,<br/>{{user.name}}</p>`,
  },
  review_follow_up_negative: {
    label: "Review - Follow Up (Negative)",
    category: "Reviews",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I personally read your recent feedback, and I'm truly sorry we didn't meet your expectations.</p>
<p>Your experience matters to us, and I'd love the opportunity to make this right.</p>
<p>Would you be open to a quick call so I can understand what happened and how we can improve?</p>
<p><a href="{{booking.link}}">Schedule a Call With Me →</a></p>
<p>I'm committed to turning this around for you.</p>
<p>Sincerely,<br/>{{user.name}}</p>`,
  },
  // Re-engagement
  reengagement_30_days: {
    label: "Re-engagement - 30 Days Inactive",
    category: "Re-engagement",
    body: `<p>Hi {{contact.first_name}},</p>
<p>It's been a while since we've heard from you, and we wanted to check in.</p>
<p>Is there anything we can help with? We've got some exciting updates I'd love to share:</p>
<ul>
<li>[New feature or update 1]</li>
<li>[New feature or update 2]</li>
</ul>
<p>Let me know if you'd like to reconnect!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  reengagement_win_back: {
    label: "Re-engagement - Win Back",
    category: "Re-engagement",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We noticed you've been away for a while, and we'd love to have you back!</p>
<p>As a thank you for being part of our community, here's an exclusive offer:</p>
<p><strong>{{offer.details}}</strong></p>
<p>This offer expires on {{offer.expiry_date}}. Don't miss out!</p>
<p><a href="{{offer.link}}">Claim Your Offer →</a></p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  reengagement_break_up: {
    label: "Re-engagement - Break-up Email",
    category: "Re-engagement",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I've reached out a few times but haven't heard back. I want to be respectful of your inbox.</p>
<p>Should I close your file and stop reaching out?</p>
<p>If things have changed and you'd like to continue our conversation, just hit reply and let me know.</p>
<p>Either way, I wish you all the best!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  // Appointments
  appointment_confirmation: {
    label: "Appointment - Confirmation",
    category: "Appointments",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Great news! Your appointment is confirmed:</p>
<p><strong>Date:</strong> {{appointment.date}}<br/>
<strong>Time:</strong> {{appointment.time}}<br/>
<strong>Location:</strong> {{appointment.location}}</p>
<p>Please arrive 10 minutes early. If you need to reschedule, click the link below:</p>
<p><a href="{{appointment.reschedule_link}}">Reschedule Appointment</a></p>
<p>See you soon!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  appointment_reminder_24h: {
    label: "Appointment - 24hr Reminder",
    category: "Appointments",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Just a friendly reminder that your appointment is tomorrow:</p>
<p><strong>Date:</strong> {{appointment.date}}<br/>
<strong>Time:</strong> {{appointment.time}}<br/>
<strong>Location:</strong> {{appointment.location}}</p>
<p>Need to make changes? <a href="{{appointment.reschedule_link}}">Reschedule here</a></p>
<p>See you soon!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  appointment_no_show: {
    label: "Appointment - No Show Follow-up",
    category: "Appointments",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We noticed you couldn't make it to your appointment today. No worries – things happen!</p>
<p>Would you like to reschedule? We have availability this week:</p>
<p><a href="{{booking.link}}">Reschedule Your Appointment →</a></p>
<p>If something came up, just let us know. We're here to help!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  appointment_post_visit: {
    label: "Appointment - Post Visit Thank You",
    category: "Appointments",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Thank you for your visit today! It was great seeing you.</p>
<p>If you have any questions about what we discussed, don't hesitate to reach out.</p>
<p>Ready to book your next appointment?</p>
<p><a href="{{booking.link}}">Book Your Next Visit →</a></p>
<p>See you soon!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  // Payments
  invoice_sent: {
    label: "Invoice - Sent",
    category: "Payments",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Please find attached your invoice:</p>
<p><strong>Invoice #:</strong> {{invoice.number}}<br/>
<strong>Amount:</strong> {{invoice.amount}}<br/>
<strong>Due Date:</strong> {{invoice.due_date}}</p>
<p><a href="{{invoice.payment_link}}">Pay Now →</a></p>
<p>If you have any questions about this invoice, please don't hesitate to reach out.</p>
<p>Thank you for your business!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  payment_reminder: {
    label: "Payment - Reminder",
    category: "Payments",
    body: `<p>Hi {{contact.first_name}},</p>
<p>This is a friendly reminder that your invoice is due soon:</p>
<p><strong>Invoice #:</strong> {{invoice.number}}<br/>
<strong>Amount:</strong> {{invoice.amount}}<br/>
<strong>Due Date:</strong> {{invoice.due_date}}</p>
<p><a href="{{invoice.payment_link}}">Pay Now →</a></p>
<p>If you've already sent payment, please disregard this message.</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  payment_received: {
    label: "Payment - Received",
    category: "Payments",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We've received your payment. Thank you!</p>
<p><strong>Amount:</strong> {{payment.amount}}<br/>
<strong>Date:</strong> {{payment.date}}<br/>
<strong>Invoice #:</strong> {{invoice.number}}</p>
<p>Your receipt is attached to this email.</p>
<p>Thank you for your business!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  // Nurturing
  nurture_educational: {
    label: "Nurture - Educational Tip",
    category: "Nurturing",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I wanted to share a quick tip that's helped many of our clients:</p>
<p><strong>{{tip.title}}</strong></p>
<p>{{tip.content}}</p>
<p>Want to learn more? Check out our full guide:</p>
<p><a href="{{guide.link}}">Read the Full Guide →</a></p>
<p>Stay tuned for more tips!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  nurture_case_study: {
    label: "Nurture - Case Study",
    category: "Nurturing",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I thought you'd find this interesting...</p>
<p>{{case_study.company}} was facing the same challenges you mentioned, and here's what happened:</p>
<ul>
<li>Challenge: {{case_study.challenge}}</li>
<li>Solution: {{case_study.solution}}</li>
<li>Result: {{case_study.result}}</li>
</ul>
<p><a href="{{case_study.link}}">Read the Full Case Study →</a></p>
<p>Would you like to discuss how we could achieve similar results for you?</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  // Promotions
  promo_flash_sale: {
    label: "Promo - Flash Sale",
    category: "Promotions",
    body: `<p>Hi {{contact.first_name}},</p>
<p><strong>FLASH SALE - {{promo.hours}} Hours Only!</strong></p>
<p>Get {{promo.discount}}% off everything with code: <strong>{{promo.code}}</strong></p>
<p>This deal expires at midnight, so don't wait!</p>
<p><a href="{{promo.link}}">Shop Now →</a></p>
<p>Happy shopping!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  promo_vip_exclusive: {
    label: "Promo - VIP Exclusive",
    category: "Promotions",
    body: `<p>Hi {{contact.first_name}},</p>
<p>As one of our valued VIP customers, you get early access to our exclusive offer:</p>
<p><strong>{{promo.details}}</strong></p>
<p>This offer is only available to our VIP members and expires on {{promo.expiry_date}}.</p>
<p><a href="{{promo.link}}">Claim Your VIP Offer →</a></p>
<p>Thank you for being a loyal customer!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  // Transactions
  order_confirmation: {
    label: "Order - Confirmation",
    category: "Transactions",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Great news – your order has been confirmed!</p>
<p><strong>Order Details:</strong></p>
<ul>
<li>Order #: {{order.number}}</li>
<li>Items: {{order.items}}</li>
<li>Total: {{order.total}}</li>
</ul>
<p>You'll receive a shipping confirmation once your order is on its way.</p>
<p><a href="{{order.tracking_link}}">Track Your Order →</a></p>
<p>Thanks for shopping with us!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
  subscription_welcome: {
    label: "Subscription - Welcome",
    category: "Subscriptions",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Your subscription to {{subscription.plan}} is now active!</p>
<p><strong>Here's what you get:</strong></p>
<ul>
<li>{{subscription.benefit_1}}</li>
<li>{{subscription.benefit_2}}</li>
<li>{{subscription.benefit_3}}</li>
</ul>
<p>Your next billing date is {{subscription.next_billing_date}}.</p>
<p><a href="{{subscription.portal_link}}">Manage Your Subscription →</a></p>
<p>Welcome aboard!</p>
<p>Best,<br/>{{user.name}}</p>`,
  },
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
    const template = EMAIL_BODY_TEMPLATES[templateKey];
    if (template && editorRef.current) {
      editorRef.current.innerHTML = template.body;
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
          <SelectContent className="max-h-80">
            {Object.entries(
              Object.entries(EMAIL_BODY_TEMPLATES).reduce((acc, [key, template]) => {
                const cat = template.category;
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push({ key, label: template.label });
                return acc;
              }, {} as Record<string, Array<{ key: string; label: string }>>)
            ).map(([category, templates]) => (
              <div key={category}>
                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{category}</div>
                {templates.map(({ key, label }) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </div>
            ))}
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
