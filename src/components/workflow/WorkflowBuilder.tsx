import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addEdge, Connection, MarkerType, useEdgesState, useNodesState, ReactFlowInstance, OnConnectStartParams } from "reactflow";
import { toast } from "sonner";
import { Zap } from "lucide-react";

import { RFNode, RFEdge, RFNodeData, ConnectFrom, WorkflowSettings, SidebarTab, TopTab, NodeLibraryItem, BuilderNodeType, TriggerData } from "./types";
import { WorkflowHeader } from "./WorkflowHeader";
import { WorkflowCanvas } from "./WorkflowCanvas";
import { WorkflowSidebar } from "./WorkflowSidebar";
import { WorkflowSettingsPage } from "./WorkflowSettingsPage";
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
  const [workflowStatus, setWorkflowStatus] = useState<"draft" | "active">("draft");
  const [search, setSearch] = useState("");

  // Track unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

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

  // Track if initial load is done to avoid showing unsaved on mount
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize after first render
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Mark changes as unsaved when things change (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      setHasUnsavedChanges(true);
    }
  }, [triggers, nodes, edges, wfSettings, workflowName, isInitialized]);

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
    const base = { x: 0, y: src.position.y + 180 };
    
    // Handle legacy yes/no handles
    if (sourceHandle === "yes") return { x: base.x - 260, y: base.y };
    if (sourceHandle === "no") return { x: base.x + 260, y: base.y };
    
    // Handle branch-based handles (branch_0, branch_1, etc. and none)
    if (sourceHandle?.startsWith("branch_") || sourceHandle === "none") {
      const branches = src.data.config?.branches || [];
      const showNoneBranch = src.data.config?.showNoneBranch !== false;
      const totalBranches = branches.length + (showNoneBranch ? 1 : 0);
      
      let branchIndex: number;
      if (sourceHandle === "none") {
        branchIndex = branches.length; // None is always last
      } else {
        branchIndex = parseInt(sourceHandle.replace("branch_", ""), 10);
      }
      
      // Calculate x offset based on branch position
      const branchWidth = 220;
      const totalWidth = totalBranches * branchWidth;
      const startX = -totalWidth / 2 + branchWidth / 2;
      const xOffset = startX + branchIndex * branchWidth;
      
      return { x: xOffset, y: base.y };
    }
    
    return base;
  }, [nodes]);

  // Handle adding an action node
  const handleAddNode = useCallback((item: NodeLibraryItem) => {
    const nodeId = crypto.randomUUID();
    const builderType = normalizeBuilderType(item.kind, item.id);
    const insertBeforeNodeId = (connectFrom as any)?.insertBeforeNodeId;
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

    // Check if we're inserting between two nodes in the main column (no edge exists)
    if (insertBeforeNodeId) {
      const targetNode = nodes.find(n => n.id === insertBeforeNodeId);
      
      // Handle special case: inserting before first node (source is __trigger__)
      if (connectFrom?.sourceNodeId === "__trigger__") {
        if (targetNode) {
          // Position above the first node
          newNode.position = {
            x: targetNode.position.x,
            y: targetNode.position.y - 120,
          };
        }
        
        // Insert at the beginning of nodes array
        setNodes((nds) => [newNode, ...nds]);
        
        setConnectFrom(null);
        setSelectedNodeId(nodeId);
        setSidebarTab("settings");
        toast.success(`Inserted: ${item.label}`);
        return;
      }
      
      const sourceNode = nodes.find(n => n.id === connectFrom?.sourceNodeId);
      
      if (sourceNode && targetNode) {
        // Position between the two nodes
        newNode.position = {
          x: (sourceNode.position.x + targetNode.position.x) / 2,
          y: (sourceNode.position.y + targetNode.position.y) / 2,
        };
      }
      
      // Insert the new node at the correct position in the nodes array
      setNodes((nds) => {
        const targetIndex = nds.findIndex(n => n.id === insertBeforeNodeId);
        if (targetIndex === -1) return [...nds, newNode];
        const newNodes = [...nds];
        newNodes.splice(targetIndex, 0, newNode);
        return newNodes;
      });
      
      setConnectFrom(null);
      setSelectedNodeId(nodeId);
      setSidebarTab("settings");
      toast.success(`Inserted: ${item.label}`);
      return;
    }

    // Regular add - add to end or after source
    setNodes((nds) => [...nds, newNode]);

    if (connectFrom) {
      // Get branch label for edge
      let edgeLabel: string | undefined;
      if (connectFrom.sourceHandle === "yes") edgeLabel = "Yes";
      else if (connectFrom.sourceHandle === "no") edgeLabel = "No";
      else if (connectFrom.sourceHandle === "none") edgeLabel = "None";
      else if (connectFrom.sourceHandle?.startsWith("branch_")) {
        const srcNode = nodes.find(n => n.id === connectFrom.sourceNodeId);
        const branchIdx = parseInt(connectFrom.sourceHandle.replace("branch_", ""), 10);
        const branch = srcNode?.data.config?.branches?.[branchIdx];
        edgeLabel = branch?.name || `Branch ${branchIdx + 1}`;
      }
      
      setEdges((eds) => [...eds, {
        id: crypto.randomUUID(),
        source: connectFrom.sourceNodeId,
        target: nodeId,
        sourceHandle: connectFrom.sourceHandle,
        targetHandle: "in",
        type: "plusEdge",
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 },
        label: edgeLabel,
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

  // Handle inserting a node between two existing nodes (clicking plus button between nodes)
  const handleInsertBetween = useCallback((parentNodeId: string, childNodeId: string, sourceHandle: string) => {
    // Special case: inserting before first node (parentNodeId is "__trigger__")
    if (parentNodeId === "__trigger__") {
      setConnectFrom({ 
        sourceNodeId: "__trigger__", 
        sourceHandle: "default" as any,
        insertBeforeNodeId: childNodeId
      } as any);
      setSidebarTab("actions");
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setSelectedTriggerId(null);
      return;
    }
    
    // Find the edge between parent and child
    const edge = edges.find(e => e.source === parentNodeId && e.target === childNodeId);
    if (edge) {
      // Use the existing edge insert logic
      handleInsertOnEdge(edge.id, parentNodeId, childNodeId);
    } else {
      // No edge exists between these nodes - we need to insert between them in the visual order
      // Create a special state that tells handleAddNode to insert between these nodes
      setConnectFrom({ 
        sourceNodeId: parentNodeId, 
        sourceHandle: sourceHandle as any,
        insertBeforeNodeId: childNodeId  // Custom property to track insertion point
      } as any);
      setSidebarTab("actions");
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setSelectedTriggerId(null);
    }
  }, [edges, handleInsertOnEdge]);

  // Save workflow
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasUnsavedChanges(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 4000);
  };

  const handleDismissSavedMessage = () => {
    setShowSavedMessage(false);
  };

  // Test workflow
  const handleTestWorkflow = () => {
    toast.info("Test workflow feature coming soon");
  };

  const persistNodeConfig = async () => {};
  const persistWorkflowSettings = async () => {};

  return (
    <div className="h-[calc(100dvh-64px)] overflow-hidden bg-background flex flex-col">
      {/* Full-width header */}
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

      {/* Content area with sidebar */}
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