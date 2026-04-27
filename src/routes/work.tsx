import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useGsap } from "@/lib/useGsap";
import { gsap } from "gsap";

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

const projects = [
  {
    n: "01",
    title: "Northwind",
    tag: "Fintech · Brand + Product",
    year: "2024",
    summary: "Repositioning a legacy bank for a new generation. New identity, new app, new everything.",
    accent: "from-red-500/40 to-red-900/10",
  },
  {
    n: "02",
    title: "Vanta Aerospace",
    tag: "Aerospace · Web Platform",
    year: "2024",
    summary: "An interactive marketing platform for a stealth-stage aerospace company.",
    accent: "from-orange-500/30 to-red-900/10",
  },
  {
    n: "03",
    title: "Auric Labs",
    tag: "Biotech · Identity",
    year: "2023",
    summary: "Visual system for a precision diagnostics lab — clinical, exact, unmistakable.",
    accent: "from-rose-500/30 to-red-900/10",
  },
  {
    n: "04",
    title: "Meridian OS",
    tag: "SaaS · Product Design",
    year: "2023",
    summary: "End-to-end product design for an operations platform used by thousands of teams.",
    accent: "from-red-700/30 to-red-950/10",
  },
  {
    n: "05",
    title: "Halcyon",
    tag: "Hospitality · Brand + Site",
    year: "2022",
    summary: "Brand and immersive site for a boutique hotel collection across four cities.",
    accent: "from-pink-500/20 to-red-900/10",
  },
  {
    n: "06",
    title: "Obscura Camera",
    tag: "DTC · Brand + Commerce",
    year: "2022",
    summary: "A film camera revival, from product design through to direct-to-consumer launch.",
    accent: "from-amber-500/20 to-red-900/10",
  },
];

function WorkPage() {
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
  });

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

      <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((p) => (
            <article
              key={p.n}
              className="project-card group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-card hover-lift"
            >
              <div className={`relative aspect-[4/3] bg-gradient-to-br ${p.accent} overflow-hidden`}>
                <div className="grid-bg absolute inset-0 opacity-20" />
                <div className="absolute inset-0 flex items-end p-8">
                  <span className="font-display text-7xl font-semibold tracking-tighter text-foreground/90">
                    {p.title}
                  </span>
                </div>
                <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/40 backdrop-blur transition-transform group-hover:rotate-45">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border p-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {p.tag}
                  </p>
                  <p className="mt-2 text-sm">{p.summary}</p>
                </div>
                <span className="ml-4 shrink-0 font-mono text-xs text-muted-foreground">{p.year}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
