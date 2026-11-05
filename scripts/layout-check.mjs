// Contrôles de mise en page, exécutés DANS la page (page.evaluate(layoutProblems, options)).
// La fonction doit rester autonome : Playwright l'envoie au navigateur sous forme de texte.
//
// Ce qui est signalé :
//   chevauchement  deux éléments sans lien (texte, pastille, icône, image) se recouvrent ;
//   collé          deux éléments côte à côte, sur la même ligne, à moins de minGap px (rendu « qui se touche ») ;
//   déborde        un texte sort de la boîte colorée (carte, pastille, bouton) qui le contient ;
//   coupé          un texte est rogné par une boîte « overflow: hidden » ;
//   décentré       un paragraphe centré dont la boîte n'est pas au milieu de son parent ;
//   cible          une zone de clic fait moins de minTarget px (WCAG 2.5.8), hors liens dans une phrase ;
//   cible<44       (pour information) moins de 44 px, la taille recommandée (WCAG 2.5.5, Apple) ;
//   cibles         deux zones de clic se recouvrent (risque de toucher la mauvaise) ;
//   sous-barre     un contenu reste caché sous une barre fixe, même au bout du défilement.
export async function layoutProblems(opts) {
  const { minGap = 4, minTarget = 24, scrollCheck = true } = opts || {};
  const out = [];
  const z = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
  const styles = new Map();
  const cs = (el) => { let s = styles.get(el); if (!s) { s = getComputedStyle(el); styles.set(el, s); } return s; };
  const shown = (el) => (el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : el.getClientRects().length > 0);
  // calque « hors du flux » : une barre fixe ou collante (sticky) ; le contenu qui défile passe dessous, c'est voulu
  const fixedOf = (el) => { for (let a = el; a && a !== document.documentElement; a = a.parentElement) if (/^(fixed|sticky)$/.test(cs(a).position)) return a; return null; };
  const blockish = (el) => { const d = cs(el).display; return d !== "inline" && d !== "contents"; };
  const containerOf = (el) => { let a = el; while (a && a !== document.body && !blockish(a)) a = a.parentElement; return a || document.body; };
  const transparent = (c) => !c || c === "transparent" || /rgba\([^)]*,\s*0\)$/.test(c);
  const decorated = (el) => {
    const s = cs(el);
    if (!transparent(s.backgroundColor) || s.backgroundImage !== "none") return true;
    return ["Top", "Right", "Bottom", "Left"].some((k) => parseFloat(s[`border${k}Width`]) >= 1 && s[`border${k}Style`] !== "none" && !transparent(s[`border${k}Color`]));
  };
  // rogne une boîte par les parents « overflow » ; pour un texte, sa propre balise compte (from = la balise elle-même)
  const clip = (from, r) => {
    let { left, right, top, bottom } = r;
    for (let a = from; a && a !== document.body && a !== document.documentElement; a = a.parentElement) {
      const s = cs(a);
      if (s.overflowX !== "visible" || s.overflowY !== "visible") {
        const ar = a.getBoundingClientRect();
        if (s.overflowX !== "visible") { left = Math.max(left, ar.left); right = Math.min(right, ar.right); }
        if (s.overflowY !== "visible") { top = Math.max(top, ar.top); bottom = Math.min(bottom, ar.bottom); }
      }
      if (s.position === "fixed") break;
    }
    return { left, right, top, bottom };
  };
  const label = (el, text) => {
    const cls = typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/)[0] : "";
    const t = (text ?? el.getAttribute("aria-label") ?? el.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 32);
    return `${el.localName}${cls}${t ? ` « ${t} »` : ""}`;
  };
  const related = (a, b) => a === b || a.contains(b) || b.contains(a);
  const px = (v) => Math.round(v / z);

  // 1. Ce qui « encre » l'écran : fragments de texte (une boîte par ligne), images et icônes, boîtes colorées.
  const collect = () => {
    const items = [];
    const range = document.createRange();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode()); ) {
      const t = n.textContent; const a = t.search(/\S/); if (a < 0) continue;
      const el = n.parentElement;
      if (!el || el.closest("svg, script, style, noscript, template, .sr-only, .visually-hidden") || !shown(el)) continue;
      range.setStart(n, a); range.setEnd(n, t.length - t.match(/\s*$/)[0].length);
      for (const r of range.getClientRects()) {
        if (r.width < 1 || r.height < 1) continue;
        // boîte d'encre approchée : sans l'espace réservé au-dessus des majuscules ni sous les jambages
        const box = clip(el, { left: r.left, right: r.right, top: r.top + r.height * 0.14, bottom: r.bottom - r.height * 0.05 });
        if (box.right - box.left < 1 || box.bottom - box.top < 1) continue;
        items.push({ kind: "texte", el, fixed: fixedOf(el), c: containerOf(el), box, raw: r, name: label(el, t) });
      }
    }
    for (const el of document.body.getElementsByTagName("*")) {
      const tag = el.localName;
      if (tag !== "svg" && el.closest("svg")) continue;
      if (/^(script|style|template|noscript|br|wbr|dialog)$/.test(tag)) continue;
      const media = /^(svg|img|video|canvas|input|select|textarea|progress|meter|iframe)$/.test(tag);
      if (!media && !decorated(el)) continue;
      if (!shown(el)) continue;
      const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) continue;
      const box = clip(el.parentElement, r); if (box.right - box.left < 1 || box.bottom - box.top < 1) continue;
      items.push({ kind: media ? "image" : "boîte", el, fixed: fixedOf(el), c: blockish(el) ? el : containerOf(el), box, raw: r, name: label(el) });
    }
    return items;
  };

  const items = collect();
  items.sort((p, q) => p.box.top - q.box.top);
  for (let i = 0; i < items.length; i++) {
    const A = items[i];
    for (let j = i + 1; j < items.length && items[j].box.top < A.box.bottom; j++) {
      const B = items[j];
      if (related(A.el, B.el)) continue;
      if ((A.fixed || B.fixed) && A.fixed !== B.fixed && !(A.fixed && B.fixed)) continue; // fixe contre défilant : vu plus bas
      if (A.kind === "boîte" && B.kind === "boîte") continue; // deux fonds qui se touchent : pas un problème de lecture
      const iw = Math.min(A.box.right, B.box.right) - Math.max(A.box.left, B.box.left);
      const ih = Math.min(A.box.bottom, B.box.bottom) - Math.max(A.box.top, B.box.top);
      if (ih <= 0) continue;
      if (iw > 1.5 * z && ih > 1.5 * z) {
        out.push({ type: "chevauchement", a: A.name, b: B.name, px: px(Math.min(iw, ih)), at: [px(A.box.left), px(A.box.top + scrollY)] });
        continue;
      }
      // côte à côte sur la même ligne, dans deux blocs sans lien : il faut un vrai espace entre les deux
      const hA = A.box.bottom - A.box.top, hB = B.box.bottom - B.box.top;
      if (ih >= 0.4 * Math.min(hA, hB) && iw <= 1.5 * z && -iw < minGap * z && !related(A.c, B.c)) {
        out.push({ type: "collé", a: A.name, b: B.name, px: px(-iw), at: [px(Math.min(A.box.left, B.box.left)), px(A.box.top + scrollY)] });
      }
    }
  }

  // 2. Un texte ne sort pas de la boîte colorée qui le contient ; il n'est pas rogné.
  const seenBox = new Set();
  for (const T of items) {
    if (T.kind !== "texte") continue;
    for (let a = T.el; a && a !== document.body; a = a.parentElement) {
      if (!decorated(a)) continue;
      const r = a.getBoundingClientRect();
      if (T.raw.left < r.left - 1 * z || T.raw.right > r.right + 1 * z || T.box.top < r.top - 1 * z || T.box.bottom > r.bottom + 1 * z) {
        const k = a; if (!seenBox.has(k)) { seenBox.add(k); out.push({ type: "déborde", a: T.name, b: label(a, ""), px: px(Math.max(r.left - T.raw.left, T.raw.right - r.right, r.top - T.box.top, T.box.bottom - r.bottom)), at: [px(r.left), px(r.top + scrollY)] }); }
      }
      break;
    }
  }
  for (const el of document.body.getElementsByTagName("*")) {
    if (el.closest("svg") || !el.textContent.trim()) continue;
    const s = cs(el);
    const hx = /hidden|clip/.test(s.overflowX) && el.scrollWidth > el.clientWidth + 1;
    const hy = /hidden|clip/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 1;
    if ((hx || hy) && shown(el) && el.clientWidth > 2 && el.clientHeight > 2 && !el.matches(".sr-only, .visually-hidden")) {
      out.push({ type: "coupé", a: label(el), b: hx ? `largeur ${px(el.scrollWidth)} > ${px(el.clientWidth)}` : `hauteur ${px(el.scrollHeight)} > ${px(el.clientHeight)}`, px: 0, at: [px(el.getBoundingClientRect().left), px(el.getBoundingClientRect().top + scrollY)] });
    }
  }

  // 2 bis. Un paragraphe centré reste centré : sa largeur limitée (--measure) ne doit pas le pousser à gauche.
  for (const el of document.querySelectorAll("p, dd, li, blockquote")) {
    if (cs(el).textAlign !== "center" || !shown(el) || !el.textContent.trim()) continue;
    const pa = el.parentElement; if (!pa) continue;
    const r = el.getBoundingClientRect(), pr = pa.getBoundingClientRect(), ps = cs(pa);
    const l = r.left - (pr.left + parseFloat(ps.borderLeftWidth) * z + parseFloat(ps.paddingLeft) * z);
    const rr = (pr.right - parseFloat(ps.borderRightWidth) * z - parseFloat(ps.paddingRight) * z) - r.right;
    if (Math.abs(l - rr) > 4 * z) out.push({ type: "décentré", a: label(el), b: `marge gauche ${px(l)} px, droite ${px(rr)} px`, px: px(Math.abs(l - rr)), at: [px(r.left), px(r.top + scrollY)] });
  }

  // 3. Zones de clic : assez grandes (hors liens dans une phrase), et jamais l'une sur l'autre.
  const targets = [...document.querySelectorAll('a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], [tabindex="0"]')]
    .filter((el) => !el.disabled && shown(el) && !el.closest("[inert]") && !el.matches(".sr-only, .visually-hidden"));
  const inSentence = (el) => {
    if (cs(el).display !== "inline" && !el.classList.contains("term")) return false;
    const c = containerOf(el.parentElement || el);
    return c.textContent.replace(/\s+/g, " ").trim().length > el.textContent.replace(/\s+/g, " ").trim().length + 2;
  };
  // zone de clic agrandie par un ::before / ::after en position absolue (ex. : petits points d'étapes)
  const hitRect = (el) => {
    const r = el.getBoundingClientRect();
    let { left, top, right, bottom } = r;
    if (cs(el).position !== "static") for (const pe of ["::before", "::after"]) {
      const p = getComputedStyle(el, pe);
      if (p.content === "none" || p.position !== "absolute" || p.pointerEvents === "none") continue;
      const v = ["top", "right", "bottom", "left"].map((k) => parseFloat(p[k]));
      if (v.some(Number.isNaN)) continue;
      left = Math.min(left, r.left + v[3] * z); top = Math.min(top, r.top + v[0] * z); right = Math.max(right, r.right - v[1] * z); bottom = Math.max(bottom, r.bottom - v[2] * z);
    }
    return { left, top, right, bottom, width: right - left, height: bottom - top };
  };
  const tb = [];
  for (const el of targets) {
    // une case à cocher se coche aussi par son étiquette : la zone de clic est la plus grande des deux
    const r = [hitRect(el), ...[...(el.labels || [])].map((l) => l.getBoundingClientRect())].sort((p, q) => q.width * q.height - p.width * p.height)[0];
    if (r.width < 1 || r.height < 1) continue;
    const inline = inSentence(el);
    const w = r.width / z, h = r.height / z;
    if (!inline && (w < minTarget - 0.5 || h < minTarget - 0.5)) out.push({ type: "cible", a: label(el), b: `${px(r.width)}×${px(r.height)} px`, px: 0, at: [px(r.left), px(r.top + scrollY)] });
    else if (!inline && (w < 43.5 || h < 43.5)) out.push({ type: "cible<44", a: label(el), b: `${px(r.width)}×${px(r.height)} px`, px: 0, at: [px(r.left), px(r.top + scrollY)] });
    tb.push({ el, inline, fixed: fixedOf(el), rects: inline ? [...el.getClientRects()] : [r] });
  }
  for (let i = 0; i < tb.length; i++) for (let j = i + 1; j < tb.length; j++) {
    const A = tb[i], B = tb[j];
    if (related(A.el, B.el) || (A.inline && B.inline) || A.fixed !== B.fixed) continue;
    for (const p of A.rects) for (const q of B.rects) {
      const iw = Math.min(p.right, q.right) - Math.max(p.left, q.left), ih = Math.min(p.bottom, q.bottom) - Math.max(p.top, q.top);
      if (iw > 1.5 * z && ih > 1.5 * z) out.push({ type: "cibles", a: label(A.el), b: label(B.el), px: px(Math.min(iw, ih)), at: [px(Math.max(p.left, q.left)), px(Math.max(p.top, q.top) + scrollY)] });
    }
  }

  // 4. Barres fixes : en haut de page et au bout du défilement, aucun contenu ne reste dessous.
  if (scrollCheck) {
    const y0 = scrollY;
    const bars = () => [...document.body.getElementsByTagName("*")].filter((el) => cs(el).position === "fixed" && shown(el) && el.localName !== "dialog" && !el.closest("dialog") && el.getBoundingClientRect().height > 4 && el.getBoundingClientRect().width > innerWidth / 2);
    for (const where of ["haut", "bas"]) {
      window.scrollTo({ top: where === "haut" ? 0 : document.documentElement.scrollHeight, behavior: "instant" });
      for (const bar of bars()) {
        const br = bar.getBoundingClientRect();
        const atTop = br.top <= 1 && br.bottom < innerHeight / 2, atBottom = br.bottom >= innerHeight - 2 && br.top > innerHeight / 2;
        if (!((where === "haut" && atTop) || (where === "bas" && atBottom))) continue;
        for (const it of collect()) {
          if (it.fixed || it.kind === "boîte") continue;
          const iw = Math.min(it.box.right, br.right) - Math.max(it.box.left, br.left), ih = Math.min(it.box.bottom, br.bottom) - Math.max(it.box.top, br.top);
          if (iw > 1 && ih > 2 * z) { out.push({ type: "sous-barre", a: it.name, b: label(bar, ""), px: px(ih), at: [px(it.box.left), px(it.box.top + scrollY)] }); break; }
        }
      }
    }
    window.scrollTo({ top: y0, behavior: "instant" });
  }
  return out;
}

// Contraste du texte (WCAG 1.4.3) : 4,5:1, ou 3:1 pour un grand texte (24 px, ou 18,7 px en gras).
// Le fond est celui des boîtes parentes (couleurs semi-transparentes mélangées) ; un fond en dégradé ou en image n'est pas jugé.
export function contrastProblems() {
  const out = [];
  const cv = document.createElement("canvas"); cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const memo = new Map();
  const rgba = (c) => {
    if (memo.has(c)) return memo.get(c);
    ctx.clearRect(0, 0, 1, 1); ctx.fillStyle = "#000"; ctx.fillStyle = c; ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data; const v = [d[0], d[1], d[2], d[3] / 255];
    memo.set(c, v); return v;
  };
  const over = (t, b) => [0, 1, 2].map((i) => t[i] * t[3] + b[i] * (1 - t[3])).concat(1);
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const hex = (c) => "#" + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const done = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode()); ) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || done.has(el)) continue; done.add(el);
    if (el.closest("svg, script, style, noscript, template, .sr-only, .visually-hidden, :disabled, [aria-disabled='true']")) continue;
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
    // fond : on remonte jusqu'à une couleur opaque
    const layers = []; let unknown = false, opacity = 1;
    for (let a = el; a; a = a.parentElement) {
      const s = getComputedStyle(a);
      opacity *= parseFloat(s.opacity);
      if (s.backgroundImage !== "none") { unknown = true; break; }
      const c = rgba(s.backgroundColor);
      if (c[3] > 0) { layers.push(c); if (c[3] >= 1) break; }
    }
    if (unknown) continue;
    let bg = [255, 255, 255, 1];
    for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
    const s = getComputedStyle(el);
    const fg0 = rgba(s.color);
    const fg = over([fg0[0], fg0[1], fg0[2], fg0[3] * opacity], bg);
    const size = parseFloat(s.fontSize), bold = parseInt(s.fontWeight, 10) >= 700;
    const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5;
    const k = ratio(fg, bg);
    if (k < need - 0.005) out.push({ type: "contraste", a: `${el.localName}${typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/)[0] : ""} « ${n.textContent.replace(/\s+/g, " ").trim().slice(0, 32)} »`, b: `${k.toFixed(2)}:1 < ${need}:1 (${hex(fg)} sur ${hex(bg)}, ${Math.round(size)} px)`, px: 0, at: [Math.round(r.left), Math.round(r.top + scrollY)] });
  }
  return out;
}

// Confort de lecture : lignes de texte courant de 80 signes au plus ; pas de texte plus petit que minFont px.
// On mesure chaque bloc « feuille » (un bloc dont tout le contenu est en ligne : un paragraphe, un élément de liste…),
// ligne par ligne, avec la largeur moyenne d'un signe dans sa propre police.
export function readingProblems(opts) {
  const { maxChars = 80, minFont = 13 } = opts || {};
  const out = [];
  const z = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
  const ctx = document.createElement("canvas").getContext("2d");
  const lab = (el) => `${el.localName}${typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/)[0] : ""} « ${el.textContent.replace(/\s+/g, " ").trim().slice(0, 32)} »`;
  const all = [...document.querySelectorAll("main *, dialog *")].filter((el) => !el.closest("svg"));
  const isInline = new Map(all.map((el) => [el, getComputedStyle(el).display.startsWith("inline") || el.localName === "br"]));
  // un bloc qui contient un autre bloc n'est pas une feuille : on marque ses ancêtres, en une passe
  const hasBlock = new Set();
  for (const el of all) if (!isInline.get(el)) for (let a = el.parentElement; a && !hasBlock.has(a); a = a.parentElement) hasBlock.add(a);
  for (const el of all) {
    if (isInline.get(el) || hasBlock.has(el) || el.closest("nav, .sr-only, button, label, summary") || /^(script|style|input|textarea|select|img)$/.test(el.localName)) continue;
    const text = el.textContent.replace(/\s+/g, " ").trim();
    if (text.length < 100) continue;
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const s = getComputedStyle(el);
    ctx.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
    const avg = ctx.measureText(text).width / text.length; // largeur moyenne d'un signe, en px CSS
    const range = document.createRange(); range.selectNodeContents(el);
    const lines = [];
    for (const r of range.getClientRects()) {
      if (r.width < 1) continue;
      const l = lines.find((x) => Math.abs(x.mid - (r.top + r.bottom) / 2) < r.height / 2);
      if (l) { l.left = Math.min(l.left, r.left); l.right = Math.max(l.right, r.right); } else lines.push({ mid: (r.top + r.bottom) / 2, left: r.left, right: r.right });
    }
    const widest = Math.max(0, ...lines.map((x) => x.right - x.left)) / z;
    const chars = Math.round(widest / avg);
    if (chars > maxChars) out.push({ type: "ligne longue", a: lab(el), b: `≈ ${chars} signes par ligne`, px: 0, at: [] });
  }
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode()); ) {
    const el = n.parentElement;
    if (!el || seen.has(el) || !n.textContent.trim() || el.closest("svg, .sr-only, script, style")) continue; seen.add(el);
    if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
    const fs = parseFloat(getComputedStyle(el).fontSize);
    if (fs < minFont - 0.01) out.push({ type: "petit texte", a: lab(el), b: `${fs.toFixed(1)} px`, px: 0, at: [] });
  }
  return out;
}
