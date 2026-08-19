import { format, formatDistanceToNow, isPast, isToday, isTomorrow, parseISO } from "date-fns";
import type { Priority } from "./types";

export const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;

export function relative(dateIso: string) {
  return formatDistanceToNow(parseISO(dateIso), { addSuffix: true });
}

export function dueLabel(dateIso: string | null) {
  if (!dateIso) return null;
  const d = parseISO(dateIso);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "d MMM");
}

export function dueTone(dateIso: string | null, completed: boolean) {
  if (!dateIso || completed) return "neutral" as const;
  const d = parseISO(dateIso);
  if (isToday(d)) return "warning" as const;
  if (isPast(d)) return "danger" as const;
  return "neutral" as const;
}

export const priorityMeta: Record<Priority, { label: string; color: string }> = {
  low: { label: "Low", color: "var(--muted-foreground)" },
  medium: { label: "Medium", color: "var(--accent-sky)" },
  high: { label: "High", color: "var(--accent-amber)" },
  urgent: { label: "Urgent", color: "var(--destructive)" },
};

export const priorityOrder: Priority[] = ["low", "medium", "high", "urgent"];
