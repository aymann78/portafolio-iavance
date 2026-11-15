import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {Studio, Rig} from './core/studio';

const extrude = (shape: THREE.Shape, depth: number, bevel = 0.04) =>
  new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 6, curveSegments: 48});

/* A — "Bajo Llave": baldosa con cerradura luminosa */
const Keyhole: React.FC = () => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0.32, 0.36, -Math.PI * 0.28, Math.PI * 1.28, false);
    s.lineTo(-0.26, -0.75);
    s.quadraticCurveTo(0, -0.82, 0.26, -0.75);
    s.closePath();
    const g = extrude(s, 0.06, 0.03);
    g.center();
    return g;
  }, []);
  return (
    <group rotation={[0.18, -0.38, 0.04]}>
      <RoundedBox args={[2.6, 2.6, 0.55]} radius={0.55} smoothness={10}>
        <meshPhysicalMaterial color="#0d1424" metalness={0.7} roughness={0.18} clearcoat={1} clearcoatRoughness={0.05} />
      </RoundedBox>
      <mesh geometry={geo} position={[0, 0.02, 0.3]}>
        <meshStandardMaterial color="#000" emissive="#22e3a6" emissiveIntensity={3.2} toneMapped={false} />
      </mesh>
    </group>
  );
};

/* B — "Día Cero": un cero cromado tachado por un haz */
const Zero: React.FC = () => (
  <group rotation={[0.15, -0.45, 0]}>
    <mesh scale={[0.82, 1.08, 1]}>
      <torusGeometry args={[1.05, 0.3, 48, 160]} />
      <meshPhysicalMaterial color="#d7dce6" metalness={1} roughness={0.12} clearcoat={1} />
    </mesh>
    <mesh rotation={[0, 0, -0.62]} position={[0, 0, 0.05]}>
      <capsuleGeometry args={[0.1, 2.9, 16, 32]} />
      <meshStandardMaterial color="#000" emissive="#ff2d55" emissiveIntensity={3.5} toneMapped={false} />
    </mesh>
  </group>
);

/* C — "Brecha": escudo con una grieta de luz */
const Shield: React.FC = () => {
  const {shield, crack} = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 1.35);
    s.bezierCurveTo(0.55, 1.1, 0.95, 1.05, 1.15, 1.05);
    s.bezierCurveTo(1.15, 0.0, 0.95, -0.85, 0, -1.4);
    s.bezierCurveTo(-0.95, -0.85, -1.15, 0.0, -1.15, 1.05);
    s.bezierCurveTo(-0.95, 1.05, -0.55, 1.1, 0, 1.35);
    const sg = extrude(s, 0.35, 0.08);
    sg.center();
    const pts = [
      [0.05, 1.32], [0.18, 0.75], [-0.12, 0.35], [0.22, -0.1], [-0.08, -0.55], [0.06, -1.3],
    ].map(([x, y]) => new THREE.Vector3(x, y, 0));
    const cg = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.05), 200, 0.055, 12, false);
    return {shield: sg, crack: cg};
  }, []);
  return (
    <group rotation={[0.12, -0.42, 0]} scale={1.05}>
      <mesh geometry={shield}>
        <meshPhysicalMaterial color="#141b2e" metalness={0.75} roughness={0.2} clearcoat={1} />
      </mesh>
      <mesh geometry={crack} position={[0, 0.02, 0.24]}>
        <meshStandardMaterial color="#000" emissive="#ffb020" emissiveIntensity={4} toneMapped={false} />
      </mesh>
    </group>
  );
};

const LOOK = {
  A: {bg: '#04070d', glow: '#0b3a35', accent: '#22e3a6'},
  B: {bg: '#07040a', glow: '#3a0b1a', accent: '#ff2d55'},
  C: {bg: '#080604', glow: '#3d2a08', accent: '#ffb020'},
};

export const Logo: React.FC<{v: 'A' | 'B' | 'C'}> = ({v}) => (
  <Studio look={LOOK[v]} dust={false} bloom={1.3}>
    <Rig pos={[0, 0, 9.5]} look={[0, 0, 0]} />
    {v === 'A' ? <Keyhole /> : v === 'B' ? <Zero /> : <Shield />}
  </Studio>
);
