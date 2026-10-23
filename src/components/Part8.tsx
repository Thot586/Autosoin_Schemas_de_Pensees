import type { ReactNode } from "react";
import { Link } from "../lib/router";
import { Icon, type IconName } from "./Icon";

export const SUITE: { to: string; label: string; short: string; icon: IconName; hint: string }[] = [
  { to: "/pour-la-suite/aide", label: "Quand demander de l’aide", short: "Aide", icon: "phone", hint: "Les signes, les numéros, qui appeler." },
  { to: "/pour-la-suite/soutien", label: "Où trouver un soutien", short: "Soutien", icon: "users", hint: "Médecin, Mon soutien psy, thérapeute, proche sûr." },
  { to: "/pour-la-suite/carnet", label: "Mon carnet de schémas", short: "Carnet", icon: "pencil", hint: "Une situation par jour, pour repérer et non pour se juger." },
  { to: "/pour-la-suite/lectures", label: "Pour aller plus loin", short: "Lectures", icon: "book", hint: "Des livres, un annuaire de thérapeutes." },
];

export function SuiteHead({ title, lead, current, tone = "brand", children }: { title: string; lead?: ReactNode; current: string; tone?: string; children?: ReactNode }) {
  return (
    <header className={`parthero tone-${tone} subhero`}>
      <div className="wrap">
        <nav aria-label="Fil d’Ariane" className="crumbs"><Link to="/pour-la-suite">Pour la suite</Link><Icon name="chevronRight" size={14} /><span aria-current="page">{title}</span></nav>
        <p className="eyebrow">Partie 8 · Pour la suite</p>
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children}
        <nav className="toolnav" aria-label="Pour la suite">
          {SUITE.map((t) => <Link key={t.to} to={t.to} aria-current={t.to === current ? "page" : undefined}><Icon name={t.icon} size={16} />{t.short}</Link>)}
        </nav>
      </div>
    </header>
  );
}
