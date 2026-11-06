import { useEffect, useRef, useState } from "react";
import { Button, Choice } from "./ui";
import { respiration, useReducedMotion, type RespirationPrefs } from "../lib/state";
import { canVibrate, createBreathAudio, type BreathAudio } from "../lib/breathSound";

const IN_S = 4, OUT_S = 6;
type Phase = "idle" | "in" | "out" | "done";
const SONS: { id: RespirationPrefs["son"]; label: string }[] = [
  { id: "aucun", label: "Sans son" },
  { id: "souffle", label: "Souffle" },
  { id: "musique", label: "Musique douce" },
];

/**
 * Respirations guidées : 4 s pour inspirer, 6 s pour expirer (l'expiration est plus longue).
 * Le cercle se remplit à l'inspiration et se vide à l'expiration ; un décompte suit les secondes.
 * Son et vibration en option, coupés par défaut ; le son suit le même rythme.
 */
export function Breathing({ onDone, rounds = 3 }: { onDone?: () => void; rounds?: number }) {
  const reduced = useReducedMotion();
  const opts = respiration.use();
  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(0);
  const [left, setLeft] = useState(IN_S);
  const timers = useRef<number[]>([]);
  const audio = useRef<BreathAudio | null>(null);
  const done = useRef(onDone);
  done.current = onDone;
  const clear = () => { timers.current.forEach((t) => window.clearTimeout(t)); timers.current = []; };
  const stopAudio = () => { audio.current?.stop(); audio.current = null; };
  useEffect(() => () => { clear(); stopAudio(); }, []);

  useEffect(() => {
    if (phase !== "in" && phase !== "out") return;
    const dur = phase === "in" ? IN_S : OUT_S;
    setLeft(dur);
    if (phase === "in") audio.current?.inhale(IN_S); else audio.current?.exhale(OUT_S);
    if (opts.vibration && canVibrate()) navigator.vibrate(phase === "in" ? 40 : [30, 90, 30]);
    for (let s = 1; s < dur; s++) timers.current.push(window.setTimeout(() => setLeft(dur - s), s * 1000));
    timers.current.push(window.setTimeout(() => {
      if (phase === "in") setPhase("out");
      else if (round + 1 >= rounds) { setRound(rounds); setPhase("done"); stopAudio(); done.current?.(); }
      else { setRound((r) => r + 1); setPhase("in"); }
    }, dur * 1000));
    return clear;
    // (les options sont lues au début de chaque phase : on ne relance pas la phase quand elles changent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, round, rounds]);

  const start = () => {
    clear(); stopAudio();
    if (opts.son !== "aucun") audio.current = createBreathAudio(opts.son);  // dans le clic : le navigateur l'autorise
    setRound(0); setPhase("in");
  };
  const stop = () => { clear(); stopAudio(); setPhase("idle"); setRound(0); };

  const running = phase === "in" || phase === "out";
  // animations réduites : le niveau change seconde par seconde, sans glisser
  const level = phase === "in" ? (IN_S - left) / IN_S : phase === "out" ? left / OUT_S : 0;
  const label = phase === "idle" ? "Quand je suis prêt(e)" : phase === "in" ? "J’inspire…" : phase === "out" ? "J’expire, plus longtemps…" : "C’est fait";
  return (
    <div className={`breath is-${phase}`} data-reduced={reduced}>
      <div className="breath-orb" aria-hidden="true">
        <div className="breath-fill" style={reduced && running ? { transform: `translateY(calc(${(1 - level).toFixed(3)} * (100% + 14px)))` } : undefined} />
        {running && <span className="breath-count">{left}</span>}
      </div>
      <p className="breath-l" role="status" aria-live="polite">{label}</p>
      <p className="breath-c" aria-hidden="true">{Array.from({ length: rounds }, (_, i) => <i key={i} className={i < round || phase === "done" ? "on" : ""} />)}</p>
      {running
        ? <Button variant="ghost" onClick={stop}>Arrêter</Button>
        : <>
            <div className="breath-opts">
              <p className="breath-opts-t">Son pendant l’exercice</p>
              <Choice label="Son pendant l’exercice" options={SONS} value={opts.son} onChange={(son) => respiration.set((p) => ({ ...p, son }))} />
              {canVibrate() && (
                <label className="check"><input type="checkbox" checked={opts.vibration} onChange={(e) => respiration.set((p) => ({ ...p, vibration: e.target.checked }))} /> Vibrer à chaque changement</label>
              )}
            </div>
            <Button variant={phase === "done" ? "soft" : "primary"} icon={phase === "done" ? "replay" : "wind"} onClick={start}>{phase === "done" ? "Recommencer" : `Commencer : ${rounds === 3 ? "trois" : rounds} respirations`}</Button>
          </>}
      <p className="small muted">Pieds au sol. Si respirer lentement me met mal à l’aise, je respire normalement, ou je regarde autour de moi.</p>
    </div>
  );
}
