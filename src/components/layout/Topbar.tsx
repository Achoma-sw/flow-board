import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Moon, Search, Sun, LogOut, User as UserIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/context/ThemeContext";
import { UserAvatar } from "@/components/common/UserAvatar";
import { SidebarNav } from "./Sidebar";
import { NotificationsPanel } from "./NotificationsPanel";
import { PomodoroWidget } from "./PomodoroWidget";
import { GlobalSearchResults } from "./GlobalSearchResults";

export function Topbar() {
  const { users, currentUserId } = useApp();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const navigate = useNavigate();
  const me = users.find((u) => u.id === currentUserId);

  return (
    <header className="sticky top-0 z-30 glass-panel border-b">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-6">
        <Sheet open={mobileNav} onOpenChange={setMobileNav}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-sidebar p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarNav onNavigate={() => setMobileNav(false)} />
          </SheetContent>
        </Sheet>

        <div className="relative min-w-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks, projects and labels…"
            aria-label="Search"
            className="h-10 rounded-xl border-border bg-surface-2 pl-9 pr-16"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block">
            ⌘K
          </kbd>
          {query.trim().length > 0 && (
            <GlobalSearchResults query={query} onClose={() => setQuery("")} />
          )}
        </div>

        <div className="flex items-center gap-1">
          <PomodoroWidget />
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </Button>
          <NotificationsPanel />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="ml-1 rounded-full transition-transform hover:scale-105" aria-label="Account menu">
                <UserAvatar user={me} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-semibold">{me?.name}</p>
                <p className="text-xs font-normal text-muted-foreground">{me?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                <UserIcon className="h-4 w-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
                <Settings className="h-4 w-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/login">
                  <LogOut className="h-4 w-4" /> Sign out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
