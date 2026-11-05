import { Page } from "../components/ui";
import { Icon, type IconName } from "../components/Icon";
import { Link } from "../lib/router";

const TOOLS: { to: string; icon: IconName; title: string; when: string }[] = [
  { to: "/outils/pause", icon: "wind", title: "La pause en trois temps", when: "Quand une émotion monte : stop, nommer, choisir. Vingt secondes." },
  { to: "/outils/carte-memo", icon: "copy", title: "Ma carte-mémo", when: "Une carte par schéma : la petite voix, le besoin, un geste, ma phrase." },
  { to: "/outils/plan", icon: "calendar", title: "Mon plan de la semaine", when: "Le dimanche soir : un schéma, un geste, un moment." },
  { to: "/outils/carnet", icon: "pencil", title: "Mon carnet", when: "Une fois par jour : une situation où l’émotion a semblé trop forte." },
  { to: "/outils/dire", icon: "chat", title: "Dire ce qui ne va pas", when: "Préparer par écrit ce que je veux dire, sans attaquer." },
];

const DOCS: { file: string; title: string; kind: string }[] = [
  { file: "retrouver-mes-schemas-fiche-a-cocher.pdf", title: "Retrouver mes schémas (fiche à cocher)", kind: "PDF, 6 pages" },
  { file: "quand-demander-de-l-aide.pdf", title: "Quand demander de l’aide", kind: "PDF, 1 page" },
  { file: "dire-ce-qui-ne-va-pas.pdf", title: "Dire ce qui ne va pas (à remplir)", kind: "PDF, 1 page" },
  { file: "carnet-de-schemas.docx", title: "Mon carnet de schémas (à remplir)", kind: "Word" },
  { file: "plan-de-la-semaine.docx", title: "Mon plan pour la semaine (à remplir)", kind: "Word" },
];

export default function Outils() {
  return (
    <Page title="Mes outils">
      <div className="wrap-narrow page-pad">
        <h1>Mes outils</h1>
        <p className="lead">Pour passer à l’action, un petit pas à la fois. Ce que j’écris reste sur cet appareil.</p>
        <ul className="tools">
          {TOOLS.map((t) => (
            <li key={t.to}>
              <Link to={t.to} className="act-card">
                <span className="act-ic"><Icon name={t.icon} size={26} /></span>
                <span className="act-t"><b>{t.title}</b><span>{t.when}</span></span>
                <Icon name="arrowRight" size={24} className="act-go" />
              </Link>
            </li>
          ))}
        </ul>

        <h2 className="h-sec">Mon espace</h2>
        <Link to="/mon-espace" className="act-card">
          <span className="act-ic"><Icon name="user" size={26} /></span>
          <span className="act-t"><b>Tout ce que j’ai noté</b><span>Pour relire, imprimer pour mon thérapeute, sauvegarder dans un fichier ou tout effacer.</span></span>
          <Icon name="arrowRight" size={24} className="act-go" />
        </Link>

        <h2 className="h-sec" id="documents">Versions à imprimer</h2>
        <p className="muted">Les mêmes outils sur papier, pour écrire à la main ou les apporter en séance.</p>
        <ul className="docs">
          {DOCS.map((d) => (
            <li key={d.file}>
              <a href={`${__BASE__}documents/${d.file}`} download className="doc">
                <Icon name="download" size={22} />
                <span><b>{d.title}</b><small>{d.kind}</small></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  );
}
