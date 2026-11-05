import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { useInView } from "../lib/hooks";
import { useReducedMotion } from "../lib/state";

export function readingMs(caption: ReactNode, min = 5000): number {
  const len = typeof caption === "string" ? caption.length : 90;
  return Math.max(min, 2600 + len * 68);
}

/** Lecteur d'animation « par étapes » : lecture automatique douce, pause, précédent/suivant, texte complet. */
export function Player({ label, captions, render, transcript, delays, className = "", autoplay = false, aspect }: {
  label: string; captions: ReactNode[]; render: (step: number, playing: boolean) => ReactNode; transcript?: ReactNode; delays?: number[];
  className?: string; autoplay?: boolean; aspect?: string;
}) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ref, seen] = useInView<HTMLDivElement>({ once: true, threshold: 0.5 });
  const started = useRef(false);
  const n = captions.length;

  useEffect(() => {
    if (seen && autoplay && !reduced && !started.current) { started.current = true; setPlaying(true); }
  }, [seen, autoplay, reduced]);

  useEffect(() => {
    if (!playing) return;
    if (step >= n - 1) { const t = window.setTimeout(() => setPlaying(false), 600); return () => window.clearTimeout(t); }
    const ms = delays?.[step] ?? readingMs(captions[step]);
    const t = window.setTimeout(() => setStep((s) => Math.min(n - 1, s + 1)), ms);
    return () => window.clearTimeout(t);
  }, [playing, step, n, delays, captions]);

  const go = (s: number) => { setPlaying(false); setStep(Math.max(0, Math.min(n - 1, s))); };
  const atEnd = step >= n - 1;
  const toggle = () => {
    if (playing) { setPlaying(false); return; }
    if (atEnd) { setStep(0); }
    started.current = true;
    setPlaying(true);
  };

  return (
    <figure className={`player ${className}`} ref={ref} aria-label={label}>
      <div className="stage" style={aspect ? { aspectRatio: aspect } : undefined} aria-hidden="true">{render(step, playing)}</div>
      <figcaption>
        <p className="player-caption" aria-live={playing ? "off" : "polite"} key={step}>{captions[step]}</p>
        <div className="player-controls">
          <button type="button" className="pc-btn" onClick={() => go(step - 1)} disabled={step === 0} aria-label="Étape précédente"><Icon name="arrowLeft" size={20} /></button>
          <button type="button" className="pc-btn pc-main" onClick={toggle} aria-label={playing ? "Mettre en pause" : atEnd ? "Revoir depuis le début" : "Lire l’animation"}>
            <Icon name={playing ? "pause" : atEnd ? "replay" : "play"} size={22} />
            <span>{playing ? "Pause" : atEnd ? "Revoir" : "Lire"}</span>
          </button>
          <button type="button" className="pc-btn" onClick={() => go(step + 1)} disabled={atEnd} aria-label="Étape suivante"><Icon name="arrowRight" size={20} /></button>
        </div>
        <ol className="player-dots" aria-label="Étapes">
          {captions.map((_, i) => (
            <li key={i}><button type="button" onClick={() => go(i)} aria-label={`Étape ${i + 1} sur ${n}`} aria-current={i === step ? "step" : undefined} className={i === step ? "is-on" : i < step ? "is-past" : ""} /></li>
          ))}
        </ol>
        {transcript && (
          <details className="player-transcript">
            <summary>Lire le texte de l’animation</summary>
            <div>{transcript}</div>
          </details>
        )}
      </figcaption>
    </figure>
  );
}
