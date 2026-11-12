import { useId, useState } from "react";
import { TMAX, WAVE, WX0, WX1, WY0, wx, wy } from "../scenes/BaseScenes";
import { Choice } from "../components/ui";
import { Icon } from "../components/Icon";
import { BaseEmblem } from "../components/Emblem";
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
        {/* les mêmes lunettes que l'animation de la base 1 : verres clairs, ou teintés dès qu'un schéma les colore */}
        <svg viewBox="0 0 220 90" className="w-lens-glasses" aria-hidden="true">
          <path d="M8 34 L2 26 M212 34 L218 26" className="w-lens-frame" />
          <rect x="10" y="22" width="88" height="58" rx="26" className="w-lens-glass" />
          <rect x="122" y="22" width="88" height="58" rx="26" className="w-lens-glass" />
          <path d="M98 44 Q110 36 122 44" className="w-lens-frame" />
        </svg>
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
          <BaseEmblem id={b.id} size={34} className="w-bases-e" />
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
          <Icon name="heart" size={18} /> C’est beaucoup. Aujourd’hui, je fais plutôt la pause en trois temps. Si ça ne passe pas, j’en parle à un professionnel. <Link to="/outils/pause">La pause en trois temps</Link> · <Link to="/soutien">Où trouver un soutien</Link>
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
      {b > a && <p><Icon name="heart" size={18} /> L’émotion est montée. Je m’arrête là pour aujourd’hui : je fais la pause en trois temps, et j’en parle à un professionnel (mon médecin traitant, mon équipe de soins si j’en ai une). <Link to="/outils/pause">La pause en trois temps</Link> · <Link to="/soutien">Où trouver un soutien</Link></p>}
    </div>
  );
}

/** Le verre, à mon tour : me taire fait monter le niveau ; dire une petite chose le fait baisser. Plein, il déborde. */
const VERRE_MSG = {
  debut: "Le verre est presque vide.",
  tais: "Je garde ça pour moi : le niveau monte.",
  deborde: "Ça déborde : tout sort d’un coup, plus fort que prévu.",
  dis: "Je le dis tôt, en une phrase : le niveau redescend.",
};
// Verre vu de trois quarts : bord en ellipse, parois qui se resserrent, pied épais.
// Demi-largeur intérieure à la hauteur y (bord y=62, fond y=246).
const V_TOP = 62, V_BOT = 246, V_HW_TOP = 46, V_HW_BOT = 32, V_CX = 80;
const vHw = (y: number) => V_HW_TOP - (V_HW_TOP - V_HW_BOT) * (y - V_TOP) / (V_BOT - V_TOP);
const V_BODY = `M${V_CX - V_HW_TOP} ${V_TOP} L${V_CX - V_HW_BOT} ${V_BOT} Q${V_CX} ${V_BOT + 6} ${V_CX + V_HW_BOT} ${V_BOT} L${V_CX + V_HW_TOP} ${V_TOP} Z`;
function VerreJeu() {
  const uid = useId().replace(/:/g, "");
  const [lv, setLv] = useState(0.1);
  const [msg, setMsg] = useState(VERRE_MSG.debut);
  const [drops, setDrops] = useState(0);
  const over = lv >= 1;
  const tais = () => { const n = Math.min(1, +(lv + 0.225).toFixed(3)); setLv(n); setDrops((d) => d + 1); setMsg(n >= 1 ? VERRE_MSG.deborde : VERRE_MSG.tais); };
  const dis = () => { setLv((x) => Math.max(0.1, +(x - 0.3).toFixed(3))); setMsg(VERRE_MSG.dis); };
  const reset = () => { setLv(0.1); setDrops(0); setMsg(VERRE_MSG.debut); };
  const y = V_BOT - (V_BOT - V_TOP) * Math.min(lv, 0.985);
  return (
    <div className="w-verre">
      <svg viewBox="0 0 160 300" className="w-verre-svg" aria-hidden="true">
        <defs>
          <clipPath id={`c${uid}`}><path d={V_BODY} /></clipPath>
          <linearGradient id={`w${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--accent)", stopOpacity: .55 }} />
            <stop offset="1" style={{ stopColor: "var(--accent)", stopOpacity: .9 }} />
          </linearGradient>
          <linearGradient id={`g${uid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: "var(--ink)", stopOpacity: .1 }} />
            <stop offset=".35" style={{ stopColor: "var(--surface)", stopOpacity: .05 }} />
            <stop offset="1" style={{ stopColor: "var(--ink)", stopOpacity: .14 }} />
          </linearGradient>
        </defs>
        {/* ombre portée, et flaque quand ça déborde */}
        <ellipse cx={V_CX} cy="266" rx="46" ry="6" className="wv-shadow" />
        <ellipse cx={V_CX} cy="268" rx={over ? 74 : 0} ry={over ? 9 : 0} className="wv-puddle" />
        {/* eau : un bloc qui monte, et sa surface en ellipse (plus étroite en bas du verre) */}
        <g clipPath={`url(#c${uid})`}>
          <g className="wv-level" style={{ transform: `translateY(${y}px)` }}>
            <rect x="20" y="0" width="120" height="260" fill={`url(#w${uid})`} />
          </g>
          {/* gouttes qui tombent dans le verre, une par silence */}
          {drops > 0 && !over && <circle key={drops} cx={V_CX + 6} cy="20" r="4" className="wv-drop" style={{ ["--to" as string]: `${y - 20}px` }} />}
        </g>
        <ellipse cx={V_CX} cy="0" rx={V_HW_TOP} ry="5.5" className="wv-surface"
          style={{ transform: `translateY(${y}px) scaleX(${vHw(y) / V_HW_TOP})`, transformOrigin: `${V_CX}px 0px` }} />
        {/* le verre : paroi teintée, reflets, bord et pied */}
        <path d={V_BODY} fill={`url(#g${uid})`} className="wv-glass" />
        <path d={`M${V_CX - V_HW_TOP + 9} ${V_TOP + 14} L${V_CX - V_HW_BOT + 6} ${V_BOT - 18}`} className="wv-shine" />
        <path d={`M${V_CX + V_HW_TOP - 8} ${V_TOP + 22} L${V_CX + V_HW_TOP - 11} ${V_TOP + 70}`} className="wv-shine wv-shine-2" />
        <path d={`M${V_CX - V_HW_BOT} ${V_BOT} Q${V_CX} ${V_BOT + 6} ${V_CX + V_HW_BOT} ${V_BOT} L${V_CX + V_HW_BOT - 2} ${V_BOT + 14} Q${V_CX} ${V_BOT + 20} ${V_CX - V_HW_BOT + 2} ${V_BOT + 14} Z`} className="wv-foot" />
        <ellipse cx={V_CX} cy={V_TOP} rx={V_HW_TOP} ry="5.5" className="wv-rim" />
        {/* repères de niveau */}
        {[0.25, 0.5, 0.75].map((k) => { const ty = V_BOT - (V_BOT - V_TOP) * k; const hx = V_CX + vHw(ty); return <line key={k} x1={hx - 9} y1={ty} x2={hx - 2} y2={ty} className="wv-tick" />; })}
        {/* débordement : l'eau bombe au-dessus du bord et coule des deux côtés */}
        {over && <g className="wv-over">
          <path d={`M${V_CX - V_HW_TOP} ${V_TOP} C${V_CX - V_HW_TOP + 6} ${V_TOP - 22} ${V_CX + V_HW_TOP - 6} ${V_TOP - 22} ${V_CX + V_HW_TOP} ${V_TOP} Z`} className="wv-dome" />
          <path d={`M${V_CX + V_HW_TOP + 1} ${V_TOP + 2} C${V_CX + V_HW_TOP + 8} 120 ${V_CX + V_HW_BOT + 12} 200 ${V_CX + V_HW_BOT + 16} 262`} className="wv-run" />
          <path d={`M${V_CX - V_HW_TOP - 1} ${V_TOP + 2} C${V_CX - V_HW_TOP - 7} 130 ${V_CX - V_HW_BOT - 10} 210 ${V_CX - V_HW_BOT - 14} 262`} className="wv-run wv-run-2" />
        </g>}
      </svg>
      <div className="w-verre-side">
        <p className="w-verre-msg" role="status" aria-live="polite">{msg}</p>
        <div className="w-verre-btns">
          {over ? (
            <button type="button" className="btn btn-soft" onClick={reset}><Icon name="replay" size={20} /><span>Revenir au début</span></button>
          ) : <>
            <button type="button" className="btn btn-ghost" onClick={tais}><span>Je me tais</span></button>
            <button type="button" className="btn btn-primary" onClick={dis} disabled={lv <= 0.1}><Icon name="chat" size={20} /><span>Je dis une petite chose</span></button>
          </>}
        </div>
      </div>
    </div>
  );
}

/** La vague, à mon rythme : je fais passer le temps, l'envie monte, culmine, puis redescend d'elle-même. */
function vagueMsg(t: number) {
  if (t < 1) return "L’envie commence à monter.";
  if (t < 3.8) return "Elle monte. Je respire. J’attends.";
  if (t < 5) return "C’est le pic : le moment le plus difficile.";
  if (t < 10) return "Elle redescend d’elle-même.";
  return "Elle est passée, sans que je lui obéisse.";
}
function VagueJeu() {
  const [t, setT] = useState(0);
  const id = useId();
  const done = `M${wx(0)} ${wy(0)} ` + Array.from({ length: 41 }, (_, i) => { const u = (i / 40) * t; return `L${wx(u).toFixed(1)} ${wy(u).toFixed(1)}`; }).join(" ");
  return (
    <div className="w-vague">
      <svg viewBox="30 30 340 200" className="w-vague-svg" aria-hidden="true">
        <line x1={WX0} y1="40" x2={WX0} y2={WY0} className="sv-axis" /><line x1={WX0} y1={WY0} x2={WX1 + 6} y2={WY0} className="sv-axis" />
        <path d={WAVE} className="wave-ghost" />
        <path d={done} className="wave-line" />
        <circle cx={wx(t)} cy={wy(t)} r="8" className="wave-dot" />
      </svg>
      <p className="w-vague-msg" role="status" aria-live="polite">{vagueMsg(t)}</p>
      <label htmlFor={id} className="w-vague-lab">Le temps passe : {t === 0 ? "maintenant" : `environ ${Math.round(t)} min`}</label>
      <input id={id} type="range" min={0} max={TMAX} step={0.5} value={t} onChange={(e) => setT(+e.target.value)} className="w-vague-range"
        aria-valuetext={`${t === 0 ? "maintenant" : `environ ${Math.round(t)} minutes`} : ${vagueMsg(t)}`} />
    </div>
  );
}

export function Widget({ k, param }: { k: WidgetKey; param?: string }) {
  switch (k) {
    case "verre": return <VerreJeu />;
    case "vague": return <VagueJeu />;
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
