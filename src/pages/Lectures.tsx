import { Page, Section, Reveal, Invite, Pro } from "../components/ui";
import { Icon } from "../components/Icon";
import { SuiteHead } from "../components/Part8";
import { CONTENT } from "../data/content";

export default function Lectures() {
  const c = CONTENT.p8.lectures;
  return (
    <Page title="Pour aller plus loin">
      <SuiteHead title={c.titre} current="/pour-la-suite/lectures" lead="Des lectures, pour poursuivre à mon rythme, et un annuaire pour trouver un thérapeute." />
      <Section eyebrow="Livres" title="Trois références">
        <ul className="books">
          {c.livres.map((l, i) => (
            <Reveal as="li" key={l.titre} delay={i * 90} className="book">
              <span className="book-ic"><Icon name="book" size={24} /></span>
              <div>
                <h3>{l.titre}</h3>
                <p className="book-a">{[l.auteurs, l.editeur].filter(Boolean).join(" · ")}</p>
                <p>{l.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>
        <Reveal><a className="btn btn-soft mt" href={c.annuaire.url} target="_blank" rel="noopener noreferrer"><Icon name="search" size={18} /><span>{c.annuaire.label}</span><Icon name="external" size={16} /><span className="sr-only"> (nouvel onglet)</span></a></Reveal>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Invite id="p8-lectures" prompt="Un chapitre à lire cette semaine" hint={c.invite} placeholder="Le chapitre sur le schéma… à lire le…" />
          <Pro>{c.pro}</Pro>
        </div>
      </Section>
    </Page>
  );
}
