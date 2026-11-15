import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';

/* ============ Smartphone ============ */
export const Phone: React.FC<{screen: THREE.Texture; frameColor?: string; glow?: number}> = ({screen, frameColor = '#a7adb8', glow = 1}) => (
  <group>
    {/* cuerpo / marco metálico */}
    <RoundedBox args={[1.12, 2.3, 0.11]} radius={0.15} smoothness={8}>
      <meshPhysicalMaterial color={frameColor} metalness={1} roughness={0.22} clearcoat={1} clearcoatRoughness={0.1} />
    </RoundedBox>
    {/* cristal frontal */}
    <RoundedBox args={[1.08, 2.26, 0.02]} radius={0.14} smoothness={8} position={[0, 0, 0.051]}>
      <meshPhysicalMaterial color="#020306" metalness={0.2} roughness={0.05} clearcoat={1} />
    </RoundedBox>
    {/* pantalla */}
    <mesh position={[0, 0, 0.063]}>
      <planeGeometry args={[1.02, 2.2]} />
      <meshBasicMaterial map={screen} transparent toneMapped={false} color={new THREE.Color(glow, glow, glow)} />
    </mesh>
    {/* isla dinámica */}
    <RoundedBox args={[0.3, 0.085, 0.01]} radius={0.04} smoothness={4} position={[0, 0.98, 0.066]}>
      <meshBasicMaterial color="#000000" />
    </RoundedBox>
    {/* botones laterales */}
    {[0.55, 0.32].map((y) => (
      <RoundedBox key={y} args={[0.03, 0.17, 0.05]} radius={0.012} smoothness={3} position={[-0.575, y, 0]}>
        <meshPhysicalMaterial color={frameColor} metalness={1} roughness={0.3} />
      </RoundedBox>
    ))}
    <RoundedBox args={[0.03, 0.28, 0.05]} radius={0.012} smoothness={3} position={[0.575, 0.42, 0]}>
      <meshPhysicalMaterial color={frameColor} metalness={1} roughness={0.3} />
    </RoundedBox>
  </group>
);

/* ============ Punto de acceso wifi (disco) ============ */
const puckProfile = () => {
  const pts: THREE.Vector2[] = [];
  pts.push(new THREE.Vector2(0, 0));
  pts.push(new THREE.Vector2(0.78, 0));
  for (let i = 0; i <= 8; i++) {
    const a = -Math.PI / 2 + (i / 8) * (Math.PI / 2);
    pts.push(new THREE.Vector2(0.78 + Math.cos(a) * 0.06, 0.06 + Math.sin(a) * 0.06));
  }
  pts.push(new THREE.Vector2(0.84, 0.2));
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * (Math.PI / 2);
    pts.push(new THREE.Vector2(0.62 + Math.cos(a) * 0.22, 0.2 + Math.sin(a) * 0.12));
  }
  pts.push(new THREE.Vector2(0, 0.33));
  return pts;
};

export const AccessPoint: React.FC<{body?: string; led: string; ledPower?: number}> = ({body = '#e9edf3', led, ledPower = 3}) => {
  const geo = useMemo(() => new THREE.LatheGeometry(puckProfile(), 96), []);
  return (
    <group>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color={body} metalness={0.05} roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      {/* anillo LED */}
      <mesh position={[0, 0.315, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.42, 0.018, 16, 96]} />
        <meshStandardMaterial color="#000" emissive={led} emissiveIntensity={ledPower} toneMapped={false} />
      </mesh>
      {/* base oscura */}
      <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.8, 64]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
};

/** Ondas de señal que se expanden en el plano horizontal. */
export const SignalRings: React.FC<{t: number; color: string; speed?: number; count?: number; maxR?: number; power?: number}> = ({
  t,
  color,
  speed = 0.7,
  count = 3,
  maxR = 2.6,
  power = 2.5,
}) => (
  <group>
    {Array.from({length: count}).map((_, i) => {
      const k = (t * speed + i / count) % 1;
      const r = 0.5 + k * maxR;
      return (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} scale={[r, r, r]}>
          <torusGeometry args={[1, 0.014 / Math.max(r, 0.5), 8, 128]} />
          <meshBasicMaterial color={color} transparent opacity={Math.pow(1 - k, 1.5) * 0.95} toneMapped={false} />
        </mesh>
      );
    })}
    <pointLight color={color} intensity={power} distance={4} position={[0, 0.6, 0]} />
  </group>
);

/* ============ Portátil ============ */
export const Laptop: React.FC<{screen: THREE.Texture; keys: THREE.Texture; open?: number}> = ({screen, keys, open = 1}) => {
  const lid = (1 - open) * (Math.PI / 2) - 0.28 * open;
  return (
    <group>
      <RoundedBox args={[2.6, 0.09, 1.75]} radius={0.04} smoothness={4} position={[0, 0.045, 0]}>
        <meshPhysicalMaterial color="#3a3f4a" metalness={0.9} roughness={0.32} clearcoat={0.4} />
      </RoundedBox>
      {/* teclado */}
      <mesh position={[0, 0.092, -0.12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.3, 0.95]} />
        <meshStandardMaterial map={keys} roughness={0.6} />
      </mesh>
      {/* trackpad */}
      <RoundedBox args={[0.95, 0.004, 0.52]} radius={0.002} smoothness={2} position={[0, 0.091, 0.55]}>
        <meshPhysicalMaterial color="#454b57" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      {/* tapa */}
      <group position={[0, 0.09, -0.86]} rotation={[lid, 0, 0]}>
        <RoundedBox args={[2.6, 1.68, 0.05]} radius={0.04} smoothness={4} position={[0, 0.84, -0.025]}>
          <meshPhysicalMaterial color="#3a3f4a" metalness={0.9} roughness={0.32} />
        </RoundedBox>
        <mesh position={[0, 0.84, 0.002]}>
          <planeGeometry args={[2.5, 1.58]} />
          <meshBasicMaterial color="#020306" />
        </mesh>
        <mesh position={[0, 0.85, 0.004]}>
          <planeGeometry args={[2.38, 1.46]} />
          <meshBasicMaterial map={screen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};

/* ============ Candado ============ */
export const Padlock: React.FC<{color?: string; shackleUp?: number; glow?: number}> = ({color = '#10b981', shackleUp = 0, glow = 0}) => {
  const shackle = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const r = 0.36;
    for (let i = 0; i <= 10; i++) pts.push(new THREE.Vector3(-r, -0.25 + (i / 10) * 0.55, 0));
    for (let i = 1; i < 32; i++) {
      const a = Math.PI - (i / 32) * Math.PI;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0.3 + Math.sin(a) * r, 0));
    }
    for (let i = 0; i <= 10; i++) pts.push(new THREE.Vector3(r, 0.3 - (i / 10) * 0.55, 0));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.085, 24, false);
  }, []);
  const keyhole = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0.06, 0.09, 0, Math.PI * 2, false);
    const t = new THREE.Shape();
    t.moveTo(-0.05, 0.02);
    t.lineTo(0.05, 0.02);
    t.lineTo(0.08, -0.2);
    t.lineTo(-0.08, -0.2);
    t.closePath();
    return [new THREE.ShapeGeometry(s, 32), new THREE.ShapeGeometry(t)];
  }, []);
  return (
    <group>
      <mesh geometry={shackle} position={[0, 0.42 + shackleUp * 0.35, 0]}>
        <meshPhysicalMaterial color="#d9dee8" metalness={1} roughness={0.12} clearcoat={1} />
      </mesh>
      <RoundedBox args={[1.25, 1.0, 0.48]} radius={0.14} smoothness={8} position={[0, -0.18, 0]}>
        <meshPhysicalMaterial color={color} metalness={0.55} roughness={0.22} clearcoat={1} clearcoatRoughness={0.08} emissive={color} emissiveIntensity={glow} />
      </RoundedBox>
      {keyhole.map((g, i) => (
        <mesh key={i} geometry={g} position={[0, -0.16, 0.245]}>
          <meshBasicMaterial color="#04140d" />
        </mesh>
      ))}
    </group>
  );
};

/* ============ Emblema wifi ============ */
export const WifiEmblem: React.FC<{color: string; t: number; power?: number; seq?: boolean}> = ({color, t, power = 2.6, seq = true}) => {
  const ARC = (100 * Math.PI) / 180;
  const radii = [0.62, 1.12, 1.62];
  return (
    <group>
      {radii.map((r, i) => {
        const phase = seq ? (Math.sin(t * 4 - i * 0.9) + 1) / 2 : 1;
        const p = power * (0.45 + phase * 0.55);
        const mat = <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={p} toneMapped={false} />;
        return (
          <group key={i} rotation={[0, 0, Math.PI / 2 - ARC / 2]}>
            <mesh>
              <torusGeometry args={[r, 0.12, 24, 96, ARC]} />
              {mat}
            </mesh>
            {[0, ARC].map((a) => (
              <mesh key={a} position={[Math.cos(a) * r, Math.sin(a) * r, 0]}>
                <sphereGeometry args={[0.12, 24, 24]} />
                {mat}
              </mesh>
            ))}
          </group>
        );
      })}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={power} toneMapped={false} />
      </mesh>
    </group>
  );
};

/* ============ Flujo de datos ============ */
export const DataStream: React.FC<{
  points: [number, number, number][];
  t: number;
  color: string;
  progress?: number; // 0..1 cuánto se ha dibujado la línea
  packets?: number;
  speed?: number;
  power?: number;
}> = ({points, t, color, progress = 1, packets = 5, speed = 0.45, power = 3}) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [JSON.stringify(points)]);
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.018, 8, false), [curve]);
  const total = tube.index!.count;
  tube.setDrawRange(0, Math.floor(total * Math.min(1, Math.max(0, progress))));
  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color={color} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      {progress > 0.98 &&
        Array.from({length: packets}).map((_, i) => {
          const k = (t * speed + i / packets) % 1;
          const p = curve.getPointAt(k);
          return (
            <mesh key={i} position={p}>
              <sphereGeometry args={[0.065, 16, 16]} />
              <meshStandardMaterial color="#000" emissive={color} emissiveIntensity={power} toneMapped={false} />
            </mesh>
          );
        })}
    </group>
  );
};

/* ============ Plano con textura (pantallas, tarjetas) ============ */
export const Card: React.FC<{tex: THREE.Texture; w: number; h: number; radius?: number; edge?: string; edgePower?: number; opacity?: number}> = ({
  tex,
  w,
  h,
  radius = 0.12,
  edge,
  edgePower = 2,
  opacity = 1,
}) => (
  <group>
    <RoundedBox args={[w + 0.06, h + 0.06, 0.05]} radius={radius} smoothness={6} position={[0, 0, -0.03]}>
      <meshPhysicalMaterial color="#0b0f19" metalness={0.6} roughness={0.25} clearcoat={1} transparent opacity={opacity} emissive={edge ?? '#000'} emissiveIntensity={edge ? edgePower * 0.15 : 0} />
    </RoundedBox>
    <mesh position={[0, 0, 0.001]}>
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} opacity={opacity} />
    </mesh>
  </group>
);
