import { useEffect, useState } from "react";
import { Page, Section, Reveal, Callout, Button, Card } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { META } from "../data/meta";

interface InstallEvent extends Event { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

export default function APropos() {
  const [ev, setEv] = useState<InstallEvent | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const on = (e: Event) => { e.preventDefault(); setEv(e as InstallEvent); };
    window.addEventListener("beforeinstallprompt", on);
    return () => window.removeEventListener("beforeinstallprompt", on);
  }, []);
  const install = async () => { if (!ev) return; await ev.prompt(); const r = await ev.userChoice; setEv(null); setMsg(r.outcome === "accepted" ? "Installé : je le retrouve sur mon écran d’accueil." : ""); };
  const share = async () => {
    const url = location.origin + location.pathname.replace(/a-propos\/?$/, "");
    const data = { title: META.nom, text: "Un support pour comprendre ses schémas, à son rythme.", url };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(url); setMsg("Lien copié.");
    } catch { setMsg(""); }
  };
  const ts = Number(__BUILD_ID__);
  const built = ts > 1e12 ? new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";
  const hasLegal = !!(META.editeur || META.directeur || META.hebergeur || META.contact);

  return (
    <Page title="À propos et mentions">
      <header className="parthero tone-brand">
        <div className="wrap">
          <p className="eyebrow">À propos</p>
          <h1>À propos de ce site</h1>
          <p className="lead">Ce que c’est, ce que ce n’est pas, et ce qui devient de mes données.</p>
          {META.statut && <p><span className="status-tag">{META.statut}</span></p>}
        </div>
      </header>

      <Section eyebrow="Ce que c’est" title="Un support d’autosoin">
        <div className="prose">
          <p><b>{META.nom}</b> aide à repérer des thèmes de vie appris tôt (les « schémas »), à comprendre comment ils s’entretiennent et à essayer de petits gestes, à son rythme. Il s’inspire de la thérapie des schémas de Jeffrey Young. Il prépare à une thérapie ou la complète : il ne la remplace pas.</p>
          <p>Il reprend le contenu d’un diaporama de psychoéducation, remis en forme pour le téléphone, la tablette et l’ordinateur : animations, définitions, outils à remplir, carnet, plan de la semaine.</p>
        </div>
      </Section>

      <Section className="alt" eyebrow="Ses limites" title="Ce que ce site n’est pas">
        <ul className="a-list">
          <Reveal as="li"><Icon name="info" size={20} /><span>Ce n’est pas un diagnostic. Se reconnaître dans une phrase aide à réfléchir ; cela ne dit pas ce qu’on « a ».</span></Reveal>
          <Reveal as="li" delay={70}><Icon name="info" size={20} /><span>Ce n’est pas un dispositif médical, ni un suivi. Pour un repérage fiable des schémas, le questionnaire YSQ-2 se passe avec un(e) professionnel(le) formé(e).</span></Reveal>
          <Reveal as="li" delay={140}><Icon name="phone" size={20} /><span>Ce n’est pas un service d’urgence. Si ça ne va pas depuis plusieurs semaines, ou si je pense à me faire du mal : <Link to="/pour-la-suite/aide">quand demander de l’aide</Link>. En urgence : 3114, 15 ou 112.</span></Reveal>
        </ul>
      </Section>

      <Section eyebrow="Mes données" title="Ce qui reste sur mon appareil">
        <div className="prose">
          <p>Ce que j’écris et coche (schémas gardés, cartes, plan, carnet, notes) est enregistré <b>uniquement dans mon navigateur</b>, sur cet appareil. Le site n’envoie rien : pas de compte, pas de cookie de suivi, pas de statistiques. Les polices et les images viennent du site lui-même.</p>
          <p>Conséquence : si je vide les données de mon navigateur ou si je change d’appareil, je perds mes notes. Je peux les <Link to="/mon-espace">sauvegarder dans un fichier</Link> et les restaurer ailleurs, ou tout effacer depuis <Link to="/mon-espace">Mon espace</Link>.</p>
          <p>Les liens vers d’autres sites (Mon soutien psy, annuaire de thérapeutes) s’ouvrent dans un nouvel onglet, seulement si je clique.</p>
        </div>
      </Section>

      <Section className="alt" eyebrow="Sur mon téléphone" title="L’installer comme une application">
        <div className="a-install">
          <Card>
            <h3><Icon name="phone" size={22} /> Téléphone ou tablette</h3>
            <ul className="a-steps">
              <li><b>Android (Chrome)</b> : menu ⋮, puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».</li>
              <li><b>iPhone et iPad (Safari)</b> : bouton Partager, puis « Sur l’écran d’accueil ».</li>
            </ul>
          </Card>
          <Card>
            <h3><Icon name="sun" size={22} /> Ordinateur</h3>
            <p>Chrome et Edge : icône d’installation à droite de la barre d’adresse, ou menu, « Installer ».</p>
            {ev && <Button icon="download" onClick={install}>Installer maintenant</Button>}
          </Card>
        </div>
        <p className="small muted mt">Une fois ouvert une première fois avec internet, le site fonctionne aussi sans connexion.</p>
        <div className="row mt"><Button variant="soft" icon="share" onClick={share}>Partager ce site</Button></div>
        <p className="small mt" role="status" aria-live="polite">{msg}</p>
      </Section>

      <Section eyebrow="Auteurs et sources" title="Qui a fait quoi">
        <div className="a-credits">
          <img className="a-logo" src={`${__BASE__}img/crr-logo.png`} alt="Centre Ressource de Réhabilitation psychosociale (CRR)" width="171" height="98" loading="lazy" />
          <div className="prose">
            <p>{META.creditLong}.</p>
            <p>D’après J. Young, J. Klosko et M. Weishaar (<i>La thérapie des schémas</i>, De Boeck Supérieur). Les références complètes sont dans <Link to="/pour-la-suite/lectures">Pour aller plus loin</Link>.</p>
          </div>
        </div>
      </Section>

      <Section className="alt" eyebrow="Pour tous" title="Accessibilité">
        <div className="prose">
          <p>Le site vise le niveau AA des recommandations d’accessibilité (WCAG) : contrastes vérifiés, navigation au clavier, lecteur d’écran pris en compte, texte agrandissable, thème clair ou sombre, animations désactivables. Aucun audit externe n’a encore été réalisé. Dans les réglages d’affichage (l’engrenage en haut sur ordinateur, le menu sur téléphone), je peux changer le thème, la taille du texte et réduire les animations.</p>
          {META.contact ? <p>Si quelque chose me bloque : <a href={`mailto:${META.contact}`}>{META.contact}</a>.</p> : null}
        </div>
      </Section>

      {hasLegal && (
        <Section eyebrow="Mentions" title="Mentions légales">
          <dl className="crow-dl">
            {META.editeur && <div><dt>Éditeur</dt><dd>{META.editeur}</dd></div>}
            {META.directeur && <div><dt>Directeur de la publication</dt><dd>{META.directeur}</dd></div>}
            {META.hebergeur && <div><dt>Hébergeur</dt><dd>{META.hebergeur}</dd></div>}
            {META.contact && <div><dt>Contact</dt><dd>{META.contact}</dd></div>}
          </dl>
        </Section>
      )}

      <Section>
        <Callout tone="info" title="Version du site" icon="info">
          <p className="small">{built ? `Mise à jour du ${built}. ` : ""}{META.statut}.</p>
        </Callout>
      </Section>
    </Page>
  );
}
