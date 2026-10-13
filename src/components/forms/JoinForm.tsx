"use client";

import { useState, type FormEvent } from "react";
import { JOIN_REASONS, KOTA_CHANGES, SITE, isValidPhone } from "@/lib/content";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { ChoiceRow, FieldError, FieldLabel, Fieldset, Honeypot, SubmitButton, inputClass } from "./fields";

type Errors = Partial<Record<"name" | "phone" | "reasons" | "changes" | "email" | "form", string>>;

function toggle(set: Set<string>, key: string) {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export function JoinForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [reasons, setReasons] = useState<Set<string>>(new Set());
  const [reasonOther, setReasonOther] = useState("");
  const [changes, setChanges] = useState<Set<string>>(new Set());
  const [changeOther, setChangeOther] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [trap, setTrap] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    if (!name.trim()) e.name = "Apna naam likhiye.";
    if (!isValidPhone(phone)) e.phone = "Sahi mobile number likhiye (10 digit).";
    if (reasons.size === 0 && !reasonOther.trim()) e.reasons = "Kam se kam ek option chuniye ya apni wajah likhiye.";
    if (changes.size === 0 && !changeOther.trim()) e.changes = "Kam se kam ek badlaav chuniye ya khud likhiye.";
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Email sahi nahi lag raha.";
    return e;
  }

  // Once the person has tried to submit, errors update live as they fix fields.
  const errors: Errors = attempted ? { ...validate(), form: formError ?? undefined } : { form: formError ?? undefined };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setAttempted(true);
    setFormError(null);
    if (Object.keys(validate()).length > 0) return;
    if (trap) {
      setDone(true);
      return;
    }
    setBusy(true);
    const { error } = await getBrowserSupabase().rpc("submit_member", {
      p_name: name,
      p_phone: phone,
      p_email: email,
      p_address: address,
      p_reasons: [...reasons],
      p_reason_other: reasonOther,
      p_changes: [...changes],
      p_change_other: changeOther,
    });
    setBusy(false);
    if (error) {
      setFormError(
        error.message.includes("duplicate_recent")
          ? "Is number se form abhi-abhi mil chuka hai. Thodi der baad dobara try karein."
          : "Form nahi ja paaya. Internet check karke dobara try karein.",
      );
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border-2 border-navy bg-paper-light p-8 text-center" role="status">
        <p className="font-display text-5xl leading-none text-navy">धन्यवाद, {name.split(" ")[0] || "saathi"}!</p>
        <p className="mt-4 text-lg text-ink/85">
          Aap NAYAK parivaar ka hissa ban gaye. Hamari team jaldi aapse WhatsApp ya call par contact karegi.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href={SITE.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-navy px-5 py-3 text-lg font-bold text-paper-light hover:bg-navy-deep"
          >
            Instagram par follow karein
          </a>
          {SITE.whatsappGroupUrl ? (
            <a
              href={SITE.whatsappGroupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-red px-5 py-3 text-lg font-bold text-paper-light hover:bg-red-dark"
            >
              WhatsApp group join karein
            </a>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-8">
      <Honeypot value={trap} onChange={setTrap} />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="name" title="नाम" hint="Poora naam" required />
          <input
            id="name"
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            maxLength={120}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          <FieldError id="name-error" message={errors.name} />
        </div>
        <div>
          <FieldLabel htmlFor="phone" title="मोबाइल नंबर" hint="WhatsApp wala number ho to best" required />
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="98xxxxxxxx"
            maxLength={15}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>
      </div>

      <Fieldset
        legend="आप NAYAK से क्यों जुड़ना चाहते हैं?"
        hint="Jitne chahein chuniye"
        required
        error={errors.reasons}
        errorId="reasons-error"
      >
        {JOIN_REASONS.map((r) => (
          <ChoiceRow
            key={r.key}
            type="checkbox"
            name="reasons"
            value={r.key}
            label={r.label}
            checked={reasons.has(r.key)}
            onChange={() => setReasons((s) => toggle(s, r.key))}
          />
        ))}
        <input
          className={inputClass}
          placeholder="Kuch aur? Yahan likhiye"
          value={reasonOther}
          onChange={(e) => setReasonOther(e.target.value)}
          maxLength={500}
          aria-label="Koi aur wajah"
        />
      </Fieldset>

      <Fieldset
        legend="आप कोटा के इंफ्रास्ट्रक्चर में क्या बदलाव चाहते हैं?"
        hint="Jitne chahein chuniye"
        required
        error={errors.changes}
        errorId="changes-error"
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {KOTA_CHANGES.map((c) => (
            <ChoiceRow
              key={c.key}
              type="checkbox"
              name="changes"
              value={c.key}
              label={c.label}
              checked={changes.has(c.key)}
              onChange={() => setChanges((s) => toggle(s, c.key))}
            />
          ))}
        </div>
        <input
          className={inputClass}
          placeholder="Kuch aur? Yahan likhiye"
          value={changeOther}
          onChange={(e) => setChangeOther(e.target.value)}
          maxLength={500}
          aria-label="Koi aur badlaav"
        />
      </Fieldset>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="email" title="ईमेल" hint="Optional" />
          <input
            id="email"
            type="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            maxLength={200}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          <FieldError id="email-error" message={errors.email} />
        </div>
        <div>
          <FieldLabel htmlFor="address" title="पता / इलाका" hint="Optional — ward ya mohalla kaafi hai" />
          <input
            id="address"
            className={inputClass}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            autoComplete="street-address"
            maxLength={500}
          />
        </div>
      </div>

      {errors.form ? (
        <p className="rounded-md bg-red/10 px-4 py-3 font-semibold text-red" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton busy={busy}>{busy ? "Bhej rahe hain…" : "फ़ॉर्म भेजें"}</SubmitButton>
        <p className="text-[15px] text-muted">Aapka number public nahi hoga. Sirf NAYAK team contact ke liye use karegi.</p>
      </div>
    </form>
  );
}
