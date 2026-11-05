import { GLOSSAIRE } from "../data/glossaire";
import type { Card } from "./types";

// Repérage des mots du glossaire dans les textes : mis en évidence au survol (phrase simple) et au clic (détail).
// Règle de lisibilité : un mot n'est mis en évidence qu'une fois par carte, à sa première apparition.

const LETTER = /[\p{L}\p{N}]/u;
// Pas de « lookbehind » dans les motifs : Safari < 16.4 (iPhone restés en iOS 15) refuserait de charger l'application.
const COMPILED = GLOSSAIRE.flatMap((e) => (e.match ?? []).map((src) => ({ id: e.id, re: new RegExp(src, "giu"), notAfter: e.notAfter ?? [] })));

export interface Hit { start: number; end: number; id: string }

/** Mots trouvés dans un texte (sans balisage), une seule fois par mot, sans chevauchement (le plus long l'emporte). */
export function findTerms(text: string, allow?: ReadonlySet<string> | null): Hit[] {
  const found: Hit[] = [];
  for (const c of COMPILED) {
    if (allow && !allow.has(c.id)) continue;
    c.re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = c.re.exec(text))) {
      if (!m[0]) { c.re.lastIndex++; continue; }
      const s = m.index, e = s + m[0].length;
      // limites de mot faites à la main (les accents ne sont pas des lettres pour \b)
      if ((s > 0 && LETTER.test(text[s - 1])) || (e < text.length && LETTER.test(text[e]))) continue;
      const before = text.slice(0, s).replace(/\s/g, " ").toLowerCase();
      if (c.notAfter.some((p) => before.endsWith(p))) continue;
      found.push({ start: s, end: e, id: c.id });
      break;
    }
  }
  found.sort((a, b) => (b.end - b.start) - (a.end - a.start) || a.start - b.start);
  const kept: Hit[] = [];
  const ids = new Set<string>();
  for (const h of found) {
    if (ids.has(h.id)) continue;
    if (kept.some((k) => h.start < k.end && k.start < h.end)) continue;
    kept.push(h); ids.add(h.id);
  }
  return kept.sort((a, b) => a.start - b.start);
}

const MANUAL = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;
const strip = (s: string) => s.replace(MANUAL, (_, _id, w) => w).replace(/\*\*([^*]+)\*\*/g, "$1");

/** Textes d'une carte, dans l'ordre où ils s'affichent (pour ne marquer chaque mot qu'une fois par carte). */
export function cardStrings(c: Card): string[] {
  const t: string[] = [];
  // La question n'a pas de mot expliqué (l'infobulle pourrait souffler la réponse) ; l'explication, si.
  if (c.kind === "quiz" || c.kind === "rappel") t.push(c.quiz.explain);
  if ("quote" in c && c.quote) t.push(c.quote);
  if ("body" in c && c.body) t.push(...c.body);
  if ("list" in c && c.list) t.push(...c.list);
  if ("after" in c && c.after) t.push(...c.after);
  if (c.kind === "tiles") t.push(...c.tiles.flatMap((x) => [x.title, x.text]));
  if (c.kind === "steps") { t.push(...c.steps.flatMap((x) => [x.title, x.text])); if (c.foot) t.push(c.foot); }
  if (c.kind === "reflect") t.push(c.prompt, c.hint ?? "");
  // (les cases d’une carte d’entrée sont des boutons : pas de mot expliqué dedans)
  if (c.kind === "retain") t.push(...c.items);
  if (c.why) t.push(c.why);
  if (c.more) t.push(...c.more.body);
  return t;
}

/** Pour chaque texte de la carte : les mots à mettre en évidence (première apparition seulement). */
export function planCard(strings: string[]): Map<string, Set<string>> {
  const used = new Set<string>();
  const plan = new Map<string, Set<string>>();
  for (const s of strings) {
    if (!s || plan.has(s)) continue;
    const allow = new Set<string>();
    for (const m of s.matchAll(MANUAL)) used.add(m[1]);
    for (const h of findTerms(strip(s))) if (!used.has(h.id)) { allow.add(h.id); used.add(h.id); }
    plan.set(s, allow);
  }
  return plan;
}
