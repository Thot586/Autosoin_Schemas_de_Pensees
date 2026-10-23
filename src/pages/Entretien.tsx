import { useState } from "react";
import { Page, PartHero, Section, Reveal, Callout, Invite, NextUp, Pro, Retain, Choice, Term } from "../components/ui";
import { Icon, type IconName } from "../components/Icon";
import { CycleAnimation } from "../scenes/ConceptScenes";
import { Figure, type Pose } from "../components/Figure";
import { CONTENT } from "../data/content";
import { notes } from "../lib/state";

const SIGN_ICONS: Record<string, IconName> = { eclair: "bolt", horloge: "clock", bulle: "chat", rouage: "gear" };
const REACT_POSE: Record<string, { pose: Pose; flip?: boolean; walking?: boolean }> = { capituler: { pose: "bow" }, eviter: { pose: "walk", flip: true, walking: true }, surcompenser: { pose: "fist" } };

function Reactions() {
  const r = CONTENT.p3.reactions;
  const n = notes.use();
  const pref = (n["p3-reaction"] || "") as string;
  return (
    <>
      <div className="cards reacts">
        {r.cartes.map((c, i) => (
          <Reveal key={c.id} delay={i * 100}>
            <article className={`card react ${pref === c.id ? "is-pref" : ""}`}>
              <svg viewBox="0 0 80 84" className="react-fig" aria-hidden="true"><Figure x={20} y={4} scale={1} {...REACT_POSE[c.id]} color="var(--accent)" /></svg>
              <p className="eyebrow">Réflexe : {c.reflexe}</p>
              <h3>{c.titre}</h3>
              <p className="quote">{c.phrase}</p>
              <p className="small muted">{c.exemple}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="pref">
          <p className="pref-q">Laquelle je reconnais le plus chez moi ?</p>
          <Choice label="Laquelle je reconnais le plus chez moi ?" value={pref as "" | string} onChange={(v) => notes.set((x) => ({ ...x, "p3-reaction": v }))}
            options={[...r.cartes.map((c) => ({ id: c.id, label: c.titre })), { id: "variable", label: "Ça dépend des jours" }]} />
          <p className="small muted">Chacun utilise les trois selon les situations, avec souvent une préférence. Ce choix reste sur cet appareil.</p>
        </div>
      </Reveal>
    </>
  );
}

function AgeSlider() {
  const s = CONTENT.p3.signes;
  const [age, setAge] = useState<number | null>(null);
  const child = age !== null && age <= 14;
  return (
    <div className="age">
      <label htmlFor="age-range" className="age-q">{s.question}</label>
      <input id="age-range" type="range" min={3} max={50} step={1} value={age ?? 27} onChange={(e) => setAge(Number(e.target.value))} aria-valuetext={age === null ? "pas encore choisi" : `${age} ans`} className="age-range" />
      <div className="age-scale" aria-hidden="true"><span>enfant</span><span>adolescent(e)</span><span>adulte d’aujourd’hui</span></div>
      <p className="age-out" aria-live="polite">
        {age === null ? <span className="muted">Je bouge le curseur, sans réfléchir longtemps. {s.age.aide}</span> : <><b>{age} ans.</b> {child ? s.age.enfant : s.age.adulte}</>}
      </p>
    </div>
  );
}

export default function Entretien() {
  const c = CONTENT.p3;
  return (
    <Page title="Comment un schéma s’entretient">
      <PartHero n={3} title="Comment un schéma s’entretient" intro="Le cercle qui l’entretient, les trois façons de réagir et les signes qui le révèlent." />

      <Section eyebrow="Le cercle" title={c.cercle.titre}>
        <div className="anim-layout">
          <Reveal><CycleAnimation /></Reveal>
          <div className="anim-side">
            <Reveal delay={80}>
              <div className="explain tone-brand">
                <p className="explain-t"><Icon name="eye" size={18} /> Ce que montre l’animation</p>
                <p>{c.cercle.exemple}</p>
                <p>{c.cercle.boucle}</p>
                <p><b>{c.cercle.agir.titre} :</b> {c.cercle.agir.items.map((s) => s.toLowerCase()).join(", ")}.</p>
              </div>
            </Reveal>
            <Reveal delay={160}><Invite id="p3-cercle" prompt="Une situation récente, peu chargée, en quatre temps" hint={c.cercle.invite} placeholder="Situation… Émotion… Réaction… Ensuite…" /></Reveal>
          </div>
        </div>
        <Pro>{c.cercle.pro}</Pro>
      </Section>

      <Section id="reactions" className="alt" eyebrow="Les réactions automatiques" title={c.reactions.titre} lead={c.reactions.chapeau}>
        <Callout title="On les repère, on ne les « choisit » pas" icon="info">
          Capituler, éviter, surcompenser : ce ne sont pas trois conseils, mais trois <Term id="reaction">réactions automatiques</Term>. Le but n’est pas d’en adopter une, mais d’apprendre à la reconnaître.
        </Callout>
        <div className="mt"><Reactions /></div>
        <p className="lead mt"><b>{c.reactions.conclusion}</b></p>
        <Pro>{c.reactions.pro}</Pro>
      </Section>

      <Section eyebrow="Les signes" title={c.signes.titre}>
        <div className="cards signs">
          {c.signes.items.map((it, i) => (
            <Reveal key={it.titre} delay={i * 80}>
              <div className="card sign"><span className="origin-ic"><Icon name={SIGN_ICONS[it.icone] || "info"} size={24} /></span><h3>{it.titre}</h3><p>{it.texte}</p></div>
            </Reveal>
          ))}
        </div>
        <Reveal><AgeSlider /></Reveal>
        <Pro>{c.signes.pro}</Pro>
      </Section>

      <Section className="alt">
        <div className="stack" style={{ ["--gap" as string]: "1.6rem" }}>
          <Retain items={CONTENT.p4.retenir3} />
          <NextUp to="/s-en-sortir" label="Ce qui aide à s’en sortir" hint="L’adulte sain, et les quatre leviers." eyebrow="Partie 4 sur 8" />
        </div>
      </Section>
    </Page>
  );
}
