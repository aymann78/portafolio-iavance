import React, {useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Environment, Lightformer} from '@react-three/drei';
import {EffectComposer, Bloom, Vignette, Noise, ChromaticAberration, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode, BlendFunction} from 'postprocessing';
import {ThreeCanvas} from '@remotion/three';
import {continueRender, delayRender, useCurrentFrame} from 'remotion';
import {rand} from './anim';

export const W = 1080;
export const H = 1920;

export type Look = {
  bg: string; // color de fondo
  glow: string; // halo del fondo / luz de acento
  accent?: string; // luz de relleno de color
};

/** Fondo: degradado radial con halo, fuera de la niebla. */
const Backdrop: React.FC<{bg: string; glow: string; t: number}> = ({bg, glow, t}) => {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uBg: {value: new THREE.Color(bg)},
          uGlow: {value: new THREE.Color(glow)},
          uT: {value: 0},
        },
        vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
        fragmentShader: `
          uniform vec3 uBg; uniform vec3 uGlow; uniform float uT; varying vec2 vUv;
          void main(){
            vec2 p = vUv - vec2(0.5, 0.56);
            p.x *= 0.62;
            float d = length(p);
            float halo = smoothstep(0.55, 0.0, d);
            float halo2 = smoothstep(0.22, 0.0, length(vUv - vec2(0.5 + 0.08*sin(uT*0.5), 0.62)));
            vec3 c = mix(uBg, uGlow, halo*0.38 + halo2*0.16);
            gl_FragColor = vec4(c, 1.0);
          }`,
        depthWrite: false,
        fog: false,
      }),
    [bg, glow],
  );
  mat.uniforms.uT.value = t;
  return (
    <mesh position={[0, 0, -30]} renderOrder={-1} material={mat}>
      <planeGeometry args={[80, 120]} />
    </mesh>
  );
};

/** Partículas de polvo / bokeh para dar profundidad. */
const Dust: React.FC<{t: number; color?: string; count?: number}> = ({t, color = '#9fc4ff', count = 220}) => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (rand(i + 1) - 0.5) * 16;
      p[i * 3 + 1] = (rand(i + 101) - 0.5) * 24;
      p[i * 3 + 2] = (rand(i + 201) - 0.5) * 16 - 2;
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    return g;
  }, [count]);
  const sprite = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d')!;
    const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.35, 'rgba(255,255,255,.35)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr;
    x.fillRect(0, 0, 64, 64);
    const tx = new THREE.CanvasTexture(c);
    return tx;
  }, []);
  return (
    <points geometry={geo} rotation={[0, t * 0.03, 0]} position={[0, Math.sin(t * 0.2) * 0.3 + t * 0.05, 0]}>
      <pointsMaterial size={0.07} map={sprite} transparent opacity={0.55} depthWrite={false} color={color} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};

/** Renderiza exactamente una vez por frame de Remotion (frameloop="never"). */
const Advance: React.FC<{frame: number}> = ({frame}) => {
  const advance = useThree((s) => s.advance);
  useLayoutEffect(() => {
    const h = delayRender(`r3f-${frame}`);
    const id = requestAnimationFrame(() => {
      advance((frame * 1000) / 30, true);
      continueRender(h);
    });
    return () => {
      cancelAnimationFrame(id);
      continueRender(h);
    };
  }, [frame, advance]);
  return null;
};

/** Cámara controlada por frame. */
export const Rig: React.FC<{pos: [number, number, number]; look: [number, number, number]; fov?: number; roll?: number}> = ({pos, look, fov = 35, roll = 0}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.up.set(Math.sin(roll), Math.cos(roll), 0);
    camera.lookAt(...look);
    if (camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
};

export const Studio: React.FC<{
  look: Look;
  chroma?: number;
  bloom?: number;
  dust?: boolean;
  children: React.ReactNode;
}> = ({look, chroma = 0, bloom = 1.1, dust = true, children}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const ca = 0.0006 + chroma * 0.012;
  return (
    <ThreeCanvas
      width={W}
      height={H}
      dpr={1}
      frameloop="never"
      gl={{antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false}}
      camera={{fov: 35, position: [0, 0, 12], near: 0.1, far: 200}}
    >
      <color attach="background" args={[look.bg]} />
      <fog attach="fog" args={[look.bg, 16, 42]} />
      <Backdrop bg={look.bg} glow={look.glow} t={t} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 8, 6]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-6, -2, 3]} intensity={0.9} color={look.accent ?? look.glow} />
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#05070c']} />
        <Lightformer form="rect" intensity={5} position={[0, 6, 2]} rotation-x={Math.PI / 2} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={2.5} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[10, 2, 1]} color={look.accent ?? look.glow} />
        <Lightformer form="rect" intensity={3} position={[6, 0, 3]} rotation-y={-Math.PI / 2} scale={[10, 1.2, 1]} />
        <Lightformer form="ring" intensity={4} position={[2, 3, 8]} scale={3} />
        <Lightformer form="rect" intensity={1.5} position={[0, -4, -6]} scale={[12, 4, 1]} color={look.glow} />
      </Environment>
      {children}
      {dust && <Dust t={t} />}
      <EffectComposer multisampling={4} enableNormalPass={false}>
        <Bloom mipmapBlur luminanceThreshold={1.0} luminanceSmoothing={0.25} intensity={bloom} radius={0.72} />
        <ChromaticAberration offset={new THREE.Vector2(ca, ca * 0.7)} radialModulation={false} modulationOffset={0} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        <Vignette darkness={0.6} offset={0.22} />
        <Noise opacity={0.045} blendFunction={BlendFunction.OVERLAY} />
      </EffectComposer>
      <Advance frame={frame} />
    </ThreeCanvas>
  );
};

/** Textura canvas redibujada en cada render. */
export const useCanvasTexture = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) => {
  const {canvas, tex} = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    return {canvas, tex};
  }, [w, h]);
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, w, h);
  draw(ctx, w, h);
  tex.needsUpdate = true;
  return tex;
};

export const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
};

import {Grid} from '@react-three/drei';
export const Floor: React.FC<{y?: number; color: string}> = ({y = -2, color}) => (
  <Grid
    position={[0, y, 0]}
    args={[40, 40]}
    cellSize={0.5}
    cellThickness={0.6}
    cellColor="#1a2233"
    sectionSize={2}
    sectionThickness={1.1}
    sectionColor={color}
    fadeDistance={24}
    fadeStrength={1.6}
    infiniteGrid
  />
);
