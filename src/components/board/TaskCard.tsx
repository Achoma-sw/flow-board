import { CalendarClock, CheckSquare, Copy, MessageSquare, MoreHorizontal, Paperclip, Trash2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { UserAvatar } from "@/components/common/UserAvatar";
import { dueLabel, dueTone, priorityMeta } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TaskCard({
  task,
  onOpen,
  onDragStart,
  onDragEnd,
  dragging,
}: {
  task: Task;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  dragging: boolean;
}) {
  const { users, labels, deleteTask, duplicateTask } = useApp();
  const assignee = users.find((u) => u.id === task.assigneeId) ?? null;
  const taskLabels = labels.filter((l) => task.labelIds.includes(l.id));
  const done = task.checklist.filter((c) => c.done).length;
  const tone = dueTone(task.dueDate, task.completed);

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Open task ${task.title}`}
      className={cn(
        "group cursor-grab rounded-xl border bg-surface p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
        dragging && "dragging-card",
      )}
    >
      <div className="mb-2 flex flex-wrap items-center gap-1.5">
        <span
          className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide"
          style={{
            color: priorityMeta[task.priority].color,
            backgroundColor: `color-mix(in oklab, ${priorityMeta[task.priority].color} 15%, transparent)`,
          }}
        >
          {priorityMeta[task.priority].label}
        </span>
        {taskLabels.map((l) => (
          <span
            key={l.id}
            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
            style={{ color: l.color, backgroundColor: `color-mix(in oklab, ${l.color} 14%, transparent)` }}
          >
            {l.name}
          </span>
        ))}
      </div>

      <div className="flex items-start justify-between gap-2">
        <h3 className={cn("text-sm font-semibold leading-snug", task.completed && "line-through opacity-70")}>
          {task.title}
        </h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              aria-label="Task actions"
              className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted focus-visible:opacity-100 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem onClick={() => duplicateTask(task.id)}>
              <Copy className="h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => deleteTask(task.id)}>
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {task.description ? (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3 text-[11px] text-muted-foreground">
          {task.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5",
                tone === "danger" && "bg-destructive/10 text-destructive",
                tone === "warning" && "bg-accent-amber/15 text-accent-amber",
              )}
            >
              <CalendarClock className="h-3 w-3" /> {dueLabel(task.dueDate)}
            </span>
          )}
          {task.checklist.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <CheckSquare className="h-3 w-3" /> {done}/{task.checklist.length}
            </span>
          )}
          {task.comments.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3 w-3" /> {task.comments.length}
            </span>
          )}
          {task.attachments.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip className="h-3 w-3" /> {task.attachments.length}
            </span>
          )}
        </div>
        <UserAvatar user={assignee} size="sm" />
      </div>
    </article>
  );
}
