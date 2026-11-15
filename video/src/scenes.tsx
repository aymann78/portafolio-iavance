import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';

const W = 1080;
const H = 1920;

const C = {
  blue: '#4da3ff',
  red: '#ff4d5e',
  green: '#3ddc84',
  yellow: '#ffe14a',
  grey: '#8a94a8',
  white: '#f4f7ff',
};

/* ---------- piezas 3D reutilizables ---------- */

const WifiArcs: React.FC<{color: string; t: number; scale?: number}> = ({color, t, scale = 1}) => (
  <group scale={scale} rotation={[0, 0, Math.PI / 4]}>
    {[0, 1, 2].map((i) => {
      const phase = (t * 1.6 - i * 0.35) % 1.6;
      const lit = phase > 0 && phase < 0.9 ? 1 : 0.25;
      return (
        <mesh key={i} rotation={[0, 0, -Math.PI / 4 - Math.PI / 4 + Math.PI / 4]}>
          <torusGeometry args={[0.45 + i * 0.4, 0.07, 16, 48, Math.PI / 2]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={lit * 1.2} transparent opacity={0.35 + lit * 0.65} />
        </mesh>
      );
    })}
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[0.13, 24, 24]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
    </mesh>
  </group>
);

const Phone: React.FC<{glow?: string}> = ({glow = C.blue}) => (
  <group>
    <mesh>
      <boxGeometry args={[1.1, 2.1, 0.14]} />
      <meshStandardMaterial color="#1c2233" metalness={0.6} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0, 0.076]}>
      <planeGeometry args={[0.95, 1.9]} />
      <meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={0.6} />
    </mesh>
    <mesh position={[0, 0.88, 0.08]}>
      <boxGeometry args={[0.28, 0.05, 0.01]} />
      <meshStandardMaterial color="#0a0d16" />
    </mesh>
  </group>
);

const Router: React.FC<{color: string}> = ({color}) => (
  <group>
    <mesh>
      <boxGeometry args={[1.6, 0.28, 0.9]} />
      <meshStandardMaterial color="#222a3d" metalness={0.5} roughness={0.4} />
    </mesh>
    <mesh position={[0.5, 0.05, 0.46]}>
      <boxGeometry args={[0.12, 0.06, 0.02]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} />
    </mesh>
    {[-0.55, 0.55].map((x) => (
      <mesh key={x} position={[x, 0.55, -0.25]} rotation={[0, 0, x > 0 ? -0.15 : 0.15]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 12]} />
        <meshStandardMaterial color="#3a4560" />
      </mesh>
    ))}
  </group>
);

const Laptop: React.FC<{color: string}> = ({color}) => (
  <group>
    <mesh position={[0, -0.05, 0]}>
      <boxGeometry args={[1.8, 0.1, 1.2]} />
      <meshStandardMaterial color="#222a3d" metalness={0.5} roughness={0.4} />
    </mesh>
    <group position={[0, 0.6, -0.6]} rotation={[-0.2, 0, 0]}>
      <mesh>
        <boxGeometry args={[1.8, 1.2, 0.08]} />
        <meshStandardMaterial color="#161b29" />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[1.6, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
      </mesh>
    </group>
  </group>
);

const Lock: React.FC<{color: string}> = ({color}) => (
  <group>
    <mesh position={[0, -0.25, 0]}>
      <boxGeometry args={[1.5, 1.2, 0.6]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.35} emissive={color} emissiveIntensity={0.25} />
    </mesh>
    <mesh position={[0, 0.35, 0]}>
      <torusGeometry args={[0.45, 0.12, 16, 40, Math.PI]} />
      <meshStandardMaterial color="#cfd6e6" metalness={0.8} roughness={0.2} />
    </mesh>
    <mesh position={[0, -0.25, 0.31]}>
      <circleGeometry args={[0.13, 20]} />
      <meshStandardMaterial color="#0a0d16" />
    </mesh>
  </group>
);

/** Paquete de datos que viaja de a a b. */
const Packet: React.FC<{from: [number, number, number]; to: [number, number, number]; p: number; color: string; size?: number}> = ({from, to, p, color, size = 0.16}) => {
  const k = ((p % 1) + 1) % 1;
  const pos: [number, number, number] = [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k, from[2] + (to[2] - from[2]) * k];
  return (
    <mesh position={pos} rotation={[k * 6, k * 4, 0]}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
    </mesh>
  );
};

const Stage: React.FC<{children: React.ReactNode; cam?: [number, number, number]}> = ({children, cam = [0, 0, 13]}) => (
  <ThreeCanvas width={W} height={H} camera={{position: cam, fov: 40}}>
    <ambientLight intensity={0.7} />
    <directionalLight position={[3, 5, 6]} intensity={2.2} />
    <pointLight position={[-3, -2, 4]} intensity={20} color="#6aa8ff" />
    {children}
  </ThreeCanvas>
);

/* ---------- etiquetas 2D ---------- */

const Tag: React.FC<{x: number; y: number; text: string; color?: string; delay?: number; size?: number}> = ({x, y, text, color = C.white, delay = 0, size = 46}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 140}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${s})`,
        opacity: s,
        padding: '10px 26px',
        borderRadius: 18,
        background: 'rgba(8,10,20,.75)',
        border: `3px solid ${color}`,
        color,
        fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
        fontWeight: 800,
        fontSize: size,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

/* ---------- escenas ---------- */

const Hook: React.FC<{frames: number}> = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const pulse = 1 + Math.sin(t * 5) * 0.04;
  const bad = frame > 75; // la alerta roja aparece con "puede leer todo"
  return (
    <>
      <Stage>
        <group position={[0, -0.3, 0]} rotation={[0.15, Math.sin(t) * 0.35, 0]} scale={1.4 * pulse}>
          <WifiArcs color={bad ? C.red : C.blue} t={t} />
        </group>
      </Stage>
      <Tag x={540} y={330} text="WiFi_GRATIS_Aeropuerto" color={bad ? C.red : C.blue} delay={4} />
      {bad && <Tag x={540} y={440} text="⚠ alguien está mirando" color={C.red} delay={78} size={42} />}
    </>
  );
};

const Twin: React.FC<{frames: number}> = ({frames}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const {fps} = useVideoConfig();
  const fakeIn = spring({frame: frame - 70, fps, config: {damping: 12}});
  return (
    <>
      <Stage>
        <group position={[-1.2, 1.6, 0]} rotation={[0.3, 0.3, 0]} scale={0.85}>
          <Router color={C.blue} />
          <group position={[0, 1.4, 0]} scale={0.7}><WifiArcs color={C.blue} t={t} /></group>
        </group>
        <group position={[1.2, 1.6, 0]} rotation={[0.3, -0.3, 0]} scale={0.85 * fakeIn}>
          <Router color={C.red} />
          <group position={[0, 1.4, 0]} scale={0.7}><WifiArcs color={C.red} t={t + 0.3} /></group>
        </group>
        <group position={[0, -0.9, 0]} rotation={[0.1, Math.sin(t * 1.2) * 0.3, 0]}>
          <Phone />
        </group>
      </Stage>
      <Tag x={290} y={780} text="Aeropuerto_Free" color={C.blue} delay={8} size={34} />
      {frame > 70 && <Tag x={800} y={780} text="Aeropuerto_Free" color={C.red} delay={72} size={34} />}
      {frame > 100 && <Tag x={800} y={860} text="falsa" color={C.red} delay={102} size={36} />}
    </>
  );
};

const Route: React.FC<{frames: number}> = ({frames}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const phone: [number, number, number] = [0, -1.0, 0];
  const fake: [number, number, number] = [0.8, 1.9, 0];
  const real: [number, number, number] = [-1.3, 2.4, 0];
  const connected = frame > 40;
  return (
    <>
      <Stage cam={[Math.sin(t * 0.6) * 1.2, 0, 9]}>
        <group position={real} rotation={[0.3, 0.3, 0]} scale={0.7}><Router color={C.grey} /></group>
        <group position={fake} rotation={[0.3, -0.3, 0]} scale={0.8}><Laptop color={C.red} /></group>
        <group position={phone}><Phone glow={connected ? C.red : C.blue} /></group>
        {connected &&
          [0, 0.25, 0.5, 0.75].map((o) => (
            <Packet key={o} from={[0, 0.2, 0]} to={[fake[0], fake[1] - 0.5, 0]} p={t * 0.8 + o} color={C.yellow} />
          ))}
        {frame > 110 &&
          [0, 0.5].map((o) => (
            <Packet key={o} from={[fake[0], fake[1], 0]} to={[real[0], real[1], 0]} p={t * 0.6 + o} color={C.grey} size={0.12} />
          ))}
      </Stage>
      {connected && <Tag x={540} y={900} text="tus datos →" color={C.yellow} delay={42} size={40} />}
      {frame > 130 && <Tag x={540} y={300} text="él los ve primero" color={C.red} delay={132} size={40} />}
    </>
  );
};

const Https: React.FC<{frames: number}> = ({frames}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const half = frames * 0.5;
  const second = frame > half;
  const fadeIn = interpolate(frame, [half, half + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <>
      <Stage>
        {!second && (
          <>
            <group position={[0, 0.3, 0]} rotation={[0.1, t * 0.8, 0]} scale={1.1}><Lock color={C.green} /></group>
            {[0, 0.2, 0.4, 0.6, 0.8].map((o) => {
              const k = (t * 0.6 + o) % 1;
              const encrypted = k > 0.5;
              return <Packet key={o} from={[-2.4, 0.3, 0.8]} to={[2.4, 0.3, 0.8]} p={t * 0.6 + o} color={encrypted ? '#5a647c' : C.yellow} />;
            })}
          </>
        )}
        {second && (
          <group position={[0, 0.2, 0]} rotation={[0.1, Math.sin(t * 1.5) * 0.2, 0]} scale={1.1}>
            <mesh>
              <boxGeometry args={[3.2, 2.2, 0.1]} />
              <meshStandardMaterial color="#e9edf7" />
            </mesh>
            <mesh position={[0, 0.75, 0.06]}>
              <boxGeometry args={[3, 0.3, 0.02]} />
              <meshStandardMaterial color="#c4cbe0" />
            </mesh>
            {[0, 1].map((i) => (
              <mesh key={i} position={[0, 0.1 - i * 0.55, 0.06]}>
                <boxGeometry args={[2.4, 0.35, 0.02]} />
                <meshStandardMaterial color="#aeb7d2" />
              </mesh>
            ))}
            <mesh position={[0, -1.1 + 0.05, 0.06]}>
              <boxGeometry args={[1.2, 0.3, 0.02]} />
              <meshStandardMaterial color={C.red} emissive={C.red} emissiveIntensity={0.6} />
            </mesh>
          </group>
        )}
      </Stage>
      {!second && <Tag x={540} y={330} text="HTTPS = cifrado" color={C.green} delay={6} />}
      {second && (
        <div style={{opacity: fadeIn}}>
          <Tag x={540} y={330} text="aeropuerto-login.com" color={C.red} delay={half + 4} size={38} />
          <Tag x={540} y={1130} text="¡idéntica pero falsa!" color={C.yellow} delay={half + 14} size={40} />
        </div>
      )}
    </>
  );
};

const Tips: React.FC<{frames: number}> = ({frames}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const {fps} = useVideoConfig();
  const items = [
    {y: 420, txt: 'Datos móviles o VPN', at: 25},
    {y: 680, txt: 'Sin conexión automática', at: Math.round(frames * 0.38)},
    {y: 940, txt: 'Revisa la dirección', at: Math.round(frames * 0.68)},
  ];
  return (
    <>
      <Stage>
        {items.map((it, i) => {
          const s = spring({frame: frame - it.at, fps, config: {damping: 10}});
          const y = (960 - items[i].y) / 203;
          return (
            <group key={i} position={[-1.35, y, 0]} scale={s}>
              <mesh rotation={[t * 2, t * 2, 0]}>
                <icosahedronGeometry args={[0.45, 0]} />
                <meshStandardMaterial color={C.green} emissive={C.green} emissiveIntensity={0.6} metalness={0.3} roughness={0.3} />
              </mesh>
            </group>
          );
        })}
      </Stage>
      {items.map((it, i) => (
        <div key={i} style={{position: 'absolute', left: 640, top: it.y}}>
          <Tag x={0} y={0} text={`✓ ${it.txt}`} color={C.green} delay={it.at} size={42} />
        </div>
      ))}
    </>
  );
};

const Outro: React.FC<{frames: number}> = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const flick = Math.floor(frame / 12) % 2 === 0;
  return (
    <>
      <Stage>
        <group position={[0, -0.3, 0]} rotation={[0.15, Math.sin(t) * 0.35, 0]} scale={1.4}>
          <WifiArcs color={flick ? C.blue : C.yellow} t={t} />
        </group>
      </Stage>
      <Tag x={540} y={330} text="¿red real o falsa?" color={C.yellow} delay={4} />
    </>
  );
};

export const Scene3D: React.FC<{id: string; frames: number}> = ({id, frames}) => {
  switch (id) {
    case 'hook': return <Hook frames={frames} />;
    case 'twin': return <Twin frames={frames} />;
    case 'route': return <Route frames={frames} />;
    case 'https': return <Https frames={frames} />;
    case 'tips': return <Tips frames={frames} />;
    default: return <Outro frames={frames} />;
  }
};
