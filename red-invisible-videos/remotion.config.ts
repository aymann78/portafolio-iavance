import {Config} from '@remotion/cli/config';

// Chromium preinstalado en este entorno. En tu ordenador puedes borrar esta línea
// y Remotion descargará su propio navegador.
const LOCAL_CHROME =
	'/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';

import {existsSync} from 'node:fs';
if (existsSync(LOCAL_CHROME)) {
	Config.setBrowserExecutable(LOCAL_CHROME);
}

// WebGL por software (sin GPU). En un ordenador con gráfica puedes usar 'angle'.
Config.setChromiumOpenGlRenderer('swangle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(16);
Config.setPixelFormat('yuv420p');
Config.setOverwriteOutput(true);
