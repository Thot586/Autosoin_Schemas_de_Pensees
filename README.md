# Comprendre ses schémas

Application web de psychoéducation et d’autosoin autour des **15 schémas de J. Young** et des **5 besoins fondamentaux** dont ils naissent. Elle reprend le diaporama « Comprendre les schémas » du Centre Ressource de Réhabilitation (CRR) et l’organise pour des personnes qui ont **du mal à se concentrer** : des leçons courtes, une idée par écran.

**En ligne** : https://thot586.github.io/Autosoin_Schemas_de_Pensees/ (non indexé par les moteurs de recherche).

> **Statut : version de travail.** Le contenu est en attente de relecture. Le bandeau « Version de travail · en attente de relecture » s’affiche partout. Ce qu’il faut relire et les faits vérifiés sont listés dans [`docs/CONTENU.md`](docs/CONTENU.md), et toutes les questions des quiz dans [`docs/QUESTIONS.md`](docs/QUESTIONS.md).

## Ce que fait l’application

- **Parcours** : **24 leçons de 2 à 5 minutes**, en six étapes :
  - avant de commencer (dont la thérapie des schémas et les limites du support) ;
  - comprendre un schéma ;
  - les 5 besoins, un par un ;
  - comment un schéma agit ;
  - ce qui aide (dont l’imagerie et le dialogue des chaises : ce que c’est, pourquoi ça peut aider) ;
  - passer à l’action.
- **Lecteur « une idée par écran »** :
  - une carte à la fois ;
  - « Retour » et « Suivant » en bas, sous le pouce ;
  - « Quitter » garde la position ;
  - « Aide » reste toujours visible ;
  - « Écouter » lit le texte à voix haute, avec la synthèse vocale du navigateur ;
  - pendant une leçon, le reste de l’interface disparaît (mode concentration).
- **Rappels** :
  - un petit rappel ouvre chaque leçon ;
  - « À retenir » la termine ;
  - **« Mon rappel du jour »** pose trois questions, en revenant plus souvent sur ce qui est à revoir (boîtes de Leitner) ;
  - « Ce que j’ai retenu » dans Mon espace.
- **Questions** : 85 au total. Elles portent sur les idées, jamais sur la personne. Il n’y a ni note ni rouge, et une explication suit chaque réponse.
- **Mes schémas** :
  - la fiche « Retrouver mes schémas », un schéma par écran ;
  - mes priorités (un à trois schémas) ;
  - chaque schéma en trois temps : comprendre, dans le moment, au fil des semaines.
- **Animations** : dix au total. Les sept du diaporama ont été ajustées. Trois sont nouvelles : le parapluie, les trois réactions et le chemin d’une thérapie. Elles se lancent avec « Lire », avancent pas à pas et ont une transcription ; elles sont désactivées si les animations sont réduites.
- **Outils** :
  - la pause en trois temps, avec respiration guidée ;
  - la carte-mémo ;
  - dire ce qui ne va pas (méthode DESC) ;
  - le plan de la semaine, avec un rappel d’agenda `.ics` ;
  - le carnet, avec export CSV ;
  - deux **exercices guidés** à faire seul(e) : « Imaginer autrement » (imagerie) et « Deux places, deux voix » (chaises). Ils commencent par une carte d’entrée à cocher, expliquent « Pourquoi cette étape ? » et notent l’émotion de 0 à 10, avant et après ;
  - des versions à imprimer (PDF, Word).
- **Aide** : numéros à un geste (3114, 15, 112, 114, 3919) et « Mes personnes ressources ».
- **Mon espace** : sauvegarde et restauration par fichier, impression, effacement.
- **Vie privée** : rien n’est envoyé. Tout reste dans le `localStorage` du navigateur ; il n’y a ni compte, ni cookie, ni statistiques, et les polices sont auto-hébergées. La lecture à voix haute ne lit que le texte du support, jamais les notes personnelles.
- **Écrans** : l’application est pensée d’abord pour le téléphone, puis pour la tablette et l’ordinateur. Sur un **écran géant** (téléviseur, vidéoprojecteur, 4K), elle s’agrandit d’un bloc par paliers, pour rester lisible de loin, par exemple en groupe.
- **Accessibilité** visée : WCAG 2.2 AA.
  - Mesures : Lighthouse accessibilité à 100 sur l’accueil et sur une leçon.
  - Moyens : clavier (les flèches font avancer les cartes), lien d’évitement, thème clair, sombre ou automatique, taille du texte réglable, animations réductibles, police Atkinson Hyperlegible.
  - Aucun audit externe pour l’instant.
- **Installable** (PWA) et utilisable **hors connexion** après la première visite.

## Démarrer

Prérequis : Node 20 ou plus.

```bash
npm ci
npm run fonts       # télécharge Atkinson Hyperlegible Next (facultatif : sinon polices système)
npm run dev         # http://localhost:5173 ; actualiser la page après une modification
npm run build       # produit dist/
npm run preview     # sert dist/ pour vérifier
npm run typecheck   # tsc --noEmit
npm run docs:questions   # régénère docs/QUESTIONS.md après une modification des questions
```

Test de bout en bout : il parcourt toutes les pages à 390 px, 1 366 px et 3 840 px, chaque carte des 24 leçons, des 45 temps de schémas, de la fiche et des deux exercices guidés (avec chaque étape d’animation), puis les rappels, le carnet, la sauvegarde et la restauration.

```bash
npm i --no-save playwright && npx playwright install chromium
npm run build && npm run test:e2e
```

## Publier sur GitHub Pages

Le workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) construit et publie le site à chaque envoi sur `main`. Le dépôt est déjà réglé : Settings → Pages → Source : « GitHub Actions ».

- Adresse : `https://<compte>.github.io/<nom-du-dépôt>/`, construite avec `BASE_PATH=/<nom-du-dépôt>/`.
- Nom de domaine propre (site à la racine) : `BASE_PATH=/ npm run build`.
- Indexation : le site porte `noindex, nofollow` par défaut. Pour l’autoriser, créer la variable de dépôt `SITE_INDEXABLE=1`.
- Les adresses sont « propres » (`/apprendre/schema`). `dist/404.html` sert de repli pour GitHub Pages. Les anciennes adresses de la version en huit parties redirigent vers les leçons.

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Une leçon (ses cartes, ses questions, son « À retenir ») | `src/learn/content/*.ts` |
| L’ordre des leçons, les chapitres, le choix des rappels | `src/learn/lessons.ts` |
| Les trois temps des 15 schémas (découpage en cartes) | `src/learn/schemaLessons.ts` |
| Les textes des 15 schémas | `src/data/schemas.generated.json` (extrait du diaporama) |
| Les textes du diaporama (parties 1 à 8), les numéros d’aide | `src/data/content.ts` |
| Les 5 bases | `src/data/bases.ts` |
| Les liens externes (annuaire, ameli) | `src/data/liens.ts` |
| Les références de la page « La thérapie des schémas » | `src/data/references.ts` |
| Le glossaire | `src/data/glossaire.ts` |
| Crédits, statut, mentions légales | `src/data/meta.ts` |
| Couleurs, typographie, paliers des écrans géants | `src/styles/tokens.css` |
| Le lecteur de leçons et ses styles | `src/learn/LessonPlayer.tsx`, `src/learn/Cards.tsx`, `src/styles/learn.css` |
| Les animations | `src/scenes/` et `src/styles/anim.css`, `anim-new.css` (les personnages assis ou à genoux de `NewScenes.tsx` utilisent un composant local `Person`, à côté du `Figure` commun) |
| Les versions à imprimer | `public/documents/` |

Une carte de leçon a un type parmi les suivants :
- `text` : titre, paragraphes, liste, citation ;
- `steps` : étapes numérotées ;
- `tiles` : petites cases ;
- `anim` : animation ;
- `widget` : exercice interactif ;
- `reflect` : note personnelle, gardée sur l’appareil ;
- `links` : boutons ;
- `quiz` : question.

Dans les textes, `[[id|mot]]` ouvre la définition du glossaire et `**gras**` met en avant.

## Choix techniques

- **React 19 et TypeScript**, avec **esbuild** (`scripts/build.mjs`) : fichiers statiques avec empreintes, chaque page étant chargée à la demande.
- **Routeur maison** (History API) et **stockage local observable** (`src/lib/store.ts`) : pas de dépendance en plus.
- **CSS écrit à la main** (variables CSS) et animations en SVG et CSS, sans bibliothèque.
- Les **écrans géants** sont gérés par la propriété CSS `zoom` posée par paliers sur `html`. Les hauteurs en `dvh` sont divisées par `--zoom`, car le zoom les agrandit aussi.
- Les polices sont **téléchargées au moment de la construction** (`npm run fonts`) puis servies par le site : le navigateur de la personne ne contacte jamais Google.

## À régler avant une diffusion publique

Voir [`docs/CONTENU.md`](docs/CONTENU.md), § 7 :
- les mentions légales (`src/data/meta.ts`) ;
- l’autorisation d’usage du logo du CRR ;
- la licence (le dépôt est public) ;
- la relecture du contenu ;
- le retrait du bandeau « Version de travail ».

Ce support **ne remplace pas un suivi avec un professionnel formé**, et ce n’est pas un dispositif médical.

## Crédits

Dr FENOHASINA T.J. Félicien ; Mme BASSO Sophie ; Mme LONG Aude ; Prof. FRANCK Nicolas.
D’après J. Young, J. Klosko et M. Weishaar.
