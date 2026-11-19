import React from 'react';
import {AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Captions} from '../components/Captions';
import {ensureFonts} from '../components/Fonts';
import {SpaceBackground} from '../components/SpaceBackground';
import {BinaryScene} from './BinaryScene';
import {CardScene} from './CardScene';
import {HookScene} from './HookScene';
import {CAPTIONS, s2f, T, VOICE_LINES} from './script';
import {SumScene} from './SumScene';

ensureFonts();

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 0.5}) => (
	<Sequence from={s2f(at)} durationInFrames={s2f(1.4)} layout="none">
		<Html5Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
	</Sequence>
);

export const EdadShort: React.FC<{voice?: boolean}> = ({voice}) => {
	const {durationInFrames} = useVideoConfig();
	const cardFrames = s2f(T.cards.each);
	const outroLen = T.outro.to - T.outro.from;

	return (
		<AbsoluteFill>
			<SpaceBackground loopFrames={durationInFrames} />

			{/* 1. Gancho */}
			<Sequence from={0} durationInFrames={s2f(T.hook.to)} name="Gancho">
				<HookScene phase={0} demoAt={3.0} />
			</Sequence>

			{/* 2. Las 6 pantallas */}
			{Array.from({length: 6}, (_, i) => (
				<Sequence key={i} from={s2f(T.cards.from) + i * cardFrames} durationInFrames={cardFrames} name={`Pantalla ${i + 1}`}>
					<CardScene index={i} durationInFrames={cardFrames} />
				</Sequence>
			))}

			{/* 3. La suma */}
			<Sequence from={s2f(T.sum.from)} durationInFrames={s2f(T.sum.to - T.sum.from)} name="Suma">
				<SumScene revealAt={27.5 - T.sum.from} durationInFrames={s2f(T.sum.to - T.sum.from)} />
			</Sequence>

			{/* 4. El binario */}
			<Sequence from={s2f(T.binary.from)} durationInFrames={s2f(T.binary.to - T.binary.from)} name="Binario">
				<BinaryScene durationInFrames={s2f(T.binary.to - T.binary.from)} />
			</Sequence>

			{/* 5. Cierre = vuelve el plano del principio (bucle) */}
			<Sequence from={s2f(T.outro.from)} durationInFrames={s2f(outroLen)} name="Cierre (bucle)">
				<OutroLoop len={outroLen} />
			</Sequence>

			<Captions captions={CAPTIONS} />

			{/* Efectos de sonido */}
			<Sfx at={3.0} src="pop" volume={0.55} />
			{Array.from({length: 6}, (_, i) => (
				<React.Fragment key={i}>
					<Sfx at={T.cards.from + i * T.cards.each} src="whoosh" volume={0.35} />
					<Sfx at={T.cards.from + i * T.cards.each + 0.25} src="tick" volume={0.4} />
				</React.Fragment>
			))}
			<Sfx at={T.sum.from} src="whoosh" volume={0.35} />
			{[0, 1, 2].map((i) => (
				<Sfx key={i} at={T.sum.from + (3 + i * 6) / 30} src="pop" volume={0.4} />
			))}
			<Sfx at={26.6} src="rise" volume={0.3} />
			<Sfx at={27.5} src="ding" volume={0.55} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<Sfx key={i} at={T.binary.from + (8 + i * 6) / 30} src="tick" volume={(27 >> (5 - i)) & 1 ? 0.5 : 0.15} />
			))}
			<Sfx at={T.binary.from + 48 / 30} src="pop" volume={0.5} />
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

/** El cierre usa la escena del gancho con la fase terminando en 0 = primer fotograma. */
const OutroLoop: React.FC<{len: number}> = ({len}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const phase = frame / fps - len; // termina en 0 -> enlaza con el fotograma 0
	return <HookScene phase={phase} enterFrame={0} />;
};
