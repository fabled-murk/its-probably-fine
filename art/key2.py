#!/usr/bin/env python3
"""Backdrop removal v2.

The art is a locked three-colour palette (white/black/red), so ANY green pixel is
either backdrop or spill, wherever it sits. So:
  1. flood-fill the border backdrop (handles white voids as well as green screens)
  2. global soft chroma key on greenness, so enclosed pockets go too
  3. despill: clamp the green channel on every surviving pixel
  4. erode a hair of alpha to eat the last anti-aliased fringe
"""
from PIL import Image, ImageFilter
from collections import deque, Counter
import sys, os

FULL, SOFT = 34, 8          # greenness thresholds

def greenness(r, g, b):
    return g - max(r, b)

def key(path, out):
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()

    # --- 1. border flood fill (any backdrop colour) ---
    ring = [px[x,0] for x in range(0,w,3)] + [px[x,h-1] for x in range(0,w,3)] \
         + [px[0,y] for y in range(0,h,3)] + [px[w-1,y] for y in range(0,h,3)]
    bg = Counter([(r//12*12, g//12*12, b//12*12) for r,g,b,a in ring]).most_common(1)[0][0]
    tol = 40
    def match(c):
        return abs(c[0]-bg[0])<=tol and abs(c[1]-bg[1])<=tol and abs(c[2]-bg[2])<=tol
    seen = bytearray(w*h); q = deque()
    for x in range(w):
        for y in (0, h-1):
            if not seen[y*w+x] and match(px[x,y]): seen[y*w+x]=1; q.append((x,y))
    for y in range(h):
        for x in (0, w-1):
            if not seen[y*w+x] and match(px[x,y]): seen[y*w+x]=1; q.append((x,y))
    while q:
        x,y = q.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx,ny = x+dx, y+dy
            if 0<=nx<w and 0<=ny<h and not seen[ny*w+nx] and match(px[nx,ny]):
                seen[ny*w+nx]=1; q.append((nx,ny))

    # --- 2 + 3. global soft green key and despill ---
    killed = 0
    for y in range(h):
        row = y*w
        for x in range(w):
            r,g,b,a = px[x,y]
            if seen[row+x]:
                px[x,y] = (0,0,0,0); killed += 1
                continue
            gn = greenness(r,g,b)
            if gn >= FULL:
                px[x,y] = (0,0,0,0); killed += 1
            elif gn > SOFT:
                # partial transparency across the fringe, plus full despill
                frac = (gn - SOFT) / (FULL - SOFT)
                na = int(a * (1 - frac))
                m = max(r,b)
                px[x,y] = (r, m, b, na)
            elif gn > 0:
                px[x,y] = (r, max(r,b), b, a)

    # --- 4. shave one pixel of alpha off the silhouette edge ---
    r_,g_,b_,al = im.split()
    al = al.filter(ImageFilter.MinFilter(3))
    im = Image.merge('RGBA', (r_,g_,b_,al))

    bbox = im.getbbox()
    if bbox: im = im.crop(bbox)
    im.save(out)
    return round(100*killed/(w*h),1), im.size

for n in sys.argv[1:]:
    pct, size = key(f'art/out/{n}.png', f'docs/assets/{n}.png')
    print(f'{n}: removed {pct}% -> {size}')
