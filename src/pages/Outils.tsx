import { Page, PartHero, Section, Reveal, NextUp, Callout } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { TOOLS } from "../components/ToolBits";
import { cartes, plan, carnet } from "../lib/state";

export default function Outils() {
  const c = cartes.use();
  const p = plan.use();
  const k = carnet.use();
  const state: Record<string, string> = {
    "/outils/carte-memo": Object.keys(c).length ? `${Object.keys(c).length} carte${Object.keys(c).length > 1 ? "s" : ""} enregistrée${Object.keys(c).length > 1 ? "s" : ""}` : "",
    "/outils/plan": p.geste ? "Plan de la semaine commencé" : "",
    "/outils/pause": k.length ? `${k.length} ligne${k.length > 1 ? "s" : ""} dans mon carnet` : "",
  };
  return (
    <Page title="Mes outils">
      <PartHero n={6} title="Mes outils" intro="La carte-mémo, la pause en trois temps, et comment en parler." />
      <Section eyebrow="Quatre outils" title="Je choisis celui dont j’ai besoin maintenant" lead="Je peux les utiliser dans n’importe quel ordre. La pause se pratique d’abord à froid, avant d’en avoir besoin.">
        <div className="tools">
          {TOOLS.map((t, i) => (
            <Reveal key={t.to} delay={(i % 2) * 90}>
              <Link to={t.to} className="tool">
                <span className="tool-ic"><Icon name={t.icon} size={28} /></span>
                <span className="tool-b"><b>{t.label}</b><small>{t.hint}</small>{state[t.to] && <em><Icon name="check" size={14} /> {state[t.to]}</em>}</span>
                <Icon name="arrowRight" size={22} className="tool-ar" />
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section className="alt">
        <div className="stack" style={{ ["--gap" as string]: "1.4rem" }}>
          <Callout tone="care" title="Si un exercice me bouleverse" icon="heart">J’arrête, je fais la pause en trois temps, et j’en parle à mon thérapeute ou à mon médecin si cela dure. La page <Link to="/pour-la-suite/aide">« Quand demander de l’aide »</Link> est là pour ça.</Callout>
          <NextUp to="/schemas" label="Mes schémas, un par un" hint="Pour chaque schéma : le comprendre, dans le moment, au fil des semaines." eyebrow="Partie 7 sur 8" />
        </div>
      </Section>
    </Page>
  );
}
