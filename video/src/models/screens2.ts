import {roundRect} from '../core/studio';
import {SANS, MONO} from '../core/fonts';
import {lockIcon, wifiIcon} from './screens';

const F = (w: number, px: number, fam = SANS) => `${w} ${px}px ${fam}`;
const clip01 = (x: number) => Math.max(0, Math.min(1, x));

/** Ajusta texto a varias líneas. Devuelve la y final. */
export const wrap = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number, maxLines = 6) => {
  const words = text.split(' ');
  let line = '';
  let n = 0;
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, y + n * lh);
      n++;
      line = w;
      if (n >= maxLines) return y + n * lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, y + n * lh);
  return y + (n + 1) * lh;
};

const statusBar = (ctx: CanvasRenderingContext2D, w: number, dark = true) => {
  ctx.fillStyle = dark ? '#fff' : '#0b0f19';
  ctx.font = F(700, 34);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.fillText('9:41', 70, 62);
  wifiIcon(ctx, w - 170, 76, 40, 3, dark ? '#fff' : '#0b0f19');
  roundRect(ctx, w - 128, 48, 58, 28, 8);
  ctx.strokeStyle = dark ? '#fff' : '#0b0f19';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillRect(w - 123, 53, 40, 18);
};

const base = (ctx: CanvasRenderingContext2D, w: number, h: number, top: string, bottom: string) => {
  roundRect(ctx, 0, 0, w, h, 78);
  ctx.save();
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
};

/* ============ Pantalla de bloqueo con notificaciones ============ */
export type Notif = {app: string; title: string; body: string; appear: number; color?: string; danger?: number};
export const drawLockScreen = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {notifs: Notif[]; wall?: [string, string]}) => {
  const [a, b] = o.wall ?? ['#1b2550', '#3b1d4f'];
  base(ctx, w, h, a, b);
  // brillos de fondo
  const rg = ctx.createRadialGradient(w * 0.3, h * 0.75, 0, w * 0.3, h * 0.75, w);
  rg.addColorStop(0, 'rgba(255,140,90,.35)');
  rg.addColorStop(1, 'rgba(255,140,90,0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);
  statusBar(ctx, w);
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.textAlign = 'center';
  ctx.font = F(600, 34);
  ctx.fillText('martes, 14 de noviembre', w / 2, 200);
  ctx.fillStyle = '#fff';
  ctx.font = F(800, 190);
  ctx.fillText('9:41', w / 2, 330);
  ctx.textAlign = 'left';
  let y = 520;
  o.notifs.forEach((n) => {
    if (n.appear <= 0.001) return;
    ctx.save();
    ctx.globalAlpha = clip01(n.appear * 1.3);
    ctx.translate(0, (1 - n.appear) * -60);
    const hh = 220;
    roundRect(ctx, 26, y, w - 52, hh, 40);
    ctx.fillStyle = 'rgba(245,245,250,.86)';
    ctx.fill();
    if (n.danger) {
      ctx.strokeStyle = `rgba(255,45,85,${n.danger})`;
      ctx.lineWidth = 6;
      ctx.stroke();
    }
    roundRect(ctx, 52, y + 28, 58, 58, 14);
    ctx.fillStyle = n.color ?? '#34c759';
    ctx.fill();
    // burbuja
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(81, y + 55, 17, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3a3a3c';
    ctx.font = F(700, 28);
    ctx.textBaseline = 'middle';
    ctx.fillText(n.app.toUpperCase(), 128, y + 57);
    ctx.fillStyle = '#8e8e93';
    ctx.font = F(600, 26);
    ctx.textAlign = 'right';
    ctx.fillText('ahora', w - 60, y + 57);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#0b0f19';
    ctx.font = F(800, 32);
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(n.title, 52, y + 128);
    ctx.fillStyle = '#1c1c1e';
    ctx.font = F(600, 29);
    wrap(ctx, n.body, 52, y + 170, w - 110, 36, 2);
    ctx.restore();
    y += hh + 22;
  });
  ctx.restore();
};

/* ============ Conversación de mensajes / chat ============ */
export type Msg = {text: string; me?: boolean; appear: number; danger?: number; link?: string; tag?: string};
export const drawThread = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: {name: string; sub?: string; msgs: Msg[]; style?: 'sms' | 'chat'; avatar?: string; typing?: number; t: number},
) => {
  const chat = o.style === 'chat';
  base(ctx, w, h, chat ? '#0e1512' : '#000000', chat ? '#0b100e' : '#050505');
  statusBar(ctx, w);
  // cabecera
  ctx.fillStyle = chat ? '#16211c' : '#111113';
  ctx.fillRect(0, 110, w, 190);
  ctx.beginPath();
  ctx.arc(w / 2, 175, 44, 0, Math.PI * 2);
  ctx.fillStyle = o.avatar ?? '#8e8e93';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = F(800, 34);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(o.name.slice(0, 1).toUpperCase(), w / 2, 177);
  ctx.font = F(700, 30);
  ctx.fillText(o.name, w / 2, 250);
  if (o.sub) {
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = F(600, 22);
    ctx.fillText(o.sub, w / 2, 282);
  }
  ctx.textAlign = 'left';
  let y = 340;
  const maxW = w * 0.72;
  o.msgs.forEach((m) => {
    if (m.appear <= 0.001) return;
    ctx.font = F(600, 31);
    const lines: string[] = [];
    let line = '';
    m.text.split(' ').forEach((wd) => {
      const t = line ? line + ' ' + wd : wd;
      if (ctx.measureText(t).width > maxW - 56 && line) {
        lines.push(line);
        line = wd;
      } else line = t;
    });
    if (line) lines.push(line);
    const bw = Math.min(maxW, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 56);
    const bh = lines.length * 40 + 34 + (m.link ? 44 : 0);
    const x = m.me ? w - 36 - bw : 36;
    ctx.save();
    ctx.globalAlpha = clip01(m.appear * 1.3);
    const sc = 0.8 + 0.2 * clip01(m.appear);
    ctx.translate(m.me ? x + bw : x, y + bh / 2);
    ctx.scale(sc, sc);
    ctx.translate(-(m.me ? x + bw : x), -(y + bh / 2));
    roundRect(ctx, x, y, bw, bh, 30);
    ctx.fillStyle = m.me ? (chat ? '#1f9d63' : '#0a84ff') : chat ? '#22302a' : '#2c2c2e';
    ctx.fill();
    if (m.danger) {
      ctx.strokeStyle = `rgba(255,45,85,${m.danger})`;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'alphabetic';
    lines.forEach((l, i) => ctx.fillText(l, x + 28, y + 50 + i * 40));
    if (m.link) {
      ctx.fillStyle = '#64b5ff';
      ctx.font = F(600, 27, MONO);
      ctx.fillText(m.link, x + 28, y + 50 + lines.length * 40 + 6);
      ctx.fillRect(x + 28, y + 50 + lines.length * 40 + 12, ctx.measureText(m.link).width, 2);
    }
    ctx.restore();
    if (m.tag) {
      ctx.save();
      ctx.globalAlpha = clip01(m.appear);
      ctx.font = F(800, 22);
      ctx.fillStyle = m.danger ? '#ff4d6d' : '#34d399';
      ctx.fillText(m.tag, x + 6, y + bh + 30);
      ctx.restore();
      y += 30;
    }
    y += bh + 22;
  });
  if (o.typing && o.typing > 0) {
    ctx.save();
    ctx.globalAlpha = o.typing;
    roundRect(ctx, 36, y, 120, 64, 30);
    ctx.fillStyle = chat ? '#22302a' : '#2c2c2e';
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(70 + i * 26, y + 32 + Math.sin(o.t * 10 + i) * 5, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#9ca3af';
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();
};

/* ============ Web falsa de pago de paquetería ============ */
export const drawPayPage = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {typed: number; pressed: number; urlFlag: number; t: number}) => {
  base(ctx, w, h, '#f6f7fb', '#eceef4');
  statusBar(ctx, w, false);
  roundRect(ctx, 30, 112, w - 60, 84, 26);
  ctx.fillStyle = '#fff';
  ctx.fill();
  if (o.urlFlag > 0) {
    ctx.strokeStyle = `rgba(239,68,68,${o.urlFlag})`;
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  ctx.fillStyle = '#ef4444';
  ctx.font = F(900, 32);
  ctx.textBaseline = 'middle';
  ctx.fillText('⚠', 56, 156);
  ctx.fillStyle = '#0b0f19';
  ctx.font = F(600, 26, MONO);
  ctx.fillText('paquete-entrega.top', 102, 156);
  // cabecera de marca genérica
  ctx.fillStyle = '#ffcc00';
  ctx.fillRect(0, 220, w, 150);
  ctx.fillStyle = '#0b2e7a';
  ctx.font = F(900, 46);
  ctx.textAlign = 'center';
  ctx.fillText('PAQUETERÍA', w / 2, 278);
  ctx.font = F(800, 26);
  ctx.fillText('EXPRESS · Seguimiento', w / 2, 326);
  ctx.textAlign = 'left';
  // estado
  roundRect(ctx, 36, 400, w - 72, 190, 26);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.font = F(800, 30);
  ctx.fillText('● Envío retenido', 66, 450);
  ctx.fillStyle = '#374151';
  ctx.font = F(600, 26);
  ctx.fillText('Tasas de aduana pendientes', 66, 498);
  ctx.fillStyle = '#0b0f19';
  ctx.font = F(900, 50);
  ctx.fillText('1,99 €', 66, 556);
  // tarjeta
  const field = (y: number, label: string, val: string, wd = w - 80, x = 40) => {
    ctx.fillStyle = '#6b7280';
    ctx.font = F(700, 22);
    ctx.fillText(label, x + 10, y - 20);
    roundRect(ctx, x, y, wd, 86, 20);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = '#0b0f19';
    ctx.font = F(600, 30, MONO);
    ctx.fillText(val, x + 24, y + 45);
  };
  const num = '4539 1488 0343 6467';
  const k = clip01(o.typed);
  field(670, 'NÚMERO DE TARJETA', num.slice(0, Math.floor(k * 1.6 * num.length)));
  const k2 = clip01((k - 0.6) / 0.4);
  field(820, 'CADUCIDAD', '08/27'.slice(0, Math.floor(k2 * 5)), (w - 100) / 2);
  field(820, 'CVV', '•••'.slice(0, Math.floor(k2 * 3)), (w - 100) / 2, w / 2 + 10);
  const p = clip01(o.pressed);
  roundRect(ctx, 40 + p * 6, 980 + p * 4, w - 80 - p * 12, 100 - p * 8, 26);
  ctx.fillStyle = p > 0.5 ? '#16a34a' : '#0b2e7a';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = F(800, 34);
  ctx.textAlign = 'center';
  ctx.fillText(p > 0.5 ? 'Pago realizado ✓' : 'Pagar 1,99 €', w / 2, 1032);
  ctx.textAlign = 'left';
  ctx.restore();
};

/* ============ Cara de tarjeta de crédito ============ */
export const drawCardFace = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {frozen: number; leak: number; t: number}) => {
  roundRect(ctx, 0, 0, w, h, 34);
  ctx.save();
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#2b3fae');
  g.addColorStop(0.55, '#6d28d9');
  g.addColorStop(1, '#0ea5e9');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.globalAlpha = 0.18;
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.1, 120 + i * 70, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 40);
  ctx.textBaseline = 'middle';
  ctx.fillText('BANCO', 50, 70);
  // contactless
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 5;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(w - 120, h * 0.42, 18 + i * 14, -0.8, 0.8);
    ctx.stroke();
  }
  ctx.font = F(700, 54, MONO);
  const num = '4539  1488  0343  6467';
  ctx.fillStyle = o.leak > 0 ? `rgb(255,${Math.round(255 - 180 * o.leak)},${Math.round(255 - 170 * o.leak)})` : '#fff';
  ctx.fillText(num, 50, h * 0.68);
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.font = F(700, 30, MONO);
  ctx.fillText('MARIA G.', 50, h * 0.86);
  ctx.fillText('08/27', w - 190, h * 0.86);
  if (o.frozen > 0) {
    ctx.fillStyle = `rgba(160,220,255,${0.55 * o.frozen})`;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.globalAlpha = o.frozen;
    ctx.fillStyle = '#0b2540';
    ctx.font = F(900, 70);
    ctx.textAlign = 'center';
    ctx.fillText('❄ BLOQUEADA', w / 2, h / 2);
    ctx.restore();
  }
  ctx.restore();
};

/* ============ Notificación suelta (cargos, códigos…) ============ */
export const drawNotice = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: {app: string; title: string; body: string; color: string; amount?: string; danger?: number},
) => {
  roundRect(ctx, 0, 0, w, h, 50);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = 'rgba(246,247,251,.97)';
  ctx.fillRect(0, 0, w, h);
  roundRect(ctx, 34, 34, 70, 70, 18);
  ctx.fillStyle = o.color;
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 40);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(o.app.slice(0, 1), 69, 71);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#6b7280';
  ctx.font = F(700, 28);
  ctx.fillText(o.app.toUpperCase(), 124, 70);
  ctx.fillStyle = '#0b0f19';
  ctx.font = F(800, 38);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(o.title, 34, 170);
  ctx.fillStyle = '#374151';
  ctx.font = F(600, 32);
  ctx.fillText(o.body, 34, 220);
  if (o.amount) {
    ctx.fillStyle = '#dc2626';
    ctx.font = F(900, 54);
    ctx.textAlign = 'right';
    ctx.fillText(o.amount, w - 36, 90);
    ctx.textAlign = 'left';
  }
  ctx.restore();
  if (o.danger) {
    roundRect(ctx, 3, 3, w - 6, h - 6, 48);
    ctx.strokeStyle = `rgba(255,45,85,${o.danger})`;
    ctx.lineWidth = 7;
    ctx.stroke();
  }
};

/* ============ Etiqueta de envío ============ */
export const drawShipLabel = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {stamp: number}) => {
  ctx.fillStyle = '#fbfaf6';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#111';
  ctx.font = F(900, 40);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('ENVÍO URGENTE', 30, 60);
  ctx.font = F(600, 26);
  ctx.fillText('Para: María G.', 30, 110);
  ctx.fillText('C/ Mayor 12, 3ºB', 30, 145);
  for (let i = 0; i < 46; i++) {
    const bw = (i * 7) % 3 === 0 ? 6 : 3;
    ctx.fillRect(30 + i * 9, 180, bw, 90);
  }
  ctx.font = F(600, 20, MONO);
  ctx.fillText('ES 7731 0042 9918', 30, 300);
  if (o.stamp > 0) {
    ctx.save();
    ctx.translate(w * 0.6, h * 0.55);
    ctx.rotate(-0.25);
    const s = 1 + (1 - Math.min(1, o.stamp)) * 1.5;
    ctx.scale(s, s);
    ctx.globalAlpha = Math.min(1, o.stamp);
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 8;
    roundRect(ctx, -170, -50, 340, 100, 12);
    ctx.stroke();
    ctx.fillStyle = '#dc2626';
    ctx.font = F(900, 58);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RETENIDO', 0, 4);
    ctx.restore();
  }
};

/* ============ App de pagos (tipo Bizum, genérica) ============ */
export const drawPayApp = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: {mode: 'request' | 'received'; amount: string; from: string; pressed: number; highlight: number; balance?: string; t: number},
) => {
  base(ctx, w, h, '#0c1d26', '#071017');
  statusBar(ctx, w);
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 52);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Pagos', 52, 210);
  if (o.balance) {
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = F(700, 24);
    ctx.fillText('SALDO', 52, 270);
    ctx.fillStyle = '#fff';
    ctx.font = F(800, 46);
    ctx.fillText(o.balance, 52, 322);
  }
  const y = 380;
  roundRect(ctx, 36, y, w - 72, 640, 40);
  ctx.fillStyle = '#13262f';
  ctx.fill();
  if (o.highlight > 0) {
    ctx.strokeStyle = o.mode === 'request' ? `rgba(255,45,85,${o.highlight})` : `rgba(34,227,166,${o.highlight})`;
    ctx.lineWidth = 6;
    ctx.stroke();
  }
  const req = o.mode === 'request';
  // icono
  ctx.beginPath();
  ctx.arc(w / 2, y + 110, 62, 0, Math.PI * 2);
  ctx.fillStyle = req ? '#f59e0b' : '#22c55e';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 64);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(req ? '↗' : '↙', w / 2, y + 114);
  ctx.textBaseline = 'alphabetic';
  ctx.font = F(800, 36);
  ctx.fillText(req ? 'Solicitud de dinero' : 'Has recibido dinero', w / 2, y + 236);
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.font = F(600, 28);
  ctx.fillText(req ? `${o.from} te pide` : `de ${o.from}`, w / 2, y + 286);
  ctx.fillStyle = req ? '#fff' : '#4ade80';
  ctx.font = F(900, 96);
  ctx.fillText(req ? o.amount : '+' + o.amount, w / 2, y + 400);
  ctx.textAlign = 'left';
  if (req) {
    const p = clip01(o.pressed);
    roundRect(ctx, 66, y + 480, (w - 160) / 2, 100, 26);
    ctx.fillStyle = '#2a3a42';
    ctx.fill();
    roundRect(ctx, w / 2 + 14 + p * 6, y + 480 + p * 4, (w - 160) / 2 - p * 12, 100 - p * 8, 26);
    ctx.fillStyle = p > 0.5 ? '#15803d' : '#22c55e';
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = F(800, 32);
    ctx.textAlign = 'center';
    ctx.fillText('Rechazar', 66 + (w - 160) / 4, y + 542);
    ctx.fillText('Aceptar', w / 2 + 14 + (w - 160) / 4, y + 542);
    ctx.textAlign = 'left';
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.font = F(700, 28);
    ctx.textAlign = 'center';
    ctx.fillText('Ingresado automáticamente', w / 2, y + 540);
    ctx.textAlign = 'left';
  }
  ctx.restore();
};

/* ============ Ficha de login de un servicio ============ */
export type Service = {name: string; color: string; icon: 'mail' | 'bank' | 'chat' | 'cart' | 'cloud'};
export const serviceIcon = (ctx: CanvasRenderingContext2D, icon: Service['icon'], x: number, y: number, s: number, color = '#fff') => {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = s * 0.09;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (icon === 'mail') {
    roundRect(ctx, x - s * 0.5, y - s * 0.34, s, s * 0.68, s * 0.08);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - s * 0.46, y - s * 0.28);
    ctx.lineTo(x, y + s * 0.06);
    ctx.lineTo(x + s * 0.46, y - s * 0.28);
    ctx.stroke();
  } else if (icon === 'bank') {
    ctx.beginPath();
    ctx.moveTo(x - s * 0.52, y - s * 0.18);
    ctx.lineTo(x, y - s * 0.5);
    ctx.lineTo(x + s * 0.52, y - s * 0.18);
    ctx.closePath();
    ctx.fill();
    [-0.32, 0, 0.32].forEach((dx) => ctx.fillRect(x + dx * s - s * 0.06, y - s * 0.1, s * 0.12, s * 0.42));
    ctx.fillRect(x - s * 0.52, y + s * 0.36, s * 1.04, s * 0.1);
  } else if (icon === 'chat') {
    ctx.beginPath();
    ctx.ellipse(x, y - s * 0.05, s * 0.5, s * 0.38, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - s * 0.3, y + s * 0.2);
    ctx.lineTo(x - s * 0.42, y + s * 0.5);
    ctx.lineTo(x - s * 0.05, y + s * 0.3);
    ctx.fill();
  } else if (icon === 'cloud') {
    ctx.beginPath();
    ctx.arc(x - s * 0.22, y + s * 0.05, s * 0.24, 0, Math.PI * 2);
    ctx.arc(x + s * 0.05, y - s * 0.12, s * 0.3, 0, Math.PI * 2);
    ctx.arc(x + s * 0.3, y + s * 0.08, s * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(x - s * 0.22, y + s * 0.05, s * 0.52, s * 0.25);
  } else {
    ctx.beginPath();
    ctx.moveTo(x - s * 0.55, y - s * 0.4);
    ctx.lineTo(x - s * 0.38, y - s * 0.4);
    ctx.lineTo(x - s * 0.25, y + s * 0.2);
    ctx.lineTo(x + s * 0.45, y + s * 0.2);
    ctx.lineTo(x + s * 0.55, y - s * 0.22);
    ctx.lineTo(x - s * 0.33, y - s * 0.22);
    ctx.stroke();
    [-0.18, 0.35].forEach((dx) => {
      ctx.beginPath();
      ctx.arc(x + dx * s, y + s * 0.4, s * 0.08, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.restore();
};

export const drawLogin = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {svc: Service; pass: number; status: 'idle' | 'fail' | 'ok'; t: number}) => {
  roundRect(ctx, 0, 0, w, h, 50);
  ctx.save();
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#1b2236');
  g.addColorStop(1, '#10141f');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = o.svc.color;
  ctx.fillRect(0, 0, w, 150);
  serviceIcon(ctx, o.svc.icon, 90, 75, 80);
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 46);
  ctx.textBaseline = 'middle';
  ctx.fillText(o.svc.name, 160, 78);
  const field = (y: number, val: string) => {
    roundRect(ctx, 40, y, w - 80, 90, 22);
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    ctx.fill();
    ctx.fillStyle = '#e5e7eb';
    ctx.font = F(600, 32, MONO);
    ctx.fillText(val, 70, y + 47);
  };
  field(200, 'maria.g@correo.com');
  field(320, '●'.repeat(Math.floor(clip01(o.pass) * 11)));
  const st = o.status;
  roundRect(ctx, 40, 450, w - 80, 96, 26);
  ctx.fillStyle = st === 'ok' ? '#16a34a' : st === 'fail' ? '#7f1d1d' : '#334155';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = F(800, 34);
  ctx.textAlign = 'center';
  ctx.fillText(st === 'ok' ? 'ACCESO CONCEDIDO' : st === 'fail' ? 'Contraseña incorrecta' : 'Iniciar sesión', w / 2, 500);
  ctx.textAlign = 'left';
  ctx.restore();
  if (st !== 'idle') {
    roundRect(ctx, 3, 3, w - 6, h - 6, 48);
    ctx.strokeStyle = st === 'ok' ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 7;
    ctx.stroke();
  }
};

/* ============ Lista filtrada ============ */
const LEAK = [
  'maria.g@correo.com      : Maria1987!',
  'jlopez@mail.es          : barcelona10',
  'ana_r@correo.com        : contraseña123',
  'p.ruiz@web.es           : qwerty2020',
  'carmen84@correo.com     : Carmen1984',
  'dani.m@mail.es          : 12345678',
  'lucia.v@correo.com      : Lucia*2019',
  'sergio.p@web.es         : sergio1990',
  'elena.s@correo.com      : Madrid2022',
  'raul_t@mail.es          : iloveyou',
  'marta.f@correo.com      : marta.123',
  'pablo.c@web.es          : Pablo2000!',
  'irene.d@correo.com      : verano2023',
  'javi.n@mail.es          : 11111111',
];
export const drawLeakList = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {scroll: number; hi: number}) => {
  ctx.fillStyle = '#06080d';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#121826';
  ctx.fillRect(0, 0, w, 70);
  ctx.fillStyle = '#ff4d6d';
  ctx.font = F(700, 30, MONO);
  ctx.textBaseline = 'middle';
  ctx.fillText('filtracion_2024_combo.txt   · 2.183.402.117 líneas', 30, 36);
  ctx.font = F(500, 30, MONO);
  const lh = 50;
  const off = (o.scroll * lh) % (LEAK.length * lh);
  for (let i = -1; i < 16; i++) {
    const idx = (((Math.floor(off / lh) + i) % LEAK.length) + LEAK.length) % LEAK.length;
    const y = 110 + i * lh - (off % lh);
    if (y < 80) continue;
    const line = LEAK[idx];
    const isHi = o.hi > 0 && idx === 0;
    if (isHi) {
      ctx.fillStyle = `rgba(255,45,85,${0.3 * o.hi})`;
      ctx.fillRect(16, y - 22, w - 32, 44);
    }
    ctx.fillStyle = isHi ? '#ffd1d9' : idx % 3 === 0 ? '#a7f3d0' : '#cbd5e1';
    ctx.fillText(line, 30, y);
  }
};

/* ============ Comprobador de filtraciones ============ */
export const drawBreachCheck = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {typed: number; result: number; t: number}) => {
  base(ctx, w, h, '#0f1630', '#0a0f22');
  statusBar(ctx, w);
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 50);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('¿Me han filtrado?', w / 2, 240);
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.font = F(600, 26);
  ctx.fillText('Busca tu correo en filtraciones públicas', w / 2, 290);
  ctx.textAlign = 'left';
  roundRect(ctx, 40, 350, w - 80, 96, 26);
  ctx.fillStyle = 'rgba(255,255,255,.1)';
  ctx.fill();
  const em = 'maria.g@correo.com';
  ctx.fillStyle = '#fff';
  ctx.font = F(600, 32, MONO);
  ctx.textBaseline = 'middle';
  ctx.fillText(em.slice(0, Math.floor(clip01(o.typed) * em.length)) + (o.typed < 1 && Math.floor(o.t * 3) % 2 ? '|' : ''), 70, 399);
  roundRect(ctx, 40, 470, w - 80, 90, 26);
  ctx.fillStyle = '#3b82f6';
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = F(800, 32);
  ctx.textAlign = 'center';
  ctx.fillText('Comprobar', w / 2, 516);
  if (o.result > 0) {
    ctx.save();
    ctx.globalAlpha = clip01(o.result);
    roundRect(ctx, 40, 610, w - 80, 520, 36);
    ctx.fillStyle = 'rgba(220,38,38,.18)';
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#ff4d6d';
    ctx.font = F(900, 54);
    ctx.fillText('⚠ ¡Filtrado!', w / 2, 700);
    ctx.fillStyle = '#fff';
    ctx.font = F(700, 32);
    ctx.fillText('Aparece en 7 filtraciones', w / 2, 770);
    ctx.textAlign = 'left';
    ['Tienda online · 2021', 'Red social · 2019', 'Foro de juegos · 2016'].forEach((s, i) => {
      ctx.fillStyle = 'rgba(255,255,255,.75)';
      ctx.font = F(600, 28);
      ctx.fillText('• ' + s, 90, 860 + i * 70);
    });
    ctx.restore();
  }
  ctx.textAlign = 'left';
  ctx.restore();
};

/* ============ Gestor de contraseñas ============ */
export const drawVaultApp = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {rows: number; t: number}) => {
  base(ctx, w, h, '#0b1a17', '#06100e');
  statusBar(ctx, w);
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 52);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Contraseñas', 52, 210);
  const items: [string, Service['icon'], string, string][] = [
    ['Correo', 'mail', '#ef4444', 'k#9Vq!2mLp@x'],
    ['Banco', 'bank', '#0ea5e9', 'Tz7$wQe1!vB9'],
    ['Redes', 'chat', '#a855f7', 'p2&Hn8@rLs4Z'],
    ['Tienda', 'cart', '#f59e0b', 'Mx!3uD7#qW0e'],
  ];
  items.forEach(([n, ic, c, pw], i) => {
    const k = clip01(o.rows - i);
    if (k <= 0) return;
    const y = 270 + i * 190;
    ctx.save();
    ctx.globalAlpha = k;
    ctx.translate((1 - k) * 60, 0);
    roundRect(ctx, 36, y, w - 72, 160, 32);
    ctx.fillStyle = 'rgba(255,255,255,.07)';
    ctx.fill();
    roundRect(ctx, 64, y + 34, 92, 92, 22);
    ctx.fillStyle = c;
    ctx.fill();
    serviceIcon(ctx, ic, 110, y + 80, 52);
    ctx.fillStyle = '#fff';
    ctx.font = F(800, 34);
    ctx.fillText(n, 186, y + 72);
    ctx.fillStyle = '#34d399';
    ctx.font = F(600, 26, MONO);
    ctx.fillText(pw, 186, y + 118);
    lockIcon(ctx, w - 100, y + 80, 40, '#34d399');
    ctx.restore();
  });
  ctx.restore();
};

/* ============ Código 2FA bloqueando intento ============ */
export const drawTwoFA = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {blocked: number; t: number}) => {
  base(ctx, w, h, '#0f172a', '#0b1020');
  statusBar(ctx, w);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 46);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Verificación en 2 pasos', w / 2, 240);
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.font = F(600, 28);
  ctx.fillText('Introduce el código de tu móvil', w / 2, 296);
  const code = ['4', '8', '2', '9', '1', '3'];
  code.forEach((c, i) => {
    const x = 70 + i * ((w - 140) / 6);
    roundRect(ctx, x, 360, (w - 140) / 6 - 14, 120, 20);
    ctx.fillStyle = 'rgba(255,255,255,.08)';
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,.25)';
    ctx.font = F(800, 56, MONO);
    ctx.fillText('_', x + ((w - 140) / 6 - 14) / 2, 440);
  });
  if (o.blocked > 0) {
    ctx.save();
    ctx.globalAlpha = clip01(o.blocked);
    roundRect(ctx, 40, 560, w - 80, 300, 36);
    ctx.fillStyle = 'rgba(34,227,166,.14)';
    ctx.fill();
    ctx.strokeStyle = '#22e3a6';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.fillStyle = '#22e3a6';
    ctx.font = F(900, 50);
    ctx.fillText('ACCESO BLOQUEADO', w / 2, 680);
    ctx.fillStyle = 'rgba(255,255,255,.75)';
    ctx.font = F(600, 28);
    ctx.fillText('Sin tu móvil no pueden entrar', w / 2, 750);
    ctx.restore();
  }
  ctx.textAlign = 'left';
  ctx.restore();
};

/* ============ Cara de moneda / dominó / etiqueta de precio ============ */
export const drawCoinFace = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  g.addColorStop(0, '#ffe7a0');
  g.addColorStop(1, '#c8902a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(120,80,10,.6)';
  ctx.lineWidth = w * 0.03;
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, w * 0.42, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(120,80,10,.85)';
  ctx.font = F(900, w * 0.55);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('€', w / 2, h / 2 + w * 0.03);
  ctx.textAlign = 'left';
};

export const drawDominoFace = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {svc: Service; hacked: number}) => {
  ctx.clearRect(0, 0, w, h);
  roundRect(ctx, 10, 10, w - 20, h - 20, 30);
  ctx.fillStyle = o.hacked > 0.5 ? '#2a0a12' : '#0f1420';
  ctx.fill();
  roundRect(ctx, w / 2 - 80, 90, 160, 160, 36);
  ctx.fillStyle = o.svc.color;
  ctx.fill();
  serviceIcon(ctx, o.svc.icon, w / 2, 170, 90);
  ctx.fillStyle = '#fff';
  ctx.font = F(800, 38);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(o.svc.name, w / 2, 310);
  ctx.fillStyle = 'rgba(255,255,255,.2)';
  ctx.fillRect(40, h / 2, w - 80, 4);
  if (o.hacked > 0) {
    ctx.globalAlpha = clip01(o.hacked);
    ctx.fillStyle = '#ff2d55';
    ctx.font = F(900, 46);
    ctx.fillText('HACKEADO', w / 2, h * 0.72);
    ctx.globalAlpha = 1;
  } else {
    lockIcon(ctx, w / 2, h * 0.72, 70, '#22e3a6');
  }
  ctx.textAlign = 'left';
};

export const drawPriceText = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {text: string; sub?: string}) => {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#111';
  ctx.font = F(900, h * 0.5);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(o.text, w / 2, h * (o.sub ? 0.4 : 0.52));
  if (o.sub) {
    ctx.font = F(700, h * 0.18);
    ctx.fillText(o.sub, w / 2, h * 0.8);
  }
  ctx.textAlign = 'left';
};

/* ============ Tarjeta de consejo (variante con color) ============ */
export const drawTipV = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  o: {n: number; title: string; sub: string; color: string; check: number; mark?: 'check' | 'cross'},
) => {
  roundRect(ctx, 0, 0, w, h, 56);
  ctx.save();
  ctx.clip();
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, 'rgba(28,34,52,.97)');
  g.addColorStop(1, 'rgba(12,15,25,.97)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = o.color;
  ctx.fillRect(0, 0, 16, h);
  ctx.fillStyle = o.color;
  ctx.font = F(900, 120);
  ctx.textBaseline = 'middle';
  ctx.globalAlpha = 0.9;
  ctx.fillText(String(o.n), 60, h / 2 + 6);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff';
  ctx.font = F(900, 58);
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(o.title, 190, h / 2 - 6);
  ctx.fillStyle = 'rgba(255,255,255,.62)';
  ctx.font = F(600, 34);
  ctx.fillText(o.sub, 192, h / 2 + 48);
  if (o.check > 0) {
    const cross = o.mark === 'cross';
    ctx.beginPath();
    ctx.arc(w - 90, h / 2, 46 * Math.min(1, o.check * 1.5), 0, Math.PI * 2);
    ctx.fillStyle = cross ? '#ef4444' : '#22c55e';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    const k = clip01((o.check - 0.3) / 0.7);
    ctx.beginPath();
    if (cross) {
      ctx.moveTo(w - 108, h / 2 - 18);
      ctx.lineTo(w - 108 + 36 * k, h / 2 - 18 + 36 * k);
      if (k > 0.5) {
        ctx.moveTo(w - 72, h / 2 - 18);
        ctx.lineTo(w - 72 - 36 * (k - 0.5) * 2, h / 2 - 18 + 36 * (k - 0.5) * 2);
      }
    } else {
      ctx.moveTo(w - 110, h / 2);
      ctx.lineTo(w - 96, h / 2 + 15);
      ctx.lineTo(w - 96 + 30 * k, h / 2 + 15 - 32 * k);
    }
    ctx.stroke();
  }
  ctx.restore();
  roundRect(ctx, 2, 2, w - 4, h - 4, 54);
  ctx.strokeStyle = 'rgba(255,255,255,.14)';
  ctx.lineWidth = 3;
  ctx.stroke();
};

/* ============ Texto luminoso suelto ============ */
export const drawGlowText = (ctx: CanvasRenderingContext2D, w: number, h: number, o: {text: string; color: string}) => {
  ctx.clearRect(0, 0, w, h);
  ctx.font = F(700, Math.round(h * 0.55), MONO);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = o.color;
  ctx.shadowBlur = 22;
  ctx.fillStyle = o.color;
  ctx.fillText(o.text, w / 2, h / 2);
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.85;
  ctx.fillText(o.text, w / 2, h / 2);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
};
