import { printPage } from "../lib/print";
import { useState } from "react";
import { Page, Section, Callout, Invite, Pro, Button, Card } from "../components/ui";
import { Icon } from "../components/Icon";
import { ToolHead } from "../components/ToolBits";
import { Link } from "../lib/router";
import { CONTENT } from "../data/content";
import { BASES } from "../data/bases";
import { carnet, type CarnetRow } from "../lib/state";
import { downloadText } from "../lib/ics";

const C = CONTENT.p8.carnet;
const today = () => new Date().toISOString().slice(0, 10);
const fmtDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};
const baseLabel = (b: string) => { const x = BASES.find((k) => String(k.id) === b); return x ? `${x.id} · ${x.name}` : ""; };
const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`;
const weekStart = () => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toISOString().slice(0, 10); };

const blank = () => ({ date: today(), situation: "", emotionName: "", level: 5, touched: false, voix: "", base: "", fait: "", adulte: "" });

export default function CarnetPage() {
  const rows = carnet.use();
  const [f, setF] = useState(blank);
  const [open, setOpen] = useState(rows.length === 0);
  const [del, setDel] = useState("");
  const [msg, setMsg] = useState("");
  const set = <K extends keyof ReturnType<typeof blank>>(k: K, v: ReturnType<typeof blank>[K]) => setF((x) => ({ ...x, [k]: v }));
  const sorted = [...rows].sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id));
  const thisWeek = rows.filter((r) => r.date >= weekStart()).length;
  const canSave = f.situation.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const name = f.emotionName.trim();
    const emotion = f.touched ? (name ? `${name} : ${f.level}` : `${f.level}/10`) : name;
    const row: CarnetRow = { id: String(Date.now()), date: f.date || today(), situation: f.situation.trim(), emotion, voix: f.voix.trim(), base: f.base, fait: f.fait.trim(), adulte: f.adulte.trim() };
    carnet.set((x) => [...x, row]);
    setF(blank());
    setOpen(false);
    setMsg("Situation notée. Je peux la relire dimanche.");
  };
  const csv = () => {
    const head = ["Date", ...C.colonnes];
    const lines = [head, ...sorted.map((r) => [r.date, r.situation, r.emotion, r.voix, baseLabel(r.base), r.fait, r.adulte])].map((l) => l.map(csvCell).join(";"));
    downloadText("mon-carnet-de-schemas.csv", "text/csv;charset=utf-8", "﻿" + lines.join("\r\n"));
    setMsg("Fichier téléchargé : il s’ouvre dans un tableur ou peut être apporté en séance.");
  };
  const remove = (id: string) => { carnet.set((x) => x.filter((r) => r.id !== id)); setDel(""); setMsg("Ligne supprimée."); };
  const edit = (id: string, k: keyof CarnetRow, v: string) => carnet.set((x) => x.map((r) => (r.id === id ? { ...r, [k]: v } : r)));
  const ex = C.exemple;

  return (
    <Page title="Mon carnet de schémas">
      <ToolHead title="Mon carnet de schémas" current="/outils/carnet" lead={C.chapeau} />

      <Section eyebrow="Un exemple" title="À quoi ressemble une ligne">
        <Card className="crow-ex">
          <p className="eyebrow">Exemple</p>
          <dl className="crow-dl">
            <div><dt>{C.colonnes[0]}</dt><dd>{ex.situation}</dd></div>
            <div><dt>{C.colonnes[1]}</dt><dd>{ex.emotion}</dd></div>
            <div><dt>{C.colonnes[2]}</dt><dd>{ex.voix}</dd></div>
            <div><dt>{C.colonnes[3]}</dt><dd>{ex.base}</dd></div>
            <div><dt>{C.colonnes[4]}</dt><dd>{ex.fait}</dd></div>
            <div><dt>{C.colonnes[5]}</dt><dd>{ex.adulte}</dd></div>
          </dl>
        </Card>
        <p className="small muted mt">Le carnet sert à repérer, pas à se juger. La dernière colonne peut rester vide au début.</p>
      </Section>

      <Section className="alt" eyebrow={rows.length ? `${rows.length} situation${rows.length > 1 ? "s" : ""} notée${rows.length > 1 ? "s" : ""}${thisWeek ? ` · ${thisWeek} cette semaine` : ""}` : "Aujourd’hui"} title="Noter une situation">
        {!open ? (
          <Button icon="plus" onClick={() => setOpen(true)}>Noter une situation</Button>
        ) : (
          <form className="plan carnet-form" onSubmit={(e) => { e.preventDefault(); save(); }}>
            <div className="field"><label htmlFor="cn-date">Jour</label><input id="cn-date" type="date" value={f.date} max={today()} onChange={(e) => set("date", e.target.value)} /></div>
            <div className="field">
              <label htmlFor="cn-sit">{C.colonnes[0]}</label>
              <textarea id="cn-sit" rows={2} value={f.situation} onChange={(e) => set("situation", e.target.value)} placeholder="Ce qui s’est passé, en une ou deux phrases" required />
            </div>
            <div className="field">
              <label htmlFor="cn-emo">Émotion ressentie</label>
              <input id="cn-emo" type="text" value={f.emotionName} onChange={(e) => set("emotionName", e.target.value)} placeholder="Le mot : tristesse, colère, honte…" autoComplete="off" />
            </div>
            <div className="field">
              <label htmlFor="cn-lvl">Intensité, de 0 à 10 : <b className="pz-n">{f.touched ? f.level : "…"}</b></label>
              <input id="cn-lvl" type="range" min={0} max={10} step={1} value={f.level} className="age-range" aria-valuetext={f.touched ? `${f.level} sur 10` : "pas encore choisie"} onChange={(e) => { set("level", Number(e.target.value)); set("touched", true); }} />
              <div className="age-scale" aria-hidden="true"><span>0 · aucune</span><span>10 · maximale</span></div>
              <p className="hint">Facultatif : je peux juste nommer l’émotion.</p>
            </div>
            <div className="field"><label htmlFor="cn-voix">{C.colonnes[2]}</label><textarea id="cn-voix" rows={2} value={f.voix} onChange={(e) => set("voix", e.target.value)} placeholder="« Je compte peu pour lui. »" /></div>
            <div className="field">
              <label htmlFor="cn-base">{C.colonnes[3]}</label>
              <select id="cn-base" value={f.base} onChange={(e) => set("base", e.target.value)}>
                <option value="">Je ne sais pas encore</option>
                {BASES.map((b) => <option key={b.id} value={String(b.id)}>{b.id} · {b.name}</option>)}
              </select>
            </div>
            <div className="field"><label htmlFor="cn-fait">{C.colonnes[4]}</label><textarea id="cn-fait" rows={2} value={f.fait} onChange={(e) => set("fait", e.target.value)} /></div>
            <div className="field"><label htmlFor="cn-ad">{C.colonnes[5]} <span className="muted">(facultatif)</span></label><textarea id="cn-ad" rows={2} value={f.adulte} onChange={(e) => set("adulte", e.target.value)} placeholder="Peut rester vide au début" /></div>
            <div className="row">
              <Button type="submit" icon="save" disabled={!canSave}>Ajouter à mon carnet</Button>
              {rows.length > 0 && <Button variant="ghost" onClick={() => { setOpen(false); setF(blank()); }}>Annuler</Button>}
            </div>
          </form>
        )}
        <p className="small muted mt" role="status" aria-live="polite">{msg}</p>

        <Callout tone="care" title="Si une situation est trop lourde" icon="heart" className="mt">
          Je n’ai pas à la noter en détail. Si l’émotion est très intense, je n’en reste pas seul(e) : j’en parle à mon thérapeute ou à mon médecin. <Link to="/aide">Quand demander de l’aide</Link>.
        </Callout>
      </Section>

      {rows.length > 0 && (
        <Section id="carnet-liste" eyebrow="Mon carnet" title="Mes situations, de la plus récente à la plus ancienne">
          <div className="row noprint">
            <Button variant="soft" icon="download" onClick={csv}>Exporter (.csv)</Button>
            <Button variant="soft" icon="print" onClick={() => printPage("carnet-print")}>Imprimer</Button>
          </div>
          <div className="carnet-wrap mt" id="carnet-print">
            <table className="carnet-t">
              <thead><tr><th scope="col">Jour</th>{C.colonnes.map((c) => <th scope="col" key={c}>{c}</th>)}<th scope="col"><span className="sr-only">Action</span></th></tr></thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.id}>
                    <td data-label="Jour">{fmtDate(r.date)}</td>
                    <td data-label={C.colonnes[0]}>{r.situation}</td>
                    <td data-label={C.colonnes[1]}>{r.emotion || "–"}</td>
                    <td data-label={C.colonnes[2]}>{r.voix || "–"}</td>
                    <td data-label={C.colonnes[3]}>{baseLabel(r.base) || "–"}</td>
                    <td data-label={C.colonnes[4]}>{r.fait || "–"}</td>
                    <td data-label={C.colonnes[5]} className="carnet-ad">
                      <textarea rows={2} aria-label={`${C.colonnes[5]}, ligne du ${fmtDate(r.date)}`} value={r.adulte} onChange={(e) => edit(r.id, "adulte", e.target.value)} placeholder="À compléter plus tard" />
                      <span className="print-only">{r.adulte || "–"}</span>
                    </td>
                    <td className="carnet-act noprint">
                      {del === r.id
                        ? <><Button variant="danger" onClick={() => remove(r.id)}>Oui, supprimer</Button><Button variant="ghost" onClick={() => setDel("")}>Non</Button></>
                        : <Button variant="ghost" icon="trash" aria-label={`Supprimer la ligne du ${fmtDate(r.date)}`} onClick={() => setDel(r.id)}>Supprimer</Button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="small muted mt"><Icon name="lock" size={14} /> Ce carnet reste sur cet appareil, dans ce navigateur. Personne d’autre ne le lit, pas même nous. Je l’exporte pour l’apporter en séance.</p>
        </Section>
      )}

      <Section className={rows.length ? "alt" : ""}>
        <div className="stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Invite id="p8-carnet" prompt="Ce que j’ai remarqué en relisant mon carnet dimanche" hint={C.invite} placeholder="Ce qui revient, ce qui m’étonne…" />
          <Pro>{C.pro}</Pro>
        </div>
      </Section>
    </Page>
  );
}
