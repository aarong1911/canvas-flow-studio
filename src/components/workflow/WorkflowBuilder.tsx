import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addEdge, Connection, MarkerType, useEdgesState, useNodesState, ReactFlowInstance, OnConnectStartParams } from "reactflow";
import { toast } from "sonner";
import { Zap } from "lucide-react";

import { RFNode, RFEdge, RFNodeData, ConnectFrom, WorkflowSettings, SidebarTab, TopTab, NodeLibraryItem, BuilderNodeType, TriggerData } from "./types";
import { WorkflowHeader } from "./WorkflowHeader";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { WorkflowSidebar } from "./WorkflowSidebar";
import { TRIGGERS } from "./node-library";

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

// Get a default unconfigured trigger
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

export const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id: workflowIdParam } = useParams<{ id?: string }>();

  const [isInteractive, setIsInteractive] = useState(true);
  const [topTab, setTopTab] = useState<TopTab>("builder");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("triggers");
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [search, setSearch] = useState("");

  // Triggers are separate from the flow nodes
  const [triggers, setTriggers] = useState<TriggerData[]>([createEmptyTrigger()]);
  const [selectedTriggerId, setSelectedTriggerId] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<RFNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<{ label?: string }>([]);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<ConnectFrom>(null);
  const [wfSettings, setWfSettings] = useState<WorkflowSettings>(DEFAULT_SETTINGS);

  const reactFlowRef = useRef<ReactFlowInstance | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId) || null, [nodes, selectedNodeId]);
  const selectedEdge = useMemo(() => edges.find((e) => e.id === selectedEdgeId) || null, [edges, selectedEdgeId]);
  const selectedTrigger = useMemo(() => triggers.find((t) => t.id === selectedTriggerId) || null, [triggers, selectedTriggerId]);

  // Prevent page scroll
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
            // Ensure at least one empty trigger exists
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

  // Handle trigger click - select it and show triggers list in sidebar
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

  // Handle add trigger click - show triggers list
  const handleAddTriggerClick = useCallback(() => {
    // Find or create an empty trigger and select it
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

  // Handle selecting a trigger type from the library
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
          isConfigured: false, // Still needs to be saved
        };
      }
      return t;
    }));
    setSidebarTab("settings");
  }, [selectedTriggerId]);

  // Handle saving trigger configuration
  const handleSaveTriggerConfig = useCallback((triggerId: string, config: Record<string, any>) => {
    setTriggers((ts) => {
      const updated = ts.map((t) => {
        if (t.id === triggerId) {
          return { ...t, config, isConfigured: true };
        }
        return t;
      });
      
      // Add a new empty trigger slot if all are configured
      if (updated.every(t => t.isConfigured)) {
        return [...updated, createEmptyTrigger()];
      }
      return updated;
    });
    toast.success("Trigger saved");
  }, []);

  // Handle add action click
  const handleAddActionClick = useCallback((sourceNodeId?: string, sourceHandle?: string) => {
    if (sourceNodeId) {
      setConnectFrom({ sourceNodeId, sourceHandle: (sourceHandle as any) || "default" });
    }
    setSidebarTab("actions");
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    setSelectedTriggerId(null);
  }, []);

  // Get new node position - center nodes vertically in a column
  const getNewNodePosition = useCallback((sourceId?: string, sourceHandle?: ConnectFrom["sourceHandle"]) => {
    // Position at center x (0 in ReactFlow coords since we use fitView)
    // Stack nodes vertically with 120px spacing
    if (!sourceId) {
      if (nodes.length === 0) return { x: 0, y: 0 };
      const last = nodes[nodes.length - 1];
      return { x: 0, y: last.position.y + 120 };
    }
    const src = nodes.find((n) => n.id === sourceId);
    if (!src) return { x: 0, y: 0 };
    const base = { x: 0, y: src.position.y + 120 };
    if (sourceHandle === "yes") return { x: base.x - 260, y: base.y };
    if (sourceHandle === "no") return { x: base.x + 260, y: base.y };
    return base;
  }, [nodes]);

  // Handle adding an action node
  const handleAddNode = useCallback((item: NodeLibraryItem) => {
    const nodeId = crypto.randomUUID();
    const builderType = normalizeBuilderType(item.kind, item.id);
    const pos = getNewNodePosition(connectFrom?.sourceNodeId, connectFrom?.sourceHandle);

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

    // Check if we're inserting on an existing edge
    if (selectedEdgeId) {
      const edge = edges.find(e => e.id === selectedEdgeId);
      if (edge) {
        // Find source and target nodes to calculate insert position
        const sourceNode = nodes.find(n => n.id === edge.source);
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (sourceNode && targetNode) {
          // Position between source and target
          newNode.position = {
            x: (sourceNode.position.x + targetNode.position.x) / 2,
            y: (sourceNode.position.y + targetNode.position.y) / 2,
          };
        }

        setNodes((nds) => [...nds, newNode]);

        // Remove old edge and create two new edges
        setEdges((eds) => {
          const filtered = eds.filter(e => e.id !== selectedEdgeId);
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
        setSelectedNodeId(nodeId);
        setSidebarTab("settings");
        toast.success(`Inserted: ${item.label}`);
        return;
      }
    }

    setNodes((nds) => [...nds, newNode]);

    if (connectFrom) {
      setEdges((eds) => [...eds, {
        id: crypto.randomUUID(),
        source: connectFrom.sourceNodeId,
        target: nodeId,
        sourceHandle: connectFrom.sourceHandle,
        targetHandle: "in",
        type: "plusEdge",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 },
        label: connectFrom.sourceHandle === "yes" ? "Yes" : connectFrom.sourceHandle === "no" ? "No" : connectFrom.sourceHandle === "none" ? "None" : undefined,
      }]);
    }

    setConnectFrom(null);
    setSelectedNodeId(nodeId);
    setSidebarTab("settings");
    toast.success(`Added: ${item.label}`);
  }, [connectFrom, selectedEdgeId, edges, nodes, getNewNodePosition, setEdges, setNodes]);

  const handleSaveNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, config, isConfigured: true } } : n)));
    toast.success("Saved");
  }, [setNodes]);

  const handleDisconnectEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdgeId(null);
    toast.success("Disconnected");
  }, [setEdges]);

  // Handle inserting a node on an edge (clicking plus button on edge)
  const handleInsertOnEdge = useCallback((edgeId: string, sourceId: string, targetId: string) => {
    // Store the edge info for inserting a node
    setConnectFrom({ sourceNodeId: sourceId, sourceHandle: "default" });
    // Store edge info in a ref or state for later use when adding node
    // For now, just open the actions sidebar
    setSidebarTab("actions");
    setSelectedNodeId(null);
    setSelectedEdgeId(edgeId);
    setSelectedTriggerId(null);
  }, []);

  // Stub functions for save/publish
  const handleSave = async () => { toast.success("Draft saved (demo)"); };
  const handlePublish = async () => { toast.success("Published (demo)"); };
  const persistNodeConfig = async () => {};
  const persistWorkflowSettings = async () => {};

  return (
    <div className="h-dvh overflow-hidden bg-background flex">
      <div className="flex-1 flex flex-col min-w-0">
        <WorkflowHeader
          workflowName={workflowName}
          setWorkflowName={setWorkflowName}
          workflowStatus="draft"
          topTab={topTab}
          setTopTab={setTopTab}
          onBack={() => navigate("/")}
          onSave={handleSave}
          onPublish={handlePublish}
        />

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
            onAddActionClick={handleAddActionClick}
            onInsertOnEdge={handleInsertOnEdge}
            reactFlowRef={reactFlowRef}
            canvasWrapRef={canvasWrapRef}
          />
        )}

        {topTab !== "builder" && (
          <div className="flex-1 p-6 overflow-auto">
            <div className="text-center text-muted-foreground py-20">
              {topTab === "settings" && "Workflow Settings (connect to Supabase)"}
              {topTab === "history" && "Enrollment History (connect to Supabase)"}
              {topTab === "logs" && "Execution Logs (connect to Supabase)"}
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
  );
};

export default WorkflowBuilder;