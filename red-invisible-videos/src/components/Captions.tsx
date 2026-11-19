import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Caption} from '../edad/script';
import {C, FONT_TITLE} from '../theme';

const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñü0-9]/gi, '');

/**
 * Subtítulos estilo Shorts: las palabras aparecen al ritmo de la voz,
 * la palabra que suena da un pequeño salto, y las palabras clave van en verde.
 * Mientras no haya voz real, el tiempo de cada palabra se reparte por sílabas aproximadas.
 */
export const Captions: React.FC<{captions: Caption[]; y?: number}> = ({captions, y = 1262}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const cap = captions.find((c) => t >= c.from && t < c.to);
	if (!cap) return null;

	const words = cap.text.split(' ');
	const weights = words.map((w) => Math.max(1, clean(w).length));
	const total = weights.reduce((a, b) => a + b, 0);
	const speak = (cap.to - cap.from) * 0.85;
	let acc = 0;
	const starts = weights.map((w) => {
		const s = cap.from + (acc / total) * speak;
		acc += w;
		return s;
	});

	const capIn = spring({frame: frame - cap.from * fps, fps, config: {damping: 14, stiffness: 220}});

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			<div
				style={{
					position: 'absolute',
					left: 70,
					width: 860,
					top: y,
					transform: `translateY(-50%) scale(${interpolate(capIn, [0, 1], [0.92, 1])})`,
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					columnGap: 22,
					rowGap: 0,
					fontFamily: FONT_TITLE,
					fontSize: 100,
					lineHeight: 1.08,
					textTransform: 'uppercase',
					textAlign: 'center',
				}}
			>
				{words.map((w, i) => {
					const local = frame - starts[i] * fps;
					const visible = local >= 0;
					const pop = spring({frame: local, fps, config: {damping: 10, stiffness: 260, mass: 0.6}});
					const isKey = cap.highlight?.includes(clean(w));
					return (
						<span
							key={i}
							style={{
								display: 'inline-block',
								opacity: visible ? 1 : 0,
								transform: `scale(${visible ? interpolate(pop, [0, 1], [0.6, 1]) : 0.6}) translateY(${visible ? interpolate(pop, [0, 1], [18, 0]) : 18}px)`,
								color: isKey ? C.green : C.white,
								WebkitTextStroke: '14px #08061a',
								paintOrder: 'stroke fill',
								textShadow: isKey ? `0 0 30px ${C.green}88` : '0 6px 0 #08061a',
							}}
						>
							{w}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};
