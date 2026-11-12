import type { Card, Lesson, Tone } from "../types";
import { BASES } from "../../data/bases";
import { schemasOfBase } from "../../data/schemas";
import { baseNeedQuiz, phraseQuiz } from "../gen";

// Chapitre « Les 5 besoins, un par un » : diapos 9 à 18 (une base et son animation par leçon).

const RETAIN: Record<number, string[]> = {
  1: ["Base 1 : être en sécurité, aimé(e) de façon stable, écouté(e).", "Quand elle a manqué, on peut s’attendre à être quitté(e), blessé(e) ou rejeté(e) : une attente apprise, pas une certitude.", "Les schémas sont comme des lunettes : je cherche aussi ce qui les contredit."],
  2: ["Base 2 : être encouragé(e) à essayer seul(e), avoir confiance en ses capacités.", "Quand elle a manqué, on peut douter de pouvoir réussir ou se débrouiller : un doute appris, pas une mesure de ses capacités.", "La confiance vient après l’essai : je commence par un tout petit pas."],
  3: ["Base 3 : pouvoir dire ce qu’on ressent et ce qu’on veut.", "Quand elle a manqué, on peut s’effacer pour garder le lien ou éviter le conflit.", "Dire tôt et petit se reçoit mieux que dire tard et fort."],
  4: ["Base 4 : jouer, rire, avoir droit à l’erreur.", "Quand elle a manqué, on peut tout contrôler, au détriment du plaisir.", "Le jeu est un besoin, pas une récompense à mériter."],
  5: ["Base 5 : des limites claires et bienveillantes, apprendre à tolérer la frustration.", "Quand elle a manqué, on peut avoir du mal à accepter les règles ou l’effort.", "L’envie est une vague : elle monte, culmine, puis redescend."],
};

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const chunk = <T,>(xs: T[], n: number): T[][] => Array.from({ length: Math.ceil(xs.length / n) }, (_, i) => xs.slice(i * n, i * n + n));

export const BESOINS: Lesson[] = BASES.map((b) => {
  const tone = `b${b.id}` as Tone;
  const sch = schemasOfBase(b.id);
  const groups = chunk(sch, 3);
  const cards: Card[] = [
    { id: "need", kind: "text", tone, icon: "heart", title: "Ce dont l’enfant a besoin", list: b.besoins, pro: b.pro },
    { id: "manque", kind: "text", tone, icon: "info", title: "Quand ça manque", body: [b.manque] },
    ...groups.map((g, i): Card => ({
      id: `sch${i}`, kind: "tiles", tone,
      title: groups.length > 1 ? `Ses ${sch.length} schémas${i ? " (suite)" : ""}` : `Ses ${sch.length} schémas`,
      body: i === 0 ? ["Chaque schéma a sa phrase. Je regarde laquelle me parle le plus, sans me juger : c’est la voix du schéma, pas un fait."] : undefined,
      tiles: g.map((s) => ({ title: s.name, text: s.phrase + (b.quotidien[s.slug] ? ` ${b.quotidien[s.slug]}` : "") })),
    })),
    { id: "anim", kind: "anim", tone, anim: b.anim.id, title: b.anim.titre },
    // à mon tour, après l'animation : le verre (base 3) et la vague (base 5)
    ...(b.id === 3 ? [{ id: "verre-moi", kind: "widget", tone, widget: "verre", title: "Le verre, à mon tour",
      body: ["Je regarde ce qui se passe quand je me tais, et quand je dis les choses tôt, en petit."] } as Card] : []),
    ...(b.id === 5 ? [{ id: "vague-moi", kind: "widget", tone, widget: "vague", title: "La vague, à mon rythme",
      body: ["Je fais passer le temps avec le curseur, et je regarde ce que devient l’envie."] } as Card] : []),
    { id: "essai", kind: "reflect", tone, title: "À essayer cette semaine", prompt: cap(b.anim.essai),
      hint: "Je peux noter ici ce que j’ai repéré, ou passer à la suite.", noteId: `essai-b${b.id}` },
    ...(b.extra ? [{ id: "extra", kind: "text", tone, icon: "book", title: "Bon à savoir", body: [b.extra] } as Card] : []),
    { id: "q1", kind: "quiz", tone, title: "Une question", quiz: phraseQuiz(sch[(b.id + 1) % sch.length].slug) },
    { id: "q2", kind: "quiz", tone, title: "Une question", quiz: baseNeedQuiz(b.id) },
  ];
  return {
    id: `base-${b.slug}`, chapter: "besoins", minutes: 3, tone, icon: "layers",
    title: `${b.id}. ${b.name}`,
    short: b.manque,
    cards,
    retain: RETAIN[b.id],
  };
});
