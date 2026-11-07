import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { CHAPTERS, LESSONS, lessonsOf, nextToDo, TOTAL_MINUTES } from "../learn/lessons";
import { lessonState } from "../learn/progress";

/** « Mon parcours » : six étapes, des leçons de 2 à 5 minutes. */
export default function Apprendre() {
  const st = lessonState.use();
  const done = LESSONS.filter((l) => st[l.id]?.done).length;
  const next = nextToDo(st);
  return (
    <Page title="Mon parcours">
      <div className="wrap page-pad">
        <h1>Mon parcours</h1>
        <p className="lead">{LESSONS.length} leçons de 2 à 5 minutes, en six étapes. Une par jour suffit, dans l’ordre si possible.</p>
        <div className="course-sum">
          <div className="meter" role="img" aria-label={`${done} leçons terminées sur ${LESSONS.length}`}><i style={{ width: `${(done / LESSONS.length) * 100}%` }} /></div>
          <p><b>{done}</b> leçon{done > 1 ? "s" : ""} terminée{done > 1 ? "s" : ""} sur {LESSONS.length} · environ {Math.round(TOTAL_MINUTES / 5) * 5} minutes en tout</p>
          {next && <Link to={`/apprendre/${next.id}`} className="btn btn-primary"><span>{(st[next.id]?.pos ?? 0) > 0 ? "Reprendre" : done === 0 ? "Commencer" : "Continuer"} : {next.title}</span><Icon name="arrowRight" size={20} /></Link>}
        </div>

        <ol className="chapters">
          {CHAPTERS.map((c, ci) => {
            const ls = lessonsOf(c.id);
            const cd = ls.filter((l) => st[l.id]?.done).length;
            return (
              <li key={c.id} className="chapter">
                <h2 className="chapter-h">
                  <span className="chapter-n" aria-hidden="true">{ci + 1}</span>
                  <span><span className="chapter-t">{c.title}</span><small>{c.short} · {cd} sur {ls.length}</small></span>
                </h2>
                <ol className="lessons">
                  {ls.map((l) => {
                    const s = st[l.id];
                    const state = s?.done ? "done" : (s?.pos ?? 0) > 0 ? "doing" : next?.id === l.id ? "next" : "todo";
                    return (
                      <li key={l.id}>
                        <Link to={`/apprendre/${l.id}`} className={`lrow is-${state} ${l.tone ? "tone-" + l.tone : ""}`}>
                          <span className="lrow-s" aria-hidden="true">{state === "done" ? <Icon name="check" size={18} /> : state === "doing" ? <Icon name="play" size={14} /> : <Icon name={l.icon ?? "book"} size={18} />}</span>
                          <span className="lrow-t">
                            <b>{l.title}</b>
                            <span>{l.short}</span>
                          </span>
                          <span className="lrow-m">
                            <small>{state === "done" ? "Terminée" : state === "doing" ? "En cours" : `${l.minutes} min`}</small>
                            <Icon name="chevronRight" size={20} />
                          </span>
                          <span className="sr-only">{state === "done" ? " (terminée)" : state === "doing" ? " (en cours)" : ` (${l.minutes} minutes)`}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </li>
            );
          })}
        </ol>
      </div>
    </Page>
  );
}
