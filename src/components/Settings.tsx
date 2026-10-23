import { useState } from "react";
import { applyPrefs, prefs, type Prefs } from "../lib/state";
import { clearPersonalData } from "../lib/store";
import { Icon } from "./Icon";

function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { v: T; t: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} type="button" aria-pressed={value === o.v} className={value === o.v ? "is-on" : ""} onClick={() => onChange(o.v)}>{o.t}</button>
      ))}
    </div>
  );
}

export function Settings() {
  const p = prefs.use();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  const set = (patch: Partial<Prefs>) => { const next = { ...prefs.get(), ...patch }; prefs.set(next); applyPrefs(next); };
  const size = Math.round(p.size * 100);
  return (
    <div className="settings">
      <h3 className="settings-t"><Icon name="gear" size={20} /> Réglages d’affichage</h3>
      <div className="settings-row">
        <span id="s-theme" className="settings-l">Thème</span>
        <Seg label="Thème" value={p.theme} onChange={(v) => set({ theme: v })} options={[{ v: "auto", t: "Auto" }, { v: "light", t: "Clair" }, { v: "dark", t: "Sombre" }]} />
      </div>
      <div className="settings-row">
        <span className="settings-l">Taille du texte <span className="muted">({size} %)</span></span>
        <div className="seg" role="group" aria-label="Taille du texte">
          <button type="button" onClick={() => set({ size: Math.max(0.9, +(p.size - 0.1).toFixed(2)) })} disabled={p.size <= 0.9} aria-label="Réduire le texte">A−</button>
          <button type="button" onClick={() => set({ size: 1 })} aria-label="Taille normale">100 %</button>
          <button type="button" onClick={() => set({ size: Math.min(1.4, +(p.size + 0.1).toFixed(2)) })} disabled={p.size >= 1.4} aria-label="Agrandir le texte">A+</button>
        </div>
      </div>
      <div className="settings-row">
        <span className="settings-l">Animations</span>
        <Seg label="Animations" value={p.motion} onChange={(v) => set({ motion: v })} options={[{ v: "auto", t: "Auto" }, { v: "reduced", t: "Réduites" }, { v: "full", t: "Complètes" }]} />
      </div>
      <div className="settings-row">
        <span className="settings-l">Mode accompagnant(e)<span className="muted small"> · affiche les repères pour le professionnel</span></span>
        <button type="button" role="switch" aria-checked={p.pro} className={`switch ${p.pro ? "is-on" : ""}`} onClick={() => set({ pro: !p.pro })}><span className="sr-only">Mode accompagnant(e)</span><i /></button>
      </div>
      <div className="settings-row settings-danger">
        <span className="settings-l">Mes données<span className="muted small"> · cases cochées, notes, cartes, carnet : elles ne quittent jamais cet appareil.</span></span>
        {!confirm ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setConfirm(true); setDone(false); }}><Icon name="trash" size={16} /><span>Tout effacer</span></button>
        ) : (
          <span className="row">
            <button type="button" className="btn btn-danger btn-sm" onClick={() => { clearPersonalData(); setConfirm(false); setDone(true); }}><span>Oui, effacer</span></button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setConfirm(false)}><span>Annuler</span></button>
          </span>
        )}
      </div>
      <p className="small muted" aria-live="polite">{done ? "Données effacées sur cet appareil." : ""}</p>
    </div>
  );
}
