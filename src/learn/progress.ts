import { persisted } from "../lib/store";

// Tout reste sur l'appareil (localStorage). Ces données font partie de la sauvegarde
// et de « Tout effacer », comme les cases cochées et les notes.

/** Où j'en suis dans chaque leçon : position de la carte, date de fin. */
export interface LessonState { pos: number; done?: number; at?: number }
export const lessonState = persisted<Record<string, LessonState>>("lecons", {});

/**
 * Rappels espacés (boîtes de Leitner, simplifiées) :
 * une idée retrouvée revient de plus en plus tard ; une idée à revoir revient le lendemain.
 */
export interface QState { box: number; due: number; seen: number; ok: number }
export const quizState = persisted<Record<string, QState>>("rappels", {});

/** Jours d'attente avant le prochain rappel, selon la boîte (1 à 5). */
const WAIT = [0, 1, 3, 7, 14, 30];

/** Numéro du jour local (change à minuit, heure de l'appareil). */
export function dayNumber(d = new Date()): number {
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60000) / 86400000);
}

export function recordAnswer(id: string, ok: boolean) {
  const t = dayNumber();
  quizState.set((all) => {
    const cur = all[id] ?? { box: 0, due: t, seen: 0, ok: 0 };
    // Juste du premier coup : boîte 2 (dans 3 jours). Juste ensuite : boîte suivante. À revoir : boîte 1 (demain).
    const box = ok ? Math.min(5, cur.box === 0 ? 2 : cur.box + 1) : 1;
    return { ...all, [id]: { box, due: t + WAIT[box], seen: cur.seen + 1, ok: cur.ok + (ok ? 1 : 0) } };
  });
}

export function setLessonPos(id: string, pos: number) {
  lessonState.set((all) => ({ ...all, [id]: { ...all[id], pos, at: Date.now() } }));
}

export function markLessonDone(id: string) {
  lessonState.set((all) => ({ ...all, [id]: { ...all[id], pos: 0, done: all[id]?.done ?? Date.now(), at: Date.now() } }));
}

/** Petit générateur pseudo-aléatoire stable (même graine → même ordre). */
export function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => {
    h += 0x6d2b79f5;
    let x = h;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(xs: T[], seed: string): T[] {
  const r = seeded(seed);
  const a = xs.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

/** Notes de 0 à 10 des exercices guidés (avant / après), gardées sur l'appareil. */
export const exoRatings = persisted<Record<string, number | null>>("exercices", {});
