import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_TITLE, FONT_UI} from '../theme';
import {CARDS} from './script';

/** Cada pantalla tiene su color: rompe la monotonía y ayuda a saber en cuál estás. */
export const PALETTES = [
	{name: 'violeta', cell: '#30246e', cellDeep: '#221a55', border: '#4a3aa0', glow: '#6a4dff'},
	{name: 'azul', cell: '#1f3a8a', cellDeep: '#162a66', border: '#3557c0', glow: '#3d7bff'},
	{name: 'turquesa', cell: '#0f5363', cellDeep: '#0b3c48', border: '#1d7f96', glow: '#19c3e6'},
	{name: 'magenta', cell: '#5e1f63', cellDeep: '#47164b', border: '#8e2f95', glow: '#e04df0'},
	{name: 'naranja', cell: '#6b3a12', cellDeep: '#522b0c', border: '#a3591f', glow: '#ff8a2a'},
	{name: 'rojo', cell: '#6b1a30', cellDeep: '#521324', border: '#a32a4a', glow: '#ff4d6d'},
];

const VALUES = [1, 2, 4, 8, 16, 32];

/** Marcador de progreso: seis píldoras +1 +2 +4 +8 +16 +32; la actual se ilumina. */
const Tally: React.FC<{index: number; p: number}> = ({index, p}) => (
	<div style={{position: 'absolute', top: 236, left: 70, width: 860, display: 'flex', gap: 10}}>
		{VALUES.map((v, i) => {
			const current = i === index;
			const done = i < index;
			return (
				<div
					key={v}
					style={{
						flex: 1,
						height: 46,
						borderRadius: 23,
						position: 'relative',
						overflow: 'hidden',
						background: current ? '#ffffff1f' : done ? '#ffffff14' : '#ffffff0a',
						border: `2px solid ${current ? C.green : done ? '#ffffff30' : '#ffffff18'}`,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontFamily: FONT_UI,
						fontWeight: 800,
						fontSize: 26,
						color: current ? C.white : done ? '#ffffff88' : '#ffffff44',
					}}
				>
					{current ? (
						<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: `${C.green}55`}} />
					) : null}
					<span style={{position: 'relative'}}>+{v}</span>
				</div>
			);
		})}
	</div>
);

/**
 * Una de las 6 pantallas.
 * - Entra rápido desde una dirección distinta cada vez (desenfoque corto).
 * - Los 32 números son legibles en ~0,3 s.
 * - Cabecera con la instrucción en grande: "¿SALE TU EDAD?  +N".
 * - Barrido de luz al entrar, onda a mitad y zoom lento continuo.
 */
export const CardScene: React.FC<{index: number; durationInFrames: number}> = ({index, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const nums = CARDS[index];
	const key = nums[0];
	const pal = PALETTES[index];

	const enter = spring({frame, fps, config: {damping: 17, stiffness: 320, mass: 0.6}});
	const exitP = interpolate(frame, [durationInFrames - 5, durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});
	const DIRS = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[1, 0],
		[-1, 0],
		[0, -1],
	];
	const [dx, dy] = DIRS[index];
	const [ex, ey] = DIRS[(index + 1) % 6];
	const x = dx * interpolate(enter, [0, 1], [700, 0]) - ex * interpolate(exitP, [0, 1], [0, 1100]);
	const y = dy * interpolate(enter, [0, 1], [1000, 0]) - ey * interpolate(exitP, [0, 1], [0, 1600]);
	const rotY = dx * interpolate(enter, [0, 1], [-22, 0]);
	const rotX = dy * interpolate(enter, [0, 1], [18, 0]);
	const blur = (1 - enter) * 10 + exitP * 14;
	const zoom = interpolate(frame, [0, durationInFrames], [0.99, 1.03]);
	const sweep = interpolate(frame, [4, 18], [-0.3, 1.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	const WAVE_AT = Math.round(durationInFrames * 0.5);
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp'});

	const keyGlow = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * 1.4);
	const chipPop = spring({frame: frame - 3, fps, config: {damping: 9, stiffness: 260}});

	return (
		<AbsoluteFill>
			{/* halo del color de la pantalla */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse 70% 45% at 50% 50%, ${pal.glow}40 0%, transparent 70%)`,
					opacity: interpolate(enter, [0, 1], [0, 1]) * (1 - exitP),
				}}
			/>
			<Tally index={index} p={progress} />
			<AbsoluteFill style={{perspective: 1600}}>
				<AbsoluteFill
					style={{
						transform: `translate(${x}px, ${y}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${zoom})`,
						filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
						opacity: 1 - exitP * 0.4,
					}}
				>
					{/* Cabecera: la instrucción en grande */}
					<div
						style={{
							position: 'absolute',
							top: 304,
							left: 60,
							width: 880,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 26,
						}}
					>
						<span
							style={{
								fontFamily: FONT_TITLE,
								fontSize: 100,
								lineHeight: 1,
								color: C.white,
								WebkitTextStroke: '12px #08061a',
								paintOrder: 'stroke fill',
							}}
						>
							¿SALE TU EDAD?
						</span>
						<span
							style={{
								fontFamily: FONT_TITLE,
								fontSize: 104,
								lineHeight: 1,
								padding: '6px 26px 10px',
								borderRadius: 28,
								color: '#08061a',
								background: C.green,
								boxShadow: `0 0 ${30 + 30 * keyGlow}px ${C.green}`,
								transform: `scale(${interpolate(chipPop, [0, 1], [0.4, 1])}) rotate(${interpolate(chipPop, [0, 1], [-14, -3])}deg)`,
							}}
						>
							+{key}
						</span>
					</div>

					{/* Cuadrícula de 32 números */}
					<div
						style={{
							position: 'absolute',
							top: 452,
							left: 62,
							width: 876,
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: 12,
						}}
					>
						{nums.map((n, i) => {
							const isKey = i === 0;
							const r = Math.floor(i / 4);
							const c = i % 4;
							const pop = spring({frame: frame - 1 - (r + c) * 0.7, fps, config: {damping: 14, stiffness: 420, mass: 0.4}});
							const w = frame - WAVE_AT - (r + c) * 1.6;
							const wave = 0.08 * Math.exp(-(w * w) / 10);
							return (
								<div
									key={n}
									style={{
										height: 100,
										borderRadius: 24,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontFamily: FONT_UI,
										fontWeight: 800,
										fontSize: 60,
										color: isKey ? C.green : C.white,
										background: isKey
											? `linear-gradient(180deg, #23664c 0%, ${C.greenDeep} 100%)`
											: `linear-gradient(180deg, ${pal.cell} 0%, ${pal.cellDeep} 100%)`,
										border: isKey ? `4px solid ${C.green}` : `2px solid ${pal.border}`,
										boxShadow: isKey
											? `0 0 ${20 + 30 * keyGlow}px ${C.green}${Math.round(90 + 80 * keyGlow).toString(16)}`
											: '0 6px 0 #0a0720',
										transform: `scale(${interpolate(pop, [0, 1], [0.6, 1]) * (isKey ? 1 + 0.05 * keyGlow : 1) + wave})`,
										opacity: interpolate(pop, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
										filter: wave > 0.005 ? `brightness(${1 + wave * 5})` : undefined,
									}}
								>
									{n}
								</div>
							);
						})}
					</div>

					{/* barrido de luz */}
					<div
						style={{
							position: 'absolute',
							top: 440,
							left: 60,
							width: 880,
							height: 912,
							borderRadius: 24,
							pointerEvents: 'none',
							mixBlendMode: 'screen',
							background: `linear-gradient(115deg, transparent ${sweep * 100 - 18}%, #ffffff30 ${sweep * 100 - 4}%, #ffffff55 ${sweep * 100}%, #ffffff30 ${sweep * 100 + 4}%, transparent ${sweep * 100 + 18}%)`,
							opacity: sweep > -0.3 && sweep < 1.3 ? 1 : 0,
						}}
					/>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
