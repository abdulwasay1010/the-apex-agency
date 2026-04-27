import { createFileRoute } from "@tanstack/react-router";
import { useGsap } from "@/lib/useGsap";
import { gsap } from "gsap";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Apex Studio" },
      {
        name: "description",
        content:
          "Brand identity, product design, web platforms and motion. A focused set of capabilities, executed at the highest level.",
      },
      { property: "og:title", content: "Services — Apex Studio" },
      {
        property: "og:description",
        content: "A focused set of capabilities, executed at the highest level.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    n: "01",
    t: "Brand Identity",
    d: "Strategic positioning, naming, visual systems and guidelines that hold up across every surface and scale.",
    items: ["Strategy & positioning", "Naming & verbal identity", "Logo & visual system", "Brand guidelines"],
  },
  {
    n: "02",
    t: "Product Design",
    d: "Interfaces engineered for clarity, speed and conversion. From early concepts to launch-ready design systems.",
    items: ["UX research & flows", "UI design", "Design systems", "Prototyping"],
  },
  {
    n: "03",
    t: "Web Platforms",
    d: "Performance-driven marketing sites and full applications, built with modern stacks and meticulous craft.",
    items: ["Marketing sites", "Web applications", "CMS integration", "Performance & SEO"],
  },
  {
    n: "04",
    t: "Motion & 3D",
    d: "Cinematic animation, interaction design and 3D direction that elevates the entire product experience.",
    items: ["UI motion", "Brand films", "3D direction", "Interactive prototypes"],
  },
  {
    n: "05",
    t: "Strategy",
    d: "Workshops and audits that align teams around a sharp creative direction before a single pixel is drawn.",
    items: ["Brand audits", "Workshops", "Creative direction", "Roadmapping"],
  },
  {
    n: "06",
    t: "Engineering",
    d: "Production-grade frontend engineering, accessible by default, performant by design, maintainable forever.",
    items: ["React & TypeScript", "Headless CMS", "Component libraries", "DX tooling"],
  },
];

function ServicesPage() {
  const root = useGsap<HTMLDivElement>((_, el) => {
    gsap.from(el.querySelectorAll(".reveal"), {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
    });
  });

  return (
    <div ref={root}>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-32 md:pb-28">
          <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-primary">
            ● Services
          </p>
          <h1 className="reveal mt-6 font-display text-5xl font-semibold tracking-tight md:text-7xl">
            What we <span className="text-gradient">do.</span>
          </h1>
          <p className="reveal mt-6 max-w-2xl text-lg text-muted-foreground">
            A small, senior team handling everything end-to-end. No layers, no handoffs.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-px bg-border md:grid-cols-2">
          {services.map((s) => (
            <article
              key={s.n}
              className="reveal group bg-background p-10 transition-colors hover:bg-card"
            >
              <div className="flex items-start justify-between">
                <p className="font-mono text-xs text-primary">{s.n}</p>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Service
                </span>
              </div>
              <h2 className="mt-8 font-display text-3xl font-semibold tracking-tight">
                {s.t}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-6 text-sm">
                {s.items.map((i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">—</span> {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
