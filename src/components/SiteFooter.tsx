import Image from "next/image";
import Link from "next/link";
import { SITE, VALUES } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/images/seal-256.png" alt="NAYAK seal" width={64} height={64} className="h-16 w-16" />
            <div>
              <p className="font-display text-4xl leading-none text-paper-light">NAYAK</p>
              <p className="text-sm text-paper/75">{SITE.fullName}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-paper/85">
            Kota ka anti-corruption, pro-democracy youth movement. Koi political party nahi — ek youth sangathan.
          </p>
          <p className="mt-3 font-display text-2xl tracking-wide text-gold">{SITE.hashtag}</p>
        </div>

        <div>
          <p className="font-display text-2xl text-gold">पेज</p>
          <ul className="mt-2 space-y-1.5 text-paper/90">
            <li><Link className="hover:text-gold-light" href="/about">हमारे बारे में</Link></li>
            <li><Link className="hover:text-gold-light" href="/join">NAYAK से जुड़ें</Link></li>
            <li><Link className="hover:text-gold-light" href="/report">समस्या बताएं</Link></li>
            <li>
              <a className="hover:text-gold-light" href={SITE.instagramUrl} target="_blank" rel="noopener noreferrer">
                Instagram @{SITE.instagramHandle}
              </a>
            </li>
            {SITE.whatsappGroupUrl ? (
              <li>
                <a className="hover:text-gold-light" href={SITE.whatsappGroupUrl} target="_blank" rel="noopener noreferrer">
                  WhatsApp group
                </a>
              </li>
            ) : null}
          </ul>
        </div>

        <div>
          <p className="font-display text-2xl text-gold">हमारे मूल्य</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {VALUES.map((v) => (
              <li key={v.title} className="rounded-full border border-paper/25 px-3 py-0.5 text-sm text-paper/90">
                {v.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-paper/10">
        <p className="mx-auto max-w-6xl px-4 py-4 text-sm text-paper/60 sm:px-6">
          © 2026 NAYAK, Kota · संवाद | समाधान | सहभागिता
        </p>
      </div>
    </footer>
  );
}
