import { Icon } from "./Icon";
import { CONTENT } from "../data/content";
import { ticks, tickCount, type Tick, type Carte } from "../lib/state";
import type { SchemaData } from "../data/types";

const C = CONTENT.p6.carte;
const EMPTY: Tick = { vrai: false, souvent: false, cout: false };

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


export function SchemaCheck({ s }: { s: SchemaData }) {
  const all = ticks.use();
  const t = all[s.slug] || EMPTY;
  const n = tickCount(t);
  const set = (k: keyof Tick, v: boolean) => ticks.set((x) => ({ ...x, [s.slug]: { ...(x[s.slug] || EMPTY), [k]: v } }));
  const defs = CONTENT.p5.fiche.reperes;
  return (
    <article className={`fcard ${n > 0 ? "has-n" : ""}`}>
      <header className="fcard-h">
        <h3>{s.name}</h3>
        <span className="fcard-dots" aria-label={`${n} case${n > 1 ? "s" : ""} cochée${n > 1 ? "s" : ""} sur 3`} role="img">{[0, 1, 2].map((i) => <i key={i} className={i < n ? "on" : ""} />)}</span>
      </header>
      <p className="quote fcard-q">{s.phrase}</p>
      <details className="fcard-more">
        <summary>Des exemples</summary>
        <div>
          <p className="eyebrow">{CONTENT.p5.fiche.colonnes.exemple}</p>
          <ul>{s.recap.situations.map((x) => <li key={x}>{x}</li>)}</ul>
          <p className="eyebrow">{CONTENT.p5.fiche.colonnes.pousse}</p>
          <p>{s.recap.pousse}</p>
        </div>
      </details>
      <fieldset className="fcard-checks">
        <legend>Mon repère</legend>
        {defs.map((d) => (
          <label key={d.id} className="fcheck">
            <input type="checkbox" checked={t[d.id as keyof Tick]} onChange={(e) => set(d.id as keyof Tick, e.target.checked)} />
            <span className="fcheck-box" aria-hidden="true"><Icon name="check" size={16} /></span>
            <span><b>{d.court}</b><small>{d.def}</small></span>
          </label>
        ))}
      </fieldset>
    </article>
  );
}

