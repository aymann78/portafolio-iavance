import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {C, FONT_TITLE, H, W} from '../theme';

/** Temblor de cámara que decae: devuelve un transform CSS. */
export const shake = (frame: number, at: number, strength = 18, len = 12) => {
	const k = frame - at;
	if (k < 0 || k > len) return 'translate(0px, 0px)';
	const a = strength * (1 - k / len);
	return `translate(${Math.sin(k * 2.7) * a}px, ${Math.cos(k * 3.3) * a}px)`;
};

/**
 * Números del 1 al 63 flotando hacia arriba con profundidad (parallax).
 * Es periódico sobre `loopFrames` para que el bucle del Short no salte.
 */
export const NumberField: React.FC<{loopFrames: number; opacity: number}> = ({loopFrames, opacity}) => {
	const frame = useCurrentFrame();
	const phase = (frame % loopFrames) / loopFrames;
	const items = useMemo(
		() =>
			Array.from({length: 34}, (_, i) => {
				const depth = random(`nd${i}`); // 0 lejos, 1 cerca
				return {
					n: 1 + Math.floor(random(`nn${i}`) * 63),
					x: random(`nx${i}`) * W,
					y0: random(`ny${i}`) * (H + 300),
					depth,
					speed: depth > 0.6 ? 2 : 1, // vueltas completas por bucle
					rot: (random(`nr${i}`) - 0.5) * 30,
					green: random(`ng${i}`) > 0.82,
				};
			}),
		[],
	);
	if (opacity <= 0.001) return null;
	return (
		<AbsoluteFill style={{opacity, overflow: 'hidden'}}>
			{items.map((it, i) => {
				const span = H + 300;
				const y = ((((it.y0 - it.speed * phase * span) % span) + span) % span) - 150;
				const size = 40 + it.depth * 90;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: it.x,
							top: y,
							fontFamily: FONT_TITLE,
							fontSize: size,
							color: it.green ? C.green : '#8f7fe0',
							opacity: 0.25 + it.depth * 0.55,
							filter: `blur(${(1 - it.depth) * 3}px)`,
							transform: `translate(-50%, -50%) rotate(${it.rot + Math.sin(phase * Math.PI * 2 * it.speed + i) * 8}deg)`,
						}}
					>
						{it.n}
					</div>
				);
			})}
		</AbsoluteFill>
	);
};

/** Destello blanco corto (para cortes y transiciones). */
export const Flash: React.FC<{at: number; len?: number; max?: number}> = ({at, len = 4, max = 0.16}) => {
	const frame = useCurrentFrame();
	const o = interpolate(frame, [at, at + 1, at + len], [0, max, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	if (o <= 0) return null;
	return <AbsoluteFill style={{backgroundColor: '#ffffff', opacity: o, mixBlendMode: 'screen'}} />;
};

/** Explosión de confeti (verde, rosa, blanco). */
export const Confetti: React.FC<{at: number; x?: number; y?: number; count?: number}> = ({at, x = 540, y = 640, count = 70}) => {
	const frame = useCurrentFrame();
	const k = frame - at;
	const parts = useMemo(
		() =>
			Array.from({length: count}, (_, i) => {
				const ang = random(`ca${i}`) * Math.PI * 2;
				const sp = 18 + random(`cs${i}`) * 34;
				return {
					vx: Math.cos(ang) * sp,
					vy: Math.sin(ang) * sp - 22,
					color: [C.green, C.pink, C.white, '#ffd166'][i % 4],
					w: 12 + random(`cw${i}`) * 14,
					h: 8 + random(`ch${i}`) * 10,
					spin: (random(`cr${i}`) - 0.5) * 40,
				};
			}),
		[count],
	);
	if (k < 0 || k > 60) return null;
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{parts.map((p, i) => {
				const drag = Math.pow(0.92, k);
				const dist = (1 - drag) / (1 - 0.92);
				const px = x + p.vx * dist;
				const py = y + p.vy * dist + 0.9 * k * k * 0.5;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: px,
							top: py,
							width: p.w,
							height: p.h,
							borderRadius: 3,
							background: p.color,
							opacity: interpolate(k, [40, 60], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
							transform: `rotate(${p.spin * k}deg)`,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};

/**
 * Grano de película muy sutil. Evita las bandas en los degradados oscuros
 * cuando YouTube recomprime el vídeo, y da acabado "de cine".
 */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity}}>
			<svg width={W} height={H}>
				<filter id={`g${frame}`}>
					<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={frame % 97} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width={W} height={H} filter={`url(#g${frame})`} />
			</svg>
		</AbsoluteFill>
	);
};
