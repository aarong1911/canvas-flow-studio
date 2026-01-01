// Workflow Builder Types

import { LucideIcon } from "lucide-react";
import { Node, Edge } from "reactflow";

export type BuilderNodeType = "trigger" | "action" | "condition" | "delay";
export type ColorKey = "purple" | "blue" | "green" | "red" | "amber" | "orange" | "gray";

export type NodeLibraryItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  color: ColorKey;
  kind: BuilderNodeType;
  group: string;
};

export type NodeConfigSchemaField =
  | {
      name: string;
      label: string;
      type: "text" | "number";
      required?: boolean;
      placeholder?: string;
      readOnly?: boolean;
      helperText?: string;
    }
  | {
      name: string;
      label: string;
      type: "textarea";
      required?: boolean;
      placeholder?: string;
      rows?: number;
      helperText?: string;
    }
  | {
      name: string;
      label: string;
      type: "select";
      required?: boolean;
      options: { value: string; label: string }[];
      helperText?: string;
    }
  | {
      name: string;
      label: string;
      type: "switch";
      helperText?: string;
    };

export type NodeConfigSchema = {
  fields: NodeConfigSchemaField[];
  variables?: string[];
  title?: string;
};

export type WorkflowSettings = {
  allowReEntry: boolean;
  allowMultipleOpportunities: boolean;
  stopOnResponse: boolean;
  timezone: "account" | "contact";
  timeWindow: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: string[];
  };
  senderDetails: {
    fromName: string;
    fromEmail: string;
    fromNumber: string;
  };
  markConversationsRead: boolean;
};

export type RFNodeData = {
  builderType: BuilderNodeType;
  actionType: string;
  label: string;
  icon: LucideIcon;
  color: ColorKey;
  config: Record<string, any>;
};

export type RFNode = Node<RFNodeData, string>;
export type RFEdge = Edge<{ label?: string }>;

export type ConnectFrom = {
  sourceNodeId: string;
  sourceHandle: "default" | "yes" | "no" | "none";
} | null;

export type SidebarTab = "nodes" | "settings" | "workflow";
export type TopTab = "builder" | "settings" | "history" | "logs";

export const COLOR_HEX: Record<ColorKey, string> = {
  purple: "#A855F7",
  blue: "#2563EB",
  green: "#16A34A",
  red: "#DC2626",
  amber: "#D97706",
  orange: "#F97316",
  gray: "#6B7280",
};
