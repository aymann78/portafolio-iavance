import json, subprocess, numpy as np
from scipy.signal import resample_poly
from scipy.io import wavfile

SR = 48000
DUR = 31.0
N = int(SR * DUR)

def load(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'sfx/{name}.mp3', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
    pk = np.abs(a).max() or 1
    return a / pk

def pitch(a, factor):
    # factor < 1 -> lower & slower (tape style)
    up, down = 100, int(round(100 * factor))
    return np.stack([resample_poly(a[:, c], up, down) for c in range(2)], axis=1)

def fade(a, fin=0.005, fout=0.05):
    a = a.copy(); n = len(a)
    i = int(fin * SR); o = int(fout * SR)
    if i: a[:i] *= np.linspace(0, 1, i)[:, None]
    if o and o < n: a[-o:] *= np.linspace(1, 0, o)[:, None]
    return a

mix = np.zeros((N, 2), dtype=np.float64)
def place(a, t, gain_db=0.0, pan=0.0, wrap=True):
    g = 10 ** (gain_db / 20)
    s = int(t * SR)
    a = a * g
    a = a * np.array([min(1, 1 - pan), min(1, 1 + pan)])
    for k in range(len(a)):
        break
    end = s + len(a)
    if end <= N:
        mix[s:end] += a
    else:
        mix[s:N] += a[:N - s]
        if wrap:  # wrap tail to the beginning so the loop is seamless
            mix[:end - N] += a[N - s:]

S = {n: load(n) for n in ['tick_a', 'tick_b', 'tick_slow', 'whoosh_1', 'whoosh_2', 'whoosh_rev', 'impact', 'clink', 'dial_lift', 'gears', 'sparkle', 'drone', 'riser', 'heartbeat', 'slowmo_in', 'speedup']}

# ---- drone bed (looped with crossfade, constant level -> seamless loop)
d = S['drone']; xf = int(2.0 * SR)
bed = np.zeros((N + xf, 2))
pos = 0
while pos < N:
    seg = d.copy()
    seg[:xf] *= np.linspace(0, 1, xf)[:, None]; seg[-xf:] *= np.linspace(1, 0, xf)[:, None]
    e = min(len(bed), pos + len(seg)); bed[pos:e] += seg[:e - pos]
    pos += len(seg) - xf
# wrap the overflow onto the start
bed[:xf] += bed[N:N + xf] * 0  # (drone already continuous)
bed = bed[:N]
# duck bed slightly during slow-mo, raise during slow-mo tension
mix += bed * 10 ** (-17 / 20)

# ---- ticks synced to escapement drops
ticks = json.load(open('out/ticks.json'))
for i, tk in enumerate(ticks):
    t, r = tk['t'], tk['r']
    if r > 0.9:
        a = S['tick_a'] if i % 2 == 0 else S['tick_b']
        a = fade(a[: int(0.25 * SR)], 0.001, 0.08)
        # louder when the movement is open and camera is close
        gain = -9 if (t < 3.0 or t > 29.0) else -6
        if 6.5 < t < 13.5: gain = -10
        place(a, t - 0.004, gain, pan=0.15 if i % 2 else -0.15)
    elif r > 0.2:
        a = fade(pitch(S['tick_a'][: int(0.25 * SR)], 0.55), 0.001, 0.1)
        place(a, t, -5)
    else:
        place(fade(S['tick_slow'], 0.001, 0.4), t - 0.03, -1)
        place(fade(S['impact'], 0.001, 0.6), t - 0.03, -6)

# ---- transitions / accents
place(fade(S['whoosh_1']), 2.85, -7, pan=0.2)          # crystal off
place(fade(S['clink'][: int(0.6 * SR)]), 3.05, -12)
place(fade(S['whoosh_2']), 3.75, -4)                   # dial flies through camera
place(fade(S['dial_lift']), 5.15, -9)                  # bridges unlock
place(fade(S['whoosh_1']), 5.75, -8, pan=-0.3)         # bridges fly away
place(fade(S['sparkle']), 6.9, -12)                    # mainspring glow
g = S['gears']; g2 = np.concatenate([g, g])[: int(7.5 * SR)]
g2 = g2 * np.concatenate([np.linspace(0, 1, SR), np.ones(len(g2) - 2 * SR), np.linspace(1, 0, SR)])[:, None]
place(g2, 6.6, -18)                                    # gear-train ambience
place(fade(S['speedup']), 12.4, -12)                   # "would unwind in seconds"
place(fade(S['whoosh_rev']), 13.2, -12)
place(fade(S['slowmo_in']), 15.65, -4)                 # into slow motion
place(fade(S['heartbeat']), 17.2, -10)
place(fade(S['sparkle']), 17.3, -11)                   # ruby
place(fade(S['riser'][: int(2.6 * SR)], 0.3, 0.3), 17.9, -15)  # tension before the drop
place(fade(S['speedup']), 22.9, -8)                    # back to speed
place(fade(S['whoosh_2']), 25.7, -9)                   # pull back
for k, tt in enumerate([26.95, 27.15, 27.35, 27.55]):  # bridges land
    place(fade(S['clink'][: int(0.5 * SR)], 0.001, 0.2), tt, -11, pan=(-0.3 + 0.2 * k))
place(fade(S['riser'][: int(2.5 * SR)], 0.2, 0.3), 26.0, -14)  # counter
place(fade(S['whoosh_rev']), 27.3, -6)                 # dial descends through camera
place(fade(S['impact'][: int(1.2 * SR)], 0.001, 0.5), 29.15, -14)  # dial lands
place(fade(S['whoosh_1']), 28.85, -10, pan=0.2)        # crystal back
place(fade(S['clink'][: int(0.5 * SR)], 0.001, 0.2), 30.05, -12)

# ---- master: soft limiter + normalise
peak = np.abs(mix).max()
mix = np.tanh(mix / peak * 1.4) / np.tanh(1.4)
mix *= 10 ** (-1.0 / 20)
wavfile.write('out/audio.wav', SR, mix.astype(np.float32))
print('audio ok, peak', peak)
