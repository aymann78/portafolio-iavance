// Genera el logo de la Llama en SVG. Uso: node llama.svg.js > llama.svg  (modo: mark | badge)
const mode = process.argv[2] || 'mark';
const OUT = "M500 925 C300 925 185 795 185 630 C185 500 255 420 325 335 C345 440 395 475 428 487 C412 380 447 245 562 80 C592 232 705 300 775 452 C838 575 815 710 762 785 C712 875 612 925 500 925 Z";
const MID = "M500 890 C335 890 255 785 255 655 C255 560 315 510 378 440 C388 520 430 548 462 553 C455 470 490 378 562 262 C602 372 682 425 718 522 C753 612 738 712 692 778 C652 848 580 890 500 890 Z";
const INN = "M500 858 C395 858 338 783 338 702 C338 640 380 598 428 546 C444 598 470 620 497 626 C496 568 522 515 562 462 C593 528 655 575 664 660 C672 764 604 858 500 858 Z";
const COR = "M500 840 C430 840 402 790 408 742 C413 700 452 668 500 606 C548 668 588 700 593 742 C598 790 570 840 500 840 Z";
const flame = `
  <g filter="url(#glow)" opacity=".9"><path d="${OUT}" fill="#ff5a10" opacity=".55"/></g>
  <path d="${OUT}" fill="url(#gOut)"/>
  <path d="${OUT}" fill="url(#gShade)"/>
  <path d="${OUT}" fill="url(#gHi)"/>
  <path d="${MID}" fill="url(#gMid)"/>
  <path d="${MID}" fill="none" stroke="#c4300a" stroke-opacity=".35" stroke-width="5"/>
  <path d="${INN}" fill="url(#gInn)"/>
  <path d="${INN}" fill="none" stroke="#ff9a1a" stroke-opacity=".55" stroke-width="4"/>
  <path d="${COR}" fill="url(#gCor)"/>
  <!-- detalles internos: filos de luz -->
  <path d="M232 600 C228 530 262 480 306 424" fill="none" stroke="#ffd9a0" stroke-opacity=".55" stroke-width="7" stroke-linecap="round"/>
  <path d="M300 722 C284 690 286 650 310 610" fill="none" stroke="#fff1c8" stroke-opacity=".5" stroke-width="6" stroke-linecap="round"/>
  <path d="M580 150 C575 200 598 238 626 280" fill="none" stroke="#ffe3b0" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/>
  <path d="M730 560 C752 610 748 668 722 716" fill="none" stroke="#7a1500" stroke-opacity=".28" stroke-width="9" stroke-linecap="round"/>
  <!-- chispas -->
  <path d="M668 150 C676 126 688 120 700 106 C704 126 700 144 688 156 Z" fill="#ffb02e"/>
  <path d="M396 198 C402 180 410 176 418 166 C422 180 418 192 410 200 Z" fill="#ff8a1a"/>
  <path d="M760 258 C764 246 770 244 776 236 C778 246 776 254 770 260 Z" fill="#ffd36a"/>
  <circle cx="322" cy="262" r="7" fill="#ffb02e"/><circle cx="640" cy="64" r="6" fill="#ffd36a"/><circle cx="820" cy="360" r="5" fill="#ff8a1a"/><circle cx="232" cy="370" r="5" fill="#ff6a10"/>
`;
const defs = `<defs>
  <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9a12"/><stop offset=".45" stop-color="#ff5412"/><stop offset="1" stop-color="#c9120c"/></linearGradient>
  <linearGradient id="gShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffb060" stop-opacity=".0"/><stop offset=".55" stop-color="#800" stop-opacity=".0"/><stop offset="1" stop-color="#6a0a00" stop-opacity=".38"/></linearGradient>
  <linearGradient id="gHi" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff0c0" stop-opacity=".30"/><stop offset=".3" stop-color="#fff0c0" stop-opacity="0"/></linearGradient>
  <linearGradient id="gMid" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd02a"/><stop offset=".6" stop-color="#ff9418"/><stop offset="1" stop-color="#ff6a10"/></linearGradient>
  <linearGradient id="gInn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6b0"/><stop offset="1" stop-color="#ffc835"/></linearGradient>
  <linearGradient id="gCor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#fff0b0"/></linearGradient>
  <radialGradient id="bg" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="#1b1f33"/><stop offset=".7" stop-color="#0b0d18"/><stop offset="1" stop-color="#05060c"/></radialGradient>
  <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc233"/><stop offset=".5" stop-color="#ff6a10"/><stop offset="1" stop-color="#c9120c"/></linearGradient>
  <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="30"/></filter>
</defs>`;
const body = mode === 'badge'
 ? `<circle cx="500" cy="500" r="490" fill="url(#bg)"/><circle cx="500" cy="500" r="470" fill="none" stroke="url(#ring)" stroke-width="14"/>
    <circle cx="500" cy="500" r="446" fill="none" stroke="#ffb35a" stroke-opacity=".25" stroke-width="3"/>
    <g transform="translate(500 535) scale(.8) translate(-500 -500)">${flame}</g>`
 : flame;
console.log(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">${defs}${body}</svg>`);
