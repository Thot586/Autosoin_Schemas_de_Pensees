import { BaseAnimation } from "../scenes/BaseScenes";
import { AdulteAnimation, CycleAnimation } from "../scenes/ConceptScenes";
import { ParapluieAnimation, ReactionsAnimation, TherapieAnimation } from "../scenes/NewScenes";
import type { AnimKey } from "./types";

export function Anim({ k, label }: { k: AnimKey; label: string }) {
  switch (k) {
    case "lunettes": case "marches": case "verre": case "journee": case "vague":
      return <BaseAnimation id={k} label={label} />;
    case "cercle": return <CycleAnimation />;
    case "adulte": return <AdulteAnimation />;
    case "parapluie": return <ParapluieAnimation />;
    case "reactions": return <ReactionsAnimation />;
    case "therapie": return <TherapieAnimation />;
  }
}
