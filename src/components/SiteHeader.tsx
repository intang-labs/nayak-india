import Image from "next/image";
import Link from "next/link";

const NAV = [
  { href: "/about", label: "हमारे बारे में" },
  { href: "/#instagram", label: "Instagram" },
  { href: "/report", label: "समस्या बताएं" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy/15 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label="NAYAK home">
          <Image src="/images/seal-256.png" alt="" width={44} height={44} className="h-11 w-11" priority />
          <span className="flex flex-col leading-none">
            <span className="font-display text-3xl font-semibold tracking-wide text-navy">NAYAK</span>
            <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-navy-soft sm:block">
              Young · Accountable · Karyakartas
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-[17px] font-semibold text-navy hover:bg-navy/5"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/join"
            className="ml-2 rounded-md bg-red px-5 py-2 text-[17px] font-bold text-paper-light shadow-sm hover:bg-red-dark"
          >
            जुड़ें
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Link href="/join" className="rounded-md bg-red px-4 py-1.5 font-bold text-paper-light">
            जुड़ें
          </Link>
          <details className="group relative">
            <summary
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-navy/25 text-navy [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </summary>
            <div className="absolute right-0 top-12 w-56 rounded-lg border border-navy/15 bg-paper-light p-2 shadow-xl">
              <Link href="/" className="block rounded px-3 py-2.5 text-lg font-semibold text-navy hover:bg-navy/5">
                होम
              </Link>
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded px-3 py-2.5 text-lg font-semibold text-navy hover:bg-navy/5"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
