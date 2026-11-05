import { Icon } from "../components/Icon";
import { CardBody, CardExtras } from "./Cards";
import type { Card, Lesson } from "./types";

/** Toute une leçon sur une seule page, pour relire ou pour l'accompagnant(e) (les questions sont retirées). */
export function LessonFull({ lesson, headingLevel = 2 }: { lesson: Lesson; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const cards = lesson.cards.filter((c): c is Card => c.kind !== "quiz" && c.kind !== "rappel" && c.kind !== "end");
  return (
    <div className="full">
      {cards.map((c) => (
        <section key={c.id} className={`full-card lcard-${c.kind} ${c.tone ? "tone-" + c.tone : ""}`}>
          <H className="full-h">{"icon" in c && c.icon && <Icon name={c.icon} size={22} />} {c.title}</H>
          <div className="lcard-body"><CardBody card={c} onPick={() => {}} /></div>
          <CardExtras card={c} />
        </section>
      ))}
      <section className="full-card full-retain">
        <H className="full-h"><Icon name="star" size={22} /> À retenir</H>
        <ul className="lc-retain">{lesson.retain.map((x, i) => <li key={i}><Icon name="star" size={20} /><span>{x}</span></li>)}</ul>
      </section>
    </div>
  );
}
