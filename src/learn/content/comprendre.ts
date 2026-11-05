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
      { id: "sq1", kind: "quiz", title: "Vrai ou faux ?", quiz: {
        id: "schema-diagnostic", q: "Un schéma, c’est un diagnostic.", options: ["Faux", "Vrai"], answer: 0,
        explain: P1.recues[0].reponse } },
      { id: "sq2", kind: "quiz", title: "Une question", quiz: {
        id: "schema-reveil", q: "Un schéma se réveille surtout…",
        options: ["Dans une situation qui ressemble à une ancienne", "Au hasard, sans raison", "Seulement quand je suis seul(e)"], answer: 0,
        explain: "Une situation qui rappelle l’ancienne le rallume, souvent sans qu’on le remarque." } },
      { id: "sq3", kind: "quiz", title: "Vrai ou faux ?", quiz: {
        id: "schema-comprendre", q: "Il suffit de comprendre son schéma pour qu’il disparaisse.", options: ["Faux", "Vrai"], answer: 0,
        explain: P1.recues[3].reponse } },
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
        options: ["Aidait l’enfant à tenir", "Était un défaut de caractère", "Était choisi par l’enfant"], answer: 0,
        explain: "Le schéma était une adaptation : il aidait à tenir dans l’environnement d’alors." } },
      { id: "oq2", kind: "quiz", title: "Une question", quiz: {
        id: "origines-coupable", q: "Quand on cherche d’où vient un schéma, on cherche…",
        options: ["Le besoin qui n’a pas été comblé", "Un coupable"], answer: 0,
        explain: P1.recues[2].reponse } },
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
        options: ["Spontanéité et jeu", "Réussite et argent", "Beauté et apparence"], answer: 0,
        explain: "Les cinq bases : sécurité et attachement ; autonomie et compétence ; exprimer besoins et émotions ; spontanéité et jeu ; limites et maîtrise de soi." } },
      { id: "nq2", kind: "quiz", title: "Une question", quiz: {
        id: "besoins-durable", q: "Un groupe de schémas peut se former quand un besoin…",
        options: ["Manque durablement", "Manque une seule fois"], answer: 0,
        explain: "Pas une fois : de façon répétée, sur une longue période." } },
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
        options: ["Possible et fréquent", "Impossible", "Forcément grave"], answer: 0,
        explain: "Plusieurs schémas peuvent coexister ; ils se réveillent selon les situations." } },
      { id: "qq2", kind: "quiz", title: "Une question", quiz: {
        id: "quinze-tous", q: "Je ne me reconnais pas dans tous les schémas. C’est…",
        options: ["Normal", "Anormal"], answer: 0,
        explain: "Personne ne se reconnaît dans tous. On commence par ceux qui sonnent vrai." } },
    ],
    retain: [
      "Quinze schémas, rangés en cinq familles selon le besoin.",
      "Je ne me reconnais pas dans tous, et c’est normal.",
      "Un schéma n’est ni un diagnostic, ni une étiquette.",
    ],
  },
];
