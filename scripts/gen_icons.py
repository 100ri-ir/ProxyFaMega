#!/usr/bin/env python3
"""Generate ProxyFaMega app icons (iOS-style squircle + gradient + bolt)."""
from PIL import Image, ImageDraw, ImageFilter
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "assets", "icons")
os.makedirs(OUT, exist_ok=True)

S = 1024  # master size


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def gradient_3(w, h, c1, c2, c3):
    """Diagonal 3-stop gradient."""
    img = Image.new("RGB", (w, h))
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = (x / max(w - 1, 1) * 0.55 + y / max(h - 1, 1) * 0.45)
            if t < 0.5:
                c = lerp(c1, c2, t * 2)
            else:
                c = lerp(c2, c3, (t - 0.5) * 2)
            px[x, y] = c
    return img


def make_master():
    # vibrant iOS-style gradient: indigo -> violet -> pink
    c1, c2, c3 = (99, 102, 241), (168, 85, 247), (236, 72, 153)
    base = gradient_3(S, S, c1, c2, c3).convert("RGBA")

    # soft radial highlight (top-left gloss)
    gloss = Image.new("L", (S, S), 0)
    gd = ImageDraw.Draw(gloss)
    gd.ellipse([-S * 0.35, -S * 0.45, S * 0.95, S * 0.55], fill=90)
    gloss = gloss.filter(ImageFilter.GaussianBlur(S * 0.12))
    white = Image.new("RGBA", (S, S), (255, 255, 255, 255))
    base = Image.composite(white, base, gloss).convert("RGBA")

    # lightning bolt (polygon), with soft shadow
    bolt = [(580, 128), (350, 570), (492, 570), (404, 896),
            (700, 452), (544, 452), (664, 128)]
    # shadow
    sh = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.polygon([(x + 10, y + 22) for x, y in bolt], fill=(30, 10, 60, 120))
    sh = sh.filter(ImageFilter.GaussianBlur(18))
    base = Image.alpha_composite(base, sh)

    d = ImageDraw.Draw(base)
    d.polygon(bolt, fill=(255, 255, 255, 255))

    # squircle mask (iOS ~22.5% radius)
    mask = Image.new("L", (S, S), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.225), fill=255)

    out = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    out.paste(base, (0, 0), mask)
    return out


def main():
    master = make_master()
    for size in (16, 32, 48, 64, 128, 256, 512):
        img = master.resize((size, size), Image.LANCZOS)
        path = os.path.join(OUT, f"icon{size}.png")
        img.save(path, "PNG")
        print(f"wrote {path} ({size}x{size})")
    print("done")


if __name__ == "__main__":
    main()
