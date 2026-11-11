import type { CSSProperties } from "react";

export type Pose = "stand" | "cheer" | "bow" | "fist" | "shrug" | "walk" | "calm" | "puff";
const POSES: Record<Pose, { al: number; ar: number; tilt: number; head: number }> = {
  stand: { al: 14, ar: -14, tilt: 0, head: 0 },
  calm: { al: 11, ar: -11, tilt: 0, head: 0 },
  cheer: { al: 128, ar: -128, tilt: 0, head: -2 },
  bow: { al: 24, ar: -24, tilt: 24, head: 4 },
  fist: { al: 14, ar: -128, tilt: -3, head: -2 },
  shrug: { al: 52, ar: -52, tilt: 0, head: 0 },
  walk: { al: 30, ar: -30, tilt: 4, head: 0 },
  // bombe le torse : bras tendus vers le bas et l'extérieur, buste en arrière (jambes écartées : classe .re-puff)
  puff: { al: 34, ar: -34, tilt: -4, head: -3 },
};

/** Personnage « bâton » : bras et buste animés par transitions CSS. 40 × 80 unités. */
export function Figure({ x = 0, y = 0, scale = 1, pose = "stand", color = "var(--ink)", flip = false, walking = false, eyes = true, className = "", style }: {
  x?: number; y?: number; scale?: number; pose?: Pose; color?: string; flip?: boolean; walking?: boolean; eyes?: boolean; className?: string; style?: CSSProperties;
}) {
  const p = POSES[pose];
  return (
    <g className={`fig ${walking ? "fig-walk" : ""} ${className}`} style={{ transform: `translate(${x}px, ${y}px) scale(${flip ? -scale : scale}, ${scale})`, ...style }} color={color}>
      <g className="fig-upper" style={{ transform: `rotate(${p.tilt}deg)`, transformOrigin: "20px 48px" }}>
        {/* le cou part de l'intérieur de la tête : elle reste attachée même levée (bras en l'air) */}
        <line x1="20" y1="14" x2="20" y2="48" stroke={color} strokeWidth="5" strokeLinecap="round" />
        {/* même tête que Person (Person.tsx) : un œil tourné vers l'avant, pour qu'on retrouve le même personnage d'une scène à l'autre */}
        <g style={{ transform: `translateY(${p.head}px)` }} className="fig-head">
          <circle cx="20" cy="10" r="8.5" fill={color} />
          {eyes && <circle cx="24.2" cy="9.4" r="1.6" className="ch-eye-o" />}
        </g>
        <g className="fig-arm" style={{ transformOrigin: "20px 26px", transform: `rotate(${p.al}deg)` }}><line x1="20" y1="26" x2="20" y2="48" stroke={color} strokeWidth="5" strokeLinecap="round" /></g>
        <g className="fig-arm" style={{ transformOrigin: "20px 26px", transform: `rotate(${p.ar}deg)` }}><line x1="20" y1="26" x2="20" y2="48" stroke={color} strokeWidth="5" strokeLinecap="round" /></g>
      </g>
      <g className="fig-leg fig-leg-a" style={{ transformOrigin: "20px 48px" }}><line x1="20" y1="48" x2="20" y2="74" stroke={color} strokeWidth="4.5" strokeLinecap="round" /></g>
      <g className="fig-leg fig-leg-b" style={{ transformOrigin: "20px 48px" }}><line x1="20" y1="48" x2="20" y2="74" stroke={color} strokeWidth="4.5" strokeLinecap="round" /></g>
    </g>
  );
}
