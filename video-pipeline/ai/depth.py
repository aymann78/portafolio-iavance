"""Mapas de profundidad con Depth Anything V2 Small (open source, CPU).
Uso: python depth.py <plates_dir> <out_dir> <depth_model_dir>"""
import sys, os, glob, numpy as np, torch
from PIL import Image, ImageFilter
from transformers import AutoImageProcessor, AutoModelForDepthEstimation
src, out, mdir = sys.argv[1:4]; os.makedirs(out, exist_ok=True)
proc = AutoImageProcessor.from_pretrained(mdir); model = AutoModelForDepthEstimation.from_pretrained(mdir).eval()
for f in sorted(glob.glob(f"{src}/*.png")):
    sid = os.path.basename(f)[:-4]
    if os.path.exists(f"{out}/{sid}_d.png") and os.path.getmtime(f"{out}/{sid}_d.png") > os.path.getmtime(f): continue
    img = Image.open(f).convert("RGB")
    img.resize((1280, 720), Image.LANCZOS).save(f"{out}/{sid}.jpg", quality=93)
    with torch.inference_mode():
        d = model(**proc(images=img, return_tensors="pt")).predicted_depth[0].numpy()
    d = (d - np.percentile(d, 1)) / (np.percentile(d, 99.5) - np.percentile(d, 1) + 1e-6)
    dm = Image.fromarray((np.clip(d, 0, 1) * 255).astype(np.uint8)).resize((640, 360), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
    dm.save(f"{out}/{sid}_d.png"); print("depth", sid, flush=True)
