import type { Card, Lesson } from "../types";
import { deepFr } from "../../lib/typo";

// Exercices guidés à faire seul(e) : versions simples, adaptées de techniques de séance.
// Textes NOUVEAUX, à relire. Les « Pourquoi cette étape ? » qui parlent de mécanismes
// reprennent les sources vérifiées (docs/CONTENU.md, § 5).

const SOIN = "Si je suis suivi(e) en psychiatrie, j’en parle d’abord à mon équipe de soins. Un souvenir très douloureux se travaille avec un professionnel.";

/** Les deux premières cartes de chaque exercice : un avertissement, puis où trouver de l'aide. */
const avertissement = (technique: string): Card[] => [
  { id: "avertissement", kind: "text", icon: "info", tone: "care", title: "À savoir avant d’essayer",
    body: [`Cet exercice est une version simplifiée ${technique}. Personne ne l’a encore étudié fait seul(e).`, "Ce n’est pas une thérapie, et il ne remplace pas un suivi. Il n’est pas fait pour :"],
    list: ["un souvenir de violence ou d’abus ;", "un moment de crise, ou une émotion déjà très forte ;", "si j’entends des voix, ou si je me sens souvent « ailleurs » : j’en parle d’abord à un professionnel."] },
  { id: "orientation", kind: "links", icon: "users", title: "Pour être accompagné(e)",
    body: ["Pour travailler ces techniques avec un thérapeute, ou si l’exercice réveille trop de choses, je peux m’adresser à :"],
    list: ["mon médecin traitant, qui peut m’orienter ;", "un centre médico-psychologique (CMP), près de chez moi : les consultations sont gratuites ;", "un psychologue, ou un thérapeute formé aux schémas."],
    after: ["En danger, ou avec des pensées de me faire du mal : 3114, 15 ou 112, sans attendre."],
    links: [{ to: "/soutien", label: "Où trouver un soutien", icon: "users" }, { to: "/aide", label: "Numéros d’aide", icon: "phone" }] },
];

const imagerie: Card[] = [
  ...avertissement("de la réécriture en imagination, qui se pratique en séance avec un thérapeute"),
  { id: "entree", kind: "gate", title: "Avant de commencer",
    body: ["Cet exercice dure une dizaine de minutes. Je coche chaque phrase si elle est vraie pour moi."],
    items: [
      "Je suis au calme, assis(e), et j’ai dix minutes devant moi.",
      "Je choisis une scène **récente et légère**. Pas un souvenir d’enfance, pas un souvenir qui fait très mal.",
      "Je sais comment m’arrêter : j’ouvre les yeux, je pose les pieds au sol, je regarde autour de moi.",
    ],
    after: [SOIN] },
  { id: "avant", kind: "widget", widget: "echelle", param: "imagerie-avant", title: "Comment je me sens, avant de commencer",
    body: ["De 0 à 10, comment je me sens, là, maintenant ?"] },
  { id: "lieu", kind: "steps", title: "Mon lieu calme",
    steps: [
      { title: "Je ferme les yeux", text: "Ou je regarde un point fixe, si je préfère garder les yeux ouverts." },
      { title: "J’imagine un endroit où je me sens bien", text: "Réel ou inventé : une plage, une pièce, un jardin." },
      { title: "J’y fais attention", text: "Les couleurs, les sons, la température. Je respire lentement." },
    ],
    why: "Pour avoir un endroit où revenir si l’émotion monte.",
    more: { label: "Si aucun lieu ne vient, ou s’il me met mal à l’aise", body: ["Chez certaines personnes, ce lieu rend triste ou fait peur. Cela arrive, et ce n’est pas un échec.", "Je garde alors les yeux ouverts, et je regarde un objet que j’aime, ou je tiens un petit objet rassurant, comme un galet."] },
    ground: true },
  { id: "scene", kind: "text", icon: "eye", title: "Je choisis une scène récente et légère",
    body: ["Je choisis une situation récente où mon schéma s’est un peu allumé : 4 sur 10 au plus.", "Je la revois comme un film : où je suis, qui est là, ce qui se passe."],
    why: "Pour que l’émotion soit là, mais pas trop forte : on s’entraîne sur du léger.",
    ground: true },
  { id: "besoin", kind: "reflect", title: "Ce que je ressens, ce dont j’ai besoin", noteId: "imagerie-besoin",
    prompt: "Dans la scène, qu’est-ce que je ressens ? De quoi aurais-je eu besoin ?",
    hint: "Être rassuré(e), écouté(e), défendu(e), qu’on me laisse de la place… Un mot suffit.",
    ground: true },
  { id: "adulte", kind: "text", icon: "user", title: "Mon adulte sain entre dans la scène",
    body: ["J’imagine l’adulte que je suis aujourd’hui. Il arrive dans la scène et se met à côté de moi.", "Il dit ou fait ce dont j’avais besoin : il rassure, il défend, il pose une limite."],
    quote: "« Je suis là. Tu as le droit d’être déçu(e). »", quoteLabel: "Par exemple",
    why: "C’est le cœur de la technique : vivre, même en imagination, que le besoin reçoit une réponse. On pense que c’est ce qui change le sens de la scène.",
    ground: true },
  { id: "adulte-note", kind: "reflect", title: "Ce que dit mon adulte sain", noteId: "imagerie-adulte",
    prompt: "Qu’a-t-il dit ou fait ? Comment je me sens quand il le fait ?",
    hint: "Je peux recopier sa phrase sur ma carte-mémo." },
  { id: "geste", kind: "text", icon: "flag", title: "Je répète mon geste en imagination",
    body: ["J’imagine la prochaine fois que cette situation arrivera.", "Je me vois faire mon geste, calmement, du début à la fin."],
    why: "Imaginer les étapes d’une action, et pas seulement le résultat, aide à passer à l’acte : des études l’ont montré, notamment pour les plans « si… alors… » [@taylor1998; @gollwitzer2006; @toli2016].",
    ground: true },
  { id: "retour", kind: "steps", title: "Je reviens au présent",
    steps: [
      { title: "Je retourne un moment dans mon lieu calme", text: "Ou je regarde mon objet." },
      { title: "J’ouvre les yeux", text: "Je bouge les doigts et les pieds." },
      { title: "Je regarde autour de moi", text: "Je nomme cinq choses que je vois." },
    ],
    why: "Pour bien revenir ici et maintenant avant de reprendre ma journée. Nommer ce que je vois est le début de l’exercice des cinq sens [@nhs-grounding]." },
  { id: "apres", kind: "widget", widget: "echelle", param: "imagerie-apres", title: "Et maintenant ?",
    body: ["De 0 à 10, comment je me sens, là, maintenant ?"] },
  { id: "bilan", kind: "widget", widget: "bilan", param: "imagerie", title: "Ce qui a bougé" },
];

const chaises: Card[] = [
  ...avertissement("du dialogue des chaises, qui se pratique en séance avec un thérapeute"),
  { id: "entree", kind: "gate", title: "Avant de commencer",
    body: ["Cet exercice dure une dizaine de minutes. Je coche chaque phrase si elle est vraie pour moi."],
    items: [
      "Je suis au calme, seul(e) ou avec une personne de confiance, pour dix minutes.",
      "Je choisis une situation **récente et légère**, où la petite voix m’a parlé durement.",
      "Je sais comment m’arrêter, et je termine toujours par l’adulte sain.",
    ],
    after: ["La petite voix, ici, c’est une pensée que je me dis à moi-même, pas une voix que j’entends.", SOIN] },
  { id: "avant", kind: "widget", widget: "echelle", param: "chaises-avant", title: "Comment je me sens, avant de commencer",
    body: ["De 0 à 10, comment je me sens, là, maintenant ?"] },
  { id: "places", kind: "text", icon: "users", title: "Je prépare deux places",
    list: ["Deux chaises face à face.", "Ou deux places sur un canapé.", "Ou, sans bouger : une feuille pliée en deux colonnes."],
    why: "Pour donner à chaque part de moi sa propre place." },
  { id: "voix", kind: "text", icon: "chat", tone: "b1", title: "Sur la première place, je laisse parler la petite voix",
    body: ["Je m’assois. Je dis à voix haute, ou j’écris, ce que me dit la petite voix.", "Une ou deux phrases, pas plus. Je ne reste pas longtemps ici."],
    quote: "« Tu vas encore tout rater. »", quoteLabel: "Par exemple",
    why: "Sur sa propre place, la petite voix devient une partie de moi parmi d’autres, et plus toute la vérité. Je la garde courte : ce n’est pas elle qu’on veut entraîner.",
    ground: true },
  { id: "voix-note", kind: "reflect", title: "Ce que dit la petite voix", noteId: "chaises-voix",
    prompt: "Les mots exacts de la petite voix, en une ou deux phrases.", hint: "Je les écris tels qu’ils viennent, sans les discuter." },
  { id: "ressens", kind: "text", icon: "heart", title: "Sur l’autre place, je dis ce que ça me fait",
    body: ["Je change de place. Je regarde la place vide en face.", "Je dis ce que je ressens quand j’entends ces mots."],
    quote: "« Ça me fait mal. J’ai peur de décevoir. »", quoteLabel: "Par exemple",
    why: "Pour ressentir, au lieu de seulement réfléchir. Mettre des mots sur ce que je ressens semble aussi l’apaiser un peu.",
    ground: true },
  { id: "debout", kind: "text", icon: "user", title: "Je me lève, et l’adulte sain répond",
    body: ["Je me lève. Je suis l’adulte d’aujourd’hui.", "Je réponds à la petite voix avec fermeté : je pose une limite."],
    quote: "« Stop. Tu me parles trop durement. Je ne te crois pas. »", quoteLabel: "Par exemple",
    why: "Pour entraîner l’adulte sain à voix haute, comme une répétition : on pense que ses mots reviennent ensuite plus facilement dans la vraie vie." },
  { id: "doux", kind: "text", icon: "heart", title: "L’adulte sain parle à l’enfant",
    body: ["Je me tourne vers la deuxième place.", "Je dis, avec douceur, ce que j’avais besoin d’entendre."],
    quote: "« Tu as le droit d’essayer. Je suis là. »", quoteLabel: "Par exemple" },
  { id: "phrase", kind: "reflect", title: "Ma phrase d’adulte sain", noteId: "chaises-adulte",
    prompt: "La phrase de l’adulte sain que je veux garder.", hint: "Je peux la recopier sur ma carte-mémo." },
  { id: "fin", kind: "text", icon: "check", title: "L’adulte sain a le dernier mot",
    body: ["Je ne termine jamais sur la place de la petite voix.", "Je reste un moment debout, ou à la place de l’adulte sain, et je respire lentement."],
    why: "Pour que ce soit la voix de l’adulte sain qui reste en moi après l’exercice." },
  { id: "apres", kind: "widget", widget: "echelle", param: "chaises-apres", title: "Et maintenant ?",
    body: ["De 0 à 10, comment je me sens, là, maintenant ?"] },
  { id: "bilan", kind: "widget", widget: "bilan", param: "chaises", title: "Ce qui a bougé" },
];

/** Les exercices guidés (hors parcours : pas de questions, on peut les refaire). */
export const EXERCICES: Record<"imagerie" | "chaises", Lesson> = deepFr({
  imagerie: {
    id: "outil:imagerie", chapter: "aide", minutes: 10, icon: "eye", tone: "brand",
    title: "Imaginer autrement", short: "Une scène récente et légère, et mon adulte sain qui y répond.",
    cards: imagerie, retain: [],
  },
  chaises: {
    id: "outil:chaises", chapter: "aide", minutes: 10, icon: "users", tone: "brand",
    title: "Deux places, deux voix", short: "Faire répondre l’adulte sain à la petite voix.",
    cards: chaises, retain: [],
  },
});
