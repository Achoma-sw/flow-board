import type { AppState, Column, Project, Task, Priority } from "@/lib/types";

const day = 86400000;
const iso = (offset: number) => new Date(Date.now() + offset * day).toISOString();

export const DEFAULT_COLUMN_NAMES = ["Backlog", "To Do", "In Progress", "Review", "Completed"];

export const users = [
  {
    id: "u1",
    name: "Ada Obi",
    initials: "AO",
    color: "var(--brand)",
    email: "ada@northwind.io",
    role: "Product Lead",
  },
  {
    id: "u2",
    name: "Marcus Lane",
    initials: "ML",
    color: "var(--accent-mint)",
    email: "marcus@northwind.io",
    role: "Engineer",
  },
  {
    id: "u3",
    name: "Sofia Reyes",
    initials: "SR",
    color: "var(--accent-amber)",
    email: "sofia@northwind.io",
    role: "Designer",
  },
  {
    id: "u4",
    name: "Kenji Watanabe",
    initials: "KW",
    color: "var(--accent-rose)",
    email: "kenji@northwind.io",
    role: "QA",
  },
];

export const labels = [
  { id: "l1", name: "Design", color: "var(--accent-rose)" },
  { id: "l2", name: "Frontend", color: "var(--brand)" },
  { id: "l3", name: "Backend", color: "var(--accent-mint)" },
  { id: "l4", name: "Research", color: "var(--accent-amber)" },
  { id: "l5", name: "Bug", color: "var(--destructive)" },
  { id: "l6", name: "Docs", color: "var(--accent-sky)" },
];

const projectSeeds = [
  { id: "p1", name: "Atlas Web Platform", desc: "Marketing site + customer portal rebuild.", color: "var(--brand)", fav: true },
  { id: "p2", name: "Mobile App v2", desc: "Cross-platform release with offline sync.", color: "var(--accent-mint)", fav: true },
  { id: "p3", name: "Design System", desc: "Tokens, components and documentation.", color: "var(--accent-rose)", fav: false },
  { id: "p4", name: "Q3 Growth Campaign", desc: "Lifecycle emails, ads and landing pages.", color: "var(--accent-amber)", fav: false },
];

const taskSeeds: Array<[string, number, string, string, Priority, number | null, string[], string | null]> = [
  ["p1", 0, "Audit legacy analytics events", "Map every tracked event and flag duplicates before migration.", "low", 12, ["l4"], "u1"],
  ["p1", 0, "Spike: edge caching strategy", "Compare CDN options and cost model for global traffic.", "medium", 9, ["l3", "l4"], "u2"],
  ["p1", 1, "Rebuild pricing page", "New tiers, annual toggle and comparison table.", "high", 3, ["l1", "l2"], "u3"],
  ["p1", 1, "Localise onboarding copy", "EN, FR and ES strings extracted to JSON.", "medium", 6, ["l6"], "u1"],
  ["p1", 2, "Customer portal shell", "Routing, layout and auth-guarded navigation.", "urgent", 0, ["l2"], "u2"],
  ["p1", 2, "Invoice download endpoint", "Signed URLs with 10 minute expiry.", "high", 1, ["l3"], "u2"],
  ["p1", 3, "Accessibility pass on forms", "Keyboard traps and label associations.", "high", 2, ["l1", "l2"], "u4"],
  ["p1", 4, "Set up preview deployments", "Every PR gets an isolated preview URL.", "medium", -4, ["l3"], "u2"],
  ["p1", 4, "Brand refresh handoff", "Final logo lockups delivered to engineering.", "low", -8, ["l1"], "u3"],
  ["p2", 0, "Offline conflict resolution research", "Compare CRDT and last-write-wins tradeoffs.", "medium", 15, ["l4"], "u2"],
  ["p2", 1, "Push notification permissions flow", "Soft-ask screen before native prompt.", "high", 4, ["l1", "l2"], "u3"],
  ["p2", 2, "Biometric login", "Face ID / fingerprint unlock with fallback PIN.", "urgent", 0, ["l2"], "u2"],
  ["p2", 3, "Crash reporting dashboard", "Group by release and device class.", "medium", 5, ["l3"], "u4"],
  ["p2", 4, "App icon variants", "Light, dark and tinted icons shipped.", "low", -3, ["l1"], "u3"],
  ["p3", 0, "Motion guidelines", "Durations, easing curves and reduced-motion rules.", "low", 20, ["l1", "l6"], "u3"],
  ["p3", 1, "Token naming convention", "Semantic layer over primitive palette.", "medium", 7, ["l1"], "u3"],
  ["p3", 2, "Data table component", "Sorting, sticky header, empty and loading states.", "high", 1, ["l2"], "u1"],
  ["p3", 4, "Publish v1.0 to registry", "Versioned release with changelog.", "medium", -6, ["l6"], "u2"],
  ["p4", 1, "Lifecycle email sequence", "Five-touch onboarding drip.", "medium", 8, ["l6"], "u1"],
  ["p4", 2, "Landing page A/B test", "Headline and hero image variants.", "high", 2, ["l1", "l2"], "u3"],
  ["p4", 3, "Attribution model review", "Validate multi-touch reporting numbers.", "urgent", 1, ["l4", "l5"], "u1"],
  ["p4", 4, "Q2 retrospective doc", "What worked, what to cut for Q3.", "low", -10, ["l6"], "u1"],
];

function buildSeed(): AppState {
  const projects: Project[] = projectSeeds.map((p, i) => ({
    id: p.id,
    name: p.name,
    description: p.desc,
    color: p.color,
    favorite: p.fav,
    archived: false,
    createdAt: iso(-40 + i * 5),
  }));

  const columns: Column[] = [];
  projects.forEach((p) => {
    DEFAULT_COLUMN_NAMES.forEach((name, order) => {
      columns.push({ id: `${p.id}-c${order}`, projectId: p.id, name, order });
    });
  });

  const tasks: Task[] = taskSeeds.map((t, i) => {
    const [projectId, colIdx, title, description, priority, due, labelIds, assigneeId] = t;
    return {
      id: `t${i + 1}`,
      projectId,
      columnId: `${projectId}-c${colIdx}`,
      title,
      description,
      priority,
      dueDate: due === null ? null : iso(due),
      labelIds,
      assigneeId,
      completed: colIdx === 4,
      createdAt: iso(-20 + (i % 12)),
      checklist:
        i % 3 === 0
          ? [
              { id: `${i}-k1`, text: "Draft approach", done: true },
              { id: `${i}-k2`, text: "Review with team", done: colIdx >= 3 },
              { id: `${i}-k3`, text: "Ship it", done: colIdx === 4 },
            ]
          : [],
      comments:
        i % 4 === 0
          ? [
              {
                id: `${i}-cm1`,
                authorId: "u3",
                body: "Left a few notes in Figma — mostly spacing on mobile.",
                createdAt: iso(-2),
              },
              {
                id: `${i}-cm2`,
                authorId: "u2",
                body: "Picked this up, should be ready for review tomorrow.",
                createdAt: iso(-1),
              },
            ]
          : [],
      attachments:
        i % 5 === 0
          ? [
              { id: `${i}-a1`, name: "spec-v3.pdf", size: "412 KB", kind: "pdf" },
              { id: `${i}-a2`, name: "hero-mock.png", size: "1.8 MB", kind: "image" },
            ]
          : [],
    };
  });

  return {
    projects,
    columns,
    tasks,
    labels,
    users,
    currentUserId: "u1",
    recentTaskIds: [],
    activity: [
      { id: "a1", kind: "task_completed", message: "Ada completed “Publish v1.0 to registry”", createdAt: iso(-0.2) },
      { id: "a2", kind: "task_moved", message: "Marcus moved “Biometric login” to In Progress", createdAt: iso(-0.4) },
      { id: "a3", kind: "comment_added", message: "Sofia commented on “Rebuild pricing page”", createdAt: iso(-1) },
      { id: "a4", kind: "task_created", message: "Kenji created “Crash reporting dashboard”", createdAt: iso(-2) },
      { id: "a5", kind: "project_created", message: "Ada created project “Q3 Growth Campaign”", createdAt: iso(-4) },
    ],
    notifications: [
      { id: "n1", title: "Task completed", body: "“Publish v1.0 to registry” was marked complete.", createdAt: iso(-0.2), read: false, kind: "success" },
      { id: "n2", title: "Due tomorrow", body: "“Invoice download endpoint” is due tomorrow.", createdAt: iso(-0.5), read: false, kind: "warning" },
      { id: "n3", title: "Comment added", body: "Sofia commented on “Rebuild pricing page”.", createdAt: iso(-1), read: false, kind: "info" },
      { id: "n4", title: "New project created", body: "“Q3 Growth Campaign” is now on your board.", createdAt: iso(-4), read: true, kind: "info" },
    ],
  };
}

export const seedState = buildSeed;

export const productivitySeries = [
  { day: "Mon", created: 6, completed: 4 },
  { day: "Tue", created: 8, completed: 6 },
  { day: "Wed", created: 5, completed: 7 },
  { day: "Thu", created: 9, completed: 5 },
  { day: "Fri", created: 7, completed: 9 },
  { day: "Sat", created: 3, completed: 4 },
  { day: "Sun", created: 2, completed: 3 },
];
