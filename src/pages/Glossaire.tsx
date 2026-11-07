import { useMemo, useState } from "react";
import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link, canGoBack } from "../lib/router";
import { GLOSSAIRE, GROUPS } from "../data/glossaire";
import { CiteText } from "../components/Cite";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** « Les mots du support » : chaque mot, son sens, et le détail au clic. Un bouton ramène à la page d'avant. */
export default function Glossaire() {
  const [q, setQ] = useState("");
  const [back] = useState(canGoBack);
  const n = norm(q.trim());
  const list = useMemo(() => {
    const sorted = [...GLOSSAIRE].sort((a, b) => a.term.localeCompare(b.term, "fr"));
    return n ? sorted.filter((e) => norm(`${e.term} ${e.short} ${e.def} ${e.more || ""}`.replace(/\[n?@[^\]]+\]/g, "")).includes(n)) : sorted;
  }, [n]);
  return (
    <Page title="Les mots du support">
      <div className="wrap-narrow page-pad">
        {back
          ? <button type="button" className="back back-btn" onClick={() => history.back()}><Icon name="arrowLeft" size={18} /> Revenir à ma page</button>
          : <Link to="/" className="back"><Icon name="arrowLeft" size={18} /> Accueil</Link>}
        <h1>Les mots du support</h1>
        <p className="lead">Les mots de ce support, et ce qu’ils veulent dire. Dans les pages, un mot surligné s’explique au survol ; un clic (ou un toucher) ouvre le détail.</p>
        <div className="gl-search field">
          <label htmlFor="gl-q"><Icon name="search" size={18} /> Chercher un mot</label>
          <input id="gl-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Schéma, adulte sain, CMP…" autoComplete="off" />
          <p className="hint" role="status" aria-live="polite">{list.length} mot{list.length > 1 ? "s" : ""}{q ? ` pour « ${q} »` : ""}</p>
        </div>
        {list.length === 0 && <p className="mt">Aucun mot ne correspond. Je peux essayer un autre mot.</p>}
        {GROUPS.map((g) => {
          const items = list.filter((e) => e.group === g.id);
          if (!items.length) return null;
          return (
            <section key={g.id} aria-labelledby={`gl-${g.id}`}>
              <h2 className="h-sec" id={`gl-${g.id}`}>{g.title}</h2>
              <dl className="gl-list">
                {items.map((e) => (
                  <div key={e.id} id={e.id} className="gl-item" tabIndex={-1}>
                    <dt>{e.term}</dt>
                    <dd>
                      <p className="gl-short">{e.short}</p>
                      <details className="gl-more">
                        <summary>Plus de détail</summary>
                        <p><CiteText text={e.def} /></p>
                        {e.more && <p className="muted"><CiteText text={e.more} /></p>}
                        {e.to && <p><Link to={e.to}>{e.toLabel || "En savoir plus"} <Icon name="arrowRight" size={16} /></Link></p>}
                      </details>
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          );
        })}
      </div>
    </Page>
  );
}
