// src/components/workflow/workflowRepository.ts
// Workflow persistence layer
import { Zap } from "lucide-react";

// Dynamic imports for optional Supabase integration
let supabase: any = null;
let getCurrentOrgId: (() => Promise<string | null>) | null = null;

// Try to load supabase and org utilities if they exist
try {
  // @ts-ignore - Optional dependency
  import("@/lib/supabase").then(mod => { supabase = mod.supabase; }).catch(() => {});
  // @ts-ignore - Optional dependency
  import("@/lib/org").then(mod => { getCurrentOrgId = mod.getCurrentOrgId; }).catch(() => {});
} catch (e) {
  // Supabase not configured
}

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

/* ---------------- Queries ---------------- */
export async function fetchWorkflow(workflowId: string) {
  console.log("[fetchWorkflow] Starting fetch for:", workflowId);
  
  // Check if Supabase is configured
  if (!supabase || !getCurrentOrgId) {
    console.warn("[fetchWorkflow] Supabase not configured - using local storage fallback");
    const stored = localStorage.getItem(`workflow_${workflowId}`);
    if (stored) {
      return JSON.parse(stored) as WorkflowRecord;
    }
    throw new Error("Workflow not found");
  }

  const orgId = await getCurrentOrgId();
  if (!orgId) {
    console.error("[fetchWorkflow] No org ID found");
    throw new Error("No org selected");
  }

  console.log("[fetchWorkflow] Using org ID:", orgId);

  const { data, error } = await supabase
    .from("workflows")
    .select("*")
    .eq("id", workflowId)
    .eq("org_id", orgId)
    .single();

  if (error) {
    console.error("[fetchWorkflow] Database error:", error);
    throw error;
  }

  console.log("[fetchWorkflow] Workflow fetched:", {
    id: data?.id,
    name: data?.name,
    status: data?.status,
  });

  return data as WorkflowRecord;
}

export async function fetchLatestWorkflowVersion(workflowId: string) {
  console.log("[fetchLatestWorkflowVersion] Starting fetch for:", workflowId);
  
  // Check if Supabase is configured
  if (!supabase || !getCurrentOrgId) {
    console.warn("[fetchLatestWorkflowVersion] Supabase not configured - using local storage fallback");
    const stored = localStorage.getItem(`workflow_${workflowId}`);
    if (stored) {
      const workflow = JSON.parse(stored);
      return {
        id: workflowId,
        workflow_id: workflowId,
        definition: {
          nodes: workflow.nodes || [],
          edges: workflow.edges || [],
          settings: workflow.settings || {},
        },
      } as WorkflowVersionRecord;
    }
    return null;
  }

  const orgId = await getCurrentOrgId();
  if (!orgId) {
    console.error("[fetchLatestWorkflowVersion] No org ID found");
    throw new Error("No org selected");
  }

  const { data, error } = await supabase
    .from("workflow_versions")
    .select("*, workflows!inner(id, org_id)")
    .eq("workflow_id", workflowId)
    .eq("workflows.org_id", orgId)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[fetchLatestWorkflowVersion] Database error:", error);
    
    if (error.code === '42703') {
      console.error("❌ CRITICAL: 'definition' column does not exist in workflow_versions table!");
      console.error("Run this SQL in Supabase:");
      console.error("ALTER TABLE workflow_versions ADD COLUMN definition JSONB NOT NULL DEFAULT '{}'::jsonb;");
      throw new Error("Database schema error: 'definition' column missing. Check console for SQL fix.");
    }
    
    throw error;
  }

  if (!data) {
    console.warn("[fetchLatestWorkflowVersion] No version found for workflow:", workflowId);
    return null;
  }

  console.log("[fetchLatestWorkflowVersion] Raw version data:", {
    id: data.id,
    workflow_id: data.workflow_id,
    version_number: data.version_number,
    has_definition: !!data.definition,
    definition_preview: data.definition ? JSON.stringify(data.definition).substring(0, 100) : null,
  });

  const hydrated = hydrateVersionRecord(data);
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

  // Check if Supabase is configured
  if (!supabase || !getCurrentOrgId) {
    console.warn("[saveDraft] Supabase not configured - using local storage fallback");
    // Fallback to localStorage for demo/development
    const localId = input.workflowId || crypto.randomUUID();
    const localWorkflow = {
      id: localId,
      name: input.name,
      status: input.status,
      nodes: input.nodes,
      edges: input.edges,
      triggers: input.triggers,
      settings: input.settings,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(`workflow_${localId}`, JSON.stringify(localWorkflow));
    return { workflow: { id: localId, ...localWorkflow }, version: null };
  }

  const orgId = await getCurrentOrgId();
  if (!orgId) {
    console.error("[saveDraft] No org ID found");
    throw new Error("No org selected");
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("[saveDraft] No user found");
    throw new Error("Not authenticated");
  }

  const category = input.category ?? "general";
  const trigger_type = input.trigger_type ?? deriveTriggerType(input.triggers);

  console.log("[saveDraft] Saving with category:", category, "trigger_type:", trigger_type);

  // 1) Insert or update workflow
  let wf: WorkflowRecord;

  if (input.workflowId) {
    console.log("[saveDraft] Updating existing workflow:", input.workflowId);
    
    const { data, error } = await supabase
      .from("workflows")
      .update({
        name: input.name,
        status: input.status,
        category,
        trigger_type,
        settings: input.settings,
        last_updated: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.workflowId)
      .eq("org_id", orgId)
      .select("*")
      .single();

    if (error) {
      console.error("[saveDraft] Error updating workflow:", error);
      throw error;
    }

    wf = data as WorkflowRecord;
    console.log("[saveDraft] Workflow updated:", wf.id);
  } else {
    console.log("[saveDraft] Creating new workflow");
    
    const { data, error } = await supabase
      .from("workflows")
      .insert({
        org_id: orgId,
        name: input.name,
        status: input.status,
        category,
        trigger_type,
        settings: input.settings,
        total_enrolled: 0,
        active_enrolled: 0,
      })
      .select("*")
      .single();

    if (error) {
      console.error("[saveDraft] Error creating workflow:", error);
      throw error;
    }

    wf = data as WorkflowRecord;
    console.log("[saveDraft] Workflow created:", wf.id);
  }

  // 2) Get next version number
  console.log("[saveDraft] Fetching latest version number for:", wf.id);
  
  const { data: latestVersion, error: versionFetchError } = await supabase
    .from("workflow_versions")
    .select("version_number")
    .eq("workflow_id", wf.id)
    .order("version_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (versionFetchError && versionFetchError.code !== 'PGRST116') {
    console.error("[saveDraft] Error fetching version:", versionFetchError);
    throw versionFetchError;
  }

  const nextVersionNumber = (latestVersion?.version_number ?? 0) + 1;
  console.log("[saveDraft] Next version number:", nextVersionNumber);

  // 3) Serialize nodes for storage
  const serializedNodes = serializeNodesForDb(input.nodes);
  console.log("[saveDraft] Serialized nodes:", serializedNodes.length);

  // 4) Create version payload
  const versionPayload = {
    workflow_id: wf.id,
    version_number: nextVersionNumber,
    status: input.status,
    created_by: user.id,
    definition: {
      nodes: serializedNodes,
      edges: input.edges,
      settings: input.settings,
    },
  };

  console.log("[saveDraft] Preparing version save with payload:", {
    workflow_id: versionPayload.workflow_id,
    version_number: versionPayload.version_number,
    status: versionPayload.status,
    definition_nodes: versionPayload.definition.nodes.length,
    definition_edges: versionPayload.definition.edges.length,
  });

  // ✅ FIX: Check if draft already exists (constraint: uq_workflow_versions_one_draft)
  console.log("[saveDraft] Checking for existing draft version...");
  const { data: existingDraft, error: draftCheckError } = await supabase
    .from("workflow_versions")
    .select("*")
    .eq("workflow_id", wf.id)
    .eq("status", "draft")
    .maybeSingle();

  if (draftCheckError) {
    console.error("[saveDraft] Error checking for existing draft:", draftCheckError);
    throw draftCheckError;
  }

  let v;
  let vErr;

  if (existingDraft) {
    // UPDATE existing draft
    console.log("[saveDraft] Updating existing draft version:", existingDraft.id);
    
    const { data: updatedVersion, error: updateError } = await supabase
      .from("workflow_versions")
      .update({
        definition: versionPayload.definition,
      })
      .eq("id", existingDraft.id)
      .select("*")
      .single();

    v = updatedVersion;
    vErr = updateError;

    if (!updateError) {
      console.log("[saveDraft] ✅ Draft updated successfully:", v?.id);
    }
  } else {
    // INSERT new draft
    console.log("[saveDraft] Creating new draft version (no existing draft found)");
    
    const { data: newVersion, error: insertError } = await supabase
      .from("workflow_versions")
      .insert(versionPayload as any)
      .select("*")
      .single();

    v = newVersion;
    vErr = insertError;

    if (!insertError) {
      console.log("[saveDraft] ✅ Draft created successfully:", v?.id);
    }
  }

  if (vErr) {
    console.error("[saveDraft] ❌ Error saving version:", vErr);
    
    // Check for specific error codes
    if (vErr.code === '42703') {
      console.error("❌ CRITICAL: Column does not exist!");
      console.error("Missing 'definition' column in workflow_versions table");
      console.error("Run: ALTER TABLE workflow_versions ADD COLUMN definition JSONB;");
      throw new Error(`Database schema error: ${vErr.message}`);
    }
    
    if (vErr.code === '23505') {
      console.error("❌ CRITICAL: Duplicate draft constraint violation!");
      console.error("This should not happen - draft check logic may have failed");
      console.error("Existing draft ID was:", existingDraft?.id);
    }
    
    throw vErr;
  }

  console.log("[saveDraft] Version saved successfully:", {
    id: v.id,
    version_number: v.version_number,
    action: existingDraft ? "UPDATED" : "CREATED",
  });

  const result = { 
    workflow: wf, 
    version: hydrateVersionRecord(v) 
  };

  console.log("[saveDraft] ✅ Save completed successfully");
  return result;
}