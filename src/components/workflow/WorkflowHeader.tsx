import React from "react";
import { ArrowLeft, Save, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopTab } from "./types";

interface WorkflowHeaderProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowStatus: "draft" | "active" | "paused";
  topTab: TopTab;
  setTopTab: (tab: TopTab) => void;
  onBack: () => void;
  onSave: () => void;
  onPublish: () => void;
  isSaving?: boolean;
  isPublishing?: boolean;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  workflowName,
  setWorkflowName,
  workflowStatus,
  topTab,
  setTopTab,
  onBack,
  onSave,
  onPublish,
  isSaving,
  isPublishing,
}) => {
  const statusBadge = {
    active: { variant: "default" as const, label: "Active", className: "bg-green-500 hover:bg-green-500" },
    draft: { variant: "secondary" as const, label: "Draft", className: "" },
    paused: { variant: "outline" as const, label: "Paused", className: "" },
  }[workflowStatus];

  return (
    <div className="bg-card border-b px-4 py-3">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <div className="h-6 w-px bg-border" />

          <Input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="w-[220px] font-semibold border-transparent hover:border-input focus:border-input transition-colors"
          />

          <Badge variant={statusBadge.variant} className={statusBadge.className}>
            {statusBadge.label}
          </Badge>
        </div>

        {/* Center */}
        <div className="flex justify-center">
          <Tabs value={topTab} onValueChange={(v) => setTopTab(v as TopTab)}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="builder" className="data-[state=active]:bg-background">
                Builder
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-background">
                Settings
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-background">
                Enrollment History
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-background">
                Execution Logs
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Right */}
        <div className="flex items-center justify-end gap-2">
          <Button 
            onClick={onSave} 
            variant="outline" 
            size="sm" 
            className="gap-2"
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button 
            onClick={onPublish} 
            size="sm" 
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={isPublishing}
          >
            <Play className="w-4 h-4" />
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
    </div>
  );
};
