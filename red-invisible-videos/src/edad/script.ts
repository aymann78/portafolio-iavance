/**
 * "Te adivino la EDAD con 6 pantallas"
 *
 * Toda la línea de tiempo del vídeo sale de aquí. Cuando grabemos la voz con
 * ElevenLabs, sustituiremos estos tiempos por los tiempos reales de cada palabra.
 *
 * Mecánica (v3): el espectador SUMA SOBRE LA MARCHA. En cada pantalla, si sale
 * su edad, le suma el número verde. Solo lleva un número en la cabeza.
 *
 * El vídeo es cíclico: la última frase ("Pruébalo con alguien y verás:")
 * desemboca en la primera ("Te adivino la edad…"), y el último fotograma
 * es visualmente igual que el primero. Sin música: solo efectos de sonido.
 */

export const FPS = 30;

export const T = {
	hook: {from: 0, to: 4.6},
	beats: {deck: 1.6, tile: 3.0}, // cortes dentro del gancho
	cards: {from: 4.6, to: 24.6},
	sum: {from: 24.6, to: 29.2, revealAt: 27.0},
	binary: {from: 29.2, to: 32.4},
	outro: {from: 32.4, to: 35.0},
};

/** Duración de cada pantalla: la primera más larga (enseña la mecánica). */
export const CARD_DUR = [4.0, 3.2, 3.2, 3.2, 3.2, 3.2];
export const CARD_START = CARD_DUR.map((_, i) => T.cards.from + CARD_DUR.slice(0, i).reduce((a, b) => a + b, 0));

export const DURATION_S = T.outro.to;

/** Las 6 pantallas: la k-ésima contiene los números 1..63 con el bit k activo. */
export const CARDS: number[][] = Array.from({length: 6}, (_, k) =>
	Array.from({length: 63}, (_, i) => i + 1).filter((n) => (n >> k) & 1),
);

/** Edad de ejemplo para la escena del binario (27 = 011011). */
export const EXAMPLE_AGE = 27;

export type Caption = {
	from: number; // segundos
	to: number;
	text: string;
	/** palabras que salen en verde (en minúsculas, sin signos) */
	highlight?: string[];
};

/** Texto de la locución, frase a frase, con su momento y su hueco (voice.json). */
import voiceLines from './voice.json';
export const VOICE_LINES: {id: string; at: number; slot: number; text: string}[] = voiceLines;

/** Subtítulos en pantalla (en las pantallas de números no hay: ya lo dice el panel). */
export const CAPTIONS: Caption[] = [
	{from: 0.15, to: 1.55, text: 'Te adivino la edad', highlight: ['edad']},
	{from: 1.6, to: 2.95, text: 'con seis pantallas', highlight: ['seis']},
	{from: 3.0, to: 4.5, text: 'Si sales, suma el verde', highlight: ['suma', 'verde']},
	{from: 24.7, to: 26.0, text: '¿Cuánto te da?', highlight: ['cuánto']},
	{from: 27.0, to: 29.1, text: 'Esa es tu edad', highlight: ['edad']},
	{from: 29.3, to: 30.8, text: 'No es magia: es binario', highlight: ['binario']},
	{from: 30.8, to: 32.3, text: 'Así cuentan las máquinas', highlight: ['máquinas']},
	{from: 32.5, to: 35.0, text: 'Pruébalo con alguien y verás', highlight: ['alguien']},
];

export const s2f = (s: number) => Math.round(s * FPS);
