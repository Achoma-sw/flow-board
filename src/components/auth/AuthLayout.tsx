import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { KanbanSquare } from "lucide-react";

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between gradient-brand p-12 text-primary-foreground lg:flex">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-background/20">
            <KanbanSquare className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">Northwind</span>
        </Link>
        <div className="max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-tight">
            Every project, every task, one calm workspace.
          </h2>
          <p className="mt-4 text-primary-foreground/85">
            Kanban boards, live search, priorities and progress analytics — built for teams that ship.
          </p>
        </div>
        <p className="text-sm text-primary-foreground/70">Trusted by 12,000+ product teams</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm rise-in">
          <h1 className="font-display text-2xl font-bold">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8 space-y-4">{children}</div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
