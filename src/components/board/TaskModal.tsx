import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Paperclip, Plus, Send, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { UserAvatar } from "@/components/common/UserAvatar";
import { priorityMeta, priorityOrder, relative, uid } from "@/lib/format";
import type { Priority, Task } from "@/lib/types";

export function TaskModal({ taskId, onClose }: { taskId: string | null; onClose: () => void }) {
  const { tasks, users, labels, columns, activity, updateTask, deleteTask, addComment, registerRecent } = useApp();
  const task = tasks.find((t) => t.id === taskId) ?? null;
  const [comment, setComment] = useState("");
  const [checkDraft, setCheckDraft] = useState("");

  useEffect(() => {
    if (taskId) registerRecent(taskId);
  }, [taskId, registerRecent]);

  if (!task) return null;

  const patch = (p: Partial<Task>) => updateTask(task.id, p);
  const doneCount = task.checklist.filter((c) => c.done).length;
  const taskActivity = activity.filter((a) => a.message.includes(task.title)).slice(0, 6);

  return (
    <Dialog open={!!taskId} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[92vh] max-w-3xl overflow-y-auto p-0">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="space-y-6 p-6">
            <DialogTitle asChild>
              <Input
                value={task.title}
                onChange={(e) => patch({ title: e.target.value })}
                aria-label="Task title"
                className="h-auto border-0 bg-transparent px-0 font-display !text-xl font-bold shadow-none focus-visible:ring-0"
              />
            </DialogTitle>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </h3>
              <Textarea
                value={task.description}
                onChange={(e) => patch({ description: e.target.value })}
                placeholder="Add more detail…"
                rows={4}
              />
            </section>

            <section>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Checklist {task.checklist.length > 0 && `· ${doneCount}/${task.checklist.length}`}
                </h3>
              </div>
              {task.checklist.length > 0 && (
                <Progress value={(doneCount / task.checklist.length) * 100} className="mb-3 h-1.5" />
              )}
              <ul className="space-y-2">
                {task.checklist.map((item) => (
                  <li key={item.id} className="group flex items-center gap-2.5">
                    <Checkbox
                      id={item.id}
                      checked={item.done}
                      onCheckedChange={(v) =>
                        patch({
                          checklist: task.checklist.map((c) =>
                            c.id === item.id ? { ...c, done: Boolean(v) } : c,
                          ),
                        })
                      }
                    />
                    <label
                      htmlFor={item.id}
                      className={`flex-1 text-sm ${item.done ? "text-muted-foreground line-through" : ""}`}
                    >
                      {item.text}
                    </label>
                    <button
                      aria-label={`Remove ${item.text}`}
                      onClick={() => patch({ checklist: task.checklist.filter((c) => c.id !== item.id) })}
                      className="text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex gap-2">
                <Input
                  value={checkDraft}
                  onChange={(e) => setCheckDraft(e.target.value)}
                  placeholder="Add checklist item"
                  aria-label="Add checklist item"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && checkDraft.trim()) {
                      patch({
                        checklist: [...task.checklist, { id: uid("chk"), text: checkDraft.trim(), done: false }],
                      });
                      setCheckDraft("");
                    }
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Add item"
                  onClick={() => {
                    if (!checkDraft.trim()) return;
                    patch({
                      checklist: [...task.checklist, { id: uid("chk"), text: checkDraft.trim(), done: false }],
                    });
                    setCheckDraft("");
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Attachments
              </h3>
              <div className="space-y-2">
                {task.attachments.map((a) => (
                  <div key={a.id} className="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{a.name}</span>
                    <span className="text-xs text-muted-foreground">{a.size}</span>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full border-dashed">
                  <Paperclip className="h-4 w-4" /> Attach a file
                </Button>
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Comments
              </h3>
              <ul className="space-y-3">
                {task.comments.map((c) => {
                  const author = users.find((u) => u.id === c.authorId) ?? null;
                  return (
                    <li key={c.id} className="flex gap-3">
                      <UserAvatar user={author} size="sm" />
                      <div className="min-w-0 flex-1 rounded-xl bg-surface-2 px-3 py-2">
                        <p className="text-xs font-semibold">
                          {author?.name}{" "}
                          <span className="font-normal text-muted-foreground">{relative(c.createdAt)}</span>
                        </p>
                        <p className="mt-0.5 text-sm">{c.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex gap-2">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment…"
                  aria-label="Write a comment"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && comment.trim()) {
                      addComment(task.id, comment.trim());
                      setComment("");
                    }
                  }}
                />
                <Button
                  size="icon"
                  aria-label="Send comment"
                  onClick={() => {
                    if (!comment.trim()) return;
                    addComment(task.id, comment.trim());
                    setComment("");
                  }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </section>

            {taskActivity.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Activity
                </h3>
                <ul className="space-y-2 border-l pl-4">
                  {taskActivity.map((a) => (
                    <li key={a.id} className="relative text-xs text-muted-foreground">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand" />
                      {a.message} · {relative(a.createdAt)}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-5 border-t bg-surface-2 p-6 md:border-l md:border-t-0">
            <Field label="Status">
              <Select value={task.columnId} onValueChange={(v) => patch({ columnId: v })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {columns
                    .filter((c) => c.projectId === task.projectId)
                    .sort((a, b) => a.order - b.order)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Priority">
              <Select value={task.priority} onValueChange={(v) => patch({ priority: v as Priority })}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOrder.map((p) => (
                    <SelectItem key={p} value={p}>
                      {priorityMeta[p].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Assignee">
              <Select
                value={task.assigneeId ?? "none"}
                onValueChange={(v) => patch({ assigneeId: v === "none" ? null : v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Unassigned</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label="Due date">
              <Input
                type="date"
                value={task.dueDate ? format(parseISO(task.dueDate), "yyyy-MM-dd") : ""}
                onChange={(e) =>
                  patch({ dueDate: e.target.value ? new Date(e.target.value).toISOString() : null })
                }
              />
            </Field>

            <Field label="Labels">
              <div className="flex flex-wrap gap-1.5">
                {labels.map((l) => {
                  const on = task.labelIds.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      aria-pressed={on}
                      onClick={() =>
                        patch({
                          labelIds: on
                            ? task.labelIds.filter((id) => id !== l.id)
                            : [...task.labelIds, l.id],
                        })
                      }
                      className="rounded-md px-2 py-1 text-xs font-medium transition-all"
                      style={{
                        color: on ? "var(--background)" : l.color,
                        backgroundColor: on ? l.color : `color-mix(in oklab, ${l.color} 15%, transparent)`,
                      }}
                    >
                      {l.name}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="flex items-center gap-2 rounded-lg border bg-surface px-3 py-2">
              <Checkbox
                id="task-complete"
                checked={task.completed}
                onCheckedChange={(v) => patch({ completed: Boolean(v) })}
              />
              <label htmlFor="task-complete" className="text-sm font-medium">
                Mark as completed
              </label>
            </div>

            <Button
              variant="outline"
              className="w-full text-destructive hover:text-destructive"
              onClick={() => {
                deleteTask(task.id);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4" /> Delete task
            </Button>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
