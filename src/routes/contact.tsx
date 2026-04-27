import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useGsap } from "@/lib/useGsap";
import { gsap } from "gsap";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Apex Studio" },
      {
        name: "description",
        content: "Have something extraordinary in mind? Tell us about your project and we'll get back within two business days.",
      },
      { property: "og:title", content: "Contact — Apex Studio" },
      { property: "og:description", content: "Tell us about your project. We reply within two business days." },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().max(150).optional(),
  message: z.string().trim().min(10, "Tell us a bit more (10+ chars)").max(2000),
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const root = useGsap<HTMLDivElement>((_, el) => {
    gsap.from(el.querySelectorAll(".reveal"), {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.06,
      ease: "power3.out",
    });
  });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? "") || undefined,
      message: String(fd.get("message") ?? ""),
    };
    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      company: parsed.data.company ?? null,
      message: parsed.data.message,
    });
    setLoading(false);

    if (error) {
      toast.error("Couldn't send your message. Please try again.");
      return;
    }
    setSent(true);
    toast.success("Message received. We'll be in touch soon.");
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div ref={root}>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0 opacity-30" />
        <div className="absolute inset-0 bg-gradient-radial" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16 md:pt-32 md:pb-20">
          <p className="reveal font-mono text-xs uppercase tracking-[0.3em] text-primary">
            ● Contact
          </p>
          <h1 className="reveal mt-6 max-w-3xl font-display text-5xl font-semibold tracking-tight md:text-7xl">
            Let&apos;s build something <span className="text-gradient">unforgettable.</span>
          </h1>
          <p className="reveal mt-6 max-w-xl text-lg text-muted-foreground">
            Tell us about your project. We typically reply within two business days.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:grid-cols-[2fr_1fr]">
        <form onSubmit={onSubmit} className="reveal space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Name" name="name" required placeholder="Jane Cole" />
            <Field label="Email" name="email" type="email" required placeholder="jane@studio.com" />
          </div>
          <Field label="Company" name="company" placeholder="Optional" />
          <div>
            <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Project brief
            </label>
            <textarea
              name="message"
              required
              rows={6}
              maxLength={2000}
              placeholder="A few sentences about your project, timeline and budget…"
              className="mt-2 w-full resize-none rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            disabled={loading || sent}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-60 glow-shadow"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending…
              </>
            ) : sent ? (
              "Message sent ✓"
            ) : (
              <>
                Send message
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>
        </form>

        <aside className="reveal space-y-10">
          <Block label="Email">hello@apex.studio</Block>
          <Block label="Phone">+1 (415) 555-0142</Block>
          <Block label="Studio">San Francisco · Remote worldwide</Block>
          <Block label="Hours">Mon — Fri · 9am to 6pm PT</Block>
        </aside>
      </section>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-border bg-input px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-l border-primary/60 pl-4">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 text-base">{children}</p>
    </div>
  );
}
