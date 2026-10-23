import { useMemo, useState } from "react";
import { Page, Section, Reveal } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { GLOSSAIRE } from "../data/glossaire";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Glossaire() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const n = norm(q.trim());
    const sorted = [...GLOSSAIRE].sort((a, b) => a.term.localeCompare(b.term, "fr"));
    return n ? sorted.filter((e) => norm(`${e.term} ${e.def} ${e.more || ""}`).includes(n)) : sorted;
  }, [q]);
  return (
    <Page title="Glossaire">
      <header className="parthero tone-brand">
        <div className="wrap">
          <p className="eyebrow">Glossaire</p>
          <h1>Les mots du support</h1>
          <p className="lead">Chaque mot est expliqué en une ou deux phrases. Dans les pages, les mots soulignés ouvrent aussi leur définition.</p>
        </div>
      </header>
      <Section>
        <div className="gl-search field">
          <label htmlFor="gl-q"><Icon name="search" size={18} /> Chercher un mot</label>
          <input id="gl-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Schéma, geste, adulte sain…" autoComplete="off" />
          <p className="hint" role="status" aria-live="polite">{list.length} terme{list.length > 1 ? "s" : ""}{q ? ` pour « ${q} »` : ""}</p>
        </div>
        {list.length === 0 ? <p className="mt">Aucun mot ne correspond. Je peux essayer un autre mot.</p> : (
          <dl className="gl-list">
            {list.map((e, i) => (
              <Reveal key={e.id} delay={Math.min(i, 6) * 40} className="gl-item">
                <div id={e.id}>
                  <dt>{e.term}</dt>
                  <dd>
                    <p>{e.def}</p>
                    {e.more && <p className="muted">{e.more}</p>}
                    {e.to && <p><Link to={e.to}>{e.toLabel || "Voir la page"} <Icon name="arrowRight" size={16} /></Link></p>}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        )}
      </Section>
    </Page>
  );
}
