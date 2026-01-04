import React, { useState } from "react";
import { Plus, GripVertical, MoreVertical, ChevronUp, ChevronDown, Clock, Tag, Calendar, CheckSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export interface ConditionSegment {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface ConditionBranch {
  id: string;
  name: string;
  segments: ConditionSegment[];
  logic: "AND" | "OR";
}

export interface ConditionConfig {
  action_name: string;
  scenario_recipe: string;
  branches: ConditionBranch[];
}

interface ConditionSettingsProps {
  config: ConditionConfig;
  onChange: (config: ConditionConfig) => void;
  onSave: () => void;
  onCancel: () => void;
  onClose?: () => void;
  nodeLabel: string;
  nodeDescription?: string;
  icon?: React.ReactNode;
}

const SCENARIO_RECIPES = [
  { value: "build_your_own", label: "Build Your Own", description: "Select conditions based on your own criteria", icon: CheckSquare },
  { value: "availability", label: "Availability", description: "Prepare branches based on opening and closing hours", icon: Clock },
  { value: "has_tag", label: "Has Tag", description: "Prepare branches based on Contact tags", icon: Tag },
  { value: "last_appointment_at", label: "Last Appointment At", description: "Create branches based on contact's last confirmed appointment", icon: Calendar },
];

const FIELD_OPTIONS = [
  { value: "contact.email", label: "Contact Email" },
  { value: "contact.phone", label: "Contact Phone" },
  { value: "contact.first_name", label: "First Name" },
  { value: "contact.last_name", label: "Last Name" },
  { value: "contact.tag", label: "Contact Tag" },
  { value: "contact.source", label: "Contact Source" },
  { value: "contact.last_appointment_days", label: "Days Since Last Appointment" },
  { value: "deal.value", label: "Deal Value" },
  { value: "deal.stage", label: "Deal Stage" },
  { value: "system.current_hour", label: "Current Hour (0-23)" },
  { value: "system.day_of_week", label: "Day of Week" },
];

const OPERATOR_OPTIONS = [
  { value: "equals", label: "Equals" },
  { value: "not_equals", label: "Not Equals" },
  { value: "contains", label: "Contains" },
  { value: "not_contains", label: "Does Not Contain" },
  { value: "is_empty", label: "Is Empty" },
  { value: "is_not_empty", label: "Is Not Empty" },
  { value: "greater_than", label: "Greater Than" },
  { value: "less_than", label: "Less Than" },
];

function createSegment(field = "", operator = "", value = ""): ConditionSegment {
  return {
    id: `seg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    field,
    operator,
    value,
  };
}

function createBranch(name = "Branch", segments?: ConditionSegment[], logic: "AND" | "OR" = "AND"): ConditionBranch {
  return {
    id: `branch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    segments: segments || [createSegment()],
    logic,
  };
}

// Template configurations for each scenario recipe
function getTemplateForRecipe(recipe: string): ConditionBranch[] {
  const timestamp = Date.now();
  
  switch (recipe) {
    case "availability":
      return [
        {
          id: `branch_${timestamp}_open`,
          name: "Open Hours",
          segments: [
            { id: `seg_${timestamp}_1`, field: "system.current_hour", operator: "greater_than", value: "9" },
            { id: `seg_${timestamp}_2`, field: "system.current_hour", operator: "less_than", value: "17" },
          ],
          logic: "AND",
        },
        {
          id: `branch_${timestamp}_closed`,
          name: "Closed Hours",
          segments: [
            { id: `seg_${timestamp}_3`, field: "system.current_hour", operator: "less_than", value: "9" },
          ],
          logic: "OR",
        },
      ];
    
    case "has_tag":
      return [
        {
          id: `branch_${timestamp}_has`,
          name: "Has Tag",
          segments: [
            { id: `seg_${timestamp}_1`, field: "contact.tag", operator: "contains", value: "" },
          ],
          logic: "AND",
        },
        {
          id: `branch_${timestamp}_no`,
          name: "Missing Tag",
          segments: [
            { id: `seg_${timestamp}_2`, field: "contact.tag", operator: "not_contains", value: "" },
          ],
          logic: "AND",
        },
      ];
    
    case "last_appointment_at":
      return [
        {
          id: `branch_${timestamp}_recent`,
          name: "Recent Appointment",
          segments: [
            { id: `seg_${timestamp}_1`, field: "contact.last_appointment_days", operator: "less_than", value: "30" },
          ],
          logic: "AND",
        },
        {
          id: `branch_${timestamp}_old`,
          name: "Overdue for Appointment",
          segments: [
            { id: `seg_${timestamp}_2`, field: "contact.last_appointment_days", operator: "greater_than", value: "90" },
          ],
          logic: "AND",
        },
        {
          id: `branch_${timestamp}_none`,
          name: "No Appointment",
          segments: [
            { id: `seg_${timestamp}_3`, field: "contact.last_appointment_days", operator: "is_empty", value: "" },
          ],
          logic: "AND",
        },
      ];
    
    case "build_your_own":
    default:
      return [createBranch("Branch")];
  }
}

export const ConditionSettings: React.FC<ConditionSettingsProps> = ({
  config,
  onChange,
  onSave,
  onCancel,
  onClose,
  nodeLabel,
  nodeDescription,
  icon,
}) => {
  const [expandedBranches, setExpandedBranches] = useState<Record<string, boolean>>({});

  const updateBranch = (branchId: string, updates: Partial<ConditionBranch>) => {
    onChange({
      ...config,
      branches: config.branches.map((b) =>
        b.id === branchId ? { ...b, ...updates } : b
      ),
    });
  };

  const updateSegment = (branchId: string, segmentId: string, updates: Partial<ConditionSegment>) => {
    onChange({
      ...config,
      branches: config.branches.map((b) =>
        b.id === branchId
          ? {
              ...b,
              segments: b.segments.map((s) =>
                s.id === segmentId ? { ...s, ...updates } : s
              ),
            }
          : b
      ),
    });
  };

  const addSegment = (branchId: string) => {
    onChange({
      ...config,
      branches: config.branches.map((b) =>
        b.id === branchId ? { ...b, segments: [...b.segments, createSegment()] } : b
      ),
    });
  };

  const removeSegment = (branchId: string, segmentId: string) => {
    onChange({
      ...config,
      branches: config.branches.map((b) =>
        b.id === branchId
          ? { ...b, segments: b.segments.filter((s) => s.id !== segmentId) }
          : b
      ),
    });
  };

  const addBranch = () => {
    onChange({
      ...config,
      branches: [...config.branches, createBranch()],
    });
  };

  const removeBranch = (branchId: string) => {
    onChange({
      ...config,
      branches: config.branches.filter((b) => b.id !== branchId),
    });
  };

  const duplicateBranch = (branchId: string) => {
    const branch = config.branches.find((b) => b.id === branchId);
    if (!branch) return;
    const newBranch: ConditionBranch = {
      ...branch,
      id: `branch_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      name: `${branch.name} (copy)`,
      segments: branch.segments.map((s) => ({
        ...s,
        id: `seg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      })),
    };
    onChange({
      ...config,
      branches: [...config.branches, newBranch],
    });
  };

  const moveBranch = (branchId: string, direction: "up" | "down") => {
    const index = config.branches.findIndex((b) => b.id === branchId);
    if (index === -1) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= config.branches.length) return;
    const newBranches = [...config.branches];
    [newBranches[index], newBranches[newIndex]] = [newBranches[newIndex], newBranches[index]];
    onChange({ ...config, branches: newBranches });
  };

  const toggleBranchExpand = (branchId: string) => {
    setExpandedBranches((prev) => ({ ...prev, [branchId]: !prev[branchId] }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <div className="text-base font-semibold text-foreground">{nodeLabel}</div>
              <div className="text-sm text-muted-foreground">
                {nodeDescription || "Fork the contact's journey through this workflow based on conditions"}
              </div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Close">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Action Name */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase text-muted-foreground">Action Name</Label>
            <div className="relative">
              <Input
                value={config.action_name || ""}
                onChange={(e) => onChange({ ...config, action_name: e.target.value })}
                placeholder="Condition"
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                {(config.action_name || "").length}
              </span>
            </div>
          </div>

          {/* Scenario Recipe */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase text-muted-foreground">Scenario Recipe</Label>
            <p className="text-xs text-muted-foreground">Select from one of the pre-built condition templates</p>
            <Select
              value={config.scenario_recipe || "build_your_own"}
              onValueChange={(v) => {
                const templateBranches = getTemplateForRecipe(v);
                onChange({ 
                  ...config, 
                  scenario_recipe: v,
                  branches: templateBranches,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a recipe" />
              </SelectTrigger>
              <SelectContent>
                {SCENARIO_RECIPES.map((recipe) => (
                  <SelectItem key={recipe.value} value={recipe.value}>
                    {recipe.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branches */}
          <div className="space-y-3">
            <Label className="text-xs font-medium uppercase text-muted-foreground">Branches</Label>

            {config.branches.map((branch, branchIndex) => {
              const isExpanded = expandedBranches[branch.id] !== false;
              return (
                <div key={branch.id} className="border rounded-lg bg-card overflow-hidden">
                  {/* Branch Header */}
                  <div className="flex items-center gap-2 p-3 border-b bg-muted/30">
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1">
                      <Input
                        value={branch.name}
                        onChange={(e) => updateBranch(branch.id, { name: e.target.value })}
                        className="h-8 font-medium"
                        placeholder="Branch name"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{branchIndex + 1}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => duplicateBranch(branch.id)}>
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => moveBranch(branch.id, "up")} disabled={branchIndex === 0}>
                          Move Up
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => moveBranch(branch.id, "down")} disabled={branchIndex === config.branches.length - 1}>
                          Move Down
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeBranch(branch.id)} className="text-destructive" disabled={config.branches.length <= 1}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleBranchExpand(branch.id)}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Branch Content */}
                  {isExpanded && (
                    <div className="p-3 space-y-3">
                      {/* Segments */}
                      {branch.segments.map((segment, segIndex) => (
                        <div key={segment.id} className="space-y-2">
                          <div className="flex gap-2">
                            <Select
                              value={segment.field}
                              onValueChange={(v) => updateSegment(branch.id, segment.id, { field: v })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {FIELD_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={segment.operator}
                              onValueChange={(v) => updateSegment(branch.id, segment.id, { operator: v })}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue placeholder="Select Operator" />
                              </SelectTrigger>
                              <SelectContent>
                                {OPERATOR_OPTIONS.map((opt) => (
                                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          {segment.operator && !["is_empty", "is_not_empty"].includes(segment.operator) && (
                            <Input
                              value={segment.value}
                              onChange={(e) => updateSegment(branch.id, segment.id, { value: e.target.value })}
                              placeholder="Value"
                            />
                          )}
                          {segIndex < branch.segments.length - 1 && (
                            <div className="flex items-center gap-2">
                              <Select
                                value={branch.logic}
                                onValueChange={(v) => updateBranch(branch.id, { logic: v as "AND" | "OR" })}
                              >
                                <SelectTrigger className="w-20 h-7 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="AND">AND</SelectItem>
                                  <SelectItem value="OR">OR</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => removeSegment(branch.id, segment.id)}
                              >
                                <Plus className="w-4 h-4 rotate-45" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Segment */}
                      <button
                        onClick={() => addSegment(branch.id)}
                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        Add Segment
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Add Branch & Reorder */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={addBranch}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Branch
              </button>
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <GripVertical className="w-3 h-3" />
                Reorder Branches
              </Button>
            </div>
          </div>

          {/* None Branch Info */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-start gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <div className="font-medium text-sm">None Branch</div>
                <div className="text-xs text-muted-foreground">When no condition is met</div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t bg-muted/30 flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onSave}>
          Save Action
        </Button>
      </div>
    </div>
  );
};

export default ConditionSettings;
