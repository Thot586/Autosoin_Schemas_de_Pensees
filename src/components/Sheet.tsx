import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";

/** Volet modal basé sur <dialog> : focus piégé, Échap, arrière-plan inerte, sans bibliothèque. */
export function Sheet({ open, onClose, label, children, side = "bottom", className = "" }: {
  open: boolean; onClose: () => void; label: string; children: ReactNode; side?: "bottom" | "right" | "center"; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); document.documentElement.classList.add("is-locked"); }
    if (!open && d.open) { d.close(); }
    if (!open) document.documentElement.classList.remove("is-locked");
    return () => { document.documentElement.classList.remove("is-locked"); };
  }, [open]);
  return (
    <dialog ref={ref} className={`sheet sheet-${side} ${className}`} aria-label={label}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      <div className="sheet-body">
        <button type="button" className="sheet-close" onClick={onClose} aria-label="Fermer"><Icon name="close" size={22} /></button>
        {open ? children : null}
      </div>
    </dialog>
  );
}
