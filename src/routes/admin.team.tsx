import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getDb } from "@/integrations/firebase/client";
import {
  AdminPageHeader,
  AdminInput,
  AdminCheckbox,
  EmptyState,
} from "@/components/admin/AdminUI";
import { Modal, FormFooter, Badge } from "./admin.services";

type Member = {
  id: string;
  name: string;
  role: string;
  sort_order: number;
  published: boolean;
};

export const Route = createFileRoute("/admin/team")({
  component: TeamAdmin,
});

function TeamAdmin() {
  const [rows, setRows] = useState<Member[] | null>(null);
  const [editing, setEditing] = useState<Member | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      const q = query(collection(getDb(), "team_members"), orderBy("sort_order", "asc"));
      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Member, "id">) })));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
      setRows([]);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Remove this team member?")) return;
    try {
      await deleteDoc(doc(getDb(), "team_members", id));
      toast.success("Member removed.");
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Team"
        description="People shown on the public About page."
        action={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 glow-shadow"
          >
            <Plus className="h-4 w-4" /> New member
          </button>
        }
      />

      {rows === null ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState message="No team members yet." />
      ) : (
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left font-mono text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-4 font-medium">{r.name}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.role}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.sort_order}</td>
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
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(creating || editing) && (
        <MemberFormModal
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

function MemberFormModal({
  initial,
  onClose,
  onSaved,
}: {
  initial: Member | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      role: String(fd.get("role") ?? "").trim(),
      sort_order: Number(fd.get("sort_order") ?? 0),
      published: fd.get("published") === "on",
    };
    setBusy(true);
    try {
      if (initial) {
        await updateDoc(doc(getDb(), "team_members", initial.id), payload);
        toast.success("Member updated.");
      } else {
        await addDoc(collection(getDb(), "team_members"), payload);
        toast.success("Member added.");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title={initial ? "Edit member" : "New member"} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-4">
        <AdminInput label="Name" name="name" required defaultValue={initial?.name} />
        <AdminInput label="Role" name="role" required defaultValue={initial?.role} placeholder="Design Lead" />
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
