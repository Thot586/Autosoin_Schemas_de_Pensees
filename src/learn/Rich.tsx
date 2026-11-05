import { Children, cloneElement, createContext, Fragment, isValidElement, useContext, useMemo, type ReactElement, type ReactNode } from "react";
import { Button, Term } from "../components/ui";
import { Link, NavLink } from "../lib/router";
import { findTerms, planCard, cardStrings } from "./terms";
import type { Card } from "./types";

/** Plan de mise en évidence d'une carte : pour chaque texte, les mots du glossaire à marquer (une seule fois par carte). */
const PlanCtx = createContext<Map<string, Set<string>> | null>(null);

export function TermScope({ card, children }: { card: Card; children: ReactNode }) {
  const plan = useMemo(() => planCard(cardStrings(card)), [card]);
  return <PlanCtx.Provider value={plan}>{children}</PlanCtx.Provider>;
}

/** Repère automatiquement les mots du glossaire dans un morceau de texte brut. */
function auto(text: string, allow: Set<string> | null, done: Set<string>, key: { k: number }): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const h of findTerms(text, allow)) {
    if (done.has(h.id)) continue;
    done.add(h.id);
    if (h.start > last) out.push(<Fragment key={key.k++}>{text.slice(last, h.start)}</Fragment>);
    out.push(<Term key={key.k++} id={h.id}>{text.slice(h.start, h.end)}</Term>);
    last = h.end;
  }
  if (last < text.length) out.push(<Fragment key={key.k++}>{text.slice(last)}</Fragment>);
  return out;
}

/**
 * Rend le balisage minimal : [[id|mot]] (mot du glossaire, marqué à la main) et **gras**,
 * et repère tout seul les autres mots du glossaire (survol : phrase simple ; clic : détail).
 * Dans une carte (TermScope), un mot n'est marqué qu'à sa première apparition.
 */
export function Rich({ text, terms = true }: { text: string; terms?: boolean }) {
  const plan = useContext(PlanCtx);
  const allow = terms ? (plan ? plan.get(text) ?? new Set<string>() : null) : new Set<string>();
  const out: ReactNode[] = [];
  const re = /\[\[([^|\]]+)\|([^\]]+)\]\]|\*\*([^*]+)\*\*/g;
  const done = new Set<string>();
  const key = { k: 0 };
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(...auto(text.slice(last, m.index), allow, done, key));
    if (m[1]) { done.add(m[1]); out.push(<Term key={key.k++} id={m[1]}>{m[2]}</Term>); }
    else out.push(<b key={key.k++}>{auto(m[3], allow, done, key)}</b>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(...auto(text.slice(last), allow, done, key));
  return <>{out}</>;
}

// Éléments dont on ne touche pas le texte : titres, liens, boutons, champs, et ce qui est déjà un mot expliqué.
const SKIP = new Set(["a", "button", "h1", "h2", "h3", "h4", "label", "summary", "input", "textarea", "select", "option", "svg", "code", "kbd"]);

/**
 * Pour les pages écrites en JSX (hors leçons) : repère les mots du glossaire dans le texte des enfants,
 * une seule fois par zone, sans toucher aux titres, liens et boutons.
 */
export function Terms({ children }: { children: ReactNode }) {
  const done = new Set<string>();
  const key = { k: 0 };
  const walk = (node: ReactNode): ReactNode => {
    if (typeof node === "string") return auto(node, null, done, key);
    if (!isValidElement(node)) return node;
    const el = node as ReactElement<{ children?: ReactNode; "data-noterms"?: unknown }>;
    if ((typeof el.type === "string" && SKIP.has(el.type)) || el.type === Term || el.type === Link || el.type === NavLink || el.type === Button) return el;
    if (el.props["data-noterms"] != null) return el;  // ex. : un titre de livre
    if (el.props.children == null) return el;
    return cloneElement(el, undefined, Children.map(el.props.children, walk));
  };
  return <>{Children.map(children, walk)}</>;
}
