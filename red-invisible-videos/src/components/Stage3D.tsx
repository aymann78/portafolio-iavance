import {ThreeCanvas} from '@remotion/three';
import React, {useEffect, useState} from 'react';
import {continueRender, delayRender} from 'remotion';
import * as THREE from 'three';
import {H, W} from '../theme';

/**
 * Lienzo 3D a pantalla completa con la cámara y la iluminación del canal.
 * La cámara es fija para que todas las escenas compartan encuadre.
 */
export const Stage3D: React.FC<{children: React.ReactNode; camY?: number; camZ?: number; lookY?: number}> = ({
	children,
	camY = 1.6,
	camZ = 13,
	lookY = 1.25,
}) => (
	<ThreeCanvas
		width={W}
		height={H}
		style={{position: 'absolute', inset: 0}}
		gl={{antialias: true, alpha: true, preserveDrawingBuffer: true}}
		camera={{fov: 30, position: [0, camY, camZ], near: 0.1, far: 100}}
		onCreated={({camera}) => camera.lookAt(0, lookY, 0)}
	>
		<ambientLight intensity={0.75} color="#c9c2ff" />
		<directionalLight position={[3, 6, 6]} intensity={2.1} color="#ffffff" />
		<pointLight position={[-3, 3, -3]} intensity={30} color="#ff5fa2" distance={14} />
		<pointLight position={[3, 1, 2]} intensity={12} color="#6ef0aa" distance={10} />
		{children}
	</ThreeCanvas>
);

/** Espera a que las fuentes estén listas antes de dibujar texturas de texto. */
export const useFontsReady = () => {
	const [ready, setReady] = useState(false);
	const [handle] = useState(() => delayRender('fonts for 3D textures'));
	useEffect(() => {
		document.fonts.ready.then(() => {
			Promise.all([document.fonts.load('400 100px Anton'), document.fonts.load('800 100px Montserrat')]).finally(() => {
				setReady(true);
				continueRender(handle);
			});
		});
	}, [handle]);
	return ready;
};

type TexOpts = {color: string; bg: string; border: string; w?: number; h?: number};
const cache = new Map<string, THREE.CanvasTexture>();

/** Textura con texto grande centrado (para pantallas dentro de la escena 3D). Se cachea. */
export const textTexture = (text: string, {color, bg, border, w = 512, h = 704}: TexOpts) => {
	const key = [text, color, bg, border, w, h].join('|');
	const hit = cache.get(key);
	if (hit) return hit;
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext('2d')!;
	ctx.fillStyle = bg;
	ctx.beginPath();
	ctx.roundRect(12, 12, w - 24, h - 24, 56);
	ctx.fill();
	ctx.lineWidth = 16;
	ctx.strokeStyle = border;
	ctx.stroke();
	// el texto se encoge si no cabe (p. ej. números de dos cifras)
	let size = 520;
	ctx.font = `400 ${size}px Anton`;
	const maxW = w * 0.78;
	const mw = ctx.measureText(text).width;
	if (mw > maxW) size = Math.floor((size * maxW) / mw);
	ctx.font = `400 ${size}px Anton`;
	ctx.fillStyle = color;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.shadowColor = color;
	ctx.shadowBlur = 40;
	ctx.fillText(text, w / 2, h / 2 + size * 0.04);
	const tex = new THREE.CanvasTexture(canvas);
	tex.colorSpace = THREE.SRGBColorSpace;
	tex.anisotropy = 8;
	cache.set(key, tex);
	return tex;
};

let glowTex: THREE.CanvasTexture | null = null;
const getGlowTex = () => {
	if (glowTex) return glowTex;
	const c = document.createElement('canvas');
	c.width = c.height = 256;
	const ctx = c.getContext('2d')!;
	const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
	g.addColorStop(0, 'rgba(255,255,255,1)');
	g.addColorStop(0.25, 'rgba(255,255,255,0.45)');
	g.addColorStop(0.6, 'rgba(255,255,255,0.08)');
	g.addColorStop(1, 'rgba(255,255,255,0)');
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, 256, 256);
	glowTex = new THREE.CanvasTexture(c);
	return glowTex;
};

/** Halo de luz aditivo (efecto "bloom" sin postprocesado, compatible con transparencia). */
export const Glow: React.FC<{color: string; size: [number, number]; position?: [number, number, number]; rotation?: [number, number, number]; intensity?: number}> = ({
	color,
	size,
	position = [0, 0, 0],
	rotation = [0, 0, 0],
	intensity = 1,
}) => (
	<mesh position={position} rotation={rotation}>
		<planeGeometry args={size} />
		<meshBasicMaterial map={getGlowTex()} color={color} transparent opacity={intensity} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
	</mesh>
);
