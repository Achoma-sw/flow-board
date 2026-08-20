import { createFileRoute, Link } from "@tanstack/react-router";
import { isToday, parseISO } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarClock, CheckCircle2, FolderKanban, ListChecks, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useApp } from "@/context/AppContext";
import { productivitySeries } from "@/data/mockData";
import { SkeletonBlock } from "@/components/common/StateBlocks";
import { Progress } from "@/components/ui/progress";
import { relative, priorityMeta, priorityOrder } from "@/lib/format";
import { UserAvatar } from "@/components/common/UserAvatar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Northwind Kanban" },
      {
        name: "description",
        content: "Track projects, tasks completed and what's due today across your whole workspace.",
      },
      { property: "og:title", content: "Dashboard — Northwind Kanban" },
      {
        property: "og:description",
        content: "Track projects, tasks completed and what's due today across your whole workspace.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { projects, tasks, columns, activity, users, ready } = useApp();

  const active = projects.filter((p) => !p.archived);
  const completed = tasks.filter((t) => t.completed);
  const dueToday = tasks.filter((t) => t.dueDate && !t.completed && isToday(parseISO(t.dueDate)));

  const stats = [
    { label: "Total projects", value: active.length, icon: FolderKanban, tone: "var(--brand)" },
    { label: "Total tasks", value: tasks.length, icon: ListChecks, tone: "var(--accent-sky)" },
    { label: "Tasks completed", value: completed.length, icon: CheckCircle2, tone: "var(--accent-mint)" },
    { label: "Due today", value: dueToday.length, icon: CalendarClock, tone: "var(--accent-amber)" },
  ];

  const priorityData = priorityOrder.map((p) => ({
    name: priorityMeta[p].label,
    value: tasks.filter((t) => t.priority === p).length,
    color: priorityMeta[p].color,
  }));

  const workload = users.map((u) => ({
    name: u.name.split(" ")[0] ?? u.name,
    tasks: tasks.filter((t) => t.assigneeId === u.id && !t.completed).length,
  }));

  return (
    <AppShell title="Good morning, Ada" subtitle="Here's how your workspace is doing today.">
      {!ready ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-28" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="surface-card lift-hover rise-in p-5"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <span
                    className="grid h-9 w-9 place-items-center rounded-xl"
                    style={{ backgroundColor: `color-mix(in oklab, ${s.tone} 15%, transparent)`, color: s.tone }}
                  >
                    <s.icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-3 font-display text-3xl font-bold tabular-nums">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="surface-card p-5 lg:col-span-2">
              <h2 className="text-sm font-semibold">Throughput this week</h2>
              <p className="mb-4 text-xs text-muted-foreground">Tasks created vs completed</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={productivitySeries}>
                    <defs>
                      <linearGradient id="gCreated" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gDone" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={24} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        color: "var(--popover-foreground)",
                      }}
                    />
                    <Area type="monotone" dataKey="created" stroke="var(--chart-1)" fill="url(#gCreated)" strokeWidth={2} />
                    <Area type="monotone" dataKey="completed" stroke="var(--chart-2)" fill="url(#gDone)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="text-sm font-semibold">Priority mix</h2>
              <p className="mb-2 text-xs text-muted-foreground">All open and closed tasks</p>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={priorityData} dataKey="value" innerRadius={48} outerRadius={76} paddingAngle={3}>
                      {priorityData.map((d) => (
                        <Cell key={d.name} fill={d.color} stroke="transparent" />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
                {priorityData.map((d) => (
                  <li key={d.name} className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name} · {d.value}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="surface-card p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Project progress</h2>
                <Link to="/projects" className="inline-flex items-center gap-1 text-xs text-brand hover:underline">
                  All projects <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <ul className="space-y-4">
                {active.map((p) => {
                  const pt = tasks.filter((t) => t.projectId === p.id);
                  const pct = pt.length ? Math.round((pt.filter((t) => t.completed).length / pt.length) * 100) : 0;
                  return (
                    <li key={p.id}>
                      <Link
                        to="/projects/$projectId"
                        params={{ projectId: p.id }}
                        className="flex items-center justify-between gap-3 text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="truncate font-medium">{p.name}</span>
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {pt.filter((t) => t.completed).length}/{pt.length} · {pct}%
                        </span>
                      </Link>
                      <Progress value={pct} className="mt-2 h-1.5" />
                    </li>
                  );
                })}
              </ul>

              <h3 className="mb-3 mt-8 text-sm font-semibold">Open tasks by teammate</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workload}>
                    <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={24} />
                    <Tooltip
                      cursor={{ fill: "var(--muted)" }}
                      contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                    />
                    <Bar dataKey="tasks" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="mb-4 text-sm font-semibold">Recent activity</h2>
              <ul className="space-y-4 border-l pl-4">
                {activity.slice(0, 8).map((a) => (
                  <li key={a.id} className="relative text-sm">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-brand" />
                    <p className="leading-snug">{a.message}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{relative(a.createdAt)}</p>
                  </li>
                ))}
              </ul>

              <h3 className="mb-3 mt-6 text-sm font-semibold">Team</h3>
              <ul className="space-y-3">
                {users.map((u) => (
                  <li key={u.id} className="flex items-center gap-3">
                    <UserAvatar user={u} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            {columns.length} columns across {active.length} boards · press{" "}
            <kbd className="rounded border px-1">⌘K</kbd> for the command palette
          </p>
        </div>
      )}
    </AppShell>
  );
}
