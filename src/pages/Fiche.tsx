import { useState } from "react";
import { Page, Section, Reveal, Callout, Invite, NextUp, Pro, Button, Tabs, tabPanelProps, Pill, Term } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { SCHEMAS, schemasOfBase } from "../data/schemas";
import { BASES } from "../data/bases";
import { CONTENT } from "../data/content";
import { ticks, retained, focusSchema, situations, tickCount } from "../lib/state";
import { SchemaCheck } from "../components/SchemaBits";

const SHORT = ["Sécurité", "Autonomie", "Expression", "Jeu", "Limites"];

function SubNav({ current }: { current: "fiche" | "priorites" }) {
  return (
    <nav className="subnav" aria-label="Étapes du repérage">
      <Link to="/trouver/fiche" aria-current={current === "fiche" ? "page" : undefined}><span>1</span> Ma fiche à cocher</Link>
      <Icon name="chevronRight" size={16} />
      <Link to="/trouver/priorites" aria-current={current === "priorites" ? "page" : undefined}><span>2</span> Mes priorités</Link>
    </nav>
  );
}

function Header({ view, title, lead }: { view: "fiche" | "priorites"; title: string; lead: string }) {
  return (
    <header className="parthero tone-brand subhero">
      <div className="wrap">
        <p className="eyebrow">Partie 5 · Trouver mon schéma</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        <SubNav current={view} />
      </div>
    </header>
  );
}

/* ═════════ Vue 1 : la fiche à cocher ═════════ */
function FicheView() {
  const all = ticks.use();
  const [b, setB] = useState<"1" | "2" | "3" | "4" | "5">("1");
  const bi = Number(b);
  const c = CONTENT.p5.fiche;
  const totalTicks = SCHEMAS.reduce((a, s) => a + tickCount(all[s.slug]), 0);
  const countBase = (id: number) => schemasOfBase(id as 1).reduce((a, s) => a + tickCount(all[s.slug]), 0);
  return (
    <Page title="Ma fiche à cocher" tone={`b${bi}`}>
      <Header view="fiche" title={c.titre} lead={c.consigne} />
      <Section>
        <Tabs<"1" | "2" | "3" | "4" | "5"> idBase="fiche" label="Les cinq bases" value={b} onChange={setB}
          tabs={BASES.map((x) => ({ id: String(x.id) as "1", tone: `b${x.id}`, label: <span className="tabl"><span className="tabl-n">{x.id}</span> {SHORT[x.id - 1]}{countBase(x.id) > 0 && <em>{countBase(x.id)}</em>}</span> }))} />
        <div {...tabPanelProps("fiche", b)} key={b} className="fpanel">
          <p className="eyebrow">Base {bi} · {BASES[bi - 1].name}</p>
          <Callout tone="info" icon="info">{c.notesBase[bi - 1]}</Callout>
          <div className="fgrid">{schemasOfBase(bi as 1).map((s) => <SchemaCheck key={s.slug} s={s} />)}</div>
          <div className="fnav">
            {bi > 1 && <Button variant="ghost" icon="arrowLeft" onClick={() => { setB(String(bi - 1) as "1"); window.scrollTo({ top: 0 }); }}>Base {bi - 1}</Button>}
            {bi < 5 ? <Button variant="soft" iconRight="arrowRight" onClick={() => { setB(String(bi + 1) as "1"); window.scrollTo({ top: 0 }); }}>Base {bi + 1}</Button> : <Button to="/trouver/priorites" iconRight="arrowRight">Voir mes priorités</Button>}
          </div>
        </div>
      </Section>
      <Section className="alt">
        <div className="stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Callout title={<>Pour un vrai repérage : le <Term id="ysq">YSQ-2</Term></>} icon="info"><p>{c.ysqLong}</p></Callout>
          <Pro>{c.pro}</Pro>
          <p className="small muted"><Icon name="lock" size={14} /> Mes cases restent sur cet appareil. Je peux tout effacer dans les réglages.</p>
        </div>
      </Section>
      <div className="fbar" role="region" aria-label="Résumé de mes cases">
        <span><b>{totalTicks}</b> case{totalTicks > 1 ? "s" : ""} cochée{totalTicks > 1 ? "s" : ""}</span>
        <Button to="/trouver/priorites" variant="primary" iconRight="arrowRight" className="btn-sm">Mes priorités</Button>
      </div>
    </Page>
  );
}

/* ═════════ Vue 2 : mes priorités ═════════ */
function PrioritesView() {
  const all = ticks.use();
  const kept = retained.use();
  const focus = focusSchema.use();
  const sit = situations.use();
  const c = CONTENT.p5.priorites;
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
      <Header view="priorites" title={c.titre} lead={c.consigne} />
      <Section>
        <ol className="steps3 steps3-s">
          {c.etapes.map((e, i) => <li key={e.titre} className="step3"><span className="badge-n">{i + 1}</span><h3>{e.titre}</h3><p>{e.texte}</p></li>)}
        </ol>
      </Section>

      <Section className="alt" eyebrow="Mes cases par base" title="Où ça résonne le plus">
        <ul className="bars">
          {perBase.map(({ b, n, max }) => (
            <li key={b.id} className={`tone-b${b.id}`}><span className="bars-l"><b>{b.id}</b> {SHORT[b.id - 1]}</span><span className="bars-t"><i style={{ width: `${(n / max) * 100}%` }} /></span><span className="bars-n">{n}<small>/{max}</small></span></li>
          ))}
        </ul>
        {rows.length === 0 && <div className="mt"><Callout tone="care" title="Rien ne ressort pour l’instant ?"><p>{c.rien}</p><Button to="/trouver/fiche" variant="soft" className="btn-sm">Retourner à ma fiche</Button></Callout></div>}
        {strong >= 8 && <div className="mt"><Callout tone="care" title="Tout ressort ?"><p>{c.rien}</p></Callout></div>}
      </Section>

      {rows.length > 0 && (
        <Section eyebrow={`${kept.length} sur 3 gardé${kept.length > 1 ? "s" : ""}`} title="Je garde un à trois schémas" lead="Trois au maximum. Je coche « Garder », puis je choisis celui par lequel je commence.">
          <ul className="prio">
            {rows.map(({ s, n }, i) => {
              const k = kept.includes(s.slug);
              const full = !k && kept.length >= 3;
              const base = BASES[s.base - 1];
              return (
                <Reveal as="li" key={s.slug} delay={Math.min(i, 5) * 50} className={`prio-i tone-b${s.base} ${k ? "is-kept" : ""}`}>
                  <div className="prio-h">
                    <div><Link to={`/schemas/${s.slug}/comprendre`} className="prio-n">{s.name}</Link><Pill>Base {base.id}</Pill></div>
                    <span className="fcard-dots" role="img" aria-label={`${n} case${n > 1 ? "s" : ""} sur 3`}>{[0, 1, 2].map((j) => <i key={j} className={j < n ? "on" : ""} />)}</span>
                  </div>
                  <p className="quote prio-q">{s.phrase}</p>
                  <div className="prio-a">
                    <button type="button" className={`btn btn-sm ${k ? "btn-primary" : "btn-ghost"}`} aria-pressed={k} disabled={full} onClick={() => toggle(s.slug)}>{k ? <><Icon name="check" size={18} /> Gardé</> : full ? "Trois déjà gardés" : "Garder"}</button>
                    {k && <label className="check"><input type="radio" name="focus" checked={focus === s.slug} onChange={() => focusSchema.set(s.slug)} /> Je commence par celui-ci</label>}
                  </div>
                  {k && (
                    <div className="field prio-sit">
                      <label htmlFor={`sit-${s.slug}`}>Une situation récente où il s’est allumé</label>
                      <textarea id={`sit-${s.slug}`} rows={2} value={sit[s.slug] || ""} placeholder="Une situation peu chargée, en une ou deux phrases…" onChange={(e) => situations.set((x) => ({ ...x, [s.slug]: e.target.value }))} />
                    </div>
                  )}
                </Reveal>
              );
            })}
          </ul>
        </Section>
      )}

      <Section className="alt">
        <div className="stack" style={{ ["--gap" as string]: "1.4rem" }}>
          {focusS && <Reveal><NextUp to={`/schemas/${focusS.slug}/comprendre`} label={<>Commencer par « {focusS.name} »</>} hint="Comprendre, dans le moment, au fil des semaines." eyebrow="Mon schéma de départ" tone={`b${focusS.base}`} /></Reveal>}
          {kept.length > 0 && <Button to="/outils/carte-memo" variant="soft" icon="pencil">Faire ma carte-mémo</Button>}
          <Invite id="p5-prio" prompt="Ce que je retiens de ma fiche" hint={c.invite} />
          <Pro>{c.pro}</Pro>
          {!focusS && <NextUp to="/outils" label="Mes outils" hint="Carte-mémo, pause en trois temps, dire sans attaquer, plan de la semaine." eyebrow="Partie 6 sur 8" />}
        </div>
      </Section>
    </Page>
  );
}

export default function Fiche({ view }: { view: "fiche" | "priorites" }) {
  return view === "fiche" ? <FicheView /> : <PrioritesView />;
}
