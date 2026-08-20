import type { ReactNode } from "react";
import { SidebarNav } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar lg:block">
        <SidebarNav />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="min-w-0 flex-1 px-4 py-6 lg:px-8">
          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <h1 className="truncate font-display text-2xl font-bold sm:text-3xl">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>

      <CommandPalette />
    </div>
  );
}
