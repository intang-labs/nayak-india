// Public Supabase settings. The publishable key is meant to be public:
// row-level security in the database decides what anyone can read or write.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ucdhmtoeaamedtbxlcim.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_tLADYtYlcnAgMC8fAIyMBA_GBXc2rVZ";

export const REPORT_PHOTO_BUCKET = "report-photos";
