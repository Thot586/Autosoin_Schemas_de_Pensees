import type { QuizItem } from "./types";
import { schemaBySlug } from "../data/schemas";
import { BASES } from "../data/bases";
import { shuffle } from "./progress";

// Questions construites à partir des données du diaporama (schémas, bases).
// Elles portent sur le contenu, jamais sur la personne.
// Règle des mauvaises réponses : chacune est une idée plausible, qu'on pourrait vraiment choisir
// et que l'explication corrige ; jamais une réponse absurde qu'on écarte sans réfléchir.

/** Mélange stable des options ; renvoie la question avec l'index de la bonne réponse. */
function make(id: string, q: string, good: string, wrong: string[], explain: string): QuizItem {
  const opts = shuffle([good, ...wrong], id);
  return { id, q, options: opts, answer: opts.indexOf(good), explain };
}

const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** « être écouté(e), compris(e) et soutenu(e). » → « Être écouté(e), compris(e) et soutenu(e) » */
const asOption = (s: string) => cap(s.trim().replace(/\.$/, ""));

/**
 * Pour chaque schéma, deux « voisins » qui servent de mauvaises réponses : d'abord des schémas
 * de la même base (on doit vraiment les distinguer), complétés, pour les bases à deux schémas,
 * par un schéma d'une autre base. Choisis à la main pour éviter les paires trop proches
 * (ex. Carence affective / Imperfection, Méfiance / Vulnérabilité, Assujettissement / Contrôle émotionnel).
 */
const RIVALS: Record<string, [string, string]> = {
  "carence-affective": ["abandon", "isolement-social"],
  "abandon": ["carence-affective", "mefiance-abus"],
  "mefiance-abus": ["abandon", "imperfection-honte"],
  "isolement-social": ["mefiance-abus", "abandon"],
  "imperfection-honte": ["isolement-social", "mefiance-abus"],
  "echec": ["dependance-incompetence", "relation-fusionnelle"],
  "dependance-incompetence": ["echec", "vulnerabilite"],
  "vulnerabilite": ["dependance-incompetence", "relation-fusionnelle"],
  "relation-fusionnelle": ["vulnerabilite", "echec"],
  "assujettissement": ["sacrifice-de-soi", "ideaux-exigeants"],
  "sacrifice-de-soi": ["assujettissement", "manque-d-autocontrole"],
  "controle-emotionnel": ["ideaux-exigeants", "dependance-incompetence"],
  "ideaux-exigeants": ["controle-emotionnel", "droits-exageres"],
  "droits-exageres": ["manque-d-autocontrole", "imperfection-honte"],
  "manque-d-autocontrole": ["droits-exageres", "ideaux-exigeants"],
};
const rivals = (slug: string) => RIVALS[slug].map((r) => schemaBySlug(r)!);

/** Leçons des bases : « Quand le schéma X s'allume, que me souffle-t-il ? » (phrases des schémas voisins). */
export function phraseQuiz(slug: string): QuizItem {
  const s = schemaBySlug(slug)!;
  return make(`phrase-${slug}`, `Quand le schéma « ${s.name} » s’allume, que me souffle-t-il ?`, s.phrase, rivals(slug).map((o) => o.phrase),
    `C’est ce que répète le schéma « ${s.name} » : ${s.phrase} Cela sonne comme un fait, mais ce n’en est pas un.`);
}

/** Page d'un schéma, « Comprendre » : le besoin resté sans réponse derrière ce schéma. */
export function needQuiz(slug: string): QuizItem {
  const s = schemaBySlug(slug)!;
  return make(`besoin-${slug}`, `Derrière le schéma « ${s.name} », quel besoin est resté sans réponse ?`,
    asOption(s.besoin), rivals(slug).map((o) => asOption(o.besoin)),
    `Derrière « ${s.name} », le besoin est : ${lc(s.besoin)} Un besoin n’est jamais un défaut : on apprend à y répondre.`);
}

/** Page d'un schéma, « Dans le moment » : l'adulte sain, face à la petite voix et à une fausse force (surcompensation). */
export function adultQuiz(slug: string): QuizItem {
  const s = schemaBySlug(slug)!;
  return make(`adulte-${slug}`, "Laquelle de ces phrases vient de l’adulte sain ?", s.moment.phrase, [s.moment.voice, s.moment.force],
    `L’adulte sain répond au besoin, avec douceur et fermeté. La petite voix, elle, parle comme si c’était un fait. Et la phrase ${s.moment.force} a l’air forte, mais elle est rigide et excessive : c’est une façon de surcompenser.`);
}

/** Même question pour tous les schémas : elle n'apparaît qu'une fois dans les rappels. */
export const STEPS_QUIZ: QuizItem = {
  id: "semaines-facile",
  q: "Pour avancer sur plusieurs semaines, je commence par…",
  options: ["Le pas le moins difficile", "Le pas le plus difficile, pour aller plus vite", "Les trois pas à la fois, un peu chaque jour"],
  answer: 0,
  explain: "Un seul pas à la fois, pendant une semaine, en commençant par le moins difficile. Un écart n’efface rien : je reprends au pas suivant.",
};

/**
 * Leçons des bases : une situation d'enfance, et le besoin qui y manque.
 * Les réponses sont des besoins des listes « Ce dont l'enfant a besoin » : [base, rang dans la liste].
 * La bonne réponse n'est jamais le premier besoin, qui reprend le nom de la base.
 */
const NEED_SCENES: Record<number, { scene: string; good: [number, number]; wrong: [number, number][] }> = {
  1: { scene: "Un parent est tantôt très tendre, tantôt froid, sans qu’on sache pourquoi.", good: [1, 1], wrong: [[2, 0], [5, 0]] },
  2: { scene: "Un parent fait tout à la place de l’enfant, même ce qu’il sait déjà faire.", good: [2, 0], wrong: [[1, 1], [4, 0]] },
  3: { scene: "Un enfant console souvent son parent, et garde ses propres soucis pour lui.", good: [3, 2], wrong: [[4, 1], [2, 0]] },
  4: { scene: "À la maison, chaque erreur est relevée, et il reste peu de temps pour jouer.", good: [4, 1], wrong: [[2, 0], [5, 2]] },
  5: { scene: "Un enfant obtient tout, tout de suite, et n’entend jamais « non ».", good: [5, 1], wrong: [[1, 1], [4, 1]] },
};
const need = ([base, i]: [number, number]) => BASES[base - 1].besoins[i];

export function baseNeedQuiz(id: number): QuizItem {
  const b = BASES[id - 1];
  const sc = NEED_SCENES[id];
  return make(`base-${id}-besoin`, `${sc.scene} Quel besoin de l’enfant reste sans réponse ?`, need(sc.good), sc.wrong.map(need),
    `Il manque ceci : ${lc(need(sc.good))}. C’est un besoin de la base « ${lc(b.name)} » : ${b.besoins.map(lc).join(" ; ")}.`);
}
