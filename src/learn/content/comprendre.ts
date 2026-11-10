import type { Lesson } from "../types";
import { CONTENT } from "../../data/content";

// Chapitre « Comprendre un schéma » : diapos 4, 5, 7, 8 du diaporama, une idée par carte.
const P1 = CONTENT.p1;
const P2 = CONTENT.p2;
const ORIG_ICONS = { manque: "heart", blessures: "bolt", trop: "layers", imitation: "users" } as const;

export const COMPRENDRE: Lesson[] = [
  {
    id: "schema", chapter: "comprendre", minutes: 4, icon: "eye",
    title: "Un schéma, c’est quoi ?",
    short: "Une façon apprise de voir, qui colore tout.",
    cards: [
      { id: "s1", kind: "text", icon: "sparkles", title: "Un thème de vie appris tôt",
        body: ["Un schéma, c’est un mélange de souvenirs, d’émotions, de sensations et de croyances sur soi et sur les autres.", "Il s’apprend tôt, dans l’enfance ou l’adolescence."] },
      { id: "s2", kind: "text", icon: "clock", title: P1.quoi.temps[0].titre, body: [P1.quoi.temps[0].texte] },
      { id: "s3", kind: "text", icon: "bolt", title: P1.quoi.temps[1].titre, body: [P1.quoi.temps[1].texte] },
      { id: "s4", kind: "text", icon: "heart", title: P1.quoi.temps[2].titre, body: ["D’abord une émotion forte.", "Puis une évidence : « c’est comme ça »."] },
      { id: "s5", kind: "text", icon: "eye", title: "Comme des lunettes teintées",
        body: ["Un schéma ne se discute pas comme une idée : il se vit comme une vérité.", "C’est comme des lunettes teintées : on ne les voit pas, mais elles colorent tout."] },
      { id: "s6", kind: "widget", widget: "lunettes-demo", title: "Un même message, quatre lectures",
        body: ["Je choisis des lunettes, et je regarde ce que je me dis."] },
      { id: "s7", kind: "reflect", title: "Et moi ?", prompt: "Ai-je déjà réagi beaucoup plus fort que la situation ne le justifiait ?",
        hint: "Je peux noter un exemple récent, sans le commenter. Ou passer à la suite.", noteId: "p1-fort", pro: P1.quoi.pro },
      { id: "sq1", kind: "quiz", title: "Une question", quiz: {
        id: "schema-diagnostic", q: "Un schéma, c’est…",
        options: ["Une façon de voir, apprise tôt", "Un défaut de caractère", "Une maladie, qui se diagnostique"], answer: 0,
        explain: P1.recues[0].reponse } },
      { id: "sq2", kind: "quiz", title: "Une question", quiz: {
        id: "schema-reveil", q: "Un schéma se réveille surtout…",
        options: ["Dans une situation qui rappelle une ancienne", "Quand je repense à mon enfance", "Seulement lors d’un événement grave"], answer: 0,
        explain: "Une situation d’aujourd’hui, même petite, qui rappelle l’ancienne le rallume, souvent sans qu’on le remarque." } },
      { id: "sq3", kind: "quiz", title: "Une question", quiz: {
        id: "schema-comprendre", q: "Une fois que j’ai compris mon schéma…",
        options: ["Il peut encore s’allumer : j’apprends à y répondre", "Il disparaît de lui-même", "Je peux le faire taire en raisonnant"], answer: 0,
        explain: `${P1.recues[3].reponse} Il se ressent avant de se penser : raisonner ne suffit pas toujours.` } },
    ],
    retain: [
      "Un schéma est une façon apprise tôt de se voir, de voir les autres et le monde.",
      "Il se ressent avant de se penser, comme des lunettes qu’on ne voit pas.",
      "Ce n’est ni un diagnostic, ni un défaut.",
    ],
  },
  {
    id: "origines", chapter: "comprendre", minutes: 4, icon: "wind",
    title: "D’où viennent les schémas ?",
    short: "Un besoin d’enfant resté sans réponse, et une adaptation.",
    cards: [
      { id: "o1", kind: "anim", anim: "parapluie", title: "Une histoire de parapluie" },
      { id: "o2", kind: "text", icon: "heart", title: "Au départ, un besoin sans réponse",
        body: ["Au départ, il y a toujours un besoin de base resté sans réponse.", "Chez un enfant au [[temperament|tempérament]] donné : deux enfants d’une même famille ne développent pas les mêmes schémas."] },
      { id: "o3", kind: "tiles", title: "Quatre sortes d’expériences", body: ["Elles peuvent mener à un schéma :"],
        tiles: P1.origines.types.map((t) => ({ icon: ORIG_ICONS[t.id as keyof typeof ORIG_ICONS], title: t.titre, text: t.texte })), pro: P1.origines.pro },
      { id: "o4", kind: "text", icon: "replay", title: "Hier, une adaptation",
        body: ["À l’époque, le schéma aidait à tenir.", "Aujourd’hui, il peut ne plus être adapté, et peser sur mes relations avec les autres."] },
      { id: "o5", kind: "text", icon: "shield", tone: "care", title: "Pas de coupable",
        body: ["Ni l’enfant ni l’adulte ne sont coupables du schéma.", "On cherche le besoin qui n’a pas été comblé, pas un responsable."] },
      { id: "o6", kind: "text", icon: "info", title: "Des pistes, pas des causes",
        body: ["Un même vécu donne des schémas différents selon le tempérament. On peut avoir un schéma sans souvenir précis.", "Si ces souvenirs sont pénibles, j’en parle à un thérapeute avant d’aller plus loin."] },
      { id: "oq1", kind: "quiz", title: "Une question", quiz: {
        id: "origines-adaptation", q: "À l’époque, le schéma…",
        options: ["Aidait l’enfant à tenir", "Ne lui servait à rien", "Montrait un défaut de caractère"], answer: 0,
        explain: "Le schéma était une adaptation : il aidait à tenir dans l’environnement d’alors." } },
      { id: "oq3", kind: "quiz", title: "Une question", quiz: {
        id: "origines-souvenir", q: "Je n’ai aucun souvenir précis d’une enfance difficile. Avoir un schéma…",
        options: ["Reste possible", "Est impossible", "Veut dire que j’ai oublié un événement grave"], answer: 0,
        explain: "C’est possible : un schéma peut venir d’un manque répété, jour après jour, sans événement marquant dont on se souvienne. Je n’ai pas à chercher un souvenir oublié." } },
      { id: "oq2", kind: "quiz", title: "Une question", quiz: {
        id: "origines-coupable", q: "Quand on cherche d’où vient un schéma, on cherche…",
        options: ["Le besoin qui n’a pas été comblé", "Le jour précis où tout a commencé", "Ce que j’ai fait de travers"], answer: 0,
        explain: "On cherche le besoin qui n’a pas été comblé, pour apprendre à y répondre aujourd’hui. L’enfant n’y est pour rien, et le schéma vient souvent de manques répétés, pas d’un seul jour." } },
    ],
    retain: [
      "Un schéma naît d’un besoin d’enfant resté sans réponse.",
      "C’était une adaptation : il aidait à tenir.",
      "On cherche le besoin, pas un coupable.",
    ],
  },
  {
    id: "besoins", chapter: "comprendre", minutes: 4, icon: "layers",
    title: "Les 5 besoins",
    short: "Cinq besoins de tout enfant, et ce qui se passe quand ils manquent.",
    cards: [
      { id: "n1", kind: "widget", widget: "bases", title: "Cinq besoins de base",
        body: ["Tout enfant a besoin de cinq choses. Ici, on les appelle les cinq bases.", "Chaque base a sa couleur, partout dans ce support."], pro: P2.pro },
      { id: "n2", kind: "steps", title: "Comment un schéma se forme",
        steps: P2.flux.map((f) => ({ title: f.titre, text: f.texte })) },
      { id: "n3", kind: "text", icon: "heart", title: "Un besoin n’est jamais un défaut",
        body: ["Les besoins sont légitimes, chez tout le monde.", "On ne s’en débarrasse pas : on apprend à y répondre."] },
      { id: "n4", kind: "text", icon: "users", title: "Plusieurs bases à la fois",
        body: ["On peut se reconnaître dans plusieurs schémas, de plusieurs bases.", "Je repère la base dont les phrases sonnent le plus vrai : c’est un point de départ, sans chercher à tout traiter."] },
      { id: "nq1", kind: "quiz", title: "Une question", quiz: {
        id: "besoins-liste", q: "Lequel fait partie des cinq besoins de base ?",
        options: ["Spontanéité et jeu", "Réussite et performance", "Obéissance et discipline"], answer: 0,
        explain: "Les cinq bases : sécurité et attachement ; autonomie et compétence ; exprimer besoins et émotions ; spontanéité et jeu ; limites et maîtrise de soi. On parle de confiance en ses capacités, pas de performance ; de limites bienveillantes, pas d’obéissance." } },
      { id: "nq2", kind: "quiz", title: "Une question", quiz: {
        id: "besoins-durable", q: "Un groupe de schémas peut se former quand un besoin…",
        options: ["Manque durablement", "Manque une seule fois", "Est trop fort chez l’enfant"], answer: 0,
        explain: "Le plus souvent, pas une fois : de façon répétée, sur une longue période. Et un besoin n’est jamais « trop fort » : il est légitime." } },
    ],
    retain: P2.retenir,
  },
  {
    id: "quinze", chapter: "comprendre", minutes: 3, icon: "flag",
    title: "Les 15 schémas, d’un coup d’œil",
    short: "Quinze schémas, rangés en cinq familles.",
    cards: [
      { id: "q1", kind: "widget", widget: "quinze", title: "Quinze schémas, cinq familles",
        body: ["Ils sont regroupés selon la base dont ils naissent. Inutile de tous les retenir."] },
      { id: "q2", kind: "text", icon: "info", title: "À savoir", list: P2.apercu.savoir },
      { id: "q3", kind: "text", icon: "book", title: "Pourquoi quinze ?",
        body: ["Ce support présente quinze schémas, comme le questionnaire abrégé de Young.", "Le modèle complet en décrit dix-huit."],
        more: { body: [P2.complet] } },
      { id: "qq1", kind: "quiz", title: "Une question", quiz: {
        id: "quinze-plusieurs", q: "Me reconnaître dans plusieurs schémas, c’est…",
        options: ["Fréquent : ils se réveillent selon les situations", "Rare : en général, on n’en a qu’un", "Le signe d’un trouble grave"], answer: 0,
        explain: "Plusieurs schémas peuvent coexister ; ils se réveillent selon les situations. Et je ne me reconnais pas dans tous : c’est normal aussi." } },
      { id: "qq2", kind: "quiz", title: "Une question", quiz: {
        id: "quinze-familles", q: "Les quinze schémas sont rangés en cinq familles, selon…",
        options: ["Le besoin dont ils naissent", "Leur gravité", "Leur fréquence"], answer: 0,
        explain: "Chaque famille correspond à une base, c’est-à-dire à un besoin d’enfant : le classement suit le besoin, pas la gravité." } },
    ],
    retain: [
      "Quinze schémas, rangés en cinq familles selon le besoin.",
      "Je ne me reconnais pas dans tous, et c’est normal.",
      "Un schéma n’est ni un diagnostic, ni une étiquette.",
    ],
  },
];
