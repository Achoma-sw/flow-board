import { Link } from "@tanstack/react-router";
import { Folders, SquareCheck, Tag } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function GlobalSearchResults({ query, onClose }: { query: string; onClose: () => void }) {
  const { projects, tasks, labels } = useApp();
  const q = query.trim().toLowerCase();

  const projectHits = projects.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 4);
  const labelHits = labels.filter((l) => l.name.toLowerCase().includes(q)).slice(0, 4);
  const taskHits = tasks
    .filter((t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
    .slice(0, 6);

  const empty = !projectHits.length && !labelHits.length && !taskHits.length;

  return (
    <div className="absolute left-0 right-0 top-12 z-40 max-h-96 overflow-y-auto rounded-xl border bg-popover p-2 shadow-lg rise-in">
      {empty && <p className="px-3 py-6 text-center text-sm text-muted-foreground">No matches for “{query}”</p>}

      {projectHits.length > 0 && (
        <Section title="Projects">
          {projectHits.map((p) => (
            <Link
              key={p.id}
              to="/projects/$projectId"
              params={{ projectId: p.id }}
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <Folders className="h-4 w-4 text-muted-foreground" /> {p.name}
            </Link>
          ))}
        </Section>
      )}

      {taskHits.length > 0 && (
        <Section title="Tasks">
          {taskHits.map((t) => (
            <Link
              key={t.id}
              to="/projects/$projectId"
              params={{ projectId: t.projectId }}
              search={{ task: t.id }}
              onClick={onClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
            >
              <SquareCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{t.title}</span>
            </Link>
          ))}
        </Section>
      )}

      {labelHits.length > 0 && (
        <Section title="Labels">
          {labelHits.map((l) => (
            <div key={l.id} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm">
              <Tag className="h-4 w-4" style={{ color: l.color }} /> {l.name}
            </div>
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}
