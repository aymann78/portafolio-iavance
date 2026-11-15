// Genera TODA la narración en una sola llamada (mejor entonación) y la reparte por escenas
// usando los timestamps por carácter. Uso: node scripts/voice.mjs  [MODEL=eleven_v3]
import fs from 'node:fs';
import path from 'node:path';

const script = JSON.parse(fs.readFileSync('script.json', 'utf8'));
const key = process.env.ELEVENLABS_API_KEY ?? 'proxy-injected';
const voiceId = process.env.VOICE_ID ?? script.voiceId;
const model = process.env.MODEL ?? 'eleven_multilingual_v2';
const outDir = path.join('public', 'voice');
fs.mkdirSync(outDir, {recursive: true});

const full = script.scenes.map((s) => s.text).join(' ');
const body = {
  text: full,
  model_id: model,
  language_code: 'es',
  voice_settings: {stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true, speed: 1.05},
};
const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`, {
  method: 'POST',
  headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
  body: JSON.stringify(body),
});
if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
const data = await res.json();
fs.writeFileSync(path.join(outDir, 'narration.mp3'), Buffer.from(data.audio_base64, 'base64'));

const a = data.alignment;
const words = [];
let cur = '', st = 0, en = 0;
a.characters.forEach((c, i) => {
  if (/\s/.test(c)) {
    if (cur) words.push({w: cur, start: st, end: en});
    cur = '';
  } else {
    if (!cur) st = a.character_start_times_seconds[i];
    cur += c;
    en = a.character_end_times_seconds[i];
  }
});
if (cur) words.push({w: cur, start: st, end: en});

// repartir palabras por escena
let idx = 0;
const scenes = script.scenes.map((s) => {
  const n = s.text.split(/\s+/).filter(Boolean).length;
  const ws = words.slice(idx, idx + n);
  idx += n;
  return {id: s.id, start: ws[0].start, end: ws[ws.length - 1].end, words: ws};
});
const total = words[words.length - 1].end;
fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify({model, voiceId, total, scenes}, null, 1));
for (const s of scenes) console.log(s.id.padEnd(6), s.start.toFixed(2), '→', s.end.toFixed(2));
console.log('total', total.toFixed(2), 's');
