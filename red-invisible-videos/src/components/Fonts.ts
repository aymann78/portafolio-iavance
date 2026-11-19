import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

let started = false;

/** Carga las tipografías locales (sin depender de Google Fonts en el render). */
export const ensureFonts = () => {
	if (started) return;
	started = true;
	loadFont({family: 'Anton', url: staticFile('fonts/Anton.woff2'), weight: '400'});
	loadFont({family: 'Montserrat', url: staticFile('fonts/Montserrat-800.woff2'), weight: '800'});
	loadFont({family: 'Montserrat', url: staticFile('fonts/Montserrat-600.woff2'), weight: '600'});
};
