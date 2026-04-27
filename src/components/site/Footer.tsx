import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-border">
      <div className="gradient-divider absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Apex is a digital studio crafting precise brands, products and platforms for ambitious teams.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Studio
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/work" className="hover:text-primary">Work</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>hello@apex.studio</li>
            <li>+1 (415) 555-0142</li>
            <li>San Francisco · Remote</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Apex Studio. All rights reserved.</p>
          <p className="font-mono">v1.0 · Built with precision</p>
        </div>
      </div>
    </footer>
  );
}
