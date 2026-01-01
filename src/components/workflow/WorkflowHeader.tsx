import React, { useState, useEffect } from "react";
import { ChevronLeft, Pencil, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TopTab } from "./types";
import { cn } from "@/lib/utils";

interface WorkflowHeaderProps {
  workflowName: string;
  setWorkflowName: (name: string) => void;
  workflowStatus: "draft" | "active" | "paused";
  setWorkflowStatus: (status: "draft" | "active") => void;
  topTab: TopTab;
  setTopTab: (tab: TopTab) => void;
  onBack: () => void;
  onSave: () => void;
  onTestWorkflow: () => void;
  hasUnsavedChanges: boolean;
  isSaving?: boolean;
  showSavedMessage?: boolean;
}

export const WorkflowHeader: React.FC<WorkflowHeaderProps> = ({
  workflowName,
  setWorkflowName,
  workflowStatus,
  setWorkflowStatus,
  topTab,
  setTopTab,
  onBack,
  onSave,
  onTestWorkflow,
  hasUnsavedChanges,
  isSaving,
  showSavedMessage,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(workflowName);

  useEffect(() => {
    setTempName(workflowName);
  }, [workflowName]);

  const handleNameSubmit = () => {
    if (tempName.trim()) {
      setWorkflowName(tempName.trim());
    } else {
      setTempName(workflowName);
    }
    setIsEditingName(false);
  };

  const tabs: { id: TopTab; label: string }[] = [
    { id: "builder", label: "Builder" },
    { id: "settings", label: "Settings" },
    { id: "history", label: "Enrollment History" },
    { id: "logs", label: "Execution Logs" },
  ];

  return (
    <div className="bg-background border-b">
      {/* Top Row */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left - Back Link */}
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Workflows
        </button>

        {/* Center - Workflow Name */}
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleNameSubmit();
                if (e.key === "Escape") {
                  setTempName(workflowName);
                  setIsEditingName(false);
                }
              }}
              className="w-[300px] text-center font-medium text-lg h-8"
              autoFocus
            />
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-2 text-lg font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              {workflowName}
              <Pencil className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right - History Icon and Save Button */}
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Revision History">
            <Clock className="w-5 h-5 text-muted-foreground" />
          </button>
          
          <div className="relative flex items-center gap-2">
            <Button
              onClick={onSave}
              size="sm"
              className="relative bg-green-600 hover:bg-green-700 text-white px-4"
              disabled={isSaving}
            >
              {hasUnsavedChanges && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
              {isSaving ? "Saving..." : "Saved"}
            </Button>
            
            {showSavedMessage && (
              <div className="flex items-center gap-2 px-3 py-2 bg-background border rounded-lg shadow-sm animate-in fade-in slide-in-from-right-2">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium">Saved!</div>
                  <div className="text-muted-foreground text-xs">Workflow has been saved.</div>
                </div>
                <button className="ml-2 text-muted-foreground hover:text-foreground">×</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row - Tabs */}
      <div className="flex items-center justify-between px-4 border-t">
        {/* Left spacer */}
        <div className="w-[180px]" />

        {/* Center - Navigation Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTopTab(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition-colors relative",
                topTab === tab.id
                  ? "text-blue-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {topTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Right - Test Workflow & Draft/Publish Toggle */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onTestWorkflow}
            variant="outline"
            size="sm"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Test Workflow
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Draft</span>
            <Switch
              checked={workflowStatus === "active"}
              onCheckedChange={(checked) => setWorkflowStatus(checked ? "active" : "draft")}
              className="data-[state=checked]:bg-blue-600"
            />
            <span className="text-sm font-medium text-foreground">Publish</span>
          </div>
        </div>
      </div>
    </div>
  );
};
