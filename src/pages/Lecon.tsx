import { useMemo } from "react";
import { LessonPlayer } from "../learn/LessonPlayer";
import { lessonById, lessonIndex, LESSONS, nextLessonAfter, openerFor } from "../learn/lessons";
import type { Card } from "../learn/types";
import { deepFr } from "../lib/typo";
import NotFound from "./NotFound";

/** Une leçon : petit rappel (si une leçon précédente est terminée), cartes, « À retenir », fin. */
export default function Lecon({ id }: { id: string }) {
  const lesson = lessonById(id);
  // Construite une seule fois : les réponses données pendant la leçon ne changent pas la suite des cartes.
  const cards = useMemo<Card[] | null>(() => {
    if (!lesson) return null;
    const out: Card[] = [];
    const op = openerFor(lesson.id);
    if (op) out.push({ id: "rappel", kind: "rappel", title: "Petit rappel", quiz: op.quiz, from: op.label });
    out.push(...lesson.cards);
    out.push({ id: "retenir", kind: "retain", title: "À retenir", items: lesson.retain, tone: lesson.tone });
    const next = nextLessonAfter(lesson.id);
    out.push(deepFr<Card>({
      id: "fin", kind: "end", title: "Leçon terminée",
      body: next
        ? ["Je peux continuer, ou m’arrêter là pour aujourd’hui.", "Les questions de cette leçon reviendront dans « Mon rappel du jour »."]
        : ["C’était la dernière leçon du parcours.", "Je peux maintenant retrouver mes schémas, un à la fois."],
      primary: next ? { to: `/apprendre/${next.id}`, label: `Leçon suivante : ${next.title}`, icon: "arrowRight" } : { to: "/trouver", label: "Retrouver mes schémas", icon: "search" },
      links: [{ to: "/", label: "M’arrêter là pour aujourd’hui", icon: "home" }, { to: "/apprendre", label: "Voir mon parcours", icon: "route" }],
    }));
    return out;
  }, [lesson]);
  if (!lesson || !cards) return <NotFound />;
  return (
    <LessonPlayer storeKey={lesson.id} path={`/apprendre/${lesson.id}`} title={lesson.title}
      kicker={`Leçon ${lessonIndex(lesson.id) + 1} sur ${LESSONS.length}`}
      cards={cards} tone={lesson.tone ?? "brand"} exitTo="/apprendre" />
  );
}
