import type { CSSProperties, ReactNode } from "react";
import { Player } from "../components/Player";
import { Figure, type Pose } from "../components/Figure";
import { deepFr } from "../lib/typo";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ═════════ 1. D'où vient un schéma : le parapluie ═════════ */
export const PARAPLUIE_CAPS: ReactNode[] = deepFr([
  "Tout enfant a des besoins : être en sécurité, être aimé, être écouté.",
  "Parfois, un besoin manque. Pas une fois : souvent, pendant longtemps.",
  "L’enfant fait comme il peut pour se protéger. Il ouvre un parapluie.",
  "Ce parapluie l’aide à tenir. C’est une adaptation, pas un défaut.",
  "Adulte, le parapluie reste ouvert, même quand il fait beau. Il cache aussi le soleil.",
  "Le schéma ressemble à ce parapluie. Petit à petit, on peut apprendre à le baisser quand il n’est plus utile.",
]);

const PA_G = 270;                       // ligne du sol
// parapluie, en coordonnées du personnage (40 × 80) : tenu de la main gauche (x ≈ 17, y ≈ 48)
const UX = 17, UY = -14, URX = 36, URY = 30;
const CANOPY = `M${UX - URX} ${UY} A${URX} ${URY} 0 0 1 ${UX + URX} ${UY} `
  + [0, 1, 2, 3].map((i) => { const x = UX + URX - 18 * (i + 1); return `Q${x + 9} ${UY - 6} ${x} ${UY}`; }).join(" ") + " Z";
const RIBS = `M${UX} ${UY - URY} Q${UX - 11} ${UY - 16} ${UX - 18} ${UY} M${UX} ${UY - URY} Q${UX + 11} ${UY - 16} ${UX + 18} ${UY}`;
const HEART = "M0 9 C-15 -1 -13 -14 -6 -14 C-2.5 -14 0 -11 0 -8.5 C0 -11 2.5 -14 6 -14 C13 -14 15 -1 0 9 Z";

// position du personnage (pieds au sol) : enfant puis adulte
const paPerson = (adult: boolean) => {
  const s = adult ? 1.4 : 0.95, cx = adult ? 170 : 180;
  return { s, ox: cx - 20 * s, oy: PA_G - 74 * s };
};
// pluie : chaque goutte tombe jusqu'au sol, ou jusqu'au parapluie quand il est ouvert
const RAIN_X = Array.from({ length: 11 }, (_, i) => 120 + i * 12);
const CHILD = paPerson(false);
const C_CX = CHILD.ox + UX * CHILD.s, C_CY = CHILD.oy + UY * CHILD.s, C_RX = URX * CHILD.s, C_RY = URY * CHILD.s;
const canopyTop = (x: number) => C_CY - C_RY * Math.sqrt(Math.max(0, 1 - ((x - C_CX) / C_RX) ** 2));
const RAIN_Y = 90;

function Parapluie({ step }: { step: number }) {
  const adult = step >= 4;
  const { s, ox, oy } = paPerson(adult);
  const rain = step >= 1 && step <= 3;
  const open = step >= 2;
  const lowered = step === 5;
  return (
    <svg viewBox="0 0 360 300" className="sv pa-scene" data-step={step}>
      {/* lumière du soleil : arrêtée par le parapluie, puis jusqu'à l'adulte */}
      <path d="M300 60 L176 106 L216 146 Z" className="pa-light" style={{ opacity: step === 4 ? 1 : 0 }} />
      <path d="M300 60 L146 182 L198 262 Z" className="pa-light" style={{ opacity: lowered ? 1 : 0 }} />
      <circle cx="170" cy="214" r="56" className="pa-halo" style={{ opacity: lowered ? 1 : 0 }} />
      <path d="M118 150 L214 150 L200 270 L134 270 Z" className="pa-shade" style={{ opacity: step === 4 ? 1 : 0 }} />

      <g className="pa-sun" style={{ opacity: adult ? 1 : 0, transform: adult ? "none" : "translateY(24px) scale(.6)" }}>
        <g className="pa-rays">
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i * Math.PI) / 4;
            return <line key={i} x1={300 + 25 * Math.cos(a)} y1={60 + 25 * Math.sin(a)} x2={300 + 34 * Math.cos(a)} y2={60 + 34 * Math.sin(a)} />;
          })}
        </g>
        <circle cx="300" cy="60" r="17" className="pa-sun-c" />
      </g>

      <g className="pa-cloud" style={{ opacity: rain ? 1 : 0, transform: rain ? "none" : "translateY(-14px)" }}>
        <path d="M128 86 Q112 86 114 72 Q116 58 134 60 Q138 40 160 42 Q172 26 194 34 Q214 28 222 46 Q246 44 246 64 Q250 86 228 86 Z" />
      </g>
      {rain && RAIN_X.map((x, i) => {
        const under = open && Math.abs(x - C_CX) < C_RX - 3;
        const end = under ? canopyTop(x) - 3 : PA_G - 4;
        return <line key={`${i}-${under ? "u" : "g"}`} x1={x} y1={RAIN_Y} x2={x - 2} y2={RAIN_Y + 9} className="pa-drop"
          style={{ "--fall": `${end - RAIN_Y - 9}px`, "--k": ((i * 7) % 11) / 11, animationDelay: `${-((i * 0.37) % 1.8).toFixed(2)}s` } as Vars} />;
      })}
      {step === 3 && [C_CX - C_RX + 1, C_CX + C_RX - 1].flatMap((x, j) => [0, 1].map((k) => (
        <line key={`${j}${k}`} x1={x} y1={C_CY + 2} x2={x} y2={C_CY + 10} className="pa-drop pa-drip"
          style={{ "--fall": `${PA_G - C_CY - 14}px`, "--k": 0.25 + k * 0.5, animationDelay: `${-(k * 0.7 + j * 0.35)}s` } as Vars} />
      )))}

      <line x1="12" y1={PA_G} x2="348" y2={PA_G} className="sv-ground" />

      <g className="pa-need" style={{ opacity: step <= 1 ? 1 : 0 }}>
        <circle cx="140" cy="182" r="3.5" className="pa-bub" /><circle cx="130" cy="172" r="5" className="pa-bub" />
        <circle cx="112" cy="146" r="26" className="pa-bub" />
        <path d={HEART} transform="translate(112 148) scale(1.25)" className={`pa-heart ${step === 1 ? "is-dim" : ""}`} />
      </g>

      <g className="pa-person" style={{ transform: `translate(${ox}px, ${oy}px) scale(${s})` }}>
        <g className="pa-umb" style={{ opacity: open ? 1 : 0 }}>
          <g className="pa-tilt" style={{ transformOrigin: `${UX}px 48px`, transform: lowered ? "rotate(-62deg)" : "none" }}>
            <path d={`M${UX} ${UY - URY - 5} V48 q0 7 -6 7 q-5 0 -5 -5`} className="pa-shaft" />
            <g className="pa-canopy" style={{ transformOrigin: `${UX}px ${UY - URY}px`, transform: !open ? "scale(.12, .8)" : lowered ? "scale(.62, 1)" : "none" }}>
              <path d={CANOPY} className="pa-cloth" /><path d={RIBS} className="pa-rib" />
            </g>
          </g>
        </g>
        <Figure pose={step === 1 ? "bow" : "calm"} />
      </g>

      {step === 3 && <g className="sv-pop"><text x="66" y="150" textAnchor="middle" className="sv-label">Une adaptation</text></g>}
    </svg>
  );
}

export function ParapluieAnimation() {
  return <Player label="D’où vient un schéma : le parapluie" captions={PARAPLUIE_CAPS} aspect="360 / 300" render={(s) => <Parapluie step={s} />}
    transcript={<ol>{PARAPLUIE_CAPS.map((c, i) => <li key={i}>{c}</li>)}</ol>} />;
}

/* ═════════ 2. Trois façons de réagir ═════════ */
export const REACTIONS_CAPS: ReactNode[] = deepFr([
  "Le schéma s’allume. Sa petite voix dit : “Si on me connaissait vraiment, on ne m’aimerait pas.”",
  "Capituler, c’est faire comme si c’était vrai. Je me fais tout petit. C’est le réflexe de se figer.",
  "Éviter, c’est fuir ce qui réveille le schéma. Je m’éloigne. C’est le réflexe de fuir.",
  "Surcompenser, c’est faire l’inverse, en excès. Je me fais très grand. C’est le réflexe de combattre.",
  "Les trois soulagent sur le moment. Mais à chaque fois, la petite voix devient plus forte.",
  "Ce sont des réflexes à repérer, pas des conseils à suivre. L’adulte sain peut choisir un autre geste.",
]);

const RE_G = 262;
const reAt = (cx: number, s: number) => ({ x: cx - 20 * s, y: RE_G - 74 * s, scale: s });
// figure principale (étapes 1 à 4) : centre, échelle, posture, libellé
const RE_MAIN: { cx: number; s: number; pose: Pose; label: string }[] = [
  { cx: 180, s: 1.1, pose: "stand", label: "" },
  { cx: 180, s: 0.78, pose: "bow", label: "se figer" },
  { cx: 296, s: 1.1, pose: "walk", label: "fuir" },
  { cx: 180, s: 1.5, pose: "fist", label: "combattre" },
];
const RE_TRIO: { pose: Pose; label: string; walk?: boolean }[] = [{ pose: "bow", label: "se figer" }, { pose: "walk", label: "fuir", walk: true }, { pose: "fist", label: "combattre" }];
const RE_VOICE = deepFr("On ne m’aimerait pas.");

function Speed({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <g className="re-speed">{[0, 1, 2].map((i) => <line key={i} x1={x - (14 + (i % 2) * 6) * s} y1={y + i * 11 * s} x2={x} y2={y + i * 11 * s} />)}</g>;
}

function Reactions({ step }: { step: number }) {
  const main = step <= 3 ? RE_MAIN[step] : RE_MAIN[0];
  const trio = step >= 4;
  const chosen = step === 5;
  const vs = step === 4 ? 1.3 : chosen ? 0.85 : 1;
  const tx = chosen ? [50, 120, 190] : [64, 180, 296];
  const ts = chosen ? 0.7 : 0.85;
  return (
    <svg viewBox="0 0 360 300" className="sv re-scene" data-step={step}>
      <text x="180" y="20" textAnchor="middle" className="sv-cap">LA PETITE VOIX DU SCHÉMA</text>
      <g className={`re-voice ${step === 4 ? "is-loud" : ""}`} style={{ transform: `scale(${vs})` }}>
        <rect x="86" y="54" width="188" height="40" rx="20" />
        <path d="M171 92 l9 14 l9 -14 z" />
        <rect x="170.5" y="88" width="19" height="7.5" className="re-voice-mask" />
        <text x="180" y="79" textAnchor="middle" className="re-voice-t">{RE_VOICE}</text>
      </g>

      <line x1="12" y1={RE_G} x2="348" y2={RE_G} className="sv-ground" />

      <g className="re-main" style={{ opacity: trio ? 0 : 1 }}>
        {step === 2 && <Speed x={main.cx - 26} y={RE_G - 58} />}
        <Figure {...reAt(main.cx, main.s)} pose={main.pose} walking={step === 2} />
        {main.label && <text key={step} x={main.cx} y="288" textAnchor="middle" className="sv-label re-label">{main.label}</text>}
      </g>

      <g className="re-trio" style={{ opacity: trio ? 1 : 0 }}>
        {RE_TRIO.map((f, i) => (
          <g key={i}>
            <g className="re-trio-f" style={{ opacity: chosen ? 0.5 : 1 }}>
              {f.walk && <g className="re-move" style={{ transform: `translateX(${tx[i]}px)` }}><Speed x={-24 * ts} y={RE_G - 52 * ts} s={ts} /></g>}
              <Figure {...reAt(tx[i], ts)} pose={f.pose} walking={!!f.walk && trio} />
            </g>
            <g className="re-move" style={{ transform: `translateX(${tx[i]}px)` }}>
              <text x="0" y="288" textAnchor="middle" className="sv-label re-label">{f.label}</text>
            </g>
          </g>
        ))}
      </g>

      <g className="re-adult" style={{ opacity: chosen ? 1 : 0, transform: chosen ? "none" : "translateX(16px)" }}>
        <Figure {...reAt(292, 1.25)} pose="calm" color="var(--brand)" />
        <text x="292" y="288" textAnchor="middle" className="re-adult-t">l’adulte sain</text>
      </g>
    </svg>
  );
}

export function ReactionsAnimation() {
  return <Player label="Trois façons de réagir" captions={REACTIONS_CAPS} aspect="360 / 300" render={(s) => <Reactions step={s} />}
    transcript={<ol>{REACTIONS_CAPS.map((c, i) => <li key={i}>{c}</li>)}</ol>} />;
}

/* ═════════ 3. Le chemin d'une thérapie des schémas ═════════ */
export const THERAPIE_CAPS: ReactNode[] = deepFr([
  "La thérapie des schémas se fait avec un thérapeute formé, en séances régulières.",
  "Comprendre : repérer ses schémas, et d’où ils viennent.",
  "Ressentir : revenir aux émotions anciennes, en sécurité, avec le thérapeute.",
  "Agir autrement : remplacer la réaction automatique par un petit pas.",
  "Être en lien : vivre une relation qui répond enfin au besoin.",
  "Le but : renforcer l’adulte sain, la part de soi qui prend soin de ses besoins.",
]);

const TH_X0 = 12, TH_X1 = 348;
const thY = (x: number) => 250 + 5 * Math.sin((x - TH_X0) / 46);
const TH_PATH = Array.from({ length: 57 }, (_, i) => { const x = TH_X0 + (i / 56) * (TH_X1 - TH_X0); return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${thY(x).toFixed(1)}`; }).join(" ");
const TH_CY = 66, TH_R = 24;
const MILES: { x: number; label: string[]; icon: ReactNode }[] = [
  { x: 62, label: ["Comprendre"], icon: <><circle cx="-8" cy="1" r="6" /><circle cx="8" cy="1" r="6" /><path d="M-2 0 Q0 -3 2 0 M-14 0 L-17 -5 M14 0 L17 -5" /></> },
  { x: 140, label: ["Ressentir"], icon: <path d="M0 9 C-14 0 -12 -12 -6 -12 C-2.5 -12 0 -9 0 -7 C0 -9 2.5 -12 6 -12 C12 -12 14 0 0 9 Z" /> },
  { x: 218, label: ["Agir", "autrement"], icon: <path d="M-13 10 H-5 V3 H3 V-4 H11 V-11" /> },
  { x: 296, label: ["Être", "en lien"], icon: <><circle cx="-5" cy="0" r="7.5" /><circle cx="5" cy="0" r="7.5" /></> },
];
// [thérapeute, personne] : centres x selon l'étape
const TH_POS: [number, number][] = [[40, 100], ...MILES.map((m): [number, number] => [m.x - 17, m.x + 15]), [270, 326]];
const TH_FS = 0.95;

function Therapie({ step }: { step: number }) {
  const [tx, px] = TH_POS[step];
  const end = step === 5;
  const ps = end ? 1.25 : TH_FS;
  const prog = Math.min(1, Math.max(0, (px - TH_X0) / (TH_X1 - TH_X0)));
  const fig = (cx: number, s: number) => ({ x: cx - 20 * s, y: thY(cx) - 74 * s, scale: s });
  return (
    <svg viewBox="0 0 360 290" className={`sv th-scene th-walk-${step % 2}`} data-step={step}>
      <path d={TH_PATH} className="th-road" />
      <path d={TH_PATH} className="th-road-done" pathLength={1} style={{ strokeDashoffset: 1 - prog }} />
      {MILES.map((m, i) => {
        const cur = step === i + 1;
        const lit = step >= i + 1;
        return (
          <g key={i} className={`th-mile ${lit ? "is-lit" : ""} ${cur ? "is-cur" : ""} ${end ? "is-all" : ""}`}>
            <line x1={m.x} y1={TH_CY + TH_R + 2 + m.label.length * 15 + 6} x2={m.x} y2={thY(m.x) - 8} className="th-stem" />
            <circle cx={m.x} cy={thY(m.x)} r="5" className="th-dot" />
            <g className="th-badge" style={{ transformOrigin: `${m.x}px ${TH_CY}px` }}>
              <circle cx={m.x} cy={TH_CY} r={TH_R} className="th-ring" />
              <g transform={`translate(${m.x} ${TH_CY})`} className="th-icon">{m.icon}</g>
            </g>
            <text x={m.x} y={TH_CY + TH_R + 20} textAnchor="middle" className="th-label">
              {m.label.map((l, k) => <tspan key={k} x={m.x} dy={k === 0 ? 0 : 15}>{l}</tspan>)}
            </text>
          </g>
        );
      })}
      <Figure {...fig(tx, TH_FS)} pose="calm" color="var(--brand)" className="th-fig" />
      <Figure {...fig(px, ps)} pose={end ? "cheer" : "calm"} className="th-fig" />
      {step === 0 && <g className="sv-pop">
        <text x={tx} y="282" textAnchor="middle" className="th-who">thérapeute</text>
        <text x={px} y="282" textAnchor="middle" className="th-who">moi</text>
      </g>}
      {end && <g className="sv-pop"><text x="354" y="148" textAnchor="end" className="sv-label">l’adulte sain</text></g>}
    </svg>
  );
}

export function TherapieAnimation() {
  return <Player label="Le chemin d’une thérapie des schémas" captions={THERAPIE_CAPS} aspect="360 / 290" render={(s) => <Therapie step={s} />}
    transcript={<ol>{THERAPIE_CAPS.map((c, i) => <li key={i}>{c}</li>)}</ol>} />;
}
