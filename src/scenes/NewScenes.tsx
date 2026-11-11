import type { CSSProperties, ReactNode } from "react";
import { Player } from "../components/Player";
import { Figure, type Pose } from "../components/Figure";
import { Chair, LEG, Person, seatHip, type BodyName } from "../components/Person";
import { deepFr } from "../lib/typo";

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/* ═════════ 1. D'où vient un schéma : le parapluie ═════════ */
export const PARAPLUIE_CAPS: ReactNode[] = deepFr([
  "Tout enfant a des besoins : être en sécurité, être aimé, être écouté.",
  "Parfois, un besoin manque, et pas seulement une fois : souvent, pendant longtemps.",
  "L’enfant fait comme il peut pour se protéger. Il ouvre un parapluie.",
  "Ce parapluie l’aide à tenir. C’est une adaptation, pas un défaut.",
  "Devenu adulte, il garde le parapluie ouvert, même quand il fait beau. Et le parapluie lui cache aussi le soleil.",
  "Un schéma ressemble à ce parapluie. Petit à petit, on peut apprendre à le baisser quand il n’est plus utile.",
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
  "Le schéma s’allume, et sa petite voix murmure : “Si on me connaissait vraiment, on ne m’aimerait pas.”",
  "Parfois, je la crois et je me fais tout(e) petit(e) : c’est capituler. Le corps se fige.",
  "Parfois, je m’éloigne de tout ce qui pourrait la réveiller : c’est éviter. Je fuis.",
  "Et parfois, je fais tout l’inverse, en trop : je me montre très sûr(e) de moi. C’est surcompenser, comme pour combattre.",
  "Sur le moment, chacune soulage un peu. Mais à chaque fois, la petite voix parle plus fort.",
  "Ce sont des réflexes : on les repère, on n’est pas obligé de les suivre. L’adulte sain peut choisir un autre geste.",
]);

const RE_G = 262;
const reAt = (cx: number, s: number) => ({ x: cx - 20 * s, y: RE_G - 74 * s, scale: s });
// figure principale (étapes 1 à 4) : centre, échelle, posture, libellé.
// `word` : le mot de la leçon et des questions (capituler, éviter, surcompenser), écrit au-dessus de l'image (se figer…).
const RE_MAIN: { cx: number; s: number; pose: Pose; label: string; word: string }[] = [
  { cx: 180, s: 1.1, pose: "stand", label: "", word: "" },
  { cx: 180, s: 0.78, pose: "bow", label: "se figer", word: "capituler" },
  { cx: 296, s: 1.1, pose: "walk", label: "fuir", word: "éviter" },
  { cx: 180, s: 1.55, pose: "puff", label: "combattre", word: "surcompenser" },
];
const RE_TRIO: { pose: Pose; label: string; word: string; walk?: boolean }[] = [
  { pose: "bow", label: "se figer", word: "capituler" }, { pose: "walk", label: "fuir", word: "éviter", walk: true }, { pose: "puff", label: "combattre", word: "surcompenser" },
];
/** Deux lignes sous une figure : le mot de la leçon, puis l'image. */
function ReLabel({ x, word, label }: { x: number; word: string; label: string }) {
  return (
    <text x={x} y="281" textAnchor="middle" className="re-label">
      <tspan x={x} className="sv-label">{word}</tspan>
      <tspan x={x} dy="15" className="re-sub">{label}</tspan>
    </text>
  );
}
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
      <text x="180" y="22" textAnchor="middle" className="sv-label">la petite voix</text>
      <g className={`re-voice ${step === 4 ? "is-loud" : ""}`} style={{ transform: `scale(${vs})` }}>
        <rect x="86" y="54" width="188" height="40" rx="20" />
        <path d="M171 92 l9 14 l9 -14 z" />
        <rect x="170.5" y="88" width="19" height="7.5" className="re-voice-mask" />
        <text x="180" y="79" textAnchor="middle" className="re-voice-t">{RE_VOICE}</text>
      </g>

      <line x1="12" y1={RE_G} x2="348" y2={RE_G} className="sv-ground" />

      <g className="re-main" style={{ opacity: trio ? 0 : 1 }}>
        {step === 2 && <Speed x={main.cx - 26} y={RE_G - 58} />}
        <Figure {...reAt(main.cx, main.s)} pose={main.pose} walking={step === 2} className={main.pose === "puff" ? "re-puff" : ""} />
        {main.label && <ReLabel key={step} x={main.cx} word={main.word} label={main.label} />}
      </g>

      <g className="re-trio" style={{ opacity: trio ? 1 : 0 }}>
        {RE_TRIO.map((f, i) => (
          <g key={i}>
            <g className="re-trio-f" style={{ opacity: chosen ? 0.5 : 1 }}>
              {f.walk && <g className="re-move" style={{ transform: `translateX(${tx[i]}px)` }}><Speed x={-24 * ts} y={RE_G - 52 * ts} s={ts} /></g>}
              <Figure {...reAt(tx[i], ts)} pose={f.pose} walking={!!f.walk && trio} className={f.pose === "puff" ? "re-puff" : ""} />
            </g>
            <g className="re-move" style={{ transform: `translateX(${tx[i]}px)` }}>
              <ReLabel x={0} word={f.word} label={f.label} />
            </g>
          </g>
        ))}
      </g>

      <g className="re-adult" style={{ opacity: chosen ? 1 : 0, transform: chosen ? "none" : "translateX(16px)" }}>
        <Figure {...reAt(292, 1.25)} pose="calm" color="var(--brand)" />
        <text x="292" y="281" textAnchor="middle" className="re-adult-t">l’adulte sain</text>
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
  "Une thérapie des schémas, c’est d’abord une rencontre régulière avec un thérapeute formé.",
  "Ensemble, on commence par comprendre : quels sont mes schémas, et d’où ils viennent.",
  "Puis on s’autorise à ressentir : on revient aux émotions anciennes, à l’abri, avec le thérapeute.",
  "On s’entraîne à agir autrement : un petit pas, à la place de la réaction automatique.",
  "La relation compte aussi : le thérapeute offre un lien fiable, dans le cadre des séances. Ensuite, on en construit d’autres, avec des proches sûrs.",
  "Pas à pas, l’adulte sain grandit : cette part de moi qui sait prendre soin de mes besoins.",
]);

const TH_X0 = 12, TH_X1 = 348;
const thY = (x: number) => 250 + 5 * Math.sin((x - TH_X0) / 46);
const TH_PATH = Array.from({ length: 57 }, (_, i) => { const x = TH_X0 + (i / 56) * (TH_X1 - TH_X0); return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${thY(x).toFixed(1)}`; }).join(" ");
const TH_CY = 66, TH_R = 24;
const MILES: { x: number; label: string[]; icon: ReactNode }[] = [
  { x: 62, label: ["Comprendre"], icon: <><circle cx="-8" cy="1" r="6" /><circle cx="8" cy="1" r="6" /><path d="M-2 0 Q0 -3 2 0 M-14 0 L-17 -5 M14 0 L17 -5" /></> },
  // Pas de cœur ni d'anneaux à côté du thérapeute (ils pourraient évoquer une relation amoureuse) :
  // une vague pour l'émotion, deux bulles pour le dialogue.
  { x: 140, label: ["Ressentir"], icon: <path d="M-14 1 q3.5 -9 7 0 t7 0 t7 0 t7 0" /> },
  { x: 218, label: ["Agir", "autrement"], icon: <path d="M-13 10 H-5 V3 H3 V-4 H11 V-11" /> },
  { x: 296, label: ["Être", "en lien"], icon: <><path d="M-14 -10 h14 v9 h-8 l-4 4 v-4 h-2 z" /><path d="M-2 0 h16 v9 h-2 v4 l-4 -4 h-10 z" /></> },
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
      <Figure {...fig(px, ps)} pose="calm" className="th-fig" />
      {step === 0 && <g className="sv-pop">
        <text x={tx} y="282" textAnchor="middle" className="th-who">thérapeute</text>
        <text x={px} y="282" textAnchor="middle" className="th-who">moi</text>
      </g>}
      {end && <g className="sv-pop"><text x="354" y="282" textAnchor="end" className="sv-label">l’adulte sain</text></g>}
    </svg>
  );
}

export function TherapieAnimation() {
  return <Player label="Le chemin d’une thérapie des schémas" captions={THERAPIE_CAPS} aspect="360 / 290" render={(s) => <Therapie step={s} />}
    transcript={<ol>{THERAPIE_CAPS.map((c, i) => <li key={i}>{c}</li>)}</ol>} />;
}


/* ═════════ 4. La réécriture en imagination ═════════ */
export const IMAGERIE_CAPS: ReactNode[] = deepFr([
  "En séance, je ferme les yeux et je laisse revenir une scène ancienne, comme un film.",
  "Je regarde ce qui se passe, et ce que ressent l’enfant que j’étais. Le thérapeute est là, il me parle.",
  "Puis quelqu’un entre dans la scène : le thérapeute, ou l’adulte que je suis devenu(e).",
  "Il se met à côté de l’enfant. Il le protège, l’écoute, et lui donne enfin ce qui lui manquait.",
  "Ensuite, on revient doucement au présent, et on parle de ce qui a changé.",
  "C’est un travail qui se fait avec un thérapeute formé : un souvenir très douloureux, on ne le revit pas seul(e).",
]);

const IM_G = 284;                         // sol de la séance
const IM_FG = 138;                        // sol à l'intérieur du film
const IM_S = 1.05, IM_TX = 100, IM_PX = 262;
const IM_THER = seatHip(IM_TX, IM_G, IM_S, 1);
const IM_ME = seatHip(IM_PX, IM_G, IM_S, -1);
const IM_CS = 0.85, IM_AS = 0.78;          // enfant, adulte dans le film
const IM_ZOOM = 1.3;                       // le film entier est agrandi : de y 12 à 197, au-dessus des têtes assises (≈ 217)
// adulte du film : position et posture selon l'étape (invisible avant l'étape 3)
const imAdult = (step: number): { hx: number; body: BodyName } =>
  step <= 1 ? { hx: 288, body: "stand" } : step === 2 ? { hx: 236, body: "stand" } : { hx: 190, body: "kneel" };
const IM_TXT = deepFr({ ther: "thérapeute", eyes: "les yeux fermés", end: "avec un thérapeute formé" });

function Imagerie({ step }: { step: number }) {
  const film = step <= 3;
  const warm = step >= 3;
  const ad = imAdult(step);
  const adY = IM_FG - (ad.body === "kneel" ? LEG : 2 * LEG) * IM_AS;
  return (
    <svg viewBox="0 0 360 310" className={`sv im-scene ${step === 2 ? "im-walking" : ""}`} data-step={step}>
      {/* le souvenir, comme un film : agrandi de 30 % (depuis le haut, au centre) pour rester lisible sur téléphone */}
      <g className="im-film" style={{ opacity: film ? 1 : 0, transform: `scale(${IM_ZOOM})`, transformOrigin: "180px 12px" }}>
        <rect x="56" y="12" width="248" height="142" rx="18" className={`im-screen ${warm ? "is-warm" : ""}`} />
        <line x1="76" y1={IM_FG} x2="284" y2={IM_FG} className="im-floor" />
        <g className="im-cloud" style={{ opacity: warm ? 0 : 1, transform: warm ? "translateY(-8px) scale(.7)" : "none" }}>
          <path d="M-30 14 Q-44 14 -42 2 Q-40 -10 -26 -8 Q-22 -24 -4 -22 Q8 -32 24 -22 Q42 -22 40 -4 Q48 8 34 14 Z" transform="translate(228 50)" />
        </g>
        <g className="im-need">
          <circle cx="129" cy="92" r="3" className="im-bub" /><circle cx="121" cy="83" r="4.5" className="im-bub" />
          <circle cx="104" cy="58" r="22" className="im-bub" />
          {/* le besoin de l'enfant : un soleil (chaleur, sécurité), terne puis lumineux. Pas de cœur dans une scène avec le thérapeute. */}
          <g className={`im-sun ${warm ? "" : "is-dim"}`} transform="translate(104 58)">
            <circle r="7.5" /><path d="M0 -11.5v-3.5M0 11.5v3.5M-11.5 0h-3.5M11.5 0h3.5M-8.1 -8.1l-2.5 -2.5M8.1 8.1l2.5 2.5M-8.1 8.1l-2.5 2.5M8.1 -8.1l2.5 -2.5" />
          </g>
        </g>
        <Person hx={146} hy={IM_FG - 3 * IM_CS} s={IM_CS} body="floor" color="var(--ink-2)" />
        <Person hx={ad.hx} hy={adY} s={IM_AS} body={ad.body} color="var(--brand)" flip
          className="im-adult" style={{ opacity: step >= 2 ? 1 : 0 }} />
      </g>
      {/* le film se passe « dans la tête » de la personne assise */}
      <g className="im-think" style={{ opacity: film ? 1 : 0 }}>
        <circle cx="251" cy="212" r="2.6" /><circle cx="244" cy="204" r="3.8" />
      </g>

      <line x1="12" y1={IM_G} x2="348" y2={IM_G} className="sv-ground" />
      <Chair x={IM_TX} g={IM_G} s={IM_S} dir={1} />
      <Chair x={IM_PX} g={IM_G} s={IM_S} dir={-1} />
      <Person {...IM_THER} body="sit" color="var(--brand)" eyes="open" />
      <Person {...IM_ME} body="sit" eyes={step >= 4 ? "open" : "closed"} />
      {step === 1 && <path d="M125 214 q5 8 0 16 M132 209 q8 13 0 26" className="im-talk sv-pop" />}

      {/* retour au présent : on parle de ce qui a changé (une bulle de parole, tournée vers le thérapeute) */}
      {step === 4 && <g className="sv-pop">
        <path d={bubblePath(190, 150, 64, 34, 232, 244, 204)} className="im-say" />
        <circle cx="208" cy="167" r="2.8" className="im-say-dot" /><circle cx="222" cy="167" r="2.8" className="im-say-dot" /><circle cx="236" cy="167" r="2.8" className="im-say-dot" />
      </g>}
      {step === 5 && <g className="sv-pop">
        <rect x="88" y="128" width="184" height="32" rx="16" className="im-pill" />
        <text x="180" y="149" textAnchor="middle" className="im-pill-t">{IM_TXT.end}</text>
      </g>}

      <text x={IM_THER.hx + 6} y="303" textAnchor="middle" className="sv-label im-who" style={{ opacity: step <= 1 ? 1 : 0 }}>{IM_TXT.ther}</text>
      <text x={IM_ME.hx - 6} y="303" textAnchor="middle" className="sv-label im-who" style={{ opacity: step <= 3 ? 1 : 0 }}>{IM_TXT.eyes}</text>
    </svg>
  );
}

export function ImagerieAnimation() {
  return <Player label="La réécriture en imagination, en séance" captions={IMAGERIE_CAPS} aspect="360 / 310" render={(s) => <Imagerie step={s} />}
    transcript={<ol>{IMAGERIE_CAPS.map((c, i) => <li key={i}>{c}</li>)}</ol>} />;
}

/* ═════════ 5. Le dialogue des chaises ═════════ */
export const CHAISES_CAPS: ReactNode[] = deepFr([
  "Deux chaises se font face. Chacune va donner la parole à une part de moi.",
  "Assis(e) sur la première, je laisse parler la petite voix : « Tu vas encore tout rater. »",
  "Je passe sur l’autre chaise. De là, je dis ce que ça me fait : « Ça me fait mal. J’ai peur. »",
  "Puis je me lève. C’est l’adulte sain qui parle, et il dit stop : « Tu me parles trop durement. »",
  "Il se tourne vers l’enfant, avec douceur : « Tu as le droit d’essayer. Je suis là. »",
  "On finit toujours avec l’adulte sain. Le thérapeute guide, et dit quand changer de place.",
]);

const CH_G = 254, CH_S = 1.45, CH_X1 = 58, CH_X2 = 302, CH_AS = 1.45;
const CH_TXT = deepFr({
  chair1: "la petite voix", chair2: "ce que je ressens", end: "l’adulte sain a le dernier mot",
  voice: ["Tu vas encore tout rater."], feel: ["Ça me fait mal. J’ai peur."],
  firm: ["Stop.", "Tu me parles trop durement."], kind: ["Tu as le droit d’essayer.", "Je suis là."],
});
// bulle : rectangle arrondi et pointe (base en bx, pointe en tx ty), d'un seul tracé
const bubblePath = (x: number, y: number, w: number, h: number, bx: number, tx: number, ty: number) => {
  const r = Math.min(20, h / 2);
  return `M${x + r} ${y} H${x + w - r} A${r} ${r} 0 0 1 ${x + w} ${y + r} V${y + h - r} A${r} ${r} 0 0 1 ${x + w - r} ${y + h} `
    + `H${bx + 9} L${tx} ${ty} L${bx - 9} ${y + h} H${x + r} A${r} ${r} 0 0 1 ${x} ${y + h - r} V${y + r} A${r} ${r} 0 0 1 ${x + r} ${y} Z`;
};
const CH_BUBBLES: { x: number; y: number; w: number; h: number; bx: number; tx: number; ty: number; lines: string[]; cls: string }[] = [
  { x: 14, y: 74, w: 226, h: 44, bx: 74, tx: 72, ty: 140, lines: CH_TXT.voice, cls: "ch-say-voice" },
  { x: 120, y: 74, w: 226, h: 44, bx: 282, tx: 284, ty: 150, lines: CH_TXT.feel, cls: "ch-say-feel" },
  { x: 12, y: 34, w: 248, h: 62, bx: 166, tx: 176, ty: 120, lines: CH_TXT.firm, cls: "ch-say-firm" },
  { x: 100, y: 34, w: 248, h: 62, bx: 194, tx: 184, ty: 120, lines: CH_TXT.kind, cls: "ch-say-kind" },
];

function Chaises({ step }: { step: number }) {
  const b = step >= 1 && step <= 4 ? CH_BUBBLES[step - 1] : null;
  return (
    <svg viewBox="0 0 360 300" className="sv ch-scene" data-step={step}>
      <line x1="12" y1={CH_G} x2="348" y2={CH_G} className="sv-ground" />
      <Chair x={CH_X1} g={CH_G} s={CH_S} dir={1} className="ch-chair-voice" />
      <Chair x={CH_X2} g={CH_G} s={CH_S} dir={-1} />
      {/* le trajet : d'une chaise à l'autre (étape 2), puis de la chaise au centre, debout (étape 3) */}
      {step === 2 && <g key="m2" className="ch-move sv-pop"><path d={`M${CH_X1 + 30} 202 Q180 156 ${CH_X2 - 50} 202`} /><path d={`M${CH_X2 - 60} 193 l10 9 -13 3`} className="ch-move-head" /></g>}
      {step === 3 && <g key="m3" className="ch-move sv-pop"><path d={`M${CH_X2 - 30} 196 Q252 164 206 190`} /><path d={`M213 180 l-7 10 13 2`} className="ch-move-head" /></g>}
      <text x={CH_X1 + 16} y="280" textAnchor="middle" className="ch-lab ch-lab1">{CH_TXT.chair1}</text>
      <text x={CH_X2 - 16} y="280" textAnchor="middle" className="ch-lab">{CH_TXT.chair2}</text>

      {/* une seule personne : elle change de place (fondu), puis se lève */}
      <Person {...seatHip(CH_X1, CH_G, CH_S, 1)} body="sit" className="ch-who" style={{ opacity: step === 1 ? 1 : 0 }} />
      <Person {...seatHip(CH_X2, CH_G, 1.3, -1)} body="sitBow" className="ch-who" style={{ opacity: step === 2 ? 1 : 0 }} />
      <Person hx={180} hy={CH_G - 2 * LEG * CH_AS} s={CH_AS} body={step === 3 ? "firm" : step === 4 ? "kind" : "stand"} flip={step === 3}
        color="var(--brand)" className="ch-who" style={{ opacity: step >= 3 ? 1 : 0 }} />

      {b && <g key={step} className={`ch-say ${b.cls} sv-pop`}>
        <path d={bubblePath(b.x, b.y, b.w, b.h, b.bx, b.tx, b.ty)} className="ch-say-b" />
        <text x={b.x + b.w / 2} y={b.y + (b.lines.length > 1 ? 26 : 28)} textAnchor="middle" className="ch-say-t">
          {b.lines.map((l, k) => <tspan key={k} x={b.x + b.w / 2} dy={k === 0 ? 0 : 21}>{l}</tspan>)}
        </text>
      </g>}
      {step === 5 && <g className="sv-pop">
        <rect x="70" y="74" width="220" height="32" rx="16" className="ch-pill" />
        <text x="180" y="95" textAnchor="middle" className="ch-pill-t">{CH_TXT.end}</text>
      </g>}
    </svg>
  );
}

export function ChaisesAnimation() {
  return <Player label="Le dialogue des chaises, en séance" captions={CHAISES_CAPS} aspect="360 / 300" render={(s) => <Chaises step={s} />}
    transcript={<ol>{CHAISES_CAPS.map((c, i) => <li key={i}>{c}</li>)}</ol>} />;
}
