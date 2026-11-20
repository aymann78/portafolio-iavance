# Genera la voz en off (ElevenLabs), la ajusta a cada hueco y la mezcla sobre out/audio.wav
import json, os, subprocess, sys, urllib.request
import numpy as np
from scipy.io import wavfile

VOICE = os.environ.get('VOICE', 'ZCh4e9eZSUf41K4cmCEL')  # Emilio
SR = 48000; DUR = 31.0; N = int(SR * DUR)
# (inicio, fin máximo, texto)
LINES = [
    (0.12, 2.50, 'Este reloj no tiene pila.'),
    (2.55, 4.70, '¿Entonces cómo sigue haciendo tic-tac?'),
    (6.90, 9.80, 'Al darle cuerda, cargas un muelle.'),
    (9.85, 12.40, 'La energía fluye por los engranajes...'),
    (12.45, 14.20, '...y se descargaría en segundos.'),
    (14.25, 16.95, 'Salvo que esto la frene. Cinco veces por segundo.'),
    (17.00, 18.80, 'Un diente se bloquea en un rubí...'),
    (18.82, 20.30, '...el volante lo suelta de golpe...'),
    (20.62, 22.60, '...y avanza un diente.'),
    (23.00, 25.95, 'Este muelle es más fino que un pelo. Marca el ritmo.'),
    (26.00, 28.70, 'Cuatrocientos treinta y dos mil tics al día.'),
    (28.75, 30.70, 'Y aun así...'),
]
os.makedirs('vo/lines', exist_ok=True)

def tts(i, text, prev, nxt):
    out = f'vo/lines/l{i:02d}.mp3'
    if os.path.exists(out): return out
    body = json.dumps({'text': text, 'model_id': 'eleven_multilingual_v2',
        'previous_text': prev, 'next_text': nxt,
        'voice_settings': {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.35,
                           'use_speaker_boost': True, 'speed': 1.08}}).encode()
    req = urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128',
        data=body, headers={'xi-api-key': 'dummy', 'Content-Type': 'application/json'})
    open(out, 'wb').write(urllib.request.urlopen(req).read())
    return out

def load(path, filt=''):
    af = 'silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse'
    if filt: af += ',' + filt
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-af', af, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)

vo = np.zeros(N)
report = []
for i, (a, b, text) in enumerate(LINES):
    prev = LINES[i - 1][2] if i else 'Y aun así...'
    nxt = LINES[i + 1][2] if i + 1 < len(LINES) else 'Este reloj no tiene pila.'
    p = tts(i, text, prev, nxt)
    x = load(p); d = len(x) / SR; slot = b - a
    tempo = 1.0
    if d > slot:
        tempo = min(d / slot, 1.35)
        x = load(p, f'atempo={tempo:.4f}')
    s = int(a * SR); e = min(N, s + len(x))
    x = x[: e - s].copy(); f = int(0.01 * SR); x[-f:] *= np.linspace(1, 0, f)
    vo[s:e] += x
    report.append((round(a, 2), round(d, 2), round(slot, 2), round(tempo, 3), round(a + len(x) / SR, 2), text))
for r in report: print(r)

# Cadena de voz: paso alto, presencia, compresión ligera
wavfile.write('vo/vo_raw.wav', SR, vo.astype(np.float32))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', 'vo/vo_raw.wav', '-af',
    'highpass=f=85,equalizer=f=220:t=q:w=1:g=-2,equalizer=f=3500:t=q:w=1.2:g=3,acompressor=threshold=-20dB:ratio=3:attack=5:release=120:makeup=2,'
    'aecho=0.8:0.5:35:0.06', '-ar', str(SR), 'vo/vo_proc.wav'], check=True)
_, v = wavfile.read('vo/vo_proc.wav'); v = v.astype(np.float64)
v = v[:N] if len(v) >= N else np.pad(v, (0, N - len(v)))

_, m = wavfile.read('out/audio.wav'); m = m.astype(np.float64)[:N]
# ducking: envolvente suave de la voz -> baja SFX ~7 dB mientras habla (los tics del drop se mantienen)
env = np.abs(v); k = int(0.25 * SR)
env = np.convolve(env, np.ones(k) / k, 'same'); env = np.clip(env / (env.max() * 0.15), 0, 1)
duck = 1 - env * (1 - 10 ** (-7 / 20))
v = v / np.abs(v).max() * 10 ** (-6 / 20)
out = m * duck[:, None] + np.stack([v, v], 1) * 1.0
pk = np.abs(out).max(); out = np.tanh(out / pk * 1.3) / np.tanh(1.3) * 10 ** (-1 / 20)
wavfile.write('out/audio_vo_es.wav', SR, out.astype(np.float32))
print('ok')
