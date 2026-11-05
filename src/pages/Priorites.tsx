import { Page, Callout, Button, Pro } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { SCHEMAS, schemasOfBase } from "../data/schemas";
import { BASES } from "../data/bases";
import { CONTENT } from "../data/content";
import { ticks, retained, focusSchema, situations, tickCount } from "../lib/state";

const C = CONTENT.p5.priorites;

/** « Mes priorités » : je garde un à trois schémas, et je choisis celui par lequel je commence (diapo 34). */
export default function Priorites() {
  const all = ticks.use();
  const kept = retained.use();
  const focus = focusSchema.use();
  const sit = situations.use();
  const rows = SCHEMAS.map((s) => ({ s, n: tickCount(all[s.slug]), cout: all[s.slug]?.cout ? 1 : 0 }))
    .filter((r) => r.n > 0 || kept.includes(r.s.slug))
    .sort((a, b) => b.n - a.n || b.cout - a.cout || a.s.name.localeCompare(b.s.name, "fr"));
  const strong = rows.filter((r) => r.n >= 2).length;
  const toggle = (slug: string) => {
    if (kept.includes(slug)) { retained.set(kept.filter((x) => x !== slug)); if (focus === slug) focusSchema.set(null); }
    else if (kept.length < 3) retained.set([...kept, slug]);
  };
  const perBase = BASES.map((b) => { const ss = schemasOfBase(b.id); return { b, n: ss.reduce((a, s) => a + tickCount(all[s.slug]), 0), max: ss.length * 3 }; });
  const focusS = SCHEMAS.find((s) => s.slug === focus);

  return (
    <Page title="Mes priorités">
      <div className="wrap-narrow page-pad">
        <Link to="/schemas" className="back"><Icon name="arrowLeft" size={18} /> Mes schémas</Link>
        <h1>Mes priorités</h1>
        <p className="lead">{C.consigne}</p>

        <ol className="mini-steps">
          {C.etapes.map((e, i) => <li key={e.titre}><span className="mini-n">{i + 1}</span><span><b>{e.titre}</b> {e.texte}</span></li>)}
        </ol>

        {rows.length === 0 ? (
          <Callout tone="care" title="Rien ne ressort pour l’instant ?">
            <p>{C.rien}</p>
            <Button to="/trouver" variant="soft" icon="check">Remplir ma fiche</Button>
          </Callout>
        ) : (
          <>
            <h2 className="h-sec">Où ça résonne le plus</h2>
            <ul className="bars">
              {perBase.map(({ b, n, max }) => (
                <li key={b.id} className={`tone-b${b.id}`}>
                  <span className="bars-l">{b.id}. {b.name}</span>
                  <span className="bars-t" aria-hidden="true"><i style={{ width: `${(n / max) * 100}%` }} /></span>
                  <span className="bars-n">{n} case{n > 1 ? "s" : ""}</span>
                </li>
              ))}
            </ul>
            {strong >= 8 && <Callout tone="care" title="Tout ressort ?"><p>{C.rien}</p></Callout>}

            <h2 className="h-sec">Je garde un à trois schémas <span className="h-count">{kept.length} sur 3</span></h2>
            <ul className="prio">
              {rows.map(({ s, n }) => {
                const k = kept.includes(s.slug);
                const full = !k && kept.length >= 3;
                return (
                  <li key={s.slug} className={`prio-i tone-b${s.base} ${k ? "is-kept" : ""}`}>
                    <div className="prio-h">
                      <Link to={`/schemas/${s.slug}`} className="prio-n">{s.name}</Link>
                      <span className="dots" role="img" aria-label={`${n} case${n > 1 ? "s" : ""} sur 3`}>{[0, 1, 2].map((j) => <i key={j} className={j < n ? "on" : ""} />)}</span>
                    </div>
                    <p className="prio-q">{s.phrase}</p>
                    <div className="prio-a">
                      <button type="button" className={`btn btn-sm ${k ? "btn-primary" : "btn-soft"}`} aria-pressed={k} disabled={full} onClick={() => toggle(s.slug)}>
                        {k ? <><Icon name="check" size={18} /><span>Gardé</span></> : <span>{full ? "Trois déjà gardés" : "Garder"}</span>}
                      </button>
                      {k && <label className="radio"><input type="radio" name="focus" checked={focus === s.slug} onChange={() => focusSchema.set(s.slug)} /> <span>Je commence par celui-ci</span></label>}
                    </div>
                    {k && (
                      <div className="field">
                        <label htmlFor={`sit-${s.slug}`}>Une situation récente où il s’est allumé</label>
                        <textarea id={`sit-${s.slug}`} rows={2} value={sit[s.slug] || ""} placeholder="Une situation peu chargée, en une ou deux phrases…"
                          onChange={(e) => situations.set((x) => ({ ...x, [s.slug]: e.target.value }))} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {focusS && (
          <Link to={`/schemas/${focusS.slug}`} className={`next-card tone-b${focusS.base}`}>
            <span><small>Mon schéma de départ</small><b>Commencer par « {focusS.name} »</b><span>Comprendre, dans le moment, au fil des semaines.</span></span>
            <Icon name="arrowRight" size={26} />
          </Link>
        )}
        {kept.length > 0 && <p className="mt"><Button to="/outils/carte-memo" variant="soft" icon="copy">Faire ma carte-mémo</Button></p>}
        <p className="small muted mt"><Icon name="info" size={15} /> {C.invite}</p>
        <Pro>{C.pro}</Pro>
      </div>
    </Page>
  );
}
