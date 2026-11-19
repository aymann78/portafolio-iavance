#!/usr/bin/env node
/**
 * Genera la voz del Short con ElevenLabs, frase a frase.
 *
 *   ELEVENLABS_API_KEY=xxx ELEVENLABS_VOICE_ID=yyy npm run voice
 *
 * Por cada frase de src/edad/voice.json guarda:
 *   public/voice/edad/<id>.mp3   el audio
 *   public/voice/edad/<id>.json  el tiempo de cada carácter (para ajustar subtítulos)
 * y avisa si alguna frase no cabe en su hueco.
 */
import {mkdirSync, readFileSync, writeFileSync} from 'node:fs';

const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE = process.env.ELEVENLABS_VOICE_ID;
const MODEL = process.env.ELEVENLABS_MODEL ?? 'eleven_multilingual_v2';
if (!KEY || !VOICE) {
	console.error('Faltan ELEVENLABS_API_KEY y/o ELEVENLABS_VOICE_ID.');
	process.exit(1);
}

const lines = JSON.parse(readFileSync(new URL('../src/edad/voice.json', import.meta.url)));
const outDir = new URL('../public/voice/edad/', import.meta.url);
mkdirSync(outDir, {recursive: true});

let previous;
for (const line of lines) {
	const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps`, {
		method: 'POST',
		headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'},
		body: JSON.stringify({
			text: line.text,
			model_id: MODEL,
			// misma voz y ritmo en todas las frases
			previous_text: previous,
			voice_settings: {stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true},
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
}
console.log('\nListo. Renderiza con voz:  npm run render:edad:voz');
