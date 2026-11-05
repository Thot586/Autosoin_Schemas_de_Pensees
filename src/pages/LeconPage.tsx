import { Page } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { chapterOf, lessonById } from "../learn/lessons";
import { LessonFull } from "../learn/LessonFull";
import NotFound from "./NotFound";

/** « Toute la leçon sur une page » : pour relire d'un coup d'œil, ou imprimer. */
export default function LeconPage({ id }: { id: string }) {
  const l = lessonById(id);
  if (!l) return <NotFound />;
  return (
    <Page title={`${l.title} (sur une page)`} tone={l.tone}>
      <div className="wrap-narrow page-pad">
        <Link to="/apprendre" className="back"><Icon name="arrowLeft" size={18} /> Mon parcours</Link>
        <p className="base-tag">{chapterOf(l).title}</p>
        <h1>{l.title}</h1>
        <p className="lead">{l.short}</p>
        <p><Link to={`/apprendre/${l.id}`} className="btn btn-primary"><Icon name="play" size={18} /><span>Faire la leçon, carte par carte</span></Link></p>
        <LessonFull lesson={l} />
      </div>
    </Page>
  );
}
