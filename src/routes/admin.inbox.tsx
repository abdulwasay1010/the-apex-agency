import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Trash2, Loader2, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminPageHeader, EmptyState } from "@/components/admin/AdminUI";

type Submission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  message: string;
  created_at: string;
};

export const Route = createFileRoute("/admin/inbox")({
  component: InboxAdmin,
});

function InboxAdmin() {
  const [rows, setRows] = useState<Submission[] | null>(null);

  async function load() {
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows(data ?? []);
  }
  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Message deleted.");
      void load();
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Inbox"
        description="Inquiries from the public contact form."
      />

      {rows === null ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState message="No messages yet." />
      ) : (
        <div className="mt-8 space-y-4">
          {rows.map((r) => (
            <article key={r.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-lg font-semibold">{r.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1.5 hover:text-primary">
                      <Mail className="h-3 w-3" /> {r.email}
                    </a>
                    {r.company && <> · {r.company}</>}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                  <button
                    onClick={() => remove(r.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-destructive hover:border-destructive/60"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap border-t border-border pt-4 text-sm leading-relaxed">
                {r.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
