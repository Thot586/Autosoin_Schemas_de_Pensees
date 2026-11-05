import { Icon } from "../components/Icon";
import { CONTENT } from "../data/content";
import { BASES } from "../data/bases";
import { schemaBySlug, schemasOfBase } from "../data/schemas";
import { ticks, tickCount, type Tick } from "../lib/state";
import { deepFr } from "../lib/typo";
import type { Card, Tone } from "./types";

const F = CONTENT.p5.fiche;
const EMPTY: Tick = { vrai: false, souvent: false, cout: false };

/** Un schéma, trois repères à cocher (une carte = un schéma). */
export function FicheItem({ slug }: { slug: string }) {
  const s = schemaBySlug(slug)!;
  const all = ticks.use();
  const t = all[slug] || EMPTY;
  const n = tickCount(t);
  const set = (k: keyof Tick) => ticks.set((x) => ({ ...x, [slug]: { ...(x[slug] || EMPTY), [k]: !(x[slug] || EMPTY)[k] } }));
  return (
    <div className="fiche">
      <blockquote className="lc-quote"><span className="lc-quote-l">Sa phrase</span><p>{s.phrase}</p></blockquote>
      <details className="fiche-ex">
        <summary><Icon name="plus" size={18} /> Des exemples</summary>
        <p><b>Par exemple :</b> {s.recap.situations.join(" ")}</p>
        <p><b>Il me pousse à :</b> {s.recap.pousse}</p>
      </details>
      <div className="fiche-checks" role="group" aria-label={`Mes repères pour « ${s.name} »`}>
        {F.reperes.map((r) => {
          const on = t[r.id as keyof Tick];
          return (
            <button key={r.id} type="button" className={`fiche-c ${on ? "is-on" : ""}`} aria-pressed={on} onClick={() => set(r.id as keyof Tick)}>
              <span className="fiche-box" aria-hidden="true">{on && <Icon name="check" size={18} />}</span>
              <span><b>{r.court}</b><small>{r.def}</small></span>
            </button>
          );
        })}
      </div>
      <p className="fiche-n" aria-live="polite">{n === 0 ? "Aucune case : c’est possible, je passe au suivant." : `${n} case${n > 1 ? "s" : ""} sur 3.`}</p>
    </div>
  );
}

/** La fiche « Retrouver mes schémas », une carte par schéma (diapos 29 à 33). */
export function ficheCards(): Card[] {
  const cards: Card[] = [
    { id: "intro", kind: "text", icon: "check", title: F.titre, body: [F.consigne],
      list: F.reperes.map((r) => `**${r.court}** : ${r.def}`), more: { label: "Pour un vrai repérage", body: [F.ysqLong] }, pro: F.pro },
  ];
  for (const b of BASES) {
    const tone = `b${b.id}` as Tone;
    cards.push({ id: `base${b.id}`, kind: "text", tone, icon: "layers", title: `Base ${b.id} : ${b.name}`,
      body: [`${schemasOfBase(b.id).length} schémas. Je lis chaque phrase : si elle me parle, je coche.`, F.notesBase[b.id - 1]] });
    for (const s of schemasOfBase(b.id)) cards.push({ id: `s-${s.slug}`, kind: "fiche", tone, title: s.name, slug: s.slug });
  }
  return deepFr(cards);
}
