# Textes à relire avant diffusion

Ce document liste les textes **écrits ou réécrits pour la version web** (le diaporama v7 reste la source du reste).
Chaque ligne indique où se trouve le texte dans le code, pour le corriger à un seul endroit.

Légende : **Nouveau** = écrit pour le web · **Adapté** = repris du diaporama puis reformulé pour l’écran · **Repris** = identique au diaporama (non listé en détail).

> Voix du site : la personne parle à la première personne (« je choisis », « mon espace »). Les textes d’explication sont à la 3e personne ou à l’impératif doux. Les phrases d’exemple pour s’adresser à quelqu’un (méthode DESC) utilisent « vous » pour un chef et « tu » pour un proche, comme dans le diaporama.

## 1. Parcours et accueil — Nouveau

| Où | Texte |
|---|---|
| `src/pages/Home.tsx` | « Gratuit, sans compte. Mes réponses restent sur cet appareil. » |
| `src/pages/Home.tsx` (carte de bienvenue) | « Trois choses à savoir avant de commencer » : **Ni test, ni diagnostic** (reprend le chapeau « Comment utiliser ce support ») ; **Rien ne quitte cet appareil** (« Mes cases cochées et mes notes restent dans mon navigateur. Je peux tout effacer à tout moment. ») ; **Je peux m’arrêter quand je veux** (« Si ça ne va pas depuis plusieurs semaines, la page « Quand demander de l’aide » est faite pour ça. ») |
| `src/pages/Commencer.tsx` | Chapeau : « Il n’y a pas de bonne porte d’entrée : je choisis celle qui me ressemble aujourd’hui. Un schéma à la fois, un geste par semaine, à mon rythme. » |
| `src/pages/Commencer.tsx` (4 portes) | **Je découvre les schémas** — « Un parcours guidé en quatre étapes courtes… » *(environ 25 minutes)* · **Je cherche mon schéma** *(environ 10 minutes)* · **Je connais déjà mon schéma** *(quinze schémas, trois pages chacun)* · **Je traverse un moment difficile** *(environ une minute)*. **Les durées sont des estimations à confirmer.** |
| `src/data/parts.ts` | Durée par partie (5, 8, 6, 5, 10, 10, –, 5 minutes) : **estimations à confirmer**. |
| `src/pages/Commencer.tsx` | Encadré « Ce support ne remplace pas un suivi avec un professionnel formé » (reprend le diaporama). |

## 2. Partie 1 — Comprendre un schéma

- **Nouveau** · exemple interactif « lunettes » (`src/data/content.ts` → `p1.quoi.lunettesExemple`) : message « ok » lu de quatre façons (sans lunettes ; abandon ; imperfection ; méfiance).
- **Adapté** · quatre « idées reçues » avec réponse à dévoiler (`p1.recues`) : « Un schéma, c’est un diagnostic », « Un schéma se discute comme une idée », « Si j’ai un schéma, il y a un coupable », « Il suffit de le comprendre pour qu’il disparaisse ». Reformulées à partir des notes du diaporama.

## 3. Partie 2 — Les 5 besoins

- **Nouveau** · mécanisme en trois temps (`p2.flux`) : « Un besoin de l’enfant » → « Il manque, durablement » → « Un groupe de schémas peut se former », avec la note `p2.flux_note`.
- **Nouveau** · « À retenir » de la partie (`p2.retenir`, 3 phrases).
- **Adapté** · pour chaque base : le texte de l’animation (« Ce que montre l’animation ») et « À essayer cette semaine » (`src/data/bases.ts` → `anim.explication`, `anim.essai`), repris des notes d’animation du diaporama.
- **Nouveau** · encadré « Je peux m’arrêter ici » en bas de chaque base (`src/pages/Base.tsx`) : « Cette base peut réveiller des souvenirs. Si c’est trop lourd, je fais une pause, et j’en parle à un(e) professionnel(le) si cela dure. »

### Légendes des animations (une par étape) — Adapté / Nouveau

**Base 1 · Les lunettes**

1. Chaque jour, des événements variés et souvent ambigus : un message bref, un silence, une invitation.
2. Quand la sécurité a manqué, le schéma devient une paire de lunettes teintées.
3. Ce qui confirme le schéma ressort : « Sans réponse », « Annulé », « Critique »… et chacun renvoie à un schéma de la base 1.
4. Les événements qui le contredisent étaient pourtant là : un câlin, un merci, l’appel d’un ami… mais ils passent inaperçus.
5. Les lunettes ne changent pas la réalité : elles changent ce qu’on en retient. Pour voir autrement : repérer les lunettes, puis chercher aussi ce qui les contredit.

**Base 2 · Les marches**

1. « Quand je serai prêt(e)… » En attendant, rien ne bouge : la confiance ne monte pas seule.
2. C’est l’inverse : on essaie un petit pas, et la confiance suit. « Et si j’essayais un petit pas ? »
3. Un premier pas : choisir mon repas. La confiance monte un peu.
4. Chaque petit pas réussi ajoute un peu de confiance.
5. Un pas plus difficile, une petite erreur : la confiance baisse un peu.
6. Mais elle ne retombe pas à zéro : on réessaie, et elle remonte.
7. Marche après marche, la confiance se construit.
8. La confiance ne vient pas avant l’essai : elle vient après. Commencer par un tout petit pas suffit.

**Base 3 · Le verre qui déborde**

1. Chaque besoin, chaque émotion qu’on tait reste en nous, comme de l’eau dans un verre.
2. On se tait, encore et encore : le niveau monte.
3. Un jour, ça déborde : « J’en ai assez ! » Et l’on en conclut : « Tu vois, s’exprimer est dangereux. »
4. Même semaine, mais on dit les petites choses quand elles arrivent : le verre reste à un niveau supportable. « Ce soir, je ne peux pas. »
5. Dire tôt et petit se reçoit mieux que dire tard et fort. Un besoin dit à temps reste un besoin, pas un reproche.

**Base 4 · La journée**

1. Une journée habituelle : tout vérifier, relire encore, garder un visage neutre, ne pas se plaindre.
2. Contrôler ses émotions et viser la perfection use l’énergie, et la tension monte.
3. Même journée, avec un temps pour le jeu et le droit de se plaindre : l’énergie tient mieux.
4. Se plaindre, c’est décharger la tension émotionnelle : dire que ça pèse, à quelqu’un de sûr.
5. Le jeu et la spontanéité sont des besoins, pas des récompenses à mériter. Même un petit moment compte, et dire que ça pèse aussi.

**Base 5 · La vague**

1. Une envie monte comme une vague, de plus en plus fort.
2. Céder coupe la vague en route : soulagement immédiat, mais on ne saura jamais si elle serait passée.
3. Si j’attends : « Je respire. J’attends. » La vague continue de monter…
4. …elle atteint un pic, puis redescend d’elle-même, en une dizaine de minutes environ.
5. L’envie est une vague : elle monte, culmine, redescend. On n’a pas à lui obéir pendant qu’elle passe.


Le cercle (partie 3) et l’adulte sain (partie 4) : légendes dans `src/scenes/ConceptScenes.tsx` (cercle : **Nouveau** ; adulte sain : reprend les étapes du diaporama).

## 4. Partie 3 — Comment un schéma s’entretient

- **Nouveau** · « À retenir » (`p4.retenir3`, 3 phrases).
- **Nouveau** · réponses à la question « Quel âge ai-je l’impression d’avoir ? » (`p3.signes.age`) : message selon que le curseur est dans l’enfance ou à l’âge adulte, et « Il n’y a pas de bonne réponse : c’est une façon de se repérer. »
- **Nouveau** · encadré « On les repère, on ne les « choisit » pas » (`src/pages/Entretien.tsx`) : précise que capituler, éviter et surcompenser sont des réactions à **repérer**, pas des conseils (suite à la remarque sur la formulation « Trois façons de réagir, selon les jours »). Même mise en garde « À repérer, pas à suivre » dans l’onglet « Comprendre » de chaque schéma.

## 5. Partie 4 — Ce qui aide à s’en sortir

- **Nouveau** · « À retenir » (`p4.retenir4`, 3 phrases).
- **Nouveau** · colonne « De mon côté » des quatre leviers (`p4.leviers.items[].seul`) : « C’est ce que fait ce support. » ; « En attendant ou en complément d’un suivi : écrire ce que je ressens, mot par mot, sans l’analyser. Un souvenir très douloureux se travaille avec un professionnel. » ; « Un geste par semaine, noté dans le carnet. » ; « En attendant ou en complément d’un suivi : m’appuyer sur un proche sûr, un groupe d’entraide, un atelier ou un club. »

## 6. Partie 5 — Trouver mon schéma

- **Adapté** · fiche à cocher : trois repères (« Ça sonne vrai », « Ça revient souvent », « Ça me coûte ») par schéma, priorités (garder au plus 3), choix du schéma « par lequel je commence ».
- **Repris** · précision demandée : le repérage fiable se fait avec le YSQ-2 passé avec un(e) professionnel(le).

## 7. Partie 6 — Mes outils

- **Adapté** · carte-mémo (six lignes, 3 cartes maximum), pré-remplie avec les mots du support : à réécrire avec ses propres mots.
- **Nouveau** · « La pause en trois temps » avec respiration guidée : textes de l’interface (`src/pages/Pause.tsx`) et possibilité de « Noter dans mon carnet ».
- **Adapté** · « Dire ce qui ne va pas » : trois situations (chef, partenaire, proche) et quatre temps D-E-S-C. Les libellés d’étapes et le champ « Avec mes mots » sont nouveaux.
- **Nouveau** · fichier d’agenda « Bilan de ma semaine » (`.ics`) : titre « Bilan de ma semaine (5 minutes) » et description (les trois questions du bilan + le geste choisi).

## 8. Partie 7 — Mes schémas, un par un

- **Adapté** · trois pages par schéma reprises du diaporama, présentées en quatre onglets : *Comprendre*, *Dans le moment*, *Au fil des semaines*, *Ma carte*.
- **Nouveau** · contextes « Domaine de vie » (partenaire, proche, travail…) quand le schéma en a plusieurs ; les textes viennent des fiches schémas mais leur découpage en choix est nouveau.
- **Nouveau** · invitations de repli lorsqu’un schéma n’a pas de texte « pour moi » : « Avant la prochaine situation, je relis ces gestes et j’en choisis un seul. » et « Je choisis un geste, je le tente pendant une semaine et je note ce qui s’est vraiment passé. »
- **Nouveau** · schéma « Méfiance, abus » : message de prudence plus visible (danger, emprise → « Quand demander de l’aide »).

## 9. Partie 8 — Pour la suite

- **Repris** · « Quand demander de l’aide » (signes, numéros 3114 / 15 / 112 / 3919), « Où trouver un soutien », « À retenir », « Mon carnet », « Pour aller plus loin ».
- **Nouveau** · « Sans thérapeute pour l’instant : où trouver un soutien » (lien interne à la place de « voir la page suivante »).
- **Nouveau** · carnet interactif : champs « Émotion ressentie » (mot) + « Intensité de 0 à 10 », « Si une situation est trop lourde » (« Je n’ai pas à la noter en détail… »), phrase « Ce carnet reste sur cet appareil… ».
- **Nouveau** · « Pour finir » (titre d’intitulé), « Quatre pages · Ce dont j’ai besoin maintenant », bouton « Retourner à mes schémas ».

## 10. Pages d’appui — Nouveau

- `src/pages/MonEspace.tsx` : tout le texte (parcours, schémas gardés, carte-mémo, plan, carnet, notes, **sauvegarder / restaurer / imprimer / tout effacer**).
- `src/pages/Glossaire.tsx` : titre « Les mots du support » ; entrées dans `src/data/glossaire.ts`. **Entrées nouvelles** : « Domaine de schémas » et « Thérapie des schémas ». Les autres reprennent ou condensent des définitions du diaporama : à relire une à une.
- `src/pages/APropos.tsx` : « Un support d’autosoin », « Ce que ce site n’est pas », « Ce qui reste sur mon appareil », installation sur téléphone / ordinateur, accessibilité, crédits.
- `src/components/Settings.tsx` : réglages d’affichage (thème, taille du texte, animations, mode « accompagnant(e) »).
- `src/pages/NotFound.tsx` : « Cette page n’existe pas (ou plus). »

## 11. Affirmations à vérifier avant diffusion

Ces points viennent du diaporama ou de sources lues pendant la préparation ; je ne les ai **pas** revérifiés pour cette version :

1. **Mon soutien psy** : « jusqu’à douze séances avec un psychologue, en partie remboursées, sur orientation d’un médecin » — conditions qui évoluent (la note du diaporama le signale déjà).
2. **3919** : écoute anonyme 24 h/24 pour les violences sexistes et sexuelles — numéro à confirmer avant diffusion.
3. **YSQ-2** : « la forme courte (S2) compte 75 questions et mesure 15 schémas » et la référence de la version française (Mauchand, Lachenal-Chevallet et Cottraux, *L’Encéphale*, 2011 ; 37 : 138-143).
4. **Durée d’une envie** : « une dizaine de minutes environ » (animation de la base 5, partie « vague »). C’est un ordre de grandeur pédagogique, pas une mesure.
5. **Méthode DESC** : attribuée à Bower et Bower (années 1970).
6. **Livres cités** (partie 8) : intitulés, auteurs et éditeurs à contrôler.
7. **Statut « Version de travail · en attente de relecture »** affiché partout : à retirer (`src/data/meta.ts` → `statut`) quand le contenu aura été relu et validé.

## 12. Décisions qui vous appartiennent

- **Site public ou rattaché au CRR ?** Cela change les mentions légales (éditeur, directeur de la publication, hébergeur, contact : champs vides dans `src/data/meta.ts`, la section « Mentions légales » de la page À propos n’apparaît que s’ils sont remplis) et l’indexation (par défaut `noindex`).
- **Logo du CRR** : utilisé dans le pied de page et dans « À propos » ; à confirmer avec le CRR avant mise en ligne.
- **Licence** : `UNLICENSED` dans `package.json` ; à choisir (par exemple CC BY-NC-ND pour les textes, MIT pour le code) avant de rendre le dépôt public.
