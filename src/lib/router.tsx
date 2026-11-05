import {
  createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useSyncExternalStore,
  type AnchorHTMLAttributes, type MouseEvent, type ReactElement, type ReactNode,
} from "react";

export const BASE: string = __BASE__;

export interface Loc { path: string; search: string; hash: string }

function stripBase(pathname: string): string {
  let p = pathname;
  if (BASE !== "/" && p.startsWith(BASE)) p = "/" + p.slice(BASE.length);
  else if (BASE !== "/" && p + "/" === BASE) p = "/";
  p = p.replace(/\/+$/, "");
  return p === "" ? "/" : p;
}
function read(): Loc {
  return { path: stripBase(window.location.pathname), search: window.location.search, hash: window.location.hash };
}
export function href(to: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(to)) return to;
  return BASE + to.replace(/^\//, "");
}

let current: Loc = read();
const subs = new Set<() => void>();
let lastNav: "push" | "pop" | "init" = "init";
let navCount = 0;
function emit() { navCount++; subs.forEach((f) => f()); }
function subscribe(f: () => void) { subs.add(f); return () => { subs.delete(f); }; }

window.addEventListener("popstate", () => {
  lastNav = "pop";
  current = read();
  emit();
});
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = new URL(href(to), window.location.href);
  if (url.origin !== window.location.origin) { window.location.href = url.href; return; }
  const state = { y: 0 };
  try { history.replaceState({ y: window.scrollY }, ""); } catch { /* ignore */ }
  if (opts.replace) history.replaceState(state, "", url);
  else history.pushState(state, "", url);
  lastNav = "push";
  current = read();
  emit();
}

export function useLocation(): Loc {
  return useSyncExternalStore(subscribe, () => current, () => current);
}
export function useNavType() { return lastNav; }

export interface RouteDef { path: string; element: (p: Record<string, string>) => ReactElement; title?: string }

export function matchPath(pattern: string, path: string): Record<string, string> | null {
  const ps = pattern.split("/").filter(Boolean);
  const xs = path.split("/").filter(Boolean);
  const params: Record<string, string> = {};
  for (let i = 0; i < ps.length; i++) {
    const seg = ps[i];
    if (seg === "*") { params["*"] = xs.slice(i).join("/"); return params; }
    const optional = seg.endsWith("?");
    const name = seg.replace(/^:/, "").replace(/\?$/, "");
    if (xs[i] === undefined) { if (optional) continue; return null; }
    if (seg.startsWith(":")) params[name] = decodeURIComponent(xs[i]);
    else if (seg !== xs[i]) return null;
  }
  if (xs.length > ps.length) return null;
  return params;
}

const ScrollCtx = createContext(0);

/** Rend la route courante ; gère le défilement et le focus à chaque navigation. */
export function Routes({ routes, notFound }: { routes: RouteDef[]; notFound: ReactElement }): ReactElement {
  const loc = useLocation();
  let el: ReactElement = notFound;
  let matched: RouteDef | null = null;
  for (const r of routes) {
    const m = matchPath(r.path, loc.path);
    if (m) { el = r.element(m); matched = r; break; }
  }
  const first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; if (loc.hash) scrollToHash(loc.hash); return; }
    if (lastNav === "pop") {
      const y = (history.state && typeof history.state.y === "number") ? history.state.y : 0;
      window.scrollTo(0, y);
    } else if (loc.hash) {
      scrollToHash(loc.hash);
    } else {
      window.scrollTo(0, 0);
      const main = document.getElementById("contenu");
      if (main) main.focus({ preventScroll: true });
    }
  }, [loc.path, loc.hash]);
  void matched;
  return <ScrollCtx.Provider value={navCount}><div key={loc.path} className="page-enter">{el}</div></ScrollCtx.Provider>;
}

function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  requestAnimationFrame(() => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ block: "start" }); (el as HTMLElement).focus?.({ preventScroll: true }); }
  });
}

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> { to: string; replace?: boolean; children?: ReactNode }

export function Link({ to, replace, onClick, children, ...rest }: LinkProps) {
  const external = /^(https?:|mailto:|tel:)/.test(to);
  const handle = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || external) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== "_self") return;
    e.preventDefault();
    navigate(to, { replace });
  }, [to, replace, onClick, external, rest.target]);
  const ext = external && /^https?:/.test(to) ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return <a href={href(to)} onClick={handle} {...ext} {...rest}>{children}</a>;
}

/** Lien de navigation : marque `aria-current` quand la route correspond. */
export function NavLink({ to, end, className, children, ...rest }: Omit<LinkProps, "className"> & { end?: boolean; className?: string | ((a: { active: boolean }) => string) }) {
  const { path } = useLocation();
  const active = end ? path === to : path === to || path.startsWith(to + "/");
  const cn = typeof className === "function" ? className({ active }) : className;
  return <Link to={to} className={cn} aria-current={active ? "page" : undefined} {...rest}>{children}</Link>;
}

export function useRouteEffect(fn: (loc: Loc) => void) {
  const loc = useLocation();
  useEffect(() => { fn(loc); /* eslint-disable-next-line */ }, [loc.path]);
}
