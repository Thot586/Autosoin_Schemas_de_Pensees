// Toutes les sources du support, vérifiées une à une (métadonnées, type d'étude, GRADE quand les auteurs l'ont utilisé).
// Les entrées sont dans references.list.ts ; ici, la façon de les citer (APA 7, adaptation française) et de les classer.
//
// Dans les textes des leçons et du glossaire :
//   [@id]            → (Auteur, 2020)                     citation entre parenthèses
//   [@id1; @id2]     → (Auteur, 2020; Autre et al., 2021)  plusieurs sources, par ordre alphabétique
//   [n@id]           → Auteur (2020)                       citation dans la phrase
// Un clic sur une citation mène à la page « Références », sur la bonne entrée.
import { REF_LIST } from "./references.list";

/** Fiabilité : d'après le type d'étude (échelle de la HAS), sauf « indirecte » (laboratoire, volontaires) et « officielle » (information pratique). */
export type Niveau = "solide" | "moderee" | "preliminaire" | "indirecte" | "experts" | "officielle";
export type Theme = "therapie" | "imagerie" | "chaises" | "action" | "orientation" | "aide" | "lectures" | "methode";

export interface Ref {
  id: string;
  type: "article" | "livre" | "chapitre" | "site";
  /** Auteurs dans l'ordre, « Nom, I. I. » (APA). */
  auteurs?: string[];
  /** Ouvrage dirigé : les noms sont ceux des directeurs (dir.). */
  dir?: boolean;
  /** Auteur-organisation (site, brochure). */
  org?: string;
  /** Sigle de l'organisation, pour la citation dans le texte (ISST, HAS, OMS…). */
  sigle?: string;
  /** « 2003 », « 2026, 15 septembre », « s. d. » */
  annee: string;
  titre: string;
  revue?: string; volume?: string; numero?: string; pages?: string;
  edition?: string; traduction?: string; editeur?: string; original?: string;
  doi?: string; url?: string;
  /** Date de consultation d'une page qui peut changer (AAAA-MM-JJ). */
  consulte?: string;
  theme: Theme;
  niveau: Niveau;
  /** Type d'étude, en clair : « Méta-analyse de 33 études (1 151 participants) ». */
  design: string;
  /** GRADE tel que rapporté par les auteurs (citation), ou ce qu'on a pu en savoir. */
  grade?: string;
  /** Ce qui a été lu pour vérifier : métadonnées, résumé, texte intégral, page. */
  lu: string;
  correction?: string;
  /** Ce que le support en tire. */
  apport: string;
}

export const NIVEAUX: Record<Niveau, { label: string; court: string; icon: "check" | "layers" | "clock" | "eye" | "users" | "info"; detail: string }> = {
  solide: { label: "Preuve solide", court: "solide", icon: "check", detail: "Méta-analyse d’essais randomisés, ou grand essai randomisé (plusieurs centaines de participants). Échelle de la HAS : niveau 1." },
  moderee: { label: "Preuve modérée", court: "modérée", icon: "layers", detail: "Essai randomisé de taille modeste, ou synthèse qui mêle essais randomisés et études sans groupe de comparaison. Échelle de la HAS : niveau 2." },
  preliminaire: { label: "Preuve préliminaire", court: "préliminaire", icon: "clock", detail: "Étude pilote, étude sans groupe de comparaison, analyse secondaire d’un essai, petite étude de validation, ou revue qui réunit surtout ce type d’études. Échelle de la HAS : niveaux 3 et 4." },
  indirecte: { label: "Preuve indirecte", court: "indirecte", icon: "eye", detail: "Expérience de laboratoire, souvent chez des volontaires sans trouble : elle éclaire un mécanisme, sans montrer d’effet chez des patients." },
  experts: { label: "Avis d’experts", court: "avis d’experts", icon: "users", detail: "Ouvrage de référence, revue narrative, description d’une méthode ou d’un protocole : l’expérience des cliniciens, sans étude comparative. Échelle de la HAS : accord d’experts." },
  officielle: { label: "Source officielle", court: "source officielle", icon: "info", detail: "Site d’un organisme public ou d’une société savante, pour une information pratique (numéro, remboursement, définition). Ce n’est pas un niveau de preuve." },
};

export const THEMES: { id: Theme; titre: string; intro: string }[] = [
  { id: "therapie", titre: "La thérapie des schémas", intro: "D’où elle vient, ce qu’on sait de son efficacité, et le questionnaire de repérage." },
  { id: "imagerie", titre: "L’imagerie (réécriture en imagination)", intro: "Comment elle se pratique, pourquoi on pense qu’elle aide, ce que montrent les études." },
  { id: "chaises", titre: "Le dialogue des chaises", intro: "Son origine, ses effets mesurés et ce qui reste une hypothèse." },
  { id: "action", titre: "Passer à l’action", intro: "Les plans « si… alors… », écrire ce que l’on ressent, dire ce qui ne va pas." },
  { id: "orientation", titre: "Définitions et orientation", intro: "Les mots du glossaire et les portes d’entrée vers un soin." },
  { id: "aide", titre: "Numéros d’aide", intro: "Les numéros d’urgence et d’écoute, vérifiés sur les sites officiels." },
  { id: "lectures", titre: "Lectures conseillées", intro: "Les livres proposés pour aller plus loin." },
  { id: "methode", titre: "Comment lire les niveaux de preuve", intro: "Les échelles utilisées pour les couleurs de cette page." },
];

export const REFERENCES: Ref[] = REF_LIST;
const BY_ID = new Map(REFERENCES.map((r) => [r.id, r]));
export const refById = (id: string): Ref | undefined => BY_ID.get(id);

// ───────── Citer (APA 7, adaptation française : « et » entre deux auteurs, « et al. » à partir de trois) ─────────
const family = (a: string) => a.split(",")[0].trim();
const year = (r: Ref) => (/^\d{4}/.test(r.annee) ? r.annee.slice(0, 4) : r.annee);
const who = (r: Ref) => {
  if (r.org) return r.sigle ?? r.org;
  const f = (r.auteurs ?? []).map(family);
  return f.length === 1 ? f[0] : f.length === 2 ? `${f[0]} et ${f[1]}` : `${f[0]} et al.`;
};

// Même auteur(s), même année : 2026a, 2026b… dans l'ordre des titres (règle APA).
const SUFFIX = new Map<string, string>();
{
  const groups = new Map<string, Ref[]>();
  for (const r of REFERENCES) { const k = `${who(r)}|${year(r)}`; groups.set(k, [...(groups.get(k) ?? []), r]); }
  for (const g of groups.values()) if (g.length > 1) [...g].sort((a, b) => a.titre.localeCompare(b.titre, "fr")).forEach((r, i) => SUFFIX.set(r.id, "abcdefghij"[i]));
}
/** L'année telle qu'elle s'affiche dans la citation et dans la liste (avec a, b… si besoin). */
export const citeYear = (r: Ref) => { const s = SUFFIX.get(r.id); return s ? (/^\d/.test(year(r)) ? year(r) + s : `${year(r)}-${s}`) : year(r); };
/** « Kip et al., 2023 » */
export const citeLabel = (r: Ref) => `${who(r)}, ${citeYear(r)}`;
/** « Kip et al. (2023) » */
export const citeNarrative = (r: Ref) => `${who(r)} (${citeYear(r)})`;
/** Ordre d'une liste de références (APA) : premier auteur, puis année. */
export const apaSort = (a: Ref, b: Ref) => who(a).localeCompare(who(b), "fr") || citeYear(a).localeCompare(citeYear(b));

/** Auteurs de la liste de références : « Taylor, C. D. J., Bee, P. et Haddock, G. » (20 au plus ; au-delà, les 19 premiers, …, le dernier). */
export const apaAuthors = (r: Ref): string => {
  if (r.org) return r.org;
  const a = r.auteurs ?? [];
  const list = a.length > 20 ? [...a.slice(0, 19), "…", a[a.length - 1]] : a;
  const s = list.length === 1 ? list[0] : list.length === 2 ? `${list[0]} et ${list[1]}` : `${list.slice(0, -1).join(", ")}${list[list.length - 2] === "…" ? " " : " et "}${list[list.length - 1]}`;
  return r.dir ? `${s} (dir.)` : s;
};

/** Balisage de citation dans un texte : [@id], [@id1; @id2], [n@id]. */
export const CITE_RE = /\[(n?)@([^\]]+)\]/g;
export const citeIds = (inner: string) => inner.split(";").map((x) => x.trim().replace(/^@/, "")).filter(Boolean);
