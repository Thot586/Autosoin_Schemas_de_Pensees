import type { IconName } from "./components/Icon";

/** Quatre onglets, toujours les mêmes, au même endroit (barre du bas sur téléphone, en-tête sur ordinateur).
 *  `short` : le nom dans la barre du bas, où un onglet ne fait que 78 px de large sur un petit téléphone. */
export const TABS: { to: string; label: string; short?: string; icon: IconName; match: (p: string) => boolean }[] = [
  { to: "/", label: "Accueil", icon: "home", match: (p) => p === "/" || p === "/rappel" },
  { to: "/apprendre", label: "Apprendre", icon: "route", match: (p) => p === "/apprendre" || p.startsWith("/apprendre/") || p === "/therapie" },
  { to: "/schemas", label: "Mes schémas", short: "Schémas", icon: "layers", match: (p) => p === "/schemas" || p.startsWith("/schemas/") || p.startsWith("/trouver") },
  { to: "/outils", label: "Outils", icon: "sliders", match: (p) => p === "/outils" || p.startsWith("/outils/") || p === "/mon-espace" },
];

/** Le menu : ce qui sert moins souvent. */
export const MENU: { to: string; label: string; icon: IconName }[] = [
  { to: "/rappel", label: "Mon rappel du jour", icon: "star" },
  { to: "/mon-espace", label: "Mon espace (mes notes, sauvegarde)", icon: "user" },
  { to: "/therapie", label: "La thérapie des schémas", icon: "book" },
  { to: "/soutien", label: "Où trouver un soutien", icon: "users" },
  { to: "/glossaire", label: "Les mots du support", icon: "chat" },
  { to: "/references", label: "Les références (sources)", icon: "book" },
  { to: "/a-propos", label: "À propos, limites et données", icon: "info" },
];
