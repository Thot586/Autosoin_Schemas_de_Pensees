import { useState } from "react";
import { Page, Section, Reveal, Callout, Invite, NextUp, Pro, Tabs, tabPanelProps, Term } from "../components/ui";
import { Icon } from "../components/Icon";
import { ToolHead } from "../components/ToolBits";
import { CONTENT } from "../data/content";
import { notes } from "../lib/state";

const C = CONTENT.p6.dire;
type Sid = "chef" | "partenaire" | "proche";
const TABL: Record<Sid, string> = { chef: "Mon chef", partenaire: "Mon (ma) partenaire", proche: "Un ami, un proche" };
const LABELS = ["Je demande un moment", "Je décris le fait et mon ressenti", "Je fais ma demande", "Je conclus ensemble"];

export default function Dire() {
  const [sid, setSid] = useState<Sid>("chef");
  const sit = C.situations.find((s) => s.id === sid)!;
  const n = notes.use();
  const key = (i: number) => `dire-${sid}-${i}`;
  const [spoken, setSpoken] = useState<Record<string, boolean>>({});
  return (
    <Page title="Dire ce qui ne va pas">
      <ToolHead title="Dire ce qui ne va pas, sans attaquer" current="/outils/dire" lead={C.chapeau} />

      <Section eyebrow="Quatre temps" title="La méthode, en bref" lead={<>Inspirée de la méthode <Term id="desc">DESC</Term> : décrire, exprimer, spécifier, conclure.</>}>
        <ol className="desc">
          {C.temps.map((t, i) => (
            <Reveal as="li" key={t.titre} delay={i * 90} className="desc-i">
              <span className="badge-n">{i + 1}</span>
              <div><h3>{t.titre}</h3><p>{t.texte}</p></div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section className="alt" eyebrow="Trois situations" title="Je choisis la mienne" lead="Les phrases sont des exemples : je les réécris avec mes mots, je les lis à voix haute, puis je choisis un moment calme.">
        <Tabs<Sid> idBase="dire" label="Situations" value={sid} onChange={setSid} tabs={C.situations.map((s) => ({ id: s.id as Sid, label: TABL[s.id as Sid] }))} />
        <div {...tabPanelProps("dire", sid)} key={sid} className="dire-panel">
          <p className="lead dire-ctx">{sit.contexte}</p>
          <ol className="dire-steps">
            {sit.phrases.map((ph, i) => {
              const k = key(i);
              const mine = n[k] || "";
              return (
                <li key={k} className={`dire-step ${spoken[k] ? "is-spoken" : ""}`}>
                  <div className="dire-h"><span className="badge-n">{i + 1}</span><b>{LABELS[i]}</b></div>
                  <p className="quote dire-q">« {ph.replace(/^«\s?|\s?»$/g, "")} »</p>
                  <div className="field">
                    <label htmlFor={`m-${k}`} className="small">Avec mes mots <span className="muted">(facultatif)</span></label>
                    <textarea id={`m-${k}`} rows={2} value={mine} placeholder="Ma version…" onChange={(e) => notes.set((x) => ({ ...x, [k]: e.target.value }))} />
                  </div>
                  <label className="check"><input type="checkbox" checked={!!spoken[k]} onChange={(e) => setSpoken((x) => ({ ...x, [k]: e.target.checked }))} /> Je l’ai lue à voix haute</label>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Callout tone="alert" title="Si je me sens en danger" icon="phone">{C.danger}</Callout>
          <Reveal>
            <div className="card">
              <h3>{C.repetition.titre}</h3>
              <p>{C.repetition.texte}</p>
              <p className="mb0"><Icon name="pencil" size={16} /> <b>À faire :</b> {C.repetition.faire}</p>
            </div>
          </Reveal>
          <Invite id="p6-dire" prompt="Choisir une seule situation, puis un moment calme" hint={C.invite} placeholder="J’en parlerai à… le… Ce qui s’est vraiment passé…" />
          <Pro>{C.pro}</Pro>
        </div>
      </Section>

      <Section>
        <NextUp to="/outils/plan" label="Mon plan pour la semaine" hint="Un schéma, un geste, un moment. Bilan le dimanche." eyebrow="Outil suivant" />
      </Section>
    </Page>
  );
}
