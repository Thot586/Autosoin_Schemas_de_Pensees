# Comprendre ses schémas

Application web de psychoéducation et d’autosoin autour des **15 schémas de J. Young** et des **5 besoins fondamentaux** dont ils naissent.
Elle reprend le diaporama « Comprendre ses schémas » (v7, 92 diapositives) et le réorganise pour l’écran : mobile d’abord, utilisable du téléphone à l’ordinateur.

- **Parcours** en huit parties (comprendre, besoins, entretien, s’en sortir, trouver, outils, schémas un par un, pour la suite), avec une barre de navigation en bas sur téléphone et un menu en haut sur ordinateur.
- **Sept animations** (lunettes, marches, verre, journée, vague, cercle, adulte sain) : lecture automatique au défilement, commandes, points d’étapes, transcription ; désactivées avec « réduire les animations ».
- **Outils** : fiche « Retrouver mes schémas », carte-mémo (imprimable), pause en trois temps avec respiration guidée, méthode DESC, plan de la semaine avec rappel d’agenda (`.ics`), carnet de schémas (export CSV).
- **Mon espace** : tout ce que la personne a noté, **sauvegarde / restauration par fichier**, impression, effacement en deux temps.
- **Vie privée** : aucune donnée n’est envoyée. Tout reste dans le `localStorage` du navigateur. Pas de compte, pas de cookie, pas de statistiques, polices auto-hébergées.
- **Installable** (PWA) et utilisable **hors connexion** après la première visite.
- **Accessibilité** visée : WCAG 2.2 AA (contrastes vérifiés, clavier, lien d’évitement, thème clair/sombre/auto, taille du texte, animations réductibles). Aucun audit externe pour l’instant.

> **Statut : version de travail.** Le contenu n’a pas encore été relu par le Pr N. Franck. Le bandeau « Version de travail · en attente de relecture » s’affiche partout ; pour le retirer, vider `statut` dans `src/data/meta.ts`.
> Les textes écrits pour le web sont listés dans [`docs/CONTENU.md`](docs/CONTENU.md) pour relecture.

## Démarrer

Prérequis : Node 20 ou plus.

```bash
npm install
npm run fonts       # télécharge Nunito Sans et Domine (facultatif : sinon polices système)
npm run dev         # http://localhost:5173, rechargement automatique
npm run build       # produit dist/
npm run preview     # sert dist/ pour vérifier
npm run typecheck   # tsc --noEmit
```

Test de bout en bout (toutes les pages à 390 px et 1366 px, carnet, sauvegarde, restauration) :

```bash
npm i -D playwright && npx playwright install chromium
npm run build && npm run test:e2e
```

## Publier sur GitHub Pages

1. Pousser le dépôt sur `main`.
2. Sur GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
3. Le workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) construit avec `BASE_PATH=/<nom-du-dépôt>/` et publie à `https://<compte>.github.io/<nom-du-dépôt>/`.

Pour un nom de domaine propre (racine du site) : `BASE_PATH=/ npm run build`.

Par défaut le site porte `noindex, nofollow` (il n’apparaît pas dans les moteurs de recherche). Pour l’autoriser : variable de dépôt `SITE_INDEXABLE=1` (Settings → Secrets and variables → Actions → Variables), ou `SITE_INDEXABLE=1 npm run build`.

Les pages sont des routes « propres » (`/besoins/securite-attachement`) : `dist/404.html` est une copie de `index.html` qui sert de repli pour GitHub Pages.

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Les textes des parties | `src/data/content.ts` |
| Les 5 bases et leurs animations (textes) | `src/data/bases.ts` |
| Les 15 schémas | `src/data/schemas.generated.json` (extrait du diaporama) |
| Le glossaire | `src/data/glossaire.ts` |
| Crédits, statut, mentions légales | `src/data/meta.ts` |
| Les couleurs, la typographie | `src/styles/tokens.css` |
| Les animations | `src/scenes/` et `src/styles/anim.css` |
| Les pages | `src/pages/` |

Les couleurs de base : encre `#1E2F36`, fond `#F7F4EE`, accent `#235F73`, plus une teinte par base (rouge brique, ocre, vert, bleu, violet).

## Choix techniques

- **React 19 + TypeScript**, **esbuild** (`scripts/build.mjs`) à la place de Vite : l’environnement de préparation ne pouvait pas télécharger Vite. Le résultat est le même (fichiers statiques avec empreintes, découpage par page) ; migrer vers Vite reste possible si vous préférez.
- **CSS écrit à la main** (variables CSS, pas de Tailwind) et animations en SVG + CSS (pas de bibliothèque d’animation) : le noyau JavaScript pèse environ 60 ko compressés (gzip) et le reste est chargé page par page ; le site complet (hors polices) fait moins d’1 Mo.
- **Routeur maison** (History API, une centaine de lignes) : pas de dépendance supplémentaire.
- Les polices sont **téléchargées au moment de la construction** par `npm run fonts` puis servies par le site lui-même : le navigateur de la personne ne contacte jamais Google.

## À régler avant une diffusion publique

- Mentions légales : éditeur, directeur de la publication, hébergeur, contact (`src/data/meta.ts`, champs vides : la section n’apparaît que s’ils sont remplis).
- Autorisation d’usage du **logo du CRR** (`public/img/crr-logo.png`).
- **Licence** : `UNLICENSED` pour l’instant (`package.json`).
- Relecture du contenu et des affirmations listées dans `docs/CONTENU.md` (§ 11).
- Ce support **ne remplace pas un suivi avec un professionnel formé** ; il n’est pas un dispositif médical.

## Crédits

Dr FENOHASINA T.J. Félicien ; Mme LONG Aude ; Prof. FRANCK Nicolas.
D’après J. Young, J. Klosko et M. Weishaar.
