import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Mascot, Pedestal} from '../components/Mascot';
import {Glow, Stage3D, textTexture, useFontsReady} from '../components/Stage3D';
import {C, FONT_TITLE} from '../theme';

const FEET_Y = 0.78; // pies a ~1090 px: deja sitio a los subtítulos

/**
 * Corte 1 del gancho (y cierre del bucle).
 * - El panel "escanea" tu edad: números que cambian a toda velocidad.
 * - La cámara se acerca poco a poco.
 * `phase` vale 0 en el primer fotograma del vídeo y en el último: el bucle no salta.
 * `scan` = 0..1, cuánto del escaneo ha pasado (0 y 1 muestran "?").
 */
export const HookScene: React.FC<{phase: number; scanFrom?: number; scanTo?: number; enterFrame?: number; push?: number}> = ({
	phase,
	scanFrom,
	scanTo,
	enterFrame,
	push = 0,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ready = useFontsReady();
	const TAU = Math.PI * 2;
	const t = frame / fps;

	const enter = enterFrame === undefined ? 1 : spring({frame: frame - enterFrame, fps, config: {damping: 15, stiffness: 140}});

	// escaneo: número aleatorio cada 2 fotogramas, con parpadeo
	const scanning = scanFrom !== undefined && scanTo !== undefined && t >= scanFrom && t < scanTo;
	const scanN = 1 + Math.floor(random(`scan${Math.floor(frame / 2)}`) * 63);
	const panelText = scanning ? String(scanN) : '?';
	const tex = ready
		? scanning
			? textTexture(panelText, {color: C.green, bg: '#0f2a22', border: C.green})
			: textTexture('?', {color: C.white, bg: '#140f34', border: C.purple})
		: null;
	const flicker = scanning ? 0.85 + 0.15 * random(`fl${frame}`) : 1;

	const bob = 0.05 * Math.sin((phase / 1.75) * TAU);
	const panelBob = 0.08 * Math.sin((phase / 3.5) * TAU + 1);
	// mientras escanea, la mascota "lanza" energía con el brazo
	const arm = 2.05 + 0.06 * Math.sin((phase / 1.75) * TAU) + (scanning ? 0.12 * Math.sin(frame * 0.9) : 0);
	const titlePulse = 1 + 0.015 * Math.sin((phase / 1.75) * TAU);

	return (
		<AbsoluteFill>
			<AbsoluteFill style={{transform: `scale(${1 + push * 0.07})`, transformOrigin: '60% 45%'}}>
			<Stage3D>
				<group position={[0, -2.2 * (1 - enter), 0]}>
					<group position={[-0.85, FEET_Y, 0]} scale={0.9}>
						<Pedestal glow={scanning ? 0.6 + 0.4 * flicker : 1} color={scanning ? C.green : C.purple} />
					</group>
					<Mascot
						position={[-0.85, FEET_Y, 0]}
						scale={0.9}
						pose={{armL: 0.25, armR: arm, armRFwd: 0.15, turn: 0.35, bob: bob + 0.04, headTilt: -0.08}}
					/>
				</group>
				<group
					position={[0.88, 1.92 + panelBob, 0]}
					rotation={[0, -0.18, 0.04 * Math.sin((phase / 3.5) * TAU)]}
					scale={enter * (scanning ? 1.04 : 1)}
				>
					<Glow color={scanning ? C.green : C.purple} size={[2.6, 3.0]} position={[0, 0, -0.05]} intensity={scanning ? 0.75 * flicker : 0.5} />
					{tex ? (
						<mesh>
							<planeGeometry args={[1.1, 1.51]} />
							<meshBasicMaterial map={tex} transparent opacity={flicker} toneMapped={false} />
						</mesh>
					) : null}
				</group>
			</Stage3D>
			</AbsoluteFill>

			{/* Título: visible desde el fotograma 0 (es tu miniatura en el feed) */}
			<div
				style={{
					position: 'absolute',
					top: 215,
					left: 60,
					width: 880,
					textAlign: 'center',
					fontFamily: FONT_TITLE,
					textTransform: 'uppercase',
					lineHeight: 0.98,
					transform: `scale(${titlePulse * interpolate(enter, [0, 1], [0.85, 1])})`,
					opacity: enter,
				}}
			>
				<div style={{fontSize: 150, color: C.white, WebkitTextStroke: '14px #08061a', paintOrder: 'stroke fill'}}>
					Te adivino
				</div>
				<div
					style={{
						fontSize: 170,
						color: C.green,
						WebkitTextStroke: '14px #08061a',
						paintOrder: 'stroke fill',
						textShadow: `0 0 50px ${C.green}66`,
					}}
				>
					la edad
				</div>
			</div>
		</AbsoluteFill>
	);
};
