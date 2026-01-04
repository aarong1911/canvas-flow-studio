import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
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
import { Plus, MoreHorizontal, ZoomIn, ZoomOut, Maximize, Lock, Unlock, Trash2, Copy, Settings, GitBranch, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RFNode, RFEdge, RFNodeData, ConnectFrom, COLOR_HEX, SidebarTab, TriggerData, ColorKey } from "./types";
import { TriggerCard } from "./TriggerCard";
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

// Branch Cards Section component for condition nodes with saved branches
const BranchCardsSection: React.FC<{
  node: RFNode;
  onAddActionClick: (sourceNodeId?: string, sourceHandle?: string) => void;
  onDeleteNoneBranch?: (nodeId: string) => void;
  showNoneBranch?: boolean;
}> = ({ node, onAddActionClick, onDeleteNoneBranch, showNoneBranch = true }) => {
  const branches = node.data.config?.branches || [];
  const hasNoneBranch = showNoneBranch && node.data.config?.showNoneBranch !== false;
  const totalBranches = branches.length + (hasNoneBranch ? 1 : 0);
  const branchWidth = 200; // Width of each branch column
  const gap = 24; // Gap between branches
  const totalWidth = totalBranches * branchWidth + (totalBranches - 1) * gap;
  const startY = 0;
  const dropHeight = 20; // Initial vertical drop from node
  const curveRadius = 12; // Radius for rounded corners
  const branchDropHeight = 35; // Height from horizontal line to cards
  const svgHeight = dropHeight + branchDropHeight + 10;
  const centerX = (totalWidth + 40) / 2;
  
  // Calculate x positions for each branch
  const getBranchX = (idx: number) => 20 + branchWidth / 2 + idx * (branchWidth + gap);
  
  return (
    <div className="mt-4 flex flex-col items-center relative">
      {/* SVG Connector Lines with curves */}
      <svg 
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        width={totalWidth + 40}
        height={svgHeight}
        style={{ overflow: 'visible' }}
      >
        {/* Draw curved paths from center to each branch */}
        {[...Array(totalBranches)].map((_, idx) => {
          const branchX = getBranchX(idx);
          const horizontalY = dropHeight;
          
          // Create a smooth curved path from center down to each branch
          let pathD: string;
          
          if (branchX === centerX) {
            // Center branch - straight line down
            pathD = `M ${centerX} ${startY} L ${centerX} ${horizontalY + branchDropHeight}`;
          } else if (branchX < centerX) {
            // Left branches - curve left then down
            pathD = `
              M ${centerX} ${startY}
              L ${centerX} ${horizontalY - curveRadius}
              Q ${centerX} ${horizontalY}, ${centerX - curveRadius} ${horizontalY}
              L ${branchX + curveRadius} ${horizontalY}
              Q ${branchX} ${horizontalY}, ${branchX} ${horizontalY + curveRadius}
              L ${branchX} ${horizontalY + branchDropHeight}
            `;
          } else {
            // Right branches - curve right then down
            pathD = `
              M ${centerX} ${startY}
              L ${centerX} ${horizontalY - curveRadius}
              Q ${centerX} ${horizontalY}, ${centerX + curveRadius} ${horizontalY}
              L ${branchX - curveRadius} ${horizontalY}
              Q ${branchX} ${horizontalY}, ${branchX} ${horizontalY + curveRadius}
              L ${branchX} ${horizontalY + branchDropHeight}
            `;
          }
          
          return (
            <path
              key={idx}
              d={pathD}
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
      
      {/* Spacer for SVG height */}
      <div style={{ height: svgHeight }} />
      
      {/* Branch cards container */}
      <div className="flex items-start" style={{ gap }}>
        {/* User-defined branches */}
        {branches.map((branch: any, idx: number) => (
          <div key={branch.id} className="flex flex-col items-center" style={{ width: branchWidth }}>
            {/* Branch card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 w-full">
              <div className="flex items-center gap-2 text-blue-700">
                <GitBranch className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {branch.name || `Branch ${idx + 1}`}
                </span>
              </div>
              {branch.segments && branch.segments[0]?.field && (
                <div className="text-xs text-blue-600/70 mt-1 truncate">
                  If "{branch.segments[0].field}" {branch.segments[0].operator}...
                </div>
              )}
            </div>
            
            {/* Plus button and END */}
            <div className="flex flex-col items-center mt-2">
              <div className="w-0.5 h-4 bg-border" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddActionClick(node.id, `branch_${idx}`);
                }}
                className={cn(
                  "w-6 h-6 rounded-full bg-card border border-border shadow-sm",
                  "flex items-center justify-center",
                  "hover:bg-primary hover:border-primary hover:text-primary-foreground",
                  "transition-all duration-200 group"
                )}
              >
                <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary-foreground" />
              </button>
              <div className="w-0.5 h-4 bg-border" />
              <div className="bg-muted border border-border rounded-full px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide shadow-sm">
                END
              </div>
            </div>
          </div>
        ))}
        
        {/* None branch */}
        {hasNoneBranch && (
          <div className="flex flex-col items-center" style={{ width: branchWidth }}>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">None</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded hover:bg-gray-200 transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNoneBranch?.(node.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                When no conditions match
              </div>
            </div>
            
            {/* Plus button and END */}
            <div className="flex flex-col items-center mt-2">
              <div className="w-0.5 h-4 bg-border" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddActionClick(node.id, "none");
                }}
                className={cn(
                  "w-6 h-6 rounded-full bg-card border border-border shadow-sm",
                  "flex items-center justify-center",
                  "hover:bg-primary hover:border-primary hover:text-primary-foreground",
                  "transition-all duration-200 group"
                )}
              >
                <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary-foreground" />
              </button>
              <div className="w-0.5 h-4 bg-border" />
              <div className="bg-muted border border-border rounded-full px-3 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide shadow-sm">
                END
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
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
  // Zoom and pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
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

            {/* Branch handles and buttons for conditions */}
            {isCondition && p.data.actionType === "split" ? (
              // Split A/B node - two paths
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {(["yes", "no"] as const).map((handle, idx) => (
                    <button
                      key={handle}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddActionClick(p.id, handle);
                      }}
                      className={cn(
                        "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all",
                        "border backdrop-blur-sm",
                        handle === "yes" && "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200",
                        handle === "no" && "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200"
                      )}
                    >
                      <Plus className="w-3 h-3" />
                      {idx === 0 ? "Path A" : "Path B"}
                    </button>
                  ))}
                </div>
                <Handle type="source" position={Position.Bottom} id="yes" className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background" style={{ left: "30%" }} />
                <Handle type="source" position={Position.Bottom} id="no" className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background" style={{ left: "70%" }} />
              </>
            ) : isCondition ? (
              // If/Else condition - three paths (yes/no/none)
              <>
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  {(["yes", "no", "none"] as const).map((handle) => (
                    <button
                      key={handle}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddActionClick(p.id, handle);
                      }}
                      className={cn(
                        "flex items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-all",
                        "border backdrop-blur-sm",
                        handle === "yes" && "bg-green-100 border-green-300 text-green-700 hover:bg-green-200",
                        handle === "no" && "bg-red-100 border-red-300 text-red-700 hover:bg-red-200",
                        handle === "none" && "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                      )}
                    >
                      <Plus className="w-3 h-3" />
                      {handle === "none" ? "None" : handle.toUpperCase()}
                    </button>
                  ))}
                </div>
                <Handle type="source" position={Position.Bottom} id="yes" className="!w-3 !h-3 !bg-green-500 !border-2 !border-background" style={{ left: "20%" }} />
                <Handle type="source" position={Position.Bottom} id="no" className="!w-3 !h-3 !bg-red-500 !border-2 !border-background" style={{ left: "50%" }} />
                <Handle type="source" position={Position.Bottom} id="none" className="!w-3 !h-3 !bg-gray-500 !border-2 !border-background" style={{ left: "80%" }} />
              </>
            ) : (
              <>
                <Handle type="source" position={Position.Bottom} id="default" className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
                {!hasOutgoingEdge && (
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
              </>
            )}
          </div>
        );
      },
      placeholderNode: (p: NodeProps<{ onAddAction: () => void }>) => (
        <div className="relative">
          <Handle type="target" position={Position.Top} id="in" className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
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
      plusNode: (p: NodeProps<{ onAdd: () => void }>) => (
        <div className="relative">
          <Handle type="target" position={Position.Top} id="in" className="!w-0 !h-0 !opacity-0" />
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
          <Handle type="source" position={Position.Bottom} id="default" className="!w-0 !h-0 !opacity-0" />
        </div>
      ),
      endNode: () => (
        <div className="relative">
          <Handle type="target" position={Position.Top} id="in" className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background" />
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
            <path id={props.id} style={props.style} className="react-flow__edge-path" d={edgePath} markerEnd={props.markerEnd} />
            <foreignObject width={24} height={24} x={labelX - 12} y={labelY - 12} className="overflow-visible" requiredExtensions="http://www.w3.org/1999/xhtml">
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

  const hasTriggers = triggers.length > 0;
  const triggerRowRef = useRef<HTMLDivElement>(null);
  const [triggerPositions, setTriggerPositions] = useState<number[]>([]);
  const [canvasWidth, setCanvasWidth] = useState(0);

  useEffect(() => {
    const updatePositions = () => {
      if (!triggerRowRef.current || !canvasWrapRef.current) return;
      const cards = triggerRowRef.current.querySelectorAll('[data-trigger-card="true"]');
      const canvasRect = canvasWrapRef.current.getBoundingClientRect();
      const positions: number[] = [];
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left - canvasRect.left + rect.width / 2;
        positions.push(centerX);
      });
      setTriggerPositions(positions);
      setCanvasWidth(canvasRect.width);
    };

    updatePositions();
    window.addEventListener('resize', updatePositions);
    const timeout = setTimeout(updatePositions, 50);
    return () => {
      window.removeEventListener('resize', updatePositions);
      clearTimeout(timeout);
    };
  }, [triggers, canvasWrapRef]);

  const mergePointX = canvasWidth / 2;
  const svgTop = 96;
  const triggerMergeHeight = 120;

  const handleZoomIn = () => {
    setZoom(z => Math.min(z * 1.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(z => Math.max(z / 1.2, 0.5));
  };

  const handleFitView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!isInteractive) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(Math.max(z * delta, 0.5), 2));
  }, [isInteractive]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isInteractive) return;
    if (e.button !== 0) return; // Only left click
    // Don't start drag if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button, [data-trigger-card], [role="menu"]')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [isInteractive, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div 
      ref={canvasWrapRef} 
      className={cn(
        "relative flex-1 min-h-0 bg-workflow-canvas overflow-hidden",
        isDragging && "cursor-grabbing",
        isInteractive && !isDragging && "cursor-grab"
      )}
      onDragOver={onDragOver}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Zoomable/Pannable content wrapper */}
      <div 
        ref={contentRef}
        className="absolute inset-0 origin-center transition-transform duration-75"
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
        }}
      >
      {/* Trigger Row */}
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

      {/* Connector lines */}
      {hasTriggers && triggerPositions.length > 0 && (
        <svg className="absolute left-0 right-0 pointer-events-none z-[5]" style={{ top: svgTop, height: triggerMergeHeight, width: '100%' }}>
          {triggerPositions.length === 1 ? (
            <line x1={triggerPositions[0]} y1={0} x2={triggerPositions[0]} y2={triggerMergeHeight} stroke="hsl(var(--border))" strokeWidth="2" />
          ) : (
            <>
              {triggerPositions.map((startX, index) => {
                const dropDistance = 40;
                const horizontalY = dropDistance;
                const isLeftOfCenter = startX < mergePointX;
                const cornerRadius = 8;
                const path = `M ${startX} 0 L ${startX} ${horizontalY - cornerRadius} Q ${startX} ${horizontalY} ${isLeftOfCenter ? startX + cornerRadius : startX - cornerRadius} ${horizontalY} L ${isLeftOfCenter ? mergePointX - cornerRadius : mergePointX + cornerRadius} ${horizontalY} Q ${mergePointX} ${horizontalY} ${mergePointX} ${horizontalY + cornerRadius}`;
                return <path key={index} d={path} fill="none" stroke="hsl(var(--border))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />;
              })}
              <line x1={mergePointX} y1={40 + 8} x2={mergePointX} y2={triggerMergeHeight} stroke="hsl(var(--border))" strokeWidth="2" />
            </>
          )}
        </svg>
      )}

      {/* Flow section */}
      {hasTriggers && (
        <div className="absolute z-10 flex flex-col items-center" style={{ top: svgTop + triggerMergeHeight, left: '50%', transform: 'translateX(-50%)' }}>
          <PlusButton onClick={() => onAddActionClick()} />
          
          {nodes.length > 0 && (
            <div className="flex flex-col items-center">
              {nodes.map((node) => {
                const Icon = node.data.icon;
                const isCondition = node.data.builderType === "condition";
                
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    <div className="w-px h-8 bg-border" />
                    
                    <div
                      className={cn(
                        "relative bg-card border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200",
                        "min-w-[220px] max-w-[280px] shadow-sm hover:shadow-md group",
                        selectedNodeId === node.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      )}
                      onClick={() => {
                        setSelectedEdgeId(null);
                        setSelectedTriggerId(null);
                        setSelectedNodeId(node.id);
                        setSidebarTab("settings");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colorIconClasses[node.data.color])}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {node.data.config?.action_name || node.data.label}
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button onClick={(e) => e.stopPropagation()} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); setSidebarTab("settings"); }}>
                              <Settings className="w-4 h-4 mr-2" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicateNode?.(node.id); }}>
                              <Copy className="w-4 h-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }} className="text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {/* Branch buttons for condition nodes - only show if no branches configured yet */}
                    {isCondition && node.data.config?.branches?.length > 0 ? (
                      // Show saved branches as cards
                      <BranchCardsSection 
                        node={node} 
                        onAddActionClick={onAddActionClick}
                        showNoneBranch={node.data.config?.showNoneBranch !== false}
                        onDeleteNoneBranch={(nodeId) => {
                          setNodes((nds) =>
                            nds.map((n) =>
                              n.id === nodeId
                                ? {
                                    ...n,
                                    data: {
                                      ...n.data,
                                      config: {
                                        ...n.data.config,
                                        showNoneBranch: false,
                                      },
                                    },
                                  }
                                : n
                            )
                          );
                        }}
                      />
                    ) : !isCondition ? (
                      <div className="flex flex-col items-center">
                        <div className="w-px h-4 bg-border" />
                        <PlusButton onClick={() => onAddActionClick(node.id, "default")} />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Only show main END if there are no condition nodes with branches */}
          {!nodes.some(n => n.data.builderType === "condition" && n.data.config?.branches?.length > 0) && (
            <>
              <div className="w-px h-8 bg-border" />
              <div className={cn("bg-muted border border-border rounded-full px-4 py-1.5", "text-xs font-medium text-muted-foreground uppercase tracking-wide shadow-sm")}>
                END
              </div>
            </>
          )}
        </div>
      )}
      </div>
      {/* End of zoomable content wrapper */}

      {/* Control Buttons - Bottom Left (outside zoomable area) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-col gap-1 bg-card border border-border rounded-lg shadow-sm p-1">
        <button onClick={handleZoomIn} className="p-2 hover:bg-muted rounded transition-colors" title="Zoom In">
          <ZoomIn className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={handleZoomOut} className="p-2 hover:bg-muted rounded transition-colors" title="Zoom Out">
          <ZoomOut className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={handleFitView} className="p-2 hover:bg-muted rounded transition-colors" title="Fit View">
          <Maximize className="w-4 h-4 text-muted-foreground" />
        </button>
        <button onClick={() => setIsInteractive(!isInteractive)} className={cn("p-2 hover:bg-muted rounded transition-colors", !isInteractive && "bg-muted")} title={isInteractive ? "Lock Canvas" : "Unlock Canvas"}>
          {isInteractive ? <Unlock className="w-4 h-4 text-muted-foreground" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>

      {/* Mini Map - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-card/90 border border-border rounded-lg shadow-sm p-2" style={{ width: 150, height: 100 }}>
          <div className="relative w-full h-full bg-muted/30 rounded overflow-hidden">
            {/* Triggers as rounded cards matching canvas style */}
            {triggers.map((trigger, i) => (
              <div 
                key={trigger.id} 
                className="absolute w-4 h-2 rounded-sm" 
                style={{ 
                  top: '8%', 
                  left: `${30 + i * 20}%`,
                  backgroundColor: COLOR_HEX[trigger.color] || COLOR_HEX.purple,
                }} 
              />
            ))}
            {/* Connector line from triggers to nodes */}
            {triggers.length > 0 && nodes.length > 0 && (
              <div className="absolute w-px bg-border" style={{ top: '18%', height: '15%', left: '50%' }} />
            )}
            {/* Nodes as rounded cards matching canvas style */}
            {nodes.map((node, i) => (
              <div 
                key={node.id} 
                className="absolute w-4 h-2 rounded-sm" 
                style={{ 
                  top: `${35 + i * 12}%`, 
                  left: '50%', 
                  transform: 'translateX(-50%)', 
                  backgroundColor: COLOR_HEX[node.data.color] 
                }} 
              />
            ))}
            {/* End node indicator */}
            {nodes.length > 0 && (
              <div 
                className="absolute w-3 h-1.5 rounded-full bg-muted-foreground/50" 
                style={{ bottom: '8%', left: '50%', transform: 'translateX(-50%)' }} 
              />
            )}
          </div>
        </div>
      </div>

      {/* Hidden ReactFlow for edge management */}
      <div className="hidden">
        <ReactFlow nodes={[]} edges={[]} nodeTypes={nodeTypes} edgeTypes={edgeTypes} onInit={(instance) => { reactFlowRef.current = instance; }} fitView />
      </div>
    </div>
  );
};
