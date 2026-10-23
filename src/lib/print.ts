/** Imprime la page entière, ou seulement l'élément d'identifiant `only` (carte-mémo, plan, carnet…). */
export function printPage(only?: string) {
  const root = document.documentElement;
  const el = only ? document.getElementById(only) : null;
  if (el) { el.setAttribute("data-print-target", ""); root.setAttribute("data-print", only!); }
  const clean = () => {
    el?.removeAttribute("data-print-target");
    root.removeAttribute("data-print");
    window.removeEventListener("afterprint", clean);
  };
  window.addEventListener("afterprint", clean);
  // laisse le navigateur appliquer les attributs avant d'ouvrir la boîte d'impression
  requestAnimationFrame(() => setTimeout(() => window.print(), 30));
}
