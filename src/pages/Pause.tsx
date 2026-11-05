import { useCallback, useRef, useState } from "react";
import { Page, Section, Reveal, Callout, Invite, NextUp, Pro, Button, Quote } from "../components/ui";
import { Icon } from "../components/Icon";
import { ToolHead } from "../components/ToolBits";
import { Link } from "../lib/router";
import { CONTENT } from "../data/content";
import { cartes, carnet } from "../lib/state";
import { Breathing } from "../components/Breathing";

const C = CONTENT.p6.pause;
export default function Pause() {
  const [step, setStep] = useState(0);
  const [level, setLevel] = useState(5);
  const [touched, setTouched] = useState(false);
  const [voix, setVoix] = useState("");
  const [geste, setGeste] = useState("");
  const [saved, setSaved] = useState(false);
  const [breathDone, setBreathDone] = useState(false);
  const cs = cartes.use();
  const gestes = Object.values(cs).map((c) => c.geste).filter(Boolean);
  const onDone = useCallback(() => setBreathDone(true), []);
  const stepsRef = useRef<HTMLDivElement>(null);
  const go = (n: number) => { setStep(n); window.setTimeout(() => stepsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 30); };
  const addToCarnet = () => {
    const d = new Date();
    carnet.set((x) => [...x, { id: String(Date.now()), date: d.toISOString().slice(0, 10), situation: "", emotion: `${level}/10`, voix, base: "", fait: geste, adulte: "" }]);
    setSaved(true);
  };
  return (
    <Page title="La pause en trois temps">
      <ToolHead title={C.titre} current="/outils/pause" lead={C.resume} />

      <Section eyebrow="Je m’exerce, à froid" title="Vingt secondes, trois temps">
        <div ref={stepsRef} className="pz" style={{ scrollMarginTop: 90 }}>
          <ol className="pz-steps" aria-label="Les trois temps">
            {C.etapes.map((e, i) => (
              <li key={e.mot}><button type="button" className={i === step ? "is-on" : i < step ? "is-done" : ""} aria-current={i === step ? "step" : undefined} onClick={() => go(i)}><span>{i < step ? <Icon name="check" size={16} /> : i + 1}</span>{e.mot}</button></li>
            ))}
          </ol>
          <div className="pz-panel" key={step}>
            <p className="pz-t"><b>{C.etapes[step].mot}.</b> {C.etapes[step].texte}</p>
            {step === 0 && <Breathing onDone={onDone} />}
            {step === 1 && (
              <div className="pz-form">
                <div className="field">
                  <label htmlFor="pz-level">Mon émotion, de 0 à 10 : <b className="pz-n">{touched ? level : "…"}</b></label>
                  <input id="pz-level" type="range" min={0} max={10} step={1} value={level} onChange={(e) => { setLevel(Number(e.target.value)); setTouched(true); }} className="age-range" aria-valuetext={`${level} sur 10`} />
                  <div className="age-scale" aria-hidden="true"><span>0 · calme</span><span>10 · maximale</span></div>
                </div>
                <div className="field">
                  <label htmlFor="pz-voix">Ce que dit la petite voix</label>
                  <input id="pz-voix" type="text" value={voix} onChange={(e) => setVoix(e.target.value)} placeholder="« … »" />
                </div>
                <p className="small muted">Je me dis : « Mon schéma s’est allumé. » Ce que je note reste sur cet appareil.</p>
              </div>
            )}
            {step === 2 && (
              <div className="pz-form">
                <div className="field">
                  <label htmlFor="pz-geste">Le plus petit geste possible. Un seul.</label>
                  <input id="pz-geste" type="text" value={geste} onChange={(e) => setGeste(e.target.value)} placeholder="Par exemple : prendre note, puis en reparler plus tard" />
                </div>
                {gestes.length > 0 && (
                  <div><p className="small muted">Les gestes de mes cartes-mémo :</p><div className="choice">{gestes.map((g) => <button key={g} type="button" className="choice-o" onClick={() => setGeste(g)}>{g}</button>)}</div></div>
                )}
                {gestes.length === 0 && <p className="small muted">Je n’ai pas encore de carte-mémo : <Link to="/outils/carte-memo">j’en fais une</Link> pour avoir mes gestes sous la main.</p>}
                {(geste || voix || touched) && (
                  <div className="pz-sum">
                    <p className="eyebrow">Ma pause</p>
                    <p>{touched && <>Émotion : <b>{level}/10</b>. </>}{voix && <>Petite voix : <i>{voix}</i>. </>}{geste && <>Geste : <b>{geste}</b>.</>}</p>
                    <Button variant="soft" icon="save" onClick={addToCarnet} disabled={saved}>{saved ? "Noté dans mon carnet" : "Noter dans mon carnet"}</Button>
                  </div>
                )}
              </div>
            )}
            <div className="pz-nav">
              {step > 0 ? <Button variant="ghost" icon="arrowLeft" onClick={() => go(step - 1)}>Précédent</Button> : <span />}
              {step < 2 && <Button iconRight="arrowRight" onClick={() => go(step + 1)}>{step === 0 && breathDone ? "Suite : nommer" : step === 0 ? "Passer à « nommer »" : "Suite : choisir"}</Button>}
            </div>
          </div>
        </div>
        <Reveal><Callout tone="care" className="mt" title="Si l’émotion déborde">Si une émotion déborde et ne redescend pas, je ne reste pas seul(e) : voir <Link to="/aide">« Quand demander de l’aide »</Link>.</Callout></Reveal>
      </Section>

      <Section className="alt" eyebrow="Un exemple" title="Au travail, devant l’équipe">
        <Reveal><Quote tone="brand">{C.exemple.replace(/^Exemple\s?:\s?/, "")}</Quote></Reveal>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Invite id="p6-pause" prompt="Deux ou trois fois à froid, avant d’en avoir besoin" hint={C.invite} placeholder="Ce que j’ai remarqué en m’exerçant…" />
          <Pro>{C.pro}</Pro>
        </div>
      </Section>

      <Section>
        <NextUp to="/outils/dire" label="Dire ce qui ne va pas, sans attaquer" hint="Même méthode, trois situations." eyebrow="Outil suivant" />
      </Section>
    </Page>
  );
}
