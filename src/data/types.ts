export type BaseId = 1 | 2 | 3 | 4 | 5;

export interface SchemaData {
  slug: string; name: string; base: BaseId;
  phrase: string; besoin: string; origine: string[]; sensible: string; servait: string;
  contextes: { label: string; text: string }[];
  facons: { title: string; text: string }[];
  prudence: string;
  recap: { situations: string[]; pousse: string };
  moment: { scene: string; voice: string; reaction: string; steps: { title: string; text: string }[]; phrase: string };
  semaines: { steps: { level: string; text: string }[]; others: string; trap: string; sign: string };
  pro: { comprendre: string[]; moment: string[]; semaines: string[] };
  autosoin: { comprendre: string; moment: string; semaines: string };
}

export type AnimId = "lunettes" | "marches" | "verre" | "journee" | "vague";

export interface BaseData {
  id: BaseId; slug: string; name: string; domain: string;
  besoins: string[]; manque: string;
  extra?: string;
  quotidien: Record<string, string>;   // schéma → « Au quotidien : … »
  pro: string; autosoin: string;
  anim: { id: AnimId; titre: string; explication: string; essai: string };
}

export interface Part { n: number; slug: string; path: string; title: string; short: string; intro: string; minutes: number }
