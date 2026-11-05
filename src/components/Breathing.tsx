import { useEffect, useRef, useState } from "react";
import { Button } from "./ui";
import { useReducedMotion } from "../lib/state";

const IN_MS = 4000, OUT_MS = 6000;

/** Respirations guidées : 4 s pour inspirer, 6 s pour expirer (l'expiration est plus longue). */
export function Breathing({ onDone, rounds = 3 }: { onDone?: () => void; rounds?: number }) {
  const reduced = useReducedMotion();
  const [state, setState] = useState<"idle" | "in" | "out" | "done">("idle");
  const [round, setRound] = useState(0);
  const timer = useRef<number | undefined>(undefined);
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => () => window.clearTimeout(timer.current), []);
  useEffect(() => {
    window.clearTimeout(timer.current);
    if (state === "in") timer.current = window.setTimeout(() => setState("out"), IN_MS);
    else if (state === "out") timer.current = window.setTimeout(() => {
      if (round + 1 >= rounds) { setRound(rounds); setState("done"); done.current?.(); }
      else { setRound((r) => r + 1); setState("in"); }
    }, OUT_MS);
  }, [state, round, rounds]);
  const start = () => { setRound(0); setState("in"); };
  const label = state === "idle" ? "Quand je suis prêt(e)" : state === "in" ? "J’inspire…" : state === "out" ? "J’expire, plus longtemps…" : "C’est fait";
  return (
    <div className={`breath is-${state}`} data-reduced={reduced}>
      <div className="breath-orb" aria-hidden="true"><div className="breath-core" /><div className="breath-ring" /></div>
      <p className="breath-l" role="status" aria-live="polite">{label}</p>
      <p className="breath-c" aria-hidden="true">{Array.from({ length: rounds }, (_, i) => <i key={i} className={i < round || state === "done" ? "on" : ""} />)}</p>
      {state === "idle" || state === "done"
        ? <Button variant={state === "done" ? "soft" : "primary"} icon={state === "done" ? "replay" : "wind"} onClick={start}>{state === "done" ? "Recommencer" : `Commencer : ${rounds === 3 ? "trois" : rounds} respirations`}</Button>
        : <Button variant="ghost" onClick={() => { window.clearTimeout(timer.current); setState("idle"); setRound(0); }}>Arrêter</Button>}
      <p className="small muted">Pieds au sol. Si respirer lentement me met mal à l’aise, je respire normalement, ou je regarde autour de moi.</p>
    </div>
  );
}
