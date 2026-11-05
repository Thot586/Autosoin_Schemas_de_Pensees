import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { lessonById } from "../learn/lessons";
import { LessonFull } from "../learn/LessonFull";
import { LIENS } from "../data/liens";
import { REFERENCES } from "../data/references";
import { Terms } from "../learn/Rich";

/** « La thérapie des schémas » : la leçon sur une page, les références vérifiées et l'annuaire. */
export default function Therapie() {
  const l = lessonById("therapie")!;
  return (
    <Page title="La thérapie des schémas">
      <div className="wrap-narrow page-pad">
        <Link to="/soutien" className="back"><Icon name="arrowLeft" size={18} /> Où trouver un soutien</Link>
        <h1>La thérapie des schémas</h1>
        <p className="lead">D’où vient cette approche, comment elle se pratique, ce qu’on en sait, et comment trouver un thérapeute formé.</p>
        <p><Link to="/apprendre/therapie" className="btn btn-primary"><Icon name="play" size={18} /><span>La découvrir carte par carte ({l.minutes} minutes)</span></Link></p>

        <LessonFull lesson={l} />

        <Terms><section className="full-card" aria-labelledby="annuaire-h">
          <h2 className="full-h" id="annuaire-h"><Icon name="users" size={22} /> Trouver un thérapeute formé</h2>
          <p>L’annuaire de l’Institut Français de Thérapie des Schémas (IFTS) recense des thérapeutes formés à cette approche, en France, en Belgique, en Suisse et au Maroc ; certains sont aussi certifiés par la société internationale (ISST). Les informations sont données par les thérapeutes eux-mêmes. L’Institut est une association de formation : il ne soigne pas de patients.</p>
          <div className="row">
            <a href={LIENS.annuaire.url} target="_blank" rel="noopener noreferrer" className="btn btn-soft"><Icon name="external" size={20} /><span>{LIENS.annuaire.label}<span className="sr-only"> (nouvel onglet)</span></span></a>
            <a href={LIENS.annuaireIsst.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Icon name="external" size={20} /><span>{LIENS.annuaireIsst.label}<span className="sr-only"> (nouvel onglet)</span></span></a>
          </div>
          <p className="small muted mt">J’en parle d’abord avec mon équipe de soins ou mon médecin traitant. J’apporte ma carte-mémo et mon carnet : ils aident à démarrer.</p>
        </section></Terms>

        <section className="full-card" aria-labelledby="refs-h">
          <h2 className="full-h" id="refs-h"><Icon name="book" size={22} /> Sources</h2>
          <ol className="refs">
            {REFERENCES.map((r) => (
              <li key={r.id}>
                <span>{r.text}</span>
                {r.url && <> <a href={r.url} target="_blank" rel="noopener noreferrer">{r.urlLabel ?? "Lien"}<span className="sr-only"> (nouvel onglet)</span></a></>}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </Page>
  );
}
