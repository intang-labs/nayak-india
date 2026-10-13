"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { PanelMessage, formatDate } from "./shared";

type AdminRow = { email: string; added_at: string };

export function AdminsPanel({ myEmail }: { myEmail: string }) {
  const supabase = getBrowserSupabase();
  const [rows, setRows] = useState<AdminRow[] | null>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("admin_emails").select("email,added_at").order("added_at");
    if (error) setError(error.message);
    else setRows(data as AdminRow[]);
  }, [supabase]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch
    load();
  }, [load]);

  async function add(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const clean = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError("Sahi email daaliye.");
      return;
    }
    const { error } = await supabase.from("admin_emails").insert({ email: clean });
    if (error) setError(error.message.includes("duplicate") ? "Ye email pehle se admin hai." : error.message);
    else {
      setEmail("");
      load();
    }
  }

  async function remove(target: string) {
    const { error } = await supabase.from("admin_emails").delete().eq("email", target);
    if (error) setError(error.message);
    else load();
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-l-4 border-gold bg-gold/10 p-4 text-[15px] text-ink/85">
        <p className="font-bold text-navy">Naya admin kaise jodein</p>
        <ol className="mt-1 list-decimal space-y-1 pl-5">
          <li>Neeche unka email jodiye.</li>
          <li>
            Supabase dashboard → Authentication → Users → <b>Add user → Create new user</b>. Wahi email aur ek password
            daaliye, &quot;Auto confirm user&quot; on rakhiye.
          </li>
          <li>Unhe email aur password alag se (seedhe) bhejiye. Woh /admin par login kar lenge.</li>
        </ol>
      </div>

      <form onSubmit={add} className="flex flex-wrap gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="naya.admin@gmail.com"
          className="w-full max-w-sm rounded-md border border-navy/25 bg-white/80 px-3 py-2"
          aria-label="Admin email"
        />
        <button type="submit" className="rounded-md bg-navy px-5 py-2 font-bold text-paper-light">
          Admin banayein
        </button>
      </form>
      {error ? <p className="font-semibold text-red">{error}</p> : null}

      {rows === null ? <PanelMessage>Load ho raha hai…</PanelMessage> : null}
      {rows && rows.length > 0 ? (
        <ul className="divide-y divide-navy/10 rounded-lg border border-navy/15 bg-paper-light">
          {rows.map((a) => (
            <li key={a.email} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-navy">{a.email}</p>
                <p className="text-sm text-muted">Joda gaya: {formatDate(a.added_at)}</p>
              </div>
              {a.email === myEmail.toLowerCase() ? (
                <span className="text-sm text-muted">Aap</span>
              ) : (
                <button onClick={() => remove(a.email)} className="rounded-md border border-red/40 px-3 py-1.5 font-semibold text-red">
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
