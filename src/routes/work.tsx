import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Eye } from "lucide-react";
import { useGsap } from "@/lib/useGsap";
import { gsap } from "gsap";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Selected Work — Apex Studio" },
      {
        name: "description",
        content: "Selected projects from Apex — brands, products and platforms shipped with ambitious teams.",
      },
      { property: "og:title", content: "Selected Work — Apex Studio" },
      { property: "og:description", content: "Brands, products and platforms shipped with ambitious teams." },
    ],
  }),
  component: WorkPage,
});

type ProjectRow = {
  id: string;
  number: string;
  title: string;
  tag: string;
  year: string;
  summary: string;
  accent: string;
  category: string;
  image_url: string | null;
  view_url: string | null;
};

const ALL = "All";

function WorkPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [active, setActive] = useState<string>(ALL);

  useEffect(() => {
    void supabase
      .from("projects")
      .select("id, number, title, tag, year, summary, accent, category, image_url, view_url")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setProjects((data ?? []) as ProjectRow[]));
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return [ALL, ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(
    () => (active === ALL ? projects : projects.filter((p) => p.category === active)),
    [projects, active],
  );

  const root = useGsap<HTMLDivElement>((_, el) => {
    gsap.from(el.querySelectorAll(".reveal"), {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
    });
    gsap.from(el.querySelectorAll(".project-card"), {
      opacity: 0,
      y: 60,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: el.querySelector("#projects"), start: "top 80%" },
    });
  }, [projects.length]);

  return (
    <div ref={root}>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-primary">
            ● Selected work · 2022—2024
          </p>
          <h1 className="reveal mt-6 font-display text-5xl font-semibold tracking-tight md:text-7xl">
            Built for <span className="text-gradient">leaders.</span>
          </h1>
        </div>
      </section>

      {categories.length > 1 && (
        <section className="border-b border-border">
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-6 py-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-wider transition ${
                  active === cat
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="project-card group relative overflow-hidden rounded-xl border border-border bg-card hover-lift"
            >
              <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${p.accent}`}>
                {p.image_url ? (
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <>
                    <div className="grid-bg absolute inset-0 opacity-20" />
                    <div className="absolute inset-0 flex items-end p-8">
                      <span className="font-display text-7xl font-semibold tracking-tighter text-foreground/90">
                        {p.title}
                      </span>
                    </div>
                  </>
                )}
                <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/40 backdrop-blur transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <span className="absolute left-6 top-6 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur">
                  {p.category}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border p-6">
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold tracking-tight">{p.title}</h3>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground mt-1">
                    {p.tag}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
                  {p.view_url && (
                    <a
                      href={p.view_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/40 px-3 py-1.5 text-xs hover:border-primary/60 hover:text-primary"
                    >
                      <Eye className="h-3 w-3" /> View
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-10 text-sm text-muted-foreground md:col-span-2">
              No projects in this category yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
