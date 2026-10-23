// Génère un fichier d'agenda (.ics) entièrement sur l'appareil : rien n'est envoyé nulle part.
const pad = (n: number) => String(n).padStart(2, "0");
const local = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

/** Replie une ligne à 75 octets maximum (RFC 5545), sans couper un caractère. */
function fold(line: string): string {
  const enc = new TextEncoder();
  let out = "", cur = "", bytes = 0, limit = 75;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > limit) { out += cur + "\r\n "; cur = ""; bytes = 0; limit = 74; }
    cur += ch; bytes += b;
  }
  return out + cur;
}

/** Prochain dimanche (strictement après aujourd'hui), à l'heure donnée. */
export function nextSunday(from = new Date(), hour = 18): Date {
  const d = new Date(from);
  d.setHours(hour, 0, 0, 0);
  const add = (7 - d.getDay()) % 7 || 7;
  d.setDate(d.getDate() + add);
  return d;
}

export const toDateInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function buildIcs(o: { title: string; description?: string; start: Date; minutes?: number; uid?: string }): string {
  const end = new Date(o.start.getTime() + (o.minutes ?? 10) * 60000);
  const lines = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Comprendre ses schémas//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${o.uid ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}@comprendre-ses-schemas`}`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${local(o.start)}`,
    `DTEND:${local(end)}`,
    `SUMMARY:${esc(o.title)}`,
    ...(o.description ? [`DESCRIPTION:${esc(o.description)}`] : []),
    "BEGIN:VALARM", "TRIGGER:PT0M", "ACTION:DISPLAY", `DESCRIPTION:${esc(o.title)}`, "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

export function downloadText(filename: string, mime: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: `${mime};charset=utf-8` }));
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
