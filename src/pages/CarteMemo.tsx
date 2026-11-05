import { printPage } from "../lib/print";
import { useEffect, useMemo, useState } from "react";
import { Page, Section, Reveal, Callout, Invite, NextUp, Pro, Button } from "../components/ui";
import { Icon } from "../components/Icon";
import { ToolHead } from "../components/ToolBits";
import { useLocation } from "../lib/router";
import { SCHEMAS, schemaBySlug } from "../data/schemas";
import { CONTENT } from "../data/content";
import { cartes, retained, focusSchema, type Carte } from "../lib/state";
import type { SchemaData } from "../data/types";
import { CarteView, FIELDS, defaultCarte } from "../components/SchemaBits";

const C = CONTENT.p6.carte;
export default function CarteMemo() {
  const { search } = useLocation();
  const saved = cartes.use();
  const kept = retained.use();
  const focus = focusSchema.use();
  const qs = new URLSearchParams(search).get("schema");
  const first = [qs, focus, ...kept, ...Object.keys(saved), SCHEMAS[0].slug].find((x) => x && schemaBySlug(x)) as string;
  const [slug, setSlug] = useState(first);
  const s = schemaBySlug(slug)!;
  const [draft, setDraft] = useState<Carte>(() => saved[slug] || defaultCarte(s));
  const [flash, setFlash] = useState("");
  useEffect(() => { setDraft(saved[slug] || defaultCarte(schemaBySlug(slug)!)); setFlash(""); /* eslint-disable-next-line */ }, [slug]);
  useEffect(() => { if (qs && schemaBySlug(qs)) setSlug(qs); }, [qs]);

  const count = Object.keys(saved).length;
  const isSaved = !!saved[slug];
  const limit = !isSaved && count >= 3;
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved[slug] || null), [draft, saved, slug]);
  const set = (k: keyof Carte, v: string) => { setDraft((d) => ({ ...d, [k]: v })); setFlash(""); };
  const save = () => { cartes.set((x) => ({ ...x, [slug]: draft })); setFlash("Carte enregistrée sur cet appareil."); };
  const remove = () => { cartes.set((x) => { const { [slug]: _gone, ...rest } = x; void _gone; return rest; }); setFlash("Carte supprimée."); };
  const text = [draft.schema, ...FIELDS.map((f) => `${C.champs[f.k]} : ${draft[f.k]}`)].join("\n");
  const copy = async () => { try { await navigator.clipboard.writeText(text); setFlash("Texte copié."); } catch { setFlash("Copie impossible : je sélectionne le texte de la carte à la main."); } };

  return (
    <Page title="Ma carte-mémo" tone={`b${s.base}`}>
      <ToolHead title="Ma carte-mémo" current="/outils/carte-memo" lead={C.resume} />

      <Section eyebrow="Mode d’emploi" title={C.titre}>
        <ol className="steps3 steps3-s">
          {C.etapes.map((e, i) => <li key={e.titre} className="step3"><span className="badge-n">{i + 1}</span><h3>{e.titre}</h3><p>{e.texte}</p></li>)}
        </ol>
        <Reveal>
          <div className="mt cm-ex">
            <p className="eyebrow">Un exemple (isolement social)</p>
            <CarteView tone="b1" c={{ schema: C.exemple.schema, quand: C.exemple.quand, voix: C.exemple.voix, besoin: C.exemple.besoin, geste: C.exemple.geste, phrase: C.exemple.phrase }} />
            <p className="small muted">C’est une illustration : chacun écrit avec ses mots.</p>
          </div>
        </Reveal>
      </Section>

      <Section className="alt" eyebrow="À moi" title="Je fais ma carte" lead="Je pars des mots du support, puis je les réécris avec les miens. Une carte par schéma, trois au maximum.">
        <div className="cm">
          <form className="cm-form" onSubmit={(e) => { e.preventDefault(); if (!limit) save(); }}>
            <div className="field">
              <label htmlFor="cm-schema">Mon schéma</label>
              <select id="cm-schema" value={slug} onChange={(e) => setSlug(e.target.value)}>
                {SCHEMAS.map((x) => <option key={x.slug} value={x.slug}>{x.name}{saved[x.slug] ? " ✓" : ""}{kept.includes(x.slug) ? " (gardé)" : ""}</option>)}
              </select>
              <p className="hint">{count} carte{count > 1 ? "s" : ""} enregistrée{count > 1 ? "s" : ""} sur 3.</p>
            </div>
            {FIELDS.map((f) => (
              <div className="field" key={f.k}>
                <label htmlFor={`cm-${f.k}`}>{C.champs[f.k]}</label>
                <textarea id={`cm-${f.k}`} rows={f.rows} value={draft[f.k]} onChange={(e) => set(f.k, e.target.value)} />
              </div>
            ))}
            {limit && <Callout tone="care" title="Trois cartes au maximum">Pour en faire une nouvelle, je supprime d’abord une carte enregistrée (je la choisis dans la liste ci-dessus).</Callout>}
            <div className="row">
              <Button type="submit" icon="save" disabled={limit || (!dirty && isSaved)}>{isSaved ? (dirty ? "Mettre à jour" : "Carte enregistrée") : "Enregistrer ma carte"}</Button>
              <Button variant="soft" icon="print" onClick={() => printPage("carte-print")}>Imprimer</Button>
              <Button variant="ghost" icon="copy" onClick={copy}>Copier le texte</Button>
              {isSaved && <Button variant="ghost" icon="trash" onClick={remove}>Supprimer</Button>}
            </div>
            <p className="small muted" role="status" aria-live="polite">{flash || "Ma carte reste sur cet appareil. Je peux l’imprimer ou la recopier à la main."}</p>
          </form>
          <div className="cm-preview">
            <p className="eyebrow">Aperçu</p>
            <CarteView c={draft} tone={`b${s.base}`} id="carte-print" />
          </div>
        </div>
        <div className="mt stack" style={{ ["--gap" as string]: "1.2rem" }}>
          <Invite id="p6-carte" prompt="Une situation récente pour ma carte" hint={C.invite} />
          <Pro>{C.pro}</Pro>
        </div>
      </Section>

      <Section>
        <NextUp to="/outils/pause" label="La pause en trois temps" hint="Pour sortir ma carte-mémo au bon moment : stop, nommer, choisir." eyebrow="Outil suivant" />
      </Section>
    </Page>
  );
}
