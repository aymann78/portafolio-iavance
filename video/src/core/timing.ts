import meta from '../../public/voice/meta.json';

export const FPS = 30;
export type Word = {w: string; start: number; end: number};
export type SceneId = 'hook' | 'twin' | 'route' | 'https' | 'tips' | 'outro';

const LEAD = 3; // el corte visual llega 3 frames antes que la voz

export const SCENES = meta.scenes.map((s, i) => {
  const from = i === 0 ? 0 : Math.round(s.start * FPS) - LEAD;
  const next = meta.scenes[i + 1];
  const to = next ? Math.round(next.start * FPS) - LEAD : Math.ceil((meta.total + 1.1) * FPS);
  return {id: s.id as SceneId, from, dur: to - from, words: s.words as Word[]};
});

export const TOTAL_FRAMES = SCENES[SCENES.length - 1].from + SCENES[SCENES.length - 1].dur;
export const ALL_WORDS: Word[] = SCENES.flatMap((s) => s.words);

export const scene = (id: SceneId) => SCENES.find((s) => s.id === id)!;

/** Frame (relativo al inicio de la escena) en que empieza la palabra que contiene `match` (n-ésima aparición). */
export const wf = (id: SceneId, match: string, nth = 0): number => {
  const s = scene(id);
  const hits = s.words.filter((w) => w.w.toLowerCase().includes(match.toLowerCase()));
  const w = hits[nth] ?? hits[0];
  if (!w) throw new Error(`palabra "${match}" no encontrada en ${id}`);
  return Math.round(w.start * FPS) - s.from;
};

/** Igual pero en frame absoluto del vídeo. */
export const wfAbs = (id: SceneId, match: string, nth = 0) => scene(id).from + wf(id, match, nth);
