import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { HandInHand } from "../components/Person";
import { Link } from "../lib/router";
import { chapterOf, dueToday, LESSONS, lessonIndex, nextToDo } from "../learn/lessons";
import { lessonState, quizState } from "../learn/progress";
import { SCHEMAS } from "../data/schemas";
import { focusSchema, isResumable, last, retained, ticks, tickCount } from "../lib/state";
import { Terms } from "../learn/Rich";

/** Accueil : où j'en étais, quoi ensuite, et que faire si ça ne va pas. */
export default function Home() {
  const st = lessonState.use();
  quizState.use();
  const t = ticks.use();
  const kept = retained.use();
  const focus = focusSchema.use();
  const lastV = last.use();
  const next = nextToDo(st);
  const done = LESSONS.filter((l) => st[l.id]?.done).length;
  const due = done > 0 ? dueToday(3, st) : [];
  const ticked = SCHEMAS.filter((s) => tickCount(t[s.slug]) > 0).length;
  const focusS = SCHEMAS.find((s) => s.slug === focus);
  const pos = next ? st[next.id]?.pos ?? 0 : 0;
  const resumeOther = lastV && isResumable(lastV.path) && !lastV.path.startsWith("/apprendre/") && Date.now() - lastV.at < 1000 * 60 * 60 * 24 * 14;

  return (
    <Page title="">
      <div className="wrap page-pad home">
        <div className="home-cols">
        <div className="home-main">
        <header className="home-hero">
          <HandInHand className="home-art" />
          <h1>Comprendre ses schémas</h1>
          <Terms><p className="lead">Des leçons de quelques minutes pour comprendre ses façons de réagir, à son rythme. D’après la thérapie des schémas de Jeffrey Young.</p></Terms>
        </header>

        {next ? (
          <section className="next-lesson" aria-labelledby="nl-h">
            <p className="next-kicker">{done === 0 ? "Pour commencer" : pos > 0 ? "Je reprends où j’en étais" : "Ma prochaine leçon"}</p>
            <h2 id="nl-h">{next.title}</h2>
            <p>{next.short}</p>
            <p className="next-meta"><Icon name="clock" size={16} />{next.minutes} minutes. Leçon {lessonIndex(next.id) + 1} sur {LESSONS.length}, dans « {chapterOf(next).title} ».</p>
            <div className="meter" role="img" aria-label={`${done} leçons terminées sur ${LESSONS.length}`}><i style={{ width: `${(done / LESSONS.length) * 100}%` }} /></div>
            <div className="row">
              <Link to={`/apprendre/${next.id}`} className="btn btn-primary btn-lg"><span>{pos > 0 ? "Reprendre" : done === 0 ? "Commencer" : "Continuer"}</span><Icon name="arrowRight" size={22} /></Link>
              <Link to="/apprendre" className="btn btn-ghost"><Icon name="route" size={20} /><span>Mon parcours</span></Link>
            </div>
          </section>
        ) : (
          <section className="next-lesson" aria-labelledby="nl-h">
            <p className="next-kicker">Parcours terminé</p>
            <h2 id="nl-h">J’ai fait les {LESSONS.length} leçons</h2>
            <p>Je peux les revoir quand je veux, et avancer sur un schéma à la fois.</p>
            <div className="row"><Link to="/schemas" className="btn btn-primary btn-lg"><span>Mes schémas</span><Icon name="arrowRight" size={22} /></Link></div>
          </section>
        )}

        {done > 0 && (
          <Link to="/rappel" className={`act-card ${due.length ? "tone-brand" : ""}`}>
            <span className="act-ic"><Icon name="star" size={26} /></span>
            <span className="act-t">
              <b>Mon rappel du jour</b>
              <span>{due.length ? `${due.length} question${due.length > 1 ? "s" : ""} pour retenir ce que j’ai vu. Une minute.` : "Tout est à jour pour aujourd’hui."}</span>
            </span>
            <Icon name="arrowRight" size={24} className="act-go" />
          </Link>
        )}

        {resumeOther && lastV && (
          <Link to={lastV.path} className="act-card">
            <span className="act-ic"><Icon name="replay" size={26} /></span>
            <span className="act-t"><b>Reprendre</b><span>{lastV.title || "Là où j’en étais"}</span></span>
            <Icon name="arrowRight" size={24} className="act-go" />
          </Link>
        )}

        </div>
        <div className="home-side">
        <section className="sos-card" aria-labelledby="sos-h">
          <h2 id="sos-h"><Icon name="heart" size={22} /> Ça ne va pas ?</h2>
          <div className="row">
            <Link to="/outils/pause" className="btn btn-soft"><Icon name="wind" size={20} /><span>La pause en trois temps</span></Link>
            <Link to="/aide" className="btn btn-care"><Icon name="phone" size={20} /><span>Numéros d’aide</span></Link>
          </div>
        </section>

        <h2 className="h-sec">Mes schémas</h2>
        {focusS ? (
          <Link to={`/schemas/${focusS.slug}`} className={`act-card tone-b${focusS.base}`}>
            <span className="act-ic"><Icon name="flag" size={26} /></span>
            <span className="act-t"><b>Je commence par « {focusS.name} »</b><span>{focusS.phrase}</span></span>
            <Icon name="arrowRight" size={24} className="act-go" />
          </Link>
        ) : (
          <Link to={ticked > 0 ? "/trouver/priorites" : "/trouver"} className="act-card">
            <span className="act-ic"><Icon name="check" size={26} /></span>
            <span className="act-t">
              <b>{ticked > 0 ? "Mes priorités" : "Retrouver mes schémas"}</b>
              <span>{ticked > 0 ? `${ticked} schéma${ticked > 1 ? "s" : ""} coché${ticked > 1 ? "s" : ""}. Je garde un à trois schémas${kept.length ? ` (${kept.length} gardé${kept.length > 1 ? "s" : ""})` : ""}.` : "Une fiche à cocher, un schéma par écran. Ni test, ni diagnostic."}</span>
            </span>
            <Icon name="arrowRight" size={24} className="act-go" />
          </Link>
        )}

        <h2 className="h-sec">Mes outils</h2>
        <ul className="tool-grid">
          <li><Link to="/outils/carte-memo" className="tool-tile"><Icon name="copy" size={26} /><b>Ma carte-mémo</b></Link></li>
          <li><Link to="/outils/plan" className="tool-tile"><Icon name="calendar" size={26} /><b>Mon plan de la semaine</b></Link></li>
          <li><Link to="/outils/carnet" className="tool-tile"><Icon name="pencil" size={26} /><b>Mon carnet</b></Link></li>
          <li><Link to="/outils/dire" className="tool-tile"><Icon name="chat" size={26} /><b>Dire ce qui ne va pas</b></Link></li>
        </ul>

        <aside className="home-note">
          <p><Icon name="shield" size={18} /><span>Ce support aide à comprendre : ce n’est ni un diagnostic, ni un soin. <Link to="/apprendre/limites">Ses limites</Link>.</span></p>
          <p><Icon name="lock" size={18} /><span>Gratuit, sans compte. Mes réponses restent sur cet appareil.</span></p>
        </aside>
        </div>
        </div>
      </div>
    </Page>
  );
}
