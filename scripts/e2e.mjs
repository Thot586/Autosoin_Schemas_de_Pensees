// Test de bout en bout : parcourt toutes les pages (téléphone et ordinateur) puis rejoue les parcours qui écrivent des données.
//   npm run build && npm run test:e2e
// Nécessite Playwright (non installé par défaut, pour garder le dépôt léger) :
//   npm i -D playwright && npx playwright install chromium
import { createRequire } from "node:module";
import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serve } from "./serve.mjs";

let chromium;
try { ({ chromium } = createRequire(import.meta.url)("playwright")); }
catch { console.error("Playwright est absent : npm i -D playwright && npx playwright install chromium"); process.exit(2); }

const PORT = 4190;
const server = await serve(fileURLToPath(new URL("../dist", import.meta.url)), PORT, "/");
const origin = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch();
let failures = 0;
const check = (cond, msg) => { if (!cond) failures++; console.log((cond ? "✔ " : "✗ ") + msg); };

// 1. Toutes les pages : pas d'erreur console, pas de débordement horizontal, un titre h1, pas de page 404.
for (const [name, w, h] of [["téléphone", 390, 844], ["ordinateur", 1366, 900], ["écran géant", 3840, 2160]]) {
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
    await page.waitForSelector("h1", { timeout: 8000 }).catch(() => {}); // la page se charge à la demande : on attend son titre
    const info = await page.evaluate(() => ({
      h1: document.querySelector("h1")?.textContent?.trim(),
      overflow: document.documentElement.scrollWidth - innerWidth,
      notFound: !!document.querySelector(".notfound"),
      links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((x) => x && x.startsWith("/") && !x.startsWith("//")),
    }));
    for (const l of info.links) { const p = l.split("#")[0].split("?")[0]; if (p && !seen.has(p) && !/\.(ics|json|csv|png|svg|webmanifest|pdf|docx)$/.test(p)) queue.push(p); }
    if (!info.h1 || info.overflow > 1 || info.notFound || errs.length) { bad++; check(false, `${name} ${r} : ${JSON.stringify({ h1: info.h1, overflow: info.overflow, notFound: info.notFound, errs: errs.slice(0, 3) })}`); }
  }
  check(bad === 0, `${name} : ${seen.size} pages parcourues, ${bad} problème(s)`);
  await ctx.close();
}

// 2. Une leçon en entier : questions, « À retenir », fin ; puis l'accueil et le rappel du jour.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(origin + "/apprendre/bienvenue", { waitUntil: "networkidle" });
  check(await page.locator(".header").isHidden(), "leçon : mode concentration (en-tête masqué)");
  for (let k = 0; k < 30; k++) {
    if (await page.locator(".lcard-end").count()) break;
    if (await page.locator(".lcard-quiz").count()) await page.locator(".quiz-o").first().click();
    const nav = await page.locator(".lesson-nav").boundingBox();
    if (k === 0) check(!!nav && nav.y + nav.height <= 844 + 1, "leçon : barre Retour / Suivant visible en bas de l'écran");
    await page.click(".lesson-next");
  }
  check(await page.locator(".lcard-end").count() === 1, "leçon : carte de fin atteinte");
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem("autosoin:v1:lecons") || "{}"));
  check(!!st.bienvenue?.done, "leçon : marquée terminée");
  const q = await page.evaluate(() => JSON.parse(localStorage.getItem("autosoin:v1:rappels") || "{}"));
  check(Object.keys(q).length === 2, "leçon : deux réponses gardées pour les rappels");
  await page.goto(origin + "/", { waitUntil: "networkidle" });
  check(await page.locator(".next-lesson h2").innerText() === "La thérapie des schémas", "accueil : propose la leçon suivante");
  await page.goto(origin + "/apprendre/therapie", { waitUntil: "networkidle" });
  check(await page.locator(".lcard-rappel").count() === 1, "leçon suivante : commence par un petit rappel");
  await page.goto(origin + "/trouver", { waitUntil: "networkidle" });
  await page.click(".lesson-next"); await page.click(".lesson-next");
  await page.locator(".fiche-c").nth(0).click(); await page.locator(".fiche-c").nth(2).click();
  const t = await page.evaluate(() => JSON.parse(localStorage.getItem("autosoin:v1:ticks") || "{}"));
  check(t["carence-affective"]?.vrai && t["carence-affective"]?.cout && !t["carence-affective"]?.souvent, "fiche : deux repères cochés pour le premier schéma");
  await ctx.close();
}

// 3. Toutes les cartes : chaque leçon, chaque temps de chaque schéma, la fiche, et chaque étape d'animation.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  let errs = [];
  page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errs.push(m.text()); });
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(origin + "/apprendre", { waitUntil: "networkidle" });
  const lessons = await page.$$eval("a.lrow", (as) => as.map((a) => a.getAttribute("href")));
  await page.goto(origin + "/schemas", { waitUntil: "networkidle" });
  const schemas = [...new Set(await page.$$eval(".sgroup a.srow", (as) => as.map((a) => a.getAttribute("href"))))];
  const routes = [...lessons, ...schemas.flatMap((h) => ["comprendre", "moment", "semaines"].map((p) => `${h}/${p}`)), "/trouver", "/outils/imagerie", "/outils/chaises"];
  let cards = 0, steps = 0, bad = 0;
  for (const r of routes) {
    errs = [];
    await page.goto(origin + r, { waitUntil: "networkidle" });
    let navOk = true, reached = false;
    for (let k = 0; k < 60; k++) {
      await page.waitForSelector(".lcard");
      cards++;
      if (await page.locator(".lcard-end").count()) { reached = true; break; }
      const nav = await page.locator(".lesson-nav").boundingBox();
      if (!nav || nav.y + nav.height > 844 + 1) navOk = false;
      if (await page.locator(".lcard-anim, .lcard-widget .player").count()) {
        const fwd = page.locator('.pc-btn[aria-label="Étape suivante"]');
        for (let j = 0; j < 9 && (await fwd.isEnabled()); j++) { await fwd.click(); steps++; }
      }
      if (await page.locator(".lcard-gate").count()) {
        if (!(await page.locator(".lesson-next").isDisabled())) { bad++; check(false, `${r} : la carte d’entrée laisse passer sans cocher`); }
        for (const b of await page.locator(".gate .fiche-c").all()) await b.click();
      }
      if (await page.locator(".quiz-o").count()) await page.locator(".quiz-o").first().click();
      await page.click(".lesson-next");
    }
    if (!reached || !navOk || errs.length) { bad++; check(false, `${r} : ${JSON.stringify({ fin: reached, barre: navOk, errs: errs.slice(0, 3) })}`); }
  }
  check(bad === 0 && routes.length >= 22 + 45 + 3, `toutes les cartes : ${routes.length} parcours, ${cards} cartes, ${steps} étapes d’animation, ${bad} problème(s)`);
  await ctx.close();
}

// 3 bis. Exercice : à 8 sur 10 avant de commencer, « Suivant » est bloqué et propose la pause.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(origin + "/outils/imagerie", { waitUntil: "networkidle" });
  check(await page.locator(".lcard h2").innerText() === "À savoir avant d’essayer", "exercice : commence par un avertissement");
  await page.click(".lesson-next");
  check((await page.locator(".lc-links a").count()) >= 2, "exercice : puis une carte d’orientation (soutien, numéros)");
  await page.click(".lesson-next");
  for (const b of await page.locator(".gate .fiche-c").all()) await b.click();
  await page.click(".lesson-next");
  await page.locator(".w-scale input[type=range]").fill("8");
  check(await page.locator(".lesson-next").isDisabled() && (await page.locator(".lesson-next").innerText()).includes("pause"), "exercice : à 8 sur 10, « Suivant » bloqué, la pause est proposée");
  await page.locator(".w-scale input[type=range]").fill("3");
  check(!(await page.locator(".lesson-next").isDisabled()), "exercice : à 3 sur 10, on peut continuer");
  await ctx.close();
}

// 4. Carnet, sauvegarde, restauration, effacement.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const tmp = mkdtempSync(path.join(tmpdir(), "autosoin-"));
  await page.goto(origin + "/outils/carnet", { waitUntil: "networkidle" });
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
