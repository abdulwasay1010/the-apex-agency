import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AdminPageHeader,
  AdminInput,
  AdminTextarea,
  AdminCheckbox,
  EmptyState,
} from "@/components/admin/AdminUI";
import { Modal, FormFooter, Badge } from "./admin.services";

type Project = {
  id: string;
  number: string;
  title: string;
  tag: string;
  year: string;
  summary: string;
  accent: string;
  sort_order: number;
  published: boolean;
};

export const Route = createFileRoute("/admin/work")({
  component: WorkAdmin,
});

function WorkAdmin() {
  const [rows, setRows] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows(data ?? []);
  }
  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Project deleted.");
      void load();
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Work"
        description="Selected projects shown on the public Work page."
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 glow-shadow"
          >
            <Plus className="h-4 w-4" /> New project
          </button>
        }
      />

      {rows === null ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState message="No projects yet. Add your first case study." />
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Tag</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-4 font-mono text-xs text-primary">{r.number}</td>
                  <td className="px-4 py-4 font-medium">{r.title}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.tag}</td>
                  <td className="px-4 py-4 font-mono text-xs">{r.year}</td>
                  <td className="px-4 py-4"><Badge on={r.published} /></td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => setEditing(r)}
                      className="mr-2 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary/60"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => remove(r.id)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-destructive hover:border-destructive/60"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(creating || editing) && (
        <ProjectFormModal
          initial={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={() => {
            setCreating(false);
            setEditing(null);
            void load();
          }}
        />
      )}
    </div>
  );
}

function ProjectFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      number: String(fd.get("number") ?? "").trim(),
      title: String(fd.get("title") ?? "").trim(),
      tag: String(fd.get("tag") ?? "").trim(),
      year: String(fd.get("year") ?? "").trim(),
      summary: String(fd.get("summary") ?? "").trim(),
      accent: String(fd.get("accent") ?? "from-red-500/40 to-red-900/10").trim(),
      sort_order: Number(fd.get("sort_order") ?? 0),
      published: fd.get("published") === "on",
    };

    setBusy(true);
    const { error } = initial
      ? await supabase.from("projects").update(payload).eq("id", initial.id)
      : await supabase.from("projects").insert(payload);
    setBusy(false);

    if (error) toast.error(error.message);
    else {
      toast.success(initial ? "Project updated." : "Project created.");
      onSaved();
    }
  }

  return (
    <Modal title={initial ? "Edit project" : "New project"} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
          <AdminInput label="Number" name="number" required defaultValue={initial?.number ?? "01"} />
          <AdminInput label="Title" name="title" required defaultValue={initial?.title} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="Tag" name="tag" required defaultValue={initial?.tag} placeholder="Fintech · Brand + Product" />
          <AdminInput label="Year" name="year" required defaultValue={initial?.year} placeholder="2024" />
        </div>
        <AdminTextarea label="Summary" name="summary" required rows={3} defaultValue={initial?.summary} />
        <AdminInput
          label="Accent gradient (Tailwind)"
          name="accent"
          defaultValue={initial?.accent ?? "from-red-500/40 to-red-900/10"}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="Sort order" name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} />
          <div className="flex items-end">
            <AdminCheckbox label="Published" name="published" defaultChecked={initial?.published ?? true} />
          </div>
        </div>
        <FormFooter busy={busy} onClose={onClose} editing={!!initial} />
      </form>
    </Modal>
  );
}
