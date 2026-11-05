import type { Lesson } from "../types";
import { CONTENT } from "../../data/content";
import { LIENS } from "../../data/liens";

// Chapitre « Ce qui aide » : diapos 24, 25, 89, 90 et 93.
const P4 = CONTENT.p4;
const P8 = CONTENT.p8;
const LEV_ICONS = { comprendre: "eye", ressentir: "heart", agir: "flag", lien: "users" } as const;

export const AIDE: Lesson[] = [
  {
    id: "adulte-sain", chapter: "aide", minutes: 4, icon: "user",
    title: "L’adulte sain",
    short: "La part de moi qui voit le besoin et y répond.",
    cards: [
      { id: "a1", kind: "anim", anim: "adulte", title: "Deux parts d’une même personne", pro: P4.adulte.pro },
      { id: "a2", kind: "text", icon: "heart", title: "Bienveillance et fermeté",
        body: ["L’adulte sain voit le besoin de l’enfant et y répond."],
        quote: "« Je comprends que tu aies peur. Et je fais quand même le pas. »" },
      { id: "a3", kind: "text", icon: "info", title: "L’adulte sain, ce n’est pas…", list: P4.adulte.pas,
        after: [P4.adulte.muscle] },
      { id: "a4", kind: "reflect", title: "Ma phrase d’adulte sain", noteId: "phrase-adulte",
        prompt: "Une phrase que l’adulte d’aujourd’hui pourrait me dire, avec bienveillance et fermeté.",
        hint: "Exemple : « Je peux y aller, et repartir quand je veux. » Je pourrai la recopier sur ma carte-mémo." },
      { id: "aq1", kind: "quiz", title: "Une question", quiz: {
        id: "adulte-quoi", q: "L’adulte sain, c’est…",
        options: ["La part de moi qui voit le besoin et y répond", "Un adulte parfait, qui ne se trompe jamais", "Une voix sévère qui me gronde"], answer: 0,
        explain: "Ni parfait, ni sévère : il voit le besoin de l’enfant et y répond, avec bienveillance et fermeté." } },
      { id: "aq2", kind: "quiz", title: "Une question", quiz: {
        id: "adulte-muscle", q: "L’adulte sain se renforce…",
        options: ["Avec l’entraînement, comme un muscle", "D’un seul coup, en le décidant"], answer: 0,
        explain: "Chaque petit geste choisi l’entraîne un peu plus." } },
    ],
    retain: [
      "L’adulte sain n’est ni parfait ni sévère : il voit le besoin de l’enfant et y répond.",
      "Bienveillance et fermeté : « Je comprends que tu aies peur. Et je fais quand même le pas. »",
      "Il se renforce avec l’entraînement, comme un muscle.",
    ],
  },
  {
    id: "leviers", chapter: "aide", minutes: 4, icon: "flag",
    title: "Ce qui aide à s’en sortir",
    short: "Quatre leviers qui se combinent.",
    cards: [
      { id: "v0", kind: "text", icon: "sparkles", title: "Quatre leviers",
        body: ["Comprendre seul ne suffit pas : le schéma se ressent avant de se penser.", "Quatre leviers se combinent."], pro: P4.leviers.pro },
      ...P4.leviers.items.map((l) => ({
        id: `v-${l.id}`, kind: "text" as const, icon: LEV_ICONS[l.id as keyof typeof LEV_ICONS], title: l.titre,
        body: [l.texte, `**De mon côté :** ${l.seul.charAt(0).toLowerCase()}${l.seul.slice(1)}`,
          ...(l.id === "ressentir" ? ["J’écris sur une situation d’aujourd’hui, pas sur un souvenir qui fait très mal. Écrire peut faire monter l’émotion sur le moment : si c’est trop, je fais une pause."] : [])],
      })),
      { id: "v5", kind: "text", icon: "user", title: "Le but", body: [P4.leviers.but] },
      { id: "v6", kind: "links", icon: "eye", title: "Ressentir : deux techniques de séance",
        body: ["L’imagerie et le dialogue des chaises servent à « ressentir » : revenir aux émotions, pas seulement en parler.", "Deux leçons les expliquent, avec une version simple à essayer seul(e)."],
        links: [{ to: "/apprendre/imagerie", label: "L’imagerie", icon: "eye" }, { to: "/apprendre/chaises", label: "Le dialogue des chaises", icon: "users" }] },
      { id: "vq1", kind: "quiz", title: "Une question", quiz: {
        id: "leviers-seance", q: "Quel levier se travaille d’abord en séance, avec un professionnel ?",
        options: ["Ressentir : revenir aux émotions d’origine", "Comprendre : lire ce support"], answer: 0,
        explain: "Le travail sur les émotions anciennes se fait d’abord en séance, dans un cadre sécurisant." } },
      { id: "vq2", kind: "quiz", title: "Une question", quiz: {
        id: "leviers-agir", q: "« Agir autrement », c’est…",
        options: ["Remplacer la réaction automatique par un petit geste", "Tout changer d’un coup"], answer: 0,
        explain: "Un geste par semaine, à petits pas, noté dans le carnet." } },
    ],
    retain: [
      "Comprendre, ressentir, agir autrement, être en lien : quatre leviers.",
      "Le but : renforcer l’adulte sain.",
      "Un souvenir très douloureux se travaille avec un professionnel.",
    ],
  },
  {
    id: "demander-aide", chapter: "aide", minutes: 4, icon: "phone",
    title: "Demander de l’aide, trouver un thérapeute",
    short: "Quand demander de l’aide, et à qui.",
    cards: [
      { id: "h1", kind: "text", icon: "phone", tone: "care", title: "Je demande de l’aide sans attendre si…", list: P8.aide.signes, pro: P8.aide.pro },
      { id: "h2", kind: "widget", widget: "numeros", tone: "care", title: "Les numéros à connaître", body: [P8.aide.horsFrance] },
      { id: "h3", kind: "text", icon: "heart", title: "Parler tôt, c’est prendre soin de soi",
        body: ["J’en parle à mon thérapeute ou à mon médecin traitant.", P8.aide.rappel] },
      { id: "h4", kind: "tiles", title: "Où trouver un soutien", body: [P8.soutien.chapeau],
        tiles: P8.soutien.portes.map((p) => ({ title: p.titre, text: p.texte })), pro: P8.soutien.pro },
      { id: "h5", kind: "links", icon: "users", title: "Un thérapeute formé aux schémas",
        body: ["L’annuaire de l’Institut Français de Thérapie des Schémas recense des thérapeutes formés ; certains sont aussi certifiés par la société internationale (ISST).", "J’en parle d’abord avec mon médecin traitant, ou mon équipe de soins si j’en ai une. J’apporte ma carte-mémo et mon carnet."],
        more: { body: ["Les informations de l’annuaire sont données par les thérapeutes eux-mêmes. L’Institut est une association de formation : il ne soigne pas de patients.", "Un annuaire international existe aussi, en anglais, sur le site de l’ISST."] },
        links: [{ to: LIENS.annuaire.url, label: "Ouvrir l’annuaire", icon: "external" }, { to: "/soutien", label: "Toutes les portes d’entrée", icon: "arrowRight" }] },
      { id: "hq1", kind: "quiz", title: "Une question", quiz: {
        id: "aide-pensees", q: "J’ai des pensées de me faire du mal. Que faire ?",
        options: ["Appeler le 3114 ou le 15, sans attendre", "Attendre mon prochain rendez-vous", "Faire une leçon de plus"], answer: 0,
        explain: "Le 3114 (prévention du suicide) est gratuit, 24 h/24. En danger immédiat : le 15 ou le 112." } },
      { id: "hq2", kind: "quiz", title: "Une question", quiz: {
        id: "aide-medecin", q: "La porte d’entrée la plus simple pour être orienté(e), c’est…",
        options: ["Mon médecin traitant", "Un moteur de recherche"], answer: 0,
        explain: "Il connaît mon histoire et peut m’orienter." } },
    ],
    retain: [
      "Pensées de me faire du mal, ou danger : 3114, 15 ou 112, sans attendre.",
      "Mon médecin traitant est la porte d’entrée la plus simple.",
      "Un annuaire permet de trouver un thérapeute formé aux schémas.",
    ],
  },
];
