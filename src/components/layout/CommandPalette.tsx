import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Folders, History, LayoutDashboard, Settings, SquareCheck } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useApp } from "@/context/AppContext";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { projects, tasks } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Command palette" description="Jump anywhere">
      <CommandInput placeholder="Search projects, tasks and pages…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go(() => navigate({ to: "/" }))}>
            <LayoutDashboard /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/projects" }))}>
            <Folders /> Projects
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/calendar" }))}>
            <CalendarDays /> Calendar
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/activity" }))}>
            <History /> Activity
          </CommandItem>
          <CommandItem onSelect={() => go(() => navigate({ to: "/settings" }))}>
            <Settings /> Settings
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects.map((p) => (
            <CommandItem
              key={p.id}
              value={`project ${p.name}`}
              onSelect={() =>
                go(() => navigate({ to: "/projects/$projectId", params: { projectId: p.id } }))
              }
            >
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Tasks">
          {tasks.slice(0, 12).map((t) => (
            <CommandItem
              key={t.id}
              value={`task ${t.title}`}
              onSelect={() =>
                go(() =>
                  navigate({
                    to: "/projects/$projectId",
                    params: { projectId: t.projectId },
                    search: { task: t.id },
                  }),
                )
              }
            >
              <SquareCheck /> {t.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
