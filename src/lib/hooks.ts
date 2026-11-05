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

export function useDocTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} · Comprendre ses schémas` : "Comprendre ses schémas";
  }, [title]);
}
