// Genera efectos de sonido con ElevenLabs Sound Effects. Uso: node scripts/sfx.mjs
import fs from 'node:fs';
import path from 'node:path';

const key = process.env.ELEVENLABS_API_KEY ?? 'proxy-injected';
const outDir = path.join('public', 'sfx');
fs.mkdirSync(outDir, {recursive: true});

const sfx = {
  whoosh: ['Fast clean cinematic whoosh transition, airy swipe, no music', 0.8],
  whoosh_low: ['Deep heavy cinematic whoosh pass-by with low rumble, no music', 1.2],
  impact: ['Deep sub bass cinematic impact hit with short tail, trailer boom, no music', 1.5],
  glitch: ['Short digital glitch stutter, data corruption, electronic error burst', 0.8],
  click: ['Soft modern UI click tap, clean interface sound', 0.5],
  pop: ['Soft bubbly UI pop, smooth notification appear sound', 0.5],
  ping: ['Clean digital radar ping, single sonar blip, futuristic', 1.0],
  data: ['Fast digital data transfer chirps and bleeps, computer processing, subtle', 2.5],
  alert: ['Short tense security warning alarm beep, two tones, modern', 1.0],
  lock: ['Metallic padlock click shut, satisfying mechanical lock', 0.6],
  scramble: ['Digital text scramble decoding sound, fast computer typing glitchy', 1.2],
  check: ['Positive success confirm chime, short clean UI', 0.7],
  riser: ['Short tension riser, rising synth swell, builds up suspense, no melody', 2.0],
};

for (const [name, [text, dur]] of Object.entries(sfx)) {
  const file = path.join(outDir, `${name}.mp3`);
  if (fs.existsSync(file)) continue;
  const res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {
    method: 'POST',
    headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
    body: JSON.stringify({text, duration_seconds: dur, prompt_influence: 0.6}),
  });
  if (!res.ok) {
    console.log('FAIL', name, res.status, await res.text());
    continue;
  }
  fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  console.log('ok', name);
}
