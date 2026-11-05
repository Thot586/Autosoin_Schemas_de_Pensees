import { useEffect, useState } from "react";
import { persisted } from "./store";

// ───────────── préférences d'affichage (conservées si on efface les données)
export interface Prefs { theme: "auto" | "light" | "dark"; motion: "auto" | "reduced" | "full"; size: number; pro: boolean }
export const prefs = persisted<Prefs>("prefs", { theme: "auto", motion: "auto", size: 1, pro: false }, { keep: true });

export function applyPrefs(p: Prefs) {
  const r = document.documentElement;
  r.setAttribute("data-theme", p.theme);
  if (p.motion === "auto") r.removeAttribute("data-motion"); else r.setAttribute("data-motion", p.motion);
  r.style.setProperty("--text-scale", String(p.size));
}

// ───────────── données personnelles (tout reste sur l'appareil)
export interface Tick { vrai: boolean; souvent: boolean; cout: boolean }
export type Ticks = Record<string, Tick>;
export const ticks = persisted<Ticks>("ticks", {});
export const retained = persisted<string[]>("retained", []);          // schémas gardés (3 au maximum)
export const focusSchema = persisted<string | null>("focus", null);   // « je commence par celui-ci »
export const situations = persisted<Record<string, string>>("situations", {});
export const visited = persisted<Record<string, number>>("visited", {});
export const notes = persisted<Record<string, string>>("notes", {});
export const stepsDone = persisted<Record<string, boolean[]>>("steps", {});
export const onboarded = persisted<boolean>("onboarded", false);
export const last = persisted<{ path: string; title: string; at: number } | null>("last", null);

export interface Carte { schema: string; quand: string; voix: string; besoin: string; geste: string; phrase: string }
export const cartes = persisted<Record<string, Carte>>("cartes", {});

export interface Plan {
  slug: string; geste: string; quand: string; obstacle: string; soutien: string; recompense: string;
  bilanQu: string; bilanGarde: string; weekOf: string;
}
export const emptyPlan: Plan = { slug: "", geste: "", quand: "", obstacle: "", soutien: "", recompense: "", bilanQu: "", bilanGarde: "", weekOf: "" };
export const plan = persisted<Plan>("plan", emptyPlan);

export interface CarnetRow { id: string; date: string; situation: string; emotion: string; voix: string; base: string; fait: string; adulte: string }
export const carnet = persisted<CarnetRow[]>("carnet", []);

export const tickCount = (t: Tick | undefined) => (t ? Number(t.vrai) + Number(t.souvent) + Number(t.cout) : 0);

// ───────────── hooks
export function useReducedMotion(): boolean {
  const p = prefs.use();
  const [os, setOs] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const f = () => setOs(m.matches);
    m.addEventListener("change", f);
    return () => m.removeEventListener("change", f);
  }, []);
  if (p.motion === "reduced") return true;
  if (p.motion === "full") return false;
  return os;
}

export function markVisited(key: string) {
  if (!visited.get()[key]) visited.set((v) => ({ ...v, [key]: Date.now() }));
}

/** « Mes personnes ressources » (fiche « Quand demander de l'aide ») : nom et téléphone, sur l'appareil. */
export interface Ressource { nom: string; tel: string }
export const ressources = persisted<Record<string, Ressource>>("ressources", {});
