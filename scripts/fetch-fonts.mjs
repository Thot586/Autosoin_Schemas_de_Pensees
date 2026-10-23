// Télécharge Nunito Sans et Domine (licence SIL OFL) et les place dans public/fonts/ pour les auto-héberger.
// Aucune requête vers Google n'est faite par le site lui-même : c'est ce script, au moment de la construction.
//   npm run fonts
// Si le téléchargement échoue, le site fonctionne avec les polices du système.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dir = path.join(root, "public", "fonts");
const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,wght@0,400..800;1,400..800&family=Domine:wght@400..700&display=swap";
const KEEP = new Set(["latin", "latin-ext"]);

try {
  const css = await (await fetch(CSS_URL, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36" } })).text();
  const blocks = [...css.matchAll(/\/\*\s*([a-z-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)];
  if (!blocks.length) throw new Error("réponse inattendue");
  await mkdir(dir, { recursive: true });
  const manifest = [];
  for (const [, subset, body] of blocks) {
    if (!KEEP.has(subset)) continue;
    const family = /font-family:\s*'([^']+)'/.exec(body)[1];
    const style = /font-style:\s*(\w+)/.exec(body)[1];
    const weight = /font-weight:\s*([\d ]+)/.exec(body)[1].trim();
    const url = /src:\s*url\(([^)]+)\)/.exec(body)[1];
    const range = /unicode-range:\s*([^;]+)/.exec(body)?.[1].trim();
    const file = `${family.replace(/\s+/g, "")}-${style}-${subset}.woff2`;
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(path.join(dir, file), buf);
    manifest.push({ family, style, weight, file, range });
    console.log("✔", file, Math.round(buf.length / 1024), "Ko");
  }
  await writeFile(path.join(dir, "fonts.manifest.json"), JSON.stringify(manifest, null, 2));
} catch (e) {
  console.warn("⚠ Polices non téléchargées (" + e.message + "). Le site utilisera les polices du système.");
}
