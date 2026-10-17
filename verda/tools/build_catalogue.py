"""
Build the Verda sample catalogue.

Outputs
  verda/products.csv               WooCommerce import file (Products -> Import)
  verda/images/products/<sku>.jpg  Verda-branded pack images

All prices, stock and pack sizes are SAMPLE values for the proof of concept.
Run:  python3 verda/tools/build_catalogue.py
"""
import csv
import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG_DIR = os.path.join(ROOT, "images", "products")
LOGO = os.path.join(ROOT, "images", "verda-logo.png")
RAW = "https://raw.githubusercontent.com/kr15lalit/Github/claude/funny-euler-c0bsfh/verda/images/products/"
FONT_DIR = "/usr/share/fonts/opentype/inter/"

# (sku, name, category, label, sub-label, size, mrp, sale, stock, colour, shape, featured, short description)
PRODUCTS = [
    # Healthy Snacks
    ("VS-JP-CS", "Jowar Puffs – Classic Salted", "Healthy Snacks", "Jowar Puffs", "Classic Salted", "100 g", 99, 89, 120, "#e3a72f", "pouch", 1, "Light, crunchy sorghum puffs with a pinch of salt. High in fibre, never fried."),
    ("VS-JP-PP", "Jowar Puffs – Peri Peri", "Healthy Snacks", "Jowar Puffs", "Peri Peri", "100 g", 99, 89, 100, "#d4492f", "pouch", 0, "Sorghum puffs tossed in a fiery peri peri seasoning. Roasted, not fried."),
    ("VS-JP-CH", "Jowar Puffs – Cheese & Herbs", "Healthy Snacks", "Jowar Puffs", "Cheese & Herbs", "100 g", 109, None, 80, "#e8c23a", "pouch", 0, "Cheesy, herby jowar puffs — a wholesome tea-time snack for kids and adults."),
    ("VS-BP-MM", "Bajra Puffs – Masala Magic", "Healthy Snacks", "Bajra Puffs", "Masala Magic", "100 g", 99, 85, 110, "#b8562b", "pouch", 1, "Pearl millet puffs with a tangy desi masala. Iron-rich and gluten-free."),
    ("VS-BP-TT", "Bajra Puffs – Tangy Tomato", "Healthy Snacks", "Bajra Puffs", "Tangy Tomato", "100 g", 99, None, 90, "#c8322f", "pouch", 0, "Crunchy bajra puffs with a sweet-and-tangy tomato twist."),
    ("VS-MP-C4", "Millet Puffs Combo – Pack of 4", "Healthy Snacks", "Millet Puffs", "Combo · Pack of 4", "4 × 100 g", 399, 349, 60, "#1f5f23", "box", 1, "Four bestselling jowar and bajra puff flavours in one value pack."),
    # Makhana
    ("VS-MK-PL250", "Premium Phool Makhana – Plain", "Makhana", "Phool Makhana", "Premium · Plain", "250 g", 349, 299, 150, "#f1e7d0", "pouch", 1, "Hand-picked, large-size fox nuts from Bihar. Perfect for roasting, kheer and curries."),
    ("VS-MK-PS", "Roasted Makhana – Himalayan Pink Salt", "Makhana", "Roasted Makhana", "Himalayan Pink Salt", "80 g", 149, 129, 140, "#e7a9b0", "pouch", 1, "Fox nuts slow-roasted in olive oil with Himalayan pink salt."),
    ("VS-MK-PP", "Roasted Makhana – Peri Peri", "Makhana", "Roasted Makhana", "Peri Peri", "80 g", 149, 129, 130, "#d4492f", "pouch", 0, "Crunchy roasted makhana with a bold peri peri kick."),
    ("VS-MK-CO", "Roasted Makhana – Cream & Onion", "Makhana", "Roasted Makhana", "Cream & Onion", "80 g", 149, None, 120, "#6aa36f", "pouch", 0, "Classic cream and onion flavour on light, roasted fox nuts."),
    ("VS-MK-MP", "Roasted Makhana – Mint Pudina", "Makhana", "Roasted Makhana", "Mint Pudina", "80 g", 149, 135, 100, "#3f9b6b", "pouch", 0, "Cool mint and pudina seasoning — a refreshing, guilt-free snack."),
    ("VS-MK-FP1K", "Makhana Family Pack", "Makhana", "Phool Makhana", "Family Pack", "1 kg", 1199, 999, 40, "#f1e7d0", "box", 0, "Bulk pack of premium plain makhana for the whole family."),
    # Dry Fruits & Nuts
    ("VS-DF-AL500", "California Almonds", "Dry Fruits & Nuts", "California Almonds", "Premium · Whole", "500 g", 649, 579, 90, "#a4673a", "pouch", 1, "Crunchy, naturally sweet California almonds, graded for size and freshness."),
    ("VS-DF-CW500", "Whole Cashews W240", "Dry Fruits & Nuts", "Whole Cashews", "W240 Grade", "500 g", 699, 629, 85, "#e2c48d", "pouch", 1, "Large W240 whole cashews — creamy, crunchy and perfect for gifting."),
    ("VS-DF-BR250", "Afghani Black Raisins", "Dry Fruits & Nuts", "Black Raisins", "Afghani · Seedless", "250 g", 299, None, 70, "#4a2a3b", "pouch", 0, "Soft, seedless black raisins, rich in iron and antioxidants."),
    ("VS-DF-WK250", "Walnut Kernels (Akhrot Giri)", "Dry Fruits & Nuts", "Walnut Kernels", "Akhrot Giri", "250 g", 449, 399, 60, "#8c6239", "pouch", 0, "Light-halves walnut kernels, packed with omega-3 goodness."),
    ("VS-DF-PS250", "Roasted Salted Pistachios", "Dry Fruits & Nuts", "Pistachios", "Roasted & Salted", "250 g", 549, 499, 55, "#8fae4b", "pouch", 0, "Premium in-shell pistachios, roasted and lightly salted."),
    ("VS-DF-TM200", "Premium Trail Mix", "Dry Fruits & Nuts", "Trail Mix", "Nuts, Seeds & Berries", "200 g", 299, 269, 75, "#b9783f", "pouch", 0, "A power-packed mix of nuts, seeds and dried berries for on-the-go energy."),
    # Diwali Gift Hampers
    ("VS-GH-DD", "Diwali Delight Gift Hamper", "Diwali Gift Hampers", "Diwali Delight", "Gift Hamper", "1 box", 1499, 1299, 40, "#b3262e", "box", 1, "Almonds, cashews, raisins and roasted makhana in a festive keepsake box."),
    ("VS-GH-RD", "Royal Dry Fruit Gift Box", "Diwali Gift Hampers", "Royal Dry Fruits", "Gift Box", "1 box", 2499, 2199, 30, "#5b1f4a", "box", 1, "Premium dry fruit selection in an elegant velvet-finish box with gold detailing."),
    ("VS-GH-MS", "Millet Snacks Festive Box", "Diwali Gift Hampers", "Millet Snacks", "Festive Box", "1 box", 999, 899, 50, "#1f5f23", "box", 0, "A healthy festive box of jowar puffs, bajra puffs and flavoured makhana."),
    ("VS-GH-CP", "Corporate Gift Hamper – Premium", "Diwali Gift Hampers", "Corporate Hamper", "Premium", "1 box", 3499, 2999, 25, "#13261a", "box", 0, "Curated premium hamper for clients and teams. Custom branding available on bulk orders."),
    ("VS-GH-MN", "Makhana & Nuts Celebration Box", "Diwali Gift Hampers", "Makhana & Nuts", "Celebration Box", "1 box", 1299, None, 35, "#c47a12", "box", 0, "Roasted makhana and mixed nuts — a light, healthy gift for every occasion."),
    # Atta, Rice & Dals
    ("VS-AR-WA5", "Chakki Fresh Whole Wheat Atta", "Atta, Rice & Dals", "Whole Wheat Atta", "Chakki Fresh", "5 kg", 299, 269, 100, "#d9a441", "bag", 1, "Stone-ground whole wheat atta for soft, fluffy rotis every day."),
    ("VS-AR-BR5", "Basmati Rice – Long Grain", "Atta, Rice & Dals", "Basmati Rice", "Long Grain · Aged", "5 kg", 699, 629, 80, "#c9b27c", "bag", 0, "Aged long-grain basmati rice with a delicate aroma and fluffy texture."),
    ("VS-AR-TD1", "Unpolished Toor Dal", "Atta, Rice & Dals", "Toor Dal", "Unpolished", "1 kg", 189, None, 120, "#e3b23c", "pouch", 0, "Naturally unpolished arhar dal — more protein, more taste."),
    ("VS-AR-MD1", "Unpolished Moong Dal", "Atta, Rice & Dals", "Moong Dal", "Unpolished · Split", "1 kg", 179, 165, 110, "#9bbf4b", "pouch", 0, "Easy-to-digest yellow moong dal, cleaned and unpolished."),
    ("VS-AR-CD1", "Unpolished Chana Dal", "Atta, Rice & Dals", "Chana Dal", "Unpolished", "1 kg", 149, 135, 110, "#e8b93a", "pouch", 0, "Nutty, protein-rich split Bengal gram for dal, halwa and snacks."),
    ("VS-AR-MS1", "Unpolished Masoor Dal", "Atta, Rice & Dals", "Masoor Dal", "Unpolished · Split", "1 kg", 159, None, 100, "#d9673a", "pouch", 0, "Quick-cooking red lentils, cleaned and unpolished for everyday dal."),
    ("VS-AR-KC1", "Kabuli Chana", "Atta, Rice & Dals", "Kabuli Chana", "Bold Size", "1 kg", 169, None, 90, "#d8b57a", "pouch", 0, "Bold, creamy white chickpeas for chole and salads."),
    # Oils & Ghee
    ("VS-OG-MO1", "Cold Pressed Mustard Oil", "Oils & Ghee", "Mustard Oil", "Cold Pressed · Kachi Ghani", "1 L", 249, 225, 90, "#d9a520", "bottle", 1, "Pungent, pure kachi ghani mustard oil, cold pressed to keep nutrients intact."),
    ("VS-OG-GO1", "Cold Pressed Groundnut Oil", "Oils & Ghee", "Groundnut Oil", "Cold Pressed", "1 L", 329, 299, 70, "#e3c25a", "bottle", 0, "Wood-pressed groundnut oil with a rich, nutty flavour."),
    ("VS-OG-AG500", "A2 Desi Cow Ghee", "Oils & Ghee", "A2 Desi Ghee", "Bilona Method", "500 ml", 899, 799, 45, "#f0c84b", "jar", 1, "Traditional bilona-churned A2 ghee with a grainy texture and rich aroma."),
    ("VS-OG-CO500", "Virgin Coconut Oil", "Oils & Ghee", "Coconut Oil", "Virgin · Cold Pressed", "500 ml", 399, None, 60, "#7fb7a3", "bottle", 0, "Cold-pressed virgin coconut oil for cooking, skin and hair."),
    # Millets
    ("VS-ML-RF1", "Ragi (Finger Millet) Flour", "Millets", "Ragi Flour", "Finger Millet", "1 kg", 129, 115, 100, "#8a4f3a", "pouch", 1, "Calcium-rich ragi flour for rotis, dosas, porridge and baking."),
    ("VS-ML-JF1", "Jowar Flour", "Millets", "Jowar Flour", "Sorghum", "1 kg", 99, None, 100, "#e1c27e", "pouch", 0, "Gluten-free jowar atta for soft bhakri and rotis."),
    ("VS-ML-BF1", "Bajra Flour", "Millets", "Bajra Flour", "Pearl Millet", "1 kg", 89, 79, 100, "#9c8a63", "pouch", 0, "Freshly milled bajra atta, ideal for winter rotis and khichdi."),
    ("VS-ML-FM1", "Foxtail Millet (Kangni)", "Millets", "Foxtail Millet", "Kangni · Whole Grain", "1 kg", 179, 159, 70, "#c6a04a", "pouch", 0, "Whole foxtail millet — a low-GI alternative to rice."),
    ("VS-ML-MA1", "Multi-Millet Atta", "Millets", "Multi-Millet Atta", "7 Grain Blend", "1 kg", 149, 135, 90, "#7a5a32", "pouch", 1, "A blend of seven millets and grains for wholesome, fibre-rich rotis."),
]

CATEGORY_TEXT = {
    "Healthy Snacks": "Made from ancient Indian millets and roasted, never fried, Verda snacks are a guilt-free way to beat hunger pangs. No palm oil, no artificial colours.",
    "Makhana": "Verda makhana is sourced from the ponds of Mithila, Bihar, hand-graded for size, and packed fresh. Naturally low in calories and high in protein.",
    "Dry Fruits & Nuts": "Our dry fruits are carefully selected, cleaned and nitrogen-flushed to lock in freshness, taste and crunch.",
    "Diwali Gift Hampers": "Celebrate the festival of lights with thoughtfully curated Verda hampers. Bulk and corporate orders with custom branding are welcome — contact us for pricing.",
    "Atta, Rice & Dals": "Everyday staples sourced directly from trusted farms, cleaned and packed hygienically for your family.",
    "Oils & Ghee": "Traditionally pressed and processed in small batches to retain natural aroma, colour and nutrition.",
    "Millets": "Millets are naturally gluten-free, rich in fibre and minerals, and kinder to the planet. Bring them back to your kitchen with Verda.",
}


def font(weight, size):
    return ImageFont.truetype(FONT_DIR + "Inter-%s.otf" % weight, size)


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def shade(rgb, f):
    if f < 1:
        return tuple(int(c * f) for c in rgb)
    return tuple(int(c + (255 - c) * (f - 1)) for c in rgb)


def is_light(rgb):
    return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) > 175


def wrap(draw, text, fnt, width):
    words, lines, line = text.split(), [], ""
    for w in words:
        trial = (line + " " + w).strip()
        if draw.textlength(trial, font=fnt) <= width:
            line = trial
        else:
            lines.append(line)
            line = w
    lines.append(line)
    return lines


def draw_label(img, box, label, sub, size, scale):
    """White label panel with logo, product name, variant and pack size."""
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = box
    d.rounded_rectangle(box, radius=int(26 * scale), fill=(255, 255, 255))
    inner = x1 - x0 - int(40 * scale)
    cx = (x0 + x1) // 2

    logo = Image.open(LOGO).convert("RGBA")
    lw = min(inner, int(260 * scale))
    logo = logo.resize((lw, int(lw * logo.height / logo.width)), Image.LANCZOS)
    y = y0 + int(22 * scale)
    img.paste(logo, (cx - lw // 2, y), logo)
    y += logo.height + int(16 * scale)

    f_main = font("ExtraBold", int(44 * scale))
    for line in wrap(d, label, f_main, inner):
        d.text((cx, y), line, font=f_main, fill=(19, 38, 26), anchor="ma")
        y += int(52 * scale)
    f_sub = font("SemiBold", int(26 * scale))
    for line in wrap(d, sub, f_sub, inner):
        d.text((cx, y), line, font=f_sub, fill=(156, 107, 18), anchor="ma")
        y += int(34 * scale)

    f_size = font("Bold", int(26 * scale))
    tw = d.textlength(size, font=f_size)
    pw, ph = tw + int(40 * scale), int(46 * scale)
    py = y1 - ph - int(22 * scale)
    d.rounded_rectangle((cx - pw / 2, py, cx + pw / 2, py + ph), radius=ph // 2, fill=(31, 95, 35))
    d.text((cx, py + ph / 2), size, font=f_size, fill=(255, 255, 255), anchor="mm")


def make_pack(p):
    """Draw one pack on a transparent 800x800 canvas (with a soft floor shadow)."""
    sku, name, cat, label, sub, size, mrp, sale, stock, colour, shape = p[:11]
    S = 2  # supersample
    W = H = 800 * S
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    col = hex_rgb(colour)
    dark = shade(col, 0.72)

    shadow = Image.new("L", (W, H), 0)
    ImageDraw.Draw(shadow).ellipse((W * 0.2, H * 0.84, W * 0.8, H * 0.92), fill=70)
    shadow = shadow.filter(ImageFilter.GaussianBlur(28 * S))
    img.putalpha(shadow)
    d = ImageDraw.Draw(img)

    if shape in ("pouch", "bag"):
        w = 470 if shape == "pouch" else 520
        x0, x1 = (W - w * S) // 2, (W + w * S) // 2
        y0, y1 = 80 * S, 730 * S
        d.rounded_rectangle((x0, y0, x1, y1), radius=40 * S, fill=col)
        d.rectangle((x0 + 10 * S, y0, x1 - 10 * S, y0 + 54 * S), fill=dark)  # top seal
        for i in range(x0 + 24 * S, x1 - 20 * S, 16 * S):  # crimp lines
            d.line((i, y0 + 8 * S, i, y0 + 46 * S), fill=shade(dark, 0.85), width=3 * S)
        d.ellipse(((W // 2) - 14 * S, y0 + 70 * S, (W // 2) + 14 * S, y0 + 98 * S), fill=shade(col, 1.25))  # hang hole
        d.rectangle((x0 + 14 * S, y0 + 60 * S, x0 + 34 * S, y1 - 40 * S), fill=shade(col, 1.12))  # highlight
        box = (x0 + 44 * S, y0 + 120 * S, x1 - 44 * S, y1 - 60 * S)
    elif shape == "box":
        x0, x1, y0, y1 = 110 * S, 690 * S, 210 * S, 720 * S
        d.rounded_rectangle((x0, y0, x1, y1), radius=18 * S, fill=col)
        d.rounded_rectangle((x0 - 16 * S, y0 - 60 * S, x1 + 16 * S, y0 + 30 * S), radius=14 * S, fill=dark)  # lid
        gold = (201, 150, 43)
        d.rectangle((W // 2 - 22 * S, y0 - 60 * S, W // 2 + 22 * S, y1), fill=gold)  # ribbon
        d.ellipse((W // 2 - 110 * S, y0 - 140 * S, W // 2 - 4 * S, y0 - 50 * S), outline=gold, width=20 * S)
        d.ellipse((W // 2 + 4 * S, y0 - 140 * S, W // 2 + 110 * S, y0 - 50 * S), outline=gold, width=20 * S)
        d.ellipse((W // 2 - 26 * S, y0 - 86 * S, W // 2 + 26 * S, y0 - 40 * S), fill=shade(gold, 0.85))
        box = (x0 + 70 * S, y0 + 70 * S, x1 - 70 * S, y1 - 40 * S)
    elif shape == "bottle":
        bx0, bx1 = 250 * S, 550 * S
        d.rounded_rectangle((bx0, 230 * S, bx1, 740 * S), radius=60 * S, fill=col)
        d.polygon([(bx0 + 40 * S, 240 * S), (W // 2 - 50 * S, 140 * S), (W // 2 + 50 * S, 140 * S), (bx1 - 40 * S, 240 * S)], fill=col)
        d.rectangle((W // 2 - 50 * S, 110 * S, W // 2 + 50 * S, 150 * S), fill=col)
        d.rounded_rectangle((W // 2 - 60 * S, 55 * S, W // 2 + 60 * S, 120 * S), radius=10 * S, fill=(31, 95, 35))  # cap
        d.rectangle((bx0 + 20 * S, 280 * S, bx0 + 40 * S, 700 * S), fill=shade(col, 1.2))
        box = (bx0 + 18 * S, 300 * S, bx1 - 18 * S, 690 * S)
    else:  # jar
        jx0, jx1 = 200 * S, 600 * S
        d.rounded_rectangle((jx0, 190 * S, jx1, 735 * S), radius=50 * S, fill=col)
        d.rounded_rectangle((jx0 + 10 * S, 120 * S, jx1 - 10 * S, 200 * S), radius=14 * S, fill=(201, 150, 43))  # lid
        box = (jx0 + 30 * S, 250 * S, jx1 - 30 * S, 690 * S)

    draw_label(img, box, label, sub, size, S)
    return img.resize((800, 800), Image.LANCZOS)


def make_image(pack, path):
    bg = Image.new("RGB", pack.size, (247, 246, 240))
    bg.paste(pack, mask=pack)
    bg.save(path, "JPEG", quality=86, optimize=True, progressive=True)


def compose(packs, size, bg, path, area=(0.42, 1.0), height=0.95):
    """Banner image: packs side by side (middle one in front) within `area` of the width.

    bg None gives a transparent PNG; otherwise a JPEG with that colour baked in.
    """
    W, H = size
    canvas = Image.new("RGBA", size, (0, 0, 0, 0) if bg is None else hex_rgb(bg) + (255,))
    x_start, x_end = int(W * area[0]), int(W * area[1])
    n = len(packs)
    overlap = 0.58  # each next pack starts this fraction of a pack width further right
    ph = int(min(H * height, (x_end - x_start) / (1 + overlap * (n - 1))))
    left = x_start + ((x_end - x_start) - ph * (1 + overlap * (n - 1))) / 2
    front = n // 2
    placed = []
    for i, pack in enumerate(packs):
        sz = int(ph * (1.0 if i == front else 0.86))
        x = int(left + i * overlap * ph + (ph - sz) / 2)
        placed.append((i == front, x, H - sz - int(H * 0.02), pack.resize((sz, sz), Image.LANCZOS)))
    for _, x, y, im in sorted(placed, key=lambda t: t[0]):  # front pack drawn last
        canvas.alpha_composite(im, (x, y))
    if bg is None:
        canvas = canvas.crop(canvas.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
        canvas.save(path, optimize=True)
    else:
        canvas.convert("RGB").save(path, "JPEG", quality=86, optimize=True, progressive=True)


def csv_cat(name):
    # WooCommerce uses commas to separate categories, so escape commas inside a name.
    return name.replace(",", "\\,")


def build_banners(packs):
    out = os.path.join(ROOT, "images", "banners")
    os.makedirs(out, exist_ok=True)
    pick = lambda *skus: [packs[s] for s in skus]
    # Transparent images shown beside text (hero, green promo strip).
    compose(pick("VS-MK-PS", "VS-GH-DD", "VS-JP-CS"), (900, 800), None, os.path.join(out, "hero.png"), area=(0, 1), height=0.85)
    compose(pick("VS-ML-RF1", "VS-ML-MA1", "VS-ML-JF1"), (800, 560), None, os.path.join(out, "promo-millets.png"), area=(0, 1), height=0.9)
    # Background images: colour matches the banner box colour in the theme CSS.
    compose(pick("VS-GH-RD", "VS-GH-DD"), (900, 500), "#fff3d6", os.path.join(out, "banner-hampers.jpg"), area=(0.42, 0.99), height=0.9)
    compose(pick("VS-MK-PP"), (600, 500), "#fde8e4", os.path.join(out, "banner-makhana.jpg"), area=(0.55, 1.02), height=0.78)
    compose(pick("VS-DF-AL500"), (600, 500), "#e5f0fb", os.path.join(out, "banner-dryfruits.jpg"), area=(0.55, 1.02), height=0.78)
    compose(pick("VS-JP-PP", "VS-BP-MM"), (900, 450), "#fff3d6", os.path.join(out, "banner-puffs.jpg"), area=(0.45, 0.99), height=0.95)
    compose(pick("VS-OG-MO1", "VS-OG-AG500"), (900, 450), "#fff3d6", os.path.join(out, "banner-oils.jpg"), area=(0.45, 0.99), height=0.95)
    compose(pick("VS-GH-CP"), (900, 450), "#e5f0fb", os.path.join(out, "banner-corporate.jpg"), area=(0.6, 0.98), height=0.9)


def main():
    os.makedirs(IMG_DIR, exist_ok=True)
    rows = []
    packs = {}
    for p in PRODUCTS:
        sku, name, cat, label, sub, size, mrp, sale, stock, colour, shape, featured, short = p
        fname = sku.lower() + ".jpg"
        packs[sku] = make_pack(p)
        make_image(packs[sku], os.path.join(IMG_DIR, fname))
        desc = (
            "<p>%s</p>\n<p>%s</p>\n<ul><li><strong>Pack size:</strong> %s</li>"
            "<li><strong>Brand:</strong> Verda</li><li><strong>Country of origin:</strong> India</li>"
            "<li><strong>Shelf life:</strong> Best before 6 months from packaging</li>"
            "<li><strong>Storage:</strong> Store in a cool, dry place. Keep airtight after opening.</li></ul>"
        ) % (short, CATEGORY_TEXT[cat], size)
        rows.append({
            "Type": "simple",
            "SKU": sku,
            "Name": name + (" (" + size + ")" if size != "1 box" else ""),
            "Published": 1,
            "Is featured?": featured,
            "Visibility in catalog": "visible",
            "Short description": short,
            "Description": desc,
            "Tax status": "taxable",
            "In stock?": 1,
            "Stock": stock,
            "Regular price": mrp,
            "Sale price": sale if sale else "",
            "Categories": csv_cat(cat),
            "Tags": "Verda, " + cat.replace(",", ""),
            "Images": RAW + fname,
            "Attribute 1 name": "Pack size",
            "Attribute 1 value(s)": size,
            "Attribute 1 visible": 1,
            "Attribute 1 global": 0,
        })
    with open(os.path.join(ROOT, "products.csv"), "w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    build_banners(packs)
    print("products:", len(rows))


if __name__ == "__main__":
    main()
