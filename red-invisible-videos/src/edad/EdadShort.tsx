import React from 'react';
import {AbsoluteFill, Html5Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from '../components/Captions';
import {ensureFonts} from '../components/Fonts';
import {Flash, Grain, NumberField} from '../components/Fx';
import {SpaceBackground} from '../components/SpaceBackground';
import {DeckBeat, GreenTileBeat} from './HookBeats';
import {BinaryScene} from './BinaryScene';
import {CardScene} from './CardScene';
import {HookScene} from './HookScene';
import {CAPTIONS, CARD_DUR, CARD_START, s2f, T, VOICE_LINES} from './script';
import {SumScene} from './SumScene';

ensureFonts();

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 0.5}) => (
	<Sequence from={s2f(at)} durationInFrames={s2f(1.4)} layout="none">
		<Html5Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
	</Sequence>
);

export const EdadShort: React.FC<{voice?: boolean}> = ({voice}) => {
	const {durationInFrames} = useVideoConfig();
	const outroLen = T.outro.to - T.outro.from;
	const cuts = [T.beats.deck, T.beats.tile, ...CARD_START, T.sum.from, T.binary.from, T.outro.from];

	return (
		<AbsoluteFill>
			<SpaceBackground loopFrames={durationInFrames} />
			<NumberFieldTimed loopFrames={durationInFrames} />

			{/* 1. Gancho en 3 cortes */}
			<Sequence from={0} durationInFrames={s2f(T.beats.deck)} name="Gancho 1: escaneo">
				<HookCut1 len={T.beats.deck} />
			</Sequence>
			<Sequence from={s2f(T.beats.deck)} durationInFrames={s2f(T.beats.tile - T.beats.deck)} name="Gancho 2: 6 pantallas">
				<DeckBeat durationInFrames={s2f(T.beats.tile - T.beats.deck)} />
			</Sequence>
			<Sequence from={s2f(T.beats.tile)} durationInFrames={s2f(T.hook.to - T.beats.tile)} name="Gancho 3: súmalo">
				<GreenTileBeat durationInFrames={s2f(T.hook.to - T.beats.tile)} />
			</Sequence>

			{/* 2. Las 6 pantallas (la primera más larga) */}
			{CARD_START.map((at, i) => (
				<Sequence key={i} from={s2f(at)} durationInFrames={s2f(CARD_DUR[i])} name={`Pantalla ${i + 1}`}>
					<CardScene index={i} durationInFrames={s2f(CARD_DUR[i])} />
				</Sequence>
			))}

			{/* 3. Cuenta atrás y revelación */}
			<Sequence from={s2f(T.sum.from)} durationInFrames={s2f(T.sum.to - T.sum.from)} name="Revelación">
				<SumScene revealAt={T.sum.revealAt - T.sum.from} durationInFrames={s2f(T.sum.to - T.sum.from)} />
			</Sequence>

			{/* 4. El binario (corto: segundo "premio", el porqué) */}
			<Sequence from={s2f(T.binary.from)} durationInFrames={s2f(T.binary.to - T.binary.from)} name="Binario">
				<BinaryScene durationInFrames={s2f(T.binary.to - T.binary.from)} />
			</Sequence>

			{/* 5. Cierre = vuelve el plano del principio (bucle) */}
			<Sequence from={s2f(T.outro.from)} durationInFrames={s2f(outroLen)} name="Cierre (bucle)">
				<OutroLoop len={outroLen} />
			</Sequence>

			<Captions captions={CAPTIONS} />
			{cuts.map((at) => (
				<Flash key={at} at={s2f(at)} />
			))}
			<Grain />

			{/* Efectos de sonido */}
			<Sfx at={0.35} src="scan" volume={0.3} />
			<Sfx at={T.beats.deck} src="whoosh" volume={0.4} />
			{Array.from({length: 6}, (_, i) => (
				<Sfx key={`d${i}`} at={T.beats.deck + (2 + i * 3) / 30} src="tick" volume={0.35} />
			))}
			<Sfx at={T.beats.tile} src="slam" volume={0.6} />
			<Sfx at={T.beats.tile + 18 / 30} src="pop" volume={0.5} />
			{CARD_START.map((at, i) => (
				<React.Fragment key={`c${i}`}>
					<Sfx at={at} src="whoosh" volume={0.35} />
					<Sfx at={at + 0.12} src="pop" volume={0.35} />
				</React.Fragment>
			))}
			<Sfx at={T.sum.from} src="whoosh" volume={0.35} />
			<Sfx at={T.sum.from + 0.1} src="scan" volume={0.25} />
			{[0, 1, 2].map((k) => (
				<Sfx key={`cd${k}`} at={T.sum.revealAt - 1.8 + k * 0.6} src="tick" volume={0.6} />
			))}
			<Sfx at={T.sum.revealAt - 1.0} src="rise" volume={0.3} />
			<Sfx at={T.sum.revealAt} src="ding" volume={0.55} />
			<Sfx at={T.sum.revealAt} src="slam" volume={0.5} />
			<Sfx at={T.sum.revealAt + 0.9} src="pop" volume={0.45} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<Sfx key={`b${i}`} at={T.binary.from + (4 + i * 4) / 30} src="tick" volume={(27 >> (5 - i)) & 1 ? 0.5 : 0.15} />
			))}
			<Sfx at={T.binary.from + 32 / 30} src="pop" volume={0.5} />
			<Sfx at={T.outro.from} src="whoosh" volume={0.35} />

			{/* Voz: una pista por frase, generadas con `npm run voice` en public/voice/edad/ */}
			{voice
				? VOICE_LINES.map((l) => (
						<Sequence key={l.id} from={s2f(l.at)} durationInFrames={s2f(l.slot + 1)} layout="none" name={`Voz: ${l.id}`}>
							<Html5Audio src={staticFile(`voice/edad/${l.id}.mp3`)} volume={1} />
						</Sequence>
					))
				: null}
		</AbsoluteFill>
	);
};

/** Corte 1 del gancho: escaneo + acercamiento de cámara. */
const HookCut1: React.FC<{len: number}> = ({len}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	return <HookScene phase={t} scanFrom={0.35} scanTo={len - 0.15} push={t / len} />;
};

/** Números flotantes: más presentes en el gancho y el cierre, discretos en las pantallas. */
const NumberFieldTimed: React.FC<{loopFrames: number}> = ({loopFrames}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;
	const k = [0, T.hook.to - 0.3, T.cards.from, T.sum.from - 0.3, T.sum.from, T.outro.from - 0.3, T.outro.from, T.outro.to];
	const v = [0.32, 0.32, 0.08, 0.08, 0.18, 0.18, 0.32, 0.32];
	return <NumberField loopFrames={loopFrames} opacity={interpolate(t, k, v, {extrapolateRight: 'clamp'})} />;
};

/** El cierre usa la escena del gancho con la fase terminando en 0 = primer fotograma. */
const OutroLoop: React.FC<{len: number}> = ({len}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const phase = frame / fps - len; // termina en 0 -> enlaza con el fotograma 0
	return <HookScene phase={phase} enterFrame={0} />;
};
