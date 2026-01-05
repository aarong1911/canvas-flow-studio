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
  onInsertBetween: (parentNodeId: string, childNodeId: string, sourceHandle: string) => void;
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

// Recursive component to render a node and its children
const BranchNodeRenderer: React.FC<{
  nodeId: string;
  allNodes: RFNode[];
  edges: RFEdge[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setSelectedTriggerId: (id: string | null) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  onAddActionClick: (sourceNodeId?: string, sourceHandle?: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onInsertBetween?: (parentNodeId: string, childNodeId: string, sourceHandle: string) => void;
  parentNodeId?: string;
  sourceHandle?: string;
  isFirstInBranch?: boolean;
  // Go To connector props
  goToConnecting?: { sourceNodeId: string } | null;
  hoveredNodeId?: string | null;
  setHoveredNodeId?: (id: string | null) => void;
  onGoToConnectorMouseDown?: (e: React.MouseEvent, nodeId: string) => void;
}> = ({ 
  nodeId, 
  allNodes, 
  edges, 
  selectedNodeId, 
  setSelectedNodeId, 
  setSelectedEdgeId,
  setSelectedTriggerId,
  setSidebarTab,
  onAddActionClick,
  onDeleteNode,
  onDuplicateNode,
  onInsertBetween,
  parentNodeId,
  sourceHandle,
  isFirstInBranch = false,
  goToConnecting,
  hoveredNodeId,
  setHoveredNodeId,
  onGoToConnectorMouseDown,
}) => {
  const node = allNodes.find(n => n.id === nodeId);
  if (!node) return null;
  
  const Icon = node.data.icon;
  const isCondition = node.data.builderType === "condition";
  const isGoTo = node.data.actionType === "go_to";
  const hasBranches = isCondition && (node.data.config?.branches?.length || 0) > 0;
  
  // Find child nodes connected from this node (exclude Go To edges which are visual-only)
  const childEdges = edges.filter(e => e.source === nodeId && e.data?.label !== "Go To");
  
  return (
    <div className="flex flex-col items-center">
      {/* Connector line with plus button for insertion */}
      <div className="flex flex-col items-center">
        <div className="w-0.5 h-4 bg-border" />
        {isFirstInBranch && parentNodeId && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onInsertBetween) {
                  onInsertBetween(parentNodeId, nodeId, sourceHandle || "default");
                }
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
          </>
        )}
      </div>
      
      {/* Node Card */}
      <div
        data-node-id={node.id}
        className={cn(
          "relative bg-card border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200",
          "w-[220px] shadow-sm hover:shadow-md group",
          selectedNodeId === node.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          // Highlight when being hovered during Go To connection
          goToConnecting && hoveredNodeId === node.id && goToConnecting.sourceNodeId !== node.id && "ring-2 ring-amber-500 ring-offset-2 ring-offset-background"
        )}
        onClick={() => {
          setSelectedEdgeId(null);
          setSelectedTriggerId(null);
          setSelectedNodeId(node.id);
          setSidebarTab("settings");
        }}
        onMouseEnter={() => goToConnecting && setHoveredNodeId?.(node.id)}
        onMouseLeave={() => goToConnecting && setHoveredNodeId?.(null)}
      >
        <div className="flex items-center gap-2">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", colorIconClasses[node.data.color])}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground truncate">
              {node.data.config?.action_name || node.data.label}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button onClick={(e) => e.stopPropagation()} className="p-1 hover:bg-muted rounded transition-colors">
                <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
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
        
        {/* Go To node - draggable connector indicator */}
        {isGoTo && (
          <div 
            className={cn(
              "absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-amber-100 border-2 border-dashed border-amber-400 flex items-center justify-center cursor-grab active:cursor-grabbing",
              goToConnecting?.sourceNodeId === node.id && "ring-2 ring-amber-500 ring-offset-1"
            )}
            title="Drag to connect to another node"
            onMouseDown={(e) => onGoToConnectorMouseDown?.(e, node.id)}
          >
            <div className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
        )}
      </div>
      
      {/* If this node is a condition with branches, render its branch columns */}
      {hasBranches ? (
        <BranchCardsSection
          node={node}
          allNodes={allNodes}
          edges={edges}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          setSelectedEdgeId={setSelectedEdgeId}
          setSelectedTriggerId={setSelectedTriggerId}
          setSidebarTab={setSidebarTab}
          onAddActionClick={onAddActionClick}
          onDeleteNode={onDeleteNode}
          onDuplicateNode={onDuplicateNode}
          onInsertBetween={onInsertBetween}
          goToConnecting={goToConnecting}
          hoveredNodeId={hoveredNodeId}
          setHoveredNodeId={setHoveredNodeId}
          onGoToConnectorMouseDown={onGoToConnectorMouseDown}
        />
      ) : childEdges.length > 0 ? (
        <div className="flex flex-col items-center">
          {childEdges.map((edge) => (
            <div key={edge.target} className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-border" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onInsertBetween) {
                    onInsertBetween(node.id, edge.target, edge.sourceHandle || "default");
                  }
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
              <BranchNodeRenderer
                nodeId={edge.target}
                allNodes={allNodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                setSelectedNodeId={setSelectedNodeId}
                setSelectedEdgeId={setSelectedEdgeId}
                setSelectedTriggerId={setSelectedTriggerId}
                setSidebarTab={setSidebarTab}
                onAddActionClick={onAddActionClick}
                onDeleteNode={onDeleteNode}
                onDuplicateNode={onDuplicateNode}
                onInsertBetween={onInsertBetween}
                parentNodeId={node.id}
                sourceHandle={edge.sourceHandle || "default"}
                goToConnecting={goToConnecting}
                hoveredNodeId={hoveredNodeId}
                setHoveredNodeId={setHoveredNodeId}
                onGoToConnectorMouseDown={onGoToConnectorMouseDown}
              />
            </div>
          ))}
        </div>
      ) : (
        /* Plus button and END for leaf nodes */
        <div className="flex flex-col items-center">
          <div className="w-0.5 h-4 bg-border" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddActionClick(node.id, "default");
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
      )}
    </div>
  );
};

// Branch Cards Section component for condition nodes with saved branches
const BranchCardsSection: React.FC<{
  node: RFNode;
  allNodes: RFNode[];
  edges: RFEdge[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedEdgeId: (id: string | null) => void;
  setSelectedTriggerId: (id: string | null) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  onAddActionClick: (sourceNodeId?: string, sourceHandle?: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode?: (nodeId: string) => void;
  onInsertBetween?: (parentNodeId: string, childNodeId: string, sourceHandle: string) => void;
  // Go To connector props
  goToConnecting?: { sourceNodeId: string } | null;
  hoveredNodeId?: string | null;
  setHoveredNodeId?: (id: string | null) => void;
  onGoToConnectorMouseDown?: (e: React.MouseEvent, nodeId: string) => void;
}> = ({ 
  node, 
  allNodes, 
  edges, 
  selectedNodeId, 
  setSelectedNodeId, 
  setSelectedEdgeId,
  setSelectedTriggerId,
  setSidebarTab,
  onAddActionClick,
  onDeleteNode,
  onDuplicateNode,
  onInsertBetween,
  goToConnecting,
  hoveredNodeId,
  setHoveredNodeId,
  onGoToConnectorMouseDown,
}) => {
  const branches = node.data.config?.branches || [];
  const showNoneBranch = node.data.config?.showNoneBranch !== false;
  const totalBranches = branches.length + (showNoneBranch ? 1 : 0);
  const branchWidth = 220; // Width of each branch column
  const gap = 24; // Gap between branches
  const totalWidth = totalBranches * branchWidth + (totalBranches - 1) * gap;
  const startY = 0;
  const dropHeight = 20; // Initial vertical drop from node
  const curveRadius = 12; // Radius for rounded corners
  const branchDropHeight = 35; // Height from horizontal line to cards
  const svgHeight = dropHeight + branchDropHeight + 10;
  const centerX = (totalWidth + 40) / 2;
  
  // Find edges from this condition node to child nodes
  const getNodesForBranch = (branchHandle: string) => {
    const edge = edges.find(e => e.source === node.id && e.sourceHandle === branchHandle);
    return edge ? edge.target : null;
  };
  
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
        {branches.map((branch: any, idx: number) => {
          const branchHandle = `branch_${idx}`;
          const connectedNodeId = getNodesForBranch(branchHandle);
          
          return (
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
              
              {/* Connected nodes or Plus button + END */}
              {connectedNodeId ? (
                <BranchNodeRenderer
                  nodeId={connectedNodeId}
                  allNodes={allNodes}
                  edges={edges}
                  selectedNodeId={selectedNodeId}
                  setSelectedNodeId={setSelectedNodeId}
                  setSelectedEdgeId={setSelectedEdgeId}
                  setSelectedTriggerId={setSelectedTriggerId}
                  setSidebarTab={setSidebarTab}
                  onAddActionClick={onAddActionClick}
                  onDeleteNode={onDeleteNode}
                  onDuplicateNode={onDuplicateNode}
                  onInsertBetween={onInsertBetween}
                  parentNodeId={node.id}
                  sourceHandle={branchHandle}
                  isFirstInBranch={true}
                  goToConnecting={goToConnecting}
                  hoveredNodeId={hoveredNodeId}
                  setHoveredNodeId={setHoveredNodeId}
                  onGoToConnectorMouseDown={onGoToConnectorMouseDown}
                />
              ) : (
                <div className="flex flex-col items-center mt-2">
                  <div className="w-0.5 h-4 bg-border" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddActionClick(node.id, branchHandle);
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
              )}
            </div>
          );
        })}
        
        {/* None branch */}
        {showNoneBranch && (
          <div className="flex flex-col items-center" style={{ width: branchWidth }}>
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 w-full">
              <div className="flex items-center gap-2 text-gray-600">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">None</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                When no conditions match
              </div>
            </div>
            
            {/* Connected nodes or Plus button + END */}
            {(() => {
              const connectedNodeId = getNodesForBranch("none");
              return connectedNodeId ? (
                <BranchNodeRenderer
                  nodeId={connectedNodeId}
                  allNodes={allNodes}
                  edges={edges}
                  selectedNodeId={selectedNodeId}
                  setSelectedNodeId={setSelectedNodeId}
                  setSelectedEdgeId={setSelectedEdgeId}
                  setSelectedTriggerId={setSelectedTriggerId}
                  setSidebarTab={setSidebarTab}
                  onAddActionClick={onAddActionClick}
                  onDeleteNode={onDeleteNode}
                  onDuplicateNode={onDuplicateNode}
                  onInsertBetween={onInsertBetween}
                  parentNodeId={node.id}
                  sourceHandle="none"
                  isFirstInBranch={true}
                  goToConnecting={goToConnecting}
                  hoveredNodeId={hoveredNodeId}
                  setHoveredNodeId={setHoveredNodeId}
                  onGoToConnectorMouseDown={onGoToConnectorMouseDown}
                />
              ) : (
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
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

// Component to render persistent Go To connection lines - rendered inside content area
const GoToConnectorLines: React.FC<{
  nodes: RFNode[];
  contentRef: React.RefObject<HTMLDivElement>;
}> = ({ nodes, contentRef }) => {
  const [connections, setConnections] = useState<Array<{
    sourceId: string;
    targetId: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
  }>>([]);

  useEffect(() => {
    const updateConnections = () => {
      const newConnections: typeof connections = [];

      if (!contentRef.current) {
        setConnections([]);
        return;
      }

      const contentRect = contentRef.current.getBoundingClientRect();

      // Find all Go To nodes with target_node_id configured
      nodes.forEach((node) => {
        if (node.data.actionType === "go_to" && node.data.config?.target_node_id) {
          const targetNodeId = node.data.config.target_node_id;

          // Find the DOM elements for source and target nodes
          const sourceEl = contentRef.current?.querySelector(`[data-node-id="${node.id}"]`);
          const targetEl = contentRef.current?.querySelector(`[data-node-id="${targetNodeId}"]`);

          if (sourceEl && targetEl) {
            const sourceRect = sourceEl.getBoundingClientRect();
            const targetRect = targetEl.getBoundingClientRect();

            // Convert to content-relative coordinates (moves with pan/zoom automatically)
            const sourceX = sourceRect.right - contentRect.left + 4;
            const sourceY = sourceRect.top + sourceRect.height / 2 - contentRect.top;
            const targetX = targetRect.left - contentRect.left - 4;
            const targetY = targetRect.top + targetRect.height / 2 - contentRect.top;

            newConnections.push({
              sourceId: node.id,
              targetId: targetNodeId,
              sourceX,
              sourceY,
              targetX,
              targetY,
            });
          }
        }
      });

      setConnections(newConnections);
    };

    // Initial update
    updateConnections();

    // Update on DOM changes
    const observer = new MutationObserver(updateConnections);
    if (contentRef.current) {
      observer.observe(contentRef.current, { childList: true, subtree: true, attributes: true });
    }
    window.addEventListener("resize", updateConnections);

    // Also update after a short delay to catch layout changes
    const timeout = setTimeout(updateConnections, 100);
    const timeout2 = setTimeout(updateConnections, 300);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateConnections);
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, [nodes, contentRef]);

  if (connections.length === 0) return null;

  return (
    <>
      {connections.map((conn) => {
        // Calculate control points for a nice curve
        const dx = Math.abs(conn.targetX - conn.sourceX);
        const controlOffset = Math.max(dx * 0.5, 60);

        // Create a smooth bezier curve going right first, then curving to target
        const path = `M ${conn.sourceX} ${conn.sourceY} 
          C ${conn.sourceX + controlOffset} ${conn.sourceY}, 
            ${conn.targetX - controlOffset} ${conn.targetY}, 
            ${conn.targetX} ${conn.targetY}`;

        return (
          <svg
            key={`${conn.sourceId}-${conn.targetId}`}
            className="absolute top-0 left-0 pointer-events-none"
            style={{ 
              overflow: 'visible',
              width: '100%',
              height: '100%',
            }}
          >
            <defs>
              <marker
                id={`goto-arrow-${conn.sourceId}`}
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--workflow-goto))" />
              </marker>
            </defs>
            <path
              d={path}
              fill="none"
              stroke="hsl(var(--workflow-goto))"
              strokeWidth={2}
              strokeDasharray="6,4"
              markerEnd={`url(#goto-arrow-${conn.sourceId})`}
            />
          </svg>
        );
      })}
    </>
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
  onInsertBetween,
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
  
  // Go To connector dragging state
  const [goToConnecting, setGoToConnecting] = useState<{
    sourceNodeId: string;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);
  
  // Handle Go To connector drag start
  const handleGoToConnectorMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const canvasRect = canvasWrapRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = (e.clientX - canvasRect.left - pan.x) / zoom;
    const y = (e.clientY - canvasRect.top - pan.y) / zoom;
    
    setGoToConnecting({
      sourceNodeId: nodeId,
      startX: x,
      startY: y,
      currentX: x,
      currentY: y,
    });
  }, [canvasWrapRef, pan, zoom]);
  
  // Handle Go To connector drag move
  const handleGoToConnectorMouseMove = useCallback((e: MouseEvent) => {
    if (!goToConnecting) return;
    
    const canvasRect = canvasWrapRef.current?.getBoundingClientRect();
    if (!canvasRect) return;
    
    const x = (e.clientX - canvasRect.left - pan.x) / zoom;
    const y = (e.clientY - canvasRect.top - pan.y) / zoom;
    
    setGoToConnecting(prev => prev ? { ...prev, currentX: x, currentY: y } : null);
  }, [goToConnecting, canvasWrapRef, pan, zoom]);
  
  // Handle Go To connector drag end
  const handleGoToConnectorMouseUp = useCallback(() => {
    if (!goToConnecting) return;
    
    // If dropped on a valid node, create a "go_to" edge
    if (hoveredNodeId && hoveredNodeId !== goToConnecting.sourceNodeId) {
      // Update the Go To node config to point to the target node
      setNodes(nds => nds.map(n => {
        if (n.id === goToConnecting.sourceNodeId) {
          return {
            ...n,
            data: {
              ...n.data,
              config: {
                ...n.data.config,
                target_node_id: hoveredNodeId,
                target_node_label: nodes.find(nd => nd.id === hoveredNodeId)?.data.label || "Unknown",
              }
            }
          };
        }
        return n;
      }));
      
      // Create a visual edge for the Go To connection
      setEdges(eds => {
        // Remove any existing go_to edge from this source
        const filtered = eds.filter(e => !(e.source === goToConnecting.sourceNodeId && e.data?.label === "Go To"));
        return [...filtered, {
          id: `goto_${goToConnecting.sourceNodeId}_${hoveredNodeId}`,
          source: goToConnecting.sourceNodeId,
          target: hoveredNodeId,
          sourceHandle: "goto",
          targetHandle: "in",
          type: "smoothstep",
          animated: true,
          style: { stroke: "#D97706", strokeWidth: 2, strokeDasharray: "5,5" },
          data: { label: "Go To" },
        }];
      });
    }
    
    setGoToConnecting(null);
    setHoveredNodeId(null);
  }, [goToConnecting, hoveredNodeId, nodes, setNodes, setEdges]);
  
  // Set up global mouse event listeners for Go To connector
  useEffect(() => {
    if (goToConnecting) {
      window.addEventListener("mousemove", handleGoToConnectorMouseMove);
      window.addEventListener("mouseup", handleGoToConnectorMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleGoToConnectorMouseMove);
        window.removeEventListener("mouseup", handleGoToConnectorMouseUp);
      };
    }
  }, [goToConnecting, handleGoToConnectorMouseMove, handleGoToConnectorMouseUp]);

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
      {hasTriggers && (() => {
        // Find all nodes that are connected to condition branches (should not be in main column)
        const branchConnectedNodeIds = new Set<string>();
        
        const collectBranchNodes = (nodeId: string, visited: Set<string> = new Set()) => {
          // Prevent infinite recursion by tracking visited nodes
          if (visited.has(nodeId)) return;
          visited.add(nodeId);
          
          branchConnectedNodeIds.add(nodeId);
          // Find all children of this node (excluding go_to edges which are visual only)
          edges
            .filter(e => e.source === nodeId && e.data?.label !== "Go To")
            .forEach(e => collectBranchNodes(e.target, visited));
        };
        
        // Find condition nodes with branches and collect their connected nodes
        nodes.forEach(node => {
          if (node.data.builderType === "condition" && node.data.config?.branches?.length > 0) {
            const branches = node.data.config.branches;
            const showNoneBranch = node.data.config?.showNoneBranch !== false;
            
            // Collect nodes from each branch
            branches.forEach((_: any, idx: number) => {
              const edge = edges.find(e => e.source === node.id && e.sourceHandle === `branch_${idx}`);
              if (edge) collectBranchNodes(edge.target);
            });
            
            // Collect nodes from none branch
            if (showNoneBranch) {
              const noneEdge = edges.find(e => e.source === node.id && e.sourceHandle === "none");
              if (noneEdge) collectBranchNodes(noneEdge.target);
            }
          }
        });
        
        // Filter out branch-connected nodes from main column
        const mainColumnNodes = nodes.filter(n => !branchConnectedNodeIds.has(n.id));
        
        return (
        <div className="absolute z-10 flex flex-col items-center" style={{ top: svgTop + triggerMergeHeight, left: '50%', transform: 'translateX(-50%)' }}>
          {/* Initial plus button - only shown if no nodes or to add before first node */}
          {mainColumnNodes.length === 0 ? (
            <PlusButton onClick={() => onAddActionClick()} />
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-border" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Insert before first node - pass special handler
                  onInsertBetween("__trigger__", mainColumnNodes[0].id, "default");
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
            </div>
          )}
          
          {mainColumnNodes.length > 0 && (
            <div className="flex flex-col items-center">
              {mainColumnNodes.map((node, nodeIndex) => {
                const Icon = node.data.icon;
                const isCondition = node.data.builderType === "condition";
                const isGoTo = node.data.actionType === "go_to";
                const prevNode = nodeIndex > 0 ? mainColumnNodes[nodeIndex - 1] : null;
                const nextNode = nodeIndex < mainColumnNodes.length - 1 ? mainColumnNodes[nodeIndex + 1] : null;
                
                return (
                  <div key={node.id} className="flex flex-col items-center">
                    {/* Connector line with centered plus button - between nodes (not before first) */}
                    {prevNode && (
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-border" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onInsertBetween(prevNode.id, node.id, "default");
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
                      </div>
                    )}
                    
                    <div
                      data-node-id={node.id}
                      className={cn(
                        "relative bg-card border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200",
                        "w-[220px] shadow-sm hover:shadow-md group",
                        selectedNodeId === node.id && "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        // Highlight when being hovered during Go To connection
                        goToConnecting && hoveredNodeId === node.id && goToConnecting.sourceNodeId !== node.id && "ring-2 ring-amber-500 ring-offset-2 ring-offset-background"
                      )}
                      onClick={() => {
                        setSelectedEdgeId(null);
                        setSelectedTriggerId(null);
                        setSelectedNodeId(node.id);
                        setSidebarTab("settings");
                      }}
                      onMouseEnter={() => goToConnecting && setHoveredNodeId(node.id)}
                      onMouseLeave={() => goToConnecting && setHoveredNodeId(null)}
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
                      
                      {/* Go To node - draggable connector indicator */}
                      {isGoTo && (
                        <div 
                          className={cn(
                            "absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-amber-100 border-2 border-dashed border-amber-400 flex items-center justify-center cursor-grab active:cursor-grabbing",
                            goToConnecting?.sourceNodeId === node.id && "ring-2 ring-amber-500 ring-offset-1"
                          )}
                          title="Drag to connect to another node"
                          onMouseDown={(e) => handleGoToConnectorMouseDown(e, node.id)}
                        >
                          <div className="w-2 h-2 rounded-full bg-amber-500" />
                        </div>
                      )}
                    </div>
                    
                    {/* Branch cards for condition nodes with branches */}
                    {isCondition && node.data.config?.branches?.length > 0 ? (
                      <BranchCardsSection 
                        node={node}
                        allNodes={nodes}
                        edges={edges}
                        selectedNodeId={selectedNodeId}
                        setSelectedNodeId={setSelectedNodeId}
                        setSelectedEdgeId={setSelectedEdgeId}
                        setSelectedTriggerId={setSelectedTriggerId}
                        setSidebarTab={setSidebarTab}
                        onAddActionClick={onAddActionClick}
                        onDeleteNode={onDeleteNode}
                        onDuplicateNode={onDuplicateNode}
                        onInsertBetween={onInsertBetween}
                        goToConnecting={goToConnecting}
                        hoveredNodeId={hoveredNodeId}
                        setHoveredNodeId={setHoveredNodeId}
                        onGoToConnectorMouseDown={handleGoToConnectorMouseDown}
                      />
                    ) : !isCondition && !nextNode ? (
                      /* Add plus button below last non-condition node */
                      <div className="flex flex-col items-center">
                        <div className="w-0.5 h-4 bg-border" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddActionClick(node.id, "default");
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
        );
      })()}
      
      {/* Persistent Go To connection lines - inside content area so they pan/zoom together */}
      <GoToConnectorLines 
        nodes={nodes} 
        contentRef={contentRef}
      />
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

      
      {/* Go To connector dragging line overlay */}
      {goToConnecting && (
        <svg 
          className="absolute inset-0 pointer-events-none z-50"
          style={{ 
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          <defs>
            <marker
              id="goto-arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--workflow-goto))" />
            </marker>
          </defs>
          <line
            x1={goToConnecting.startX}
            y1={goToConnecting.startY}
            x2={goToConnecting.currentX}
            y2={goToConnecting.currentY}
            stroke="hsl(var(--workflow-goto))"
            strokeWidth={2}
            strokeDasharray="6,4"
            markerEnd="url(#goto-arrowhead)"
          />
          {/* Animated circle at the end */}
          <circle
            cx={goToConnecting.currentX}
            cy={goToConnecting.currentY}
            r={6}
            fill="#D97706"
            opacity={0.5}
          >
            <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1s" repeatCount="indefinite" />
          </circle>
        </svg>
      )}

      {/* Hidden ReactFlow for edge management */}
      <div className="hidden">
        <ReactFlow nodes={[]} edges={[]} nodeTypes={nodeTypes} edgeTypes={edgeTypes} onInit={(instance) => { reactFlowRef.current = instance; }} fitView />
      </div>
    </div>
  );
};
