// Écrit docs/QUESTIONS.md : toutes les questions des leçons et des schémas, pour relecture.
//   npm run docs:questions
import * as esbuild from "esbuild";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const res = await esbuild.build({
  stdin: {
    contents: `export { LESSONS, CHAPTERS } from "./src/learn/lessons"; export { SCHEMA_PARTS, schemaQuizzes } from "./src/learn/schemaLessons"; export { SCHEMAS } from "./src/data/schemas";`,
    resolveDir: root, loader: "ts",
  },
  bundle: true, format: "esm", platform: "node", write: false, logLevel: "error",
  define: { __BASE__: '"/"', __BUILD_ID__: '"doc"' },
});
// Le code des données touche à window/localStorage au chargement : on fournit des doublures minimales.
globalThis.window = { addEventListener() {}, matchMedia: () => ({ matches: false, addEventListener() {} }) };
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const m = await import("data:text/javascript;base64," + Buffer.from(res.outputFiles[0].text).toString("base64"));

const L = "ABCDEFG";
const fmt = (q) => [
  `**${q.q}**`,
  "",
  ...q.options.map((o, i) => `- ${L[i]}. ${o}${i === q.answer ? " ✔" : ""}`),
  "",
  `> ${q.explain}`,
  "",
].join("\n");

let out = `# Les questions du parcours\n\nFichier produit automatiquement par \`npm run docs:questions\` : ne pas le modifier à la main, corriger les textes dans \`src/learn/content/\` ou \`src/learn/gen.ts\`.\n\nLes questions portent sur les idées du support, jamais sur la personne. Après chaque réponse, l’explication s’affiche ; une idée à revoir revient le lendemain dans « Mon rappel du jour ». ✔ = bonne réponse.\n\n`;
let n = 0;
for (const c of m.CHAPTERS) {
  out += `## ${c.title}\n\n`;
  for (const l of m.LESSONS.filter((x) => x.chapter === c.id)) {
    const qs = l.cards.filter((k) => k.kind === "quiz");
    out += `### ${l.title} (\`${l.id}\`)\n\n`;
    for (const k of qs) { out += fmt(k.quiz); n++; }
  }
}
out += `## Les 15 schémas (questions construites à partir des données du diaporama)\n\n`;
const seen = new Set();
for (const s of m.SCHEMAS) {
  out += `### ${s.name}\n\n`;
  for (const p of m.SCHEMA_PARTS) for (const q of m.schemaQuizzes(s.slug, p.id)) {
    if (seen.has(q.id)) { out += `*${p.label} : question commune « ${q.q} » (voir plus haut).*\n\n`; continue; }
    seen.add(q.id); out += `*${p.label}*\n\n` + fmt(q); n++;
  }
}
await writeFile(path.join(root, "docs", "QUESTIONS.md"), out);
console.log(`✔ docs/QUESTIONS.md : ${n} questions`);
