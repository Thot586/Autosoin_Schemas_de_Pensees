import { Page, Reveal, Section, Button, Callout } from "../components/ui";
import { Icon, type IconName } from "../components/Icon";
import { Link } from "../lib/router";
import { onboarded } from "../lib/state";

export interface DoorData { to: string; icon: IconName; tone: string; title: string; text: string; cta: string; meta?: string; also?: { to: string; label: string } }

export const DOORS: DoorData[] = [
  { to: "/comprendre", icon: "book", tone: "b4", title: "Je découvre les schémas", text: "Un parcours guidé en quatre étapes courtes : ce qu’est un schéma, les cinq besoins, ce qui l’entretient, ce qui aide.", cta: "Commencer le parcours", meta: "Environ 25 minutes, en plusieurs fois si je veux" },
  { to: "/trouver/fiche", icon: "search", tone: "b1", title: "Je cherche mon schéma", text: "Je lis des phrases, je coche ce qui me parle, puis je garde un à trois schémas pour commencer.", cta: "Ouvrir ma fiche", meta: "Environ 10 minutes, au calme" },
  { to: "/schemas", icon: "layers", tone: "b3", title: "Je connais déjà mon schéma", text: "Je vais directement à ses trois pages : le comprendre, que faire dans le moment, avancer au fil des semaines.", cta: "Choisir un schéma", meta: "Quinze schémas, trois pages chacun" },
  { to: "/outils/pause", icon: "heart", tone: "b5", title: "Je traverse un moment difficile", text: "Une pause en trois temps, avec une respiration guidée. Et, si j’en ai besoin, les numéros pour être aidé(e) tout de suite.", cta: "Faire la pause", meta: "Environ une minute", also: { to: "/pour-la-suite/aide", label: "Besoin d’aide maintenant ?" } },
];

export function Door({ d }: { d: DoorData }) {
  return (
    <article className={`door tone-${d.tone}`}>
      <span className="door-ic"><Icon name={d.icon} size={28} /></span>
      <h3>{d.title}</h3>
      <p>{d.text}</p>
      {d.meta && <p className="door-meta"><Icon name="clock" size={14} /> {d.meta}</p>}
      <div className="row">
        <Button to={d.to} variant="soft" iconRight="arrowRight">{d.cta}</Button>
        {d.also && <Link to={d.also.to} className="small">{d.also.label}</Link>}
      </div>
    </article>
  );
}

export default function Commencer() {
  return (
    <Page title="Par où commencer ?">
      <header className="parthero tone-brand">
        <div className="wrap">
          <p className="eyebrow">Bienvenue</p>
          <h1>Par où commencer ?</h1>
          <p className="lead">Il n’y a pas de bonne porte d’entrée : je choisis celle qui me ressemble aujourd’hui. Un schéma à la fois, un geste par semaine, à mon rythme.</p>
        </div>
      </header>
      <Section>
        <div className="cards cards-2 doors">
          {DOORS.map((d, i) => <Reveal key={d.to} delay={i * 80}><Door d={d} /></Reveal>)}
        </div>
        <Reveal>
          <Callout tone="alert" title="Ce support ne remplace pas un suivi avec un professionnel formé." className="mt">
            Il aide à comprendre, pas à poser un diagnostic. Si ça ne va pas depuis plusieurs semaines : <Link to="/pour-la-suite/aide">quand demander de l’aide</Link>.
          </Callout>
        </Reveal>
        <Reveal><div className="row mt"><Button variant="ghost" icon="check" onClick={() => onboarded.set(true)}>Ne plus afficher l’accueil de bienvenue</Button></div></Reveal>
      </Section>
    </Page>
  );
}
