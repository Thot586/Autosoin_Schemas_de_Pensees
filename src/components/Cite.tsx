import { Fragment, type ReactNode } from "react";
import { Link } from "../lib/router";
import { apaSort, citeIds, citeLabel, citeNarrative, CITE_RE, NIVEAUX, refById, type Ref } from "../data/references";

/**
 * Une citation APA 7 cliquable : (Auteur, 2020; Autre et al., 2021), ou Auteur (2020) dans la phrase.
 * La pastille de couleur dit la fiabilité de la source ; un clic mène à son entrée dans la page « Références ».
 */
export function Cite({ ids, narrative = false }: { ids: string[]; narrative?: boolean }) {
  const refs = ids.map(refById).filter((r): r is Ref => !!r).sort(apaSort);
  if (!refs.length) return null;  // identifiant inconnu : rien plutôt que « () » (le test e2e le signale)
  const one = (r: Ref, text: string) => (
    <Link to={`/references#${r.id}`} className={`cite niv-${r.niveau}`}>
      <span className="cite-dot" aria-hidden="true">●</span>{text}<span className="sr-only"> ({NIVEAUX[r.niveau].label.toLowerCase()})</span>
    </Link>
  );
  if (narrative) return <>{refs.map((r, i) => <Fragment key={r.id}>{i > 0 && " ; "}{one(r, citeNarrative(r))}</Fragment>)}</>;
  return <span className="cites">({refs.map((r, i) => <Fragment key={r.id}>{i > 0 && "; "}{one(r, citeLabel(r))}</Fragment>)})</span>;
}

/** Découpe un texte en morceaux de texte et en citations ([@id], [@id1; @id2], [n@id]). */
export function splitCites(text: string): ({ text: string } | { ids: string[]; narrative: boolean })[] {
  const out: ({ text: string } | { ids: string[]; narrative: boolean })[] = [];
  const re = new RegExp(CITE_RE.source, "g");
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ ids: citeIds(m[2]), narrative: m[1] === "n" });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** Un texte dont seules les citations sont balisées (glossaire, encadrés). */
export function CiteText({ text }: { text: string }) {
  const out: ReactNode[] = splitCites(text).map((p, i) => ("text" in p ? <Fragment key={i}>{p.text}</Fragment> : <Cite key={i} ids={p.ids} narrative={p.narrative} />));
  return <>{out}</>;
}
