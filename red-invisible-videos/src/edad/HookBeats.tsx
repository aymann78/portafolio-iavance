import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {shake} from '../components/Fx';
import {C, FONT_TITLE, FONT_UI} from '../theme';

/** Mini pantalla para el abanico: cabecera + cuadrícula de puntos (el primero verde). */
const MiniCard: React.FC<{n: number}> = ({n}) => (
	<div
		style={{
			width: 230,
			height: 320,
			borderRadius: 28,
			background: 'linear-gradient(180deg, #2a2070 0%, #17113f 100%)',
			border: `4px solid ${C.purple}`,
			boxShadow: '0 20px 40px #0008',
			padding: '20px 22px',
			boxSizing: 'border-box',
			display: 'flex',
			flexDirection: 'column',
			gap: 14,
		}}
	>
		<div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, color: C.muted, textAlign: 'center'}}>{n}/6</div>
		<div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7}}>
			{Array.from({length: 32}, (_, i) => (
				<div
					key={i}
					style={{
						height: 22,
						borderRadius: 6,
						background: i === 0 ? C.green : '#3a2d80',
						boxShadow: i === 0 ? `0 0 10px ${C.green}` : 'none',
					}}
				/>
			))}
		</div>
	</div>
);

/** Corte 2 — "Solo mira seis pantallas": 6 cartas repartidas en abanico. */
export const DeckBeat: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const landed = Math.min(6, Math.max(0, Math.floor((frame - 2) / 3) + 1));
	const exit = interpolate(frame, [durationInFrames - 8, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});
	const countPop = spring({frame: frame - (2 + (landed - 1) * 3), fps, config: {damping: 9, stiffness: 300}});

	return (
		<AbsoluteFill style={{transform: shake(frame, 2 + 5 * 3 + 4, 10, 8)}}>
			<div
				style={{
					position: 'absolute',
					top: 205,
					left: 60,
					width: 880,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'baseline',
					gap: 26,
					fontFamily: FONT_TITLE,
					textTransform: 'uppercase',
					opacity: 1 - exit,
				}}
			>
				<span
					style={{
						fontSize: 230,
						lineHeight: 1,
						color: C.green,
						WebkitTextStroke: '14px #08061a',
						paintOrder: 'stroke fill',
						textShadow: `0 0 50px ${C.green}88`,
						display: 'inline-block',
						transform: `scale(${interpolate(countPop, [0, 1], [1.35, 1])})`,
					}}
				>
					{Math.max(1, landed)}
				</span>
				<span style={{fontSize: 120, color: C.white, WebkitTextStroke: '12px #08061a', paintOrder: 'stroke fill'}}>
					{landed > 1 ? 'pantallas' : 'pantalla'}
				</span>
			</div>

			{Array.from({length: 6}, (_, i) => {
				const at = 2 + i * 3;
				const s = spring({frame: frame - at, fps, config: {damping: 14, stiffness: 190, mass: 0.7}});
				const fx = (i - 2.5) * 118;
				const fy = Math.pow(Math.abs(i - 2.5), 2) * 14;
				const fr = (i - 2.5) * 11;
				const x = 540 + interpolate(s, [0, 1], [0, fx]);
				const y = 830 + interpolate(s, [0, 1], [1300, fy]);
				const rot = interpolate(s, [0, 1], [-40 + i * 8, fr]);
				// salida: todas vuelan hacia la cámara
				const sc = interpolate(s, [0, 1], [0.6, 1]) * (1 + exit * 1.8);
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: x,
							top: y,
							transform: `translate(-50%, -50%) rotate(${rot * (1 - exit)}deg) scale(${sc})`,
							opacity: frame < at ? 0 : 1 - exit,
							filter: `blur(${exit * 14}px)`,
						}}
					>
						<MiniCard n={i + 1} />
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** Corte 3 — "Si sales, apunta el número verde": zoom a la casilla verde, rodeada a mano. */
export const GreenTileBeat: React.FC<{durationInFrames: number}> = ({durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const slam = spring({frame, fps, config: {damping: 11, stiffness: 240}});
	const zoom = interpolate(frame, [0, durationInFrames], [1, 1.08]);
	const draw = interpolate(frame, [8, 22], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
	const label = spring({frame: frame - 18, fps, config: {damping: 9, stiffness: 260}});
	const glow = 0.5 + 0.5 * Math.sin(frame * 0.35);
	const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	const CELL = 300;
	const GAP = 30;
	const X0 = 180;
	const Y0 = 560;
	const grid = [
		[1, 3, 5],
		[9, 11, 13],
	];
	const PER = 2 * Math.PI * 225; // perímetro aproximado del círculo dibujado

	return (
		<AbsoluteFill style={{transform: `${shake(frame, 1, 22, 10)} scale(${zoom})`, transformOrigin: '30% 37%', opacity: 1 - exit, filter: `blur(${exit * 10}px)`}}>
			{grid.map((row, r) =>
				row.map((n, c) => {
					const isKey = r === 0 && c === 0;
					const x = X0 + c * (CELL + GAP);
					const y = Y0 + r * (CELL + GAP);
					return (
						<div
							key={n}
							style={{
								position: 'absolute',
								left: x,
								top: y,
								width: CELL,
								height: CELL,
								borderRadius: 60,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: FONT_UI,
								fontWeight: 800,
								fontSize: 170,
								color: isKey ? C.green : '#ffffff55',
								background: isKey ? `linear-gradient(180deg, #23664c 0%, ${C.greenDeep} 100%)` : '#261d5a88',
								border: isKey ? `8px solid ${C.green}` : `3px solid ${C.cellBorder}`,
								boxShadow: isKey ? `0 0 ${50 + 50 * glow}px ${C.green}` : 'none',
								filter: isKey ? 'none' : 'blur(3px)',
								transform: isKey ? `scale(${interpolate(slam, [0, 1], [1.9, 1])})` : 'none',
								zIndex: isKey ? 2 : 1,
							}}
						>
							{n}
						</div>
					);
				}),
			)}

			{/* círculo hecho "a mano" */}
			<svg width={1080} height={1920} style={{position: 'absolute', inset: 0, zIndex: 3}}>
				<path
					d={`M ${X0 + 150 + 235} ${Y0 + 150 - 20}
					    C ${X0 + 150 + 250} ${Y0 + 150 - 200}, ${X0 + 150 - 120} ${Y0 + 150 - 250}, ${X0 + 150 - 215} ${Y0 + 150 - 60}
					    C ${X0 + 150 - 290} ${Y0 + 150 + 110}, ${X0 + 150 - 60} ${Y0 + 150 + 260}, ${X0 + 150 + 140} ${Y0 + 150 + 190}
					    C ${X0 + 150 + 270} ${Y0 + 150 + 140}, ${X0 + 150 + 275} ${Y0 + 150 - 40}, ${X0 + 150 + 180} ${Y0 + 150 - 150}`}
					fill="none"
					stroke={C.pink}
					strokeWidth={14}
					strokeLinecap="round"
					strokeDasharray={PER}
					strokeDashoffset={PER * (1 - draw)}
					style={{filter: `drop-shadow(0 0 12px ${C.pink})`}}
				/>
			</svg>

			<div
				style={{
					position: 'absolute',
					top: 250,
					left: 60,
					width: 880,
					textAlign: 'center',
					fontFamily: FONT_TITLE,
					fontSize: 160,
					lineHeight: 1,
					color: C.pink,
					WebkitTextStroke: '14px #08061a',
					paintOrder: 'stroke fill',
					textShadow: `0 0 40px ${C.pink}88`,
					transform: `scale(${frame >= 18 ? interpolate(label, [0, 1], [0.3, 1]) : 0}) rotate(-4deg)`,
					zIndex: 4,
				}}
			>
				¡APÚNTALO!
			</div>
		</AbsoluteFill>
	);
};
