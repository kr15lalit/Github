"""
Build the REAL Verda catalogue from the product photos in Google Drive ("Verda Products").

Inputs  : web-sized copies of the Drive photos in a folder (argv[1]), named like the Drive files
          (DSC05845-Edit.jpg ...).
Outputs : verda/images/real/*.jpg          square product images (front + back of pack)
          verda/real-products.json         catalogue used by the Playground preview
          verda/products.csv               WooCommerce import (variable products with Size)
          verda/Verda-Product-List-Filled.xlsx   the product sheet, filled in

Product names, sizes and label details come from the packs. PRICES ARE INDICATIVE ESTIMATES
(the labels carry no MRP) and must be replaced by the business.

Run: python3 verda/tools/build_real_catalogue.py <photos-dir>
"""
import csv
import json
import os
import sys

from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_IMG = os.path.join(ROOT, "images", "real")
RAW = "https://raw.githubusercontent.com/kr15lalit/Github/claude/funny-euler-c0bsfh/verda/images/real/"
LOGO = os.path.join(ROOT, "images", "verda-logo.png")
FONT = "/usr/share/fonts/opentype/inter/Inter-%s.otf"

OIL_NOTE = "Lab tested at an NABL-certified lab. No added edible oils, free from argemone oil, no preservatives. Best before 12 months from manufacture; store in a dry place away from heat and light."
DAL_NOTE = "Stone cleaned and freshly packed. Naturally rich in protein and fibre. Store in a cool, dry and hygienic place, away from direct sunlight; always use a dry spoon."
SNACK_NOTE = "Roasted snack. High in fibre and gluten free."
ATTA_NOTE = "Freshly milled and packed. Store in a cool, dry and hygienic place, away from direct sunlight."
# The business stocks 7 types of atta in 5 kg and 10 kg packs; names below are placeholders until confirmed.
ATTA_TYPES = [
    ("Chakki Fresh Whole Wheat Atta", "Stone-ground whole wheat atta for soft, everyday rotis.", 1),
    ("Sharbati Wheat Atta", "Atta from premium sharbati wheat for soft, slightly sweet rotis.", 0),
    ("Multigrain Atta", "A wholesome blend of wheat and grains for fibre-rich rotis.", 1),
    ("Jowar Atta", "Gluten-free jowar (sorghum) atta for bhakri and rotis.", 0),
    ("Bajra Atta", "Bajra (pearl millet) atta — a winter favourite for rotis and khichdi.", 0),
    ("Makka Atta", "Makka (maize) atta for makki di roti.", 0),
    ("Chana Atta (Missi)", "Chana and wheat atta for protein-rich missi roti.", 0),
]

# One entry per product (group). Each size: (label, net qty, unit, mrp, price, front photo, back photo).
# Photo spec: "FILE" or "FILE@crop" where crop = "jar:N" (N-th jar in a group shot) or "right" (right bottle).
PRODUCTS = [
    {"name": "Wood Pressed Coconut Oil", "cat": "Oils & Ghee", "featured": 1,
     "short": "Pure coconut oil, wood pressed from premium coconuts to keep its natural goodness, aroma and nutrients.",
     "note": OIL_NOTE,
     "sizes": [("500 ml", 500, "ml", 349, 299, "DSC05845-Edit", "DSC05920-Edit-Edit"),
               ("1 L", 1, "L", 649, 579, "DSC05848-Edit", "DSC05915-Edit")],
     "gallery": ["DSC05852-Edit"]},
    {"name": "Wood Pressed Groundnut Oil", "cat": "Oils & Ghee", "featured": 1,
     "short": "Pure groundnut oil, wood pressed from premium groundnuts for authentic taste and aroma.",
     "note": OIL_NOTE,
     "sizes": [("500 ml", 500, "ml", 299, 259, "DSC05846-Edit", "DSC05912-Edit"),
               ("1 L", 1, "L", 549, 489, "DSC05849", "DSC05913-Edit")],
     "gallery": ["DSC05855-Edit"]},
    {"name": "Wood Pressed Sesame Oil", "cat": "Oils & Ghee", "featured": 0,
     "short": "Pure sesame (til) oil, wood pressed from premium sesame seeds to retain natural goodness.",
     "note": OIL_NOTE,
     "sizes": [("500 ml", 500, "ml", 349, 299, "DSC05851-Edit@right", "DSC05916-Edit"),
               ("1 L", 1, "L", 649, 579, "DSC05847", "DSC05917-Edit")],
     "gallery": ["DSC05851-Edit"]},
    {"name": "Cold Pressed Yellow Mustard Oil", "cat": "Oils & Ghee", "featured": 1,
     "short": "Cold pressed from premium yellow mustard seeds — mild, aromatic and full of natural goodness.",
     "note": OIL_NOTE,
     "sizes": [("1 L", 1, "L", 299, 269, "DSC05874-Edit", "DSC05910-Edit"),
               ("2 L", 2, "L", 579, 519, "DSC05877-Edit", None),
               ("5 L", 5, "L", 1399, 1249, "DSC05886-Edit", "DSC05911-Edit")],
     "gallery": ["DSC05893-Edit"]},
    {"name": "Cold Pressed Black Mustard Oil", "cat": "Oils & Ghee", "featured": 1,
     "short": "Cold pressed from premium black mustard seeds — the classic pungent kachi ghani flavour.",
     "note": OIL_NOTE,
     "sizes": [("1 L", 1, "L", 319, 289, "DSC05890-Edit", "DSC05906-Edit"),
               ("2 L", 2, "L", 619, 559, "DSC05887-Edit", "DSC05908-Edit"),
               ("5 L", 5, "L", 1499, 1349, "DSC05885-Edit", "DSC05909-Edit")],
     "gallery": ["DSC05899-Edit"]},
    {"name": "Desi Cow Ghee (Bilona, Danedar)", "cat": "Oils & Ghee", "featured": 1,
     "short": "Pure, danedar desi cow ghee made by the traditional bilona technique.",
     "note": "Ingredient: cow milk fat. Store in a cool and dry place, away from direct sunlight.",
     "sizes": [("500 ml", 500, "ml", 999, 899, None, None),
               ("1 L (909 g)", 1, "L", 1899, 1699, None, None)],
     "gallery": []},
    {"name": "Chana Dal", "cat": "Atta, Rice & Dals", "featured": 1, "short": "Stone-cleaned, freshly packed chana dal.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 149, 135, "DSC05933-Edit-Edit", None)], "gallery": []},
    {"name": "Masoor Dal", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Stone-cleaned, freshly packed masoor dal.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 149, 135, "DSC05940-Edit", None)], "gallery": []},
    {"name": "Sabut Masoor", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Whole masoor, stone-cleaned and freshly packed.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 159, 145, "DSC05938-Edit", None)], "gallery": []},
    {"name": "Urad Dhuli", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Washed split urad dal, stone-cleaned and freshly packed.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 199, 179, "DSC05941-Edit", None)], "gallery": []},
    {"name": "Urad Sabut", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Whole black urad, stone-cleaned and freshly packed.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 189, 169, "DSC05939-Edit", None)], "gallery": []},
    {"name": "Kabuli Chana", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Kabuli chana (white chickpeas), stone-cleaned and freshly packed.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 179, 159, "DSC05937-Edit-Edit", None)], "gallery": []},
    {"name": "Kala Chana", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Kala chana (black chickpeas), stone-cleaned and freshly packed.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 129, 115, "DSC05944-Edit", None)], "gallery": []},
    {"name": "Red Rajma", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Red rajma (kidney beans), stone-cleaned and freshly packed.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 199, 179, "DSC05951-Edit", None)], "gallery": []},
    {"name": "Rajma Chitra", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Chitra rajma, stone-cleaned and freshly packed.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 219, 199, "DSC05953-Edit", None)], "gallery": []},
    {"name": "Besan", "cat": "Atta, Rice & Dals", "featured": 0, "short": "Gram flour (besan), freshly packed.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 139, 125, "DSC05948-Edit", None)], "gallery": []},
    {"name": "Raagi Atta", "cat": "Millets", "featured": 1, "short": "Raagi (finger millet) atta, freshly packed — naturally rich in protein and fibre.", "note": DAL_NOTE,
     "sizes": [("1 kg", 1, "kg", 129, 115, None, None)], "gallery": []},
    {"name": "Jowar Puffs", "cat": "Healthy Snacks", "featured": 1,
     "short": "Crunchy jowar (sorghum) puffs — a roasted snack, high in fibre.", "note": SNACK_NOTE, "flavours": True,
     "sizes": [("Cream Onion", 120, "g", 149, 129, "DSC05965@jar:3", None),
               ("Peri Peri", 120, "g", 149, 129, "DSC05965@jar:4", None)],
     "gallery": ["DSC05965"]},
    {"name": "Bajra Puffs", "cat": "Healthy Snacks", "featured": 1,
     "short": "Crunchy bajra (pearl millet) puffs — a roasted snack, high in fibre.", "note": SNACK_NOTE, "flavours": True,
     "sizes": [("Tandoori", 120, "g", 149, 129, "DSC05965@jar:1", None),
               ("Magic Masala", 120, "g", 149, 129, "DSC05965@jar:2", None)],
     "gallery": ["DSC05964"]},
    {"name": "Roasted Makhana", "cat": "Makhana", "featured": 1,
     "short": "Light, crunchy roasted makhana (fox nuts) — high in fibre, gluten free.", "note": SNACK_NOTE, "flavours": True,
     "sizes": [("Cream Onion", 70, "g", 199, 179, None, None),
               ("Tangy Tomato", 70, "g", 199, 179, None, None)],
     "gallery": []},
]
PRODUCTS += [
    {"name": name, "cat": "Atta, Rice & Dals", "featured": featured, "short": short, "note": ATTA_NOTE, "placeholder_name": True,
     "sizes": [("5 kg", 5, "kg", None, None, None, None), ("10 kg", 10, "kg", None, None, None, None)], "gallery": []}
    for name, short, featured in ATTA_TYPES
]
# Estimated prices per atta type (₹ MRP / selling) for 5 kg and 10 kg — to be replaced.
ATTA_PRICES = {
    "Chakki Fresh Whole Wheat Atta": ((299, 269), (579, 519)),
    "Sharbati Wheat Atta": ((349, 315), (679, 609)),
    "Multigrain Atta": ((399, 359), (779, 699)),
    "Jowar Atta": ((449, 405), (879, 789)),
    "Bajra Atta": ((399, 359), (779, 699)),
    "Makka Atta": ((349, 315), (679, 609)),
    "Chana Atta (Missi)": ((449, 405), (879, 789)),
}
for _p in PRODUCTS:
    if _p["name"] in ATTA_PRICES:
        (m5, s5), (m10, s10) = ATTA_PRICES[_p["name"]]
        _p["sizes"] = [("5 kg", 5, "kg", m5, s5, None, None), ("10 kg", 10, "kg", m10, s10, None, None)]

CATEGORIES = ["Oils & Ghee", "Atta, Rice & Dals", "Healthy Snacks", "Makhana", "Millets"]


def slug(s):
    return "".join(c if c.isalnum() else "-" for c in s.lower()).strip("-").replace("--", "-").replace("--", "-")


def trim_square(im, size=1000, margin=0.08):
    """Trim the white studio background and centre the product on a white square."""
    im = im.convert("RGB")
    # Lift light-grey backdrops to white.
    im = im.point(lambda v: 255 if v > 226 else v)
    bg = Image.new("RGB", im.size, (255, 255, 255))
    box = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 24 else 0).getbbox()
    if box:
        im = im.crop(box)
    side = int(max(im.size) * (1 + 2 * margin))
    canvas = Image.new("RGB", (side, side), (255, 255, 255))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    return canvas.resize((size, size), Image.LANCZOS)


def load(photos, spec):
    name, _, crop = spec.partition("@")
    im = Image.open(os.path.join(photos, name + ".jpg")).convert("RGB")
    if crop.startswith("jar:"):
        # Group shot of four jars in a row: split the product area into equal columns.
        n = int(crop.split(":")[1])
        bg = Image.new("RGB", im.size, (255, 255, 255))
        x0, y0, x1, y1 = ImageChops.difference(im, bg).convert("L").point(lambda v: 255 if v > 24 else 0).getbbox()
        w = (x1 - x0) / 4
        im = im.crop((int(x0 + (n - 1) * w) - 4, y0, int(x0 + n * w) + 4, y1))
    elif crop == "right":
        # Front bottle on the right of a two-bottle shot (the 1 L bottle overlaps up to ~52%).
        im = im.crop((int(im.width * 0.52), 0, im.width, im.height))
    return im


def coming_soon(title, sub, path):
    """Placeholder for products whose photo is not available yet."""
    W = 1000
    im = Image.new("RGB", (W, W), (247, 246, 240))
    d = ImageDraw.Draw(im)
    logo = Image.open(LOGO).convert("RGBA")
    logo = logo.resize((420, int(420 * logo.height / logo.width)), Image.LANCZOS)
    im.paste(logo, ((W - logo.width) // 2, 250), logo)
    f1, f2 = ImageFont.truetype(FONT % "ExtraBold", 56), ImageFont.truetype(FONT % "SemiBold", 34)
    d.text((W / 2, 520), title, font=f1, fill=(19, 38, 26), anchor="mm")
    d.text((W / 2, 590), sub, font=f2, fill=(156, 107, 18), anchor="mm")
    d.text((W / 2, 700), "Photo coming soon", font=ImageFont.truetype(FONT % "Medium", 30), fill=(130, 130, 120), anchor="mm")
    im.save(path, "JPEG", quality=86, optimize=True, progressive=True)


def save(img, name):
    img.save(os.path.join(OUT_IMG, name), "JPEG", quality=86, optimize=True, progressive=True)
    return name


def real_banner(photos, specs, bg, path, size=(900, 450), area=(0.46, 0.99), scale=1.0, middle=False):
    """Banner background: real product photos on a coloured panel, text space on the left.

    Multiplying the white studio background by the panel colour makes it disappear.
    """
    W, H = size
    tint = Image.new("RGB", size, bg)
    canvas = tint.copy()
    shots = [trim_square(load(photos, s), 900, 0.02) for s in specs]
    x0, x1 = int(W * area[0]), int(W * area[1])
    slot = (x1 - x0) // len(shots)
    for i, im in enumerate(shots):
        # scale > 1 lets narrow products (jars) overlap their slot; their square has white margins.
        side = min(int(slot * scale), int(H * 0.98))
        im = im.resize((side, side), Image.LANCZOS)
        x = max(0, min(W - side, x0 + i * slot + (slot - side) // 2))
        y = (H - side) // 2 if middle else H - side
        region = canvas.crop((x, y, x + side, y + side))
        canvas.paste(ImageChops.multiply(im, region), (x, y))
    canvas.save(path, "JPEG", quality=86, optimize=True, progressive=True)


def build(photos):
    os.makedirs(OUT_IMG, exist_ok=True)
    banners = os.path.join(ROOT, "images", "banners")
    real_banner(photos, ["DSC05965@jar:4", "DSC05965@jar:1"], (255, 243, 214), os.path.join(banners, "banner-real-puffs.jpg"), area=(0.56, 0.99), scale=1.45, middle=True)
    real_banner(photos, ["DSC05933-Edit-Edit", "DSC05951-Edit"], (229, 240, 251), os.path.join(banners, "banner-real-dals.jpg"), area=(0.58, 0.99), scale=1.3, middle=True)
    catalogue = []
    for p in PRODUCTS:
        base = slug(p["name"])
        entry = {k: p[k] for k in ("name", "cat", "featured", "short", "note")}
        entry["placeholder_name"] = p.get("placeholder_name", False)
        entry["slug"] = base
        entry["attr"] = "Flavour" if p.get("flavours") else "Size"
        entry["variants"] = []
        for label, qty, unit, mrp, price, front, back in p["sizes"]:
            vslug = base + "-" + slug(label)
            if front:
                img = save(trim_square(load(photos, front)), vslug + ".jpg")
            else:
                img = vslug + ".jpg"
                coming_soon(p["name"].split(" (")[0], label, os.path.join(OUT_IMG, img))
            back_img = save(trim_square(load(photos, back)), vslug + "-back.jpg") if back else None
            size_txt = "%s %s" % (qty, unit) if p.get("flavours") else label
            entry["variants"].append({
                "label": label, "size": size_txt, "qty": qty, "unit": unit, "mrp": mrp, "price": price,
                "sku": "VR-" + "".join(w[:3] for w in base.split("-") if w).upper()[:12] + "-" + slug(label).upper().replace("-", "")[:8],
                "image": img, "back": back_img, "photo": (front or "").split("@")[0], "back_photo": back or "",
            })
        entry["gallery"] = [save(trim_square(load(photos, g)), base + "-group-%d.jpg" % i) for i, g in enumerate(p["gallery"], 1)]
        catalogue.append(entry)
    skus = [v["sku"] for c in catalogue for v in c["variants"]]
    assert len(skus) == len(set(skus)), "duplicate SKUs: %s" % sorted(x for x in skus if skus.count(x) > 1)
    json.dump({"categories": CATEGORIES, "products": catalogue}, open(os.path.join(ROOT, "real-products.json"), "w"), indent=1, ensure_ascii=False)
    write_csv(catalogue)
    write_excel(catalogue)
    print("products", len(catalogue), "packs", sum(len(c["variants"]) for c in catalogue))


def write_csv(catalogue):
    """WooCommerce import: one 'variable' parent + one 'variation' row per pack (or one 'simple' row)."""
    rows = []
    for c in catalogue:
        desc = "<p>%s</p>\n<p>%s</p>" % (c["short"], c["note"])
        cat = c["cat"].replace(",", "\\,")
        images = lambda v: ", ".join(RAW + x for x in [v["image"]] + ([v["back"]] if v["back"] else []) + c["gallery"])
        if len(c["variants"]) == 1:
            v = c["variants"][0]
            rows.append({"Type": "simple", "SKU": v["sku"], "Parent": "", "Name": c["name"], "Published": 1, "Is featured?": c["featured"],
                         "Short description": c["short"], "Description": desc, "Regular price": v["mrp"], "Sale price": v["price"],
                         "Categories": cat, "Images": images(v), "Attribute 1 name": c["attr"], "Attribute 1 value(s)": v["label"],
                         "Attribute 1 visible": 1, "Attribute 1 global": 0, "In stock?": 1})
            continue
        parent_sku = c["variants"][0]["sku"].rsplit("-", 1)[0]
        rows.append({"Type": "variable", "SKU": parent_sku, "Parent": "", "Name": c["name"], "Published": 1, "Is featured?": c["featured"],
                     "Short description": c["short"], "Description": desc, "Regular price": "", "Sale price": "",
                     "Categories": cat, "Images": ", ".join(RAW + x for x in [c["variants"][0]["image"]] + c["gallery"]),
                     "Attribute 1 name": c["attr"], "Attribute 1 value(s)": ", ".join(v["label"] for v in c["variants"]),
                     "Attribute 1 visible": 1, "Attribute 1 global": 0, "In stock?": 1})
        for v in c["variants"]:
            rows.append({"Type": "variation", "SKU": v["sku"], "Parent": parent_sku, "Name": "%s - %s" % (c["name"], v["label"]), "Published": 1,
                         "Is featured?": 0, "Short description": "", "Description": "", "Regular price": v["mrp"], "Sale price": v["price"],
                         "Categories": "", "Images": RAW + v["image"], "Attribute 1 name": c["attr"], "Attribute 1 value(s)": v["label"],
                         "Attribute 1 visible": "", "Attribute 1 global": 0, "In stock?": 1})
    with open(os.path.join(ROOT, "products.csv"), "w", newline="", encoding="utf-8") as fh:
        w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
        w.writeheader()
        w.writerows(rows)


def write_excel(catalogue):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import build_product_template as t

    samples = []
    for c in catalogue:
        for v in c["variants"]:
            flavour = v["label"] if c["attr"] == "Flavour" else ""
            size = v["size"] if c["attr"] == "Flavour" else v["label"]
            back = (v["back_photo"] + ".jpg") if v["back_photo"] else ""
            front = (v["photo"] + ".jpg") if v["photo"] else "PHOTO NEEDED"
            note = "Prices are estimates — please replace with your MRP and selling price."
            if c.get("placeholder_name"):
                note += " Atta type name is a placeholder — please confirm the 7 types; photo needed."
            elif not v["photo"]:
                note += " Photo file is over 6 MB in Drive (or not shot yet); please share a smaller copy."
            samples.append((c["name"], c["cat"], flavour, size, v["mrp"], v["price"], None, c["short"], front, back, note))
    t.SAMPLES = samples
    t.CATEGORIES = CATEGORIES + ["Dry Fruits & Nuts", "Diwali Gift Hampers"]
    t.OUT = os.path.join(ROOT, "Verda-Product-List-Filled.xlsx")
    t.FILL_SAMPLE = t.FILL_INPUT
    t.NOTES = [
        "• Filled from the product photos in Google Drive (Verda Products). Names, sizes and flavours are as printed on the packs.",
        "• PRICES ARE ESTIMATES (the packs show no MRP). Please replace MRP and Selling Price, and add Stock.",
        "• Same Product Name = one product with a size/flavour choice on the website. Add new products in the empty rows below.",
    ]
    t.build()


if __name__ == "__main__":
    build(sys.argv[1])
