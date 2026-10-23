import { useMemo, useState } from "react";
import { Page, PartHero, Section, Reveal, Pill, Callout, NextUp } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { BASES } from "../data/bases";
import { SCHEMAS, schemasOfBase } from "../data/schemas";
import { SCHEMA_TABS } from "./SchemaPage";
import { retained, ticks, tickCount, visited } from "../lib/state";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function Schemas() {
  const kept = retained.use();
  const t = ticks.use();
  const v = visited.use();
  const [q, setQ] = useState("");
  const seen = (slug: string) => SCHEMA_TABS.filter((x) => v[`/schemas/${slug}/${x.id}`] || (x.id === "comprendre" && v[`/schemas/${slug}`])).length;
  const f = useMemo(() => norm(q.trim()), [q]);
  const match = (s: (typeof SCHEMAS)[number]) => !f || norm(s.name).includes(f) || norm(s.phrase).includes(f);
  const total = SCHEMAS.filter(match).length;
  return (
    <Page title="Mes schémas">
      <PartHero n={7} title="Mes schémas, un par un" intro="Pour chaque schéma : le comprendre, puis que faire dans le moment, puis comment avancer au fil des semaines." />
      <Section>
        <div className="sch-tools">
          <div className="field sch-search">
            <label htmlFor="sch-q">Chercher un schéma, un mot de sa phrase</label>
            <input id="sch-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Par exemple : abandon, perfection, dire non…" autoComplete="off" />
          </div>
          <p className="small muted" aria-live="polite">{f ? `${total} schéma${total > 1 ? "s" : ""} trouvé${total > 1 ? "s" : ""}` : "15 schémas, regroupés en 5 bases."}</p>
        </div>
        {kept.length > 0 && !f && (
          <Reveal><div className="sch-kept"><p className="eyebrow">Mes schémas gardés</p><div className="row">{kept.map((k) => { const s = SCHEMAS.find((x) => x.slug === k); return s ? <Link key={k} className={`btn btn-soft tone-b${s.base}`} to={`/schemas/${k}/comprendre`}>{s.name} <Icon name="arrowRight" size={18} /></Link> : null; })}</div></div></Reveal>
        )}
      </Section>
      {BASES.map((b) => {
        const list = schemasOfBase(b.id).filter(match);
        if (!list.length) return null;
        return (
          <Section key={b.id} className={b.id % 2 === 0 ? "alt" : ""} tone={`b${b.id}`} eyebrow={`Base ${b.id} · ${b.domain}`} title={b.name}>
            <ul className="schemacards">
              {list.map((s, i) => {
                const n = tickCount(t[s.slug]);
                const k = seen(s.slug);
                return (
                  <Reveal as="li" key={s.slug} delay={i * 70}>
                    <Link to={`/schemas/${s.slug}/comprendre`} className="schemacard">
                      <span className="schemacard-top"><b>{s.name}</b>{kept.includes(s.slug) ? <Pill>Gardé</Pill> : n > 0 ? <Pill>{n}/3 cases</Pill> : null}</span>
                      <span className="quote schemacard-q">{s.phrase}</span>
                      <span className="schemacard-go">{k > 0 ? <><span className="fcard-dots" aria-hidden="true">{[0, 1, 2, 3].map((j) => <i key={j} className={j < k ? "on" : ""} />)}</span> {k} page{k > 1 ? "s" : ""} vue{k > 1 ? "s" : ""} sur 4</> : <>Ouvrir <Icon name="arrowRight" size={18} /></>}</span>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          </Section>
        );
      })}
      {total === 0 && <Section><Callout title="Aucun schéma trouvé" icon="search">Je change un mot, ou je repars de la <Link to="/besoins">liste des cinq bases</Link>.</Callout></Section>}
      <Section className="alt">
        <NextUp to="/pour-la-suite" label="Pour la suite" hint="Quand demander de l’aide, où trouver un soutien, mon carnet, les lectures." eyebrow="Partie 8 sur 8" />
      </Section>
    </Page>
  );
}
