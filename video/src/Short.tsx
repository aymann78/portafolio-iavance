import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {SCENES, wfAbs, type SceneId} from './core/timing';
import {Captions, Flash} from './core/overlay';
import {FontGate} from './core/fonts';
import {Hook} from './scenes/Hook';
import {Twin} from './scenes/Twin';
import {Route} from './scenes/Route';
import {Https} from './scenes/Https';
import {Tips} from './scenes/Tips';
import {Outro} from './scenes/Outro';

const COMP: Record<SceneId, React.FC> = {hook: Hook, twin: Twin, route: Route, https: Https, tips: Tips, outro: Outro};
const FLASH: Record<SceneId, string> = {hook: '#9cc2ff', twin: '#7ee8fa', route: '#ff8aa0', https: '#86efac', tips: '#86efac', outro: '#9cc2ff'};

const at = (id: SceneId) => SCENES.find((s) => s.id === id)!.from;

/** Diseño de sonido: [archivo, frame absoluto, volumen] */
const SFX: [string, number, number][] = [
  ['whoosh_low', 0, 0.55],
  ['ping', wfAbs('hook', 'wifi'), 0.35],
  ['glitch', wfAbs('hook', 'puede') - 1, 0.5],
  ['impact', wfAbs('hook', 'puede'), 0.55],
  // twin
  ['whoosh', at('twin') - 6, 0.45],
  ['pop', wfAbs('twin', 'redes'), 0.35],
  ['pop', wfAbs('twin', 'redes') + 6, 0.25],
  ['riser', wfAbs('twin', 'crear') - 10, 0.25],
  ['pop', wfAbs('twin', 'mismo'), 0.4],
  ['glitch', wfAbs('twin', 'gemelo') - 1, 0.45],
  ['impact', wfAbs('twin', 'gemelo'), 0.45],
  // route
  ['whoosh', at('route') - 6, 0.45],
  ['click', wfAbs('route', 'conecta') + 10, 0.45],
  ['data', wfAbs('route', 'todo'), 0.3],
  ['whoosh_low', wfAbs('route', 'portátil') - 6, 0.4],
  ['alert', wfAbs('route', 'portátil') + 6, 0.35],
  // https
  ['whoosh', at('https') - 6, 0.45],
  ['lock', wfAbs('https', 'candado'), 0.6],
  ['scramble', wfAbs('https', 'cifrado') - 3, 0.35],
  ['whoosh', wfAbs('https', 'malo') - 9, 0.45],
  ['glitch', wfAbs('https', 'página'), 0.4],
  ['pop', wfAbs('https', 'idéntica'), 0.35],
  ['click', wfAbs('https', 'des'), 0.3],
  ['click', wfAbs('https', 'des') + 5, 0.25],
  ['click', wfAbs('https', 'des') + 10, 0.25],
  ['alert', wfAbs('https', 'contraseña') + 2, 0.35],
  // tips
  ['whoosh', at('tips') - 6, 0.45],
  ['whoosh', wfAbs('tips', 'usa') - 2, 0.3],
  ['check', wfAbs('tips', 'usa') + 14, 0.4],
  ['whoosh', wfAbs('tips', 'desactiva') - 2, 0.3],
  ['check', wfAbs('tips', 'desactiva') + 14, 0.4],
  ['whoosh', wfAbs('tips', 'mira') - 2, 0.3],
  ['check', wfAbs('tips', 'mira') + 14, 0.4],
  // outro
  ['whoosh_low', at('outro') - 6, 0.5],
  ['riser', at('outro') + 10, 0.25],
  ['glitch', wfAbs('outro', 'aeropuerto') + 6, 0.35],
  ['impact', wfAbs('outro', 'aeropuerto') + 8, 0.4],
];

export const Short: React.FC = () => (
  <FontGate>
    <AbsoluteFill style={{background: '#000'}}>
      {SCENES.map((s) => {
        const C = COMP[s.id];
        return (
          <Sequence key={s.id} from={s.from} durationInFrames={s.dur} name={s.id}>
            <C />
            <Flash color={FLASH[s.id]} />
          </Sequence>
        );
      })}
      <Captions />
      <Audio src={staticFile('voice/narration.mp3')} />
      {SFX.map(([name, frame, vol], i) => (
        <Sequence key={i} from={Math.max(0, frame)} name={`sfx-${name}`}>
          <Audio src={staticFile(`sfx/${name}.mp3`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  </FontGate>
);
