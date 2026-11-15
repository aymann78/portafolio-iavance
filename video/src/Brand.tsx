import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Studio, Rig, Floor} from './core/studio';
import {FontGate, SANS} from './core/fonts';
import {KeyholeTile, BRAND} from './Logos';
import {Padlock, WifiEmblem, AccessPoint} from './models/devices';

const LOOK = {bg: BRAND.bg, glow: BRAND.glow, accent: BRAND.accent};

/** Foto de perfil (se renderiza a 1600 y se reduce a 800 para más nitidez). */
export const Avatar: React.FC = () => (
  <Studio look={LOOK} dust={false} bloom={1.25} width={2400} height={2400} noise={0.015}>
    <Rig pos={[0, 0, 9.5]} look={[0, 0, 0]} />
    <group scale={1.48}>
      <KeyholeTile rotation={[0.1, -0.24, 0.02]} power={3.4} />
    </group>
  </Studio>
);

/** Banner 2560×1440. Zona segura (móvil): 1546×423 centrada. */
export const Banner: React.FC = () => (
  <FontGate>
    <AbsoluteFill>
      <Studio look={LOOK} bloom={1.2} width={2560} height={1440} noise={0.03}>
        <Rig pos={[0, 0.25, 11]} look={[0, 0, 0]} />
        {/* logo dentro de la zona segura */}
        <group position={[-2.38, 0.02, 0.6]} scale={0.64}>
          <KeyholeTile rotation={[0.12, 0.42, 0.02]} power={3.4} />
        </group>
        {/* decoración fuera de la zona segura (escritorio / TV) */}
        <group position={[-5.4, -0.15, -1.5]} rotation={[0.1, 0.55, 0.12]} scale={0.62}>
          <Padlock color="#10b981" />
        </group>
        <group position={[5.5, 0.1, -1.6]} rotation={[0.05, -0.5, -0.08]} scale={0.42}>
          <WifiEmblem color={BRAND.accent} t={0.6} power={2.2} seq={false} />
        </group>
        <group position={[5.45, -0.85, -1.6]} scale={0.45}>
          <AccessPoint led={BRAND.accent} ledPower={3} />
        </group>
        <Floor y={-1.45} color="#0f5c4c" />
      </Studio>
      {/* texto: zona segura x 507–2053, y 508–931 */}
      <div style={{position: 'absolute', left: 1075, top: 720, transform: 'translateY(-50%)', fontFamily: SANS}}>
        <div style={{fontWeight: 900, fontSize: 150, letterSpacing: -5, lineHeight: 0.95, color: '#fff', textShadow: '0 12px 40px rgba(0,0,0,.6)'}}>
          BAJO <span style={{color: BRAND.accent, textShadow: `0 0 50px ${BRAND.accent}88`}}>LLAVE</span>
        </div>
        <div style={{marginTop: 26, fontWeight: 600, fontSize: 44, color: 'rgba(255,255,255,.72)', letterSpacing: -0.5}}>
          Ciberseguridad explicada fácil
        </div>
        <div
          style={{
            marginTop: 22,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            padding: '12px 26px',
            borderRadius: 999,
            border: `2px solid ${BRAND.accent}66`,
            background: 'rgba(34,227,166,.08)',
            color: BRAND.accent,
            fontWeight: 800,
            fontSize: 34,
          }}
        >
          <span style={{width: 14, height: 14, borderRadius: 99, background: BRAND.accent, boxShadow: `0 0 16px ${BRAND.accent}`}} />
          Un Short nuevo cada día
        </div>
      </div>
    </AbsoluteFill>
  </FontGate>
);
