import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { seedState, DEFAULT_COLUMN_NAMES } from "@/data/mockData";
import { uid } from "@/lib/format";
import type { AppState, Column, Project, Task, ActivityKind, AppNotification } from "@/lib/types";

const STORAGE_KEY = "kanban.state.v1";

interface AppContextValue extends AppState {
  ready: boolean;
  /* projects */
  createProject: (name: string, description?: string) => Project;
  renameProject: (id: string, name: string) => void;
  deleteProject: (id: string) => void;
  toggleFavorite: (id: string) => void;
  toggleArchive: (id: string) => void;
  /* columns */
  addColumn: (projectId: string, name: string) => void;
  renameColumn: (id: string, name: string) => void;
  deleteColumn: (id: string) => void;
  moveColumn: (id: string, direction: -1 | 1) => void;
  /* tasks */
  createTask: (input: Partial<Task> & { projectId: string; columnId: string; title: string }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  moveTask: (taskId: string, columnId: string, beforeTaskId?: string | null) => void;
  addComment: (taskId: string, body: string) => void;
  registerRecent: (taskId: string) => void;
  /* notifications */
  markNotificationsRead: () => void;
  importState: (json: string) => void;
  exportState: () => string;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => seedState());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as AppState);
    } catch {
      /* corrupted storage – keep seed */
    }
    const t = setTimeout(() => setReady(true), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const log = useCallback((kind: ActivityKind, message: string, extra?: Partial<AppNotification>) => {
    setState((s) => ({
      ...s,
      activity: [
        { id: uid("act"), kind, message, createdAt: new Date().toISOString() },
        ...s.activity,
      ].slice(0, 80),
      notifications: extra
        ? [
            {
              id: uid("ntf"),
              title: extra.title ?? "Update",
              body: extra.body ?? message,
              kind: extra.kind ?? "info",
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...s.notifications,
          ].slice(0, 40)
        : s.notifications,
    }));
  }, []);

  const createProject = useCallback(
    (name: string, description = "") => {
      const project: Project = {
        id: uid("proj"),
        name,
        description,
        color: "var(--brand)",
        favorite: false,
        archived: false,
        createdAt: new Date().toISOString(),
      };
      const columns: Column[] = DEFAULT_COLUMN_NAMES.map((n, order) => ({
        id: uid("col"),
        projectId: project.id,
        name: n,
        order,
      }));
      setState((s) => ({ ...s, projects: [project, ...s.projects], columns: [...s.columns, ...columns] }));
      log("project_created", `Created project “${name}”`, {
        title: "New project created",
        body: `“${name}” is now on your board.`,
      });
      return project;
    },
    [log],
  );

  const renameProject = useCallback((id: string, name: string) => {
    setState((s) => ({ ...s, projects: s.projects.map((p) => (p.id === id ? { ...p, name } : p)) }));
  }, []);

  const deleteProject = useCallback(
    (id: string) => {
      setState((s) => ({
        ...s,
        projects: s.projects.filter((p) => p.id !== id),
        columns: s.columns.filter((c) => c.projectId !== id),
        tasks: s.tasks.filter((t) => t.projectId !== id),
      }));
      log("task_deleted", "Deleted a project");
    },
    [log],
  );

  const toggleFavorite = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)),
    }));
  }, []);

  const toggleArchive = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      projects: s.projects.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p)),
    }));
  }, []);

  const addColumn = useCallback((projectId: string, name: string) => {
    setState((s) => {
      const order = s.columns.filter((c) => c.projectId === projectId).length;
      return { ...s, columns: [...s.columns, { id: uid("col"), projectId, name, order }] };
    });
  }, []);

  const renameColumn = useCallback((id: string, name: string) => {
    setState((s) => ({ ...s, columns: s.columns.map((c) => (c.id === id ? { ...c, name } : c)) }));
  }, []);

  const deleteColumn = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      columns: s.columns.filter((c) => c.id !== id),
      tasks: s.tasks.filter((t) => t.columnId !== id),
    }));
  }, []);

  const moveColumn = useCallback((id: string, direction: -1 | 1) => {
    setState((s) => {
      const col = s.columns.find((c) => c.id === id);
      if (!col) return s;
      const siblings = s.columns
        .filter((c) => c.projectId === col.projectId)
        .sort((a, b) => a.order - b.order);
      const idx = siblings.findIndex((c) => c.id === id);
      const target = idx + direction;
      if (target < 0 || target >= siblings.length) return s;
      const reordered = [...siblings];
      [reordered[idx], reordered[target]] = [reordered[target], reordered[idx]];
      const orderMap = new Map(reordered.map((c, i) => [c.id, i]));
      return {
        ...s,
        columns: s.columns.map((c) => (orderMap.has(c.id) ? { ...c, order: orderMap.get(c.id)! } : c)),
      };
    });
  }, []);

  const createTask = useCallback<AppContextValue["createTask"]>(
    (input) => {
      const task: Task = {
        id: uid("task"),
        description: "",
        priority: "medium",
        dueDate: null,
        labelIds: [],
        assigneeId: null,
        checklist: [],
        comments: [],
        attachments: [],
        completed: false,
        createdAt: new Date().toISOString(),
        ...input,
      };
      setState((s) => ({ ...s, tasks: [...s.tasks, task] }));
      log("task_created", `Created task “${task.title}”`);
    },
    [log],
  );

  const updateTask = useCallback(
    (id: string, patch: Partial<Task>) => {
      setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));
      const title = state.tasks.find((t) => t.id === id)?.title ?? "task";
      if (patch.completed) {
        log("task_completed", `Completed “${title}”`, {
          title: "Task completed",
          body: `“${title}” was marked complete.`,
          kind: "success",
        });
      } else {
        log("task_edited", `Updated “${title}”`);
      }
    },
    [log, state.tasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      const removed = state.tasks.find((t) => t.id === id);
      setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== id) }));
      log("task_deleted", `Deleted “${removed?.title ?? "task"}”`);
      if (removed) {
        toast("Task deleted", {
          description: removed.title,
          action: {
            label: "Undo",
            onClick: () => setState((s) => ({ ...s, tasks: [...s.tasks, removed] })),
          },
        });
      }
    },
    [log, state.tasks],
  );

  const duplicateTask = useCallback(
    (id: string) => {
      setState((s) => {
        const t = s.tasks.find((x) => x.id === id);
        if (!t) return s;
        return {
          ...s,
          tasks: [...s.tasks, { ...t, id: uid("task"), title: `${t.title} (copy)`, createdAt: new Date().toISOString() }],
        };
      });
      log("task_created", "Duplicated a task");
    },
    [log],
  );

  const moveTask = useCallback(
    (taskId: string, columnId: string, beforeTaskId?: string | null) => {
      setState((s) => {
        const task = s.tasks.find((t) => t.id === taskId);
        if (!task) return s;
        const column = s.columns.find((c) => c.id === columnId);
        const completed = column?.name.toLowerCase() === "completed" ? true : task.completed && column?.id === task.columnId;
        const updated: Task = { ...task, columnId, completed };
        const rest = s.tasks.filter((t) => t.id !== taskId);
        if (!beforeTaskId) return { ...s, tasks: [...rest, updated] };
        const idx = rest.findIndex((t) => t.id === beforeTaskId);
        if (idx === -1) return { ...s, tasks: [...rest, updated] };
        return { ...s, tasks: [...rest.slice(0, idx), updated, ...rest.slice(idx)] };
      });
      const t = state.tasks.find((x) => x.id === taskId);
      const c = state.columns.find((x) => x.id === columnId);
      if (t && c && t.columnId !== columnId) log("task_moved", `Moved “${t.title}” to ${c.name}`);
    },
    [log, state.tasks, state.columns],
  );

  const addComment = useCallback(
    (taskId: string, body: string) => {
      setState((s) => ({
        ...s,
        tasks: s.tasks.map((t) =>
          t.id === taskId
            ? {
                ...t,
                comments: [
                  ...t.comments,
                  { id: uid("cm"), authorId: s.currentUserId, body, createdAt: new Date().toISOString() },
                ],
              }
            : t,
        ),
      }));
      log("comment_added", "Added a comment", { title: "Comment added", body });
    },
    [log],
  );

  const registerRecent = useCallback((taskId: string) => {
    setState((s) => ({
      ...s,
      recentTaskIds: [taskId, ...s.recentTaskIds.filter((id) => id !== taskId)].slice(0, 6),
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const exportState = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importState = useCallback((json: string) => {
    const parsed = JSON.parse(json) as AppState;
    if (!parsed.projects || !parsed.tasks) throw new Error("Invalid board file");
    setState(parsed);
  }, []);

  const resetDemoData = useCallback(() => setState(seedState()), []);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      ready,
      createProject,
      renameProject,
      deleteProject,
      toggleFavorite,
      toggleArchive,
      addColumn,
      renameColumn,
      deleteColumn,
      moveColumn,
      createTask,
      updateTask,
      deleteTask,
      duplicateTask,
      moveTask,
      addComment,
      registerRecent,
      markNotificationsRead,
      importState,
      exportState,
      resetDemoData,
    }),
    [
      state,
      ready,
      createProject,
      renameProject,
      deleteProject,
      toggleFavorite,
      toggleArchive,
      addColumn,
      renameColumn,
      deleteColumn,
      moveColumn,
      createTask,
      updateTask,
      deleteTask,
      duplicateTask,
      moveTask,
      addComment,
      registerRecent,
      markNotificationsRead,
      importState,
      exportState,
      resetDemoData,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
