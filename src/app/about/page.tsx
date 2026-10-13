import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink, Eyebrow, SectionTitle, Stamp } from "@/components/ui";
import { LONG_TERM_GOALS, SHORT_TERM_GOALS, SITE, VALUES, VISION_POINTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "हमारे बारे में",
  description: "NAYAK kaun hai, kya maanta hai aur Kota ke liye vision kya hai.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-14 pt-12 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <Eyebrow>{SITE.fullName}</Eyebrow>
          <h1 className="mt-3 font-display text-6xl font-semibold leading-none text-navy sm:text-7xl">हम कौन हैं</h1>
          <div className="mt-6 max-w-2xl space-y-4 text-xl leading-relaxed text-ink/85">
            <p>
              NAYAK ek anti-corruption, pro-democracy youth movement hai. Hamara maqsad hai politics aur system ko saaf
              aur jawabdeh banana — shuruaat apni maatribhoomi Kota se.
            </p>
            <p>
              Hum koi political party nahi hain. Hum Kota ke aam log hain jo maante hain ki sawaal poochna har nagrik ka
              haq hai — aur jawab milna bhi.
            </p>
          </div>
        </div>
        <Image src="/images/seal.png" alt="NAYAK seal: torch with flame" width={512} height={512} className="mx-auto w-56 sm:w-72" priority />
      </section>

      <section className="bg-navy text-paper-light">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[auto_1fr] md:items-center">
          <Stamp className="border-gold text-gold mix-blend-normal">On record</Stamp>
          <div>
            <h2 className="font-display text-5xl leading-none">हर बात ऑन रिकॉर्ड</h2>
            <p className="mt-3 max-w-3xl text-lg text-paper-light/85">
              Har complaint, har visit, har jawab — hum sab record karte hain aur public ke saamne rakhte hain.
              Transparency hi hamari taakat hai. {SITE.hashtag}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Eyebrow>Hum kis cheez ke liye khade hain</Eyebrow>
        <SectionTitle className="mt-2">हमारे मूल्य</SectionTitle>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map((v) => (
            <article key={v.title} className="border-t-[6px] border-red bg-paper-light/80 p-5 shadow-sm">
              <h3 className="font-display text-3xl leading-none text-navy">{v.title}</h3>
              <p className="mt-2 text-[17px] leading-relaxed text-ink/80">{v.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="vision" className="scroll-mt-20 border-y border-navy/10 bg-paper-light/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Eyebrow>Manthan 2026 vision document</Eyebrow>
          <SectionTitle className="mt-2">हमारा विज़न</SectionTitle>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {VISION_POINTS.map((p, i) => (
              <li key={p} className="flex gap-4 border-l-[6px] border-red bg-paper-light p-5">
                <span className="font-display text-5xl leading-none text-red">0{i + 1}</span>
                <span className="text-lg font-semibold leading-snug text-navy">{p}</span>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-10 lg:grid-cols-2">
            <GoalColumn title="अल्पकालिक लक्ष्य" subtitle="Abhi shuru hone wale abhiyaan" tone="navy" goals={SHORT_TERM_GOALS} />
            <GoalColumn title="दीर्घकालिक लक्ष्य" subtitle="Kota ke bhavishya ki yojanayein" tone="red" goals={LONG_TERM_GOALS} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>10 October 2026 · Swarnkar Bhawan, Hadi Rani Circle</Eyebrow>
            <SectionTitle className="mt-2">मंथन 2026</SectionTitle>
            <p className="mt-4 text-lg leading-relaxed text-ink/85">
              Pehla public session jahan humne Kota ke saamne apna report card aur vision rakha — aur logon ki baat suni.
            </p>
            <p className="mt-3 font-display text-3xl text-red">“समस्याओं पर नहीं, समाधान पर बात”</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/join">NAYAK से जुड़ें</ButtonLink>
              <ButtonLink href="/report" variant="outline">
                समस्या बताएं
              </ButtonLink>
            </div>
          </div>
          <div className="relative mx-auto h-80 w-full max-w-md" aria-hidden="true">
            <Image src="/images/photo-meeting.webp" alt="" width={505} height={468} className="absolute left-0 top-0 w-[68%]" />
            <Image src="/images/photo-protest.webp" alt="" width={496} height={446} className="absolute bottom-0 right-0 w-[58%]" />
          </div>
        </div>
      </section>
    </>
  );
}

function GoalColumn({
  title,
  subtitle,
  tone,
  goals,
}: {
  title: string;
  subtitle: string;
  tone: "navy" | "red";
  goals: { name: string; hindi: string; goal: string }[];
}) {
  const card = tone === "navy" ? "border-navy" : "border-red";
  const num = tone === "navy" ? "text-navy" : "text-red";
  return (
    <div>
      <h3 className="font-display text-4xl leading-none text-navy">{title}</h3>
      <p className="text-muted">{subtitle}</p>
      <ol className="mt-5 space-y-3">
        {goals.map((g, i) => (
          <li key={g.name} className={`flex gap-4 border-l-[6px] ${card} bg-paper-light p-4 shadow-sm`}>
            <span className={`font-display text-4xl leading-none ${num}`}>0{i + 1}</span>
            <div>
              <p className="text-lg font-bold text-navy">{g.name}</p>
              <p className="font-semibold text-red">{g.hindi}</p>
              <p className="mt-1 text-[16px] text-ink/75">{g.goal}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
