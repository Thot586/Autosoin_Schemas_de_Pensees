import { useEffect, useId, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { Link, useLocation } from "../lib/router";
import { useInView, useDocTitle } from "../lib/hooks";
import { last, markVisited, notes, prefs } from "../lib/state";
import { PARTS } from "../data/parts";
import { visited } from "../lib/state";
import { useGlossary } from "./Glossary";

/* ───────── Page ───────── */
const UTILITY = new Set(["/mon-espace", "/glossaire", "/a-propos", "/commencer"]);
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

/* ───────── Apparition au défilement ───────── */
export function Reveal({ as, delay = 0, className = "", children, style }: { as?: ElementType; delay?: number; className?: string; children: ReactNode; style?: CSSProperties }) {
  const Tag = (as || "div") as ElementType;
  const [ref, seen] = useInView<HTMLElement>();
  return <Tag ref={ref} className={`reveal ${seen ? "is-in" : ""} ${className}`} style={{ "--d": `${delay}ms`, ...style } as CSSProperties}>{children}</Tag>;
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

/* ───────── Plan en 8 parties ───────── */
export function usePartStatus(): boolean[] {
  const v = visited.use();
  return PARTS.map((p) => Object.keys(v).some((k) => k === p.path || k.startsWith(p.path + "/")));
}

export function PlanStrip({ current }: { current?: number }) {
  const done = usePartStatus();
  return (
    <nav className="planstrip" aria-label="Plan en huit parties">
      <ol>
        {PARTS.map((p, i) => (
          <li key={p.n} className={`${current === p.n ? "is-current" : ""} ${done[i] ? "is-done" : ""}`}>
            <Link to={p.path} aria-current={current === p.n ? "page" : undefined}>
              <span className="planstrip-n">{done[i] && current !== p.n ? <Icon name="check" size={14} /> : p.n}</span>
              <span className="planstrip-t">{p.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PartHero({ n, title, intro, tone = "brand", children }: { n: number; title: string; intro?: ReactNode; tone?: string; children?: ReactNode }) {
  return (
    <header className={`parthero tone-${tone}`}>
      <div className="wrap">
        <p className="eyebrow">Partie {n} sur 8</p>
        <h1>{title}</h1>
        {intro && <p className="lead">{intro}</p>}
        {children}
        <PlanStrip current={n} />
      </div>
    </header>
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
      <div className="pro-body">{children}</div>
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
  return <button type="button" className="term" onClick={() => g.open(id)} aria-haspopup="dialog">{children}</button>;
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

export function PauseNote() {
  return (
    <Callout tone="care" icon="heart" title="Je peux m’arrêter ici">
      C’est un bon moment pour faire une pause avant de continuer, ou pour s’arrêter ici et reprendre un autre jour.
    </Callout>
  );
}

/* ───────── Anneau de progression ───────── */
export function Ring({ value, size = 64, stroke = 7, label }: { value: number; size?: number; stroke?: number; label?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--edge)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--accent, var(--brand))" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c * (1 - Math.max(0, Math.min(1, value)))} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: "stroke-dashoffset .8s var(--ease)" }} />
    </svg>
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

/* ───────── Pour retenir ───────── */
export function Retain({ items, title = "Pour retenir" }: { items: ReactNode[]; title?: string }) {
  return (
    <Reveal>
      <aside className="retain">
        <p className="retain-t"><Icon name="star" size={18} /> {title}</p>
        <ul>{items.map((t, i) => <li key={i}>{t}</li>)}</ul>
      </aside>
    </Reveal>
  );
}

/* ───────── « Ce que montre l'animation » / « À essayer » ───────── */
export function Explain({ title = "Ce que montre l’animation", children, tone = "brand" }: { title?: string; children: ReactNode; tone?: string }) {
  return (
    <div className={`explain tone-${tone}`}>
      <p className="explain-t"><Icon name="eye" size={18} /> {title}</p>
      <div>{children}</div>
    </div>
  );
}

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

/* ───────── Révélation simple (bouton + réponse) ───────── */
export function Disclose({ question, button = "Voir la réponse", children, className = "" }: { question: ReactNode; button?: string; children: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={`disclose ${open ? "is-open" : ""} ${className}`}>
      <div className="disclose-q">{question}</div>
      <button type="button" className="btn btn-soft btn-sm" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>{open ? "Masquer" : button}</button>
      <div id={id} className="disclose-a" role="region" hidden={!open}>{children}</div>
    </div>
  );
}
