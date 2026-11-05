import { useMemo } from "react";
import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { neighbours, schemaBySlug } from "../data/schemas";
import { baseById } from "../data/bases";
import { ticks, tickCount, retained } from "../lib/state";
import { lessonState } from "../learn/progress";
import { SCHEMA_PARTS, schemaLesson, type SchemaPartId } from "../learn/schemaLessons";
import { LessonPlayer } from "../learn/LessonPlayer";
import type { Card } from "../learn/types";
import NotFound from "./NotFound";
import { Terms } from "../learn/Rich";

/** Page d'un schéma : sa phrase, son besoin, et ses trois temps. */
export default function SchemaPage({ slug, tab }: { slug: string; tab?: string }) {
  const s = schemaBySlug(slug);
  if (!s) return <NotFound />;
  if (tab) {
    const t = tab === "dans-le-moment" ? "moment" : tab === "au-fil-des-semaines" ? "semaines" : tab;
    const part = SCHEMA_PARTS.find((p) => p.id === t);
    return part ? <SchemaPart slug={slug} part={part.id} /> : <NotFound />;
  }
  return <SchemaHub slug={slug} />;
}

function SchemaHub({ slug }: { slug: string }) {
  const s = schemaBySlug(slug)!;
  const b = baseById(s.base);
  const st = lessonState.use();
  const t = ticks.use();
  const kept = retained.use();
  const n = tickCount(t[slug]);
  const { prev, next } = neighbours(slug);
  return (
    <Page title={s.name} tone={`b${s.base}`}>
      <div className="wrap-narrow page-pad">
        <Link to="/schemas" className="back"><Icon name="arrowLeft" size={18} /> Mes schémas</Link>
        <p className="base-tag"><span className="w-bases-n">{b.id}</span> {b.name}</p>
        <h1>{s.name}</h1>
        <blockquote className="lc-quote lc-quote-xl"><p>{s.phrase}</p></blockquote>
        <Terms><p className="lead">Le besoin derrière : {s.besoin}</p></Terms>
        {(n > 0 || kept.includes(slug)) && (
          <p className="small muted">
            {n > 0 && <>Sur ma fiche : {n} case{n > 1 ? "s" : ""} sur 3. </>}
            {kept.includes(slug) && <>Je l’ai gardé dans mes priorités.</>}
          </p>
        )}

        <h2 className="h-sec">En trois temps</h2>
        <ol className="parts">
          {SCHEMA_PARTS.map((p, i) => {
            const ps = st[`schema:${slug}:${p.id}`];
            return (
              <li key={p.id}>
                <Link to={`/schemas/${slug}/${p.id}`} className={`part ${ps?.done ? "is-done" : ""}`}>
                  <span className="part-n">{ps?.done ? <Icon name="check" size={20} /> : i + 1}</span>
                  <span className="part-t"><b>{p.label}</b><span>{p.short}</span><small>Environ {p.minutes} minutes{ps?.done ? " · déjà lu" : (ps?.pos ?? 0) > 0 ? " · commencé" : ""}</small></span>
                  <Icon name="chevronRight" size={22} />
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="row mt">
          <Link to={`/outils/carte-memo?schema=${slug}`} className="btn btn-soft"><Icon name="copy" size={20} /><span>Ma carte-mémo pour ce schéma</span></Link>
        </div>

        <nav className="pager" aria-label="Autres schémas">
          {prev ? <Link to={`/schemas/${prev.slug}`} className="pager-l"><Icon name="arrowLeft" size={18} /><span><small>Précédent</small>{prev.name}</span></Link> : <span />}
          {next ? <Link to={`/schemas/${next.slug}`} className="pager-r"><span><small>Suivant</small>{next.name}</span><Icon name="arrowRight" size={18} /></Link> : <span />}
        </nav>
      </div>
    </Page>
  );
}

function SchemaPart({ slug, part }: { slug: string; part: SchemaPartId }) {
  const s = schemaBySlug(slug)!;
  const lesson = schemaLesson(slug, part)!;
  const idx = SCHEMA_PARTS.findIndex((p) => p.id === part);
  const meta = SCHEMA_PARTS[idx];
  const nextPart = SCHEMA_PARTS[idx + 1];
  const cards = useMemo<Card[]>(() => [
    ...lesson.cards,
    { id: "retenir", kind: "retain", title: "À retenir", items: lesson.retain },
    { id: "fin", kind: "end", title: `${meta.label} : c’est lu`,
      body: nextPart ? [`Prochain temps : « ${nextPart.label} ».`, "Je peux aussi m’arrêter là : je reprendrai quand je veux."] : ["J’ai lu les trois temps de ce schéma.", "Je choisis un seul pas, et je le tente pendant une semaine."],
      primary: nextPart ? { to: `/schemas/${slug}/${nextPart.id}`, label: `Continuer : ${nextPart.label}`, icon: "arrowRight" } : { to: "/outils/plan", label: "Voir mon plan de la semaine", icon: "calendar" },
      links: [{ to: `/schemas/${slug}`, label: `Retour à « ${s.name} »`, icon: "arrowLeft" }, { to: "/", label: "M’arrêter là pour aujourd’hui", icon: "home" }] },
  ], [lesson, meta, nextPart, slug, s.name]);
  return (
    <LessonPlayer storeKey={`schema:${slug}:${part}`} path={`/schemas/${slug}/${part}`} title={s.name} kicker={`Temps ${idx + 1} sur 3 : ${meta.label.charAt(0).toLowerCase()}${meta.label.slice(1)}`}
      cards={cards} tone={lesson.tone} exitTo={`/schemas/${slug}`} />
  );
}
