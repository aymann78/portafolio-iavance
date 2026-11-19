import {ThreeCanvas} from '@remotion/three';
import React, {useEffect, useMemo, useState} from 'react';
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

/** Textura con texto grande centrado (para pantallas dentro de la escena 3D). */
export const useTextTexture = (
	text: string,
	opts: {color: string; bg: string; border: string; font?: string; w?: number; h?: number; ready: boolean},
) => {
	const {color, bg, border, font = '400 520px Anton', w = 512, h = 704, ready} = opts;
	return useMemo(() => {
		const canvas = document.createElement('canvas');
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext('2d')!;
		const r = 56;
		ctx.fillStyle = bg;
		ctx.beginPath();
		ctx.roundRect(12, 12, w - 24, h - 24, r);
		ctx.fill();
		ctx.lineWidth = 16;
		ctx.strokeStyle = border;
		ctx.stroke();
		ctx.fillStyle = color;
		ctx.font = font;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.shadowColor = color;
		ctx.shadowBlur = 40;
		ctx.fillText(text, w / 2, h / 2 + 20);
		const tex = new THREE.CanvasTexture(canvas);
		tex.colorSpace = THREE.SRGBColorSpace;
		tex.anisotropy = 8;
		return tex;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [text, color, bg, border, font, w, h, ready]);
};
