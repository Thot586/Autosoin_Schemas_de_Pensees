import { Page, PartHero, Section, Reveal, Callout, Invite, NextUp, Pro, Retain, Pill, Term } from "../components/ui";
import { Icon } from "../components/Icon";
import { Link } from "../lib/router";
import { BASES } from "../data/bases";
import { schemasOfBase } from "../data/schemas";
import { CONTENT } from "../data/content";
import { visited } from "../lib/state";

export default function Besoins() {
  const v = visited.use();
  const seen = (slug: string) => !!v[`/besoins/${slug}`];
  const n = BASES.filter((b) => seen(b.slug)).length;
  const c = CONTENT.p2;
  return (
    <Page title="Les 5 besoins">
      <PartHero n={2} title="Cinq besoins, quinze schémas" intro={c.chapeau} />

      <Section eyebrow="Le principe" title="Quand un besoin manque, un schéma peut se former">
        <ol className="flow3">
          {c.flux.map((f, i) => (
            <Reveal as="li" key={i} delay={i * 120} className="flow3-i">
              <span className="flow3-n">{i + 1}</span>
              <b>{f.titre}</b>
              <span>{f.texte}</span>
              {i < 2 && <Icon name="arrowRight" size={22} className="flow3-ar" />}
            </Reveal>
          ))}
        </ol>
        <p className="prose muted mt">{c.flux_note}</p>
      </Section>

      <Section className="alt" eyebrow="Les cinq bases" title="J’explore une base à la fois"
        lead={<>Chaque base réunit un besoin et le groupe de schémas (un <Term id="domaine">domaine</Term>) qui peut naître quand il manque. {n > 0 && <b>{n} sur 5 explorée{n > 1 ? "s" : ""}.</b>}</>}>
        <div className="basecards">
          {BASES.map((b, i) => {
            const sc = schemasOfBase(b.id);
            return (
              <Reveal key={b.id} delay={(i % 3) * 80} className={`tone-b${b.id}`}>
                <Link to={`/besoins/${b.slug}`} className="basecard">
                  <span className="basecard-top">
                    <span className="basecard-n">{b.id}</span>
                    <span className="basecard-h"><b>{b.name}</b><small>{b.domain}</small></span>
                    {seen(b.slug) && <span className="basecard-seen" title="Déjà explorée"><Icon name="check" size={16} /><span className="sr-only">Déjà explorée</span></span>}
                  </span>
                  <span className="basecard-sec">Le besoin</span>
                  <ul className="basecard-needs">{b.besoins.map((x) => <li key={x}>{x}</li>)}</ul>
                  <span className="basecard-sec">S’il manque</span>
                  <span className="basecard-miss">{b.manque}</span>
                  <span className="basecard-chips">{sc.map((s) => <Pill key={s.slug}>{s.name}</Pill>)}</span>
                  <span className="basecard-go">Explorer cette base <Icon name="arrowRight" size={18} /></span>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="stack" style={{ ["--gap" as string]: "1.4rem" }}>
          <Callout title="À propos du questionnaire de Young" icon="info">
            <p>{c.ysq} {c.complet}</p>
            <p>Un vrai repérage de ses schémas passe par le questionnaire YSQ-2, passé avec un(e) professionnel(le) : ici, c’est une première approche pour s’orienter.</p>
          </Callout>
          <Invite id="p2-base" prompt="Quelle base a les phrases qui sonnent le plus vrai pour moi ?" hint={c.invite} placeholder="Je pense que c’est la base… parce que…" />
          <Pro>{c.pro}</Pro>
          <Retain items={c.retenir} />
        </div>
      </Section>

      <Section>
        <NextUp to="/entretien" label="Comment un schéma s’entretient" hint="Le cercle, les trois façons de réagir, les signes." eyebrow="Partie 3 sur 8" />
      </Section>
    </Page>
  );
}
