import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { lessonById } from "../learn/lessons";
import { LessonFull } from "../learn/LessonFull";
import { LIENS } from "../data/liens";
import { REFERENCES } from "../data/references";

/** « La thérapie des schémas » : la leçon sur une page, les références vérifiées et l'annuaire. */
export default function Therapie() {
  const l = lessonById("therapie")!;
  return (
    <Page title="La thérapie des schémas">
      <div className="wrap-narrow page-pad">
        <Link to="/soutien" className="back"><Icon name="arrowLeft" size={18} /> Où trouver un soutien</Link>
        <h1>La thérapie des schémas</h1>
        <p className="lead">D’où vient cette approche, comment elle se pratique, ce qu’on en sait, et comment trouver un thérapeute formé.</p>
        <p><Link to="/apprendre/therapie" className="btn btn-primary"><Icon name="play" size={18} /><span>La découvrir carte par carte (4 minutes)</span></Link></p>

        <LessonFull lesson={l} />

        <section className="full-card" aria-labelledby="annuaire-h">
          <h2 className="full-h" id="annuaire-h"><Icon name="users" size={22} /> Trouver un thérapeute formé</h2>
          <p>Un annuaire permet de trouver un thérapeute formé à la thérapie des schémas. Mon médecin traitant peut aussi m’orienter.</p>
          <p><a href={LIENS.annuaire.url} target="_blank" rel="noopener noreferrer" className="btn btn-soft"><Icon name="external" size={20} /><span>{LIENS.annuaire.label}<span className="sr-only"> (nouvel onglet)</span></span></a></p>
          <p className="small muted">J’apporte ma carte-mémo et mon carnet : ils aident à démarrer.</p>
        </section>

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
