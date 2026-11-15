// Genera la voz de cada escena con ElevenLabs (con timestamps por palabra).
// Uso: ELEVENLABS_API_KEY=sk_... node scripts/voice.mjs
import fs from 'node:fs';
import path from 'node:path';

const script = JSON.parse(fs.readFileSync('script.json', 'utf8'));
const key = process.env.ELEVENLABS_API_KEY ?? 'proxy-injected';
const voiceId = process.env.VOICE_ID ?? script.voiceId;
const outDir = path.join('public', 'voice');
fs.mkdirSync(outDir, {recursive: true});

const meta = [];
for (const scene of script.scenes) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
      body: JSON.stringify({
        text: scene.text,
        model_id: 'eleven_multilingual_v2',
        language_code: 'es',
        voice_settings: {stability: 0.4, similarity_boost: 0.75, style: 0.35, use_speaker_boost: true},
      }),
    },
  );
  if (!res.ok) throw new Error(`${scene.id}: ${res.status} ${await res.text()}`);
  const data = await res.json();
  fs.writeFileSync(path.join(outDir, `${scene.id}.mp3`), Buffer.from(data.audio_base64, 'base64'));

  // caracteres -> palabras
  const {characters, character_start_times_seconds: s, character_end_times_seconds: e} = data.alignment;
  const words = [];
  let cur = '', st = 0, en = 0;
  characters.forEach((c, i) => {
    if (/\s/.test(c)) {
      if (cur) words.push({w: cur, start: st, end: en});
      cur = '';
    } else {
      if (!cur) st = s[i];
      cur += c;
      en = e[i];
    }
  });
  if (cur) words.push({w: cur, start: st, end: en});
  meta.push({id: scene.id, audio: `voice/${scene.id}.mp3`, duration: en, words});
  console.log(`ok ${scene.id} ${en.toFixed(2)}s`);
}
fs.writeFileSync(path.join(outDir, 'meta.json'), JSON.stringify(meta, null, 1));
