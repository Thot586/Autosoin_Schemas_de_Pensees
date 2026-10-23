import { useId, type CSSProperties, type ReactNode } from "react";
import { Player } from "../components/Player";
import { Figure } from "../components/Figure";
import type { AnimId } from "../data/types";
import { deepFr } from "../lib/typo";

/* ═════════ 1. Lunettes teintées (base 1) ═════════ */
const WORDS: { t: string; k: "n" | "c" | "x"; s?: string }[] = [
  { t: "Réunion", k: "n" }, { t: "Sans réponse", k: "c", s: "Abandon" }, { t: "Invitation", k: "n" }, { t: "Mail", k: "n" },
  { t: "Câlin", k: "x" }, { t: "Message bref", k: "c", s: "Carence affective" }, { t: "Merci", k: "x" }, { t: "Appel d’un ami", k: "x" },
  { t: "Annulé", k: "c", s: "Abandon" }, { t: "Groupe soudé", k: "c", s: "Isolement social" }, { t: "Rendez-vous", k: "n" },
  { t: "Critique", k: "c", s: "Imperfection, honte" }, { t: "Gentillesse", k: "c", s: "Méfiance, abus" },
];
const LENS_CAPS = deepFr([
  "Chaque jour, des événements variés et souvent ambigus : un message bref, un silence, une invitation.",
  "Quand la sécurité a manqué, le schéma devient une paire de lunettes teintées.",
  "Ce qui confirme le schéma ressort : « Sans réponse », « Annulé », « Critique »… et chacun renvoie à un schéma de la base 1.",
  "Les événements qui le contredisent étaient pourtant là : un câlin, un merci, l’appel d’un ami… mais ils passent inaperçus.",
  "Les lunettes ne changent pas la réalité : elles changent ce qu’on en retient. Pour voir autrement : repérer les lunettes, puis chercher aussi ce qui les contredit.",
]);

function Glasses() {
  return (
    <svg viewBox="0 0 220 90" className="lens-svg" aria-hidden="true">
      <defs><linearGradient id="lens-tint" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".38" /><stop offset="1" stopColor="var(--accent)" stopOpacity=".18" /></linearGradient></defs>
      <path d="M8 34 L2 26 M212 34 L218 26" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" />
      <rect x="10" y="22" width="88" height="58" rx="26" fill="url(#lens-tint)" stroke="var(--ink)" strokeWidth="6" />
      <rect x="122" y="22" width="88" height="58" rx="26" fill="url(#lens-tint)" stroke="var(--ink)" strokeWidth="6" />
      <path d="M98 44 Q110 36 122 44" fill="none" stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function Lunettes({ step }: { step: number }) {
  return (
    <div className="lens" data-step={step}>
      <div className="lens-glasses"><Glasses /></div>
      <ul className="lens-words">
        {WORDS.map((w, i) => (
          <li key={w.t} className={`lw lw-${w.k}`} style={{ "--i": i } as CSSProperties}>
            <span>{w.t}</span>{w.s && <small>{w.s}</small>}
          </li>
        ))}
      </ul>
      <p className="scene-quote" aria-hidden={step < 4}><span className="quote">Les lunettes ne changent pas la réalité : elles changent ce qu’on en retient.</span></p>
    </div>
  );
}

/* ═════════ 2. Marches de la confiance (base 2) ═════════ */
const STEP_LABELS = [["Choisir", "mon repas"], ["Rendre un", "travail", "« assez bien »"], ["Prendre un", "rendez-vous"], ["Faire un trajet", "sans vérifier"]];
const MARCHES_CAPS = deepFr([
  "« Quand je serai prêt(e)… » En attendant, rien ne bouge : la confiance ne monte pas seule.",
  "C’est l’inverse : on essaie un petit pas, et la confiance suit. « Et si j’essayais un petit pas ? »",
  "Un premier pas : choisir mon repas. La confiance monte un peu.",
  "Chaque petit pas réussi ajoute un peu de confiance.",
  "Un pas plus difficile, une petite erreur : la confiance baisse un peu.",
  "Mais elle ne retombe pas à zéro : on réessaie, et elle remonte.",
  "Marche après marche, la confiance se construit.",
  "La confiance ne vient pas avant l’essai : elle vient après. Commencer par un tout petit pas suffit.",
]);
const LEVEL = [0.06, 0.06, 0.27, 0.44, 0.35, 0.58, 0.93, 0.93];
const SH = 34;                       // hauteur d'une marche
const FLOOR = 262;
// position (x du milieu, y des pieds) selon l'étape
const POS: [number, number][] = [[20, FLOOR], [20, FLOOR], [77, FLOOR - SH], [163, FLOOR - 2 * SH], [249, FLOOR - 3 * SH], [249, FLOOR - 3 * SH], [335, FLOOR - 4 * SH], [335, FLOOR - 4 * SH]];
const POSE: ("stand" | "calm" | "cheer" | "shrug" | "fist")[] = ["stand", "calm", "calm", "cheer", "shrug", "fist", "cheer", "cheer"];

function Marches({ step }: { step: number }) {
  const reached = step <= 1 ? 0 : step <= 2 ? 1 : step === 3 ? 2 : step <= 5 ? 3 : 4;
  const [x, y] = POS[step];
  const sc = 0.82;
  const bubble = step === 0 ? "Quand je serai prêt(e)…" : step === 1 ? "Et si j’essayais un petit pas ?" : step === 5 ? "J’essaie encore." : "";
  const bx = step === 5 ? 118 : 12;
  return (
    <svg viewBox="0 0 380 290" className="sv sv-marches" data-step={step}>
      <text x="14" y="14" className="sv-cap">CONFIANCE EN MOI</text>
      <rect x="14" y="22" width="352" height="14" rx="7" className="sv-track" />
      <rect x="14" y="22" width="352" height="14" rx="7" className="sv-fill" style={{ transform: `scaleX(${LEVEL[step]})`, transformOrigin: "14px 29px" }} />
      <text x="14" y="52" className="sv-tiny">faible</text><text x="366" y="52" textAnchor="end" className="sv-tiny">forte</text>
      <line x1="0" y1={FLOOR} x2="36" y2={FLOOR} className="sv-ground" />
      {[1, 2, 3, 4].map((k) => {
        const x0 = 34 + (k - 1) * 86;
        const top = FLOOR - k * SH;
        return (
          <g key={k} className={`stair ${reached >= k ? "is-on" : ""}`}>
            <rect x={x0} y={top} width="86" height={k * SH} className="stair-b" />
            <line x1={x0} y1={top} x2={x0 + 86} y2={top} className="stair-top" />
            <text className="stair-t" textAnchor="middle" x={x0 + 43} y={top + (STEP_LABELS[k - 1].length === 1 ? 20 : 15)}>
              {STEP_LABELS[k - 1].map((l, i) => <tspan key={i} x={x0 + 43} dy={i === 0 ? 0 : 13}>{l}</tspan>)}
            </text>
          </g>
        );
      })}
      <Figure x={x - 20 * sc} y={y - 74 * sc} scale={sc} pose={POSE[step]} />
      {bubble && (
        <g className="sv-bubble" key={bubble}>
          <rect x={bx} y="98" width={bubble.length * 6.3 + 22} height="30" rx="15" />
          <text x={bx + 11} y="117" className="sv-italic">{bubble}</text>
        </g>
      )}
    </svg>
  );
}

/* ═════════ 3. Le verre qui déborde (base 3) ═════════ */
const VERRE_CAPS = deepFr([
  "Chaque besoin, chaque émotion qu’on tait reste en nous, comme de l’eau dans un verre.",
  "On se tait, encore et encore : le niveau monte.",
  "Un jour, ça déborde : « J’en ai assez ! » Et l’on en conclut : « Tu vois, s’exprimer est dangereux. »",
  "Même semaine, mais on dit les petites choses quand elles arrivent : le verre reste à un niveau supportable. « Ce soir, je ne peux pas. »",
  "Dire tôt et petit se reçoit mieux que dire tard et fort. Un besoin dit à temps reste un besoin, pas un reproche.",
]);
const GLASS = "M34 62 L126 62 L112 250 L48 250 Z";
function Verre({ step }: { step: number }) {
  const cid = useId().replace(/:/g, "");
  const full = step >= 2;
  const lv = step === 0 ? 0.05 : step === 1 ? 0.7 : 1;
  const leftY = 250 - 188 * lv;
  const rightY = 250 - 188 * 0.3;
  return (
    <svg viewBox="0 0 360 300" className="sv sv-verre" data-step={step}>
      <defs><clipPath id={cid}><path d={GLASS} /></clipPath></defs>
      <g className="glass-left" style={{ opacity: step >= 3 ? 0.5 : 1, transform: step <= 1 ? "translateX(100px)" : "none" }}>
        <g clipPath={`url(#${cid})`}><rect x="30" y="0" width="100" height="300" className="water" style={{ transform: `translateY(${leftY}px)` }} /></g>
        <path d={GLASS} className="glass-line" />
        {full && <ellipse cx="80" cy="60" rx="47" ry="7" className="water-bulge" />}
        {full && <path d="M121 64 C130 98 124 142 128 196" className="drip" />}
        {step === 1 && [0, 1, 2].map((i) => <circle key={i} cx={62 + i * 18} cy="14" r="4.5" className="drop" style={{ animationDelay: `${i * 0.5}s` }} />)}
        <text x="80" y="276" textAnchor="middle" className="sv-cap">EN SE TAISANT</text>
      </g>
      {step === 2 && (
        <g className="sv-pop">
          <g className="sv-bubble-dark"><rect x="150" y="70" width="124" height="34" rx="17" /><path d="M158 100 l-16 14 l24 -6z" /><text x="212" y="92" textAnchor="middle">J’en ai assez !</text></g>
          <text x="150" y="146" className="sv-italic">« Tu vois, s’exprimer</text>
          <text x="150" y="165" className="sv-italic">est dangereux. »</text>
        </g>
      )}
      {step >= 3 && (
        <g className="glass-right" transform="translate(190 0)">
          <g clipPath={`url(#${cid})`}><rect x="30" y="0" width="100" height="300" className="water water-ok" style={{ transform: `translateY(${rightY}px)` }} /></g>
          <path d={GLASS} className="glass-line" />
          <text x="80" y="276" textAnchor="middle" className="sv-cap">EN DISANT TÔT, EN PETIT</text>
        </g>
      )}
      {step === 3 && (
        <g className="sv-bubble sv-pop"><rect x="168" y="14" width="168" height="32" rx="16" /><path d="M250 46 l-6 10 l14 -10z" /><text x="252" y="35" textAnchor="middle" className="sv-italic">Ce soir, je ne peux pas.</text></g>
      )}
      {step === 4 && (
        <g className="sv-pop"><text x="270" y="40" textAnchor="middle" className="sv-label">Un besoin dit à temps</text><text x="270" y="58" textAnchor="middle" className="sv-label">reste un besoin.</text></g>
      )}
    </svg>
  );
}

/* ═════════ 4. Une même journée (base 4) ═════════ */
// [avant, après] : les cases qui changent sont remplacées en place
const CHIPS: [string, string][] = [["Tout vérifier", "Tout vérifier"], ["Relire encore", "Relire encore"], ["Visage neutre", "Visage neutre"], ["Finir la liste", "Finir la liste"], ["Ne pas se plaindre", "Se plaindre"], ["Préparer demain", "Jeu sans but"]];
const JOURNEE_CAPS = deepFr([
  "Une journée habituelle : tout vérifier, relire encore, garder un visage neutre, ne pas se plaindre.",
  "Contrôler ses émotions et viser la perfection use l’énergie, et la tension monte.",
  "Même journée, avec un temps pour le jeu et le droit de se plaindre : l’énergie tient mieux.",
  "Se plaindre, c’est décharger la tension émotionnelle : dire que ça pèse, à quelqu’un de sûr.",
  "Le jeu et la spontanéité sont des besoins, pas des récompenses à mériter. Même un petit moment compte, et dire que ça pèse aussi.",
]);
function Bar({ label, v, ghost, kind }: { label: string; v: number; ghost?: number; kind: "e" | "t" }) {
  return (
    <div className="jbar"><span>{label}</span>
      <i><b className={`jb-${kind}`} style={{ width: `${v * 100}%` }} />{ghost !== undefined && <u className="jb-ghost" style={{ left: `${ghost * 100}%` }} />}</i>
    </div>
  );
}
function Journee({ step }: { step: number }) {
  const after = step >= 2;
  const e0 = step === 0 ? 0.86 : 0.1, t0 = step === 0 ? 0.14 : 0.88;      // journée habituelle
  const e1 = 0.84, t1 = step >= 3 ? 0.1 : 0.24;                              // avec du jeu
  return (
    <div className="jour" data-step={step}>
      <section className={`jblock ${after ? "is-after" : ""}`}>
        <h4 key={after ? "b" : "a"}>{after ? "La même journée, avec du jeu et le droit de se plaindre" : "Une journée habituelle"}</h4>
        <ul className="jchips">
          {CHIPS.map(([a, b], i) => {
            const label = after ? b : a;
            const isNew = after && a !== b;
            return <li key={label} className={isNew ? "jc-new" : ""} data-hot={step === 3 && label === "Se plaindre"} style={{ "--i": i } as CSSProperties}>{label}</li>;
          })}
        </ul>
        <Bar kind="e" label="Énergie" v={after ? e1 : e0} ghost={after ? e0 : undefined} />
        <Bar kind="t" label="Tension émotionnelle" v={after ? t1 : t0} ghost={after ? t0 : undefined} />
        <p className="jlegend" style={{ opacity: after ? 1 : 0 }}><u className="jb-ghost" /> repère : la journée habituelle</p>
      </section>
      <p className="scene-quote" aria-hidden={step < 4}><span className="quote">Le jeu et la spontanéité sont des besoins, pas des récompenses à mériter.</span></p>
    </div>
  );
}

/* ═════════ 5. La vague de l'envie (base 5) ═════════ */
const VAGUE_CAPS = deepFr([
  "Une envie monte comme une vague, de plus en plus fort.",
  "Céder coupe la vague en route : soulagement immédiat, mais on ne saura jamais si elle serait passée.",
  "Si j’attends : « Je respire. J’attends. » La vague continue de monter…",
  "…elle atteint un pic, puis redescend d’elle-même, en une dizaine de minutes environ.",
  "L’envie est une vague : elle monte, culmine, redescend. On n’a pas à lui obéir pendant qu’elle passe.",
]);
const WX0 = 44, WX1 = 360, WY0 = 214, WY1 = 52, TMAX = 14;
const wf = (t: number) => Math.exp(-Math.pow((t - 4.3) / 2.7, 2)) * (t < 0 ? 0 : 1);
const wx = (t: number) => WX0 + (t / TMAX) * (WX1 - WX0);
const wy = (t: number) => WY0 - wf(t) * (WY0 - WY1);
const WAVE = Array.from({ length: 71 }, (_, i) => { const t = (i / 70) * TMAX; return `${i === 0 ? "M" : "L"}${wx(t).toFixed(1)} ${wy(t).toFixed(1)}`; }).join(" ");
function Vague({ step }: { step: number }) {
  const cid = useId().replace(/:/g, "");
  const prog = [2.4, 2.4, 3.6, TMAX, TMAX][step];
  const frac = prog / TMAX;
  return (
    <svg viewBox="0 0 380 270" className="sv sv-vague" data-step={step}>
      <defs><clipPath id={cid}><rect x={WX0} y="0" width={WX1 - WX0 + 6} height="270" style={{ transformOrigin: `${WX0}px 0px`, transform: `scaleX(${frac})`, transition: "transform 1.6s var(--ease)" }} /></clipPath></defs>
      <text x="14" y="24" className="sv-cap">INTENSITÉ DE L’ENVIE</text>
      <line x1={WX0} y1="36" x2={WX0} y2={WY0} className="sv-axis" /><line x1={WX0} y1={WY0} x2={WX1 + 6} y2={WY0} className="sv-axis" />
      {[0, 5, 10].map((m) => <g key={m}><line x1={wx(m)} y1={WY0} x2={wx(m)} y2={WY0 + 5} className="sv-axis" /><text x={wx(m)} y={WY0 + 20} textAnchor="middle" className="sv-tiny">{m === 0 ? "0" : `${m} min`}</text></g>)}
      <path d={WAVE} className="wave-ghost" style={{ opacity: step === 1 ? 1 : 0 }} />
      <g clipPath={`url(#${cid})`}><path d={`${WAVE} L${wx(TMAX)} ${WY0} L${WX0} ${WY0} Z`} className="wave-area" /><path d={WAVE} className="wave-line" /></g>
      {step === 1 && (
        <g className="wave-cut">
          <line x1={wx(2.4)} y1={wy(2.4)} x2={wx(2.4)} y2={WY0} className="sv-dash" />
          <circle cx={wx(2.4)} cy={wy(2.4)} r="7" className="wave-dot" />
          <text x={wx(2.4) + 12} y={WY0 - 14} className="sv-label">Soulagement</text>
          <text x={wx(7)} y={wy(7) - 10} textAnchor="middle" className="sv-ghost-t">on ne saura jamais…</text>
        </g>
      )}
      {step === 2 && <g className="sv-bubble"><rect x="150" y="34" width="150" height="30" rx="15" /><text x="225" y="54" textAnchor="middle" className="sv-italic">Je respire. J’attends.</text></g>}
      {step >= 3 && <g className="wave-end"><circle cx={wx(9.5)} cy={wy(9.5)} r="7" className="wave-dot" /><text x={wx(9.5) + 12} y={wy(9.5) - 10} className="sv-label">Elle redescend</text></g>}
    </svg>
  );
}

/* ═════════ Assemblage ═════════ */
const REG: Record<AnimId, { caps: ReactNode[]; render: (s: number) => ReactNode; aspect?: string }> = {
  lunettes: { caps: LENS_CAPS, render: (s) => <Lunettes step={s} /> },
  marches: { caps: MARCHES_CAPS, render: (s) => <Marches step={s} />, aspect: "380 / 290" },
  verre: { caps: VERRE_CAPS, render: (s) => <Verre step={s} />, aspect: "360 / 300" },
  journee: { caps: JOURNEE_CAPS, render: (s) => <Journee step={s} /> },
  vague: { caps: VAGUE_CAPS, render: (s) => <Vague step={s} />, aspect: "380 / 270" },
};

export function BaseAnimation({ id, label }: { id: AnimId; label: string }) {
  const r = REG[id];
  return (
    <Player label={label} captions={r.caps} aspect={r.aspect} render={(s) => r.render(s)}
      transcript={<ol>{r.caps.map((c, i) => <li key={i}>{c}</li>)}</ol>} />
  );
}
