import { BASES } from "./data/bases";
import { PARTS } from "./data/parts";
import { SCHEMAS } from "./data/schemas";
import type { IconName } from "./components/Icon";

export interface NavLeaf { label: string; to: string; hint?: string }
export interface NavGroup { id: string; label: string; to?: string; icon?: IconName; leaves?: NavLeaf[]; mega?: { base: number; title: string; leaves: NavLeaf[] }[] }

export const NAV: NavGroup[] = [
  {
    id: "comprendre", label: "Comprendre", to: "/comprendre", icon: "book",
    leaves: [PARTS[0], PARTS[1], PARTS[2], PARTS[3]].map((p) => ({ label: `${p.n}. ${p.title}`, to: p.path, hint: p.short })),
  },
  {
    id: "trouver", label: "Trouver mon schéma", to: "/trouver", icon: "search",
    leaves: [
      { label: "Les trois étapes", to: "/trouver", hint: "Trame générale et méthode" },
      { label: "Ma fiche à cocher", to: "/trouver/fiche", hint: "Je coche ce qui me ressemble" },
      { label: "Mes priorités", to: "/trouver/priorites", hint: "Je garde un à trois schémas" },
    ],
  },
  {
    id: "schemas", label: "Mes schémas", to: "/schemas", icon: "layers",
    mega: BASES.map((b) => ({ base: b.id, title: b.name, leaves: SCHEMAS.filter((s) => s.base === b.id).map((s) => ({ label: s.name, to: `/schemas/${s.slug}` })) })),
  },
  {
    id: "outils", label: "Mes outils", to: "/outils", icon: "sliders",
    leaves: [
      { label: "Ma carte-mémo", to: "/outils/carte-memo", hint: "Une carte par schéma" },
      { label: "La pause en trois temps", to: "/outils/pause", hint: "Respirer, nommer, choisir" },
      { label: "Dire ce qui ne va pas", to: "/outils/dire", hint: "Sans attaquer" },
      { label: "Mon plan pour la semaine", to: "/outils/plan", hint: "Un schéma, un geste" },
    ],
  },
  {
    id: "suite", label: "Pour la suite", to: "/pour-la-suite", icon: "flag",
    leaves: [
      { label: "Quand demander de l’aide", to: "/pour-la-suite/aide" },
      { label: "Où trouver un soutien", to: "/pour-la-suite/soutien" },
      { label: "Mon carnet de schémas", to: "/pour-la-suite/carnet" },
      { label: "À retenir", to: "/pour-la-suite#a-retenir" },
      { label: "Pour aller plus loin", to: "/pour-la-suite/lectures" },
    ],
  },
];

/** Les 5 onglets de la barre du bas (téléphone). */
export const TABS: { to: string; label: string; icon: IconName; match: (p: string) => boolean }[] = [
  { to: "/", label: "Accueil", icon: "home", match: (p) => p === "/" },
  { to: "/comprendre", label: "Comprendre", icon: "book", match: (p) => ["/comprendre", "/besoins", "/entretien", "/s-en-sortir"].some((x) => p === x || p.startsWith(x + "/")) },
  { to: "/trouver", label: "Trouver", icon: "search", match: (p) => p === "/trouver" || p.startsWith("/trouver/") },
  { to: "/schemas", label: "Schémas", icon: "layers", match: (p) => p === "/schemas" || p.startsWith("/schemas/") },
  { to: "/outils", label: "Outils", icon: "sliders", match: (p) => p === "/outils" || p.startsWith("/outils/") },
];
