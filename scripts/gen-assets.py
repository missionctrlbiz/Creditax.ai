#!/usr/bin/env python3
"""Regenerate the 2026-10-04 brand assets inside the creditax work tree.
Run from the repo root: python3 gen-assets.py
1. /icon.png + /icon-dark.png — network-C mark cropped from the logo files
   (gap-detected split from the wordmark), padded square, transparent.
2. Feature icons — white app-tile + shadow flood-removed (seeded from edges,
   stops at saturated subject pixels; mint-outlined papers survive).
3. Blog 1:1 covers — blur-padded square variants (*-sq.png), feathered blend,
   nothing cropped.
"""
from PIL import Image, ImageFilter
from collections import deque
import glob

# ---------- 1. logo marks -> square icons ----------
def col_alpha_profile(im, xmax):
    a = im.getchannel('A')
    w, h = im.size
    px = a.load()
    last_content = 0
    run = 0
    for x in range(xmax):
        m = 0
        for y in range(0, h, 2):
            if px[x, y] > 40:
                m = 255
                break
        if m:
            last_content = x
            run = 0
        else:
            run += 1
            if run >= 15 and last_content > 0:
                return last_content + 1
    return last_content + 1

for src, dst in [('public/logo.png', 'public/icon.png'),
                 ('public/logo-dark.png', 'public/icon-dark.png')]:
    im = Image.open(src).convert('RGBA')
    cut = col_alpha_profile(im, 320)
    left = im.crop((0, 0, cut, im.size[1]))
    bbox = left.getchannel('A').getbbox()
    mark = left.crop(bbox)
    mw, mh = mark.size
    side = max(mw, mh) + 8
    canvas = Image.new('RGBA', (side, side), (0, 0, 0, 0))
    canvas.paste(mark, ((side - mw) // 2, (side - mh) // 2), mark)
    canvas.resize((256, 256), Image.LANCZOS).save(dst)
    print('icon:', dst)

# ---------- 2. feature icon tile removal ----------
def strip_tile(path):
    im = Image.open(path).convert('RGBA')
    w, h = im.size
    px = im.load()

    def is_bg(p):
        r, g, b, a = p
        lum = (r + g + b) / 3
        sat = max(r, g, b) - min(r, g, b)
        return a > 0 and lum > 110 and sat < 42

    seeds = [(40, 40), (w - 40, 40), (40, h - 40), (w - 40, h - 40),
             (w // 2, 30), (30, h // 2), (w - 30, h // 2)]
    seen = set()
    q = deque()
    for s in seeds:
        if 0 <= s[0] < w and 0 <= s[1] < h and is_bg(px[s[0], s[1]]):
            seen.add(s)
            q.append(s)
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and (nx, ny) not in seen and is_bg(px[nx, ny]):
                seen.add((nx, ny))
                q.append((nx, ny))
    for (x, y) in seen:
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, 0)
    im.save(path)
    print('tile-stripped:', path, len(seen), 'px')

strip_tile('public/images/icons/icon-documents.png')
strip_tile('public/images/icons/icon-marketplace.png')

# ---------- 3. blog 1:1 covers ----------
FEATHER = 90
for f in sorted(glob.glob('public/blog/blog-*.png')):
    if '-sq' in f:
        continue
    im = Image.open(f).convert('RGB')
    w, h = im.size
    side = max(w, h)
    backdrop = im.resize((side, side), Image.LANCZOS).filter(ImageFilter.GaussianBlur(70))
    fg = im if h == side else im.resize((side, int(h * side / w)), Image.LANCZOS)
    fw, fh = fg.size
    mask = Image.new('L', (fw, fh), 255)
    mp = mask.load()
    for y in range(FEATHER):
        v = int(255 * y / FEATHER)
        for x in range(fw):
            mp[x, y] = v
            mp[x, fh - 1 - y] = v
    canvas = backdrop.copy()
    canvas.paste(fg, ((side - fw) // 2, (side - fh) // 2), mask)
    canvas.save(f.replace('.png', '-sq.png'), optimize=True)
    print('square:', f.replace('.png', '-sq.png'))
print('GEN-ASSETS DONE')
