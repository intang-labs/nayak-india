"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { JOIN_REASONS, KOTA_CHANGES, MEMBER_STATUSES, labelFor } from "@/lib/content";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { PanelMessage, downloadCsv, formatDate, selectClass, toCsv, waLink } from "./shared";

type Member = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  reasons: string[];
  reason_other: string | null;
  changes: string[];
  change_other: string | null;
  status: string;
};

export function MembersPanel() {
  const supabase = getBrowserSupabase();
  const [rows, setRows] = useState<Member[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("members")
      .select("id,created_at,name,phone,email,address,reasons,reason_other,changes,change_other,status")
      .order("created_at", { ascending: false })
      .limit(2000);
    if (error) setError(error.message);
    else setRows(data as Member[]);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!rows || !q) return rows;
    return rows.filter((m) => [m.name, m.phone, m.address, m.email].some((v) => v?.toLowerCase().includes(q)));
  }, [rows, query]);

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("members").update({ status }).eq("id", id);
    if (error) setError(error.message);
    else setRows((r) => r?.map((m) => (m.id === id ? { ...m, status } : m)) ?? null);
  }

  function exportCsv() {
    if (!filtered) return;
    const out = filtered.map((m) => ({
      joined: formatDate(m.created_at),
      name: m.name,
      phone: m.phone,
      email: m.email ?? "",
      address: m.address ?? "",
      why_join: [...m.reasons.map((k) => labelFor(JOIN_REASONS, k)), m.reason_other].filter(Boolean),
      kota_changes: [...m.changes.map((k) => labelFor(KOTA_CHANGES, k)), m.change_other].filter(Boolean),
      status: labelFor(MEMBER_STATUSES, m.status),
    }));
    downloadCsv(`nayak-members-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(out));
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Naam, number ya ilaka search karein"
          className="w-full max-w-xs rounded-md border border-navy/25 bg-white/80 px-3 py-2"
          aria-label="Search members"
        />
        <button onClick={exportCsv} className="rounded-md bg-navy px-4 py-2 font-bold text-paper-light">
          CSV download
        </button>
        {filtered ? <span className="text-muted">{filtered.length} members</span> : null}
      </div>
      {error ? <p className="mt-3 font-semibold text-red">{error}</p> : null}
      <div className="mt-5">
        {filtered === null ? <PanelMessage>Load ho raha hai…</PanelMessage> : null}
        {filtered?.length === 0 ? <PanelMessage>Koi member nahi mila.</PanelMessage> : null}
        {filtered && filtered.length > 0 ? (
          <ul className="divide-y divide-navy/10 rounded-lg border border-navy/15 bg-paper-light">
            {filtered.map((m) => (
              <li key={m.id} className="grid gap-2 p-4 md:grid-cols-[1.2fr_2fr_auto] md:items-start">
                <div>
                  <p className="text-lg font-bold text-navy">{m.name}</p>
                  <p className="text-[15px]">
                    <a className="font-semibold underline" href={`tel:${m.phone}`}>
                      {m.phone}
                    </a>{" "}
                    ·{" "}
                    <a className="font-semibold underline" href={waLink(m.phone)} target="_blank" rel="noopener noreferrer">
                      WhatsApp
                    </a>
                  </p>
                  <p className="text-sm text-muted">{formatDate(m.created_at)}</p>
                  {m.address ? <p className="text-sm text-ink/80">{m.address}</p> : null}
                  {m.email ? <p className="text-sm text-ink/80">{m.email}</p> : null}
                </div>
                <div className="text-[15px] text-ink/85">
                  <p>
                    <b className="text-navy">Kyun:</b>{" "}
                    {[...m.reasons.map((k) => labelFor(JOIN_REASONS, k)), m.reason_other].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-1">
                    <b className="text-navy">Badlaav:</b>{" "}
                    {[...m.changes.map((k) => labelFor(KOTA_CHANGES, k)), m.change_other].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <select className={selectClass} value={m.status} onChange={(e) => setStatus(m.id, e.target.value)} aria-label={`${m.name} status`}>
                  {MEMBER_STATUSES.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
