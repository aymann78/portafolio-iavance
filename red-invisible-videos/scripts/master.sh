#!/usr/bin/env bash
# Masteriza el audio de un render a -14 LUFS (lo que usa YouTube) sin tocar el vídeo.
#   bash scripts/master.sh out/edad-sin-voz.mp4 renders/edad-sin-voz.mp4
set -euo pipefail
IN="$1"; OUT="$2"
STATS=$(ffmpeg -hide_banner -i "$IN" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$STATS" | grep "\"$1\"" | sed -E 's/.*: "([^"]+)".*/\1/'; }
ffmpeg -v error -y -i "$IN" -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true" -c:a aac -b:a 192k -ar 48000 "$OUT"
ffmpeg -hide_banner -i "$OUT" -af ebur128 -f null - 2>&1 | grep -E "^\s+I:" | sed 's/^ */Loudness final: /'
