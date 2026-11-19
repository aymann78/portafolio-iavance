import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {C, FONT_TITLE, FONT_UI} from '../theme';
import {CARDS} from './script';

const NAMES = ['UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS'];

/** Barra de progreso tipo "stories": 6 segmentos, se rellena según la pantalla. */
const Progress: React.FC<{index: number; p: number}> = ({index, p}) => (
	<div style={{position: 'absolute', top: 200, left: 90, width: 820, display: 'flex', gap: 12}}>
		{Array.from({length: 6}, (_, i) => {
			const fill = i < index ? 1 : i === index ? p : 0;
			return (
				<div key={i} style={{flex: 1, height: 10, borderRadius: 5, background: '#ffffff22', overflow: 'hidden'}}>
					<div style={{width: `${fill * 100}%`, height: '100%', background: C.green, boxShadow: `0 0 12px ${C.green}`}} />
				</div>
			);
		})}
	</div>
);

/**
 * Una de las 6 pantallas. Entra deslizando con un giro 3D, los números aparecen
 * en cascada y el primero (el que hay que apuntar) late en verde.
 */
export const CardScene: React.FC<{index: number; durationInFrames: number}> = ({index, durationInFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const nums = CARDS[index];
	const key = nums[0];

	// Entrada rápida desde una dirección distinta en cada pantalla, con desenfoque de movimiento
	const enter = spring({frame, fps, config: {damping: 15, stiffness: 210}});
	const exitP = interpolate(frame, [durationInFrames - 6, durationInFrames], [0, 1], {
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
	const x = dx * interpolate(enter, [0, 1], [1000, 0]) - ex * interpolate(exitP, [0, 1], [0, 1100]);
	const y = dy * interpolate(enter, [0, 1], [1500, 0]) - ey * interpolate(exitP, [0, 1], [0, 1600]);
	const rotY = dx * interpolate(enter, [0, 1], [-30, 0]);
	const rotX = dy * interpolate(enter, [0, 1], [25, 0]);
	const blur = (1 - enter) * 18 + exitP * 18;
	// zoom lento continuo ("cámara viva")
	const zoom = interpolate(frame, [0, durationInFrames], [0.985, 1.035]);
	// luz que barre la cuadrícula al entrar
	const sweep = interpolate(frame, [6, 24], [-0.3, 1.3], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	// onda que recorre los números a mitad de pantalla
	const WAVE_AT = Math.round(durationInFrames * 0.48);
	const progress = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp'});

	const keyGlow = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * 1.4);
	const hintIn = spring({frame: frame - 14, fps, config: {damping: 12, stiffness: 200}});

	return (
		<AbsoluteFill>
			<Progress index={index} p={progress} />
			<AbsoluteFill style={{perspective: 1600}}>
				<AbsoluteFill style={{transform: `translate(${x}px, ${y}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${zoom})`, filter: `blur(${blur}px)`, opacity: 1 - exitP * 0.4}}>
					{/* Cabecera */}
					<div
						style={{
							position: 'absolute',
							top: 238,
							left: 60,
							width: 880,
							textAlign: 'center',
							fontFamily: FONT_UI,
							fontWeight: 800,
							fontSize: 40,
							letterSpacing: 6,
							color: C.muted,
						}}
					>
						PANTALLA {NAMES[index]} · {index + 1}/6
					</div>
					<div
						style={{
							position: 'absolute',
							top: 290,
							left: 60,
							width: 880,
							textAlign: 'center',
							fontFamily: FONT_TITLE,
							fontSize: 112,
							lineHeight: 1,
							color: C.white,
							WebkitTextStroke: '12px #08061a',
							paintOrder: 'stroke fill',
						}}
					>
						¿SALE TU EDAD?
					</div>

					{/* Cuadrícula de 32 números */}
					<div
						style={{
							position: 'absolute',
							top: 440,
							left: 70,
							width: 860,
							display: 'grid',
							gridTemplateColumns: 'repeat(4, 1fr)',
							gap: 14,
						}}
					>
						{nums.map((n, i) => {
							const pop = spring({frame: frame - 4 - i * 0.55, fps, config: {damping: 13, stiffness: 260, mass: 0.5}});
							const isKey = i === 0;
							const r = Math.floor(i / 4);
							const c = i % 4;
							const w = frame - WAVE_AT - (r + c) * 1.6;
							const wave = 0.09 * Math.exp(-(w * w) / 10);
							return (
								<div
									key={n}
									style={{
										height: 92,
										borderRadius: 22,
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontFamily: FONT_UI,
										fontWeight: 800,
										fontSize: 54,
										color: isKey ? C.green : C.white,
										background: isKey
											? `linear-gradient(180deg, #23664c 0%, ${C.greenDeep} 100%)`
											: `linear-gradient(180deg, #30246e 0%, ${C.cell} 100%)`,
										border: isKey ? `4px solid ${C.green}` : `2px solid ${C.cellBorder}`,
										boxShadow: isKey
											? `0 0 ${20 + 30 * keyGlow}px ${C.green}${Math.round(90 + 80 * keyGlow).toString(16)}`
											: '0 6px 0 #0a0720',
										transform: `scale(${interpolate(pop, [0, 1], [0.3, 1]) * (isKey ? 1 + 0.05 * keyGlow : 1) + wave})`,
										filter: `brightness(${1 + wave * 5})`,
										opacity: interpolate(pop, [0, 0.4], [0, 1], {extrapolateRight: 'clamp'}),
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
							top: 430,
							left: 60,
							width: 880,
							height: 860,
							borderRadius: 24,
							pointerEvents: 'none',
							mixBlendMode: 'screen',
							background: `linear-gradient(115deg, transparent ${sweep * 100 - 18}%, #ffffff30 ${sweep * 100 - 4}%, #b8ffdc66 ${sweep * 100}%, #ffffff30 ${sweep * 100 + 4}%, transparent ${sweep * 100 + 18}%)`,
							opacity: sweep > -0.3 && sweep < 1.3 ? 1 : 0,
						}}
					/>

					{/* Recordatorio de qué apuntar */}
					<div
						style={{
							position: 'absolute',
							top: 1296,
							left: 60,
							width: 880,
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							gap: 18,
							fontFamily: FONT_UI,
							fontWeight: 800,
							fontSize: 46,
							color: C.white,
							transform: `scale(${interpolate(hintIn, [0, 1], [0.7, 1])})`,
							opacity: hintIn,
						}}
					>
						<span>Si sales, apunta el</span>
						<span
							style={{
								minWidth: 96,
								padding: '4px 18px',
								borderRadius: 18,
								textAlign: 'center',
								color: '#08061a',
								background: C.green,
								boxShadow: `0 0 24px ${C.green}`,
								fontSize: 52,
							}}
						>
							{key}
						</span>
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
