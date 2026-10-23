import raw from "./schemas.generated.json";
import { deepFr } from "../lib/typo";
import type { BaseId, SchemaData } from "./types";

export const SCHEMAS: SchemaData[] = deepFr(raw as unknown as SchemaData[]);

export const schemaBySlug = (slug: string): SchemaData | undefined => SCHEMAS.find((s) => s.slug === slug);
export const schemasOfBase = (b: BaseId): SchemaData[] => SCHEMAS.filter((s) => s.base === b);
export function neighbours(slug: string): { prev?: SchemaData; next?: SchemaData } {
  const i = SCHEMAS.findIndex((s) => s.slug === slug);
  return { prev: SCHEMAS[i - 1], next: SCHEMAS[i + 1] };
}
