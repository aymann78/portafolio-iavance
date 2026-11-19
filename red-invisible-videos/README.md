# Red Invisible: vídeos con código

Shorts de @EnLaRedInvisible hechos con **Remotion + React Three Fiber**.
Todo es código: cada número, cada tiempo y cada animación es exacto y se puede reutilizar.

## Primer vídeo: "Te adivino la EDAD con 6 pantallas"

- 35 s, 1080×1920, 30 fps.
- **Cíclico:** el último fotograma es igual que el primero, y la última frase
  ("Pruébalo con alguien y verás:") enlaza con la primera ("Te adivino la edad…").
- Todo el contenido está dentro de la zona segura de Shorts (`SAFE` en `src/theme.ts`).
- Las 6 pantallas están comprobadas para todas las edades del 1 al 63.

| Tiempo | Escena |
|---|---|
| 0–4,6 s | Gancho en 3 cortes: escaneo, abanico de 6 pantallas, "¡SÚMALO!" |
| 4,6–24,6 s | 6 pantallas "¿Sale tu edad? +N" (la primera de 4 s; el resto, 3,2 s) |
| 24,6–29,8 s | "TU SUMA" + cuenta atrás + "¡TU EDAD!" sincronizados con la voz |
| 29,8–32,4 s | "No es magia: es código binario" (ejemplo con 27 años) |
| 32,4–35 s | Vuelta al plano inicial (bucle) |

## Uso

```bash
npm install
npm run studio          # editor visual en el navegador
npm run render:edad     # vídeo sin voz -> renders/edad-sin-voz.mp4
```

### Voz (ElevenLabs)

```bash
npm run voice           # genera public/voice/edad/*.mp3 + src/edad/voice-timing.json
npm run render:edad:voz # vídeo con voz y audio a -14 LUFS -> renders/edad.mp4
```

- Voz por defecto: **Manu Arias - Español Viral** (español de España), modelo **Eleven v4**,
  velocidad 1,06. Se cambia con `ELEVENLABS_VOICE_ID`, `ELEVENLABS_MODEL` y `ELEVENLABS_SPEED`.
- En Claude Code la clave la inyecta el proxy (no hace falta ponerla). En tu ordenador:
  `ELEVENLABS_API_KEY=... npm run voice`.
- Con los tiempos reales de cada palabra, el vídeo sincroniza solo los subtítulos, los cortes del
  gancho ("seis", "Si sales"), la cuenta atrás ("tres, dos, uno") y el golpe "¡Tu edad!".
- `scripts/master.sh` deja el audio a -14 LUFS, el nivel al que normaliza YouTube.
- El vídeo no lleva música: solo voz y efectos de sonido.

## Estructura

```
src/
  theme.ts               colores, tipografías y zona segura
  components/
    Mascot.tsx           la mascota 3D (cabeza blanca, bufanda roja)
    Stage3D.tsx          cámara, luces y texturas de texto 3D
    SpaceBackground.tsx  fondo espacial (periódico, para el bucle)
    Captions.tsx         subtítulos palabra a palabra
  edad/
    script.ts            línea de tiempo, pantallas y subtítulos
    voice.json           texto de la locución
    HookScene / CardScene / SumScene / BinaryScene
public/
  fonts/                 Anton y Montserrat (locales)
  sfx/                   efectos de sonido generados con ffmpeg
scripts/voice.mjs        generador de voz con ElevenLabs
```

## Licencias

Remotion es gratuito para particulares y empresas de hasta 3 personas.
Las tipografías son de Google Fonts (OFL). Los efectos de sonido están generados aquí mismo.
