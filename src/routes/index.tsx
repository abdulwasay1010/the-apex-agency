import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useGsap } from "@/lib/useGsap";
import { gsap } from "gsap";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apex — Digital Studio for Ambitious Brands" },
      {
        name: "description",
        content:
          "Apex is a sleek digital studio designing brands, products and platforms for teams that refuse to settle.",
      },
      { property: "og:title", content: "Apex — Digital Studio" },
      {
        property: "og:description",
        content: "Brands, products and platforms designed with precision.",
      },
    ],
  }),
  component: HomePage,
});

const stats = [
  { value: "120+", label: "Projects shipped" },
  { value: "48", label: "Active clients" },
  { value: "12yr", label: "In the craft" },
  { value: "9", label: "Awards" },
];

type ServicePreview = { id: string; number: string; title: string; description: string };

const clients = ["NORTHWIND", "VANTA", "AURIC", "MERIDIAN", "HALCYON", "OBSCURA"];

function HomePage() {
  const [services, setServices] = useState<ServicePreview[]>([]);

  useEffect(() => {
    void supabase
      .from("services")
      .select("id, number, title, description")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .limit(4)
      .then(({ data }) => setServices((data ?? []) as ServicePreview[]));
  }, []);

  const root = useGsap<HTMLDivElement>((_, el) => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(el.querySelectorAll(".hero-line"), {
      yPercent: 110,
      duration: 1,
      stagger: 0.08,
    })
      .from(
        el.querySelector(".hero-eyebrow"),
        { opacity: 0, y: 20, duration: 0.6 },
        "-=0.7"
      )
      .from(
        el.querySelector(".hero-sub"),
        { opacity: 0, y: 20, duration: 0.7 },
        "-=0.5"
      )
      .from(
        el.querySelector(".hero-cta"),
        { opacity: 0, y: 20, duration: 0.5 },
        "-=0.4"
      )
      .from(
        el.querySelectorAll(".stat"),
        { opacity: 0, y: 30, duration: 0.6, stagger: 0.08 },
        "-=0.2"
      );

    // Marquee
    const marquee = el.querySelector(".marquee-track");
    if (marquee) {
      gsap.to(marquee, {
        xPercent: -50,
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }

    // Service cards on enter
    gsap.from(el.querySelectorAll(".svc-card"), {
      opacity: 0,
      y: 60,
      duration: 0.8,
      stagger: 0.1,
      scrollTrigger: { trigger: el.querySelector("#services"), start: "top 75%" },
    });

    gsap.from(el.querySelectorAll(".cta-reveal"), {
      opacity: 0,
      y: 40,
      duration: 1,
      scrollTrigger: { trigger: el.querySelector("#cta"), start: "top 80%" },
    });
  });

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="grid-bg absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-24 md:pt-44 md:pb-32">
          <p className="hero-eyebrow font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">●</span> Digital studio · Est. 2014
          </p>
          <h1 className="mt-8 font-display text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl lg:text-[8rem]">
            <span className="block overflow-hidden">
              <span className="hero-line block">Designed for</span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-line block text-gradient">the relentless.</span>
            </span>
          </h1>
          <p className="hero-sub mt-8 max-w-xl text-lg text-muted-foreground md:text-xl">
            Apex is a small studio of designers and engineers building precise brands,
            products and platforms for teams that refuse to settle for ordinary.
          </p>
          <div className="hero-cta mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 glow-shadow"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-primary/60"
            >
              See work
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-24 grid grid-cols-2 gap-8 border-t border-border pt-10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="stat">
                <p className="font-display text-3xl font-semibold md:text-4xl">{s.value}</p>
                <p className="mt-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-border bg-card/30 py-8 overflow-hidden">
        <div className="marquee-track flex w-max gap-16 whitespace-nowrap font-mono text-sm uppercase tracking-[0.3em] text-muted-foreground">
          {[...clients, ...clients, ...clients, ...clients].map((c, i) => (
            <span key={i} className="flex items-center gap-16">
              {c}
              <span className="text-primary">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-32">
        <div className="grid gap-12 md:grid-cols-[1fr_2fr]">
          <div className="md:sticky md:top-32 md:self-start">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              ● What we do
            </p>
            <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              A focused set of capabilities, executed at the highest level.
            </h2>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.id}
                className="svc-card group relative bg-background p-8 transition-colors hover:bg-card"
              >
                <p className="font-mono text-xs text-primary">{s.number}</p>
                <h3 className="mt-6 font-display text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
                <ArrowUpRight className="absolute right-6 top-6 h-4 w-4 text-muted-foreground transition-all group-hover:text-primary group-hover:-translate-y-1 group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-7xl px-6 pb-16">
        <div className="cta-reveal relative overflow-hidden rounded-2xl border border-border bg-card p-12 md:p-20">
          <div className="absolute inset-0 bg-gradient-radial opacity-60" />
          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              ● Available for new work
            </p>
            <h2 className="mt-6 max-w-2xl font-display text-4xl font-semibold tracking-tight md:text-6xl">
              Have something <span className="text-gradient">extraordinary</span> in mind?
            </h2>
            <Link
              to="/contact"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90"
            >
              Let&apos;s talk
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
