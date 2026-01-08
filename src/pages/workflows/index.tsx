import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MoreVertical, Play, Pause, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAllTemplateIds, getTemplateById } from "@/components/workflow/templates";

type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  category: "sales" | "communication" | "projects" | "finance" | "general";
  color: "blue" | "green" | "amber" | "purple" | "red" | "gray";
  expectedResults?: string;
};

// Build template metadata from the templates registry
const WORKFLOW_TEMPLATES: TemplateMeta[] = getAllTemplateIds().map(id => {
  const template = getTemplateById(id);
  return {
    id: template?.id || id,
    name: template?.name || id,
    description: template?.description || "",
    category: template?.category || "general",
    color: "blue" as const,
    expectedResults: template?.expectedResults,
  };
});

const COLOR: Record<TemplateMeta["color"], { bg: string; fg: string }> = {
  blue: { bg: "bg-blue-100", fg: "text-blue-600" },
  green: { bg: "bg-green-100", fg: "text-green-600" },
  amber: { bg: "bg-amber-100", fg: "text-amber-600" },
  purple: { bg: "bg-purple-100", fg: "text-purple-600" },
  red: { bg: "bg-red-100", fg: "text-red-600" },
  gray: { bg: "bg-gray-100", fg: "text-gray-600" },
};

// Sample workflows data
const SAMPLE_WORKFLOWS = [
  {
    id: "1",
    name: "New Lead Follow-up",
    status: "active" as const,
    triggers: 2,
    actions: 5,
    lastModified: "2 hours ago",
    enrollments: 156,
  },
  {
    id: "2",
    name: "Appointment Reminder",
    status: "active" as const,
    triggers: 1,
    actions: 3,
    lastModified: "1 day ago",
    enrollments: 89,
  },
  {
    id: "3",
    name: "Welcome Sequence",
    status: "draft" as const,
    triggers: 1,
    actions: 8,
    lastModified: "3 days ago",
    enrollments: 0,
  },
  {
    id: "4",
    name: "Re-engagement Campaign",
    status: "paused" as const,
    triggers: 1,
    actions: 4,
    lastModified: "1 week ago",
    enrollments: 234,
  },
];

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [templatesOpen, setTemplatesOpen] = useState(false);

  const filteredWorkflows = SAMPLE_WORKFLOWS.filter((wf) =>
    wf.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: "active" | "draft" | "paused") => {
    const config = {
      active: { className: "bg-green-100 text-green-700 hover:bg-green-100", label: "Active" },
      draft: { className: "bg-gray-100 text-gray-700 hover:bg-gray-100", label: "Draft" },
      paused: { className: "bg-amber-100 text-amber-700 hover:bg-amber-100", label: "Paused" },
    };
    return config[status];
  };

  const handleCreateWorkflow = () => {
    navigate("/workflow");
  };

  const handleCreateFromTemplate = useCallback((meta: TemplateMeta) => {
    setTemplatesOpen(false);
    navigate(`/workflow`, {
      state: {
        isFromTemplate: true,
        templateId: meta.id,
      },
    });
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/30">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Workflows</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setTemplatesOpen(true)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Use Template
            </Button>
            <Button
              onClick={handleCreateWorkflow}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Create Workflow
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search workflows..."
            className="pl-10 max-w-md"
          />
        </div>

        {/* Workflows List */}
        <div className="bg-background rounded-lg border">
          <div className="grid grid-cols-[1fr_120px_100px_100px_140px_50px] gap-4 px-4 py-3 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
            <div>Name</div>
            <div>Status</div>
            <div>Triggers</div>
            <div>Actions</div>
            <div>Last Modified</div>
            <div></div>
          </div>

          {filteredWorkflows.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No workflows found
            </div>
          ) : (
            filteredWorkflows.map((workflow) => {
              const statusBadge = getStatusBadge(workflow.status);
              return (
                <div
                  key={workflow.id}
                  className="grid grid-cols-[1fr_120px_100px_100px_140px_50px] gap-4 px-4 py-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer items-center"
                  onClick={() => navigate(`/workflow/${workflow.id}`)}
                >
                  <div>
                    <div className="font-medium text-foreground">{workflow.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {workflow.enrollments} enrollments
                    </div>
                  </div>
                  <div>
                    <Badge variant="secondary" className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                  <div className="text-sm text-foreground">{workflow.triggers}</div>
                  <div className="text-sm text-foreground">{workflow.actions}</div>
                  <div className="text-sm text-muted-foreground">{workflow.lastModified}</div>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {workflow.status === "active" ? (
                          <DropdownMenuItem>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <Play className="w-4 h-4 mr-2" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Templates Dialog */}
      <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Choose a Template
            </DialogTitle>
            <DialogDescription>
              Start with a pre-built workflow and customize it for your needs
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {WORKFLOW_TEMPLATES.map((template) => {
              const color = COLOR[template.color];
              return (
                <Card
                  key={template.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/30"
                  onClick={() => handleCreateFromTemplate(template)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${color.bg} flex items-center justify-center flex-shrink-0`}>
                      <Sparkles className={`w-5 h-5 ${color.fg}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{template.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {template.description}
                      </div>
                      {template.expectedResults && (
                        <div className="text-xs text-green-600 mt-2 font-medium">
                          {template.expectedResults}
                        </div>
                      )}
                      <Badge variant="secondary" className="mt-2 capitalize">
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
