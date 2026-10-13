import Link from "next/link";
import type { ReactNode } from "react";

export function Stamp({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block -rotate-3 rounded-md border-[3px] border-red px-3 py-0.5 font-display text-xl uppercase tracking-[0.12em] text-red mix-blend-multiply ${className}`}
    >
      {children}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-sm font-bold uppercase tracking-[0.18em] text-red ${className}`}>{children}</p>;
}

export function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-5xl font-semibold leading-[1.05] text-navy sm:text-6xl ${className}`}>{children}</h2>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "red",
}: {
  href: string;
  children: ReactNode;
  variant?: "red" | "navy" | "outline" | "paper";
}) {
  const styles = {
    red: "bg-red text-paper-light hover:bg-red-dark",
    navy: "bg-navy text-paper-light hover:bg-navy-deep",
    outline: "border-2 border-navy text-navy hover:bg-navy hover:text-paper-light",
    paper: "bg-paper-light text-navy hover:bg-white",
  }[variant];
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md px-6 py-3 text-lg font-bold shadow-sm transition-colors ${styles}`}
    >
      {children}
    </Link>
  );
}
