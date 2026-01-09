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

// Helper function to create standard yes/no branches
function createYesNoBranches(field: string, yesLabel = "Yes", noLabel = "No") {
  return [
    {
      id: "branch_0",
      name: yesLabel,
      segments: [{ field, operator: "equals", value: "true" }],
    },
    {
      id: "branch_1",
      name: noLabel,
      segments: [{ field, operator: "equals", value: "false" }],
    },
  ];
}

// Helper for lead score tier branches
function createLeadScoreTierBranches() {
  return [
    {
      id: "branch_0",
      name: "Hot (80+)",
      segments: [{ field: "lead_score_tier", operator: "equals", value: "hot" }],
    },
    {
      id: "branch_1",
      name: "Warm/Cold",
      segments: [{ field: "lead_score_tier", operator: "not_equals", value: "hot" }],
    },
  ];
}

// Helper for A/B split branches
function createABSplitBranches(pathALabel: string, pathBLabel: string) {
  return [
    {
      id: "branch_0",
      name: pathALabel,
      segments: [{ field: "split_path", operator: "equals", value: "a" }],
    },
    {
      id: "branch_1",
      name: pathBLabel,
      segments: [{ field: "split_path", operator: "equals", value: "b" }],
    },
  ];
}

// Helper for business hours branches
function createBusinessHoursBranches() {
  return [
    {
      id: "branch_0",
      name: "In Hours",
      segments: [{ field: "is_business_hours", operator: "equals", value: "true" }],
    },
    {
      id: "branch_1",
      name: "Out of Hours",
      segments: [{ field: "is_business_hours", operator: "equals", value: "false" }],
    },
  ];
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
        builderType: "condition",
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
          branches: createLeadScoreTierBranches(),
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
        builderType: "condition",
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
          branches: createBusinessHoursBranches(),
        },
      },
    },
    // A/B Split for Subject Lines
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "condition",
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
          branches: createABSplitBranches("Direct Approach", "Personal Touch"),
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
    // Email engagement check after welcome email
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 2 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait for Email Engagement",
          duration: "2",
          unit: "days",
        },
      },
    },
    // Email Engagement Check
    {
      id: "node_10",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Check Email Opened",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Email Engagement",
          condition_type: "field_equals",
          field: "email_opened",
          value: "true",
          question: "Did the contact open the email?",
          branches: [
            {
              id: "branch_0",
              name: "Opened",
              segments: [{ field: "email_opened", operator: "equals", value: "true" }],
            },
            {
              id: "branch_1",
              name: "Not Opened",
              segments: [{ field: "email_opened", operator: "equals", value: "false" }],
            },
          ],
        },
      },
    },
    // SMS for non-openers
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
    // Check link clicked for openers
    {
      id: "node_12",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Check Link Clicked",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Link Clicked",
          condition_type: "field_equals",
          field: "email_clicked",
          value: "true",
          question: "Did the contact click a link?",
          branches: [
            {
              id: "branch_0",
              name: "Clicked",
              segments: [{ field: "email_clicked", operator: "equals", value: "true" }],
            },
            {
              id: "branch_1",
              name: "Not Clicked",
              segments: [{ field: "email_clicked", operator: "equals", value: "false" }],
            },
          ],
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
        actionType: "send_email",
        label: "Nurture Email",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Nurture Email",
          template: "lead_nurture",
          subject: "Hi {{contact.first_name}}, let's stay in touch",
          track_opens: true,
          track_clicks: true,
        },
      },
    },
    // Contact Reply Check after nurture email
    {
      id: "node_16",
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
      id: "node_17",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Contact Replied?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Contact Reply",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    // Move to hot lead path if replied
    {
      id: "node_18",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "go_to",
        label: "Go To Hot Lead Path",
        icon: "ExternalLink",
        color: "amber",
        config: {
          action_name: "Route to Hot Lead Path",
          target_node: "node_3",
        },
      },
    },
    // Add to long-term nurture if no reply
    {
      id: "node_19",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag for Long-term Nurture",
        icon: "Tag",
        color: "gray",
        config: {
          action_name: "Tag for Long-term Nurture",
          tag: "long_term_nurture",
        },
      },
    },
    // SMS Reply Check
    {
      id: "node_20",
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
      id: "node_21",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "SMS Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check SMS Reply",
          condition_type: "field_equals",
          field: "sms_replied",
          value: "true",
          question: "Did the contact reply to SMS?",
          branches: createYesNoBranches("sms_replied"),
        },
      },
    },
    // High-intent follow-up reply check
    {
      id: "node_22",
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
    {
      id: "node_23",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Contact Replied?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Reply After High-Intent",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply?",
          branches: createYesNoBranches("contact_replied"),
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
    { id: "edge_11", source: "node_9", target: "node_10" },
    { id: "edge_12", source: "node_10", target: "node_12", sourceHandle: "branch_0" }, // Opened
    { id: "edge_13", source: "node_10", target: "node_11", sourceHandle: "branch_1" }, // Not opened
    { id: "edge_14", source: "node_12", target: "node_13", sourceHandle: "branch_0" }, // Clicked
    { id: "edge_15", source: "node_12", target: "node_19", sourceHandle: "branch_1" }, // Not clicked -> long-term nurture
    { id: "edge_16", source: "node_13", target: "node_22" }, // High-intent follow-up -> wait
    { id: "edge_17", source: "node_22", target: "node_23" }, // Wait -> check reply
    { id: "edge_18", source: "node_23", target: "node_14", sourceHandle: "branch_0" }, // Replied -> track conversion
    { id: "edge_19", source: "node_23", target: "node_19", sourceHandle: "branch_1" }, // No reply -> long-term nurture
    { id: "edge_20", source: "node_11", target: "node_20" }, // SMS -> wait
    { id: "edge_21", source: "node_20", target: "node_21" }, // Wait -> check SMS reply
    { id: "edge_22", source: "node_21", target: "node_14", sourceHandle: "branch_0" }, // SMS replied -> track conversion
    { id: "edge_23", source: "node_21", target: "node_19", sourceHandle: "branch_1" }, // No SMS reply -> long-term nurture
    { id: "edge_24", source: "node_15", target: "node_16" }, // Nurture email -> wait
    { id: "edge_25", source: "node_16", target: "node_17" }, // Wait -> check reply
    { id: "edge_26", source: "node_17", target: "node_18", sourceHandle: "branch_0" }, // Replied -> go to hot path
    { id: "edge_27", source: "node_17", target: "node_19", sourceHandle: "branch_1" }, // No reply -> long-term nurture
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
        builderType: "condition",
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
          branches: [
            {
              id: "branch_0",
              name: "Is Monday",
              segments: [{ field: "day_of_week", operator: "equals", value: "monday" }],
            },
            {
              id: "branch_1",
              name: "Not Monday",
              segments: [{ field: "day_of_week", operator: "not_equals", value: "monday" }],
            },
          ],
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
          mode: "day_of_week",
          day: "monday",
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
        builderType: "condition",
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
          branches: createABSplitBranches("Morning (10am)", "Afternoon (2pm)"),
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
    // Wait and check engagement
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 3 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait for Email Engagement",
          duration: "3",
          unit: "days",
        },
      },
    },
    // Engagement Check for Openers
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Check Email Opened",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check If Opened",
          condition_type: "field_equals",
          field: "email_opened",
          value: "true",
          question: "Did the contact open the email?",
          branches: [
            {
              id: "branch_0",
              name: "Opened",
              segments: [{ field: "email_opened", operator: "equals", value: "true" }],
            },
            {
              id: "branch_1",
              name: "Not Opened",
              segments: [{ field: "email_opened", operator: "equals", value: "false" }],
            },
          ],
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
    // Contact Reply Check after follow-up email
    {
      id: "node_13",
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
    {
      id: "node_14",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Contact Replied?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Reply After Follow-up",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    // SMS Reply Check
    {
      id: "node_15",
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
      id: "node_16",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "SMS Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check SMS Reply",
          condition_type: "field_equals",
          field: "sms_replied",
          value: "true",
          question: "Did the contact reply to SMS?",
          branches: createYesNoBranches("sms_replied"),
        },
      },
    },
    // Mark as unresponsive
    {
      id: "node_17",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Unresponsive",
        icon: "Tag",
        color: "gray",
        config: {
          action_name: "Tag as Unresponsive",
          tag: "unresponsive",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_3", sourceHandle: "branch_0" }, // Is Monday
    { id: "edge_2", source: "node_1", target: "node_2", sourceHandle: "branch_1" }, // Not Monday
    { id: "edge_3", source: "node_2", target: "node_3" }, // Wait Until Monday -> A/B Split
    { id: "edge_4", source: "node_3", target: "node_4", sourceHandle: "branch_0" }, // Morning
    { id: "edge_5", source: "node_3", target: "node_5", sourceHandle: "branch_1" }, // Afternoon
    { id: "edge_6", source: "node_4", target: "node_6" },
    { id: "edge_7", source: "node_5", target: "node_6" },
    { id: "edge_8", source: "node_6", target: "node_7" },
    { id: "edge_9", source: "node_7", target: "node_8" },
    { id: "edge_10", source: "node_8", target: "node_9", sourceHandle: "branch_0" }, // Opened
    { id: "edge_11", source: "node_8", target: "node_10", sourceHandle: "branch_1" }, // Not opened
    { id: "edge_12", source: "node_9", target: "node_13" }, // Follow-up -> wait
    { id: "edge_13", source: "node_13", target: "node_14" }, // Wait -> check reply
    { id: "edge_14", source: "node_14", target: "node_11", sourceHandle: "branch_0" }, // Replied -> track re-engagement
    { id: "edge_15", source: "node_14", target: "node_17", sourceHandle: "branch_1" }, // No reply -> unresponsive
    { id: "edge_16", source: "node_10", target: "node_15" }, // SMS -> wait
    { id: "edge_17", source: "node_15", target: "node_16" }, // Wait -> check SMS reply
    { id: "edge_18", source: "node_16", target: "node_11", sourceHandle: "branch_0" }, // SMS replied -> track re-engagement
    { id: "edge_19", source: "node_16", target: "node_17", sourceHandle: "branch_1" }, // No SMS reply -> unresponsive
    { id: "edge_20", source: "node_11", target: "node_12" }, // Track -> remove tag
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
        builderType: "condition",
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
          branches: createLeadScoreTierBranches(),
        },
      },
    },
    // Hot Leads - VIP Treatment
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "VIP Early Access Email",
        icon: "Mail",
        color: "purple",
        config: {
          action_name: "VIP Email",
          template: "vip_early_access",
          subject: "🌟 {{contact.first_name}}, your exclusive VIP invitation",
          track_opens: true,
          track_clicks: true,
        },
      },
    },
    // Wait and check VIP response
    {
      id: "node_3",
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
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "VIP Email Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check VIP Reply",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the VIP contact reply?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    {
      id: "node_5",
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
    // VIP no reply - last chance
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "VIP Last Chance Email",
        icon: "Mail",
        color: "red",
        config: {
          action_name: "VIP Last Chance Email",
          template: "vip_last_chance",
          subject: "⏰ {{contact.first_name}}, VIP offer expires tonight!",
        },
      },
    },
    {
      id: "node_7",
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
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Last Chance Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Last Chance Reply",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply to last chance?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    // Mark as promotion unresponsive
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Promotion Unresponsive",
        icon: "Tag",
        color: "gray",
        config: {
          action_name: "Tag as Promotion Unresponsive",
          tag: "promotion_unresponsive",
        },
      },
    },
    // General Promotion Path (non-hot leads)
    {
      id: "node_10",
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
      id: "node_11",
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
    // Contact Reply Check after general promotion
    {
      id: "node_12",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Contact Replied?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Reply After Promotion",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    // General promotion no reply - SMS last chance
    {
      id: "node_13",
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
    {
      id: "node_14",
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
    // SMS Reply Check
    {
      id: "node_15",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "SMS Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check SMS Reply",
          condition_type: "field_equals",
          field: "sms_replied",
          value: "true",
          question: "Did the contact reply to SMS?",
          branches: createYesNoBranches("sms_replied"),
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2", sourceHandle: "branch_0" }, // Hot leads
    { id: "edge_2", source: "node_1", target: "node_10", sourceHandle: "branch_1" }, // Warm/Cold
    { id: "edge_3", source: "node_2", target: "node_3" },
    { id: "edge_4", source: "node_3", target: "node_4" },
    { id: "edge_5", source: "node_4", target: "node_5", sourceHandle: "branch_0" }, // Replied -> track conversion
    { id: "edge_6", source: "node_4", target: "node_6", sourceHandle: "branch_1" }, // No reply -> last chance
    { id: "edge_7", source: "node_6", target: "node_7" },
    { id: "edge_8", source: "node_7", target: "node_8" },
    { id: "edge_9", source: "node_8", target: "node_5", sourceHandle: "branch_0" }, // Replied -> track conversion
    { id: "edge_10", source: "node_8", target: "node_9", sourceHandle: "branch_1" }, // No reply -> unresponsive
    { id: "edge_11", source: "node_10", target: "node_11" },
    { id: "edge_12", source: "node_11", target: "node_12" },
    { id: "edge_13", source: "node_12", target: "node_5", sourceHandle: "branch_0" }, // Replied -> track conversion
    { id: "edge_14", source: "node_12", target: "node_13", sourceHandle: "branch_1" }, // No reply -> SMS
    { id: "edge_15", source: "node_13", target: "node_14" },
    { id: "edge_16", source: "node_14", target: "node_15" },
    { id: "edge_17", source: "node_15", target: "node_5", sourceHandle: "branch_0" }, // SMS replied -> track conversion
    { id: "edge_18", source: "node_15", target: "node_9", sourceHandle: "branch_1" }, // No SMS reply -> unresponsive
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
        builderType: "condition",
        actionType: "if_else",
        label: "Check Rating",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Rating",
          condition_type: "field_equals",
          field: "rating",
          value: "4",
          question: "Is the rating 4 or higher?",
          branches: [
            {
              id: "branch_0",
              name: "4+ Stars",
              segments: [{ field: "rating", operator: "greater_than_or_equal", value: "4" }],
            },
            {
              id: "branch_1",
              name: "< 4 Stars",
              segments: [{ field: "rating", operator: "less_than", value: "4" }],
            },
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
      id: "node_4",
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
    // Contact Reply Check after referral request
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
        builderType: "condition",
        actionType: "if_else",
        label: "Contact Replied?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Referral Reply",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply with referral?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    // Track referral success
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Referrer",
        icon: "Tag",
        color: "green",
        config: {
          action_name: "Tag as Referrer",
          tag: "active_referrer",
        },
      },
    },
    // Reminder for non-responders
    {
      id: "node_8",
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
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Referral Reminder",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Referral Reminder",
          template: "referral_reminder",
          subject: "Still thinking about who to refer?",
        },
      },
    },
    {
      id: "node_10",
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
    // Final reply check
    {
      id: "node_11",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Contact Replied?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Final Referral Reply",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    // Mark as no referral
    {
      id: "node_12",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as No Referral",
        icon: "Tag",
        color: "gray",
        config: {
          action_name: "Tag as No Referral",
          tag: "no_referral_response",
        },
      },
    },
    // Alert Manager for low rating
    {
      id: "node_13",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Manager",
        icon: "Bell",
        color: "red",
        config: {
          action_name: "Alert Manager",
          notification_type: "low_rating_alert",
          channel: "email",
        },
      },
    },
    // Follow up on low rating
    {
      id: "node_14",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Create Follow-up Task",
        icon: "ClipboardList",
        color: "amber",
        config: {
          action_name: "Follow-up Task",
          title: "Follow up with {{contact.first_name}} about low rating",
          priority: "high",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2", sourceHandle: "branch_0" }, // High rating
    { id: "edge_2", source: "node_1", target: "node_13", sourceHandle: "branch_1" }, // Low rating
    { id: "edge_3", source: "node_2", target: "node_3" },
    { id: "edge_4", source: "node_3", target: "node_4" },
    { id: "edge_5", source: "node_4", target: "node_5" },
    { id: "edge_6", source: "node_5", target: "node_6" },
    { id: "edge_7", source: "node_6", target: "node_7", sourceHandle: "branch_0" }, // Replied -> tag as referrer
    { id: "edge_8", source: "node_6", target: "node_8", sourceHandle: "branch_1" }, // No reply -> wait
    { id: "edge_9", source: "node_8", target: "node_9" }, // Wait -> reminder
    { id: "edge_10", source: "node_9", target: "node_10" }, // Reminder -> wait
    { id: "edge_11", source: "node_10", target: "node_11" }, // Wait -> check reply
    { id: "edge_12", source: "node_11", target: "node_7", sourceHandle: "branch_0" }, // Replied -> tag as referrer
    { id: "edge_13", source: "node_11", target: "node_12", sourceHandle: "branch_1" }, // No reply -> no referral tag
    { id: "edge_14", source: "node_13", target: "node_14" }, // Alert manager -> follow-up task
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "30-40% referral rate",
};

// =============================================================================
// TEMPLATE 05: Payment Collection Sequence
// =============================================================================
const template_05_payment_collection: WorkflowTemplate = {
  id: "template_05_payment_collection",
  name: "Payment Collection Sequence",
  description: "Automated payment reminder sequence with escalating urgency and collections alerts",
  category: "finance",
  triggers: [
    {
      id: "trigger_1",
      actionType: "invoice_overdue",
      label: "Invoice Overdue",
      icon: "Receipt",
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
    // Check reply after gentle reminder
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Contact Replied?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Reply After Gentle",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    // Assign account manager for responses
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "assign_user",
        label: "Assign Account Manager",
        icon: "UserCheck",
        color: "blue",
        config: {
          action_name: "Assign Account Manager",
          user_id: "round_robin",
        },
      },
    },
    {
      id: "node_6",
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
      id: "node_7",
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
      id: "node_8",
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
    // Check SMS reply
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "SMS Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check SMS Reply",
          condition_type: "field_equals",
          field: "sms_replied",
          value: "true",
          question: "Did the contact reply to SMS?",
          branches: createYesNoBranches("sms_replied"),
        },
      },
    },
    {
      id: "node_10",
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
      id: "node_11",
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
      id: "node_12",
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
    // Check reply after firm notice
    {
      id: "node_13",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Contact Replied?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Reply After Firm",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply to firm notice?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    {
      id: "node_14",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 7 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 7 Days",
          duration: "7",
          unit: "days",
        },
      },
    },
    // Check if payment received before collections
    {
      id: "node_15",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Payment Received?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Payment Status",
          condition_type: "field_equals",
          field: "payment_received",
          value: "true",
          question: "Has payment been received?",
          branches: [
            {
              id: "branch_0",
              name: "Paid",
              segments: [{ field: "payment_received", operator: "equals", value: "true" }],
            },
            {
              id: "branch_1",
              name: "Unpaid",
              segments: [{ field: "payment_received", operator: "equals", value: "false" }],
            },
          ],
        },
      },
    },
    // Payment confirmation
    {
      id: "node_16",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Payment Confirmation",
        icon: "Mail",
        color: "green",
        config: {
          action_name: "Payment Confirmation",
          template: "payment_received",
          subject: "Thank you for your payment!",
        },
      },
    },
    // Alert collections
    {
      id: "node_17",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Collections Team",
        icon: "Bell",
        color: "red",
        config: {
          action_name: "Alert Collections Team",
          notification_type: "collections_required",
          channel: "email",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" }, // Wait -> check reply
    { id: "edge_4", source: "node_4", target: "node_5", sourceHandle: "branch_0" }, // Replied -> assign manager
    { id: "edge_5", source: "node_4", target: "node_6", sourceHandle: "branch_1" }, // No reply -> wait
    { id: "edge_6", source: "node_6", target: "node_7" },
    { id: "edge_7", source: "node_7", target: "node_8" },
    { id: "edge_8", source: "node_8", target: "node_9" }, // Wait -> check SMS reply
    { id: "edge_9", source: "node_9", target: "node_5", sourceHandle: "branch_0" }, // SMS replied -> assign manager
    { id: "edge_10", source: "node_9", target: "node_10", sourceHandle: "branch_1" }, // No SMS reply -> wait
    { id: "edge_11", source: "node_10", target: "node_11" },
    { id: "edge_12", source: "node_11", target: "node_12" },
    { id: "edge_13", source: "node_12", target: "node_13" }, // Wait -> check reply
    { id: "edge_14", source: "node_13", target: "node_5", sourceHandle: "branch_0" }, // Replied -> assign manager
    { id: "edge_15", source: "node_13", target: "node_14", sourceHandle: "branch_1" }, // No reply -> wait
    { id: "edge_16", source: "node_14", target: "node_15" }, // Wait -> check payment
    { id: "edge_17", source: "node_15", target: "node_16", sourceHandle: "branch_0" }, // Payment received -> confirmation
    { id: "edge_18", source: "node_15", target: "node_17", sourceHandle: "branch_1" }, // No payment -> collections
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "40% faster collection, 60% fewer overdue",
};

// =============================================================================
// TEMPLATE 06: Site Visit Coordination
// =============================================================================
const template_06_site_visit: WorkflowTemplate = {
  id: "template_06_site_visit",
  name: "Site Visit Coordination",
  description: "Time-based reminder system with confirmation checks, call fallbacks, and team alerts",
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
    // Check for confirmation reply
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Confirmation Received?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Confirmation",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact confirm attendance?",
          branches: [
            {
              id: "branch_0",
              name: "Confirmed",
              segments: [{ field: "contact_replied", operator: "equals", value: "true" }],
            },
            {
              id: "branch_1",
              name: "No Response",
              segments: [{ field: "contact_replied", operator: "equals", value: "false" }],
            },
          ],
        },
      },
    },
    // Tag as confirmed
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Confirmed",
        icon: "Tag",
        color: "green",
        config: {
          action_name: "Tag as Confirmed",
          tag: "visit_confirmed",
        },
      },
    },
    // Alert team
    {
      id: "node_7",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Team",
        icon: "Bell",
        color: "purple",
        config: {
          action_name: "Alert Team",
          notification_type: "upcoming_site_visit",
          channel: "in_app",
        },
      },
    },
    // SMS for unconfirmed
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "Day-Before SMS",
        icon: "MessageSquare",
        color: "amber",
        config: {
          action_name: "Day-Before SMS",
          message: "Hi! Just a reminder about your site visit tomorrow. Please reply YES to confirm.",
        },
      },
    },
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 4 Hours",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 4 Hours",
          duration: "4",
          unit: "hours",
        },
      },
    },
    // SMS reply check
    {
      id: "node_10",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "SMS Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check SMS Reply",
          condition_type: "field_equals",
          field: "sms_replied",
          value: "true",
          question: "Did the contact reply to SMS?",
          branches: createYesNoBranches("sms_replied"),
        },
      },
    },
    // Call for unconfirmed
    {
      id: "node_11",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Call to Confirm",
        icon: "Phone",
        color: "amber",
        config: {
          action_name: "Call to Confirm Visit",
          title: "Call to confirm site visit for {{contact.first_name}}",
          priority: "high",
        },
      },
    },
    {
      id: "node_12",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 2 Hours",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 2 Hours",
          duration: "2",
          unit: "hours",
        },
      },
    },
    // Check call outcome
    {
      id: "node_13",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Call Answered?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Call Outcome",
          condition_type: "field_equals",
          field: "call_answered",
          value: "true",
          question: "Was the call answered?",
          branches: [
            {
              id: "branch_0",
              name: "Answered",
              segments: [{ field: "call_answered", operator: "equals", value: "true" }],
            },
            {
              id: "branch_1",
              name: "No Answer",
              segments: [{ field: "call_answered", operator: "equals", value: "false" }],
            },
          ],
        },
      },
    },
    // Mark as at risk
    {
      id: "node_14",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as At Risk",
        icon: "Tag",
        color: "red",
        config: {
          action_name: "Tag as At Risk No-Show",
          tag: "visit_at_risk",
        },
      },
    },
    // Alert team about at-risk
    {
      id: "node_15",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Team - At Risk",
        icon: "Bell",
        color: "red",
        config: {
          action_name: "Alert Team - At Risk",
          notification_type: "at_risk_visit",
          channel: "in_app",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5" }, // Wait -> check confirmation
    { id: "edge_5", source: "node_5", target: "node_6", sourceHandle: "branch_0" }, // Confirmed -> tag
    { id: "edge_6", source: "node_5", target: "node_8", sourceHandle: "branch_1" }, // Not confirmed -> SMS
    { id: "edge_7", source: "node_6", target: "node_7" }, // Tag -> alert team
    { id: "edge_8", source: "node_8", target: "node_9" }, // SMS -> wait
    { id: "edge_9", source: "node_9", target: "node_10" }, // Wait -> check SMS reply
    { id: "edge_10", source: "node_10", target: "node_6", sourceHandle: "branch_0" }, // SMS replied -> confirmed
    { id: "edge_11", source: "node_10", target: "node_11", sourceHandle: "branch_1" }, // No SMS reply -> call
    { id: "edge_12", source: "node_11", target: "node_12" }, // Call -> wait
    { id: "edge_13", source: "node_12", target: "node_13" }, // Wait -> check call
    { id: "edge_14", source: "node_13", target: "node_6", sourceHandle: "branch_0" }, // Answered -> confirmed
    { id: "edge_15", source: "node_13", target: "node_14", sourceHandle: "branch_1" }, // Not answered -> at risk
    { id: "edge_16", source: "node_14", target: "node_15" }, // At risk tag -> alert team
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "90%+ attendance, 70% no-show reduction",
};

// =============================================================================
// TEMPLATE 07: Post-Project Review Request
// =============================================================================
const template_07_post_project_review: WorkflowTemplate = {
  id: "template_07_post_project_review",
  name: "Post-Project Review Request",
  description: "Multi-touch review collection with rating checks, thank you messages, referral requests, and manager alerts",
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
    // Check if reviewed
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Check If Reviewed",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check If Reviewed",
          condition_type: "field_equals",
          field: "review_submitted",
          value: "true",
          question: "Has the contact submitted a review?",
          branches: [
            {
              id: "branch_0",
              name: "Reviewed",
              segments: [{ field: "review_submitted", operator: "equals", value: "true" }],
            },
            {
              id: "branch_1",
              name: "Not Reviewed",
              segments: [{ field: "review_submitted", operator: "equals", value: "false" }],
            },
          ],
        },
      },
    },
    // Check rating
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Check Rating",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Rating",
          condition_type: "field_equals",
          field: "rating",
          value: "4",
          question: "Is the rating 4 or higher?",
          branches: [
            {
              id: "branch_0",
              name: "4+ Stars",
              segments: [{ field: "rating", operator: "greater_than_or_equal", value: "4" }],
            },
            {
              id: "branch_1",
              name: "< 4 Stars",
              segments: [{ field: "rating", operator: "less_than", value: "4" }],
            },
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
    // Check reply after thank you + referral
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "Referral Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check Referral Reply",
          condition_type: "field_equals",
          field: "contact_replied",
          value: "true",
          question: "Did the contact reply with referral?",
          branches: createYesNoBranches("contact_replied"),
        },
      },
    },
    // Tag as referrer
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Referrer",
        icon: "Tag",
        color: "green",
        config: {
          action_name: "Tag as Referrer",
          tag: "active_referrer",
        },
      },
    },
    // Tag as reviewer only
    {
      id: "node_10",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as Reviewer",
        icon: "Tag",
        color: "blue",
        config: {
          action_name: "Tag as Reviewer",
          tag: "left_review",
        },
      },
    },
    // Alert Manager for low rating
    {
      id: "node_11",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "internal_notification",
        label: "Alert Manager",
        icon: "Bell",
        color: "red",
        config: {
          action_name: "Alert Manager",
          notification_type: "low_rating_alert",
          channel: "email",
        },
      },
    },
    // Follow up on low rating
    {
      id: "node_12",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_task",
        label: "Create Follow-up Task",
        icon: "ClipboardList",
        color: "amber",
        config: {
          action_name: "Follow-up Task",
          title: "Follow up with {{contact.first_name}} about low rating",
          priority: "high",
        },
      },
    },
    // SMS Follow-up for non-reviewers
    {
      id: "node_13",
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
    {
      id: "node_14",
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
    // Check SMS reply
    {
      id: "node_15",
      type: "workflowNode",
      data: {
        builderType: "condition",
        actionType: "if_else",
        label: "SMS Reply?",
        icon: "GitBranch",
        color: "amber",
        config: {
          action_name: "Check SMS Reply",
          condition_type: "field_equals",
          field: "sms_replied",
          value: "true",
          question: "Did the contact reply to SMS?",
          branches: createYesNoBranches("sms_replied"),
        },
      },
    },
    // Go to review check if SMS replied
    {
      id: "node_16",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "go_to",
        label: "Go To Review Check",
        icon: "ExternalLink",
        color: "amber",
        config: {
          action_name: "Route to Review Check",
          target_node: "node_4",
        },
      },
    },
    // Tag as no response
    {
      id: "node_17",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "add_tag",
        label: "Tag as No Review",
        icon: "Tag",
        color: "gray",
        config: {
          action_name: "Tag as No Review",
          tag: "no_review_response",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
    { id: "edge_3", source: "node_3", target: "node_4" },
    { id: "edge_4", source: "node_4", target: "node_5", sourceHandle: "branch_0" }, // Reviewed
    { id: "edge_5", source: "node_4", target: "node_13", sourceHandle: "branch_1" }, // Not reviewed -> SMS
    { id: "edge_6", source: "node_5", target: "node_6", sourceHandle: "branch_0" }, // High rating -> thank you
    { id: "edge_7", source: "node_5", target: "node_11", sourceHandle: "branch_1" }, // Low rating -> alert
    { id: "edge_8", source: "node_6", target: "node_7" },
    { id: "edge_9", source: "node_7", target: "node_8" },
    { id: "edge_10", source: "node_8", target: "node_9", sourceHandle: "branch_0" }, // Replied -> tag as referrer
    { id: "edge_11", source: "node_8", target: "node_10", sourceHandle: "branch_1" }, // No reply -> tag as reviewer only
    { id: "edge_12", source: "node_11", target: "node_12" }, // Alert -> create task
    { id: "edge_13", source: "node_13", target: "node_14" }, // SMS -> wait
    { id: "edge_14", source: "node_14", target: "node_15" }, // Wait -> check SMS reply
    { id: "edge_15", source: "node_15", target: "node_16", sourceHandle: "branch_0" }, // SMS replied -> go to review check
    { id: "edge_16", source: "node_15", target: "node_17", sourceHandle: "branch_1" }, // No SMS reply -> no review tag
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
  template_05_payment_collection,
  template_06_site_visit,
  template_07_post_project_review,
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

/**
 * Get all templates
 */
export function getAllTemplates(): WorkflowTemplate[] {
  return ALL_TEMPLATES;
}
