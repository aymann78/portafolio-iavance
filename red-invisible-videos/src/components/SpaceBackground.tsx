import React, {useMemo} from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {C, H, W} from '../theme';

const STAR_COUNT = 140;

/**
 * Fondo espacial morado con estrellas que parpadean y derivan muy despacio.
 * Es periódico: el movimiento se repite cada `loopFrames`, para que el bucle
 * del Short no tenga salto.
 */
export const SpaceBackground: React.FC<{loopFrames: number}> = ({loopFrames}) => {
	const frame = useCurrentFrame();
	const phase = (frame % loopFrames) / loopFrames; // 0..1

	const stars = useMemo(
		() =>
			Array.from({length: STAR_COUNT}, (_, i) => ({
				x: random(`x${i}`) * W,
				y: random(`y${i}`) * H,
				r: 1 + random(`r${i}`) * 2.6,
				tw: Math.floor(1 + random(`t${i}`) * 3), // ciclos de parpadeo por bucle
				off: random(`o${i}`) * Math.PI * 2,
				drift: 10 + random(`d${i}`) * 30,
			})),
		[],
	);

	return (
		<AbsoluteFill style={{backgroundColor: C.bgDeep}}>
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 90% 55% at 50% 42%, #2a1670 0%, #160d42 45%, ${C.bgDeep} 100%)`,
				}}
			/>
			<svg width={W} height={H} style={{position: 'absolute'}}>
				{stars.map((s, i) => {
					const a = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2 * s.tw + s.off));
					const dy = Math.sin(phase * Math.PI * 2 + s.off) * s.drift * 0.3;
					return <circle key={i} cx={s.x} cy={s.y + dy} r={s.r} fill="#ffffff" opacity={a * 0.8} />;
				})}
			</svg>
			{/* viñeta */}
			<AbsoluteFill
				style={{
					background: 'radial-gradient(ellipse 75% 60% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)',
				}}
			/>
		</AbsoluteFill>
	);
};
