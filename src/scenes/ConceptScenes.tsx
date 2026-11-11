import type { ReactNode } from "react";
import { Player } from "../components/Player";
import { HOLD_HIP, LEG, Person, type BodyName } from "../components/Person";
import { CONTENT } from "../data/content";
import { deepFr } from "../lib/typo";

/* ═════════ Le cercle qui entretient un schéma (partie 3) ═════════ */
const C3 = CONTENT.p3.cercle;
const NW = 108, NH = 58;
const NODES = [
  { x: 180, y: 46, t: ["Une", "situation"], a: ["Repérer", "la situation"] },
  { x: 302, y: 168, t: ["Le schéma", "s’allume"], a: ["Nommer", "l’émotion"] },
  { x: 180, y: 290, t: ["Une réaction", "automatique"], a: ["Choisir une", "autre réaction"] },
  { x: 58, y: 168, t: ["Le schéma", "se confirme"], a: ["", ""] },
];
// Légendes écrites comme on raconte (et non assemblées automatiquement) : reprennent la diapo 20 et son exemple.
const CYCLE_CAPS: ReactNode[] = deepFr([
  "Un schéma s’entretient comme un cercle. On peut en comprendre chaque étape… et en sortir.",
  "Tout commence par une situation qui ressemble à une ancienne blessure. Par exemple, un message reste sans réponse.",
  "Le schéma s’allume : l’émotion monte, plus forte que la situation. Ici, c’est l’angoisse.",
  "Vient la réaction automatique : on relance, encore et encore, avec insistance.",
  "L’autre finit par s’agacer… et le schéma se confirme : « Je le savais. »",
  "Puis le cercle recommence. À chaque tour, le schéma se renforce un peu plus.",
  "Mais on peut l’interrompre à chaque étape : repérer la situation, nommer l’émotion, choisir une autre réaction.",
]);
void C3;
const R = 122;
const pt = (a: number) => [180 + R * Math.cos((a * Math.PI) / 180), 168 + R * Math.sin((a * Math.PI) / 180)];
function arc(a0: number, a1: number) {
  const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
  const t = [-Math.sin((a1 * Math.PI) / 180), Math.cos((a1 * Math.PI) / 180)], n = [Math.cos((a1 * Math.PI) / 180), Math.sin((a1 * Math.PI) / 180)];
  const h = (k: number) => `${(x1 - 9 * t[0] + k * 5.5 * n[0]).toFixed(1)} ${(y1 - 9 * t[1] + k * 5.5 * n[1]).toFixed(1)}`;
  return { d: `M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`, head: `M${h(1)} L${x1.toFixed(1)} ${y1.toFixed(1)} L${h(-1)}` };
}
// angles (0° = droite, sens horaire) : haut = 270° (−90°)
const ARCS = [arc(-55, -20), arc(20, 55), arc(125, 160), arc(200, 235)];
// angle du point qui fait le tour, par étape : au milieu de l'arc qui suit l'étape éclairée (−37,5° = après « Une situation »)
const CY_DOT = [322.5, 322.5, 397.5, 502.5, 577.5, 682.5, 682.5];

function Cycle({ step }: { step: number }) {
  const active = step >= 1 && step <= 4 ? step - 1 : -1;
  const lap = step >= 5 ? 2 : 1;
  const interrupt = step === 6;
  const ex = step >= 1 && step <= 4 ? C3.exempleEtapes[step - 1] : "";
  return (
    <svg viewBox="0 0 360 336" className="sv sv-cycle" data-step={step}>
      {ARCS.map((g, i) => {
        const on = (step > i && step <= 5) || step >= 5;
        return <g key={i} className={`cy-arcg ${on ? "is-on" : ""} ${step >= 5 && step < 6 ? "is-all" : ""}`}><path d={g.d} className="cy-arc" pathLength={1} /><path d={g.head} className="cy-head" /></g>;
      })}
      {/* un point fait le tour : il avance d'une étape à l'autre, tourne en boucle quand le schéma se renforce,
          et disparaît quand on interrompt le cercle. La rotation suit l'arc (angles toujours croissants). */}
      <g className={`cy-dot ${step === 5 ? "is-lap" : ""}`} style={{ transform: `rotate(${CY_DOT[step]}deg)`, opacity: step >= 1 && step <= 5 ? 1 : 0 }}>
        <circle cx={180 + R} cy="168" r="7" />
      </g>
      {NODES.map((n, i) => {
        const lit = active === i || step === 5 || (interrupt && i < 3);
        const act = interrupt && i < 3;
        const lines = act ? n.a : n.t;
        return (
          <g key={i} className={`cy-node ${active === i ? "is-active" : ""} ${act ? "is-act" : ""} ${interrupt && i === 3 ? "is-dim" : ""}`} style={{ transform: `translate(${n.x - NW / 2}px, ${n.y - NH / 2}px)` }}>
            <rect width={NW} height={NH} rx="16" className={lit ? "lit" : ""} />
            <circle cx="3" cy="3" r="10.5" className="cy-badge" /><text x="3" y="7.2" textAnchor="middle" className="cy-badge-t">{i + 1}</text>
            <text className="cy-t" x={NW / 2} y={lines[1] ? 26 : 33} textAnchor="middle" key={act ? "a" : "t"}>
              <tspan x={NW / 2}>{lines[0]}</tspan>{lines[1] && <tspan x={NW / 2} dy="15">{lines[1]}</tspan>}
            </text>
          </g>
        );
      })}
      <g className="cy-center">
        {step === 0 && <text x="180" y="166" textAnchor="middle" className="sv-italic"><tspan x="180">Quatre étapes,</tspan><tspan x="180" dy="18">un cercle.</tspan></text>}
        {ex && <foreignObject x="118" y="124" width="124" height="88"><div className="cy-ex" key={step}>{ex}</div></foreignObject>}
        {step === 5 && (
          <g className="sv-pop"><text x="180" y="150" textAnchor="middle" className="sv-cap">TOUR {lap}</text>
            <rect x="132" y="160" width="96" height="10" rx="5" className="sv-track" /><rect x="132" y="160" width="96" height="10" rx="5" className="sv-fill cy-force" style={{ transform: "scaleX(.9)", transformOrigin: "132px 165px" }} />
            <text x="180" y="192" textAnchor="middle" className="sv-tiny">le schéma se renforce</text></g>
        )}
        {interrupt && <g className="sv-pop"><text x="180" y="160" textAnchor="middle" className="sv-label"><tspan x="180">On peut</tspan><tspan x="180" dy="17">interrompre</tspan><tspan x="180" dy="17">le cercle</tspan></text></g>}
      </g>
    </svg>
  );
}

export function CycleAnimation() {
  return <Player label="Le cercle qui entretient un schéma" captions={CYCLE_CAPS} aspect="360 / 336" render={(s) => <Cycle step={s} />}
    transcript={<ol>{CYCLE_CAPS.map((c, i) => <li key={i}>{c}</li>)}</ol>} />;
}

/* ═════════ L'adulte sain (partie 4) ═════════ */
const C4 = CONTENT.p4.adulte;
// Légendes écrites comme on raconte : reprennent la diapo 24, sans les titres d'étape lus à voix haute.
const ADULTE_CAPS: ReactNode[] = deepFr([
  "Petit(e), il m’a manqué quelque chose d’important : faire partie d’un groupe. Cette part de moi le ressent encore aujourd’hui.",
  "Une invitation à un anniversaire arrive, et le schéma s’allume. Sa petite voix répète, comme si c’était vrai : « Je ne suis pas comme eux. »",
  "Pour me protéger, je réagis sans réfléchir : je ne réponds pas. Et le besoin reste sans réponse.",
  "C’est là qu’intervient l’adulte sain, la part de moi qui a mon âge d’aujourd’hui. Avec douceur : « Je comprends que tu aies peur. » Et avec fermeté : « Et je fais quand même le pas. »",
  "Pour le retrouver, je me demande : « Quel âge ai-je l’impression d’avoir, là, maintenant ? » Si c’est l’âge de l’enfant, l’adulte prend le relais.",
  "Ce que l’adulte sain dit à l’enfant, je l’écris sur ma carte-mémo : « Je peux y aller, et repartir quand je veux. »",
]);
void C4;

function Pill({ x, y, w, children, cls = "" }: { x: number; y: number; w: number; children: ReactNode; cls?: string }) {
  return <g className={`sv-pop ${cls}`}><rect x={x} y={y} width={w} height="28" rx="14" className="ad-pill" /><text x={x + w / 2} y={y + 18.5} textAnchor="middle" className="ad-pill-t">{children}</text></g>;
}
const bw = (t: string, k = 6.7) => Math.round(t.length * k + 30);
function Bub({ cx, y, text, fill = false, tail = "down", tx }: { cx: number; y: number; text: string; fill?: boolean; tail?: "down" | "none"; tx?: number }) {
  const w = bw(text, fill ? 7.2 : 6.7);
  const x = Math.max(6, Math.min(354 - w, cx - w / 2));
  const t = tx ?? cx;
  return (
    <g className={`sv-bubble ${fill ? "sv-bubble-fill" : ""}`} style={{ transformOrigin: `${t}px ${y + 30}px` }}>
      <rect x={x} y={y} width={w} height="30" rx="15" />
      {tail === "down" && <path d={`M${t - 6} ${y + 29} l6 12 l7 -12z`} />}
      <text x={x + w / 2} y={y + 20} textAnchor="middle" className={fill ? "ad-firm" : "sv-italic"}>{text}</text>
    </g>
  );
}

// Mêmes personnages que l'imagerie et les chaises : l'adulte sain en couleur de marque, l'enfant en encre douce.
const AD_G = 270, AD_CS = 0.95, AD_AS = 1.45;
const AD_CX = 84, AD_AX = 255;           // étapes 0 à 4 : l'enfant à gauche, l'adulte à droite
const AD_HOLD_CX = 110, AD_HOLD_AX = 143; // étape 5 : main dans la main, en route vers la porte ouverte
const AD_DOOR = { x: 288, w: 44, top: 162 };

function Adulte({ step }: { step: number }) {
  const adult = step >= 3;
  const turned = step === 2;
  const together = step === 5;
  const childBody: BodyName = together ? "holdChild" : step === 1 ? "shrug" : turned ? "bow" : "calm";
  const adultBody: BodyName = together ? "holdAdult" : "calm";
  const childHy = AD_G - (together ? HOLD_HIP.child : 2 * LEG) * AD_CS;
  const adultHy = AD_G - (together ? HOLD_HIP.adult : 2 * LEG) * AD_AS;
  const childDx = together ? AD_HOLD_CX - AD_CX : turned ? -10 : 0;
  const adultDx = together ? AD_HOLD_AX - AD_AX : adult ? 0 : 30;
  return (
    <svg viewBox="0 0 360 300" className="sv sv-adulte" data-step={step}>
      <g className="ad-door" style={{ opacity: together ? 1 : 0 }}>
        <path d={`M${AD_DOOR.x} ${AD_DOOR.top + 10} L${AD_DOOR.x - 84} ${AD_G} H${AD_DOOR.x} Z`} className="ad-door-glow" />
        <rect x={AD_DOOR.x} y={AD_DOOR.top} width={AD_DOOR.w} height={AD_G - AD_DOOR.top} rx="3" className="ad-door-in" />
        <path d={`M${AD_DOOR.x + AD_DOOR.w} ${AD_DOOR.top} L${AD_DOOR.x + AD_DOOR.w + 20} ${AD_DOOR.top + 12} V${AD_G - 6} L${AD_DOOR.x + AD_DOOR.w} ${AD_G}`} className="ad-door-leaf" />
        <circle cx={AD_DOOR.x + AD_DOOR.w + 14} cy={(AD_DOOR.top + AD_G) / 2 + 8} r="2.6" className="ad-door-knob" />
      </g>
      <line x1="12" y1={AD_G} x2="348" y2={AD_G} className="sv-ground" />
      <g className="ad-child" style={{ transform: `translateX(${childDx}px)` }}>
        <Person hx={AD_CX} hy={childHy} s={AD_CS} body={childBody} color="var(--ink-2)" flip={turned} eyes="open" />
      </g>
      <g className="ad-adult" style={{ opacity: adult ? 1 : 0.07, transform: `translateX(${adultDx}px)` }}>
        <Person hx={AD_AX} hy={adultHy} s={AD_AS} body={adultBody} color="var(--brand)" flip={!together} eyes="open" />
      </g>
      {together ? <>
        <text x={AD_HOLD_CX} y="292" textAnchor="middle" className="sv-cap">L’ENFANT</text>
        <text x={AD_HOLD_AX + 4} y="292" className="sv-cap">L’ADULTE D’AUJOURD’HUI</text>
      </> : <>
        <text x={AD_CX + childDx} y="292" textAnchor="middle" className="sv-cap">L’ENFANT</text>
        <text x={AD_AX - 9} y="292" textAnchor="middle" className="sv-cap" style={{ opacity: adult ? 1 : 0.07 }}>L’ADULTE D’AUJOURD’HUI</text>
      </>}
      {step === 0 && <Pill x={30} y={120} w={176} cls="ad-need">Faire partie d’un groupe</Pill>}
      {step === 1 && <>
        <g className="sv-pop"><rect x="226" y="44" width="104" height="64" rx="10" className="ad-env" /><path d="M226 50 L278 84 L330 50" className="ad-env-l" /><text x="278" y="128" textAnchor="middle" className="sv-tiny">Invitation à un anniversaire</text></g>
        <Bub cx={120} y={130} text="Je ne suis pas comme eux." tx={84} />
      </>}
      {step === 2 && <>
        <Pill x={14} y={70} w={96}>j’évite</Pill><Pill x={116} y={70} w={96}>je capitule</Pill><Pill x={218} y={70} w={128}>je surcompense</Pill>
        <g className="sv-pop"><text x="180" y="146" textAnchor="middle" className="sv-label">Le besoin reste sans réponse.</text></g>
      </>}
      {step === 3 && <>
        <text x="200" y="28" className="sv-cap">BIENVEILLANCE</text>
        <Bub cx={218} y={34} text="Je comprends que tu aies peur." tail="none" />
        <text x="200" y="92" className="sv-cap">FERMETÉ</text>
        <Bub cx={226} y={98} text="Et je fais quand même le pas." fill tx={246} />
      </>}
      {step === 4 && <g className="sv-pop"><rect x="26" y="30" width="308" height="66" rx="18" className="ad-ask" /><text x="180" y="59" textAnchor="middle" className="sv-italic"><tspan x="180">Quel âge ai-je l’impression</tspan><tspan x="180" dy="19">d’avoir, là, maintenant ?</tspan></text></g>}
      {step === 5 && <g className="sv-pop"><rect x="22" y="22" width="316" height="82" rx="12" className="ad-card" /><text x="180" y="44" textAnchor="middle" className="sv-cap">MA CARTE-MÉMO · MA PHRASE D’ADULTE SAIN</text><text x="180" y="72" textAnchor="middle" className="ad-card-t"><tspan x="180">« Je peux y aller, et repartir</tspan><tspan x="180" dy="20">quand je veux. »</tspan></text></g>}
    </svg>
  );
}

export function AdulteAnimation() {
  return <Player label="L’adulte sain" captions={ADULTE_CAPS} aspect="360 / 300" render={(s) => <Adulte step={s} />}
    transcript={<ol>{ADULTE_CAPS.map((c, i) => <li key={i}>{c}</li>)}</ol>} />;
}
