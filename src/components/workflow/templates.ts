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
// TEMPLATE 11: Estimate Follow-Up (Construction/Home Services)
// =============================================================================
const template_11_estimate_followup: WorkflowTemplate = {
  id: "template_11_estimate_followup",
  name: "Estimate Follow-Up Sequence",
  description: "Follow up on estimates sent to convert more bids into signed contracts",
  category: "sales",
  triggers: [
    {
      id: "trigger_1",
      actionType: "estimate_sent",
      label: "Estimate Sent",
      icon: "FileText",
      color: "blue",
      config: { trigger_event: "estimate_sent" },
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
        label: "Wait 2 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "2", unit: "days" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Check-in Email",
        icon: "Mail",
        color: "blue",
        config: { subject: "Did you have a chance to review our estimate?" },
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
        label: "Estimate Accepted?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "estimate_status",
          branches: [
            { id: "branch_0", name: "Accepted", segments: [{ field: "estimate_status", operator: "equals", value: "accepted" }] },
            { id: "branch_1", name: "Pending", segments: [{ field: "estimate_status", operator: "equals", value: "pending" }] },
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
        label: "Contract & Scheduling",
        icon: "Mail",
        color: "green",
        config: { subject: "Great news! Let's schedule your project" },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      position: { x: 220, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Personal Follow-up SMS",
        icon: "MessageSquare",
        color: "amber",
        config: { message: "Hi! Just checking in on the estimate we sent. Any questions I can answer?" },
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
  settings: { allowReEntry: false },
  expectedResults: "40-60% estimate-to-contract conversion",
};

// =============================================================================
// TEMPLATE 12: Job Completion & Review Request (Home Services)
// =============================================================================
const template_12_job_completion: WorkflowTemplate = {
  id: "template_12_job_completion",
  name: "Job Completion Follow-Up",
  description: "Thank customers after job completion and request reviews on Google/Yelp",
  category: "general",
  triggers: [
    {
      id: "trigger_1",
      actionType: "job_completed",
      label: "Job Marked Complete",
      icon: "CheckCircle",
      color: "green",
      config: { trigger_event: "job_completed" },
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
        label: "Thank You Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Thank you for choosing us!" },
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
        builderType: "action",
        actionType: "send_sms",
        label: "Review Request SMS",
        icon: "MessageSquare",
        color: "blue",
        config: { message: "Hi! We hope you're loving your new work. Would you mind leaving us a quick review? It really helps our small business!" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
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
      id: "node_5",
      type: "workflowNode",
      position: { x: 0, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Final Review Reminder",
        icon: "Mail",
        color: "amber",
        config: { subject: "Quick favor: Share your experience?" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "25-40% review rate, improved online reputation",
};

// =============================================================================
// TEMPLATE 13: Warranty Expiration Reminder (HVAC/Roofing)
// =============================================================================
const template_13_warranty_expiration: WorkflowTemplate = {
  id: "template_13_warranty_expiration",
  name: "Warranty Expiration Reminder",
  description: "Notify customers before warranty expires and offer maintenance or extended coverage",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "date_based",
      label: "30 Days Before Warranty Expires",
      icon: "Calendar",
      color: "amber",
      config: { trigger_event: "date_based", days_before: 30, date_field: "warranty_expiration" },
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
        label: "Warranty Expiration Notice",
        icon: "Mail",
        color: "amber",
        config: { subject: "Your warranty expires in 30 days - Here's what you should know" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 14 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "14", unit: "days" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Reminder",
        icon: "MessageSquare",
        color: "amber",
        config: { message: "Reminder: Your equipment warranty expires in 2 weeks. Call us to schedule a maintenance check or discuss extended coverage." },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Create Follow-up Task",
        icon: "ClipboardList",
        color: "blue",
        config: { title: "Follow up on warranty expiration" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "15-25% extended warranty signups, maintenance bookings",
};

// =============================================================================
// TEMPLATE 14: Seasonal Service Reminder (HVAC/Landscaping)
// =============================================================================
const template_14_seasonal_service: WorkflowTemplate = {
  id: "template_14_seasonal_service",
  name: "Seasonal Service Reminder",
  description: "Remind customers about seasonal maintenance (AC tune-up, furnace check, spring cleanup)",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "date_based",
      label: "Seasonal Date Trigger",
      icon: "Calendar",
      color: "green",
      config: { trigger_event: "date_based", month: "march", day: 1 },
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
        label: "Seasonal Service Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Time for your seasonal tune-up! Book now before the rush" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
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
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Booked Appointment?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "has_upcoming_appointment",
          branches: [
            { id: "branch_0", name: "Yes", segments: [{ field: "has_upcoming_appointment", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "No", segments: [{ field: "has_upcoming_appointment", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 220, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Follow-up SMS",
        icon: "MessageSquare",
        color: "amber",
        config: { message: "Don't wait until it's too late! Schedule your seasonal service today and get 10% off." },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 220, y: 720 },
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Phone Call Task",
        icon: "ClipboardList",
        color: "blue",
        config: { title: "Call customer about seasonal service" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4", sourceHandle: "branch_1" },
    { id: "edge_4", source: "node_4", target: "node_5" },
  ],
  settings: { allowReEntry: true, timezone: "America/New_York" },
  expectedResults: "30-50% booking rate for seasonal services",
};

// =============================================================================
// TEMPLATE 15: Project Milestone Updates (Construction/Remodeling)
// =============================================================================
const template_15_project_milestones: WorkflowTemplate = {
  id: "template_15_project_milestones",
  name: "Project Milestone Updates",
  description: "Keep clients informed with automated updates at key project milestones",
  category: "projects",
  triggers: [
    {
      id: "trigger_1",
      actionType: "milestone_reached",
      label: "Milestone Reached",
      icon: "Flag",
      color: "blue",
      config: { trigger_event: "milestone_reached" },
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
        label: "Milestone Update Email",
        icon: "Mail",
        color: "blue",
        config: { subject: "Project Update: {{milestone_name}} Complete!" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Notification",
        icon: "MessageSquare",
        color: "green",
        config: { message: "Great news! Your project has reached a new milestone: {{milestone_name}}. Check your email for photos and details!" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Notify Project Manager",
        icon: "Bell",
        color: "purple",
        config: { notification_type: "milestone_complete" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
  ],
  settings: { allowReEntry: true },
  expectedResults: "Higher client satisfaction, fewer check-in calls",
};

// =============================================================================
// TEMPLATE 16: Material Delivery Notification (Construction)
// =============================================================================
const template_16_material_delivery: WorkflowTemplate = {
  id: "template_16_material_delivery",
  name: "Material Delivery Notification",
  description: "Alert clients and crew when materials are scheduled for delivery",
  category: "projects",
  triggers: [
    {
      id: "trigger_1",
      actionType: "delivery_scheduled",
      label: "Delivery Scheduled",
      icon: "Truck",
      color: "blue",
      config: { trigger_event: "delivery_scheduled" },
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
        label: "Client Delivery Notice",
        icon: "Mail",
        color: "blue",
        config: { subject: "Material delivery scheduled for {{delivery_date}}" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Notify Crew",
        icon: "Bell",
        color: "purple",
        config: { notification_type: "crew_alert", message: "Materials arriving {{delivery_date}}" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait Until Morning Of",
        icon: "Clock",
        color: "gray",
        config: { duration: "8", unit: "hours", wait_type: "before_delivery" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Day-of SMS Reminder",
        icon: "MessageSquare",
        color: "amber",
        config: { message: "Heads up! Materials will be delivered to your property today. Please ensure the area is accessible." },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
  ],
  settings: { allowReEntry: true },
  expectedResults: "Smoother deliveries, fewer access issues",
};

// =============================================================================
// TEMPLATE 17: Permit Status Update (Construction/Remodeling)
// =============================================================================
const template_17_permit_status: WorkflowTemplate = {
  id: "template_17_permit_status",
  name: "Permit Status Notification",
  description: "Notify clients when permit status changes (approved, pending, issues)",
  category: "projects",
  triggers: [
    {
      id: "trigger_1",
      actionType: "permit_status_changed",
      label: "Permit Status Changed",
      icon: "FileCheck",
      color: "green",
      config: { trigger_event: "permit_status_changed" },
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
        label: "Check Permit Status",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "permit_status",
          branches: [
            { id: "branch_0", name: "Approved", segments: [{ field: "permit_status", operator: "equals", value: "approved" }] },
            { id: "branch_1", name: "Issues", segments: [{ field: "permit_status", operator: "equals", value: "issues" }] },
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
        label: "Permit Approved Email",
        icon: "Mail",
        color: "green",
        config: { subject: "Great news! Your permit has been approved" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 220, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Permit Issues Email",
        icon: "Mail",
        color: "red",
        config: { subject: "Action needed: Permit requires additional information" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: -220, y: 360 },
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Schedule Start Date",
        icon: "ClipboardList",
        color: "blue",
        config: { title: "Contact client to schedule project start" },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 220, y: 360 },
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Office",
        icon: "Bell",
        color: "red",
        config: { notification_type: "permit_issue_alert" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2", sourceHandle: "branch_0" },
    { id: "edge_2", source: "node_1", target: "node_3", sourceHandle: "branch_1" },
    { id: "edge_3", source: "node_2", target: "node_4" },
    { id: "edge_4", source: "node_3", target: "node_5" },
  ],
  settings: { allowReEntry: true },
  expectedResults: "Clients stay informed, faster issue resolution",
};

// =============================================================================
// TEMPLATE 18: Weather Delay Notification (Construction/Roofing/Landscaping)
// =============================================================================
const template_18_weather_delay: WorkflowTemplate = {
  id: "template_18_weather_delay",
  name: "Weather Delay Notification",
  description: "Automatically notify clients when weather causes project delays",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "weather_alert",
      label: "Weather Delay Triggered",
      icon: "CloudRain",
      color: "blue",
      config: { trigger_event: "weather_alert" },
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
        actionType: "send_sms",
        label: "Immediate SMS Alert",
        icon: "MessageSquare",
        color: "blue",
        config: { message: "Due to weather conditions, today's work has been postponed. We'll update you on the rescheduled date soon." },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Detailed Email",
        icon: "Mail",
        color: "blue",
        config: { subject: "Weather delay for your project" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Update Crew",
        icon: "Bell",
        color: "purple",
        config: { notification_type: "crew_weather_delay" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Reschedule Task",
        icon: "ClipboardList",
        color: "amber",
        config: { title: "Reschedule work date after weather delay" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
  ],
  settings: { allowReEntry: true },
  expectedResults: "Reduced client frustration, better crew coordination",
};

// =============================================================================
// TEMPLATE 19: Annual Maintenance Reminder (HVAC/Plumbing/Electrical)
// =============================================================================
const template_19_annual_maintenance: WorkflowTemplate = {
  id: "template_19_annual_maintenance",
  name: "Annual Maintenance Reminder",
  description: "Remind past customers when it's time for their annual service checkup",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "date_based",
      label: "1 Year Since Last Service",
      icon: "Calendar",
      color: "amber",
      config: { trigger_event: "anniversary", date_field: "last_service_date", years: 1 },
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
        label: "Maintenance Reminder Email",
        icon: "Mail",
        color: "amber",
        config: { subject: "It's been a year! Time for your annual checkup" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 7 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "7", unit: "days" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Appointment Scheduled?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "has_upcoming_appointment",
          branches: [
            { id: "branch_0", name: "Yes", segments: [{ field: "has_upcoming_appointment", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "No", segments: [{ field: "has_upcoming_appointment", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 220, y: 540 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS with Special Offer",
        icon: "MessageSquare",
        color: "green",
        config: { message: "Hi! Your annual maintenance is due. Book this week and get 15% off! Reply YES to schedule." },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 220, y: 720 },
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Phone Follow-up Task",
        icon: "ClipboardList",
        color: "blue",
        config: { title: "Call about annual maintenance" },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4", sourceHandle: "branch_1" },
    { id: "edge_4", source: "node_4", target: "node_5" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "40-60% rebooking rate, increased recurring revenue",
};

// =============================================================================
// TEMPLATE 20: Safety Inspection Due (Commercial/HVAC/Electrical)
// =============================================================================
const template_20_safety_inspection: WorkflowTemplate = {
  id: "template_20_safety_inspection",
  name: "Safety Inspection Due Reminder",
  description: "Remind commercial clients when mandatory safety inspections are due",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "date_based",
      label: "30 Days Before Inspection Due",
      icon: "Calendar",
      color: "red",
      config: { trigger_event: "date_based", days_before: 30, date_field: "inspection_due_date" },
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
        label: "Inspection Due Notice",
        icon: "Mail",
        color: "red",
        config: { subject: "Important: Your safety inspection is due in 30 days" },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      position: { x: 0, y: 180 },
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Schedule Inspection Task",
        icon: "ClipboardList",
        color: "red",
        config: { title: "Contact client to schedule safety inspection" },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      position: { x: 0, y: 360 },
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 14 Days",
        icon: "Clock",
        color: "gray",
        config: { duration: "14", unit: "days" },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      position: { x: 0, y: 540 },
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Inspection Scheduled?",
        icon: "GitBranch",
        color: "amber",
        config: {
          field: "inspection_scheduled",
          branches: [
            { id: "branch_0", name: "Yes", segments: [{ field: "inspection_scheduled", operator: "equals", value: "true" }] },
            { id: "branch_1", name: "No", segments: [{ field: "inspection_scheduled", operator: "equals", value: "false" }] },
          ],
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      position: { x: 220, y: 720 },
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Urgent SMS Reminder",
        icon: "MessageSquare",
        color: "red",
        config: { message: "URGENT: Your safety inspection is due in 2 weeks. Please call us immediately to avoid compliance issues." },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5", sourceHandle: "branch_1" },
  ],
  settings: { allowReEntry: false },
  expectedResults: "95%+ compliance rate, prevented fines",
};

// =============================================================================
// Template ID Migration Map (old ID -> new ID)
// =============================================================================
const TEMPLATE_ID_MIGRATIONS: Record<string, string> = {
  // Legacy IDs that were renamed or reorganized
  "template_07_payment_collection": "template_04_payment_collection",
  "payment_collection": "template_04_payment_collection",
  "lead_nurture": "template_01_new_lead_nurture",
  "email_engagement": "template_02_email_engagement",
  "referral_request": "template_03_referral_request",
  "site_visit": "template_05_site_visit",
  "post_project_review": "template_06_post_project_review",
  "seasonal_promotion": "template_07_seasonal_promotion",
  "welcome_onboarding": "template_08_welcome_onboarding",
  "review_request": "template_09_review_request",
  "appointment_reminder": "template_10_appointment_reminder",
  "estimate_followup": "template_11_estimate_followup",
  "job_completion": "template_12_job_completion",
  "warranty_expiration": "template_13_warranty_expiration",
  "seasonal_service": "template_14_seasonal_service",
  "project_milestones": "template_15_project_milestones",
  "material_delivery": "template_16_material_delivery",
  "permit_status": "template_17_permit_status",
  "weather_delay": "template_18_weather_delay",
  "annual_maintenance": "template_19_annual_maintenance",
  "safety_inspection": "template_20_safety_inspection",
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
  template_11_estimate_followup,
  template_12_job_completion,
  template_13_warranty_expiration,
  template_14_seasonal_service,
  template_15_project_milestones,
  template_16_material_delivery,
  template_17_permit_status,
  template_18_weather_delay,
  template_19_annual_maintenance,
  template_20_safety_inspection,
];

/**
 * Resolves a template ID, applying migrations for legacy/renamed IDs.
 * Normalizes incoming IDs to be resilient to stale URLs/state (trim, case, separators).
 */
function resolveTemplateId(id: string): string {
  const raw = (id ?? "").trim();
  if (!raw) return raw;

  const normalized = raw
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/-/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_");

  return TEMPLATE_ID_MIGRATIONS[raw] || TEMPLATE_ID_MIGRATIONS[normalized] || raw;
}

export function getWorkflowTemplateById(id: string): WorkflowTemplate | undefined {
  const resolvedId = resolveTemplateId(id);
  if (resolvedId !== id) {
    console.log(`📦 [Template Migration] "${id}" -> "${resolvedId}"`);
  }
  return WORKFLOW_TEMPLATES.find((t) => t.id === resolvedId);
}

// Alias for backward compatibility
export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return getWorkflowTemplateById(id);
}

export function getAllTemplateIds(): string[] {
  return WORKFLOW_TEMPLATES.map((t) => t.id);
}
