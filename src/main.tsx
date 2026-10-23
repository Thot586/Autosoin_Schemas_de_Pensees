import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/anim.css";
import "./styles/pages.css";
import "./styles/print.css";
import { App } from "./App";
import { applyPrefs, prefs } from "./lib/state";
import { BASE } from "./lib/router";

applyPrefs(prefs.get());
createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);

if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !/localhost|127\.0\.0\.1/.test(location.hostname)) {
  window.addEventListener("load", () => { navigator.serviceWorker.register(`${BASE}sw.js`, { scope: BASE }).catch(() => {}); });
}
