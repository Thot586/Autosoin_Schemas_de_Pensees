import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { BASES } from "../data/bases";
import { SCHEMAS, schemasOfBase } from "../data/schemas";
import { focusSchema, retained, ticks, tickCount } from "../lib/state";
import { lessonState } from "../learn/progress";
import { SCHEMA_PARTS } from "../learn/schemaLessons";

/** « Mes schémas » : retrouver les miens, puis les lire un par un. */
export default function Schemas() {
  const t = ticks.use();
  const kept = retained.use();
  const focus = focusSchema.use();
  const st = lessonState.use();
  const ticked = SCHEMAS.filter((s) => tickCount(t[s.slug]) > 0).length;
  const fichePos = st.fiche?.pos ?? 0;
  const partsDone = (slug: string) => SCHEMA_PARTS.filter((p) => st[`schema:${slug}:${p.id}`]?.done).length;

  return (
    <Page title="Mes schémas">
      <div className="wrap page-pad">
        <h1>Mes schémas</h1>
        <p className="lead">Quinze schémas. Je repère ceux qui me parlent, puis je commence par un seul.</p>

        <section className="hub-cards" aria-label="Retrouver mes schémas">
          <Link to="/trouver" className="act-card tone-brand">
            <span className="act-ic"><Icon name="check" size={26} /></span>
            <span className="act-t">
              <b>{st.fiche?.done ? "Revoir ma fiche à cocher" : fichePos > 0 ? "Reprendre ma fiche à cocher" : "Retrouver mes schémas"}</b>
              <span>Un schéma par écran, trois cases. Environ 10 minutes. Ni test, ni diagnostic.</span>
              {ticked > 0 && <small>{ticked} schéma{ticked > 1 ? "s" : ""} avec au moins une case.</small>}
            </span>
            <Icon name="arrowRight" size={24} className="act-go" />
          </Link>
          {(ticked > 0 || kept.length > 0) && (
            <Link to="/trouver/priorites" className="act-card">
              <span className="act-ic"><Icon name="flag" size={26} /></span>
              <span className="act-t"><b>Mes priorités</b><span>Je garde un à trois schémas, et je choisis par lequel je commence.</span></span>
              <Icon name="arrowRight" size={24} className="act-go" />
            </Link>
          )}
        </section>

        {kept.length > 0 && (
          <section className="kept" aria-labelledby="kept-h">
            <h2 id="kept-h" className="h-sec">Mes schémas gardés</h2>
            <ul className="srows">
              {kept.map((slug) => {
                const s = SCHEMAS.find((x) => x.slug === slug)!;
                return <SchemaRow key={slug} slug={slug} name={s.name} phrase={s.phrase} base={s.base} done={partsDone(slug)} focus={focus === slug} />;
              })}
            </ul>
          </section>
        )}

        <h2 className="h-sec">Les 15 schémas</h2>
        <p className="muted">Regroupés selon le besoin dont ils naissent. Chacun se lit en trois temps : comprendre, dans le moment, au fil des semaines.</p>
        {BASES.map((b) => (
          <section key={b.id} className={`sgroup tone-b${b.id}`} aria-labelledby={`sg-${b.id}`}>
            <h3 id={`sg-${b.id}`} className="sgroup-h"><span className="w-bases-n">{b.id}</span>{b.name}</h3>
            <ul className="srows">
              {schemasOfBase(b.id).map((s) => <SchemaRow key={s.slug} slug={s.slug} name={s.name} phrase={s.phrase} base={s.base} done={partsDone(s.slug)} ticks={tickCount(t[s.slug])} />)}
            </ul>
          </section>
        ))}
      </div>
    </Page>
  );
}

function SchemaRow({ slug, name, phrase, base, done, ticks: n, focus }: { slug: string; name: string; phrase: string; base: number; done: number; ticks?: number; focus?: boolean }) {
  return (
    <li>
      <Link to={`/schemas/${slug}`} className={`srow tone-b${base}`}>
        <span className="srow-t">
          <b>{name}{focus && <span className="tag">Je commence par lui</span>}</b>
          <span>{phrase}</span>
        </span>
        <span className="srow-s">
          {n !== undefined && n > 0 && <span className="dots" role="img" aria-label={`${n} case${n > 1 ? "s" : ""} cochée${n > 1 ? "s" : ""} sur 3`}>{[0, 1, 2].map((j) => <i key={j} className={j < n ? "on" : ""} />)}</span>}
          {done > 0 && <small>{done}/3 lu{done > 1 ? "s" : ""}</small>}
          <Icon name="chevronRight" size={20} />
        </span>
      </Link>
    </li>
  );
}
