import type { Metadata } from "next";
import { ReportForm } from "@/components/forms/ReportForm";
import { Eyebrow, Stamp } from "@/components/ui";

export const metadata: Metadata = {
  title: "समस्या बताएं",
  description: "Sadak, naali, kachra, avaidh nirmaan ya rishwat — photo ke saath report bhejo. Har report on record.",
};

const STEPS = [
  { title: "आप बताइए", text: "Photo aur detail ke saath form bhariye. Aapko ek reference number milega." },
  { title: "हम जाँचेंगे", text: "NAYAK team ground par jaakar ya documents se verify karegi." },
  { title: "आवाज़ उठाएंगे", text: "Sahi vibhaag tak baat pahunchayenge aur follow-up public rakhenge." },
];

export default function ReportPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Eyebrow>Report a problem</Eyebrow>
        <h1 className="mt-2 font-display text-6xl font-semibold leading-none text-navy sm:text-7xl">समस्या बताएं</h1>
        <p className="mt-4 text-xl leading-relaxed text-ink/85">
          Sadak, naali, kachra, avaidh nirmaan ya bhrashtachar — jo bhi dikhe, photo ke saath bhejiye.
        </p>
        <ol className="mt-8 space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="font-display text-4xl leading-none text-red">0{i + 1}</span>
              <span>
                <span className="block font-display text-3xl leading-none text-navy">{s.title}</span>
                <span className="mt-1 block text-[16px] text-ink/80">{s.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <Stamp className="mt-8">Har report on record</Stamp>
      </div>
      <div className="rounded-xl border border-navy/15 bg-paper-light/80 p-5 shadow-sm sm:p-8">
        <ReportForm />
      </div>
    </section>
  );
}
