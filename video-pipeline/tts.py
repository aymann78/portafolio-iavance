"""Sintetiza cada frase con Piper (open source, CPU) y guarda audio + tiempos."""
import json, sys, wave, numpy as np
from piper import PiperVoice, SynthesisConfig
from script_luna import SCENES

VOICE = sys.argv[1] if len(sys.argv) > 1 else "es_MX-claude-high"
VOICES_DIR = sys.argv[2] if len(sys.argv) > 2 else "voices"
OUT = "out/audio"
GAP_SENT, GAP_SCENE, LEAD = 0.35, 0.8, 0.5

import os; os.makedirs(OUT, exist_ok=True)
v = PiperVoice.load(f"{VOICES_DIR}/{VOICE}.onnx")
sr = v.config.sample_rate
cfg = SynthesisConfig(length_scale=1.02, noise_scale=0.6, noise_w_scale=0.7)

def synth(text):
    chunks = [np.frombuffer(c.audio_int16_bytes, dtype=np.int16) for c in v.synthesize(text, syn_config=cfg)]
    return np.concatenate(chunks)

timeline, pcm, t = [], [np.zeros(int(LEAD*sr), np.int16)], LEAD
for sid, sents in SCENES:
    start = t
    items = []
    for i, s in enumerate(sents):
        a = synth(s); d = len(a)/sr
        items.append({"text": s, "start": t, "end": t+d})
        pcm.append(a); t += d
        gap = GAP_SCENE if i == len(sents)-1 else GAP_SENT
        pcm.append(np.zeros(int(gap*sr), np.int16)); t += gap
    timeline.append({"id": sid, "start": start, "end": t, "sentences": items})
audio = np.concatenate(pcm)
with wave.open(f"{OUT}/narracion.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(audio.tobytes())
json.dump({"duration": t, "sr": sr, "scenes": timeline}, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
words = sum(len(s.split()) for _, ss in SCENES for s in ss)
print(f"voz={VOICE} palabras={words} duración={t:.1f}s ({t/60:.2f} min)")
for sc in timeline: print(f"  {sc['id']:8s} {sc['start']:6.1f} -> {sc['end']:6.1f}")
