// Test de bout en bout : parcourt toutes les pages (téléphone et ordinateur) puis rejoue les parcours qui écrivent des données.
//   npm run build && npm run test:e2e
// Nécessite Playwright (non installé par défaut, pour garder le dépôt léger) :
//   npm i -D playwright && npx playwright install chromium
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { serve } from "./serve.mjs";

let chromium;
try { ({ chromium } = createRequire(import.meta.url)("playwright")); }
catch { console.error("Playwright est absent : npm i -D playwright && npx playwright install chromium"); process.exit(2); }

const PORT = 4190;
const server = await serve(new URL("../dist", import.meta.url).pathname, PORT, "/");
const origin = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch();
let failures = 0;
const check = (cond, msg) => { if (!cond) failures++; console.log((cond ? "✔ " : "✗ ") + msg); };

// 1. Toutes les pages : pas d'erreur console, pas de débordement horizontal, un titre h1, pas de page 404.
for (const [name, w, h] of [["téléphone", 390, 844], ["ordinateur", 1366, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  let errs = [];
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errs.push(m.text()); });
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("response", (r) => { if (r.status() >= 400) errs.push(`HTTP ${r.status()} ${r.url()}`); });
  const seen = new Set(); const queue = ["/"]; let bad = 0;
  while (queue.length) {
    const r = queue.shift();
    if (seen.has(r)) continue; seen.add(r); errs = [];
    await page.goto(origin + r, { waitUntil: "networkidle" });
    const info = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent?.trim(),
      overflow: document.documentElement.scrollWidth - innerWidth,
      notFound: !!document.querySelector(".notfound"),
      links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((x) => x && x.startsWith("/") && !x.startsWith("//")),
    }));
    for (const l of info.links) { const p = l.split("#")[0].split("?")[0]; if (p && !seen.has(p) && !/\.(ics|json|csv|png|svg|webmanifest)$/.test(p)) queue.push(p); }
    if (!info.h1 || info.overflow > 1 || info.notFound || errs.length) { bad++; check(false, `${name} ${r} : ${JSON.stringify({ h1: info.h1, overflow: info.overflow, notFound: info.notFound, errs: errs.slice(0, 3) })}`); }
  }
  check(bad === 0, `${name} : ${seen.size} pages parcourues, ${bad} problème(s)`);
  await ctx.close();
}

// 2. Carnet, sauvegarde, restauration, effacement.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const tmp = mkdtempSync(path.join(tmpdir(), "autosoin-"));
  await page.goto(origin + "/pour-la-suite/carnet", { waitUntil: "networkidle" });
  check(await page.locator("button[type=submit]").isDisabled(), "carnet : ajout impossible sans situation");
  await page.fill("#cn-sit", "Mon collègue ne répond pas");
  await page.fill("#cn-emo", "Inquiétude");
  await page.locator("#cn-lvl").fill("6");
  await page.click("button[type=submit]");
  const rows = await page.evaluate(() => JSON.parse(localStorage.getItem("autosoin:v1:carnet") || "[]"));
  check(rows.length === 1 && rows[0].emotion === "Inquiétude : 6", "carnet : ligne enregistrée");
  const [csv] = await Promise.all([page.waitForEvent("download"), page.click("text=Exporter (.csv)")]);
  await csv.saveAs(path.join(tmp, "carnet.csv"));
  check(readFileSync(path.join(tmp, "carnet.csv"), "utf8").includes("Inquiétude : 6"), "carnet : export CSV");

  await page.goto(origin + "/mon-espace", { waitUntil: "networkidle" });
  const [bk] = await Promise.all([page.waitForEvent("download"), page.click("text=Télécharger ma sauvegarde")]);
  const file = path.join(tmp, "sauvegarde.json");
  await bk.saveAs(file);
  check(JSON.parse(readFileSync(file, "utf8")).data.carnet.length === 1, "Mon espace : sauvegarde JSON");
  await page.click("text=Effacer mes données"); await page.click("text=Oui, tout effacer");
  check((await page.evaluate(() => localStorage.getItem("autosoin:v1:carnet"))) === null, "Mon espace : effacement");
  await page.setInputFiles("#me-file", file); await page.click("text=Oui, restaurer");
  check((await page.evaluate(() => JSON.parse(localStorage.getItem("autosoin:v1:carnet")).length)) === 1, "Mon espace : restauration");
  const bad = path.join(tmp, "autre.json"); writeFileSync(bad, JSON.stringify({ app: "autre", version: 1, data: {} }));
  await page.setInputFiles("#me-file", bad); await page.click("text=Oui, restaurer");
  check(await page.locator("text=ne vient pas de ce site").isVisible(), "Mon espace : un fichier étranger est refusé");
  await ctx.close();
}

await browser.close(); server.close();
console.log(failures ? `\n${failures} échec(s)` : "\nTout est vert.");
process.exit(failures ? 1 : 0);
