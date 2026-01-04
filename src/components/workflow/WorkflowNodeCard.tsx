import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Trash2, Plus, MoreHorizontal, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RFNodeData, RFNode, ConnectFrom, ColorKey, BuilderNodeType } from "./types";

interface WorkflowNodeCardProps extends NodeProps<RFNodeData> {
  onSelectNode: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onAddAfter: (from: { sourceNodeId: string; sourceHandle: ConnectFrom["sourceHandle"] }) => void;
}

function getNodeStyles(builderType: BuilderNodeType, color: ColorKey) {
  const baseStyles = {
    trigger: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600",
      text: "text-white",
      border: "border-purple-400",
      shadow: "shadow-purple-500/20",
    },
    action: {
      bg: "bg-gradient-to-br from-blue-500 to-blue-600",
      text: "text-white",
      border: "border-blue-400",
      shadow: "shadow-blue-500/20",
    },
    condition: {
      bg: "bg-card",
      text: "text-foreground",
      border: "border-border",
      shadow: "shadow-md",
    },
    delay: {
      bg: "bg-gradient-to-br from-orange-400 to-orange-500",
      text: "text-white",
      border: "border-orange-300",
      shadow: "shadow-orange-500/20",
    },
  };

  // Override based on color for special cases
  const colorOverrides: Partial<Record<ColorKey, typeof baseStyles.action>> = {
    green: {
      bg: "bg-gradient-to-br from-green-500 to-green-600",
      text: "text-white",
      border: "border-green-400",
      shadow: "shadow-green-500/20",
    },
    red: {
      bg: "bg-gradient-to-br from-red-500 to-red-600",
      text: "text-white",
      border: "border-red-400",
      shadow: "shadow-red-500/20",
    },
  };

  if (color === "green" || color === "red") {
    return colorOverrides[color]!;
  }

  return baseStyles[builderType];
}

function prettyNodeTitle(data: RFNodeData) {
  const cfg = data.config || {};
  if (data.actionType === "wait" && cfg.duration && cfg.unit) {
    return `Wait ${cfg.duration} ${cfg.unit}`;
  }
  if (data.actionType === "wait_until") return cfg.action_name || "Wait Until";
  if (data.actionType === "wait_for_event") return cfg.action_name || "Wait For Event";
  return cfg.action_name || cfg.trigger_name || data.label;
}

// Get branches from config
function getBranches(data: RFNodeData) {
  const cfg = data.config || {};
  if (cfg.branches && Array.isArray(cfg.branches)) {
    return cfg.branches;
  }
  return null;
}

export const WorkflowNodeCard: React.FC<WorkflowNodeCardProps> = ({
  id,
  data,
  selected,
  onSelectNode,
  onDeleteNode,
  onAddAfter,
}) => {
  const Icon = data.icon;
  const styles = getNodeStyles(data.builderType, data.color);
  const isCondition = data.builderType === "condition";
  const isSplit = data.actionType === "split";
  const isTrigger = data.builderType === "trigger";
  const branches = getBranches(data);
  const hasBranches = branches && branches.length > 0;

  return (
    <div className="relative group">
      {/* Target Handle */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          id="in"
          className="!w-3 !h-3 !bg-workflow-connector !border-2 !border-background"
        />
      )}

      {/* Main Node Card - Simplified for conditions */}
      {isCondition ? (
        <div
          onClick={() => onSelectNode(id)}
          className={cn(
            "relative rounded-xl border bg-card px-4 py-3 cursor-pointer transition-all duration-200",
            "min-w-[180px]",
            "shadow-md hover:shadow-lg",
            selected && "ring-2 ring-offset-2 ring-primary ring-offset-background"
          )}
        >
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(id);
            }}
            className={cn(
              "absolute -top-2 -right-2 p-1.5 rounded-full transition-all duration-200",
              "bg-destructive text-destructive-foreground",
              "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100",
              "shadow-md hover:shadow-lg"
            )}
            title="Delete node"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          {/* Node Content */}
          <div className="flex items-center gap-3">
            <div className="text-lg text-muted-foreground">{"{}"}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">
                {prettyNodeTitle(data)}
              </div>
            </div>
            <button className="p-1 hover:bg-muted rounded">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      ) : (
        /* Regular Node Card */
        <div
          onClick={() => onSelectNode(id)}
          className={cn(
            "relative rounded-xl border-2 px-4 py-3 cursor-pointer transition-all duration-200",
            "min-w-[260px] max-w-[320px]",
            "shadow-lg hover:shadow-xl",
            styles.bg,
            styles.text,
            styles.border,
            styles.shadow,
            selected && "ring-2 ring-offset-2 ring-primary ring-offset-background scale-[1.02]"
          )}
        >
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteNode(id);
            }}
            className={cn(
              "absolute -top-2 -right-2 p-1.5 rounded-full transition-all duration-200",
              "bg-destructive text-destructive-foreground",
              "opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100",
              "shadow-md hover:shadow-lg"
            )}
            title="Delete node"
          >
            <Trash2 className="w-3 h-3" />
          </button>

          {/* Node Content */}
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
              "bg-white/20 backdrop-blur-sm"
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate leading-tight">
                {prettyNodeTitle(data)}
              </div>
              <div className="text-xs opacity-75 truncate mt-0.5">
                {data.label}
              </div>
            </div>
          </div>

          {/* Add Next Button for non-condition nodes */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddAfter({ sourceNodeId: id, sourceHandle: "default" });
              }}
              className={cn(
                "flex items-center gap-2 rounded-lg border-2 px-4 py-1.5 text-xs font-medium transition-all",
                "bg-white/20 border-white/40 backdrop-blur-sm",
                "hover:bg-white/30 hover:border-white/60"
              )}
              title="Add next node"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Next
            </button>
          </div>
        </div>
      )}

      {/* Branch Cards for Conditions */}
      {isCondition && hasBranches && (
        <div className="mt-4 flex gap-3 justify-center">
          {branches.map((branch: any, idx: number) => (
            <div
              key={branch.id}
              className="relative flex flex-col items-center"
            >
              {/* Connector line from main node */}
              <div className="w-px h-4 bg-border" />
              
              {/* Branch Card */}
              <div className="border rounded-lg bg-blue-50 border-blue-200 px-3 py-2 min-w-[140px] max-w-[180px]">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertTriangle className="w-3 h-3" />
                  <span className="text-xs font-medium truncate">{branch.name}</span>
                </div>
                {branch.segments && branch.segments[0]?.field && (
                  <div className="text-xs text-blue-600/70 mt-1 truncate">
                    If "{branch.segments[0].field}" {branch.segments[0].operator}...
                  </div>
                )}
              </div>

              {/* Add button below branch */}
              <div className="mt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Use branch index as handle identifier
                    onAddAfter({ sourceNodeId: id, sourceHandle: idx === 0 ? "yes" : idx === 1 ? "no" : "none" });
                  }}
                  className="w-6 h-6 rounded-full border-2 border-border bg-card flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Source Handle for this branch */}
              <Handle
                type="source"
                position={Position.Bottom}
                id={idx === 0 ? "yes" : idx === 1 ? "no" : "none"}
                className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background"
                style={{ position: "relative", transform: "none", left: "auto", bottom: "auto" }}
              />
            </div>
          ))}

          {/* None Branch */}
          <div className="relative flex flex-col items-center">
            {/* Connector line from main node */}
            <div className="w-px h-4 bg-border" />
            
            {/* None Branch Card */}
            <div className="border rounded-lg bg-gray-50 border-gray-200 px-3 py-2 min-w-[100px]">
              <div className="flex items-center gap-2 text-gray-600">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-xs font-medium">None</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                When none of the conditions are met
              </div>
            </div>

            {/* Add button below none branch */}
            <div className="mt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddAfter({ sourceNodeId: id, sourceHandle: "none" });
                }}
                className="w-6 h-6 rounded-full border-2 border-border bg-card flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Source Handle for none */}
            <Handle
              type="source"
              position={Position.Bottom}
              id="none"
              className="!w-3 !h-3 !bg-gray-500 !border-2 !border-background"
              style={{ position: "relative", transform: "none", left: "auto", bottom: "auto" }}
            />
          </div>
        </div>
      )}

      {/* Default branch buttons for conditions without saved branches */}
      {isCondition && !hasBranches && (
        <>
          {isSplit ? (
            // Split A/B - two paths
            <div className="mt-4 grid grid-cols-2 gap-2">
              {(["yes", "no"] as const).map((handle, idx) => (
                <button
                  key={handle}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddAfter({ sourceNodeId: id, sourceHandle: handle });
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all",
                    "border bg-card",
                    handle === "yes" && "border-blue-300 text-blue-600 hover:bg-blue-50",
                    handle === "no" && "border-purple-300 text-purple-600 hover:bg-purple-50"
                  )}
                  title={`Add to ${idx === 0 ? "Path A" : "Path B"}`}
                >
                  <Plus className="w-3 h-3" />
                  {idx === 0 ? "Path A" : "Path B"}
                </button>
              ))}
            </div>
          ) : (
            // If/Else - three paths
            <div className="mt-4 grid grid-cols-3 gap-2">
              {(["yes", "no", "none"] as const).map((handle) => (
                <button
                  key={handle}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddAfter({ sourceNodeId: id, sourceHandle: handle });
                  }}
                  className={cn(
                    "flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-medium transition-all",
                    "border bg-card",
                    handle === "yes" && "border-green-300 text-green-600 hover:bg-green-50",
                    handle === "no" && "border-red-300 text-red-600 hover:bg-red-50",
                    handle === "none" && "border-gray-300 text-gray-600 hover:bg-gray-50"
                  )}
                  title={`Add after ${handle}`}
                >
                  <Plus className="w-3 h-3" />
                  {handle === "none" ? "None" : handle.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Source Handles */}
      {isCondition && !hasBranches && isSplit ? (
        // Split A/B - two handles
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background"
            style={{ left: "30%" }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
            style={{ left: "70%" }}
          />
        </>
      ) : isCondition && !hasBranches ? (
        // If/Else - three handles (only when no branches saved)
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            className="!w-3 !h-3 !bg-green-500 !border-2 !border-background"
            style={{ left: "20%" }}
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
            style={{ left: "80%" }}
          />
        </>
      ) : !isCondition ? (
        <Handle
          type="source"
          position={Position.Bottom}
          id="default"
          className="!w-3 !h-3 !bg-workflow-connector !border-2 !border-background"
        />
      ) : null}
    </div>
  );
};
