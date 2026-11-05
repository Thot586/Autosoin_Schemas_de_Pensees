# Textes à relire avant diffusion

Version 0.2 (novembre 2026) : le support est réorganisé en **leçons courtes, une idée par écran**, pour des personnes qui ont du mal à se concentrer.

## L’essentiel

**Ce qui change pour la personne.**
- Les huit longues parties deviennent **22 leçons de 2 à 5 minutes**, en six étapes. Chaque écran porte une seule idée : un titre et deux ou trois phrases. Les boutons « Retour » et « Suivant » sont en bas de l’écran, sous le pouce. « Quitter » garde la position, et le bouton « Aide » reste toujours visible.
- **Rappels** à trois niveaux :
  - une question d’une leçon précédente ouvre chaque leçon ;
  - chaque leçon se termine par « À retenir » ;
  - « Mon rappel du jour » repose trois questions, en revenant plus souvent sur les idées à revoir (révisions espacées).
- **Questions** : il y en a 78, et elles portent toujours sur une idée du support, jamais sur la personne. Il n’y a ni note ni rouge, et une explication suit chaque réponse. La liste complète est dans [`QUESTIONS.md`](QUESTIONS.md).
- **Nouveaux contenus** (demandés) : ce qu’est la thérapie des schémas, les limites du support, demander de l’aide et trouver un thérapeute formé (annuaire).
- **Trois nouvelles animations** :
  - un parapluie : d’où vient un schéma ;
  - les trois façons de réagir ;
  - le chemin d’une thérapie.
- Les 15 schémas gardent leurs trois temps : comprendre, dans le moment, au fil des semaines. Ils sont découpés en cartes.

**À relire en priorité.**
1. Les textes **nouveaux** du chapitre « Avant de commencer » (§ 2), en particulier la leçon sur la thérapie des schémas et celle sur les limites.
2. Les **79 questions** et leurs explications : voir [`QUESTIONS.md`](QUESTIONS.md).
3. Les **légendes** des trois nouvelles animations (§ 4).
4. Les **corrections factuelles** issues de la vérification du 5 novembre 2026 (§ 5). Ce sont les numéros d’aide, *Mon soutien psy* et l’annuaire.

**Décisions qui vous appartiennent** : voir § 7. Il s’agit des mentions légales, du logo du CRR, de la licence, de la diffusion des fiches PDF et Word, et du retrait du bandeau « Version de travail ».

Légende : **Nouveau** = écrit pour le web · **Adapté** = repris du diaporama puis découpé ou reformulé · **Repris** = identique au diaporama.

> Voix du site : la personne parle à la première personne (« je choisis », « mon carnet »), comme dans le diaporama. Les questions sont impersonnelles (« Un schéma, c’est… »).

## 1. Où se trouvent les textes

| Contenu | Fichier |
|---|---|
| Chapitre « Avant de commencer » (3 leçons) | `src/learn/content/avant.ts` |
| « Comprendre un schéma » (4 leçons) | `src/learn/content/comprendre.ts` |
| « Les 5 besoins, un par un » (5 leçons, générées depuis les bases) | `src/learn/content/besoins.ts` + `src/data/bases.ts` |
| « Comment un schéma agit » (3 leçons) | `src/learn/content/cercle.ts` |
| « Ce qui aide » (3 leçons) | `src/learn/content/aide.ts` |
| « Passer à l’action » (4 leçons) | `src/learn/content/action.ts` |
| Les 15 schémas en cartes | `src/learn/schemaLessons.ts` (textes : `src/data/schemas.generated.json`, repris du diaporama) |
| Questions construites à partir des données | `src/learn/gen.ts` |
| Textes du diaporama (parties 1 à 8) | `src/data/content.ts` |
| Numéros d’aide, *Mon soutien psy*, lectures | `src/data/content.ts` (`p8`) |
| Liens externes (annuaire, ameli) | `src/data/liens.ts` |
| Références de la page « La thérapie des schémas » | `src/data/references.ts` |
| Glossaire | `src/data/glossaire.ts` |
| Légendes des animations | `src/scenes/` (`BaseScenes.tsx`, `ConceptScenes.tsx`, `NewScenes.tsx`) |

## 2. Textes nouveaux, leçon par leçon

### Avant de commencer — **Nouveau**
- **Bienvenue** : mode d’emploi (une idée par écran, « Écouter », quitter et reprendre), « Des questions pour retenir », « Si ça ne va pas ».
- **La thérapie des schémas**. Ce qu’elle est, pour qui, son idée centrale, ce qu’on fait en séance (imagerie, dialogue des chaises), ce qu’en disent les études, ce qu’on ne sait pas encore, et la place de ce support. Les phrases sur l’origine et sur l’efficacité reprennent les faits vérifiés du § 5.
- **Ce que ce support ne fait pas**. Six points :
  - ce n’est ni un diagnostic ni un soin ;
  - « je ne change pas mon traitement sans en parler à mon médecin » ;
  - pas pendant une crise ;
  - il peut réveiller des souvenirs ;
  - il n’a pas été évalué et le contenu est en relecture ;
  - sur un appareil partagé, quelqu’un pourrait lire mes notes.

### Comprendre un schéma — **Adapté** (diapos 4, 5, 7, 8)
- Le contenu des diapos est découpé en une carte par idée. L’exemple « lunettes » (un message « ok » lu de quatre façons) est repris de la version web précédente.
- **Nouveau** : la carte « Plusieurs bases à la fois » et l’entrée de glossaire « Tempérament ».

### Les 5 besoins, un par un — **Adapté** (diapos 9 à 18)
Pour chaque base : le besoin, ce qui se passe quand il manque, ses schémas et leur phrase, l’animation, « À essayer cette semaine », deux questions. Les « À retenir » de chaque base sont **nouveaux** (`RETAIN` dans `besoins.ts`).

### Comment un schéma agit — **Adapté** (diapos 20 à 22)
**Nouveau** : les exemples de la carte « On peut sortir du cercle » (« Tiens, ça ressemble à avant. » ; « C’est de la peur, 7 sur 10. »).

### Ce qui aide — **Adapté** (diapos 24, 25, 89, 90, 93)
**Nouveau** : la carte « Un thérapeute formé aux schémas » (annuaire de l’IFTS, « j’en parle d’abord avec mon équipe de soins »).

### Passer à l’action — **Adapté** (diapos 27, 28, 37 à 39)
Les six mots de la méthode, la méthode en trois étapes, la pause en trois temps (avec trois respirations guidées), et dire ce qui ne va pas (méthode DESC). Les exemples de phrases DESC sont ceux de la situation « avec un ami ».

### Pages d’appui
- **Besoin d’aide ?** (`src/pages/Aide.tsx`) — **Nouveau**. Les numéros sont en tête, à toucher pour appeler. Viennent ensuite « Pour me poser, tout de suite » et les cinq signes du diaporama, puis **« Mes personnes ressources »** (nom et téléphone, enregistrés sur l’appareil), repris de la fiche PDF « Quand demander de l’aide ».
- **La thérapie des schémas** (`src/pages/Therapie.tsx`) — **Nouveau** : la leçon sur une page, l’annuaire et les sources.
- **Où trouver un soutien** (`src/pages/Soutien.tsx`) — **Adapté** (diapos 90 et 93).
- **À propos** : section « Ses limites » réécrite (six points, reprise de la leçon).
- **Mon espace** : « Ce que j’ai retenu, leçon par leçon » (**Nouveau**).

## 3. Les questions

- Elles portent sur les **idées du support**, jamais sur la personne. Aucune ne demande « Avez-vous tel schéma ? ».
- Les réponses ne sont **pas notées**. La bonne réponse s’affiche en vert avec une coche ; la réponse choisie, si elle est autre, est en pointillés, sans rouge. Le retour commence par « Oui, c’est ça » ou « Pas tout à fait », puis vient l’explication.
- Rappels espacés (boîtes de Leitner) :
  - une idée retrouvée du premier coup revient dans 3 jours, puis dans 7, 14 et 30 jours ;
  - une idée à revoir revient le lendemain.
- 47 questions sont écrites à la main, dans les leçons. Les autres sont construites à partir des données du diaporama : la phrase de chaque schéma, le besoin de chaque base, et la phrase d’adulte sain opposée à la petite voix.
- **Toutes les questions** sont listées, avec leurs bonnes réponses et leurs explications, dans [`QUESTIONS.md`](QUESTIONS.md). Ce fichier se régénère avec `npm run docs:questions`.

## 4. Animations

Les sept animations du diaporama sont gardées : lunettes, marches, verre, journée, vague, cercle, adulte sain. Le lecteur ne démarre plus tout seul ; on appuie sur « Lire », et le rythme est plus lent.

**Nouvelles animations, légendes (Nouveau)** :

**D’où vient un schéma (le parapluie)**, leçon « D’où viennent les schémas ? »
1. Tout enfant a des besoins : être en sécurité, être aimé, être écouté.
2. Parfois, un besoin manque. Pas une fois : souvent, pendant longtemps.
3. L’enfant fait comme il peut pour se protéger. Il ouvre un parapluie.
4. Ce parapluie l’aide à tenir. C’est une adaptation, pas un défaut.
5. Adulte, le parapluie reste ouvert, même quand il fait beau. Il cache aussi le soleil.
6. Le schéma ressemble à ce parapluie. Petit à petit, on peut apprendre à le baisser quand il n’est plus utile.

**Trois façons de réagir**, leçon du même nom
1. Le schéma s’allume. Sa petite voix dit : « Si on me connaissait vraiment, on ne m’aimerait pas. »
2. Capituler, c’est faire comme si c’était vrai. Je me fais tout petit. C’est le réflexe de se figer.
3. Éviter, c’est fuir ce qui réveille le schéma. Je m’éloigne. C’est le réflexe de fuir.
4. Surcompenser, c’est faire l’inverse, en excès. Je me fais très grand. C’est le réflexe de combattre.
5. Les trois soulagent sur le moment. Mais à chaque fois, la petite voix devient plus forte.
6. Ce sont des réflexes à repérer, pas des conseils à suivre. L’adulte sain peut choisir un autre geste.

**Le chemin d’une thérapie des schémas**, leçon « La thérapie des schémas »
1. La thérapie des schémas se fait avec un thérapeute formé, en séances régulières.
2. Comprendre : repérer ses schémas, et d’où ils viennent.
3. Ressentir : revenir aux émotions anciennes, en sécurité, avec le thérapeute.
4. Agir autrement : remplacer la réaction automatique par un petit pas.
5. Être en lien : vivre une relation qui répond enfin au besoin.
6. Le but : renforcer l’adulte sain, la part de soi qui prend soin de ses besoins.

## 5. Faits vérifiés le 5 novembre 2026

Les références sont passées par PubMed, Crossref et Europe PMC, avec DOI, titre, auteurs et année ; aucune n’était dans Zotero. Les livres ont été vérifiés dans le catalogue BnF et sur Cambridge Core, les sites officiels ouverts directement. Seules des adresses réellement consultées sont utilisées.

| Point | Ce qui est affiché | Source |
|---|---|---|
| Origine | Créée par le psychologue américain Jeffrey Young, décrite pour la première fois en **1990**. Jeffrey Young venait de la thérapie cognitive d’A. Beck et y a ajouté l’attachement, les thérapies psychodynamiques et un travail sur les émotions. **Corrigé** : la version précédente disait « fin des années 1980 ». | Taylor et coll. 2017, doi:10.1111/papt.12112 ; Kellogg et Young 2006, doi:10.1002/jclp.20240 |
| Efficacité | Surtout étudiée dans les troubles de la personnalité, en particulier le trouble borderline. Elle réduit les difficultés et améliore la qualité de vie, avec moins d’abandons. | Giesen-Bloo 2006, doi:10.1001/archpsyc.63.6.649 ; Bamelis 2014, doi:10.1176/appi.ajp.2013.12040518 ; Arntz 2022, doi:10.1001/jamapsychiatry.2022.0010 ; Zhang 2023, doi:10.1080/08039488.2023.2228304 |
| Limites | Les études sont peu nombreuses. Les preuves restent fragiles pour la dépression, l’anxiété, les traumatismes et les troubles alimentaires. C’est une thérapie longue : 2 à 3 ans dans les grands essais sur le trouble borderline. | Taylor 2017 ; Peeters 2022, doi:10.1111/bjc.12324 ; Arntz 2022 |
| YSQ-S2 | 75 questions, 15 schémas. Le modèle complet compte 18 schémas en 5 domaines ; le YSQ-S3 couvre les 18. | Mauchand, Lachenal-Chevallet, Cottraux, *L’Encéphale* 2011;37(2):138-143, doi:10.1016/j.encep.2010.04.014 |
| Annuaire | Institut Français de Thérapie des Schémas (IFTS), association de formation qui ne soigne pas. L’annuaire est à **schematherapie.fr/annuaire-therapeutes** : il recense des thérapeutes formés, certains certifiés ISST, et ce sont eux qui déclarent leurs informations. **Corrigé** : l’ancienne adresse menait à la page de présentation. Annuaire international : schematherapysociety.org/Find-a-Therapist. | schematherapie.fr ; schematherapysociety.org |
| *Mon soutien psy* | 12 séances par an, sans ordonnance, avec un psychologue partenaire, remboursées en partie. Pour des difficultés légères à modérées ; il exclut en général les personnes **déjà suivies en psychiatrie**. **Corrigé** : la version précédente disait « sur orientation d’un médecin ». Le lien mène désormais à ameli.fr. | ameli.fr, page du 16/09/2026 |
| 3114 | Prévention du suicide, pour soi ou pour un proche : gratuit, 24 h/24, 7 j/7. | 3114.fr |
| 15, 112 | Urgence médicale (SAMU) ; numéro d’urgence européen. Gratuits, même depuis un téléphone bloqué ou sans crédit. | masecurite.interieur.gouv.fr (13/07/2026) ; ameli.fr (10/06/2026) |
| **114 (ajouté)** | Urgence pour les personnes sourdes, sourdaveugles, malentendantes ou aphasiques : SMS, visio, tchat, application. Gratuit, 24 h/24. | info.urgence114.fr |
| 3919 | Violences Femmes Info : pour les **femmes** victimes de violences, leur entourage et les professionnels. Anonyme, gratuit, 24 h/24. **Ce n’est pas un numéro d’urgence.** **Corrigé** : la version précédente disait « violences sexistes et sexuelles ». | arretonslesviolences.gouv.fr ; masecurite.interieur.gouv.fr |
| Méthode DESC | S. A. Bower et G. H. Bower, *Asserting Yourself*, Addison-Wesley, **1976**. | Open Library ; Brodowski 2026, doi:10.1177/23821205261431560 |
| Lectures | *La thérapie des schémas* : De Boeck, traduction B. Pascal, 3e édition 2024. *Je réinvente ma vie* : Éditions de l’Homme, 1995, traduction M. Perron, réédition 2018. *Cambridge Guide to Schema Therapy* : Brockman, Simpson, Hayes, van der Wijngaart, Smout, 2023. | Catalogue BnF ; Cambridge Core, doi:10.1017/9781108918145 |

## 6. Encore à vérifier, ou à dire avec prudence

1. Une méta-analyse en **préprint** (Arendt et coll., Research Square, août 2026, non relue par des pairs) ne trouve pas de différence nette avec les groupes témoins, avec une certitude très faible. Elle n’est pas citée dans l’application. Elle justifie le ton prudent de la carte « Ce qu’on ne sait pas encore ». À surveiller.
2. L’ouverture 24 h/24 du 15 et du 112 repose sur une phrase officielle générale, pas sur chaque numéro. L’application ne l’écrit pas.
3. Le titre exact du livre de Young de 1990 n’a pas été trouvé en catalogue. Il n’est pas cité.
4. La durée d’une envie (« une dizaine de minutes environ », animation « vague ») est un ordre de grandeur pédagogique, pas une mesure.
5. Le statut « Version de travail · en attente de relecture » s’affiche toujours. Pour le retirer, il faut vider le champ `statut` dans `src/data/meta.ts`.

## 7. Décisions qui vous appartiennent

- **Site public ou rattaché au CRR ?** La réponse change les mentions légales (éditeur, directeur de la publication, hébergeur, contact), à remplir dans `src/data/meta.ts`. Elle change aussi l’indexation, qui est `noindex` par défaut.
- **Logo du CRR** (pied de page, À propos) : à confirmer avant la diffusion.
- **Fiches à imprimer** : les trois PDF et les deux documents Word de `Other_data` sont publiés dans « Mes outils », rubrique « Versions à imprimer ». Le diaporama, lui, n’est pas publié. Oui ou non ?
- **Licence** : `UNLICENSED` pour l’instant (`package.json`). Or le dépôt GitHub est déjà **public** : il faut donc choisir une licence, par exemple CC BY-NC-ND pour les textes et MIT pour le code.
- **Statut « Version de travail »** : à retirer après relecture.
