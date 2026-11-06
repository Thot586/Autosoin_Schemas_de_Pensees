// Son de la respiration guidée, fabriqué par le navigateur (Web Audio) : aucun fichier, rien à télécharger,
// fonctionne hors connexion. Le son suit le rythme : il monte pendant l'inspiration et redescend pendant l'expiration.
//   « souffle »  : un bruit doux, comme de l'air, qui s'éclaircit à l'inspiration et s'éteint à l'expiration ;
//   « musique »  : un accord tenu (do, sol, mi), qui enfle à l'inspiration et retombe à l'expiration.
// Le niveau est contrôlé par un test qui calcule le son hors ligne (scripts/e2e.mjs, « son de la respiration »).

export type BreathSound = "aucun" | "souffle" | "musique";

type Ctor = typeof AudioContext;
const AudioCtor = (): Ctor | undefined =>
  typeof window === "undefined" ? undefined : window.AudioContext ?? (window as unknown as { webkitAudioContext?: Ctor }).webkitAudioContext;

/** Vibration au changement de phase : seulement sur un appareil tactile qui la permet (pas l'iPhone). */
export const canVibrate = () =>
  typeof navigator !== "undefined" && typeof navigator.vibrate === "function" && window.matchMedia("(pointer: coarse)").matches;

/** Le son lui-même, sur n'importe quel contexte audio (en direct, ou hors ligne pour le test). Les temps sont en secondes. */
export function buildBreath(ctx: BaseAudioContext, kind: Exclude<BreathSound, "aucun">) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, 0);
  master.connect(ctx.destination);
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.Q.value = 0.7;
  tone.connect(master);
  const sources: AudioScheduledSourceNode[] = [];

  if (kind === "souffle") {
    // bruit « rose » (plus doux que le bruit blanc), en boucle de 2 secondes
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + w * 0.099046;
      b1 = 0.963 * b1 + w * 0.2965164;
      b2 = 0.57 * b2 + w * 1.0526913;
      d[i] = (b0 + b1 + b2 + w * 0.1848) * 0.11;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    src.connect(tone);
    sources.push(src);
    tone.frequency.setValueAtTime(320, 0);
  } else {
    // nappe douce : trois notes tenues, légèrement désaccordées pour un son vivant
    for (const [f, type, level] of [[130.81, "triangle", 0.5], [196.0, "sine", 0.45], [329.63, "sine", 0.22]] as const) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = Math.random() * 6 - 3;
      const g = ctx.createGain();
      g.gain.value = level;
      o.connect(g);
      g.connect(tone);
      sources.push(o);
    }
    tone.frequency.setValueAtTime(900, 0);
  }
  for (const s of sources) s.start();

  const peak = kind === "souffle" ? 0.4 : 0.16;
  const floor = kind === "souffle" ? 0.03 : 0.025;
  return {
    /** Inspiration : le son monte pendant `sec` secondes à partir de `at` (il part du niveau atteint juste avant). */
    inhaleAt(at: number, sec: number) {
      master.gain.linearRampToValueAtTime(peak, at + sec);
      if (kind === "souffle") tone.frequency.linearRampToValueAtTime(1500, at + sec);
    },
    /** Expiration : le son redescend pendant `sec` secondes. */
    exhaleAt(at: number, sec: number) {
      master.gain.linearRampToValueAtTime(floor, at + sec);
      if (kind === "souffle") tone.frequency.linearRampToValueAtTime(300, at + sec);
    },
    /** Fondu jusqu'au silence (sans clic), puis arrêt des sources. */
    fadeOut(at: number) {
      master.gain.cancelScheduledValues(at);
      master.gain.setValueAtTime(master.gain.value, at);
      master.gain.linearRampToValueAtTime(0, at + 0.4);
      for (const s of sources) s.stop(at + 0.45);
    },
  };
}

export interface BreathAudio { inhale(sec: number): void; exhale(sec: number): void; stop(): void }

/** À appeler dans un geste de la personne (un clic) : les navigateurs bloquent le son sinon. */
export function createBreathAudio(kind: Exclude<BreathSound, "aucun">): BreathAudio | null {
  const Ctx = AudioCtor();
  if (!Ctx) return null;
  const ctx = new Ctx();
  const b = buildBreath(ctx, kind);   // il part du silence (niveau 0 au temps 0)
  let stopped = false;
  return {
    inhale(sec) { if (stopped) return; void ctx.resume(); b.inhaleAt(ctx.currentTime, sec); },
    exhale(sec) { if (stopped) return; b.exhaleAt(ctx.currentTime, sec); },
    stop() {
      if (stopped) return;
      stopped = true;
      b.fadeOut(ctx.currentTime);
      window.setTimeout(() => { void ctx.close(); }, 600);
    },
  };
}
