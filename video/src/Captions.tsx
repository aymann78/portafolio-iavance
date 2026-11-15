import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import type {Word} from './Short';

// Subtítulos por bloques de pocas palabras; la palabra activa se resalta.
export const Captions: React.FC<{text: string; words?: Word[]; frames: number; fps: number}> = ({text, words, frames, fps}) => {
  const frame = useCurrentFrame();
  const t = frame / fps;
  const list: Word[] =
    words ??
    (() => {
      const ws = text.split(/\s+/);
      const total = (frames / fps) * 0.92;
      return ws.map((w, i) => ({w, start: (i / ws.length) * total, end: ((i + 1) / ws.length) * total}));
    })();

  const CHUNK = 4;
  let active = list.findIndex((w) => t >= w.start && t <= w.end + 0.15);
  if (active < 0) active = Math.max(0, list.findIndex((w) => w.start > t) - 1);
  if (active < 0) active = list.length - 1;
  const chunkStart = Math.floor(active / CHUNK) * CHUNK;
  const chunk = list.slice(chunkStart, chunkStart + CHUNK);

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 330}}>
      <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 22px', maxWidth: 960, padding: '0 40px'}}>
        {chunk.map((w, i) => {
          const on = chunkStart + i === active;
          return (
            <span
              key={chunkStart + i}
              style={{
                fontFamily: 'Inter, "Helvetica Neue", Arial, sans-serif',
                fontWeight: 900,
                fontSize: 96,
                lineHeight: 1.15,
                color: on ? '#ffe14a' : '#ffffff',
                transform: `scale(${on ? 1.08 : 1})`,
                textShadow: '0 6px 0 rgba(0,0,0,.55), 0 0 30px rgba(0,0,0,.6)',
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
