import { deepFr } from "../lib/typo";

// Textes des parties 1 à 6 et 8, repris du diaporama (versions du 23 octobre 2026).
// Les passages marqués « AJOUT WEB » sont de nouveaux textes d’interface ou d’explication écrits pour l’application : à relire.

const C = {
  // ───────── Introduction (diapo 2)
  utiliser: {
    chapeau: "Ce support se lit seul(e) ou avec un professionnel. Il aide à comprendre, pas à poser un diagnostic.",
    cartes: [
      { titre: "Un schéma à la fois", texte: "Je lis les pages d’explication, je coche ce qui me ressemble sur ma fiche « Retrouver mes schémas », puis je commence par un seul schéma." },
      { titre: "Un geste par semaine", texte: "Je choisis un geste, je le tente pendant une semaine et je note ce qui s’est vraiment passé." },
      { titre: "À mon rythme", texte: "Je peux m’arrêter à tout moment. Si un exercice me bouleverse, j’arrête et je fais la pause en trois temps." },
      { titre: "Seul(e) ou accompagné(e)", texte: "Seul(e), en attendant ou en complément d’une thérapie. Avec un thérapeute, je lui montre ma carte-mémo et mon carnet." },
    ],
    avertissement: "Ce support ne remplace pas un suivi avec un professionnel formé.",
    siMalAller: "Si ça ne va pas depuis plusieurs semaines : page « Quand demander de l’aide ».",
  },

  // ───────── Partie 1 : Comprendre un schéma (diapos 4 et 5)
  p1: {
    quoi: {
      titre: "Un schéma, c’est quoi ?",
      chapeau: "Un thème de vie appris tôt : des souvenirs, des émotions, des sensations et des croyances sur soi et sur les autres.",
      temps: [
        { titre: "Il se forme tôt", texte: "Dans l’enfance ou l’adolescence, quand un besoin important n’a pas été comblé." },
        { titre: "Il se réveille plus tard", texte: "Une situation qui ressemble à l’ancienne le rallume, souvent sans qu’on le remarque." },
        { titre: "Il se ressent avant de se penser", texte: "D’abord une émotion forte, puis une évidence : « c’est comme ça »." },
      ],
      lunettes: "Un schéma ne se discute pas comme une idée : il se vit comme une vérité. C’est comme des lunettes teintées : on ne les voit pas, mais elles colorent tout.",
      // AJOUT WEB : exemple interactif « lunettes », à relire
      lunettesExemple: {
        message: "Un ami répond seulement : « ok ».",
        lectures: [
          { id: "aucune", label: "Sans lunettes", texte: "« Il est occupé, il répondra plus tard. »" },
          { id: "abandon", label: "Schéma d’abandon", texte: "« Il se détache de moi. »" },
          { id: "imperfection", label: "Schéma d’imperfection", texte: "« J’ai dit une bêtise. »" },
          { id: "mefiance", label: "Schéma de méfiance", texte: "« Il me cache quelque chose. »" },
        ],
        conclusion: "Le même message, quatre lectures. Avec un schéma, on ne voit pas la lunette : on croit voir la réalité.",
      },
      question: "Avez-vous déjà réagi beaucoup plus fort que la situation ne le justifiait ?",
      invite: "Se poser la question par écrit, puis noter un exemple récent, sans le commenter.",
      pro: "Insister sur le « ressenti » : un schéma ne se discute pas comme une idée, il se vit comme une vérité. Les lunettes teintées : on ne les voit pas, mais elles colorent tout. Question au groupe : « Avez-vous déjà réagi beaucoup plus fort que la situation ne le justifiait ? »",
    },
    recues: [ // AJOUT WEB : idées reçues, reformulées à partir des notes du diaporama
      { idee: "Un schéma, c’est un diagnostic.", faux: "Non.", reponse: "Un schéma n’est ni un diagnostic ni un défaut de caractère. C’est une façon apprise de se voir, de voir les autres et le monde." },
      { idee: "Un schéma se discute comme une idée.", faux: "Pas vraiment.", reponse: "Il se ressent avant de se penser : on le vit comme une vérité. C’est pourquoi comprendre seul ne suffit pas toujours." },
      { idee: "Si j’ai un schéma, il y a un coupable.", faux: "Non.", reponse: "Ni l’enfant ni l’adulte ne sont « coupables » du schéma. Il s’est construit pour s’adapter à l’environnement d’alors. On cherche le besoin qui n’a pas été comblé, pas un responsable." },
      { idee: "Il suffit de le comprendre pour qu’il disparaisse.", faux: "Pas d’un coup.", reponse: "On ne l’efface pas d’un coup : on apprend à le reconnaître et à y répondre autrement." },
    ],
    origines: {
      titre: "D’où viennent les schémas ?",
      chapeau: "Au départ, toujours un besoin de base resté sans réponse, chez un enfant au tempérament donné. Quatre types d’expériences y mènent :",
      types: [
        { id: "manque", titre: "Le manque", texte: "Trop peu de sécurité, d’affection, d’écoute ou de guidance." },
        { id: "blessures", titre: "Les blessures", texte: "Maltraitance, humiliation, harcèlement, événements traumatiques." },
        { id: "trop", titre: "Le trop", texte: "Surprotection ou absence de limites : on n’apprend ni l’autonomie ni le « non »." },
        { id: "imitation", titre: "L’imitation", texte: "On reprend les façons de penser et de faire d’un parent." },
      ],
      adaptation: [
        "À l’époque, le schéma était une adaptation : il aidait à tenir.",
        "Aujourd’hui, les schémas peuvent ne pas être adaptés au contexte.",
        "Les schémas de pensées inadaptées au contexte peuvent impacter ma relation avec les autres.",
      ],
      prudence: "Ce sont des pistes, pas des causes. Un même vécu donne des schémas différents selon le tempérament, et on peut avoir un schéma sans souvenir précis. Si ces souvenirs sont pénibles, j’en parle à un thérapeute avant d’aller plus loin.",
      pro: "Message central : ni l’enfant ni l’adulte ne sont « coupables » du schéma. Il s’est construit pour s’adapter à l’environnement d’alors. Le tempérament compte : deux enfants dans la même famille ne développent pas les mêmes schémas. Éviter de chercher un coupable ; chercher le besoin qui n’a pas été comblé.",
    },
    retenir: ["Un schéma n’est pas un défaut : c’est une adaptation apprise tôt.", "Derrière chaque schéma, il y a un besoin légitime."],
  },

  // ───────── Partie 2 : Les 5 besoins (diapo 7)
  p2: {
    chapeau: "Quand l’une de ces bases manque durablement, un groupe de schémas peut se former.",
    complet: "Les trois schémas du modèle complet absents du questionnaire abrégé : recherche d’approbation, négativité, punition [@isst-schema; @mauchand2011].",
    pro: "Notion centrale du parcours : à chaque besoin de l’enfant (la base) correspond un domaine de schémas, qui se développe quand ce besoin manque. Les besoins sont universels et légitimes : on ne « guérit » pas d’un besoin, on apprend à y répondre. La sécurité de l’attachement est la base des autres : c’est souvent là que se trouvent les schémas les plus profonds.",
    invite: "Repérer la base dont les phrases sonnent le plus vrai ; elle sert de point de départ, sans chercher à tout traiter.",
    // AJOUT WEB : mécanisme en trois temps, à relire
    flux: [
      { titre: "Un besoin de l’enfant", texte: "Être en sécurité, pouvoir essayer, dire ce qu’on ressent, jouer, avoir des limites." },
      { titre: "Il manque, durablement", texte: "Pas une fois : de façon répétée, sur une longue période." },
      { titre: "Un groupe de schémas peut se former", texte: "Une façon apprise de voir, de ressentir et de réagir." },
    ],
    flux_note: "Les besoins sont légitimes, chez tout le monde : on ne s’en débarrasse pas, on apprend à y répondre. Et on peut se reconnaître dans plusieurs schémas, de plusieurs bases.",
    // Reprend la diapo 8 du diaporama (« Les 15 schémas, d’un coup d’œil »)
    apercu: {
      eyebrow: "Vue d’ensemble",
      titre: "Les 15 schémas, d’un coup d’œil",
      chapeau: "Quinze schémas, regroupés selon la base dont ils naissent.",
      savoir: [
        "Je ne me reconnais pas dans tous, et c’est normal.",
        "Plusieurs schémas peuvent coexister ; ils se réveillent selon les situations.",
        "Un schéma n’est ni un diagnostic ni une étiquette.",
      ],
      vers_trouver: "Retrouver les miens (partie 5)",
      vers_schemas: "Les lire un par un (partie 7)",
    },
    retenir: ["Chaque base correspond à un besoin d’enfant ; un groupe de schémas peut se former quand il a manqué.", "Un besoin n’est jamais un défaut : on apprend à y répondre autrement.", "Se reconnaître dans une phrase est un point de départ, pas un diagnostic."],
  },

  // ───────── Partie 3 : Comment un schéma s’entretient (diapos 19 à 21)
  p3: {
    cercle: {
      titre: "Comment un schéma s’entretient",
      etapes: [
        { titre: "Une situation", texte: "qui ressemble à une blessure ancienne" },
        { titre: "Le schéma s’allume", texte: "une émotion forte, plus intense que la situation" },
        { titre: "Une réaction automatique", texte: "capituler, éviter ou surcompenser" },
        { titre: "Le schéma se confirme", texte: "« Tu vois, c’est toujours pareil. »" },
      ],
      boucle: "Puis le cercle recommence : à chaque tour, le schéma se renforce.",
      exemple: "Exemple (abandon) : un message reste sans réponse, l’angoisse monte, on relance avec insistance, l’autre s’agace… « je le savais ».",
      exempleEtapes: [
        "Un message reste sans réponse.",
        "L’angoisse monte.",
        "On relance avec insistance.",
        "L’autre s’agace… « Je le savais. »",
      ],
      agir: { titre: "On peut interrompre le cercle à chaque étape", items: ["Repérer la situation", "Nommer l’émotion", "Choisir une autre réaction"] },
      pro: "Point clé : ce n’est pas la situation seule qui confirme le schéma, c’est la réaction automatique qui provoque ce qu’on redoutait. On peut donc agir à chaque étape : repérer la situation, nommer l’émotion, choisir une autre réaction. Faire chercher au groupe un exemple personnel, en restant sur des situations peu chargées.",
      invite: "Décrire par écrit une situation récente peu chargée, en quatre temps : situation, émotion, réaction, ce qui s’est passé ensuite.",
    },
    reactions: {
      titre: "Trois façons de réagir, un même effet",
      chapeau: "Exemple avec le schéma d’imperfection : « si on me connaissait vraiment, on ne m’aimerait pas ».",
      cartes: [
        { id: "capituler", titre: "Capituler", phrase: "« Je fais comme si c’était vrai. »", exemple: "Se dévaloriser, choisir des proches critiques.", reflexe: "se figer" },
        { id: "eviter", titre: "Éviter", phrase: "« Je fuis ce qui le réveille. »", exemple: "Ne pas se confier, fuir l’intimité.", reflexe: "fuir" },
        { id: "surcompenser", titre: "Surcompenser", phrase: "« Je fais l’inverse, en excès. »", exemple: "Critiquer les autres, vouloir paraître parfait(e).", reflexe: "combattre" },
      ],
      conclusion: "Les trois soulagent sur le moment… et les trois entretiennent le schéma.",
      pro: "Ces trois réactions correspondent aux réflexes de survie : se figer (capituler), fuir (éviter), combattre (surcompenser). Chacun utilise les trois selon les situations, avec souvent une préférence. La surcompensation peut ressembler à de la confiance en soi : la différence, c’est qu’elle est rigide et excessive. Demander : « Laquelle reconnaissez-vous le plus chez vous ? »",
    },
    signes: {
      titre: "Reconnaître un schéma activé",
      items: [
        { icone: "eclair", titre: "Une émotion trop forte", texte: "Plus intense ou plus longue que ce que la situation justifie." },
        { icone: "horloge", titre: "Un air de déjà-vu", texte: "« Encore », « comme d’habitude », « comme quand j’étais petit(e) »." },
        { icone: "bulle", titre: "Des mots absolus", texte: "Toujours, jamais, personne, tout le monde." },
        { icone: "rouage", titre: "Le pilote automatique", texte: "Une réaction rapide, difficile à arrêter, souvent regrettée." },
      ],
      question: "Quel âge ai-je l’impression d’avoir, là, maintenant ?",
      // AJOUT WEB : micro-textes de l’interaction « âge ressenti », à relire
      age: { enfant: "Si c’est l’âge de l’enfant, l’adulte d’aujourd’hui peut prendre le relais : je fais la pause en trois temps.", adulte: "Je me sens à l’âge d’aujourd’hui. Je garde la pause en trois temps en tête, au cas où.", aide: "Il n’y a pas de bonne réponse : c’est une façon de se repérer." },
      pro: "Ces signes ne prouvent pas qu’un schéma est en jeu, mais ils invitent à ralentir. La question de l’âge ressenti aide à distinguer la réaction de l’enfant d’autrefois et celle de l’adulte d’aujourd’hui. Proposer de noter un exemple de la semaine écoulée.",
    },
  },

  // ───────── Partie 4 : Ce qui aide à s’en sortir (diapos 23 et 24)
  p4: {
    // AJOUT WEB : « pour retenir » des parties 3 et 4, à relire
    retenir3: ["Une situation, une émotion, une réaction, une confirmation : le cercle se répète.", "Capituler, éviter, surcompenser soulagent sur le moment, mais entretiennent le schéma.", "On peut agir à chaque étape : repérer, nommer, choisir."],
    retenir4: ["L’adulte sain n’est ni parfait ni sévère : il voit le besoin de l’enfant et y répond.", "Il se renforce avec l’entraînement, comme un muscle.", "Comprendre seul ne suffit pas : on ressent, on agit, on se relie."],
    adulte: {
      titre: "L’adulte sain, c’est quoi ?",
      chapeau: "Deux parts d’une même personne : l’enfant d’autrefois et l’adulte d’aujourd’hui.",
      etapes: [
        { id: "besoin", titre: "Le besoin de l’enfant", texte: "Petit(e), il m’a manqué quelque chose d’important. Ici : faire partie d’un groupe. Cette part de moi le ressent encore." },
        { id: "voix", titre: "La petite voix", texte: "Une invitation à un anniversaire arrive : le schéma s’allume. Sa petite voix répète une phrase, comme si c’était un fait.", citation: "« Je ne suis pas comme eux. »" },
        { id: "reaction", titre: "La réaction automatique", texte: "Pour me protéger, je réagis sans réfléchir : j’évite, je capitule ou je surcompense. Ici, je ne réponds pas. Le besoin reste sans réponse." },
        { id: "adulte", titre: "L’adulte sain", texte: "C’est la part de moi qui a l’âge d’aujourd’hui. Elle voit le besoin de l’enfant et y répond, avec bienveillance et fermeté.", bienveillance: "« Je comprends que tu aies peur. »", fermete: "« Et je fais quand même le pas. »" },
        { id: "retrouver", titre: "Pour la retrouver", texte: "Je me demande : « Quel âge ai-je l’impression d’avoir, là, maintenant ? » Si c’est l’âge de l’enfant, l’adulte prend le relais." },
        { id: "phrase", titre: "Ma phrase d’adulte sain", texte: "L’adulte sain dit à l’enfant ce dont il a besoin. Je l’écris sur ma carte-mémo : c’est ma phrase d’adulte sain.", citation: "« Je peux y aller, et repartir quand je veux. »" },
      ],
      pas: ["un adulte parfait", "une voix qui gronde", "penser positif à tout prix"],
      muscle: "C’est une part de moi qui se renforce avec l’entraînement, comme un muscle.",
      pro: "L’adulte sain est défini ici avant de servir dans la suite (« Ce qui aide à en sortir », carte-mémo, pages « dans le moment »). Un seul exemple sert de fil conducteur : l’isolement social, avec une invitation à un anniversaire. Faire le lien avec la question de la leçon « Reconnaître un schéma allumé ». L’adulte sain n’est ni parfait ni sévère : c’est la part de soi qui reconnaît le besoin et pose des limites quand il le faut ; il se renforce par l’entraînement. Notion issue du modèle des modes de la thérapie des schémas (Young, Klosko, Weishaar).",
    },
    leviers: {
      titre: "Ce qui aide à en sortir",
      items: [
        { id: "comprendre", titre: "Comprendre", texte: "Repérer ses schémas, peser les preuves, garder une carte-mémo.", seul: "C’est ce que fait ce support." },
        { id: "ressentir", titre: "Ressentir", texte: "En séance, revenir aux émotions d’origine : imagerie, dialogue des chaises.", seul: "En attendant ou en complément d’un suivi : écrire ce que je ressens, mot par mot, sans l’analyser. Un souvenir très douloureux se travaille avec un professionnel." },
        { id: "agir", titre: "Agir autrement", texte: "Remplacer la réaction automatique par un nouveau geste, à petits pas.", seul: "Un geste par semaine, noté dans le carnet." },
        { id: "lien", titre: "Être en lien", texte: "Vivre avec le thérapeute, puis des proches sûrs, une relation qui répond au besoin.", seul: "En attendant ou en complément d’un suivi : m’appuyer sur un proche sûr, un groupe d’entraide, un atelier ou un club." },
      ],
      but: "Le but : renforcer l’adulte sain, la part de soi qui repère le besoin et y répond, avec bienveillance et fermeté.",
      pro: "Les quatre leviers se combinent : comprendre seul ne suffit pas, car le schéma se ressent avant de se penser. Le travail émotionnel se fait d’abord en séance, dans un cadre sécurisant. L’adulte sain n’est pas un adulte « parfait » : c’est la part de soi qui sait reconnaître le besoin de l’enfant et poser des limites quand il le faut. Écrire ce que l’on ressent : l’effet mesuré est petit [@frattaroli2006], et la détresse augmente juste après l’écriture [@smyth1998] ; d’où la phrase de cadre sur les souvenirs très douloureux.",
      autosoin: "« Ressentir » et « Être en lien » ne dépendent pas que du thérapeute. En attendant ou en complément : écrire ce que je ressens, s’appuyer sur un proche sûr ou un groupe d’entraide. Un souvenir très douloureux se travaille avec un professionnel.",
    },
  },

  // ───────── Partie 5 : Trouver mon schéma (diapos 26, 27, 28 à 33)
  p5: {
    trame: {
      titre: "Trame générale",
      chapeau: "Six concepts à repérer pour chaque schéma. Exemple : lire un groupe de messagerie sans jamais y écrire.",
      concepts: [
        { id: "besoin", titre: "Le besoin", def: "Ce dont tout enfant a besoin : sécurité, autonomie, expression, jeu, limites. Il est légitime.", exemple: "Me sentir proche de quelques personnes." },
        { id: "voix", titre: "La petite voix", def: "La phrase que le schéma répète dans ma tête, comme si c’était un fait.", exemple: "« Personne n’attend ce que j’ai à dire. »" },
        { id: "reaction", titre: "La réaction automatique", def: "Capituler, éviter ou surcompenser : elle protège sur le moment, mais entretient le schéma.", exemple: "Lire les messages sans jamais écrire." },
        { id: "adulte", titre: "L’adulte sain", def: "La part de moi, adulte d’aujourd’hui, qui voit le besoin et y répond, avec bienveillance et fermeté.", exemple: "Sa phrase : « Ce que j’ai à dire compte, même court. »" },
        { id: "geste", titre: "Le geste", def: "Un petit pas concret, choisi à l’avance, qui remplace la réaction automatique. Un seul à la fois.", exemple: "Réagir par un mot à un message." },
        { id: "carte", titre: "La carte-mémo", def: "Ma fiche personnelle : le schéma, la petite voix, le besoin, le geste et ma phrase d’adulte sain.", exemple: "Une carte par schéma, sur moi." },
      ],
      pro: "Page de référence, à laisser affichée ou à retrouver en cas de doute sur un mot. Les six mots sont illustrés par un même exemple : l’isolement social, vécu ici dans un groupe de messagerie où l’on lit sans jamais écrire. Le schéma est le même ; la situation change d’une personne à l’autre. Les définitions sont volontairement courtes : elles se travaillent en séance, avec les mots de la personne.",
      invite: "Relire cette page avant de remplir une carte-mémo ; un seul exemple personnel suffit pour commencer.",
    },
    comment: {
      titre: "Comment ?",
      chapeau: "Trois étapes, à mon rythme. Un professionnel peut aussi proposer un questionnaire (YSQ-2) pour confirmer mon schéma.",
      etapes: [
        { titre: "Trouver mon schéma", texte: "Sur ma fiche « Retrouver mes schémas », je coche ce qui me ressemble et je garde un schéma, vérifié sur une situation récente." },
        { titre: "Repérer ce que ça fait sur moi", texte: "Quand il s’allume : ce que je ressens, ce que je me dis, ce que je fais ensuite. Je le note dans mon carnet." },
        { titre: "Un seul pas à la fois", texte: "Je choisis un geste, je le tente pendant une semaine, puis je note ce qui s’est vraiment passé." },
      ],
      pro: "Présenter la structure : chaque schéma a trois temps. « Comprendre » explique d’où il vient ; « Dans le moment » répond à « que faire quand ça se déclenche ? » ; « Au fil des semaines » à « comment avancer sur plusieurs semaines ? ». Insister sur le fait qu’un seul geste à la fois suffit, et qu’on peut commencer par le plus facile. Les exemples sont des pistes, pas des prescriptions.",
    },
    fiche: {
      titre: "Retrouver mes schémas",
      consigne: "Je lis la phrase : si elle me parle, je coche, même si les exemples diffèrent. Ni test, ni diagnostic.",
      colonnes: { schema: "Le schéma", exemple: "Par exemple… (il y en a d’autres)", pousse: "Il me pousse à… (ça varie)", repere: "Mon repère" },
      reperes: [
        { id: "vrai", court: "Ça sonne vrai", def: "la phrase me parle" },
        { id: "souvent", court: "Ça revient souvent", def: "plusieurs fois ces derniers mois" },
        { id: "cout", court: "Ça me coûte", def: "ça me gêne au quotidien" },
      ],
      pro: "Le critère, c’est la phrase : on peut s’y reconnaître sans reconnaître les exemples, et un exemple banal ne suffit pas à retenir un schéma. La colonne « Par exemple » donne une situation et un ressenti ; la colonne « Il me pousse à… » décrit deux réflexes possibles du schéma (ce ne sont pas des conseils), car un même schéma peut produire des conduites opposées. Ce n’est ni un test ni un diagnostic : les cases aident à choisir où consacrer du temps, pas à étiqueter la personne. Ne pas commenter les choix en groupe, sauf si la personne le souhaite.",
      notesBase: [
        "Les cinq schémas de cette base se ressemblent : plusieurs peuvent sonner vrai. Le choix se fait ensuite sur ce qui coûte le plus.",
        "Un schéma d’échec peut coexister avec une compétence réelle : le schéma parle de ce qu’on ressent, pas des faits. Pour la vulnérabilité, distinguer la prudence raisonnable de la crainte envahissante : la case « ça me coûte » aide à le faire.",
        "Ces schémas passent souvent pour des qualités (gentillesse, disponibilité). La case « ça me coûte » aide à distinguer une générosité choisie d’un effacement subi.",
        "Le contrôle des émotions et l’exigence sont souvent valorisés (sang-froid, sérieux). La case « ça me coûte » est ici la plus utile.",
        "Ces schémas sont plus souvent repérés par l’entourage que par la personne : partir d’une situation de frustration récente, sans reproche. Les droits exagérés protègent parfois d’un manque vécu ailleurs.",
      ],
      ysqLong: "Pour un vrai repérage : le YSQ-2 (Young Schema Questionnaire, 2e version ; forme courte S2 : 75 questions et 15 schémas, comme ce support), passé et interprété avec un professionnel formé. C’est un auto-questionnaire de repérage, pas un diagnostic. Version française validée [@mauchand2011]. Ces pages servent à s’orienter, pas à mesurer.",
    },
    priorites: {
      titre: "Mes priorités",
      consigne: "Je reprends mes cases. Ce n’est pas un classement de mes défauts : je choisis où mettre mon énergie.",
      etapes: [
        { titre: "Je compte mes cases", texte: "Pour chaque schéma, je compte 0, 1, 2 ou 3 cases cochées. Ceux qui en ont le plus sont mes candidats." },
        { titre: "Je garde un à trois schémas", texte: "Trois au maximum. À égalité, je garde d’abord celui qui me coûte le plus." },
        { titre: "Je commence par un seul", texte: "Je le vérifie sur une situation récente, puis je remplis ma carte-mémo. Les autres attendent." },
      ],
      rien: "Rien ne ressort, ou tout ressort ? C’est possible. Je relis dans quelques semaines avec mon carnet, ou j’en parle à mon thérapeute. Pour un vrai repérage : le questionnaire YSQ-2, avec un(e) professionnel(le).",
      pro: "Synthèse : chaque case cochée vaut un point ; les schémas qui en cumulent le plus sont les candidats. Garder un à trois schémas, jamais plus : on les travaille un par un, avec la carte-mémo (trois cartes au maximum). En cas d’égalité, privilégier « ça me coûte ». Si rien ne ressort, ou si tout ressort, c’est possible : relire plus tard avec le carnet, ou en parler à un thérapeute, qui peut proposer le questionnaire des schémas de Young pour confirmer. Ce repérage ne remplace pas une évaluation.",
      invite: "Faire cette page au calme, puis la relire quelques jours plus tard : ce qui sonne encore vrai est plus fiable. Noter ensuite une situation récente pour chaque schéma gardé.",
    },
  },

  // ───────── Partie 6 : Mes outils (diapos 35 à 38, 86)
  p6: {
    carte: {
      titre: "La carte-mémo, mode d’emploi",
      etapes: [
        { titre: "L’écrire à la main", texte: "Sur une carte de la taille d’une carte bancaire, ou dans les notes du téléphone." },
        { titre: "La relire le matin", texte: "Et la sortir quand je sens le schéma s’allumer, pas après coup." },
        { titre: "Une carte par schéma", texte: "Au maximum trois cartes. Je commence par le schéma qui me gêne le plus." },
      ],
      exemple: { schema: "Isolement social", quand: "Un groupe où tout le monde se connaît déjà.", voix: "« Je ne suis pas comme eux. »", besoin: "Me sentir à ma place parmi les autres.", geste: "M’asseoir près des autres, pas au bord.", phrase: "« J’ai le droit d’être là, tel(le) que je suis. »" },
      champs: { schema: "Mon schéma", quand: "Quand il s’allume", voix: "La petite voix", besoin: "Ce dont j’ai besoin", geste: "Mon geste", phrase: "Ma phrase d’adulte sain" },
      resume: "La carte réunit tout ce qui précède : le schéma, la petite voix, le besoin, et un seul geste.",
      pro: "La carte-mémo est l’outil le plus simple : six lignes, dont un seul geste. Faire remplir une carte en séance ou en groupe, à partir d’une situation vécue récemment. L’exemple montré (isolement social) est une illustration : chacun écrit avec ses mots.",
      invite: "Remplir une carte à partir d’une situation récente, au calme. Une carte par schéma, trois au maximum.",
    },
    pause: {
      titre: "La pause en trois temps",
      etapes: [
        { mot: "Stop", texte: "Je m’arrête vingt secondes. Pieds au sol, trois respirations lentes : j’expire plus longtemps que j’inspire." },
        { mot: "Nommer", texte: "Je me dis : « Mon schéma s’est allumé. » Je note l’émotion de 0 à 10 et ce que dit la petite voix." },
        { mot: "Choisir", texte: "Je sors ma carte-mémo et je fais le plus petit geste de la liste. Un seul." },
      ],
      resume: "La pause ne règle rien : elle me laisse le choix, au lieu de la réaction automatique.",
      exemple: "Exemple : mon chef critique mon dossier devant l’équipe, la honte monte. Stop : trois respirations. Nommer : « C’est mon schéma d’imperfection, 7 sur 10. » Choisir : « Je prends note. Pouvons-nous en reparler après la réunion ? » Plus tard, j’en parle à mon chef en tête-à-tête.",
      pro: "La pause en trois temps se pratique d’abord à froid, en séance ou à la maison, puis dans la vraie vie. Vingt secondes suffisent. Le but n’est pas de se calmer à tout prix, mais de retrouver un peu de choix entre le déclenchement du schéma et la réaction.",
      invite: "S’exercer d’abord à froid, deux ou trois fois, avant d’en avoir besoin. Si une émotion déborde et ne redescend pas, voir « Quand demander de l’aide ».",
    },
    dire: {
      titre: "Dire ce qui ne va pas, sans attaquer",
      chapeau: "Même méthode, trois situations. Je la prépare par écrit, puis je la dis en tête-à-tête, pas à chaud.",
      situations: [
        { id: "chef", titre: "Avec mon chef", contexte: "Être critiqué(e) devant toute l’équipe est difficile. Une fois calme, j’en parle à mon chef.", phrases: [
          "Auriez-vous dix minutes cette semaine pour parler de notre façon de travailler ?",
          "Lundi, mon dossier a été critiqué devant l’équipe. Je me suis senti(e) mal à l’aise.",
          "Vos retours m’aident. Pourriez-vous me les faire en tête-à-tête ?",
          "Donc, vos remarques en tête-à-tête. On peut refaire le point quand vous voulez.",
        ] },
        { id: "partenaire", titre: "Avec mon (ma) partenaire", contexte: "Un projet change au dernier moment, et je me tais. Une fois calme, j’en parle.", phrases: [
          "J’aimerais te parler de quelque chose d’important pour moi. Ce soir ou demain ?",
          "Samedi, notre sortie a été annulée le jour même. J’ai été déçu(e) et un peu triste.",
          "Pourrions-nous nous prévenir plus tôt quand un projet change ?",
          "Donc on se prévient la veille au plus tard. On en reparle dimanche ?",
        ] },
        { id: "proche", titre: "Avec un ami ou un proche", contexte: "Un ami arrive en retard, encore. Plutôt que de me retirer, je le lui dis.", phrases: [
          "Tu aurais un moment cette semaine ? J’aimerais te dire quelque chose, entre nous.",
          "Les deux dernières fois, tu es arrivé(e) très en retard. Je me suis senti(e) de côté.",
          "Ça m’aiderait que tu me préviennes si tu as du retard.",
          "Merci de m’avoir écouté(e). Ça me fait du bien de pouvoir te le dire.",
        ] },
      ],
      temps: [
        { titre: "Le bon moment", texte: "Pas à chaud, pas devant l’équipe. J’attends d’être calme, puis je demande un court entretien en tête-à-tête." },
        { titre: "Le fait et mon ressenti", texte: "Un fait précis, sans jugement, sans « toujours » ni « jamais ». Puis ce que je ressens, en disant « je »." },
        { titre: "Ma demande", texte: "Une demande précise et faisable. J’accepte les retours sur le fond, je demande un changement sur la forme. Puis j’écoute la réponse." },
        { titre: "Conclure ensemble", texte: "Je reformule ce qui est convenu et je fixe un point de suivi dans quelques semaines." },
      ],
      repetition: { titre: "Si cela se répète", texte: "Une critique isolée n’est pas du harcèlement moral. Si elle se répète et m’atteint, je ne reste pas seul(e) : je note les faits et j’en parle.", faire: "Noter la date, le lieu, les témoins et les mots exacts." },
      danger: "Si je me sens en danger ou sous l’emprise de l’autre, je ne le fais pas seul(e) : voir « Quand demander de l’aide ».",
      pro: "La même méthode, appliquée à trois situations : au travail, en couple, entre amis. Les quatre temps s’inspirent de la méthode DESC (décrire, exprimer, spécifier, conclure [@bower1976]), souvent utilisée pour recadrer ou pour exprimer un désaccord avec sa hiérarchie. Points de vigilance : ne pas la proposer telle quelle si la relation comporte de la peur, des menaces ou de l’emprise : dans ce cas, ne pas affronter seul(e) et s’appuyer sur la page « Quand demander de l’aide » (le 3919 est une écoute pour les victimes de violences sexistes et sexuelles). Une critique isolée, même maladroite, ne constitue pas un harcèlement moral ; celui-ci suppose des agissements répétés qui dégradent les conditions de travail et peuvent altérer la santé (service-public.gouv.fr, fiche « Harcèlement moral »). Si cela se répète : conserver des éléments datés (dates, lieux, témoins, messages), signaler par écrit à la hiérarchie, aux ressources humaines, à un représentant du personnel ou au médecin du travail, et ne pas rester seul(e). Cette page ne remplace pas un avis juridique. Les phrases sont des exemples : chacun les écrit avec ses mots.",
      invite: "Choisir une seule situation, écrire les trois phrases, les lire à voix haute, puis choisir un moment calme. Noter ensuite ce qui s’est vraiment passé dans le carnet.",
    },
    plan: {
      titre: "Mon plan pour la semaine",
      chapeau: "À remplir le dimanche soir, en six lignes. Un seul schéma, un seul geste.",
      lignes: [
        { id: "schema", titre: "Mon schéma de la semaine", aide: "Celui qui me gêne le plus en ce moment." },
        { id: "geste", titre: "Mon geste", aide: "Un seul, pris dans les pages du schéma. Le plus petit qui compte." },
        { id: "quand", titre: "Quand et où", aide: "Un moment précis : « Si… alors… ». Par exemple : si je rentre, alors j’écris ma phrase." },
        { id: "obstacle", titre: "L’obstacle prévu", aide: "Ce qui risque de m’arrêter, et ce que je ferai alors." },
        { id: "soutien", titre: "Mon soutien", aide: "Une personne à qui je le dis, ou que je préviens." },
        { id: "recompense", titre: "Ma récompense", aide: "Un plaisir prévu à l’avance, pour avoir essayé, pas pour avoir réussi." },
      ],
      bilan: { titre: "Bilan le dimanche suivant · cinq minutes", questions: ["Qu’ai-je fait ?", "Qu’est-ce qui s’est vraiment passé ?", "Que je garde, que je change ?"], pied: "Un écart n’efface rien : je reprends dès le geste suivant." },
      pro: "Ce plan transforme les pages précédentes en engagement concret : un schéma, un geste, un moment. Le « si… alors… » aide à ne pas dépendre de la motivation. La récompense porte sur l’essai, pas sur la réussite. Le bilan du dimanche suivant peut être apporté en séance avec le carnet de schémas. En autosoin : faire le bilan seul(e) le dimanche suivant, cinq minutes, puis réécrire le plan de la semaine.",
    },
  },

  // ───────── Partie 8 : Pour la suite (diapos 88 à 92)
  p8: {
    aide: {
      titre: "Quand demander de l’aide",
      chapeau: "Je demande de l’aide sans attendre si…",
      signes: [
        "Mon quotidien est touché depuis plusieurs semaines : sommeil, travail, relations.",
        "J’ai des pensées de me faire du mal ou de mourir.",
        "Je consomme de l’alcool, des médicaments ou des écrans pour tenir, sans pouvoir m’arrêter.",
        "Je suis en danger, ou sous l’emprise d’une personne dans ma relation.",
        "Un exercice de ce support me bouleverse trop ou réveille un souvenir trop douloureux.",
      ],
      parler: ["J’en parle à mon thérapeute ou à mon médecin traitant.", "Parler tôt, c’est déjà prendre soin de soi.", "Sans thérapeute pour l’instant : voir la page suivante."],
      // Vérifiés le 5 novembre 2026 (3114.fr ; masecurite.interieur.gouv.fr ; info.urgence114.fr ; arretonslesviolences.gouv.fr).
      numeros: [
        { num: "3114", tel: "3114", texte: "Numéro national de prévention du suicide, pour moi ou pour un proche. Un professionnel formé écoute. Gratuit, 24 h/24, 7 j/7." },
        { num: "15", tel: "15", texte: "SAMU, urgence médicale : danger immédiat pour moi ou pour quelqu’un d’autre. Gratuit." },
        { num: "112", tel: "112", texte: "Numéro d’urgence européen. Gratuit, même depuis un téléphone bloqué ou sans crédit." },
        { num: "114", tel: "114", sms: true, texte: "Urgence pour les personnes sourdes, sourdaveugles, malentendantes ou aphasiques : par SMS, visio, tchat ou application. Gratuit, 24 h/24." },
        { num: "3919", tel: "3919", horsUrgence: true, texte: "Violences Femmes Info : pour les femmes victimes de violences, leur entourage et les professionnels. Anonyme et gratuit, 24 h/24. Ce n’est pas un numéro d’urgence." },
      ],
      horsFrance: "Numéros valables en France. Ailleurs, je cherche avec mon thérapeute le numéro local.",
      pro: "Cette page est à lire sans dramatiser. Les schémas sont des fragilités fréquentes, pas des urgences, mais certaines situations demandent de l’aide rapidement. Le 3114 est le numéro national de prévention du suicide en France (gratuit, 24 h/24). Le 15 et le 112 sont les numéros d’urgence. Le 114 est le numéro d’urgence des personnes sourdes, sourdaveugles, malentendantes ou aphasiques (SMS, visio, tchat). Le 3919 (Violences Femmes Info) s’adresse aux femmes victimes de violences, à leur entourage et aux professionnels : anonyme, gratuit, 24 h/24, mais ce n’est pas un numéro d’urgence (en urgence : 17 ou 112). Adapter les numéros si le groupe se trouve hors de France. Terminer en rappelant que demander de l’aide est un geste de l’adulte sain.",
      invite: "Lire cette page dès le début, pas seulement en cas de crise. Noter à portée de main le numéro de mon médecin traitant.",
      rappel: "Demander de l’aide est un geste de l’adulte sain.",
    },
    soutien: {
      titre: "Où trouver un soutien",
      chapeau: "Pas de thérapeute pour l’instant ? Plusieurs portes d’entrée existent. Je peux en essayer plus d’une.",
      portes: [
        { titre: "Mon médecin traitant", texte: "Il connaît mon histoire et peut m’orienter. C’est la porte d’entrée la plus simple." },
        { titre: "Un centre médico-psychologique (CMP)", texte: "Un lieu de soins public, organisé selon mon lieu d’habitation, pour toute personne en difficulté psychique : psychiatres, psychologues, infirmiers. Je peux le contacter directement, et les consultations sont gratuites. Mon médecin traitant peut m’indiquer le mien.", lien: "https://www.psycom.org/sorienter/le-dictionnaire-des-lieux/centre-medico-psychologique-cmp/", lienLabel: "Les CMP expliqués par Psycom" },
        { titre: "Mon soutien psy", texte: "Jusqu’à douze séances par an avec un psychologue partenaire de l’Assurance Maladie, remboursées en partie, sans ordonnance. Pour des difficultés légères à modérées : si je suis déjà suivi(e) en psychiatrie, il ne me concerne en général pas. Pas pour une urgence.", lien: "https://www.ameli.fr/assure/remboursements/rembourse/remboursement-seance-psychologue-mon-soutien-psy", lienLabel: "Mon soutien psy sur ameli.fr" },
        { titre: "Un thérapeute formé aux schémas", texte: "L’annuaire de l’Institut Français de Thérapie des Schémas en recense. J’en parle d’abord avec mon médecin traitant ou mon équipe de soins, et j’apporte ma carte-mémo et mon carnet.", lien: "https://www.schematherapie.fr/annuaire-therapeutes", lienLabel: "Annuaire de thérapeutes des schémas" },
        { titre: "Un proche sûr ou un groupe", texte: "Un groupe d’entraide, un atelier, une personne qui sait écouter : ils soutiennent, sans remplacer un suivi." },
      ],
      danger: "Si je me sens en danger ou si j’ai des pensées de me faire du mal : 3114 ou 15, sans attendre un rendez-vous.",
      pro: "Pour les personnes qui utilisent ce support sans suivi en cours, le médecin traitant est la porte d’entrée la plus simple. Mon soutien psy [@ameli-msp] : 12 séances par année civile (une d’évaluation, puis jusqu’à 11 de suivi), 50 € la séance sans dépassement, remboursées à 60 % par l’Assurance Maladie, accès direct sans ordonnance depuis le 15 juin 2024, dès 3 ans, pour une souffrance psychique légère à modérée. Exclues en général : les personnes déjà suivies en psychiatrie, en ALD psychiatrique, avec des antécédents psychiatriques sévères récents, en situation de handicap psychique ou en arrêt de plus de 6 mois pour motif psychiatrique ; avis psychiatrique en cas de risque suicidaire ou de trouble sévère. Annuaire : Institut Français de Thérapie des Schémas (IFTS), association de formation qui ne prend pas en charge de patients ; thérapeutes formés, certains certifiés par l’ISST ; informations déclarées par les thérapeutes. Annuaire international : schematherapysociety.org (Find a Therapist).",
    },
    retenir: {
      titre: "À retenir",
      items: [
        "Un schéma n’est pas un défaut : c’est une adaptation apprise tôt.",
        "Derrière chaque schéma, il y a un besoin légitime.",
        "On ne l’efface pas d’un coup : on apprend à le reconnaître et à y répondre autrement.",
        "Je peux avancer seul(e), un geste à la fois, et demander de l’aide quand il le faut.",
      ],
      pro: "Laisser un temps de silence après cette page. Inviter chacun à dire, s’il le souhaite, quelle base lui semble la plus concernée, sans entrer dans les détails personnels en groupe.",
      invite: "Écrire en une phrase quelle base me concerne le plus.",
    },
    carnet: {
      titre: "Pour la semaine : mon carnet de schémas",
      chapeau: "Une fois par jour, noter une situation où l’émotion a semblé trop forte. Le relire chaque dimanche, ou l’apporter à la séance suivante.",
      colonnes: ["Situation", "Émotion (0 à 10)", "Petite voix", "Base touchée", "Ce que j’ai fait", "Ce que dirait l’adulte sain"],
      exemple: { situation: "Un ami annule notre sortie", emotion: "Tristesse : 7", voix: "« Je compte peu pour lui. »", base: "1 · Sécurité", fait: "Je me suis retiré(e)", adulte: "« Une annulation n’est pas un rejet ; je peux lui dire ma déception. »" },
      pro: "Le carnet sert à repérer, pas à se juger. La colonne « adulte sain » peut rester vide au début : on la remplit ensemble en séance, ou plus tard seul(e). Si une situation réveille une émotion très intense, ne pas rester seul(e) avec : en parler au thérapeute ou à son médecin. Document complémentaire : « Auto-observation des schémas ».",
      invite: "Relire le carnet chaque dimanche ; la colonne « adulte sain » peut rester vide au début.",
    },
    lectures: {
      titre: "Pour aller plus loin",
      livres: [
        { titre: "La thérapie des schémas : approche cognitive des troubles de la personnalité", auteurs: "J. Young, J. Klosko, M. Weishaar", editeur: "De Boeck Supérieur, trad. B. Pascal, 3e édition 2024 (original : Schema Therapy, Guilford, 2003)", note: "L’ouvrage de référence, destiné aux professionnels." },
        { titre: "Je réinvente ma vie", auteurs: "J. Young, J. Klosko", editeur: "Les Éditions de l’Homme, trad. M. Perron, 1995 (réédition 2018)", note: "La version grand public : un chapitre par schéma, avec exercices." },
        { titre: "Cambridge Guide to Schema Therapy", auteurs: "R. N. Brockman, S. Simpson, C. Hayes, R. van der Wijngaart, M. Smout", editeur: "Cambridge University Press, 2023 (en anglais)", note: "Chapitre sur les besoins fondamentaux, les schémas et les réactions." },
      ],
      annuaire: { label: "Annuaire pour une thérapie avec un professionnel", url: "https://www.schematherapie.fr/annuaire-therapeutes" },
      pro: "Le livre grand public peut être proposé en lecture entre les séances, un chapitre à la fois, en commençant par le schéma le plus actif.",
      invite: "Lire un chapitre à la fois, sans chercher à tout traiter. L’annuaire permet de trouver un thérapeute formé à la thérapie des schémas.",
    },
  },
};

export const CONTENT = deepFr(C);
