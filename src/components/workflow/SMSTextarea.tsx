import React, { useState, useRef, useCallback } from "react";
import { Tag, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface SMSTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

// SMS templates organized by category
const SMS_BODY_TEMPLATES: Record<string, { label: string; category: string; message: string }> = {
  // Welcome & Onboarding
  sms_welcome: {
    label: "Welcome - New Lead",
    category: "Welcome",
    message: "Hi {{contact.first_name}}! Thanks for reaching out to {{company.name}}. I'm {{user.first_name}} and I'll be helping you. What can I assist with today?",
  },
  sms_welcome_customer: {
    label: "Welcome - New Customer",
    category: "Welcome",
    message: "Welcome to {{company.name}}, {{contact.first_name}}! 🎉 We're excited to have you. Reply to this text anytime if you need help!",
  },
  // Follow-ups
  sms_follow_up_quick: {
    label: "Follow-up - Quick Check-in",
    category: "Follow-up",
    message: "Hi {{contact.first_name}}, just checking in! Did you get my email? Let me know if you have any questions. - {{user.first_name}}",
  },
  sms_follow_up_no_response: {
    label: "Follow-up - No Response",
    category: "Follow-up",
    message: "Hey {{contact.first_name}}, haven't heard back from you. Still interested in {{topic}}? Just reply YES or NO. Thanks! - {{user.first_name}}",
  },
  sms_follow_up_meeting: {
    label: "Follow-up - After Meeting",
    category: "Follow-up",
    message: "Great chatting with you today, {{contact.first_name}}! I'll send over the details we discussed. Text me if you need anything!",
  },
  // Appointments
  sms_appointment_confirm: {
    label: "Appointment - Confirmation",
    category: "Appointments",
    message: "Hi {{contact.first_name}}! Your appointment is confirmed for {{appointment.date}} at {{appointment.time}}. Reply C to confirm or R to reschedule.",
  },
  sms_appointment_reminder_24h: {
    label: "Appointment - 24hr Reminder",
    category: "Appointments",
    message: "Reminder: Your appointment is tomorrow at {{appointment.time}}. Location: {{appointment.location}}. See you then! Reply R to reschedule.",
  },
  sms_appointment_reminder_1h: {
    label: "Appointment - 1hr Reminder",
    category: "Appointments",
    message: "{{contact.first_name}}, your appointment is in 1 hour! We're looking forward to seeing you at {{appointment.location}}. 📍",
  },
  sms_appointment_no_show: {
    label: "Appointment - No Show",
    category: "Appointments",
    message: "Hi {{contact.first_name}}, we missed you today! Would you like to reschedule? Reply YES to book a new time.",
  },
  // Payments
  sms_payment_reminder: {
    label: "Payment - Reminder",
    category: "Payments",
    message: "Hi {{contact.first_name}}, friendly reminder that invoice #{{invoice.number}} ({{invoice.amount}}) is due {{invoice.due_date}}. Pay here: {{invoice.payment_link}}",
  },
  sms_payment_overdue: {
    label: "Payment - Overdue",
    category: "Payments",
    message: "{{contact.first_name}}, your payment of {{invoice.amount}} is now overdue. Please pay ASAP to avoid late fees: {{invoice.payment_link}}",
  },
  sms_payment_received: {
    label: "Payment - Received",
    category: "Payments",
    message: "Thanks {{contact.first_name}}! We received your payment of {{payment.amount}}. Receipt sent to your email. 🙏",
  },
  // Reviews & Feedback
  sms_review_request: {
    label: "Review - Request",
    category: "Reviews",
    message: "Hi {{contact.first_name}}! How was your experience with us? We'd love a quick review: {{review.link}} - Thanks! 🌟",
  },
  sms_feedback_nps: {
    label: "Feedback - NPS",
    category: "Reviews",
    message: "Hi {{contact.first_name}}! On a scale of 1-10, how likely are you to recommend us? Reply with a number. Thanks!",
  },
  // Promotions
  sms_promo_flash: {
    label: "Promo - Flash Sale",
    category: "Promotions",
    message: "⚡ FLASH SALE! {{promo.discount}}% off for the next {{promo.hours}} hours. Use code {{promo.code}}. Shop now: {{promo.link}}",
  },
  sms_promo_exclusive: {
    label: "Promo - VIP Exclusive",
    category: "Promotions",
    message: "🌟 VIP Alert, {{contact.first_name}}! You get early access to our sale. {{promo.discount}}% off with code {{promo.code}}. Ends {{promo.expiry_date}}!",
  },
  sms_promo_birthday: {
    label: "Promo - Birthday",
    category: "Promotions",
    message: "Happy Birthday, {{contact.first_name}}! 🎂 Here's a special gift: {{promo.discount}}% off with code BDAY{{promo.code}}. Valid for 7 days!",
  },
  // Re-engagement
  sms_reengagement_miss_you: {
    label: "Re-engagement - We Miss You",
    category: "Re-engagement",
    message: "Hey {{contact.first_name}}, we miss you! It's been a while. Anything we can help with? Reply to chat!",
  },
  sms_reengagement_win_back: {
    label: "Re-engagement - Win Back Offer",
    category: "Re-engagement",
    message: "{{contact.first_name}}, we want you back! Here's {{promo.discount}}% off your next order. Use code COMEBACK. Expires in 48hrs!",
  },
  // Service Updates
  sms_service_update: {
    label: "Service - Update",
    category: "Service",
    message: "Hi {{contact.first_name}}, update on your {{service.type}}: {{service.status}}. Questions? Reply to this text!",
  },
  sms_delivery_update: {
    label: "Delivery - Update",
    category: "Service",
    message: "{{contact.first_name}}, your order is {{delivery.status}}! Track here: {{delivery.tracking_link}}",
  },
};

const CUSTOM_FIELDS = [
  { label: "First Name", value: "{{contact.first_name}}" },
  { label: "Last Name", value: "{{contact.last_name}}" },
  { label: "Email", value: "{{contact.email}}" },
  { label: "Phone", value: "{{contact.phone}}" },
  { label: "Company", value: "{{contact.company}}" },
];

const TRIGGER_VARIABLES = [
  { label: "Trigger Date", value: "{{trigger_date}}" },
  { label: "Trigger Time", value: "{{trigger_time}}" },
  { label: "Workflow Name", value: "{{workflow_name}}" },
  { label: "Contact ID", value: "{{contact_id}}" },
];

export const SMSTextarea: React.FC<SMSTextareaProps> = ({
  value,
  onChange,
  placeholder = "Write your message...",
  rows = 5,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleTemplateChange = useCallback((templateKey: string) => {
    setSelectedTemplate(templateKey);
    const template = SMS_BODY_TEMPLATES[templateKey];
    if (template) {
      onChange(template.message);
      setCharCount(template.message.length);
      toast.success("Template applied");
    }
  }, [onChange]);

  const insertAtCursor = useCallback((text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const currentValue = value || "";
      const newValue = currentValue.slice(0, start) + text + currentValue.slice(end);
      onChange(newValue);
      setCharCount(newValue.length);
      
      // Reset cursor position after React updates the value
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + text.length;
          textareaRef.current.selectionEnd = start + text.length;
          textareaRef.current.focus();
        }
      }, 0);
    }
  }, [value, onChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
    setCharCount(e.target.value.length);
  }, [onChange]);

  // Group templates by category for the dropdown
  const templatesByCategory = Object.entries(SMS_BODY_TEMPLATES).reduce((acc, [key, template]) => {
    const cat = template.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ key, label: template.label });
    return acc;
  }, {} as Record<string, Array<{ key: string; label: string }>>);

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
            {Object.entries(templatesByCategory).map(([category, templates]) => (
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
      <div className="flex items-center gap-1 p-1 border rounded-t-lg bg-muted/30">
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
                onClick={() => insertAtCursor(field.value)}
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
                onClick={() => insertAtCursor(variable.value)}
                className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded"
              >
                {variable.label}
              </button>
            ))}
          </PopoverContent>
        </Popover>

        <div className="flex-1" />

        <span className="text-xs text-muted-foreground pr-2">
          {charCount} / 160 chars
          {charCount > 160 && (
            <span className="text-amber-600 ml-1">
              ({Math.ceil(charCount / 160)} segments)
            </span>
          )}
        </span>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        className="rounded-t-none border-t-0 resize-none"
      />
    </div>
  );
};
