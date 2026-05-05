import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutGrid, Briefcase, Users, Inbox } from "lucide-react";
import { collection, getCountFromServer } from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});

const cards = [
  { to: "/admin/services", label: "Services", icon: LayoutGrid, table: "services" },
  { to: "/admin/work", label: "Projects", icon: Briefcase, table: "projects" },
  { to: "/admin/team", label: "Team members", icon: Users, table: "team_members" },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox, table: "contact_submissions" },
] as const;

function AdminOverview() {
  const [counts, setCounts] = useState<Record<string, number | null>>({});

  useEffect(() => {
    void Promise.all(
      cards.map(async (c) => {
        try {
          const snap = await getCountFromServer(collection(getDb(), c.table));
          return [c.table, snap.data().count] as const;
        } catch {
          return [c.table, 0] as const;
        }
      }),
    ).then((rows) => setCounts(Object.fromEntries(rows)));
  }, []);

  return (
    <div>
      <header className="border-b border-border pb-6">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">● Admin</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage what visitors see across the Apex site.
        </p>
      </header>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/60"
          >
            <div className="flex items-center justify-between">
              <c.icon className="h-5 w-5 text-primary" />
              <span className="font-mono text-2xl font-semibold">
                {counts[c.table] ?? "—"}
              </span>
            </div>
            <p className="mt-6 font-display text-lg font-semibold">{c.label}</p>
            <p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground">
              Manage →
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
