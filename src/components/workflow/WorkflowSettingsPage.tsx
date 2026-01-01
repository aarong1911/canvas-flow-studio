import React from "react";
import { Tag } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WorkflowSettings } from "./types";
import { CustomFieldInput } from "./CustomFieldInput";

interface WorkflowSettingsPageProps {
  settings: WorkflowSettings;
  setSettings: (settings: WorkflowSettings) => void;
}

export const WorkflowSettingsPage: React.FC<WorkflowSettingsPageProps> = ({
  settings,
  setSettings,
}) => {
  const updateSettings = (updates: Partial<WorkflowSettings>) => {
    setSettings({ ...settings, ...updates });
  };

  return (
    <div className="flex-1 p-6 overflow-auto bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Workflow Settings</h1>

        {/* Contact Section */}
        <div className="bg-background rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-medium text-foreground mb-1 border-b-2 border-blue-500 pb-2 inline-block">
            Contact
          </h2>

          <div className="mt-6 space-y-6">
            {/* Allow Re-entry */}
            <div className="flex items-start gap-4">
              <Switch
                checked={settings.allowReEntry}
                onCheckedChange={(checked) => updateSettings({ allowReEntry: checked })}
                className="mt-0.5 data-[state=checked]:bg-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">Allow re-entry</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Allows a contact to re-enter once it has left this workflow. If the contact attempts to re-enter while it is still enrolled in this workflow, it will get skipped. Also if this workflow has appointment or invoice based triggers it will allow contacts to re-enter even if the 'Allow re-entry' setting is disabled.{" "}
                  <a href="#" className="text-blue-600 hover:underline">Know more</a>
                </p>
              </div>
            </div>

            {/* Stop on Response */}
            <div className="flex items-start gap-4">
              <Switch
                checked={settings.stopOnResponse}
                onCheckedChange={(checked) => updateSettings({ stopOnResponse: checked })}
                className="mt-0.5 data-[state=checked]:bg-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium text-foreground">Stop on response</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Ends workflow for a contact if the contact responds to a message that is sent from this workflow.{" "}
                  <a href="#" className="text-blue-600 hover:underline">Know more</a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Section */}
        <div className="bg-background rounded-lg border p-6">
          <h2 className="text-lg font-medium text-foreground mb-1 border-b-2 border-blue-500 pb-2 inline-block">
            Communication
          </h2>

          <div className="mt-6 space-y-6">
            {/* Timezone */}
            <div className="space-y-2">
              <label className="font-medium text-foreground">Timezone</label>
              <Select
                value={settings.timezone}
                onValueChange={(v) => updateSettings({ timezone: v as "account" | "contact" })}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="account">Account Timezone</SelectItem>
                  <SelectItem value="contact">Contact Timezone</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Wait steps and Time window executions will proceed based on this timezone.{" "}
                <a href="#" className="text-blue-600 hover:underline">Know more</a>
              </p>
            </div>

            {/* Time Window */}
            <div className="space-y-3">
              <label className="font-medium text-foreground">Time Window</label>
              <div className="flex items-start gap-4">
                <Switch
                  checked={settings.timeWindow.enabled}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      timeWindow: { ...settings.timeWindow, enabled: checked },
                    })
                  }
                  className="mt-0.5 data-[state=checked]:bg-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-foreground">Specific Time</div>
                  <p className="text-sm text-muted-foreground">
                    Restrict actions from being sent outside the window you define.{" "}
                    <a href="#" className="text-blue-600 hover:underline">Know more</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Sender Details */}
            <div className="space-y-3">
              <label className="font-medium text-foreground">Sender Details</label>
              <div className="grid grid-cols-2 gap-4">
                <CustomFieldInput
                  label="From Name"
                  value={settings.senderDetails.fromName}
                  onChange={(value) =>
                    updateSettings({
                      senderDetails: { ...settings.senderDetails, fromName: value },
                    })
                  }
                  placeholder="From Name"
                />
                <CustomFieldInput
                  label="From Email"
                  value={settings.senderDetails.fromEmail}
                  onChange={(value) =>
                    updateSettings({
                      senderDetails: { ...settings.senderDetails, fromEmail: value },
                    })
                  }
                  placeholder="From Email"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                You can set a default "From name" and "From email" for emails. You can also override this information within your Email actions.{" "}
                <a href="#" className="text-blue-600 hover:underline">Know more</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
