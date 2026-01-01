import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  MarkerType,
  NodeProps,
  ReactFlowInstance,
  OnConnectStartParams,
  Handle,
  Position,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, MoreHorizontal, ZoomIn, ZoomOut, Maximize, Lock, Unlock, Trash2, Copy, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { RFNode, RFEdge, RFNodeData, ConnectFrom, COLOR_HEX, SidebarTab, TriggerData, ColorKey } from "./types";
import { TriggerCard } from "./TriggerCard";
import { EndNode } from "./EndNode";
import { PlusButton } from "./PlusButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkflowCanvasProps {
  nodes: RFNode[];
  edges: RFEdge[];
  triggers: TriggerData[];
  onNodesChange: any;
  onEdgesChange: any;
  onConnect: (connection: Connection) => void;
  onConnectStart: (_: any, params: OnConnectStartParams) => void;
  onNodeClick: (_e: any, node: RFNode) => void;
  onEdgeClick: (_e: any, edge: RFEdge) => void;
  onPaneClick: () => void;
  selectedNodeId: string | null;
  selectedTriggerId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedTriggerId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setConnectFrom: (from: ConnectFrom) => void;
  setNodes: React.Dispatch<React.SetStateAction<RFNode[]>>;
  setEdges: React.Dispatch<React.SetStateAction<RFEdge[]>>;
  isInteractive: boolean;
  setIsInteractive: (interactive: boolean) => void;
  onAddTriggerClick: () => void;
  onTriggerClick: (triggerId: string) => void;
  onAddActionClick: (sourceNodeId?: string, sourceHandle?: string) => void;
  onInsertOnEdge: (edgeId: string, sourceId: string, targetId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  reactFlowRef: React.MutableRefObject<ReactFlowInstance | null>;
  canvasWrapRef: React.RefObject<HTMLDivElement>;
}

const minimapNodeColor = (n: RFNode) => {
  const key = n?.data?.color ?? "gray";
  return COLOR_HEX[key];
};

// Color classes for action node icons
const colorIconClasses: Record<ColorKey, string> = {
  purple: "bg-purple-100 text-purple-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  amber: "bg-amber-100 text-amber-600",
  orange: "bg-orange-100 text-orange-600",
  gray: "bg-gray-100 text-gray-600",
};

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  nodes,
  edges,
  triggers,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onConnectStart,
  onNodeClick,
  onEdgeClick,
  onPaneClick,
  selectedNodeId,
  selectedTriggerId,
  setSelectedNodeId,
  setSelectedTriggerId,
  setSelectedEdgeId,
  setSidebarTab,
  setConnectFrom,
  setNodes,
  setEdges,
  isInteractive,
  setIsInteractive,
  onAddTriggerClick,
  onTriggerClick,
  onAddActionClick,
  onInsertOnEdge,
  onDeleteNode,
  onDuplicateNode,
  reactFlowRef,
  canvasWrapRef,
}) => {
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Create custom node component
  const nodeTypes = useMemo(() => {
    return {
      workflowNode: (p: NodeProps<RFNodeData>) => {
        const Icon = p.data.icon;
        const isCondition = p.data.builderType === "condition";
        // Check if this node has outgoing edges (is it a leaf node?)
        const hasOutgoingEdge = edges.some(e => e.source === p.id);
        
        return (
          <div className="relative group">
            {/* Target Handle */}
            <Handle
              type="target"
              position={Position.Top}
              id="in"
              className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
            />

            {/* Node Card */}
            <div
              onClick={() => {
                setSelectedEdgeId(null);
                setSelectedTriggerId(null);
                setSelectedNodeId(p.id);
                setSidebarTab("settings");
              }}
              className={cn(
                "relative bg-card border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200",
                "min-w-[220px] max-w-[280px]",
                "shadow-sm hover:shadow-md",
                p.selected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  colorIconClasses[p.data.color]
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {p.data.config?.action_name || p.data.label}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="p-1.5 hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Source Handles */}
            {isCondition ? (
              <>
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id="yes"
                  className="!w-3 !h-3 !bg-green-500 !border-2 !border-background"
                  style={{ left: "25%" }}
                />
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id="no"
                  className="!w-3 !h-3 !bg-red-500 !border-2 !border-background"
                  style={{ left: "50%" }}
                />
                <Handle
                  type="source"
                  position={Position.Bottom}
                  id="none"
                  className="!w-3 !h-3 !bg-gray-500 !border-2 !border-background"
                  style={{ left: "75%" }}
                />
              </>
            ) : (
              <Handle
                type="source"
                position={Position.Bottom}
                id="default"
                className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
              />
            )}

            {/* Plus button below leaf nodes (nodes without outgoing edges) */}
            {!hasOutgoingEdge && !isCondition && (
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-px h-4 bg-border" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddActionClick(p.id, "default");
                  }}
                  className={cn(
                    "w-6 h-6 rounded-full bg-card border border-border shadow-sm",
                    "flex items-center justify-center",
                    "hover:bg-primary hover:border-primary",
                    "transition-all duration-200 group/plus cursor-pointer"
                  )}
                >
                  <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover/plus:text-primary-foreground" />
                </button>
              </div>
            )}
          </div>
        );
      },
      // Placeholder node for "Please select action"
      placeholderNode: (p: NodeProps<{ onAddAction: () => void }>) => (
        <div className="relative">
          <Handle
            type="target"
            position={Position.Top}
            id="in"
            className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
          />
          <div
            onClick={() => p.data.onAddAction()}
            className={cn(
              "bg-muted/50 border border-dashed border-muted-foreground/30 rounded-xl px-6 py-3 cursor-pointer transition-all duration-200",
              "min-w-[200px]",
              "hover:bg-muted hover:border-muted-foreground/50",
              "flex items-center justify-center"
            )}
          >
            <span className="text-sm text-muted-foreground">Please select action</span>
          </div>
        </div>
      ),
      // Plus button node
      plusNode: (p: NodeProps<{ onAdd: () => void }>) => (
        <div className="relative">
          <Handle
            type="target"
            position={Position.Top}
            id="in"
            className="!w-0 !h-0 !opacity-0"
          />
          <button
            onClick={() => p.data.onAdd()}
            className={cn(
              "w-6 h-6 rounded-full bg-card border border-border shadow-sm",
              "flex items-center justify-center",
              "hover:bg-primary hover:border-primary hover:text-primary-foreground",
              "transition-all duration-200 group"
            )}
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary-foreground" />
          </button>
          <Handle
            type="source"
            position={Position.Bottom}
            id="default"
            className="!w-0 !h-0 !opacity-0"
          />
        </div>
      ),
      // End node
      endNode: () => (
        <div className="relative">
          <Handle
            type="target"
            position={Position.Top}
            id="in"
            className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
          />
          <div className={cn(
            "bg-muted border border-border rounded-full px-4 py-1.5",
            "text-xs font-medium text-muted-foreground uppercase tracking-wide",
            "shadow-sm"
          )}>
            END
          </div>
        </div>
      ),
    };
  }, [edges, setSelectedNodeId, setSelectedEdgeId, setSelectedTriggerId, setSidebarTab, onAddActionClick]);

  // Custom edge with plus button
  const edgeTypes = useMemo(() => {
    return {
      plusEdge: (props: EdgeProps) => {
        const [edgePath, labelX, labelY] = getSmoothStepPath({
          sourceX: props.sourceX,
          sourceY: props.sourceY,
          sourcePosition: props.sourcePosition,
          targetX: props.targetX,
          targetY: props.targetY,
          targetPosition: props.targetPosition,
        });

        return (
          <>
            <path
              id={props.id}
              style={props.style}
              className="react-flow__edge-path"
              d={edgePath}
              markerEnd={props.markerEnd}
            />
            {/* Plus button in the middle of the edge */}
            <foreignObject
              width={24}
              height={24}
              x={labelX - 12}
              y={labelY - 12}
              className="overflow-visible"
              requiredExtensions="http://www.w3.org/1999/xhtml"
            >
              <div className="flex items-center justify-center w-6 h-6">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInsertOnEdge(props.id, props.source, props.target);
                  }}
                  className={cn(
                    "w-6 h-6 rounded-full bg-card border border-border shadow-sm",
                    "flex items-center justify-center",
                    "hover:bg-primary hover:border-primary",
                    "transition-all duration-200 group cursor-pointer"
                  )}
                >
                  <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary-foreground" />
                </button>
              </div>
            </foreignObject>
          </>
        );
      },
    };
  }, [onInsertOnEdge]);

  // Check triggers
  const configuredTriggers = triggers.filter(t => t.isConfigured);
  const hasConfiguredTriggers = configuredTriggers.length > 0;
  const hasTriggers = triggers.length > 0;

  // Track trigger card positions for connector lines
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const [triggerPositions, setTriggerPositions] = useState<number[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {
    const updatePositions = () => {
      if (!triggerRowRef.current || !canvasWrapRef.current) return;

      // Get ALL trigger cards (not just configured ones)
      const cards = triggerRowRef.current.querySelectorAll('[data-trigger-card="true"]');
      const canvasRect = canvasWrapRef.current.getBoundingClientRect();
      
      const positions: number[] = [];
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        // Get center X relative to canvas
        const centerX = rect.left - canvasRect.left + rect.width / 2;
        positions.push(centerX);
      });

      setTriggerPositions(positions);
      setCanvasWidth(canvasRect.width);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    
    // Update after a small delay to ensure DOM is ready
    const timeout = setTimeout(updatePositions, 50);
    
    return () => {
      window.removeEventListener('resize', updatePositions);
      clearTimeout(timeout);
    };
  }, [triggers, canvasWrapRef]);

  // Calculate merge point (center of canvas)
  const mergePointX = canvasWidth / 2;
  const svgTop = 96; // Top of trigger cards + card height
  const triggerMergeHeight = 120; // Height for trigger merge lines to plus button

  // Handle zoom controls
  const handleZoomIn = () => {
    reactFlowRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    reactFlowRef.current?.zoomOut();
  };

  const handleFitView = () => {
    reactFlowRef.current?.fitView({ padding: 0.2 });
  };

  return (
    <div 
      ref={canvasWrapRef} 
      className="relative flex-1 min-h-0 bg-workflow-canvas"
      onDragOver={onDragOver}
    >
      {/* React Flow Canvas - Main interactive canvas */}
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
        edgeTypes={edgeTypes}
        deleteKeyCode={null}
        onInit={(instance) => {
          reactFlowRef.current = instance;
        }}
        panOnDrag={isInteractive}
        zoomOnScroll={isInteractive}
        zoomOnPinch={isInteractive}
        zoomOnDoubleClick={isInteractive}
        nodesDraggable={isInteractive}
        nodesConnectable={isInteractive}
        elementsSelectable={true}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background gap={20} size={1} color="hsl(var(--border))" />
        
        {/* Trigger Row at Top - as a Panel */}
        <Panel position="top-center" className="!top-6">
          <div ref={triggerRowRef} className="flex items-center gap-4">
            {triggers.map((trigger) => (
              <TriggerCard
                key={trigger.id}
                id={trigger.id}
                label="Trigger"
                sublabel={trigger.isConfigured ? trigger.config?.trigger_name || trigger.label : trigger.label}
                icon={trigger.icon}
                color={trigger.color}
                isConfigured={trigger.isConfigured}
                selected={selectedTriggerId === trigger.id}
                onClick={() => onTriggerClick(trigger.id)}
              />
            ))}
          </div>
        </Panel>

        {/* Control Buttons - Bottom Left */}
        <Panel position="bottom-left" className="!bottom-4 !left-4">
          <div className="flex flex-col gap-1 bg-background border rounded-lg shadow-md p-1">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={handleFitView}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Fit View"
            >
              <Maximize className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => setIsInteractive(!isInteractive)}
              className={cn(
                "p-2 hover:bg-muted rounded transition-colors",
                !isInteractive && "bg-muted"
              )}
              title={isInteractive ? "Lock Canvas" : "Unlock Canvas"}
            >
              {isInteractive ? (
                <Unlock className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>
        </Panel>

        {/* Mini Map - Bottom Right */}
        <MiniMap 
          nodeColor={minimapNodeColor}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="!bg-background !border !rounded-lg !shadow-md"
          style={{ width: 180, height: 120 }}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
};