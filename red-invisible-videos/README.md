# Red Invisible: vídeos con código

Shorts de @EnLaRedInvisible hechos con **Remotion + React Three Fiber**.
Todo es código: cada número, cada tiempo y cada animación es exacto y se puede reutilizar.

## Primer vídeo: "Te adivino la EDAD con 6 pantallas"

- 35 s, 1080×1920, 30 fps.
- **Cíclico:** el último fotograma es igual que el primero, y la última frase
  ("Enséñaselo a alguien y verás:") enlaza con la primera ("Te voy a adivinar la edad").
- Todo el contenido está dentro de la zona segura de Shorts (`SAFE` en `src/theme.ts`).
- Las 6 pantallas están comprobadas para todas las edades del 1 al 63.

| Tiempo | Escena |
|---|---|
| 0–4,6 s | Gancho: "Te adivino la edad" + mascota + panel "?" → "1" |
| 4,6–24,4 s | 6 pantallas de 32 números (3,3 s cada una) |
| 24,4–29,4 s | La suma: "= TU EDAD" |
| 29,4–33,4 s | Explicación: binario (ejemplo con 27 años) |
| 33,4–35 s | Vuelta al plano inicial (bucle) |

## Uso

```bash
npm install
npm run studio          # editor visual en el navegador
npm run render:edad     # vídeo sin voz -> out/edad-sin-voz.mp4
```

### Añadir la voz (ElevenLabs)

```bash
ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... npm run voice
npm run render:edad:voz # vídeo con voz -> out/edad.mp4
```

`npm run voice` genera una pista por frase (`src/edad/voice.json`) y avisa si alguna
no cabe en su hueco.

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
