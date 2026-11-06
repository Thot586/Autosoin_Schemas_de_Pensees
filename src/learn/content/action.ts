import type { Lesson } from "../types";
import { CONTENT } from "../../data/content";

// Chapitre « Passer à l'action » : diapos 27, 28, 37 à 39.
const P5 = CONTENT.p5;
const P6 = CONTENT.p6;
const TRAME_ICONS = { besoin: "heart", voix: "chat", reaction: "bolt", adulte: "user", geste: "flag", carte: "copy" } as const;

export const ACTION: Lesson[] = [
  {
    id: "six-mots", chapter: "action", minutes: 3, icon: "book",
    title: "Les six mots de la méthode",
    short: "Besoin, petite voix, réaction, adulte sain, geste, carte-mémo.",
    cards: [
      { id: "m0", kind: "text", icon: "chat", title: "Un même exemple pour six mots",
        body: ["Pour chaque schéma, je repère six choses.", "Exemple : je lis un groupe de messagerie, sans jamais y écrire."], pro: P5.trame.pro },
      ...P5.trame.concepts.map((c) => ({
        id: `m-${c.id}`, kind: "text" as const, icon: TRAME_ICONS[c.id as keyof typeof TRAME_ICONS], title: c.titre,
        body: [c.def], quote: c.exemple, quoteLabel: "Dans l’exemple",
      })),
      { id: "mq1", kind: "quiz", title: "Une question", quiz: {
        id: "mots-voix", q: "« Personne n’attend ce que j’ai à dire. » C’est…",
        options: ["La petite voix", "Le geste", "Le besoin"], answer: 0,
        explain: "La petite voix : la phrase que le schéma répète dans ma tête, comme si c’était un fait." } },
      { id: "mq2", kind: "quiz", title: "Une question", quiz: {
        id: "mots-geste", q: "Le geste, c’est…",
        options: ["Un petit pas concret, choisi à l’avance", "Une grande décision", "Une réaction automatique"], answer: 0,
        explain: "Un seul à la fois : il remplace la réaction automatique." } },
    ],
    retain: [
      "Besoin, petite voix, réaction automatique, adulte sain, geste, carte-mémo.",
      "Un seul geste à la fois.",
      "La carte-mémo réunit tout sur une seule carte.",
    ],
  },
  {
    id: "methode", chapter: "action", minutes: 3, icon: "search",
    title: "Trouver mon schéma, puis un pas à la fois",
    short: "Trois étapes, à mon rythme.",
    cards: [
      { id: "e1", kind: "steps", title: "Trois étapes, à mon rythme", steps: P5.comment.etapes.map((e) => ({ title: e.titre, text: e.texte })), pro: P5.comment.pro },
      { id: "e2", kind: "text", icon: "check", title: "Une fiche à cocher",
        body: ["Je lis chaque phrase. Si elle me parle, je coche, même si les exemples diffèrent."],
        list: P5.fiche.reperes.map((r) => `**${r.court}** : ${r.def}`) },
      { id: "e3", kind: "text", icon: "flag", title: "Un seul schéma pour commencer",
        body: ["Je garde un à trois schémas, jamais plus.", "Je commence par un seul : à égalité, celui qui me coûte le plus."] },
      { id: "e4", kind: "tiles", title: "Mes outils, ensuite",
        tiles: [
          { icon: "copy", title: "La carte-mémo", text: "Six lignes, dont un seul geste. Je la relis le matin." },
          { icon: "wind", title: "La pause en trois temps", text: "Stop, nommer, choisir : vingt secondes." },
          { icon: "chat", title: "Dire ce qui ne va pas", text: "Quatre temps, sans attaquer." },
          { icon: "calendar", title: "Mon plan de la semaine", text: "Un schéma, un geste, un moment." },
        ] },
      { id: "eq1", kind: "quiz", title: "Une question", quiz: {
        id: "methode-un", q: "Combien de schémas je travaille à la fois ?",
        options: ["Un seul", "Les quinze"], answer: 0,
        explain: "Un seul à la fois. Les autres attendent." } },
      { id: "eq2", kind: "quiz", title: "Une question", quiz: {
        id: "methode-semaine", q: "Combien de temps je tente un même geste ?",
        options: ["Une semaine", "Une heure"], answer: 0,
        explain: "Je le tente pendant une semaine, puis je note ce qui s’est vraiment passé." } },
    ],
    retain: [
      "Je coche ce qui me ressemble, puis je garde un à trois schémas.",
      "Je commence par un seul, avec un seul geste par semaine.",
      "Un vrai repérage se fait avec un professionnel.",
    ],
  },
  {
    id: "pause", chapter: "action", minutes: 3, icon: "wind",
    title: "La pause en trois temps",
    short: "Stop, nommer, choisir : vingt secondes.",
    cards: [
      { id: "p1", kind: "steps", title: "Stop, nommer, choisir", pro: P6.pause.pro,
        steps: P6.pause.etapes.map((e) => ({ title: e.mot, text: e.texte })) },
      { id: "p2", kind: "steps", title: "Un exemple",
        body: ["Mon chef critique mon dossier devant l’équipe. La honte monte."],
        steps: [
          { title: "Stop", text: "Trois respirations." },
          { title: "Nommer", text: "« C’est mon schéma d’imperfection, 7 sur 10. »" },
          { title: "Choisir", text: "« Je prends note. Pouvons-nous en reparler après la réunion ? »" },
        ],
        foot: "Plus tard, j’en parle à mon chef en tête-à-tête." },
      { id: "p3", kind: "widget", widget: "respiration", title: "J’essaie maintenant, à froid",
        body: ["Trois respirations lentes : j’expire plus longtemps que j’inspire."], pro: "Le son de la respiration est coupé par défaut ; avec une personne gênée par les bruits, ou qui entend des voix, préférer l’exercice sans son." },
      { id: "p4", kind: "text", icon: "info", title: "Elle me laisse le choix",
        body: [P6.pause.resume, "Je m’exerce d’abord à froid, deux ou trois fois, avant d’en avoir besoin."] },
      { id: "pq1", kind: "quiz", title: "Une question", quiz: {
        id: "pause-debut", q: "La pause en trois temps commence par…",
        options: ["Stop : je m’arrête et je respire", "Choisir un geste", "Nommer le schéma"], answer: 0,
        explain: "Stop, nommer, choisir. Vingt secondes suffisent." } },
      { id: "pq2", kind: "quiz", title: "Une question", quiz: {
        id: "pause-souffle", q: "Pendant la pause, je respire…",
        options: ["En expirant plus longtemps que j’inspire", "En retenant mon souffle"], answer: 0,
        explain: "Pieds au sol, trois respirations lentes : l’expiration plus longue que l’inspiration." } },
    ],
    retain: [
      "Stop, nommer, choisir : vingt secondes suffisent.",
      "La pause ne règle rien : elle me laisse le choix.",
      "Je m’entraîne à froid, avant d’en avoir besoin.",
    ],
  },
  {
    id: "dire", chapter: "action", minutes: 3, icon: "chat",
    title: "Dire ce qui ne va pas, sans attaquer",
    short: "Quatre temps, préparés par écrit.",
    cards: [
      { id: "d1", kind: "text", icon: "pencil", title: "Préparer, puis dire",
        body: ["Je prépare par écrit, puis je le dis en tête-à-tête.", "Pas à chaud : une fois calme."], pro: P6.dire.pro },
      ...P6.dire.temps.map((t, i) => ({
        id: `d-t${i}`, kind: "text" as const, icon: (["clock", "eye", "chat", "check"] as const)[i], title: `${i + 1}. ${t.titre}`,
        body: [t.texte], quote: P6.dire.situations[2].phrases[i], quoteLabel: "Avec un ami",
      })),
      { id: "d2", kind: "text", icon: "phone", tone: "care", title: "Si je me sens en danger", body: [P6.dire.danger] },
      { id: "dq1", kind: "quiz", title: "Une question", quiz: {
        id: "dire-moment", q: "Pour dire ce qui ne va pas, le bon moment, c’est…",
        options: ["Plus tard, une fois calme, en tête-à-tête", "Tout de suite, devant tout le monde"], answer: 0,
        explain: "Pas à chaud, pas devant les autres : j’attends d’être calme, puis je demande un court moment." } },
      { id: "dq2", kind: "quiz", title: "Une question", quiz: {
        id: "dire-fait", q: "Quelle phrase décrit un fait, sans jugement ?",
        options: ["« Samedi, notre sortie a été annulée le jour même. »", "« Tu annules toujours tout. »"], answer: 0,
        explain: "Un fait précis, sans « toujours » ni « jamais ». Puis ce que je ressens, en disant « je »." } },
    ],
    retain: [
      "Le bon moment ; le fait et mon ressenti ; ma demande ; conclure ensemble.",
      "Pas à chaud : je prépare par écrit.",
      "En danger ou sous emprise, je ne le fais pas seul(e).",
    ],
  },
];
