import { useEffect, useRef, useState, type RefObject } from "react";

/** Vrai dès que l'élément est (en partie) visible ; reste vrai si `once`. */
export function useInView<T extends Element>(opts: { once?: boolean; margin?: string; threshold?: number } = {}): [RefObject<T | null>, boolean] {
  const { once = true, margin = "0px 0px -8% 0px", threshold = 0.12 } = opts;
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setSeen(true); return; }
    const io = new IntersectionObserver(
      (es) => { for (const e of es) { if (e.isIntersecting) { setSeen(true); if (once) io.disconnect(); } else if (!once) setSeen(false); } },
      { rootMargin: margin, threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, margin, threshold]);
  return [ref, seen];
}

export function useInterval(fn: () => void, ms: number | null) {
  const saved = useRef(fn);
  saved.current = fn;
  useEffect(() => {
    if (ms == null) return;
    const id = window.setInterval(() => saved.current(), ms);
    return () => window.clearInterval(id);
  }, [ms]);
}

export function useDocTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Comprendre ses schémas` : "Comprendre ses schémas";
  }, [title]);
}

export function useMedia(query: string): boolean {
  const [m, setM] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const f = () => setM(mq.matches);
    mq.addEventListener("change", f);
    f();
    return () => mq.removeEventListener("change", f);
  }, [query]);
  return m;
}

/** Texte tapé lettre à lettre (si `on`), sinon complet. */
export function useTyped(text: string, on: boolean, speed = 22): string {
  const [n, setN] = useState(on ? 0 : text.length);
  useEffect(() => {
    if (!on) { setN(text.length); return; }
    setN(0);
    let i = 0;
    const id = window.setInterval(() => { i += 1; setN(i); if (i >= text.length) window.clearInterval(id); }, speed);
    return () => window.clearInterval(id);
  }, [text, on, speed]);
  return text.slice(0, n);
}
