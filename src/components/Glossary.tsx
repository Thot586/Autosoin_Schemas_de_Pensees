import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { Sheet } from "./Sheet";
import { Link } from "../lib/router";
import { Icon } from "./Icon";
import { GLOSSAIRE, termById } from "../data/glossaire";

interface Ctx { open: (id: string) => void }
const GCtx = createContext<Ctx>({ open: () => {} });
export const useGlossary = () => useContext(GCtx);

export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const open = useCallback((x: string) => setId(x), []);
  const value = useMemo(() => ({ open }), [open]);
  const e = id ? termById(id) : undefined;
  return (
    <GCtx.Provider value={value}>
      {children}
      <Sheet open={!!e} onClose={() => setId(null)} label="Définition" side="bottom" className="glossary-sheet">
        {e && (
          <div className="glossary">
            <p className="eyebrow">Glossaire</p>
            <h2>{e.term}</h2>
            <p className="glossary-def">{e.def}</p>
            {e.more && <p className="muted">{e.more}</p>}
            <div className="row glossary-actions">
              {e.to && <Link to={e.to} className="btn btn-soft" onClick={() => setId(null)}><span>{e.toLabel || "Voir la page"}</span><Icon name="arrowRight" size={18} /></Link>}
              <Link to="/glossaire" className="btn btn-ghost" onClick={() => setId(null)}><span>Tous les termes</span></Link>
            </div>
            <details className="glossary-others">
              <summary>Autres termes</summary>
              <ul>
                {GLOSSAIRE.filter((g) => g.id !== e.id).map((g) => (
                  <li key={g.id}><button type="button" className="linklike" onClick={() => setId(g.id)}>{g.term}</button></li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </Sheet>
    </GCtx.Provider>
  );
}
