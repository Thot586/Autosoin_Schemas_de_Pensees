// Petit serveur statique avec repli SPA (toute URL sans extension renvoie index.html).
// Usage : node scripts/serve.mjs [dossier] [port]    — BASE_PATH=/mon-depot/ pour simuler GitHub Pages.
import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".woff": "font/woff",
  ".ics": "text/calendar", ".pdf": "application/pdf", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ".txt": "text/plain; charset=utf-8", ".xml": "application/xml", ".mp4": "video/mp4",
};

export function serve(dir, port = 4173, rawBase = process.env.BASE_PATH || "/") {
  const base = ("/" + rawBase.replace(/^\/+|\/+$/g, "") + "/").replace("//", "/");
  const server = http.createServer(async (req, res) => {
    try {
      let url = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (!url.startsWith(base)) {
        res.writeHead(base === "/" ? 404 : 302, base === "/" ? {} : { Location: base });
        return res.end();
      }
      let rel = url.slice(base.length);
      let file = path.join(dir, rel);
      if (!file.startsWith(path.resolve(dir))) { res.writeHead(403); return res.end(); }
      let st = await stat(file).catch(() => null);
      if (st?.isDirectory()) { file = path.join(file, "index.html"); st = await stat(file).catch(() => null); }
      if (!st) {
        if (path.extname(rel)) { res.writeHead(404); return res.end("404"); }
        file = path.join(dir, "index.html");
      }
      const body = await readFile(file);
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
      res.end(body);
    } catch (e) {
      res.writeHead(500); res.end(String(e));
    }
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const dir = path.resolve(process.argv[2] || "dist");
  const port = Number(process.argv[3] || 4173);
  await serve(dir, port);
  console.log(`http://127.0.0.1:${port}${("/" + (process.env.BASE_PATH || "/").replace(/^\/+|\/+$/g, "") + "/").replace("//", "/")}`);
}
