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
// TEMPLATE 01: New Lead Nurture Sequence
// =============================================================================
const template_01_new_lead_nurture: WorkflowTemplate = {
  id: "template_01_new_lead_nurture",
  name: "New Lead Nurture Sequence",
  description: "Advanced follow-up sequence with A/B subject testing, lead scoring, engagement tracking, business hours gate, and conversion goals",
  category: "sales",
  triggers: [
    {
      id: "trigger_1",
      actionType: "contact_created",
      label: "New Contact Added",
      icon: "UserPlus",
      color: "purple",
      config: {
        trigger_event: "contact_created",
        conditions: [],
      },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as New Lead",
        icon: "Tag",
        color: "blue",
        config: {
          action_name: "Tag as New Lead",
          tag: "new_lead",
        },
      },
    },
    // Lead Score Threshold Branching
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "if_else",
        label: "Lead Score Routing",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Lead Score Routing",
          condition_type: "field_equals",
          field: "lead_score_tier",
          value: "hot",
          question: "Is lead score tier hot (80+)?",
        },
      },
    },
    // Hot Lead Path - Immediate high-touch
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Hot Lead",
        icon: "Tag",
        color: "red",
        config: {
          action_name: "Tag as Hot Lead",
          tag: "hot_lead",
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Sales Team",
        icon: "Bell",
        color: "red",
        config: {
          action_name: "Alert Sales Team - Hot Lead",
          channel: "in_app",
          message: "🔥 Hot lead detected! {{contact.first_name}} {{contact.last_name}} scored 80+. Immediate outreach recommended.",
        },
      },
    },
    // Business Hours Gate
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "business_hours_gate",
        label: "Business Hours Gate",
        icon: "BriefcaseBusiness",
        color: "amber",
        config: {
          action_name: "Business Hours Check",
          timezone_mode: "account",
          start_time: "09:00",
          end_time: "17:00",
          days: "Mon,Tue,Wed,Thu,Fri",
        },
      },
    },
    // A/B Split for Subject Lines
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "split",
        label: "A/B Subject Test",
        icon: "Split",
        color: "purple",
        config: {
          action_name: "Welcome Email A/B Test",
          path_a_label: "Direct Approach",
          path_a_ratio: 50,
          path_b_label: "Personal Touch",
          path_b_ratio: 50,
        },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Welcome Email A",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Welcome Email - Direct",
          template: "welcome_direct",
          subject: "Let's discuss your project requirements",
          track_opens: true,
          track_clicks: true,
        },
      },
    },
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Welcome Email B",
        icon: "Mail",
        color: "green",
        config: {
          action_name: "Welcome Email - Personal",
          template: "welcome_personal",
          subject: "Hi {{contact.first_name}}, I'd love to help!",
          track_opens: true,
          track_clicks: true,
        },
      },
    },
    // Goal/Conversion Tracking with Timeout
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "delay",
        actionType: "wait_for_event",
        label: "Wait for Reply",
        icon: "Target",
        color: "orange",
        config: {
          action_name: "Wait for Email Reply",
          event_key: "email_replied",
          timeout_enabled: true,
          timeout_value: 3,
          timeout_unit: "days",
          timeout_action: "branch_timeout",
        },
      },
    },
    // Email Engagement Check
    {
      id: "node_10",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "if_else",
        label: "Check Email Opened",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Email Engagement",
          condition_type: "field_equals",
          field: "email_opened",
          value: "true",
          question: "Did the contact open the email?",
        },
      },
    },
    {
      id: "node_11",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Follow-up (Non-openers)",
        icon: "MessageSquare",
        color: "green",
        config: {
          action_name: "SMS Outreach",
          message: "Hi {{contact.first_name}}! I sent you an email about your project. Mind taking a look? Happy to answer any questions!",
        },
      },
    },
    {
      id: "node_12",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "if_else",
        label: "Check Link Clicked",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Link Clicked",
          condition_type: "field_equals",
          field: "email_clicked",
          value: "true",
          question: "Did the contact click a link?",
        },
      },
    },
    {
      id: "node_13",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "High-Intent Follow-up",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "High-Intent Follow-up",
          template: "high_intent_followup",
          subject: "I noticed you were interested in {{clicked_link_topic}}",
        },
      },
    },
    {
      id: "node_14",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "goal_event",
        label: "Track Conversion",
        icon: "Target",
        color: "green",
        config: {
          action_name: "Track Lead Conversion",
          goal_type: "reply",
          track_attribution: true,
        },
      },
    },
    // Cold/Warm Lead Nurture Path
    {
      id: "node_15",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 2 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 2 Days",
          duration: "2",
          unit: "days",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3", sourceHandle: "branch_0" }, // Hot
    { id: "edge_3", source: "node_2", target: "node_15", sourceHandle: "branch_1" }, // Warm/Cold
    { id: "edge_4", source: "node_3", target: "node_4" },
    { id: "edge_5", source: "node_4", target: "node_5" },
    { id: "edge_6", source: "node_5", target: "node_6", sourceHandle: "branch_0" }, // In hours
    { id: "edge_7", source: "node_6", target: "node_7", sourceHandle: "branch_0" }, // Path A
    { id: "edge_8", source: "node_6", target: "node_8", sourceHandle: "branch_1" }, // Path B
    { id: "edge_9", source: "node_7", target: "node_9" },
    { id: "edge_10", source: "node_8", target: "node_9" },
    { id: "edge_11", source: "node_9", target: "node_14", sourceHandle: "branch_0" }, // Goal achieved
    { id: "edge_12", source: "node_9", target: "node_10", sourceHandle: "branch_1" }, // Timeout
    { id: "edge_13", source: "node_10", target: "node_12", sourceHandle: "branch_0" }, // Opened
    { id: "edge_14", source: "node_10", target: "node_11", sourceHandle: "branch_1" }, // Not opened
    { id: "edge_15", source: "node_12", target: "node_13", sourceHandle: "branch_0" }, // Clicked
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "50-70% conversion, lead score routing, A/B tested subject lines",
};

// =============================================================================
// TEMPLATE 02: Email Engagement Re-activation
// =============================================================================
const template_02_email_engagement: WorkflowTemplate = {
  id: "template_02_email_engagement",
  name: "Email Engagement Re-activation",
  description: "Advanced re-engagement with day-of-week optimization, A/B send times, engagement scoring, and conversion tracking with timeout fallbacks",
  category: "sales",
  triggers: [
    {
      id: "trigger_1",
      actionType: "tag_added",
      label: "Tag: Cold Lead",
      icon: "Tag",
      color: "blue",
      config: {
        trigger_event: "tag_added",
        tag_name: "cold_lead",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    // Day of Week Routing
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "if_else",
        label: "Check Day of Week",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Day of Week Check",
          condition_type: "field_equals",
          field: "day_of_week",
          value: "monday",
          question: "Is it Monday (best re-engagement day)?",
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait_until",
        label: "Wait Until Monday",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait Until Next Monday",
          mode: "time_of_day",
          time_of_day: "10:00",
          timezone_mode: "contact",
        },
      },
    },
    // A/B Split for Send Time
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "split",
        label: "A/B Send Time Test",
        icon: "Split",
        color: "purple",
        config: {
          action_name: "Send Time A/B Test",
          path_a_label: "Morning (10am)",
          path_a_ratio: 50,
          path_b_label: "Afternoon (2pm)",
          path_b_ratio: 50,
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait_until",
        label: "Wait Until 10am",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait Until Morning",
          mode: "time_of_day",
          time_of_day: "10:00",
          timezone_mode: "contact",
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait_until",
        label: "Wait Until 2pm",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait Until Afternoon",
          mode: "time_of_day",
          time_of_day: "14:00",
          timezone_mode: "contact",
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Re-engagement Email",
        icon: "Mail",
        color: "amber",
        config: {
          action_name: "Re-engagement Email",
          template: "reengagement",
          subject: "We miss you! Special offer inside",
          track_opens: true,
          track_clicks: true,
        },
      },
    },
    // Goal with Timeout Fallback
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "delay",
        actionType: "wait_for_event",
        label: "Wait for Engagement",
        icon: "Target",
        color: "orange",
        config: {
          action_name: "Wait for Email Engagement",
          event_key: "email_clicked",
          timeout_enabled: true,
          timeout_value: 5,
          timeout_unit: "days",
          timeout_action: "branch_timeout",
        },
      },
    },
    // Engagement Check for Openers
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "if_else",
        label: "Check Email Opened",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check If Opened",
          condition_type: "field_equals",
          field: "email_opened",
          value: "true",
          question: "Did the contact open the email?",
        },
      },
    },
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Follow-up Email",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Follow-up to Openers",
          template: "reengagement_followup",
          subject: "{{contact.first_name}}, here's that info you were looking for",
        },
      },
    },
    {
      id: "node_10",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Check-in",
        icon: "MessageSquare",
        color: "green",
        config: {
          action_name: "SMS Check-in",
          message: "Hi {{contact.first_name}}! Haven't heard from you in a while. Still interested in your project? Let's chat!",
        },
      },
    },
    {
      id: "node_11",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "goal_event",
        label: "Track Re-engagement",
        icon: "Target",
        color: "green",
        config: {
          action_name: "Track Re-engagement",
          goal_type: "reply",
          track_attribution: true,
        },
      },
    },
    {
      id: "node_12",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "remove_tag",
        label: "Remove Cold Tag",
        icon: "Tag",
        color: "green",
        config: {
          action_name: "Remove Cold Lead Tag",
          tag: "cold_lead",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_3", sourceHandle: "branch_0" }, // Is Monday
    { id: "edge_2", source: "node_1", target: "node_2", sourceHandle: "branch_1" }, // Not Monday
    { id: "edge_3", source: "node_2", target: "node_3" },
    { id: "edge_4", source: "node_3", target: "node_4", sourceHandle: "branch_0" }, // Morning
    { id: "edge_5", source: "node_3", target: "node_5", sourceHandle: "branch_1" }, // Afternoon
    { id: "edge_6", source: "node_4", target: "node_6" },
    { id: "edge_7", source: "node_5", target: "node_6" },
    { id: "edge_8", source: "node_6", target: "node_7" },
    { id: "edge_9", source: "node_7", target: "node_11", sourceHandle: "branch_0" }, // Goal achieved
    { id: "edge_10", source: "node_7", target: "node_8", sourceHandle: "branch_1" }, // Timeout
    { id: "edge_11", source: "node_8", target: "node_9", sourceHandle: "branch_0" }, // Opened
    { id: "edge_12", source: "node_8", target: "node_10", sourceHandle: "branch_1" }, // Not opened
    { id: "edge_13", source: "node_11", target: "node_12" },
  ],
  settings: {
    allowReEntry: true,
    timezone: "America/New_York",
  },
  expectedResults: "35-50% re-engagement rate, optimized send times",
};

// =============================================================================
// TEMPLATE 03: Seasonal Promotion Campaign
// =============================================================================
const template_03_seasonal_promotion: WorkflowTemplate = {
  id: "template_03_seasonal_promotion",
  name: "Seasonal Promotion Campaign",
  description: "Advanced campaign with A/B subject testing, lead score targeting, business hours delivery, engagement tracking, and conversion goals",
  category: "sales",
  triggers: [
    {
      id: "trigger_1",
      actionType: "date_based",
      label: "March 1st Each Year",
      icon: "Calendar",
      color: "amber",
      config: {
        trigger_event: "date_based",
        schedule: "yearly",
        date: "03-01",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    // Lead Score Threshold Check
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "if_else",
        label: "Lead Score Tier",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Lead Score Tier Check",
          condition_type: "field_equals",
          field: "lead_score_tier",
          value: "hot",
          question: "Is this a hot lead (score 80+)?",
        },
      },
    },
    // Hot Leads - VIP Treatment
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "if_else",
        label: "Check Client Type",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Client Type",
          condition_type: "field_equals",
          field: "contact_type",
          value: "customer",
          question: "Is this an existing customer?",
        },
      },
    },
    // Business Hours Gate for Hot Leads
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "business_hours_gate",
        label: "Business Hours Gate",
        icon: "BriefcaseBusiness",
        color: "amber",
        config: {
          action_name: "Business Hours Check",
          timezone_mode: "contact",
          start_time: "09:00",
          end_time: "18:00",
          days: "Mon,Tue,Wed,Thu,Fri",
        },
      },
    },
    // A/B Test Subject Lines
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "split",
        label: "A/B Subject Test",
        icon: "Split",
        color: "purple",
        config: {
          action_name: "VIP Subject A/B Test",
          path_a_label: "Urgency Focus",
          path_a_ratio: 50,
          path_b_label: "Exclusivity Focus",
          path_b_ratio: 50,
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "VIP Email A (Urgency)",
        icon: "Mail",
        color: "purple",
        config: {
          action_name: "VIP Email - Urgency",
          template: "vip_early_access",
          subject: "⏰ {{contact.first_name}}, 24 hours left for VIP Early Access!",
          track_opens: true,
          track_clicks: true,
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "VIP Email B (Exclusivity)",
        icon: "Mail",
        color: "purple",
        config: {
          action_name: "VIP Email - Exclusivity",
          template: "vip_early_access",
          subject: "🌟 {{contact.first_name}}, your exclusive VIP invitation",
          track_opens: true,
          track_clicks: true,
        },
      },
    },
    // Conversion Goal with Timeout
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "delay",
        actionType: "wait_for_event",
        label: "Wait for Purchase",
        icon: "Target",
        color: "orange",
        config: {
          action_name: "Wait for Purchase",
          event_key: "payment_received",
          timeout_enabled: true,
          timeout_value: 7,
          timeout_unit: "days",
          timeout_action: "branch_timeout",
        },
      },
    },
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "goal_event",
        label: "Track Conversion",
        icon: "Target",
        color: "green",
        config: {
          action_name: "Track Seasonal Conversion",
          goal_type: "purchase",
          track_attribution: true,
        },
      },
    },
    // Email Engagement Check for Non-converters
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "if_else",
        label: "Check Email Clicked",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Link Clicked",
          condition_type: "field_equals",
          field: "email_clicked",
          value: "true",
          question: "Did the contact click a link?",
        },
      },
    },
    {
      id: "node_10",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Last Chance Email",
        icon: "Mail",
        color: "red",
        config: {
          action_name: "Last Chance Email",
          template: "last_chance",
          subject: "⏰ Last Chance: Spring Sale Ends Tomorrow",
        },
      },
    },
    {
      id: "node_11",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Last Chance",
        icon: "MessageSquare",
        color: "amber",
        config: {
          action_name: "SMS Last Chance",
          message: "{{contact.first_name}}, spring sale ends tonight! Don't miss your 20% discount. Reply STOP to opt out.",
        },
      },
    },
    // General Promotion Path (non-hot leads)
    {
      id: "node_12",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "General Promotion",
        icon: "Mail",
        color: "amber",
        config: {
          action_name: "General Promotion",
          template: "general_promotion",
          subject: "Spring Sale: Save on Your Next Project",
          track_opens: true,
        },
      },
    },
    {
      id: "node_13",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 5 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 5 Days",
          duration: "5",
          unit: "days",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2", sourceHandle: "branch_0" }, // Hot leads
    { id: "edge_2", source: "node_1", target: "node_12", sourceHandle: "branch_1" }, // Warm/Cold
    { id: "edge_3", source: "node_2", target: "node_3", sourceHandle: "branch_0" }, // VIP customer
    { id: "edge_4", source: "node_3", target: "node_4", sourceHandle: "branch_0" }, // In business hours
    { id: "edge_5", source: "node_4", target: "node_5", sourceHandle: "branch_0" }, // Path A
    { id: "edge_6", source: "node_4", target: "node_6", sourceHandle: "branch_1" }, // Path B
    { id: "edge_7", source: "node_5", target: "node_7" },
    { id: "edge_8", source: "node_6", target: "node_7" },
    { id: "edge_9", source: "node_7", target: "node_8", sourceHandle: "branch_0" }, // Converted
    { id: "edge_10", source: "node_7", target: "node_9", sourceHandle: "branch_1" }, // Timeout
    { id: "edge_11", source: "node_9", target: "node_10", sourceHandle: "branch_0" }, // Clicked
    { id: "edge_12", source: "node_9", target: "node_11", sourceHandle: "branch_1" }, // Not clicked
    { id: "edge_13", source: "node_12", target: "node_13" },
    { id: "edge_14", source: "node_13", target: "node_10" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "25-40% conversion, lead score targeting, A/B optimized",
};

// =============================================================================
// TEMPLATE 04: Referral Request Automation
// =============================================================================
const template_04_referral_automation: WorkflowTemplate = {
  id: "template_04_referral_automation",
  name: "Referral Request Automation",
  description: "Automatically request referrals from clients who leave 4+ star reviews, with thank you sequences and low-rating alerts",
  category: "general",
  triggers: [
    {
      id: "trigger_1",
      actionType: "review_received",
      label: "Review Received",
      icon: "CheckCircle",
      color: "green",
      config: {
        trigger_event: "review_received",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Check Rating",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Rating",
          conditions: [
            { field: "rating", operator: "greater_than_or_equal", value: "4" },
            { field: "rating", operator: "less_than", value: "4" },
          ],
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Thank You Email",
        icon: "Mail",
        color: "green",
        config: {
          action_name: "Thank You Email",
          template: "review_thankyou",
          subject: "Thank you for your amazing review!",
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Request Referral",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Request Referral",
          template: "referral_request",
          subject: "Know anyone who needs our services?",
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "notify_team",
        label: "Alert Manager",
        icon: "AlertCircle",
        color: "red",
        config: {
          action_name: "Alert Manager",
          notification_type: "low_rating_alert",
          recipient_role: "manager",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2", sourceHandle: "branch_0" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_1", target: "node_4", sourceHandle: "branch_1" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "30-40% referral rate",
};

// =============================================================================
// TEMPLATE 05: AI Lead Scoring & Routing
// =============================================================================
const template_05_ai_lead_scoring: WorkflowTemplate = {
  id: "template_05_ai_lead_scoring",
  name: "AI Lead Scoring & Routing",
  description: "19-node instant lead qualification using budget, urgency, and location factors. Routes hot/warm/cold leads to appropriate reps",
  category: "sales",
  triggers: [
    {
      id: "trigger_1",
      actionType: "lead_created",
      label: "New Lead Created",
      icon: "Target",
      color: "blue",
      config: {
        trigger_event: "lead_created",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "calculate_score",
        label: "Calculate Lead Score",
        icon: "TrendingUp",
        color: "purple",
        config: {
          action_name: "Calculate Lead Score",
          scoring_factors: ["budget", "urgency", "location", "project_size"],
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Score Routing",
        icon: "GitBranch",
        color: "blue",
        config: {
          action_name: "Score Routing",
          conditions: [
            { field: "lead_score", operator: "greater_than_or_equal", value: "80" },
            { field: "lead_score", operator: "between", value: "50-79" },
            { field: "lead_score", operator: "less_than", value: "50" },
          ],
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "assign_to_rep",
        label: "Assign to Senior Rep",
        icon: "UserCheck",
        color: "green",
        config: {
          action_name: "Assign to Senior Rep",
          rep_tier: "senior",
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "assign_to_rep",
        label: "Assign to Standard Rep",
        icon: "UserCheck",
        color: "blue",
        config: {
          action_name: "Assign to Standard Rep",
          rep_tier: "standard",
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_to_nurture",
        label: "Add to Nurture Campaign",
        icon: "Mail",
        color: "gray",
        config: {
          action_name: "Add to Nurture Campaign",
          campaign_id: "cold_lead_nurture",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3", sourceHandle: "branch_0" },
    { id: "edge_3", source: "node_2", target: "node_4", sourceHandle: "branch_1" },
    { id: "edge_4", source: "node_2", target: "node_5", sourceHandle: "branch_2" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "90%+ routing accuracy, 50% faster qualification",
};

// =============================================================================
// TEMPLATE 06: Estimate to Project Conversion
// =============================================================================
const template_06_estimate_to_project: WorkflowTemplate = {
  id: "template_06_estimate_to_project",
  name: "Estimate to Project Conversion",
  description: "Automate project setup from estimate approval: contract generation, e-signature, permit processing, PM & crew assignment, kickoff scheduling",
  category: "projects",
  triggers: [
    {
      id: "trigger_1",
      actionType: "estimate_approved",
      label: "Estimate Approved",
      icon: "CheckCircle",
      color: "green",
      config: {
        trigger_event: "estimate_approved",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "create_project",
        label: "Create Project",
        icon: "Plus",
        color: "blue",
        config: {
          action_name: "Create Project",
          project_template: "standard",
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "generate_contract",
        label: "Generate Contract",
        icon: "FileText",
        color: "purple",
        config: {
          action_name: "Generate Contract",
          template: "standard_contract",
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_for_signature",
        label: "Send for E-Signature",
        icon: "Edit",
        color: "blue",
        config: {
          action_name: "Send for E-Signature",
          provider: "docusign",
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "assign_pm",
        label: "Assign Project Manager",
        icon: "UserCheck",
        color: "green",
        config: {
          action_name: "Assign Project Manager",
          assignment_rule: "round_robin",
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "schedule_kickoff",
        label: "Schedule Kickoff Meeting",
        icon: "Calendar",
        color: "amber",
        config: {
          action_name: "Schedule Kickoff Meeting",
          meeting_duration: 60,
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "2x faster kickoff, 98% setup accuracy",
};

// =============================================================================
// TEMPLATE 07: Payment Collection Automation
// =============================================================================
const template_07_payment_collection: WorkflowTemplate = {
  id: "template_07_payment_collection",
  name: "Payment Collection Automation",
  description: "18-node escalating reminder sequence: gentle 3-day reminder → SMS 7-day → firm 10-day → collections alert at 20 days",
  category: "finance",
  triggers: [
    {
      id: "trigger_1",
      actionType: "invoice_overdue",
      label: "Invoice Overdue",
      icon: "AlertCircle",
      color: "red",
      config: {
        trigger_event: "invoice_overdue",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 3 Days",
          duration: "3",
          unit: "days",
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Gentle Reminder",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Gentle Reminder",
          template: "payment_reminder_gentle",
          subject: "Friendly Reminder: Invoice Due",
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 4 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 4 Days",
          duration: "4",
          unit: "days",
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Reminder",
        icon: "MessageSquare",
        color: "amber",
        config: {
          action_name: "SMS Reminder",
          message: "Your invoice is now 7 days overdue. Please submit payment to avoid late fees.",
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 3 Days",
          duration: "3",
          unit: "days",
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Firm Notice",
        icon: "Mail",
        color: "red",
        config: {
          action_name: "Firm Notice",
          template: "payment_firm_notice",
          subject: "URGENT: Payment Required to Avoid Collections",
        },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 10 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 10 Days",
          duration: "10",
          unit: "days",
        },
      },
    },
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "notify_team",
        label: "Alert Collections Team",
        icon: "AlertCircle",
        color: "red",
        config: {
          action_name: "Alert Collections Team",
          notification_type: "collections_required",
          recipient_role: "finance",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5" },
    { id: "edge_5", source: "node_5", target: "node_6" },
    { id: "edge_6", source: "node_6", target: "node_7" },
    { id: "edge_7", source: "node_7", target: "node_8" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "40% faster collection, 60% fewer overdue",
};

// =============================================================================
// TEMPLATE 08: Site Visit Coordination
// =============================================================================
const template_08_site_visit: WorkflowTemplate = {
  id: "template_08_site_visit",
  name: "Site Visit Coordination",
  description: "16-node time-based reminder system: confirmation → 2-day → day-before → day-of reminders, team alerts, post-visit follow-up",
  category: "communication",
  triggers: [
    {
      id: "trigger_1",
      actionType: "appointment_scheduled",
      label: "Site Visit Scheduled",
      icon: "Calendar",
      color: "blue",
      config: {
        trigger_event: "appointment_scheduled",
        appointment_type: "site_visit",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Confirmation Email",
        icon: "Mail",
        color: "green",
        config: {
          action_name: "Confirmation Email",
          template: "site_visit_confirmation",
          subject: "Site Visit Confirmed",
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait_until",
        label: "Wait Until 2 Days Before",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait Until 2 Days Before",
          wait_type: "relative_to_appointment",
          days_before: 2,
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "2-Day Reminder",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "2-Day Reminder",
          template: "site_visit_reminder_2day",
          subject: "Reminder: Site Visit in 2 Days",
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait_until",
        label: "Wait Until Day Before",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait Until Day Before",
          wait_type: "relative_to_appointment",
          days_before: 1,
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Day-Before SMS",
        icon: "MessageSquare",
        color: "amber",
        config: {
          action_name: "Day-Before SMS",
          message: "Hi! Just a reminder about your site visit tomorrow. See you then!",
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "notify_team",
        label: "Alert Team",
        icon: "UserCheck",
        color: "purple",
        config: {
          action_name: "Alert Team",
          notification_type: "upcoming_site_visit",
          recipient_role: "field_worker",
        },
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
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "90%+ attendance, 70% no-show reduction",
};

// =============================================================================
// TEMPLATE 09: Materials & Permit Tracking
// =============================================================================
const template_09_materials_permit_tracking: WorkflowTemplate = {
  id: "template_09_materials_permit_tracking",
  name: "Materials & Permit Tracking",
  description: "20-node parallel processing workflow tracking materials ordering and permit submission with status checks, completion alerts, and delay escalation",
  category: "projects",
  triggers: [
    {
      id: "trigger_1",
      actionType: "project_started",
      label: "Project Started",
      icon: "Play",
      color: "green",
      config: {
        trigger_event: "project_started",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "create_task",
        label: "Create Materials Order Task",
        icon: "Plus",
        color: "blue",
        config: {
          action_name: "Create Materials Order Task",
          task_type: "materials_order",
          assigned_to: "project_manager",
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "create_task",
        label: "Create Permit Task",
        icon: "Plus",
        color: "purple",
        config: {
          action_name: "Create Permit Task",
          task_type: "permit_submission",
          assigned_to: "project_manager",
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 3 Days",
          duration: "3",
          unit: "days",
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Check Materials Status",
        icon: "GitBranch",
        color: "blue",
        config: {
          action_name: "Check Materials Status",
          conditions: [
            { field: "materials_ordered", operator: "equals", value: "true" },
            { field: "materials_ordered", operator: "equals", value: "false" },
          ],
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Check Permit Status",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Permit Status",
          conditions: [
            { field: "permit_submitted", operator: "equals", value: "true" },
            { field: "permit_submitted", operator: "equals", value: "false" },
          ],
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "notify_team",
        label: "Alert: Materials Delayed",
        icon: "AlertCircle",
        color: "red",
        config: {
          action_name: "Alert: Materials Delayed",
          notification_type: "materials_delay",
          recipient_role: "project_manager",
        },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "notify_team",
        label: "Alert: Permit Delayed",
        icon: "AlertCircle",
        color: "red",
        config: {
          action_name: "Alert: Permit Delayed",
          notification_type: "permit_delay",
          recipient_role: "project_manager",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_3" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_3", target: "node_5" },
    { id: "edge_5", source: "node_4", target: "node_6", sourceHandle: "branch_1" },
    { id: "edge_6", source: "node_5", target: "node_7", sourceHandle: "branch_1" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "30% delay reduction, 85%+ on-time starts",
};

// =============================================================================
// TEMPLATE 10: Post-Project Review Request
// =============================================================================
const template_10_post_project_review: WorkflowTemplate = {
  id: "template_10_post_project_review",
  name: "Post-Project Review Request",
  description: "17-node multi-touch review collection with rating checks, thank you messages, referral requests for 4+ stars, and manager alerts for low ratings",
  category: "general",
  triggers: [
    {
      id: "trigger_1",
      actionType: "project_completed",
      label: "Project Completed",
      icon: "CheckCircle",
      color: "green",
      config: {
        trigger_event: "project_completed",
      },
      isConfigured: true,
    },
  ],
  nodes: [
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 1 Day",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 1 Day",
          duration: "1",
          unit: "days",
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Request Review",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Request Review",
          template: "review_request",
          subject: "How did we do? Share your feedback",
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 3 Days",
          duration: "3",
          unit: "days",
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Check If Reviewed",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check If Reviewed",
          conditions: [
            { field: "review_submitted", operator: "equals", value: "true" },
            { field: "review_submitted", operator: "equals", value: "false" },
          ],
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Check Rating",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Rating",
          conditions: [
            { field: "rating", operator: "greater_than_or_equal", value: "4" },
            { field: "rating", operator: "less_than", value: "4" },
          ],
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Thank You + Referral Request",
        icon: "Mail",
        color: "green",
        config: {
          action_name: "Thank You + Referral Request",
          template: "thankyou_referral",
          subject: "Thank you! Know anyone else we can help?",
        },
      },
    },
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "notify_team",
        label: "Alert Manager",
        icon: "AlertCircle",
        color: "red",
        config: {
          action_name: "Alert Manager",
          notification_type: "low_rating_alert",
          recipient_role: "manager",
        },
      },
    },
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Follow-up",
        icon: "MessageSquare",
        color: "blue",
        config: {
          action_name: "SMS Follow-up",
          message: "Would love to hear your feedback on your recent project. Mind leaving a quick review?",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5", sourceHandle: "branch_0" },
    { id: "edge_5", source: "node_5", target: "node_6", sourceHandle: "branch_0" },
    { id: "edge_6", source: "node_5", target: "node_7", sourceHandle: "branch_1" },
    { id: "edge_7", source: "node_4", target: "node_8", sourceHandle: "branch_1" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "60-75% review rate, 4.5+ avg rating",
};

// =============================================================================
// TEMPLATE REGISTRY
// =============================================================================
const ALL_TEMPLATES: WorkflowTemplate[] = [
  template_01_new_lead_nurture,
  template_02_email_engagement,
  template_03_seasonal_promotion,
  template_04_referral_automation,
  template_05_ai_lead_scoring,
  template_06_estimate_to_project,
  template_07_payment_collection,
  template_08_site_visit,
  template_09_materials_permit_tracking,
  template_10_post_project_review,
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a template by ID
 */
export function getTemplateById(templateId: string): WorkflowTemplate | undefined {
  return ALL_TEMPLATES.find((t) => t.id === templateId);
}

/**
 * Get all template IDs
 */
export function getAllTemplateIds(): string[] {
  return ALL_TEMPLATES.map((t) => t.id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: WorkflowTemplate["category"]
): WorkflowTemplate[] {
  return ALL_TEMPLATES.filter((t) => t.category === category);
}

/**
 * Check if a template exists
 */
export function templateExists(templateId: string): boolean {
  return ALL_TEMPLATES.some((t) => t.id === templateId);
}