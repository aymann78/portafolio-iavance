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
	sum: {from: 24.6, to: 31.7, revealAt: 27.0, countdown: [25.2, 25.8, 26.4], ctaAt: 29.2}, // incluye "¿Acerté? Pónmela en comentarios"
	binary: {from: 31.7, to: 32.9},
	outro: {from: 32.9, to: 35.0},
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
	/** momento exacto (s) en que suena cada palabra, si hay voz real */
	words?: number[];
};

/** Texto de la locución, frase a frase, con su momento y su hueco (voice.json). */
import voiceLines from './voice.json';
export const VOICE_LINES: {id: string; at: number; slot: number; text: string}[] = voiceLines;

/** Tiempos reales de cada palabra (los escribe `npm run voice`). Vacío si aún no hay voz. */
import voiceTiming from './voice-timing.json';
type Word = {w: string; start: number; end: number};
const TIMING: {id: string; words: Word[]}[] = (voiceTiming as {id: string; words: Word[]}[]).map((l) => {
	const at = VOICE_LINES.find((v) => v.id === l.id)?.at ?? 0;
	return {id: l.id, words: l.words.map((w) => ({...w, start: w.start + at, end: w.end + at}))};
});
export const HAS_TIMING = TIMING.length > 0;
const wordAt = (id: string, re: RegExp) => TIMING.find((l) => l.id === id)?.words.find((w) => re.test(w.w))?.start;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Sincronía con la voz: cortes del gancho, cuenta atrás y revelación.
if (HAS_TIMING) {
	const seis = wordAt('hook', /^seis/i);
	const si = wordAt('hook', /^si$/i);
	if (seis !== undefined) T.beats.deck = clamp(seis - 0.08, 1.0, 2.0);
	if (si !== undefined) T.beats.tile = clamp(si - 0.06, T.beats.deck + 1.0, 3.6);
	const cd = [/^tres/i, /^dos/i, /^uno/i].map((re) => wordAt('sum', re));
	if (cd.every((x) => x !== undefined)) T.sum.countdown = cd as number[];
	const tu = wordAt('sum', /^¡?tu$/i);
	if (tu !== undefined) T.sum.revealAt = clamp(tu, T.sum.from + 1.5, T.sum.to - 0.8);
	const cta = VOICE_LINES.find((l) => l.id === 'cta');
	if (cta) T.sum.ctaAt = cta.at;
}

/** Subtítulos en pantalla (en las pantallas de números no hay: ya lo dice el panel). */
export const CAPTIONS: Caption[] = [
	{from: 0.15, to: 1.55, text: 'Te adivino la edad', highlight: ['edad']},
	{from: 1.6, to: 2.95, text: 'con seis pantallas', highlight: ['seis']},
	{from: 3.0, to: 4.5, text: 'Si sales, suma el verde', highlight: ['suma', 'verde']},
	{from: 24.7, to: 26.0, text: '¿Cuánto te da?', highlight: ['cuánto']},
	{from: 28.3, to: 29.3, text: '¡Tu edad!', highlight: ['edad']},
	{from: 29.2, to: 31.7, text: '¿Acerté? Pónmela en comentarios', highlight: ['acerté', 'comentarios']},
	{from: 31.72, to: 32.9, text: 'Es binario', highlight: ['binario']},
	{from: 32.9, to: 35.0, text: 'Pruébalo con alguien y verás', highlight: ['alguien']},
];

const KEYWORDS = ['edad', 'seis', 'suma', 'verde', 'cuánto', 'tres', 'dos', 'uno', 'acerté', 'comentarios', 'magia', 'binario', 'alguien'];
const clean = (w: string) => w.toLowerCase().replace(/[^a-záéíóúñü0-9]/gi, '');

/**
 * Subtítulos desde la voz real: trozos de hasta 4 palabras que cortan en los signos
 * de puntuación y nunca acaban en palabra corta ("y", "con"…), cada palabra aparece cuando suena. En las pantallas no hay
 * subtítulos: la instrucción ya está en grande en la cabecera.
 */
const fromTiming = (): Caption[] => {
	const out: Caption[] = [];
	for (const line of TIMING.filter((l) => !l.id.startsWith('card'))) {
		let chunk: Word[] = [];
		const flush = () => {
			if (!chunk.length) return;
			out.push({
				from: chunk[0].start,
				to: chunk[chunk.length - 1].end + 0.3,
				text: chunk.map((w) => w.w).join(' '),
				highlight: chunk.map((w) => clean(w.w)).filter((w) => KEYWORDS.includes(w)),
				words: chunk.map((w) => w.start),
			});
			chunk = [];
		};
		const WEAK = /^(y|e|o|con|la|el|los|las|de|del|a|al|que|en|tu|su|un|una|es)$/i;
		line.words.forEach((w) => {
			chunk.push(w);
			if (/[.,:;?!…]$/.test(w.w)) return flush();
			if (chunk.length >= 4) {
				// no dejar una palabra corta colgando al final del trozo
				const last = chunk[chunk.length - 1];
				if (WEAK.test(clean(last.w))) {
					chunk.pop();
					flush();
					chunk = [last];
				} else flush();
			}
		});
		flush();
	}
	// cada trozo dura hasta que empieza el siguiente (sin huecos que parpadeen)
	out.forEach((c, i) => {
		const next = out[i + 1];
		if (next && next.from - c.to < 0.6) c.to = next.from;
	});
	return out;
};
export const CAPTIONS_SYNCED: Caption[] = HAS_TIMING ? fromTiming() : CAPTIONS;

export const s2f = (s: number) => Math.round(s * FPS);
