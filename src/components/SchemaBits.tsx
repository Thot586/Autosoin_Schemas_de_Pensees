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


