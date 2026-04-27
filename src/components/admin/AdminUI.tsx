import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  action,
  back,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  back?: { to: string; label: string };
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {back && (
          <Link
            to={back.to}
            className="mb-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3 w-3" /> {back.label}
          </Link>
        )}
        <h1 className="font-display text-4xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </header>
  );
}

export function AdminInput({
  label,
  name,
  required,
  type = "text",
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-border bg-input px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  name,
  required,
  rows = 4,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  rows?: number;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <textarea
        name={name}
        required={required}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-lg border border-border bg-input px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </label>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-border bg-input text-primary focus:ring-primary"
      />
      {label}
    </label>
  );
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/30 p-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}
