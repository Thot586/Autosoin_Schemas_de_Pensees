import { Page, Callout } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { CONTENT } from "../data/content";
import { LIENS } from "../data/liens";

const S = CONTENT.p8.soutien;
const L = CONTENT.p8.lectures;
const LINKS: Record<string, { url: string; label: string } | undefined> = {
  "Mon soutien psy": LIENS.monSoutienPsy,
  "Un thérapeute formé aux schémas": LIENS.annuaire,
};

/** « Où trouver un soutien » (diapo 90) et « Pour aller plus loin » (diapo 93). */
export default function Soutien() {
  return (
    <Page title="Où trouver un soutien">
      <div className="wrap-narrow page-pad">
        <Link to="/aide" className="back"><Icon name="arrowLeft" size={18} /> Besoin d’aide ?</Link>
        <h1>Où trouver un soutien</h1>
        <p className="lead">{S.chapeau}</p>
        <Callout tone="alert" title="En danger, ou des pensées de me faire du mal">{S.danger.replace(/^Si je me sens en danger ou si j’ai des pensées de me faire du mal\s?:\s?/, "")} <Link to="/aide">Numéros d’aide</Link>.</Callout>

        <ul className="doors">
          {S.portes.map((p) => {
            const l = LINKS[p.titre];
            return (
              <li key={p.titre} className="door">
                <h2>{p.titre}</h2>
                <p>{p.texte}</p>
                {l && <a href={l.url} target="_blank" rel="noopener noreferrer" className="btn btn-soft btn-sm"><Icon name="external" size={18} /><span>{l.label}<span className="sr-only"> (nouvel onglet)</span></span></a>}
              </li>
            );
          })}
        </ul>

        <p><Link to="/therapie" className="btn btn-ghost"><Icon name="book" size={20} /><span>La thérapie des schémas, en détail</span></Link></p>

        <h2 className="h-sec" id="lectures">Pour aller plus loin</h2>
        <ul className="books">
          {L.livres.map((b) => (
            <li key={b.titre}>
              <p className="book-t">{b.titre}</p>
              <p className="small">{[b.auteurs, b.editeur].filter(Boolean).join(", ")}</p>
              <p className="small muted">{b.note}</p>
            </li>
          ))}
        </ul>
        <p className="small muted">{L.invite}</p>
      </div>
    </Page>
  );
}
