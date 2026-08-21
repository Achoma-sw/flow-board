import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { priorityMeta } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Northwind Kanban" },
      { name: "description", content: "See every task by due date in a month view calendar." },
      { property: "og:title", content: "Calendar — Northwind Kanban" },
      { property: "og:description", content: "See every task by due date in a month view calendar." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { tasks } = useApp();
  const [cursor, setCursor] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }),
  });

  return (
    <AppShell
      title="Calendar"
      subtitle="Tasks plotted by due date."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" aria-label="Previous month" onClick={() => setCursor(subMonths(cursor, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-36 text-center text-sm font-semibold">{format(cursor, "MMMM yyyy")}</span>
          <Button variant="outline" size="icon" aria-label="Next month" onClick={() => setCursor(addMonths(cursor, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      }
    >
      <div className="surface-card overflow-hidden">
        <div className="grid grid-cols-7 border-b bg-surface-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="px-2 py-2 text-center">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const dayTasks = tasks.filter((t) => t.dueDate && isSameDay(parseISO(t.dueDate), day));
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "min-h-28 border-b border-r p-1.5 transition-colors last:border-r-0",
                  !isSameMonth(day, cursor) && "bg-surface-2/60 text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "inline-grid h-6 w-6 place-items-center rounded-full text-xs font-semibold",
                    isToday(day) && "bg-brand text-primary-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
                <ul className="mt-1 space-y-1">
                  {dayTasks.slice(0, 3).map((t) => (
                    <li key={t.id}>
                      <Link
                        to="/projects/$projectId"
                        params={{ projectId: t.projectId }}
                        search={{ task: t.id }}
                        className="block truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium transition-opacity hover:opacity-80"
                        style={{
                          color: priorityMeta[t.priority].color,
                          backgroundColor: `color-mix(in oklab, ${priorityMeta[t.priority].color} 14%, transparent)`,
                        }}
                      >
                        {t.title}
                      </Link>
                    </li>
                  ))}
                  {dayTasks.length > 3 && (
                    <li className="px-1.5 text-[11px] text-muted-foreground">+{dayTasks.length - 3} more</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
