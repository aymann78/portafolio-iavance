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
export const SumScene: React.FC<{revealAt: number; countdown: number[]; durationInFrames: number}> = ({revealAt, countdown, durationInFrames}) => {
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

	const chip = spring({frame: frame - revealF - Math.round(0.45 * fps), fps, config: {damping: 11, stiffness: 220}});
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
				<group scale={0.55} position={[0, 0.7, 0]}>
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
					transform: `scale(${interpolate(enter, [0, 1], [0.6, 1]) * (revealed ? interpolate(reveal, [0, 1], [1.25, 1]) : 1)})`,
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

			{/* invitación a comentar */}
			<div
				style={{
					position: 'absolute',
					top: 676,
					left: 60,
					width: 880,
					display: 'flex',
					justifyContent: 'center',
					opacity: chip,
					transform: `translateY(${interpolate(chip, [0, 1], [30, 0])}px)`,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 16,
						padding: '14px 30px',
						borderRadius: 999,
						background: '#ffffff',
						color: '#08061a',
						fontFamily: FONT_UI,
						fontWeight: 800,
						fontSize: 40,
						boxShadow: '0 10px 30px #0008',
					}}
				>
					¿Acerté? Escríbela abajo
					<svg width={36} height={36} viewBox="0 0 24 24">
						<path d="M12 4v14m0 0l-6-6m6 6l6-6" stroke="#08061a" strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
			</div>

		</AbsoluteFill>
	);
};
