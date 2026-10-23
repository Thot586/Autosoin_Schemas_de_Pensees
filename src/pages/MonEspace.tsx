import { printPage } from "../lib/print";
import { useRef, useState } from "react";
import { Page, Section, Callout, Button, Card, Ring, Pill, usePartStatus } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link, navigate } from "../lib/router";
import { PARTS } from "../data/parts";
import { BASES } from "../data/bases";
import { schemaBySlug } from "../data/schemas";
import { CarteView } from "../components/SchemaBits";
import { ticks, retained, focusSchema, situations, notes, cartes, plan, carnet, last, tickCount } from "../lib/state";
import { clearPersonalData } from "../lib/store";
import { collectBackup, backupFileName, restoreBackup } from "../lib/backup";
import { downloadText } from "../lib/ics";

type NoteMeta = { label: string; to?: string };
function noteMeta(key: string): NoteMeta | null {
  const base = /^base-(\d)$/.exec(key);
  if (base) { const b = BASES[Number(base[1]) - 1]; return b ? { label: `Base ${b.id} · ${b.name}`, to: `/besoins/${b.slug}` } : null; }
  const sch = /^([mw])-(.+)$/.exec(key);
  if (sch) { const s = schemaBySlug(sch[2]); return s ? { label: `${s.name} · ${sch[1] === "m" ? "dans le moment" : "au fil des semaines"}`, to: `/schemas/${s.slug}/${sch[1] === "m" ? "dans-le-moment" : "au-fil-des-semaines"}` } : null; }
  if (key.startsWith("dire-")) return { label: "Dire ce qui ne va pas · avec mes mots", to: "/outils/dire" };
  const fixed: Record<string, NoteMeta> = {
    "p1-fort": { label: "Comprendre un schéma", to: "/comprendre" },
    "p2-base": { label: "Les 5 besoins", to: "/besoins" },
    "p3-cercle": { label: "Comment un schéma s’entretient", to: "/entretien" },
    "p5-trame": { label: "Trouver mon schéma", to: "/trouver" },
    "p5-prio": { label: "Ma fiche et mes priorités", to: "/trouver/priorites" },
    "p6-carte": { label: "Ma carte-mémo", to: "/outils/carte-memo" },
    "p6-pause": { label: "La pause en trois temps", to: "/outils/pause" },
    "p6-plan": { label: "Mon plan pour la semaine", to: "/outils/plan" },
    "p8-aide": { label: "Quand demander de l’aide", to: "/pour-la-suite/aide" },
    "p8-carnet": { label: "Mon carnet", to: "/pour-la-suite/carnet" },
    "p8-lectures": { label: "Pour aller plus loin", to: "/pour-la-suite/lectures" },
    "p8-retenir": { label: "À retenir (partie 8)", to: "/pour-la-suite#a-retenir" },
  };
  return fixed[key] ?? null;
}

export default function MonEspace() {
  const done = usePartStatus();
  const t = ticks.use();
  const kept = retained.use();
  const focus = focusSchema.use();
  const sit = situations.use();
  const nts = notes.use();
  const crt = cartes.use();
  const pl = plan.use();
  const car = carnet.use();
  const lst = last.use();
  const nPartsDone = done.filter(Boolean).length;
  const ticked = Object.entries(t).filter(([, v]) => tickCount(v) > 0).length;
  const noteList = Object.entries(nts).filter(([, v]) => v && v.trim()).map(([k, v]) => ({ k, v, m: noteMeta(k) })).filter((x): x is { k: string; v: string; m: NoteMeta } => !!x.m);
  const carteList = Object.entries(crt).filter(([, c]) => c.schema);
  const planFilled = !!(pl.geste || pl.quand || pl.obstacle || pl.soutien || pl.recompense);
  const planSchema = pl.slug ? schemaBySlug(pl.slug) : undefined;
  const empty = !nPartsDone && !kept.length && !ticked && !carteList.length && !planFilled && !car.length && !noteList.length;

  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [erase, setErase] = useState(false);

  const exportAll = () => { downloadText(backupFileName(), "application/json", JSON.stringify(collectBackup(), null, 2)); setMsg("Fichier téléchargé. Je le range à un endroit sûr : il contient mes notes."); };
  const pick = async (f: File | undefined) => {
    if (!f) return;
    if (f.size > 2_000_000) { setMsg("Ce fichier est trop volumineux pour être une sauvegarde de ce site."); return; }
    setPending(await f.text()); setMsg("");
  };
  const apply = () => {
    if (pending == null) return;
    const r = restoreBackup(pending);
    setPending(null);
    if (fileRef.current) fileRef.current.value = "";
    setMsg(r.ok ? `Sauvegarde restaurée${r.restored.length ? " : " + r.restored.join(", ") : ""}.` : r.error);
  };

  return (
    <Page title="Mon espace">
      <header className="parthero tone-brand">
        <div className="wrap">
          <p className="eyebrow">Mon espace</p>
          <h1>Ce que j’ai fait et noté</h1>
          <p className="lead">Tout est rassemblé ici. Ces données restent sur cet appareil, dans ce navigateur : personne d’autre ne les voit.</p>
        </div>
      </header>

      {empty && (
        <Section>
          <Callout tone="info" title="Rien ici pour l’instant" icon="sparkles">
            <p>Mon espace se remplit au fur et à mesure : les schémas que je garde, ma carte-mémo, mon plan, mon carnet, mes notes.</p>
            <p><Button to="/commencer" icon="play">Commencer par le début</Button></p>
          </Callout>
        </Section>
      )}

      <Section eyebrow="Où j’en suis" title="Mon parcours">
        <div className="me-progress">
          <div className="me-ring">
            <Ring value={nPartsDone / PARTS.length} size={110} stroke={10} label={`${nPartsDone} parties sur ${PARTS.length} visitées`} />
            <span className="me-ring-n" aria-hidden="true"><b>{nPartsDone}</b>/{PARTS.length}</span>
          </div>
          <div>
            <p className="lead">{nPartsDone === 0 ? "Je n’ai pas encore ouvert de partie." : nPartsDone === PARTS.length ? "J’ai ouvert les huit parties. Je peux y revenir quand je veux." : `J’ai ouvert ${nPartsDone} partie${nPartsDone > 1 ? "s" : ""} sur ${PARTS.length}.`}</p>
            <div className="row">
              {lst && <Button to={lst.path} icon="play">Reprendre : {lst.title}</Button>}
              <Button to="/" variant="soft" icon="home">Plan en huit parties</Button>
            </div>
          </div>
        </div>
        <ol className="me-parts">
          {PARTS.map((p, i) => <li key={p.n} className={done[i] ? "is-done" : ""}><Link to={p.path}><span className="me-n">{done[i] ? <Icon name="check" size={14} /> : p.n}</span><span>{p.title}</span></Link></li>)}
        </ol>
      </Section>

      <Section className="alt" eyebrow="Mes schémas" title="Ceux que je garde">
        {kept.length === 0 ? (
          <p>Je n’ai pas encore gardé de schéma. Je peux en garder jusqu’à trois, dans <Link to="/trouver/priorites">ma fiche et mes priorités</Link>, ou depuis la page d’un schéma.</p>
        ) : (
          <ul className="schemacards me-kept">
            {kept.map((slug) => { const s = schemaBySlug(slug); if (!s) return null; return (
              <li key={slug}>
                <Link to={`/schemas/${slug}/comprendre`} className={`schemacard tone-b${s.base}`}>
                  <span className="schemacard-top"><b>{s.name}</b>{focus === slug && <Pill>Je commence par celui-ci</Pill>}</span>
                  <span className="quote schemacard-q">{s.phrase}</span>
                  <span className="schemacard-go">Ouvrir <Icon name="arrowRight" size={18} /></span>
                </Link>
              </li>
            ); })}
          </ul>
        )}
        <p className="small muted mt">{ticked > 0 ? `${ticked} schéma${ticked > 1 ? "s" : ""} avec au moins une case cochée dans la fiche.` : "Aucune case cochée dans la fiche pour l’instant."} Cocher n’est pas un diagnostic : <Link to="/trouver/fiche">ma fiche</Link>.</p>
        {Object.values(sit).some((v) => v && v.trim()) && (
          <div className="mt me-note"><p className="eyebrow">Les situations où je me reconnais</p>{Object.entries(sit).filter(([, v]) => v && v.trim()).map(([k, v]) => { const s = schemaBySlug(k); return <p key={k}><b>{s ? s.name : "Situation"}</b> · {v}</p>; })}</div>
        )}
      </Section>

      <Section eyebrow="Mes outils" title="Ma carte-mémo">
        {carteList.length === 0 ? (
          <p>Pas encore de carte. <Link to="/outils/carte-memo">Je crée ma carte-mémo</Link> : une carte par schéma, six lignes, un seul geste.</p>
        ) : (
          <>
            <div className="me-cartes">{carteList.map(([slug, c]) => { const sch = schemaBySlug(slug); return <CarteView key={slug} c={c} tone={sch ? `b${sch.base}` : undefined} />; })}</div>
            <div className="row mt noprint"><Button to="/outils/carte-memo" variant="soft" icon="pencil">Modifier mes cartes</Button></div>
          </>
        )}
      </Section>

      <Section className="alt" eyebrow="Cette semaine" title="Mon plan">
        {!planFilled ? (
          <p>Pas de plan pour l’instant. <Link to="/outils/plan">Je prépare mon plan de la semaine</Link> : un schéma, un geste, un moment.</p>
        ) : (
          <Card className="me-plan">
            <dl className="crow-dl">
              {planSchema && <div><dt>Mon schéma</dt><dd>{planSchema.name}</dd></div>}
              {pl.geste && <div><dt>Mon geste</dt><dd>{pl.geste}</dd></div>}
              {pl.quand && <div><dt>Quand</dt><dd>{pl.quand}</dd></div>}
              {pl.obstacle && <div><dt>Si l’obstacle arrive</dt><dd>{pl.obstacle}</dd></div>}
              {pl.soutien && <div><dt>Mon soutien</dt><dd>{pl.soutien}</dd></div>}
              {pl.recompense && <div><dt>Ma récompense</dt><dd>{pl.recompense}</dd></div>}
            </dl>
            <div className="row mt noprint"><Button to="/outils/plan" variant="soft" icon="pencil">Modifier mon plan</Button></div>
          </Card>
        )}
      </Section>

      <Section eyebrow="Au jour le jour" title="Mon carnet">
        {car.length === 0 ? (
          <p>Le carnet est vide. <Link to="/pour-la-suite/carnet">Je note une première situation</Link> quand une émotion me paraît trop forte.</p>
        ) : (
          <>
            <p>{car.length} situation{car.length > 1 ? "s" : ""} notée{car.length > 1 ? "s" : ""}. Les trois dernières :</p>
            <ul className="me-carnet">
              {[...car].sort((a, b) => (b.date + b.id).localeCompare(a.date + a.id)).slice(0, 3).map((r) => <li key={r.id}><b>{r.date.split("-").reverse().join("/")}</b> · {r.situation}{r.emotion ? ` (${r.emotion})` : ""}</li>)}
            </ul>
            <div className="row noprint"><Button to="/pour-la-suite/carnet" variant="soft" icon="pencil">Ouvrir mon carnet</Button></div>
          </>
        )}
      </Section>

      <Section className="alt" eyebrow="Mes mots" title="Mes notes">
        {noteList.length === 0 ? <p>Mes notes écrites dans les rubriques « À faire maintenant » apparaîtront ici.</p> : (
          <ul className="me-notes">
            {noteList.map(({ k, v, m }) => (
              <li key={k}>
                <p className="eyebrow">{m.to ? <Link to={m.to}>{m.label}</Link> : m.label}</p>
                <p>{v}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section className="noprint" eyebrow="Mes données" title="Sauvegarder, restaurer, effacer">
        <div className="me-data">
          <Card>
            <h3><Icon name="download" size={22} /> Sauvegarder dans un fichier</h3>
            <p className="small muted">Pour garder mes notes en changeant de téléphone ou de navigateur, ou si je vide les données de mon navigateur. Le fichier se crée sur mon appareil, rien n’est envoyé nulle part.</p>
            <Button icon="download" onClick={exportAll}>Télécharger ma sauvegarde</Button>
          </Card>
          <Card>
            <h3><Icon name="save" size={22} /> Restaurer une sauvegarde</h3>
            <p className="small muted">Je choisis un fichier créé par ce site. Il remplace ce qui est enregistré sur cet appareil.</p>
            <input ref={fileRef} id="me-file" type="file" accept="application/json,.json" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
            <label htmlFor="me-file" className="btn btn-soft"><Icon name="plus" size={20} /><span>Choisir un fichier</span></label>
            {pending != null && (
              <Callout tone="care" title="Ce fichier va remplacer mes données actuelles" icon="info" className="mt">
                <p>Continuer ?</p>
                <div className="row"><Button onClick={apply}>Oui, restaurer</Button><Button variant="ghost" onClick={() => { setPending(null); if (fileRef.current) fileRef.current.value = ""; }}>Non</Button></div>
              </Callout>
            )}
          </Card>
          <Card>
            <h3><Icon name="print" size={22} /> Imprimer mon espace</h3>
            <p className="small muted">Pour l’apporter en séance : seules mes données s’impriment, sans les menus.</p>
            <Button variant="soft" icon="print" onClick={() => printPage()}>Imprimer</Button>
          </Card>
          <Card>
            <h3><Icon name="trash" size={22} /> Tout effacer</h3>
            <p className="small muted">Supprime de cet appareil mes schémas gardés, cartes, plan, carnet et notes. Mes réglages d’affichage restent. Je télécharge d’abord une sauvegarde si je veux pouvoir revenir en arrière.</p>
            {!erase ? <Button variant="ghost" icon="trash" onClick={() => setErase(true)}>Effacer mes données</Button>
              : <div className="row"><Button variant="danger" onClick={() => { clearPersonalData(); setErase(false); setMsg("Données effacées de cet appareil."); navigate("/mon-espace"); }}>Oui, tout effacer</Button><Button variant="ghost" onClick={() => setErase(false)}>Annuler</Button></div>}
          </Card>
        </div>
        <p className="small mt" role="status" aria-live="polite">{msg}</p>
      </Section>
    </Page>
  );
}
