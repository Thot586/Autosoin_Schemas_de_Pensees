import { Page, Reveal, Section, Button, Callout, PlanStrip, usePartStatus, Ring } from "../components/ui";
import { Icon } from "../components/Icon";
import { HeroArt } from "../components/HeroArt";
import { Link } from "../lib/router";
import { PARTS } from "../data/parts";
import { BASES } from "../data/bases";
import { CONTENT } from "../data/content";
import { schemasOfBase } from "../data/schemas";
import { last, onboarded, ticks, retained, tickCount } from "../lib/state";
import { DOORS, Door } from "./Commencer";

export default function Home() {
  const onb = onboarded.use();
  const lastV = last.use();
  const done = usePartStatus();
  const n = done.filter(Boolean).length;
  const t = ticks.use();
  const kept = retained.use();
  const ticked = Object.values(t).filter((x) => tickCount(x) > 0).length;
  return (
    <Page title="">
      {/* ───── Accueil ───── */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="eyebrow page-enter-1">Psychoéducation · auto-soin en vue d’une thérapie des schémas</p>
            <h1 className="hero-title page-enter-2">Comprendre<br /> ses schémas</h1>
            <p className="lead page-enter-3">Les 15 schémas de pensées de Jeffrey Young et les 5 besoins fondamentaux dont ils naissent.</p>
            <div className="row hero-cta page-enter-4">
              <Button to="/commencer" iconRight="arrowRight">Commencer</Button>
              {lastV && lastV.path !== "/" ? <Button to={lastV.path} variant="soft" icon="replay">Reprendre : {lastV.title || "là où j’en étais"}</Button> : <Button to="/trouver/fiche" variant="soft" icon="search">Trouver mon schéma</Button>}
            </div>
            <p className="hero-note page-enter-5"><Icon name="lock" size={16} /> Gratuit, sans compte. Mes réponses restent sur cet appareil.</p>
          </div>
          <div className="hero-art" aria-hidden={false}><HeroArt interactive /></div>
        </div>
      </header>

      {!onb && (
        <Section className="welcome">
          <Reveal>
            <div className="welcome-card">
              <p className="eyebrow">Bienvenue</p>
              <h2>Trois choses à savoir avant de commencer</h2>
              <ul className="welcome-list">
                <li><Icon name="shield" size={22} /><span><b>Ni test, ni diagnostic.</b> {CONTENT.utiliser.chapeau}</span></li>
                <li><Icon name="lock" size={22} /><span><b>Rien ne quitte cet appareil.</b> Mes cases cochées et mes notes restent dans mon navigateur. Je peux tout effacer à tout moment.</span></li>
                <li><Icon name="heart" size={22} /><span><b>Je peux m’arrêter quand je veux.</b> Si ça ne va pas depuis plusieurs semaines, la page « Quand demander de l’aide » est faite pour ça.</span></li>
              </ul>
              <div className="row">
                <Button onClick={() => onboarded.set(true)} icon="check">J’ai compris</Button>
                <Button to="/pour-la-suite/aide" variant="ghost">Besoin d’aide ?</Button>
              </div>
            </div>
          </Reveal>
        </Section>
      )}

      {/* ───── Par où commencer ───── */}
      <Section eyebrow="Par où commencer ?" title="Je choisis mon chemin" lead="Quatre portes d’entrée. Je peux en changer à tout moment.">
        <div className="cards doors">
          {DOORS.map((d, i) => <Reveal key={d.to} delay={i * 80}><Door d={d} /></Reveal>)}
        </div>
      </Section>

      {/* ───── Les huit parties ───── */}
      <Section className="alt" eyebrow="Le parcours" title="Huit parties. Je peux m’arrêter après chacune."
        lead="Chaque partie se lit en quelques minutes. Les parties déjà vues se cochent toutes seules, sur cet appareil.">
        <div className="parts-head">
          <div className="parts-ring"><Ring value={n / 8} size={76} label={`${n} parties sur 8 vues`} /><span><b>{n}</b>/8</span></div>
          <p className="muted small">{n === 0 ? "Rien de vu pour l’instant : le parcours commence quand je veux." : `${n} partie${n > 1 ? "s" : ""} vue${n > 1 ? "s" : ""}.`}</p>
        </div>
        <ol className="parts-list">
          {PARTS.map((p, i) => (
            <Reveal as="li" key={p.n} delay={(i % 4) * 70}>
              <Link to={p.path} className={`part-card ${done[i] ? "is-done" : ""}`}>
                <span className="part-n">{done[i] ? <Icon name="check" size={18} /> : p.n}</span>
                <span className="part-b">
                  <b>{p.title}</b>
                  <small>{p.short}</small>
                  {p.minutes > 0 && <small className="part-min"><Icon name="clock" size={13} /> environ {p.minutes} min</small>}
                </span>
                <Icon name="chevronRight" size={20} className="part-go" />
              </Link>
            </Reveal>
          ))}
        </ol>
        <PlanStrip />
      </Section>

      {/* ───── Les cinq besoins ───── */}
      <Section eyebrow="Le cœur du modèle" title="Cinq besoins, quinze schémas" lead={CONTENT.p2.chapeau}>
        <div className="bases-teaser">
          {BASES.map((b, i) => (
            <Reveal key={b.id} delay={i * 70}>
              <Link to={`/besoins/${b.slug}`} className={`base-card tone-b${b.id}`}>
                <span className="base-card-n">{b.id}</span>
                <b>{b.name}</b>
                <small>{schemasOfBase(b.id).length} schémas</small>
                <ul>{schemasOfBase(b.id).map((s) => <li key={s.slug}>{s.name}</li>)}</ul>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="small muted" style={{ marginTop: "1rem" }}>{CONTENT.p2.ysq}</p>
      </Section>

      {/* ───── Mon avancée ───── */}
      {(ticked > 0 || kept.length > 0) && (
        <Section className="alt" eyebrow="Mon espace" title="Où j’en suis">
          <Card2 ticked={ticked} kept={kept.length} />
        </Section>
      )}

      {/* ───── Comment utiliser ───── */}
      <Section eyebrow="Mode d’emploi" title="Comment utiliser ce support" lead={CONTENT.utiliser.chapeau}>
        <div className="cards cards-2">
          {CONTENT.utiliser.cartes.map((c, i) => (
            <Reveal key={c.titre} delay={i * 80}>
              <article className="card principle">
                <span className="principle-n">{i + 1}</span>
                <h3>{c.titre}</h3>
                <p>{c.texte}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <Callout tone="alert" title={CONTENT.utiliser.avertissement} className="mt">
            {CONTENT.utiliser.siMalAller} <Link to="/pour-la-suite/aide">Quand demander de l’aide</Link>.
          </Callout>
        </Reveal>
      </Section>
    </Page>
  );
}

function Card2({ ticked, kept }: { ticked: number; kept: number }) {
  return (
    <div className="cards">
      <div className="card"><p className="eyebrow">Ma fiche</p><p><b>{ticked}</b> schéma{ticked > 1 ? "s" : ""} avec au moins une case cochée.</p><Button to="/trouver/fiche" variant="soft" iconRight="arrowRight">Reprendre ma fiche</Button></div>
      <div className="card"><p className="eyebrow">Mes priorités</p><p><b>{kept}</b> schéma{kept > 1 ? "s" : ""} gardé{kept > 1 ? "s" : ""} (trois au maximum).</p><Button to="/trouver/priorites" variant="soft" iconRight="arrowRight">Voir mes priorités</Button></div>
      <div className="card"><p className="eyebrow">Tout au même endroit</p><p>Cartes-mémo, plan de la semaine et carnet, à imprimer pour mon thérapeute.</p><Button to="/mon-espace" variant="soft" iconRight="arrowRight">Mon espace</Button></div>
    </div>
  );
}
