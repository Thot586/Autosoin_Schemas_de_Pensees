import { useId, useRef, useState, type ReactNode } from "react";
import { Icon } from "../components/Icon";
import { Pro } from "../components/ui";
import { Link } from "../lib/router";
import { notes, plan } from "../lib/state";
import { Rich } from "./Rich";
import { Widget } from "./Widgets";
import { Anim } from "./Anims";
import { FicheItem } from "./Fiche";
import { canSpeak, speak, stopSpeaking, useSpeaking, useVoicesReady } from "./speech";
import type { Card, LinkItem, QuizItem } from "./types";

/** Texte lisible à voix haute pour une carte (jamais les notes personnelles). */
export function speechOf(c: Card): string[] {
  const ORD = ["Première", "Deuxième", "Troisième", "Quatrième", "Cinquième"];
  if (c.kind === "quiz" || c.kind === "rappel") return [c.quiz.q, ...c.quiz.options.map((o, i) => `${ORD[i] ?? "Autre"} possibilité : ${o}`)];
  const t: string[] = [c.title];
  if ("quote" in c && c.quote) t.push(c.quote);
  if ("body" in c && c.body) t.push(...c.body);
  if ("list" in c && c.list) t.push(...c.list);  // texte, liens
  if ("after" in c && c.after) t.push(...c.after);
  if (c.kind === "tiles") t.push(...c.tiles.flatMap((x) => [x.title, x.text]));
  if (c.kind === "steps") { t.push(...c.steps.flatMap((x, i) => [`${i + 1}. ${x.title}`, x.text])); if (c.foot) t.push(c.foot); }
  if (c.kind === "reflect") t.push(c.prompt, c.hint ?? "");
  if (c.kind === "retain") t.push(...c.items);
  if (c.kind === "gate") t.push(...c.items, ...(c.after ?? []));
  if (c.why) t.push(`Pourquoi cette étape ? ${c.why}`);
  return t;
}

export function SpeakButton({ k, parts }: { k: string; parts: string[] }) {
  const on = useSpeaking(k);
  useVoicesReady();
  if (!canSpeak()) return null;
  return (
    <button type="button" className={`tool-btn ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => (on ? stopSpeaking() : speak(k, parts))}>
      <Icon name={on ? "pause" : "sound"} size={20} /><span>{on ? "Arrêter la lecture" : "Écouter"}</span>
    </button>
  );
}

function Paras({ xs }: { xs?: string[] }) {
  if (!xs?.length) return null;
  return <>{xs.map((p, i) => <p key={i}><Rich text={p} /></p>)}</>;
}

function Bullets({ xs }: { xs?: string[] }) {
  if (!xs?.length) return null;
  return <ul className="lc-list">{xs.map((p, i) => <li key={i}><Rich text={p} /></li>)}</ul>;
}

export function LinkBtn({ l, variant = "soft" }: { l: LinkItem; variant?: "primary" | "soft" | "ghost" }) {
  const ext = /^https?:/.test(l.to);
  const inner = <>{l.icon && <Icon name={l.icon} size={20} />}<span>{l.label}{ext && <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>}</span></>;
  return <Link to={l.to} className={`btn btn-${variant}`}>{inner}</Link>;
}

/* ───────── Quiz ───────── */
export function QuizView({ quiz, picked, onPick, label, labelledBy }: { quiz: QuizItem; picked: number | undefined; onPick: (i: number) => void; label?: string; labelledBy?: string }) {
  const done = picked !== undefined;
  const ok = done && picked === quiz.answer;
  const qid = useId();
  return (
    <div className="quiz">
      {label && <p className="quiz-from">{label}</p>}
      {!labelledBy && <p className="quiz-q" id={qid}><Rich text={quiz.q} /></p>}
      <div className="quiz-opts" role="group" aria-labelledby={labelledBy ?? qid}>
        {quiz.options.map((o, i) => {
          const state = !done ? "" : i === quiz.answer ? "is-good" : i === picked ? "is-picked" : "is-off";
          return (
            <button key={i} type="button" className={`quiz-o ${state}`} aria-pressed={picked === i} aria-disabled={done || undefined}
              onClick={() => { if (!done) onPick(i); }}>
              <span className="quiz-mark" aria-hidden="true">{done && i === quiz.answer ? <Icon name="check" size={18} /> : String.fromCharCode(65 + i)}</span>
              <span>{o}</span>
              {done && i === quiz.answer && <span className="sr-only"> (bonne réponse)</span>}
            </button>
          );
        })}
      </div>
      <div className="quiz-fb" aria-live="polite">
        {done && (
          <div className={`quiz-fb-in ${ok ? "is-ok" : "is-retry"}`}>
            <p className="quiz-fb-t"><Icon name={ok ? "check" : "info"} size={20} /> {ok ? "Oui, c’est ça." : "Pas tout à fait."}</p>
            <p><Rich text={quiz.explain} /></p>
            {!ok && <p className="quiz-fb-s">Cette idée reviendra dans un prochain rappel.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── Note personnelle (reste sur l'appareil) ───────── */
function Reflect({ id, prompt, hint }: { id: string; prompt: string; hint?: string }) {
  const all = notes.use();
  const [saved, setSaved] = useState(false);
  const t = useRef<number | undefined>(undefined);
  const fid = useId();
  return (
    <div className="reflect">
      {/* un <p> plutôt qu’un <label> : la question peut contenir des mots expliqués (des boutons) */}
      <p className="reflect-q" id={`${fid}-q`}><Rich text={prompt} /></p>
      {hint && <p className="reflect-h">{hint}</p>}
      <textarea id={fid} aria-labelledby={`${fid}-q`} rows={4} value={all[id] || ""} placeholder="Mes mots, rien que pour moi…"
        onChange={(e) => {
          const v = e.target.value;
          notes.set((n) => ({ ...n, [id]: v }));
          setSaved(true); window.clearTimeout(t.current); t.current = window.setTimeout(() => setSaved(false), 1500);
        }} />
      <p className="reflect-foot" aria-live="polite"><Icon name="lock" size={15} /> {saved ? "Enregistré sur cet appareil." : "Reste sur cet appareil. Personne d’autre ne le lit."}</p>
    </div>
  );
}

function PlanButton({ slug, geste }: { slug: string; geste: string }) {
  const p = plan.use();
  const inPlan = p.slug === slug && p.geste === geste;
  return (
    <div className="lc-plan">
      <button type="button" className={`btn ${inPlan ? "btn-ghost" : "btn-soft"}`} aria-pressed={inPlan}
        onClick={() => plan.set((x) => ({ ...x, slug, geste }))} disabled={inPlan}>
        <Icon name={inPlan ? "check" : "calendar"} size={20} /><span>{inPlan ? "C’est mon geste de la semaine" : "Choisir ce pas pour ma semaine"}</span>
      </button>
      {inPlan && <Link to="/outils/plan" className="lc-plan-l">Voir mon plan</Link>}
    </div>
  );
}

/** Contenu d'une carte (sans le titre ni les outils, gérés par le lecteur). */
export function CardBody({ card, picked, onPick, gate }: {
  card: Card; picked?: number; onPick: (i: number) => void;
  gate?: { checked: boolean[]; toggle: (i: number) => void };
}): ReactNode {
  switch (card.kind) {
    case "text":
      return (
        <>
          {card.quote && <blockquote className="lc-quote">{card.quoteLabel && <span className="lc-quote-l">{card.quoteLabel}</span>}<p><Rich text={card.quote} /></p></blockquote>}
          <Paras xs={card.body} />
          <Bullets xs={card.list} />
          <Paras xs={card.after} />
          {card.plan && <PlanButton {...card.plan} />}
        </>
      );
    case "tiles":
      return (
        <>
          <Paras xs={card.body} />
          <ul className="lc-tiles">
            {card.tiles.map((t, i) => (
              <li key={i} className={t.tone ? `tone-${t.tone}` : ""}>
                {t.icon && <span className="lc-tile-ic"><Icon name={t.icon} size={22} /></span>}
                <span><b><Rich text={t.title} /></b><span className="lc-tile-t"><Rich text={t.text} /></span></span>
              </li>
            ))}
          </ul>
        </>
      );
    case "steps":
      return (
        <>
          <Paras xs={card.body} />
          <ol className="lc-steps">
            {card.steps.map((s, i) => <li key={i}><span className="lc-step-n">{i + 1}</span><span><b><Rich text={s.title} /></b><span className="lc-step-t"><Rich text={s.text} /></span></span></li>)}
          </ol>
          {card.foot && <p className="lc-foot"><Rich text={card.foot} /></p>}
        </>
      );
    case "anim":
      return <><Paras xs={card.body} /><Anim k={card.anim} label={card.title} /></>;
    case "widget":
      return <><Paras xs={card.body} /><Widget k={card.widget} param={card.param} /></>;
    case "gate":
      return (
        <>
          <Paras xs={card.body} />
          <div className="gate" role="group" aria-label="Avant de commencer">
            {card.items.map((it, i) => {
              const on = !!gate?.checked[i];
              return (
                <button key={i} type="button" className={`fiche-c ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => gate?.toggle(i)}>
                  <span className="fiche-box" aria-hidden="true">{on && <Icon name="check" size={18} />}</span>
                  <span><Rich text={it} terms={false} /></span>
                </button>
              );
            })}
          </div>
          <Paras xs={card.after} />
          <p className="gate-out"><Link to="/outils/pause"><Icon name="wind" size={18} /> Pas maintenant : je fais plutôt la pause en trois temps</Link></p>
        </>
      );
    case "reflect":
      return <><Paras xs={card.body} /><Reflect id={card.noteId} prompt={card.prompt} hint={card.hint} /></>;
    case "links":
      return (
        <>
          <Paras xs={card.body} />
          <Bullets xs={card.list} />
          <Paras xs={card.after} />
          <div className="lc-links">{card.links.map((l, i) => <LinkBtn key={l.to} l={l} variant={i === 0 ? "primary" : "soft"} />)}</div>
        </>
      );
    case "quiz":
      return <QuizView quiz={card.quiz} picked={picked} onPick={onPick} labelledBy="lcard-h" />;
    case "rappel":
      return <QuizView quiz={card.quiz} picked={picked} onPick={onPick} labelledBy="lcard-h" label={`Une idée de la leçon « ${card.from} »`} />;
    case "fiche":
      return <FicheItem slug={card.slug} />;
    case "retain":
      return <ul className="lc-retain">{card.items.map((x, i) => <li key={i}><Icon name="star" size={20} /><span><Rich text={x} /></span></li>)}</ul>;
    case "end":
      return (
        <>
          <Paras xs={card.body} />
          <div className="lc-links lc-end">
            {card.primary && <LinkBtn l={card.primary} variant="primary" />}
            {card.links.map((l) => <LinkBtn key={l.to} l={l} variant="ghost" />)}
          </div>
        </>
      );
  }
}

export function CardExtras({ card }: { card: Card }) {
  return (
    <>
      {card.why && <p className="lc-why"><b>Pourquoi cette étape ?</b> <Rich text={card.why} /></p>}
      {card.ground && (
        <p className="lc-ground"><Icon name="heart" size={18} /><span>Si c’est trop fort : j’ouvre les yeux, je pose les pieds au sol, je nomme cinq choses que je vois. <Link to="/outils/pause">Je m’arrête et je me pose</Link></span></p>
      )}
      {card.more && (
        <details className="lc-more">
          <summary><Icon name="plus" size={18} /> {card.more.label ?? "En savoir plus"}</summary>
          <Paras xs={card.more.body} />
        </details>
      )}
      {card.pro && <Pro>{card.pro}</Pro>}
    </>
  );
}
