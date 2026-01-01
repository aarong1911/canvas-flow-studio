import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addEdge, Connection, MarkerType, useEdgesState, useNodesState, ReactFlowInstance, OnConnectStartParams } from "reactflow";
import { toast } from "sonner";

import { RFNode, RFEdge, RFNodeData, ConnectFrom, WorkflowSettings, SidebarTab, TopTab, NodeLibraryItem, BuilderNodeType } from "./types";
import { WorkflowHeader } from "./WorkflowHeader";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { WorkflowSidebar } from "./WorkflowSidebar";

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

export const WorkflowBuilder: React.FC = () => {
  const navigate = useNavigate();
  const { id: workflowIdParam } = useParams<{ id?: string }>();

  const [isInteractive, setIsInteractive] = useState(true);
  const [topTab, setTopTab] = useState<TopTab>("builder");
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("nodes");
  const [workflowName, setWorkflowName] = useState("Untitled Workflow");
  const [search, setSearch] = useState("");

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
    setSelectedNodeId(node.id);
    setSidebarTab("settings");
  }, []);

  const onEdgeClick = useCallback((_e: any, edge: RFEdge) => {
    setSelectedNodeId(null);
    setSelectedEdgeId(edge.id);
    setSidebarTab("settings");
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
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
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedEdgeId, selectedNodeId, setEdges, setNodes]);

  // Add node handler
  const getNewNodePosition = useCallback((sourceId?: string, sourceHandle?: ConnectFrom["sourceHandle"]) => {
    if (!sourceId) {
      if (nodes.length === 0) return { x: 400, y: 80 };
      const last = nodes[nodes.length - 1];
      return { x: last.position.x, y: last.position.y + 180 };
    }
    const src = nodes.find((n) => n.id === sourceId);
    if (!src) return { x: 300, y: 120 };
    const base = { x: src.position.x, y: src.position.y + 190 };
    if (sourceHandle === "yes") return { x: base.x - 260, y: base.y };
    if (sourceHandle === "no") return { x: base.x + 260, y: base.y };
    return base;
  }, [nodes]);

  const handleAddNode = useCallback((item: NodeLibraryItem) => {
    if (item.kind === "trigger" && nodes.some((n) => n.data.builderType === "trigger")) {
      toast.error("This workflow already has a trigger. Delete it first.");
      return;
    }

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
      },
    };

    setNodes((nds) => [...nds, newNode]);

    if (connectFrom && item.kind !== "trigger") {
      setEdges((eds) => [...eds, {
        id: crypto.randomUUID(),
        source: connectFrom.sourceNodeId,
        target: nodeId,
        sourceHandle: connectFrom.sourceHandle,
        targetHandle: "in",
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 },
        label: connectFrom.sourceHandle === "yes" ? "Yes" : connectFrom.sourceHandle === "no" ? "No" : connectFrom.sourceHandle === "none" ? "None" : undefined,
      }]);
    }

    setConnectFrom(null);
    setSelectedNodeId(nodeId);
    setSidebarTab("settings");
    toast.success(`Added: ${item.label}`);
  }, [connectFrom, getNewNodePosition, setEdges, setNodes, nodes]);

  const handleSaveNodeConfig = useCallback((nodeId: string, config: Record<string, any>) => {
    setNodes((nds) => nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, config } } : n)));
  }, [setNodes]);

  const handleDisconnectEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    setSelectedEdgeId(null);
    toast.success("Disconnected");
  }, [setEdges]);

  // Stub functions for save/publish (would integrate with Supabase)
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onConnectStart={onConnectStart}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            selectedNodeId={selectedNodeId}
            setSelectedNodeId={setSelectedNodeId}
            setSelectedEdgeId={setSelectedEdgeId}
            setSidebarTab={setSidebarTab}
            setConnectFrom={setConnectFrom}
            setNodes={setNodes}
            setEdges={setEdges}
            isInteractive={isInteractive}
            setIsInteractive={setIsInteractive}
            onAddTriggerClick={() => setSidebarTab("nodes")}
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
          settings={wfSettings}
          setSettings={setWfSettings}
          onAddNode={handleAddNode}
          onSaveNodeConfig={handleSaveNodeConfig}
          onPersistNodeConfig={persistNodeConfig}
          onPersistWorkflowSettings={persistWorkflowSettings}
          onDisconnectEdge={handleDisconnectEdge}
        />
      )}
    </div>
  );
};

export default WorkflowBuilder;
