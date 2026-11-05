// Références affichées sur la page « La thérapie des schémas ».
// Règle : seulement des références vérifiées (DOI, titre, auteurs, année) — voir docs/CONTENU.md.
export interface Ref { id: string; text: string; url?: string; urlLabel?: string }

export const REFERENCES: Ref[] = [];
