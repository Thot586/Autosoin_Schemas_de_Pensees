import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { CONTENT } from "../data/content";
import { Numeros } from "../learn/Widgets";
import { ressources, type Ressource } from "../lib/state";
import { Cite } from "../components/Cite";

const A = CONTENT.p8.aide;

const PEOPLE: { id: string; label: string }[] = [
  { id: "medecin", label: "Mon médecin traitant" },
  { id: "therapeute", label: "Mon thérapeute ou mon service de soins" },
  { id: "confiance", label: "Une personne de confiance" },
  { id: "local", label: "Numéro d’urgence local (hors de France)" },
];

/** « Besoin d'aide ? » : accessible depuis chaque écran. L'essentiel en premier : appeler. */
export default function Aide() {
  const res = ressources.use();
  const set = (id: string, patch: Partial<Ressource>) => ressources.set((r) => ({ ...r, [id]: { ...(r[id] ?? { nom: "", tel: "" }), ...patch } }));
  return (
    <Page title="Besoin d’aide ?">
      <div className="wrap-narrow page-pad">
        <h1>Besoin d’aide ?</h1>

        <section className="sos" aria-labelledby="sos-urgence">
          <h2 id="sos-urgence">En danger, ou des pensées de me faire du mal : j’appelle maintenant.</h2>
          <Numeros only="urgence" />
          <p className="small">{A.horsFrance} Sur téléphone, je touche le numéro pour appeler.</p>
        </section>

        <h2 className="h-sec">Autres numéros utiles</h2>
        <Numeros only="autres" />

        <h2 className="h-sec">Pour me poser, tout de suite</h2>
        <div className="row">
          <Link to="/outils/pause" className="btn btn-primary"><Icon name="wind" size={20} /><span>La pause en trois temps</span></Link>
        </div>
        <p className="muted small mt">Pieds au sol, trois respirations lentes : j’expire plus longtemps que j’inspire.</p>

        <h2 className="h-sec">{A.chapeau}</h2>
        <ol className="signs">
          {A.signes.map((s, i) => <li key={i}><span className="mini-n">{i + 1}</span><span>{s}</span></li>)}
        </ol>
        <ul className="plain">
          {A.parler.slice(0, 2).map((p) => <li key={p}>{p}</li>)}
          <li>Sans thérapeute pour l’instant : <Link to="/soutien">où trouver un soutien</Link>.</li>
        </ul>
        <p className="quote-line">{A.rappel}</p>

        <h2 className="h-sec">Mes personnes ressources</h2>
        <p className="muted">Je note ici les numéros utiles. Ils restent sur cet appareil.</p>
        <ul className="people">
          {PEOPLE.map((p) => {
            const r = res[p.id] || { nom: "", tel: "" };
            const tel = r.tel.replace(/[^\d+]/g, "");
            return (
              <li key={p.id} className="person">
                <p className="person-l">{p.label}</p>
                <div className="person-f">
                  <label><span className="sr-only">{p.label} : nom</span>
                    <input type="text" value={r.nom} placeholder="Nom" autoComplete="off" onChange={(e) => set(p.id, { nom: e.target.value })} /></label>
                  <label><span className="sr-only">{p.label} : téléphone</span>
                    <input type="tel" value={r.tel} placeholder="Téléphone" autoComplete="off" inputMode="tel" onChange={(e) => set(p.id, { tel: e.target.value })} /></label>
                  {tel.length >= 3 && <a href={`tel:${tel}`} className="btn btn-soft btn-sm"><Icon name="phone" size={18} /><span>Appeler</span></a>}
                </div>
              </li>
            );
          })}
        </ul>

        <h2 className="h-sec">Trouver un soutien</h2>
        <Link to="/soutien" className="act-card">
          <span className="act-ic"><Icon name="users" size={26} /></span>
          <span className="act-t"><b>Où trouver un soutien</b><span>Médecin traitant, Mon soutien psy, thérapeute formé aux schémas, proche ou groupe.</span></span>
          <Icon name="arrowRight" size={24} className="act-go" />
        </Link>
        <div className="row mt"><a className="btn btn-ghost" href={`${__BASE__}documents/quand-demander-de-l-aide.pdf`} download><Icon name="download" size={20} /><span>Télécharger la fiche « Quand demander de l’aide » (PDF)</span></a></div>
        {/* tout en bas, discret : d’où viennent les numéros (rien de surligné sur cette page) */}
        <p className="small muted mt">Numéros vérifiés sur les sites officiels <Cite ids={["n3114", "n114", "n3919", "masecurite-numeros", "servicepublic-urgences"]} />.</p>
      </div>
    </Page>
  );
}
