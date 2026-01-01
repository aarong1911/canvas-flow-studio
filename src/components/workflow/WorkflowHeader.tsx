import React, { useState, useEffect } from "react";
import { ChevronLeft, Pencil, Clock, Check, X, Loader2 } from "lucide-react";
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
  onDismissSavedMessage?: () => void;
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
  onDismissSavedMessage,
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
          
          <div className="relative">
            <Button
              onClick={onSave}
              size="sm"
              className={cn(
                "relative px-4 transition-all",
                hasUnsavedChanges && !isSaving
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-100 hover:bg-blue-100 text-blue-600"
              )}
              disabled={isSaving || !hasUnsavedChanges}
            >
              {hasUnsavedChanges && !isSaving && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving
                </>
              ) : hasUnsavedChanges ? (
                "Save"
              ) : (
                "Saved"
              )}
            </Button>
          </div>

          {/* Saved message toast */}
          {showSavedMessage && (
            <div className="absolute top-16 right-4 flex items-center gap-3 px-4 py-3 bg-background border rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 z-50">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-sm">
                <div className="font-medium">Saved!</div>
                <div className="text-muted-foreground">Workflow has been saved.</div>
              </div>
              <button 
                onClick={onDismissSavedMessage}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
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
