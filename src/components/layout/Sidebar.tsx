import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  Folders,
  LayoutDashboard,
  History,
  Settings,
  Star,
  Plus,
  KanbanSquare,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/projects", label: "Projects", icon: Folders, exact: false },
  { to: "/calendar", label: "Calendar", icon: CalendarDays, exact: false },
  { to: "/activity", label: "Activity", icon: History, exact: false },
  { to: "/settings", label: "Settings", icon: Settings, exact: false },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { projects, createProject } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const favorites = projects.filter((p) => p.favorite && !p.archived);

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 px-2 py-1">
        <span className="grid h-9 w-9 place-items-center rounded-xl gradient-brand text-primary-foreground">
          <KanbanSquare className="h-5 w-5" />
        </span>
        <span className="font-display text-lg font-bold tracking-tight">Northwind</span>
      </Link>

      <nav aria-label="Main" className="space-y-1">
        {nav.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <p className="mb-2 flex items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Star className="h-3.5 w-3.5" /> Favorites
        </p>
        <div className="space-y-1">
          {favorites.length === 0 ? (
            <p className="px-3 text-xs text-muted-foreground">Star a project to pin it here.</p>
          ) : (
            favorites.map((p) => (
              <Link
                key={p.id}
                to="/projects/$projectId"
                params={{ projectId: p.id }}
                onClick={onNavigate}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="truncate">{p.name}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      <Button
        className="w-full"
        onClick={() => {
          const name = window.prompt("Project name");
          if (name?.trim()) createProject(name.trim());
        }}
      >
        <Plus className="h-4 w-4" /> New project
      </Button>
    </div>
  );
}
