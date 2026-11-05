import { useEffect, useState, useSyncExternalStore } from "react";

// Lecture à voix haute du texte des leçons (synthèse vocale du navigateur).
// Seul le texte du support est lu : jamais les notes personnelles.
// Les voix « locales » (sur l'appareil) sont préférées quand elles existent.

const synth: SpeechSynthesis | null = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

let speakingKey: string | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function frenchVoice(): SpeechSynthesisVoice | null {
  if (!synth) return null;
  const vs = synth.getVoices().filter((v) => v.lang?.toLowerCase().startsWith("fr"));
  return vs.find((v) => v.localService && /fr[-_]fr/i.test(v.lang)) || vs.find((v) => v.localService) || vs.find((v) => /fr[-_]fr/i.test(v.lang)) || vs[0] || null;
}

/** Nettoie le balisage minimal ([[id|mot]], **gras**) avant lecture. */
export function plain(s: string): string {
  return s.replace(/\[\[[^|\]]+\|([^\]]+)\]\]/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/[«»“”]/g, "");
}

export function stopSpeaking() {
  if (!synth) return;
  synth.cancel();
  if (speakingKey !== null) { speakingKey = null; emit(); }
}

export function speak(key: string, parts: string[]) {
  if (!synth) return;
  synth.cancel();
  const text = parts.filter(Boolean).map(plain).join(". \n");
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "fr-FR";
  u.rate = 0.92;
  const v = frenchVoice();
  if (v) u.voice = v;
  u.onend = () => { if (speakingKey === key) { speakingKey = null; emit(); } };
  u.onerror = () => { if (speakingKey === key) { speakingKey = null; emit(); } };
  speakingKey = key;
  emit();
  synth.speak(u);
}

export const canSpeak = (): boolean => !!synth;

export function useSpeaking(key: string): boolean {
  return useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => speakingKey === key, () => false);
}

/** Les voix se chargent parfois après coup : on attend qu'elles soient prêtes. */
export function useVoicesReady(): boolean {
  const [ok, setOk] = useState(() => !!synth && synth.getVoices().length > 0);
  useEffect(() => {
    if (!synth || ok) return;
    const f = () => setOk(synth.getVoices().length > 0);
    synth.addEventListener?.("voiceschanged", f);
    const t = window.setTimeout(f, 800);
    return () => { synth.removeEventListener?.("voiceschanged", f); window.clearTimeout(t); };
  }, [ok]);
  return ok;
}
