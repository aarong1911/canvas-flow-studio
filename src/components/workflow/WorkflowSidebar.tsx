import React, { useMemo, useRef, useState } from "react";
import { Search, X, Settings, Link2Off, ChevronRight, GripVertical, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";

import {
  RFNode,
  RFEdge,
  NodeLibraryItem,
  SidebarTab,
  WorkflowSettings,
  BuilderNodeType,
  ColorKey,
  TriggerData,
} from "./types";
import { TRIGGERS, ACTIONS, NODE_CONFIGS, ALL_LIBRARY_ITEMS } from "./node-library";
import { CustomFieldInput } from "./CustomFieldInput";
import { CustomFieldTextarea } from "./CustomFieldTextarea";
import { RichTextEditor } from "./RichTextEditor";
import { ConditionSettings, ConditionConfig, ConditionBranch } from "./ConditionSettings";

interface WorkflowSidebarProps {
  tab: SidebarTab;
  setTab: (tab: SidebarTab) => void;
  search: string;
  setSearch: (s: string) => void;
  selectedNode: RFNode | null;
  selectedEdge: RFEdge | null;
  selectedTrigger: TriggerData | null;
  settings: WorkflowSettings;
  setSettings: (s: WorkflowSettings) => void;
  onAddNode: (item: NodeLibraryItem) => void;
  onSelectTriggerType: (item: NodeLibraryItem) => void;
  onSaveNodeConfig: (nodeId: string, config: Record<string, any>) => void;
  onSaveTriggerConfig: (triggerId: string, config: Record<string, any>) => void;
  onPersistNodeConfig: (nodeId: string, config: Record<string, any>) => Promise<void>;
  onPersistWorkflowSettings: (settings: WorkflowSettings) => Promise<void>;
  onDisconnectEdge: (edgeId: string) => void;
}

const BLUE_SWITCH_CLASS =
  "data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-200 [&>span]:data-[state=checked]:translate-x-4";

function kindLabel(kind: BuilderNodeType) {
  const map: Record<BuilderNodeType, string> = {
    trigger: "Trigger",
    action: "Action",
    condition: "Condition",
    delay: "Delay",
  };
  return map[kind] || "Node";
}

function colorClasses(color: ColorKey) {
  const map: Record<ColorKey, { chipBg: string; chipText: string }> = {
    purple: { chipBg: "bg-purple-100", chipText: "text-purple-700" },
    blue: { chipBg: "bg-blue-100", chipText: "text-blue-700" },
    green: { chipBg: "bg-green-100", chipText: "text-green-700" },
    red: { chipBg: "bg-red-100", chipText: "text-red-700" },
    amber: { chipBg: "bg-amber-100", chipText: "text-amber-700" },
    orange: { chipBg: "bg-orange-100", chipText: "text-orange-700" },
    gray: { chipBg: "bg-gray-100", chipText: "text-gray-700" },
  };
  return map[color] || map.gray;
}

function insertAtCursor(el: HTMLInputElement | HTMLTextAreaElement, text: string) {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  el.setRangeText(text, start, end, "end");
  el.focus();
}

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  tab,
  setTab,
  search,
  setSearch,
  selectedNode,
  selectedEdge,
  selectedTrigger,
  settings,
  setSettings,
  onAddNode,
  onSelectTriggerType,
  onSaveNodeConfig,
  onSaveTriggerConfig,
  onPersistNodeConfig,
  onPersistWorkflowSettings,
  onDisconnectEdge,
}) => {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});
  const [dirtyNodeId, setDirtyNodeId] = useState<string | null>(null);
  const [triggerConfig, setTriggerConfig] = useState<Record<string, any>>({});
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // Sync local config when selected node changes
  React.useEffect(() => {
    if (selectedNode) {
      setLocalConfig(selectedNode.data.config || {});
      setDirtyNodeId(selectedNode.id);
    } else {
      setLocalConfig({});
      setDirtyNodeId(null);
    }
  }, [selectedNode?.id]);

  // Sync trigger config when selected trigger changes
  React.useEffect(() => {
    if (selectedTrigger) {
      setTriggerConfig(selectedTrigger.config || {});
    } else {
      setTriggerConfig({});
    }
  }, [selectedTrigger?.id]);

  const nodeSchema = selectedNode ? NODE_CONFIGS[selectedNode.data.actionType] : null;
  const triggerSchema = selectedTrigger ? NODE_CONFIGS[selectedTrigger.actionType] : null;
  const variables = nodeSchema?.variables || [];

  // Filter triggers list
  const triggersGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    const allTriggers = Object.values(TRIGGERS).flat();
    const filtered = q
      ? allTriggers.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.group.toLowerCase().includes(q)
        )
      : allTriggers;

    const grouped: Record<string, NodeLibraryItem[]> = {};
    for (const item of filtered) {
      if (!grouped[item.group]) grouped[item.group] = [];
      grouped[item.group].push(item);
    }

    return Object.entries(grouped);
  }, [search]);

  // Filter actions list
  const actionsGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    const allActions = Object.values(ACTIONS).flat();
    const filtered = q
      ? allActions.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.group.toLowerCase().includes(q)
        )
      : allActions;

    const grouped: Record<string, NodeLibraryItem[]> = {};
    for (const item of filtered) {
      if (!grouped[item.group]) grouped[item.group] = [];
      grouped[item.group].push(item);
    }

    return Object.entries(grouped);
  }, [search]);

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <div className="w-[380px] bg-card border-l flex flex-col h-full">
      {/* TRIGGERS TAB - List of available triggers */}
      {tab === "triggers" && (
        <>
          <div className="flex-shrink-0 p-4 border-b">
            <div className="text-sm font-semibold text-foreground mb-1">Triggers</div>
            <div className="text-xs text-muted-foreground mb-3">Select a trigger to start your workflow</div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Triggers"
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {triggersGroups.length === 0 && (
                <div className="text-sm text-muted-foreground p-4 text-center">
                  No triggers match your search.
                </div>
              )}

              {triggersGroups.map(([group, items]) => (
                <Collapsible
                  key={group}
                  open={openGroups[group] !== false}
                  onOpenChange={() => toggleGroup(group)}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 px-1 hover:bg-muted/50 rounded-lg transition-colors">
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        openGroups[group] !== false && "rotate-90"
                      )}
                    />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      {group}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {items.length}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-1">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const cls = colorClasses(item.color);
                      return (
                        <div
                          key={item.id}
                          onClick={() => onSelectTriggerType(item)}
                          className="w-full flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors text-left cursor-pointer hover:border-primary/50 hover:shadow-sm"
                        >
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", cls.chipBg)}>
                            <Icon className={cn("w-4 h-4", cls.chipText)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {item.label}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {/* ACTIONS TAB - List of available actions */}
      {tab === "actions" && (
        <>
          <div className="flex-shrink-0 p-4 border-b">
            <div className="text-sm font-semibold text-foreground mb-1">Actions</div>
            <div className="text-xs text-muted-foreground mb-3">Pick an action for this step</div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Action"
                className="pl-9"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {actionsGroups.length === 0 && (
                <div className="text-sm text-muted-foreground p-4 text-center">
                  No actions match your search.
                </div>
              )}

              {actionsGroups.map(([group, items]) => (
                <Collapsible
                  key={group}
                  open={openGroups[group] !== false}
                  onOpenChange={() => toggleGroup(group)}
                >
                  <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 px-1 hover:bg-muted/50 rounded-lg transition-colors">
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        openGroups[group] !== false && "rotate-90"
                      )}
                    />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      {group}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {items.length}
                    </span>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-1">
                    {items.map((item) => {
                      const Icon = item.icon;
                      const cls = colorClasses(item.color);
                      return (
                        <div
                          key={item.id}
                          onClick={() => onAddNode(item)}
                          className="w-full flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors text-left cursor-pointer hover:border-primary/50 hover:shadow-sm"
                        >
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", cls.chipBg)}>
                            <Icon className={cn("w-4 h-4", cls.chipText)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {item.label}
                            </div>
                            <div className="text-xs text-muted-foreground">{kindLabel(item.kind)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </ScrollArea>
        </>
      )}

      {/* SETTINGS TAB - Configure selected node, trigger, or edge */}
      {tab === "settings" && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Hide header for condition nodes since ConditionSettings has its own */}
          {!(selectedNode && !selectedTrigger && selectedNode.data.builderType === "condition") && (
            <div className="flex-shrink-0 p-4 border-b flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-foreground">
                  {selectedTrigger ? "Workflow Trigger" : selectedNode ? selectedNode.data.label : selectedEdge ? "Connection" : "Configure"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {selectedTrigger 
                    ? "Adds a workflow trigger, and on execution, the contact gets added to the workflow."
                    : selectedNode 
                      ? "Configure this action" 
                      : selectedEdge 
                        ? "Connection details" 
                        : "Select a node to configure"}
                </div>
              </div>
              <button onClick={() => setTab("triggers")} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Close">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )}

          {/* Trigger Configuration */}
          {selectedTrigger && (
            <>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {/* Trigger Type Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">CHOOSE A WORKFLOW TRIGGER</Label>
                    <div className="p-3 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colorClasses(selectedTrigger.color).chipBg)}>
                          {React.createElement(selectedTrigger.icon, { className: cn("w-4 h-4", colorClasses(selectedTrigger.color).chipText) })}
                        </div>
                        <span className="text-sm font-medium">{selectedTrigger.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trigger Name */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">WORKFLOW TRIGGER NAME</Label>
                    <Input
                      value={triggerConfig.trigger_name || ""}
                      onChange={(e) => setTriggerConfig(s => ({ ...s, trigger_name: e.target.value }))}
                      placeholder={selectedTrigger.label}
                    />
                  </div>

                  {/* Additional trigger-specific fields would go here */}
                  {triggerSchema && triggerSchema.fields.map((field) => {
                    if (field.name === "trigger_name") return null;
                    const val = triggerConfig[field.name];

                    return (
                      <div key={field.name} className="space-y-2">
                        <Label className="text-sm font-medium uppercase">
                          {field.label}
                          {"required" in field && field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>

                        {field.type === "text" && (
                          <Input
                            value={val ?? ""}
                            onChange={(e) => setTriggerConfig((s) => ({ ...s, [field.name]: e.target.value }))}
                            placeholder={"placeholder" in field ? field.placeholder : ""}
                          />
                        )}

                        {field.type === "select" && (
                          <Select
                            value={val ?? ""}
                            onValueChange={(v) => setTriggerConfig((s) => ({ ...s, [field.name]: v }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${field.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="flex-shrink-0 p-4 border-t bg-muted/30">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    onSaveTriggerConfig(selectedTrigger.id, triggerConfig);
                  }}
                >
                  Save Trigger
                </Button>
              </div>
            </>
          )}

          {/* Edge Selected */}
          {!selectedNode && !selectedTrigger && selectedEdge && (
            <>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  <div className="text-sm font-medium text-foreground">Connection Details</div>
                  <div className="text-xs text-muted-foreground space-y-2 bg-muted/50 rounded-lg p-3">
                    <div>
                      <span className="font-medium">From:</span> {selectedEdge.source}
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {selectedEdge.target}
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => onDisconnectEdge(selectedEdge.id)}
                  >
                    <Link2Off className="w-4 h-4" />
                    Disconnect
                  </Button>
                </div>
              </ScrollArea>
            </>
          )}

          {/* Nothing Selected */}
          {!selectedNode && !selectedTrigger && !selectedEdge && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Select a trigger or node to configure it.</p>
              </div>
            </div>
          )}

          {/* Node Selected */}
          {selectedNode && !selectedTrigger && (
            <>
              {/* Check if this is a condition node */}
              {selectedNode.data.builderType === "condition" ? (
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                  <ConditionSettings
                    config={{
                      action_name: localConfig.action_name || "",
                      scenario_recipe: localConfig.scenario_recipe || "build_your_own",
                      branches: localConfig.branches || [
                        {
                          id: "branch_1",
                          name: "Branch",
                          segments: [{ id: "seg_1", field: "", operator: "", value: "" }],
                          logic: "AND" as const,
                        },
                      ],
                    }}
                    onChange={(newConfig) => setLocalConfig({ ...localConfig, ...newConfig })}
                    onSave={async () => {
                      if (!dirtyNodeId) return;
                      try {
                        await onPersistNodeConfig(dirtyNodeId, localConfig);
                        onSaveNodeConfig(dirtyNodeId, localConfig);
                      } catch (e: any) {
                        console.error(e);
                        toast.error(e?.message || "Failed to save node settings");
                      }
                    }}
                    onCancel={() => {
                      setLocalConfig(selectedNode.data.config || {});
                      toast.message("Changes reverted");
                    }}
                    onClose={() => setTab("triggers")}
                    nodeLabel={selectedNode.data.label}
                    nodeDescription={
                      selectedNode.data.actionType === "if_else"
                        ? "Fork the contact's journey through this workflow based on conditions"
                        : selectedNode.data.actionType === "split"
                        ? "Split contacts into different paths for A/B testing"
                        : "Evaluate conditions to determine the contact's path"
                    }
                    icon={<GitBranch className="w-5 h-5 text-blue-600" />}
                  />
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                      {!nodeSchema ? (
                        <div className="text-center py-10">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                            <Settings className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">No configuration needed for this node.</p>
                        </div>
                      ) : (
                        nodeSchema.fields.map((field) => {
                          const val = localConfig[field.name];
                          const showVars = !!nodeSchema.variables?.length && (field.type === "text" || field.type === "textarea");

                          return (
                            <div key={field.name} className="space-y-2">
                              <Label className="text-sm font-medium uppercase">
                                {field.label}
                                {"required" in field && field.required && <span className="text-destructive ml-1">*</span>}
                              </Label>

                              {"helperText" in field && field.helperText && (
                                <div className="text-xs text-muted-foreground">{field.helperText}</div>
                              )}

                              {field.type === "text" && (
                                <CustomFieldInput
                                  value={val ?? ""}
                                  onChange={(v) => setLocalConfig((s) => ({ ...s, [field.name]: v }))}
                                  placeholder={"placeholder" in field ? field.placeholder : ""}
                                  helperText={"helperText" in field ? field.helperText : undefined}
                                />
                              )}

                              {field.type === "number" && (
                                <Input
                                  type="number"
                                  value={val ?? ""}
                                  onChange={(e) => setLocalConfig((s) => ({ ...s, [field.name]: e.target.value }))}
                                />
                              )}

                              {field.type === "textarea" && (
                                <CustomFieldTextarea
                                  value={val ?? ""}
                                  onChange={(v) => setLocalConfig((s) => ({ ...s, [field.name]: v }))}
                                  rows={"rows" in field ? field.rows : 5}
                                  placeholder={"placeholder" in field ? field.placeholder : ""}
                                />
                              )}

                              {field.type === "select" && (
                                <Select
                                  value={val ?? ""}
                                  onValueChange={(v) => setLocalConfig((s) => ({ ...s, [field.name]: v }))}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Select ${field.label}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {field.options.map((opt) => (
                                      <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}

                              {field.type === "richtext" && (
                                <RichTextEditor
                                  value={val ?? ""}
                                  onChange={(v) => setLocalConfig((s) => ({ ...s, [field.name]: v }))}
                                />
                              )}

                              {field.type === "switch" && (
                                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/30">
                                  <div className="text-sm text-foreground">{field.label}</div>
                                  <Switch
                                    className={BLUE_SWITCH_CLASS}
                                    checked={!!val}
                                    onCheckedChange={(checked) => setLocalConfig((s) => ({ ...s, [field.name]: checked }))}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>

                  <div className="flex-shrink-0 p-4 border-t bg-muted/30 flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setLocalConfig(selectedNode.data.config || {});
                        toast.message("Changes reverted");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={async () => {
                        if (!dirtyNodeId) return;
                        try {
                          await onPersistNodeConfig(dirtyNodeId, localConfig);
                          onSaveNodeConfig(dirtyNodeId, localConfig);
                        } catch (e: any) {
                          console.error(e);
                          toast.error(e?.message || "Failed to save node settings");
                        }
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* NODES TAB - Keep for backwards compatibility / legacy */}
      {tab === "nodes" && (
        <>
          <div className="flex-shrink-0 p-4 border-b space-y-3">
            <Tabs value="all" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1" onClick={() => setTab("triggers")}>Triggers</TabsTrigger>
                <TabsTrigger value="actions" className="flex-1" onClick={() => setTab("actions")}>Actions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center text-muted-foreground">
              <p>Click a tab above to browse nodes</p>
            </div>
          </div>
        </>
      )}

      {/* WORKFLOW TAB */}
      {tab === "workflow" && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-shrink-0 p-4 border-b">
            <div className="text-sm font-semibold text-foreground">Workflow Settings</div>
            <div className="text-xs text-muted-foreground">Global behavior for this workflow</div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Re-entry</Label>
                  <p className="text-xs text-muted-foreground">Let entities re-enter this workflow</p>
                </div>
                <Switch
                  className={BLUE_SWITCH_CLASS}
                  checked={settings.allowReEntry}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowReEntry: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Allow Multiple Opportunities</Label>
                  <p className="text-xs text-muted-foreground">Create multiple opportunities per contact</p>
                </div>
                <Switch
                  className={BLUE_SWITCH_CLASS}
                  checked={settings.allowMultipleOpportunities}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowMultipleOpportunities: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Stop on Response</Label>
                  <p className="text-xs text-muted-foreground">Pause workflow when contact replies</p>
                </div>
                <Switch
                  className={BLUE_SWITCH_CLASS}
                  checked={settings.stopOnResponse}
                  onCheckedChange={(checked) => setSettings({ ...settings, stopOnResponse: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(v) => setSettings({ ...settings, timezone: v as "account" | "contact" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account Timezone</SelectItem>
                    <SelectItem value="contact">Contact Timezone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </ScrollArea>

          <div className="flex-shrink-0 p-4 border-t bg-muted/30">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={async () => {
                try {
                  await onPersistWorkflowSettings(settings);
                  toast.success("Workflow settings saved");
                } catch (e: any) {
                  toast.error(e?.message || "Failed to save");
                }
              }}
            >
              Save Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
