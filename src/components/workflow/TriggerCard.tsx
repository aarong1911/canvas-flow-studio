import React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { RFNodeData, ColorKey } from "./types";
import { LucideIcon } from "lucide-react";

interface TriggerCardProps {
  id: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  color: ColorKey;
  isConfigured: boolean;
  selected: boolean;
  onClick: () => void;
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

export const TriggerCard: React.FC<TriggerCardProps> = ({
  id,
  label,
  sublabel,
  icon: Icon,
  color,
  isConfigured,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-card border rounded-xl px-4 py-3 cursor-pointer transition-all duration-200",
        "min-w-[200px] max-w-[240px]",
        "shadow-sm hover:shadow-md",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        !isConfigured && "border-dashed border-muted-foreground/30"
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
          <div className="text-xs font-medium text-green-600 uppercase tracking-wide">
            Trigger
          </div>
          <div className="text-sm font-medium text-foreground truncate">
            {sublabel || label}
          </div>
        </div>
      </div>
    </div>
  );
};

interface AddTriggerCardProps {
  onClick: () => void;
}

export const AddTriggerCard: React.FC<AddTriggerCardProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative bg-card border-2 border-dashed border-primary/40 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200",
        "min-w-[160px] h-[72px]",
        "hover:border-primary/60 hover:bg-primary/5",
        "flex items-center justify-center gap-2"
      )}
    >
      <Plus className="w-5 h-5 text-primary" />
      <span className="text-sm font-medium text-primary">Add New Trigger</span>
    </div>
  );
};
