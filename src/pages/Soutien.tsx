import { Page, Section, Reveal, Callout, Pro } from "../components/ui";
import { Icon } from "../components/Icon";
import { SuiteHead } from "../components/Part8";
import { CONTENT } from "../data/content";

export default function Soutien() {
  const c = CONTENT.p8.soutien;
  return (
    <Page title="Où trouver un soutien">
      <SuiteHead title={c.titre} current="/pour-la-suite/soutien" lead={c.chapeau} />
      <Section>
        <div className="cards cards-2">
          {c.portes.map((p, i) => (
            <Reveal key={p.titre} delay={(i % 2) * 90}>
              <article className="card porte">
                <span className="badge-n">{i + 1}</span>
                <h3>{p.titre}</h3>
                <p>{p.texte}</p>
                {"lien" in p && p.lien && <a className="btn btn-soft btn-sm" href={p.lien} target="_blank" rel="noopener noreferrer"><span>{p.lienLabel}</span><Icon name="external" size={16} /><span className="sr-only"> (nouvel onglet)</span></a>}
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Callout tone="alert" title="Si je suis en danger" icon="phone">{c.danger}</Callout>
          <Pro>{c.pro}</Pro>
        </div>
      </Section>
    </Page>
  );
}
