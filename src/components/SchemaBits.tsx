import { useState } from "react";
import { Icon } from "./Icon";
import { CONTENT } from "../data/content";
import type { Carte } from "../lib/state";
import type { SchemaData } from "../data/types";

const C = CONTENT.p6.carte;

export const FIELDS: { k: Exclude<keyof Carte, "schema">; rows: number }[] = [
  { k: "quand", rows: 2 }, { k: "voix", rows: 2 }, { k: "besoin", rows: 2 }, { k: "geste", rows: 2 }, { k: "phrase", rows: 2 },
];
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const trimDot = (s: string) => s.replace(/[.\s]+$/, "");

/** Pré-remplissage avec les mots du support : à réécrire avec les siens. */
export function defaultCarte(s: SchemaData): Carte {
  return { schema: s.name, quand: s.recap.situations[0] || "", voix: s.moment.voice, besoin: cap(trimDot(s.besoin)), geste: s.moment.steps[0]?.title || "", phrase: s.moment.phrase };
}

/** La carte-mémo à retourner, comme une vraie carte : au recto, quand le schéma s'allume et ce que dit la petite voix ;
 *  au verso, la réponse (besoin, geste, phrase d'adulte sain). Écran seulement : l'impression garde la carte complète. */
export function CarteFlip({ c, tone }: { c: Carte; tone?: string }) {
  const [back, setBack] = useState(false);
  const face = (keys: typeof FIELDS, label: string, hidden: boolean, cls: string) => (
    <div className={`carte flip-face ${cls} ${tone ? "tone-" + tone : ""}`} inert={hidden} aria-hidden={hidden}>
      <p className="carte-top"><Icon name="layers" size={16} /> Ma carte-mémo · {label}</p>
      <p className="carte-s">{c.schema || "…"}</p>
      <dl>
        {keys.map((f) => <div key={f.k}><dt>{C.champs[f.k]}</dt><dd>{c[f.k] || <span className="muted">…</span>}</dd></div>)}
      </dl>
    </div>
  );
  return (
    <div className="flip">
      <div className={`flip-in ${back ? "is-back" : ""}`}>
        {face(FIELDS.slice(0, 2), "recto", back, "flip-front")}
        {face(FIELDS.slice(2), "verso", !back, "flip-back")}
      </div>
      <button type="button" className="btn btn-soft flip-btn" aria-pressed={back} onClick={() => setBack((b) => !b)}>
        <Icon name="flip" size={20} /><span>{back ? "Revoir le recto" : "Retourner la carte"}</span>
      </button>
    </div>
  );
}

export function CarteView({ c, tone, id }: { c: Carte; tone?: string; id?: string }) {
  return (
    <div className={`carte ${tone ? "tone-" + tone : ""}`} id={id}>
      <p className="carte-top"><Icon name="layers" size={16} /> Ma carte-mémo</p>
      <p className="carte-s">{c.schema || "…"}</p>
      <dl>
        {FIELDS.map((f) => (
          <div key={f.k}><dt>{C.champs[f.k]}</dt><dd>{c[f.k] || <span className="muted">…</span>}</dd></div>
        ))}
      </dl>
    </div>
  );
}


