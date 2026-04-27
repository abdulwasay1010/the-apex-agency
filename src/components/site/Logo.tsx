import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center">
        <span className="absolute inset-0 rounded-md bg-gradient-brand opacity-90 transition-opacity group-hover:opacity-100" />
        <span className="absolute inset-[1px] rounded-[5px] bg-background" />
        <svg
          viewBox="0 0 24 24"
          className="relative h-4 w-4 text-primary"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3 L21 20 H3 Z" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-tight">
        Apex<span className="text-primary">.</span>
      </span>
    </Link>
  );
}
