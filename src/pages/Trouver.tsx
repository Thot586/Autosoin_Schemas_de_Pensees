import { useMemo } from "react";
import { LessonPlayer } from "../learn/LessonPlayer";
import { ficheCards } from "../learn/Fiche";
import type { Card } from "../learn/types";
import { SCHEMAS } from "../data/schemas";
import { ticks, tickCount } from "../lib/state";

/** La fiche « Retrouver mes schémas », un schéma par écran. */
export default function Trouver() {
  const t = ticks.use();
  const base = useMemo(() => ficheCards(), []);
  const n = SCHEMAS.filter((s) => tickCount(t[s.slug]) > 0).length;
  const cards: Card[] = [
    ...base,
    { id: "fin", kind: "end", title: "Ma fiche est remplie",
      body: [n === 0 ? "Je n’ai rien coché : c’est possible. Je peux relire dans quelques semaines, ou en parler à mon thérapeute." : `J’ai coché au moins une case pour ${n} schéma${n > 1 ? "s" : ""}.`,
        "Prochaine étape : garder un à trois schémas, et choisir par lequel je commence."],
      primary: { to: "/trouver/priorites", label: "Voir mes priorités", icon: "arrowRight" },
      links: [{ to: "/schemas", label: "Mes schémas", icon: "layers" }] },
  ];
  return <LessonPlayer storeKey="fiche" path="/trouver" title="Retrouver mes schémas" kicker="Ma fiche à cocher" cards={cards} exitTo="/schemas" />;
}
