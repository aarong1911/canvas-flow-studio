// Node Library Data

import {
  Calendar,
  Users,
  Bell,
  Tag,
  Receipt,
  Check,
  TrendingUp,
  Webhook,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Facebook,
  Instagram,
  Video,
  DollarSign,
  GitBranch,
  Clock,
  ShoppingCart,
  Package,
  RefreshCw,
  MessageSquare,
  Bot,
  Star,
  XCircle,
  Trash2,
  Split,
  Hash,
  Type,
  Code,
  Target,
  CreditCard,
  BarChart,
  Globe,
  BriefcaseBusiness,
} from "lucide-react";
import { NodeLibraryItem, NodeConfigSchema } from "./types";

export const TRIGGERS: Record<string, NodeLibraryItem[]> = {
  Appointments: [
    { id: "appointment_status", label: "Appointment Status", icon: Calendar, color: "purple", kind: "trigger", group: "Appointments" },
    { id: "customer_booked", label: "Customer Booked Appointment", icon: Calendar, color: "purple", kind: "trigger", group: "Appointments" },
  ],
  Contact: [
    { id: "birthday_reminder", label: "Birthday Reminder", icon: Calendar, color: "purple", kind: "trigger", group: "Contact" },
    { id: "contact_changed", label: "Contact Changed", icon: Users, color: "purple", kind: "trigger", group: "Contact" },
    { id: "contact_created", label: "Contact Created", icon: Users, color: "purple", kind: "trigger", group: "Contact" },
    { id: "contact_dnd", label: "Contact DND", icon: Bell, color: "purple", kind: "trigger", group: "Contact" },
    { id: "contact_tag", label: "Contact Tag", icon: Tag, color: "purple", kind: "trigger", group: "Contact" },
    { id: "custom_date_reminder", label: "Custom Date Reminder", icon: Calendar, color: "purple", kind: "trigger", group: "Contact" },
    { id: "note_added", label: "Note Added/Changed", icon: Receipt, color: "purple", kind: "trigger", group: "Contact" },
    { id: "task_added", label: "Task Added/Completed", icon: Check, color: "purple", kind: "trigger", group: "Contact" },
    { id: "engagement_score", label: "Contact Engagement Score", icon: TrendingUp, color: "purple", kind: "trigger", group: "Contact" },
  ],
  Events: [
    { id: "inbound_webhook", label: "Inbound Webhook", icon: Webhook, color: "purple", kind: "trigger", group: "Events" },
    { id: "call_status", label: "Call Status", icon: Phone, color: "purple", kind: "trigger", group: "Events" },
    { id: "email_events", label: "Email Events", icon: Mail, color: "purple", kind: "trigger", group: "Events" },
    { id: "conversations_applied", label: "Conversations Applied", icon: MessageCircle, color: "purple", kind: "trigger", group: "Events" },
    { id: "form_submitted", label: "Form Submitted", icon: Receipt, color: "purple", kind: "trigger", group: "Events" },
    { id: "trigger_links", label: "Trigger Links Clicked", icon: ExternalLink, color: "purple", kind: "trigger", group: "Events" },
    { id: "fb_lead_form", label: "Facebook Lead Form", icon: Facebook, color: "purple", kind: "trigger", group: "Events" },
    { id: "ig_lead_form", label: "Instagram Lead Form", icon: Instagram, color: "purple", kind: "trigger", group: "Events" },
    { id: "video_tracking", label: "Video Tracking", icon: Video, color: "purple", kind: "trigger", group: "Events" },
  ],
  Opportunities: [
    { id: "opportunity_status", label: "Opportunity Status Change", icon: DollarSign, color: "purple", kind: "trigger", group: "Opportunities" },
    { id: "opportunity_created", label: "Opportunity Created", icon: DollarSign, color: "purple", kind: "trigger", group: "Opportunities" },
    { id: "opportunity_changed", label: "Opportunity Changed", icon: DollarSign, color: "purple", kind: "trigger", group: "Opportunities" },
    { id: "pipeline_stage", label: "Pipeline Stage Changed", icon: GitBranch, color: "purple", kind: "trigger", group: "Opportunities" },
    { id: "stale_opportunity", label: "Stale Opportunity", icon: Clock, color: "purple", kind: "trigger", group: "Opportunities" },
  ],
  Payments: [
    { id: "invoice", label: "Invoice", icon: Receipt, color: "purple", kind: "trigger", group: "Payments" },
    { id: "payment_received", label: "Payment Received", icon: DollarSign, color: "purple", kind: "trigger", group: "Payments" },
    { id: "order_form", label: "Order Form Submission", icon: ShoppingCart, color: "purple", kind: "trigger", group: "Payments" },
    { id: "order_submitted", label: "Order Submitted", icon: Package, color: "purple", kind: "trigger", group: "Payments" },
    { id: "subscription_status", label: "Subscription Status Change", icon: RefreshCw, color: "purple", kind: "trigger", group: "Payments" },
    { id: "refund", label: "Refund", icon: DollarSign, color: "purple", kind: "trigger", group: "Payments" },
  ],
  Social: [
    { id: "fb_comments", label: "Facebook Comments", icon: Facebook, color: "purple", kind: "trigger", group: "Social" },
    { id: "ig_comments", label: "Instagram Comments", icon: Instagram, color: "purple", kind: "trigger", group: "Social" },
  ],
};

export const ACTIONS: Record<string, NodeLibraryItem[]> = {
  "Contact Actions": [
    { id: "create_contact", label: "Create Contact", icon: Users, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "find_contact", label: "Find Contact", icon: Users, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "upsert_contact", label: "Upsert Contact (Find-or-Create)", icon: Users, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "update_contact", label: "Update Contact Field", icon: Users, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "add_tag", label: "Add Contact Tag", icon: Tag, color: "green", kind: "action", group: "Contact Actions" },
    { id: "remove_tag", label: "Remove Contact Tag", icon: Tag, color: "red", kind: "action", group: "Contact Actions" },
    { id: "assign_user", label: "Assign to User", icon: Users, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "remove_assigned", label: "Remove Assigned User", icon: Users, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "toggle_dnd", label: "Disable/Enable DND", icon: Bell, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "add_note", label: "Add Note", icon: Receipt, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "add_task", label: "Create Task", icon: Check, color: "blue", kind: "action", group: "Contact Actions" },
    { id: "delete_contact", label: "Delete Contact", icon: Trash2, color: "red", kind: "action", group: "Contact Actions" },
  ],
  Communication: [
    { id: "send_email", label: "Send Email", icon: Mail, color: "blue", kind: "action", group: "Communication" },
    { id: "send_sms", label: "Send SMS", icon: MessageSquare, color: "blue", kind: "action", group: "Communication" },
    { id: "call", label: "Call", icon: Phone, color: "blue", kind: "action", group: "Communication" },
    { id: "internal_notification", label: "Send Internal Notification", icon: Bell, color: "blue", kind: "action", group: "Communication" },
    { id: "review_request", label: "Send Review Request", icon: Star, color: "blue", kind: "action", group: "Communication" },
    { id: "conversation_ai", label: "Conversation AI", icon: Bot, color: "purple", kind: "action", group: "Communication" },
    { id: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "blue", kind: "action", group: "Communication" },
    { id: "live_chat", label: "Send Live Chat Message", icon: MessageCircle, color: "blue", kind: "action", group: "Communication" },
  ],
  "Logic & Flow": [
    { id: "if_else", label: "If/Else Condition", icon: GitBranch, color: "amber", kind: "condition", group: "Logic & Flow" },
    { id: "business_hours_gate", label: "Business Hours Gate", icon: BriefcaseBusiness, color: "amber", kind: "condition", group: "Logic & Flow" },
    { id: "wait", label: "Wait / Delay", icon: Clock, color: "orange", kind: "delay", group: "Logic & Flow" },
    { id: "wait_until", label: "Wait Until", icon: Calendar, color: "orange", kind: "delay", group: "Logic & Flow" },
    { id: "wait_for_event", label: "Wait For Event (Goal)", icon: Target, color: "orange", kind: "delay", group: "Logic & Flow" },
    { id: "split", label: "Split (A/B Test)", icon: Split, color: "amber", kind: "condition", group: "Logic & Flow" },
    { id: "update_custom_value", label: "Update Custom Value", icon: Hash, color: "amber", kind: "action", group: "Logic & Flow" },
    { id: "go_to", label: "Go To", icon: ExternalLink, color: "amber", kind: "action", group: "Logic & Flow" },
    { id: "text_formatter", label: "Text Formatter", icon: Type, color: "amber", kind: "action", group: "Logic & Flow" },
    { id: "custom_code", label: "Custom Code", icon: Code, color: "amber", kind: "action", group: "Logic & Flow" },
    { id: "remove_from_workflow", label: "Remove from Workflow", icon: XCircle, color: "red", kind: "action", group: "Logic & Flow" },
    { id: "goal_event", label: "Goal Event (Legacy)", icon: Target, color: "amber", kind: "action", group: "Logic & Flow" },
  ],
  Appointments: [
    { id: "update_appointment", label: "Update Appointment Status", icon: Calendar, color: "blue", kind: "action", group: "Appointments" },
    { id: "booking_link", label: "Generate Booking Link", icon: Calendar, color: "blue", kind: "action", group: "Appointments" },
  ],
  Opportunities: [
    { id: "create_opportunity", label: "Create/Update Opportunity", icon: DollarSign, color: "blue", kind: "action", group: "Opportunities" },
    { id: "move_deal_stage", label: "Move Deal Stage", icon: GitBranch, color: "blue", kind: "action", group: "Opportunities" },
    { id: "remove_opportunity", label: "Remove Opportunity", icon: XCircle, color: "red", kind: "action", group: "Opportunities" },
  ],
  Payments: [
    { id: "stripe_charge", label: "Stripe One-Time Charge", icon: CreditCard, color: "blue", kind: "action", group: "Payments" },
    { id: "send_invoice", label: "Send Invoice", icon: Receipt, color: "blue", kind: "action", group: "Payments" },
  ],
  Marketing: [
    { id: "google_analytics", label: "Add to Google Analytics", icon: BarChart, color: "blue", kind: "action", group: "Marketing" },
    { id: "google_adwords", label: "Add to Google AdWords", icon: BarChart, color: "blue", kind: "action", group: "Marketing" },
    { id: "fb_custom_audience", label: "Facebook Custom Audience", icon: Facebook, color: "blue", kind: "action", group: "Marketing" },
    { id: "fb_conversion", label: "Facebook Conversion API", icon: Facebook, color: "blue", kind: "action", group: "Marketing" },
  ],
  "Send Data": [
    { id: "webhook", label: "Webhook / API Call", icon: Webhook, color: "blue", kind: "action", group: "Send Data" },
    { id: "http_request", label: "HTTP Request (Advanced)", icon: Globe, color: "blue", kind: "action", group: "Send Data" },
  ],
  AI: [{ id: "ai_prompt", label: "AI Prompt (GPT)", icon: Bot, color: "purple", kind: "action", group: "AI" }],
};

export const ALL_LIBRARY_ITEMS: NodeLibraryItem[] = [
  ...Object.values(TRIGGERS).flat(),
  ...Object.values(ACTIONS).flat(),
];

export const DEFAULT_VARIABLES = [
  "{{contact.first_name}}",
  "{{contact.last_name}}",
  "{{contact.email}}",
  "{{contact.phone}}",
  "{{contact.company}}",
  "{{deal.name}}",
  "{{project.name}}",
  "{{invoice.number}}",
];

// Tag options for tag-related actions
export const TAG_OPTIONS = [
  { value: "new_lead", label: "New Lead" },
  { value: "hot_lead", label: "Hot Lead" },
  { value: "warm_lead", label: "Warm Lead" },
  { value: "cold_lead", label: "Cold Lead" },
  { value: "vip", label: "VIP" },
  { value: "customer", label: "Customer" },
  { value: "past_customer", label: "Past Customer" },
  { value: "referral", label: "Referral" },
  { value: "do_not_contact", label: "Do Not Contact" },
  { value: "follow_up", label: "Follow Up" },
  { value: "nurture", label: "Nurture" },
  { value: "qualified", label: "Qualified" },
  { value: "unqualified", label: "Unqualified" },
  { value: "website_lead", label: "Website Lead" },
  { value: "social_lead", label: "Social Media Lead" },
  { value: "reviewer", label: "Reviewer" },
  { value: "reviewed", label: "Reviewed" },
  { value: "pending_review", label: "Pending Review" },
  { value: "positive_review", label: "Positive Review" },
  { value: "negative_review", label: "Negative Review" },
  { value: "booked", label: "Booked" },
  { value: "no_show", label: "No Show" },
  { value: "cancelled", label: "Cancelled" },
  { value: "high_value", label: "High Value" },
  { value: "churned", label: "Churned" },
  { value: "at_risk", label: "At Risk" },
];

// Segment field options for If/Else conditions
export interface SegmentFieldOption {
  value: string;
  label: string;
  description?: string;
  operators: string[];
  valueType: "boolean" | "select" | "number" | "text";
  valueOptions?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

export const SEGMENT_FIELD_OPTIONS: SegmentFieldOption[] = [
  // Email Engagement Conditions
  {
    value: "contact_replied",
    label: "Contact replied",
    description: "Whether the contact has replied to messages",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "email_opened",
    label: "Email opened",
    description: "Whether the contact opened an email",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "email_clicked",
    label: "Email link clicked",
    description: "Whether the contact clicked a link in an email",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "email_bounced",
    label: "Email bounced",
    description: "Whether the email bounced",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "email_unsubscribed",
    label: "Email unsubscribed",
    description: "Whether the contact unsubscribed from emails",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "sms_replied",
    label: "SMS replied",
    description: "Whether the contact replied to an SMS",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  // Lead Score Thresholds
  {
    value: "lead_score",
    label: "Lead score",
    description: "Contact's lead score (hot >80, warm 50-79, cold <50)",
    operators: ["greater_than", "less_than", "equals", "between"],
    valueType: "number",
    placeholder: "Enter score (e.g., 70)",
  },
  {
    value: "lead_score_tier",
    label: "Lead score tier",
    description: "Lead score tier category",
    operators: ["equals", "not_equals"],
    valueType: "select",
    valueOptions: [
      { label: "Hot (80+)", value: "hot" },
      { label: "Warm (50-79)", value: "warm" },
      { label: "Cold (<50)", value: "cold" },
    ],
  },
  // Time-Based Conditions
  {
    value: "day_of_week",
    label: "Day of week",
    description: "Current day of the week",
    operators: ["equals", "not_equals", "in"],
    valueType: "select",
    valueOptions: [
      { label: "Monday", value: "monday" },
      { label: "Tuesday", value: "tuesday" },
      { label: "Wednesday", value: "wednesday" },
      { label: "Thursday", value: "thursday" },
      { label: "Friday", value: "friday" },
      { label: "Saturday", value: "saturday" },
      { label: "Sunday", value: "sunday" },
    ],
  },
  {
    value: "is_business_hours",
    label: "Is business hours",
    description: "Whether it's currently within business hours",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "time_of_day",
    label: "Time of day",
    description: "Current time category",
    operators: ["equals"],
    valueType: "select",
    valueOptions: [
      { label: "Morning (6am-12pm)", value: "morning" },
      { label: "Afternoon (12pm-5pm)", value: "afternoon" },
      { label: "Evening (5pm-9pm)", value: "evening" },
      { label: "Night (9pm-6am)", value: "night" },
    ],
  },
  // Goal/Conversion Tracking
  {
    value: "goal_achieved",
    label: "Goal achieved",
    description: "Whether a specific goal was achieved",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "conversion_status",
    label: "Conversion status",
    description: "Current conversion status",
    operators: ["equals", "not_equals"],
    valueType: "select",
    valueOptions: [
      { label: "Converted", value: "converted" },
      { label: "Pending", value: "pending" },
      { label: "Failed", value: "failed" },
      { label: "Timeout", value: "timeout" },
    ],
  },
  // Other conditions
  {
    value: "lead_source",
    label: "Lead source",
    description: "Where the lead came from",
    operators: ["equals", "not_equals"],
    valueType: "select",
    valueOptions: [
      { label: "Website", value: "website" },
      { label: "Referral", value: "referral" },
      { label: "Social Media", value: "social" },
      { label: "Phone Call", value: "phone" },
      { label: "Walk-in", value: "walkin" },
      { label: "Other", value: "other" },
    ],
  },
  {
    value: "has_tag",
    label: "Has tag",
    description: "Check if contact has a specific tag",
    operators: ["equals", "not_equals", "contains"],
    valueType: "text",
    placeholder: "Enter tag name (e.g., VIP)",
  },
  {
    value: "contact_type",
    label: "Contact type",
    description: "Type of contact",
    operators: ["equals", "not_equals"],
    valueType: "select",
    valueOptions: [
      { label: "Lead", value: "lead" },
      { label: "Customer", value: "customer" },
      { label: "Past Customer", value: "past_customer" },
    ],
  },
  {
    value: "days_since_created",
    label: "Days since created",
    description: "Days since contact was created",
    operators: ["greater_than", "less_than", "equals"],
    valueType: "number",
    placeholder: "Enter number of days",
  },
  {
    value: "days_since_last_activity",
    label: "Days since last activity",
    description: "Days since last engagement activity",
    operators: ["greater_than", "less_than", "equals"],
    valueType: "number",
    placeholder: "Enter number of days",
  },
  {
    value: "email_engagement_score",
    label: "Email engagement score",
    description: "Calculated email engagement score (opens + clicks)",
    operators: ["greater_than", "less_than", "equals"],
    valueType: "number",
    placeholder: "Enter score (0-100)",
  },
  // Review & Feedback Conditions
  {
    value: "review_submitted",
    label: "Review submitted",
    description: "Whether the contact has submitted a review",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "review_rating",
    label: "Review rating",
    description: "Star rating given by contact (1-5)",
    operators: ["greater_than", "less_than", "equals"],
    valueType: "number",
    placeholder: "Enter rating (1-5)",
  },
  {
    value: "review_sentiment",
    label: "Review sentiment",
    description: "Sentiment analysis of the review",
    operators: ["equals", "not_equals"],
    valueType: "select",
    valueOptions: [
      { label: "Positive", value: "positive" },
      { label: "Neutral", value: "neutral" },
      { label: "Negative", value: "negative" },
    ],
  },
  {
    value: "nps_score",
    label: "NPS score",
    description: "Net Promoter Score (0-10)",
    operators: ["greater_than", "less_than", "equals", "between"],
    valueType: "number",
    placeholder: "Enter NPS score (0-10)",
  },
  // Appointment Conditions
  {
    value: "appointment_status",
    label: "Appointment status",
    description: "Current appointment status",
    operators: ["equals", "not_equals"],
    valueType: "select",
    valueOptions: [
      { label: "Scheduled", value: "scheduled" },
      { label: "Confirmed", value: "confirmed" },
      { label: "Completed", value: "completed" },
      { label: "No Show", value: "no_show" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Rescheduled", value: "rescheduled" },
    ],
  },
  {
    value: "has_upcoming_appointment",
    label: "Has upcoming appointment",
    description: "Whether contact has a future appointment booked",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  // Payment & Purchase Conditions
  {
    value: "payment_status",
    label: "Payment status",
    description: "Status of payment",
    operators: ["equals", "not_equals"],
    valueType: "select",
    valueOptions: [
      { label: "Paid", value: "paid" },
      { label: "Pending", value: "pending" },
      { label: "Overdue", value: "overdue" },
      { label: "Failed", value: "failed" },
      { label: "Refunded", value: "refunded" },
    ],
  },
  {
    value: "total_purchases",
    label: "Total purchases",
    description: "Total number of purchases made",
    operators: ["greater_than", "less_than", "equals"],
    valueType: "number",
    placeholder: "Enter number of purchases",
  },
  {
    value: "lifetime_value",
    label: "Lifetime value",
    description: "Total lifetime value of the contact",
    operators: ["greater_than", "less_than", "equals"],
    valueType: "number",
    placeholder: "Enter amount",
  },
  // Communication Preferences
  {
    value: "email_opted_in",
    label: "Email opted in",
    description: "Whether contact opted in for email communications",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "sms_opted_in",
    label: "SMS opted in",
    description: "Whether contact opted in for SMS communications",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
  {
    value: "call_answered",
    label: "Call answered",
    description: "Whether the last call was answered",
    operators: ["equals"],
    valueType: "boolean",
    valueOptions: [
      { label: "True", value: "true" },
      { label: "False", value: "false" },
    ],
  },
];

// Helper to get segment field definition
export function getSegmentFieldDef(fieldValue: string): SegmentFieldOption | undefined {
  return SEGMENT_FIELD_OPTIONS.find((f) => f.value === fieldValue);
}

// Helper to format operator labels
export function formatOperatorLabel(operator: string): string {
  const labels: Record<string, string> = {
    equals: "equals",
    not_equals: "does not equal",
    greater_than: "is greater than",
    less_than: "is less than",
    contains: "contains",
  };
  return labels[operator] || operator;
}

// =============================================================================
// PRE-BUILT EMAIL TEMPLATES
// =============================================================================
export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  description?: string;
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  // Welcome & Onboarding
  {
    id: "welcome_new_lead",
    name: "Welcome - New Lead",
    category: "Welcome",
    subject: "Welcome to {{company.name}}, {{contact.first_name}}!",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Thank you for your interest in {{company.name}}! We're excited to have you here.</p>
<p>I wanted to personally reach out and let you know that I'm here to help with anything you need.</p>
<p>What brought you to us today? I'd love to learn more about your goals so I can point you in the right direction.</p>
<p>Looking forward to connecting!</p>
<p>Best regards,<br/>{{user.name}}</p>`,
    description: "First touchpoint for new leads",
  },
  {
    id: "welcome_customer",
    name: "Welcome - New Customer",
    category: "Welcome",
    subject: "Welcome aboard, {{contact.first_name}}! 🎉",
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
    description: "Welcome email for new customers",
  },
  {
    id: "onboarding_day_1",
    name: "Onboarding - Day 1",
    category: "Onboarding",
    subject: "Getting started with {{company.name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Welcome to Day 1! Let's get you set up for success.</p>
<p><strong>Today's Quick Win:</strong></p>
<p>Complete your profile setup - it takes just 2 minutes and unlocks all features.</p>
<p><a href="{{profile.setup_link}}">Complete Your Profile →</a></p>
<p>Need help? Reply to this email or schedule a call with our team.</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "First day onboarding email",
  },
  // Follow-up Emails
  {
    id: "follow_up_no_response",
    name: "Follow-up - No Response",
    category: "Follow-up",
    subject: "Quick follow-up, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I wanted to follow up on my previous message. I know things get busy!</p>
<p>Is there anything I can help clarify or answer for you?</p>
<p>If now isn't the right time, just let me know and I'll check back later.</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Follow-up when no response received",
  },
  {
    id: "follow_up_after_meeting",
    name: "Follow-up - After Meeting",
    category: "Follow-up",
    subject: "Great chatting with you, {{contact.first_name}}!",
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
    description: "Follow-up after a meeting or call",
  },
  {
    id: "follow_up_proposal",
    name: "Follow-up - Proposal Sent",
    category: "Follow-up",
    subject: "Checking in on the proposal, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I wanted to check in regarding the proposal I sent over.</p>
<p>Have you had a chance to review it? I'd be happy to walk through any questions or make adjustments based on your feedback.</p>
<p>What's the best way to move forward?</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Follow-up after sending a proposal",
  },
  // Re-engagement Emails
  {
    id: "reengagement_30_days",
    name: "Re-engagement - 30 Days Inactive",
    category: "Re-engagement",
    subject: "We miss you, {{contact.first_name}}!",
    body: `<p>Hi {{contact.first_name}},</p>
<p>It's been a while since we've heard from you, and we wanted to check in.</p>
<p>Is there anything we can help with? We've got some exciting updates I'd love to share:</p>
<ul>
<li>[New feature or update 1]</li>
<li>[New feature or update 2]</li>
</ul>
<p>Let me know if you'd like to reconnect!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Re-engage contacts after 30 days of inactivity",
  },
  {
    id: "reengagement_win_back",
    name: "Re-engagement - Win Back",
    category: "Re-engagement",
    subject: "Special offer just for you, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We noticed you've been away for a while, and we'd love to have you back!</p>
<p>As a thank you for being part of our community, here's an exclusive offer:</p>
<p><strong>{{offer.details}}</strong></p>
<p>This offer expires on {{offer.expiry_date}}. Don't miss out!</p>
<p><a href="{{offer.link}}">Claim Your Offer →</a></p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Win-back email with special offer",
  },
  // Appointment Emails
  {
    id: "appointment_confirmation",
    name: "Appointment - Confirmation",
    category: "Appointments",
    subject: "Your appointment is confirmed, {{contact.first_name}}!",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Great news! Your appointment is confirmed:</p>
<p><strong>Date:</strong> {{appointment.date}}<br/>
<strong>Time:</strong> {{appointment.time}}<br/>
<strong>Location:</strong> {{appointment.location}}</p>
<p>Please arrive 10 minutes early. If you need to reschedule, click the link below:</p>
<p><a href="{{appointment.reschedule_link}}">Reschedule Appointment</a></p>
<p>See you soon!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Appointment confirmation email",
  },
  {
    id: "appointment_reminder_24h",
    name: "Appointment - 24hr Reminder",
    category: "Appointments",
    subject: "Reminder: Your appointment is tomorrow, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Just a friendly reminder that your appointment is tomorrow:</p>
<p><strong>Date:</strong> {{appointment.date}}<br/>
<strong>Time:</strong> {{appointment.time}}<br/>
<strong>Location:</strong> {{appointment.location}}</p>
<p>Need to make changes? <a href="{{appointment.reschedule_link}}">Reschedule here</a></p>
<p>See you soon!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "24-hour appointment reminder",
  },
  // Payment & Invoice Emails
  {
    id: "invoice_sent",
    name: "Invoice - Sent",
    category: "Payments",
    subject: "Invoice #{{invoice.number}} from {{company.name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Please find attached your invoice:</p>
<p><strong>Invoice #:</strong> {{invoice.number}}<br/>
<strong>Amount:</strong> {{invoice.amount}}<br/>
<strong>Due Date:</strong> {{invoice.due_date}}</p>
<p><a href="{{invoice.payment_link}}">Pay Now →</a></p>
<p>If you have any questions about this invoice, please don't hesitate to reach out.</p>
<p>Thank you for your business!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Invoice email with payment link",
  },
  {
    id: "payment_reminder",
    name: "Payment - Reminder",
    category: "Payments",
    subject: "Friendly reminder: Invoice #{{invoice.number}} is due soon",
    body: `<p>Hi {{contact.first_name}},</p>
<p>This is a friendly reminder that your invoice is due soon:</p>
<p><strong>Invoice #:</strong> {{invoice.number}}<br/>
<strong>Amount:</strong> {{invoice.amount}}<br/>
<strong>Due Date:</strong> {{invoice.due_date}}</p>
<p><a href="{{invoice.payment_link}}">Pay Now →</a></p>
<p>If you've already sent payment, please disregard this message.</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Payment reminder email",
  },
  {
    id: "payment_received",
    name: "Payment - Received",
    category: "Payments",
    subject: "Payment received - Thank you, {{contact.first_name}}!",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We've received your payment. Thank you!</p>
<p><strong>Amount:</strong> {{payment.amount}}<br/>
<strong>Date:</strong> {{payment.date}}<br/>
<strong>Invoice #:</strong> {{invoice.number}}</p>
<p>Your receipt is attached to this email.</p>
<p>Thank you for your business!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Payment confirmation/thank you email",
  },
  // Review & Feedback Emails
  {
    id: "review_request",
    name: "Review - Request",
    category: "Reviews",
    subject: "{{contact.first_name}}, how did we do?",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Thank you for choosing {{company.name}}! We hope you had a great experience.</p>
<p>Would you mind taking a moment to share your feedback? It helps us improve and helps others find us.</p>
<p><a href="{{review.link}}">Leave a Review →</a></p>
<p>Thank you so much for your time!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Request a review from customers",
  },
  {
    id: "feedback_survey",
    name: "Feedback - Survey",
    category: "Reviews",
    subject: "Quick question, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We're always looking to improve, and your feedback means a lot to us.</p>
<p>Could you spare 2 minutes to answer a few questions about your experience?</p>
<p><a href="{{survey.link}}">Take the Survey →</a></p>
<p>As a thank you, we'll enter you into a drawing for [prize]!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Feedback survey request",
  },
  // Promotional Emails
  {
    id: "promo_flash_sale",
    name: "Promo - Flash Sale",
    category: "Promotions",
    subject: "⚡ Flash Sale: {{promo.discount}}% off for {{contact.first_name}}!",
    body: `<p>Hi {{contact.first_name}},</p>
<p><strong>FLASH SALE - {{promo.hours}} Hours Only!</strong></p>
<p>Get {{promo.discount}}% off everything with code: <strong>{{promo.code}}</strong></p>
<p>This deal expires at midnight, so don't wait!</p>
<p><a href="{{promo.link}}">Shop Now →</a></p>
<p>Happy shopping!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Flash sale promotional email",
  },
  {
    id: "promo_exclusive_offer",
    name: "Promo - Exclusive VIP Offer",
    category: "Promotions",
    subject: "🌟 VIP Exclusive: Special offer inside, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>As one of our valued VIP customers, you get early access to our exclusive offer:</p>
<p><strong>{{promo.details}}</strong></p>
<p>This offer is only available to our VIP members and expires on {{promo.expiry_date}}.</p>
<p><a href="{{promo.link}}">Claim Your VIP Offer →</a></p>
<p>Thank you for being a loyal customer!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "VIP exclusive promotional email",
  },
  // Additional Review & Thank You Emails
  {
    id: "review_request_post_service",
    name: "Review - Post Service Request",
    category: "Reviews",
    subject: "How was your experience, {{contact.first_name}}?",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We hope you're enjoying your recent experience with {{company.name}}!</p>
<p>Your feedback means the world to us. Would you take just 30 seconds to share your thoughts?</p>
<p style="text-align: center;"><a href="{{review.link}}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Leave a Review ⭐</a></p>
<p>Your review helps other customers find us and helps us improve our service.</p>
<p>Thank you so much!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Request review after service completion",
  },
  {
    id: "review_thank_you_positive",
    name: "Review - Thank You (Positive)",
    category: "Reviews",
    subject: "Thank you for the amazing review, {{contact.first_name}}! 🌟",
    body: `<p>Hi {{contact.first_name}},</p>
<p>WOW! Thank you so much for the wonderful review you left us!</p>
<p>Reviews like yours make our entire team smile. We're so grateful to have you as a customer.</p>
<p>As a thank you, here's a special discount for your next visit:</p>
<p style="text-align: center;"><strong style="font-size: 18px;">{{promo.code}} - {{promo.discount}}% OFF</strong></p>
<p>We can't wait to see you again!</p>
<p>With gratitude,<br/>{{user.name}}</p>`,
    description: "Thank customers for positive reviews",
  },
  {
    id: "review_follow_up_negative",
    name: "Review - Follow Up (Negative)",
    category: "Reviews",
    subject: "We'd love to make this right, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I personally read your recent feedback, and I'm truly sorry we didn't meet your expectations.</p>
<p>Your experience matters to us, and I'd love the opportunity to make this right.</p>
<p>Would you be open to a quick call so I can understand what happened and how we can improve?</p>
<p><a href="{{booking.link}}">Schedule a Call With Me →</a></p>
<p>I'm committed to turning this around for you.</p>
<p>Sincerely,<br/>{{user.name}}</p>`,
    description: "Personal follow-up after negative review",
  },
  // Lead Nurturing Emails
  {
    id: "nurture_educational_1",
    name: "Nurture - Educational Tip #1",
    category: "Nurturing",
    subject: "{{contact.first_name}}, here's a quick tip for you",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I wanted to share a quick tip that's helped many of our clients:</p>
<p><strong>{{tip.title}}</strong></p>
<p>{{tip.content}}</p>
<p>Want to learn more? Check out our full guide:</p>
<p><a href="{{guide.link}}">Read the Full Guide →</a></p>
<p>Stay tuned for more tips!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Educational content for nurturing leads",
  },
  {
    id: "nurture_case_study",
    name: "Nurture - Case Study",
    category: "Nurturing",
    subject: "How {{case_study.company}} achieved {{case_study.result}}",
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
    description: "Share relevant case study with leads",
  },
  // Re-engagement & Win-back Emails
  {
    id: "reengagement_60_days",
    name: "Re-engagement - 60 Days Inactive",
    category: "Re-engagement",
    subject: "{{contact.first_name}}, are you still interested?",
    body: `<p>Hi {{contact.first_name}},</p>
<p>It's been a while since we connected, and I wanted to check in.</p>
<p>I understand priorities change, and I want to respect your time. If now isn't the right moment, no worries at all.</p>
<p>But if you're still interested in {{topic}}, I'd love to pick up where we left off.</p>
<p>Just reply "YES" if you'd like to continue the conversation.</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Re-engage after 60 days of inactivity",
  },
  {
    id: "reengagement_break_up",
    name: "Re-engagement - Break-up Email",
    category: "Re-engagement",
    subject: "Should I close your file, {{contact.first_name}}?",
    body: `<p>Hi {{contact.first_name}},</p>
<p>I've reached out a few times but haven't heard back. I want to be respectful of your inbox.</p>
<p>Should I close your file and stop reaching out?</p>
<p>If things have changed and you'd like to continue our conversation, just hit reply and let me know.</p>
<p>Either way, I wish you all the best!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Final re-engagement attempt before closing",
  },
  // Appointment Emails
  {
    id: "appointment_no_show",
    name: "Appointment - No Show Follow-up",
    category: "Appointments",
    subject: "We missed you today, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>We noticed you couldn't make it to your appointment today. No worries – things happen!</p>
<p>Would you like to reschedule? We have availability this week:</p>
<p><a href="{{booking.link}}">Reschedule Your Appointment →</a></p>
<p>If something came up, just let us know. We're here to help!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Follow-up after a missed appointment",
  },
  {
    id: "appointment_post_visit",
    name: "Appointment - Post Visit Thank You",
    category: "Appointments",
    subject: "Thanks for visiting us, {{contact.first_name}}!",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Thank you for your visit today! It was great seeing you.</p>
<p>If you have any questions about what we discussed, don't hesitate to reach out.</p>
<p>Ready to book your next appointment?</p>
<p><a href="{{booking.link}}">Book Your Next Visit →</a></p>
<p>See you soon!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Thank you email after appointment completion",
  },
  // Transactional Emails
  {
    id: "order_confirmation",
    name: "Order - Confirmation",
    category: "Transactions",
    subject: "Order confirmed! Thanks, {{contact.first_name}} 🎉",
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
    description: "Order confirmation email",
  },
  {
    id: "subscription_welcome",
    name: "Subscription - Welcome",
    category: "Subscriptions",
    subject: "Your subscription is active, {{contact.first_name}}! 🚀",
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
    description: "Welcome email for new subscribers",
  },
  {
    id: "subscription_renewal_reminder",
    name: "Subscription - Renewal Reminder",
    category: "Subscriptions",
    subject: "Your subscription renews soon, {{contact.first_name}}",
    body: `<p>Hi {{contact.first_name}},</p>
<p>Just a heads up – your {{subscription.plan}} subscription will renew on {{subscription.renewal_date}}.</p>
<p><strong>Amount:</strong> {{subscription.amount}}</p>
<p>No action needed if you want to continue enjoying your subscription.</p>
<p>Need to make changes? <a href="{{subscription.portal_link}}">Manage Subscription →</a></p>
<p>Thanks for being a valued subscriber!</p>
<p>Best,<br/>{{user.name}}</p>`,
    description: "Reminder before subscription renewal",
  },
];

// =============================================================================
// PRE-BUILT SMS TEMPLATES
// =============================================================================
export interface SMSTemplate {
  id: string;
  name: string;
  category: string;
  message: string;
  description?: string;
}

export const SMS_TEMPLATES: SMSTemplate[] = [
  // Welcome & Onboarding
  {
    id: "sms_welcome",
    name: "Welcome - New Lead",
    category: "Welcome",
    message: "Hi {{contact.first_name}}! Thanks for reaching out to {{company.name}}. I'm {{user.first_name}} and I'll be helping you. What can I assist with today?",
    description: "Welcome SMS for new leads",
  },
  {
    id: "sms_welcome_customer",
    name: "Welcome - New Customer",
    category: "Welcome",
    message: "Welcome to {{company.name}}, {{contact.first_name}}! 🎉 We're excited to have you. Reply to this text anytime if you need help!",
    description: "Welcome SMS for new customers",
  },
  // Follow-ups
  {
    id: "sms_follow_up_quick",
    name: "Follow-up - Quick Check-in",
    category: "Follow-up",
    message: "Hi {{contact.first_name}}, just checking in! Did you get my email? Let me know if you have any questions. - {{user.first_name}}",
    description: "Quick follow-up SMS",
  },
  {
    id: "sms_follow_up_no_response",
    name: "Follow-up - No Response",
    category: "Follow-up",
    message: "Hey {{contact.first_name}}, haven't heard back from you. Still interested in {{topic}}? Just reply YES or NO. Thanks! - {{user.first_name}}",
    description: "Follow-up after no response",
  },
  {
    id: "sms_follow_up_meeting",
    name: "Follow-up - After Meeting",
    category: "Follow-up",
    message: "Great chatting with you today, {{contact.first_name}}! I'll send over the details we discussed. Text me if you need anything!",
    description: "Follow-up after a meeting",
  },
  // Appointments
  {
    id: "sms_appointment_confirm",
    name: "Appointment - Confirmation",
    category: "Appointments",
    message: "Hi {{contact.first_name}}! Your appointment is confirmed for {{appointment.date}} at {{appointment.time}}. Reply C to confirm or R to reschedule.",
    description: "Appointment confirmation",
  },
  {
    id: "sms_appointment_reminder_24h",
    name: "Appointment - 24hr Reminder",
    category: "Appointments",
    message: "Reminder: Your appointment is tomorrow at {{appointment.time}}. Location: {{appointment.location}}. See you then! Reply R to reschedule.",
    description: "24-hour appointment reminder",
  },
  {
    id: "sms_appointment_reminder_1h",
    name: "Appointment - 1hr Reminder",
    category: "Appointments",
    message: "{{contact.first_name}}, your appointment is in 1 hour! We're looking forward to seeing you at {{appointment.location}}. 📍",
    description: "1-hour appointment reminder",
  },
  {
    id: "sms_appointment_no_show",
    name: "Appointment - No Show",
    category: "Appointments",
    message: "Hi {{contact.first_name}}, we missed you today! Would you like to reschedule? Reply YES to book a new time.",
    description: "No-show follow-up",
  },
  // Payments
  {
    id: "sms_payment_reminder",
    name: "Payment - Reminder",
    category: "Payments",
    message: "Hi {{contact.first_name}}, friendly reminder that invoice #{{invoice.number}} ({{invoice.amount}}) is due {{invoice.due_date}}. Pay here: {{invoice.payment_link}}",
    description: "Payment reminder SMS",
  },
  {
    id: "sms_payment_overdue",
    name: "Payment - Overdue",
    category: "Payments",
    message: "{{contact.first_name}}, your payment of {{invoice.amount}} is now overdue. Please pay ASAP to avoid late fees: {{invoice.payment_link}}",
    description: "Overdue payment notification",
  },
  {
    id: "sms_payment_received",
    name: "Payment - Received",
    category: "Payments",
    message: "Thanks {{contact.first_name}}! We received your payment of {{payment.amount}}. Receipt sent to your email. 🙏",
    description: "Payment confirmation",
  },
  // Reviews & Feedback
  {
    id: "sms_review_request",
    name: "Review - Request",
    category: "Reviews",
    message: "Hi {{contact.first_name}}! How was your experience with us? We'd love a quick review: {{review.link}} - Thanks! 🌟",
    description: "Review request SMS",
  },
  {
    id: "sms_feedback_nps",
    name: "Feedback - NPS",
    category: "Reviews",
    message: "Hi {{contact.first_name}}! On a scale of 1-10, how likely are you to recommend us? Reply with a number. Thanks!",
    description: "NPS feedback request",
  },
  // Promotions
  {
    id: "sms_promo_flash",
    name: "Promo - Flash Sale",
    category: "Promotions",
    message: "⚡ FLASH SALE! {{promo.discount}}% off for the next {{promo.hours}} hours. Use code {{promo.code}}. Shop now: {{promo.link}}",
    description: "Flash sale promotion",
  },
  {
    id: "sms_promo_exclusive",
    name: "Promo - VIP Exclusive",
    category: "Promotions",
    message: "🌟 VIP Alert, {{contact.first_name}}! You get early access to our sale. {{promo.discount}}% off with code {{promo.code}}. Ends {{promo.expiry_date}}!",
    description: "VIP exclusive promotion",
  },
  {
    id: "sms_promo_birthday",
    name: "Promo - Birthday",
    category: "Promotions",
    message: "Happy Birthday, {{contact.first_name}}! 🎂 Here's a special gift: {{promo.discount}}% off with code BDAY{{promo.code}}. Valid for 7 days!",
    description: "Birthday promotion",
  },
  // Re-engagement
  {
    id: "sms_reengagement_miss_you",
    name: "Re-engagement - We Miss You",
    category: "Re-engagement",
    message: "Hey {{contact.first_name}}, we miss you! It's been a while. Anything we can help with? Reply to chat!",
    description: "Re-engagement for inactive contacts",
  },
  {
    id: "sms_reengagement_win_back",
    name: "Re-engagement - Win Back Offer",
    category: "Re-engagement",
    message: "{{contact.first_name}}, we want you back! Here's {{promo.discount}}% off your next order. Use code COMEBACK. Expires in 48hrs!",
    description: "Win-back offer SMS",
  },
  // Service Updates
  {
    id: "sms_service_update",
    name: "Service - Update",
    category: "Service",
    message: "Hi {{contact.first_name}}, update on your {{service.type}}: {{service.status}}. Questions? Reply to this text!",
    description: "Service status update",
  },
  {
    id: "sms_delivery_update",
    name: "Delivery - Update",
    category: "Service",
    message: "{{contact.first_name}}, your order is {{delivery.status}}! Track here: {{delivery.tracking_link}}",
    description: "Delivery status update",
  },
];

// =============================================================================
// PRE-BUILT CONDITION TEMPLATES
// =============================================================================
export interface ConditionTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  branches: Array<{
    id: string;
    name: string;
    segments: Array<{
      field: string;
      operator: string;
      value: string;
    }>;
  }>;
}

export const CONDITION_TEMPLATES: ConditionTemplate[] = [
  // Contact Reply Conditions
  {
    id: "condition_contact_replied",
    name: "Contact Replied",
    category: "Engagement",
    description: "Check if contact has replied to messages",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "contact_replied", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "contact_replied", operator: "equals", value: "false" }],
      },
    ],
  },
  {
    id: "condition_sms_replied",
    name: "SMS Replied",
    category: "Engagement",
    description: "Check if contact replied to SMS",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "sms_replied", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "sms_replied", operator: "equals", value: "false" }],
      },
    ],
  },
  // Email Engagement Conditions
  {
    id: "condition_email_opened",
    name: "Email Opened",
    category: "Engagement",
    description: "Check if contact opened the email",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "email_opened", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "email_opened", operator: "equals", value: "false" }],
      },
    ],
  },
  {
    id: "condition_email_clicked",
    name: "Email Link Clicked",
    category: "Engagement",
    description: "Check if contact clicked a link in the email",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "email_clicked", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "email_clicked", operator: "equals", value: "false" }],
      },
    ],
  },
  // Lead Score Conditions
  {
    id: "condition_lead_score_tier",
    name: "Lead Score Tier",
    category: "Lead Scoring",
    description: "Route based on lead score tier (hot/warm/cold)",
    branches: [
      {
        id: "hot",
        name: "Hot (80+)",
        segments: [{ field: "lead_score_tier", operator: "equals", value: "hot" }],
      },
      {
        id: "warm",
        name: "Warm (50-79)",
        segments: [{ field: "lead_score_tier", operator: "equals", value: "warm" }],
      },
      {
        id: "cold",
        name: "Cold (<50)",
        segments: [{ field: "lead_score_tier", operator: "equals", value: "cold" }],
      },
    ],
  },
  {
    id: "condition_lead_score_hot",
    name: "Is Hot Lead",
    category: "Lead Scoring",
    description: "Check if lead score is 80 or higher",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "lead_score", operator: "greater_than", value: "79" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "lead_score", operator: "less_than", value: "80" }],
      },
    ],
  },
  // Contact Type Conditions
  {
    id: "condition_contact_type",
    name: "Contact Type",
    category: "Contact",
    description: "Route based on contact type",
    branches: [
      {
        id: "customer",
        name: "Customer",
        segments: [{ field: "contact_type", operator: "equals", value: "customer" }],
      },
      {
        id: "lead",
        name: "Lead",
        segments: [{ field: "contact_type", operator: "equals", value: "lead" }],
      },
    ],
  },
  {
    id: "condition_is_customer",
    name: "Is Customer",
    category: "Contact",
    description: "Check if contact is an existing customer",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "contact_type", operator: "equals", value: "customer" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "contact_type", operator: "not_equals", value: "customer" }],
      },
    ],
  },
  // Time-Based Conditions
  {
    id: "condition_business_hours",
    name: "Is Business Hours",
    category: "Time-Based",
    description: "Check if current time is within business hours",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "is_business_hours", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "is_business_hours", operator: "equals", value: "false" }],
      },
    ],
  },
  {
    id: "condition_day_of_week",
    name: "Day of Week",
    category: "Time-Based",
    description: "Route based on current day of week",
    branches: [
      {
        id: "weekday",
        name: "Weekday",
        segments: [{ field: "day_of_week", operator: "in", value: "monday,tuesday,wednesday,thursday,friday" }],
      },
      {
        id: "weekend",
        name: "Weekend",
        segments: [{ field: "day_of_week", operator: "in", value: "saturday,sunday" }],
      },
    ],
  },
  {
    id: "condition_time_of_day",
    name: "Time of Day",
    category: "Time-Based",
    description: "Route based on time of day",
    branches: [
      {
        id: "morning",
        name: "Morning",
        segments: [{ field: "time_of_day", operator: "equals", value: "morning" }],
      },
      {
        id: "afternoon",
        name: "Afternoon",
        segments: [{ field: "time_of_day", operator: "equals", value: "afternoon" }],
      },
      {
        id: "evening",
        name: "Evening",
        segments: [{ field: "time_of_day", operator: "equals", value: "evening" }],
      },
    ],
  },
  // Lead Source Conditions
  {
    id: "condition_lead_source",
    name: "Lead Source",
    category: "Lead Routing",
    description: "Route based on where the lead came from",
    branches: [
      {
        id: "website",
        name: "Website",
        segments: [{ field: "lead_source", operator: "equals", value: "website" }],
      },
      {
        id: "referral",
        name: "Referral",
        segments: [{ field: "lead_source", operator: "equals", value: "referral" }],
      },
      {
        id: "social",
        name: "Social Media",
        segments: [{ field: "lead_source", operator: "equals", value: "social" }],
      },
    ],
  },
  // Conversion Conditions
  {
    id: "condition_goal_achieved",
    name: "Goal Achieved",
    category: "Conversion",
    description: "Check if conversion goal was achieved",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "goal_achieved", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "goal_achieved", operator: "equals", value: "false" }],
      },
    ],
  },
  {
    id: "condition_conversion_status",
    name: "Conversion Status",
    category: "Conversion",
    description: "Route based on conversion status",
    branches: [
      {
        id: "converted",
        name: "Converted",
        segments: [{ field: "conversion_status", operator: "equals", value: "converted" }],
      },
      {
        id: "pending",
        name: "Pending",
        segments: [{ field: "conversion_status", operator: "equals", value: "pending" }],
      },
      {
        id: "timeout",
        name: "Timeout",
        segments: [{ field: "conversion_status", operator: "equals", value: "timeout" }],
      },
    ],
  },
  // Engagement Level Conditions
  {
    id: "condition_days_inactive",
    name: "Days Inactive",
    category: "Engagement",
    description: "Route based on inactivity period",
    branches: [
      {
        id: "active",
        name: "Active (<7 days)",
        segments: [{ field: "days_since_last_activity", operator: "less_than", value: "7" }],
      },
      {
        id: "cooling",
        name: "Cooling (7-30 days)",
        segments: [{ field: "days_since_last_activity", operator: "less_than", value: "31" }],
      },
      {
        id: "inactive",
        name: "Inactive (30+ days)",
        segments: [{ field: "days_since_last_activity", operator: "greater_than", value: "30" }],
      },
    ],
  },
  // Has Tag Conditions
  {
    id: "condition_has_vip_tag",
    name: "Has VIP Tag",
    category: "Contact",
    description: "Check if contact has VIP tag",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "has_tag", operator: "equals", value: "vip" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "has_tag", operator: "not_equals", value: "vip" }],
      },
    ],
  },
  // Review Conditions
  {
    id: "condition_review_submitted",
    name: "Review Submitted",
    category: "Reviews",
    description: "Check if contact has submitted a review",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "review_submitted", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "review_submitted", operator: "equals", value: "false" }],
      },
    ],
  },
  {
    id: "condition_review_rating",
    name: "Review Rating",
    category: "Reviews",
    description: "Route based on review star rating",
    branches: [
      {
        id: "positive",
        name: "Positive (4-5 stars)",
        segments: [{ field: "review_rating", operator: "greater_than", value: "3" }],
      },
      {
        id: "neutral",
        name: "Neutral (3 stars)",
        segments: [{ field: "review_rating", operator: "equals", value: "3" }],
      },
      {
        id: "negative",
        name: "Negative (1-2 stars)",
        segments: [{ field: "review_rating", operator: "less_than", value: "3" }],
      },
    ],
  },
  {
    id: "condition_nps_category",
    name: "NPS Category",
    category: "Reviews",
    description: "Route based on NPS score category",
    branches: [
      {
        id: "promoter",
        name: "Promoter (9-10)",
        segments: [{ field: "nps_score", operator: "greater_than", value: "8" }],
      },
      {
        id: "passive",
        name: "Passive (7-8)",
        segments: [{ field: "nps_score", operator: "greater_than", value: "6" }],
      },
      {
        id: "detractor",
        name: "Detractor (0-6)",
        segments: [{ field: "nps_score", operator: "less_than", value: "7" }],
      },
    ],
  },
  // Appointment Conditions
  {
    id: "condition_appointment_status",
    name: "Appointment Status",
    category: "Appointments",
    description: "Route based on appointment status",
    branches: [
      {
        id: "confirmed",
        name: "Confirmed",
        segments: [{ field: "appointment_status", operator: "equals", value: "confirmed" }],
      },
      {
        id: "completed",
        name: "Completed",
        segments: [{ field: "appointment_status", operator: "equals", value: "completed" }],
      },
      {
        id: "no_show",
        name: "No Show",
        segments: [{ field: "appointment_status", operator: "equals", value: "no_show" }],
      },
    ],
  },
  {
    id: "condition_has_upcoming_appointment",
    name: "Has Upcoming Appointment",
    category: "Appointments",
    description: "Check if contact has a future appointment scheduled",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "has_upcoming_appointment", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "has_upcoming_appointment", operator: "equals", value: "false" }],
      },
    ],
  },
  // Payment Conditions
  {
    id: "condition_payment_status",
    name: "Payment Status",
    category: "Payments",
    description: "Route based on payment status",
    branches: [
      {
        id: "paid",
        name: "Paid",
        segments: [{ field: "payment_status", operator: "equals", value: "paid" }],
      },
      {
        id: "pending",
        name: "Pending",
        segments: [{ field: "payment_status", operator: "equals", value: "pending" }],
      },
      {
        id: "overdue",
        name: "Overdue",
        segments: [{ field: "payment_status", operator: "equals", value: "overdue" }],
      },
    ],
  },
  {
    id: "condition_high_value_customer",
    name: "High Value Customer",
    category: "Payments",
    description: "Check if customer lifetime value exceeds threshold",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "lifetime_value", operator: "greater_than", value: "1000" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "lifetime_value", operator: "less_than", value: "1001" }],
      },
    ],
  },
  // Communication Preference Conditions
  {
    id: "condition_email_opted_in",
    name: "Email Opted In",
    category: "Communication",
    description: "Check if contact opted in for email",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "email_opted_in", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "email_opted_in", operator: "equals", value: "false" }],
      },
    ],
  },
  {
    id: "condition_sms_opted_in",
    name: "SMS Opted In",
    category: "Communication",
    description: "Check if contact opted in for SMS",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "sms_opted_in", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "sms_opted_in", operator: "equals", value: "false" }],
      },
    ],
  },
  {
    id: "condition_call_answered",
    name: "Call Answered",
    category: "Communication",
    description: "Check if the last call was answered",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "call_answered", operator: "equals", value: "true" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "call_answered", operator: "equals", value: "false" }],
      },
    ],
  },
  // Tag Conditions
  {
    id: "condition_has_reviewer_tag",
    name: "Has Reviewer Tag",
    category: "Contact",
    description: "Check if contact is tagged as a reviewer",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "has_tag", operator: "equals", value: "reviewer" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "has_tag", operator: "not_equals", value: "reviewer" }],
      },
    ],
  },
  {
    id: "condition_has_booked_tag",
    name: "Has Booked Tag",
    category: "Contact",
    description: "Check if contact is tagged as booked",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "has_tag", operator: "equals", value: "booked" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "has_tag", operator: "not_equals", value: "booked" }],
      },
    ],
  },
  {
    id: "condition_at_risk",
    name: "Is At Risk",
    category: "Contact",
    description: "Check if contact is at risk of churning",
    branches: [
      {
        id: "yes",
        name: "yes",
        segments: [{ field: "has_tag", operator: "equals", value: "at_risk" }],
      },
      {
        id: "no",
        name: "no",
        segments: [{ field: "has_tag", operator: "not_equals", value: "at_risk" }],
      },
    ],
  },
];

// Helper to get a condition template by ID
export function getConditionTemplate(templateId: string): ConditionTemplate | undefined {
  return CONDITION_TEMPLATES.find((t) => t.id === templateId);
}

// Helper to get an email template by ID
export function getEmailTemplate(templateId: string): EmailTemplate | undefined {
  return EMAIL_TEMPLATES.find((t) => t.id === templateId);
}

// Helper to get an SMS template by ID
export function getSMSTemplate(templateId: string): SMSTemplate | undefined {
  return SMS_TEMPLATES.find((t) => t.id === templateId);
}

export const NODE_CONFIGS: Record<string, NodeConfigSchema> = {
  form_submitted: {
    title: "Configure",
    fields: [
      { name: "trigger_name", label: "Trigger Name", type: "text", required: true },
      {
        name: "form_id",
        label: "Select Form",
        type: "select",
        required: true,
        options: [
          { value: "contact_form", label: "Contact Form" },
          { value: "quote_request", label: "Quote Request" },
        ],
      },
    ],
  },
  send_email: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", required: true, placeholder: "Send Email" },
      { name: "from_name", label: "From Name", type: "text", placeholder: "{{user.name}}", helperText: "Optional. Defaults to workflow sender settings." },
      { name: "from_email", label: "From Email", type: "text", placeholder: "noreply@yourdomain.com", helperText: "Optional. Defaults to workflow sender settings." },
      { name: "reply_to", label: "Reply-To", type: "text", placeholder: "support@yourdomain.com" },
      { name: "to", label: "To", type: "text", required: true, placeholder: "{{contact.email}}" },
      { name: "cc", label: "CC", type: "text", placeholder: "comma,separated@emails.com" },
      { name: "bcc", label: "BCC", type: "text", placeholder: "comma,separated@emails.com" },
      { name: "subject", label: "Subject", type: "text", required: true, placeholder: "Quick update for {{contact.first_name}}" },
      { name: "track_opens", label: "Track Opens", type: "switch", helperText: "Enable open tracking for this email." },
      { name: "track_clicks", label: "Track Clicks", type: "switch", helperText: "Enable link tracking for this email." },
      { name: "body", label: "Email Body", type: "richtext", required: true },
      { name: "attachments", label: "Attachments", type: "attachments" },
    ],
  },
  send_sms: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Send SMS" },
      { name: "to", label: "Phone", type: "text", required: true, placeholder: "{{contact.phone}}" },
      { name: "message", label: "Message", type: "sms_textarea", required: true, rows: 5 },
    ],
  },
  if_else: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Condition Name", type: "text", placeholder: "If/Else Condition" },
      { name: "condition_template", label: "Condition Template", type: "select", options: CONDITION_TEMPLATES.map(t => ({ value: t.id, label: `${t.name} (${t.category})` })), helperText: "Select a pre-built condition template" },
      { name: "question", label: "Question", type: "text", required: true, placeholder: "Is the contact tagged VIP?" },
      {
        name: "condition_type",
        label: "Type",
        type: "select",
        required: true,
        options: [
          { value: "field_equals", label: "Field Equals" },
          { value: "field_contains", label: "Field Contains" },
          { value: "tag_exists", label: "Has Tag" },
          { value: "tag_missing", label: "Missing Tag" },
        ],
      },
      { name: "field", label: "Field", type: "text", placeholder: "e.g. contact.email" },
      { name: "value", label: "Value", type: "text", placeholder: "e.g. gmail.com" },
    ],
  },
  business_hours_gate: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Gate Name", type: "text", placeholder: "Business Hours Gate" },
      { name: "timezone_mode", label: "Timezone", type: "select", required: true, options: [{ value: "account", label: "Account Timezone" }, { value: "contact", label: "Contact Timezone" }] },
      { name: "start_time", label: "Start Time", type: "text", required: true, placeholder: "09:00" },
      { name: "end_time", label: "End Time", type: "text", required: true, placeholder: "17:00" },
      { name: "days", label: "Days (CSV)", type: "text", required: true, placeholder: "Mon,Tue,Wed,Thu,Fri" },
    ],
  },
  wait: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Wait Name", type: "text", placeholder: "Wait" },
      { name: "duration", label: "Duration", type: "number", required: true, placeholder: "1" },
      {
        name: "unit",
        label: "Unit",
        type: "select",
        required: true,
        options: [
          { value: "minutes", label: "Minutes" },
          { value: "hours", label: "Hours" },
          { value: "days", label: "Days" },
        ],
      },
    ],
  },
  wait_until: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Wait Name", type: "text", placeholder: "Wait Until" },
      {
        name: "mode",
        label: "Mode",
        type: "select",
        required: true,
        options: [
          { value: "datetime", label: "Specific Date/Time" },
          { value: "time_of_day", label: "Time of Day (Today/Next)" },
        ],
      },
      { name: "datetime", label: "Date/Time (ISO)", type: "text", placeholder: "2026-01-05T09:00:00Z" },
      { name: "time_of_day", label: "Time of Day", type: "text", placeholder: "09:00" },
      { name: "timezone_mode", label: "Timezone", type: "select", required: true, options: [{ value: "account", label: "Account Timezone" }, { value: "contact", label: "Contact Timezone" }] },
    ],
  },
  wait_for_event: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Goal Name", type: "text", placeholder: "Wait For Event" },
      { name: "event_key", label: "Event Key", type: "select", required: true, options: [
        { value: "email_replied", label: "Email Replied" },
        { value: "email_opened", label: "Email Opened" },
        { value: "email_clicked", label: "Email Link Clicked" },
        { value: "sms_replied", label: "SMS Replied" },
        { value: "form_submitted", label: "Form Submitted" },
        { value: "deal_won", label: "Deal Won" },
        { value: "appointment_booked", label: "Appointment Booked" },
        { value: "payment_received", label: "Payment Received" },
        { value: "custom", label: "Custom Event" },
      ]},
      { name: "custom_event_key", label: "Custom Event Key", type: "text", placeholder: "e.g. webinar_attended" },
      { name: "timeout_enabled", label: "Timeout Enabled", type: "switch", helperText: "If enabled, workflow continues after timeout even if event didn't occur." },
      { name: "timeout_value", label: "Timeout", type: "number", placeholder: "7" },
      {
        name: "timeout_unit",
        label: "Unit",
        type: "select",
        options: [
          { value: "hours", label: "Hours" },
          { value: "days", label: "Days" },
          { value: "weeks", label: "Weeks" },
        ],
      },
      { name: "timeout_action", label: "On Timeout", type: "select", options: [
        { value: "continue", label: "Continue to Next Step" },
        { value: "branch_timeout", label: "Branch to Timeout Path" },
        { value: "remove", label: "Remove from Workflow" },
      ], helperText: "What happens when the goal times out" },
    ],
  },
  // Goal Event (for conversion tracking)
  goal_event: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Goal Name", type: "text", placeholder: "Conversion Goal" },
      { name: "goal_type", label: "Goal Type", type: "select", required: true, options: [
        { value: "purchase", label: "Purchase/Payment" },
        { value: "signup", label: "Sign Up" },
        { value: "booking", label: "Booking/Appointment" },
        { value: "form_submit", label: "Form Submission" },
        { value: "reply", label: "Reply/Response" },
        { value: "custom", label: "Custom Goal" },
      ]},
      { name: "goal_value", label: "Goal Value ($)", type: "number", placeholder: "Optional monetary value" },
      { name: "track_attribution", label: "Track Attribution", type: "switch", helperText: "Track which workflow step led to conversion" },
    ],
  },
  add_tag: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Add Tag" },
      { name: "tag", label: "Tag Name", type: "select", required: true, options: TAG_OPTIONS },
    ],
  },
  remove_tag: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Remove Tag" },
      { name: "tag", label: "Tag Name", type: "select", required: true, options: TAG_OPTIONS },
    ],
  },
  add_task: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Create Task" },
      { name: "title", label: "Task Title", type: "text", required: true, placeholder: "Follow up with {{contact.first_name}}" },
      { name: "description", label: "Description", type: "textarea", rows: 6, placeholder: "What should the assignee do?" },
      {
        name: "priority",
        label: "Priority",
        type: "select",
        options: [
          { value: "low", label: "Low" },
          { value: "normal", label: "Normal" },
          { value: "high", label: "High" },
        ],
      },
      { name: "assignee_user_id", label: "Assign To (User ID)", type: "text", placeholder: "Optional user UUID" },
      { name: "due_in_value", label: "Due In", type: "number", placeholder: "1" },
      {
        name: "due_in_unit",
        label: "Unit",
        type: "select",
        options: [
          { value: "minutes", label: "Minutes" },
          { value: "hours", label: "Hours" },
          { value: "days", label: "Days" },
        ],
      },
      { name: "notify_assignee", label: "Notify Assignee", type: "switch" },
      { name: "notification_method", label: "Notification Method", type: "select", options: [
        { value: "email", label: "Email" },
        { value: "in_app", label: "In-App" },
        { value: "sms", label: "SMS" },
        { value: "all", label: "All Channels" },
      ], helperText: "How to notify the assignee when the task is created" },
    ],
  },
  internal_notification: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Send Internal Notification" },
      { name: "channel", label: "Channel", type: "select", required: true, options: [{ value: "in_app", label: "In-App" }, { value: "email", label: "Email" }, { value: "slack", label: "Slack (future)" }] },
      { name: "to_user_id", label: "To User ID", type: "text", placeholder: "Optional user UUID" },
      { name: "message", label: "Message", type: "textarea", required: true, rows: 6, placeholder: "e.g. New lead: {{contact.first_name}} {{contact.last_name}}" },
    ],
  },
  upsert_contact: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Upsert Contact" },
      { name: "lookup_email", label: "Lookup Email", type: "text", required: true, placeholder: "{{contact.email}}" },
      { name: "first_name", label: "First Name", type: "text", placeholder: "{{contact.first_name}}" },
      { name: "last_name", label: "Last Name", type: "text", placeholder: "{{contact.last_name}}" },
      { name: "phone", label: "Phone", type: "text", placeholder: "{{contact.phone}}" },
      { name: "company", label: "Company", type: "text", placeholder: "{{contact.company}}" },
    ],
  },
  move_deal_stage: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Move Deal Stage" },
      { name: "pipeline_id", label: "Pipeline ID", type: "text", required: true, placeholder: "pipeline_uuid" },
      { name: "stage_id", label: "Stage ID", type: "text", required: true, placeholder: "stage_uuid" },
      { name: "deal_id", label: "Deal ID (optional)", type: "text", placeholder: "{{deal.id}}" },
    ],
  },
  http_request: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "HTTP Request" },
      { name: "method", label: "Method", type: "select", required: true, options: [{ value: "GET", label: "GET" }, { value: "POST", label: "POST" }, { value: "PUT", label: "PUT" }, { value: "PATCH", label: "PATCH" }, { value: "DELETE", label: "DELETE" }] },
      { name: "url", label: "URL", type: "text", required: true, placeholder: "https://api.example.com/webhook" },
      { name: "headers_json", label: "Headers (JSON)", type: "textarea", rows: 5, placeholder: '{ "Authorization": "Bearer {{token}}", "Content-Type": "application/json" }' },
      { name: "body_json", label: "Body (JSON)", type: "textarea", rows: 6, placeholder: '{ "contactEmail": "{{contact.email}}" }' },
      { name: "timeout_ms", label: "Timeout (ms)", type: "number", placeholder: "15000" },
      { name: "store_response_key", label: "Store Response As", type: "text", placeholder: "e.g. http.last_response" },
    ],
  },
  // Assign to User
  assign_user: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Assign to User" },
      { name: "user_id", label: "Select User", type: "select", required: true, options: [
        { value: "user_1", label: "John Smith" },
        { value: "user_2", label: "Jane Doe" },
        { value: "user_3", label: "Mike Johnson" },
        { value: "round_robin", label: "Round Robin (Team)" },
      ]},
      { name: "notify_user", label: "Notify User", type: "switch", helperText: "Send notification to assigned user" },
      { name: "notification_method", label: "Notification Method", type: "select", options: [
        { value: "email", label: "Email" },
        { value: "in_app", label: "In-App" },
        { value: "sms", label: "SMS" },
        { value: "all", label: "All Channels" },
      ]},
    ],
  },
  // Remove Assigned User (remove_tag is already defined above)
  remove_assigned: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Remove Assigned User" },
    ],
  },
  // Toggle DND
  toggle_dnd: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Toggle DND" },
      { name: "dnd_action", label: "Action", type: "select", required: true, options: [
        { value: "enable_all", label: "Enable DND (All Channels)" },
        { value: "disable_all", label: "Disable DND (All Channels)" },
        { value: "enable_email", label: "Enable DND (Email Only)" },
        { value: "enable_sms", label: "Enable DND (SMS Only)" },
        { value: "enable_calls", label: "Enable DND (Calls Only)" },
      ]},
    ],
  },
  // Add Note
  add_note: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Add Note" },
      { name: "note_content", label: "Note Content", type: "textarea", required: true, rows: 6, placeholder: "Add your note here..." },
    ],
  },
  // Call
  call: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Call" },
      { name: "to", label: "Phone Number", type: "text", required: true, placeholder: "{{contact.phone}}" },
      { name: "from_number", label: "From Number", type: "select", options: [
        { value: "default", label: "Default Number" },
        { value: "sales", label: "Sales Line" },
        { value: "support", label: "Support Line" },
      ]},
      { name: "record_call", label: "Record Call", type: "switch" },
      { name: "voicemail_enabled", label: "Enable Voicemail Drop", type: "switch" },
    ],
  },
  // WhatsApp
  whatsapp: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "WhatsApp" },
      { name: "to", label: "Phone Number", type: "text", required: true, placeholder: "{{contact.phone}}" },
      { name: "template", label: "Message Template", type: "select", options: [
        { value: "welcome", label: "Welcome Message" },
        { value: "follow_up", label: "Follow Up" },
        { value: "reminder", label: "Appointment Reminder" },
        { value: "custom", label: "Custom Message" },
      ]},
      { name: "message", label: "Message", type: "textarea", rows: 5, placeholder: "Enter your WhatsApp message..." },
    ],
  },
  // Review Request
  review_request: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Send Review Request" },
      { name: "channel", label: "Send Via", type: "select", required: true, options: [
        { value: "sms", label: "SMS" },
        { value: "email", label: "Email" },
        { value: "both", label: "Both" },
      ]},
      { name: "platform", label: "Review Platform", type: "select", required: true, options: [
        { value: "google", label: "Google" },
        { value: "facebook", label: "Facebook" },
        { value: "yelp", label: "Yelp" },
        { value: "custom", label: "Custom Link" },
      ]},
      { name: "custom_link", label: "Custom Review Link", type: "text", placeholder: "https://..." },
    ],
  },
  // Live Chat
  live_chat: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Send Live Chat Message" },
      { name: "message", label: "Message", type: "textarea", required: true, rows: 5, placeholder: "Enter your message..." },
    ],
  },
  // Conversation AI
  conversation_ai: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Conversation AI" },
      { name: "bot_id", label: "Select Bot", type: "select", required: true, options: [
        { value: "sales_bot", label: "Sales Assistant" },
        { value: "support_bot", label: "Support Bot" },
        { value: "booking_bot", label: "Booking Assistant" },
      ]},
      { name: "max_messages", label: "Max Messages", type: "number", placeholder: "10" },
      { name: "handoff_enabled", label: "Enable Human Handoff", type: "switch", helperText: "Transfer to human agent when needed" },
    ],
  },
  // Delete Contact
  delete_contact: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Delete Contact" },
      { name: "confirm_delete", label: "Confirm Deletion", type: "switch", helperText: "This action is irreversible" },
    ],
  },
  // Create Contact
  create_contact: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Create Contact" },
      { name: "email", label: "Email", type: "text", required: true, placeholder: "{{contact.email}}" },
      { name: "first_name", label: "First Name", type: "text", placeholder: "{{contact.first_name}}" },
      { name: "last_name", label: "Last Name", type: "text", placeholder: "{{contact.last_name}}" },
      { name: "phone", label: "Phone", type: "text", placeholder: "{{contact.phone}}" },
      { name: "company", label: "Company", type: "text", placeholder: "{{contact.company}}" },
    ],
  },
  // Find Contact
  find_contact: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Find Contact" },
      { name: "lookup_by", label: "Lookup By", type: "select", required: true, options: [
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
        { value: "id", label: "Contact ID" },
      ]},
      { name: "lookup_value", label: "Lookup Value", type: "text", required: true, placeholder: "{{contact.email}}" },
    ],
  },
  // Update Contact
  update_contact: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Update Contact Field" },
      { name: "field", label: "Field to Update", type: "select", required: true, options: [
        { value: "first_name", label: "First Name" },
        { value: "last_name", label: "Last Name" },
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone" },
        { value: "company", label: "Company" },
        { value: "custom", label: "Custom Field" },
      ]},
      { name: "custom_field_key", label: "Custom Field Key", type: "text", placeholder: "e.g. lead_source" },
      { name: "value", label: "New Value", type: "text", required: true, placeholder: "Enter new value..." },
    ],
  },
  // Webhook
  webhook: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Webhook" },
      { name: "url", label: "Webhook URL", type: "text", required: true, placeholder: "https://api.example.com/webhook" },
      { name: "method", label: "Method", type: "select", required: true, options: [
        { value: "POST", label: "POST" },
        { value: "GET", label: "GET" },
      ]},
    ],
  },
  // AI Prompt
  ai_prompt: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "AI Prompt" },
      { name: "model", label: "Model", type: "select", required: true, options: [
        { value: "gpt-4", label: "GPT-4" },
        { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
      ]},
      { name: "prompt", label: "Prompt", type: "textarea", required: true, rows: 8, placeholder: "Enter your AI prompt..." },
      { name: "store_as", label: "Store Response As", type: "text", placeholder: "{{ai.response}}" },
    ],
  },
  // Split (A/B Test)
  split: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "A/B Split" },
      { name: "path_a_label", label: "Path A Label", type: "text", placeholder: "Path A" },
      { name: "path_a_ratio", label: "Path A (%)", type: "number", required: true, placeholder: "50" },
      { name: "path_b_label", label: "Path B Label", type: "text", placeholder: "Path B" },
      { name: "path_b_ratio", label: "Path B (%)", type: "number", required: true, placeholder: "50" },
    ],
  },
  // Go To
  go_to: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Go To" },
      { name: "target_step", label: "Target Step", type: "text", required: true, placeholder: "Step ID or name" },
    ],
  },
  // Remove from Workflow
  remove_from_workflow: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Remove from Workflow" },
      { name: "workflow_id", label: "Workflow", type: "select", options: [
        { value: "current", label: "Current Workflow" },
        { value: "all", label: "All Workflows" },
      ]},
    ],
  },
  // Create Opportunity
  create_opportunity: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Create/Update Opportunity" },
      { name: "pipeline_id", label: "Pipeline", type: "select", required: true, options: [
        { value: "sales", label: "Sales Pipeline" },
        { value: "onboarding", label: "Onboarding Pipeline" },
      ]},
      { name: "stage_id", label: "Stage", type: "select", required: true, options: [
        { value: "new", label: "New" },
        { value: "qualified", label: "Qualified" },
        { value: "proposal", label: "Proposal" },
        { value: "won", label: "Won" },
      ]},
      { name: "opportunity_name", label: "Opportunity Name", type: "text", placeholder: "{{contact.company}} - Deal" },
      { name: "value", label: "Value", type: "number", placeholder: "1000" },
    ],
  },
  // Send Invoice
  send_invoice: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Send Invoice" },
      { name: "amount", label: "Amount", type: "number", required: true, placeholder: "100.00" },
      { name: "description", label: "Description", type: "text", required: true, placeholder: "Invoice for services" },
      { name: "due_days", label: "Due In (Days)", type: "number", placeholder: "30" },
    ],
  },
  // Stripe Charge
  stripe_charge: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Stripe Charge" },
      { name: "amount", label: "Amount (cents)", type: "number", required: true, placeholder: "10000" },
      { name: "description", label: "Description", type: "text", required: true, placeholder: "One-time charge" },
      { name: "currency", label: "Currency", type: "select", options: [
        { value: "usd", label: "USD" },
        { value: "eur", label: "EUR" },
        { value: "gbp", label: "GBP" },
      ]},
    ],
  },
  // Update Appointment
  update_appointment: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Update Appointment" },
      { name: "status", label: "New Status", type: "select", required: true, options: [
        { value: "confirmed", label: "Confirmed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "completed", label: "Completed" },
        { value: "no_show", label: "No Show" },
      ]},
    ],
  },
  // Booking Link
  booking_link: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Generate Booking Link" },
      { name: "calendar_id", label: "Calendar", type: "select", required: true, options: [
        { value: "default", label: "Default Calendar" },
        { value: "sales", label: "Sales Meetings" },
        { value: "support", label: "Support Calls" },
      ]},
      { name: "store_as", label: "Store Link As", type: "text", placeholder: "{{booking.link}}" },
    ],
  },
};
