import { printPage } from "../lib/print";
import { useState } from "react";
import { Page, Section, Callout, Invite, NextUp, Pro, Button } from "../components/ui";
import { Icon } from "../components/Icon";
import { ToolHead } from "../components/ToolBits";
import { CONTENT } from "../data/content";
import { SCHEMAS, schemaBySlug } from "../data/schemas";
import { plan, emptyPlan, retained, focusSchema, type Plan as PlanT } from "../lib/state";
import { buildIcs, downloadText, nextSunday, toDateInput } from "../lib/ics";

const C = CONTENT.p6.plan;
type LineId = "geste" | "quand" | "obstacle" | "soutien" | "recompense";

export default function PlanPage() {
  const p = plan.use();
  const kept = retained.use();
  const focus = focusSchema.use();
  const slug = p.slug || focus || kept[0] || "";
  const s = slug ? schemaBySlug(slug) : undefined;
  const set = (k: keyof PlanT, v: string) => plan.set((x) => ({ ...x, [k]: v, slug: x.slug || slug }));
  const sun = nextSunday();
  const [date, setDate] = useState(p.weekOf || toDateInput(sun));
  const [time, setTime] = useState("18:00");
  const [msg, setMsg] = useState("");
  const [confirm, setConfirm] = useState(false);

  const ics = () => {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    if (!y || !m || !d) { setMsg("Je choisis d’abord une date."); return; }
    const start = new Date(y, m - 1, d, hh || 18, mm || 0, 0);
    const desc = ["Bilan de ma semaine, cinq minutes.", ...C.bilan.questions, p.geste ? `Mon geste : ${p.geste}` : ""].filter(Boolean).join("\n");
    downloadText("bilan-de-ma-semaine.ics", "text/calendar", buildIcs({ title: "Bilan de ma semaine (5 minutes)", description: desc, start, minutes: 10 }));
    plan.set((x) => ({ ...x, weekOf: date }));
    setMsg("Fichier d’agenda téléchargé : je l’ouvre pour l’ajouter à mon agenda.");
  };

  return (
    <Page title="Mon plan pour la semaine" tone={s ? `b${s.base}` : undefined}>
      <ToolHead title="Mon plan pour la semaine" current="/outils/plan" lead={C.chapeau} />

      <Section eyebrow="Le dimanche soir" title="Six lignes, un seul geste">
        <div className="plan" id="plan-print">
          <div className="field">
            <label htmlFor="pl-schema">{C.lignes[0].titre}</label>
            <select id="pl-schema" value={slug} onChange={(e) => plan.set((x) => ({ ...x, slug: e.target.value, geste: "" }))}>
              <option value="">Je choisis…</option>
              {SCHEMAS.map((x) => <option key={x.slug} value={x.slug}>{x.name}{kept.includes(x.slug) ? " (gardé)" : ""}</option>)}
            </select>
            <p className="hint">{C.lignes[0].aide}</p>
          </div>
          {C.lignes.slice(1).map((l) => {
            const id = l.id as LineId;
            return (
              <div className="field" key={l.id}>
                <label htmlFor={`pl-${l.id}`}>{l.titre}</label>
                <textarea id={`pl-${l.id}`} rows={2} value={p[id]} onChange={(e) => set(id, e.target.value)} />
                <p className="hint">{l.aide}</p>
                {id === "geste" && s && (
                  <div className="plan-sug">
                    <p className="small muted">Pistes de « {s.name} » (je peux en prendre une, puis la raccourcir) :</p>
                    <div className="plan-chips">{s.semaines.steps.map((st) => <button key={st.level} type="button" className="choice-o" onClick={() => set("geste", st.text)}>{st.level}</button>)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="alt" eyebrow={C.bilan.titre.split(" · ")[0]} title="Mon bilan, cinq minutes">
        <div className="plan">
          <div className="field">
            <label htmlFor="pl-bq">{C.bilan.questions[0]} {C.bilan.questions[1]}</label>
            <textarea id="pl-bq" rows={3} value={p.bilanQu} onChange={(e) => set("bilanQu", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="pl-bg">{C.bilan.questions[2]}</label>
            <textarea id="pl-bg" rows={3} value={p.bilanGarde} onChange={(e) => set("bilanGarde", e.target.value)} />
          </div>
          <p className="small muted"><Icon name="info" size={14} /> {C.bilan.pied}</p>
        </div>

        <div className="ics mt">
          <h3><Icon name="calendar" size={22} /> Un rappel pour mon bilan</h3>
          <p className="small muted">Je choisis le jour et l’heure : le fichier se crée sur mon appareil et s’ouvre dans mon agenda (Google, Apple, Outlook…). Rien n’est envoyé nulle part.</p>
          <div className="ics-f">
            <div className="field"><label htmlFor="pl-date">Jour du bilan</label><input id="pl-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div className="field"><label htmlFor="pl-time">Heure</label><input id="pl-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
          </div>
          <div className="row">
            <Button icon="download" onClick={ics}>Ajouter à mon agenda (.ics)</Button>
            <Button variant="soft" icon="print" onClick={() => printPage("plan-print")}>Imprimer mon plan</Button>
            {!confirm ? <Button variant="ghost" icon="trash" onClick={() => setConfirm(true)}>Nouvelle semaine</Button>
              : <><Button variant="danger" onClick={() => { plan.set({ ...emptyPlan }); setConfirm(false); setMsg("Plan effacé : je peux en écrire un nouveau."); }}>Oui, effacer ce plan</Button><Button variant="ghost" onClick={() => setConfirm(false)}>Annuler</Button></>}
          </div>
          <p className="small muted" role="status" aria-live="polite">{msg}</p>
        </div>

        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Callout tone="care" title="Un écart n’efface rien" icon="heart">{C.bilan.pied}</Callout>
          <Invite id="p6-plan" prompt="Ce que je garde de cette semaine" hint="Le bilan se refait seul(e) le dimanche suivant, cinq minutes, puis je réécris le plan de la semaine." />
          <Pro>{C.pro}</Pro>
        </div>
      </Section>

      <Section>
        <NextUp to="/schemas" label="Mes schémas, un par un" hint="Pour chaque schéma : le comprendre, dans le moment, au fil des semaines." eyebrow="Pour choisir mon geste" />
      </Section>
    </Page>
  );
}
