import { useState } from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Column, Task } from "@/lib/types";

export function BoardColumn({
  column,
  tasks,
  onOpenTask,
  draggingId,
  setDraggingId,
}: {
  column: Column;
  tasks: Task[];
  onOpenTask: (id: string) => void;
  draggingId: string | null;
  setDraggingId: (id: string | null) => void;
}) {
  const { moveTask, createTask, renameColumn, deleteColumn, moveColumn } = useApp();
  const [over, setOver] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(column.name);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");

  const submitName = () => {
    if (name.trim()) renameColumn(column.id, name.trim());
    else setName(column.name);
    setEditing(false);
  };

  const addTask = () => {
    if (draft.trim()) {
      createTask({ projectId: column.projectId, columnId: column.id, title: draft.trim() });
      setDraft("");
    }
    setComposing(false);
  };

  return (
    <section
      aria-label={column.name}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const id = e.dataTransfer.getData("text/plain");
        if (id) moveTask(id, column.id);
        setDraggingId(null);
      }}
      className={cn(
        "flex max-h-[calc(100vh-14rem)] w-[19rem] shrink-0 flex-col rounded-2xl border border-transparent bg-surface-2 transition-colors",
        over && "column-drop-active",
      )}
    >
      <header className="flex items-center gap-2 px-3 py-3">
        {editing ? (
          <Input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={submitName}
            onKeyDown={(e) => e.key === "Enter" && submitName()}
            className="h-8"
            aria-label="Column name"
          />
        ) : (
          <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">{column.name}</h2>
        )}
        <span className="shrink-0 rounded-full bg-surface px-2 py-0.5 text-xs text-muted-foreground">
          {tasks.length}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-md p-1 text-muted-foreground hover:bg-surface" aria-label={`${column.name} options`}>
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setEditing(true)}>
              <Pencil className="h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => moveColumn(column.id, -1)}>
              <ChevronLeft className="h-4 w-4" /> Move left
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => moveColumn(column.id, 1)}>
              <ChevronRight className="h-4 w-4" /> Move right
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteColumn(column.id)}>
              <Trash2 className="h-4 w-4" /> Delete column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="flex min-h-24 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pb-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            dragging={draggingId === task.id}
            onDragStart={() => setDraggingId(task.id)}
            onDragEnd={() => setDraggingId(null)}
            onOpen={() => onOpenTask(task.id)}
          />
        ))}
        {tasks.length === 0 && !composing && (
          <p className="rounded-lg border border-dashed py-6 text-center text-xs text-muted-foreground">
            Drop tasks here
          </p>
        )}
      </div>

      <div className="p-3 pt-1">
        {composing ? (
          <Input
            autoFocus
            value={draft}
            placeholder="Task title…"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={addTask}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
              if (e.key === "Escape") setComposing(false);
            }}
            aria-label="New task title"
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-muted-foreground"
            onClick={() => setComposing(true)}
          >
            <Plus className="h-4 w-4" /> Add task
          </Button>
        )}
      </div>
    </section>
  );
}
