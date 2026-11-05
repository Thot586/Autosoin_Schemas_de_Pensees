import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Sheet } from "./Sheet";
import { Link, useLocation } from "../lib/router";
import { Icon } from "./Icon";
import { termById } from "../data/glossaire";
import { CiteText } from "./Cite";

interface Ctx { open: (id: string) => void }
const GCtx = createContext<Ctx>({ open: () => {} });
export const useGlossary = () => useContext(GCtx);

/**
 * Détail d'un mot, au clic : un volet qui s'ouvre sur la page, sans la quitter.
 * « Revenir à ma lecture » le referme ; les liens vers une autre page sont facultatifs.
 */
export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const open = useCallback((x: string) => setId(x), []);
  const value = useMemo(() => ({ open }), [open]);
  const e = id ? termById(id) : undefined;
  const close = () => setId(null);
  const { path } = useLocation();
  const here = !!e?.to && e.to.split("#")[0] === path;  // pas de lien vers la page où je suis déjà
  return (
    <GCtx.Provider value={value}>
      {children}
      <Sheet open={!!e} onClose={close} label={e ? `Définition : ${e.term}` : "Définition"} side="bottom" className="glossary-sheet">
        {e && (
          <div className="glossary" onClick={(ev) => { if ((ev.target as Element).closest("a.cite")) close(); }}>
            <p className="glossary-k">Le mot</p>
            <h2>{e.term}</h2>
            <p className="glossary-short">{e.short}</p>
            <p className="glossary-def"><CiteText text={e.def} /></p>
            {e.more && <p className="glossary-more"><CiteText text={e.more} /></p>}
            <div className="glossary-actions">
              <button type="button" className="btn btn-primary" onClick={close}><Icon name="arrowLeft" size={18} /><span>Revenir à ma lecture</span></button>
              {e.to && !here && <Link to={e.to} className="btn btn-soft" onClick={close}><span>{e.toLabel || "En savoir plus"}</span><Icon name="arrowRight" size={18} /></Link>}
              <Link to={`/glossaire#${e.id}`} className="btn btn-ghost" onClick={close}><Icon name="book" size={18} /><span>Tous les mots</span></Link>
            </div>
          </div>
        )}
      </Sheet>
    </GCtx.Provider>
  );
}
