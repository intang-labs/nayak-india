"use client";

import type { ReactNode } from "react";

export function FieldLabel({
  htmlFor,
  title,
  hint,
  required,
}: {
  htmlFor?: string;
  title: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-lg font-bold text-navy">
        {title}
        {required ? <span className="text-red"> *</span> : null}
      </span>
      {hint ? <span className="mt-0.5 block text-[15px] text-muted">{hint}</span> : null}
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[15px] font-semibold text-red" role="alert">
      {message}
    </p>
  );
}

export const inputClass =
  "mt-2 w-full rounded-md border border-navy/25 bg-white/80 px-3.5 py-3 text-lg text-ink placeholder:text-muted/60 focus:border-navy focus:outline-none focus:ring-2 focus:ring-gold/60";

export function Fieldset({
  legend,
  hint,
  required,
  error,
  errorId,
  children,
}: {
  legend: string;
  hint?: string;
  required?: boolean;
  error?: string;
  errorId: string;
  children: ReactNode;
}) {
  return (
    <fieldset aria-describedby={error ? errorId : undefined}>
      <legend className="block">
        <span className="text-lg font-bold text-navy">
          {legend}
          {required ? <span className="text-red"> *</span> : null}
        </span>
        {hint ? <span className="mt-0.5 block text-[15px] text-muted">{hint}</span> : null}
      </legend>
      <div className="mt-3 grid gap-2">{children}</div>
      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}

export function ChoiceRow({
  type,
  name,
  value,
  checked,
  onChange,
  label,
}: {
  type: "checkbox" | "radio";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-md border px-3.5 py-3 text-[17px] transition-colors ${
        checked ? "border-navy bg-navy/[0.06] text-navy" : "border-navy/15 bg-white/60 text-ink hover:border-navy/40"
      }`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 shrink-0 accent-[#15284a]"
      />
      <span>{label}</span>
    </label>
  );
}

export function SubmitButton({ busy, children }: { busy: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="inline-flex w-full items-center justify-center rounded-md bg-red px-6 py-3.5 text-xl font-bold text-paper-light shadow-sm transition-colors hover:bg-red-dark disabled:cursor-wait disabled:opacity-70 sm:w-auto"
    >
      {children}
    </button>
  );
}

/** Hidden field that only bots fill in. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Company website
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}
