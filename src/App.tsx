import { lazy, Suspense } from "react";
import { Routes, type RouteDef } from "./lib/router";
import { Shell } from "./components/Shell";
import { SCHEMAS } from "./data/schemas";

const Home = lazy(() => import("./pages/Home"));
const Commencer = lazy(() => import("./pages/Commencer"));
const Comprendre = lazy(() => import("./pages/Comprendre"));
const Besoins = lazy(() => import("./pages/Besoins"));
const Base = lazy(() => import("./pages/Base"));
const Entretien = lazy(() => import("./pages/Entretien"));
const SEnSortir = lazy(() => import("./pages/SEnSortir"));
const Trouver = lazy(() => import("./pages/Trouver"));
const Fiche = lazy(() => import("./pages/Fiche"));
const Outils = lazy(() => import("./pages/Outils"));
const CarteMemo = lazy(() => import("./pages/CarteMemo"));
const Pause = lazy(() => import("./pages/Pause"));
const Dire = lazy(() => import("./pages/Dire"));
const Plan = lazy(() => import("./pages/Plan"));
const Schemas = lazy(() => import("./pages/Schemas"));
const SchemaPage = lazy(() => import("./pages/SchemaPage"));
const PourLaSuite = lazy(() => import("./pages/PourLaSuite"));
const Aide = lazy(() => import("./pages/Aide"));
const Soutien = lazy(() => import("./pages/Soutien"));
const Carnet = lazy(() => import("./pages/Carnet"));
const Lectures = lazy(() => import("./pages/Lectures"));
const MonEspace = lazy(() => import("./pages/MonEspace"));
const Glossaire = lazy(() => import("./pages/Glossaire"));
const APropos = lazy(() => import("./pages/APropos"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routes: RouteDef[] = [
  { path: "/", element: () => <Home /> },
  { path: "/commencer", element: () => <Commencer /> },
  { path: "/comprendre", element: () => <Comprendre /> },
  { path: "/besoins", element: () => <Besoins /> },
  { path: "/besoins/:base", element: (p) => <Base slug={p.base} /> },
  { path: "/entretien", element: () => <Entretien /> },
  { path: "/s-en-sortir", element: () => <SEnSortir /> },
  { path: "/trouver", element: () => <Trouver /> },
  { path: "/trouver/fiche", element: () => <Fiche view="fiche" /> },
  { path: "/trouver/priorites", element: () => <Fiche view="priorites" /> },
  { path: "/outils", element: () => <Outils /> },
  { path: "/outils/carte-memo", element: () => <CarteMemo /> },
  { path: "/outils/pause", element: () => <Pause /> },
  { path: "/outils/dire", element: () => <Dire /> },
  { path: "/outils/plan", element: () => <Plan /> },
  { path: "/schemas", element: () => <Schemas /> },
  { path: "/schemas/:slug/:tab?", element: (p) => <SchemaPage slug={p.slug} tab={p.tab} /> },
  { path: "/pour-la-suite", element: () => <PourLaSuite /> },
  { path: "/pour-la-suite/aide", element: () => <Aide /> },
  { path: "/pour-la-suite/soutien", element: () => <Soutien /> },
  { path: "/pour-la-suite/carnet", element: () => <Carnet /> },
  { path: "/pour-la-suite/lectures", element: () => <Lectures /> },
  { path: "/mon-espace", element: () => <MonEspace /> },
  { path: "/glossaire", element: () => <Glossaire /> },
  { path: "/a-propos", element: () => <APropos /> },
];
void SCHEMAS;

export function App() {
  return (
    <Shell>
      <Suspense fallback={<div className="loading" role="status" aria-live="polite"><span className="loading-dot" /><span className="sr-only">Chargement…</span></div>}>
        <Routes routes={routes} notFound={<NotFound />} />
      </Suspense>
    </Shell>
  );
}
