"use client";

import Script from "next/script";
import { useEffect } from "react";
import type { InstagramPost } from "./Instagram";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function permalink(url: string) {
  const clean = url.split("?")[0].replace(/\/?$/, "/");
  return `${clean}?utm_source=ig_embed&utm_campaign=loading`;
}

export function InstagramEmbeds({ posts }: { posts: InstagramPost[] }) {
  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, [posts]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <figure key={post.id} className="flex flex-col">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={permalink(post.url)}
              data-instgrm-version="14"
              style={{ background: "#FFF", border: 0, borderRadius: 8, margin: 0, minWidth: 260, width: "100%" }}
            >
              <a href={post.url} target="_blank" rel="noopener noreferrer" className="block p-6 text-center text-navy">
                Instagram par dekhein
              </a>
            </blockquote>
            {post.caption ? <figcaption className="mt-2 text-[15px] text-muted">{post.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
      <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" onLoad={() => window.instgrm?.Embeds.process()} />
    </>
  );
}
