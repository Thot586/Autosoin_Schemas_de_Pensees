// Serveur de développement : esbuild en mode watch + serveur statique avec repli SPA.
import * as esbuild from "esbuild";
import { rm, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildOptions, copyPublic, writeShell, entryFiles } from "./build.mjs";
import { serve } from "./serve.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist-dev");
await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await copyPublic(outDir);
const opts = await buildOptions({ dev: true, outDir, base: "/" });
opts.plugins = [{
  name: "shell",
  setup(b) {
    b.onEnd(async (r) => {
      if (!r.metafile) return;
      const { js, css } = entryFiles(r.metafile, outDir);
      await writeShell({ outDir, base: "/", dev: true, js, css, buildId: "dev" });
    });
  },
}];
const ctx = await esbuild.context(opts);
await ctx.watch();
const port = Number(process.env.PORT || 5173);
process.env.BASE_PATH = "/";
await serve(outDir, port, "/");
console.log(`Développement : http://127.0.0.1:${port}/  (actualiser la page après chaque modification)`);
