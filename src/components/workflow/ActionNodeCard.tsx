import React from "react";
import { cn } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import { ColorKey, BuilderNodeType } from "./types";
import { LucideIcon } from "lucide-react";

interface ActionNodeCardProps {
  id: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  color: ColorKey;
  builderType: BuilderNodeType;
  selected: boolean;
  onClick: () => void;
  onMenuClick?: () => void;
}

const colorIconClasses: Record<ColorKey, string> = {
  purple: "bg-purple-100 text-purple-600",
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  amber: "bg-amber-100 text-amber-600",
  orange: "bg-orange-100 text-orange-600",
  gray: "bg-gray-100 text-gray-600",
};

export const ActionNodeCard: React.FC<ActionNodeCardProps> = ({
  id,
  label,
  sublabel,
  icon: Icon,
  color,
  builderType,
  selected,
  onClick,
  onMenuClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-card border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 select-none",
        "min-w-[220px] max-w-[280px]",
        "shadow-sm hover:shadow-md",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          colorIconClasses[color]
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-foreground truncate">
            {sublabel || label}
          </div>
        </div>
        {onMenuClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMenuClick();
            }}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
    </div>
  );
};

interface PlaceholderNodeProps {
  onClick: () => void;
}

export const PlaceholderNode: React.FC<PlaceholderNodeProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-muted/50 border border-dashed border-muted-foreground/30 rounded-xl px-6 py-3 cursor-pointer transition-all duration-200 select-none",
        "min-w-[200px]",
        "hover:bg-muted hover:border-muted-foreground/50",
        "flex items-center justify-center"
      )}
    >
      <span className="text-sm text-muted-foreground">Please select action</span>
    </div>
  );
};
