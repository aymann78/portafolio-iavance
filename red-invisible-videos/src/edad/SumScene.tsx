import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Confetti, shake} from '../components/Fx';
import {Mascot, Pedestal} from '../components/Mascot';
import {Stage3D} from '../components/Stage3D';
import {C, FONT_TITLE, FONT_UI} from '../theme';

/**
 * "¿Cuánto te da? Tres, dos, uno… Esa es tu edad."
 * Marcador tipo tragaperras con la suma girando, cuenta atrás, y golpe final.
 */
const COMMENT = '¡Me ha salido! ¿Cómo lo haces?';

export const SumScene: React.FC<{revealAt: number; countdown: number[]; ctaAt: number; durationInFrames: number}> = ({
	revealAt,
	countdown,
	ctaAt,
	durationInFrames,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const revealF = Math.round(revealAt * fps);
	const revealed = frame >= revealF;
	const reveal = spring({frame: frame - revealF, fps, config: {damping: 10, stiffness: 200}});
	const enter = spring({frame, fps, config: {damping: 15, stiffness: 220}});
	const exit = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

	// cuenta atrás 3-2-1, cada número cuando la voz lo dice
	const cdF = countdown.map((c) => Math.round(c * fps));
	const cdStart = cdF[0];
	const cdIdx = cdF.filter((f) => frame >= f).length - 1; // -1, 0, 1, 2
	const cdNum = cdIdx >= 0 ? 3 - cdIdx : null;
	const cdPop = spring({frame: frame - (cdIdx >= 0 ? cdF[cdIdx] : 0), fps, config: {damping: 8, stiffness: 300}});

	// tragaperras: más rápida al principio, se frena al acercarse la revelación
	const speed = frame < cdStart ? 2 : 2 + Math.floor((frame - cdStart) / 12);
	const rolling = 1 + Math.floor(random(`roll${Math.floor(frame / speed)}`) * 63);

	const ctaF = Math.round(ctaAt * fps);
	const cta = spring({frame: frame - ctaF, fps, config: {damping: 12, stiffness: 200}});
	const ctaOn = frame >= ctaF ? cta : 0;
	const typed = Math.max(0, Math.min(COMMENT.length, Math.floor(((frame - ctaF - 6) / fps) * 28)));
	const celebrate = revealed ? reveal : 0;
	const jump = revealed ? Math.abs(Math.sin(((frame - revealF) / fps) * Math.PI * 2.2)) * 0.25 * Math.max(0, 1 - (frame - revealF) / (fps * 1.6)) : 0;

	return (
		<AbsoluteFill
			style={{
				opacity: exit,
				transform: `${shake(frame, revealF, 26, 14)} scale(${1 + (revealed ? 0.04 * Math.max(0, 1 - (frame - revealF) / 12) : 0)})`,
			}}
		>
			<Stage3D>
				<group scale={0.55} position={[0, 0.7 - 0.45 * ctaOn, 0]}>
					<Pedestal color={revealed ? '#6ef0aa' : '#7b4dff'} />
					<Mascot
						pose={{
							armL: interpolate(celebrate, [0, 1], [0.3, 2.7]),
							armR: interpolate(celebrate, [0, 1], [2.75, 2.7]),
							armRFwd: interpolate(celebrate, [0, 1], [0.95, 0]),
							headTilt: interpolate(celebrate, [0, 1], [0.12 + 0.04 * Math.sin(t * 4), 0]),
							bob: jump,
						}}
					/>
				</group>
			</Stage3D>

			<div
				style={{
					position: 'absolute',
					top: 240,
					left: 60,
					width: 880,
					textAlign: 'center',
					fontFamily: FONT_UI,
					fontWeight: 800,
					fontSize: 42,
					letterSpacing: 6,
					color: revealed ? C.green : C.muted,
					opacity: enter,
				}}
			>
				{revealed ? 'ESE NÚMERO ES' : 'TU SUMA'}
			</div>

			{/* confeti por detrás del marcador: sale hacia los lados sin tapar "TU EDAD" */}
			<Confetti at={revealF} y={470} count={90} />

			{/* marcador */}
			<div
				style={{
					position: 'absolute',
					top: 310,
					left: 150,
					width: 700,
					height: 330,
					borderRadius: 48,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					background: revealed ? `linear-gradient(180deg, #23664c 0%, ${C.greenDeep} 100%)` : 'linear-gradient(180deg, #2a2070 0%, #17113f 100%)',
					border: `6px solid ${revealed ? C.green : C.purple}`,
					boxShadow: revealed ? `0 0 ${50 + 70 * reveal}px ${C.green}` : `0 0 40px ${C.purple}66`,
					transform: `translateY(${-50 * ctaOn}px) scale(${interpolate(enter, [0, 1], [0.6, 1]) * (revealed ? interpolate(reveal, [0, 1], [1.25, 1]) : 1) * (1 - 0.18 * ctaOn)})`,
					overflow: 'visible',
				}}
			>
				<span
					style={{
						fontFamily: FONT_TITLE,
						fontSize: revealed ? 190 : 230,
						lineHeight: 1,
						textTransform: 'uppercase',
						color: revealed ? C.green : C.white,
						WebkitTextStroke: '12px #08061a',
						paintOrder: 'stroke fill',
						textShadow: revealed ? `0 0 40px ${C.green}` : 'none',
						filter: revealed ? undefined : 'blur(1.2px)',
					}}
				>
					{revealed ? 'tu edad' : rolling}
				</span>

				{/* cuenta atrás */}
				{cdNum !== null && !revealed ? (
					<div
						style={{
							position: 'absolute',
							right: -40,
							top: -50,
							width: 150,
							height: 150,
							borderRadius: 75,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: C.pink,
							boxShadow: `0 0 40px ${C.pink}`,
							fontFamily: FONT_TITLE,
							fontSize: 110,
							color: '#ffffff',
							WebkitTextStroke: '8px #08061a',
							paintOrder: 'stroke fill',
							transform: `scale(${interpolate(cdPop, [0, 1], [1.8, 1])}) rotate(8deg)`,
						}}
					>
						{cdNum}
					</div>
				) : null}
			</div>

			{/* invitación a comentar: un comentario de YouTube que se escribe solo */}
			{frame >= ctaF ? (
				<div
					style={{
						position: 'absolute',
						top: 620,
						left: 110,
						width: 780,
						padding: '24px 28px',
						boxSizing: 'border-box',
						borderRadius: 32,
						background: '#ffffff',
						boxShadow: `0 20px 50px #000a, 0 0 0 6px ${C.pink}`,
						display: 'flex',
						gap: 22,
						alignItems: 'flex-start',
						transform: `translateY(${interpolate(cta, [0, 1], [60, 0])}px) scale(${interpolate(cta, [0, 1], [0.7, 1])}) rotate(${interpolate(cta, [0, 1], [-4, -1.5])}deg)`,
						opacity: Math.min(1, cta * 1.5),
					}}
				>
					<div
						style={{
							width: 84,
							height: 84,
							borderRadius: 42,
							flexShrink: 0,
							background: `linear-gradient(135deg, ${C.green}, #1f8f5c)`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontFamily: FONT_TITLE,
							fontSize: 50,
							color: '#08061a',
						}}
					>
						TÚ
					</div>
					<div style={{flex: 1, minWidth: 0}}>
						<div style={{fontFamily: FONT_UI, fontWeight: 600, fontSize: 28, color: '#6b6b80'}}>@tú · ahora mismo</div>
						<div style={{fontFamily: FONT_UI, fontWeight: 800, fontSize: 42, lineHeight: 1.2, color: '#0b0b14', marginTop: 6, minHeight: 100}}>
							{COMMENT.slice(0, typed)}
							<span style={{opacity: Math.floor(frame / 8) % 2 ? 1 : 0, color: C.pink}}>|</span>
						</div>
					</div>
					{/* flecha que señala a los comentarios */}
					<svg
						width={70}
						height={70}
						viewBox="0 0 24 24"
						style={{position: 'absolute', right: -36, bottom: -50, transform: `translateY(${8 * Math.abs(Math.sin(frame * 0.3))}px)`}}
					>
						<circle cx={12} cy={12} r={11} fill={C.pink} />
						<path d="M12 6v11m0 0l-4.5-4.5M12 17l4.5-4.5" stroke="#fff" strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
			) : null}

		</AbsoluteFill>
	);
};
