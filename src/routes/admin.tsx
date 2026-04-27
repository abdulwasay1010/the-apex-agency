import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2, LayoutGrid, Briefcase, Users, Inbox, LogOut, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Apex Studio" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/admin/services", label: "Services", icon: LayoutGrid, exact: false },
  { to: "/admin/work", label: "Work", icon: Briefcase, exact: false },
  { to: "/admin/team", label: "Team", icon: Users, exact: false },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox, exact: false },
] as const;

function AdminLayout() {
  const { session, isAdmin, loading, user } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg px-6 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold">Access denied</h1>
        <p className="mt-3 text-muted-foreground">
          Your account doesn&apos;t have admin access. Ask a studio admin to grant the
          <code className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">admin</code>
          role to <span className="font-mono">{user?.email}</span>.
        </p>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:border-primary/60"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-8 px-6 py-10 md:grid-cols-[240px_1fr]">
      <aside className="md:sticky md:top-24 md:self-start">
        <div className="rounded-xl border border-border bg-card p-4">
          <Logo className="mb-6" />
          <nav className="space-y-1">
            {nav.map((n) => {
              const on = n.exact ? path === n.to : path.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    on
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6 border-t border-border pt-4">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" /> View site
            </Link>
            <button
              onClick={() => supabase.auth.signOut()}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
            <p className="mt-3 truncate px-3 font-mono text-xs text-muted-foreground" title={user?.email ?? ""}>
              {user?.email}
            </p>
          </div>
        </div>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
