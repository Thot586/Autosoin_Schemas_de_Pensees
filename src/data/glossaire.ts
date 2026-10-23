import { deepFr } from "../lib/typo";

export interface Entry { id: string; term: string; def: string; more?: string; to?: string; toLabel?: string }

// Définitions : reprises du diaporama (pages « Trame générale », « Un schéma, c’est quoi ? », notes).
export const GLOSSAIRE: Entry[] = deepFr<Entry[]>([
  { id: "schema", term: "Schéma", def: "Un thème de vie appris tôt : des souvenirs, des émotions, des sensations et des croyances sur soi et sur les autres.", more: "Un schéma n’est ni un diagnostic ni un défaut de caractère. C’est une façon apprise de se voir, de voir les autres et le monde.", to: "/comprendre", toLabel: "Comprendre un schéma" },
  { id: "besoin", term: "Besoin (base)", def: "Ce dont tout enfant a besoin : sécurité, autonomie, expression, jeu, limites. Il est légitime.", more: "Quand l’une de ces cinq bases manque durablement, un groupe de schémas peut se former.", to: "/besoins", toLabel: "Les 5 besoins" },
  { id: "domaine", term: "Domaine de schémas", def: "Le groupe de schémas qui se développe quand un besoin de l’enfant (une base) manque.", more: "Exemple : quand la sécurité et l’attachement manquent, c’est le domaine « Séparation et rejet ».", to: "/besoins", toLabel: "Les 5 besoins" },
  { id: "petite-voix", term: "Petite voix", def: "La phrase que le schéma répète dans ma tête, comme si c’était un fait.", more: "Exemple : « Personne n’attend ce que j’ai à dire. »", to: "/trouver", toLabel: "Trame générale" },
  { id: "reaction", term: "Réaction automatique", def: "Capituler, éviter ou surcompenser : elle protège sur le moment, mais entretient le schéma.", to: "/entretien", toLabel: "Comment un schéma s’entretient" },
  { id: "capituler", term: "Capituler", def: "« Je fais comme si c’était vrai. »", more: "Exemple : se dévaloriser, choisir des proches critiques.", to: "/entretien#reactions", toLabel: "Les trois réactions" },
  { id: "eviter", term: "Éviter", def: "« Je fuis ce qui le réveille. »", more: "Exemple : ne pas se confier, fuir l’intimité.", to: "/entretien#reactions", toLabel: "Les trois réactions" },
  { id: "surcompenser", term: "Surcompenser", def: "« Je fais l’inverse, en excès. »", more: "Exemple : critiquer les autres, vouloir paraître parfait(e). La surcompensation peut ressembler à de la confiance en soi : la différence, c’est qu’elle est rigide et excessive.", to: "/entretien#reactions", toLabel: "Les trois réactions" },
  { id: "adulte-sain", term: "Adulte sain", def: "La part de moi, adulte d’aujourd’hui, qui voit le besoin et y répond, avec bienveillance et fermeté.", more: "Ce n’est pas un adulte parfait, ni une voix qui gronde, ni penser positif à tout prix. Cette part de moi se renforce avec l’entraînement, comme un muscle.", to: "/s-en-sortir#adulte-sain", toLabel: "L’adulte sain" },
  { id: "geste", term: "Geste", def: "Un petit pas concret, choisi à l’avance, qui remplace la réaction automatique. Un seul à la fois.", to: "/outils/carte-memo", toLabel: "La carte-mémo" },
  { id: "carte-memo", term: "Carte-mémo", def: "Ma fiche personnelle : le schéma, la petite voix, le besoin, le geste et ma phrase d’adulte sain.", more: "Une carte par schéma, trois au maximum.", to: "/outils/carte-memo", toLabel: "Ma carte-mémo" },
  { id: "ysq", term: "YSQ-2", def: "Young Schema Questionnaire, 2e version. La forme courte (S2) compte 75 questions et mesure 15 schémas.", more: "C’est un auto-questionnaire de repérage, pas un diagnostic : il se passe et s’interprète de préférence avec un professionnel formé. Version française : Mauchand, Lachenal-Chevallet et Cottraux, L’Encéphale, 2011 ; 37 : 138-143.", to: "/trouver", toLabel: "Trouver mon schéma" },
  { id: "desc", term: "Méthode DESC", def: "Décrire, exprimer, spécifier, conclure : une façon de dire ce qui ne va pas, sans attaquer (Bower et Bower, années 1970).", to: "/outils/dire", toLabel: "Dire ce qui ne va pas" },
  { id: "schema-therapie", term: "Thérapie des schémas", def: "Approche de thérapie développée par Jeffrey Young et ses collègues, centrée sur les besoins fondamentaux, les schémas et les façons d’y réagir.", more: "Ce support s’en inspire. Il prépare à une thérapie ou la complète ; il ne la remplace pas.", to: "/pour-la-suite/lectures", toLabel: "Pour aller plus loin" },
]);
export const termById = (id: string): Entry | undefined => GLOSSAIRE.find((e) => e.id === id);
