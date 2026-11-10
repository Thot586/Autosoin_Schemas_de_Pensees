import type { Lesson } from "../types";
import { CONTENT } from "../../data/content";

// Chapitre « Comment un schéma agit » : diapos 20 à 22.
const P3 = CONTENT.p3;
const R = P3.reactions.cartes;

export const CERCLE: Lesson[] = [
  {
    id: "cercle", chapter: "cercle", minutes: 4, icon: "replay",
    title: "Le cercle qui entretient un schéma",
    short: "Une situation, une émotion, une réaction… et le schéma se confirme.",
    cards: [
      { id: "c1", kind: "anim", anim: "cercle", title: "Quatre étapes, un cercle", pro: P3.cercle.pro },
      { id: "c2", kind: "text", icon: "bolt", title: "Ce qui confirme le schéma",
        body: ["Ce n’est pas la situation seule qui confirme le schéma.", "C’est souvent la réaction automatique, qui provoque ce qu’on redoutait."] },
      { id: "c3", kind: "steps", title: "On peut sortir du cercle",
        body: ["À chaque étape, je peux agir :"],
        steps: [
          { title: "Repérer la situation", text: "« Tiens, ça ressemble à avant. »" },
          { title: "Nommer l’émotion", text: "« C’est de la peur, 7 sur 10. »" },
          { title: "Choisir une autre réaction", text: "Un petit geste, choisi à l’avance." },
        ] },
      { id: "c4", kind: "reflect", title: "Et moi ?", noteId: "p3-cercle",
        prompt: "Une situation récente, peu chargée, en quatre temps : la situation, l’émotion, ma réaction, ce qui s’est passé ensuite.",
        hint: "Je choisis une situation légère pour commencer. Ou je passe à la suite." },
      { id: "cq1", kind: "quiz", title: "Une question", quiz: {
        id: "cercle-confirme", q: "Dans le cercle, qu’est-ce qui confirme souvent le schéma ?",
        options: ["Ma réaction automatique", "La situation, à elle seule", "Ce que les autres pensent de moi"], answer: 0,
        explain: "La réaction automatique provoque souvent ce qu’on redoutait. Par exemple : par peur d’être rejeté(e), je ne propose jamais rien… et personne ne m’invite. « Tu vois, c’est toujours pareil. »" } },
      { id: "cq2", kind: "quiz", title: "Une question", quiz: {
        id: "cercle-sortir", q: "Où peut-on interrompre le cercle ?",
        options: ["À chaque étape", "Avant la situation, en l’évitant", "Seulement en séance, avec un thérapeute"], answer: 0,
        explain: "Repérer la situation, nommer l’émotion, choisir une autre réaction : chaque étape est une porte de sortie, et je peux m’y exercer. Éviter la situation soulage, mais entretient le schéma." } },
    ],
    retain: CONTENT.p4.retenir3,
  },
  {
    id: "reactions", chapter: "cercle", minutes: 4, icon: "users",
    title: "Trois façons de réagir",
    short: "Capituler, éviter, surcompenser : trois réflexes à repérer.",
    cards: [
      { id: "r1", kind: "anim", anim: "reactions", title: "Se figer, fuir, combattre", pro: P3.reactions.pro },
      { id: "r2", kind: "text", tone: "b1", title: R[0].titre, quote: R[0].phrase, body: [`Par exemple : ${R[0].exemple.charAt(0).toLowerCase()}${R[0].exemple.slice(1)}`] },
      { id: "r3", kind: "text", tone: "b1", title: R[1].titre, quote: R[1].phrase, body: [`Par exemple : ${R[1].exemple.charAt(0).toLowerCase()}${R[1].exemple.slice(1)}`] },
      { id: "r4", kind: "text", tone: "b1", title: R[2].titre, quote: R[2].phrase,
        body: [`Par exemple : ${R[2].exemple.charAt(0).toLowerCase()}${R[2].exemple.slice(1)}`, "Cela peut ressembler à de la confiance en soi. La différence : c’est rigide et excessif."] },
      { id: "r5", kind: "text", tone: "care", icon: "eye", title: "À repérer, pas à suivre",
        body: [P3.reactions.conclusion, "Chacun utilise les trois, selon les jours, avec souvent une préférence."] },
      { id: "rq1", kind: "quiz", title: "Une question", quiz: {
        id: "reactions-eviter", q: "Avec un schéma d’échec, je ne postule jamais à un nouveau poste. C’est…",
        options: ["Éviter", "Capituler", "Surcompenser"], answer: 0,
        explain: "Éviter, c’est fuir ce qui réveille le schéma : ici, ne jamais se présenter. Cela soulage sur le moment, mais le schéma n’est jamais démenti." } },
      { id: "rq2", kind: "quiz", title: "Une question", quiz: {
        id: "reactions-capituler", q: "Je me dévalorise sans cesse : « De toute façon, je suis nul(le). » C’est…",
        options: ["Capituler", "Éviter", "Surcompenser"], answer: 0,
        explain: "Capituler, c’est faire comme si le schéma disait vrai : par exemple se dévaloriser, choisir des proches critiques." } },
      { id: "rq3", kind: "quiz", title: "Une question", quiz: {
        id: "reactions-surcompenser", q: "Avec un schéma d’imperfection, je veux paraître parfait(e) et je critique vite les autres. C’est…",
        options: ["Surcompenser", "Éviter", "Capituler"], answer: 0,
        explain: "Surcompenser, c’est faire l’inverse, en excès. Cela peut ressembler à de la confiance en soi, mais c’est rigide. Comme les deux autres réactions, cela soulage sur le moment et entretient le schéma." } },
    ],
    retain: [
      "Capituler, éviter, surcompenser : trois réflexes (se figer, fuir, combattre).",
      "Ils soulagent sur le moment, mais entretiennent le schéma.",
      "On les repère : ce ne sont pas des conseils.",
    ],
  },
  {
    id: "signes", chapter: "cercle", minutes: 3, icon: "bolt",
    title: "Reconnaître un schéma allumé",
    short: "Quatre signes, et une question qui aide.",
    cards: [
      { id: "g1", kind: "tiles", title: "Quatre signes", pro: P3.signes.pro,
        tiles: [
          { icon: "bolt", title: P3.signes.items[0].titre, text: P3.signes.items[0].texte },
          { icon: "clock", title: P3.signes.items[1].titre, text: P3.signes.items[1].texte },
          { icon: "chat", title: P3.signes.items[2].titre, text: P3.signes.items[2].texte },
          { icon: "gear", title: P3.signes.items[3].titre, text: P3.signes.items[3].texte },
        ] },
      { id: "g2", kind: "text", icon: "info", title: "Des signes, pas des preuves",
        body: ["Ces signes ne prouvent pas qu’un schéma est en jeu.", "Ils invitent à ralentir."] },
      { id: "g3", kind: "widget", widget: "age", title: "La question qui aide",
        body: ["Quel âge ai-je l’impression d’avoir, là, maintenant ?"] },
      { id: "gq1", kind: "quiz", title: "Une question", quiz: {
        id: "signes-emotion", q: "Lequel est un signe qu’un schéma s’est allumé ?",
        options: ["Une émotion plus forte que la situation", "Une émotion à la mesure de la situation", "Une émotion qui retombe vite"], answer: 0,
        explain: "Une émotion trop forte, ou trop longue, pour la situation : c’est le moment de ralentir." } },
      { id: "gq2", kind: "quiz", title: "Une question", quiz: {
        id: "signes-absolus", q: "« Il ne me répond jamais. Personne ne m’écoute. » Quel signe se repère ici ?",
        options: ["Des mots absolus", "Un air de déjà-vu", "Le pilote automatique"], answer: 0,
        explain: "« Toujours », « jamais », « personne », « tout le monde » : ce sont des mots absolus." } },
    ],
    retain: [
      "Émotion trop forte, déjà-vu, mots absolus, pilote automatique : quatre signes.",
      "Ce sont des invitations à ralentir, pas des preuves.",
      "La question qui aide : « Quel âge ai-je l’impression d’avoir, là, maintenant ? »",
    ],
  },
];
