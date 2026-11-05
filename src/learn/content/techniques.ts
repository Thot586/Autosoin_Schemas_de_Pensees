import type { Lesson } from "../types";

// Leçons « L'imagerie » et « Le dialogue des chaises » — textes NOUVEAUX, à relire.
// Faits vérifiés le 5 novembre 2026 (PubMed, Crossref, texte intégral quand il existe) : docs/CONTENU.md, § 5.
// Règle d'écriture : ce qui est démontré est dit comme tel ; ce qui est une hypothèse commence par « On pense que… ».

export const TECHNIQUES: Lesson[] = [
  {
    id: "imagerie", chapter: "aide", minutes: 5, icon: "eye",
    title: "L’imagerie : revoir une scène autrement",
    short: "Revivre une scène ancienne, et y apporter enfin ce qui a manqué.",
    cards: [
      { id: "i1", kind: "text", icon: "eye", title: "Revoir une scène, pour y répondre autrement",
        body: ["En thérapie des schémas, on ne fait pas que parler. On travaille aussi avec des images.", "La technique la plus connue s’appelle la réécriture en imagination : on revoit une scène ancienne, et on y apporte ce qui a manqué."] },
      { id: "i2", kind: "anim", anim: "imagerie", title: "Comment ça se passe en séance" },
      { id: "i3", kind: "text", icon: "users", title: "Le thérapeute d’abord, puis moi",
        body: ["Au début, c’est le thérapeute qui entre dans la scène pour protéger l’enfant.", "Plus tard, c’est moi, l’adulte d’aujourd’hui, qui le fais. L’enfant peut demander de l’aide jusqu’à ce que son besoin soit comblé."],
        more: { body: ["C’est le déroulé décrit dans les essais récents, comme celui de l’essai IREM [@boterhoven2017], et recommandé dans la mise à jour du protocole [@arntz2025]."] } },
      { id: "i4", kind: "text", icon: "bolt", title: "Pourquoi des images, et pas seulement des mots ?",
        body: ["Les images réveillent les émotions plus fort que les mots : des expériences l’ont montré.", "C’est justement ce qu’on cherche. Un schéma se ressent avant de se penser : on le travaille donc là où il se ressent."],
        more: { body: ["Imaginer un événement désagréable provoque plus d’anxiété que d’y réfléchir avec des mots [@holmes2005]. Pour d’autres émotions, la question reste ouverte [@holmes2010]."] } },
      { id: "i5", kind: "text", icon: "replay", title: "Le passé ne change pas, son sens peut changer",
        body: ["Je sais que c’est de l’imagination : les faits restent les mêmes.", "Ce qui peut changer, c’est ce que la scène veut dire pour moi : « ce n’était pas ma faute », « j’avais droit à de l’aide »."],
        more: { body: ["C’est l’explication la plus admise aujourd’hui ; des études la soutiennent en partie [@rameckers2024; @assmann2024].", "Chez des volontaires qui avaient vu un film pénible, une séance de réécriture n’a pas abîmé leur souvenir du film [@ganslmeier2023; @aleksic2024]."] } },
      { id: "i6", kind: "text", icon: "heart", title: "L’enfant reçoit enfin ce qui lui manquait",
        body: ["Dans la scène, le besoin de l’enfant est entendu : de la sécurité, du réconfort, des mots justes.", "On pense que c’est l’un des ressorts du changement. Une petite étude va dans ce sens : quand les besoins étaient comblés pendant les séances, et que la personne pouvait exprimer ce qu’elle avait envie de faire, il restait moins de difficultés à la fin."],
        more: { body: ["Étude pilote sur 24 patients, sans groupe de comparaison [@koetsier2024] : les deux aspects ne comptaient qu’ensemble. C’est une piste, pas encore une preuve."] } },
      { id: "i7", kind: "text", icon: "check", title: "Ce qu’on en sait",
        body: ["Dans les essais, cette technique aide nettement : mieux que l’attente, et autant que d’autres thérapies reconnues, comme l’exposition ou l’EMDR.", "Ces études sont menées avec des thérapeutes formés, sur plusieurs séances."],
        more: { body: ["Deux méta-analyses vont dans ce sens [@morina2017; @kip2023]. Un essai sur 155 adultes trouve autant d’effet qu’avec l’EMDR, et peu d’abandons [@boterhoven2020].", "Limites : peu d’essais pour chaque trouble [@kip2023] ; et les personnes ayant un trouble psychotique étaient exclues, par exemple, du grand essai IREM [@boterhoven2017]."] } },
      { id: "i8", kind: "text", icon: "shield", tone: "care", title: "Un souvenir douloureux ne se revit pas seul(e)",
        body: ["Revivre ou réécrire seul(e) un souvenir de violence ou d’abus : non. Cela se fait avec un thérapeute formé.", "Un souvenir très douloureux se travaille avec un professionnel.", "Si j’entends des voix, ou si je me sens souvent « ailleurs », j’en parle d’abord à un professionnel : mon équipe de soins, mon médecin traitant ou un CMP."] },
      { id: "i9", kind: "links", icon: "flag", title: "Ce que je peux essayer seul(e)",
        body: ["Une version simple existe : une scène récente et légère, mon adulte sain qui y répond, puis mon geste répété en imagination.", "Personne n’a encore étudié cette version faite seul(e) : c’est une adaptation prudente, que j’arrête si c’est trop."],
        links: [{ to: "/outils/imagerie", label: "Essayer « Imaginer autrement » (dix minutes)", icon: "eye" }, { to: "/soutien", label: "Où trouver un thérapeute", icon: "users" }] },
      { id: "iq1", kind: "quiz", title: "Une question pour retenir", quiz: {
        id: "imagerie-qui", q: "Dans la réécriture en imagination, qui entre dans la scène ?",
        options: ["Le thérapeute, puis, plus tard, l’adulte que je suis devenu(e)", "Un juge, qui dit qui avait tort", "Personne : on se contente de regarder"], answer: 0,
        explain: "D’abord le thérapeute, ensuite l’adulte d’aujourd’hui : ils protègent l’enfant et répondent à son besoin." } },
      { id: "iq2", kind: "quiz", title: "Une question pour retenir", quiz: {
        id: "imagerie-passe", q: "Après une réécriture en imagination, le passé…",
        options: ["Reste le même : c’est son sens qui peut changer", "Est effacé", "Devient faux"], answer: 0,
        explain: "Je sais que c’est de l’imagination. Les faits restent ; ce que la scène veut dire pour moi peut changer." } },
      { id: "iq3", kind: "quiz", title: "Une question pour retenir", quiz: {
        id: "imagerie-seul", q: "Un souvenir de violence me revient. Le revivre seul(e), les yeux fermés, c’est…",
        options: ["À éviter : cela se travaille avec un thérapeute formé", "Une bonne idée, pour aller plus vite"], answer: 0,
        explain: "Un souvenir très douloureux se travaille avec un professionnel. Seul(e), je m’en tiens à des scènes récentes et légères." } },
    ],
    retain: [
      "En séance, on revoit une scène ancienne, et le thérapeute ou l’adulte sain y apporte ce qui a manqué.",
      "Le passé ne change pas : c’est son sens qui peut changer.",
      "Un souvenir très douloureux se travaille avec un professionnel.",
    ],
  },
  {
    id: "chaises", chapter: "aide", minutes: 5, icon: "users",
    title: "Le dialogue des chaises",
    short: "Donner une place à chaque voix, et laisser le dernier mot à l’adulte sain.",
    cards: [
      { id: "c1", kind: "text", icon: "users", title: "Une place pour chaque part de soi",
        body: ["On a tous plusieurs voix en soi : celle qui critique, celle qui a mal, celle qui prend soin.", "Le dialogue des chaises donne à chacune sa chaise, et les fait parler à tour de rôle."] },
      { id: "c2", kind: "anim", anim: "chaises", title: "Comment ça se passe en séance" },
      { id: "c3", kind: "text", icon: "book", title: "D’où vient cette technique",
        body: ["Elle est née dans le psychodrame, puis dans la Gestalt-thérapie.", "La thérapie centrée sur les émotions et la thérapie des schémas l’ont ensuite reprise."],
        more: { label: "Sources", body: ["[n@kellogg2014] ; [n@kroener2024]."] } },
      { id: "c4", kind: "text", icon: "eye", title: "Une voix, pas toute la vérité",
        body: ["Quand la petite voix critique est assise sur une autre chaise, je vois mieux qu’elle n’est qu’une partie de moi.", "Je la regarde, au lieu de l’entendre de l’intérieur, comme si elle disait vrai."],
        more: { body: ["C’est un principe de travail décrit par les spécialistes [@kroener2024; @pugh2017]. Il n’a pas encore été testé à part."] } },
      { id: "c5", kind: "text", icon: "heart", title: "Ressentir, pas seulement en parler",
        body: ["En parlant depuis une chaise, l’émotion vient pour de vrai. On pense que le changement peut alors se faire dans le cœur, et pas seulement dans la tête.", "Mettre des mots sur ce que je ressens semble aussi l’apaiser un peu."],
        more: { body: ["Ce sont des hypothèses des chercheurs [@kroener2024]. En laboratoire, mettre un mot sur une émotion (celle d’un visage, en photo) diminue la réaction de l’amygdale, une région du cerveau des émotions [@lieberman2007]."] } },
      { id: "c6", kind: "text", icon: "flag", title: "S’entraîner à répondre",
        body: ["Debout, l’adulte sain répond à la critique : avec fermeté, puis avec douceur.", "C’est comme une répétition : on pense que ses mots reviennent ensuite plus facilement dans la vraie vie."],
        more: { body: ["Cette répétition fait partie des protocoles [@kroener2024] ; son effet propre n’a pas encore été mesuré."] } },
      { id: "c7", kind: "text", icon: "check", title: "Ce qu’on en sait",
        body: ["Les études sont encore peu nombreuses, et souvent petites. Elles montrent moins d’autocritique et plus de douceur envers soi.", "Les chercheurs parlent de résultats prometteurs, pas encore solides."],
        more: { body: ["Un essai sur 34 personnes [@paivio1995], une étude pilote sur 9 personnes [@shahar2012], une méta-analyse de 11 études [@wang2026] et une revue de 22 essais randomisés [@ottingerova2026]."] } },
      { id: "c8", kind: "text", icon: "shield", tone: "care", title: "Une pensée, pas une voix entendue",
        body: ["La petite voix, ici, c’est une pensée que je me dis à moi-même.", "Si j’entends des voix qui viennent de l’extérieur, ou si je me sens souvent « ailleurs », j’en parle d’abord à un professionnel : mon équipe de soins, mon médecin traitant ou un CMP.", "Et je ne fais jamais parler seul(e), sur une chaise, une personne qui m’a fait du mal."] },
      { id: "c9", kind: "links", icon: "flag", title: "Ce que je peux essayer seul(e)",
        body: ["Une version simple existe, avec deux places, ou deux colonnes sur une feuille. L’adulte sain a toujours le dernier mot.", "Elle n’a pas été étudiée faite seul(e) : c’est une adaptation prudente, que j’arrête si c’est trop."],
        links: [{ to: "/outils/chaises", label: "Essayer « Deux places, deux voix » (dix minutes)", icon: "users" }, { to: "/soutien", label: "Où trouver un thérapeute", icon: "users" }] },
      { id: "cq1", kind: "quiz", title: "Une question pour retenir", quiz: {
        id: "chaises-fin", q: "Par quelle voix termine-t-on un dialogue des chaises ?",
        options: ["Celle de l’adulte sain", "Celle de la petite voix critique", "Peu importe"], answer: 0,
        explain: "On finit toujours avec l’adulte sain : c’est sa voix qu’on veut garder en soi." } },
      { id: "cq2", kind: "quiz", title: "Une question pour retenir", quiz: {
        id: "chaises-place", q: "Mettre la petite voix sur une autre chaise, ça aide à…",
        options: ["Voir qu’elle n’est qu’une partie de moi, pas toute la vérité", "La faire taire pour toujours"], answer: 0,
        explain: "On la regarde au lieu de l’entendre de l’intérieur. Elle ne disparaît pas d’un coup : on apprend à lui répondre." } },
      { id: "cq3", kind: "quiz", title: "Une question pour retenir", quiz: {
        id: "chaises-seul", q: "Seul(e), qui est-ce que je ne fais jamais parler sur une chaise ?",
        options: ["Une personne qui m’a fait du mal", "Mon adulte sain"], answer: 0,
        explain: "Ce travail-là se fait avec un thérapeute. Seul(e), je m’en tiens à la petite voix d’une situation récente et légère." } },
    ],
    retain: [
      "Chaque part de moi a sa chaise : la petite voix, ce que je ressens, l’adulte sain.",
      "La petite voix est une partie de moi, pas toute la vérité.",
      "On termine toujours avec l’adulte sain.",
    ],
  },
];
