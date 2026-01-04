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
    ],
  },
  send_sms: {
    title: "Configure",
    variables: DEFAULT_VARIABLES,
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Send SMS" },
      { name: "to", label: "Phone", type: "text", required: true, placeholder: "{{contact.phone}}" },
      { name: "message", label: "Message", type: "textarea", required: true, rows: 5 },
    ],
  },
  if_else: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Condition Name", type: "text", placeholder: "If/Else Condition" },
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
      { name: "event_key", label: "Event Key", type: "text", required: true, placeholder: "e.g. email_replied OR deal_won" },
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
    ],
  },
  add_tag: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Add Tag" },
      { name: "tag", label: "Tag Name", type: "text", required: true, placeholder: "VIP" },
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
  // Remove Tag
  remove_tag: {
    title: "Configure",
    fields: [
      { name: "action_name", label: "Action Name", type: "text", placeholder: "Remove Tag" },
      { name: "tag", label: "Tag Name", type: "text", required: true, placeholder: "VIP" },
    ],
  },
  // Remove Assigned User
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
