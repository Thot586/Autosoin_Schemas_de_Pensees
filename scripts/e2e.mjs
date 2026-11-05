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
import { layoutProblems, readingProblems, contrastProblems } from "./layout-check.mjs";

let chromium;
try { ({ chromium } = createRequire(import.meta.url)("playwright")); }
catch { console.error("Playwright est absent : npm i -D playwright && npx playwright install chromium"); process.exit(2); }

const PORT = 4190;
const server = await serve(fileURLToPath(new URL("../dist", import.meta.url)), PORT, "/");
const origin = `http://127.0.0.1:${PORT}`;
const browser = await chromium.launch();
let failures = 0;
const check = (cond, msg) => { if (!cond) failures++; console.log((cond ? "✔ " : "✗ ") + msg); };

// 0. Motifs du glossaire : pas de « lookbehind » (Safari < 16.4 refuserait de charger l'application).
{
  const src = readFileSync(new URL("../src/data/glossaire.ts", import.meta.url), "utf8");
  check(!src.includes("(?<=") && !src.includes("(?<!"), "glossaire : motifs lisibles par les anciens Safari (pas de lookbehind)");
}

// Mise en page (scripts/layout-check.mjs) : ce qui bloque. « cible<44 » (zone de clic sous les 44 px recommandés,
// mais au-dessus des 24 px exigés) est seulement compté.
const BLOCK = new Set(["chevauchement", "collé", "déborde", "coupé", "décentré", "cible", "cibles", "sous-barre"]);
const layout = async (page, opts = {}) => {
  const all = await page.evaluate(layoutProblems, { minGap: 3, ...opts });
  return { bad: all.filter((p) => BLOCK.has(p.type)).map((p) => `${p.type} : ${p.a} / ${p.b}`), small: all.filter((p) => p.type === "cible<44").length };
};
const withTextSize = (ctx, size) => ctx.addInitScript((size) => { try { localStorage.setItem("autosoin:v1:prefs", JSON.stringify({ theme: "auto", motion: "auto", size, pro: true })); } catch {} }, size);

// 1. Toutes les pages : pas d'erreur console, pas de débordement horizontal, un titre h1, pas de page 404 ;
//    et rien qui se chevauche, se colle, déborde ou se cache sous une barre, du petit téléphone à l'écran 4K, texte agrandi compris.
//    Sur ordinateur et écran géant (thème sombre) : lignes de 80 signes au plus, contrastes du texte suffisants.
for (const [name, w, h, size, scheme] of [["petit téléphone", 320, 640], ["téléphone", 390, 844], ["téléphone, texte agrandi (140 %)", 390, 844, 1.4], ["ordinateur", 1366, 900], ["écran géant, thème sombre", 3840, 2160, 0, "dark"]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce", colorScheme: scheme ?? "light" });
  if (size) await withTextSize(ctx, size);
  const page = await ctx.newPage();
  let small = 0;
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
      // un mot expliqué est un bouton : jamais dans un lien, un autre bouton ou une étiquette
      nested: document.querySelectorAll("a .term, button .term, label .term, summary .term").length,
      // … ni dans une boîte qui couperait son infobulle (overflow autre que visible)
      clipped: [...document.querySelectorAll(".term")].filter((t) => {
        for (let a = t.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a); if (o.overflowX !== "visible" || o.overflowY !== "visible") return true; }
        return false;
      }).map((t) => t.textContent).slice(0, 3),
      links: [...document.querySelectorAll("a[href]")].map((a) => a.getAttribute("href")).filter((x) => x && x.startsWith("/") && !x.startsWith("//")),
    }));
    for (const l of info.links) { const p = l.split("#")[0].split("?")[0]; if (p && !seen.has(p) && !/\.(ics|json|csv|png|svg|webmanifest|pdf|docx)$/.test(p)) queue.push(p); }
    const lay = await layout(page); small += lay.small;
    if (w >= 1366) for (const p of [...(await page.evaluate(readingProblems, {})).filter((p) => p.type === "ligne longue"), ...(await page.evaluate(contrastProblems))]) lay.bad.push(`${p.type} : ${p.a} / ${p.b}`);
    if (!info.h1 || info.overflow > 1 || info.notFound || info.nested || info.clipped.length || errs.length || lay.bad.length) { bad++; check(false, `${name} ${r} : ${JSON.stringify({ h1: info.h1, overflow: info.overflow, notFound: info.notFound, nested: info.nested, clipped: info.clipped, errs: errs.slice(0, 3), mise_en_page: lay.bad.slice(0, 4) })}`); }
  }
  check(bad === 0, `${name} : ${seen.size} pages parcourues, ${bad} problème(s) (zones de clic entre 24 et 44 px : ${small})`);
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
  let cards = 0, steps = 0, terms = 0, bad = 0;
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
      const lay = await layout(page);
      if (await page.locator(".quiz-o").count()) { await page.locator(".quiz-o").first().click(); lay.bad.push(...(await layout(page)).bad); }
      if (lay.bad.length) { bad++; check(false, `${r} carte ${k + 1} : mise en page ${JSON.stringify(lay.bad.slice(0, 4))}`); }
      const tw = await page.evaluate(() => ({
        n: document.querySelectorAll(".lcard .term").length,
        nested: document.querySelectorAll("a .term, button .term, label .term, summary .term").length,
        dup: (() => { const ids = [...document.querySelectorAll(".lcard .term")].map((b) => b.closest(".term-w")?.querySelector(".term-tip")?.textContent); return ids.length - new Set(ids).size; })(),
        quiz: document.querySelectorAll(".lcard h2 .term, .quiz-q .term").length,  // la question ne souffle pas la réponse
        clip: [...document.querySelectorAll(".lcard .term")].filter((t) => {
          for (let a = t.parentElement; a && a !== document.body; a = a.parentElement) { const o = getComputedStyle(a); if (o.overflowX !== "visible" || o.overflowY !== "visible") return true; }
          return false;
        }).length,
      }));
      terms += tw.n;
      if (tw.nested || tw.dup || tw.clip || tw.quiz) { bad++; check(false, `${r} carte ${k + 1} : mot expliqué mal placé ou répété ${JSON.stringify(tw)}`); }
      await page.click(".lesson-next");
    }
    if (!reached || !navOk || errs.length) { bad++; check(false, `${r} : ${JSON.stringify({ fin: reached, barre: navOk, errs: errs.slice(0, 3) })}`); }
  }
  check(bad === 0 && routes.length >= 22 + 45 + 3, `toutes les cartes : ${routes.length} parcours, ${cards} cartes, ${steps} étapes d’animation, ${terms} mots expliqués, ${bad} problème(s)`);
  await ctx.close();

  // Les mêmes cartes sur ordinateur, sur petit téléphone et avec le texte agrandi : mise en page seulement.
  for (const [name, w, h, size] of [["ordinateur", 1366, 768], ["petit téléphone", 320, 640], ["téléphone, texte agrandi", 390, 844, 1.4]]) {
    const c2 = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
    if (size) await withTextSize(c2, size);
    const p2 = await c2.newPage();
    let n = 0, b2 = 0;
    for (const r of routes) {
      await p2.goto(origin + r, { waitUntil: "networkidle" });
      for (let k = 0; k < 60; k++) {
        await p2.waitForSelector(".lcard"); n++;
        const lay = await layout(p2);
        if (await p2.locator(".lcard-gate").count()) for (const b of await p2.locator(".gate .fiche-c").all()) await b.click();
        if (await p2.locator(".quiz-o").count()) { await p2.locator(".quiz-o").first().click(); lay.bad.push(...(await layout(p2)).bad); }
        if (lay.bad.length) { b2++; check(false, `${name} ${r} carte ${k + 1} : mise en page ${JSON.stringify(lay.bad.slice(0, 4))}`); }
        if (await p2.locator(".lcard-end").count()) break;
        await p2.click(".lesson-next");
      }
    }
    check(b2 === 0, `toutes les cartes, ${name} : ${n} cartes, ${b2} problème(s) de mise en page`);
    await c2.close();
  }
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

// 3 ter. Mots expliqués : survol = une phrase simple ; clic = le détail ; retour facile à la lecture.
{
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(origin + "/apprendre/therapie", { waitUntil: "networkidle" });
  for (let k = 0; k < 8 && !(await page.locator(".lcard h2").innerText()).includes("Est-ce que ça marche"); k++) await page.click(".lesson-next");
  const card = await page.locator(".lcard h2").innerText();
  const term = page.locator(".lcard .term").first();
  check(await term.count() === 1, "mots expliqués : un mot surligné sur la carte");
  await term.hover(); await page.waitForTimeout(600);
  const tip = page.locator(".lcard .term-tip").first();
  const tb = await tip.boundingBox();
  check(await tip.isVisible() && !!tb && tb.x >= 0 && tb.x + tb.width <= 1366, "mots expliqués : au survol, une phrase simple, dans l’écran");
  await term.click();
  const dlg = page.locator("dialog.glossary-sheet[open]");
  check(await dlg.isVisible() && (await dlg.locator(".glossary-short").innerText()).length > 10, "mots expliqués : au clic, le détail s’ouvre sur la page");
  await page.keyboard.press("Escape");
  check(!(await dlg.count()) && (await page.evaluate(() => document.activeElement?.classList.contains("term"))), "mots expliqués : Échap referme, le focus revient sur le mot");
  await term.click();
  await dlg.locator("text=Tous les mots").click();
  await page.waitForURL(/\/glossaire#/);
  const id = new URL(page.url()).hash.slice(1);
  await page.waitForFunction((x) => { const el = document.getElementById(x); if (!el) return false; const r = el.getBoundingClientRect(); return r.top >= 0 && r.top < innerHeight; }, id, { timeout: 4000 }).catch(() => {});
  check(await page.evaluate((x) => { const r = document.getElementById(x)?.getBoundingClientRect(); return !!r && r.top >= 0 && r.top < innerHeight; }, id), `glossaire : arrive sur le mot (#${id})`);
  await page.click(".back-btn");
  await page.waitForURL(/\/apprendre\/therapie$/);
  await page.waitForSelector(".lcard h2");
  check(await page.locator(".lcard h2").innerText() === card, "glossaire : « Revenir à ma page » ramène à la même carte");
  for (let k = 0; k < 6 && !(await page.locator(".lcard h2").innerText()).includes("Et ce support"); k++) await page.click(".lesson-next");
  check(!(await page.locator(".lcard .term").allInnerTexts()).some((t) => /^bases?$/i.test(t)), "mots expliqués : « les idées de base » n’est pas pris pour une des 5 bases");
  await page.goto(origin + "/glossaire", { waitUntil: "networkidle" });
  check(await page.locator("a.back").innerText().then((t) => t.includes("Accueil")), "glossaire ouvert directement : le lien de retour mène à l’accueil");
  await page.fill("#gl-q", "CMP");
  check(await page.locator(".gl-item").count() >= 1 && await page.locator("#cmp").isVisible(), "glossaire : la recherche trouve « CMP »");
  await page.goto(origin + "/soutien", { waitUntil: "networkidle" });
  check(await page.locator(".door .term").count() >= 2, "pages : les mots techniques sont aussi surlignés hors des leçons (Soutien)");
  await page.goto(origin + "/aide", { waitUntil: "networkidle" });
  check(await page.locator(".term").count() === 0, "page d’urgence : rien de surligné, rien pour distraire");
  await ctx.close();
}

// 3 quater. Sur téléphone, au clavier : l'infobulle de chaque mot s'ouvre et reste dans l'écran.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.goto(origin + "/apprendre/therapie", { waitUntil: "networkidle" });
  let seen = 0; const bad = [];
  for (let c = 0; c < 8; c++) {
    for (let k = 0; k < 12; k++) {
      await page.keyboard.press("Tab");
      const r = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a?.classList.contains("term")) return null;
        const tip = a.parentElement.querySelector(".term-tip"), b = tip.getBoundingClientRect();
        return { w: a.textContent, shown: getComputedStyle(tip).display !== "none", l: Math.round(b.left), r: Math.round(b.right), t: Math.round(b.top) };
      });
      if (r) { seen++; if (!r.shown || r.l < 0 || r.r > 390 || r.t < 0) bad.push(r); }
    }
    await page.click(".lesson-next");
  }
  check(seen >= 5 && bad.length === 0, `téléphone, clavier : ${seen} infobulles ouvertes, toutes dans l’écran ${bad.length ? JSON.stringify(bad.slice(0, 3)) : ""}`);
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
