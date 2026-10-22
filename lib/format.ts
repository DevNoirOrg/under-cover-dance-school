const MONTHS = ["JAN", "FEB", "MÁR", "ÁPR", "MÁJ", "JÚN", "JÚL", "AUG", "SZEP", "OKT", "NOV", "DEC"];

/** "2026-05-12" → "2026. MÁJ 12" (a hírkártyák dátumformátuma). */
export function newsDateLabel(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return `${y}. ${MONTHS[m - 1]} ${d}`;
}

/** A jelentkezésbe kerülő teljes óraleírás: "Nagy terem · Hétfő · 17:00 Beginner — NewJeans Style". */
export function classFullLabel(roomName: string, title: string, subtitle: string): string {
  return subtitle ? `${roomName} · ${title} — ${subtitle}` : `${roomName} · ${title}`;
}

/** Kép/videó címe: "/..." = a public mappából, egyébként a Supabase Storage-ból. */
export function mediaUrl(path: string): string {
  if (path.startsWith("/") || path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/undercover/${path}`;
}
