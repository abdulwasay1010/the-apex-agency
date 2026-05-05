import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Loader2, Upload } from "lucide-react";
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
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDb, getFirebaseStorage } from "@/integrations/firebase/client";
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
  category: string;
  image_url: string | null;
  view_url: string | null;
};

export const Route = createFileRoute("/admin/work")({
  component: WorkAdmin,
});

function WorkAdmin() {
  const [rows, setRows] = useState<Project[] | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    try {
      const q = query(collection(getDb(), "projects"), orderBy("sort_order", "asc"));
      const snap = await getDocs(q);
      setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) })));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
      setRows([]);
    }
  }
  useEffect(() => {
    void load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this project?")) return;
    try {
      await deleteDoc(doc(getDb(), "projects", id));
      toast.success("Project deleted.");
      void load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
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
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border/60 last:border-0">
                  <td className="px-4 py-4 font-mono text-xs text-primary">{r.number}</td>
                  <td className="px-4 py-4">
                    {r.image_url ? (
                      <img src={r.image_url} alt={r.title} className="h-10 w-14 rounded object-cover" />
                    ) : (
                      <div className="h-10 w-14 rounded bg-muted" />
                    )}
                  </td>
                  <td className="px-4 py-4 font-medium">{r.title}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.category}</td>
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
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.image_url ?? null);

  async function onUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `project-images/${crypto.randomUUID()}.${ext}`;
      const r = storageRef(getFirebaseStorage(), path);
      await uploadBytes(r, file);
      const url = await getDownloadURL(r);
      setImageUrl(url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

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
      category: String(fd.get("category") ?? "General").trim() || "General",
      view_url: String(fd.get("view_url") ?? "").trim() || null,
      image_url: imageUrl,
    };

    setBusy(true);
    try {
      if (initial) {
        await updateDoc(doc(getDb(), "projects", initial.id), payload);
        toast.success("Project updated.");
      } else {
        await addDoc(collection(getDb(), "projects"), payload);
        toast.success("Project created.");
      }
      onSaved();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
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
          <AdminInput label="Category" name="category" required defaultValue={initial?.category ?? "General"} placeholder="Branding" />
          <AdminInput label="Tag" name="tag" required defaultValue={initial?.tag} placeholder="Fintech · Brand + Product" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="Year" name="year" required defaultValue={initial?.year} placeholder="2024" />
          <AdminInput label="View URL" name="view_url" type="url" defaultValue={initial?.view_url ?? ""} placeholder="https://..." />
        </div>
        <AdminTextarea label="Summary" name="summary" required rows={3} defaultValue={initial?.summary} />

        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Cover image</span>
          <div className="mt-2 flex items-center gap-4">
            {imageUrl ? (
              <img src={imageUrl} alt="" className="h-20 w-28 rounded-md object-cover border border-border" />
            ) : (
              <div className="h-20 w-28 rounded-md border border-dashed border-border bg-muted/30" />
            )}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:border-primary/60">
              {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
              {uploading ? "Uploading..." : imageUrl ? "Replace image" : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
            </label>
            {imageUrl && (
              <button type="button" onClick={() => setImageUrl(null)} className="text-xs text-destructive hover:underline">
                Remove
              </button>
            )}
          </div>
        </div>

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
