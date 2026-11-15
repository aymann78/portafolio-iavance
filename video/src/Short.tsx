import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {Scene3D} from './scenes';
import {Captions} from './Captions';

export type Word = {w: string; start: number; end: number};
export type SceneData = {id: string; text: string; frames: number; audio?: string; words?: Word[]};
export type ShortProps = {scenes: SceneData[]};

const BG: Record<string, [string, string]> = {
  hook: ['#0b1020', '#1b2a6b'],
  twin: ['#0d1b1e', '#0f4c5c'],
  route: ['#1a0d12', '#5c1a2b'],
  https: ['#0c1a12', '#14532d'],
  tips: ['#14102a', '#4c2a85'],
  outro: ['#0b1020', '#1b2a6b'],
};

export const Short: React.FC<ShortProps> = ({scenes}) => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s) => {
        const start = from;
        from += s.frames;
        return (
          <Sequence key={s.id} from={start} durationInFrames={s.frames}>
            <SceneFrame scene={s} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const SceneFrame: React.FC<{scene: SceneData}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [a, b] = BG[scene.id] ?? BG.hook;
  const fadeIn = interpolate(frame, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 80% at 50% 30%, ${b}, ${a})`, opacity: fadeIn}}>
      {scene.audio ? <Audio src={staticFile(scene.audio)} /> : null}
      <Scene3D id={scene.id} frames={scene.frames} />
      <Captions text={scene.text} words={scene.words} frames={scene.frames} fps={fps} />
    </AbsoluteFill>
  );
};
