import { ressources, type Ressource, ticks, retained, focusSchema, situations, visited, notes, stepsDone, onboarded, last, cartes, plan, emptyPlan, carnet, type Carte, type CarnetRow, type Plan, type Tick } from "./state";
import { SCHEMAS } from "../data/schemas";
import { exoRatings, lessonState, quizState, type LessonState, type QState } from "../learn/progress";

export const BACKUP_APP = "autosoin-schemas";
export const BACKUP_VERSION = 1;
const MAX_BYTES = 2_000_000;
const MAX_STR = 8000;

const isObj = (x: unknown): x is Record<string, unknown> => !!x && typeof x === "object" && !Array.isArray(x);
const str = (x: unknown): string => (typeof x === "string" ? x.slice(0, MAX_STR) : "");
const SAFE_KEY = (k: string) => k !== "__proto__" && k !== "constructor" && k !== "prototype" && k.length <= 120;
const SLUGS = new Set(SCHEMAS.map((s) => s.slug));

export function collectBackup() {
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      ticks: ticks.get(), retained: retained.get(), focus: focusSchema.get(), situations: situations.get(), visited: visited.get(),
      notes: notes.get(), steps: stepsDone.get(), onboarded: onboarded.get(), last: last.get(), cartes: cartes.get(), plan: plan.get(), carnet: carnet.get(),
      lecons: lessonState.get(), rappels: quizState.get(), ressources: ressources.get(), exercices: exoRatings.get(),
    },
  };
}

export const backupFileName = () => `autosoin-schemas-${new Date().toISOString().slice(0, 10)}.json`;

export type RestoreResult = { ok: true; restored: string[] } | { ok: false; error: string };

function recordOf<T>(x: unknown, pick: (v: unknown) => T | null): Record<string, T> {
  const out: Record<string, T> = Object.create(null);
  if (!isObj(x)) return {};
  for (const [k, v] of Object.entries(x)) {
    if (!SAFE_KEY(k)) continue;
    const r = pick(v);
    if (r !== null) out[k] = r;
  }
  return { ...out };
}

/** Lit un fichier de sauvegarde, vérifie sa forme, puis remplace les données de cet appareil. Rien n'est écrit si le fichier n'est pas valide. */
export function restoreBackup(text: string): RestoreResult {
  if (text.length > MAX_BYTES) return { ok: false, error: "Ce fichier est trop volumineux pour être une sauvegarde de ce site." };
  let j: unknown;
  try { j = JSON.parse(text); } catch { return { ok: false, error: "Ce fichier n’est pas lisible. Je choisis une sauvegarde créée par ce site (.json)." }; }
  if (!isObj(j) || j.app !== BACKUP_APP) return { ok: false, error: "Ce fichier ne vient pas de ce site : je ne l’ai pas utilisé." };
  if (typeof j.version !== "number" || j.version > BACKUP_VERSION) return { ok: false, error: "Cette sauvegarde vient d’une version plus récente du site. Je mets d’abord le site à jour." };
  const d = j.data;
  if (!isObj(d)) return { ok: false, error: "La sauvegarde est vide ou abîmée." };

  const t = recordOf<Tick>(d.ticks, (v) => (isObj(v) ? { vrai: v.vrai === true, souvent: v.souvent === true, cout: v.cout === true } : null));
  const kept = Array.isArray(d.retained) ? d.retained.filter((s): s is string => typeof s === "string" && SLUGS.has(s)).slice(0, 3) : [];
  const focus = typeof d.focus === "string" && SLUGS.has(d.focus) ? d.focus : null;
  const sit = recordOf<string>(d.situations, (v) => (typeof v === "string" ? v.slice(0, MAX_STR) : null));
  const vis = recordOf<number>(d.visited, (v) => (typeof v === "number" && isFinite(v) ? v : null));
  const nts = recordOf<string>(d.notes, (v) => (typeof v === "string" ? v.slice(0, MAX_STR) : null));
  const stp = recordOf<boolean[]>(d.steps, (v) => (Array.isArray(v) ? v.slice(0, 20).map((b) => b === true) : null));
  const crt = recordOf<Carte>(d.cartes, (v) => (isObj(v) ? { schema: str(v.schema), quand: str(v.quand), voix: str(v.voix), besoin: str(v.besoin), geste: str(v.geste), phrase: str(v.phrase) } : null));
  const pl: Plan = isObj(d.plan)
    ? { slug: str(d.plan.slug), geste: str(d.plan.geste), quand: str(d.plan.quand), obstacle: str(d.plan.obstacle), soutien: str(d.plan.soutien), recompense: str(d.plan.recompense), bilanQu: str(d.plan.bilanQu), bilanGarde: str(d.plan.bilanGarde), weekOf: str(d.plan.weekOf) }
    : { ...emptyPlan };
  const car: CarnetRow[] = Array.isArray(d.carnet)
    ? d.carnet.filter(isObj).slice(0, 2000).map((r, i) => ({ id: str(r.id) || String(Date.now() + i), date: str(r.date).slice(0, 10), situation: str(r.situation), emotion: str(r.emotion), voix: str(r.voix), base: str(r.base).slice(0, 1), fait: str(r.fait), adulte: str(r.adulte) }))
    : [];
  const lst = isObj(d.last) && typeof d.last.path === "string" && d.last.path.startsWith("/") ? { path: d.last.path.slice(0, 200), title: str(d.last.title).slice(0, 200), at: typeof d.last.at === "number" ? d.last.at : Date.now() } : null;

  const num = (x: unknown) => (typeof x === "number" && isFinite(x) ? x : undefined);
  const lec = recordOf<LessonState>(d.lecons, (v) => (isObj(v) ? { pos: Math.max(0, Math.min(200, num(v.pos) ?? 0)), done: num(v.done), at: num(v.at) } : null));
  const rap = recordOf<QState>(d.rappels, (v) => (isObj(v) && num(v.box) !== undefined && num(v.due) !== undefined
    ? { box: Math.max(0, Math.min(5, num(v.box)!)), due: num(v.due)!, seen: num(v.seen) ?? 0, ok: num(v.ok) ?? 0 } : null));

  const exo = recordOf<number | null>(d.exercices, (v) => (v === null ? null : typeof v === "number" && isFinite(v) ? Math.max(0, Math.min(10, Math.round(v))) : null));
  const res = recordOf<Ressource>(d.ressources, (v) => (isObj(v) ? { nom: str(v.nom).slice(0, 200), tel: str(v.tel).slice(0, 40) } : null));

  ticks.set(t); retained.set(kept); focusSchema.set(focus); situations.set(sit); visited.set(vis); notes.set(nts);
  stepsDone.set(stp); onboarded.set(d.onboarded === true); last.set(lst); cartes.set(crt); plan.set(pl); carnet.set(car);
  lessonState.set(lec); quizState.set(rap); ressources.set(res); exoRatings.set(exo);

  const nLec = Object.values(lec).filter((x) => x.done).length;
  const restored = [
    nLec ? `${nLec} leçon${nLec > 1 ? "s" : ""} terminée${nLec > 1 ? "s" : ""}` : "",
    kept.length ? `${kept.length} schéma${kept.length > 1 ? "s" : ""} gardé${kept.length > 1 ? "s" : ""}` : "",
    Object.keys(crt).length ? `${Object.keys(crt).length} carte${Object.keys(crt).length > 1 ? "s" : ""}-mémo` : "",
    car.length ? `${car.length} ligne${car.length > 1 ? "s" : ""} de carnet` : "",
    Object.keys(nts).length ? `${Object.keys(nts).length} note${Object.keys(nts).length > 1 ? "s" : ""}` : "",
    pl.geste ? "mon plan" : "",
  ].filter(Boolean);
  return { ok: true, restored };
}
