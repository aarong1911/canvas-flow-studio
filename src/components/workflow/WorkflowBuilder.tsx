//src/pages/workflows/WorkflowBuilder.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { addEdge, Connection, MarkerType, useEdgesState, useNodesState, ReactFlowInstance, OnConnectStartParams } from "reactflow";
import { toast } from "sonner";
import { 
  Zap, Play, UserPlus, Tag, GitBranch, Mail, MessageSquare, Clock, 
  TrendingUp, UserCheck, Filter, Target, Calendar, CheckCircle, 
  AlertCircle, Plus, Settings as SettingsIcon 
} from "lucide-react";
import { saveDraft } from "./workflowRepository";
import { fetchWorkflow, fetchLatestWorkflowVersion } from "./workflowRepository";

import { RFNode, RFEdge, RFNodeData, ConnectFrom, WorkflowSettings, SidebarTab, TopTab, NodeLibraryItem, BuilderNodeType, TriggerData } from "./types";
import { WorkflowHeader } from "./WorkflowHeader";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { WorkflowSidebar } from "./WorkflowSidebar";
import { WorkflowSettingsPage } from "./WorkflowSettingsPage";
import { TRIGGERS, ALL_LIBRARY_ITEMS } from "./node-library";
import { getTemplateById } from "./templates";

// ✅ Icon serialization system
const ICON_MAP: Record<string, any> = {
  Zap, Play, UserPlus, Tag, GitBranch, Mail, MessageSquare, Clock,
  TrendingUp, UserCheck, Filter, Target, Calendar, CheckCircle,
  AlertCircle, Plus, SettingsIcon,
};

const getIconComponent = (iconName: string): any => {
  return ICON_MAP[iconName] || Zap;
};

const getIconName = (IconComponent: any): string => {
  for (const [name, component] of Object.entries(ICON_MAP)) {
    if (component === IconComponent) return name;
  }
  return "Zap";
};

// Helper functions
function normalizeBuilderType(maybe: any, actionType: string): BuilderNodeType {
  if (actionType === "if_else" || actionType === "business_hours_gate") return "condition";
  if (["wait", "wait_until", "wait_for_event", "goal_event"].includes(actionType)) return "delay";
  if (["trigger", "action", "condition", "delay"].includes(maybe)) return maybe;
  return "action";
}

function normalizeActionType(rawActionType: string): string {
  if (rawActionType === "goal_event") return "wait_for_event";
  return rawActionType;
}

const DEFAULT_SETTINGS: WorkflowSettings = {
  allowReEntry: false,
  allowMultipleOpportunities: false,
  stopOnResponse: false,
  timezone: "account",
  timeWindow: { enabled: false, startTime: "09:00", endTime: "17:00", days: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
  senderDetails: { fromName: "", fromEmail: "", fromNumber: "" },
  markConversationsRead: false,
};

function createEmptyTrigger(): TriggerData {
  return {
    id: crypto.randomUUID(),
    actionType: "trigger_placeholder",
    label: "Select Trigger",
    icon: Zap,
    color: "purple",
    config: {},
    isConfigured: false,
  };
}

function getIconForActionType(actionType: string): any {
  const item = ALL_LIBRARY_ITEMS.find(i => i.id === actionType);
  return item?.icon || Zap;
}

export const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: workflowIdParam } = useParams<{ id?: string }>();

  const [workflowId, setWorkflowId] = useState<string | undefined>(workflowIdParam);

  useEffect(() => {
    setWorkflowId(workflowIdParam);
  }, [workflowIdParam]);

  const templateId = location.state?.templateId;
  const isFromTemplate = location.state?.isFromTemplate;

  const [isInteractive, setIsInteractive] = useState(true);
  const [topTab, setTopTab] = useState<TopTab>("builder");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("triggers");
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [workflowStatus, setWorkflowStatus] = useState<"draft" | "active">("draft");
  const [search, setSearch] = useState("");

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const [triggers, setTriggers] = useState<TriggerData[]>([createEmptyTrigger()]);
  const [selectedTriggerId, setSelectedTriggerId] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<RFNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<{ label?: string }>([]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<ConnectFrom>(null);
  const [wfSettings, setWfSettings] = useState<WorkflowSettings>(DEFAULT_SETTINGS);

  // Refs to avoid stale closures (first insert would use old connectFrom/selectedEdgeId)
  const connectFromRef = useRef<ConnectFrom>(null);
  const selectedEdgeIdRef = useRef<string | null>(null);

  useEffect(() => {
    connectFromRef.current = connectFrom;
  }, [connectFrom]);

  useEffect(() => {
    selectedEdgeIdRef.current = selectedEdgeId;
  }, [selectedEdgeId]);

  const reactFlowRef = useRef<ReactFlowInstance | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const selectedEdge = useMemo(() => edges.find((e) => e.id === selectedEdgeId) || null, [edges, selectedEdgeId]);
  const selectedTrigger = useMemo(() => triggers.find((t) => t.id === selectedTriggerId) || null, [triggers, selectedTriggerId]);

  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Effect 1: Load from template
  useEffect(() => {
    if (!templateId || !isFromTemplate) return;

    try {
      const template = getTemplateById(templateId);
      if (!template) {
        console.error("Template not found:", templateId);
        toast.error("Template not found");
        setIsInitialized(true);
        return;
      }

      console.log("📦 [Template] Loading template:", template.name);

      if (template.triggers && Array.isArray(template.triggers)) {
        const loadedTriggers: TriggerData[] = template.triggers.map((t) => {
          const icon = getIconComponent(t.icon);
          return {
            id: t.id || crypto.randomUUID(),
            actionType: t.actionType,
            label: t.label,
            icon: icon,
            color: (t.color || "purple") as any,
            config: t.config || {},
            isConfigured: t.isConfigured ?? true,
          };
        });
        loadedTriggers.push(createEmptyTrigger());
        setTriggers(loadedTriggers);
      }

      if (template.nodes && Array.isArray(template.nodes)) {
        const loadedNodes: RFNode[] = template.nodes.map((n, idx) => {
          const icon = getIconComponent(n.data.icon);
          return {
            id: n.id,
            type: n.type || "workflowNode",
            position: (n as any).position || { x: 0, y: idx * 150 },
            data: {
              builderType: normalizeBuilderType(n.data.builderType, n.data.actionType),
              actionType: normalizeActionType(n.data.actionType),
              label: n.data.label,
              icon: icon,
              color: (n.data.color || "blue") as any,
              config: n.data.config || {},
              isConfigured: true,
            },
          };
        });
        setNodes(loadedNodes);
      }

      if (template.edges && Array.isArray(template.edges)) {
        const loadedEdges: RFEdge[] = template.edges.map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          sourceHandle: e.sourceHandle,
          targetHandle: "in",
          type: "plusEdge",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2 },
        }));
        setEdges(loadedEdges);
      }

      if (template.name) {
        setWorkflowName(template.name);
      }

      if (template.settings) {
        setWfSettings(prev => ({ 
          ...prev, 
          allowReEntry: template.settings?.allowReEntry ?? prev.allowReEntry,
          timezone: (template.settings?.timezone as "account" | "contact") ?? prev.timezone,
        }));
      }

      toast.success(`Template loaded: ${template.name}`, {
        description: `${template.nodes?.length || 0} nodes ready to customize`,
      });

      navigate(location.pathname, { replace: true, state: {} });

      console.log("✅ [Template] Load complete");
      setIsInitialized(true);

    } catch (error) {
      console.error("❌ [Template] Load failed:", error);
      toast.error("Failed to load template");
      setIsInitialized(true);
    }
  }, [templateId, isFromTemplate, navigate, location.pathname, setNodes, setEdges]);

  // ✅ Effect 2: Load from database (SEPARATE!)
  useEffect(() => {
    if (templateId && isFromTemplate) return;
    
    if (!workflowIdParam) {
      setIsInitialized(true);
      return;
    }

    (async () => {
      try {
        console.log("📥 Loading workflow from database:", workflowIdParam);

        const wf = await fetchWorkflow(workflowIdParam);
        const latest = await fetchLatestWorkflowVersion(workflowIdParam);

        console.log("📦 Workflow data:", wf);
        console.log("📦 Latest version:", latest);

        setWorkflowName(wf.name || "Untitled Workflow");
        setWorkflowStatus((wf.status as any) || "draft");
        setWfSettings(wf.settings || DEFAULT_SETTINGS);

        // ✅ Load nodes with icon conversion
        if (latest?.definition?.nodes && Array.isArray(latest.definition.nodes)) {
          console.log("📦 Loading nodes:", latest.definition.nodes.length);
          
          const loadedNodes: RFNode[] = latest.definition.nodes.map((n: any) => ({
            id: n.id,
            type: n.type || "workflowNode",
            position: n.position || { x: 0, y: 0 },
            data: {
              builderType: n.data.builderType,
              actionType: n.data.actionType,
              label: n.data.label,
              icon: getIconComponent(n.data.icon), // ✅ Convert
              color: n.data.color,
              config: n.data.config || {},
              isConfigured: n.data.isConfigured !== false,
            },
          }));
          
          setNodes(loadedNodes);
          console.log("✅ Nodes loaded:", loadedNodes.length);
        } else {
          console.warn("⚠️ No nodes in definition");
          setNodes([]);
        }

        // ✅ Load edges
        if (latest?.definition?.edges && Array.isArray(latest.definition.edges)) {
          console.log("🔗 Loading edges:", latest.definition.edges.length);
          setEdges(latest.definition.edges);
          console.log("✅ Edges loaded:", latest.definition.edges.length);
        } else {
          console.warn("⚠️ No edges in definition");
          setEdges([]);
        }

        // ✅ Load triggers (with type assertion for TypeScript)
        const wfWithTriggers = wf as typeof wf & {
          triggers?: Array<{
            id: string;
            actionType: string;
            label: string;
            icon: string;
            color: string;
            config: Record<string, any>;
            isConfigured: boolean;
          }>;
        };
        
        if (wfWithTriggers.triggers && Array.isArray(wfWithTriggers.triggers)) {
          console.log("📋 Loading triggers:", wfWithTriggers.triggers.length);
          
          const loadedTriggers: TriggerData[] = wfWithTriggers.triggers.map((t: any) => ({
            id: t.id || crypto.randomUUID(),
            actionType: t.actionType,
            label: t.label,
            icon: getIconComponent(t.icon), // ✅ Convert
            color: t.color,
            config: t.config || {},
            isConfigured: t.isConfigured !== false,
          }));
          
          loadedTriggers.push(createEmptyTrigger());
          setTriggers(loadedTriggers);
          console.log("✅ Triggers loaded:", loadedTriggers.length);
        } else {
          setTriggers([createEmptyTrigger()]);
        }

        setIsInitialized(true);
        setHasUnsavedChanges(false);

        console.log("✅ Workflow loaded successfully");
        toast.success("Workflow loaded");

      } catch (e: any) {
        console.error("❌ Failed to load workflow:", e);
        toast.error("Failed to load workflow", { description: e?.message || String(e) });
        setIsInitialized(true);
      }
    })();
  }, [workflowIdParam, templateId, isFromTemplate, setNodes, setEdges]);

  // Initialize after first render (only if not loading anything)
  useEffect(() => {
    if (templateId && isFromTemplate) return;
    if (workflowIdParam) return;
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, [templateId, isFromTemplate, workflowIdParam]);

  useEffect(() => {
    if (isInitialized) {
      setHasUnsavedChanges(true);
    }
  }, [triggers, nodes, edges, wfSettings, workflowName, isInitialized]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // ReactFlow events
  const onConnect = useCallback((connection: Connection) => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedTriggerId(null);
    setEdges((eds) => addEdge({
      ...connection,
      id: crypto.randomUUID(),
      type: "smoothstep",
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 },
    }, eds));
    setConnectFrom(null);
  }, [setEdges]);

  const onConnectStart = useCallback((_: any, params: OnConnectStartParams) => {
    if (params.nodeId) {
      setConnectFrom({ sourceNodeId: params.nodeId, sourceHandle: (params.handleId as any) || "default" });
    }
  }, []);

  const onNodeClick = useCallback((_e: any, node: RFNode) => {
    setSelectedEdgeId(null);
    setSelectedTriggerId(null);
    setSelectedNodeId(node.id);
    setSidebarTab("settings");
  }, []);

  const onEdgeClick = useCallback((_e: any, edge: RFEdge) => {
    setSelectedNodeId(null);
    setSelectedTriggerId(null);
    setSelectedEdgeId(edge.id);
    setSidebarTab("settings");
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedTriggerId(null);
  }, []);

  // Delete key handler
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) return;
      if (e.key !== "Delete") return;

      if (selectedEdgeId) {
        setEdges((eds) => eds.filter((x) => x.id !== selectedEdgeId));
        setSelectedEdgeId(null);
        toast.success("Disconnected");
      } else if (selectedNodeId) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
        setEdges((eds) => eds.filter((x) => x.source !== selectedNodeId && x.target !== selectedNodeId));
        setSelectedNodeId(null);
        toast.success("Node deleted");
      } else if (selectedTriggerId) {
        const trigger = triggers.find(t => t.id === selectedTriggerId);
        if (trigger?.isConfigured) {
          setTriggers((ts) => {
            const filtered = ts.filter((t) => t.id !== selectedTriggerId);
            if (filtered.length === 0 || filtered.every(t => t.isConfigured)) {
              return [...filtered, createEmptyTrigger()];
            }
            return filtered;
          });
          setSelectedTriggerId(null);
          toast.success("Trigger removed");
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedEdgeId, selectedNodeId, selectedTriggerId, triggers, setEdges, setNodes]);

  const handleTriggerClick = useCallback((triggerId: string) => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedTriggerId(triggerId);
    
    const trigger = triggers.find(t => t.id === triggerId);
    if (trigger?.isConfigured) {
      setSidebarTab("settings");
    } else {
      setSidebarTab("triggers");
    }
  }, [triggers]);

  const handleAddTriggerClick = useCallback(() => {
    const emptyTrigger = triggers.find(t => !t.isConfigured);
    if (emptyTrigger) {
      setSelectedTriggerId(emptyTrigger.id);
    } else {
      const newTrigger = createEmptyTrigger();
      setTriggers(ts => [...ts, newTrigger]);
      setSelectedTriggerId(newTrigger.id);
    }
    setSidebarTab("triggers");
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [triggers]);

  const handleSelectTriggerType = useCallback((item: NodeLibraryItem) => {
    if (!selectedTriggerId) return;
    
    setTriggers((ts) => ts.map((t) => {
      if (t.id === selectedTriggerId) {
        return {
          ...t,
          actionType: item.id,
          label: item.label,
          icon: item.icon,
          color: item.color,
          config: { trigger_name: item.label },
          isConfigured: false,
        };
      }
      return t;
    }));
    setSidebarTab("settings");
  }, [selectedTriggerId]);

  const handleSaveTriggerConfig = useCallback((triggerId: string, config: Record<string, any>) => {
    setTriggers((ts) => {
      const updated = ts.map((t) => {
        if (t.id === triggerId) {
          return { ...t, config, isConfigured: true };
        }
        return t;
      });
      
      if (updated.every(t => t.isConfigured)) {
        return [...updated, createEmptyTrigger()];
      }
      return updated;
    });
    toast.success("Trigger saved");
  }, []);

  const handleAddActionClick = useCallback((sourceNodeId?: string, sourceHandle?: string) => {
    if (sourceNodeId) {
      setConnectFrom({ sourceNodeId, sourceHandle: (sourceHandle as any) || "default" });
    }
    setSidebarTab("actions");
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedTriggerId(null);
  }, []);

  const getNewNodePosition = useCallback((sourceId?: string, sourceHandle?: ConnectFrom["sourceHandle"]) => {
    if (!sourceId) {
      if (nodes.length === 0) return { x: 0, y: 0 };
      const last = nodes[nodes.length - 1];
      return { x: 0, y: last.position.y + 120 };
    }
    const src = nodes.find((n) => n.id === sourceId);
    if (!src) return { x: 0, y: 0 };
    const base = { x: 0, y: src.position.y + 180 };
    
    if (sourceHandle === "yes") return { x: base.x - 260, y: base.y };
    if (sourceHandle === "no") return { x: base.x + 260, y: base.y };
    
    if (sourceHandle?.startsWith("branch_") || sourceHandle === "none") {
      const branches = src.data.config?.branches || [];
      const showNoneBranch = src.data.config?.showNoneBranch !== false;
      const totalBranches = branches.length + (showNoneBranch ? 1 : 0);
      
      let branchIndex: number;
      if (sourceHandle === "none") {
        branchIndex = branches.length;
      } else {
        branchIndex = parseInt(sourceHandle.replace("branch_", ""), 10);
      }
      
      const branchWidth = 220;
      const totalWidth = totalBranches * branchWidth;
      const startX = -totalWidth / 2 + branchWidth / 2;
      const xOffset = startX + branchIndex * branchWidth;
      
      return { x: xOffset, y: base.y };
    }
    
    return base;
  }, [nodes]);

  const handleAddNode = useCallback((item: NodeLibraryItem) => {
    const cf = connectFromRef.current;
    const activeSelectedEdgeId = selectedEdgeIdRef.current;

    console.log("[WF] handleAddNode", {
      picked: item.id,
      activeSelectedEdgeId,
      connectFrom: cf,
    });

    const nodeId = crypto.randomUUID();
    const builderType = normalizeBuilderType(item.kind, item.id);
    const insertBeforeNodeId = (cf as any)?.insertBeforeNodeId;
    const pos = getNewNodePosition(cf?.sourceNodeId, cf?.sourceHandle);

    console.log("[WF] addNode context", { nodeId, insertBeforeNodeId, pos });

    const newNode: RFNode = {
      id: nodeId,
      type: "workflowNode",
      position: pos,
      data: {
        builderType,
        actionType: normalizeActionType(item.id),
        label: item.label,
        icon: item.icon,
        color: item.color,
        config: {},
        isConfigured: false,
      },
    };

    if (activeSelectedEdgeId) {
      const edge = edges.find((e) => e.id === activeSelectedEdgeId);
      if (edge) {
        const sourceNode = nodes.find((n) => n.id === edge.source);
        const targetNode = nodes.find((n) => n.id === edge.target);

        if (sourceNode && targetNode) {
          newNode.position = {
            x: (sourceNode.position.x + targetNode.position.x) / 2,
            y: (sourceNode.position.y + targetNode.position.y) / 2,
          };
        }

        setNodes((nds) => [...nds, newNode]);

        setEdges((eds) => {
          const filtered = eds.filter((e) => e.id !== activeSelectedEdgeId);
          return [
            ...filtered,
            {
              id: crypto.randomUUID(),
              source: edge.source,
              target: nodeId,
              sourceHandle: edge.sourceHandle,
              targetHandle: "in",
              type: "plusEdge",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2 },
            },
            {
              id: crypto.randomUUID(),
              source: nodeId,
              target: edge.target,
              sourceHandle: "default",
              targetHandle: "in",
              type: "plusEdge",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2 },
            },
          ];
        });

        setSelectedEdgeId(null);
        setConnectFrom(null);
        // keep refs in sync immediately
        selectedEdgeIdRef.current = null;
        connectFromRef.current = null;
        setSelectedNodeId(nodeId);
        setSidebarTab("settings");
        toast.success(`Inserted: ${item.label}`);
        return;
      }
    }

    if (insertBeforeNodeId) {
      const targetNode = nodes.find((n) => n.id === insertBeforeNodeId);

      if (cf?.sourceNodeId === "__trigger__") {
        if (targetNode) {
          newNode.position = {
            x: targetNode.position.x,
            y: targetNode.position.y - 120,
          };
        }

        setNodes((nds) => [newNode, ...nds]);

        setConnectFrom(null);
        // keep refs in sync immediately
        connectFromRef.current = null;
        selectedEdgeIdRef.current = null;
        setSelectedNodeId(nodeId);
        setSidebarTab("settings");
        toast.success(`Inserted: ${item.label}`);
        return;
      }

      const sourceId = cf?.sourceNodeId;
      const sourceHandle = (cf?.sourceHandle as any) || "default";
      const sourceNode = nodes.find((n) => n.id === sourceId);

      if (sourceNode && targetNode) {
        newNode.position = {
          x: (sourceNode.position.x + targetNode.position.x) / 2,
          y: (sourceNode.position.y + targetNode.position.y) / 2,
        };
      }

      setNodes((nds) => {
        const targetIndex = nds.findIndex((n) => n.id === insertBeforeNodeId);
        if (targetIndex === -1) return [...nds, newNode];
        const newNodes = [...nds];
        newNodes.splice(targetIndex, 0, newNode);
        return newNodes;
      });

      if (sourceId) {
        setEdges((eds) => {
          const existing = eds.find(
            (e) =>
              e.source === sourceId &&
              e.target === insertBeforeNodeId &&
              (((e.sourceHandle as any) || "default") === sourceHandle)
          );

          const filtered = existing ? eds.filter((e) => e.id !== existing.id) : eds;

          return [
            ...filtered,
            {
              id: crypto.randomUUID(),
              source: sourceId,
              target: nodeId,
              sourceHandle,
              targetHandle: "in",
              type: "plusEdge",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2 },
              label: (existing as any)?.label,
            },
            {
              id: crypto.randomUUID(),
              source: nodeId,
              target: insertBeforeNodeId,
              sourceHandle: "default",
              targetHandle: "in",
              type: "plusEdge",
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { strokeWidth: 2 },
            },
          ];
        });
      }

      setConnectFrom(null);
      // keep refs in sync immediately
      connectFromRef.current = null;
      selectedEdgeIdRef.current = null;
      setSelectedNodeId(nodeId);
      setSidebarTab("settings");
      toast.success(`Inserted: ${item.label}`);
      return;
    }

    setNodes((nds) => [...nds, newNode]);

    if (cf) {
      let edgeLabel: string | undefined;
      if (cf.sourceHandle === "yes") edgeLabel = "Yes";
      else if (cf.sourceHandle === "no") edgeLabel = "No";
      else if (cf.sourceHandle === "none") edgeLabel = "None";
      else if (cf.sourceHandle?.startsWith("branch_")) {
        const srcNode = nodes.find((n) => n.id === cf.sourceNodeId);
        const branchIdx = parseInt(cf.sourceHandle.replace("branch_", ""), 10);
        const branch = srcNode?.data.config?.branches?.[branchIdx];
        edgeLabel = branch?.name || `Branch ${branchIdx + 1}`;
      }

      setEdges((eds) => [
        ...eds,
        {
          id: crypto.randomUUID(),
          source: cf.sourceNodeId,
          target: nodeId,
          sourceHandle: cf.sourceHandle,
          targetHandle: "in",
          type: "plusEdge",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2 },
          label: edgeLabel,
        },
      ]);
    }

    setConnectFrom(null);
    // keep refs in sync immediately
    connectFromRef.current = null;
    selectedEdgeIdRef.current = null;
    setSelectedNodeId(nodeId);
    setSidebarTab("settings");
    toast.success(`Added: ${item.label}`);
  }, [edges, nodes, getNewNodePosition, setEdges, setNodes]);

  const handleSaveNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, config, isConfigured: true } } : n)));
    toast.success("Saved");
  }, [setNodes]);

  const handleDisconnectEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdgeId(null);
    toast.success("Disconnected");
  }, [setEdges]);

  const handleInsertOnEdge = useCallback((edgeId: string, sourceId: string, _targetId: string) => {
    console.log("[WF] handleInsertOnEdge", { edgeId, sourceId });

    // Update refs immediately to avoid first-click stale state
    const nextConnectFrom = { sourceNodeId: sourceId, sourceHandle: "default" } as any;
    connectFromRef.current = nextConnectFrom;
    selectedEdgeIdRef.current = edgeId;

    setConnectFrom(nextConnectFrom);
    setSidebarTab("actions");
    setSelectedNodeId(null);
    setSelectedEdgeId(edgeId);
    setSelectedTriggerId(null);
  }, []);

  const handleInsertBetween = useCallback(
    (parentNodeId: string, childNodeId: string, sourceHandle: string) => {
      console.log("[WF] handleInsertBetween", { parentNodeId, childNodeId, sourceHandle });

      if (parentNodeId === "__trigger__") {
        const nextConnectFrom = {
          sourceNodeId: "__trigger__",
          sourceHandle: "default" as any,
          insertBeforeNodeId: childNodeId,
        } as any;

        connectFromRef.current = nextConnectFrom;
        selectedEdgeIdRef.current = null;

        setConnectFrom(nextConnectFrom);
        setSidebarTab("actions");
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setSelectedTriggerId(null);
        return;
      }

      const edge = edges.find((e) => e.source === parentNodeId && e.target === childNodeId);
      console.log("[WF] handleInsertBetween edgeLookup", {
        found: Boolean(edge),
        edgeId: edge?.id,
      });

      if (edge) {
        handleInsertOnEdge(edge.id, parentNodeId, childNodeId);
      } else {
        const nextConnectFrom = {
          sourceNodeId: parentNodeId,
          sourceHandle: sourceHandle as any,
          insertBeforeNodeId: childNodeId,
        } as any;

        connectFromRef.current = nextConnectFrom;
        selectedEdgeIdRef.current = null;

        setConnectFrom(nextConnectFrom);
        setSidebarTab("actions");
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setSelectedTriggerId(null);
      }
    },
    [edges, handleInsertOnEdge]
  );

  // ✅ Save with icon conversion
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const cleanTriggers = triggers
        .filter((t) => t.actionType !== "trigger_placeholder")
        .map((t) => ({
          id: t.id,
          actionType: t.actionType,
          label: t.label,
          icon: getIconName(t.icon), // ✅ Convert
          color: t.color,
          config: t.config,
          isConfigured: t.isConfigured,
        }));

      console.log("💾 [SAVE] Preparing to save:");
      console.log("💾 [SAVE] Total triggers before filter:", triggers.length);
      console.log("💾 [SAVE] Clean triggers after filter:", cleanTriggers.length);
      console.log("💾 [SAVE] Triggers data:", JSON.stringify(cleanTriggers, null, 2));
      console.log("💾 [SAVE] Nodes count:", nodes.length);
      console.log("💾 [SAVE] Edges count:", edges.length);

      const nodesToSave = nodes.map((n) => ({
        id: n.id,
        type: n.type,
        position: n.position,
        data: {
          builderType: n.data.builderType,
          actionType: n.data.actionType,
          label: n.data.label,
          icon: getIconName(n.data.icon), // ✅ Convert
          color: n.data.color,
          config: n.data.config,
          isConfigured: n.data.isConfigured,
        },
      }));

      const savePayload = {
        workflowId,
        name: workflowName,
        status: workflowStatus,
        category: "general" as const,
        triggers: cleanTriggers as any,
        settings: wfSettings,
        nodes: nodesToSave as any,
        edges,
      };

      console.log("💾 [SAVE] Complete save payload:", JSON.stringify(savePayload, null, 2));

      const result = await saveDraft(savePayload);

      console.log("✅ [SAVE] Save result:", result);

      if (!workflowId) {
        setWorkflowId(result.workflow.id);
        navigate(`/workflows/builder/${result.workflow.id}`, { replace: true });
      }

      setHasUnsavedChanges(false);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 4000);

      toast.success("Workflow saved", {
        description: `Saved ${nodes.length} nodes / ${edges.length} edges / ${cleanTriggers.length} triggers`,
      });
    } catch (e: any) {
      console.error("❌ Save failed:", e);
      toast.error("Save failed", { description: e?.message || String(e) });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDismissSavedMessage = () => {
    setShowSavedMessage(false);
  };

  const handleTestWorkflow = () => {
    toast.info("Test workflow feature coming soon");
  };

  const persistNodeConfig = async () => {};
  const persistWorkflowSettings = async () => {};

  return (
    <div className="h-[calc(100dvh-64px)] overflow-hidden bg-background flex flex-col">
      <WorkflowHeader
        workflowName={workflowName}
        setWorkflowName={setWorkflowName}
        workflowStatus={workflowStatus}
        setWorkflowStatus={setWorkflowStatus}
        topTab={topTab}
        setTopTab={setTopTab}
        onBack={() => navigate("/workflows")}
        onSave={handleSave}
        onTestWorkflow={handleTestWorkflow}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        showSavedMessage={showSavedMessage}
        onDismissSavedMessage={handleDismissSavedMessage}
      />

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 flex flex-col min-w-0">
          {topTab === "builder" && (
            <WorkflowCanvas
              nodes={nodes}
              edges={edges}
              triggers={triggers}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onConnectStart={onConnectStart}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              selectedNodeId={selectedNodeId}
              selectedTriggerId={selectedTriggerId}
              setSelectedNodeId={setSelectedNodeId}
              setSelectedTriggerId={setSelectedTriggerId}
              setSelectedEdgeId={setSelectedEdgeId}
              setSidebarTab={setSidebarTab}
              setConnectFrom={setConnectFrom}
              setNodes={setNodes}
              setEdges={setEdges}
              isInteractive={isInteractive}
              setIsInteractive={setIsInteractive}
              onAddTriggerClick={handleAddTriggerClick}
              onTriggerClick={handleTriggerClick}
              onDeleteTrigger={(triggerId) => {
                const trigger = triggers.find(t => t.id === triggerId);
                if (trigger?.isConfigured) {
                  setTriggers((ts) => {
                    const filtered = ts.filter((t) => t.id !== triggerId);
                    if (filtered.length === 0 || filtered.every(t => t.isConfigured)) {
                      return [...filtered, createEmptyTrigger()];
                    }
                    return filtered;
                  });
                  setSelectedTriggerId(null);
                  toast.success("Trigger removed");
                }
              }}
              onAddActionClick={handleAddActionClick}
              onInsertOnEdge={handleInsertOnEdge}
              onInsertBetween={handleInsertBetween}
              onDeleteNode={(nodeId) => {
                setNodes((nds) => nds.filter((n) => n.id !== nodeId));
                setEdges((eds) => eds.filter((x) => x.source !== nodeId && x.target !== nodeId));
                setSelectedNodeId(null);
                toast.success("Node deleted");
              }}
              onDuplicateNode={(nodeId) => {
                const node = nodes.find((n) => n.id === nodeId);
                if (node) {
                  const newId = crypto.randomUUID();
                  const newNode: RFNode = {
                    ...node,
                    id: newId,
                    position: { x: node.position.x, y: node.position.y + 120 },
                    data: { ...node.data },
                  };
                  setNodes((nds) => [...nds, newNode]);
                  toast.success("Node duplicated");
                }
              }}
              reactFlowRef={reactFlowRef}
              canvasWrapRef={canvasWrapRef}
            />
          )}

          {topTab === "settings" && (
            <WorkflowSettingsPage settings={wfSettings} setSettings={setWfSettings} />
          )}

          {topTab === "history" && (
            <div className="flex-1 p-6 overflow-auto">
              <div className="text-center text-muted-foreground py-20">
                Enrollment History (connect to Supabase)
              </div>
            </div>
          )}

          {topTab === "logs" && (
            <div className="flex-1 p-6 overflow-auto">
              <div className="text-center text-muted-foreground py-20">
                Execution Logs (connect to Supabase)
              </div>
            </div>
          )}
        </div>

        {topTab === "builder" && (
          <WorkflowSidebar
            tab={sidebarTab}
            setTab={setSidebarTab}
            search={search}
            setSearch={setSearch}
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            selectedTrigger={selectedTrigger}
            settings={wfSettings}
            setSettings={setWfSettings}
            onAddNode={handleAddNode}
            onSelectTriggerType={handleSelectTriggerType}
            onSaveNodeConfig={handleSaveNodeConfig}
            onSaveTriggerConfig={handleSaveTriggerConfig}
            onPersistNodeConfig={persistNodeConfig}
            onPersistWorkflowSettings={persistWorkflowSettings}
            onDisconnectEdge={handleDisconnectEdge}
          />
        )}
      </div>
    </div>
  );
};

export default WorkflowBuilder;