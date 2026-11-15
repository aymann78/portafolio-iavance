import React from 'react';
import {Composition, staticFile} from 'remotion';
import script from '../script.json';
import {Short, type SceneData, type ShortProps} from './Short';

export const FPS = 30;
const PAD = 0.35; // pausa tras cada escena (s)

const estimate = (text: string, est: number) => est;

export const Root: React.FC = () => (
  <Composition
    id="Short01"
    component={Short}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={FPS * 40}
    defaultProps={{scenes: []} as ShortProps}
    calculateMetadata={async () => {
      let meta: any[] = [];
      try {
        const r = await fetch(staticFile('voice/meta.json'));
        if (r.ok) meta = await r.json();
      } catch {}
      const scenes: SceneData[] = script.scenes.map((s) => {
        const m = meta.find((x) => x.id === s.id);
        const secs = m ? m.duration + PAD : estimate(s.text, s.est);
        return {
          id: s.id,
          text: s.text,
          frames: Math.round(secs * FPS),
          audio: m?.audio,
          words: m?.words,
        };
      });
      return {
        durationInFrames: scenes.reduce((a, s) => a + s.frames, 0),
        props: {scenes},
      };
    }}
  />
);
