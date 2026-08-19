export type Priority = "low" | "medium" | "high" | "urgent";

export interface User {
  id: string;
  name: string;
  initials: string;
  color: string;
  email: string;
  role: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  kind: string;
}

export interface Task {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  labelIds: string[];
  assigneeId: string | null;
  checklist: ChecklistItem[];
  comments: Comment[];
  attachments: Attachment[];
  createdAt: string;
  completed: boolean;
}

export interface Column {
  id: string;
  projectId: string;
  name: string;
  order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  favorite: boolean;
  archived: boolean;
  createdAt: string;
}

export type ActivityKind =
  | "task_created"
  | "task_edited"
  | "task_moved"
  | "task_completed"
  | "task_deleted"
  | "project_created"
  | "comment_added";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  message: string;
  projectId?: string;
  taskId?: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  kind: "success" | "warning" | "info";
}

export interface AppState {
  projects: Project[];
  columns: Column[];
  tasks: Task[];
  labels: Label[];
  users: User[];
  activity: ActivityEntry[];
  notifications: AppNotification[];
  currentUserId: string;
  recentTaskIds: string[];
}
