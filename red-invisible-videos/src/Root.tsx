import React from 'react';
import {Composition} from 'remotion';
import {EdadShort} from './edad/EdadShort';
import {DURATION_S, FPS} from './edad/script';
import {H, W} from './theme';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="EdadShort"
			component={EdadShort}
			durationInFrames={Math.round(DURATION_S * FPS)}
			fps={FPS}
			width={W}
			height={H}
			defaultProps={{voice: false}}
		/>
	</>
);
