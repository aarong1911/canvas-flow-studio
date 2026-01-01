import React, { useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  MarkerType,
  NodeProps,
  ReactFlowInstance,
  OnConnectStartParams,
} from "reactflow";
import "reactflow/dist/style.css";
import { Zap, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RFNode, RFEdge, RFNodeData, ConnectFrom, COLOR_HEX, SidebarTab, NodeLibraryItem, BuilderNodeType } from "./types";
import { WorkflowNodeCard } from "./WorkflowNodeCard";

interface WorkflowCanvasProps {
  nodes: RFNode[];
  edges: RFEdge[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (connection: Connection) => void;
  onConnectStart: (_: any, params: OnConnectStartParams) => void;
  onNodeClick: (_e: any, node: RFNode) => void;
  onEdgeClick: (_e: any, edge: RFEdge) => void;
  onPaneClick: () => void;
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setConnectFrom: (from: ConnectFrom) => void;
  setNodes: React.Dispatch<React.SetStateAction<RFNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<RFEdge[]>>;
  isInteractive: boolean;
  setIsInteractive: (interactive: boolean) => void;
  onAddTriggerClick: () => void;
  reactFlowRef: React.MutableRefObject<ReactFlowInstance | null>;
  canvasWrapRef: React.RefObject<HTMLDivElement>;
}

const minimapNodeColor = (n: RFNode) => {
  const key = n?.data?.color ?? "gray";
  return COLOR_HEX[key];
};

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

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onConnectStart,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  selectedNodeId,
  setSelectedNodeId,
  setSelectedEdgeId,
  setSidebarTab,
  setConnectFrom,
  setNodes,
  setEdges,
  isInteractive,
  setIsInteractive,
  onAddTriggerClick,
  reactFlowRef,
  canvasWrapRef,
}) => {
  // Handle drop from sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Auto-connect proximity threshold (in flow coordinates)
  const AUTO_CONNECT_THRESHOLD = 150;

  // Find nearest node to connect from (prefers nodes without outgoing edges)
  const findNearestNodeToConnect = useCallback(
    (dropPosition: { x: number; y: number }, excludeId?: string): RFNode | null => {
      let nearestNode: RFNode | null = null;
      let minDistance = AUTO_CONNECT_THRESHOLD;

      for (const node of nodes) {
        if (excludeId && node.id === excludeId) continue;

        // Calculate distance from drop position to node's bottom center
        const nodeBottomY = node.position.y + 120; // Approximate node height
        const nodeCenterX = node.position.x + 140; // Approximate half node width

        const distance = Math.sqrt(
          Math.pow(dropPosition.x - nodeCenterX, 2) +
          Math.pow(dropPosition.y - nodeBottomY, 2)
        );

        // Prefer connecting below existing nodes (drop position should be below)
        const isBelow = dropPosition.y > node.position.y + 50;

        if (distance < minDistance && isBelow) {
          // Check if this node already has an outgoing edge (for non-condition nodes)
          const hasOutgoingEdge = edges.some((e) => e.source === node.id);
          const isCondition = node.data.builderType === "condition";

          // Conditions can have multiple outputs (yes/no/none), others prefer no existing edge
          if (isCondition || !hasOutgoingEdge) {
            minDistance = distance;
            nearestNode = node;
          }
        }
      }

      return nearestNode;
    },
    [nodes, edges]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;

      const item: NodeLibraryItem = JSON.parse(data);
      const reactFlowBounds = canvasWrapRef.current?.getBoundingClientRect();
      const instance = reactFlowRef.current;

      if (!reactFlowBounds || !instance) return;

      // Check for duplicate trigger
      if (item.kind === "trigger" && nodes.some((n) => n.data.builderType === "trigger")) {
        toast.error("This workflow already has a trigger. Delete it first.");
        return;
      }

      // Calculate drop position in flow coordinates
      const position = instance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeId = crypto.randomUUID();
      const builderType = normalizeBuilderType(item.kind, item.id);

      const newNode: RFNode = {
        id: nodeId,
        type: "workflowNode",
        position,
        data: {
          builderType,
          actionType: normalizeActionType(item.id),
          label: item.label,
          icon: item.icon,
          color: item.color,
          config: {},
        },
      };

      // Find nearest node for auto-connect
      const nearestNode = findNearestNodeToConnect(position, nodeId);

      setNodes((nds) => [...nds, newNode]);

      // Auto-create edge if near an existing node
      if (nearestNode) {
        const newEdge: RFEdge = {
          id: `e-${nearestNode.id}-${nodeId}`,
          source: nearestNode.id,
          target: nodeId,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2, stroke: "hsl(var(--workflow-connector))" },
        };
        setEdges((eds) => [...eds, newEdge]);
        toast.success(`Added: ${item.label} (connected to ${nearestNode.data.label})`);
      } else {
        toast.success(`Added: ${item.label}`);
      }

      setSelectedNodeId(nodeId);
      setSidebarTab("settings");
    },
    [nodes, edges, setNodes, setEdges, setSelectedNodeId, setSidebarTab, canvasWrapRef, reactFlowRef, findNearestNodeToConnect]
  );

  const nodeTypes = React.useMemo(() => {
    return {
      workflowNode: (p: NodeProps<RFNodeData>) => (
        <WorkflowNodeCard
          {...p}
          onSelectNode={(id) => {
            setSelectedEdgeId(null);
            setSelectedNodeId(id);
            setSidebarTab("settings");
          }}
          onDeleteNode={(id) => {
            setNodes((nds) => nds.filter((n) => n.id !== id));
            setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
            if (selectedNodeId === id) setSelectedNodeId(null);
          }}
          onAddAfter={(from) => {
            setConnectFrom(from);
            setSidebarTab("nodes");
          }}
        />
      ),
    };
  }, [selectedNodeId, setEdges, setNodes, setSelectedNodeId, setSelectedEdgeId, setSidebarTab, setConnectFrom]);

  const hasTrigger = nodes.some((n) => n.data.builderType === "trigger");

  return (
    <div 
      ref={canvasWrapRef} 
      className="relative flex-1 min-h-0 bg-workflow-canvas"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        deleteKeyCode={null}
        nodesDraggable={isInteractive}
        nodesConnectable={isInteractive}
        elementsSelectable={isInteractive}
        panOnDrag={isInteractive}
        zoomOnScroll={isInteractive}
        zoomOnPinch={isInteractive}
        zoomOnDoubleClick={isInteractive}
        fitViewOptions={{ padding: 0.6, maxZoom: 0.75, minZoom: 0.08 }}
        defaultEdgeOptions={{
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { strokeWidth: 2, stroke: "hsl(var(--workflow-connector))" },
        }}
        onInit={(inst) => {
          reactFlowRef.current = inst;
        }}
        className="bg-workflow-canvas"
      >
        <Background gap={20} size={1} color="hsl(var(--border))" />
        <Controls
          position="bottom-left"
          showInteractive
          onInteractiveChange={setIsInteractive}
          className="!left-4 !bottom-20 !bg-card !border !border-border !rounded-lg !shadow-lg"
        />
        <MiniMap
          position="bottom-right"
          style={{ bottom: 80, right: 16 }}
          nodeStrokeWidth={2}
          nodeColor={minimapNodeColor}
          nodeStrokeColor={() => "#94a3b8"}
          maskColor="rgba(0,0,0,0.06)"
          pannable
          zoomable
          className="!bg-card !border !border-border !rounded-lg"
        />
      </ReactFlow>

      {/* Empty State / Add Trigger Button */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-card border-2 border-dashed border-primary/30 rounded-2xl p-10 shadow-lg text-center max-w-md pointer-events-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div className="text-xl font-bold text-foreground mb-2">Start building your workflow</div>
            <div className="text-sm text-muted-foreground mb-6">
              Add a trigger to start, then connect actions to automate your process.
            </div>
            <button
              onClick={onAddTriggerClick}
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "shadow-lg hover:shadow-xl"
              )}
            >
              <Plus className="w-5 h-5" />
              Add Workflow Trigger
            </button>
          </div>
        </div>
      )}

      {/* Floating Add Trigger Button (when no trigger exists but has other nodes) */}
      {nodes.length > 0 && !hasTrigger && (
        <button
          onClick={onAddTriggerClick}
          className={cn(
            "absolute top-4 left-1/2 -translate-x-1/2 z-10",
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all",
            "bg-purple-500 text-white hover:bg-purple-600",
            "shadow-lg hover:shadow-xl border-2 border-purple-400"
          )}
        >
          <Plus className="w-4 h-4" />
          Add Trigger
        </button>
      )}
    </div>
  );
};
