import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, ArchiveRestore, FolderKanban, MoreHorizontal, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/common/StateBlocks";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Northwind Kanban" },
      { name: "description", content: "Create, favorite, archive and manage every project board." },
      { property: "og:title", content: "Projects — Northwind Kanban" },
      { property: "og:description", content: "Create, favorite, archive and manage every project board." },
    ],
  }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { projects, tasks, createProject, renameProject, deleteProject, toggleFavorite, toggleArchive } = useApp();
  const [tab, setTab] = useState<"active" | "favorites" | "archived">("active");
  const [name, setName] = useState("");

  const visible = projects.filter((p) =>
    tab === "archived" ? p.archived : tab === "favorites" ? p.favorite && !p.archived : !p.archived,
  );

  return (
    <AppShell
      title="Projects"
      subtitle="Every board in your workspace."
      actions={
        <div className="flex gap-2">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New project name"
            aria-label="New project name"
            className="w-44 sm:w-56"
            onKeyDown={(e) => {
              if (e.key === "Enter" && name.trim()) {
                createProject(name.trim());
                setName("");
              }
            }}
          />
          <Button
            onClick={() => {
              if (!name.trim()) return;
              createProject(name.trim());
              setName("");
            }}
          >
            <Plus className="h-4 w-4" /> Create
          </Button>
        </div>
      }
    >
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)} className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      {visible.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-5 w-5" />}
          title="Nothing here yet"
          description="Create a project to start organising work into Kanban columns."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((p, i) => {
            const pt = tasks.filter((t) => t.projectId === p.id);
            const done = pt.filter((t) => t.completed).length;
            const pct = pt.length ? Math.round((done / pt.length) * 100) : 0;
            return (
              <div
                key={p.id}
                className="surface-card lift-hover rise-in flex flex-col p-5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                  <Link to="/projects/$projectId" params={{ projectId: p.id }} className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                      <h2 className="truncate font-display text-base font-bold">{p.name}</h2>
                    </span>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                  </Link>
                  <div className="flex shrink-0 items-center">
                    <button
                      onClick={() => toggleFavorite(p.id)}
                      aria-label={p.favorite ? "Unfavorite project" : "Favorite project"}
                      className="rounded-md p-1.5 transition-colors hover:bg-muted"
                    >
                      <Star
                        className={cn("h-4 w-4", p.favorite ? "fill-accent-amber text-accent-amber" : "text-muted-foreground")}
                      />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted" aria-label="Project actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            const next = window.prompt("Rename project", p.name);
                            if (next?.trim()) renameProject(p.id, next.trim());
                          }}
                        >
                          <Pencil className="h-4 w-4" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleArchive(p.id)}>
                          {p.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                          {p.archived ? "Restore" : "Archive"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteProject(p.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                    <span>
                      {done}/{pt.length} tasks done
                    </span>
                    <span>{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
