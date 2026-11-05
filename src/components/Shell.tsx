import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "../lib/router";
import { Icon, BrandMark } from "./Icon";
import { Sheet } from "./Sheet";
import { Settings } from "./Settings";
import { MENU, TABS } from "../nav";
import { prefs } from "../lib/state";
import { GlossaryProvider } from "./Glossary";
import { META } from "../data/meta";

function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { path } = useLocation();
  useEffect(() => { if (open) onClose(); /* fermer à la navigation */ // eslint-disable-next-line
  }, [path]);
  return (
    <Sheet open={open} onClose={onClose} label="Menu" side="right" className="menu-sheet">
      <nav className="menu" aria-label="Menu">
        <ul className="menu-links">
          {MENU.map((m) => <li key={m.to}><Link to={m.to} aria-current={path === m.to ? "page" : undefined}><Icon name={m.icon} size={22} /><span>{m.label}</span></Link></li>)}
        </ul>
        <Settings />
      </nav>
    </Sheet>
  );
}

function Header() {
  const [menu, setMenu] = useState(false);
  const { path } = useLocation();
  return (
    <header className="header">
      <div className="header-in wrap-wide">
        <Link to="/" className="brand" aria-label="Comprendre ses schémas, accueil">
          <BrandMark size={30} />
          <span className="brand-t">Comprendre ses schémas</span>
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          {TABS.map((t) => {
            const on = t.match(path);
            return <Link key={t.to} to={t.to} className={`nav-btn ${on ? "is-active" : ""}`} aria-current={on ? "page" : undefined}>{t.label}</Link>;
          })}
        </nav>
        <div className="header-end">
          <Link to="/aide" className={`help-pill ${path === "/aide" ? "is-here" : ""}`} aria-label="Aide : numéros d’urgence et soutien">
            <Icon name="heart" size={18} /><span>Aide</span>
          </Link>
          <button type="button" className="icon-btn" onClick={() => setMenu(true)} aria-label="Menu et réglages" aria-haspopup="dialog"><Icon name="menu" size={24} /></button>
        </div>
      </div>
      <MenuSheet open={menu} onClose={() => setMenu(false)} />
    </header>
  );
}

function TabBar() {
  const { path } = useLocation();
  return (
    <nav className="tabbar" aria-label="Navigation principale">
      {TABS.map((t) => {
        const on = t.match(path);
        return (
          <Link key={t.to} to={t.to} className={`tab-item ${on ? "is-on" : ""}`} aria-current={on ? "page" : undefined}>
            <span className="tab-ic"><Icon name={t.icon} size={24} /></span>
            <span className="tab-l">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap-wide footer-grid">
        <div className="footer-credits">
          <img className="footer-logo" src={`${__BASE__}img/crr-logo.png`} alt="Centre Ressource de Réhabilitation psychosociale (CRR)" width="114" height="65" loading="lazy" />
          <p className="small">{META.credit}</p>
          <p className="small muted">D’après J. Young, J. Klosko et M. Weishaar.</p>
        </div>
        <div className="footer-note">
          <p className="small"><Icon name="lock" size={14} /> Mes réponses restent sur cet appareil. Pas de compte, pas de cookie de suivi, pas de statistiques.</p>
          <p className="small muted">Ce support ne remplace pas un suivi avec un professionnel formé. En urgence : 3114, 15 ou 112.</p>
          {META.statut && <p className="small"><span className="status-tag">{META.statut}</span></p>}
        </div>
        <ul className="footer-links">
          <li><Link to="/aide">Besoin d’aide ?</Link></li>
          <li><Link to="/therapie">La thérapie des schémas</Link></li>
          <li><Link to="/mon-espace">Mon espace</Link></li>
          <li><Link to="/glossaire">Les mots du support</Link></li>
          <li><Link to="/a-propos">À propos, limites et données</Link></li>
        </ul>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  prefs.use();
  return (
    <GlossaryProvider>
      <a href="#contenu" className="skip-link" onClick={(e) => { e.preventDefault(); const m = document.getElementById("contenu"); m?.focus(); m?.scrollIntoView(); }}>Aller au contenu</a>
      <Header />
      <main id="contenu" tabIndex={-1}>{children}</main>
      <Footer />
      <TabBar />
    </GlossaryProvider>
  );
}
