// Construit le site statique dans dist/ avec esbuild.
//   BASE_PATH=/Autosoin_Schemas_de_Pensees/ node scripts/build.mjs     (GitHub Pages, site de projet)
//   SITE_INDEXABLE=1 pour autoriser les moteurs de recherche (par défaut : noindex).
import * as esbuild from "esbuild";
import { rm, mkdir, cp, readFile, writeFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = (...a) => path.join(root, ...a);

export function normBase(raw = "/") {
  return ("/" + raw.replace(/^\/+|\/+$/g, "") + "/").replace("//", "/");
}

async function listFiles(dir, prefix = "") {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = prefix + e.name;
    if (e.isDirectory()) out.push(...(await listFiles(path.join(dir, e.name), rel + "/")));
    else out.push(rel);
  }
  return out;
}

export async function writeShell({ outDir, base, dev, js, css, buildId }) {
  const indexable = process.env.SITE_INDEXABLE === "1";
  // polices auto-hébergées : on ne déclare que celles qui existent
  const fontDir = p("public", "fonts");
  let fontsCss = "";
  if (existsSync(path.join(outDir, "fonts.css"))) fontsCss = `<link rel="stylesheet" href="${base}fonts.css">`;
  let html = await readFile(p("src", "index.html"), "utf8");
  html = html
    .replaceAll("{{BASE}}", base)
    .replace("{{ROBOTS}}", indexable ? "index, follow" : "noindex, nofollow")
    .replace("{{FONTS}}", fontsCss)
    .replace("{{CSS}}", css.map((f) => `<link rel="stylesheet" href="${base}${f}">`).join("\n    "))
    .replace("{{JS}}", js.map((f) => `<script type="module" src="${base}${f}"></script>`).join("\n    "));
  await writeFile(path.join(outDir, "index.html"), html);
  await writeFile(path.join(outDir, "404.html"), html); // repli SPA pour GitHub Pages
  const manifest = {
    name: "Comprendre ses schémas",
    short_name: "Mes schémas",
    description: "Psychoéducation et auto-soin en vue d’une thérapie des schémas.",
    lang: "fr",
    start_url: base,
    scope: base,
    display: "standalone",
    background_color: "#F7F4EE",
    theme_color: "#235F73",
    icons: [
      { src: `${base}icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}icons/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${base}icons/maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
  await writeFile(path.join(outDir, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));
  if (!dev) {
    const all = (await listFiles(outDir)).filter((f) => !/^(sw\.js|404\.html)$/.test(f) && !f.endsWith(".map"));
    const pre = all.map((f) => (f === "index.html" ? base : base + f));
    let sw = await readFile(p("src", "sw.template.js"), "utf8");
    sw = sw.replace("__CACHE__", JSON.stringify("autosoin-" + buildId)).replace("__PRECACHE__", JSON.stringify(pre)).replace("__BASE__", JSON.stringify(base));
    await writeFile(path.join(outDir, "sw.js"), sw);
  }
}

export async function buildOptions({ dev = false, outDir, base }) {
  const buildId = String(Date.now());
  return {
    entryPoints: [p("src", "main.tsx")],
    bundle: true,
    outdir: path.join(outDir, "assets"),
    entryNames: dev ? "[name]" : "[name]-[hash]",
    chunkNames: "chunks/[name]-[hash]",
    assetNames: "media/[name]-[hash]",
    format: "esm",
    splitting: true,
    target: ["es2022", "chrome105", "safari15.4", "firefox105"],
    jsx: "automatic",
    minify: !dev,
    sourcemap: dev ? "inline" : false,
    legalComments: "none",
    metafile: true,
    loader: { ".svg": "dataurl", ".png": "file", ".jpg": "file", ".woff2": "file" },
    define: {
      "process.env.NODE_ENV": JSON.stringify(dev ? "development" : "production"),
      __BASE__: JSON.stringify(base),
      __BUILD_ID__: JSON.stringify(buildId),
    },
    logLevel: "info",
  };
}

function entryFiles(meta, outDir) {
  const js = [], css = [];
  for (const [file, info] of Object.entries(meta.outputs)) {
    if (!info.entryPoint) continue;
    const rel = path.relative(outDir, path.resolve(root, file)).split(path.sep).join("/");
    if (file.endsWith(".js")) { js.push(rel); if (info.cssBundle) css.push(path.relative(outDir, path.resolve(root, info.cssBundle)).split(path.sep).join("/")); }
  }
  return { js, css };
}

export async function copyPublic(outDir) {
  if (existsSync(p("public"))) await cp(p("public"), outDir, { recursive: true });
  // fonts.css généré d'après les fichiers présents
  const fdir = path.join(outDir, "fonts");
  if (existsSync(fdir)) {
    const files = (await readdir(fdir)).filter((f) => f.endsWith(".woff2"));
    if (files.length) {
      const css = await readFile(p("public", "fonts", "fonts.manifest.json"), "utf8").then(JSON.parse).catch(() => null);
      if (css) {
        await writeFile(path.join(outDir, "fonts.css"), css.map((f) => `@font-face{font-family:"${f.family}";font-style:${f.style};font-weight:${f.weight};font-display:swap;src:url("fonts/${f.file}") format("woff2");${f.range ? "unicode-range:" + f.range + ";" : ""}}`).join("\n"));
      }
    }
  }
}

async function main() {
  const base = normBase(process.env.BASE_PATH || "/");
  const outDir = p(process.env.OUT_DIR || "dist");
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await copyPublic(outDir);
  const opts = await buildOptions({ dev: false, outDir, base });
  const res = await esbuild.build(opts);
  const { js, css } = entryFiles(res.metafile, outDir);
  await writeShell({ outDir, base, dev: false, js, css, buildId: opts.define.__BUILD_ID__.replaceAll('"', "") });
  console.log(`✔ Site construit dans ${path.relative(root, outDir)}/ (base ${base})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
export { entryFiles };
