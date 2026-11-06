import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { Link, useLocation } from "../lib/router";
import { useDocTitle } from "../lib/hooks";
import { last, markVisited, notes, prefs } from "../lib/state";
import { useGlossary } from "./Glossary";
import { termById } from "../data/glossaire";
import { CiteText } from "./Cite";

/* ───────── Page ───────── */
const UTILITY = new Set(["/mon-espace", "/glossaire", "/references", "/a-propos", "/commencer"]);
export function Page({ title, tone, children, className = "" }: { title: string; tone?: string; children: ReactNode; className?: string }) {
  const { path } = useLocation();
  useDocTitle(title);
  useEffect(() => {
    if (UTILITY.has(path) || title === "Page introuvable") return;   // pages d’appui : on ne s’y « arrête » pas
    markVisited(path);
    last.set({ path, title, at: Date.now() });
  }, [path, title]);
  return <div className={`page ${tone ? "tone-" + tone : ""} ${className}`}>{children}</div>;
}

/* ───────── Bloc simple (anciennement « apparition au défilement ») ─────────
   Le contenu s'affiche tout de suite : pas de mouvement non demandé, plus reposant pour l'attention. */
export function Reveal({ as, className = "", children, style }: { as?: ElementType; delay?: number; className?: string; children: ReactNode; style?: CSSProperties }) {
  const Tag = (as || "div") as ElementType;
  return <Tag className={className || undefined} style={style}>{children}</Tag>;
}

/* ───────── Titres ───────── */
export function Section({ id, eyebrow, title, lead, children, className = "", tone }: { id?: string; eyebrow?: string; title?: ReactNode; lead?: ReactNode; children?: ReactNode; className?: string; tone?: string }) {
  return (
    <section id={id} tabIndex={id ? -1 : undefined} className={`section ${tone ? "tone-" + tone : ""} ${className}`}>
      <div className="wrap">
        {(eyebrow || title || lead) && (
          <Reveal className="section-head">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {lead && <p className="lead">{lead}</p>}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}

/* ───────── Boutons et liens ───────── */
export function Button({ to, onClick, children, variant = "primary", icon, iconRight, type = "button", disabled, className = "", ...rest }: {
  to?: string; onClick?: () => void; children: ReactNode; variant?: "primary" | "soft" | "ghost" | "danger"; icon?: IconName; iconRight?: IconName;
  type?: "button" | "submit"; disabled?: boolean; className?: string; "aria-label"?: string; "aria-pressed"?: boolean; "aria-expanded"?: boolean; title?: string;
}) {
  const cn = `btn btn-${variant} ${className}`;
  const inner = <>{icon && <Icon name={icon} size={20} />}<span>{children}</span>{iconRight && <Icon name={iconRight} size={20} />}</>;
  if (to) return <Link to={to} className={cn} {...rest}>{inner}</Link>;
  return <button type={type} className={cn} onClick={onClick} disabled={disabled} {...rest}>{inner}</button>;
}

/* ───────── Cartes ───────── */
export function Card({ children, tone, className = "", as, style }: { children: ReactNode; tone?: string; className?: string; as?: ElementType; style?: CSSProperties }) {
  const Tag = (as || "div") as ElementType;
  return <Tag className={`card ${tone ? "tone-" + tone : ""} ${className}`} style={style}>{children}</Tag>;
}

export function Callout({ tone = "info", title, icon, children, className = "" }: { tone?: "info" | "care" | "alert" | "ok"; title?: ReactNode; icon?: IconName; children: ReactNode; className?: string }) {
  const ic: IconName = icon || (tone === "alert" ? "phone" : tone === "care" ? "heart" : tone === "ok" ? "check" : "info");
  return (
    <aside className={`callout callout-${tone} ${className}`} role={tone === "alert" ? "note" : undefined}>
      <Icon name={ic} size={22} className="callout-ic" />
      <div>{title && <p className="callout-t">{title}</p>}<div className="callout-b">{children}</div></div>
    </aside>
  );
}

export function Pill({ children, tone, className = "" }: { children: ReactNode; tone?: string; className?: string }) {
  return <span className={`pill ${tone ? "tone-" + tone : ""} ${className}`}>{children}</span>;
}

export function Quote({ children, cite, tone, className = "" }: { children: ReactNode; cite?: string; tone?: string; className?: string }) {
  return (
    <blockquote className={`bubble ${tone ? "tone-" + tone : ""} ${className}`}>
      <p className="quote">{children}</p>
      {cite && <footer>{cite}</footer>}
    </blockquote>
  );
}

/* ───────── Mode accompagnant(e) ───────── */
export function Pro({ children, title = "Repère pour l’accompagnant(e)" }: { children: ReactNode; title?: string }) {
  const p = prefs.use();
  if (!p.pro) return null;
  return (
    <details className="pro">
      <summary><Icon name="users" size={18} /> {title}</summary>
      <div className="pro-body">{typeof children === "string" ? <CiteText text={children} /> : children}</div>
    </details>
  );
}

/* ───────── Petit exercice, réponse gardée sur l'appareil ───────── */
export function Invite({ id, title = "À faire maintenant", prompt, hint, placeholder = "Mes mots, rien que pour moi…" }: { id: string; title?: string; prompt: ReactNode; hint?: ReactNode; placeholder?: string }) {
  const all = notes.use();
  const value = all[id] || "";
  const [saved, setSaved] = useState(false);
  const tid = useId();
  const t = useRef<number | undefined>(undefined);
  return (
    <aside className="invite" aria-labelledby={tid + "-t"}>
      <p className="invite-t" id={tid + "-t"}><Icon name="pencil" size={18} /> {title}</p>
      <p className="invite-q">{prompt}</p>
      {hint && <p className="small muted">{hint}</p>}
      <label className="sr-only" htmlFor={tid}>Ma réponse</label>
      <textarea id={tid} rows={3} value={value} placeholder={placeholder}
        onChange={(e) => {
          const v = e.target.value;
          notes.set((n) => ({ ...n, [id]: v }));
          setSaved(true);
          window.clearTimeout(t.current);
          t.current = window.setTimeout(() => setSaved(false), 1600);
        }} />
      <p className="invite-foot small" aria-live="polite"><Icon name="lock" size={14} /> {saved ? "Enregistré sur cet appareil" : "Reste sur cet appareil, personne ne la lit."}</p>
    </aside>
  );
}

/* ───────── Terme du glossaire ───────── */
export function Term({ id, children }: { id: string; children: ReactNode }) {
  const g = useGlossary();
  const e = termById(id);
  const tipId = useId();
  const wrap = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [hover, setHover] = useState(false);  // souris posée sur le mot (après un court délai)
  const [focus, setFocus] = useState(false);  // mot atteint au clavier
  const [below, setBelow] = useState(false);
  const open = (hover || focus) && !!e;
  const clear = () => window.clearTimeout(timer.current);
  useEffect(() => clear, []);

  // L'infobulle n'existe à l'écran que si elle est ouverte (cachée, elle ne prend aucune place : pas de débordement).
  // Ouverte, on la garde dans l'écran : décalée près des bords, posée sous le mot s'il n'y a pas la place au-dessus.
  useLayoutEffect(() => {
    const w = wrap.current, tip = w?.querySelector<HTMLElement>(".term-tip");
    if (!open || !w || !tip) return;
    const place = () => {
      tip.style.setProperty("--shift", "0px");
      const r = tip.getBoundingClientRect(), t = w.getBoundingClientRect();
      const zoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--zoom")) || 1;
      const s = r.left < 8 ? 8 - r.left : r.right > window.innerWidth - 8 ? window.innerWidth - 8 - r.right : 0;
      tip.style.setProperty("--shift", `${Math.round(s / zoom)}px`);
      const top = Math.max(0, ...Array.from(document.querySelectorAll(".header, .lesson-top"), (b) => b.getBoundingClientRect().bottom));
      setBelow(t.top - r.height - 14 < top && window.innerHeight - t.bottom > t.top - top);
    };
    place();
    // la carte peut encore glisser (animation d'entrée) : on se recale quand elle a fini
    const again = window.setTimeout(place, 400);
    return () => window.clearTimeout(again);
  }, [open]);

  // Échap masque l'infobulle sans bouger la souris ni le focus (WCAG 1.4.13).
  useEffect(() => {
    if (!open) return;
    const onKey = (ev: KeyboardEvent) => { if (ev.key === "Escape") { clear(); setHover(false); setFocus(false); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const enter = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;  // au toucher : pas d'infobulle, le clic ouvre le détail
    clear(); timer.current = window.setTimeout(() => setHover(true), 300);
  };
  const leave = () => { clear(); timer.current = window.setTimeout(() => setHover(false), 120); };
  const keyFocus = (el: HTMLElement) => { try { return el.matches(":focus-visible"); } catch { return true; } };
  const detail = () => { clear(); setHover(false); setFocus(false); g.open(id); };
  return (
    <span className={`term-w${open ? " is-open" : ""}${below ? " is-below" : ""}`} ref={wrap} onMouseEnter={enter} onMouseLeave={leave}>
      <button type="button" className="term" onClick={detail} onFocus={(ev) => setFocus(keyFocus(ev.currentTarget))} onBlur={() => setFocus(false)}
        aria-haspopup="dialog" aria-describedby={e ? tipId : undefined}>{children}</button>
      {e && <span id={tipId} role="tooltip" className="term-tip" onClick={detail}>{e.short}<span className="term-tip-more">Cliquer pour en savoir plus</span></span>}
    </span>
  );
}

/* ───────── Étape suivante ───────── */
export function NextUp({ to, label, hint, eyebrow = "Étape suivante", tone }: { to: string; label: ReactNode; hint?: ReactNode; eyebrow?: string; tone?: string }) {
  return (
    <Reveal>
      <Link to={to} className={`nextup ${tone ? "tone-" + tone : ""}`}>
        <span>
          <span className="eyebrow">{eyebrow}</span>
          <span className="nextup-t">{label}</span>
          {hint && <span className="nextup-h">{hint}</span>}
        </span>
        <Icon name="arrowRight" size={26} />
      </Link>
    </Reveal>
  );
}

/* ───────── Onglets accessibles ───────── */
export function Tabs<T extends string>({ idBase, tabs, value, onChange, label, className = "" }: { idBase: string; tabs: { id: T; label: ReactNode; tone?: string }[]; value: T; onChange: (v: T) => void; label: string; className?: string }) {
  const id = idBase;
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const move = (i: number) => { const t = tabs[(i + tabs.length) % tabs.length]; onChange(t.id); refs.current[t.id]?.focus(); };
  return (
    <div role="tablist" aria-label={label} className={`tabs ${className}`}>
      {tabs.map((t, i) => (
        <button key={t.id} role="tab" type="button" id={`${id}-${t.id}`} aria-selected={t.id === value} aria-controls={`${id}-panel`} tabIndex={t.id === value ? 0 : -1}
          ref={(el) => { refs.current[t.id] = el; }}
          className={`tab ${t.tone ? "tone-" + t.tone : ""}`} onClick={() => onChange(t.id)}
          onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); move(i + 1); } else if (e.key === "ArrowLeft") { e.preventDefault(); move(i - 1); } else if (e.key === "Home") { e.preventDefault(); move(0); } else if (e.key === "End") { e.preventDefault(); move(tabs.length - 1); } }}>
          {t.label}
        </button>
      ))}
    </div>
  );
}
export const tabPanelProps = (idBase: string, active: string) => ({ role: "tabpanel" as const, id: `${idBase}-panel`, "aria-labelledby": `${idBase}-${active}`, tabIndex: 0 });

/* ───────── Choix unique (boutons radio stylés) ───────── */
export function Choice<T extends string>({ label, options, value, onChange, className = "" }: { label: string; options: { id: T; label: ReactNode }[]; value: T | ""; onChange: (v: T) => void; className?: string }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const idx = Math.max(0, options.findIndex((o) => o.id === value));
  const move = (i: number) => { const o = options[(i + options.length) % options.length]; onChange(o.id); refs.current[o.id]?.focus(); };
  return (
    <div role="radiogroup" aria-label={label} className={`choice ${className}`}>
      {options.map((o, i) => (
        <button key={o.id} type="button" role="radio" aria-checked={o.id === value} tabIndex={o.id === value || (value === "" && i === idx) ? 0 : -1}
          ref={(el) => { refs.current[o.id] = el; }} className="choice-o" onClick={() => onChange(o.id)}
          onKeyDown={(e) => { if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); move(i + 1); } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); move(i - 1); } }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
