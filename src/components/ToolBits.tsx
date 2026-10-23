import type { ReactNode } from "react";
import { Link } from "../lib/router";
import { Icon, type IconName } from "./Icon";

export const TOOLS: { to: string; label: string; short: string; icon: IconName; hint: string }[] = [
  { to: "/outils/carte-memo", label: "Ma carte-mémo", short: "Carte-mémo", icon: "pencil", hint: "Une carte par schéma, six lignes, un seul geste." },
  { to: "/outils/pause", label: "La pause en trois temps", short: "Pause", icon: "wind", hint: "Stop, nommer, choisir : vingt secondes pour retrouver un peu de choix." },
  { to: "/outils/dire", label: "Dire ce qui ne va pas", short: "Dire", icon: "chat", hint: "Même méthode, trois situations, sans attaquer." },
  { to: "/outils/plan", label: "Mon plan pour la semaine", short: "Plan", icon: "calendar", hint: "Un schéma, un geste, un moment. Bilan le dimanche." },
];

export function ToolHead({ title, lead, current, children }: { title: string; lead?: ReactNode; current: string; children?: ReactNode }) {
  return (
    <header className="parthero tone-brand subhero">
      <div className="wrap">
        <nav aria-label="Fil d’Ariane" className="crumbs"><Link to="/outils">Mes outils</Link><Icon name="chevronRight" size={14} /><span aria-current="page">{title}</span></nav>
        <p className="eyebrow">Partie 6 · Mes outils</p>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
        <nav className="toolnav" aria-label="Les quatre outils">
          {TOOLS.map((t) => <Link key={t.to} to={t.to} aria-current={t.to === current ? "page" : undefined}><Icon name={t.icon} size={16} />{t.short}</Link>)}
        </nav>
      </div>
    </header>
  );
}
