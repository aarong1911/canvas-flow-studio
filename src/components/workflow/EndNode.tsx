import React from "react";
import { cn } from "@/lib/utils";

interface EndNodeProps {
  className?: string;
}

export const EndNode: React.FC<EndNodeProps> = ({ className }) => {
  return (
    <div className={cn(
      "bg-muted border border-border rounded-full px-4 py-1.5 select-none",
      "text-xs font-medium text-muted-foreground uppercase tracking-wide",
      "shadow-sm",
      className
    )}>
      END
    </div>
  );
};
