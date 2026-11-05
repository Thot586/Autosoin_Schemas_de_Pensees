import { Page, Section, Button } from "../components/ui";

export default function NotFound() {
  return (
    <Page title="Page introuvable">
      <Section>
        <div className="notfound">
          <p className="eyebrow">Page introuvable</p>
          <h1>Cette page n’existe pas (ou plus).</h1>
          <p className="lead">Pas de souci : on repart de l’accueil, ou d’un des chemins ci-dessous.</p>
          <div className="row">
            <Button to="/" icon="home">Accueil</Button>
            <Button to="/apprendre" variant="soft">Par où commencer ?</Button>
            <Button to="/schemas" variant="ghost">Mes schémas</Button>
          </div>
        </div>
      </Section>
    </Page>
  );
}
