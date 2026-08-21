import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/common/UserAvatar";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Northwind Kanban" },
      { name: "description", content: "Manage your profile, notifications, theme and language preferences." },
      { property: "og:title", content: "Settings — Northwind Kanban" },
      { property: "og:description", content: "Manage your profile, notifications, theme and language preferences." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { users, currentUserId, resetDemoData } = useApp();
  const { theme, setTheme } = useTheme();
  const me = users.find((u) => u.id === currentUserId);

  return (
    <AppShell title="Settings" subtitle="Personalise your workspace.">
      <Tabs defaultValue="profile" className="max-w-2xl">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="surface-card mt-4 space-y-5 p-6">
          <div className="flex items-center gap-4">
            <UserAvatar user={me} size="lg" />
            <div>
              <p className="font-semibold">{me?.name}</p>
              <p className="text-sm text-muted-foreground">{me?.role}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue={me?.name} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={me?.email} />
            </div>
          </div>
          <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
        </TabsContent>

        <TabsContent value="password" className="surface-card mt-4 space-y-4 p-6">
          <div className="space-y-1.5">
            <Label htmlFor="current">Current password</Label>
            <Input id="current" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" placeholder="••••••••" />
          </div>
          <Button onClick={() => toast.success("Password updated")}>Update password</Button>
        </TabsContent>

        <TabsContent value="notifications" className="surface-card mt-4 space-y-5 p-6">
          {[
            ["Task assignments", "Tell me when a task is assigned to me"],
            ["Due date reminders", "A nudge the day before a task is due"],
            ["Comments", "Notify me about replies on my tasks"],
            ["Weekly digest", "A Monday summary of team progress"],
          ].map(([title, desc], i) => (
            <div key={title} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch defaultChecked={i < 3} aria-label={title} />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="appearance" className="surface-card mt-4 space-y-5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Dark mode</p>
              <p className="text-xs text-muted-foreground">Saved to this browser automatically</p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
              aria-label="Dark mode"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language" className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border-t pt-5">
            <p className="text-sm font-medium">Demo data</p>
            <p className="mb-3 text-xs text-muted-foreground">Restore the sample projects and tasks.</p>
            <Button
              variant="outline"
              onClick={() => {
                resetDemoData();
                toast.success("Demo data restored");
              }}
            >
              Reset workspace
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
