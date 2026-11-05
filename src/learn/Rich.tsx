import { Fragment, type ReactNode } from "react";
import { Term } from "../components/ui";

/** Rend le balisage minimal : [[id|mot]] (mot du glossaire) et **gras**. */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[\[([^|\]]+)\|([^\]]+)\]\]|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(<Fragment key={k++}>{text.slice(last, m.index)}</Fragment>);
    if (m[1]) out.push(<Term key={k++} id={m[1]}>{m[2]}</Term>);
    else out.push(<b key={k++}>{m[3]}</b>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={k++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}
