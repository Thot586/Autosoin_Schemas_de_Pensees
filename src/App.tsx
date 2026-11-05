import { lazy, Suspense, useEffect } from "react";
import { Routes, navigate, type RouteDef } from "./lib/router";
import { Shell } from "./components/Shell";

const Home = lazy(() => import("./pages/Home"));
const Apprendre = lazy(() => import("./pages/Apprendre"));
const Lecon = lazy(() => import("./pages/Lecon"));
const LeconPage = lazy(() => import("./pages/LeconPage"));
const Rappel = lazy(() => import("./pages/Rappel"));
const Schemas = lazy(() => import("./pages/Schemas"));
const SchemaPage = lazy(() => import("./pages/SchemaPage"));
const Trouver = lazy(() => import("./pages/Trouver"));
const Priorites = lazy(() => import("./pages/Priorites"));
const Outils = lazy(() => import("./pages/Outils"));
const CarteMemo = lazy(() => import("./pages/CarteMemo"));
const Pause = lazy(() => import("./pages/Pause"));
const Dire = lazy(() => import("./pages/Dire"));
const Plan = lazy(() => import("./pages/Plan"));
const Carnet = lazy(() => import("./pages/Carnet"));
const Exercice = lazy(() => import("./pages/Exercice"));
const Aide = lazy(() => import("./pages/Aide"));
const Soutien = lazy(() => import("./pages/Soutien"));
const Therapie = lazy(() => import("./pages/Therapie"));
const MonEspace = lazy(() => import("./pages/MonEspace"));
const Glossaire = lazy(() => import("./pages/Glossaire"));
const References = lazy(() => import("./pages/References"));
const APropos = lazy(() => import("./pages/APropos"));
const NotFound = lazy(() => import("./pages/NotFound"));

/** Anciennes adresses (version en huit parties) → nouvelles. */
function Redirect({ to }: { to: string }) {
  useEffect(() => { navigate(to, { replace: true }); }, [to]);
  return null;
}
const OLD: [string, string][] = [
  ["/commencer", "/apprendre"], ["/comprendre", "/apprendre/schema"], ["/besoins", "/apprendre/besoins"],
  ["/entretien", "/apprendre/cercle"], ["/s-en-sortir", "/apprendre/adulte-sain"], ["/trouver/fiche", "/trouver"],
  ["/pour-la-suite", "/aide"], ["/pour-la-suite/aide", "/aide"], ["/pour-la-suite/soutien", "/soutien"],
  ["/pour-la-suite/carnet", "/outils/carnet"], ["/pour-la-suite/lectures", "/soutien"],
];

const routes: RouteDef[] = [
  { path: "/", element: () => <Home /> },
  { path: "/apprendre", element: () => <Apprendre /> },
  { path: "/apprendre/:id/tout", element: (p) => <LeconPage id={p.id} /> },
  { path: "/apprendre/:id", element: (p) => <Lecon key={p.id} id={p.id} /> },
  { path: "/rappel", element: () => <Rappel /> },
  { path: "/schemas", element: () => <Schemas /> },
  { path: "/schemas/:slug/:tab?", element: (p) => <SchemaPage key={`${p.slug}/${p.tab ?? ""}`} slug={p.slug} tab={p.tab} /> },
  { path: "/trouver", element: () => <Trouver /> },
  { path: "/trouver/priorites", element: () => <Priorites /> },
  { path: "/outils", element: () => <Outils /> },
  { path: "/outils/carte-memo", element: () => <CarteMemo /> },
  { path: "/outils/pause", element: () => <Pause /> },
  { path: "/outils/dire", element: () => <Dire /> },
  { path: "/outils/plan", element: () => <Plan /> },
  { path: "/outils/carnet", element: () => <Carnet /> },
  { path: "/outils/imagerie", element: () => <Exercice key="imagerie" kind="imagerie" /> },
  { path: "/outils/chaises", element: () => <Exercice key="chaises" kind="chaises" /> },
  { path: "/aide", element: () => <Aide /> },
  { path: "/soutien", element: () => <Soutien /> },
  { path: "/therapie", element: () => <Therapie /> },
  { path: "/mon-espace", element: () => <MonEspace /> },
  { path: "/glossaire", element: () => <Glossaire /> },
  { path: "/references", element: () => <References /> },
  { path: "/a-propos", element: () => <APropos /> },
  { path: "/besoins/:base", element: (p) => <Redirect to={`/apprendre/base-${p.base}`} /> },
  ...OLD.map(([from, to]): RouteDef => ({ path: from, element: () => <Redirect to={to} /> })),
];

export function App() {
  return (
    <Shell>
      <Suspense fallback={<div className="loading" role="status" aria-live="polite"><span className="loading-dot" /><span className="sr-only">Chargement…</span></div>}>
        <Routes routes={routes} notFound={<NotFound />} />
      </Suspense>
    </Shell>
  );
}
