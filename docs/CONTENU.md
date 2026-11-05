# Textes à relire avant diffusion

Version 0.2 (novembre 2026) : le support est réorganisé en **leçons courtes, une idée par écran**, pour des personnes qui ont du mal à se concentrer.

## L’essentiel

**Ce qui change pour la personne.**
- Les huit longues parties deviennent **24 leçons de 2 à 5 minutes**, en six étapes. Chaque écran porte une seule idée : un titre et deux ou trois phrases. Les boutons « Retour » et « Suivant » sont en bas de l’écran, sous le pouce. « Quitter » garde la position, et le bouton « Aide » reste toujours visible.
- **Rappels** à trois niveaux :
  - une question d’une leçon précédente ouvre chaque leçon ;
  - chaque leçon se termine par « À retenir » ;
  - « Mon rappel du jour » repose trois questions, en revenant plus souvent sur les idées à revoir (révisions espacées).
- **Questions** : il y en a 85, et elles portent toujours sur une idée du support, jamais sur la personne. Il n’y a ni note ni rouge, et une explication suit chaque réponse. La liste complète est dans [`QUESTIONS.md`](QUESTIONS.md).
- **Nouveaux contenus** (demandés) : ce qu’est la thérapie des schémas, les limites du support, demander de l’aide et trouver un thérapeute formé (annuaire).
- **L’imagerie et le dialogue des chaises** : deux leçons qui expliquent ces techniques de séance et pourquoi elles peuvent aider. Ce qui est démontré est dit comme tel, et ce qui reste une hypothèse commence par « On pense que… ». Deux **exercices guidés** les accompagnent, à faire seul(e), avec des garde-fous (§ 2).
- **Cinq nouvelles animations** (dont l’imagerie et les chaises en séance) ; les textes qui défilent dessous ont été réécrits comme on raconte, sans étiquettes ni formules :
  - un parapluie : d’où vient un schéma ;
  - les trois façons de réagir ;
  - le chemin d’une thérapie.
- Les 15 schémas gardent leurs trois temps : comprendre, dans le moment, au fil des semaines. Ils sont découpés en cartes.

**À relire en priorité.**
1. Les textes **nouveaux** du chapitre « Avant de commencer » (§ 2), en particulier la leçon sur la thérapie des schémas et celle sur les limites.
2. Les **85 questions** et leurs explications : voir [`QUESTIONS.md`](QUESTIONS.md).
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
| « Ce qui aide » (5 leçons) | `src/learn/content/aide.ts` et `src/learn/content/techniques.ts` (imagerie, chaises) |
| « Passer à l’action » (4 leçons) | `src/learn/content/action.ts` |
| Les 15 schémas en cartes | `src/learn/schemaLessons.ts` (textes : `src/data/schemas.generated.json`, repris du diaporama) |
| Questions construites à partir des données | `src/learn/gen.ts` |
| Textes du diaporama (parties 1 à 8) | `src/data/content.ts` |
| Numéros d’aide, *Mon soutien psy*, lectures | `src/data/content.ts` (`p8`) |
| Liens externes (annuaire, ameli) | `src/data/liens.ts` |
| Références de la page « La thérapie des schémas » | `src/data/references.ts` |
| Glossaire | `src/data/glossaire.ts` |
| Leçons « L’imagerie » et « Le dialogue des chaises » | `src/learn/content/techniques.ts` |
| Exercices guidés « Imaginer autrement » et « Deux places, deux voix » | `src/learn/content/exercices.ts` |
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
Pour chaque base : le besoin, ce qui se passe quand il manque, ses schémas et leur phrase, l’animation, « À essayer cette semaine », deux questions. **Adapté, à relire** : trois phrases de l’animation des lunettes (base 1) ont été réécrites pour sonner naturel. Les « À retenir » de chaque base sont **nouveaux** (`RETAIN` dans `besoins.ts`).

### Comment un schéma agit — **Adapté** (diapos 20 à 22)
**Nouveau** : les exemples de la carte « On peut sortir du cercle » (« Tiens, ça ressemble à avant. » ; « C’est de la peur, 7 sur 10. »).
**Adapté, à relire** : le texte de l’animation du cercle a été réécrit pour sonner naturel (voir § 4).

### Ce qui aide — **Adapté** (diapos 24, 25, 89, 90, 93)
**Nouveau** : la carte « Un thérapeute formé aux schémas » (annuaire de l’IFTS, « j’en parle d’abord avec mon équipe de soins »).
**Adapté, à relire** : le texte de l’animation de l’adulte sain est réécrit comme un récit, sans les titres d’étape (voir § 4).

### Ce qui aide : l’imagerie et le dialogue des chaises — **Nouveau**
- Placées juste après « Ce qui aide à s’en sortir ». La carte « Ressentir » des leviers y renvoie, ainsi que la leçon « La thérapie des schémas » et le glossaire.
- **L’imagerie** (`imagerie`). Les cartes expliquent :
  - comment se déroule une réécriture en imagination en séance : d’abord le thérapeute, puis l’adulte d’aujourd’hui ;
  - pourquoi passer par des images ;
  - que le passé ne change pas, mais que son sens peut changer ;
  - que l’enfant reçoit enfin ce qui lui manquait ;
  - ce qu’on en sait ;
  - qu’un souvenir douloureux ne se revit pas seul(e).
- **Le dialogue des chaises** (`chaises`). Les cartes expliquent :
  - une place pour chaque part de soi, et l’origine de la technique ;
  - que la petite voix n’est pas toute la vérité ;
  - qu’on cherche à ressentir, pas seulement à en parler ;
  - qu’on s’entraîne à répondre ;
  - ce qu’on en sait ;
  - que la petite voix est une pensée, pas une voix entendue (carte de prudence).
- Chaque mécanisme a sa carte, et son détail sourcé se trouve dans « En savoir plus ». Ce sont des hypothèses, sauf pour l’effet plus fort des images sur l’émotion, établi en laboratoire pour l’anxiété.
- Six nouvelles questions, dont une de prudence par leçon.

### Exercices guidés — **Nouveau** (`/outils/imagerie`, `/outils/chaises`)
- Ce sont des **adaptations prudentes**. Les deux leçons disent clairement qu’aucune étude n’a porté sur ces techniques faites seul(e).
- **Accès libre, avec avertissement et orientation.** Le CRR ne prend pas en charge de patients : chaque exercice commence donc par deux cartes.
  - « **À savoir avant d’essayer** » : c’est une version simplifiée d’une technique de séance, non étudiée faite seul(e) ; ce n’est pas une thérapie et elle ne remplace pas un suivi. Elle n’est pas faite pour un souvenir de violence ou d’abus, un moment de crise ou une émotion déjà très forte, ni si j’entends des voix ou me sens souvent « ailleurs ».
  - « **Pour être accompagné(e)** » : mon médecin traitant, un centre médico-psychologique (CMP, gratuit), un psychologue ou un thérapeute formé aux schémas. En danger : 3114, 15 ou 112. Des liens mènent vers « Où trouver un soutien » et « Numéros d’aide ».
  - Dans « Mes outils », les deux exercices sont regroupés sous « Exercices inspirés de la thérapie », avec le même avertissement.
- Partout où le texte disait « mon équipe de soins », il ajoute désormais le médecin traitant ou un CMP, pour qui n’est pas suivi.
- **Carte d’entrée** à cocher : « Suivant » reste bloqué tant que les trois phrases ne sont pas cochées.
  - Au calme, dix minutes.
  - Une scène **récente et légère**, jamais un souvenir de violence ou d’abus.
  - Je sais m’arrêter.
  - S’y ajoutent : « Si je suis suivi(e) en psychiatrie, j’en parle d’abord à mon équipe de soins », et pour les chaises, « la petite voix est une pensée ; si j’entends des voix, je ne fais pas cet exercice seul(e) ».
- Chaque étape porte une ligne **« Pourquoi cette étape ? »** et un rappel pour se recentrer : ouvrir les yeux, pieds au sol, cinq choses que je vois, avec un lien vers la pause en trois temps.
- **Échelle de 0 à 10**, avant et après l’exercice. Si l’émotion est à 7 ou plus au départ, l’exercice ne continue pas : le bouton devient « Aujourd’hui, je fais plutôt la pause », et le lien vers la pause en trois temps est affiché. Si elle est montée à la fin, elle conseille de s’arrêter et d’en parler à l’équipe de soins.
- **Imaginer autrement** :
  - lieu calme (avec une alternative si ce lieu met mal à l’aise) ;
  - une scène récente et légère, et ce dont j’avais besoin ;
  - l’adulte sain qui entre dans la scène ;
  - le geste répété en imagination ;
  - le retour au présent.
- **Deux places, deux voix** :
  - deux places, ou deux colonnes sur une feuille ;
  - la petite voix (courte) ;
  - ce que ça me fait ;
  - l’adulte sain debout, qui répond avec fermeté puis avec douceur ;
  - l’adulte sain a toujours le dernier mot.
- Leçon « Ce qui aide à s’en sortir », carte « Ressentir » : une phrase de cadre a été ajoutée au conseil d’écrire ce que je ressens. J’écris sur une situation d’aujourd’hui, pas sur un souvenir qui fait très mal, et je fais une pause si l’émotion monte (§ 6).

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
- 53 questions sont écrites à la main, dans les leçons. Les autres sont construites à partir des données du diaporama : la phrase de chaque schéma, le besoin de chaque base, et la phrase d’adulte sain opposée à la petite voix.
- **Toutes les questions** sont listées, avec leurs bonnes réponses et leurs explications, dans [`QUESTIONS.md`](QUESTIONS.md). Ce fichier se régénère avec `npm run docs:questions`.

## 4. Animations

Les sept animations du diaporama sont gardées : lunettes, marches, verre, journée, vague, cercle, adulte sain. Le lecteur ne démarre plus tout seul ; on appuie sur « Lire », et le rythme est plus lent.

**Textes réécrits pour sonner naturels.** Les textes du cercle, de l’adulte sain et des lunettes étaient assemblés automatiquement (« titre. texte. Exemple (abandon) : … »). Ils sont réécrits sans changer le sens : `ConceptScenes.tsx`, `BaseScenes.tsx`.

**Nouvelles animations, légendes (Nouveau)** : `src/scenes/NewScenes.tsx` (constantes `PARAPLUIE_CAPS`, `REACTIONS_CAPS`, `THERAPIE_CAPS`, `IMAGERIE_CAPS`, `CHAISES_CAPS`).
- **D’où vient un schéma (le parapluie)**, leçon « D’où viennent les schémas ? ».
- **Trois façons de réagir** : capituler, éviter, surcompenser, présentés comme des réflexes (se figer, fuir, combattre).
- **Le chemin d’une thérapie des schémas** : comprendre, ressentir, agir autrement, être en lien.
- **La réécriture en imagination, en séance** : déroulé seulement, sans mécanisme.
- **Le dialogue des chaises, en séance** : la petite voix, ce que je ressens, l’adulte sain debout qui a le dernier mot.

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
| Imagerie : déroulé | La personne revoit la scène comme si elle y était. Le thérapeute y entre d’abord, puis l’adulte d’aujourd’hui ; l’enfant peut demander de l’aide jusqu’à ce que son besoin soit comblé. | Protocole de l’essai IREM, Boterhoven de Haan 2017, doi:10.1186/s12888-017-1330-2 ; Arntz 2025, doi:10.1016/j.brat.2025.104913 |
| Imagerie : efficacité | Elle fait mieux que l’attente, et aussi bien, sans plus, que l’exposition, la TCC ou l’EMDR. Les études sont faites avec des thérapeutes formés. **Aucun chiffre n’est affiché** (voir § 6). | Morina 2017, doi:10.1016/j.jbtep.2016.11.003 ; Kip 2023, doi:10.1016/j.janxdis.2023.102772 ; Boterhoven de Haan 2020, doi:10.1192/bjp.2020.158 |
| Images et émotion | Les images déclenchent plus d’émotion que les mots. C’est établi en laboratoire pour l’anxiété ; pour les autres émotions, la question reste ouverte. | Holmes & Mathews 2005, doi:10.1037/1528-3542.5.4.489 ; 2010, doi:10.1016/j.cpr.2010.01.001 |
| « Le sens change, pas les faits » | C’est la théorie dominante, avec un appui partiel. En laboratoire, la mémoire des faits n’est pas altérée. | Rameckers 2024, doi:10.1016/j.brat.2024.104492 ; Assmann 2024, doi:10.1080/20008066.2024.2397890 ; Ganslmeier 2023, doi:10.1016/j.brat.2023.104409 ; Aleksic 2024, doi:10.1016/j.brat.2024.104495 |
| Besoins comblés | Plus les besoins sont comblés pendant les séances, moins il reste de symptômes. C’est une étude **pilote** de 24 patients, présentée comme une piste. | Koetsier 2024, doi:10.1080/20008066.2024.2339702 |
| Chaises : origine | Née dans le psychodrame, puis dans la Gestalt-thérapie ; reprise par la thérapie centrée sur les émotions et la thérapie des schémas. | Kroener 2024, doi:10.3389/fpsyt.2024.1397925 ; Kellogg 2014, doi:10.5040/9798216400042 |
| Chaises : efficacité | Des résultats « prometteurs », pas encore solides : moins d’autocritique, plus de douceur envers soi. | Paivio & Greenberg 1995, doi:10.1037/0022-006X.63.3.419 ; Shahar 2012, doi:10.1002/cpp.762 ; Wang 2026, doi:10.1002/cpp.70346 ; Ottingerová 2026, doi:10.3389/fpsyg.2025.1692630 |
| Chaises : mécanismes | Ils sont présentés comme des **hypothèses** : mise à distance de la voix critique, émotion vécue, répétition de la réponse. Nommer son émotion apaise la réaction du cerveau à la peur, mais c’est un résultat de laboratoire. | Pugh 2017, doi:10.1007/s10608-016-9805-x ; Kroener 2024 ; Lieberman 2007, doi:10.1111/j.1467-9280.2007.01916.x |
| Répéter son geste en imagination | Imaginer les étapes d’une action (et pas seulement le résultat) aide à passer à l’acte, notamment avec les plans « si… alors… ». | Taylor 1998, doi:10.1037/0003-066X.53.4.429 ; Gollwitzer & Sheeran 2006, doi:10.1016/S0065-2601(06)38002-1 ; Toli 2016, doi:10.1111/bjc.12086 |
| CMP (ajouté aux portes d’entrée) | Lieu de soins public, organisé selon le lieu d’habitation, pour toute personne en difficulté psychique (CMP adultes, CMP enfants et adolescents). On peut le contacter directement ; les consultations sont gratuites, entièrement financées par la Sécurité sociale. | Psycom, fiche « Centre médico-psychologique (CMP) », mise à jour le 04/03/2024 |
| Se recentrer | Les cinq sens : 5 choses que je vois, 4 que je touche, 3 que j’entends, 2 que je sens, 1 que je goûte. C’est une fiche de pratique clinique, pas un essai. | NHS Hull, fiche « Grounding 5-4-3-2-1 », 2020 |
| Lectures | *La thérapie des schémas* : De Boeck, traduction B. Pascal, 3e édition 2024. *Je réinvente ma vie* : Éditions de l’Homme, 1995, traduction M. Perron, réédition 2018. *Cambridge Guide to Schema Therapy* : Brockman, Simpson, Hayes, van der Wijngaart, Smout, 2023. | Catalogue BnF ; Cambridge Core, doi:10.1017/9781108918145 |

## 6. Encore à vérifier, ou à dire avec prudence

1. Une méta-analyse en **préprint** (Arendt et coll., Research Square, août 2026, non relue par des pairs) ne trouve pas de différence nette avec les groupes témoins, avec une certitude très faible. Elle n’est pas citée dans l’application. Elle justifie le ton prudent de la carte « Ce qu’on ne sait pas encore ». À surveiller.
2. L’ouverture 24 h/24 du 15 et du 112 repose sur une phrase officielle générale, pas sur chaque numéro. L’application ne l’écrit pas.
3. Le titre exact du livre de Young de 1990 n’a pas été trouvé en catalogue. Il n’est pas cité.
4. La durée d’une envie (« une dizaine de minutes environ », animation « vague ») est un ordre de grandeur pédagogique, pas une mesure.
5. **Exercices faits seul(e)** : aucune étude n’a porté sur la réécriture d’un souvenir d’enfance ou d’un traumatisme faite seul(e), ni sur le dialogue des chaises sans thérapeute. Les deux exercices sont des adaptations prudentes, limitées à des scènes récentes et légères, et les leçons le disent. À valider par l’équipe clinique.
6. **Psychose** : les grands essais sur l’imagerie l’excluent ; de petites études ont été menées, toujours avec des thérapeutes spécialisés. D’où la mise en garde des exercices (voix entendues, impression d’irréalité).
7. **Lieu calme** : il peut rendre triste ou faire peur à certaines personnes. Seuls des arguments indirects l’appuient (peur de la compassion, anxiété déclenchée par la relaxation). Une alternative est proposée.
8. **Écrire ce que je ressens** (diaporama, levier « Ressentir ») : l’effet de l’écriture expressive est petit, et la détresse augmente juste après avoir écrit (Frattaroli 2006, doi:10.1037/0033-2909.132.6.823 ; Smyth 1998, doi:10.1037/0022-006X.66.1.174). Une phrase de cadre a été ajoutée.
9. **Chiffres de la méta-analyse Kip 2023** : un rectificatif de 2025 n’a pas pu être lu. Aucun chiffre n’est donc affiché, seulement la conclusion.
10. Le statut « Version de travail · en attente de relecture » s’affiche toujours. Pour le retirer, il faut vider le champ `statut` dans `src/data/meta.ts`.

## 7. Décisions qui vous appartiennent

- **Le CRR ne prend pas en charge de patients** : le site oriente vers le médecin traitant, les CMP, les psychologues (dont Mon soutien psy) et les thérapeutes formés, et donne les numéros d’urgence.
- **Site public ou rattaché au CRR ?** La réponse change les mentions légales (éditeur, directeur de la publication, hébergeur, contact), à remplir dans `src/data/meta.ts`. Elle change aussi l’indexation, qui est `noindex` par défaut.
- **Logo du CRR** (pied de page, À propos) : à confirmer avant la diffusion.
- **Fiches à imprimer** : les trois PDF et les deux documents Word de `Other_data` sont publiés dans « Mes outils », rubrique « Versions à imprimer ». Le diaporama, lui, n’est pas publié. Oui ou non ?
- **Licence** : `UNLICENSED` pour l’instant (`package.json`). Or le dépôt GitHub est déjà **public** : il faut donc choisir une licence, par exemple CC BY-NC-ND pour les textes et MIT pour le code.
- **Statut « Version de travail »** : à retirer après relecture.
