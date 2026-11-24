"""ASC Painting: banners de Natal (familia A, noite azul-ouro) e Ano Novo (familia E, ceu de fogos).
Uso: python -I asc_compose.py <saida_dir>
Gera desktop/mobile (png+webp) por festa, versao sem copy."""
import os, sys, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = r"C:\Users\pedroagostini_trajet\Downloads\BANNERS DE NATAL"
DL = os.path.join(ROOT, "app", "clients", "asc")
EL = os.path.join(ROOT, "app", "assets")
OUT = sys.argv[1]
FONT = r"C:\Windows\Fonts\seguibl.ttf"
GOLD_HI, GOLD_MID, GOLD_LO = (255, 236, 186), (226, 182, 98), (150, 104, 42)

def hexrgb(h): h = h.lstrip('#'); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def smooth(t): t = np.clip(t, 0, 1); return t * t * (3 - 2 * t)

def solid_bg(W, H, base, lift, cx, cy, r):
    """fundo de uma cor: base + clareamento radial suave (mesmo matiz)."""
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt(((x - cx) / r) ** 2 + ((y - cy) / r) ** 2)
    k = (1 - smooth(d))[..., None]
    b, l = np.array(base, np.float32), np.array(lift, np.float32)
    return b + (l - b) * k

def add(img, layer, amt=1.0): return np.clip(img + layer * amt, 0, 255)
def screen(img, layer): return 255 - (255 - img) * (255 - layer) / 255

def bokeh(W, H, n, box, rmin, rmax, alpha, seed, color=GOLD_MID, blur=10):
    rnd = random.Random(seed)
    L = Image.new("RGB", (W, H), (0, 0, 0)); d = ImageDraw.Draw(L)
    x0, y0, x1, y1 = box
    for _ in range(n):
        r = rnd.uniform(rmin, rmax); x = rnd.uniform(x0, x1); y = rnd.uniform(y0, y1)
        a = rnd.uniform(*alpha); c = tuple(int(v * a) for v in color)
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    return np.asarray(L.filter(ImageFilter.GaussianBlur(blur)), np.float32)

def dust(W, H, n, box, seed, maxa=0.9):
    rnd = random.Random(seed)
    L = Image.new("RGB", (W, H), (0, 0, 0)); d = ImageDraw.Draw(L)
    x0, y0, x1, y1 = box
    for _ in range(n):
        r = rnd.choice([1, 1, 1.5, 2, 2.5]); x = rnd.uniform(x0, x1); y = rnd.uniform(y0, y1)
        a = rnd.uniform(0.25, maxa); c = tuple(int(v * a) for v in GOLD_HI)
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
    return np.asarray(L.filter(ImageFilter.GaussianBlur(0.8)), np.float32)

def flare(W, H, cx, cy, core, streak, amt):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    dx, dy = x - cx, y - cy
    glow = np.exp(-(dx ** 2 + dy ** 2) / (2 * core ** 2))
    halo = np.exp(-(dx ** 2 + dy ** 2) / (2 * (core * 4) ** 2)) * 0.35
    st = np.exp(-(dy ** 2) / (2 * 2.5 ** 2)) * np.exp(-np.abs(dx) / streak) * np.where(dx < 0, np.exp(dx / (streak * .35)), 1.0)
    col = np.array([255, 196, 120], np.float32); hot = np.array([255, 246, 225], np.float32)
    return (glow[..., None] * hot + (halo + st * 0.9)[..., None] * col) * amt

def bezier(p0, p1, p2, p3, n=600):
    t = np.linspace(0, 1, n)[:, None]
    return ((1 - t) ** 3) * p0 + 3 * ((1 - t) ** 2) * t * p1 + 3 * (1 - t) * t * t * p2 + t ** 3 * p3

def gold_line(img, pts, width, ss=4):
    """filete metalico AA com reflexos ao longo do comprimento + glow."""
    H, W = img.shape[:2]
    L = Image.new("RGB", (W * ss, H * ss), (0, 0, 0)); d = ImageDraw.Draw(L)
    M = Image.new("L", (W * ss, H * ss), 0); dm = ImageDraw.Draw(M)
    n = len(pts)
    for i in range(n - 1):
        k = 0.5 + 0.5 * math.sin(i / (n - 1) * math.pi * 3.2 + 0.6)
        c = tuple(int(GOLD_LO[j] + (GOLD_HI[j] - GOLD_LO[j]) * k) for j in range(3))
        seg = [tuple(pts[i] * ss), tuple(pts[i + 1] * ss)]
        d.line(seg, fill=c, width=int(width * ss)); dm.line(seg, fill=255, width=int(width * ss))
    line = L.resize((W, H), Image.LANCZOS)
    m = np.asarray(M.resize((W, H), Image.LANCZOS), np.float32)[..., None] / 255
    img = add(img, np.asarray(line.filter(ImageFilter.GaussianBlur(9)), np.float32), .9)
    return img * (1 - m) + np.asarray(line, np.float32) * m

def place_photo(img, photo, x, y, fades):
    """cola a foto em escala 1:1 com rampas de alpha (px)."""
    ph = np.asarray(photo, np.float32); h, w = ph.shape[:2]
    a = np.ones((h, w), np.float32); yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    if fades.get('left'): a *= smooth(xx / fades['left'])
    if fades.get('right'): a *= smooth((w - 1 - xx) / fades['right'])
    if fades.get('top'): a *= smooth(yy / fades['top'])
    H, W = img.shape[:2]
    x0, y0 = max(x, 0), max(y, 0); x1, y1 = min(x + w, W), min(y + h, H)
    sub = ph[y0 - y:y1 - y, x0 - x:x1 - x]; sa = a[y0 - y:y1 - y, x0 - x:x1 - x][..., None]
    img[y0:y1, x0:x1] = img[y0:y1, x0:x1] * (1 - sa) + sub * sa
    return img

def cutout(path, width):
    im = Image.open(path).convert("RGBA")
    im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    s = width / im.width
    assert s <= 1.0, f"nunca ampliar recorte ({path} x{s:.2f})"
    return im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)

def paste(img, im, x, y):
    base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert("RGBA")
    base.alpha_composite(im, (x, y)) if x >= 0 and y >= 0 else base.paste(im, (x, y), im)
    return np.asarray(base.convert("RGB"), np.float32)

def fogos(img, path, cx, cy, width, amt=1.0):
    im = cutout(path, width); a = np.asarray(im, np.float32)
    rgb = a[..., :3] * (a[..., 3:] / 255) * amt
    H, W = img.shape[:2]; h, w = rgb.shape[:2]; x, y = int(cx - w / 2), int(cy - h / 2)
    x0, y0, x1, y1 = max(x, 0), max(y, 0), min(x + w, W), min(y + h, H)
    layer = np.zeros_like(img); layer[y0:y1, x0:x1] = rgb[y0 - y:y1 - y, x0 - x:x1 - x]
    return screen(img, layer)

def photo_port02():
    im = Image.open(os.path.join(DL, "natal-port-02.webp")).convert("RGB")
    return im.crop((16, 16, im.width - 16, im.height - 16))  # remove a borda de portfolio

def photo_marco():
    im = Image.open(os.path.join(DL, "ano-novo-marco-25-2.webp")).convert("RGB")
    im = im.crop((60, 30, 972, 668))  # tira a borda e a placa da ADT
    a = np.asarray(im, np.float32).copy()  # apaga o numero da casa
    x0, x1, y0, y1 = 520 - 60, 615 - 60, 386 - 30, 401 - 30
    for yy in range(y0, y1):  # interpola horizontalmente pela parede dos lados, mesma linha
        L = a[yy, x0 - 10:x0 - 3].mean(0); R = a[yy, x1 + 3:x1 + 10].mean(0)
        t = np.linspace(0, 1, x1 - x0)[:, None]; a[yy, x0:x1] = L * (1 - t) + R * t
    rng = np.random.default_rng(3); a[y0:y1, x0:x1] += rng.normal(0, 1.6, a[y0:y1, x0:x1].shape)
    return Image.fromarray(a.astype(np.uint8))

def grade(photo, exp=1.0, warm=0.0, sat=1.0):
    a = np.asarray(photo, np.float32) * exp
    g = a.mean(-1, keepdims=True); a = g + (a - g) * sat
    a[..., 0] += warm * 12; a[..., 2] -= warm * 10
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

def fit_width(photo, W, maxs=1.2):
    """foto na largura toda (mobile). Ampliacao leve permitida ate maxs, com Lanczos + nitidez."""
    s = W / photo.width
    assert s <= maxs, f"ampliacao {s:.2f} acima do limite"
    if abs(s - 1) < 1e-3: return photo
    im = photo.resize((W, round(photo.height * s)), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=45, threshold=2))

CANTO = os.path.join(EL, "natal/09-cantos-com-estrelas/variacao-01.png")
F = os.path.join(EL, "ano-novo/06-fogos")
NAVY_D, NAVY_L = (5, 22, 46), (14, 48, 92)

def natal_desktop():
    W, H = 1920, 800
    img = solid_bg(W, H, NAVY_D, NAVY_L, 980, 380, 900)
    ph = grade(photo_port02(), exp=.9, warm=.35, sat=.95); img = place_photo(img, ph, W - ph.width, H - ph.height, {'left': 260, 'top': 230})
    img = add(img, bokeh(W, H, 12, (1000, 0, 1900, 230), 18, 46, (.12, .3), 7, blur=12))
    img = add(img, dust(W, H, 160, (930, 0, 1920, 360), 11, .7))
    img = gold_line(img, bezier(np.array([1060, -10.]), np.array([940, 260.]), np.array([1010, 560.]), np.array([905, 810.])), 3.2)
    img = add(img, flare(W, H, 957, 318, 7, 70, 1.0))
    c = cutout(CANTO, 430); return paste(img, c, W - c.width + 8, -6)

def natal_mobile():
    W, H = 1080, 1350
    img = solid_bg(W, H, NAVY_D, NAVY_L, 540, 700, 900)
    ph = fit_width(grade(photo_port02(), exp=.9, warm=.35, sat=.95), W); img = place_photo(img, ph, 0, H - ph.height, {'top': 230})
    img = add(img, bokeh(W, H, 9, (520, 640, 1060, 820), 16, 40, (.12, .28), 5, blur=11))
    img = add(img, dust(W, H, 110, (0, 620, 1080, 860), 21, .6))
    img = gold_line(img, bezier(np.array([-10, 690.]), np.array([330, 610.]), np.array([700, 720.]), np.array([1090, 640.])), 3.0)
    img = add(img, flare(W, H, 330, 652, 6, 130, 1.0))
    c = cutout(CANTO, 300); return paste(img, c, W - c.width + 6, 592)

def ny_desktop():
    W, H = 1920, 800
    img = solid_bg(W, H, (3, 9, 22), (10, 26, 54), 1400, 120, 1000)
    ph = grade(photo_marco(), exp=.9, warm=.3, sat=.95)
    img = place_photo(img, ph, W - ph.width, H - ph.height, {'left': 280, 'top': 260})
    img = add(img, dust(W, H, 120, (1000, 0, 1920, 300), 31, .6))
    img = add(img, bokeh(W, H, 10, (1080, 0, 1900, 200), 16, 40, (.1, .25), 9, blur=12))
    img = fogos(img, os.path.join(F, "06-fogos-01.png"), 1480, 96, 330)
    img = fogos(img, os.path.join(F, "06-fogos-08.png"), 1780, 92, 220, .85)
    img = fogos(img, os.path.join(F, "06-fogos-04.png"), 1185, 120, 230, .65)
    return add(img, flare(W, H, 1480, 96, 8, 60, .5))

def ny_mobile():
    W, H = 1080, 1350
    img = solid_bg(W, H, (3, 9, 22), (10, 26, 54), 760, 780, 800)
    m0 = grade(photo_marco(), exp=.9, warm=.3, sat=.95); m0 = m0.crop((0, 0, m0.width, m0.height - 95))  # tira a rua
    ph = fit_width(m0, W)
    img = place_photo(img, ph, 0, H - ph.height, {'top': 230})
    img = add(img, dust(W, H, 80, (480, 640, 1080, 860), 41, .55))
    img = fogos(img, os.path.join(F, "06-fogos-01.png"), 880, 690, 220)
    img = fogos(img, os.path.join(F, "06-fogos-08.png"), 715, 642, 90, .8)
    return add(img, flare(W, H, 880, 690, 7, 50, .45))

def preview(img, box, lines, size, sub, btn, btn_col):
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    x, y, w, h = box
    f = ImageFont.truetype(FONT, size); fs = ImageFont.truetype(r"C:\Windows\Fonts\segoeui.ttf", int(size * .26))
    fb = ImageFont.truetype(FONT, int(size * .21)); lh = int(size * 1.02)
    total = lh * len(lines) + int(size * .85) + int(size * .62)
    cy = y + (h - total) // 2
    for t in lines: d.text((x, cy), t, font=f, fill="white"); cy += lh
    cy += int(size * .2); d.text((x, cy), sub, font=fs, fill=(230, 236, 245)); cy += int(size * .65)
    bw = d.textlength(btn, font=fb) + size * .7
    d.rectangle([x, cy, x + bw, cy + size * .62], fill=btn_col)
    d.text((x + size * .35, cy + size * .17), btn, font=fb, fill="white")
    d.rectangle([x, y, x + w, y + h], outline=(255, 0, 255), width=1)
    return im

def save(img, name):
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    os.makedirs(os.path.dirname(name), exist_ok=True)
    im.save(name + ".png", optimize=True); im.save(name + ".webp", quality=90, method=6)

if __name__ == "__main__":
    # versao sem copy: so a arte (desktop/mobile) de cada festa
    jobs = {("natal", "desktop"): natal_desktop, ("natal", "mobile"): natal_mobile,
            ("ano-novo", "desktop"): ny_desktop, ("ano-novo", "mobile"): ny_mobile}
    for (fest, fmt), fn in jobs.items():
        save(fn(), os.path.join(OUT, fest, fmt)); print("ok", fest, fmt)
