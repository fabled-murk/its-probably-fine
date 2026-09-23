#!/usr/bin/env python3
"""Replicate image generation for IT'S PROBABLY FINE. Writes <out>.png + <out>.json sidecar."""
import base64, json, os, sys, time, urllib.request, mimetypes

TOKEN = open(os.path.expanduser("~/.config/qm/replicate.token")).read().strip()
API = "https://api.replicate.com/v1"

STYLE_TOKEN = (
 "Stark high-contrast graphic illustration in a strictly three-colour palette: pure white #FFFFFF, "
 "pure black #0A0A0A, and one hot signal red #E01B18. No other hues whatsoever. Flat hard-edged shapes, "
 "no gradients, no airbrush, no texture. The look fuses SUPERHOT's minimalist white void and faceted "
 "low-poly geometry with Invader Zim's jagged cartoon expressionism: angular exaggerated anatomy, "
 "spindly limbs, oversized staring eyes, wonky Dutch-angle geometry, sharp triangular shadows. "
 "Confident black linework of constant medium weight. Hard single light source from upper left. "
 "Red is used sparingly as a signal colour only. No text, no lettering, no watermark, no signature, "
 "no border, no drop shadow, no glow."
)

def req(url, data=None, method=None):
    r = urllib.request.Request(url, data=json.dumps(data).encode() if data else None, method=method)
    r.add_header("Authorization", "Bearer " + TOKEN)
    r.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(r) as f:
        return json.loads(f.read())

def datauri(path):
    mt = mimetypes.guess_type(path)[0] or "image/png"
    return f"data:{mt};base64," + base64.b64encode(open(path,"rb").read()).decode()

def generate(model, subject, out, refs=None, aspect="1:1", extra=None):
    prompt = f"{subject}\n\nSTYLE: {STYLE_TOKEN}"
    inp = {"prompt": prompt}
    if model == "google/nano-banana":
        inp["output_format"] = "png"
        if refs: inp["image_input"] = [datauri(p) for p in refs]
        if aspect: inp["aspect_ratio"] = aspect
    elif model.startswith("bytedance/seedream"):
        inp["size"] = "2K"; inp["aspect_ratio"] = aspect
        if refs: inp["image_input"] = [datauri(p) for p in refs]
    else:
        inp["aspect_ratio"] = aspect; inp["output_format"] = "png"
    if extra: inp.update(extra)
    p = req(f"{API}/models/{model}/predictions", {"input": inp})
    pid = p["id"]
    for _ in range(180):
        if p["status"] in ("succeeded","failed","canceled"): break
        time.sleep(2); p = req(f"{API}/predictions/{pid}")
    if p["status"] != "succeeded":
        print(f"FAIL {out}: {p['status']} {p.get('error')}", flush=True); return None
    o = p["output"]; url = o[0] if isinstance(o, list) else o
    os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
    urllib.request.urlretrieve(url, out)
    json.dump({"model":model,"prompt":prompt,"subject":subject,"style_token":STYLE_TOKEN,
               "refs":refs or [],"aspect":aspect,"prediction_id":pid,"created":time.strftime("%Y-%m-%dT%H:%M:%SZ")},
              open(os.path.splitext(out)[0]+".json","w"), indent=2)
    print(f"OK {out}", flush=True); return out

if __name__ == "__main__":
    spec = json.load(open(sys.argv[1]))
    for job in spec:
        generate(job.get("model","google/nano-banana"), job["subject"], job["out"],
                 job.get("refs"), job.get("aspect","1:1"), job.get("extra"))
