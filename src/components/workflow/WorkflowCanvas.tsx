import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
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
  Panel,
  ReactFlowProvider,
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
        const hasOutgoingEdge = edges.some(e => e.source === p.id);
        
        return (
          <div className="relative group">
            <Handle
              type="target"
              position={Position.Top}
              id="in"
              className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
            />

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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-background">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(p.id);
                      setSidebarTab("settings");
                    }}>
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateNode?.(p.id);
                    }}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNode(p.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

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
      triggerNode: (p: NodeProps<{ trigger: TriggerData; selected: boolean; onClick: () => void }>) => {
        const trigger = p.data.trigger;
        return (
          <div className="relative">
            <TriggerCard
              id={trigger.id}
              label="Trigger"
              sublabel={trigger.isConfigured ? trigger.config?.trigger_name || trigger.label : trigger.label}
              icon={trigger.icon}
              color={trigger.color}
              isConfigured={trigger.isConfigured}
              selected={p.data.selected}
              onClick={p.data.onClick}
            />
            <Handle
              type="source"
              position={Position.Bottom}
              id="default"
              className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
            />
          </div>
        );
      },
      plusNode: (p: NodeProps<{ onAdd: () => void }>) => (
        <div className="relative">
          <Handle
            type="target"
            position={Position.Top}
            id="in"
            className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
          />
          <button
            onClick={() => p.data.onAdd()}
            className={cn(
              "w-8 h-8 rounded-full bg-card border-2 border-dashed border-border shadow-sm",
              "flex items-center justify-center",
              "hover:bg-primary hover:border-primary hover:border-solid hover:text-primary-foreground",
              "transition-all duration-200 group"
            )}
          >
            <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary-foreground" />
          </button>
          <Handle
            type="source"
            position={Position.Bottom}
            id="default"
            className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
          />
        </div>
      ),
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
  }, [edges, setSelectedNodeId, setSelectedEdgeId, setSelectedTriggerId, setSidebarTab, onAddActionClick, onDeleteNode, onDuplicateNode, onTriggerClick, selectedTriggerId]);

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

  // Build nodes for ReactFlow including triggers
  const allNodes = useMemo(() => {
    const flowNodes: RFNode[] = [];
    const triggerSpacing = 200;
    const triggerStartX = -(triggers.length - 1) * triggerSpacing / 2;

    // Add trigger nodes
    triggers.forEach((trigger, index) => {
      flowNodes.push({
        id: `trigger-${trigger.id}`,
        type: 'triggerNode',
        position: { x: triggerStartX + index * triggerSpacing, y: 0 },
        data: {
          trigger,
          selected: selectedTriggerId === trigger.id,
          onClick: () => onTriggerClick(trigger.id),
        } as any,
        draggable: isInteractive,
      });
    });

    // Add central plus node if we have triggers
    if (triggers.length > 0) {
      flowNodes.push({
        id: 'central-plus',
        type: 'plusNode',
        position: { x: -16, y: 150 },
        data: {
          onAdd: () => onAddActionClick(),
        } as any,
        draggable: false,
      });
    }

    // Add action nodes
    nodes.forEach((node, index) => {
      flowNodes.push({
        ...node,
        position: node.position.x === 0 && node.position.y === 0 
          ? { x: -110, y: 250 + index * 120 }
          : node.position,
        draggable: isInteractive,
      });
    });

    // Add end node
    if (triggers.length > 0) {
      flowNodes.push({
        id: 'end-node',
        type: 'endNode',
        position: { x: -25, y: 250 + nodes.length * 120 + 80 },
        data: {} as any,
        draggable: false,
      });
    }

    return flowNodes;
  }, [triggers, nodes, selectedTriggerId, isInteractive, onTriggerClick, onAddActionClick]);

  // Build edges including trigger connections
  const allEdges = useMemo(() => {
    const flowEdges: RFEdge[] = [];

    // Connect triggers to central plus
    triggers.forEach((trigger) => {
      flowEdges.push({
        id: `trigger-${trigger.id}-to-plus`,
        source: `trigger-${trigger.id}`,
        target: 'central-plus',
        sourceHandle: 'default',
        targetHandle: 'in',
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
      });
    });

    // Connect plus to first action or end
    if (nodes.length > 0) {
      flowEdges.push({
        id: 'plus-to-first-action',
        source: 'central-plus',
        target: nodes[0].id,
        sourceHandle: 'default',
        targetHandle: 'in',
        type: 'plusEdge',
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
      });

      // Connect actions in sequence
      for (let i = 0; i < nodes.length - 1; i++) {
        flowEdges.push({
          id: `action-${nodes[i].id}-to-${nodes[i + 1].id}`,
          source: nodes[i].id,
          target: nodes[i + 1].id,
          sourceHandle: 'default',
          targetHandle: 'in',
          type: 'plusEdge',
          style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
        });
      }

      // Connect last action to end
      flowEdges.push({
        id: 'last-action-to-end',
        source: nodes[nodes.length - 1].id,
        target: 'end-node',
        sourceHandle: 'default',
        targetHandle: 'in',
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
      });
    } else if (triggers.length > 0) {
      // Connect plus directly to end
      flowEdges.push({
        id: 'plus-to-end',
        source: 'central-plus',
        target: 'end-node',
        sourceHandle: 'default',
        targetHandle: 'in',
        type: 'smoothstep',
        style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
      });
    }

    return flowEdges;
  }, [triggers, nodes]);

  const handleZoomIn = useCallback(() => {
    reactFlowRef.current?.zoomIn();
  }, [reactFlowRef]);

  const handleZoomOut = useCallback(() => {
    reactFlowRef.current?.zoomOut();
  }, [reactFlowRef]);

  const handleFitView = useCallback(() => {
    reactFlowRef.current?.fitView({ padding: 0.3 });
  }, [reactFlowRef]);

  return (
    <div 
      ref={canvasWrapRef} 
      className="relative flex-1 min-h-0 bg-workflow-canvas"
      onDragOver={onDragOver}
    >
      <ReactFlow
        nodes={allNodes}
        edges={allEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onInit={(instance) => {
          reactFlowRef.current = instance;
          instance.fitView({ padding: 0.3 });
        }}
        deleteKeyCode={null}
        panOnDrag={isInteractive}
        zoomOnScroll={isInteractive}
        zoomOnPinch={isInteractive}
        zoomOnDoubleClick={isInteractive}
        nodesDraggable={isInteractive}
        nodesConnectable={isInteractive}
        elementsSelectable={true}
        defaultEdgeOptions={{
          type: 'plusEdge',
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: 'hsl(var(--border))', strokeWidth: 2 },
        }}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.2}
        maxZoom={2}
        className="bg-workflow-canvas"
      >
        <Background gap={20} size={1} color="hsl(var(--border))" style={{ opacity: 0.4 }} />
        
        {/* Control Buttons - Bottom Left */}
        <Panel position="bottom-left" className="!m-4">
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
          nodeStrokeWidth={3}
          zoomable
          pannable
          className="!bg-background !border !rounded-lg !shadow-md"
          style={{ width: 180, height: 120 }}
        />
      </ReactFlow>
    </div>
  );
};
