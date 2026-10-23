import { Page, Section, Reveal, Callout, Invite, Pro } from "../components/ui";
import { Icon } from "../components/Icon";
import { SuiteHead } from "../components/Part8";
import { Link } from "../lib/router";
import { CONTENT } from "../data/content";

export default function Aide() {
  const c = CONTENT.p8.aide;
  return (
    <Page title="Quand demander de l’aide">
      <SuiteHead title={c.titre} current="/pour-la-suite/aide" tone="brand" lead="Les schémas sont des fragilités fréquentes, pas des urgences. Mais certaines situations demandent de l’aide sans attendre." />
      <Section eyebrow="Numéros" title="Si c’est urgent">
        <ul className="nums">
          {c.numeros.map((n, i) => (
            <Reveal as="li" key={n.num} delay={i * 80}>
              <a href={`tel:${n.tel}`} className="num"><span className="num-n">{n.num}</span><span className="num-t">{n.texte}</span><span className="num-c"><Icon name="phone" size={20} /><span className="sr-only">Appeler le {n.num}</span></span></a>
            </Reveal>
          ))}
        </ul>
        <p className="small muted mt">{c.horsFrance}</p>
      </Section>
      <Section className="alt" eyebrow="Les signes" title={c.chapeau}>
        <ul className="signs-list">
          {c.signes.map((t, i) => <Reveal as="li" key={i} delay={i * 70}><Icon name="flag" size={20} /><span>{t}</span></Reveal>)}
        </ul>
      </Section>
      <Section eyebrow="Je ne reste pas seul(e)" title="À qui en parler">
        <ul className="signs-list signs-list-ok">
          <Reveal as="li"><Icon name="heart" size={20} /><span>{c.parler[0]}</span></Reveal>
          <Reveal as="li" delay={70}><Icon name="heart" size={20} /><span>Sans thérapeute pour l’instant : <Link to="/pour-la-suite/soutien">où trouver un soutien</Link>.</span></Reveal>
        </ul>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Callout tone="ok" title={c.rappel} icon="shield">{c.parler[1]}</Callout>
          <Invite id="p8-aide" prompt="Le numéro de mon médecin traitant, à portée de main" hint={c.invite} placeholder="Son nom, son numéro…" />
          <Pro>{c.pro}</Pro>
        </div>
      </Section>
    </Page>
  );
}
