import type { ReactElement } from "react";
import type { BaseId } from "../data/types";

/* Emblèmes des schémas et des bases : une image par nom, pour aider à le retenir.
   Règle : des objets et des images, jamais une personne en détresse ni une caricature.
   Dessin au trait (48 × 48), couleur de la base, comme les icônes de l'application. */

const SCHEMA: Record<string, ReactElement> = {
  // un cœur en pointillés : l'affection a manqué
  "carence-affective": <path d="M24 39s-14-8.6-14-19a7.6 7.6 0 0 1 14-4.4A7.6 7.6 0 0 1 38 20c0 10.4-14 19-14 19z" strokeDasharray="4.2 4" />,
  // une valise : la peur que l'autre parte
  abandon: <>
    <rect x="8" y="16" width="32" height="23" rx="4" />
    <path d="M18 16v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4M16 16v23M32 16v23" />
    <path d="M13 39v3M35 39v3" />
  </>,
  // un bouclier, et un œil qui guette
  "mefiance-abus": <>
    <path d="M24 6l14 5.5v9.5c0 9.5-6 15.5-14 20-8-4.5-14-10.5-14-20v-9.5z" />
    <path d="M16 23s3.4-5 8-5 8 5 8 5-3.4 5-8 5-8-5-8-5z" />
    <circle cx="24" cy="23" r="1.6" fill="currentColor" stroke="none" />
  </>,
  // un groupe, et un point à l'écart
  "isolement-social": <>
    <circle cx="13" cy="16" r="4.4" /><circle cx="24" cy="12" r="4.4" /><circle cx="17.5" cy="26.5" r="4.4" /><circle cx="28.5" cy="23.5" r="4.4" />
    <circle cx="39" cy="38" r="4.4" fill="currentColor" />
  </>,
  // un masque : cacher qui l'on est
  "imperfection-honte": <>
    <path d="M7 17c6-3.2 28-3.2 34 0 .4 9.4-4 16.4-10.4 16.4-3.2 0-4.6-3.4-6.6-3.4s-3.4 3.4-6.6 3.4C11 33.4 6.6 26.4 7 17z" />
    <path d="M12.6 22.8c1.8-2.4 6-2.4 7.8 0-1.8 2.4-6 2.4-7.8 0zM27.6 22.8c1.8-2.4 6-2.4 7.8 0-1.8 2.4-6 2.4-7.8 0z" />
    <path d="M7.2 18.6L3.4 16M40.8 18.6l3.8-2.6" />
  </>,
  // une cible, et la flèche qu'on s'attend à voir à côté
  echec: <>
    <circle cx="21" cy="27" r="13" /><circle cx="21" cy="27" r="6.5" /><circle cx="21" cy="27" r="1.6" fill="currentColor" stroke="none" />
    <path d="M42 6l-8 8M34 9.6V14h4.4M43.6 4.4l-3 .2-.2 3" />
  </>,
  // une jeune plante attachée à un tuteur
  "dependance-incompetence": <>
    <path d="M14 34h20l-2.6 9H16.6z" />
    <path d="M30 34V6" />
    <path d="M22 34c0-7 .6-13 2.4-19" />
    <path d="M22.6 26c-4.6 0-7.4-2.4-8.2-6 4.4 0 7.4 2.2 8.2 6zM24 19.4c.4-4.4 2.8-6.8 5.8-7.4" />
    <path d="M22.4 29h7.6" />
  </>,
  // un nuage d'orage : la catastrophe semble toujours proche
  vulnerabilite: <>
    <path d="M14 30a7.5 7.5 0 0 1-.6-15A10 10 0 0 1 32.6 13 7.6 7.6 0 0 1 35 30z" />
    <path d="M25.5 30l-4.5 7h6l-3.5 7" />
  </>,
  // deux cercles fondus en une seule forme : où je finis, où l'autre commence
  "relation-fusionnelle": <path d="M24 15.2a11 11 0 1 0 0 17.6 11 11 0 1 0 0-17.6z" />,
  // une balance qui penche toujours du côté des autres
  assujettissement: <>
    <path d="M24 10v30M15 41h18M8 13.6L40 20.4" />
    <circle cx="24" cy="9" r="2.2" fill="currentColor" stroke="none" />
    <path d="M8 13.6L4 24M8 13.6l4 10.4M40 20.4L36 31M40 20.4l4 10.6" />
    <path d="M3 24h10a5 4.4 0 0 1-10 0zM35 31h10a5 4.4 0 0 1-10 0z" />
    <circle cx="8" cy="21.6" r="1.7" fill="currentColor" stroke="none" />
    <circle cx="37.4" cy="28.6" r="1.7" fill="currentColor" stroke="none" /><circle cx="42.6" cy="28.6" r="1.7" fill="currentColor" stroke="none" /><circle cx="40" cy="25.6" r="1.7" fill="currentColor" stroke="none" />
  </>,
  // une bougie qui se consume pour éclairer les autres
  "sacrifice-de-soi": <>
    <path d="M18 42V27c2 1.4 4 .4 6-.8s4-2 6 .8v15M13 42h22" />
    <path d="M24 21c-3 0-4.4-2.2-4.4-4.4 0-3.2 4.4-7.6 4.4-7.6s4.4 4.4 4.4 7.6c0 2.2-1.4 4.4-4.4 4.4z" />
    <path d="M10 16l3.6 1.6M38 16l-3.6 1.6M12.4 7.4l3 3M35.6 7.4l-3 3" />
  </>,
  // une marmite, couvercle tenu fermé : les émotions restent dedans
  "controle-emotionnel": <>
    <path d="M9 22h30v10a8 8 0 0 1-8 8H17a8 8 0 0 1-8-8z" />
    <path d="M6 22h36M18 17.6h12M24 17.6v-3" />
    <path d="M5 25.6h4M39 25.6h4" />
    <path d="M13 13q-2-2.6 0-5M35 13q2-2.6 0-5" />
  </>,
  // une liste à cocher qui ne finit jamais
  "ideaux-exigeants": <>
    <path d="M12 9h24a2 2 0 0 1 2 2v26M10 11a2 2 0 0 1 2-2" />
    <path d="M18 6h12v6H18z" />
    <path d="M14 18.4l2 2 3.4-3.8M14 27.4l2 2 3.4-3.8M23 18.6h10M23 27.6h10" />
    <rect x="14" y="33.4" width="5" height="5" rx="1" /><path d="M23 36h10" />
    <path d="M10 11v29M10 44h4M18 44h4M26 44h4" />
  </>,
  // une file d'attente, et un point qui passe devant : « les règles ne sont pas pour moi »
  "droits-exageres": <>
    <circle cx="9" cy="33" r="3.6" /><circle cx="18.5" cy="33" r="3.6" /><circle cx="28" cy="33" r="3.6" />
    <circle cx="39" cy="33" r="3.6" fill="currentColor" />
    <path d="M10 25c4-12 22-14 27-1.6" strokeDasharray="3 3.6" />
    <path d="M33.2 23.6l3.8 1.2 1.4-3.8" />
    <path d="M5 40h38" />
  </>,
  // un sablier : attendre est très difficile
  "manque-d-autocontrole": <>
    <path d="M13 7h22M13 41h22" />
    <path d="M15.6 7c0 10.6 8.4 12 8.4 17s-8.4 6.4-8.4 17M32.4 7c0 10.6-8.4 12-8.4 17s8.4 6.4 8.4 17" />
    <path d="M19.6 37.4c2.4-2.6 6.4-2.6 8.8 0z" fill="currentColor" stroke="none" />
  </>,
};

const BASE: Record<BaseId, ReactElement> = {
  // un abri, et un cœur dedans
  1: <><path d="M8 22L24 9l16 13" /><path d="M12 19v20h24V19" /><path d="M24 34s-6-3.6-6-8a3.2 3.2 0 0 1 6-1.6 3.2 3.2 0 0 1 6 1.6c0 4.4-6 8-6 8z" /></>,
  // des marches, une à une
  2: <path d="M7 40h9v-9h9v-9h9v-9h7" />,
  // une bulle : dire ce que je ressens
  3: <><path d="M8 11h32v21H20l-8 7v-7H8z" /><circle cx="17" cy="21.6" r="1.8" fill="currentColor" stroke="none" /><circle cx="24" cy="21.6" r="1.8" fill="currentColor" stroke="none" /><circle cx="31" cy="21.6" r="1.8" fill="currentColor" stroke="none" /></>,
  // un cerf-volant : le jeu, la légèreté
  4: <><path d="M30 5l11 12-11 15-11-15z" /><path d="M19 17h22M30 5v27" /><path d="M30 32c-2 4-6 4-8 7s-6 3-9 2" /></>,
  // un garde-fou : des limites qui protègent
  5: <><path d="M8 40V15l4-5 4 5v25M20 40V15l4-5 4 5v25M32 40V15l4-5 4 5v25" /><path d="M5 40h38M16 21h4M28 21h4M16 32h4M28 32h4" /></>,
};

function Svg({ children, size, className = "" }: { children: ReactElement; size: number; className?: string }) {
  return (
    <svg className={`emblem ${className}`} width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor"
      strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

/** Emblème d'un schéma (rien si le schéma n'en a pas). Décoratif : le nom est toujours écrit à côté. */
export function SchemaEmblem({ slug, size = 40, className }: { slug: string; size?: number; className?: string }) {
  const d = SCHEMA[slug];
  return d ? <Svg size={size} className={className}>{d}</Svg> : null;
}

/** Emblème d'une base de besoins. Décoratif. */
export function BaseEmblem({ id, size = 40, className }: { id: BaseId; size?: number; className?: string }) {
  return <Svg size={size} className={className}>{BASE[id]}</Svg>;
}

export const EMBLEM_SLUGS = Object.keys(SCHEMA);
