import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_TITLE, FONT_UI} from '../theme';
import {EXAMPLE_AGE} from './script';

const VALUES = [32, 16, 8, 4, 2, 1];

/**
 * "No es magia: es binario. Así cuenta tu ordenador."
 * Seis bombillas (32 16 8 4 2 1) que se encienden para formar la edad de ejemplo.
 */
export const BinaryScene: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const bits = VALUES.map((v) => (EXAMPLE_AGE & v ? 1 : 0));
	const on = VALUES.filter((v) => EXAMPLE_AGE & v);

	const enter = spring({frame, fps, config: {damping: 15, stiffness: 160}});
	const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const sumAt = 8 + 6 * 6 + 4;
	const sumPop = spring({frame: frame - sumAt, fps, config: {damping: 10, stiffness: 200}});
	const chipAt = sumAt + 22;
	const chipPop = spring({frame: frame - chipAt, fps, config: {damping: 12, stiffness: 200}});

	return (
		<AbsoluteFill style={{opacity: exit, transform: `scale(${interpolate(enter, [0, 1], [1.08, 1])})`}}>
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
					opacity: enter,
				}}
			>
				EJEMPLO: {EXAMPLE_AGE} AÑOS
			</div>

			<div style={{position: 'absolute', top: 320, left: 85, width: 830, display: 'flex', justifyContent: 'space-between'}}>
				{VALUES.map((v, i) => {
					const litAt = 8 + i * 6;
					const lit = bits[i] === 1 && frame >= litAt;
					const shown = spring({frame: frame - litAt, fps, config: {damping: 12, stiffness: 240}});
					const flash = lit ? Math.max(0, 1 - (frame - litAt) / 10) : 0;
					return (
						<div key={v} style={{width: 124, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22}}>
							<div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 42, color: lit ? C.green : C.muted}}>{v}</div>
							<div
								style={{
									width: 112,
									height: 112,
									borderRadius: 56,
									background: lit
										? `radial-gradient(circle at 40% 35%, #d9ffe9 0%, ${C.green} 45%, #1f8f5c 100%)`
										: 'radial-gradient(circle at 40% 35%, #3a2d80 0%, #1a1440 100%)',
									border: `4px solid ${lit ? C.green : C.cellBorder}`,
									boxShadow: lit ? `0 0 ${40 + 60 * flash}px ${C.green}` : 'inset 0 -8px 0 #0a0720',
									transform: `scale(${frame >= litAt ? interpolate(shown, [0, 1], [0.85, 1]) + flash * 0.15 : 0.85})`,
								}}
							/>
							<div
								style={{
									fontFamily: FONT_TITLE,
									fontSize: 120,
									lineHeight: 1,
									color: bits[i] ? C.green : C.white,
									opacity: frame >= litAt ? interpolate(shown, [0, 1], [0, 1]) : 0,
									transform: `translateY(${frame >= litAt ? interpolate(shown, [0, 1], [30, 0]) : 30}px)`,
									WebkitTextStroke: '10px #08061a',
									paintOrder: 'stroke fill',
								}}
							>
								{bits[i]}
							</div>
						</div>
					);
				})}
			</div>

			<div
				style={{
					position: 'absolute',
					top: 760,
					left: 60,
					width: 880,
					textAlign: 'center',
					fontFamily: FONT_TITLE,
					fontSize: 112,
					color: C.white,
					WebkitTextStroke: '12px #08061a',
					paintOrder: 'stroke fill',
					opacity: frame >= sumAt ? sumPop : 0,
					transform: `scale(${frame >= sumAt ? interpolate(sumPop, [0, 1], [0.6, 1]) : 0.6})`,
				}}
			>
				{on.join(' + ')} = <span style={{color: C.green, textShadow: `0 0 40px ${C.green}`}}>{EXAMPLE_AGE}</span>
			</div>

			<div
				style={{
					position: 'absolute',
					top: 945,
					left: 60,
					width: 880,
					display: 'flex',
					justifyContent: 'center',
					opacity: frame >= chipAt ? chipPop : 0,
					transform: `translateY(${frame >= chipAt ? interpolate(chipPop, [0, 1], [30, 0]) : 30}px)`,
				}}
			>
				<div
					style={{
						fontFamily: FONT_UI,
						fontWeight: 800,
						fontSize: 40,
						color: C.white,
						padding: '16px 32px',
						borderRadius: 999,
						background: '#ffffff12',
						border: `2px solid ${C.cellBorder}`,
						letterSpacing: 2,
					}}
				>
					cada pantalla = un <span style={{color: C.green}}>1</span> o un <span style={{color: C.muted}}>0</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};
