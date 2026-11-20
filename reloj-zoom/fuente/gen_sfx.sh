#!/bin/bash
gen() { # name duration influence prompt
  for i in 1 2 3; do
    code=$(curl -sS -o "sfx/$1.mp3" -w "%{http_code}" -X POST https://api.elevenlabs.io/v1/sound-generation -H "Content-Type: application/json" -H "xi-api-key: dummy" --data-binary "$(python3 -c 'import json,sys;print(json.dumps({"text":sys.argv[3],"duration_seconds":float(sys.argv[1]),"prompt_influence":float(sys.argv[2])}))' "$2" "$3" "$4")")
    [ "$code" = "200" ] && { echo "$1 ok"; return; }
    echo "$1 fail $code"; sleep 3
  done
}
gen tick_a 0.5 0.7 "single crisp tick of a luxury mechanical wristwatch escapement, extremely close macro microphone, dry, isolated, no background"
gen tick_b 0.5 0.7 "single soft tock of a mechanical watch movement, metallic click, close macro, dry, isolated"
gen tick_slow 2.5 0.6 "slow motion deep heavy metallic clank of giant clockwork gear tooth hitting, cinematic, deep reverb tail"
gen whoosh_1 1.5 0.6 "fast cinematic whoosh swoosh transition, air, sweep"
gen whoosh_2 2 0.6 "deep cinematic zoom whoosh with sub bass, camera flying in fast"
gen whoosh_rev 2 0.6 "reverse whoosh riser sucking in, cinematic transition building up"
gen impact 2.5 0.6 "deep cinematic boom impact hit with metallic shimmer tail, trailer"
gen clink 1 0.7 "small metal watch parts clinking, tiny precision components lifted, delicate metallic"
gen dial_lift 2 0.6 "precision mechanism unlocking, metallic slide and click, watch case back opening, satisfying"
gen gears 6 0.5 "fine clockwork gears turning, tiny mechanical whirring and ratcheting, macro, continuous"
gen sparkle 2 0.6 "magical crystalline glint shimmer sparkle, gem catching light, subtle bell"
gen drone 22 0.4 "dark ambient cinematic drone, mysterious, low hum, slow evolving pad, no melody, documentary tension"
gen riser 4 0.6 "tension riser building up, ticking clock accelerating, cinematic suspense"
gen heartbeat 3 0.6 "deep slow heartbeat thump with metallic resonance"
gen slowmo_in 2 0.6 "time slowing down effect, pitch dropping whoosh, slow motion transition"
gen speedup 2 0.6 "time speeding up effect, rising pitch whoosh, fast forward transition"
echo DONE
