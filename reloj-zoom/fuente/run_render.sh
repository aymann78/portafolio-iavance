#!/bin/bash
# idempotent launcher: starts static server + two interleaved render workers if not running
cd "$(dirname "$0")"
pgrep -f "http.server 8765" >/dev/null || (nohup python3 -m http.server 8765 >/dev/null 2>&1 &)
sleep 1
pgrep -f "render_frames.js 0 930 2" >/dev/null || (SS=1.3334 nohup node render_frames.js 0 930 2 >> out/logE.txt 2>&1 &)
pgrep -f "render_frames.js 1 930 2" >/dev/null || (SS=1.3334 nohup node render_frames.js 1 930 2 >> out/logO.txt 2>&1 &)
