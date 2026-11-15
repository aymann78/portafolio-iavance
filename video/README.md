# Shorts de ciberseguridad — pipeline

Vídeos verticales (1080×1920, 30 fps) hechos con **Remotion + React Three Fiber**, voz y efectos de **ElevenLabs**. Sin música, sin personas.

## Flujo
1. Escribe el guion en `script.json` (una entrada por escena).
2. `npm run voice` → genera `public/voice/narration.mp3` + `meta.json` (tiempos por palabra).
3. `npm run sfx` → genera los efectos en `public/sfx/` (solo los que falten).
4. `npm run studio` → previsualiza y ajusta.
5. `npm run render` y `npm run master` → `out/short01.mp4` normalizado a -14 LUFS (estándar YouTube).

> En el entorno cloud, Node necesita el proxy: `export NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt`.
> La clave de ElevenLabs la inyecta el proxy; en local usa `ELEVENLABS_API_KEY=sk_...`.

## Estructura
- `src/core/` — tiempos sincronizados con la voz (`wf('escena','palabra')`), estudio 3D (iluminación, bloom, viñeta, grano, aberración), subtítulos y overlays.
- `src/models/devices.tsx` — modelos 3D (móvil, punto de acceso, portátil, candado, emblema wifi, flujos de datos, tarjetas).
- `src/models/screens.ts` — interfaces dibujadas en las pantallas (ajustes Wi‑Fi, terminal, portal de login, tarjetas).
- `src/scenes/` — una escena por archivo; cada vídeo nuevo debería tener escenas propias, no reutilizar el mismo aspecto.
- `src/Short.tsx` — montaje, voz y diseño de sonido (efectos colocados sobre palabras concretas).
