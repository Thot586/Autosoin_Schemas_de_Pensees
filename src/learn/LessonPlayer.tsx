import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { useDocTitle } from "../lib/hooks";
import { last } from "../lib/state";
import { CardBody, CardExtras, SpeakButton, speechOf } from "./Cards";
import { Rich } from "./Rich";
import { exoRatings, lessonState, markLessonDone, recordAnswer, setLessonPos } from "./progress";
import { stopSpeaking } from "./speech";
import type { Card, Tone } from "./types";

/**
 * Lecteur « une idée par écran » : une carte à la fois, Retour / Suivant en bas (zone du pouce),
 * Quitter en haut (la position est gardée), flèches du clavier, lecture à voix haute.
 */
export function LessonPlayer({ storeKey, title, kicker, cards, tone = "brand", exitTo, exitLabel = "Quitter", path, record = true }: {
  storeKey: string; title: string; kicker?: string; cards: Card[]; tone?: Tone; exitTo: string; exitLabel?: string; path: string;
  /** Faux pour les séances de rappel (pas de position à garder). */
  record?: boolean;
}) {
  const n = cards.length;
  const [i, setI] = useState(() => {
    if (!record) return 0;
    const pos = lessonState.get()[storeKey]?.pos ?? 0;
    return Math.max(0, Math.min(n - 2, pos));
  });
  const [picked, setPicked] = useState<Record<string, number>>({});
  const [gates, setGates] = useState<Record<string, boolean[]>>({});
  const ratings = exoRatings.use();
  const head = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  const card = cards[Math.min(i, n - 1)];
  const isEnd = card.kind === "end";
  useDocTitle(title);

  useEffect(() => { last.set({ path, title, at: Date.now() }); }, [path, title]);

  // Mode concentration : l'en-tête, la barre du bas et le pied de page disparaissent pendant la leçon.
  useEffect(() => {
    document.documentElement.classList.add("is-focus");
    return () => document.documentElement.classList.remove("is-focus");
  }, []);

  useEffect(() => {
    if (!record) return;
    if (isEnd) markLessonDone(storeKey);
    else setLessonPos(storeKey, i);
  }, [i, isEnd, storeKey, record]);

  // À chaque carte : on remonte en haut et on place le focus sur le titre (lecteurs d'écran).
  useLayoutEffect(() => {
    stopSpeaking();
    if (first.current) { first.current = false; return; }
    window.scrollTo(0, 0);
    head.current?.focus({ preventScroll: true });
  }, [i]);
  useEffect(() => () => stopSpeaking(), []);

  // Carte d'entrée d'un exercice : on n'avance qu'une fois toutes les cases cochées.
  const gateBlocked = card.kind === "gate" && !card.items.every((_, k) => gates[card.id]?.[k]);
  // Exercice guidé : si l'émotion est déjà à 7 sur 10 ou plus avant de commencer, on ne continue pas (la pause est proposée).
  const tooHigh = card.kind === "widget" && card.widget === "echelle" && !!card.param?.endsWith("-avant") && (ratings[card.param] ?? -1) >= 7;
  const blocked = gateBlocked || tooHigh;
  const go = useCallback((d: number) => setI((x) => Math.max(0, Math.min(n - 1, x + d))), [n]);
  const toggleGate = (k: number) => setGates((g) => {
    const cur = (g[card.id] ?? []).slice();
    cur[k] = !cur[k];
    return { ...g, [card.id]: cur };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, select, [contenteditable], dialog")) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); if (!blocked) go(1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, blocked]);

  const pick = (k: number) => {
    if (card.kind !== "quiz" && card.kind !== "rappel") return;
    if (picked[card.id] !== undefined) return;
    setPicked((p) => ({ ...p, [card.id]: k }));
    recordAnswer(card.quiz.id, k === card.quiz.answer);
  };
  const isQuiz = card.kind === "quiz" || card.kind === "rappel";
  const unanswered = isQuiz && picked[card.id] === undefined;
  const cardTone = card.tone ?? tone;

  return (
    <div className={`lesson tone-${tone}`}>
      <header className="lesson-top">
        <Link to={exitTo} className="lesson-quit" aria-label={`${exitLabel} : je reprendrai ici plus tard`}>
          <Icon name="close" size={22} /><span>{exitLabel}</span>
        </Link>
        <div className="lesson-meta">
          {kicker && <span className="lesson-kicker">{kicker}</span>}
          <h1 className="lesson-title">{title}</h1>
        </div>
        <Link to="/aide" className="help-pill help-pill-sm" aria-label="Aide : numéros d’urgence et soutien">
          <Icon name="heart" size={18} /><span>Aide</span>
        </Link>
      </header>
      <div className="lesson-progress" role="progressbar" aria-label="Progression dans la leçon" aria-valuemin={1} aria-valuemax={n} aria-valuenow={i + 1} aria-valuetext={`Carte ${i + 1} sur ${n}`}>
        {cards.map((c, k) => <i key={c.id + k} className={k < i ? "is-done" : k === i ? "is-on" : ""} />)}
      </div>

      <div className="lesson-stage">
        <article className={`lcard lcard-${card.kind} tone-${cardTone}`} key={card.id + i} aria-labelledby="lcard-h">
          <p className="lcard-count">{i + 1} sur {n}</p>
          {"icon" in card && card.icon && <span className="lcard-ic" aria-hidden="true"><Icon name={card.icon} size={28} /></span>}
          {card.kind === "end" && <span className="lcard-ic lcard-ic-end" aria-hidden="true"><Icon name="check" size={30} /></span>}
          {isQuiz && <p className="lcard-kicker">{card.title}</p>}
          <h2 id="lcard-h" ref={head} tabIndex={-1}>{isQuiz ? <Rich text={card.quiz.q} /> : card.title}</h2>
          <div className="lcard-body">
            <CardBody card={card} picked={picked[card.id]} onPick={pick} gate={{ checked: gates[card.id] ?? [], toggle: toggleGate }} />
          </div>
          <div className="lcard-tools">
            {card.kind !== "end" && card.kind !== "fiche" && <SpeakButton k={`${storeKey}:${card.id}`} parts={speechOf(card)} />}
          </div>
          <CardExtras card={card} />
        </article>
      </div>

      {!isEnd && (
        <nav className="lesson-nav" aria-label="Navigation dans la leçon">
          <button type="button" className="btn btn-ghost lesson-prev" onClick={() => go(-1)} disabled={i === 0}>
            <Icon name="arrowLeft" size={22} /><span>Retour</span>
          </button>
          <button type="button" className={`btn ${unanswered ? "btn-soft" : "btn-primary"} lesson-next`} onClick={() => go(1)} disabled={blocked}>
            <span>{tooHigh ? "Aujourd’hui, je fais plutôt la pause" : gateBlocked ? "Je coche les cases pour commencer" : unanswered ? "Passer" : i === n - 2 ? "Terminer" : "Suivant"}</span>{!blocked && <Icon name="arrowRight" size={22} />}
          </button>
        </nav>
      )}
    </div>
  );
}
