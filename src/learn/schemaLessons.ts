import type { Card, Lesson, QuizItem, Tone } from "./types";
import { schemaBySlug } from "../data/schemas";
import { baseById } from "../data/bases";
import { deepFr } from "../lib/typo";
import { adultQuiz, phraseQuiz, STEPS_QUIZ } from "./gen";

// Les trois pages de chaque schéma (diaporama, partie 7), découpées en cartes courtes.

export type SchemaPartId = "comprendre" | "moment" | "semaines";
export const SCHEMA_PARTS: { id: SchemaPartId; label: string; short: string; icon: "eye" | "bolt" | "calendar"; minutes: number }[] = [
  { id: "comprendre", label: "Comprendre", short: "D’où il peut venir, à quoi il servait, comment il se voit.", icon: "eye", minutes: 3 },
  { id: "moment", label: "Dans le moment", short: "Que faire quand il s’allume.", icon: "bolt", minutes: 2 },
  { id: "semaines", label: "Au fil des semaines", short: "Avancer un pas à la fois.", icon: "calendar", minutes: 2 },
];

const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const firstSentence = (s: string) => (s.match(/^.*?[.!?…](\s|$)/)?.[0] ?? s).trim();

export function schemaQuizzes(slug: string, part: SchemaPartId): QuizItem[] {
  if (part === "comprendre") return [phraseQuiz(slug)];
  if (part === "moment") return [adultQuiz(slug)];
  return [STEPS_QUIZ];
}

const cache = new Map<string, Lesson>();

export function schemaLesson(slug: string, part: SchemaPartId): Lesson | undefined {
  const key = `${slug}:${part}`;
  if (cache.has(key)) return cache.get(key);
  const s = schemaBySlug(slug);
  if (!s) return undefined;
  const tone = `b${s.base}` as Tone;
  const base = baseById(s.base);
  const meta = SCHEMA_PARTS.find((p) => p.id === part)!;
  let cards: Card[] = [];
  let retain: string[] = [];

  if (part === "comprendre") {
    cards = [
      { id: "phrase", kind: "text", tone, icon: "chat", title: s.name, quote: s.phrase, quoteLabel: "Sa phrase",
        body: [`Base ${s.base} : ${base.name.toLowerCase()}.`, `Le besoin derrière : ${s.besoin}`], pro: s.pro.comprendre.join(" ") },
      { id: "origine", kind: "text", tone, icon: "wind", title: "D’où ça peut venir", list: s.origine, after: s.sensible ? [s.sensible] : undefined },
      { id: "prudence", kind: "text", tone: "care", icon: "heart", title: "Des pistes, pas des causes", body: [s.prudence] },
      { id: "servait", kind: "text", tone, icon: "shield", title: "À quoi ça servait", body: [s.servait] },
      { id: "contextes", kind: "tiles", tone, title: "Comment ça se voit", body: ["Le même schéma prend des visages différents :"],
        tiles: s.contextes.map((c) => ({ title: c.label, text: c.text })) },
      { id: "facons", kind: "tiles", tone, title: "Ce qu’il me pousse à faire, selon les jours",
        tiles: s.facons.map((f) => ({ title: f.title, text: f.text.charAt(0).toUpperCase() + f.text.slice(1) })) },
      { id: "reperer", kind: "text", tone: "care", icon: "eye", title: "À repérer, pas à suivre",
        body: ["Ce sont des réactions automatiques : elles soulagent sur le moment, mais entretiennent le schéma.", "Ce qui aide se trouve dans « Dans le moment » et « Au fil des semaines »."] },
      ...schemaQuizzes(slug, part).map((quiz, i): Card => ({ id: `q${i}`, kind: "quiz", tone, title: "Une question", quiz })),
    ];
    retain = [s.phrase, `Le besoin derrière : ${s.besoin}`, "Ce qu’il me pousse à faire : à repérer, pas à suivre."];
  }

  if (part === "moment") {
    const m = s.moment;
    cards = [
      { id: "scene", kind: "text", tone, icon: "eye", title: "La scène", body: [m.scene], pro: s.pro.moment.join(" ") },
      { id: "voix", kind: "text", tone, icon: "chat", title: "La petite voix", quote: m.voice, body: ["Elle parle comme si c’était un fait."] },
      { id: "reaction", kind: "text", tone, icon: "bolt", title: "La réaction habituelle", body: [m.reaction] },
      ...m.steps.map((st, i): Card => ({ id: `step${i}`, kind: "text", tone, icon: "flag", title: `${i + 1}. ${st.title}`, body: [st.text] })),
      { id: "phrase", kind: "links", tone, icon: "user", title: "Ma phrase d’adulte sain", body: [m.phrase, "Je peux l’écrire sur ma carte-mémo."],
        links: [{ to: `/outils/carte-memo?schema=${slug}`, label: "Remplir ma carte-mémo", icon: "copy" }] },
      ...(s.autosoin.moment ? [{ id: "autosoin", kind: "text", tone, icon: "pencil", title: "En autosoin", body: [s.autosoin.moment.charAt(0).toUpperCase() + s.autosoin.moment.slice(1)] } as Card] : []),
      ...schemaQuizzes(slug, part).map((quiz, i): Card => ({ id: `q${i}`, kind: "quiz", tone, title: "Une question", quiz })),
    ];
    retain = [`La petite voix : ${m.voice}`, `Un geste : ${lc(m.steps[0].title)}.`, `Ma phrase d’adulte sain : ${m.phrase}`];
  }

  if (part === "semaines") {
    const w = s.semaines;
    cards = [
      ...w.steps.map((st, i): Card => ({ id: `pas${i}`, kind: "text", tone, icon: "flag", title: st.level, body: [st.text],
        plan: { slug, geste: st.text }, pro: i === 0 ? s.pro.semaines.join(" ") : undefined })),
      { id: "autres", kind: "text", tone, icon: "users", title: "Avec les autres", body: [w.others] },
      { id: "piege", kind: "text", tone: "care", icon: "info", title: "Le piège à éviter", body: [w.trap] },
      { id: "signe", kind: "text", tone, icon: "check", title: "Signe que ça avance", body: [w.sign] },
      ...(s.autosoin.semaines ? [{ id: "autosoin", kind: "text", tone, icon: "pencil", title: "En autosoin", body: [s.autosoin.semaines.charAt(0).toUpperCase() + s.autosoin.semaines.slice(1)] } as Card] : []),
      ...schemaQuizzes(slug, part).map((quiz, i): Card => ({ id: `q${i}`, kind: "quiz", tone, title: "Une question", quiz })),
    ];
    retain = ["Je commence par le pas le plus facile, pendant une semaine.", `Le piège : ${lc(firstSentence(w.trap))}`, `Signe que ça avance : ${lc(w.sign)}`];
  }

  const lesson: Lesson = deepFr({
    id: `schema:${slug}:${part}`, chapter: "action", minutes: meta.minutes, tone, icon: meta.icon,
    title: `${s.name} · ${meta.label}`, short: meta.short, cards, retain,
  });
  cache.set(key, lesson);
  return lesson;
}
