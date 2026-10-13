import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { InstagramShowcase } from "@/components/Instagram";
import { ButtonLink, Eyebrow, SectionTitle, Stamp } from "@/components/ui";
import { LONG_TERM_GOALS, SHORT_TERM_GOALS, SITE, VALUES, WHAT_WE_DO } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20 lg:pt-16">
          <div>
            <Stamp>{SITE.hashtag}</Stamp>
            <h1 className="mt-5 font-display text-[3.4rem] font-semibold leading-[0.95] text-navy sm:text-7xl lg:text-[5.4rem]">
              कोटा को <span className="text-red">सर्वश्रेष्ठ</span> बनाने का संकल्प
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-ink/85">
              Hum Kota ke young log hain. Sawaal poochte hain, ground pe jaate hain, aur har kaam on record rakhte hain.
              Shikayat nahi — <strong className="text-navy">samadhan ki baat.</strong>
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/join">NAYAK से जुड़ें</ButtonLink>
              <ButtonLink href="/report" variant="outline">
                समस्या बताएं
              </ButtonLink>
            </div>
            <p className="mt-5 text-[15px] font-semibold text-navy-soft">
              Koi political party nahi — Kota ka youth sangathan.
            </p>
          </div>

          <div className="relative mx-auto h-[360px] w-full max-w-[520px] sm:h-[460px]" aria-hidden="true">
            <Image
              src="/images/photo-meeting.webp"
              alt=""
              width={505}
              height={468}
              priority
              className="absolute left-0 top-4 w-[60%] drop-shadow-xl"
            />
            <Image
              src="/images/photo-heritage.webp"
              alt=""
              width={407}
              height={470}
              className="absolute right-0 top-0 w-[44%]"
            />
            <Image
              src="/images/photo-field.webp"
              alt=""
              width={399}
              height={477}
              className="absolute bottom-0 right-[8%] w-[42%]"
            />
            <Image
              src="/images/photo-crowd.webp"
              alt=""
              width={460}
              height={364}
              className="absolute bottom-2 left-[4%] w-[50%]"
            />
            <Image
              src="/images/seal-256.png"
              alt=""
              width={256}
              height={256}
              className="absolute left-1/2 top-1/2 w-28 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg sm:w-32"
            />
          </div>
        </div>
      </section>

      {/* Values band */}
      <section aria-label="हमारे मूल्य" className="bg-navy text-paper-light">
        <ul className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-5 font-display text-3xl tracking-wide sm:text-4xl">
          {VALUES.map((v, i) => (
            <li key={v.title} className="flex items-center gap-6">
              {i > 0 ? (
                <span className="hidden text-gold lg:inline" aria-hidden="true">
                  |
                </span>
              ) : null}
              {v.title}
            </li>
          ))}
        </ul>
      </section>

      {/* What we do */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <Eyebrow>Hamara kaam</Eyebrow>
        <SectionTitle className="mt-2">हम क्या करते हैं</SectionTitle>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {WHAT_WE_DO.map((item, i) => (
            <article key={item.title} className="border-l-[6px] border-red bg-paper-light/80 p-6 shadow-sm">
              <p className="font-display text-5xl leading-none text-red/90">0{i + 1}</p>
              <h3 className="mt-3 font-display text-4xl leading-none text-navy">{item.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Vision teaser */}
      <section className="border-y border-navy/10 bg-paper-light/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>Manthan 2026 vision</Eyebrow>
              <SectionTitle className="mt-2">हमारा विज़न</SectionTitle>
              <p className="mt-3 max-w-2xl text-lg text-ink/80">
                Kota sirf padhne aur rehne ka sheher nahi — rozgaar, udyamita aur behtar zindagi ka kendra bane.
              </p>
            </div>
            <Link href="/about#vision" className="text-lg font-bold text-red underline decoration-2 underline-offset-4">
              पूरा विज़न देखें →
            </Link>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <GoalList title="अभी के 5 अभियान" tone="navy" goals={SHORT_TERM_GOALS} />
            <GoalList title="आगे की 5 योजनाएं" tone="red" goals={LONG_TERM_GOALS} />
          </div>
        </div>
      </section>

      {/* Report CTA */}
      <section className="bg-red text-paper-light">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-5xl leading-none sm:text-6xl">आपके इलाके में कोई समस्या?</h2>
            <p className="mt-3 max-w-2xl text-lg text-paper-light/90">
              Sadak, naali, kachra, avaidh nirmaan ya rishwat — photo kheecho, form bharo. Hum verify karke aage le
              jaayenge, aur aapki report on record rahegi.
            </p>
          </div>
          <ButtonLink href="/report" variant="paper">
            समस्या बताएं
          </ButtonLink>
        </div>
      </section>

      {/* Instagram */}
      <section id="instagram" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 lg:py-20">
        <Eyebrow>@{SITE.instagramHandle}</Eyebrow>
        <SectionTitle className="mt-2">Instagram पर NAYAK</SectionTitle>
        <p className="mt-3 max-w-2xl text-lg text-ink/80">
          Ground se seedhi updates — operations, public meetings aur Manthan.
        </p>
        <div className="mt-10">
          <Suspense fallback={<p className="text-muted">Posts load ho rahe hain…</p>}>
            <InstagramShowcase />
          </Suspense>
        </div>
      </section>

      {/* Join CTA */}
      <section className="relative overflow-hidden bg-navy text-paper-light">
        <Image
          src="/images/seal.png"
          alt=""
          width={512}
          height={512}
          className="pointer-events-none absolute -right-24 -top-16 w-[420px] opacity-[0.08]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="max-w-3xl font-display text-5xl leading-[1.02] sm:text-6xl">
            बदलाव देखने से नहीं, <span className="text-gold">करने से</span> आता है
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-paper-light/85">
            2 minute ka form bharo. Hum WhatsApp pe contact karenge aur agle action mein saath le chalenge.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/join">NAYAK से जुड़ें</ButtonLink>
            {SITE.whatsappGroupUrl ? (
              <a
                href={SITE.whatsappGroupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md border-2 border-paper-light/70 px-6 py-3 text-lg font-bold hover:bg-paper-light hover:text-navy"
              >
                WhatsApp group join karein
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

function GoalList({
  title,
  tone,
  goals,
}: {
  title: string;
  tone: "navy" | "red";
  goals: { name: string; hindi: string }[];
}) {
  const head = tone === "navy" ? "bg-navy text-paper-light" : "bg-red text-paper-light";
  const num = tone === "navy" ? "text-navy" : "text-red";
  return (
    <div>
      <h3 className={`inline-block px-4 py-1 font-display text-3xl ${head}`}>{title}</h3>
      <ol className="mt-4 divide-y divide-navy/10 border-y border-navy/10">
        {goals.map((g, i) => (
          <li key={g.name} className="flex items-baseline gap-4 py-3">
            <span className={`w-9 shrink-0 font-display text-3xl ${num}`}>0{i + 1}</span>
            <span>
              <span className="block text-lg font-bold text-navy">{g.name}</span>
              <span className="block text-[15px] text-muted">{g.hindi}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
