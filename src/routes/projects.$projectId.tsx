import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { isToday, parseISO } from "date-fns";
import { Download, Plus, Star, Upload, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { BoardColumn } from "@/components/board/BoardColumn";
import { TaskModal } from "@/components/board/TaskModal";
import { BoardSkeleton, EmptyState } from "@/components/common/StateBlocks";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { priorityMeta, priorityOrder } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BoardSearch {
  task?: string;
}

export const Route = createFileRoute("/projects/$projectId")({
  validateSearch: (search: Record<string, unknown>): BoardSearch =>
    typeof search["task"] === "string" ? { task: search["task"] } : {},
  head: () => ({
    meta: [
      { title: "Board — Northwind Kanban" },
      { name: "description", content: "Drag tasks across columns, set priorities and track progress." },
      { property: "og:title", content: "Board — Northwind Kanban" },
      { property: "og:description", content: "Drag tasks across columns, set priorities and track progress." },
    ],
  }),
  component: BoardPage,
});

function BoardPage() {
  const { projectId } = Route.useParams();
  const { task: taskParam } = Route.useSearch();
  const navigate = useNavigate();
  const {
    projects,
    columns,
    tasks,
    labels,
    users,
    ready,
    addColumn,
    toggleFavorite,
    exportState,
    importState,
  } = useApp();

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [labelId, setLabelId] = useState("all");
  const [assignee, setAssignee] = useState("all");
  const [due, setDue] = useState("all");

  const project = projects.find((p) => p.id === projectId);
  const boardColumns = columns.filter((c) => c.projectId === projectId).sort((a, b) => a.order - b.order);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (t.projectId !== projectId) return false;
      if (q && !t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
      if (priority !== "all" && t.priority !== priority) return false;
      if (labelId !== "all" && !t.labelIds.includes(labelId)) return false;
      if (assignee !== "all" && t.assigneeId !== assignee) return false;
      if (due === "today" && !(t.dueDate && isToday(parseISO(t.dueDate)))) return false;
      if (due === "overdue" && !(t.dueDate && parseISO(t.dueDate) < new Date() && !t.completed)) return false;
      if (due === "completed" && !t.completed) return false;
      if (due === "open" && t.completed) return false;
      return true;
    });
  }, [tasks, projectId, query, priority, labelId, assignee, due]);

  const filtersActive = query || priority !== "all" || labelId !== "all" || assignee !== "all" || due !== "all";

  const openTask = (id: string) => navigate({ to: "/projects/$projectId", params: { projectId }, search: { task: id } });
  const closeTask = () => navigate({ to: "/projects/$projectId", params: { projectId }, search: {} });

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        importState(await file.text());
        toast.success("Board imported");
      } catch {
        toast.error("That file isn't a valid board export");
      }
    };
    input.click();
  };

  const handleExport = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "northwind-board.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Board exported to JSON");
  };

  if (!project) {
    return (
      <AppShell title="Project not found">
        <EmptyState title="This board doesn't exist" description="It may have been deleted or archived." />
      </AppShell>
    );
  }

  return (
    <AppShell
      title={project.name}
      subtitle={project.description}
      actions={
        <>
          <Button variant="ghost" size="icon" aria-label="Favorite project" onClick={() => toggleFavorite(project.id)}>
            <Star className={cn("h-4 w-4", project.favorite && "fill-accent-amber text-accent-amber")} />
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button
            size="sm"
            onClick={() => {
              const name = window.prompt("Column name");
              if (name?.trim()) addColumn(project.id, name.trim());
            }}
          >
            <Plus className="h-4 w-4" /> Column
          </Button>
        </>
      }
    >
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter tasks…"
          aria-label="Filter tasks"
          className="w-full sm:w-56"
        />
        <FilterSelect value={priority} onChange={setPriority} label="Priority">
          {priorityOrder.map((p) => (
            <SelectItem key={p} value={p}>
              {priorityMeta[p].label}
            </SelectItem>
          ))}
        </FilterSelect>
        <FilterSelect value={labelId} onChange={setLabelId} label="Label">
          {labels.map((l) => (
            <SelectItem key={l.id} value={l.id}>
              {l.name}
            </SelectItem>
          ))}
        </FilterSelect>
        <FilterSelect value={assignee} onChange={setAssignee} label="Assignee">
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name}
            </SelectItem>
          ))}
        </FilterSelect>
        <FilterSelect value={due} onChange={setDue} label="Due">
          <SelectItem value="today">Due today</SelectItem>
          <SelectItem value="overdue">Overdue</SelectItem>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </FilterSelect>
        {filtersActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setPriority("all");
              setLabelId("all");
              setAssignee("all");
              setDue("all");
            }}
          >
            <X className="h-4 w-4" /> Clear
          </Button>
        )}
      </div>

      {!ready ? (
        <BoardSkeleton />
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {boardColumns.map((c) => (
            <BoardColumn
              key={c.id}
              column={c}
              tasks={filtered.filter((t) => t.columnId === c.id)}
              onOpenTask={openTask}
              draggingId={draggingId}
              setDraggingId={setDraggingId}
            />
          ))}
        </div>
      )}

      <TaskModal taskId={taskParam ?? null} onClose={closeTask} />
    </AppShell>
  );
}

function FilterSelect({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-36" aria-label={label}>
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label.toLowerCase()}</SelectItem>
        {children}
      </SelectContent>
    </Select>
  );
}
