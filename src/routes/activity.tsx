import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FilePlus2, MoveRight, Pencil, Trash2, MessageSquare, FolderPlus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { relative } from "@/lib/format";
import type { ActivityKind } from "@/lib/types";

const iconFor: Record<ActivityKind, typeof CheckCircle2> = {
  task_created: FilePlus2,
  task_edited: Pencil,
  task_moved: MoveRight,
  task_completed: CheckCircle2,
  task_deleted: Trash2,
  project_created: FolderPlus,
  comment_added: MessageSquare,
};

export const Route = createFileRoute("/activity")({
  head: () => ({
    meta: [
      { title: "Activity — Northwind Kanban" },
      { name: "description", content: "A timeline of everything your team created, moved and completed." },
      { property: "og:title", content: "Activity — Northwind Kanban" },
      { property: "og:description", content: "A timeline of everything your team created, moved and completed." },
    ],
  }),
  component: ActivityPage,
});

function ActivityPage() {
  const { activity } = useApp();

  return (
    <AppShell title="Activity" subtitle="Everything that happened across your boards.">
      <ol className="surface-card space-y-0 p-2">
        {activity.map((a) => {
          const Icon = iconFor[a.kind];
          return (
            <li key={a.id} className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/60">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm">{a.message}</p>
                <p className="text-xs text-muted-foreground">{relative(a.createdAt)}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}
