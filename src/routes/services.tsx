import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useGsap } from "@/lib/useGsap";
import { gsap } from "gsap";
import { supabase } from "@/integrations/supabase/client";

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

type ServiceRow = {
  id: string;
  number: string;
  title: string;
  description: string;
  items: string[];
};

function ServicesPage() {
  const [services, setServices] = useState<ServiceRow[]>([]);

  useEffect(() => {
    void supabase
      .from("services")
      .select("id, number, title, description, items")
      .eq("published", true)
      .order("sort_order", { ascending: true })
      .then(({ data }) => setServices((data ?? []) as ServiceRow[]));
  }, []);

  const root = useGsap<HTMLDivElement>((_, el) => {
    gsap.from(el.querySelectorAll(".reveal"), {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
    });
  }, [services.length]);

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
              key={s.id}
              className="reveal group bg-background p-10 transition-colors hover:bg-card"
            >
              <div className="flex items-start justify-between">
                <p className="font-mono text-xs text-primary">{s.number}</p>
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Service
                </span>
              </div>
              <h2 className="mt-8 font-display text-3xl font-semibold tracking-tight">
                {s.title}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-6 text-sm">
                {(s.items ?? []).map((i) => (
                  <li key={i} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-primary">—</span> {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          {services.length === 0 && (
            <div className="bg-background p-10 text-sm text-muted-foreground">
              No services yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
