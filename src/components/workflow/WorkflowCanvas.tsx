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
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { RFNode, RFEdge, RFNodeData, ConnectFrom, COLOR_HEX, SidebarTab, TriggerData, ColorKey } from "./types";
import { TriggerCard } from "./TriggerCard";
import { EndNode } from "./EndNode";
import { PlusButton } from "./PlusButton";

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
  const svgHeight = nodes.length > 0 ? 160 : 120; // Extend when nodes exist

  return (
    <div 
      ref={canvasWrapRef} 
      className="relative flex-1 min-h-0 bg-workflow-canvas"
      onDragOver={onDragOver}
    >
      {/* Trigger Row at Top */}
      <div ref={triggerRowRef} className="absolute top-6 left-0 right-0 z-10 flex justify-center">
        <div className="flex items-center gap-4">
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
      </div>

      {/* Connector lines from ALL triggers to flow - SVG */}
      {hasTriggers && triggerPositions.length > 0 && (
        <svg 
          className="absolute left-0 right-0 pointer-events-none z-[5]"
          style={{ 
            top: svgTop, 
            height: svgHeight,
            width: '100%'
          }}
        >
          {triggerPositions.length === 1 ? (
            // Single trigger: straight vertical line down
            <line
              x1={triggerPositions[0]}
              y1={0}
              x2={triggerPositions[0]}
              y2={svgHeight}
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />
          ) : (
            // Multiple triggers: each drops and merges to center
            <>
              {triggerPositions.map((startX, index) => {
                const dropDistance = 40;
                const horizontalY = dropDistance;
                const isLeftOfCenter = startX < mergePointX;
                const cornerRadius = 8;
                
                // Path: drop down, curve to horizontal, go to center line
                const path = `
                  M ${startX} 0
                  L ${startX} ${horizontalY - cornerRadius}
                  Q ${startX} ${horizontalY} ${isLeftOfCenter ? startX + cornerRadius : startX - cornerRadius} ${horizontalY}
                  L ${isLeftOfCenter ? mergePointX - cornerRadius : mergePointX + cornerRadius} ${horizontalY}
                  Q ${mergePointX} ${horizontalY} ${mergePointX} ${horizontalY + cornerRadius}
                `;

                return (
                  <path
                    key={index}
                    d={path}
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}
              
              {/* Center vertical line (merge line) continues down */}
              <line
                x1={mergePointX}
                y1={40 + 8} 
                x2={mergePointX}
                y2={svgHeight}
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
            </>
          )}
        </svg>
      )}

      {/* React Flow Canvas */}
      <div className="absolute inset-0 pt-56">
        <ReactFlow
          nodes={nodes}
          edges={edges.map(e => ({ ...e, type: "plusEdge" }))}
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
          nodesDraggable={isInteractive}
          nodesConnectable={isInteractive}
          elementsSelectable={isInteractive}
          panOnDrag={isInteractive}
          zoomOnScroll={isInteractive}
          zoomOnPinch={isInteractive}
          zoomOnDoubleClick={isInteractive}
          fitViewOptions={{ padding: 0.6, maxZoom: 0.75, minZoom: 0.08 }}
          defaultEdgeOptions={{
            type: "plusEdge",
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { strokeWidth: 2, stroke: "hsl(var(--border))" },
          }}
          onInit={(inst) => {
            reactFlowRef.current = inst;
          }}
          className="bg-transparent"
        >
          <Background gap={20} size={1} color="hsl(var(--border) / 0.5)" />
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
      </div>

      {/* Central Plus Button and END - show whenever triggers exist (configured or not) */}
      {hasTriggers && nodes.length === 0 && (
        <div className="absolute top-[216px] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <PlusButton onClick={() => onAddActionClick()} />
          <div className="w-px h-8 bg-border" />
          <EndNode />
        </div>
      )}

      {/* END node when there are flow nodes - shown after the last node in the flow */}
      {hasTriggers && nodes.length > 0 && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center pointer-events-auto">
          <EndNode />
        </div>
      )}
    </div>
  );
};