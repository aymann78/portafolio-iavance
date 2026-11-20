import * as TL from './timeline.mjs';
import fs from 'fs';
fs.writeFileSync('out/ticks.json', JSON.stringify(TL.tickTimes()));
console.log(TL.tickTimes().filter(x => x.r < 0.5));
