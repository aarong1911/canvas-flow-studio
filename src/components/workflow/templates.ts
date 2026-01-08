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
  description: "15-node automated follow-up sequence with personalized emails based on lead source (website/referral), engagement tracking, and smart routing",
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
          tag_name: "new_lead",
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Check Lead Source",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Lead Source",
          conditions: [
            { field: "lead_source", operator: "equals", value: "website" },
            { field: "lead_source", operator: "equals", value: "referral" },
          ],
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Website Welcome Email",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Website Welcome Email",
          template: "website_welcome",
          subject: "Welcome! Let's discuss your project",
          delay_minutes: 0,
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Referral Welcome Email",
        icon: "Mail",
        color: "green",
        config: {
          action_name: "Referral Welcome Email",
          template: "referral_welcome",
          subject: "Thanks for the referral introduction",
          delay_minutes: 0,
        },
      },
    },
    {
      id: "node_5",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 2 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 2 Days",
          wait_duration: 2880,
        },
      },
    },
    {
      id: "node_6",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Follow-up Email",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Follow-up Email",
          template: "followup_2day",
          subject: "Quick follow-up on your project",
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
          wait_duration: 4320,
        },
      },
    },
    {
      id: "node_8",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Check Engagement",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Engagement",
          conditions: [
            { field: "email_opened", operator: "equals", value: "true" },
            { field: "email_opened", operator: "equals", value: "false" },
          ],
        },
      },
    },
    {
      id: "node_9",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Outreach",
        icon: "MessageSquare",
        color: "green",
        config: {
          action_name: "SMS Outreach",
          message: "Hi! Just checking if you got my email about your project. Happy to answer any questions!",
        },
      },
    },
    {
      id: "node_10",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_email",
        label: "Case Study Email",
        icon: "Mail",
        color: "blue",
        config: {
          action_name: "Case Study Email",
          template: "case_study",
          subject: "See how we helped clients like you",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3", sourceHandle: "branch_0" },
    { id: "edge_3", source: "node_2", target: "node_4", sourceHandle: "branch_1" },
    { id: "edge_4", source: "node_3", target: "node_5" },
    { id: "edge_5", source: "node_4", target: "node_5" },
    { id: "edge_6", source: "node_5", target: "node_6" },
    { id: "edge_7", source: "node_6", target: "node_7" },
    { id: "edge_8", source: "node_7", target: "node_8" },
    { id: "edge_9", source: "node_8", target: "node_9", sourceHandle: "branch_1" },
    { id: "edge_10", source: "node_8", target: "node_10", sourceHandle: "branch_0" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "40-60% conversion, 7-day timeline",
};

// =============================================================================
// TEMPLATE 02: Email Engagement Re-activation
// =============================================================================
const template_02_email_engagement: WorkflowTemplate = {
  id: "template_02_email_engagement",
  name: "Email Engagement Re-activation",
  description: "Re-engage cold leads with targeted email campaigns, behavioral scoring, and SMS follow-up. Converts inactive leads into opportunities",
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
    {
      id: "node_1",
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
        },
      },
    },
    {
      id: "node_2",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 5 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 5 Days",
          wait_duration: 7200,
        },
      },
    },
    {
      id: "node_3",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "send_sms",
        label: "SMS Check-in",
        icon: "MessageSquare",
        color: "green",
        config: {
          action_name: "SMS Check-in",
          message: "Haven't heard from you in a while. Still interested in your project? Let's chat!",
        },
      },
    },
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2" },
    { id: "edge_2", source: "node_2", target: "node_3" },
  ],
  settings: {
    allowReEntry: true,
    timezone: "America/New_York",
  },
  expectedResults: "25-35% re-engagement rate",
};

// =============================================================================
// TEMPLATE 03: Seasonal Promotion Campaign
// =============================================================================
const template_03_seasonal_promotion: WorkflowTemplate = {
  id: "template_03_seasonal_promotion",
  name: "Seasonal Promotion Campaign",
  description: "Recurring yearly campaign (March 1) with VIP vs general client segmentation, multi-touch email sequence, and last-chance offers",
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
    {
      id: "node_1",
      type: "workflowNode",
      data: {
        builderType: "branch",
        actionType: "branch_condition",
        label: "Check Client Type",
        icon: "GitBranch",
        color: "purple",
        config: {
          action_name: "Check Client Type",
          conditions: [
            { field: "client_tier", operator: "equals", value: "vip" },
            { field: "client_tier", operator: "not_equals", value: "vip" },
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
        label: "VIP Early Access",
        icon: "Mail",
        color: "purple",
        config: {
          action_name: "VIP Early Access",
          template: "vip_early_access",
          subject: "🌟 VIP Early Access: Spring Renovation Special",
        },
      },
    },
    {
      id: "node_3",
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
        },
      },
    },
    {
      id: "node_4",
      type: "workflowNode",
      data: {
        builderType: "action",
        actionType: "wait",
        label: "Wait 7 Days",
        icon: "Clock",
        color: "gray",
        config: {
          action_name: "Wait 7 Days",
          wait_duration: 10080,
        },
      },
    },
    {
      id: "node_5",
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
  ],
  edges: [
    { id: "edge_1", source: "node_1", target: "node_2", sourceHandle: "branch_0" },
    { id: "edge_2", source: "node_1", target: "node_3", sourceHandle: "branch_1" },
    { id: "edge_3", source: "node_2", target: "node_4" },
    { id: "edge_4", source: "node_3", target: "node_4" },
    { id: "edge_5", source: "node_4", target: "node_5" },
  ],
  settings: {
    allowReEntry: false,
    timezone: "America/New_York",
  },
  expectedResults: "15-25% conversion, 20-30% revenue increase",
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
          wait_duration: 4320,
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
          wait_duration: 5760,
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
          wait_duration: 4320,
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
          wait_duration: 14400,
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
          wait_duration: 4320,
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
          wait_duration: 1440,
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
          wait_duration: 4320,
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