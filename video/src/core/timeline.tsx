import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {FontGate} from './fonts';
import {Captions, Flash} from './overlay';

export type Word = {w: string; start: number; end: number};
export type Meta = {total: number; scenes: {id: string; start: number; end: number; words: Word[]}[]};

const norm = (s: string) => s.toLowerCase().replace(/[«»"“”.,:;¿?¡!…]/g, '');

export const makeTimeline = (meta: Meta, fps = 30, lead = 3, tail = 1.2) => {
  const scenes = meta.scenes.map((s, i) => {
    const from = i === 0 ? 0 : Math.round(s.start * fps) - lead;
    const next = meta.scenes[i + 1];
    const to = next ? Math.round(next.start * fps) - lead : Math.ceil((meta.total + tail) * fps);
    return {id: s.id, from, dur: to - from, words: s.words};
  });
  const sc = (id: string) => {
    const s = scenes.find((x) => x.id === id);
    if (!s) throw new Error(`escena ${id} no existe`);
    return s;
  };
  /** frame relativo a la escena en que empieza la palabra (coincidencia exacta; si no, parcial) */
  const wf = (id: string, match: string, nth = 0) => {
    const s = sc(id);
    const m = norm(match);
    let hits = s.words.filter((w) => norm(w.w) === m);
    if (!hits.length) hits = s.words.filter((w) => norm(w.w).includes(m));
    const w = hits[nth] ?? hits[hits.length - 1];
    if (!w) throw new Error(`palabra "${match}" no encontrada en ${id}`);
    return Math.round(w.start * fps) - s.from;
  };
  const wfAbs = (id: string, match: string, nth = 0) => sc(id).from + wf(id, match, nth);
  const total = scenes[scenes.length - 1].from + scenes[scenes.length - 1].dur;
  return {scenes, sc, wf, wfAbs, total, words: scenes.flatMap((s) => s.words), fps};
};
export type Timeline = ReturnType<typeof makeTimeline>;

const Ctx = createContext<Timeline | null>(null);
export const useTL = () => {
  const t = useContext(Ctx);
  if (!t) throw new Error('sin timeline');
  return t;
};

export type Sfx = [string, number, number];

/** Montaje genérico: escenas + flash + subtítulos + voz + efectos. */
export const ShortShell: React.FC<{
  tl: Timeline;
  voice: string;
  scenes: Record<string, React.FC>;
  flash: Record<string, string>;
  sfx: Sfx[];
  keywords: RegExp;
  accent?: string;
}> = ({tl, voice, scenes, flash, sfx, keywords, accent = '#22e3a6'}) => (
  <Ctx.Provider value={tl}>
    <FontGate>
      <AbsoluteFill style={{background: '#000'}}>
        {tl.scenes.map((s) => {
          const C = scenes[s.id];
          return (
            <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
              <C />
              <Flash color={flash[s.id] ?? '#bcd4ff'} />
            </Sequence>
          );
        })}
        <Captions words={tl.words} keywords={keywords} accent={accent} />
        <Audio src={staticFile(voice)} />
        {sfx.map(([name, frame, vol], i) => (
          <Sequence key={i} from={Math.max(0, frame)} name={`sfx-${name}`}>
            <Audio src={staticFile(`sfx/${name}.mp3`)} volume={vol} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </FontGate>
  </Ctx.Provider>
);
