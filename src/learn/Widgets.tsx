import { useState } from "react";
import { Choice } from "../components/ui";
import { Icon } from "../components/Icon";
import { Breathing } from "../components/Breathing";
import { CONTENT } from "../data/content";
import { BASES } from "../data/bases";
import { schemasOfBase } from "../data/schemas";
import type { WidgetKey } from "./types";
import { exoRatings } from "./progress";
import { Link } from "../lib/router";

/** Le même message « ok », lu à travers quatre paires de lunettes. */
function LunettesDemo() {
  const d = CONTENT.p1.quoi.lunettesExemple;
  const [v, setV] = useState<string>("aucune");
  const cur = d.lectures.find((l) => l.id === v)!;
  return (
    <div className="w-lens">
      <p className="w-lens-msg"><Icon name="chat" size={22} /> {d.message}</p>
      <Choice label="Avec quelles lunettes je lis ce message ?" value={v} onChange={setV} options={d.lectures.map((l) => ({ id: l.id, label: l.label }))} className="choice-col" />
      <div className={`w-lens-out ${v === "aucune" ? "is-clear" : "is-tint"}`} aria-live="polite">
        <span className="w-lens-lab">Ce que je me dis</span>
        <p key={v} className="w-lens-q">{cur.texte}</p>
      </div>
      <p className="w-foot">{d.conclusion}</p>
    </div>
  );
}

/** « Quel âge ai-je l'impression d'avoir, là, maintenant ? » */
function AgeSlider() {
  const s = CONTENT.p3.signes;
  const [age, setAge] = useState<number | null>(null);
  const child = age !== null && age <= 14;
  return (
    <div className="w-age">
      <label htmlFor="w-age" className="sr-only">{s.question}</label>
      <p className="w-age-n" aria-hidden="true">{age === null ? "…" : `${age} ans`}</p>
      <input id="w-age" type="range" min={3} max={50} step={1} value={age ?? 27} onChange={(e) => setAge(Number(e.target.value))}
        aria-valuetext={age === null ? "pas encore choisi" : `${age} ans`} className="range" />
      <div className="range-scale" aria-hidden="true"><span>enfant</span><span>adulte d’aujourd’hui</span></div>
      <p className="w-age-out" aria-live="polite">
        {age === null ? <>Je bouge le curseur, sans réfléchir longtemps. {s.age.aide}</> : child ? s.age.enfant : s.age.adulte}
      </p>
    </div>
  );
}

/** Numéros d'urgence : un geste pour appeler. */
export function Numeros({ compact = false, only }: { compact?: boolean; only?: "urgence" | "autres" }) {
  const list = CONTENT.p8.aide.numeros.filter((n) => {
    const hors = "horsUrgence" in n && n.horsUrgence;
    return only === "urgence" ? !hors : only === "autres" ? hors : true;
  });
  return (
    <ul className={`numeros ${compact ? "is-compact" : ""}`}>
      {list.map((n) => {
        const sms = "sms" in n && n.sms;
        return (
          <li key={n.num}>
            <a href={`${sms ? "sms" : "tel"}:${n.tel}`} className="numero">
              <span className="numero-n">{n.num}</span>
              <span className="numero-t">{n.texte}</span>
              <span className="numero-call"><Icon name={sms ? "chat" : "phone"} size={18} /><span>{sms ? "SMS" : "Appeler"}</span><span className="sr-only"> le {n.num}</span></span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function Bases() {
  return (
    <ol className="w-bases">
      {BASES.map((b) => (
        <li key={b.id} className={`tone-b${b.id}`}>
          <span className="w-bases-n">{b.id}</span>
          <span className="w-bases-t"><b>{b.name}</b><small>{b.besoins[0]}</small></span>
        </li>
      ))}
    </ol>
  );
}

function Quinze() {
  return (
    <div className="w-quinze">
      {BASES.map((b) => (
        <section key={b.id} className={`tone-b${b.id}`}>
          <h3><span className="w-bases-n">{b.id}</span>{b.name}</h3>
          <ul>{schemasOfBase(b.id).map((s) => <li key={s.slug}>{s.name}</li>)}</ul>
        </section>
      ))}
    </div>
  );
}

/** Note de 0 à 10, gardée sur l'appareil (avant / après un exercice guidé). */
function Echelle({ id }: { id: string }) {
  const all = exoRatings.use();
  const v = all[id];
  const before = id.endsWith("-avant");
  return (
    <div className="w-scale">
      <label htmlFor={`sc-${id}`} className="sr-only">De 0 (calme) à 10 (très difficile)</label>
      <p className="w-age-n" aria-hidden="true">{v == null ? "…" : `${v} sur 10`}</p>
      <input id={`sc-${id}`} type="range" min={0} max={10} step={1} value={v ?? 5} className="range"
        aria-valuetext={v == null ? "pas encore choisi" : `${v} sur 10`}
        onChange={(e) => exoRatings.set((x) => ({ ...x, [id]: Number(e.target.value) }))} />
      <div className="range-scale" aria-hidden="true"><span>0 : calme</span><span>10 : très difficile</span></div>
      {before && v != null && v >= 7 && (
        <p className="w-scale-warn" role="status">
          <Icon name="heart" size={18} /> C’est beaucoup. Aujourd’hui, je fais plutôt la pause en trois temps, et j’en parle à mon équipe de soins. <Link to="/outils/pause">La pause en trois temps</Link>
        </p>
      )}
    </div>
  );
}

/** Avant / après : ce qui a bougé. Si l'émotion monte, on s'arrête. */
function Bilan({ prefix }: { prefix: string }) {
  const all = exoRatings.use();
  const a = all[`${prefix}-avant`], b = all[`${prefix}-apres`];
  if (a == null || b == null) return <p className="w-bilan">Je n’ai pas noté avant ou après : ce n’est pas grave. Ce qui compte, c’est d’avoir essayé.</p>;
  return (
    <div className={`w-bilan ${b > a ? "is-up" : ""}`} role="status">
      <p className="w-bilan-n"><span>Avant : <b>{a}</b> sur 10</span><span>Après : <b>{b}</b> sur 10</span></p>
      {b < a && <p>L’émotion a baissé. Je peux noter ce qui m’a aidé, pour le retrouver la prochaine fois.</p>}
      {b === a && <p>L’émotion n’a pas bougé : c’est possible, surtout les premières fois.</p>}
      {b > a && <p><Icon name="heart" size={18} /> L’émotion est montée. Je m’arrête là pour aujourd’hui : je fais la pause en trois temps, et j’en parle à mon équipe de soins. <Link to="/outils/pause">La pause en trois temps</Link></p>}
    </div>
  );
}

export function Widget({ k, param }: { k: WidgetKey; param?: string }) {
  switch (k) {
    case "echelle": return <Echelle id={param ?? "note"} />;
    case "bilan": return <Bilan prefix={param ?? "note"} />;
    case "lunettes-demo": return <LunettesDemo />;
    case "age": return <AgeSlider />;
    case "numeros": return <Numeros />;
    case "bases": return <Bases />;
    case "quinze": return <Quinze />;
    case "respiration": return <Breathing />;
  }
}
