import { Page, Section, Reveal, Quote, Pro, Invite, Callout, Pill, Retain, Explain, Button, NextUp } from "../components/ui";
import { Icon } from "../components/Icon";
import { BaseAnimation } from "../scenes/BaseScenes";
import { Link } from "../lib/router";
import { baseBySlug, BASES } from "../data/bases";
import { schemasOfBase } from "../data/schemas";
import { ticks, retained, tickCount } from "../lib/state";
import NotFound from "./NotFound";

export default function Base({ slug }: { slug?: string }) {
  const b = slug ? baseBySlug(slug) : undefined;
  const t = ticks.use();
  const kept = retained.use();
  if (!b) return <NotFound />;
  const sc = schemasOfBase(b.id);
  const prev = BASES[b.id - 2];
  const next = BASES[b.id];
  const essai = b.anim.essai;
  const autosoin = b.autosoin && b.autosoin !== essai ? b.autosoin : "";
  return (
    <Page title={`Base ${b.id} · ${b.name}`} tone={`b${b.id}`}>
      <header className="basehero">
        <div className="wrap">
          <nav aria-label="Fil d’Ariane" className="crumbs"><Link to="/besoins">Les 5 besoins</Link><Icon name="chevronRight" size={14} /><span aria-current="page">Base {b.id} sur 5</span></nav>
          <p className="eyebrow">Base {b.id} · {b.domain}</p>
          <h1>{b.name}</h1>
          <ol className="basedots" aria-label="Les cinq bases">
            {BASES.map((x) => <li key={x.id} className={`tone-b${x.id}`}><Link to={`/besoins/${x.slug}`} aria-current={x.id === b.id ? "page" : undefined} className={x.id === b.id ? "is-on" : ""}><span className="sr-only">Base {x.id} : {x.name}</span><span aria-hidden="true">{x.id}</span></Link></li>)}
          </ol>
        </div>
      </header>

      <Section eyebrow="Le besoin de l’enfant" title="De quoi avait-on besoin ?">
        <ul className="needs">
          {b.besoins.map((x, i) => <Reveal as="li" key={x} delay={i * 90} className="need"><span className="need-ic"><Icon name={i === 0 ? "shield" : i === 1 ? "heart" : "sparkles"} size={22} /></span><span>{x}</span></Reveal>)}
        </ul>
        <Reveal delay={120}>
          <div className="manque">
            <p className="eyebrow">Quand ce besoin manque durablement</p>
            <Quote tone={`b${b.id}`}>{b.manque}</Quote>
          </div>
        </Reveal>
        {b.extra && <p className="small muted mt">{b.extra}</p>}
      </Section>

      <Section className="alt" eyebrow={`${sc.length} schémas dans cette base`} title="Les schémas de cette base" lead="Chaque carte donne la phrase typique du schéma. Je peux ouvrir celui dont la phrase sonne vrai.">
        <ul className="schemacards">
          {sc.map((s, i) => {
            const n = tickCount(t[s.slug]);
            return (
              <Reveal as="li" key={s.slug} delay={i * 80}>
                <Link to={`/schemas/${s.slug}/comprendre`} className="schemacard">
                  <span className="schemacard-top"><b>{s.name}</b>{kept.includes(s.slug) ? <Pill>Gardé</Pill> : n > 0 ? <Pill>{n} case{n > 1 ? "s" : ""} cochée{n > 1 ? "s" : ""}</Pill> : null}</span>
                  <span className="quote schemacard-q">{s.phrase}</span>
                  {b.quotidien[s.slug] && <span className="schemacard-d">{b.quotidien[s.slug]}</span>}
                  <span className="schemacard-go">Comprendre ce schéma <Icon name="arrowRight" size={18} /></span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
        <p className="small muted mt">Se reconnaître dans une phrase n’est pas un diagnostic. Pour repérer ses schémas plus finement : <Link to="/trouver/fiche">la fiche « Trouver mon schéma »</Link>.</p>
      </Section>

      <Section eyebrow="En image" title={b.anim.titre}>
        <div className="anim-layout">
          <Reveal><BaseAnimation id={b.anim.id} label={b.anim.titre} /></Reveal>
          <div className="anim-side">
            <Reveal delay={80}><Explain tone={`b${b.id}`}><p>{b.anim.explication}</p></Explain></Reveal>
            <Reveal delay={160}>
              <div className={`try tone-b${b.id}`}>
                <p className="try-t"><Icon name="bolt" size={18} /> À essayer cette semaine</p>
                <p>{essai.charAt(0).toUpperCase() + essai.slice(1)}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section className="alt">
        <div className="stack" style={{ ["--gap" as string]: "1.4rem" }}>
          {autosoin && <Invite id={`base-${b.id}`} title="Pour moi" prompt={autosoin.charAt(0).toUpperCase() + autosoin.slice(1)} placeholder="Ce que je remarque…" />}
          {!autosoin && <Invite id={`base-${b.id}`} title="Pour moi" prompt="Parmi les phrases de cette base, laquelle sonne le plus vrai ?" placeholder="La phrase qui sonne le plus vrai pour moi est…" />}
          <Pro>{b.pro}</Pro>
          <Retain items={[
            `Besoin : ${b.besoins[0].charAt(0).toLowerCase() + b.besoins[0].slice(1)}`,
            `S’il manque : ${b.manque.charAt(0).toLowerCase() + b.manque.slice(1)}`,
            `${sc.length} schémas : ${sc.map((s) => s.name.toLowerCase()).join(", ")}.`,
          ]} />
          <Callout tone="care" title="Je peux m’arrêter ici">Cette base peut réveiller des souvenirs. Si c’est trop lourd, je fais une pause, et j’en parle à un(e) professionnel(le) si cela dure.</Callout>
        </div>
      </Section>

      <Section>
        <div className="basenav">
          {prev ? <Button to={`/besoins/${prev.slug}`} variant="ghost" icon="arrowLeft">Base {prev.id} · {prev.name}</Button> : <span />}
          {next ? <Button to={`/besoins/${next.slug}`} variant="soft" iconRight="arrowRight">Base {next.id} · {next.name}</Button> : null}
        </div>
        {!next && <div className="mt"><NextUp to="/entretien" label="Comment un schéma s’entretient" hint="Le cercle, les trois façons de réagir, les signes." eyebrow="Partie 3 sur 8" /></div>}
      </Section>
    </Page>
  );
}
