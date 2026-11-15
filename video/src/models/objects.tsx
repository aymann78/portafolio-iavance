import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';

const gold = {color: '#e7b94c', metalness: 1, roughness: 0.22, clearcoat: 0.6};

/* ---------- Tarjeta de crédito ---------- */
export const CreditCard: React.FC<{front: THREE.Texture; tint?: string}> = ({front, tint = '#1d2b6b'}) => (
  <group>
    <RoundedBox args={[1.71, 1.08, 0.03]} radius={0.012} smoothness={4} bevelSegments={4}>
      <meshPhysicalMaterial color={tint} metalness={0.6} roughness={0.25} clearcoat={1} clearcoatRoughness={0.05} iridescence={0.6} />
    </RoundedBox>
    <mesh position={[0, 0, 0.0165]}>
      <planeGeometry args={[1.66, 1.03]} />
      <meshBasicMaterial map={front} transparent toneMapped={false} />
    </mesh>
    <mesh position={[-0.5, 0.08, 0.019]}>
      <planeGeometry args={[0.26, 0.2]} />
      <meshPhysicalMaterial {...gold} />
    </mesh>
  </group>
);

/* ---------- Paquete de cartón ---------- */
export const Package: React.FC<{label: THREE.Texture}> = ({label}) => (
  <group>
    <RoundedBox args={[1.7, 1.15, 1.25]} radius={0.05} smoothness={4}>
      <meshStandardMaterial color="#b98a55" roughness={0.85} />
    </RoundedBox>
    {/* cinta */}
    <mesh position={[0, 0.578, 0]}>
      <boxGeometry args={[0.32, 0.01, 1.27]} />
      <meshPhysicalMaterial color="#d9c49b" roughness={0.3} clearcoat={0.8} transparent opacity={0.85} />
    </mesh>
    <mesh position={[0, 0.2, 0.628]}>
      <boxGeometry args={[0.32, 0.76, 0.01]} />
      <meshPhysicalMaterial color="#d9c49b" roughness={0.3} clearcoat={0.8} transparent opacity={0.85} />
    </mesh>
    {/* etiqueta */}
    <mesh position={[0.32, -0.12, 0.632]} rotation={[0, 0, -0.04]}>
      <planeGeometry args={[0.95, 0.66]} />
      <meshBasicMaterial map={label} toneMapped={false} />
    </mesh>
  </group>
);

/* ---------- Moneda ---------- */
export const Coin: React.FC<{face: THREE.Texture}> = ({face}) => (
  <group rotation={[Math.PI / 2, 0, 0]}>
    <mesh>
      <cylinderGeometry args={[0.3, 0.3, 0.06, 48]} />
      <meshPhysicalMaterial {...gold} />
    </mesh>
    {[0.031, -0.031].map((y) => (
      <mesh key={y} position={[0, y, 0]} rotation={[y > 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.27, 48]} />
        <meshPhysicalMaterial map={face} metalness={1} roughness={0.25} color="#ffffff" />
      </mesh>
    ))}
  </group>
);

/* ---------- Llave ---------- */
export const Key: React.FC<{color?: string; glow?: number}> = ({color = '#e7b94c', glow = 0}) => (
  <group>
    <mesh position={[-0.95, 0, 0]}>
      <torusGeometry args={[0.32, 0.1, 24, 64]} />
      <meshPhysicalMaterial {...gold} color={color} emissive={color} emissiveIntensity={glow} />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]} position={[0.02, 0, 0]}>
      <cylinderGeometry args={[0.075, 0.075, 1.35, 24]} />
      <meshPhysicalMaterial {...gold} color={color} emissive={color} emissiveIntensity={glow} />
    </mesh>
    {[
      [0.45, -0.16, 0.18],
      [0.62, -0.12, 0.12],
      [0.78, -0.18, 0.22],
    ].map(([x, y, h], i) => (
      <mesh key={i} position={[x, y - h / 2 + 0.1, 0]}>
        <boxGeometry args={[0.1, h, 0.1]} />
        <meshPhysicalMaterial {...gold} color={color} emissive={color} emissiveIntensity={glow} />
      </mesh>
    ))}
  </group>
);

/* ---------- Base de datos (servidor) ---------- */
export const Database: React.FC<{ring: string; power?: number; crack?: number}> = ({ring, power = 2.5, crack = 0}) => (
  <group>
    {[0, 1, 2].map((i) => (
      <group key={i} position={[0, i * 0.52 - 0.52, 0]}>
        <mesh>
          <cylinderGeometry args={[0.95, 0.95, 0.42, 64]} />
          <meshPhysicalMaterial color="#1a2030" metalness={0.85} roughness={0.25} clearcoat={1} />
        </mesh>
        <mesh position={[0, 0.235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.95, 0.018, 8, 96]} />
          <meshStandardMaterial color="#000" emissive={ring} emissiveIntensity={power} toneMapped={false} />
        </mesh>
        {[0, 1, 2].map((k) => (
          <mesh key={k} position={[Math.sin(-0.5 + k * 0.18) * 0.951, 0, Math.cos(-0.5 + k * 0.18) * 0.951]} rotation={[0, -0.5 + k * 0.18, 0]}>
            <planeGeometry args={[0.07, 0.07]} />
            <meshBasicMaterial color={k === 0 ? '#22e3a6' : '#facc15'} toneMapped={false} />
          </mesh>
        ))}
      </group>
    ))}
    {crack > 0 && (
      <mesh position={[0.08, 0, 0.955]}>
        <planeGeometry args={[0.06, 1.4 * crack]} />
        <meshBasicMaterial color={new THREE.Color(ring).multiplyScalar(3)} toneMapped={false} />
      </mesh>
    )}
  </group>
);

/* ---------- Ficha de dominó ---------- */
export const Domino: React.FC<{face: THREE.Texture}> = ({face}) => (
  <group>
    <RoundedBox args={[0.62, 1.15, 0.2]} radius={0.06} smoothness={5}>
      <meshPhysicalMaterial color="#f3f4f8" roughness={0.25} clearcoat={1} />
    </RoundedBox>
    <mesh position={[0, 0, 0.101]}>
      <planeGeometry args={[0.52, 1.04]} />
      <meshBasicMaterial map={face} transparent toneMapped={false} />
    </mesh>
  </group>
);

/* ---------- Banco ---------- */
export const Bank: React.FC<{accent?: string}> = ({accent = '#22e3a6'}) => {
  const pediment = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.45, 0);
    s.lineTo(1.45, 0);
    s.lineTo(0, 0.62);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, {depth: 0.9, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 3});
    g.translate(0, 0, -0.45);
    return g;
  }, []);
  const marble = <meshPhysicalMaterial color="#e9ecf2" roughness={0.35} clearcoat={0.5} />;
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, -1.05 + i * 0.12, 0.1 - i * 0.06]}>
          <boxGeometry args={[3.1 - i * 0.18, 0.12, 1.3 - i * 0.12]} />
          {marble}
        </mesh>
      ))}
      {[-1.05, -0.35, 0.35, 1.05].map((x) => (
        <group key={x} position={[x, -0.25, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.17, 1.35, 32]} />
            {marble}
          </mesh>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.42, 0.08, 0.42]} />
            {marble}
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[3.0, 0.18, 1.0]} />
        {marble}
      </mesh>
      <mesh position={[0, 0.6, 0]} geometry={pediment}>
        {marble}
      </mesh>
      <mesh position={[0, 0.5, 0.505]}>
        <planeGeometry args={[2.9, 0.05]} />
        <meshBasicMaterial color={new THREE.Color(accent).multiplyScalar(2.5)} toneMapped={false} />
      </mesh>
    </group>
  );
};

/* ---------- Escudo ---------- */
export const shieldShape = () => {
  const s = new THREE.Shape();
  s.moveTo(0, 1.35);
  s.bezierCurveTo(0.55, 1.1, 0.95, 1.05, 1.15, 1.05);
  s.bezierCurveTo(1.15, 0.0, 0.95, -0.85, 0, -1.4);
  s.bezierCurveTo(-0.95, -0.85, -1.15, 0.0, -1.15, 1.05);
  s.bezierCurveTo(-0.95, 1.05, -0.55, 1.1, 0, 1.35);
  return s;
};
export const Shield: React.FC<{color?: string; check?: number; glow?: string}> = ({color = '#141b2e', check = 1, glow = '#22e3a6'}) => {
  const {g, c} = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shieldShape(), {depth: 0.32, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 6, curveSegments: 48});
    g.center();
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.5, 0.05, 0), new THREE.Vector3(-0.12, -0.35, 0), new THREE.Vector3(0.55, 0.45, 0)], false, 'catmullrom', 0.0);
    return {g, c};
  }, []);
  const tube = useMemo(() => new THREE.TubeGeometry(c, 64, 0.1, 16, false), [c]);
  tube.setDrawRange(0, Math.floor(tube.index!.count * Math.max(0, Math.min(1, check))));
  return (
    <group>
      <mesh geometry={g}>
        <meshPhysicalMaterial color={color} metalness={0.75} roughness={0.2} clearcoat={1} />
      </mesh>
      <mesh geometry={tube} position={[0, 0, 0.26]}>
        <meshStandardMaterial color="#000" emissive={glow} emissiveIntensity={3.2} toneMapped={false} />
      </mesh>
    </group>
  );
};

/* ---------- Sobre (correo) ---------- */
export const Envelope: React.FC<{open?: number; seal?: string}> = ({open = 0, seal = '#ff2d55'}) => {
  const flap = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.9, 0);
    s.lineTo(0.9, 0);
    s.lineTo(0, -0.62);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, {depth: 0.02, bevelEnabled: false});
  }, []);
  return (
    <group>
      <RoundedBox args={[1.8, 1.2, 0.08]} radius={0.04} smoothness={4}>
        <meshPhysicalMaterial color="#f4f1ea" roughness={0.6} clearcoat={0.3} />
      </RoundedBox>
      <group position={[0, 0.6, 0.05]} rotation={[open * Math.PI * 0.95, 0, 0]}>
        <mesh geometry={flap}>
          <meshPhysicalMaterial color="#e8e3d8" roughness={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <mesh position={[0, -0.02, 0.075 + 0.02]}>
        <circleGeometry args={[0.13 * (1 - open), 32]} />
        <meshStandardMaterial color={seal} emissive={seal} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

/* ---------- Caja fuerte (gestor de contraseñas) ---------- */
export const Vault: React.FC<{dial?: number; accent?: string}> = ({dial = 0, accent = '#22e3a6'}) => (
  <group>
    <RoundedBox args={[2.0, 2.0, 1.4]} radius={0.16} smoothness={6}>
      <meshPhysicalMaterial color="#2a3142" metalness={0.9} roughness={0.28} clearcoat={0.8} />
    </RoundedBox>
    <RoundedBox args={[1.6, 1.6, 0.08]} radius={0.1} smoothness={4} position={[0, 0, 0.72]}>
      <meshPhysicalMaterial color="#353d52" metalness={0.9} roughness={0.22} />
    </RoundedBox>
    <group position={[0, 0, 0.8]} rotation={[0, 0, dial]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.1, 64]} />
        <meshPhysicalMaterial color="#c9ced8" metalness={1} roughness={0.15} />
      </mesh>
      {Array.from({length: 12}).map((_, i) => (
        <mesh key={i} position={[Math.cos((i / 12) * Math.PI * 2) * 0.3, Math.sin((i / 12) * Math.PI * 2) * 0.3, 0.055]}>
          <boxGeometry args={[0.02, 0.06, 0.01]} />
          <meshBasicMaterial color="#1a1f2b" />
        </mesh>
      ))}
    </group>
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[0.55, 0, 0.82]} rotation={[0, 0, dial * 0.5 + (i * Math.PI * 2) / 3]}>
        <boxGeometry args={[0.04, 0.42, 0.04]} />
        <meshPhysicalMaterial color="#c9ced8" metalness={1} roughness={0.2} />
      </mesh>
    ))}
    <mesh position={[0, -0.92, 0.761]}>
      <planeGeometry args={[1.2, 0.04]} />
      <meshBasicMaterial color={new THREE.Color(accent).multiplyScalar(2.5)} toneMapped={false} />
    </mesh>
  </group>
);

/* ---------- Etiqueta de precio ---------- */
export const PriceTag: React.FC<{tex: THREE.Texture; color?: string}> = ({tex, color = '#ffd60a'}) => {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.55, 0.4);
    s.lineTo(0.75, 0.4);
    s.quadraticCurveTo(0.85, 0.4, 0.85, 0.3);
    s.lineTo(0.85, -0.3);
    s.quadraticCurveTo(0.85, -0.4, 0.75, -0.4);
    s.lineTo(-0.55, -0.4);
    s.lineTo(-0.95, 0);
    s.closePath();
    const hole = new THREE.Path();
    hole.absarc(-0.62, 0, 0.07, 0, Math.PI * 2, true);
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, {depth: 0.04, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 3, curveSegments: 24});
    return g;
  }, []);
  return (
    <group>
      <mesh geometry={geo}>
        <meshPhysicalMaterial color={color} roughness={0.35} clearcoat={0.8} />
      </mesh>
      <mesh position={[0.12, 0, 0.065]}>
        <planeGeometry args={[1.3, 0.62]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Color HDR para que el bloom lo recoja. */
export const hdr = (c: string, k = 2.5) => new THREE.Color(c).multiplyScalar(k);

/* ---------- Auriculares (producto de segunda mano) ---------- */
export const Headphones: React.FC<{accent?: string}> = ({accent = '#22d3ee'}) => {
  const matte = <meshPhysicalMaterial color="#1b1f29" roughness={0.45} metalness={0.3} clearcoat={0.5} />;
  return (
    <group>
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[0.85, 0.08, 24, 96, Math.PI]} />
        {matte}
      </mesh>
      <mesh>
        <torusGeometry args={[0.8, 0.035, 12, 96, Math.PI]} />
        <meshPhysicalMaterial color="#c9ced8" metalness={1} roughness={0.2} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.85, -0.2, 0]} rotation={[0, 0, 0]}>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.07, 0.28, 0.12]} />
            <meshPhysicalMaterial color="#c9ced8" metalness={1} roughness={0.2} />
          </mesh>
          <group rotation={[0, 0, Math.PI / 2]} position={[s * 0.02, -0.2, 0]}>
            <mesh>
              <cylinderGeometry args={[0.36, 0.36, 0.24, 48]} />
              {matte}
            </mesh>
            <mesh position={[0, s * -0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.27, 0.08, 16, 48]} />
              <meshPhysicalMaterial color="#2a2f3b" roughness={0.8} />
            </mesh>
            <mesh position={[0, s * 0.125, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.3, 0.012, 8, 64]} />
              <meshStandardMaterial color="#000" emissive={accent} emissiveIntensity={2.5} toneMapped={false} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};
