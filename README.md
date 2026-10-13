# NAYAK website

Website for **NAYAK — NavBharat Association of Young, Accountable Karyakartas**, Kota.
Headlines are in Hindi (Devanagari); supporting text is everyday Hinglish.

**Pages**

| Path | What it is |
| --- | --- |
| `/` | Home: hero, values, what we do, vision teaser, Instagram showcase, join and report calls |
| `/about` | Who we are, values, the Manthan 2026 vision (short- and long-term goals), Manthan |
| `/join` | Join form (same questions as the Google Form) → `members` table |
| `/report` | Report a problem with up to 3 photos → `reports` table, gives a `NYK-XXXXXX` reference |
| `/admin` | Admin panel: reports, members (CSV export), Instagram posts, admin list |

**Stack:** Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS v4 · Supabase (Postgres, Auth, Storage) · fonts self-hosted from `@fontsource` (Teko for headings, Mukta for text).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run lint
```

No `.env` file is needed: the Supabase URL and publishable key in `src/lib/supabase/config.ts` are public by design.
To point at another Supabase project, set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
Set `NEXT_PUBLIC_SITE_URL` to the live domain so share previews use the right address.

## Deploy (Vercel)

1. vercel.com → **Add New → Project** → import `intang-labs/nayak-india`.
2. Keep the defaults (framework: Next.js) and deploy.
3. Optional: add `NEXT_PUBLIC_SITE_URL` (e.g. `https://nayakindia.in`) under Settings → Environment Variables and redeploy.

## Supabase

Project: **nayak-india** (organisation *intang*, region Mumbai). The full schema is in [`supabase/schema.sql`](supabase/schema.sql).

- The public can only **submit**, through the `submit_member` and `submit_report` functions. These validate input,
  normalise phone numbers to 10 digits, and rate-limit (one join per number per 10 minutes, 5 reports per number per day).
  The public cannot read any submission.
- Report photos go to the private `report-photos` bucket (`incoming/` folder, max 5 MB, JPG/PNG/WebP). The browser
  shrinks photos to 1600 px before upload. Only admins can view them (signed links that expire in an hour).
- Admin access is row-level security: a signed-in user whose email is in `admin_emails` can read and update everything.

### Admin logins

1. In `/admin` → **Admins**, add the person's email (or insert it into `admin_emails`).
2. In the Supabase dashboard → **Authentication → Users → Add user → Create new user**, enter the same email and a
   password, and keep **Auto confirm user** on.
3. Send them the email and password directly. They sign in at `/admin`.

Recommended: in **Authentication → Sign In / Providers → Email**, turn off **Allow new users to sign up**, since admins are
created from the dashboard.

### Instagram showcase

In `/admin` → **Instagram**, paste a post or reel link (Instagram → Share → Copy link). It appears on the home page within
about a minute (`cacheLife("minutes")`). Until a post is added, the home page shows a "follow us" card.

## Editing content

Most copy lives in [`src/lib/content.ts`](src/lib/content.ts): values, vision goals, form options, report categories and
the WhatsApp group link (`SITE.whatsappGroupUrl`, leave empty to hide WhatsApp buttons). Page layouts are in `src/app/*/page.tsx`.

Images in `public/images/` are cut from the Manthan poster (seal, torn-edge photos, paper texture, brush strokes, `og.jpg` share image).
