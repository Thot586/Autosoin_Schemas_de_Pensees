import type { Lesson } from "../types";

// Chapitre « Avant de commencer » — textes NOUVEAUX (écrits pour le web), à relire.
// Faits sur la thérapie des schémas : voir docs/CONTENU.md (§ sources vérifiées).

export const AVANT: Lesson[] = [
  {
    id: "bienvenue", chapter: "avant", minutes: 2, icon: "sparkles",
    title: "Bienvenue",
    short: "Comment marche ce support, et comment m’arrêter quand je veux.",
    cards: [
      { id: "b1", kind: "text", icon: "sparkles", title: "Comprendre ses schémas",
        body: ["Ce support explique les [[schema|schémas]] : des façons de voir et de réagir, apprises tôt dans la vie.", "Il s’inspire de la thérapie des schémas de Jeffrey Young."] },
      { id: "b2", kind: "text", icon: "book", title: "Carte après carte",
        body: ["Je lis une carte, puis j’appuie sur « Suivant ».", "Je peux revenir en arrière, ou écouter le texte avec le bouton « Écouter ».", "Un mot surligné s’explique : je passe la souris dessus, ou je le touche pour lire le détail."] },
      { id: "b3", kind: "text", icon: "clock", title: "À mon rythme",
        body: ["Une leçon dure 2 à 5 minutes. Une par jour suffit.", "Je peux quitter à tout moment : je reprendrai au même endroit."] },
      { id: "b4", kind: "text", icon: "star", title: "Des questions pour retenir",
        body: ["À la fin des leçons, il y a quelques questions.", "Ce n’est pas un examen : chercher la réponse aide à retenir, même quand on se trompe.", "Les idées reviennent ensuite dans « Mon rappel du jour »."] },
      { id: "b5", kind: "text", icon: "heart", tone: "care", title: "Si ça ne va pas",
        body: ["Si un exercice me bouleverse, je m’arrête et je fais une pause.", "Le bouton « Aide », en haut de l’écran, donne les numéros utiles."] },
      { id: "bq1", kind: "quiz", title: "Une question", quiz: {
        id: "bienvenue-stop", q: "Si un exercice me bouleverse, que puis-je faire ?",
        options: ["M’arrêter et faire une pause", "Continuer coûte que coûte", "Tout recommencer depuis le début"], answer: 0,
        explain: "Je peux m’arrêter à tout moment. Si ça ne passe pas, j’en parle à un professionnel ; le bouton « Aide » donne les numéros utiles." } },
      { id: "bq2", kind: "quiz", title: "Une question", quiz: {
        id: "bienvenue-questions", q: "Les questions à la fin des leçons servent à…",
        options: ["Mieux retenir les idées", "Me donner une note", "Poser un diagnostic"], answer: 0,
        explain: "Ce n’est pas un examen. Chercher la réponse aide la mémoire, même quand on se trompe." } },
    ],
    retain: [
      "Carte après carte, à mon rythme : une leçon par jour suffit.",
      "Je peux m’arrêter à tout moment, et reprendre plus tard.",
      "Le bouton « Aide » est toujours en haut de l’écran.",
    ],
  },
  {
    id: "therapie", chapter: "avant", minutes: 5, icon: "users",
    title: "La thérapie des schémas",
    short: "D’où vient cette approche, comment elle se pratique, ce qu’on en sait.",
    cards: [
      { id: "t1", kind: "text", icon: "users", title: "Une psychothérapie",
        body: ["La thérapie des schémas est une psychothérapie : un travail en séances, avec un thérapeute formé à cette approche.", "Elle a été créée par le psychologue américain Jeffrey Young, qui l’a décrite pour la première fois en 1990."],
        more: { body: ["Elle a d’abord été pensée pour des difficultés durables que la thérapie cognitive classique aidait peu [@taylor2017].", "Jeffrey Young venait de la thérapie cognitive d’Aaron Beck. Il y a ajouté des idées venues d’autres approches : l’attachement, les thérapies psychodynamiques et un travail sur les émotions [@kellogg2006].", "Ouvrage de référence : [n@young2024fr], traduction de [n@young2003]."] } },
      { id: "t2", kind: "text", icon: "clock", title: "Pour qui ?",
        body: ["Elle a été pensée pour des difficultés anciennes et durables, qui reviennent souvent : dans les relations, dans l’image de soi, dans les émotions.", "Par exemple un trouble de la personnalité, quand la thérapie cognitive classique n’aidait pas assez."] },
      { id: "t3", kind: "text", icon: "heart", title: "Son idée centrale",
        body: ["Tout enfant a des besoins de base. Quand l’un d’eux manque durablement, des schémas peuvent se former.", "Adulte, ils se réveillent encore, souvent sans qu’on s’en rende compte."] },
      { id: "t4", kind: "anim", anim: "therapie", title: "Comment ça se passe" },
      { id: "t5", kind: "text", icon: "chat", title: "En séance, on peut aussi…",
        list: ["Imaginer une scène ancienne, en sécurité, pour y répondre autrement : c’est l’[[imagerie|imagerie]].", "Parler à une part de soi en changeant de chaise : c’est le [[chaises|dialogue des chaises]]."],
        after: ["En séance, ces exercices se font avec le thérapeute. Deux leçons, plus loin dans le parcours, les expliquent, avec une version à faire seul(e)."] },
      { id: "t6", kind: "text", icon: "check", title: "Est-ce que ça marche ?",
        body: ["Elle a surtout été étudiée chez des personnes ayant un trouble de la personnalité, en particulier le trouble borderline.", "Dans ces études, elle aide à réduire les difficultés et à mieux vivre au quotidien. Moins de personnes arrêtent en cours de route qu’avec les autres prises en charge étudiées."],
        more: { body: ["Trois essais randomisés [@giesenbloo2006; @bamelis2014; @arntz2022] et une méta-analyse [@zhang2023]. Un clic sur une source ouvre sa fiche, avec sa fiabilité."] } },
      { id: "t6b", kind: "text", icon: "info", title: "Ce qu’on ne sait pas encore",
        body: ["Les études sont encore peu nombreuses. Pour la dépression, l’anxiété, les traumatismes ou les troubles alimentaires, les résultats sont encourageants mais encore fragiles.", "C’est une thérapie longue : souvent deux à trois ans dans les grandes études sur le trouble borderline.", "J’en parle avec un professionnel (mon médecin traitant, ou mon équipe de soins si j’en ai une) pour savoir si elle me convient."],
        more: { label: "Sources", body: ["Études encore peu nombreuses : [n@taylor2017] ; [n@peeters2022].", "Durée : 3 ans de traitement dans un essai, 2 ans dans l’autre [@giesenbloo2006; @arntz2022]."] } },
      { id: "t7", kind: "text", icon: "book", title: "Et ce support ?",
        body: ["Ce support n’est pas une thérapie. Il en reprend les idées de base.", "Il peut aider à se préparer, à attendre un rendez-vous, ou à compléter un suivi."] },
      { id: "tq1", kind: "quiz", title: "Une question", quiz: {
        id: "therapie-quoi", q: "La thérapie des schémas, c’est…",
        options: ["Une psychothérapie, avec un thérapeute formé", "Un médicament", "Un test pour poser un diagnostic"], answer: 0,
        explain: "C’est une psychothérapie : un travail en séances avec un thérapeute formé à cette approche." } },
      { id: "tq3", kind: "quiz", title: "Une question", quiz: {
        id: "therapie-duree", q: "Une thérapie des schémas dure en général…",
        options: ["Plusieurs mois, parfois plusieurs années", "Une seule séance", "Un week-end"], answer: 0,
        explain: "C’est un travail long : souvent deux à trois ans dans les grandes études sur le trouble borderline [@giesenbloo2006; @arntz2022]." } },
      { id: "tq2", kind: "quiz", title: "Une question", quiz: {
        id: "therapie-support", q: "Ce support peut-il remplacer une thérapie ?",
        options: ["Non : il prépare ou complète un suivi", "Oui, si je fais toutes les leçons"], answer: 0,
        explain: "Il aide à comprendre. Le travail sur les émotions anciennes se fait avec un professionnel." } },
    ],
    retain: [
      "La thérapie des schémas est une psychothérapie, créée par Jeffrey Young.",
      "Elle relie les difficultés d’aujourd’hui à des besoins d’enfant restés sans réponse.",
      "Ce support s’en inspire, mais ne la remplace pas.",
    ],
  },
  {
    id: "limites", chapter: "avant", minutes: 3, icon: "shield",
    title: "Ce que ce support ne fait pas",
    short: "Ses limites, pour l’utiliser en sécurité.",
    cards: [
      { id: "l1", kind: "text", icon: "check", title: "Ce qu’il peut faire",
        list: ["M’aider à comprendre mes réactions", "Mettre des mots sur ce que je vis", "Préparer une séance avec un professionnel", "Essayer un petit geste par semaine"] },
      { id: "l2", kind: "text", icon: "shield", title: "Ce n’est pas un diagnostic",
        body: ["Cocher une phrase n’est pas un test.", "Un vrai repérage se fait avec un professionnel, par exemple avec un questionnaire, le [[ysq|YSQ]]."] },
      { id: "l3", kind: "text", icon: "heart", title: "Ce n’est pas un soin",
        body: ["Il ne remplace ni un médecin, ni un psychologue, ni un traitement.", "Je ne change pas mon traitement sans en parler à mon médecin."] },
      { id: "l4", kind: "links", icon: "phone", tone: "care", title: "Pas pendant une crise",
        body: ["Quand je vais très mal, ce n’est pas le moment de lire ce support.", "Je demande de l’aide d’abord. Je reviendrai plus tard."],
        links: [{ to: "/aide", label: "Voir les numéros d’aide", icon: "phone" }] },
      { id: "l5", kind: "text", icon: "eye", title: "Il peut réveiller des souvenirs",
        body: ["Parler de l’enfance peut faire remonter des souvenirs pénibles.", "Si c’est trop lourd, je m’arrête, et j’en parle à un soignant."] },
      { id: "l6", kind: "text", icon: "info", title: "Pas encore évalué",
        body: ["Ce support n’a pas été évalué par une étude scientifique."],
        more: { body: ["Les quinze schémas sont rangés en cinq familles, selon le besoin dont ils naissent : c’est un repère pour apprendre, pas une classification démontrée.", "Les exemples sont des pistes : chacun les adapte avec ses mots."] } },
      { id: "l7", kind: "text", icon: "lock", title: "Mes réponses restent ici",
        body: ["Ce que j’écris reste sur cet appareil. Rien n’est envoyé sur internet.", "Si je prête mon téléphone, quelqu’un pourrait le lire. Je peux tout effacer dans « Réglages »."] },
      { id: "lq1", kind: "quiz", title: "Une question", quiz: {
        id: "limites-cocher", q: "J’ai coché « Ça sonne vrai » pour un schéma. Cela veut dire…",
        options: ["Que cette phrase me parle : c’est un point de départ", "Que j’ai un diagnostic", "Que je dois changer de traitement"], answer: 0,
        explain: "Cocher n’est ni un test ni un diagnostic. C’est un repère pour choisir par où commencer." } },
      { id: "lq2", kind: "quiz", title: "Une question", quiz: {
        id: "limites-crise", q: "Je vais très mal en ce moment. Le mieux est de…",
        options: ["Demander de l’aide d’abord", "Faire toutes les leçons d’un coup"], answer: 0,
        explain: "Dans les moments très difficiles, l’aide d’une personne passe avant. Les numéros sont derrière le bouton « Aide »." } },
    ],
    retain: [
      "Ce support aide à comprendre : ce n’est ni un diagnostic, ni un soin.",
      "En cas de crise, je demande de l’aide d’abord.",
      "Mes réponses restent sur cet appareil.",
    ],
  },
];
