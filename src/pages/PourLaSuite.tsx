import { Page, PartHero, Section, Reveal, Callout, Invite, Pro, Button } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { SUITE } from "../components/Part8";
import { CONTENT } from "../data/content";

export default function PourLaSuite() {
  const c = CONTENT.p8;
  return (
    <Page title="Pour la suite">
      <PartHero n={8} title="Pour la suite" intro="Quand demander de l’aide, où trouver un soutien, mon carnet et les lectures." />
      <Section>
        <Callout tone="alert" title="Si ça ne va pas depuis plusieurs semaines, ou si je pense à me faire du mal" icon="phone">
          <p>3114 (prévention du suicide, 24 h/24), 15 ou 112 en cas de danger immédiat. <Link to="/pour-la-suite/aide">Tous les signes et les numéros</Link>.</p>
        </Callout>
      </Section>
      <Section eyebrow="Quatre pages" title="Ce dont j’ai besoin maintenant">
        <div className="tools">
          {SUITE.map((t, i) => (
            <Reveal key={t.to} delay={(i % 2) * 90}>
              <Link to={t.to} className="tool"><span className="tool-ic"><Icon name={t.icon} size={28} /></span><span className="tool-b"><b>{t.label}</b><small>{t.hint}</small></span><Icon name="arrowRight" size={22} className="tool-ar" /></Link>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section id="a-retenir" className="alt" eyebrow="Pour finir" title={c.retenir.titre}>
        <ol className="retain-big">
          {c.retenir.items.map((t, i) => <Reveal as="li" key={i} delay={i * 110}><span className="badge-n">{i + 1}</span><p>{t}</p></Reveal>)}
        </ol>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Invite id="p8-retenir" prompt={c.retenir.invite} placeholder="La base qui me concerne le plus est… parce que…" />
          <Pro>{c.retenir.pro}</Pro>
        </div>
      </Section>
      <Section>
        <div className="row">
          <Button to="/mon-espace" icon="user">Mon espace</Button>
          <Button to="/schemas" variant="soft" icon="layers">Retourner à mes schémas</Button>
          <Button to="/outils/plan" variant="ghost" icon="calendar">Mon plan de la semaine</Button>
        </div>
      </Section>
    </Page>
  );
}
