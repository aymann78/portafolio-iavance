"""Genera imágenes con DreamShaper XL Lightning (open source, CPU bf16).
Uso: python gen.py shots.json outdir [ids...]"""
import json, sys, time, os, torch
from diffusers import StableDiffusionXLPipeline, DPMSolverMultistepScheduler
MODEL = os.environ.get("SDXL_MODEL", "models/dreamshaper")
STYLE = "cinematic 3d animated film still, pixar style, dramatic lighting, shallow depth of field, highly detailed"
FLAME = "a single magical floating flame of real fire, layered red orange and golden fire, white-hot core, sparks"
NEG = ("face, eyes, mouth, smile, cheeks, arms, legs, hands, feet, mascot, character, cute, toy, person, human, animal, creature, "
       "text, watermark, blurry, lowres, deformed")
torch.set_num_threads(4)
pipe = StableDiffusionXLPipeline.from_pretrained(MODEL, torch_dtype=torch.bfloat16, variant="fp16", use_safetensors=True)
pipe.scheduler = DPMSolverMultistepScheduler.from_config(pipe.scheduler.config, use_karras_sigmas=True, algorithm_type="sde-dpmsolver++")
pipe.set_progress_bar_config(disable=True)
shots = json.load(open(sys.argv[1])); out = sys.argv[2]; os.makedirs(out, exist_ok=True)
only = set(sys.argv[3:])
for s in shots:
    if only and s["id"] not in only: continue
    path = f"{out}/{s['id']}.png"
    if os.path.exists(path) and not only: continue
    prompt = STYLE + ", " + s["prompt"].replace("{FLAME}", FLAME)
    t0 = time.time()
    g = torch.Generator().manual_seed(s.get("seed", 1234))
    with torch.inference_mode():
        img = pipe(prompt=prompt, negative_prompt=NEG + ", " + s.get("neg", ""), width=s.get("w", 1152), height=s.get("h", 648),
                   num_inference_steps=s.get("steps", 6), guidance_scale=s.get("cfg", 2.0), generator=g).images[0]
    img.save(path); print(f"{s['id']}: {time.time()-t0:.0f}s", flush=True)
