import { useSyncExternalStore } from "react";

const PREFIX = "autosoin:v1:";
const mem = new Map<string, string>();

function readRaw(key: string): string | null {
  try { const v = localStorage.getItem(PREFIX + key); if (v != null) return v; } catch { /* stockage indisponible */ }
  return mem.get(key) ?? null;
}
function writeRaw(key: string, v: string) {
  mem.set(key, v);
  try { localStorage.setItem(PREFIX + key, v); } catch { /* stockage indisponible : on garde en mémoire */ }
}
function removeRaw(key: string) {
  mem.delete(key);
  try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
}

const registry: { key: string; reset: () => void }[] = [];

export interface Store<T> {
  get(): T;
  set(next: T | ((prev: T) => T)): void;
  use(): T;
  reset(): void;
}

function isPlain(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

/** Valeur persistée dans localStorage (sur l'appareil uniquement), observable par React. */
export function persisted<T>(key: string, initial: T, opts: { keep?: boolean } = {}): Store<T> {
  const load = (): T => {
    try {
      const raw = readRaw(key);
      if (raw == null) return initial;
      const parsed = JSON.parse(raw);
      return isPlain(initial) && isPlain(parsed) ? ({ ...initial, ...parsed } as T) : (parsed as T);
    } catch { return initial; }
  };
  let value: T = load();
  const subs = new Set<() => void>();
  const notify = () => subs.forEach((f) => f());
  const store: Store<T> = {
    get: () => value,
    set(next) {
      value = typeof next === "function" ? (next as (p: T) => T)(value) : next;
      writeRaw(key, JSON.stringify(value));
      notify();
    },
    use: () => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => value, () => value),
    reset() { value = initial; removeRaw(key); notify(); },
  };
  window.addEventListener("storage", (e) => { if (e.key === PREFIX + key) { value = load(); notify(); } });
  if (!opts.keep) registry.push({ key, reset: store.reset });
  return store;
}

/** Efface toutes les données personnelles (sauf les préférences d'affichage). */
export function clearPersonalData() { registry.forEach((r) => r.reset()); }
