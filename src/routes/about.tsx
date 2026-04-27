import { createFileRoute } from "@tanstack/react-router";
import { useGsap } from "@/lib/useGsap";
import { gsap } from "gsap";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Apex Studio" },
      {
        name: "description",
        content: "Apex is a small senior studio focused on craft, restraint and impact. Meet the team and our principles.",
      },
      { property: "og:title", content: "About — Apex Studio" },
      { property: "og:description", content: "A small senior studio focused on craft, restraint and impact." },
    ],
  }),
  component: AboutPage,
});

const principles = [
  { n: "01", t: "Craft over volume", d: "We take fewer projects so the ones we do are our best." },
  { n: "02", t: "Restraint by default", d: "Stripping away noise until only intent remains." },
  { n: "03", t: "Senior throughout", d: "Every Apex project is led and executed by senior practitioners." },
  { n: "04", t: "Built to last", d: "Decisions that hold up years after launch." },
];

const team = [
  { name: "Mara Chen", role: "Founder · Creative Director" },
  { name: "Idris Wolfe", role: "Design Lead" },
  { name: "Sora Petrov", role: "Engineering Lead" },
  { name: "Nia Okafor", role: "Brand Strategist" },
];

function AboutPage() {
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
            ● About Apex
          </p>
          <h1 className="reveal mt-6 max-w-4xl font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            A studio that treats every project like it&apos;s the only one.
          </h1>
          <p className="reveal mt-8 max-w-2xl text-lg text-muted-foreground">
            We started Apex in 2014 with a simple bet: that small, senior teams produce
            better work than large agencies. A decade in, that bet has paid off — for
            us and for the leaders we work with.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-primary">
              ● Principles
            </p>
            <h2 className="reveal mt-6 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              How we work.
            </h2>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.n} className="reveal bg-background p-8">
                <p className="font-mono text-xs text-primary">{p.n}</p>
                <h3 className="mt-6 font-display text-xl font-semibold">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-primary">
              ● Team
            </p>
            <h2 className="reveal mt-6 font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Senior, every seat.
            </h2>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {team.map((m) => (
              <div key={m.name} className="reveal bg-background p-8">
                <div className="aspect-square rounded-lg bg-gradient-brand opacity-80 elegant-shadow" />
                <p className="mt-6 font-display text-xl font-semibold">{m.name}</p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {m.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
