import { Page, PartHero, Section, Reveal, Callout, NextUp, Pro, Retain, Term, Pill } from "../components/ui";
import { Icon, type IconName } from "../components/Icon";
import { AdulteAnimation } from "../scenes/ConceptScenes";
import { CONTENT } from "../data/content";

const LEV_ICONS: Record<string, IconName> = { comprendre: "book", ressentir: "heart", agir: "bolt", lien: "users" };

export default function SEnSortir() {
  const c = CONTENT.p4;
  return (
    <Page title="Ce qui aide à s’en sortir">
      <PartHero n={4} title="Ce qui aide à s’en sortir" intro="L’adulte sain, et ce qui aide à renforcer cette part de soi." />

      <Section id="adulte-sain" eyebrow={c.adulte.titre} title="Deux parts d’une même personne" lead={c.adulte.chapeau}>
        <div className="anim-layout">
          <Reveal><AdulteAnimation /></Reveal>
          <div className="anim-side">
            <Reveal delay={80}>
              <div className="explain tone-brand">
                <p className="explain-t"><Icon name="info" size={18} /> L’adulte sain n’est pas…</p>
                <ul className="nots">{c.adulte.pas.map((p) => <li key={p}><Icon name="close" size={16} /> {p}</li>)}</ul>
                <p className="mb0">{c.adulte.muscle}</p>
              </div>
            </Reveal>
            <Reveal delay={160}><Callout tone="ok" title="Un mot à retenir" icon="sparkles">L’<Term id="adulte-sain">adulte sain</Term> dit à l’enfant ce dont il a besoin, avec bienveillance <b>et</b> fermeté.</Callout></Reveal>
          </div>
        </div>
        <Pro>{c.adulte.pro}</Pro>
      </Section>

      <Section className="alt" eyebrow={c.leviers.titre} title="Quatre leviers, qui se combinent" lead="Aucun ne suffit seul : le schéma se ressent avant de se penser.">
        <div className="cards cards-2">
          {c.leviers.items.map((l, i) => (
            <Reveal key={l.id} delay={(i % 2) * 90}>
              <article className="card lever">
                <header className="lever-h"><span className="origin-ic"><Icon name={LEV_ICONS[l.id] || "info"} size={24} /></span><h3>{l.titre}</h3></header>
                <p>{l.texte}</p>
                <div className="lever-solo"><Pill>De mon côté</Pill><p>{l.seul}</p></div>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={80}><p className="lead mt"><b>{c.leviers.but}</b></p></Reveal>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Callout tone="care" title="Ressentir et être en lien" icon="heart">{c.leviers.autosoin}</Callout>
          <Pro>{c.leviers.pro}</Pro>
        </div>
      </Section>

      <Section>
        <div className="stack" style={{ ["--gap" as string]: "1.6rem" }}>
          <Retain items={c.retenir4} />
          <NextUp to="/trouver" label="Trouver mon schéma" hint="Six mots à connaître, puis ma fiche et mes priorités." eyebrow="Partie 5 sur 8" />
        </div>
      </Section>
    </Page>
  );
}
