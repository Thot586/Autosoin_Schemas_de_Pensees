import type { Chapter, ChapterId, Lesson, QuizItem } from "./types";
import { deepFr } from "../lib/typo";
import { AVANT } from "./content/avant";
import { COMPRENDRE } from "./content/comprendre";
import { BESOINS } from "./content/besoins";
import { CERCLE } from "./content/cercle";
import { AIDE } from "./content/aide";
import { ACTION } from "./content/action";
import { dayNumber, lessonState, quizState, shuffle, type LessonState, type QState } from "./progress";
import { SCHEMA_PARTS, schemaQuizzes } from "./schemaLessons";
import { SCHEMAS } from "../data/schemas";

export const CHAPTERS: Chapter[] = deepFr<Chapter[]>([
  { id: "avant", title: "Avant de commencer", short: "Ce support, la thérapie des schémas, ses limites.", icon: "flag" },
  { id: "comprendre", title: "Comprendre un schéma", short: "Ce que c’est, d’où ça vient, les 5 besoins.", icon: "eye" },
  { id: "besoins", title: "Les 5 besoins, un par un", short: "Chaque besoin, ses schémas, son animation.", icon: "layers" },
  { id: "cercle", title: "Comment un schéma agit", short: "Le cercle, les trois réactions, les signes.", icon: "replay" },
  { id: "aide", title: "Ce qui aide", short: "L’adulte sain, les leviers, l’aide.", icon: "heart" },
  { id: "action", title: "Passer à l’action", short: "La méthode et les outils, pas à pas.", icon: "sparkles" },
]);

export const LESSONS: Lesson[] = deepFr<Lesson[]>([...AVANT, ...COMPRENDRE, ...BESOINS, ...CERCLE, ...AIDE, ...ACTION]);

export const lessonById = (id: string): Lesson | undefined => LESSONS.find((l) => l.id === id);
export const lessonsOf = (c: ChapterId): Lesson[] => LESSONS.filter((l) => l.chapter === c);
export const lessonIndex = (id: string): number => LESSONS.findIndex((l) => l.id === id);
export const nextLessonAfter = (id: string): Lesson | undefined => LESSONS[lessonIndex(id) + 1];
export const chapterOf = (l: Lesson): Chapter => CHAPTERS.find((c) => c.id === l.chapter)!;
export const TOTAL_MINUTES = LESSONS.reduce((s, l) => s + l.minutes, 0);

/** Prochaine leçon à faire : celle en cours, sinon la première non terminée. */
export function nextToDo(st: Record<string, LessonState>): Lesson | undefined {
  const inProgress = LESSONS.filter((l) => !st[l.id]?.done && (st[l.id]?.pos ?? 0) > 0).sort((a, b) => (st[b.id]?.at ?? 0) - (st[a.id]?.at ?? 0))[0];
  return inProgress ?? LESSONS.find((l) => !st[l.id]?.done);
}

// ───────────── Banque de questions (pour les rappels)

export interface Bank { quiz: QuizItem; source: string; label: string; to: string }

function lessonBank(l: Lesson): Bank[] {
  return l.cards.filter((c) => c.kind === "quiz").map((c) => ({ quiz: (c as { quiz: QuizItem }).quiz, source: l.id, label: l.title, to: `/apprendre/${l.id}` }));
}

/** Questions des leçons terminées et des pages de schémas déjà lues. */
export function unlockedBank(st = lessonState.get()): Bank[] {
  const out: Bank[] = [];
  for (const l of LESSONS) if (st[l.id]?.done) out.push(...lessonBank(l));
  for (const s of SCHEMAS) for (const p of SCHEMA_PARTS) {
    const key = `schema:${s.slug}:${p.id}`;
    if (st[key]?.done) out.push(...schemaQuizzes(s.slug, p.id).map((quiz) => ({ quiz, source: key, label: `${s.name} · ${p.label}`, to: `/schemas/${s.slug}/${p.id}` })));
  }
  const seen = new Set<string>();
  return out.filter((b) => (seen.has(b.quiz.id) ? false : (seen.add(b.quiz.id), true)));
}

const isDue = (q: QState | undefined, today: number) => !q || q.due <= today;

/** « Mon rappel du jour » : jusqu'à `n` questions dues, les moins bien retenues d'abord. */
export function dueToday(n = 3, st = lessonState.get(), qs = quizState.get()): Bank[] {
  const today = dayNumber();
  const due = unlockedBank(st).filter((b) => isDue(qs[b.quiz.id], today));
  const mixed = shuffle(due, `jour-${today}`);
  mixed.sort((a, b) => (qs[a.quiz.id]?.box ?? 0) - (qs[b.quiz.id]?.box ?? 0));
  return mixed.slice(0, n);
}

/** Petit rappel au début d'une leçon : une question d'une leçon déjà terminée (la précédente de préférence). */
export function openerFor(lessonId: string, st = lessonState.get(), qs = quizState.get()): Bank | undefined {
  const today = dayNumber();
  const idx = lessonIndex(lessonId);
  const before = LESSONS.slice(0, Math.max(0, idx)).filter((l) => st[l.id]?.done && l.id !== lessonId);
  if (!before.length) return undefined;
  const pool = before.flatMap(lessonBank);
  const due = pool.filter((b) => isDue(qs[b.quiz.id], today) && qs[b.quiz.id]);
  if (due.length) return shuffle(due, `${lessonId}-${today}`)[0];
  const prev = before[before.length - 1];
  return shuffle(lessonBank(prev), `${lessonId}-${today}`)[0];
}
