import { Bell, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { relative } from "@/lib/format";

const icons = {
  success: CheckCircle2,
  warning: TriangleAlert,
  info: Info,
};

export function NotificationsPanel() {
  const { notifications, markNotificationsRead } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Popover onOpenChange={(open) => open && unread > 0 && setTimeout(markNotificationsRead, 1200)}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Notifications, ${unread} unread`} className="relative">
          <Bell className="h-[18px] w-[18px]" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button
            onClick={markNotificationsRead}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Mark all read
          </button>
        </div>
        <ul className="max-h-80 divide-y overflow-y-auto">
          {notifications.map((n) => {
            const Icon = icons[n.kind];
            return (
              <li key={n.id} className="flex gap-3 px-4 py-3 transition-colors hover:bg-muted/60">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{
                    color:
                      n.kind === "success"
                        ? "var(--accent-mint)"
                        : n.kind === "warning"
                          ? "var(--accent-amber)"
                          : "var(--accent-sky)",
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {n.title}
                    {!n.read && <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-brand" />}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{relative(n.createdAt)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
