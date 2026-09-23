#!/usr/bin/env python3
"""Flood-fill the backdrop out from the border. Works for green screens and white voids alike,
because interior whites are not connected to the border."""
from PIL import Image
from collections import deque
import sys, os

def key(path, out, tol=40):
    im = Image.open(path).convert('RGBA')
    w,h = im.size
    px = im.load()
    # backdrop colour = median-ish of the border ring
    ring = [px[x,0] for x in range(0,w,3)] + [px[x,h-1] for x in range(0,w,3)] \
         + [px[0,y] for y in range(0,h,3)] + [px[w-1,y] for y in range(0,h,3)]
    from collections import Counter
    bg = Counter([(r//12*12,g//12*12,b//12*12) for r,g,b,a in ring]).most_common(1)[0][0]
    isgreen = bg[1] > 100 and bg[1]-bg[0] > 50 and bg[1]-bg[2] > 50
    mask = bytearray(w*h)
    q = deque()
    def match(c):
        return abs(c[0]-bg[0])<=tol and abs(c[1]-bg[1])<=tol and abs(c[2]-bg[2])<=tol
    for x in range(w):
        for y in (0,h-1):
            if not mask[y*w+x] and match(px[x,y]): mask[y*w+x]=1; q.append((x,y))
    for y in range(h):
        for x in (0,w-1):
            if not mask[y*w+x] and match(px[x,y]): mask[y*w+x]=1; q.append((x,y))
    while q:
        x,y = q.popleft()
        for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
            nx,ny = x+dx, y+dy
            if 0<=nx<w and 0<=ny<h and not mask[ny*w+nx] and match(px[nx,ny]):
                mask[ny*w+nx]=1; q.append((nx,ny))
    cleared = 0
    for y in range(h):
        row = y*w
        for x in range(w):
            if mask[row+x]:
                px[x,y] = (0,0,0,0); cleared += 1
            elif isgreen:
                r,g,b,a = px[x,y]
                if g > r and g > b:  # despill
                    g = (r+b)//2
                    px[x,y] = (r,g,b,a)
    # crop to content, keep the vertical extent
    bbox = im.getbbox()
    if bbox: im = im.crop(bbox)
    im.save(out)
    return round(100*cleared/(w*h),1), im.size

for n in sys.argv[1:]:
    pct, size = key(f'art/out/{n}.png', f'docs/assets/{n}.png')
    print(f'{n}: cleared {pct}% -> {size}')
