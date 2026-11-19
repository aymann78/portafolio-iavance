import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Mascot, Pedestal} from '../components/Mascot';
import {Stage3D, useFontsReady, useTextTexture} from '../components/Stage3D';
import {C, FONT_TITLE} from '../theme';

const FEET_Y = 0.78; // pies a ~1090 px: deja sitio a los subtítulos

/**
 * Escena del gancho. También se usa como cierre: `phase` es el tiempo de las
 * animaciones en reposo, y vale 0 en el primer fotograma del vídeo y en el último,
 * así el bucle no se nota.
 */
export const HookScene: React.FC<{phase: number; demoAt?: number; enterFrame?: number}> = ({
	phase,
	demoAt,
	enterFrame,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const ready = useFontsReady();
	const TAU = Math.PI * 2;

	// Entrada (solo en el cierre). En el gancho todo está ya colocado en el fotograma 0.
	const enter = enterFrame === undefined ? 1 : spring({frame: frame - enterFrame, fps, config: {damping: 15, stiffness: 140}});

	const t = frame / fps;
	const demo = demoAt !== undefined && t >= demoAt;
	const demoPop = demo ? spring({frame: frame - demoAt! * fps, fps, config: {damping: 9, stiffness: 220}}) : 0;

	const qTex = useTextTexture('?', {color: C.white, bg: '#140f34', border: C.purple, ready});
	const oneTex = useTextTexture('1', {color: C.green, bg: '#123528', border: C.green, ready});

	const bob = 0.05 * Math.sin((phase / 1.75) * TAU);
	const panelBob = 0.08 * Math.sin((phase / 3.5) * TAU + 1);
	const arm = 2.05 + 0.06 * Math.sin((phase / 1.75) * TAU);
	const titlePulse = 1 + 0.015 * Math.sin((phase / 1.75) * TAU);

	return (
		<AbsoluteFill>
			<Stage3D>
				<group position={[0, -2.2 * (1 - enter), 0]}>
					<group position={[-0.85, FEET_Y, 0]} scale={0.9}><Pedestal /></group>
					<Mascot
						position={[-0.85, FEET_Y, 0]}
						scale={0.9}
						pose={{armL: 0.25, armR: arm, armRFwd: 0.15, turn: 0.35, bob: bob + 0.04, headTilt: -0.08}}
					/>
				</group>
				<group
					position={[0.88, 1.92 + panelBob, 0]}
					rotation={[0, -0.18, 0.04 * Math.sin((phase / 3.5) * TAU)]}
					scale={enter * (1 + demoPop * 0.08 - (demo ? 0.08 : 0))}
				>
					<mesh>
						<planeGeometry args={[1.1, 1.51]} />
						<meshBasicMaterial map={demo ? oneTex : qTex} transparent toneMapped={false} />
					</mesh>
				</group>
			</Stage3D>

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
