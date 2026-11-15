import React from 'react';
import meta from '../../../public/short03/meta.json';
import {makeTimeline, ShortShell, type Sfx} from '../../core/timeline';
import {Hook, Reveal, How, Key, Tips, Outro} from './scenes';

export const tl03 = makeTimeline(meta);
const w = tl03.wfAbs;
const at = (id: string) => tl03.sc(id).from;

const SFX: Sfx[] = [
  ['whoosh_low', 0, 0.5],
  ['pop', 6, 0.35],
  ['sms', w('hook', 'comprador'), 0.45],
  ['pop', w('hook', 'comprador') + 14, 0.35],
  ['sms', w('hook', 'ya'), 0.5],
  ['riser', w('hook', 'bizum') - 6, 0.25],
  ['whoosh', at('reveal') - 6, 0.45],
  ['glitch', w('reveal', 'no') - 1, 0.45],
  ['impact', w('reveal', 'no'), 0.5],
  ['alert', w('reveal', 'solicitud'), 0.35],
  ['whoosh', at('how') - 6, 0.45],
  ['click', w('how', 'aceptar'), 0.55],
  ['coins', w('how', 'aceptar') + 8, 0.5],
  ['glitch', w('how', 'sale'), 0.4],
  ['buzz', w('how', 'sale') + 2, 0.35],
  ['whoosh', at('key') - 6, 0.45],
  ['coins', at('key') + 8, 0.35],
  ['cash', w('key', 'entra'), 0.4],
  ['whoosh', at('tips') - 6, 0.45],
  ['swipe', w('tips', 'aceptar') - 2, 0.4],
  ['buzz', w('tips', 'aceptar') + 10, 0.35],
  ['swipe', w('tips', 'pin') - 2, 0.4],
  ['buzz', w('tips', 'pin') + 10, 0.35],
  ['swipe', w('tips', 'fíjate') - 2, 0.4],
  ['check', w('tips', 'fíjate') + 10, 0.4],
  ['whoosh_low', at('outro') - 6, 0.5],
  ['lock', w('outro', 'nada'), 0.55],
  ['impact', w('outro', 'nada') + 2, 0.4],
];

export const Short03: React.FC = () => (
  <ShortShell
    tl={tl03}
    voice="short03/narration.mp3"
    scenes={{hook: Hook, reveal: Reveal, how: How, key: Key, tips: Tips, outro: Outro}}
    flash={{hook: '#7ee8fa', reveal: '#ff8ad0', how: '#c4b5fd', key: '#86efac', tips: '#ff8ad0', outro: '#86efac'}}
    sfx={SFX}
    keywords={/^(Bizum|solicitud|aceptar|aceptarlo|estafa|PIN|nada|solo|envío|cuidado|inverso|pago|nunca)/i}
  />
);
