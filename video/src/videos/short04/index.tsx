import React from 'react';
import meta from '../../../public/short04/meta.json';
import {makeTimeline, ShortShell, type Sfx} from '../../core/timeline';
import {Hook, Leak, Stuff, DominoScene, Tips, Outro} from './scenes';

export const tl04 = makeTimeline(meta);
const w = tl04.wfAbs;
const at = (id: string) => tl04.sc(id).from;

const SFX: Sfx[] = [
  ['keys', 0, 0.45],
  ['pop', 3, 0.25],
  ['pop', 9, 0.25],
  ['riser', w('hook', 'realidad') - 10, 0.25],
  ['unlock', w('hook', 'tuya'), 0.55],
  ['glitch', w('hook', 'tuya') + 2, 0.4],
  ['impact', w('hook', 'tuya') + 3, 0.45],
  ['whoosh', at('leak') - 6, 0.45],
  ['glitch', w('leak', 'filtran'), 0.45],
  ['scramble', w('leak', 'filtran') + 4, 0.35],
  ['whoosh_low', w('leak', 'listas') - 6, 0.4],
  ['whoosh', at('stuff') - 6, 0.45],
  ['typing', at('stuff') + 4, 0.3],
  ['buzz', at('stuff') + 20, 0.25],
  ['typing', w('stuff', 'automática'), 0.35],
  ['buzz', w('stuff', 'automática') + 8, 0.25],
  ['buzz', w('stuff', 'automática') + 17, 0.25],
  ['buzz', w('stuff', 'correo') + 4, 0.25],
  ['buzz', w('stuff', 'banco') + 4, 0.25],
  ['buzz', w('stuff', 'redes') + 4, 0.25],
  ['whoosh', at('domino') - 6, 0.45],
  ['pop', w('domino', 'coincide'), 0.35],
  ['unlock', w('domino', 'dentro'), 0.55],
  ['impact', w('domino', 'dentro'), 0.4],
  ['domino', w('domino', 'cambiar'), 0.6],
  ['whoosh', at('tips') - 6, 0.45],
  ['pop', w('tips', 'distinta'), 0.3],
  ['click', w('tips', 'gestor'), 0.4],
  ['whoosh', w('tips', 'activa') - 6, 0.45],
  ['check', w('tips', 'verificación') + 6, 0.4],
  ['buzz', w('tips', 'aunque') + 14, 0.3],
  ['buzz', w('tips', 'aunque') + 21, 0.3],
  ['buzz', w('tips', 'aunque') + 28, 0.3],
  ['lock', w('tips', 'no'), 0.55],
  ['whoosh_low', at('outro') - 6, 0.5],
  ['typing', w('outro', 'busca'), 0.3],
  ['alert', w('outro', 'puede'), 0.4],
  ['impact', w('outro', 'puede') + 2, 0.35],
];

export const Short04: React.FC = () => (
  <ShortShell
    tl={tl04}
    voice="short04/narration.mp3"
    scenes={{hook: Hook, leak: Leak, stuff: Stuff, domino: DominoScene, tips: Tips, outro: Outro}}
    flash={{hook: '#c4b5fd', leak: '#ff8aa0', stuff: '#93c5fd', domino: '#ff8ad0', tips: '#86efac', outro: '#c4b5fd'}}
    sfx={SFX}
    keywords={/^(contraseña|misma|filtran|millones|automática|dentro|gestor|verificación|pasos|filtración|Pwned|distinta|tuya)/i}
  />
);
