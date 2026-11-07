import type { QuizItem } from "./types";
import { SCHEMAS, schemaBySlug } from "../data/schemas";
import { BASES } from "../data/bases";
import { shuffle } from "./progress";

// Questions construites à partir des données du diaporama (schémas, bases).
// Elles portent sur le contenu, jamais sur la personne.

/** Mélange stable des options ; renvoie la question avec l'index de la bonne réponse. */
function make(id: string, q: string, good: string, wrong: string[], explain: string): QuizItem {
  const opts = shuffle([good, ...wrong], id);
  return { id, q, options: opts, answer: opts.indexOf(good), explain };
}

const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const others = (slug: string, n: number, salt: string) => shuffle(SCHEMAS.filter((s) => s.slug !== slug), slug + salt).slice(0, n);

/** « Quelle phrase va avec le schéma X ? » */
export function phraseQuiz(slug: string): QuizItem {
  const s = schemaBySlug(slug)!;
  const wrong = others(slug, 2, "phrase").map((o) => o.phrase);
  return make(`phrase-${slug}`, `Quand le schéma « ${s.name} » s’allume, que me souffle-t-il ?`, s.phrase, wrong,
    `C’est ce que répète le schéma « ${s.name} » : ${s.phrase} Cela sonne comme un fait, mais ce n’en est pas un.`);
}

/** Distinguer la petite voix (le schéma) de la phrase d'adulte sain. */
export function adultQuiz(slug: string): QuizItem {
  const s = schemaBySlug(slug)!;
  const other = others(slug, 1, "voix")[0];
  return make(`adulte-${slug}`, "Laquelle de ces phrases vient de l’adulte sain ?", s.moment.phrase, [s.moment.voice, other.moment.voice],
    "La petite voix parle comme si c’était un fait. L’adulte sain, lui, répond au besoin, avec douceur et fermeté.");
}

/** Même question pour tous les schémas : elle n'apparaît qu'une fois dans les rappels. */
export const STEPS_QUIZ: QuizItem = {
  id: "semaines-facile",
  q: "Pour avancer sur plusieurs semaines, je commence par…",
  options: ["Le pas le moins difficile", "Le pas le plus difficile", "Les trois pas en même temps"],
  answer: 0,
  explain: "Un seul pas à la fois, en commençant par le moins difficile. Un écart n’efface rien : je reprends au pas suivant.",
};

/** « Pour la base X, l'enfant a besoin… » */
export function baseNeedQuiz(id: number): QuizItem {
  const b = BASES[id - 1];
  const wrong = shuffle(BASES.filter((x) => x.id !== b.id), `need${id}`).slice(0, 2).map((x) => x.besoins[0]);
  return make(`base-${id}-besoin`, `Pour la base « ${lc(b.name)} », de quoi un enfant a-t-il besoin ?`, b.besoins[0], wrong,
    `Pour cette base, un enfant a besoin de ceci : ${b.besoins.map(lc).join(" ; ")}.`);
}
