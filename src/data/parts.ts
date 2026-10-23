import type { Part } from "./types";
import { deepFr } from "../lib/typo";

export const PARTS: Part[] = deepFr<Part[]>([
  { n: 1, slug: "comprendre", path: "/comprendre", title: "Comprendre un schéma", short: "Ce que c’est, d’où il vient.", intro: "Un thème de vie appris tôt : ce que c’est, et d’où il vient.", minutes: 5 },
  { n: 2, slug: "besoins", path: "/besoins", title: "Les 5 besoins", short: "Cinq besoins, quinze schémas.", intro: "Cinq besoins de l’enfant, et les quinze schémas qui naissent quand ils manquent.", minutes: 8 },
  { n: 3, slug: "entretien", path: "/entretien", title: "Comment un schéma s’entretient", short: "Le cercle, les trois réactions, les signes.", intro: "Le cercle qui l’entretient, les trois façons de réagir et les signes qui le révèlent.", minutes: 6 },
  { n: 4, slug: "s-en-sortir", path: "/s-en-sortir", title: "Ce qui aide à s’en sortir", short: "L’adulte sain et les leviers.", intro: "L’adulte sain, et ce qui aide à renforcer cette part de soi.", minutes: 5 },
  { n: 5, slug: "trouver", path: "/trouver", title: "Trouver mon schéma", short: "Repérer mes schémas, choisir par où commencer.", intro: "Passer à l’action, pas à pas : repérer mes schémas et choisir par où commencer.", minutes: 10 },
  { n: 6, slug: "outils", path: "/outils", title: "Mes outils", short: "Carte-mémo, pause, parler et dire.", intro: "La carte-mémo, la pause en trois temps, et comment en parler.", minutes: 10 },
  { n: 7, slug: "schemas", path: "/schemas", title: "Mes schémas, un par un", short: "Comprendre, dans le moment, au fil des semaines.", intro: "Pour chaque schéma : le comprendre, puis que faire dans le moment, puis comment avancer au fil des semaines.", minutes: 0 },
  { n: 8, slug: "pour-la-suite", path: "/pour-la-suite", title: "Pour la suite", short: "Aide, soutien, carnet, lectures.", intro: "Quand demander de l’aide, où trouver un soutien, mon carnet et les lectures.", minutes: 5 },
]);

export const partOf = (n: number): Part => PARTS[n - 1];
