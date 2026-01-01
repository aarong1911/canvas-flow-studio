import React from "react";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface PlusButtonProps {
  onClick: () => void;
  className?: string;
}

export const PlusButton: React.FC<PlusButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-6 h-6 rounded-full bg-card border border-border shadow-sm",
        "flex items-center justify-center",
        "hover:bg-primary hover:border-primary hover:text-primary-foreground",
        "transition-all duration-200 group",
        className
      )}
    >
      <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary-foreground" />
    </button>
  );
};
