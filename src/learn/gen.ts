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
  return make(`phrase-${slug}`, `Quelle phrase va avec le schéma « ${s.name} » ?`, s.phrase, wrong,
    `La phrase du schéma « ${s.name} » : ${s.phrase} Ce n’est pas un fait : c’est ce que le schéma répète.`);
}

/** « Le besoin derrière le schéma X, c'est… » */
export function besoinQuiz(slug: string): QuizItem {
  const s = schemaBySlug(slug)!;
  const wrong = others(slug, 2, "besoin").filter((o) => o.besoin !== s.besoin).map((o) => o.besoin);
  const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
  return make(`besoin-${slug}`, `Derrière le schéma « ${s.name} », il y a le besoin…`, cap(s.besoin), wrong.map(cap),
    `Derrière ce schéma, un besoin légitime : ${s.besoin}`);
}

/** Distinguer la petite voix (le schéma) de la phrase d'adulte sain. */
export function adultQuiz(slug: string): QuizItem {
  const s = schemaBySlug(slug)!;
  const other = others(slug, 1, "voix")[0];
  return make(`adulte-${slug}`, "Laquelle est une phrase d’adulte sain ?", s.moment.phrase, [s.moment.voice, other.moment.voice],
    "La petite voix parle comme si c’était un fait. L’adulte sain répond au besoin, avec bienveillance et fermeté.");
}

/** Même question pour tous les schémas : elle n'apparaît qu'une fois dans les rappels. */
export const STEPS_QUIZ: QuizItem = {
  id: "semaines-facile",
  q: "Pour avancer sur plusieurs semaines, je commence par…",
  options: ["Le pas le plus facile", "Le pas le plus difficile", "Les trois pas en même temps"],
  answer: 0,
  explain: "Un seul pas à la fois, en commençant par le plus facile. Un écart n’efface rien : je reprends au pas suivant.",
};

/** « Pour la base X, l'enfant a besoin… » */
export function baseNeedQuiz(id: number): QuizItem {
  const b = BASES[id - 1];
  const wrong = shuffle(BASES.filter((x) => x.id !== b.id), `need${id}`).slice(0, 2).map((x) => x.besoins[0]);
  return make(`base-${id}-besoin`, `Base « ${b.name} » : de quoi l’enfant a-t-il besoin ?`, b.besoins[0], wrong,
    `${b.name} : ${b.besoins.map(lc).join(" ; ")}.`);
}
