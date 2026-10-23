import { Page, PartHero, Section, Reveal, Callout, Invite, NextUp, Pro, Button, Term } from "../components/ui";
import { Icon } from "../components/Icon";
import { CONTENT } from "../data/content";
import { ticks, retained, tickCount } from "../lib/state";

const FIL = ["besoin", "voix", "reaction", "adulte", "geste", "carte"];

export default function Trouver() {
  const c = CONTENT.p5;
  const t = ticks.use();
  const kept = retained.use();
  const ticked = Object.values(t).filter((x) => tickCount(x) > 0).length;
  return (
    <Page title="Trouver mon schéma">
      <PartHero n={5} title="Trouver mon schéma" intro="Passer à l’action, pas à pas : repérer mes schémas et choisir par où commencer." />

      <Section eyebrow={c.trame.titre} title="Six mots, un seul exemple" lead={c.trame.chapeau}>
        <ol className="fil" aria-label="Le fil des six concepts">
          {c.trame.concepts.map((x, i) => (
            <li key={x.id}><a href={`#c-${x.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`c-${x.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }); }}><span>{i + 1}</span>{x.titre.replace(/^La |^Le |^L’/, "")}</a>{i < 5 && <Icon name="arrowRight" size={16} />}</li>
          ))}
        </ol>
        <div className="cards concepts">
          {c.trame.concepts.map((x, i) => (
            <Reveal key={x.id} delay={(i % 3) * 80}>
              <article className="card concept" id={`c-${x.id}`} tabIndex={-1}>
                <span className="badge-n">{i + 1}</span>
                <h3>{x.titre}</h3>
                <p>{x.def}</p>
                <p className="concept-ex"><span className="eyebrow">Exemple</span>{x.exemple}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Invite id="p5-trame" prompt="Un exemple personnel, pour commencer" hint={c.trame.invite} />
          <Pro>{c.trame.pro}</Pro>
        </div>
      </Section>

      <Section className="alt" eyebrow={c.comment.titre} title="Trois étapes, à mon rythme" lead={c.comment.chapeau}>
        <ol className="steps3">
          {c.comment.etapes.map((e, i) => (
            <Reveal as="li" key={e.titre} delay={i * 100} className="step3">
              <span className="badge-n">{i + 1}</span>
              <h3>{e.titre}</h3>
              <p>{e.texte}</p>
              {i === 0 && <Button to="/trouver/fiche" variant="soft" iconRight="arrowRight" className="btn-sm">Ma fiche à cocher</Button>}
              {i === 1 && <Button to="/pour-la-suite/carnet" variant="soft" iconRight="arrowRight" className="btn-sm">Mon carnet</Button>}
              {i === 2 && <Button to="/outils/plan" variant="soft" iconRight="arrowRight" className="btn-sm">Mon plan de la semaine</Button>}
            </Reveal>
          ))}
        </ol>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Callout title={<>Un vrai repérage : le <Term id="ysq">YSQ-2</Term></>} icon="info">{c.fiche.ysq} {c.fiche.ysqLong}</Callout>
          <Pro title="Repère pour l’accompagnant(e) : méthode">{c.comment.pro}</Pro>
        </div>
      </Section>

      <Section>
        <div className="stack" style={{ ["--gap" as string]: "1.6rem" }}>
          {(ticked > 0 || kept.length > 0) && (
            <Reveal><Callout tone="ok" title="Là où j’en suis" icon="check">
              {ticked > 0 ? <>{ticked} schéma{ticked > 1 ? "s" : ""} avec au moins une case cochée. </> : null}{kept.length > 0 ? <>{kept.length} schéma{kept.length > 1 ? "s" : ""} gardé{kept.length > 1 ? "s" : ""}. </> : null}
              <Button to={kept.length ? "/trouver/priorites" : "/trouver/fiche"} variant="soft" className="btn-sm">{kept.length ? "Voir mes priorités" : "Continuer ma fiche"}</Button>
            </Callout></Reveal>
          )}
          <NextUp to="/trouver/fiche" label="Ma fiche à cocher" hint="Je lis des phrases, je coche ce qui me parle. Ni test, ni diagnostic." eyebrow="Étape 1" />
        </div>
      </Section>
    </Page>
  );
}
