import React, {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const FACES: [string, string, string][] = [
  ['Inter', 'fonts/inter-latin-600-normal.woff2', '600'],
  ['Inter', 'fonts/inter-latin-800-normal.woff2', '800'],
  ['Inter', 'fonts/inter-latin-900-normal.woff2', '900'],
  ['JetBrains Mono', 'fonts/jetbrains-mono-latin-500-normal.woff2', '500'],
  ['JetBrains Mono', 'fonts/jetbrains-mono-latin-700-normal.woff2', '700'],
];

let loaded: Promise<void> | null = null;
const loadAll = () => {
  if (!loaded) {
    loaded = Promise.all(
      FACES.map(async ([family, file, weight]) => {
        const f = new FontFace(family, `url(${staticFile(file)}) format('woff2')`, {weight});
        await f.load();
        (document.fonts as any).add(f);
      }),
    ).then(() => undefined);
  }
  return loaded;
};

/** No renderiza los hijos hasta que las fuentes están cargadas (las texturas canvas las necesitan). */
export const FontGate: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    loadAll().then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);
  return ready ? <>{children}</> : null;
};

export const SANS = 'Inter, "Helvetica Neue", Arial, sans-serif';
export const MONO = '"JetBrains Mono", Menlo, monospace';
