import { useState, type ReactNode } from "react";
import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { CiteText } from "../components/Cite";
import { Link, canGoBack } from "../lib/router";
import { apaAuthors, apaSort, citeYear, NIVEAUX, REFERENCES, THEMES, type Niveau, type Ref } from "../data/references";

const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const dateFr = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return `${d === 1 ? "1er" : d} ${MOIS[m - 1]} ${y}`; };

/** Un lien externe, qui s'ouvre dans un nouvel onglet (comme les autres liens externes du site). */
const Ext = ({ href }: { href: string }) => <a href={href} target="_blank" rel="noopener noreferrer" className="ref-url">{href}<span className="sr-only"> (nouvel onglet)</span></a>;

/** Une référence au format APA 7 (adaptation française). */
function Apa({ r }: { r: Ref }) {
  // la date telle qu'affichée : l'année (avec a, b… si besoin), suivie du jour et du mois pour une page web
  const date = /^\d{4}/.test(r.annee) ? r.annee.replace(/^\d{4}/, citeYear(r)) : citeYear(r);
  const head = <>{apaAuthors(r)} ({date}). </>;
  let body: ReactNode;
  if (r.type === "article") {
    body = <>{r.titre}. <i>{r.revue}</i>{r.volume && <>, <i>{r.volume}</i>{r.numero && `(${r.numero})`}</>}{r.pages && `, ${r.pages}`}. </>;
  } else if (r.type === "site") {
    body = <><i>{r.titre}</i>. {r.consulte && `Consulté le ${dateFr(r.consulte)}, à l’adresse `}</>;
  } else {
    const paren = [r.traduction && `${r.traduction}, trad.`, r.edition].filter(Boolean).join("; ");
    body = <><i>{r.titre}</i>{paren && ` (${paren})`}. {r.editeur && `${r.editeur}. `}</>;
  }
  const link = r.doi ? `https://doi.org/${r.doi}` : r.url;
  return <>{head}{body}{link && <Ext href={link} />}{r.original && ` (Ouvrage original publié en ${r.original})`}</>;
}

function Badge({ n }: { n: Niveau }) {
  return <span className={`ref-badge niv-${n}`}><Icon name={NIVEAUX[n].icon} size={16} />{NIVEAUX[n].label}</span>;
}

function RefItem({ r }: { r: Ref }) {
  return (
    <li id={r.id} tabIndex={-1} className={`ref niv-${r.niveau}`}>
      <Badge n={r.niveau} />
      <p className="ref-apa"><Apa r={r} /></p>
      <p className="ref-apport"><b>Ce qu’on en retient :</b> {r.apport}</p>
      <details className="ref-more">
        <summary>Plus de détail</summary>
        <dl>
          <dt>Type d’étude</dt><dd>{r.design}</dd>
          {r.grade && <><dt>GRADE</dt><dd>{r.grade}</dd></>}
          {r.correction && <><dt>Correction publiée</dt><dd>{r.correction}</dd></>}
        </dl>
      </details>
    </li>
  );
}

/** « Références » : toutes les sources, avec leur fiabilité. On y arrive en cliquant sur une citation ; un bouton ramène à la page d'avant. */
export default function References() {
  const [back] = useState(canGoBack);
  return (
    <Page title="Références">
      <div className="wrap-narrow page-pad">
        {back
          ? <button type="button" className="back back-btn" onClick={() => history.back()}><Icon name="arrowLeft" size={18} /> Revenir à ma page</button>
          : <Link to="/" className="back"><Icon name="arrowLeft" size={18} /> Accueil</Link>}
        <h1>Références</h1>
        <p className="lead">Les sources de ce support. La couleur dit à quel point chacune est solide.</p>

        <section className="ref-legend" aria-labelledby="leg-h">
          <h2 id="leg-h" className="h-sec">Lire les couleurs</h2>
          <ul className="ref-levels">
            {(Object.keys(NIVEAUX) as Niveau[]).map((n) => (
              <li key={n}><Badge n={n} /><span>{NIVEAUX[n].detail}</span></li>
            ))}
          </ul>
          <details className="ref-more">
            <summary>Comment les couleurs sont choisies</summary>
            <p><CiteText text="La couleur suit le type d’étude, selon l’échelle des niveaux de preuve de la Haute Autorité de Santé [@has2013]. Une expérience de laboratoire chez des volontaires est classée à part : elle éclaire un mécanisme, sans montrer d’effet chez des patients." /></p>
            <p><CiteText text="Quand les auteurs d’une revue ont évalué la certitude de leurs résultats avec la méthode GRADE (élevée, modérée, faible ou très faible), leur conclusion est indiquée sur la fiche [@guyatt2008]." /></p>
          </details>
        </section>

        {THEMES.map((t) => {
          const list = REFERENCES.filter((r) => r.theme === t.id).sort(apaSort);
          if (!list.length) return null;
          return (
            <section key={t.id} id={`theme-${t.id}`} aria-labelledby={`th-${t.id}`} className="ref-theme">
              <h2 id={`th-${t.id}`} className="h-sec">{t.titre} <span className="h-count">{list.length}</span></h2>
              <p className="muted">{t.intro}</p>
              <ol className="ref-list">{list.map((r) => <RefItem key={r.id} r={r} />)}</ol>
            </section>
          );
        })}
      </div>
    </Page>
  );
}
