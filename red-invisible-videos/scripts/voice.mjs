#!/usr/bin/env node
/**
 * Genera la voz del Short con ElevenLabs, frase a frase.
 *
 *   npm run voice                       (voz y modelo por defecto)
 *   ELEVENLABS_VOICE_ID=yyy npm run voice  (otra voz)
 *
 * Por cada frase de src/edad/voice.json guarda:
 *   public/voice/edad/<id>.mp3   el audio
 *   public/voice/edad/<id>.json  el tiempo de cada carácter (para ajustar subtítulos)
 * y avisa si alguna frase no cabe en su hueco.
 */
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';

// En Claude Code la clave la inyecta el proxy: basta con un valor de relleno.
const KEY = process.env.ELEVENLABS_API_KEY ?? 'proxy-injected';
// Voz por defecto: "Manu Arias - Español Viral" (español de España). Elegida por
// tener la entonación más variada (menos "voz de IA") entre las candidatas.
const VOICE = process.env.ELEVENLABS_VOICE_ID ?? 'cfU714yVeokYQrpdyev5';
// Eleven v4: en las pruebas, ~45 % más variación de tono que multilingual v2.
const MODEL = process.env.ELEVENLABS_MODEL ?? 'eleven_v4';
// Un poco más rápida que la natural: encaja con el ritmo de Shorts.
const SPEED = Number(process.env.ELEVENLABS_SPEED ?? 1.06);

const allLines = JSON.parse(readFileSync(new URL('../src/edad/voice.json', import.meta.url)));
// ONLY=cta,binary npm run voice  -> regenera solo esas frases (ahorra créditos)
const ONLY = process.env.ONLY?.split(',').map((x) => x.trim());
const lines = ONLY ? allLines.filter((l) => ONLY.includes(l.id)) : allLines;
const timingUrl = new URL('../src/edad/voice-timing.json', import.meta.url);
let oldTiming = [];
try {
	oldTiming = JSON.parse(readFileSync(timingUrl));
} catch {}
const outDir = new URL('../public/voice/edad/', import.meta.url);
mkdirSync(outDir, {recursive: true});

/** Convierte la alineación por caracteres de ElevenLabs en palabras con inicio/fin absolutos. */
function toWords(al, offset) {
	const words = [];
	let cur = null;
	al.characters.forEach((ch, i) => {
		if (/\s/.test(ch)) {
			if (cur) words.push(cur);
			cur = null;
			return;
		}
		if (!cur) cur = {w: '', start: offset + al.character_start_times_seconds[i], end: 0};
		cur.w += ch;
		cur.end = offset + al.character_end_times_seconds[i];
	});
	if (cur) words.push(cur);
	return words.map((x) => ({...x, start: +x.start.toFixed(3), end: +x.end.toFixed(3)}));
}

let previous = ONLY ? allLines[allLines.findIndex((l) => l.id === lines[0]?.id) - 1]?.text : undefined;
const timing = [];
for (const line of lines) {
	const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps`, {
		method: 'POST',
		headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'},
		body: JSON.stringify({
			text: line.text,
			model_id: MODEL,
			// misma voz y ritmo en todas las frases
			previous_text: previous,
			voice_settings: {stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true, speed: SPEED},
		}),
	});
	if (!res.ok) {
		console.error(`Error en "${line.id}": ${res.status} ${await res.text()}`);
		process.exit(1);
	}
	const data = await res.json();
	writeFileSync(new URL(`${line.id}.mp3`, outDir), Buffer.from(data.audio_base64, 'base64'));
	writeFileSync(new URL(`${line.id}.json`, outDir), JSON.stringify(data.alignment, null, 2));
	const ends = data.alignment?.character_end_times_seconds ?? [];
	const dur = ends.length ? ends[ends.length - 1] : 0;
	const ok = dur <= line.slot;
	console.log(`${ok ? '✓' : '⚠'} ${line.id.padEnd(7)} ${dur.toFixed(2)}s / hueco ${line.slot}s  ${ok ? '' : '<- NO CABE: acorta la frase o sube el hueco'}`);
	previous = line.text;
	timing.push({id: line.id, words: toWords(data.alignment, 0)});
}
// Tiempos de cada palabra RELATIVOS al inicio de su frase (el vídeo les suma `at`
// de voice.json): así se puede mover una frase sin volver a generarla.
const merged = allLines.map((l) => timing.find((x) => x.id === l.id) ?? oldTiming.find((x) => x.id === l.id)).filter(Boolean);
writeFileSync(timingUrl, JSON.stringify(merged, null, '\t') + '\n');
console.log('\nListo. Renderiza con voz:  npm run render:edad:voz');
