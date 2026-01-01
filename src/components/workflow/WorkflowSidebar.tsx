import React, { useMemo, useRef, useState } from "react";
import { Search, X, Settings, Link2Off, ChevronRight, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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
} from "./types";
import { TRIGGERS, ACTIONS, NODE_CONFIGS, ALL_LIBRARY_ITEMS } from "./node-library";

interface WorkflowSidebarProps {
  tab: SidebarTab;
  setTab: (tab: SidebarTab) => void;
  search: string;
  setSearch: (s: string) => void;
  selectedNode: RFNode | null;
  selectedEdge: RFEdge | null;
  settings: WorkflowSettings;
  setSettings: (s: WorkflowSettings) => void;
  onAddNode: (item: NodeLibraryItem) => void;
  onSaveNodeConfig: (nodeId: string, config: Record<string, any>) => void;
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

// Drag handler for sidebar items
function onDragStart(event: React.DragEvent, item: NodeLibraryItem) {
  event.dataTransfer.setData("application/reactflow", JSON.stringify(item));
  event.dataTransfer.effectAllowed = "move";
}

export const WorkflowSidebar: React.FC<WorkflowSidebarProps> = ({
  tab,
  setTab,
  search,
  setSearch,
  selectedNode,
  selectedEdge,
  settings,
  setSettings,
  onAddNode,
  onSaveNodeConfig,
  onPersistNodeConfig,
  onPersistWorkflowSettings,
  onDisconnectEdge,
}) => {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>({});
  const [dirtyNodeId, setDirtyNodeId] = useState<string | null>(null);
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

  const nodeSchema = selectedNode ? NODE_CONFIGS[selectedNode.data.actionType] : null;
  const variables = nodeSchema?.variables || [];

  // Filter library items
  const libraryGroups = useMemo(() => {
    const q = search.toLowerCase().trim();
    const filtered = q
      ? ALL_LIBRARY_ITEMS.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.group.toLowerCase().includes(q) ||
            item.kind.toLowerCase().includes(q)
        )
      : ALL_LIBRARY_ITEMS;

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
      {/* Tabs */}
      <div className="flex-shrink-0 border-b p-3">
        <Tabs value={tab} onValueChange={(v) => setTab(v as SidebarTab)}>
          <TabsList className="w-full">
            <TabsTrigger value="nodes" className="flex-1">Nodes</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Settings</TabsTrigger>
            <TabsTrigger value="workflow" className="flex-1">Workflow</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* NODES TAB */}
      {tab === "nodes" && (
        <>
          <div className="flex-shrink-0 p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search triggers & actions..."
                className="pl-9"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Drag</span> nodes to the canvas or <span className="font-medium">click</span> to add them.
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {libraryGroups.length === 0 && (
                <div className="text-sm text-muted-foreground p-4 text-center">
                  No nodes match your search.
                </div>
              )}

              {libraryGroups.map(([group, items]) => (
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
                          draggable
                          onDragStart={(e) => onDragStart(e, item)}
                          onClick={() => onAddNode(item)}
                          className="w-full flex items-center gap-2 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors text-left group cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-sm"
                        >
                          <GripVertical className="w-4 h-4 text-muted-foreground/50 group-hover:text-muted-foreground flex-shrink-0" />
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", cls.chipBg)}>
                            <Icon className={cn("w-4 h-4", cls.chipText)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
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

      {/* SETTINGS TAB */}
      {tab === "settings" && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-shrink-0 p-4 border-b flex items-start justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">Configure</div>
              <div className="text-xs text-muted-foreground">
                {selectedNode ? selectedNode.data.label : selectedEdge ? "Connection" : "Select a node"}
              </div>
            </div>
            <button onClick={() => setTab("nodes")} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Close">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Edge Selected */}
          {!selectedNode && selectedEdge && (
            <>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  <div className="text-sm font-medium text-foreground">Connection Details</div>
                  <div className="text-xs text-muted-foreground space-y-2 bg-muted/50 rounded-lg p-3">
                    <div>
                      <span className="font-medium">From:</span> {selectedEdge.source} ({selectedEdge.sourceHandle || "default"})
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {selectedEdge.target} ({selectedEdge.targetHandle || "in"})
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
                  <p className="text-xs text-muted-foreground">
                    Tip: Select an edge and press Delete key to disconnect.
                  </p>
                </div>
              </ScrollArea>

              <div className="flex-shrink-0 p-4 border-t bg-muted/30">
                <Button variant="outline" className="w-full" onClick={() => setTab("nodes")}>
                  Back to Nodes
                </Button>
              </div>
            </>
          )}

          {/* Nothing Selected */}
          {!selectedNode && !selectedEdge && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Select a node or edge to configure it.</p>
              </div>
            </div>
          )}

          {/* Node Selected */}
          {selectedNode && (
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
                          <Label className="text-sm font-medium">
                            {field.label}
                            {"required" in field && field.required && <span className="text-destructive ml-1">*</span>}
                          </Label>

                          {"helperText" in field && field.helperText && (
                            <div className="text-xs text-muted-foreground">{field.helperText}</div>
                          )}

                          {field.type === "text" && (
                            <>
                              <Input
                                ref={(el) => (inputRefs.current[field.name] = el)}
                                value={val ?? ""}
                                onChange={(e) => setLocalConfig((s) => ({ ...s, [field.name]: e.target.value }))}
                                placeholder={field.placeholder}
                                readOnly={field.readOnly}
                              />
                              {showVars && (
                                <div className="flex flex-wrap gap-1.5">
                                  {variables.map((v) => (
                                    <button
                                      key={v}
                                      type="button"
                                      className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                      onClick={() => {
                                        const el = inputRefs.current[field.name];
                                        if (!el) return;
                                        el.value = (localConfig[field.name] ?? "").toString();
                                        insertAtCursor(el, v);
                                        setLocalConfig((s) => ({ ...s, [field.name]: el.value }));
                                      }}
                                    >
                                      {v}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          {field.type === "number" && (
                            <Input
                              type="number"
                              value={val ?? ""}
                              onChange={(e) => setLocalConfig((s) => ({ ...s, [field.name]: e.target.value }))}
                            />
                          )}

                          {field.type === "textarea" && (
                            <>
                              <Textarea
                                ref={(el) => (textareaRefs.current[field.name] = el)}
                                value={val ?? ""}
                                onChange={(e) => setLocalConfig((s) => ({ ...s, [field.name]: e.target.value }))}
                                rows={field.rows || 5}
                                placeholder={field.placeholder}
                              />
                              {showVars && (
                                <div className="flex flex-wrap gap-1.5">
                                  {variables.map((v) => (
                                    <button
                                      key={v}
                                      type="button"
                                      className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                      onClick={() => {
                                        const el = textareaRefs.current[field.name];
                                        if (!el) return;
                                        el.value = (localConfig[field.name] ?? "").toString();
                                        insertAtCursor(el, v);
                                        setLocalConfig((s) => ({ ...s, [field.name]: el.value }));
                                      }}
                                    >
                                      {v}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </>
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
                      toast.success("Saved");
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
        </div>
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
                  <p className="text-xs text-muted-foreground">Stop when contact responds</p>
                </div>
                <Switch
                  className={BLUE_SWITCH_CLASS}
                  checked={settings.stopOnResponse}
                  onCheckedChange={(checked) => setSettings({ ...settings, stopOnResponse: checked })}
                />
              </div>

              <Separator />

              <div>
                <Label>Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value: any) => setSettings({ ...settings, timezone: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="account">Account Timezone</SelectItem>
                    <SelectItem value="contact">Contact Timezone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div>
                <Label>Time Window</Label>
                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={settings.timeWindow.enabled}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, timeWindow: { ...settings.timeWindow, enabled: !!checked } })
                      }
                    />
                    <span className="text-sm">Enable specific time window</span>
                  </div>

                  {settings.timeWindow.enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Start Time</Label>
                          <Input
                            type="time"
                            value={settings.timeWindow.startTime}
                            onChange={(e) =>
                              setSettings({ ...settings, timeWindow: { ...settings.timeWindow, startTime: e.target.value } })
                            }
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">End Time</Label>
                          <Input
                            type="time"
                            value={settings.timeWindow.endTime}
                            onChange={(e) =>
                              setSettings({ ...settings, timeWindow: { ...settings.timeWindow, endTime: e.target.value } })
                            }
                            className="mt-1"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">Days</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => {
                            const isActive = settings.timeWindow.days.includes(day);
                            return (
                              <button
                                key={day}
                                className={cn(
                                  "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                                  isActive
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-foreground border-border hover:bg-muted"
                                )}
                                onClick={() => {
                                  const next = isActive
                                    ? settings.timeWindow.days.filter((d) => d !== day)
                                    : [...settings.timeWindow.days, day];
                                  setSettings({ ...settings, timeWindow: { ...settings.timeWindow, days: next } });
                                }}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label>Sender Details</Label>
                <div className="mt-3 space-y-3">
                  <div>
                    <Label className="text-xs">From Name</Label>
                    <Input
                      value={settings.senderDetails.fromName}
                      onChange={(e) =>
                        setSettings({ ...settings, senderDetails: { ...settings.senderDetails, fromName: e.target.value } })
                      }
                      placeholder="Your Name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">From Email</Label>
                    <Input
                      value={settings.senderDetails.fromEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, senderDetails: { ...settings.senderDetails, fromEmail: e.target.value } })
                      }
                      placeholder="noreply@example.com"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">From Phone</Label>
                    <Input
                      value={settings.senderDetails.fromNumber}
                      onChange={(e) =>
                        setSettings({ ...settings, senderDetails: { ...settings.senderDetails, fromNumber: e.target.value } })
                      }
                      placeholder="+1234567890"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Mark Conversations as Read</Label>
                  <p className="text-xs text-muted-foreground">Auto-read workflow-triggered messages</p>
                </div>
                <Switch
                  className={BLUE_SWITCH_CLASS}
                  checked={settings.markConversationsRead}
                  onCheckedChange={(checked) => setSettings({ ...settings, markConversationsRead: checked })}
                />
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
                  console.error(e);
                  toast.error(e?.message || "Failed to save settings");
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
