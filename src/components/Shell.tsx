import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "../lib/router";
import { Icon, BrandMark } from "./Icon";
import { Sheet } from "./Sheet";
import { Settings } from "./Settings";
import { NAV, TABS, type NavGroup } from "../nav";
import { PARTS } from "../data/parts";
import { BASES } from "../data/bases";
import { SCHEMAS } from "../data/schemas";
import { usePartStatus } from "./ui";
import { prefs } from "../lib/state";
import { GlossaryProvider } from "./Glossary";
import { META } from "../data/meta";

function isActive(g: NavGroup, path: string): boolean {
  if (g.to && (path === g.to || path.startsWith(g.to + "/"))) return true;
  return !!g.leaves?.some((l) => path === l.to.split("#")[0]);
}

function Dropdown({ g }: { g: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const { path } = useLocation();
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: Event) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("pointerdown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const active = isActive(g, path);
  const pid = `dd-${g.id}`;
  return (
    <div className={`nav-item ${g.mega ? "mega-item" : ""}`} ref={ref}
      onPointerEnter={(e) => { if (e.pointerType === "mouse") { window.clearTimeout(timer.current); setOpen(true); } }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") { timer.current = window.setTimeout(() => setOpen(false), 160); } }}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <button ref={btn} type="button" className={`nav-btn ${active ? "is-active" : ""}`} aria-expanded={open} aria-controls={pid} onClick={() => setOpen((o) => !o)}>
        {g.label}<Icon name="chevronDown" size={16} className="nav-caret" />
      </button>
      <div id={pid} className={`nav-panel ${g.mega ? "nav-mega" : ""}`} hidden={!open}>
        {g.mega ? (
          <div className="mega-grid">
            {g.mega.map((col) => (
              <div key={col.base} className={`mega-col tone-b${col.base}`}>
                <p className="mega-t"><span className="mega-dot" />{col.title}</p>
                <ul>{col.leaves.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="nav-list">
            {g.leaves?.map((l) => (
              <li key={l.to}><Link to={l.to}><span>{l.label}</span>{l.hint && <small>{l.hint}</small>}</Link></li>
            ))}
          </ul>
        )}
        {g.to && <Link to={g.to} className="nav-all">Tout voir <Icon name="arrowRight" size={16} /></Link>}
      </div>
    </div>
  );
}

function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const done = usePartStatus();
  const { path } = useLocation();
  useEffect(() => { if (open) onClose(); /* fermer à la navigation */ // eslint-disable-next-line
  }, [path]);
  return (
    <Sheet open={open} onClose={onClose} label="Menu" side="right" className="menu-sheet">
      <div className="menu">
        <p className="eyebrow">Mon parcours</p>
        <ol className="menu-parts">
          {PARTS.map((p, i) => (
            <li key={p.n}>
              <NavLink to={p.path} className="menu-part">
                <span className={`menu-n ${done[i] ? "is-done" : ""}`}>{done[i] ? <Icon name="check" size={14} /> : p.n}</span>
                <span><b>{p.title}</b><small>{p.short}</small></span>
              </NavLink>
            </li>
          ))}
        </ol>
        <p className="eyebrow">Mes 15 schémas</p>
        <div className="menu-bases">
          {BASES.map((b) => (
            <details key={b.id} className={`tone-b${b.id}`}>
              <summary><span className="mega-dot" />{b.name}</summary>
              <ul>{SCHEMAS.filter((s) => s.base === b.id).map((s) => <li key={s.slug}><Link to={`/schemas/${s.slug}`}>{s.name}</Link></li>)}</ul>
            </details>
          ))}
        </div>
        <ul className="menu-links">
          <li><Link to="/mon-espace"><Icon name="user" size={18} /> Mon espace</Link></li>
          <li><Link to="/commencer"><Icon name="flag" size={18} /> Par où commencer ?</Link></li>
          <li><Link to="/glossaire"><Icon name="book" size={18} /> Glossaire</Link></li>
          <li><Link to="/a-propos"><Icon name="info" size={18} /> À propos et mentions</Link></li>
        </ul>
        <Settings />
      </div>
    </Sheet>
  );
}

function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Sheet open={open} onClose={onClose} label="Réglages" side="center" className="settings-sheet">
      <Settings />
    </Sheet>
  );
}

function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const f = () => {
      raf = 0;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const v = max > 0 ? Math.min(1, h.scrollTop / max) : 0;
      ref.current?.style.setProperty("--p", String(v));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  return <div className="scrollbar" ref={ref} aria-hidden="true"><i /></div>;
}

function Header() {
  const [menu, setMenu] = useState(false);
  const [sets, setSets] = useState(false);
  const { path } = useLocation();
  return (
    <header className="header">
      <ScrollProgress />
      <div className="header-in wrap-wide">
        <Link to="/" className="brand" aria-label="Comprendre ses schémas, accueil">
          <BrandMark size={30} />
          <span className="brand-t">Comprendre<br className="brand-br" /> ses schémas</span>
        </Link>
        <nav className="nav" aria-label="Navigation principale">
          {NAV.map((g) => <Dropdown key={g.id} g={g} />)}
        </nav>
        <div className="header-end">
          <Link to="/pour-la-suite/aide" className={`help-pill ${path === "/pour-la-suite/aide" ? "is-here" : ""}`} aria-label="Besoin d’aide ? Numéros d’urgence et soutien">
            <Icon name="heart" size={18} /><span className="help-long">Besoin d’aide&nbsp;?</span><span className="help-short">Aide</span>
          </Link>
          <button type="button" className="icon-btn nav-desktop-only" onClick={() => setSets(true)} aria-label="Réglages d’affichage"><Icon name="gear" size={22} /></button>
          <button type="button" className="icon-btn nav-mobile-only" onClick={() => setMenu(true)} aria-label="Ouvrir le menu" aria-haspopup="dialog"><Icon name="menu" size={24} /></button>
        </div>
      </div>
      <MenuSheet open={menu} onClose={() => setMenu(false)} />
      <SettingsSheet open={sets} onClose={() => setSets(false)} />
    </header>
  );
}

function TabBar() {
  const { path } = useLocation();
  return (
    <nav className="tabbar" aria-label="Navigation rapide">
      {TABS.map((t) => {
        const on = t.match(path);
        return (
          <Link key={t.to} to={t.to} className={`tab-item ${on ? "is-on" : ""}`} aria-current={on ? "page" : undefined}>
            <span className="tab-ic"><Icon name={t.icon} size={22} /></span>
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
          <p className="small"><Icon name="lock" size={14} /> <b>Mes réponses restent sur cet appareil.</b> Ce site n’envoie aucune donnée, n’utilise ni compte, ni cookie de suivi, ni statistiques.</p>
          <p className="small muted">Ce support ne remplace pas un suivi avec un professionnel formé. Si ça ne va pas depuis plusieurs semaines : <Link to="/pour-la-suite/aide">quand demander de l’aide</Link>. En urgence : 3114, 15 ou 112.</p>
          {META.statut && <p className="small"><span className="status-tag">{META.statut}</span></p>}
        </div>
        <ul className="footer-links">
          <li><Link to="/commencer">Par où commencer ?</Link></li>
          <li><Link to="/mon-espace">Mon espace</Link></li>
          <li><Link to="/glossaire">Glossaire</Link></li>
          <li><Link to="/a-propos">À propos et mentions</Link></li>
          <li><Link to="/pour-la-suite/aide">Besoin d’aide ?</Link></li>
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
