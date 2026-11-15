import React from 'react';
import {Composition} from 'remotion';
import {Short} from './Short';
import {FPS, TOTAL_FRAMES} from './core/timing';

export const Root: React.FC = () => (
  <Composition id="Short01" component={Short} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />
);
