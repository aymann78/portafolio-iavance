/**
 * "Te adivino la EDAD con 6 pantallas"
 *
 * Toda la línea de tiempo del vídeo sale de aquí. Cuando grabemos la voz con
 * ElevenLabs, sustituiremos estos tiempos por los tiempos reales de cada palabra.
 *
 * El vídeo es cíclico: la última frase ("Enséñaselo a alguien y verás:")
 * desemboca en la primera ("Te voy a adivinar la edad"), y el último fotograma
 * es visualmente igual que el primero.
 */

export const FPS = 30;

export const T = {
	hook: {from: 0, to: 4.6},
	cards: {from: 4.6, each: 3.3}, // 6 pantallas -> termina en 24.4
	sum: {from: 24.4, to: 29.4},
	binary: {from: 29.4, to: 33.4},
	outro: {from: 33.4, to: 35.0},
};

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
	{from: 0.15, to: 1.6, text: 'Te voy a adivinar la edad', highlight: ['edad']},
	{from: 1.6, to: 3.0, text: 'Solo mira seis pantallas', highlight: ['seis']},
	{from: 3.0, to: 4.5, text: 'Si sales, apunta el número verde', highlight: ['verde']},
	{from: 24.6, to: 27.3, text: 'Ahora suma los números verdes', highlight: ['suma', 'verdes']},
	{from: 27.5, to: 29.3, text: 'Esa es tu edad', highlight: ['edad']},
	{from: 29.5, to: 31.1, text: 'No es magia: es binario', highlight: ['binario']},
	{from: 31.1, to: 33.3, text: 'Así cuenta tu ordenador', highlight: ['ordenador']},
	{from: 33.5, to: 35.0, text: 'Enséñaselo a alguien y verás', highlight: ['alguien']},
];

export const s2f = (s: number) => Math.round(s * FPS);
