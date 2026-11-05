import { useMemo } from "react";
import { LessonPlayer } from "../learn/LessonPlayer";
import { dueToday, LESSONS, nextToDo } from "../learn/lessons";
import { lessonState } from "../learn/progress";
import type { Card } from "../learn/types";
import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";

/** « Mon rappel du jour » : trois questions des leçons déjà faites, les moins bien retenues d'abord. */
export default function Rappel() {
  const cards = useMemo<Card[]>(() => {
    const due = dueToday(3);
    if (!due.length) return [];
    return [
      ...due.map((b, i): Card => ({ id: `r${i}-${b.quiz.id}`, kind: "rappel", title: `Rappel ${i + 1} sur ${due.length}`, quiz: b.quiz, from: b.label })),
      { id: "fin", kind: "end", title: "C’est fait pour aujourd’hui",
        body: ["Les idées retrouvées reviendront plus tard, de plus en plus espacées.", "Celles à revoir reviendront demain."],
        primary: { to: "/apprendre", label: "Voir mon parcours", icon: "route" },
        links: [{ to: "/", label: "Retour à l’accueil", icon: "home" }] },
    ];
  }, []);

  if (!cards.length) return <Empty />;
  return <LessonPlayer storeKey="rappel" path="/rappel" title="Mon rappel du jour" kicker="Quelques questions, une minute" cards={cards} exitTo="/" record={false} />;
}

function Empty() {
  const st = lessonState.use();
  const doneN = LESSONS.filter((l) => st[l.id]?.done).length;
  const next = nextToDo(st);
  return (
    <Page title="Mon rappel du jour">
      <div className="wrap-narrow page-pad">
        <div className="empty">
          <span className="empty-ic" aria-hidden="true"><Icon name="star" size={30} /></span>
          <h1>Mon rappel du jour</h1>
          {doneN === 0
            ? <p>Les rappels commencent après ma première leçon : ils reprennent ses questions, à des moments espacés.</p>
            : <p>Rien à revoir aujourd’hui : tout ce que j’ai vu est à jour. Les prochains rappels arriveront les jours suivants.</p>}
          <div className="row">
            {next && <Link to={`/apprendre/${next.id}`} className="btn btn-primary"><span>{doneN === 0 ? "Commencer la première leçon" : `Leçon suivante : ${next.title}`}</span><Icon name="arrowRight" size={20} /></Link>}
            <Link to="/" className="btn btn-ghost"><Icon name="home" size={20} /><span>Accueil</span></Link>
          </div>
        </div>
      </div>
    </Page>
  );
}
