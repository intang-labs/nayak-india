import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nayak-india.vercel.app"),
  title: {
    default: "NAYAK — कोटा को सर्वश्रेष्ठ बनाने का संकल्प",
    template: "%s · NAYAK",
  },
  description:
    "NAYAK (NavBharat Association of Young, Accountable Karyakartas) — Kota ka anti-corruption, pro-democracy youth movement. Sawaal, samadhan aur sab kuch on record.",
  openGraph: {
    type: "website",
    locale: "hi_IN",
    siteName: "NAYAK",
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "NAYAK — Kota ko sarvashreshth banane ka sankalp" }],
  },
  twitter: { card: "summary_large_image", images: ["/images/og.jpg"] },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="hi" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-paper-light"
        >
          Seedha content par jaayein
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
