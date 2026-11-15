import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Studio, Rig, Floor, useCanvasTexture} from '../../core/studio';
import {useTL} from '../../core/timeline';
import {ease, kick, mix3, pop} from '../../core/anim';
import {Chip, Headline, project} from '../../core/overlay';
import {ScreenPhone, TexCard, CoinStream} from '../../models/kit';
import {Package, CreditCard, PriceTag, Bank} from '../../models/objects';
import {drawLockScreen, drawPayPage, drawCardFace, drawNotice, drawShipLabel, drawThread, drawTipV, drawPriceText} from '../../models/screens2';

const SMS_BODY = 'Tu paquete está retenido. Paga 1,99 € para recibirlo: paquete-entrega.top/pago';

/* 1 — HOOK: llega el SMS */
export const Hook: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fRet = wf('hook', 'retenido');
  const fPaga = wf('hook', 'paga');
  const fNo = wf('hook', 'no');
  const g = kick(f, fNo, 12);
  const label = useCanvasTexture(512, 360, (ctx, w, h) => drawShipLabel(ctx, w, h, {stamp: ease(f, [fRet, fRet + 8], [0, 1])}));
  const price = useCanvasTexture(512, 256, (ctx, w, h) => drawPriceText(ctx, w, h, {text: '1,99 €'}));
  const pull = ease(f, [8, 70], [0, 1], 'inOut');
  const cam = mix3([0.2, 1.75, 4.6], [Math.sin(t * 0.5) * 0.6, 1.0, 11.2 - t * 0.15], pull);
  const look = mix3([0, 1.35, 0], [0, 0.85, 0], pull);
  const tagIn = pop(f, fPaga, 11, 120);
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#0b0603', glow: '#5a2a08', accent: '#ff9f43'}} chroma={g * 1.5 + kick(f, 0, 6)}>
        <Rig pos={cam} look={look} />
        <group position={[0, 1.0 + Math.sin(t * 1.3) * 0.04, 0]} rotation={[-0.04, Math.sin(t * 0.7) * 0.15, 0]} scale={1.2}>
          <ScreenPhone
            draw={(ctx, w, h) =>
              drawLockScreen(ctx, w, h, {
                wall: ['#2a1a40', '#5a2b1b'],
                notifs: [{app: 'Mensajes', title: 'Paquetería', body: SMS_BODY, appear: ease(f, [4, 16], [0, 1]), danger: ease(f, [fNo, fNo + 6], [0, 1])}],
              })
            }
          />
        </group>
        <group position={[-1.55, 2.6, -2.2]} rotation={[0.35 + t * 0.1, 0.6 + t * 0.35, 0.1]} scale={0.95}>
          <Package label={label} />
        </group>
        <group position={[1.15, 0.35, 1.0]} rotation={[0, -0.4 + Math.sin(t * 2) * 0.15, Math.sin(t * 2.4) * 0.12 - 0.15]} scale={0.8 * tagIn}>
          <PriceTag tex={price} />
        </group>
        <Floor y={-1.6} color="#6b3410" />
      </Studio>
      <Headline text="NO LO PAGUES" start={fNo} y={250} size={120} color="#ff4d6d" glitch={Math.max(g, 0.08)} />
    </AbsoluteFill>
  );
};

/* 2 — FAKE: web falsa y sale la tarjeta */
export const Fake: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fFalsa = wf('fake', 'falsa');
  const fTarjeta = wf('fake', 'tarjeta');
  const out = ease(f, [fTarjeta - 8, fTarjeta + 16], [0, 1]);
  const ang = -0.32 + t * 0.09;
  const cam: [number, number, number] = [Math.sin(ang) * 8.6, 1.1, Math.cos(ang) * 8.6];
  const look: [number, number, number] = [0, 0.95, 0];
  const card = useCanvasTexture(1024, 646, (ctx, w, h) => drawCardFace(ctx, w, h, {frozen: 0, leak: 0, t}));
  const url = project([0, 2.15, 0.2], cam, look);
  const cardPos = mix3([0, 0.9, 0], [0.35, 1.0, 2.2], out);
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#06070d', glow: '#1e2a5c', accent: '#ffcc00'}} chroma={kick(f, 0, 8) + kick(f, fFalsa, 10) * 0.8}>
        <Rig pos={cam} look={look} />
        <group position={[-0.25 * out, 0.95, -0.4 * out]} rotation={[0, Math.sin(t) * 0.1 - ang * 0.6, 0]} scale={1.25}>
          <ScreenPhone draw={(ctx, w, h) => drawPayPage(ctx, w, h, {typed: 0, pressed: 0, urlFlag: ease(f, [fFalsa, fFalsa + 6], [0, 1]), t})} />
        </group>
        {out > 0 && (
          <group position={cardPos} rotation={[0.2 - out * 0.1, -0.5 + out * 0.35 + t * 0.3 * (1 - out), Math.sin(t) * 0.05]} scale={0.5 + out * 0.45}>
            <CreditCard front={card} />
          </group>
        )}
        <Floor y={-1.0} color="#22336b" />
      </Studio>
      <Chip x={url.x} y={url.y - 70} text="web falsa" color="#ff2d55" appear={pop(f, fFalsa, 14, 180) * (1 - out)} size={40} />
      <Headline text="QUIEREN TU TARJETA" start={fTarjeta - 4} y={250} size={92} color="#ffd60a" />
    </AbsoluteFill>
  );
};

/* 3 — STEAL: cargos y código del banco */
const CHARGES = [
  {title: 'Compra online', body: 'Tienda electrónica', amount: '-249,99 €'},
  {title: 'Compra online', body: 'Marketplace', amount: '-180,00 €'},
  {title: 'Retirada', body: 'Cajero extranjero', amount: '-499,00 €'},
];
export const Steal: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fDatos = wf('steal', 'datos');
  const fCargos = wf('steal', 'cargos');
  const fCodigo = wf('steal', 'código');
  const card = useCanvasTexture(1024, 646, (ctx, w, h) => drawCardFace(ctx, w, h, {frozen: 0, leak: ease(f, [fDatos, fDatos + 10], [0, 1]), t}));
  const otpIn = pop(f, fCodigo - 2, 12, 140);
  const cam: [number, number, number] = [Math.sin(t * 0.4) * 0.9, 1.1, 10.5 - t * 0.25];
  const look: [number, number, number] = [0, 0.95, 0];
  const at = [fCargos, fCargos + 12, fCargos + 24];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#0c0306', glow: '#5c0d22', accent: '#ff2d55'}} chroma={kick(f, 0, 8) + kick(f, fCargos, 8) * 0.6 + kick(f, fCodigo, 10) * 0.8}>
        <Rig pos={cam} look={look} />
        <group position={[0, 2.25 - otpIn * 0.5, -0.5]} rotation={[0.25, Math.sin(t * 0.8) * 0.35, 0.05]} scale={1.55 - otpIn * 0.35}>
          <CreditCard front={card} />
        </group>
        <CoinStream points={[[0.4, 2.1, -0.3], [2.0, 1.3, -1.5], [3.4, 0.4, -4]]} t={t} active={ease(f, [fCargos, fCargos + 20], [0, 1])} count={10} speed={0.8} />
        {CHARGES.map((c, i) => {
          const s = pop(f, at[i], 12, 160);
          if (s <= 0.01) return null;
          return (
            <group key={i} position={[-0.55 + i * 0.25, 0.75 - i * 0.62, 0.6 + i * 0.25]} rotation={[0, 0.18, 0]} scale={s * 0.95 * (1 - otpIn * 0.7)}>
              <TexCard draw={(ctx, w, h) => drawNotice(ctx, w, h, {app: 'Banco', title: c.title, body: c.body, color: '#0ea5e9', amount: c.amount})} px={[900, 260]} w={2.6} h={0.75} radius={0.2} />
            </group>
          );
        })}
        {otpIn > 0.01 && (
          <group position={[0, 0.85, 1.2]} rotation={[0, -0.08, 0]} scale={otpIn * 0.78}>
            <TexCard
              draw={(ctx, w, h) => drawNotice(ctx, w, h, {app: 'Banco', title: 'Tu código: 482 913', body: 'No lo compartas con nadie.', color: '#0ea5e9', danger: 1})}
              px={[900, 260]}
              w={2.6}
              h={0.75}
              radius={0.2}
              edge="#ff2d55"
              edgePower={4}
            />
          </group>
        )}
        <Floor y={-1.4} color="#5c1020" />
      </Studio>
      <Headline text="−928,99 €" start={fCargos + 26} y={250} size={130} color="#ff4d6d" out={fCodigo - 6} />
      <Headline text="¡NUNCA LO DES!" start={fCodigo + 6} y={250} size={100} color="#ffd60a" />
    </AbsoluteFill>
  );
};

/* 4 — WHY: mismo hilo que los mensajes reales */
export const Why: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fPaquete = wf('why', 'paquete');
  const fFalso = wf('why', 'falso');
  const fMismo = wf('why', 'mismo');
  const label = useCanvasTexture(512, 360, (ctx, w, h) => drawShipLabel(ctx, w, h, {stamp: 0}));
  const close = ease(f, [fFalso - 4, fFalso + 26], [0, 1], 'inOut');
  const cam = mix3([Math.sin(t * 0.5) * 0.8, 1.0, 11.5], [0.1, 0.95, 6.6], close);
  const look = mix3([0, 0.85, 0], [0, 0.65, 0], close);
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#05080b', glow: '#123a4a', accent: '#38bdf8'}} chroma={kick(f, 0, 8) + kick(f, fFalso, 10)}>
        <Rig pos={cam} look={look} />
        {[0, 1, 2].map((i) => {
          const s = pop(f, fPaquete - 6 + i * 4, 12, 120);
          const p: [number, number, number][] = [
            [-1.8, 2.7, -2.5],
            [1.9, 2.0, -3.0],
            [-1.6, -0.6, -2.0],
          ];
          return (
            <group key={i} position={[p[i][0], p[i][1] + (1 - s) * 4, p[i][2]]} rotation={[0.3 + t * 0.2 + i, 0.5 + t * 0.3 + i, 0.1]} scale={0.6 * s}>
              <Package label={label} />
            </group>
          );
        })}
        <group position={[0, 0.85, 0]} rotation={[0, Math.sin(t * 0.6) * 0.12, 0]} scale={1.2}>
          <ScreenPhone
            draw={(ctx, w, h) =>
              drawThread(ctx, w, h, {
                name: 'Paquetería',
                sub: 'Mensaje de texto',
                avatar: '#f59e0b',
                t,
                msgs: [
                  {text: 'Tu pedido 7731 ha sido enviado.', appear: ease(f, [2, 10], [0, 1]), tag: '✓ real'},
                  {text: 'Tu paquete llega mañana entre 9:00 y 14:00.', appear: ease(f, [8, 16], [0, 1]), tag: '✓ real'},
                  {text: SMS_BODY, appear: ease(f, [fFalso, fFalso + 8], [0, 1]), danger: ease(f, [fMismo, fMismo + 6], [0, 1]), tag: '✗ FALSO'},
                ],
              })
            }
          />
        </group>
        <Floor y={-1.0} color="#124a5c" />
      </Studio>
      <Chip x={540} y={240} text="mismo chat, mismo remitente" color="#ff2d55" appear={pop(f, fMismo, 14, 180)} size={42} />
    </AbsoluteFill>
  );
};

/* 5 — TIPS */
const TIPS = [
  {title: 'No pagues desde SMS', sub: 'Ni aunque sea 1,99 €', color: '#ff9f43'},
  {title: 'Entra tú en la app', sub: 'O escribe la web a mano', color: '#22e3a6'},
  {title: 'El código, a nadie', sub: 'Tu banco nunca te lo pide', color: '#ff4d6d'},
];
export const Tips: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const at = [wf('tips', 'nunca'), wf('tips', 'entra'), wf('tips', 'código')];
  const cam: [number, number, number] = [Math.sin(t * 0.5) * 0.6, 1.3, 11 - t * 0.12];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#04070a', glow: '#0b3a35', accent: '#22e3a6'}} chroma={kick(f, 0, 8)}>
        <Rig pos={cam} look={[0, 1.25, 0]} />
        {TIPS.map((c, i) => {
          const s = pop(f, at[i], 13, 120);
          if (f < at[i] - 1) return null;
          const chk = ease(f, [at[i] + 12, at[i] + 24], [0, 1]);
          return (
            <group key={i} position={[0, 2.6 - i * 1.3, (1 - s) * 2]} rotation={[(1 - s) * -1.6 + Math.sin(t + i) * 0.04, Math.sin(t * 0.7 + i) * 0.08, 0]}>
              <TexCard draw={(ctx, w, h) => drawTipV(ctx, w, h, {n: i + 1, ...c, check: chk})} px={[1100, 340]} w={3.3} h={1.02} radius={0.16} edge={c.color} edgePower={chk * 2} />
            </group>
          );
        })}
      </Studio>
      <Headline text="CÓMO EVITARLO" start={2} y={190} size={82} color="#22e3a6" />
    </AbsoluteFill>
  );
};

/* 6 — OUTRO: llama al banco y bloquea */
export const Outro: React.FC = () => {
  const {wf} = useTL();
  const f = useCurrentFrame();
  const t = f / 30;
  const fLlama = wf('outro', 'llama');
  const fBloq = wf('outro', 'bloquea');
  const fAhora = wf('outro', 'ahora');
  const frozen = ease(f, [fBloq, fBloq + 14], [0, 1]);
  const card = useCanvasTexture(1024, 646, (ctx, w, h) => drawCardFace(ctx, w, h, {frozen, leak: 0, t}));
  const cam: [number, number, number] = [Math.sin(t * 0.6) * 0.7, 1.4, 12 - ease(f, [0, 100], [0, 2])];
  return (
    <AbsoluteFill>
      <Studio look={{bg: '#03070d', glow: '#0d3550', accent: '#7dd3fc'}} chroma={kick(f, 0, 8) + kick(f, fAhora, 10) * 0.8}>
        <Rig pos={cam} look={[0, 1.1, 0]} />
        <group position={[0, 2.35, -3]} rotation={[0.08, -0.25 + Math.sin(t * 0.5) * 0.1, 0]} scale={1.0}>
          <Bank accent="#7dd3fc" />
        </group>
        <group position={[0, 0.55, 1]} rotation={[0.15, Math.sin(t * 0.9) * 0.3, 0]} scale={1.4 + kick(f, fBloq + 10, 10) * 0.1}>
          <CreditCard front={card} tint={frozen > 0.5 ? '#9fd8ff' : '#1d2b6b'} />
        </group>
        <Floor y={-0.6} color="#0f4a6b" />
      </Studio>
      <Headline text="LLAMA A TU BANCO" start={fLlama} y={230} size={96} color="#ffffff" />
      <Headline text="AHORA" start={fAhora} y={350} size={110} color="#7dd3fc" glitch={kick(f, fAhora, 10)} />
    </AbsoluteFill>
  );
};
