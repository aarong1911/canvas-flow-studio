import React from "react";
import { EdgeProps, getBezierPath, getSmoothStepPath } from "reactflow";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomEdgeProps extends EdgeProps {
  onAddNode?: (edgeId: string, sourceId: string, targetId: string) => void;
}

export const EdgeWithPlusButton: React.FC<CustomEdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
  source,
  target,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Get the onAddNode function from data if available
  const onAddNode = data?.onAddNode;

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
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
              if (onAddNode) {
                onAddNode(id, source, target);
              }
            }}
            className={cn(
              "w-6 h-6 rounded-full bg-card border border-border shadow-sm",
              "flex items-center justify-center",
              "hover:bg-primary hover:border-primary hover:text-primary-foreground",
              "transition-all duration-200 group cursor-pointer"
            )}
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary-foreground" />
          </button>
        </div>
      </foreignObject>
    </>
  );
};