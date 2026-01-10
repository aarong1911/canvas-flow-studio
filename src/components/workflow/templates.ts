// src/pages/workflows/templates.ts
// Static workflow template registry - no dynamic imports needed

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: "sales" | "communication" | "projects" | "finance" | "general";
  triggers: Array<{
    id: string;
    actionType: string;
    label: string;
    icon: string;
    color: string;
    config: Record<string, any>;
    isConfigured?: boolean;
  }>;
  nodes: Array<{
    id: string;
    type: string;
    position: { x: number; y: number };
    data: {
      builderType: string;
      actionType: string;
      label: string;
      icon: string;
      color: string;
      config: Record<string, any>;
    };
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
  }>;
  settings?: {
    allowReEntry?: boolean;
    timezone?: string;
  };
  expectedResults?: string;
}

// =============================================================================
// TEMPLATE 01: New Lead Nurture Sequence (Simplified)
// =============================================================================
const template_01_new_lead_nurture: WorkflowTemplate = {
  id: "template_01_new_lead_nurture",
  name: "New Lead Nurture Sequence",
  description: "Follow-up sequence with email and SMS outreach for new leads",
  category: "sales",
  triggers: [
    {
      id: "trigger_1",
      actionType: "contact_created",
      label: "New Contact Added",
      icon: "UserPlus",
      color: "purple",
      config: { trigger_event: "contact_created" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as New Lead",
        icon: "Tag",
        color: "blue",
        config: { tag: "new_lead" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Welcome Email",
        icon: "Mail",
        color: "blue",
        config: {
          subject: "Welcome! Let's discuss your project",
          template: "welcome_lead",
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 2 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "2", unit: "days" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Email Opened?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "email_opened",
          branches: [
            { id: "branch_0", name: "Opened", segments: [{ field: "email_opened", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "Not Opened", segments: [{ field: "email_opened", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: -220, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Follow-up Email",
        icon: "Mail",
        color: "blue",
        config: { subject: "Quick follow-up on my last email" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: 220, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Outreach",
        icon: "MessageSquare",
        color: "green",
        config: { message: "Hi! I sent you an email about your project. Mind taking a look?" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5", sourceHandle: "branch_0" },
    { id: "edge_5", source: "node_4", target: "node_6", sourceHandle: "branch_1" },
  ],
  settings: { allowReEntry: false, timezone: "America/New_York" },
  expectedResults: "50-70% open rate, improved lead engagement",
};

// =============================================================================
// TEMPLATE 02: Email Re-engagement Campaign
// =============================================================================
const template_02_email_engagement: WorkflowTemplate = {
  id: "template_02_email_engagement",
  name: "Email Re-engagement Campaign",
  description: "Re-engage cold leads with targeted email and SMS follow-ups",
  category: "sales",
  triggers: [
    {
      id: "trigger_1",
      actionType: "tag_added",
      label: "Tag: Cold Lead",
      icon: "Tag",
      color: "blue",
      config: { trigger_event: "tag_added", tag_name: "cold_lead" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Re-engagement Email",
        icon: "Mail",
        color: "amber",
        config: { subject: "We miss you! Special offer inside", template: "reengagement" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "3", unit: "days" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Email Opened?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "email_opened",
          branches: [
            { id: "branch_0", name: "Opened", segments: [{ field: "email_opened", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "Not Opened", segments: [{ field: "email_opened", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: -220, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Follow-up to Openers",
        icon: "Mail",
        color: "blue",
        config: { subject: "Here's that info you were looking for" },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 220, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Check-in",
        icon: "MessageSquare",
        color: "green",
        config: { message: "Hi! Haven't heard from you in a while. Still interested?" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: -220, y: 720 },
      data: {
        builderType: "action",
        actionType: "remove_tag",
        label: "Remove Cold Tag",
        icon: "Tag",
        color: "green",
        config: { tag: "cold_lead" },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      position: { x: 220, y: 720 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag Unresponsive",
        icon: "Tag",
        color: "gray",
        config: { tag: "unresponsive" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4", sourceHandle: "branch_0" },
    { id: "edge_4", source: "node_3", target: "node_5", sourceHandle: "branch_1" },
    { id: "edge_5", source: "node_4", target: "node_6" },
    { id: "edge_6", source: "node_5", target: "node_7" },
  ],
  settings: { allowReEntry: true, timezone: "America/New_York" },
  expectedResults: "35-50% re-engagement rate",
};

// =============================================================================
// TEMPLATE 03: Referral Request
// =============================================================================
const template_03_referral_request: WorkflowTemplate = {
  id: "template_03_referral_request",
  name: "Referral Request Automation",
  description: "Request referrals from clients who leave positive reviews",
  category: "general",
  triggers: [
    {
      id: "trigger_1",
      actionType: "review_received",
      label: "Review Received",
      icon: "CheckCircle",
      color: "green",
      config: { trigger_event: "review_received" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Check Rating",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "rating",
          branches: [
            { id: "branch_0", name: "4+ Stars", segments: [{ field: "rating", operator: "greater_than_or_equal", value: "4" }] },
            { id: "branch_1", name: "< 4 Stars", segments: [{ field: "rating", operator: "less_than", value: "4" }] },
          ],
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: -220, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Thank You Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Thank you for your amazing review!" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 220, y: 180 },
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Manager",
        icon: "Bell",
        color: "red",
        config: { notification_type: "low_rating_alert" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: -220, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 1 Day",
        icon: "Clock",
        color: "gray",
        config: { duration: "1", unit: "days" },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 220, y: 360 },
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Follow-up Task",
        icon: "ClipboardList",
        color: "amber",
        config: { title: "Follow up on low rating" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: -220, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Request Referral",
        icon: "Mail",
        color: "blue",
        config: { subject: "Know anyone who needs our services?" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2", sourceHandle: "branch_0" },
    { id: "edge_2", source: "node_1", target: "node_3", sourceHandle: "branch_1" },
    { id: "edge_3", source: "node_2", target: "node_4" },
    { id: "edge_4", source: "node_3", target: "node_5" },
    { id: "edge_5", source: "node_4", target: "node_6" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "30-40% referral rate",
};

// =============================================================================
// TEMPLATE 04: Payment Collection
// =============================================================================
const template_04_payment_collection: WorkflowTemplate = {
  id: "template_04_payment_collection",
  name: "Payment Collection Sequence",
  description: "Automated payment reminder sequence with escalating urgency",
  category: "finance",
  triggers: [
    {
      id: "trigger_1",
      actionType: "invoice_overdue",
      label: "Invoice Overdue",
      icon: "Receipt",
      color: "red",
      config: { trigger_event: "invoice_overdue" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "3", unit: "days" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Gentle Reminder",
        icon: "Mail",
        color: "blue",
        config: { subject: "Friendly Reminder: Invoice Due" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 4 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "4", unit: "days" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Payment Received?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "payment_received",
          branches: [
            { id: "branch_0", name: "Paid", segments: [{ field: "payment_received", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "Unpaid", segments: [{ field: "payment_received", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: -220, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Payment Confirmation",
        icon: "Mail",
        color: "green",
        config: { subject: "Thank you for your payment!" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: 220, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Reminder",
        icon: "MessageSquare",
        color: "amber",
        config: { message: "Your invoice is now 7 days overdue. Please submit payment." },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      position: { x: 220, y: 900 },
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Collections",
        icon: "Bell",
        color: "red",
        config: { notification_type: "collections_required" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5", sourceHandle: "branch_0" },
    { id: "edge_5", source: "node_4", target: "node_6", sourceHandle: "branch_1" },
    { id: "edge_6", source: "node_6", target: "node_7" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "40% faster collection, 60% fewer overdue",
};

// =============================================================================
// TEMPLATE 05: Site Visit Coordination
// =============================================================================
const template_05_site_visit: WorkflowTemplate = {
  id: "template_05_site_visit",
  name: "Site Visit Coordination",
  description: "Appointment reminder system with confirmation checks and fallbacks",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "appointment_scheduled",
      label: "Site Visit Scheduled",
      icon: "Calendar",
      color: "blue",
      config: { trigger_event: "appointment_scheduled" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Confirmation Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Site Visit Confirmed" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "wait_until",
        label: "Wait Until 2 Days Before",
        icon: "Clock",
        color: "gray",
        config: { wait_type: "relative_to_appointment", days_before: 2 },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "2-Day Reminder",
        icon: "Mail",
        color: "blue",
        config: { subject: "Reminder: Site Visit in 2 Days" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 1 Day",
        icon: "Clock",
        color: "gray",
        config: { duration: "1", unit: "days" },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 0, y: 720 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Confirmed?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "contact_replied",
          branches: [
            { id: "branch_0", name: "Confirmed", segments: [{ field: "contact_replied", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "No Response", segments: [{ field: "contact_replied", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: -220, y: 900 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag Confirmed",
        icon: "Tag",
        color: "green",
        config: { tag: "visit_confirmed" },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      position: { x: 220, y: 900 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Day-Before SMS",
        icon: "MessageSquare",
        color: "amber",
        config: { message: "Reminder: Site visit tomorrow. Reply YES to confirm." },
      },
    },
    {
      id: "node_8",
      type: "workflowNode",
      position: { x: -220, y: 1080 },
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Team",
        icon: "Bell",
        color: "purple",
        config: { notification_type: "upcoming_site_visit" },
      },
    },
    {
      id: "node_9",
      type: "workflowNode",
      position: { x: 220, y: 1080 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag At Risk",
        icon: "Tag",
        color: "red",
        config: { tag: "visit_at_risk" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5" },
    { id: "edge_5", source: "node_5", target: "node_6", sourceHandle: "branch_0" },
    { id: "edge_6", source: "node_5", target: "node_7", sourceHandle: "branch_1" },
    { id: "edge_7", source: "node_6", target: "node_8" },
    { id: "edge_8", source: "node_7", target: "node_9" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "90%+ attendance, 70% no-show reduction",
};

// =============================================================================
// TEMPLATE 06: Post-Project Review Request
// =============================================================================
const template_06_post_project_review: WorkflowTemplate = {
  id: "template_06_post_project_review",
  name: "Post-Project Review Request",
  description: "Collect reviews after project completion with follow-up sequence",
  category: "general",
  triggers: [
    {
      id: "trigger_1",
      actionType: "project_completed",
      label: "Project Completed",
      icon: "CheckCircle",
      color: "green",
      config: { trigger_event: "project_completed" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 1 Day",
        icon: "Clock",
        color: "gray",
        config: { duration: "1", unit: "days" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Request Review",
        icon: "Mail",
        color: "blue",
        config: { subject: "How did we do? Share your feedback" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "3", unit: "days" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Reviewed?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "review_submitted",
          branches: [
            { id: "branch_0", name: "Reviewed", segments: [{ field: "review_submitted", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "Not Reviewed", segments: [{ field: "review_submitted", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: -220, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Thank You Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Thank you for your review!" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: 220, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Follow-up",
        icon: "MessageSquare",
        color: "blue",
        config: { message: "Would love to hear your feedback. Mind leaving a quick review?" },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      position: { x: -220, y: 900 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Reviewer",
        icon: "Tag",
        color: "green",
        config: { tag: "left_review" },
      },
    },
    {
      id: "node_8",
      type: "workflowNode",
      position: { x: 220, y: 900 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag No Review",
        icon: "Tag",
        color: "gray",
        config: { tag: "no_review_response" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5", sourceHandle: "branch_0" },
    { id: "edge_5", source: "node_4", target: "node_6", sourceHandle: "branch_1" },
    { id: "edge_6", source: "node_5", target: "node_7" },
    { id: "edge_7", source: "node_6", target: "node_8" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "40% review rate",
};

// =============================================================================
// TEMPLATE 07: Seasonal Promotion
// =============================================================================
const template_07_seasonal_promotion: WorkflowTemplate = {
  id: "template_07_seasonal_promotion",
  name: "Seasonal Promotion Campaign",
  description: "Timed promotion campaign with VIP and general audience paths",
  category: "sales",
  triggers: [
    {
      id: "trigger_1",
      actionType: "date_based",
      label: "March 1st Each Year",
      icon: "Calendar",
      color: "amber",
      config: { trigger_event: "date_based", schedule: "yearly", date: "03-01" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "VIP Customer?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "is_vip",
          branches: [
            { id: "branch_0", name: "VIP", segments: [{ field: "is_vip", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "Regular", segments: [{ field: "is_vip", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: -220, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "VIP Early Access",
        icon: "Mail",
        color: "purple",
        config: { subject: "🌟 Your exclusive VIP invitation" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 220, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "General Promotion",
        icon: "Mail",
        color: "amber",
        config: { subject: "Spring Sale: Save on Your Next Project" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: -220, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 2 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "2", unit: "days" },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 220, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "3", unit: "days" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: -220, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "VIP Last Chance",
        icon: "Mail",
        color: "red",
        config: { subject: "⏰ VIP offer expires tonight!" },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      position: { x: 220, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Last Chance",
        icon: "MessageSquare",
        color: "amber",
        config: { message: "Spring sale ends tonight! Don't miss your 20% discount." },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2", sourceHandle: "branch_0" },
    { id: "edge_2", source: "node_1", target: "node_3", sourceHandle: "branch_1" },
    { id: "edge_3", source: "node_2", target: "node_4" },
    { id: "edge_4", source: "node_3", target: "node_5" },
    { id: "edge_5", source: "node_4", target: "node_6" },
    { id: "edge_6", source: "node_5", target: "node_7" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "25-40% conversion rate",
};

// =============================================================================
// TEMPLATE 08: Welcome Onboarding
// =============================================================================
const template_08_welcome_onboarding: WorkflowTemplate = {
  id: "template_08_welcome_onboarding",
  name: "Welcome Onboarding Sequence",
  description: "Onboard new customers with a multi-step welcome series",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "customer_created",
      label: "New Customer",
      icon: "UserPlus",
      color: "green",
      config: { trigger_event: "customer_created" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Welcome Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Welcome aboard! Here's what's next" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as New Customer",
        icon: "Tag",
        color: "blue",
        config: { tag: "new_customer" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 2 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "2", unit: "days" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Getting Started Tips",
        icon: "Mail",
        color: "blue",
        config: { subject: "Tips to get the most out of our service" },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 0, y: 720 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 5 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "5", unit: "days" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: 0, y: 900 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Check-in Email",
        icon: "Mail",
        color: "blue",
        config: { subject: "How's everything going?" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5" },
    { id: "edge_5", source: "node_5", target: "node_6" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "High engagement in first week",
};

// =============================================================================
// TEMPLATE 09: Review Request Automation
// =============================================================================
const template_09_review_request: WorkflowTemplate = {
  id: "template_09_review_request",
  name: "Review Request Automation",
  description: "Request reviews from customers after service completion",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "appointment_completed",
      label: "Appointment Completed",
      icon: "CheckCircle",
      color: "green",
      config: { trigger_event: "appointment_completed" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 1 Day",
        icon: "Clock",
        color: "gray",
        config: { duration: "1", unit: "days" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Review Request Email",
        icon: "Mail",
        color: "blue",
        config: { subject: "How was your experience? We'd love your feedback!" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Reviewer",
        icon: "Tag",
        color: "blue",
        config: { tag: "reviewer" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "3", unit: "days" },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 0, y: 720 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Review Submitted?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "review_submitted",
          branches: [
            { id: "branch_0", name: "Submitted", segments: [{ field: "review_submitted", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "Not Submitted", segments: [{ field: "review_submitted", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: -220, y: 900 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Thank You Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Thank you for your review!" },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      position: { x: 220, y: 900 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Reminder",
        icon: "MessageSquare",
        color: "green",
        config: { message: "Hi! We'd love to hear your feedback. Mind leaving a quick review?" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5" },
    { id: "edge_5", source: "node_5", target: "node_6", sourceHandle: "branch_0" },
    { id: "edge_6", source: "node_5", target: "node_7", sourceHandle: "branch_1" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "40-60% review submission rate",
};

// =============================================================================
// TEMPLATE 10: Appointment Reminder Sequence
// =============================================================================
const template_10_appointment_reminder: WorkflowTemplate = {
  id: "template_10_appointment_reminder",
  name: "Appointment Reminder Sequence",
  description: "Automated reminders leading up to scheduled appointments",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "appointment_scheduled",
      label: "Appointment Scheduled",
      icon: "Calendar",
      color: "blue",
      config: { trigger_event: "appointment_scheduled" },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      position: { x: 0, y: 0 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Confirmation Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Your appointment is confirmed!" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Booked",
        icon: "Tag",
        color: "blue",
        config: { tag: "booked" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait Until 1 Day Before",
        icon: "Clock",
        color: "gray",
        config: { duration: "1", unit: "days", wait_type: "before_appointment" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Day Before SMS",
        icon: "MessageSquare",
        color: "green",
        config: { message: "Reminder: Your appointment is tomorrow! Reply CONFIRM to confirm or call us to reschedule." },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 0, y: 720 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait Until 2 Hours Before",
        icon: "Clock",
        color: "gray",
        config: { duration: "2", unit: "hours", wait_type: "before_appointment" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: 0, y: 900 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Final Reminder SMS",
        icon: "MessageSquare",
        color: "amber",
        config: { message: "Your appointment is in 2 hours! We look forward to seeing you." },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5" },
    { id: "edge_5", source: "node_5", target: "node_6" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "90%+ show rate, reduced no-shows",
};

// =============================================================================
// Export all templates
// =============================================================================
export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  template_01_new_lead_nurture,
  template_02_email_engagement,
  template_03_referral_request,
  template_04_payment_collection,
  template_05_site_visit,
  template_06_post_project_review,
  template_07_seasonal_promotion,
  template_08_welcome_onboarding,
  template_09_review_request,
  template_10_appointment_reminder,
];

export function getWorkflowTemplateById(id: string): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find((t) => t.id === id);
}

// Alias for backward compatibility
export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return getWorkflowTemplateById(id);
}

export function getAllTemplateIds(): string[] {
  return WORKFLOW_TEMPLATES.map((t) => t.id);
}
