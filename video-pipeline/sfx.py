"""Sintetiza efectos de sonido por código (sin música) y los mezcla con la narración.
Entrada: out/render/events.json (generado por la escena 3D) + out/audio/narracion.wav
Salida:  out/audio/final.wav"""
import json, sys, wave, numpy as np
from scipy import signal

SR = 44100
rng = np.random.default_rng(2024)
def t_(d): return np.arange(int(d * SR)) / SR
def env_ad(n, a=.01, d=.3, p=3.0):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d * p / 3)
def fade(x, i=.02, o=.05):
    n = len(x); fi, fo = int(i * SR), int(o * SR)
    if fi: x[:min(fi, n)] *= np.linspace(0, 1, min(fi, n))
    if fo: x[-min(fo, n):] *= np.linspace(1, 0, min(fo, n))
    return x
def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [max(lo, 20), min(hi, SR / 2 - 100)], 'band', fs=SR, output='sos'), x)
def lp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, 'low', fs=SR, output='sos'), x)
def hp(x, f, order=2): return signal.sosfilt(signal.butter(order, f, 'high', fs=SR, output='sos'), x)
def noise(n): return rng.standard_normal(n).astype(np.float64)
def sweep_filter(x, f0, f1, q=.7, blocks=60, kind='band'):
    """Filtro con frecuencia central variable por bloques (con estado continuo)."""
    n = len(x); out = np.zeros(n); bs = max(1, n // blocks); zi = None
    for b in range(0, n, bs):
        f = f0 * (f1 / f0) ** (b / n); seg = x[b:b + bs]
        sos = signal.butter(2, [f / (1 + q), min(f * (1 + q), SR / 2 - 200)], 'band', fs=SR, output='sos')
        if zi is None: zi = np.zeros((sos.shape[0], 2))
        o, zi = signal.sosfilt(sos, seg, zi=zi); out[b:b + bs] = o
    return out
def norm(x, peak=1.0): m = np.max(np.abs(x)) or 1; return x / m * peak
def sine(f, d, ph=0): return np.sin(2 * np.pi * f * t_(d) + ph)
def chirp(f0, f1, d, expo=True):
    t = t_(d); k = (f1 / f0) ** (1 / d)
    ph = 2 * np.pi * f0 * (k ** t - 1) / np.log(k) if expo else 2 * np.pi * (f0 * t + (f1 - f0) * t ** 2 / (2 * d))
    return np.sin(ph)

# ---------- sonidos ----------
def whoosh(d=1.0, g=1, **k):
    n = int(d * SR); x = sweep_filter(noise(n), 250, 4200, q=1.2)
    e = np.sin(np.pi * np.linspace(0, 1, n) ** 1.3) ** 2; x = norm(x) * e
    return x * .8 * g, 'pan'
def sweep(d=1.5, g=1, **k):
    n = int(d * SR); x = sweep_filter(noise(n), 5000, 200, q=1.0); e = np.exp(-np.linspace(0, 1, n) * 3.2)
    return norm(x) * e * .8 * g, 'pan'
def boom(g=1, **k):
    d = 2.6; t = t_(d); x = chirp(95, 28, d) * np.exp(-t * 1.6) * 1.0
    x += lp(noise(len(t)), 220) * np.exp(-t * 3.2) * .9; x += .5 * sine(55, d) * np.exp(-t * 2.4)
    x[:int(.004 * SR)] += np.linspace(0, 1, int(.004 * SR)) * 1.5
    return norm(x) * g, 'accent'
def hit(g=1, **k):
    d = 1.4; t = t_(d); x = chirp(160, 48, d) * np.exp(-t * 7) + .45 * bp(noise(len(t)), 900, 5000) * np.exp(-t * 22)
    for f, a in ((523, .12), (731, .09), (1170, .05)): x += a * sine(f, d) * np.exp(-t * 4.5)
    return norm(x) * g * .9, 'accent'
def riser(d=3, g=1, **k):
    n = int(d * SR); t = np.arange(n) / SR; u = t / d
    x = sweep_filter(noise(n), 200, 7000, q=1.5) * 1.0 + .25 * np.sin(2 * np.pi * np.cumsum(180 + 1500 * u ** 2.2) / SR)
    x = norm(x) * (u ** 2.2); x[-int(.03 * SR):] *= np.linspace(1, 0, int(.03 * SR))
    return x * .8 * g, 'bed'
def tick(g=1, p=1, **k):
    d = .12; t = t_(d); x = hp(noise(len(t)), 2500) * np.exp(-t * 480) + .6 * sine(1900 * p, d) * np.exp(-t * 130)
    return norm(x) * g * .8, 'fx'
def blip(g=1, p=1, **k):
    t = t_(.28); x = np.zeros(len(t))
    for i, (f, dl) in enumerate(((880, 0), (1320, .07))):
        s = int(dl * SR); tt = t[:len(t) - s]; x[s:] += np.sin(2 * np.pi * f * p * tt) * np.exp(-tt * 28) * (1 if i == 0 else .7)
    return norm(x) * g * .7, 'fx'
def zap(d=1.0, g=1, **k):
    n = int(d * SR); x = chirp(5000, 240, d) * np.exp(-np.linspace(0, 1, n) * 2.2); x += .3 * hp(noise(n), 3000) * np.exp(-np.linspace(0, 1, n) * 6)
    return norm(x) * g * .6, 'pan'
def bell(freqs, d, g, decay):
    t = t_(d); x = sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * decay / (1 + i * .6)) for i, (f, a) in enumerate(freqs))
    return norm(x) * g * .75
def ping(g=1, **k): return bell([(1318, 1), (2637, .35), (3951, .15)], 1.6, g, 3.2), 'accent'
def ding(g=1, **k): return bell([(880, 1), (1760, .5), (2640, .25), (3520, .12)], 2.6, g, 2.2), 'accent'
def sparkle(d=2, g=1, **k):
    n = int(d * SR); x = np.zeros(n)
    for _ in range(int(d * 20)):
        s = rng.integers(0, max(1, n - int(.3 * SR))); f = rng.uniform(2200, 7000); tt = t_(.25)
        x[s:s + len(tt)] += rng.uniform(.2, 1) * np.sin(2 * np.pi * f * tt) * np.exp(-tt * rng.uniform(14, 30))
    return fade(norm(x) * g * .55, .05, .4), 'fx'
def rumble(d=3, g=1, **k):
    n = int(d * SR); t = np.arange(n) / SR; x = lp(noise(n), 90, 3) * (.6 + .4 * np.sin(2 * np.pi * 3.3 * t)); x += .3 * lp(noise(n), 200) * np.sin(2 * np.pi * .7 * t) ** 2
    return fade(norm(x) * g * .9, min(1.2, d / 3), min(1.0, d / 3)), 'bed'
def crackle(d=1, g=1, **k):
    n = int(d * SR); x = np.zeros(n)
    for _ in range(int(d * 55)):
        s = rng.integers(0, max(1, n - 400)); L = rng.integers(20, 360); x[s:s + L] += rng.uniform(-1, 1, L) * np.hanning(L) * rng.uniform(.2, 1)
    x = hp(x, 1500); return norm(x) * g * .7, 'fx'
def wind(d=5, g=1, **k):
    n = int(d * SR); t = np.arange(n) / SR; x = sweep_filter(noise(n), 300, 900, q=1.3) * (.55 + .45 * np.sin(2 * np.pi * .13 * t + 1) * np.sin(2 * np.pi * .31 * t))
    return fade(norm(x) * g * .6, 1.2, 1.5), 'bed'
def waves(d=8, g=1, **k):
    n = int(d * SR); t = np.arange(n) / SR; sw = (np.sin(2 * np.pi * t / 6.9 - 1.5) * .5 + .5) ** 1.6
    x = lp(noise(n), 700, 2) * (.25 + .75 * sw) + .45 * hp(lp(noise(n), 5500), 1800) * sw ** 2
    return fade(norm(x) * g * .8, 1.5, 1.8), 'bed'
def heartbeat(d=3, g=1, **k):
    n = int(d * SR); x = np.zeros(n); tt = t_(.16); th = sine(58, .16) * np.exp(-tt * 22)
    s = 0.0
    while s < d - .3:
        for off, a in ((0, 1), (.27, .7)):
            i = int((s + off) * SR)
            if i + len(tt) < n: x[i:i + len(tt)] += th * a
        s += 1.05
    return norm(x) * g * .9, 'bed'
def hum(d=3, g=1, **k):
    n = int(d * SR); t = np.arange(n) / SR; x = sum(a * np.sin(2 * np.pi * f * t) for f, a in ((60, 1), (120, .5), (180, .3), (240, .15))) * (.8 + .2 * np.sin(2 * np.pi * 7 * t))
    x += .08 * hp(noise(n), 4000); return fade(norm(x) * g * .5, 1, 1), 'bed'
KINDS = dict(whoosh=whoosh, sweep=sweep, boom=boom, hit=hit, riser=riser, tick=tick, blip=blip, zap=zap, ping=ping, ding=ding,
             sparkle=sparkle, rumble=rumble, crackle=crackle, wind=wind, waves=waves, heartbeat=heartbeat, hum=hum)

def main(events_path, narr_path, out_path, total):
    n = int(total * SR) + SR
    buses = {k: np.zeros((n, 2)) for k in ('fx', 'bed', 'accent')}
    for ev in json.load(open(events_path)):
        fn = KINDS.get(ev['k']); 
        if fn is None: print('sin sonido para', ev['k']); continue
        kw = {k: v for k, v in ev.items() if k not in ('k', 't')}
        res = fn(**kw); snd, bus = res if isinstance(res, tuple) else (res, 'fx')
        s = int(ev['t'] * SR); L = len(snd)
        if s < 0: snd, s = snd[-s:], 0
        L = min(len(snd), n - s); snd = snd[:L]
        if bus == 'pan':
            p = np.linspace(.15, .85, L); st = np.stack([snd * np.sqrt(1 - p), snd * np.sqrt(p)], 1); buses['fx'][s:s + L] += st
        else: buses[bus][s:s + L] += np.stack([snd, snd], 1) * .75
    # narración
    with wave.open(narr_path) as w: nsr = w.getframerate(); nar = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64) / 32768
    if nsr != SR: nar = signal.resample_poly(nar, SR, nsr)
    nar = hp(nar, 70, 2); nar = np.pad(nar, (0, max(0, n - len(nar))))[:n]
    nar = nar / np.max(np.abs(nar)) * .9
    # compresión suave de la voz
    nar = np.tanh(nar * 1.5) / np.tanh(1.5) * .95
    # sidechain: ducking de efectos mientras habla
    e = np.abs(nar); k = int(.12 * SR); env = np.convolve(e, np.ones(k) / k, 'same'); env = np.clip(env / .12, 0, 1); env = lp(env, 6, 1)
    duck = 1 - .6 * np.clip(env, 0, 1)
    mix_fx = buses['fx'] * duck[:, None] * 1.0 + buses['bed'] * (1 - .8 * np.clip(env, 0, 1))[:, None] * .8
    mix_ac = buses['accent'] * (1 - .25 * np.clip(env, 0, 1))[:, None]
    sfx = mix_fx + mix_ac
    # reverb corta
    ir = noise(int(1.1 * SR)) * np.exp(-np.linspace(0, 1, int(1.1 * SR)) * 6); ir[0] = 0
    wet = np.stack([signal.fftconvolve(sfx[:, c], ir)[:n] for c in range(2)], 1); wet = wet / (np.max(np.abs(wet)) or 1) * np.max(np.abs(sfx)) * .3
    sfx = sfx + wet
    sfx = sfx / (np.max(np.abs(sfx)) or 1) * .62
    final = sfx + np.stack([nar, nar], 1) * 1.0
    final = np.tanh(final * .95) / np.tanh(.95)
    final = final / np.max(np.abs(final)) * .95
    pcm = (final * 32767).astype(np.int16)
    with wave.open(out_path, 'wb') as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
    print('mezcla lista:', out_path, f'{n / SR:.1f}s', 'eventos por tipo:', {k: sum(1 for e_ in json.load(open(events_path)) if e_['k'] == k) for k in KINDS})

if __name__ == '__main__':
    info = json.load(open('out/render/info.json'))
    main('out/render/events.json', 'out/audio/narracion.wav', 'out/audio/final.wav', info['duration'])
