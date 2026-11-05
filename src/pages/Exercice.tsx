import { useMemo, useState } from "react";
import { LessonPlayer } from "../learn/LessonPlayer";
import { EXERCICES } from "../learn/content/exercices";
import { exoRatings, lessonState } from "../learn/progress";
import type { Card } from "../learn/types";
import { deepFr } from "../lib/typo";

/** Exercice guidé (imagerie ou chaises), une étape par écran. On peut le refaire autant de fois qu'on veut. */
export default function Exercice({ kind }: { kind: "imagerie" | "chaises" }) {
  const ex = EXERCICES[kind];
  // Nouvelle séance : on repart d'une échelle vide (les notes « avant / après » d'une autre fois ne comptent pas).
  useState(() => {
    if ((lessonState.get()[ex.id]?.pos ?? 0) === 0) exoRatings.set((x) => ({ ...x, [`${kind}-avant`]: null, [`${kind}-apres`]: null }));
    return true;
  });
  const cards = useMemo<Card[]>(() => [
    ...ex.cards,
    deepFr<Card>({
      id: "fin", kind: "end", title: "Exercice terminé",
      body: ["Bravo d’avoir essayé : c’est ainsi que l’adulte sain se renforce, un peu à chaque fois.", "Je peux recopier ma phrase d’adulte sain sur ma carte-mémo, ou noter ce qui s’est passé dans mon carnet."],
      primary: { to: "/outils/carte-memo", label: "Ma carte-mémo", icon: "copy" },
      links: [
        { to: "/outils/carnet", label: "Mon carnet", icon: "pencil" },
        { to: `/apprendre/${kind}`, label: kind === "imagerie" ? "Comprendre l’imagerie" : "Comprendre le dialogue des chaises", icon: "book" },
        { to: "/outils/pause", label: "La pause en trois temps", icon: "wind" },
      ],
    }),
  ], [ex, kind]);
  return <LessonPlayer storeKey={ex.id} path={`/outils/${kind}`} title={ex.title} kicker="Exercice guidé, une dizaine de minutes" cards={cards} exitTo="/outils" />;
}
