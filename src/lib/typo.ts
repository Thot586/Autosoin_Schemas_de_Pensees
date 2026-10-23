// Typographie française : espace insécable avant « ? ! : ; % » » et après « « ».
const NB = " ";

export function fr(s: string): string {
  return s
    .replace(/[  ]/g, " ")
    .replace(/\s+([?!:;»%])/g, NB + "$1")
    .replace(/«\s+/g, "«" + NB);
}

/** Applique `fr` à toutes les chaînes d'une structure (objets, tableaux). */
export function deepFr<T>(v: T): T {
  if (typeof v === "string") return fr(v) as unknown as T;
  if (Array.isArray(v)) return v.map((x) => deepFr(x)) as unknown as T;
  if (v && typeof v === "object") {
    const o: Record<string, unknown> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) o[k] = deepFr(x);
    return o as T;
  }
  return v;
}
