import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MoreVertical, Play, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [search, setSearch] = React.useState("");

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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-muted/30">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Workflows</h1>
          <Button
            onClick={() => navigate("/workflow")}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
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
    </div>
  );
}
