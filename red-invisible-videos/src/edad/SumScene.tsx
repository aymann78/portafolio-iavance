import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Mascot, Pedestal} from '../components/Mascot';
import {Stage3D} from '../components/Stage3D';
import {C, FONT_TITLE, FONT_UI} from '../theme';

const POW = [1, 2, 4, 8, 16, 32];

/**
 * "Ahora suma los números verdes que has apuntado… Esa es tu edad."
 * Tres fichas verdes que van cambiando de valor (cada espectador tiene los suyos)
 * y un gran "= TU EDAD" cuando llega la revelación.
 */
export const SumScene: React.FC<{revealAt: number; durationInFrames: number}> = ({revealAt, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const revealF = revealAt * fps;
	const revealed = frame >= revealF;
	const reveal = spring({frame: frame - revealF, fps, config: {damping: 10, stiffness: 180}});
	const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const chips = [0, 1, 2].map((i) => {
		const pop = spring({frame: frame - 3 - i * 6, fps, config: {damping: 12, stiffness: 220}});
		// cambian de valor cada 5 fotogramas, desfasadas
		const v = POW[(Math.floor((frame + i * 7) / 5) + i * 2) % POW.length];
		return {pop, v};
	});

	// mascota: pensando -> celebrando
	const celebrate = revealed ? reveal : 0;
	const jump = revealed ? Math.abs(Math.sin(((frame - revealF) / fps) * Math.PI * 2.2)) * 0.25 * Math.max(0, 1 - (frame - revealF) / (fps * 1.6)) : 0;

	return (
		<AbsoluteFill style={{opacity: exit}}>
			<Stage3D>
				<group scale={0.55} position={[0, 0.88, 0]}>
					<Pedestal position={[0, 0, 0]} color={revealed ? '#6ef0aa' : '#7b4dff'} />
					<Mascot
						pose={{
							armL: interpolate(celebrate, [0, 1], [0.3, 2.7]),
							armR: interpolate(celebrate, [0, 1], [2.75, 2.7]),
							armRFwd: interpolate(celebrate, [0, 1], [0.95, 0]),
							headTilt: interpolate(celebrate, [0, 1], [0.12 + 0.04 * Math.sin(t * 4), 0]),
							bob: jump,
							squash: 1 + (revealed ? 0.06 * Math.sin((frame - revealF) * 0.9) * Math.max(0, 1 - (frame - revealF) / 20) : 0),
						}}
					/>
				</group>
			</Stage3D>

			<div
				style={{
					position: 'absolute',
					top: 235,
					left: 60,
					width: 880,
					textAlign: 'center',
					fontFamily: FONT_UI,
					fontWeight: 800,
					fontSize: 42,
					letterSpacing: 5,
					color: C.muted,
				}}
			>
				TUS NÚMEROS VERDES
			</div>

			<div style={{position: 'absolute', top: 300, left: 60, width: 880, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 22}}>
				{chips.map((c, i) => (
					<React.Fragment key={i}>
						{i > 0 && (
							<span style={{fontFamily: FONT_TITLE, fontSize: 110, color: C.white, opacity: c.pop}}>+</span>
						)}
						<div
							style={{
								width: 200,
								height: 200,
								borderRadius: 40,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FONT_UI,
								fontWeight: 800,
								fontSize: 100,
								color: C.green,
								background: `linear-gradient(180deg, #23664c 0%, ${C.greenDeep} 100%)`,
								border: `5px solid ${C.green}`,
								boxShadow: `0 0 40px ${C.green}88`,
								transform: `scale(${c.pop}) rotate(${interpolate(c.pop, [0, 1], [-12, 0])}deg)`,
							}}
						>
							{c.v}
						</div>
					</React.Fragment>
				))}
			</div>

			<div
				style={{
					position: 'absolute',
					top: 545,
					left: 60,
					width: 880,
					textAlign: 'center',
					fontFamily: FONT_TITLE,
					fontSize: 175,
					lineHeight: 1,
					textTransform: 'uppercase',
					color: revealed ? C.green : C.white,
					WebkitTextStroke: '14px #08061a',
					paintOrder: 'stroke fill',
					textShadow: revealed ? `0 0 ${60 * reveal}px ${C.green}` : 'none',
					transform: `scale(${revealed ? interpolate(reveal, [0, 1], [0.4, 1]) : 1})`,
					opacity: revealed ? 1 : interpolate(frame, [18, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			>
				{revealed ? '= tu edad' : '= ?'}
			</div>
		</AbsoluteFill>
	);
};
