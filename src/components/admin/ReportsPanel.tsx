"use client";

/* eslint-disable @next/next/no-img-element -- signed private photo URLs */
import { useCallback, useEffect, useState } from "react";
import { REPORT_CATEGORIES, REPORT_STATUSES, labelFor } from "@/lib/content";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { REPORT_PHOTO_BUCKET } from "@/lib/supabase/config";
import { PanelMessage, downloadCsv, formatDate, selectClass, toCsv, waLink } from "./shared";

type Report = {
  id: string;
  ref_code: string;
  created_at: string;
  name: string | null;
  phone: string;
  area: string;
  landmark: string | null;
  category: string;
  description: string;
  photo_paths: string[];
  status: string;
  admin_notes: string | null;
};

export function ReportsPanel() {
  const supabase = getBrowserSupabase();
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState<Report[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    let q = supabase.from("reports").select("*").order("created_at", { ascending: false }).limit(300);
    if (status !== "all") q = q.eq("status", status);
    const { data, error } = await q;
    if (error) setError(error.message);
    else setRows(data as Report[]);
  }, [status, supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on filter change
    load();
  }, [load]);

  async function update(id: string, patch: Partial<Report>) {
    const { error } = await supabase.from("reports").update(patch).eq("id", id);
    if (error) {
      setError(error.message);
      return false;
    }
    setRows((r) => r?.map((x) => (x.id === id ? { ...x, ...patch } : x)) ?? null);
    return true;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 font-semibold text-navy">
          Status
          <select className={selectClass} value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">Sab</option>
            {REPORT_STATUSES.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button onClick={load} className="rounded-md border border-navy/30 px-3 py-1.5 font-semibold text-navy hover:bg-navy/5">
          Refresh
        </button>
        {rows && rows.length > 0 ? (
          <button
            onClick={() => downloadCsv(`nayak-reports-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows))}
            className="rounded-md border border-navy/30 px-3 py-1.5 font-semibold text-navy hover:bg-navy/5"
          >
            CSV download
          </button>
        ) : null}
        {rows ? <span className="text-muted">{rows.length} reports</span> : null}
      </div>
      {error ? <p className="mt-3 font-semibold text-red">{error}</p> : null}
      <div className="mt-5 space-y-4">
        {rows === null ? <PanelMessage>Load ho raha hai…</PanelMessage> : null}
        {rows?.length === 0 ? <PanelMessage>Abhi koi report nahi hai.</PanelMessage> : null}
        {rows?.map((r) => <ReportCard key={r.id} report={r} onUpdate={update} />)}
      </div>
    </div>
  );
}

function ReportCard({ report: r, onUpdate }: { report: Report; onUpdate: (id: string, patch: Partial<Report>) => Promise<boolean> }) {
  const supabase = getBrowserSupabase();
  const [notes, setNotes] = useState(r.admin_notes ?? "");
  const [saved, setSaved] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[] | null>(null);

  async function showPhotos() {
    const { data } = await supabase.storage.from(REPORT_PHOTO_BUCKET).createSignedUrls(r.photo_paths, 3600);
    setPhotoUrls((data ?? []).map((d) => d.signedUrl).filter(Boolean) as string[]);
  }

  return (
    <article className="rounded-lg border border-navy/15 bg-paper-light p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-3xl leading-none text-red">{r.ref_code}</p>
          <p className="mt-1 text-[15px] text-muted">
            {formatDate(r.created_at)} · <b className="text-navy">{labelFor(REPORT_CATEGORIES, r.category)}</b>
          </p>
        </div>
        <select
          className={selectClass}
          value={r.status}
          onChange={(e) => onUpdate(r.id, { status: e.target.value })}
          aria-label={`${r.ref_code} status`}
        >
          {REPORT_STATUSES.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 font-semibold text-navy">
        {r.area}
        {r.landmark ? <span className="font-normal text-muted"> · {r.landmark}</span> : null}
      </p>
      <p className="mt-2 whitespace-pre-wrap text-[17px] text-ink">{r.description}</p>
      <p className="mt-3 text-[15px] text-ink/80">
        {r.name ? `${r.name} · ` : ""}
        <a className="font-semibold text-navy underline" href={`tel:${r.phone}`}>
          {r.phone}
        </a>{" "}
        ·{" "}
        <a className="font-semibold text-navy underline" href={waLink(r.phone)} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
      </p>
      {r.photo_paths.length > 0 ? (
        photoUrls ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {photoUrls.map((u, i) => (
              <a key={u} href={u} target="_blank" rel="noopener noreferrer">
                <img src={u} alt={`${r.ref_code} photo ${i + 1}`} className="h-28 w-28 rounded-md object-cover" />
              </a>
            ))}
          </div>
        ) : (
          <button onClick={showPhotos} className="mt-3 rounded-md border border-navy/30 px-3 py-1.5 text-[15px] font-semibold text-navy hover:bg-navy/5">
            {r.photo_paths.length} photo dekhein
          </button>
        )
      ) : null}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start">
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSaved(false);
          }}
          placeholder="Team notes (sirf admins dekhenge)"
          className="w-full rounded-md border border-navy/25 bg-white/80 px-3 py-2 text-[15px]"
          aria-label={`${r.ref_code} notes`}
        />
        <button
          onClick={async () => setSaved(await onUpdate(r.id, { admin_notes: notes }))}
          className="shrink-0 rounded-md bg-navy px-4 py-2 font-bold text-paper-light"
        >
          {saved ? "Saved ✓" : "Save notes"}
        </button>
      </div>
    </article>
  );
}
