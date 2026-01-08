// src/components/workflow/workflowRepository.ts
// ✅ FIXED VERSION - Handles duplicate draft constraint
// Using localStorage fallback until Supabase is configured
import { Zap } from "lucide-react";

// Placeholder - will be replaced with real Supabase when Cloud is enabled
const supabase: any = null;
const getCurrentOrgId = async (): Promise<string> => "local-org";

import type { RFEdge, RFNode, RFNodeData, WorkflowSettings, TriggerData } from "./types";
import { ALL_LIBRARY_ITEMS } from "./node-library";

type WorkflowStatus = "draft" | "active" | "paused";
type WorkflowCategory = "sales" | "communication" | "projects" | "finance" | "general";

export interface WorkflowRecord {
  id: string;
  org_id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  category: WorkflowCategory;
  trigger_type: string;
  settings: WorkflowSettings;
  total_enrolled?: number;
  active_enrolled?: number;
  published_version_id?: string;
  created_at?: string;
  last_updated?: string;
  updated_at?: string;
}

export interface WorkflowVersionRecord {
  id: string;
  workflow_id: string;
  version_number?: number;
  status?: string;
  created_by?: string;
  definition: {
    nodes: RFNode[];
    edges: RFEdge[];
    settings: WorkflowSettings;
  };
  created_at?: string;
}

/* ---------------- Library index (for hydration) ---------------- */
const LIB_BY_ACTION_TYPE = (() => {
  const map = new Map<string, (typeof ALL_LIBRARY_ITEMS)[number]>();
  for (const item of ALL_LIBRARY_ITEMS) map.set(item.id, item);
  return map;
})();

function serializeNodesForDb(nodes: RFNode[]) {
  console.log("[serializeNodesForDb] Input nodes:", nodes.length);
  const serialized = nodes.map((n) => {
    const data = n.data as RFNodeData;
    const { icon: _icon, ...rest } = data;
    return { ...n, data: rest };
  });
  console.log("[serializeNodesForDb] Output nodes:", serialized.length);
  return serialized;
}

function hydrateNodesFromDb(nodes: any[]): RFNode[] {
  console.log("[hydrateNodesFromDb] Input nodes:", nodes?.length || 0);
  
  if (!nodes || nodes.length === 0) {
    console.warn("[hydrateNodesFromDb] No nodes to hydrate");
    return [];
  }

  const hydrated = nodes.map((n) => {
    const data = (n.data ?? {}) as Partial<RFNodeData>;
    const lib = data.actionType ? LIB_BY_ACTION_TYPE.get(data.actionType) : undefined;

    return {
      ...n,
      data: {
        ...(data as any),
        label: data.label ?? lib?.label ?? "Step",
        color: (data.color ?? lib?.color ?? "gray") as any,
        icon: (lib?.icon ?? Zap) as any,
        builderType: (data.builderType ?? lib?.kind ?? "action") as any,
        config: data.config ?? {},
        actionType: data.actionType ?? lib?.id ?? "unknown",
      },
    } as RFNode;
  });
  
  console.log("[hydrateNodesFromDb] Output nodes:", hydrated.length);
  return hydrated;
}

function hydrateVersionRecord(row: any): WorkflowVersionRecord {
  console.log("[hydrateVersionRecord] Input row:", {
    id: row?.id,
    workflow_id: row?.workflow_id,
    has_definition: !!row?.definition,
    definition_type: typeof row?.definition,
  });

  if (!row) {
    console.warn("[hydrateVersionRecord] No row to hydrate");
    return row;
  }

  const def = row.definition ?? {};
  console.log("[hydrateVersionRecord] Definition structure:", {
    has_nodes: !!def.nodes,
    nodes_length: def.nodes?.length || 0,
    has_edges: !!def.edges,
    edges_length: def.edges?.length || 0,
    has_settings: !!def.settings,
  });

  const nodes = hydrateNodesFromDb(def.nodes ?? []);
  const edges = (def.edges ?? []) as RFEdge[];
  const settings = def.settings as WorkflowSettings;

  return {
    ...(row as WorkflowVersionRecord),
    definition: { nodes, edges, settings },
  };
}

function deriveTriggerType(triggers?: TriggerData[]): string {
  console.log("[deriveTriggerType] Input triggers:", triggers?.length || 0);
  
  if (!triggers || triggers.length === 0) {
    console.log("[deriveTriggerType] No triggers, defaulting to 'manual'");
    return "manual";
  }
  
  const configured = triggers.find(t => t.isConfigured);
  if (configured && configured.actionType !== "trigger_placeholder") {
    console.log("[deriveTriggerType] Using configured trigger:", configured.actionType);
    return configured.actionType;
  }
  
  console.log("[deriveTriggerType] No configured triggers, defaulting to 'manual'");
  return "manual";
}

/* ---------------- localStorage helpers ---------------- */
const STORAGE_KEY = "lovable_workflows";

function getStoredWorkflows(): { workflows: WorkflowRecord[]; versions: WorkflowVersionRecord[] } {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { workflows: [], versions: [] };
  try {
    return JSON.parse(stored);
  } catch {
    return { workflows: [], versions: [] };
  }
}

function saveStoredWorkflows(data: { workflows: WorkflowRecord[]; versions: WorkflowVersionRecord[] }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* ---------------- Queries ---------------- */
export async function fetchWorkflow(workflowId: string): Promise<WorkflowRecord> {
  console.log("[fetchWorkflow] Starting fetch for:", workflowId);
  
  // Use localStorage fallback
  const { workflows } = getStoredWorkflows();
  const workflow = workflows.find(w => w.id === workflowId);
  
  if (!workflow) {
    throw new Error("Workflow not found");
  }
  
  console.log("[fetchWorkflow] Workflow fetched:", {
    id: workflow.id,
    name: workflow.name,
    status: workflow.status,
  });

  return workflow;
}

export async function fetchLatestWorkflowVersion(workflowId: string): Promise<WorkflowVersionRecord | null> {
  console.log("[fetchLatestWorkflowVersion] Starting fetch for:", workflowId);
  
  // Use localStorage fallback
  const { versions } = getStoredWorkflows();
  const workflowVersions = versions
    .filter(v => v.workflow_id === workflowId)
    .sort((a, b) => (b.version_number || 0) - (a.version_number || 0));
  
  const latestVersion = workflowVersions[0] || null;
  
  if (!latestVersion) {
    console.warn("[fetchLatestWorkflowVersion] No version found for workflow:", workflowId);
    return null;
  }

  console.log("[fetchLatestWorkflowVersion] Version found:", {
    id: latestVersion.id,
    version_number: latestVersion.version_number,
  });

  const hydrated = hydrateVersionRecord(latestVersion);
  console.log("[fetchLatestWorkflowVersion] Hydrated version:", {
    id: hydrated.id,
    nodes_count: hydrated.definition?.nodes?.length || 0,
    edges_count: hydrated.definition?.edges?.length || 0,
  });

  return hydrated;
}

export async function saveDraft(input: {
  workflowId?: string;
  name: string;
  status: WorkflowStatus;
  category?: WorkflowCategory;
  trigger_type?: string;
  triggers?: TriggerData[];
  settings: WorkflowSettings;
  nodes: RFNode[];
  edges: RFEdge[];
}) {
  console.log("[saveDraft] Starting save with:", {
    workflowId: input.workflowId,
    name: input.name,
    status: input.status,
    nodes_count: input.nodes.length,
    edges_count: input.edges.length,
    triggers_count: input.triggers?.length || 0,
  });

  const orgId = await getCurrentOrgId();
  const category = input.category ?? "general";
  const trigger_type = input.trigger_type ?? deriveTriggerType(input.triggers);
  const now = new Date().toISOString();

  // Use localStorage fallback
  const stored = getStoredWorkflows();
  
  let wf: WorkflowRecord;
  
  if (input.workflowId) {
    // Update existing workflow
    const idx = stored.workflows.findIndex(w => w.id === input.workflowId);
    if (idx === -1) {
      throw new Error("Workflow not found");
    }
    
    wf = {
      ...stored.workflows[idx],
      name: input.name,
      status: input.status,
      category,
      trigger_type,
      settings: input.settings,
      last_updated: now,
      updated_at: now,
    };
    stored.workflows[idx] = wf;
    console.log("[saveDraft] Workflow updated:", wf.id);
  } else {
    // Create new workflow
    wf = {
      id: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      org_id: orgId,
      name: input.name,
      status: input.status,
      category,
      trigger_type,
      settings: input.settings,
      total_enrolled: 0,
      active_enrolled: 0,
      created_at: now,
      last_updated: now,
      updated_at: now,
    };
    stored.workflows.push(wf);
    console.log("[saveDraft] Workflow created:", wf.id);
  }

  // Get next version number
  const existingVersions = stored.versions.filter(v => v.workflow_id === wf.id);
  const latestVersionNum = Math.max(0, ...existingVersions.map(v => v.version_number || 0));
  const nextVersionNumber = latestVersionNum + 1;

  // Serialize nodes
  const serializedNodes = serializeNodesForDb(input.nodes);

  // Check for existing draft
  const existingDraftIdx = stored.versions.findIndex(
    v => v.workflow_id === wf.id && v.status === "draft"
  );

  let version: WorkflowVersionRecord;

  if (existingDraftIdx !== -1) {
    // Update existing draft
    version = {
      ...stored.versions[existingDraftIdx],
      definition: {
        nodes: serializedNodes as any,
        edges: input.edges,
        settings: input.settings,
      },
    };
    stored.versions[existingDraftIdx] = version;
    console.log("[saveDraft] Draft updated:", version.id);
  } else {
    // Create new draft
    version = {
      id: `ver_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workflow_id: wf.id,
      version_number: nextVersionNumber,
      status: "draft",
      definition: {
        nodes: serializedNodes as any,
        edges: input.edges,
        settings: input.settings,
      },
      created_at: now,
    };
    stored.versions.push(version);
    console.log("[saveDraft] Draft created:", version.id);
  }

  saveStoredWorkflows(stored);

  const result = {
    workflow: wf,
    version: hydrateVersionRecord(version),
  };

  console.log("[saveDraft] ✅ Save completed successfully");
  return result;
}