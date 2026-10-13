import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import { SITE } from "@/lib/content";
import { createPublicSupabase } from "@/lib/supabase/public-server";
import { InstagramEmbeds } from "./InstagramEmbeds";

export type InstagramPost = { id: string; url: string; caption: string | null };

async function getInstagramPosts(): Promise<InstagramPost[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("instagram");
  try {
    const { data, error } = await createPublicSupabase()
      .from("instagram_posts")
      .select("id,url,caption")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(12);
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function InstagramShowcase() {
  const posts = await getInstagramPosts();

  if (posts.length === 0) {
    return (
      <div className="grid items-center gap-8 rounded-xl border border-navy/15 bg-paper-light/70 p-6 sm:p-8 md:grid-cols-[1fr_1.1fr]">
        <div className="relative mx-auto h-64 w-full max-w-sm">
          <Image src="/images/photo-protest.webp" alt="NAYAK karyakarta ek protest mein" width={496} height={446} className="absolute left-0 top-0 w-[62%]" />
          <Image src="/images/photo-field.webp" alt="NAYAK team ground par jaanch karte hue" width={399} height={477} className="absolute bottom-0 right-0 w-[48%]" />
        </div>
        <div>
          <p className="text-lg text-muted">
            Operations, public meetings, Manthan — sab updates seedhe Instagram par aate hain. Follow karo taaki koi
            update miss na ho.
          </p>
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-lg font-bold text-paper-light hover:bg-navy-deep"
          >
            @{SITE.instagramHandle} follow karein
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <InstagramEmbeds posts={posts} />
      <div className="mt-8 text-center">
        <a
          href={SITE.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-navy px-5 py-3 text-lg font-bold text-paper-light hover:bg-navy-deep"
        >
          Aur dekhein — @{SITE.instagramHandle}
        </a>
      </div>
    </div>
  );
}
