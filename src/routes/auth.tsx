import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Apex Studio" },
      { name: "description", content: "Sign in to the Apex admin panel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) {
      navigate({ to: isAdmin ? "/admin" : "/" });
    }
  }, [loading, session, isAdmin, navigate]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    if (!email || password.length < 6) {
      toast.error("Enter a valid email and a 6+ char password.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Signed in.");
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-6">
      <div className="w-full">
        <Link to="/" className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          ← Back to site
        </Link>
        <h1 className="mt-8 font-display text-4xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Admin access only. Contact the studio for an invite.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="you@studio.com"
            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Password"
            className="w-full rounded-lg border border-border bg-input px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60 glow-shadow"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
