import { useState } from "react";
import { Page, PartHero, Section, Reveal, Callout, Invite, NextUp, Pro, Retain, Choice, Disclose, Quote, Term } from "../components/ui";
import { Icon, type IconName } from "../components/Icon";
import { CONTENT } from "../data/content";

const ORIG_ICONS: Record<string, IconName> = { manque: "heart", blessures: "bolt", trop: "layers", imitation: "users" };

function GlassesDemo() {
  const d = CONTENT.p1.quoi.lunettesExemple;
  const [v, setV] = useState<string>("aucune");
  const cur = d.lectures.find((l) => l.id === v)!;
  return (
    <div className="gdemo">
      <p className="gdemo-msg"><Icon name="chat" size={20} /> {d.message}</p>
      <Choice label="Comment je lis ce message ?" value={v} onChange={setV} options={d.lectures.map((l) => ({ id: l.id, label: l.label }))} />
      <div className={`gdemo-out ${v === "aucune" ? "is-clear" : "is-tint"}`} aria-live="polite">
        <span className="gdemo-lab">Ce que je me dis</span>
        <p key={v} className="quote">{cur.texte}</p>
      </div>
      <p className="small muted">{d.conclusion}</p>
    </div>
  );
}

export default function Comprendre() {
  const c = CONTENT.p1;
  return (
    <Page title="Comprendre un schéma">
      <PartHero n={1} title="Comprendre un schéma" intro={c.quoi.chapeau} />

      <Section eyebrow="Un schéma, c’est quoi ?" title="Trois choses à savoir">
        <ol className="timeline">
          {c.quoi.temps.map((t, i) => (
            <Reveal as="li" key={t.titre} delay={i * 110} className="timeline-i">
              <span className="timeline-dot">{i + 1}</span>
              <div><h3>{t.titre}</h3><p>{t.texte}</p></div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="alt" eyebrow="Pour le voir" title="Des lunettes que l’on ne voit pas" lead={c.quoi.lunettes}>
        <Reveal><GlassesDemo /></Reveal>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Reveal><Quote tone="brand">{c.quoi.question}</Quote></Reveal>
          <Invite id="p1-fort" prompt="Un exemple récent où j’ai réagi plus fort que la situation ne le justifiait" hint={c.quoi.invite} />
          <Pro>{c.quoi.pro}</Pro>
        </div>
      </Section>

      <Section eyebrow="Idées reçues" title="Ce qu’on croit souvent, et ce qu’il en est" lead="Pour chaque idée, je me demande d’abord ce que j’en pense, puis je regarde la réponse.">
        <div className="cards cards-2">
          {c.recues.map((r, i) => (
            <Reveal key={r.idee} delay={(i % 2) * 90}>
              <Disclose question={<><span className="eyebrow">Idée reçue {i + 1}</span><p className="disclose-idea">« {r.idee} »</p></>}>
                <p><b>{r.faux}</b> {r.reponse}</p>
              </Disclose>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="alt" eyebrow={c.origines.titre} title="Quatre sortes d’expériences" lead={c.origines.chapeau}>
        <div className="cards">
          {c.origines.types.map((t, i) => (
            <Reveal key={t.id} delay={i * 80}>
              <div className="card origin">
                <span className="origin-ic"><Icon name={ORIG_ICONS[t.id] || "info"} size={26} /></span>
                <h3>{t.titre}</h3>
                <p>{t.texte}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={80}>
          <ol className="adapt">
            {c.origines.adaptation.map((a, i) => <li key={i}><span className="adapt-n">{["Hier", "Aujourd’hui", "Dans mes relations"][i]}</span>{a}</li>)}
          </ol>
        </Reveal>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Callout tone="care" title="Des pistes, pas des causes">{c.origines.prudence}</Callout>
          <Pro>{c.origines.pro}</Pro>
        </div>
      </Section>

      <Section>
        <div className="stack" style={{ ["--gap" as string]: "1.6rem" }}>
          <Retain items={c.retenir} />
          <NextUp to="/besoins" label="Les 5 besoins" hint={<>Cinq <Term id="besoin">besoins</Term> de l’enfant, et les quinze schémas qui naissent quand ils manquent.</>} eyebrow="Partie 2 sur 8" />
        </div>
      </Section>
    </Page>
  );
}
