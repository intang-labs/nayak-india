"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { PanelMessage } from "./shared";

type Post = { id: string; url: string; caption: string | null; sort_order: number; is_visible: boolean };
const URL_PATTERN = /^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?$/;

function cleanUrl(raw: string) {
  const trimmed = raw.trim().split("?")[0];
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

export function InstagramPanel() {
  const supabase = getBrowserSupabase();
  const [rows, setRows] = useState<Post[] | null>(null);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("instagram_posts")
      .select("id,url,caption,sort_order,is_visible")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setRows(data as Post[]);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    load();
  }, [load]);

  async function add(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const clean = cleanUrl(url);
    if (!URL_PATTERN.test(clean)) {
      setError("Instagram post ya reel ka link daaliye, jaise https://www.instagram.com/reel/ABC123/");
      return;
    }
    const { error } = await supabase.from("instagram_posts").insert({ url: clean, caption: caption.trim() || null });
    if (error) {
      setError(error.message.includes("duplicate") ? "Ye post pehle se list mein hai." : error.message);
      return;
    }
    setUrl("");
    setCaption("");
    load();
  }

  async function patch(id: string, values: Partial<Post>) {
    const { error } = await supabase.from("instagram_posts").update(values).eq("id", id);
    if (error) setError(error.message);
    else setRows((r) => r?.map((p) => (p.id === id ? { ...p, ...values } : p)) ?? null);
  }

  async function remove(id: string) {
    const { error } = await supabase.from("instagram_posts").delete().eq("id", id);
    if (error) setError(error.message);
    else setRows((r) => r?.filter((p) => p.id !== id) ?? null);
    setConfirmId(null);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="rounded-lg border border-navy/15 bg-paper-light p-4 sm:p-5">
        <p className="text-lg font-bold text-navy">Naya post jodein</p>
        <p className="text-[15px] text-muted">
          Instagram par post/reel kholo → Share → Copy link → yahan paste karo. Website par 1–2 minute mein dikhega.
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-[2fr_1.5fr_auto]">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/reel/…"
            className="rounded-md border border-navy/25 bg-white/80 px-3 py-2"
            aria-label="Instagram link"
            required
          />
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Chhota caption (optional)"
            maxLength={200}
            className="rounded-md border border-navy/25 bg-white/80 px-3 py-2"
            aria-label="Caption"
          />
          <button type="submit" className="rounded-md bg-red px-5 py-2 font-bold text-paper-light">
            Jodein
          </button>
        </div>
        {error ? <p className="mt-2 font-semibold text-red">{error}</p> : null}
      </form>

      {rows === null ? <PanelMessage>Load ho raha hai…</PanelMessage> : null}
      {rows?.length === 0 ? <PanelMessage>Abhi koi post nahi jodi gayi. Website par &quot;Follow karein&quot; card dikh raha hai.</PanelMessage> : null}
      {rows && rows.length > 0 ? (
        <ul className="divide-y divide-navy/10 rounded-lg border border-navy/15 bg-paper-light">
          {rows.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 p-4">
              <label className="flex items-center gap-2 text-[15px] font-semibold text-navy">
                Order
                <input
                  type="number"
                  defaultValue={p.sort_order}
                  onBlur={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isFinite(v) && v !== p.sort_order) patch(p.id, { sort_order: v });
                  }}
                  className="w-16 rounded-md border border-navy/25 bg-white px-2 py-1"
                />
              </label>
              <div className="min-w-0 flex-1">
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="block truncate font-semibold text-navy underline">
                  {p.url}
                </a>
                {p.caption ? <p className="text-[15px] text-muted">{p.caption}</p> : null}
              </div>
              <label className="flex items-center gap-2 text-[15px] font-semibold text-navy">
                <input type="checkbox" checked={p.is_visible} onChange={(e) => patch(p.id, { is_visible: e.target.checked })} className="h-5 w-5 accent-[#15284a]" />
                Website par dikhayein
              </label>
              {confirmId === p.id ? (
                <span className="flex gap-2">
                  <button onClick={() => remove(p.id)} className="rounded-md bg-red px-3 py-1.5 font-bold text-paper-light">
                    Haan, hatao
                  </button>
                  <button onClick={() => setConfirmId(null)} className="rounded-md border border-navy/30 px-3 py-1.5 font-semibold">
                    Nahi
                  </button>
                </span>
              ) : (
                <button onClick={() => setConfirmId(p.id)} className="rounded-md border border-red/40 px-3 py-1.5 font-semibold text-red">
                  Hatao
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
