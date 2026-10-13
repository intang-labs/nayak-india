import type { Metadata } from "next";
import Image from "next/image";
import { JoinForm } from "@/components/forms/JoinForm";
import { Eyebrow, Stamp } from "@/components/ui";

export const metadata: Metadata = {
  title: "NAYAK से जुड़ें",
  description: "2 minute ka form bharo aur NAYAK ke saath Kota ke liye kaam karo.",
};

export default function JoinPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Eyebrow>Join the movement</Eyebrow>
        <h1 className="mt-2 font-display text-6xl font-semibold leading-none text-navy sm:text-7xl">NAYAK से जुड़ें</h1>
        <p className="mt-4 text-xl leading-relaxed text-ink/85">
          2 minute ka form. Hum aapko WhatsApp ya call par contact karenge aur agle action mein saath le chalenge.
        </p>
        <ul className="mt-6 space-y-2 text-lg text-ink/85">
          <li>✔ Ground operations aur public meetings mein hissa</li>
          <li>✔ Apne ward ki problems ki awaaz</li>
          <li>✔ Apni skills se Kota ke liye kaam</li>
        </ul>
        <div className="mt-8 hidden items-center gap-4 lg:flex">
          <Image src="/images/seal-256.png" alt="" width={256} height={256} className="h-24 w-24" />
          <Stamp>Koi party nahi</Stamp>
        </div>
      </div>
      <div className="rounded-xl border border-navy/15 bg-paper-light/80 p-5 shadow-sm sm:p-8">
        <JoinForm />
      </div>
    </section>
  );
}
