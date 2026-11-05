import type { IconName } from "../components/Icon";
import type { BaseId } from "../data/types";

/** Couleur d'une carte : la marque, l'aide, ou l'une des cinq bases (une couleur par besoin, comme dans le diaporama). */
export type Tone = "brand" | "care" | `b${BaseId}`;

/** Animations disponibles (lecteur pas à pas). */
export type AnimKey =
  | "lunettes" | "marches" | "verre" | "journee" | "vague"
  | "cercle" | "adulte"
  | "parapluie" | "reactions" | "therapie";

/** Petits exercices interactifs intégrés à une carte. */
export type WidgetKey = "lunettes-demo" | "age" | "numeros" | "bases" | "quinze" | "respiration";

/** Une question de quiz : elle porte sur une idée du support, jamais sur la personne. */
export interface QuizItem {
  id: string;
  q: string;
  options: string[];
  answer: number;
  /** Explication montrée après la réponse, qu'elle soit juste ou non. */
  explain: string;
}

export interface LinkItem { to: string; label: string; icon?: IconName; hint?: string }

interface CardBase {
  id: string;
  title: string;
  tone?: Tone;
  /** Repère pour l'accompagnant(e) (mode accompagnant). */
  pro?: string;
  /** Détail facultatif, replié par défaut (« En savoir plus »). */
  more?: { label?: string; body: string[] };
}

/**
 * Texte riche minimal dans les chaînes :
 *   [[id|mot]]  → mot du glossaire (ouvre la définition)
 *   **gras**    → mise en avant
 */
export type Card =
  | (CardBase & {
      kind: "text"; icon?: IconName; body?: string[]; list?: string[]; after?: string[]; quote?: string; quoteLabel?: string;
      /** Propose de mettre ce geste dans « Mon plan de la semaine ». */
      plan?: { slug: string; geste: string };
    })
  | (CardBase & { kind: "tiles"; body?: string[]; tiles: { icon?: IconName; title: string; text: string; tone?: Tone }[] })
  | (CardBase & { kind: "steps"; body?: string[]; steps: { title: string; text: string }[]; foot?: string })
  | (CardBase & { kind: "anim"; anim: AnimKey; body?: string[] })
  | (CardBase & { kind: "widget"; widget: WidgetKey; body?: string[] })
  | (CardBase & { kind: "reflect"; body?: string[]; prompt: string; hint?: string; noteId: string })
  | (CardBase & { kind: "links"; icon?: IconName; body?: string[]; links: LinkItem[] })
  | (CardBase & { kind: "quiz"; quiz: QuizItem })
  | (CardBase & { kind: "fiche"; slug: string })
  | (CardBase & { kind: "retain"; items: string[] })
  | (CardBase & { kind: "rappel"; quiz: QuizItem; from: string })
  | (CardBase & { kind: "end"; body?: string[]; links: LinkItem[]; primary?: LinkItem });

export type ChapterId = "avant" | "comprendre" | "besoins" | "cercle" | "aide" | "action";

export interface Chapter { id: ChapterId; title: string; short: string; icon: IconName }

export interface Lesson {
  id: string;
  chapter: ChapterId;
  title: string;
  /** Une phrase : ce que j'apprends dans cette leçon. */
  short: string;
  minutes: number;
  tone?: Tone;
  icon?: IconName;
  cards: Card[];
  /** « À retenir » : deux ou trois phrases, reprises dans les rappels. */
  retain: string[];
}
