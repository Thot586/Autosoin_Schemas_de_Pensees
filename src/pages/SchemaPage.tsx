import { useMemo, useState } from "react";
import { Page, Section, Reveal, Callout, Invite, Pro, Button, Choice, Pill, Term } from "../components/ui";
import { Icon } from "../components/Icon";
import { Figure } from "../components/Figure";
import { CarteView, SchemaCheck, defaultCarte } from "../components/SchemaBits";
import { Link, navigate } from "../lib/router";
import { schemaBySlug, neighbours } from "../data/schemas";
import { baseById } from "../data/bases";
import { CONTENT } from "../data/content";
import { retained, stepsDone, cartes, focusSchema, plan, useReducedMotion } from "../lib/state";
import { useTyped } from "../lib/hooks";
import type { SchemaData } from "../data/types";
import NotFound from "./NotFound";

export const SCHEMA_TABS = [
  { id: "comprendre", label: "Comprendre", icon: "book" },
  { id: "dans-le-moment", label: "Dans le moment", icon: "bolt" },
  { id: "au-fil-des-semaines", label: "Au fil des semaines", icon: "calendar" },
  { id: "ma-carte", label: "Ma carte", icon: "pencil" },
] as const;
type TabId = (typeof SCHEMA_TABS)[number]["id"];
const REACT_TAGS = ["Capituler", "Éviter", "Surcompenser"];
const DANGER = /emprise|danger|Quand demander de l’aide/i;
const cap = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/* ═════════ Onglet 1 : comprendre ═════════ */
function Comprendre({ s }: { s: SchemaData }) {
  const [ctx, setCtx] = useState(s.contextes[0]?.label || "");
  const cur = s.contextes.find((c) => c.label === ctx) || s.contextes[0];
  const sensitive = s.slug === "mefiance-abus";
  return (
    <>
      <Section eyebrow="Ce que dit le schéma" title="Le besoin derrière la phrase">
        <Reveal>
          <div className="sp-need"><span className="sp-need-ic"><Icon name="heart" size={22} /></span><div><p className="eyebrow">Le besoin qui est resté sans réponse</p><p className="sp-need-t">{cap(s.besoin)}</p></div></div>
        </Reveal>
        <Reveal delay={80}>
          <div className="sp-recap">
            <div><p className="eyebrow">Ce qui peut l’allumer</p><ul>{s.recap.situations.map((x) => <li key={x}>{x}</li>)}</ul></div>
            <div><p className="eyebrow">Il peut me pousser à…</p><p>{s.recap.pousse}</p></div>
          </div>
        </Reveal>
      </Section>

      <Section className="alt" eyebrow="D’où ça peut venir" title="Des pistes, sans chercher de coupable">
        <Callout tone="care" icon="heart" title="Je lis à mon rythme">
          {s.autosoin.comprendre ? cap(s.autosoin.comprendre) : "Je lis sans chercher à tout expliquer. Si des souvenirs pénibles remontent, je m’arrête et j’en parle à un professionnel avant de continuer."}
          {sensitive && <> Cette page peut réveiller des souvenirs difficiles : je n’ai pas besoin d’en avoir un précis pour reconnaître le schéma.</>}
        </Callout>
        <details className="origin-d" open={!sensitive}>
          <summary>{sensitive ? "Je choisis de lire « D’où ça peut venir »" : "D’où ça peut venir"}</summary>
          <div className="cards origins">
            {s.origine.map((o, i) => <Reveal key={o} delay={i * 80}><div className="card"><span className="badge-n">{i + 1}</span><p>{o}</p></div></Reveal>)}
          </div>
          <p className="sp-sens"><b>Ce qui peut rendre plus sensible.</b> {s.sensible}</p>
          <p className="small muted">{s.prudence}</p>
        </details>
      </Section>

      <Section eyebrow="À quoi ça servait" title="Un schéma a longtemps été une protection">
        <Reveal><div className="sp-serv"><Icon name="shield" size={26} /><p>{s.servait}</p></div></Reveal>
      </Section>

      <Section className="alt" eyebrow="Où ça se voit aujourd’hui" title="Le même schéma, des visages différents" lead="Je choisis un domaine de vie : le schéma ne s’y montre pas de la même façon.">
        <Choice label="Domaine de vie" value={ctx} onChange={setCtx} options={s.contextes.map((c) => ({ id: c.label, label: c.label }))} />
        <div className="sp-ctx" aria-live="polite"><p key={ctx} className="quote">{cur?.text}</p></div>
      </Section>

      <Section eyebrow="Ce que le schéma me pousse à faire, selon les jours" title="Trois réflexes, pas trois conseils">
        <Callout title="À repérer, pas à suivre" icon="info">Ce sont des <Term id="reaction">réactions automatiques</Term> : elles soulagent sur le moment, mais entretiennent le schéma. Elles varient d’un jour à l’autre. Ce qui aide se trouve dans les pages « Dans le moment » et « Au fil des semaines ».</Callout>
        <div className="cards mt">
          {s.facons.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <article className="card facon"><Pill>{REACT_TAGS[i]}</Pill><h3>{f.title}</h3><p>{cap(f.text)}</p></article>
            </Reveal>
          ))}
        </div>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Pro>{s.pro.comprendre.map((t, i) => <p key={i}>{t}</p>)}</Pro>
        </div>
      </Section>
    </>
  );
}

/* ═════════ Onglet 2 : dans le moment ═════════ */
const BLOCKS = ["La scène", "La petite voix", "Ma réaction automatique", "Que faire ?", "Ma phrase d’adulte sain"];

function Moment({ s }: { s: SchemaData }) {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const m = s.moment;
  const typed = useTyped(m.voice, shown === 1 && !reduced);
  const open = (i: number) => shown >= i;
  const next = () => setShown((x) => Math.min(4, x + 1));
  return (
    <>
      <Section eyebrow="Quand ça se déclenche" title="Pas à pas, dans le moment" lead="Je déroule la scène une étape à la fois. Je peux aussi tout afficher d’un coup.">
        <div className="story">
          <ol className="story-steps" aria-label="Étapes">{BLOCKS.map((b, i) => <li key={b} className={i <= shown ? "is-on" : ""}><span>{i + 1}</span><em>{b}</em></li>)}</ol>
          <div className="story-body" aria-live="polite">
            <article className="sb">
              <p className="eyebrow">1 · {BLOCKS[0]}</p>
              <div className="sb-row"><svg viewBox="0 0 60 84" className="sb-fig" aria-hidden="true"><Figure x={10} y={4} pose="calm" color={`var(--accent)`} /></svg><p className="sb-t">{m.scene}</p></div>
            </article>
            {open(1) && (
              <article className="sb sb-pop">
                <p className="eyebrow">2 · {BLOCKS[1]}</p>
                <div className="bubble sb-voice"><p className="quote"><span aria-hidden="true">{typed}<i className="caret" /></span><span className="sr-only">{m.voice}</span></p></div>
              </article>
            )}
            {open(2) && (
              <article className="sb sb-pop">
                <p className="eyebrow">3 · {BLOCKS[2]}</p>
                <div className="sb-row"><svg viewBox="0 0 60 84" className="sb-fig" aria-hidden="true"><Figure x={10} y={4} pose="bow" color="var(--ink-2)" /></svg><p className="sb-t">{m.reaction}</p></div>
                <p className="small muted">C’est automatique : ce n’est ni une faute ni un échec. C’est ce que je vais apprendre à repérer.</p>
              </article>
            )}
            {open(3) && (
              <article className="sb sb-pop">
                <p className="eyebrow">4 · {BLOCKS[3]}</p>
                <ol className="sb-steps">
                  {m.steps.map((st, i) => <li key={st.title} style={{ animationDelay: `${i * 140}ms` }}><span className="badge-n">{i + 1}</span><div><h3>{st.title}</h3><p>{st.text}</p></div></li>)}
                </ol>
                <p className="small muted">Un seul de ces gestes suffit pour commencer. Si l’émotion est trop forte : <Link to="/outils/pause">la pause en trois temps</Link>.</p>
              </article>
            )}
            {open(4) && (
              <article className="sb sb-pop sb-phrase">
                <p className="eyebrow"><Icon name="sparkles" size={14} /> 5 · {BLOCKS[4]}</p>
                <p className="quote sb-ph">{m.phrase}</p>
                <div className="row"><Button to={`/outils/carte-memo?schema=${s.slug}`} variant="soft" icon="pencil" className="btn-sm">La mettre sur ma carte-mémo</Button></div>
              </article>
            )}
          </div>
          <div className="story-nav">
            {shown < 4 ? <>
              <Button iconRight="arrowRight" onClick={next}>{["Ce que dit la petite voix", "Ma réaction automatique", "Que faire ?", "Ma phrase d’adulte sain"][shown]}</Button>
              <Button variant="ghost" onClick={() => setShown(4)}>Tout afficher</Button>
            </> : <Button variant="ghost" icon="replay" onClick={() => setShown(0)}>Recommencer</Button>}
          </div>
        </div>
      </Section>
      <Section className="alt">
        <div className="stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Invite id={`m-${s.slug}`} title="Pour moi" prompt={s.autosoin.moment ? cap(s.autosoin.moment) : "Avant la prochaine situation, je relis ces gestes et j’en choisis un seul."} placeholder="Ce que je choisis, et à quel moment…" />
          <Pro>{s.pro.moment.map((t, i) => <p key={i}>{t}</p>)}</Pro>
        </div>
      </Section>
    </>
  );
}

/* ═════════ Onglet 3 : au fil des semaines ═════════ */
function Stairs({ done }: { done: boolean[] }) {
  const n = done.filter(Boolean).length;
  const top = done.lastIndexOf(true);
  const x = top < 0 ? 18 : 62 + top * 78;
  const y = top < 0 ? 138 : 138 - (top + 1) * 34;
  return (
    <svg viewBox="0 0 300 160" className="stairs" role="img" aria-label={`${n} pas essayé${n > 1 ? "s" : ""} sur 3`}>
      <line x1="0" y1="138" x2="300" y2="138" className="sv-ground" />
      {[0, 1, 2].map((i) => <rect key={i} x={40 + i * 78} y={138 - (i + 1) * 34} width="78" height={(i + 1) * 34} className={`stair-b ${done[i] ? "on" : ""}`} />)}
      {[0, 1, 2].map((i) => <text key={i} x={79 + i * 78} y={138 - (i + 1) * 34 + 22} textAnchor="middle" className={`stairs-t ${done[i] ? "on" : ""}`}>Pas {i + 1}</text>)}
      <Figure x={x - 15} y={y - 74 * 0.7} scale={0.7} pose={n === 3 ? "cheer" : "calm"} />
    </svg>
  );
}

function Semaines({ s }: { s: SchemaData }) {
  const all = stepsDone.use();
  const done = all[s.slug] || [false, false, false];
  const toggle = (i: number) => stepsDone.set((x) => { const cur = [...(x[s.slug] || [false, false, false])]; cur[i] = !cur[i]; return { ...x, [s.slug]: cur }; });
  const w = s.semaines;
  const danger = DANGER.test(s.autosoin.semaines);
  const put = (text: string) => { plan.set((p) => ({ ...p, slug: s.slug, geste: text })); };
  return (
    <>
      <Section eyebrow="Un pas à la fois" title="Trois pas, du plus facile au plus difficile" lead="Je commence par le premier. Je coche quand j’ai essayé, même si ça n’a pas été parfait : l’essai compte.">
        <div className="sw">
          <Reveal><div className="sw-vis"><Stairs done={done} /><p className="small muted center">{done.filter(Boolean).length} pas essayé{done.filter(Boolean).length > 1 ? "s" : ""} sur 3</p></div></Reveal>
          <ol className="sw-list">
            {w.steps.map((st, i) => (
              <Reveal as="li" key={st.level} delay={i * 90} className={`sw-i ${done[i] ? "is-done" : ""}`}>
                <p className="eyebrow">{st.level}</p>
                <p>{st.text}</p>
                <div className="row">
                  <label className="check"><input type="checkbox" checked={!!done[i]} onChange={() => toggle(i)} /> J’ai essayé</label>
                  <Button variant="ghost" className="btn-sm" icon="calendar" onClick={() => { put(st.text); navigate("/outils/plan"); }}>Dans mon plan de la semaine</Button>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>
      <Section className="alt" eyebrow="Avec les autres, et en route" title="Ce qui aide, ce qui piège, ce qui montre que ça avance">
        <div className="cards">
          <Reveal><article className="card"><span className="sw-ic"><Icon name="users" size={22} /></span><h3>Avec les autres</h3><p>{w.others}</p></article></Reveal>
          <Reveal delay={90}><article className="card"><span className="sw-ic sw-ic-warn"><Icon name="flag" size={22} /></span><h3>Le piège</h3><p>{w.trap}</p></article></Reveal>
          <Reveal delay={180}><article className="card"><span className="sw-ic sw-ic-ok"><Icon name="check" size={22} /></span><h3>Signe que ça avance</h3><p>{w.sign}</p></article></Reveal>
        </div>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          {danger
            ? <Callout tone="alert" title="Pour moi" icon="phone">{cap(s.autosoin.semaines)} <Link to="/pour-la-suite/aide">Quand demander de l’aide</Link></Callout>
            : <Invite id={`w-${s.slug}`} title="Pour moi" prompt={s.autosoin.semaines ? cap(s.autosoin.semaines) : "Je choisis un geste, je le tente pendant une semaine et je note ce qui s’est vraiment passé."} placeholder="Ce qui s’est vraiment passé…" />}
          <Pro>{s.pro.semaines.map((t, i) => <p key={i}>{t}</p>)}</Pro>
        </div>
      </Section>
    </>
  );
}

/* ═════════ Onglet 4 : ma carte ═════════ */
function Carte({ s }: { s: SchemaData }) {
  const saved = cartes.use();
  const kept = retained.use();
  const focus = focusSchema.use();
  const isKept = kept.includes(s.slug);
  const toggleKeep = () => {
    if (isKept) { retained.set(kept.filter((x) => x !== s.slug)); if (focus === s.slug) focusSchema.set(null); }
    else if (kept.length < 3) retained.set([...kept, s.slug]);
  };
  const carte = saved[s.slug] || defaultCarte(s);
  return (
    <>
      <Section eyebrow="Mon repère" title="Ce schéma me ressemble-t-il ?" lead="Je lis la phrase : si elle me parle, je coche. Ni test, ni diagnostic.">
        <div className="sp-two">
          <SchemaCheck s={s} />
          <div className="stack" style={{ ["--gap" as string]: "1rem" }}>
            <Button variant={isKept ? "primary" : "soft"} icon={isKept ? "check" : "plus"} onClick={toggleKeep} aria-pressed={isKept} disabled={!isKept && kept.length >= 3}>{isKept ? "Schéma gardé" : kept.length >= 3 ? "Trois schémas déjà gardés" : "Garder ce schéma"}</Button>
            <p className="small muted">Je garde un à trois schémas, jamais plus. {kept.length > 0 && <>Gardés : {kept.length} sur 3. </>}<Link to="/trouver/priorites">Voir mes priorités</Link></p>
            {isKept && <Button variant="ghost" icon="flag" onClick={() => focusSchema.set(s.slug)} aria-pressed={focus === s.slug}>{focus === s.slug ? "Mon schéma de départ" : "Commencer par celui-ci"}</Button>}
          </div>
        </div>
      </Section>
      <Section className="alt" eyebrow="Ma carte-mémo" title={saved[s.slug] ? "Ma carte, telle que je l’ai écrite" : "Une première version, à réécrire avec mes mots"}>
        <div className="sp-two">
          <CarteView c={carte} tone={`b${s.base}`} />
          <div className="stack" style={{ ["--gap" as string]: "1rem" }}>
            <p>{saved[s.slug] ? "Ma carte est enregistrée sur cet appareil." : "Ces mots viennent du support. Je les réécris avec les miens, puis j’enregistre ma carte."}</p>
            <div className="row"><Button to={`/outils/carte-memo?schema=${s.slug}`} icon="pencil">{saved[s.slug] ? "Modifier ma carte" : "Faire ma carte"}</Button><Button to="/outils/pause" variant="soft" icon="wind">La pause</Button></div>
          </div>
        </div>
      </Section>
    </>
  );
}

/* ═════════ Page ═════════ */
export default function SchemaPage({ slug, tab }: { slug?: string; tab?: string }) {
  const s = slug ? schemaBySlug(slug) : undefined;
  const t = (SCHEMA_TABS.find((x) => x.id === tab)?.id || "comprendre") as TabId;
  const { prev, next } = useMemo(() => (s ? neighbours(s.slug) : {}), [s]);
  if (!s || (tab && !SCHEMA_TABS.some((x) => x.id === tab))) return <NotFound />;
  const b = baseById(s.base);
  const idx = SCHEMA_TABS.findIndex((x) => x.id === t);
  const nextTab = SCHEMA_TABS[idx + 1];
  return (
    <Page title={`${s.name} · ${SCHEMA_TABS[idx].label}`} tone={`b${s.base}`}>
      <header className="basehero sp-head">
        <div className="wrap">
          <nav aria-label="Fil d’Ariane" className="crumbs"><Link to="/schemas">Mes schémas</Link><Icon name="chevronRight" size={14} /><Link to={`/besoins/${b.slug}`}>Base {b.id} · {b.name}</Link></nav>
          <p className="eyebrow">Schéma de la base {b.id}</p>
          <h1>{s.name}</h1>
          <p className="quote sp-phrase">{s.phrase}</p>
          <nav className="sp-tabs" aria-label={`Pages du schéma ${s.name}`}>
            {SCHEMA_TABS.map((x) => (
              <Link key={x.id} to={`/schemas/${s.slug}/${x.id}`} aria-current={x.id === t ? "page" : undefined} className="sp-tab"><Icon name={x.icon} size={16} /> {x.label}</Link>
            ))}
          </nav>
        </div>
      </header>

      <div key={t} className="sp-body">
        {t === "comprendre" && <Comprendre s={s} />}
        {t === "dans-le-moment" && <Moment s={s} />}
        {t === "au-fil-des-semaines" && <Semaines s={s} />}
        {t === "ma-carte" && <Carte s={s} />}
      </div>

      <Section>
        <div className="sp-foot">
          {nextTab && <Button to={`/schemas/${s.slug}/${nextTab.id}`} iconRight="arrowRight">{nextTab.label}</Button>}
          <div className="sp-pn">
            {prev && <Link to={`/schemas/${prev.slug}/comprendre`} className="sp-pn-l"><Icon name="arrowLeft" size={16} /> {prev.name}</Link>}
            {next && <Link to={`/schemas/${next.slug}/comprendre`} className="sp-pn-r">{next.name} <Icon name="arrowRight" size={16} /></Link>}
          </div>
        </div>
      </Section>
    </Page>
  );
}
