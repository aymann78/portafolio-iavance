import React from 'react';
import {Composition} from 'remotion';
import {Short} from './Short';
import {FPS, TOTAL_FRAMES} from './core/timing';
import {Logo} from './Logos';
import {Avatar, Banner} from './Brand';

export const Root: React.FC = () => (
  <>
    <Composition id="Short01" component={Short} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />
    {(['A', 'B', 'C'] as const).map((v) => (
      <Composition key={v} id={`Logo${v}`} component={Logo} defaultProps={{v}} width={1080} height={1920} fps={30} durationInFrames={1} />
    ))}
    <Composition id="Avatar" component={Avatar} width={2400} height={2400} fps={30} durationInFrames={1} />
    <Composition id="Banner" component={Banner} width={2560} height={1440} fps={30} durationInFrames={1} />
  </>
);
