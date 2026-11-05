import { deepFr } from "../lib/typo";
import type { BaseData, BaseId } from "./types";

// Contenu des cinq pages « base » du diaporama (parties 2) + animations natives.
const BASES_RAW: BaseData[] = [
  {
    id: 1, slug: "securite-attachement", name: "Sécurité et attachement", domain: "Séparation et rejet",
    besoins: ["Être en sécurité, protégé(e)", "Une affection stable et prévisible", "Être écouté(e) et accepté(e) tel(le) qu’il est"],
    manque: "On s’attend à être quitté(e), blessé(e), incompris(e) ou rejeté(e).",
    quotidien: {},
    pro: "La base la plus fondamentale : les autres besoins s’appuient sur elle. Les cinq schémas ont un point commun : l’attente que le lien ne sera pas sûr. Chacun dit comment il ne le sera pas : l’autre partira (abandon), fera du mal (méfiance), ne donnera pas assez (carence), ne m’inclura pas (isolement), me rejettera s’il me voit vraiment (imperfection). Inviter chacun à repérer la phrase qui « sonne » le plus vrai, sans la commenter.",
    autosoin: "lire les cinq phrases à voix basse et noter celle qui sonne le plus vrai, sans la discuter.",
    anim: {
      id: "lunettes", titre: "Des lunettes teintées",
      explication: "Des événements variés et souvent ambigus (un message bref, un silence, une critique) passent à travers des « lunettes » teintées par les schémas de la base 1. Quand la sécurité a manqué, ce sont les événements qui confirment le schéma qui ressortent. Ceux qui le contredisent (un merci, un appel d’un ami, une gentillesse) étaient pourtant là, mais ils passent inaperçus.",
      essai: "repérer cette semaine un événement qui contredit l’idée « on ne peut pas compter sur les autres », et le noter dans le carnet.",
    },
  },
  {
    id: 2, slug: "autonomie-competence", name: "Autonomie et compétence", domain: "Autonomie et performance altérées",
    besoins: ["Être encouragé(e) à essayer seul(e)", "Avoir confiance en ses capacités", "Devenir soi, distinct(e) de ses parents"],
    manque: "On doute de pouvoir réussir, se protéger ou exister par soi-même.",
    quotidien: {},
    pro: "Cette base se fragilise par le manque (on n’a pas été guidé) mais aussi par le trop (surprotection, parent qui fait à la place, ou qui a besoin que l’enfant reste proche). On peut avoir un schéma d’échec tout en étant objectivement compétent : le schéma parle de ce qu’on ressent, pas des faits. Exemple à proposer : demander l’avis de quelqu’un avant chaque petite décision.",
    autosoin: "",
    anim: {
      id: "marches", titre: "La confiance se construit marche après marche",
      explication: "Attendre d’être prêt(e) ne fait pas monter la confiance, qui ne bouge pas toute seule. La confiance se construit marche après marche : chaque petit pas réussi en ajoute un peu, un pas trop difficile ou une petite erreur la fait baisser légèrement, puis elle remonte.",
      essai: "choisir une seule marche, assez petite pour être faisable cette semaine, la faire, puis noter ce qui s’est passé.",
    },
  },
  {
    id: 3, slug: "exprimer-besoins-emotions", name: "Exprimer besoins et émotions", domain: "Orientation vers les autres",
    besoins: ["Pouvoir dire ce qu’il ressent et ce qu’il veut", "Que ses besoins comptent autant que ceux des autres", "Ne pas avoir à porter les adultes"],
    manque: "On s’efface pour garder le lien ou éviter le conflit.",
    extra: "Le modèle complet ajoute la recherche d’approbation : « Ma valeur dépend du regard des autres. »",
    quotidien: {
      "assujettissement": "Au quotidien : céder, laisser choisir, finir par ne plus savoir ce qu’on veut.",
      "sacrifice-de-soi": "Au quotidien : écouter, aider, rarement demander pour soi.",
    },
    pro: "Différence utile : dans l’assujettissement, on cède souvent par crainte ou par habitude ; dans le sacrifice de soi, on donne volontairement, par empathie ou par sens du devoir. Les deux ont le même coût : ses propres besoins disparaissent, et une colère ou une fatigue s’installe. La colère est ici un signal précieux : elle indique un besoin écrasé.",
    autosoin: "repérer une petite chose que j’ai tue cette semaine, et choisir à qui la dire, et quand, en une phrase.",
    anim: {
      id: "verre", titre: "Le verre qui déborde",
      explication: "Chaque besoin ou émotion qu’on tait reste en nous, comme de l’eau dans un verre. Un jour, ça déborde, et l’on en conclut que s’exprimer est dangereux. Dans la même semaine, dire les petites choses quand elles arrivent garde le verre à un niveau supportable.",
      essai: "repérer une petite chose que j’ai tue cette semaine, et choisir à qui la dire, et quand, en une phrase.",
    },
  },
  {
    id: 4, slug: "spontaneite-jeu", name: "Spontanéité et jeu", domain: "Survigilance et inhibition",
    besoins: ["Jouer, rire, être spontané(e)", "Avoir droit à l’erreur", "Un climat détendu, pas seulement exigeant"],
    manque: "On contrôle ses émotions et ses performances, au détriment du plaisir.",
    extra: "Le modèle complet ajoute la négativité (« ça va mal tourner ») et la punition (« une erreur mérite une sanction »).",
    quotidien: {
      "controle-emotionnel": "Au quotidien : visage neutre, ton posé, affection montrée par des actes plutôt que par des mots.",
      "ideaux-exigeants": "Au quotidien : pression constante, peu de repos, autocritique sévère.",
    },
    pro: "Le contrôle émotionnel n’empêche pas de ressentir : il empêche de montrer. Les idéaux exigeants ne sont pas du perfectionnisme « de surface » : la personne se sent sous pression permanente, même quand tout va bien. Question au groupe : « Quand avez-vous joué ou ri sans retenue pour la dernière fois ? »",
    autosoin: "se poser la question et noter la dernière fois où l’on a joué ou ri sans retenue, même si c’est ancien.",
    anim: {
      id: "journee", titre: "Une même journée, deux façons de la vivre",
      explication: "Contrôler ses émotions et viser la perfection use l’énergie, et la tension monte. Dans la même journée, avec un temps de jeu sans but et le droit de se plaindre, l’énergie tient mieux : se plaindre, c’est décharger la tension émotionnelle en disant que ça pèse à quelqu’un de sûr.",
      essai: "placer dans la journée un temps de jeu sans but, et dire une chose qui pèse à une personne de confiance.",
    },
  },
  {
    id: 5, slug: "limites-maitrise-de-soi", name: "Limites et maîtrise de soi", domain: "Manque de limites",
    besoins: ["Des limites claires et bienveillantes", "Apprendre à tolérer la frustration", "Tenir compte des autres"],
    manque: "On peine à accepter les limites, les règles ou l’effort.",
    extra: "Les droits exagérés protègent parfois d’un manque vécu ailleurs : une piste à explorer en séance.",
    quotidien: {
      "droits-exageres": "Au quotidien : supporter mal un refus, contourner les contraintes.",
      "manque-d-autocontrole": "Au quotidien : abandonner les tâches ennuyeuses, céder à l’impulsion.",
    },
    pro: "Ces schémas naissent souvent du « trop » (enfant à qui tout était permis) ou de l’absence de cadre, mais aussi parfois d’une compensation : quand on a beaucoup manqué ou beaucoup cédé, on peut se rattraper en refusant toute limite. Présenter sans jugement moral : la difficulté porte sur l’apprentissage de la frustration, pas sur la « valeur » de la personne.",
    autosoin: "retenir l’idée sans la creuser seul(e) ; une piste à explorer avec un professionnel si elle fait écho.",
    anim: {
      id: "vague", titre: "L’envie est une vague",
      explication: "Une envie monte comme une vague. Céder coupe la vague en route : on ne saura jamais si elle serait passée. Si l’on attend (« Je respire. J’attends. »), elle atteint un pic puis redescend d’elle-même, en une dizaine de minutes environ.",
      essai: "la prochaine fois qu’une envie forte arrive, regarder l’heure, respirer, attendre dix minutes, puis noter comment l’envie a évolué.",
    },
  },
];

export const BASES: BaseData[] = deepFr(BASES_RAW);
export const baseById = (id: BaseId): BaseData => BASES[id - 1];
