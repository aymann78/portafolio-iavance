import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import * as TL from './timeline.js';

const D2R = Math.PI / 180;
const { L, ESC } = TL;

// ------------------------------------------------------------------ renderer
const SS = +(new URLSearchParams(location.search).get('s') || 1);
const RW = Math.round(TL.W * SS), RH = Math.round(TL.H * SS);
const QP = new URLSearchParams(location.search);
const MSAA = +(QP.get('msaa') || 4), NOBOKEH = QP.get('nobokeh') === '1', NOBLOOM = QP.get('nobloom') === '1', SHADOW = +(QP.get('shadow') || 2048);
const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(1);
renderer.setSize(RW, RH, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050608);
const pmrem = new THREE.PMREMGenerator(renderer);
function studioEnv() {
  const s = new THREE.Scene();
  s.add(new THREE.Mesh(new THREE.SphereGeometry(60, 32, 16), new THREE.MeshBasicMaterial({ color: 0x020203, side: THREE.BackSide })));
  const strip = (w, h, pos, k, col = 0xffffff) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(col).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos); m.lookAt(0, 0, 0); s.add(m);
  };
  strip(40, 7, [-22, 26, 34], 7.0);              // long top-left strip
  strip(7, 46, [40, -4, 20], 4.5, 0xdfe9ff);     // cool right strip
  strip(26, 26, [4, -6, 50], 1.6);               // soft overhead
  strip(14, 5, [-30, -34, 14], 3.5, 0xffd2a0);   // warm kicker
  strip(5, 30, [-42, 4, 6], 2.0);                // left edge line
  const band = new THREE.Mesh(new THREE.CylinderGeometry(55, 55, 14, 48, 1, true).rotateX(Math.PI / 2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0x9aa4b4).multiplyScalar(0.35), side: THREE.BackSide }));
  band.position.z = 4; s.add(band);
  return pmrem.fromScene(s, 0).texture;
}
scene.environment = studioEnv();
scene.environmentIntensity = 1.0;

const camera = new THREE.PerspectiveCamera(30, TL.W / TL.H, 0.05, 3000);

// lights
const key = new THREE.DirectionalLight(0xfff1e0, 3.2);
key.position.set(-30, 45, 70);
key.castShadow = true;
key.shadow.mapSize.set(SHADOW, SHADOW);
key.shadow.bias = -0.0004;
key.shadow.normalBias = 0.01;
scene.add(key, key.target);
const rim = new THREE.DirectionalLight(0xbcd4ff, 1.4);
rim.position.set(40, -30, 25);
scene.add(rim);
const fill = new THREE.HemisphereLight(0x8899aa, 0x080606, 0.12);
scene.add(fill);
const glint = new THREE.PointLight(0xffffff, 0, 20, 2);
scene.add(glint);

// ------------------------------------------------------------------ textures
function canvasTex(size, draw, srgb = false) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}
const rnd = (() => { let s = 12345; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();

// concentric fine grain (wheels)
const texCirc = canvasTex(1024, (g, s) => {
  g.fillStyle = '#808080'; g.fillRect(0, 0, s, s);
  for (let r = 2; r < s * 0.72; r += 1.2) {
    const v = 110 + rnd() * 40;
    g.strokeStyle = `rgba(${v},${v},${v},0.55)`;
    g.lineWidth = 1;
    g.beginPath(); g.arc(s / 2, s / 2, r, 0, Math.PI * 2); g.stroke();
  }
});
// Côtes de Genève stripes
const texStripes = canvasTex(1024, (g, s) => {
  const img = g.createImageData(s, s);
  const period = 64;
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const bx = Math.floor(x / period);
    const cx = (bx + 0.5) * period;
    const d = Math.hypot(x - cx + period * 3, (y % (period * 8)) - period * 4);
    const saw = (x % period) / period;
    const v = 70 + saw * 120 + Math.sin(d * 0.8) * 10 + (rnd() - 0.5) * 18;
    const i = (y * s + x) * 4;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
});
texStripes.wrapS = texStripes.wrapT = THREE.RepeatWrapping;
// perlage (circular graining)
const texPerlage = canvasTex(1024, (g, s) => {
  g.fillStyle = '#777'; g.fillRect(0, 0, s, s);
  const step = 40, R = 30;
  for (let y = 0; y < s + step; y += step * 0.8) for (let x = (Math.round(y / (step * 0.8)) % 2) * step / 2; x < s + step; x += step) {
    const gr = g.createConicGradient(rnd() * 6.28, x, y);
    for (let i = 0; i <= 12; i++) { const v = 90 + ((i % 2) ? 90 : 0) + rnd() * 30; gr.addColorStop(i / 12, `rgb(${v},${v},${v})`); }
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, R, 0, Math.PI * 2); g.fill();
    g.strokeStyle = 'rgba(40,40,40,0.5)'; g.lineWidth = 1.5; g.stroke();
  }
});
texPerlage.wrapS = texPerlage.wrapT = THREE.RepeatWrapping;
// brushed radial (sunburst) bump
const texSun = canvasTex(1024, (g, s) => {
  const gr = g.createConicGradient(0, s / 2, s / 2);
  for (let i = 0; i <= 720; i++) { const v = 100 + rnd() * 80; gr.addColorStop(i / 720, `rgb(${v},${v},${v})`); }
  g.fillStyle = gr; g.fillRect(0, 0, s, s);
});
// dial color map with printing
const texDial = canvasTex(2048, (g, s) => {
  const c = s / 2;
  const rg = g.createRadialGradient(c, c, 0, c, c, c);
  rg.addColorStop(0, '#1d4a9e'); rg.addColorStop(0.65, '#123676'); rg.addColorStop(0.92, '#0a1f47'); rg.addColorStop(1, '#050d22');
  g.fillStyle = rg; g.fillRect(0, 0, s, s);
  // minute track
  g.save(); g.translate(c, c);
  g.strokeStyle = 'rgba(235,240,250,0.9)';
  for (let i = 0; i < 60; i++) {
    g.save(); g.rotate(i * 6 * D2R);
    g.lineWidth = i % 5 === 0 ? 7 : 3.5;
    g.beginPath(); g.moveTo(0, -c * 0.955); g.lineTo(0, -c * (i % 5 === 0 ? 0.905 : 0.925)); g.stroke();
    g.restore();
  }
  // subdial print (small seconds at 6) — sub center at y = +6.61/15.6 * c (texture v flipped later)
  const sy = (6.61 / 15.6) * c, sr = (3.4 / 15.6) * c;
  for (let i = 0; i < 60; i++) {
    g.save(); g.translate(0, sy); g.rotate(i * 6 * D2R);
    g.lineWidth = i % 5 === 0 ? 5 : 2.5;
    g.beginPath(); g.moveTo(0, -sr); g.lineTo(0, -sr * (i % 5 === 0 ? 0.84 : 0.9)); g.stroke();
    g.restore();
  }
  g.fillStyle = 'rgba(235,240,250,0.92)';
  g.textAlign = 'center';
  g.font = '600 58px Georgia, serif';
  g.fillText('MECHANICAL', 0, -c * 0.42);
  g.font = '400 34px Georgia, serif';
  g.fillText('HAND  WOUND  ·  17  JEWELS', 0, -c * 0.35);
  g.restore();
}, true);
// leather
const texLeather = canvasTex(1024, (g, s) => {
  g.fillStyle = '#3a2416'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 26000; i++) { const v = rnd(); g.fillStyle = `rgba(${v > 0.5 ? 90 : 10},${v > 0.5 ? 55 : 5},${v > 0.5 ? 30 : 0},${0.08 + rnd() * 0.12})`; g.beginPath(); g.arc(rnd() * s, rnd() * s, 1 + rnd() * 5, 0, 6.28); g.fill(); }
  g.strokeStyle = '#d9c7a8'; g.lineWidth = 7; g.setLineDash([22, 16]);
  g.beginPath(); g.moveTo(s * 0.07, 0); g.lineTo(s * 0.07, s); g.moveTo(s * 0.93, 0); g.lineTo(s * 0.93, s); g.stroke();
}, true);
texLeather.wrapS = texLeather.wrapT = THREE.RepeatWrapping;
// slate backdrop
const texSlate = canvasTex(1024, (g, s) => {
  g.fillStyle = '#0b0c0e'; g.fillRect(0, 0, s, s);
  for (let i = 0; i < 40000; i++) { const v = 6 + rnd() * 22; g.fillStyle = `rgba(${v},${v},${v + 4},0.25)`; g.fillRect(rnd() * s, rnd() * s, 2 + rnd() * 4, 1 + rnd() * 2); }
}, true);
texSlate.wrapS = texSlate.wrapT = THREE.RepeatWrapping;
texSlate.repeat.set(6, 6);
const texGuilloche = canvasTex(512, (g, s) => {
  g.fillStyle = '#808080'; g.fillRect(0, 0, s, s);
  for (let r = 3; r < s / 2; r += 3) { g.strokeStyle = r % 6 ? '#5a5a5a' : '#b0b0b0'; g.lineWidth = 1.6; g.beginPath(); g.arc(s / 2, s / 2, r, 0, 6.28); g.stroke(); }
});

function dirTex(tangential) {
  return canvasTex(512, (g, s) => {
    const img = g.createImageData(s, s);
    for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
      const dx = x - s / 2 + 0.5, dy = -(y - s / 2 + 0.5);
      let a = Math.atan2(dy, dx); if (tangential) a += Math.PI / 2;
      const i = (y * s + x) * 4;
      img.data[i] = (Math.cos(a) * 0.5 + 0.5) * 255; img.data[i + 1] = (Math.sin(a) * 0.5 + 0.5) * 255; img.data[i + 2] = 255; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
  });
}
const texRadDir = dirTex(false), texTanDir = dirTex(true);
// ------------------------------------------------------------------ materials
const goldPolish = new THREE.MeshPhysicalMaterial({ color: 0xffd58a, metalness: 1, roughness: 0.06 });
const polish = new THREE.MeshPhysicalMaterial({ color: 0xeef1f5, metalness: 1, roughness: 0.05 });
const M = {
  gold: () => { const m = new THREE.MeshPhysicalMaterial({ color: 0xf2c46e, metalness: 1, roughness: 0.3, bumpMap: texCirc, bumpScale: 0.25, anisotropy: 0.85, anisotropyMap: texTanDir }); m.userData.side = goldPolish; return m; },
  steel: new THREE.MeshPhysicalMaterial({ color: 0xdfe3ea, metalness: 1, roughness: 0.17 }),
  steelDark: new THREE.MeshPhysicalMaterial({ color: 0x9aa1ab, metalness: 1, roughness: 0.28 }),
  blued: new THREE.MeshPhysicalMaterial({ color: 0x2f55d4, metalness: 0.85, roughness: 0.22, clearcoat: 0.6 }),
  ruby: new THREE.MeshPhysicalMaterial({ color: 0xff2448, metalness: 0.0, roughness: 0.03, ior: 1.76, clearcoat: 1, clearcoatRoughness: 0.0, specularIntensity: 1, emissive: 0xa0001c, emissiveIntensity: 0.9, sheen: 0.6, sheenColor: new THREE.Color(0xff6080) }),
  bridge: new THREE.MeshPhysicalMaterial({ color: 0x5d636c, metalness: 1, roughness: 0.26, roughnessMap: texStripes, bumpMap: texStripes, bumpScale: 0.9 }),
  plate: new THREE.MeshPhysicalMaterial({ color: 0x3c4047, metalness: 1, roughness: 0.34, roughnessMap: texPerlage, bumpMap: texPerlage, bumpScale: 0.55 }),
  case: new THREE.MeshPhysicalMaterial({ color: 0xe4e7eb, metalness: 1, roughness: 0.05 }),
  caseSat: new THREE.MeshPhysicalMaterial({ color: 0xd4d8de, metalness: 1, roughness: 0.22, anisotropy: 0.9, anisotropyMap: texTanDir }),
  caseBrushed: new THREE.MeshPhysicalMaterial({ color: 0xc9cdd3, metalness: 1, roughness: 0.25, bumpMap: texSun, bumpScale: 0.4 }),
  dial: new THREE.MeshPhysicalMaterial({ map: texDial, metalness: 0.7, roughness: 0.28, anisotropy: 0.95, anisotropyMap: texRadDir, bumpMap: texSun, bumpScale: 0.12, clearcoat: 0.8, clearcoatRoughness: 0.05 }),
  lume: new THREE.MeshStandardMaterial({ color: 0xf2ead2, roughness: 0.6, emissive: 0x3a3a2a }),
  crystal: new THREE.MeshPhysicalMaterial({ color: 0xeef4ff, metalness: 0, roughness: 0.0, transparent: true, opacity: 0.035, depthWrite: false, specularIntensity: 1, envMapIntensity: 2.0 }),
  leather: new THREE.MeshPhysicalMaterial({ map: texLeather, roughness: 0.62, sheen: 0.4, sheenColor: new THREE.Color(0x6b4a33), bumpMap: texLeather, bumpScale: 0.5 }),
  slate: new THREE.MeshStandardMaterial({ map: texSlate, roughness: 0.55, metalness: 0.0 }),
  hair: new THREE.MeshPhysicalMaterial({ color: 0x3b2414, roughness: 0.45, sheen: 1, sheenColor: new THREE.Color(0x8a5a3a), clearcoat: 0.3 }),
  black: new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.6 }),
};
function shadowAll(o) { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; }

// ------------------------------------------------------------------ geometry builders
function gearShape(Z, m, o = {}) {
  const { toothFrac = 0.46, add = 1.0, ded = 1.25, tip = 0.55, spokes = 0, rimW = 0, hubR = 0, spokeW = 0, holeR = 0.1, samples = 10, solidR = 0 } = o;
  const rp = (m * Z) / 2, ra = rp + m * add, rr = rp - m * ded, pitch = (2 * Math.PI) / Z;
  const shape = new THREE.Shape();
  let first = true;
  for (let k = 0; k < Z; k++) {
    for (let j = 0; j < samples * 2; j++) {
      const f = j / (samples * 2);
      let r;
      if (f < toothFrac) { const u = (f - toothFrac / 2) / (toothFrac / 2); r = rr + (ra - rr) * Math.pow(Math.max(0, 1 - u * u), tip); }
      else r = rr;
      const a = k * pitch + (f - toothFrac / 2) * pitch;
      const x = r * Math.cos(a), y = r * Math.sin(a);
      if (first) { shape.moveTo(x, y); first = false; } else shape.lineTo(x, y);
    }
  }
  shape.closePath();
  if (holeR > 0) { const h = new THREE.Path(); h.absarc(0, 0, holeR, 0, Math.PI * 2, true); shape.holes.push(h); }
  if (spokes > 0) {
    const ri = rr - rimW;
    for (let s = 0; s < spokes; s++) {
      const a0 = (s / spokes) * Math.PI * 2 + 0.3, a1 = ((s + 1) / spokes) * Math.PI * 2 + 0.3;
      const dOut = Math.asin(spokeW / 2 / ri), dIn = Math.asin(Math.min(0.99, spokeW / 2 / hubR));
      const h = new THREE.Path();
      const N = 24;
      for (let i = 0; i <= N; i++) { const a = lerp(a0 + dOut, a1 - dOut, i / N); const p = [ri * Math.cos(a), ri * Math.sin(a)]; i ? h.lineTo(...p) : h.moveTo(...p); }
      for (let i = 0; i <= 8; i++) { const a = lerp(a1 - dIn, a0 + dIn, i / 8); h.lineTo(hubR * Math.cos(a), hubR * Math.sin(a)); }
      h.closePath();
      shape.holes.push(h);
    }
  }
  return { shape, ra, rr, rp };
}
const lerp = (a, b, u) => a + (b - a) * u;
function extrude(shape, t, bevel = 0.012, curveSegments = 12) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: t, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments });
  g.translate(0, 0, -t / 2);
  return g;
}
function centeredUV(mat, R) {
  // shape UVs are in mm; map so that the texture is centred on the part
  for (const k of ['map', 'bumpMap', 'roughnessMap', 'anisotropyMap']) if (mat[k]) { const t = mat[k].clone(); t.repeat.set(1 / (2 * R), 1 / (2 * R)); t.offset.set(0.5, 0.5); t.needsUpdate = true; mat[k] = t; }
  return mat;
}
function gearMesh(Z, m, t, mat, o = {}) {
  const { shape, ra } = gearShape(Z, m, o);
  const mesh = new THREE.Mesh(extrude(shape, t, o.bevel ?? 0.012), mat.userData && mat.userData.side ? [mat, mat.userData.side] : mat);
  mesh.userData.ra = ra;
  return mesh;
}
function cyl(r, h, mat, seg = 32) { const g = new THREE.CylinderGeometry(r, r, h, seg); g.rotateX(Math.PI / 2); return new THREE.Mesh(g, mat); }
function ribbonSpiral(n, makePoint, th, h) {
  // n samples; makePoint(i) -> [x,y,nx,ny]; returns {geom, update}
  const verts = new Float32Array(n * 8 * 3), norms = new Float32Array(n * 8 * 3);
  const idx = [];
  for (let side = 0; side < 4; side++) for (let i = 0; i < n - 1; i++) {
    const a = side * 2 * n + i * 2;
    // two verts per sample per side: indices side*2n + 2i, +1
    const b = a + 2;
    idx.push(a, b, a + 1, a + 1, b, b + 1);
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(verts, 3));
  geom.setAttribute('normal', new THREE.BufferAttribute(norms, 3));
  geom.setIndex(idx);
  const update = (param) => {
    for (let i = 0; i < n; i++) {
      const [x, y, nx, ny] = makePoint(i, param);
      const ox = x + nx * th / 2, oy = y + ny * th / 2, ix = x - nx * th / 2, iy = y - ny * th / 2;
      const set = (side, j, px, py, pz, qx, qy, qz) => { const o = (side * 2 * n + i * 2 + j) * 3; verts[o] = px; verts[o + 1] = py; verts[o + 2] = pz; norms[o] = qx; norms[o + 1] = qy; norms[o + 2] = qz; };
      set(0, 0, ox, oy, -h / 2, nx, ny, 0); set(0, 1, ox, oy, h / 2, nx, ny, 0);       // outer
      set(1, 0, ix, iy, h / 2, -nx, -ny, 0); set(1, 1, ix, iy, -h / 2, -nx, -ny, 0);   // inner
      set(2, 0, ix, iy, h / 2, 0, 0, 1); set(2, 1, ox, oy, h / 2, 0, 0, 1);            // top
      set(3, 0, ox, oy, -h / 2, 0, 0, -1); set(3, 1, ix, iy, -h / 2, 0, 0, -1);        // bottom
    }
    geom.attributes.position.needsUpdate = true;
    geom.attributes.normal.needsUpdate = true;
    geom.computeBoundingSphere();
  };
  update(0);
  return { geom, update };
}
function spiralPoint(r0, r1, turns, phase, twist) {
  return (i, n, param) => {
    const s = i / (n - 1);
    const a = phase + s * turns * Math.PI * 2 + (twist ? twist(s, param) : 0);
    const r = r0 + (r1 - r0) * s;
    // normal ~ radial (corrected for pitch)
    const dr = (r1 - r0) / (turns * Math.PI * 2);
    const tx = dr * Math.cos(a) - r * Math.sin(a), ty = dr * Math.sin(a) + r * Math.cos(a);
    const tl = Math.hypot(tx, ty);
    return [r * Math.cos(a), r * Math.sin(a), ty / tl, -tx / tl];
  };
}
function hullOfCircles(circles, seg = 48) {
  const pts = [];
  for (const [x, y, r] of circles) for (let i = 0; i < seg; i++) { const a = (i / seg) * Math.PI * 2; pts.push([x + r * Math.cos(a), y + r * Math.sin(a)]); }
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [], upper = [];
  for (const p of pts) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop(); lower.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop(); upper.push(p); }
  const hull = lower.slice(0, -1).concat(upper.slice(0, -1));
  const s = new THREE.Shape(); hull.forEach((p, i) => (i ? s.lineTo(...p) : s.moveTo(...p))); s.closePath();
  return s;
}

// ------------------------------------------------------------------ watch assembly
const watch = new THREE.Group();
scene.add(watch);
const anchors = {}; // name -> Object3D whose world position is exported

// backdrop
const texBack = canvasTex(1024, (g, s) => {
  const rg = g.createRadialGradient(s * 0.45, s * 0.42, 0, s / 2, s / 2, s * 0.5);
  rg.addColorStop(0, '#2a2d33'); rg.addColorStop(0.35, '#121418'); rg.addColorStop(1, '#010102');
  g.fillStyle = rg; g.fillRect(0, 0, s, s);
}, true);
const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), new THREE.MeshBasicMaterial({ map: texBack }));
backdrop.position.z = -8; scene.add(backdrop);
const slate = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), new THREE.ShadowMaterial({ opacity: 0.7 }));
slate.position.z = -7.5; slate.receiveShadow = true; scene.add(slate);

// main plate
const plateMat = M.plate.clone(); plateMat.bumpMap = texPerlage.clone(); plateMat.roughnessMap = plateMat.bumpMap; plateMat.bumpMap.repeat.set(1 / 7, 1 / 7); plateMat.bumpMap.needsUpdate = true;
const plateShape = new THREE.Shape(); plateShape.absarc(0, 0, 13.2, 0, Math.PI * 2);
const plate = new THREE.Mesh(extrude(plateShape, 0.5, 0.08, 96), [plateMat, polish]);
plate.position.z = -3.75; watch.add(plate);

// ---- gear train
const train = {};
function arbor(name, pos, parts) {
  const g = new THREE.Group(); g.position.set(pos[0], pos[1], 0); watch.add(g);
  const spin = new THREE.Group(); g.add(spin);
  for (const p of parts) spin.add(p);
  const a = cyl(0.1, 4.6, M.steel, 16); a.position.z = -1.3; spin.add(a);
  train[name] = { g, spin, mats: [] };
  anchors[name] = g;
  return train[name];
}
function wheelPart(Z, m, z, t, o, mat) { const ms = gearMesh(Z, m, t, mat, o); ms.position.z = z; return ms; }
const meshPhase = (from, to) => Math.atan2(to[1] - from[1], to[0] - from[0]);

// barrel
const barrelGold = centeredUV(M.gold(), 5.5);
const barrelWheel = wheelPart(80, 0.13, -3.0, 0.3, { holeR: 0.3, samples: 6 }, barrelGold);
const drum = new THREE.Mesh(new THREE.CylinderGeometry(4.65, 4.65, 1.4, 96, 1, true).rotateX(Math.PI / 2), barrelGold);
drum.position.z = -2.25; drum.material.side = THREE.DoubleSide;
const coverShape = new THREE.Shape(); coverShape.absarc(0, 0, 4.7, 0, Math.PI * 2);
const coverHole = new THREE.Path(); coverHole.absarc(0, 0, 4.15, 0, Math.PI * 2, true); coverShape.holes.push(coverHole);
const cover = new THREE.Group(); cover.position.z = -1.52;
cover.add(new THREE.Mesh(extrude(coverShape, 0.12, 0.02, 96), barrelGold));
const coverHub = cyl(1.25, 0.12, barrelGold, 48); cover.add(coverHub);
for (let i = 0; i < 5; i++) { const a = i * 72 * D2R + 0.3; cover.add(bar(1.1 * Math.cos(a), 1.1 * Math.sin(a), 4.3 * Math.cos(a), 4.3 * Math.sin(a), 0.5, 0.12, barrelGold)); }
const msMat = new THREE.MeshPhysicalMaterial({ color: 0x8e96a3, metalness: 1, roughness: 0.18, emissive: 0x000000 });
const mainspringN = 900;
const mainspringPt = spiralPoint(0.85, 4.45, 9.5, 0, null);
const mainspring = ribbonSpiral(mainspringN, (i, p) => mainspringPt(i, mainspringN, p), 0.07, 0.85);
const mainspringMesh = new THREE.Mesh(mainspring.geom, msMat); mainspringMesh.position.z = -2.25;
const barrelHub = cyl(0.8, 1.3, M.steelDark); barrelHub.position.z = -2.25;
const barrel = arbor('barrel', L.B, [barrelWheel, drum, cover, mainspringMesh, barrelHub]);
barrel.mats.push(barrelGold, msMat);
barrelWheel.rotation.z = meshPhase(L.B, L.C) + Math.PI / 80;

// center wheel
const centerGold = centeredUV(M.gold(), 4.5);
const centerWheel = wheelPart(80, 0.11, -1.3, 0.2, { holeR: 0.12, spokes: 4, rimW: 0.35, hubR: 0.55, spokeW: 0.4, samples: 6 }, centerGold);
const centerPinion = wheelPart(10, 0.13, -3.0, 0.55, { holeR: 0, toothFrac: 0.42, tip: 0.5 }, M.steel);
centerPinion.rotation.z = meshPhase(L.B, L.C) + Math.PI;
const center = arbor('center', L.C, [centerWheel, centerPinion]);
center.mats.push(centerGold);
centerWheel.rotation.z = meshPhase(L.C, L.T) + Math.PI / 80;

// third
const thirdGold = centeredUV(M.gold(), 3.9);
const thirdWheel = wheelPart(75, 0.1, -2.6, 0.18, { holeR: 0.1, spokes: 4, rimW: 0.3, hubR: 0.5, spokeW: 0.35, samples: 6 }, thirdGold);
const thirdPinion = wheelPart(10, 0.11, -1.3, 0.5, { holeR: 0, toothFrac: 0.42, tip: 0.5 }, M.steel);
thirdPinion.rotation.z = meshPhase(L.C, L.T) + Math.PI;
const third = arbor('third', L.T, [thirdWheel, thirdPinion]);
third.mats.push(thirdGold);
thirdWheel.rotation.z = meshPhase(L.T, L.F) + Math.PI / 75;

// fourth
const fourthGold = centeredUV(M.gold(), 3.8);
const fourthWheel = wheelPart(80, 0.09, -0.6, 0.16, { holeR: 0.1, spokes: 4, rimW: 0.28, hubR: 0.45, spokeW: 0.3, samples: 6 }, fourthGold);
const fourthPinion = wheelPart(10, 0.1, -2.6, 0.45, { holeR: 0, toothFrac: 0.42, tip: 0.5 }, M.steel);
fourthPinion.rotation.z = meshPhase(L.T, L.F) + Math.PI;
const fourth = arbor('fourth', L.F, [fourthWheel, fourthPinion]);
fourth.mats.push(fourthGold);
fourthWheel.rotation.z = meshPhase(L.F, L.E) + Math.PI / 80;

// escape pinion (world, not mirrored)
const escPinion = wheelPart(8, 0.09, -0.6, 0.4, { holeR: 0, toothFrac: 0.42, tip: 0.5 }, M.steel);
escPinion.rotation.z = meshPhase(L.F, L.E) + Math.PI;
const escArb = arbor('escPin', L.E, [escPinion]);

// ---- escapement (mirrored local frame)
const escG = new THREE.Group();
escG.position.set(L.E[0], L.E[1], 0);
escG.rotation.z = -30 * D2R;
escG.scale.x = -1;
watch.add(escG);

// escape wheel with club teeth: tooth centres at 90° + 24k (local)
function escapeWheelShape() {
  const s = new THREE.Shape();
  const pts = [];
  const prof = [[-3, 1.6], [-2, 2.2], [2.5, 2.12], [5, 1.96], [8, 1.77], [12, 1.63], [16, 1.6], [19, 1.6]];
  for (let k = 0; k < 15; k++) { const c = 90 + 24 * k; for (const [da, r] of prof) { const a = (c + da) * D2R; pts.push([r * Math.cos(a), r * Math.sin(a)]); } }
  pts.forEach((p, i) => (i ? s.lineTo(...p) : s.moveTo(...p))); s.closePath();
  const ri = 1.3, hubR = 0.42, n = 5, w = 0.26;
  for (let q = 0; q < n; q++) {
    const a0 = (q / n) * Math.PI * 2, a1 = ((q + 1) / n) * Math.PI * 2;
    const dO = Math.asin(w / 2 / ri), dI = Math.asin(w / 2 / hubR);
    const h = new THREE.Path();
    for (let i = 0; i <= 20; i++) { const a = lerp(a0 + dO, a1 - dO, i / 20); i ? h.lineTo(ri * Math.cos(a), ri * Math.sin(a)) : h.moveTo(ri * Math.cos(a), ri * Math.sin(a)); }
    for (let i = 0; i <= 6; i++) { const a = lerp(a1 - dI, a0 + dI, i / 6); h.lineTo(hubR * Math.cos(a), hubR * Math.sin(a)); }
    h.closePath(); s.holes.push(h);
  }
  const hh = new THREE.Path(); hh.absarc(0, 0, 0.09, 0, Math.PI * 2, true); s.holes.push(hh);
  return s;
}
const escMat = M.steel.clone(); escMat.emissive = new THREE.Color(0);
const escapeWheel = new THREE.Mesh(extrude(escapeWheelShape(), 0.18, 0.01), escMat);
escapeWheel.position.z = -1.0;
escG.add(escapeWheel);
anchors.escape = escapeWheel;

// pallet fork
const fork = new THREE.Group(); fork.position.set(0, ESC.D, -0.85); escG.add(fork);
anchors.pallet = fork;
const forkMat = M.steel;
function bar(x0, y0, x1, y1, w, t, mat) {
  const len = Math.hypot(x1 - x0, y1 - y0);
  const b = new THREE.Mesh(new RoundedBoxGeometry(len + w, w, t, 2, Math.min(w, t) * 0.3), mat);
  b.position.set((x0 + x1) / 2, (y0 + y1) / 2, 0); b.rotation.z = Math.atan2(y1 - y0, x1 - x0);
  return b;
}
const stoneEntry = [-1.1, 1.905 - ESC.D], stoneExit = [1.1, 1.905 - ESC.D]; // relative to pivot
fork.add(bar(0, 0, stoneEntry[0] * 0.92, stoneEntry[1] * 0.92 - 0.1, 0.34, 0.16, forkMat));
fork.add(bar(0, 0, stoneExit[0] * 0.92, stoneExit[1] * 0.92 - 0.1, 0.34, 0.16, forkMat));
const SL = ESC.Lb - 0.55; // slot centre rel. pivot
fork.add(bar(0, 0, 0, SL - 0.25, 0.24, 0.16, forkMat));
fork.add(bar(-0.15, SL - 0.3, -0.15, SL + 0.17, 0.11, 0.16, forkMat));
fork.add(bar(0.15, SL - 0.3, 0.15, SL + 0.17, 0.11, 0.16, forkMat));
const forkHub = cyl(0.26, 0.3, forkMat); fork.add(forkHub);
const forkArb = cyl(0.07, 3.6, M.steel, 12); forkArb.position.z = -0.6; fork.add(forkArb);
function stone(rel) {
  // rel = stone point relative to pivot; orient long axis toward wheel centre (0,-D) rel pivot
  const O = [0, -ESC.D];
  const d = [O[0] - rel[0], O[1] - rel[1]]; const n = Math.hypot(...d); const u = [d[0] / n, d[1] / n];
  // neutral tip at radius Re - 0.05 from O
  const tip = [O[0] - u[0] * (ESC.Re - 0.05), O[1] - u[1] * (ESC.Re - 0.05)];
  const len = 0.62;
  const m = new THREE.Mesh(new RoundedBoxGeometry(len, 0.2, 0.32, 3, 0.05), M.ruby);
  m.position.set(tip[0] - u[0] * len / 2, tip[1] - u[1] * len / 2, -0.15);
  m.rotation.z = Math.atan2(u[1], u[0]);
  m.castShadow = true;
  return m;
}
const sEntry = stone(stoneEntry), sExit = stone(stoneExit);
fork.add(sEntry, sExit);
anchors.stoneEntry = sEntry; anchors.stoneExit = sExit;

// balance
const balG = new THREE.Group(); balG.position.set(0, ESC.D + ESC.Lb, 0); escG.add(balG);
anchors.balance = balG;
const balSpin = new THREE.Group(); balG.add(balSpin);
const balGold = M.gold(); balGold.color.set(0xf3c77c);
const rimShape = new THREE.Shape(); rimShape.absarc(0, 0, 3.6, 0, Math.PI * 2);
const rimHole = new THREE.Path(); rimHole.absarc(0, 0, 3.2, 0, Math.PI * 2, true); rimShape.holes.push(rimHole);
const balRim = new THREE.Mesh(extrude(rimShape, 0.36, 0.03, 128), [centeredUV(balGold, 3.7), goldPolish]); balRim.position.z = -0.2; balSpin.add(balRim);
for (let i = 0; i < 3; i++) { const a = i * 120 * D2R + 0.2; const b = bar(0, 0, 3.3 * Math.cos(a), 3.3 * Math.sin(a), 0.32, 0.18, balGold); b.position.z = -0.2; balSpin.add(b); }
for (let i = 0; i < 18; i++) {
  const a = (i / 18) * Math.PI * 2;
  const sc = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.28, 16), balGold);
  sc.position.set(3.72 * Math.cos(a), 3.72 * Math.sin(a), -0.2); sc.rotation.z = a - Math.PI / 2; balSpin.add(sc);
}
const balHub = cyl(0.35, 0.35, balGold); balHub.position.z = -0.2; balSpin.add(balHub);
const staff = cyl(0.08, 2.2, M.steel, 12); staff.position.z = -0.4; balSpin.add(staff);
const roller = cyl(0.62, 0.12, M.steel); roller.position.z = -0.85; balSpin.add(roller);
const impulsePin = cyl(0.075, 0.32, M.ruby, 16); impulsePin.position.set(0, -0.55, -0.98); balSpin.add(impulsePin);
// hairspring (outer end fixed, inner end rotates with balance)
const hsN = 1400, hsTurns = 13, hsR0 = 0.45, hsR1 = 2.45;
const hsMat = new THREE.MeshPhysicalMaterial({ color: 0x8fa6ff, metalness: 1, roughness: 0.18 });
const hsPt = spiralPoint(hsR0, hsR1, hsTurns, 0.0, (s, param) => param * (1 - s));
const hairspring = ribbonSpiral(hsN, (i, p) => hsPt(i, hsN, p), 0.035, 0.18);
const hsMesh = new THREE.Mesh(hairspring.geom, hsMat); hsMesh.position.z = 0.18; balG.add(hsMesh);
anchors.hairspring = hsMesh;
const collet = cyl(0.42, 0.2, M.steel); collet.position.z = 0.18; balSpin.add(collet);
const stud = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), M.steel); stud.position.set(hsR1 + 0.15, 0, 0.28); balG.add(stud);
// a human hair, for scale
const hairCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(-9, -3.0, 0.55), new THREE.Vector3(-1.5, -1.1, 0.5), new THREE.Vector3(2, 0.2, 0.47), new THREE.Vector3(9, 2.6, 0.62)]);
const hair = new THREE.Mesh(new THREE.TubeGeometry(hairCurve, 200, 0.036, 10), M.hair);
hair.visible = false; balG.add(hair);
const hairAnchor = new THREE.Object3D(); hairAnchor.position.set(-1.0, -0.95, 0.5); balG.add(hairAnchor); anchors.hair = hairAnchor;
const hsAnchor = new THREE.Object3D(); hsAnchor.position.set(-1.5, -0.9 + 0.15, 0.2); balG.add(hsAnchor); anchors.hsLabel = hsAnchor;

// ---- bridges (lift off / fly away)
const bridges = [];
function bridge(circles, holes, z, flyDir, screws = []) {
  const shape = hullOfCircles(circles);
  for (const [x, y, r] of holes) { const h = new THREE.Path(); h.absarc(x, y, r, 0, Math.PI * 2, true); shape.holes.push(h); }
  const mat = M.bridge.clone();
  for (const k of ['bumpMap', 'roughnessMap']) { mat[k] = texStripes.clone(); mat[k].repeat.set(1 / 14, 1 / 14); mat[k].rotation = 0.5; mat[k].needsUpdate = true; }
  const g = new THREE.Group();
  const m = new THREE.Mesh(extrude(shape, 0.42, 0.09, 32), [mat, polish]); g.add(m);
  for (const [x, y] of screws) {
    const s = cyl(0.48, 0.22, M.blued, 24); s.position.set(x, y, 0.3); g.add(s);
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 0.06), M.black); slot.position.set(x, y, 0.42); slot.rotation.z = rnd() * 3; g.add(slot);
  }
  for (const [x, y] of holes.map((h) => [h[0], h[1]])) {
    const j = cyl(0.34, 0.08, M.ruby, 24); j.position.set(x, y, 0.2); g.add(j);
  }
  g.position.z = z; g.userData = { z, flyDir }; watch.add(g); bridges.push(g);
  return g;
}
bridge([[L.B[0], L.B[1], 5.7], [L.C[0] - 1.0, L.C[1] - 0.6, 1.5], [-10.8, -1.5, 1.5]], [], 0.62, [-38, 22, 26], [[L.B[0] - 3.5, L.B[1] - 2.5], [-10.4, -1.6], [L.B[0] + 2.2, L.B[1] + 3.6]]);
bridge([[L.C[0] + 1.6, L.C[1] - 0.6, 1.4], [L.T[0], L.T[1], 1.25], [L.F[0], L.F[1], 1.3], [L.E[0], L.E[1], 1.1], [-3.5, -9.2, 1.6]], [[L.T[0], L.T[1], 0.2], [L.F[0], L.F[1], 0.2], [L.E[0], L.E[1], 0.18]], 0.55, [30, -26, 28], [[-3.2, -8.8], [1.5, -2.2]]);
bridge([[L.P[0], L.P[1], 0.95], [L.P[0] + 2.8, L.P[1] - 4.0, 1.3]], [[L.P[0], L.P[1], 0.17]], 0.6, [36, -34, 22], [[L.P[0] + 2.5, L.P[1] - 3.8]]);
bridge([[L.BAL[0], L.BAL[1], 1.4], [11.0, 4.0, 2.0]], [[L.BAL[0], L.BAL[1], 0.22]], 1.0, [38, 26, 30], [[10.8, 4.2]]);
// ratchet wheel on barrel bridge
const ratchet = new THREE.Mesh(extrude(gearShape(44, 0.2, { toothFrac: 0.5, tip: 0.3, holeR: 0.5, samples: 5 }).shape, 0.3, 0.02), M.caseBrushed);
const ratchetMat = new THREE.MeshPhysicalMaterial({ color: 0xb9bec6, metalness: 1, roughness: 0.2, anisotropy: 0.95, anisotropyMap: texRadDir }); centeredUV(ratchetMat, 4.6); ratchet.material = [ratchetMat, polish];
ratchet.position.set(L.B[0], L.B[1], 0.42); bridges[0].add(ratchet);
const ratchetScrew = cyl(0.9, 0.25, M.blued); ratchetScrew.position.set(L.B[0], L.B[1], 0.62); bridges[0].add(ratchetScrew);

// ---- case
const caseG = new THREE.Group(); watch.add(caseG);
const caseProf = [[13.4, -4.4], [19.0, -4.4], [19.9, -3.8], [20.3, -1.5], [20.2, 0.8], [19.7, 1.9], [19.2, 2.2], [15.9, 2.2], [15.8, 1.15], [13.4, 1.15]].map(([r, z]) => new THREE.Vector2(r, z));
const caseMid = new THREE.Mesh(new THREE.LatheGeometry(caseProf, 160).rotateX(Math.PI / 2), M.case);
caseG.add(caseMid);
const spacer = new THREE.Mesh(new THREE.LatheGeometry([[13.0, 0.95], [15.85, 0.95], [15.85, 1.15], [13.0, 1.15]].map(([r, z]) => new THREE.Vector2(r, z)), 128).rotateX(Math.PI / 2), M.steelDark);
caseG.add(spacer);
const caseback = cyl(18.8, 0.6, M.caseBrushed, 96); caseback.position.z = -4.6; caseG.add(caseback);
for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
  const ls = new THREE.Shape();
  [[15.5, 1.6], [19.5, 1.2], [22.6, 0.0], [24.4, -1.6], [24.6, -2.6], [23.8, -3.5], [21.0, -3.9], [15.5, -4.2]].forEach((p, i) => (i ? ls.lineTo(...p) : ls.moveTo(...p)));
  ls.closePath();
  const lg = new THREE.ExtrudeGeometry(ls, { depth: 2.6, bevelEnabled: true, bevelThickness: 0.45, bevelSize: 0.45, bevelSegments: 4, curveSegments: 12 });
  lg.translate(0, 0, -1.3);
  lg.applyMatrix4(new THREE.Matrix4().set(0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1));
  const lug = new THREE.Mesh(lg, M.case);
  lug.position.set(sx * 10.9, 0, 0); lug.scale.y = sy; caseG.add(lug);
}
const crown = new THREE.Mesh(extrude(gearShape(36, 0.32, { toothFrac: 0.5, tip: 0.3, holeR: 0, samples: 4 }).shape, 2.6, 0.12), M.case);
crown.rotation.y = Math.PI / 2; crown.position.set(21.9, 0, -1.2); caseG.add(crown);
const crownCap = cyl(2.2, 0.5, M.case); crownCap.rotation.y = Math.PI / 2; crownCap.position.set(23.3, 0, -1.2); caseG.add(crownCap);
const stem = cyl(1.0, 1.6, M.steel); stem.rotation.y = Math.PI / 2; stem.position.set(20.3, 0, -1.2); caseG.add(stem);
// straps
for (const sy of [-1, 1]) {
  const piv = new THREE.Group(); piv.position.set(0, sy * 21.8, -1.9); piv.rotation.x = sy * 0.5; caseG.add(piv);
  const strap = new THREE.Mesh(new RoundedBoxGeometry(18.8, 80, 3.2, 4, 1.2), M.leather.clone());
  strap.material.map = texLeather.clone(); strap.material.map.repeat.set(1, 3.2); strap.material.map.needsUpdate = true;
  strap.position.y = sy * 40; piv.add(strap);
}
// bezel + crystal (fly away together)
const topG = new THREE.Group(); watch.add(topG);
const bezel = new THREE.Mesh(new THREE.LatheGeometry([[15.6, 2.15], [19.2, 2.15], [19.1, 2.6], [18.4, 3.2], [16.4, 3.35], [15.6, 3.1]].map(([r, z]) => new THREE.Vector2(r, z)), 160).rotateX(Math.PI / 2), M.case);
topG.add(bezel);
const crystal = cyl(16.2, 0.7, M.crystal, 128); crystal.position.z = 3.15; topG.add(crystal);

// ---- dial + hands
const dialG = new THREE.Group(); watch.add(dialG);
const dialShape = new THREE.Shape(); dialShape.absarc(0, 0, 15.6, 0, Math.PI * 2);
const dialMesh = new THREE.Mesh(extrude(dialShape, 0.3, 0.02, 160), centeredUV(M.dial, 15.6));
dialMesh.position.z = 1.35; dialG.add(dialMesh);
// fix texture orientation: CylinderGeometry cap uv -> rotate so print reads upright
const subdial = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.05, 96).rotateX(Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0x0f2a5a, metalness: 0.6, roughness: 0.35, bumpMap: texGuilloche, bumpScale: 1.5 }));
subdial.position.set(L.F[0], L.F[1], 1.49); dialG.add(subdial);
for (let i = 0; i < 12; i++) {
  if (i === 6) continue;
  const a = Math.PI / 2 - i * 30 * D2R;
  const w = i === 0 ? 0.9 : 0.6;
  for (const off of i === 0 ? [-0.55, 0.55] : [0]) {
    const idx = new THREE.Mesh(new RoundedBoxGeometry(w, 2.4, 0.45, 2, 0.15), M.case);
    idx.position.set(12.4 * Math.cos(a) + off * Math.sin(a), 12.4 * Math.sin(a) - off * Math.cos(a), 1.65);
    idx.rotation.z = a - Math.PI / 2; dialG.add(idx);
    const lu = new THREE.Mesh(new THREE.BoxGeometry(w * 0.4, 1.6, 0.1), M.lume); lu.position.copy(idx.position); lu.position.z = 1.9; lu.rotation.z = idx.rotation.z; dialG.add(lu);
  }
}
function handShape(len, w, back) {
  const s = new THREE.Shape(); s.moveTo(0, -back); s.lineTo(w, 0.2 * len); s.lineTo(w * 0.55, 0.85 * len); s.lineTo(0, len); s.lineTo(-w * 0.55, 0.85 * len); s.lineTo(-w, 0.2 * len); s.closePath(); return s;
}
const hourHand = new THREE.Group(), minHand = new THREE.Group(), secHand = new THREE.Group();
hourHand.add(new THREE.Mesh(extrude(handShape(8.4, 0.75, 1.4), 0.14, 0.05), M.case));
minHand.add(new THREE.Mesh(extrude(handShape(12.6, 0.62, 1.8), 0.14, 0.05), M.case));
const lumeH = new THREE.Mesh(extrude(handShape(5.2, 0.32, -1.6), 0.05, 0.0), M.lume); lumeH.position.set(0, 1.2, 0.1); hourHand.add(lumeH);
const lumeM = new THREE.Mesh(extrude(handShape(8.4, 0.26, -2.2), 0.05, 0.0), M.lume); lumeM.position.set(0, 1.6, 0.1); minHand.add(lumeM);
hourHand.position.z = 1.95; minHand.position.z = 2.15;
hourHand.rotation.z = -(304 * D2R); minHand.rotation.z = -(48 * D2R);
const hcap = cyl(0.7, 0.5, M.case); hcap.position.z = 2.25;
const secNeedle = new THREE.Mesh(new RoundedBoxGeometry(0.16, 3.9, 0.08, 1, 0.03), M.case); secNeedle.position.y = 1.2; secHand.add(secNeedle);
const secCap = cyl(0.32, 0.2, M.case); secHand.add(secCap);
secHand.position.set(L.F[0], L.F[1], 1.62);
dialG.add(hourHand, minHand, hcap, secHand);

shadowAll(watch);
slate.castShadow = false;
crystal.castShadow = false;
hair.castShadow = true;

// ------------------------------------------------------------------ post
const rt = new THREE.WebGLRenderTarget(RW, RH, { type: THREE.HalfFloatType, samples: MSAA });
const composer = new EffectComposer(renderer, rt);
composer.setPixelRatio(1);
composer.setSize(RW, RH);
composer.addPass(new RenderPass(scene, camera));
const bokeh = new BokehPass(scene, camera, { focus: 100, aperture: 0.0001, maxblur: 0.008 });
if (!NOBOKEH) composer.addPass(bokeh);
const bloom = new UnrealBloomPass(new THREE.Vector2(RW / 2, RH / 2), 0.22, 0.45, 0.96);
if (!NOBLOOM) composer.addPass(bloom);
composer.addPass(new OutputPass());
const vignette = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + uTime*17.0)*43758.5453); }
    void main(){
      vec2 d = vUv-0.5; float r2 = dot(d,d);
      vec2 off = d * r2 * 0.012;
      vec3 c = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      vec2 dd = d; dd.x *= 0.5625;
      float v = smoothstep(0.78, 0.15, length(dd)*1.35); c *= mix(0.42, 1.0, v);
      c = mix(c, c*c*(3.0-2.0*c), 0.35);                               // S-curve contrast
      float l = dot(c, vec3(0.2126,0.7152,0.0722));
      c += mix(vec3(-0.012,0.004,0.018), vec3(0.02,0.008,-0.015), smoothstep(0.1,0.7,l)); // teal shadows / warm highlights
      c += (h(vUv*1500.0)-0.5)*0.03;
      gl_FragColor = vec4(c,1.0); }`,
});
composer.addPass(vignette);

// ------------------------------------------------------------------ per-frame update
const v3 = new THREE.Vector3();
function project(obj) {
  obj.getWorldPosition(v3); v3.project(camera);
  return [(v3.x * 0.5 + 0.5) * TL.W, (1 - (v3.y * 0.5 + 0.5)) * TL.H, v3.z < 1 ? 1 : 0];
}

let accumulate = null;
function update(t) {
  scene.environmentRotation.set(0, 0, (t / TL.DURATION) * Math.PI * 2);
  const tt = TL.tau(t);
  const e = TL.escapement(tt);
  // escape wheel (local, clockwise in local = CCW world)
  const rho = (35 - 12 * e.progress) * D2R;
  escapeWheel.rotation.z = rho;
  fork.rotation.z = e.fork;
  balSpin.rotation.z = e.balance;
  hairspring.update(e.balance);
  // world train angles
  const thE = -(12 * e.progress) * D2R * -1; // world escape angle (mirror flips sign)
  const thEw = (12 * e.progress) * D2R;     // CCW in world
  escArb.spin.rotation.z = thEw;
  const th4 = -thEw * 8 / 80; fourth.spin.rotation.z = th4;
  const th3 = -th4 * 10 / 75; third.spin.rotation.z = th3;
  const thC = -th3 * 10 / 80; center.spin.rotation.z = thC;
  const thB = -thC * 10 / 80; barrel.spin.rotation.z = thB;
  secHand.rotation.z = TL.secondsHand(t);

  // assembly
  const p = TL.parts(t);
  topG.position.set(p.crystal * 18, p.crystal * 10, p.crystal * 170);
  topG.rotation.x = p.crystal * 0.5;
  topG.visible = p.crystal < 0.999;
  dialG.position.set(0, 0, p.dial * 190);
  dialG.rotation.z = p.dial * 0.35;
  dialG.visible = p.dial < 0.999;
  for (const b of bridges) {
    const { z, flyDir } = b.userData;
    b.position.set(flyDir[0] * p.bFly, flyDir[1] * p.bFly, z + p.bLift * 3.5 + flyDir[2] * p.bFly);
    b.rotation.z = p.bFly * 0.4 * Math.sign(flyDir[0]);
    b.visible = p.bFly < 0.999;
  }
  // energy glow
  const en = TL.energy(t);
  const glow = (mat, k, col = 0xff9a2e) => { mat.emissive = mat.emissive || new THREE.Color(); mat.emissive.set(col).multiplyScalar(k * 0.55); };
  glow(barrelGold, en.barrel * 0.22); glow(msMat, en.barrel * 1.6, 0xff7a1a);
  glow(centerGold, en.center * 0.5); glow(thirdGold, en.third * 0.5); glow(fourthGold, en.fourth * 0.5); glow(escMat, en.escape * 0.6, 0xffa040);
  // hair visible only near the hairspring shot
  hair.visible = t > 21.8 && t < 26.5;

  // camera
  const c = TL.camera(t);
  const sh = TL.shake(t);
  camera.position.set(c.pos[0] + sh[0], c.pos[1] + sh[1], c.pos[2] + sh[2]);
  camera.up.set(...c.up).normalize();
  camera.fov = c.fov; camera.updateProjectionMatrix();
  camera.lookAt(...c.tgt);
  const dist = Math.hypot(c.pos[0] - c.tgt[0], c.pos[1] - c.tgt[1], c.pos[2] - c.tgt[2]);
  bokeh.uniforms.focus.value = dist;
  bokeh.uniforms.aperture.value = c.ap * 0.00009 * (60 / Math.max(dist, 3));
  bokeh.uniforms.maxblur.value = 0.012;
  // shadow camera follows the subject
  const sz = Math.max(4, Math.min(45, dist * 0.7));
  key.target.position.set(...c.tgt);
  key.position.set(c.tgt[0] - 30, c.tgt[1] + 45, c.tgt[2] + 70);
  const sc = key.shadow.camera; sc.left = -sz; sc.right = sz; sc.top = sz; sc.bottom = -sz; sc.near = 1; sc.far = 200; sc.updateProjectionMatrix();
  // glint light near the subject during macro
  glint.position.set(c.tgt[0] + 2, c.tgt[1] - 2, c.tgt[2] + 4);
  glint.intensity = dist < 12 ? 6 * (1 - dist / 12) : 0;
  vignette.uniforms.uTime.value = t;

  composer.render();
  if (accumulate) accumulate();
  // anchors
  const a = {};
  for (const [k, o] of Object.entries(anchors)) a[k] = project(o);
  return a;
}

window.__ready = true;
const fbTex = new THREE.FramebufferTexture(RW, RH);
const accRT = new THREE.WebGLRenderTarget(RW, RH, { type: THREE.HalfFloatType });
const qCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const qGeo = new THREE.PlaneGeometry(2, 2);
const addMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: fbTex }, w: { value: 1 } }, vertexShader: 'varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.,1.);}', fragmentShader: 'uniform sampler2D tex; uniform float w; varying vec2 vUv; void main(){ gl_FragColor=vec4(texture2D(tex,vUv).rgb*w, 1.0);}', blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, transparent: true });
const outMat = new THREE.ShaderMaterial({ uniforms: { tex: { value: accRT.texture } }, vertexShader: addMat.vertexShader, fragmentShader: 'uniform sampler2D tex; varying vec2 vUv; void main(){ gl_FragColor=vec4(texture2D(tex,vUv).rgb,1.0);}', depthTest: false, depthWrite: false });
const qScene = new THREE.Scene(); const quad = new THREE.Mesh(qGeo, addMat); quad.frustumCulled = false; qScene.add(quad);
window.renderAt = (t) => {
  const K = TL.subframes(t);
  if (K <= 1) { accumulate = null; return update(t); }
  renderer.setRenderTarget(accRT); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.setRenderTarget(null);
  let anchorsMid = null;
  const shutter = 0.5 / TL.FPS;
  for (let i = 0; i < K; i++) {
    const ts = t + ((i + 0.5) / K - 0.5) * shutter;
    accumulate = () => {
      renderer.copyFramebufferToTexture(fbTex);
      addMat.uniforms.w.value = 1 / K; quad.material = addMat;
      renderer.setRenderTarget(accRT); renderer.autoClear = false; renderer.render(qScene, qCam); renderer.autoClear = true; renderer.setRenderTarget(null);
    };
    const a = update(ts);
    if (i === Math.floor(K / 2)) anchorsMid = a;
  }
  accumulate = null;
  quad.material = outMat; renderer.setRenderTarget(null); renderer.render(qScene, qCam); quad.material = addMat;
  return anchorsMid;
};
window.grab = (type = 'image/png', q) => canvas.toDataURL(type, q);
