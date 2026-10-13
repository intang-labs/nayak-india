"use client";

/* eslint-disable @next/next/no-img-element -- local photo previews use object URLs */
import { useState, type ChangeEvent, type FormEvent } from "react";
import { REPORT_CATEGORIES, isValidPhone } from "@/lib/content";
import { shrinkImage } from "@/lib/shrink-image";
import { getBrowserSupabase } from "@/lib/supabase/browser";
import { REPORT_PHOTO_BUCKET } from "@/lib/supabase/config";
import { ChoiceRow, FieldError, FieldLabel, Fieldset, Honeypot, SubmitButton, inputClass } from "./fields";

type Errors = Partial<Record<"phone" | "area" | "category" | "description" | "photos" | "consent" | "form", string>>;
const MAX_PHOTOS = 3;

export function ReportForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [consent, setConsent] = useState(false);
  const [trap, setTrap] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [extraErrors, setExtraErrors] = useState<Pick<Errors, "photos" | "form">>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [refCode, setRefCode] = useState<string | null>(null);

  function onPickPhotos(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/"));
    const room = Math.max(0, MAX_PHOTOS - photos.length);
    const added = picked.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotos([...photos, ...added]);
    setExtraErrors((er) => ({
      ...er,
      photos: photos.length + picked.length > MAX_PHOTOS ? `Zyada se zyada ${MAX_PHOTOS} photo.` : undefined,
    }));
    e.target.value = "";
  }

  function validate(): Errors {
    const e: Errors = {};
    if (!isValidPhone(phone)) e.phone = "Sahi mobile number likhiye (10 digit).";
    if (area.trim().length < 2) e.area = "Ilaka ya ward ka naam likhiye.";
    if (!category) e.category = "Samasya kis baare mein hai, chuniye.";
    if (description.trim().length < 10) e.description = "Thoda detail mein likhiye (kam se kam 10 akshar).";
    if (!consent) e.consent = "Aage badhne ke liye ye confirm karna zaroori hai.";
    return e;
  }

  // Once the person has tried to submit, errors update live as they fix fields.
  const errors: Errors = { ...(attempted ? validate() : {}), ...extraErrors };

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setAttempted(true);
    setExtraErrors({});
    if (Object.keys(validate()).length > 0) return;
    if (trap) {
      setRefCode("NYK-000000");
      return;
    }
    const supabase = getBrowserSupabase();
    const paths: string[] = [];
    try {
      for (let i = 0; i < photos.length; i++) {
        setBusy(`Photo ${i + 1}/${photos.length} upload ho rahi hai…`);
        const blob = await shrinkImage(photos[i].file);
        const path = `incoming/${crypto.randomUUID()}.jpg`;
        const { error } = await supabase.storage
          .from(REPORT_PHOTO_BUCKET)
          .upload(path, blob, { contentType: "image/jpeg", upsert: false });
        if (error) throw error;
        paths.push(path);
      }
    } catch (err) {
      setBusy(null);
      setExtraErrors({
        photos:
          err instanceof Error && err.message === "unsupported_image"
            ? "Ye photo format support nahi hai. JPG ya PNG photo chuniye."
            : "Photo upload nahi ho paayi. Internet check karke dobara try karein.",
      });
      return;
    }

    setBusy("Report bhej rahe hain…");
    const { data, error } = await supabase.rpc("submit_report", {
      p_name: name,
      p_phone: phone,
      p_area: area,
      p_landmark: landmark,
      p_category: category,
      p_description: description,
      p_photo_paths: paths,
    });
    setBusy(null);
    if (error || typeof data !== "string") {
      setExtraErrors({
        form: error?.message.includes("too_many_reports")
          ? "Aaj is number se 5 reports aa chuki hain. Kal dobara try karein."
          : "Report nahi ja paayi. Internet check karke dobara try karein.",
      });
      return;
    }
    setRefCode(data);
  }

  if (refCode) {
    return (
      <div className="rounded-xl border-2 border-navy bg-paper-light p-8 text-center" role="status">
        <span className="inline-block -rotate-3 rounded-md border-[3px] border-red px-3 py-0.5 font-display text-2xl uppercase tracking-[0.12em] text-red">
          On record
        </span>
        <p className="mt-5 font-display text-5xl leading-none text-navy">आपकी रिपोर्ट दर्ज हो गई</p>
        <p className="mt-4 text-lg text-ink/85">Aapka reference number:</p>
        <p className="mt-1 font-display text-5xl tracking-wider text-red">{refCode}</p>
        <p className="mt-4 text-lg text-ink/85">
          Is number ko sambhal kar rakhiye. Hamari team verify karke aage ka kadam uthayegi aur zaroorat padi to aapse
          contact karegi.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="relative space-y-8">
      <Honeypot value={trap} onChange={setTrap} />

      <Fieldset legend="समस्या किस बारे में है?" required error={errors.category} errorId="category-error">
        <div className="grid gap-2 sm:grid-cols-2">
          {REPORT_CATEGORIES.map((c) => (
            <ChoiceRow
              key={c.key}
              type="radio"
              name="category"
              value={c.key}
              label={c.label}
              checked={category === c.key}
              onChange={() => setCategory(c.key)}
            />
          ))}
        </div>
      </Fieldset>

      <div>
        <FieldLabel
          htmlFor="description"
          title="समस्या बताइए"
          hint="Kya ho raha hai, kab se, kis vibhaag se juda hai — jitna detail, utna better"
          required
        />
        <textarea
          id="description"
          rows={5}
          className={inputClass}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={3000}
          aria-invalid={!!errors.description}
          aria-describedby={errors.description ? "description-error" : undefined}
        />
        <FieldError id="description-error" message={errors.description} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="area" title="इलाका / वार्ड" hint="Jaise: Talwandi, Ward 45" required />
          <input
            id="area"
            className={inputClass}
            value={area}
            onChange={(e) => setArea(e.target.value)}
            maxLength={200}
            aria-invalid={!!errors.area}
            aria-describedby={errors.area ? "area-error" : undefined}
          />
          <FieldError id="area-error" message={errors.area} />
        </div>
        <div>
          <FieldLabel htmlFor="landmark" title="लैंडमार्क" hint="Optional — paas ki dukaan, mandir, school" />
          <input
            id="landmark"
            className={inputClass}
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            maxLength={300}
          />
        </div>
      </div>

      <div>
        <FieldLabel htmlFor="photos" title="फोटो" hint={`Optional — ${MAX_PHOTOS} photo tak. Photo se report mazboot hoti hai.`} />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          {photos.map(({ url }, i) => (
            <div key={url} className="relative">
              <img src={url} alt={`Photo ${i + 1}`} className="h-24 w-24 rounded-md border border-navy/20 object-cover" />
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(url);
                  setPhotos((p) => p.filter((_, j) => j !== i));
                }}
                className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy text-sm font-bold text-paper-light"
                aria-label={`Photo ${i + 1} hatayein`}
              >
                ✕
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS ? (
            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-navy/40 text-center text-sm font-semibold text-navy hover:bg-navy/5">
              <span className="text-3xl leading-none">+</span>
              Photo
              <input id="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={onPickPhotos} />
            </label>
          ) : null}
        </div>
        <FieldError id="photos-error" message={errors.photos} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="rname" title="आपका नाम" hint="Optional" />
          <input id="rname" className={inputClass} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={120} />
        </div>
        <div>
          <FieldLabel htmlFor="rphone" title="मोबाइल नंबर" hint="Sirf NAYAK team dekhegi, public nahi hoga" required />
          <input
            id="rphone"
            type="tel"
            inputMode="tel"
            className={inputClass}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="98xxxxxxxx"
            maxLength={15}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "rphone-error" : undefined}
          />
          <FieldError id="rphone-error" message={errors.phone} />
        </div>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[17px] text-ink">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 h-5 w-5 shrink-0 accent-[#15284a]"
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            Maine jo jaankari di hai woh sahi hai. NAYAK isse verify karke public kar sakta hai — mera naam aur number
            public nahi honge.
          </span>
        </label>
        <FieldError id="consent-error" message={errors.consent} />
      </div>

      <p className="rounded-md border-l-4 border-gold bg-gold/10 px-4 py-3 text-[15px] text-ink/85">
        Kisi vyakti par aarop lagana ho to saboot (photo, document) zaroor lagaiye. NAYAK pehle verify karega, phir hi
        kuch public hoga.
      </p>

      {errors.form ? (
        <p className="rounded-md bg-red/10 px-4 py-3 font-semibold text-red" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton busy={!!busy}>{busy ?? "रिपोर्ट भेजें"}</SubmitButton>
      </div>
    </form>
  );
}
