import React from 'react';
import meta from '../../../public/short02/meta.json';
import {makeTimeline, ShortShell, type Sfx} from '../../core/timeline';
import {Hook, Fake, Steal, Why, Tips, Outro} from './scenes';

export const tl02 = makeTimeline(meta);
const w = tl02.wfAbs;
const at = (id: string) => tl02.sc(id).from;

const SFX: Sfx[] = [
  ['sms', 4, 0.6],
  ['impact', w('hook', 'retenido'), 0.4],
  ['pop', w('hook', 'paga'), 0.35],
  ['cash', w('hook', 'euro') + 4, 0.3],
  ['glitch', w('hook', 'no') - 1, 0.5],
  ['impact', w('hook', 'no'), 0.5],
  ['whoosh', at('fake') - 6, 0.45],
  ['alert', w('fake', 'falsa'), 0.35],
  ['whoosh_low', w('fake', 'tarjeta') - 8, 0.45],
  ['whoosh', at('steal') - 6, 0.45],
  ['scramble', w('steal', 'datos'), 0.3],
  ['coins', w('steal', 'cargos'), 0.45],
  ['alert', w('steal', 'cargos'), 0.3],
  ['alert', w('steal', 'cargos') + 12, 0.3],
  ['alert', w('steal', 'cargos') + 24, 0.3],
  ['sms', w('steal', 'código') - 2, 0.55],
  ['whoosh', at('why') - 6, 0.45],
  ['pop', w('why', 'paquete') - 6, 0.3],
  ['pop', w('why', 'paquete') - 2, 0.3],
  ['pop', w('why', 'paquete') + 2, 0.3],
  ['sms', w('why', 'falso'), 0.5],
  ['glitch', w('why', 'mismo'), 0.4],
  ['whoosh', at('tips') - 6, 0.45],
  ['swipe', w('tips', 'nunca') - 2, 0.4],
  ['check', w('tips', 'nunca') + 12, 0.4],
  ['swipe', w('tips', 'entra') - 2, 0.4],
  ['check', w('tips', 'entra') + 12, 0.4],
  ['swipe', w('tips', 'código') - 2, 0.4],
  ['check', w('tips', 'código') + 12, 0.4],
  ['whoosh_low', at('outro') - 6, 0.5],
  ['lock', w('outro', 'bloquea') + 8, 0.6],
  ['impact', w('outro', 'ahora'), 0.5],
];

export const Short02: React.FC = () => (
  <ShortShell
    tl={tl02}
    voice="short02/narration.mp3"
    scenes={{hook: Hook, fake: Fake, steal: Steal, why: Why, tips: Tips, outro: Outro}}
    flash={{hook: '#ffb36b', fake: '#9cc2ff', steal: '#ff8aa0', why: '#7ee8fa', tips: '#86efac', outro: '#9cd8ff'}}
    sfx={SFX}
    keywords={/^(SMS|paquete|retenido|tarjeta|falsa|falso|código|banco|bloquea|nunca|nadie|pagues|cargos|ahora)/i}
  />
);
