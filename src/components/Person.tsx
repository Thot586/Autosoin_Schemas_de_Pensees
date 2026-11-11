import type { CSSProperties } from "react";

/* ═════════ Personnage assis ou à genoux, et chaise (scènes 4 et 5) ═════════
   Même dessin que Figure (40 × 80, hanche en 20 48), mais jambes en deux segments (cuisse, tibia)
   pour pouvoir s'asseoir et s'agenouiller. « Devant » = vers la droite ; `flip` le tourne vers la gauche. */
export type Body = { t: number; al: number; ar: number; a: [number, number]; b: [number, number]; h?: number };
export const BODY = {
  stand: { t: 0, al: 16, ar: -16, a: [4, 0], b: [-4, 0] },
  sit: { t: 0, al: -26, ar: -40, a: [-86, 86], b: [-94, 94] },
  sitBow: { t: 22, al: -42, ar: -58, a: [-86, 86], b: [-94, 94], h: 3 },
  floor: { t: 14, al: -48, ar: -58, a: [-110, 50], b: [-116, 56], h: 2 },
  kneel: { t: 12, al: -74, ar: -8, a: [-90, 90], b: [-4, 94] },
  firm: { t: -3, al: 8, ar: -98, a: [7, 0], b: [-7, 0], h: -2 },
  kind: { t: 8, al: 10, ar: -52, a: [4, 0], b: [-4, 0], h: 2 },
  // mêmes postures que Figure (calm, shrug, bow)
  calm: { t: 0, al: 11, ar: -11, a: [4, 0], b: [-4, 0] },
  shrug: { t: 0, al: 52, ar: -52, a: [4, 0], b: [-4, 0] },
  bow: { t: 24, al: 24, ar: -24, a: [4, 0], b: [-4, 0], h: 4 },
  // main dans la main, en marchant vers la droite : l'enfant (échelle 0,95) tend le bras devant lui,
  // l'adulte (échelle 1,45), à 33 unités devant, descend le sien vers l'arrière. Angles calculés pour que
  // les mains se rejoignent (hanches posées à HOLD_HIP au-dessus du sol).
  holdChild: { t: 0, al: -83, ar: -14, a: [-16, 8], b: [14, 6] },
  holdAdult: { t: 0, al: -18, ar: 23, a: [-14, 6], b: [14, 4] },
} satisfies Record<string, Body>;
/** Hauteur de la hanche (en unités, × échelle) pour holdChild et holdAdult : le pied avant touche le sol. */
export const HOLD_HIP = { child: 31.2, adult: 31.4 } as const;
export type BodyName = keyof typeof BODY;
export const LEG = 16; // cuisse = tibia : 16 unités
export const SEAT = LEG + 1.5; // hanche assise un peu au-dessus du tibia : le pied (bout arrondi) ne passe pas sous le sol

/** Place la hanche en (hx, hy). Debout : hy = sol − 32 s ; à genoux : hy = sol − 16 s ; assis : voir seatHip. */
export function Person({ hx, hy, s, body = "stand", color = "var(--ink)", flip = false, eyes, className = "", style }: {
  hx: number; hy: number; s: number; body?: BodyName; color?: string; flip?: boolean; eyes?: "closed" | "open"; className?: string; style?: CSSProperties;
}) {
  const p: Body = BODY[body];
  const leg = (tk: [number, number], k: string) => (
    <g key={k} className={`fig-leg ch-thigh ch-thigh-${k}`} style={{ transformOrigin: "20px 48px", transform: `rotate(${tk[0]}deg)` }}>
      <line x1="20" y1="48" x2="20" y2={48 + LEG} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      <g className="fig-leg" style={{ transformOrigin: `20px ${48 + LEG}px`, transform: `rotate(${tk[1]}deg)` }}>
        <line x1="20" y1={48 + LEG} x2="20" y2={48 + 2 * LEG} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      </g>
    </g>
  );
  return (
    <g className={`fig ${className}`} color={color}
      style={{ transform: `translate(${hx}px, ${hy}px) scale(${flip ? -s : s}, ${s}) translate(-20px, -48px)`, ...style }}>
      {leg(p.b, "b")}{leg(p.a, "a")}
      <g className="fig-upper" style={{ transform: `rotate(${p.t}deg)`, transformOrigin: "20px 48px" }}>
        <line x1="20" y1="14" x2="20" y2="48" stroke={color} strokeWidth="5" strokeLinecap="round" />
        <g className="fig-head" style={{ transform: `translateY(${p.h ?? 0}px)` }}>
          <circle cx="20" cy="10" r="8.5" fill={color} />
          {eyes === "closed" && <path d="M21.5 10.5 q2.6 2.4 5.2 0" className="ch-eye" />}
          {eyes === "open" && <circle cx="24.2" cy="9.4" r="1.6" className="ch-eye-o" />}
        </g>
        <g className="fig-arm" style={{ transformOrigin: "20px 26px", transform: `rotate(${p.ar}deg)` }}><line x1="20" y1="26" x2="20" y2="48" stroke={color} strokeWidth="5" strokeLinecap="round" /></g>
        <g className="fig-arm" style={{ transformOrigin: "20px 26px", transform: `rotate(${p.al}deg)` }}><line x1="20" y1="26" x2="20" y2="48" stroke={color} strokeWidth="5" strokeLinecap="round" /></g>
      </g>
    </g>
  );
}

/** Chaise vue de profil, dossier en x, tournée vers la droite (dir = 1) ou la gauche (dir = −1), pour un personnage d'échelle s. */
export function Chair({ x, g, s, dir = 1, className = "" }: { x: number; g: number; s: number; dir?: 1 | -1; className?: string }) {
  const seat = g - SEAT * s + 3.5 * s, d = 19 * s * dir;
  return <path d={`M${x} ${g} V${seat - 30 * s} M${x} ${seat} H${x + d} V${g}`} className={`ch-chair ${className}`} />;
}
/** Hanche d'un personnage assis sur la chaise de dossier x. */
export const seatHip = (x: number, g: number, s: number, dir: 1 | -1 = 1) => ({ hx: x + 8 * s * dir, hy: g - SEAT * s, s, flip: dir < 0 });
