import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AdminPageHeader,
  AdminInput,
  AdminTextarea,
  AdminCheckbox,
  EmptyState,
} from "@/components/admin/AdminUI";

type Service = {
  id: string;
  number: string;
  title: string;
  description: string;
  items: string[];
  sort_order: number;
  published: boolean;
};

export const Route = createFileRoute("/admin/services")({
  component: ServicesAdmin,
});

function ServicesAdmin() {
  const [rows, setRows] = useState<Service[] | null>(null);
  const [editing, setEditing] = useState<Service | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows(data ?? []);
  }

  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Service deleted.");
      void load();
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Capabilities shown on the public Services page."
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 glow-shadow"
          >
            <Plus className="h-4 w-4" /> New service
          </button>
        }
      />

      {rows === null ? (
        <Loader />
      ) : rows.length === 0 ? (
        <EmptyState message="No services yet. Create your first one." />
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-4 font-mono text-xs text-primary">{r.number}</td>
                  <td className="px-4 py-4 font-medium">{r.title}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.sort_order}</td>
                  <td className="px-4 py-4">
                    <Badge on={r.published} />
                  </td>
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
        <ServiceFormModal
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

function ServiceFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Service | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const items = String(fd.get("items") ?? "")
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      number: String(fd.get("number") ?? "").trim(),
      title: String(fd.get("title") ?? "").trim(),
      description: String(fd.get("description") ?? "").trim(),
      items,
      sort_order: Number(fd.get("sort_order") ?? 0),
      published: fd.get("published") === "on",
    };

    setBusy(true);
    const { error } = initial
      ? await supabase.from("services").update(payload).eq("id", initial.id)
      : await supabase.from("services").insert(payload);
    setBusy(false);

    if (error) toast.error(error.message);
    else {
      toast.success(initial ? "Service updated." : "Service created.");
      onSaved();
    }
  }

  return (
    <Modal title={initial ? "Edit service" : "New service"} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
          <AdminInput label="Number" name="number" required defaultValue={initial?.number ?? "01"} />
          <AdminInput label="Title" name="title" required defaultValue={initial?.title} placeholder="Brand Identity" />
        </div>
        <AdminTextarea label="Description" name="description" required rows={3} defaultValue={initial?.description} />
        <AdminTextarea
          label="Items (one per line)"
          name="items"
          rows={4}
          defaultValue={initial?.items.join("\n") ?? ""}
          placeholder={"Strategy\nNaming\nLogo"}
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

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 elegant-shadow">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="font-display text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function FormFooter({
  busy,
  onClose,
  editing,
}: {
  busy: boolean;
  onClose: () => void;
  editing: boolean;
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
      <button
        type="button"
        onClick={onClose}
        className="rounded-full border border-border px-5 py-2 text-sm hover:border-primary/60"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {editing ? "Save changes" : "Create"}
      </button>
    </div>
  );
}

export function Badge({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${
        on ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${on ? "bg-primary" : "bg-muted-foreground"}`} />
      {on ? "Live" : "Draft"}
    </span>
  );
}

function Loader() {
  return (
    <div className="mt-12 flex justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  );
}
