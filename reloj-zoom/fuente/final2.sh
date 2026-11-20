#!/bin/bash
set -e
cd "$(dirname "$0")"
pgrep -f http.server >/dev/null || (python3 -m http.server 8765 >/dev/null 2>&1 &); sleep 1
OS=2 node render_overlay.js en & OS=2 node render_overlay.js es & wait
mkdir -p out/v2
for L in es en; do
  ffmpeg -v error -y -i out/video3d.mp4 -i out/overlay_$L.mov \
    -filter_complex "[0:v]scale=2160:3840:flags=lanczos,unsharp=5:5:0.35:5:5:0.0[b];[b][1:v]overlay=format=auto,format=yuv420p,split[v1][v2];[v2]scale=1080:1920:flags=lanczos[s]" \
    -map "[v1]" -c:v libx265 -preset medium -b:v 22M -maxrate 30M -bufsize 44M -tag:v hvc1 -x265-params log-level=error -r 30 -t 31 out/v2/v4k_$L.mp4 \
    -map "[s]" -c:v libx264 -preset slow -crf 20 -r 30 -t 31 out/v2/v1080_$L.mp4
done
A="-c:a aac -b:a 256k -ar 48000 -movflags +faststart -t 31"
for R in 4k 1080; do
  ffmpeg -v error -y -i out/v2/v${R}_en.mp4 -i out/audio.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 $A out/v2/RELOJ_ZOOM_${R}_en.mp4
  ffmpeg -v error -y -i out/v2/v${R}_es.mp4 -i out/audio.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1.5:LRA=11 $A out/v2/RELOJ_ZOOM_${R}_es.mp4
  ffmpeg -v error -y -i out/v2/v${R}_es.mp4 -i out/audio_vo_es.wav -map 0:v -map 1:a -c:v copy -af loudnorm=I=-14:TP=-1:LRA=9 $A out/v2/RELOJ_ZOOM_${R}_es_VOZ.mp4
done
ls -la out/v2
