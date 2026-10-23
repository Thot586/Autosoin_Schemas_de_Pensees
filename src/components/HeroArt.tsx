import { BASES } from "../data/bases";
import { schemasOfBase } from "../data/schemas";
import { Link } from "../lib/router";

/** Constellation : cinq besoins (disques colorés) et leurs quinze schémas (petits points). */
export function HeroArt({ interactive = false }: { interactive?: boolean }) {
  const cx = 210, cy = 210, R = 122;
  const nodes = BASES.map((b, i) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    const x = cx + R * Math.cos(a), y = cy + R * Math.sin(a);
    const list = schemasOfBase(b.id);
    const dots = list.map((s, k) => {
      const spread = (k - (list.length - 1) / 2) * 0.42;
      const d = 62;
      return { s, x: x + d * Math.cos(a + spread), y: y + d * Math.sin(a + spread) };
    });
    return { b, x, y, dots, i };
  });
  return (
    <svg className="heroart" viewBox="0 0 420 420" role="img" aria-label="Cinq besoins fondamentaux, reliés à quinze schémas">
      <defs>
        <radialGradient id="ha-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="var(--brand)" stopOpacity=".22" /><stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="190" fill="url(#ha-glow)" className="ha-glow" />
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--edge)" strokeDasharray="2 8" strokeLinecap="round" />
      {nodes.map((n) => <line key={n.b.id} x1={cx} y1={cy} x2={n.x} y2={n.y} stroke="var(--edge-strong)" strokeWidth="1.5" />)}
      {nodes.map((n) => n.dots.map((d) => <line key={d.s.slug} x1={n.x} y1={n.y} x2={d.x} y2={d.y} stroke={`var(--b${n.b.id})`} strokeOpacity=".4" strokeWidth="1.2" />))}
      <g className="ha-center">
        <circle cx={cx} cy={cy} r="40" fill="var(--surface)" stroke="var(--edge-strong)" strokeWidth="1.5" />
        <text x={cx} y={cy + 6} textAnchor="middle" className="ha-txt-center">Moi</text>
      </g>
      {nodes.map((n) => {
        const node = (
          <g className="ha-node" style={{ "--i": n.i } as React.CSSProperties}>
            <circle cx={n.x} cy={n.y} r="30" fill={`var(--b${n.b.id})`} />
            <text x={n.x} y={n.y + 8} textAnchor="middle" className="ha-txt-num">{n.b.id}</text>
          </g>
        );
        return interactive ? <Link key={n.b.id} to={`/besoins/${n.b.slug}`} aria-label={`Base ${n.b.id} : ${n.b.name}`}>{node}</Link> : <g key={n.b.id}>{node}</g>;
      })}
      {nodes.map((n) => n.dots.map((d, k) => (
        <circle key={d.s.slug} className="ha-dot" cx={d.x} cy={d.y} r="8.5" fill="var(--surface)" stroke={`var(--b${n.b.id})`} strokeWidth="3" style={{ "--i": n.i * 3 + k } as React.CSSProperties} />
      )))}
    </svg>
  );
}
