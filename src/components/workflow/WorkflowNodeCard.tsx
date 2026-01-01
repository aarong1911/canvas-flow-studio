import React from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { Trash2, Plus } from "lucide-react";
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
      bg: "bg-gradient-to-br from-amber-400 to-amber-500",
      text: "text-amber-950",
      border: "border-amber-300",
      shadow: "shadow-amber-500/20",
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
  const isTrigger = data.builderType === "trigger";

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

      {/* Node Card */}
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

        {/* Branch Buttons for Conditions */}
        {isCondition ? (
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
                  "border-2 backdrop-blur-sm",
                  handle === "yes" && "bg-green-500/90 border-green-400 text-white hover:bg-green-500",
                  handle === "no" && "bg-red-500/90 border-red-400 text-white hover:bg-red-500",
                  handle === "none" && "bg-gray-500/90 border-gray-400 text-white hover:bg-gray-500"
                )}
                title={`Add after ${handle}`}
              >
                <Plus className="w-3 h-3" />
                {handle === "none" ? "None" : handle.toUpperCase()}
              </button>
            ))}
          </div>
        ) : (
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
        )}
      </div>

      {/* Source Handles */}
      {isCondition ? (
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
      ) : (
        <Handle
          type="source"
          position={Position.Bottom}
          id="default"
          className="!w-3 !h-3 !bg-workflow-connector !border-2 !border-background"
        />
      )}
    </div>
  );
};
