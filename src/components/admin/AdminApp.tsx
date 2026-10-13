"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState, type FormEvent } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { inputClass } from "@/components/forms/fields";
import { ReportsPanel } from "./ReportsPanel";
import { MembersPanel } from "./MembersPanel";
import { InstagramPanel } from "./InstagramPanel";
import { AdminsPanel } from "./AdminsPanel";

const TABS = [
  { key: "reports", label: "Reports" },
  { key: "members", label: "Members" },
  { key: "instagram", label: "Instagram" },
  { key: "admins", label: "Admins" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

export function AdminApp() {
  const supabase = getBrowserSupabase();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<TabKey>("reports");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const email = session?.user.email?.toLowerCase();
    if (!email) return;
    let active = true;
    supabase
      .from("admin_emails")
      .select("email")
      .eq("email", email)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setIsAdmin(!!data);
      });
    return () => {
      active = false;
    };
  }, [session, supabase]);

  if (session === undefined) return <Shell>Load ho raha hai…</Shell>;
  if (!session) return <LoginForm />;
  if (isAdmin === null) return <Shell>Access check ho raha hai…</Shell>;
  if (!isAdmin) {
    return (
      <Shell>
        <p className="text-lg">
          <b>{session.user.email}</b> ke paas admin access nahi hai. Kisi admin se kahiye ki aapka email Admins list mein jode.
        </p>
        <button onClick={() => supabase.auth.signOut()} className="mt-4 rounded-md bg-navy px-4 py-2 font-bold text-paper-light">
          Sign out
        </button>
      </Shell>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-5xl leading-none text-navy">Admin panel</h1>
        <div className="flex items-center gap-3 text-[15px] text-muted">
          <span>{session.user.email}</span>
          <button onClick={() => supabase.auth.signOut()} className="rounded-md border border-navy/30 px-3 py-1.5 font-semibold text-navy hover:bg-navy/5">
            Sign out
          </button>
        </div>
      </div>
      <div role="tablist" aria-label="Admin sections" className="mt-6 flex flex-wrap gap-2 border-b border-navy/15">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px rounded-t-md border px-4 py-2 text-lg font-bold ${
              tab === t.key ? "border-navy/15 border-b-paper bg-paper text-navy" : "border-transparent text-navy-soft hover:text-navy"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="pt-6">
        {tab === "reports" ? <ReportsPanel /> : null}
        {tab === "members" ? <MembersPanel /> : null}
        {tab === "instagram" ? <InstagramPanel /> : null}
        {tab === "admins" ? <AdminsPanel myEmail={session.user.email ?? ""} /> : null}
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md px-4 py-20 text-ink">{children}</div>;
}

function LoginForm() {
  const supabase = getBrowserSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setError("Email ya password galat hai.");
  }

  return (
    <Shell>
      <h1 className="font-display text-5xl leading-none text-navy">Admin login</h1>
      <p className="mt-2 text-muted">Sirf NAYAK team ke liye.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <label className="block">
          <span className="font-bold text-navy">Email</span>
          <input type="email" required autoComplete="username" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="block">
          <span className="font-bold text-navy">Password</span>
          <input type="password" required autoComplete="current-password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error ? <p className="font-semibold text-red" role="alert">{error}</p> : null}
        <button type="submit" disabled={busy} className="w-full rounded-md bg-navy px-5 py-3 text-lg font-bold text-paper-light disabled:opacity-70">
          {busy ? "Login ho raha hai…" : "Login"}
        </button>
      </form>
    </Shell>
  );
}
