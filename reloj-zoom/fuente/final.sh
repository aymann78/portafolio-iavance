#!/bin/bash
set -e
cd "$(dirname "$0")"
n=$(ls out/frames/*.png | wc -l); [ "$n" -eq 930 ] || { echo "only $n frames"; exit 1; }
ffmpeg -v error -y -framerate 30 -i out/frames/f%04d.png -c:v libx264 -preset slow -crf 10 -pix_fmt yuv420p out/video3d.mp4
OS=2 node render_overlay.js en & OS=2 node render_overlay.js es & wait
python3 mix_audio.py
for L in en es; do
  # 4K master
  ffmpeg -v error -y -i out/video3d.mp4 -i out/overlay_$L.mov -i out/audio.wav \
    -filter_complex "[0:v]scale=2160:3840:flags=lanczos,unsharp=5:5:0.35:5:5:0.0[b];[b][1:v]overlay=format=auto,format=yuv420p[v];[2:a]loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
    -map "[v]" -map "[a]" -c:v libx264 -preset slow -crf 18 -profile:v high -level 5.2 -r 30 \
    -c:a aac -b:a 256k -ar 48000 -movflags +faststart -t 31 out/RELOJ_ZOOM_4K_$L.mp4
  # light 1080p copy for previews
  ffmpeg -v error -y -i out/RELOJ_ZOOM_4K_$L.mp4 -vf scale=1080:1920:flags=lanczos -c:v libx264 -preset slow -crf 20 -c:a copy -movflags +faststart out/RELOJ_ZOOM_1080p_$L.mp4
done
ls -la out/*.mp4
