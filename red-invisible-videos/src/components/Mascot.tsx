import {Outlines} from '@react-three/drei';
import React from 'react';

/**
 * La mascota de Red Invisible: cabeza blanca sin cara, cuerpo azul,
 * bufanda roja y zapatillas rojas. Hecha solo con primitivas, así que no
 * depende de ningún modelo externo. Los ángulos de los brazos van en radianes:
 * 0 = colgando, PI/2 = en horizontal hacia fuera, PI = hacia arriba.
 */
export type Pose = {
	armL: number;
	armR: number;
	armLFwd?: number; // inclinación hacia delante
	armRFwd?: number;
	headTilt?: number;
	bob?: number; // rebote vertical
	turn?: number; // giro del cuerpo (eje Y)
	squash?: number; // 1 = normal
};

const OUT = <Outlines thickness={0.035} color="#0a0818" />;

const Mat: React.FC<{color: string; rough?: number}> = ({color, rough = 0.55}) => (
	<meshStandardMaterial color={color} roughness={rough} metalness={0.05} />
);

const Arm: React.FC<{side: 1 | -1; angle: number; fwd: number}> = ({side, angle, fwd}) => (
	<group position={[0.31 * side, 1.08, 0]} rotation={[fwd, 0, angle * side]}>
		<mesh position={[0, -0.22, 0]}>
			<capsuleGeometry args={[0.085, 0.3, 8, 16]} />
			<Mat color="#3b5bdb" />
			{OUT}
		</mesh>
		<mesh position={[0, -0.47, 0]}>
			<sphereGeometry args={[0.115, 24, 24]} />
			<Mat color="#f4f4fa" rough={0.4} />
			{OUT}
		</mesh>
	</group>
);

export const Mascot: React.FC<{pose: Pose; position?: [number, number, number]; scale?: number}> = ({
	pose,
	position = [0, 0, 0],
	scale = 1,
}) => {
	const {armL, armR, armLFwd = 0, armRFwd = 0, headTilt = 0, bob = 0, turn = 0, squash = 1} = pose;
	return (
		<group position={[position[0], position[1] + bob, position[2]]} rotation={[0, turn, 0]} scale={[scale / Math.sqrt(squash), scale * squash, scale / Math.sqrt(squash)]}>
			{/* piernas */}
			{[-1, 1].map((s) => (
				<group key={s}>
					<mesh position={[0.14 * s, 0.36, 0]}>
						<capsuleGeometry args={[0.1, 0.3, 8, 16]} />
						<Mat color="#1d2340" />
						{OUT}
					</mesh>
					<mesh position={[0.15 * s, 0.1, 0.06]} scale={[1, 0.62, 1.35]}>
						<sphereGeometry args={[0.15, 24, 24]} />
						<Mat color="#e8443a" />
						{OUT}
					</mesh>
				</group>
			))}
			{/* cuerpo */}
			<mesh position={[0, 0.83, 0]}>
				<capsuleGeometry args={[0.29, 0.34, 12, 24]} />
				<Mat color="#3b5bdb" />
				{OUT}
			</mesh>
			{/* bufanda */}
			<mesh position={[0, 1.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
				<torusGeometry args={[0.24, 0.085, 16, 32]} />
				<Mat color="#e8443a" />
				{OUT}
			</mesh>
			<mesh position={[0.13, 0.95, 0.24]} rotation={[0.25, 0, 0.18]}>
				<boxGeometry args={[0.15, 0.3, 0.06]} />
				<Mat color="#e8443a" />
				{OUT}
			</mesh>
			<Arm side={-1} angle={armL} fwd={armLFwd} />
			<Arm side={1} angle={armR} fwd={armRFwd} />
			{/* cabeza */}
			<group position={[0, 1.6, 0]} rotation={[0, 0, headTilt]}>
				<mesh>
					<sphereGeometry args={[0.5, 48, 48]} />
					<Mat color="#f6f5fb" rough={0.35} />
					{OUT}
				</mesh>
			</group>
		</group>
	);
};

/** Pedestal circular morado con un aro de luz. */
export const Pedestal: React.FC<{position?: [number, number, number]; glow?: number; color?: string}> = ({
	position = [0, 0, 0],
	glow = 1,
	color = '#7b4dff',
}) => (
	<group position={position}>
		<mesh position={[0, -0.12, 0]}>
			<cylinderGeometry args={[0.85, 0.92, 0.24, 64]} />
			<meshStandardMaterial color="#2c1866" roughness={0.6} emissive="#1a0b4a" emissiveIntensity={0.6} />
			<Outlines thickness={0.03} color="#0a0818" />
		</mesh>
		<mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
			<ringGeometry args={[0.7, 0.8, 64]} />
			<meshBasicMaterial color={color} transparent opacity={0.85 * glow} toneMapped={false} />
		</mesh>
	</group>
);
