"""
Build verda/Verda-Product-Catalogue-Template.xlsx: a fill-in workbook for the product team.

Run: python3 verda/tools/build_product_template.py
"""
import os

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "Verda-Product-Catalogue-Template.xlsx")

GREEN = "1F5F23"
DARK = "13261A"
GOLD = "9C6B12"
FILL_INPUT = PatternFill("solid", fgColor="FFF8DC")  # light yellow: cells to fill
FILL_AUTO = PatternFill("solid", fgColor="E8EFE8")   # light green-grey: calculated
FILL_HEAD = PatternFill("solid", fgColor=GREEN)
FILL_REQ = PatternFill("solid", fgColor=DARK)
FILL_SAMPLE = PatternFill("solid", fgColor="FFFDF2")
THIN = Side(style="thin", color="D5D9D5")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
F = "Arial"

CATEGORIES = [
    ("Healthy Snacks", "", "Roasted millet puffs and snacks — never fried.", "cat-healthy-snacks.jpg", 1),
    ("Makhana", "", "Premium phool makhana, plain and roasted flavours.", "cat-makhana.jpg", 2),
    ("Dry Fruits & Nuts", "", "Almonds, cashews, raisins, walnuts, pistachios, mixes.", "cat-dry-fruits.jpg", 3),
    ("Diwali Gift Hampers", "", "Festive and corporate gift boxes.", "cat-hampers.jpg", 4),
    ("Atta, Rice & Dals", "", "Everyday staples: flour, rice and pulses.", "cat-staples.jpg", 5),
    ("Oils & Ghee", "", "Cold pressed oils and A2 desi ghee.", "cat-oils-ghee.jpg", 6),
    ("Millets", "", "Millet flours and whole grains.", "cat-millets.jpg", 7),
]

LISTS = {
    "Unit": ["g", "kg", "ml", "L", "pcs", "box"],
    "GST": [0, 0.05, 0.12, 0.18],
    "YesNo": ["Yes", "No"],
    "Diet": ["Veg", "Vegan", "Non-veg"],
    "Status": ["Active", "Draft", "Out of stock"],
    "VariantBy": ["Pack size", "Flavour", "Pack size + Flavour", "No variants"],
}

# key, header, width, required, kind, help, example
#   kind: text | num | money | pct | auto | list:<name> | cat
COLUMNS = [
    ("sku", "SKU / Item Code", 14, True, "text", "Your unique code for this exact pack. One code per size/flavour. Used for stock and orders.", "VS-JP-CS-100"),
    ("group", "Product Name (Group)", 30, True, "text", "Name shown on the website. Rows with the SAME name become one product with a size/flavour selector.", "Jowar Puffs"),
    ("category", "Category", 20, True, "cat", "Pick from the dropdown (from the Categories sheet).", "Healthy Snacks"),
    ("variant_by", "Variant Type", 16, True, "list:VariantBy", "How this product's options differ. Use 'No variants' for single-pack products.", "Pack size + Flavour"),
    ("flavour", "Flavour / Type", 18, False, "text", "Leave blank if there is only one flavour.", "Classic Salted"),
    ("size", "Pack Size (as shown)", 14, True, "text", "Exactly as customers should read it.", "100 g"),
    ("qty", "Net Qty", 9, True, "num", "Number only — used for price-per-kg/L and shipping.", 100),
    ("unit", "Unit", 8, True, "list:Unit", "g, kg, ml, L, pcs or box.", "g"),
    ("ship_wt", "Shipping Weight (kg)", 12, True, "num", "Packed weight including box/bottle, in kg. Needed for courier charges.", 0.13),
    ("dims", "Box Size L×W×H (cm)", 14, False, "text", "Packed dimensions for courier (optional).", "20×14×6"),
    ("mrp", "MRP (₹)", 10, True, "money", "Maximum Retail Price printed on the pack.", 99),
    ("price", "Selling Price (₹)", 11, True, "money", "Price on the website. Must not be more than MRP. Same as MRP if no discount.", 89),
    ("disc", "Discount %", 10, False, "auto", "Calculated automatically — do not type here.", None),
    ("per_unit", "Price per kg / L (₹)", 12, False, "auto", "Calculated automatically (for g/kg/ml/L packs).", None),
    ("gst", "GST Rate", 9, True, "list:GST", "Pick 0%, 5%, 12% or 18%. Confirm with your CA.", 0.12),
    ("hsn", "HSN Code", 10, True, "text", "From your GST invoices / CA. Type as text, e.g. 0405.", "1904"),
    ("stock", "Stock Qty", 9, True, "num", "Packs available to sell now.", 120),
    ("low", "Low Stock Alert", 9, False, "num", "You'll be emailed when stock falls to this number.", 20),
    ("short", "Short Description (1–2 lines)", 40, True, "text", "Shown next to the price. Keep under 160 characters.", "Light, crunchy jowar puffs with a pinch of salt. Roasted, never fried."),
    ("long", "Full Description", 50, False, "text", "Shown in the product's Description tab. Benefits, usage, story.", ""),
    ("ingredients", "Ingredients", 34, True, "text", "As printed on the pack (FSSAI).", ""),
    ("nutrition", "Nutrition per 100 g (key values)", 34, False, "text", "Energy, protein, fat, carbs, fibre — as printed on the pack.", ""),
    ("allergen", "Allergen Info", 22, False, "text", "e.g. Contains nuts / Packed in a facility that handles milk.", ""),
    ("diet", "Veg / Vegan", 9, True, "list:Diet", "Shown as a badge.", "Vegan"),
    ("shelf", "Shelf Life (months)", 9, True, "num", "From date of packing.", 6),
    ("storage", "Storage Instructions", 26, False, "text", "", "Store in a cool, dry place. Keep airtight after opening."),
    ("origin", "Country of Origin", 11, True, "text", "", "India"),
    ("fssai", "FSSAI Licence No.", 16, True, "text", "14-digit licence number printed on the pack.", ""),
    ("img_main", "Main Image File", 20, True, "text", "File name of the main photo you will send (square, white background, min 1000×1000).", "VS-JP-CS-100.jpg"),
    ("img_more", "Extra Image Files", 26, False, "text", "Back of pack, nutrition panel, lifestyle shots — separated by commas.", "VS-JP-CS-100-back.jpg"),
    ("tags", "Search Keywords", 24, False, "text", "Words customers might search, separated by commas.", "jowar, puffs, millet snack, gluten free"),
    ("featured", "Featured on Home?", 10, False, "list:YesNo", "Yes = can appear in 'Trending' on the homepage.", "Yes"),
    ("deal", "Deal of the Week?", 10, False, "list:YesNo", "Yes = shown in Deal of the Week (needs a Selling Price below MRP).", "No"),
    ("status", "Status", 11, True, "list:Status", "Active = live on site; Draft = hidden.", "Active"),
    ("notes", "Notes for Website Team", 28, False, "text", "Anything else we should know.", ""),
]

ING_PUFFS = "Jowar (sorghum) 92%, rice bran oil, salt, spices"
NUT_PUFFS = "Energy 395 kcal, Protein 10 g, Fat 6 g, Carbs 76 g, Fibre 7 g"
SAMPLES = [
    # sku, group, category, variant_by, flavour, size, qty, unit, ship, dims, mrp, price, gst, hsn, stock, low, short, long, ingredients, nutrition, allergen, diet, shelf, storage, origin, fssai, img, img_more, tags, featured, deal, status, notes
    ["VS-JP-CS-100", "Jowar Puffs", "Healthy Snacks", "Pack size + Flavour", "Classic Salted", "100 g", 100, "g", 0.13, "20×14×6", 99, 89, 0.12, "1904", 120, 20,
     "Light, crunchy jowar puffs with a pinch of salt. Roasted, never fried.",
     "Made from whole sorghum (jowar), these puffs are roasted — never fried — for a guilt-free crunch. High in fibre and naturally gluten-free. Perfect with evening chai or in kids' tiffin.",
     ING_PUFFS, NUT_PUFFS, "Packed in a facility that also handles nuts.", "Vegan", 6, "Store in a cool, dry place. Keep airtight after opening.", "India", "(your 14-digit FSSAI no.)", "VS-JP-CS-100.jpg", "VS-JP-CS-100-back.jpg", "jowar, puffs, millet snack, gluten free", "Yes", "No", "Active", ""],
    ["VS-JP-CS-200", "Jowar Puffs", "Healthy Snacks", "Pack size + Flavour", "Classic Salted", "200 g", 200, "g", 0.24, "26×18×7", 179, 159, 0.12, "1904", 80, 15,
     "Family pack of our classic salted jowar puffs.", "", ING_PUFFS, NUT_PUFFS, "Packed in a facility that also handles nuts.", "Vegan", 6, "Store in a cool, dry place. Keep airtight after opening.", "India", "", "VS-JP-CS-200.jpg", "", "jowar, puffs, family pack", "No", "No", "Active", "Same product as row above — will show as a size option."],
    ["VS-JP-PP-100", "Jowar Puffs", "Healthy Snacks", "Pack size + Flavour", "Peri Peri", "100 g", 100, "g", 0.13, "20×14×6", 99, 89, 0.12, "1904", 100, 20,
     "Jowar puffs tossed in a fiery peri peri seasoning.", "", "Jowar (sorghum) 88%, rice bran oil, peri peri seasoning (chilli, garlic, onion, salt)", NUT_PUFFS, "Packed in a facility that also handles nuts.", "Vegan", 6, "Store in a cool, dry place.", "India", "", "VS-JP-PP-100.jpg", "", "jowar, peri peri, spicy snack", "No", "Yes", "Active", "Same product, different flavour."],
    ["VS-BP-MM-100", "Bajra Puffs", "Healthy Snacks", "Flavour", "Masala Magic", "100 g", 100, "g", 0.13, "20×14×6", 99, 85, 0.12, "1904", 110, 20,
     "Pearl millet puffs with a tangy desi masala. Iron-rich and gluten-free.", "", "Bajra (pearl millet) 90%, rice bran oil, masala (salt, chilli, amchur, spices)", "Energy 400 kcal, Protein 11 g, Fat 7 g, Carbs 74 g, Fibre 8 g", "", "Vegan", 6, "Store in a cool, dry place.", "India", "", "VS-BP-MM-100.jpg", "", "bajra, puffs, masala", "Yes", "No", "Active", ""],
    ["VS-MK-PL-100", "Premium Phool Makhana", "Makhana", "Pack size", "Plain", "100 g", 100, "g", 0.15, "24×16×8", 179, 159, 0.05, "0813", 150, 25,
     "Hand-picked, large-size fox nuts from Bihar.", "Sourced from the ponds of Mithila, Bihar and hand-graded for size. Roast in ghee, add to kheer or curries.", "Fox nuts (makhana) 100%", "Energy 350 kcal, Protein 9.7 g, Fat 0.1 g, Carbs 77 g", "", "Vegan", 9, "Store in an airtight container.", "India", "", "VS-MK-PL-100.jpg", "", "makhana, fox nuts, phool makhana", "Yes", "No", "Active", ""],
    ["VS-MK-PL-250", "Premium Phool Makhana", "Makhana", "Pack size", "Plain", "250 g", 250, "g", 0.32, "30×20×10", 399, 349, 0.05, "0813", 90, 15,
     "Value pack of premium plain makhana.", "", "Fox nuts (makhana) 100%", "Energy 350 kcal, Protein 9.7 g, Fat 0.1 g, Carbs 77 g", "", "Vegan", 9, "Store in an airtight container.", "India", "", "VS-MK-PL-250.jpg", "", "makhana, value pack", "No", "Yes", "Active", ""],
    ["VS-MK-PS-80", "Roasted Makhana – Himalayan Pink Salt", "Makhana", "No variants", "", "80 g", 80, "g", 0.12, "22×15×7", 149, 129, 0.12, "2008", 140, 20,
     "Fox nuts slow-roasted in olive oil with Himalayan pink salt.", "", "Fox nuts 90%, olive oil, Himalayan pink salt", "Energy 420 kcal, Protein 9 g, Fat 12 g, Carbs 68 g", "", "Vegan", 6, "Keep airtight after opening.", "India", "", "VS-MK-PS-80.jpg", "", "roasted makhana, healthy snack", "Yes", "No", "Active", ""],
    ["VS-DF-AL-250", "California Almonds", "Dry Fruits & Nuts", "Pack size", "", "250 g", 250, "g", 0.29, "22×16×6", 349, 319, 0.12, "0802", 100, 20,
     "Crunchy, naturally sweet California almonds.", "Graded for size and freshness, nitrogen-flushed to lock in crunch.", "Almonds 100%", "Energy 579 kcal, Protein 21 g, Fat 50 g, Carbs 22 g, Fibre 12 g", "Contains tree nuts.", "Vegan", 9, "Refrigerate in summer after opening.", "USA", "", "VS-DF-AL-250.jpg", "", "badam, almonds, dry fruits", "No", "No", "Active", "Country of origin = where grown."],
    ["VS-DF-AL-500", "California Almonds", "Dry Fruits & Nuts", "Pack size", "", "500 g", 500, "g", 0.55, "26×18×7", 649, 579, 0.12, "0802", 90, 15,
     "Crunchy, naturally sweet California almonds.", "", "Almonds 100%", "Energy 579 kcal, Protein 21 g, Fat 50 g, Carbs 22 g, Fibre 12 g", "Contains tree nuts.", "Vegan", 9, "Refrigerate in summer after opening.", "USA", "", "VS-DF-AL-500.jpg", "", "badam, almonds", "Yes", "Yes", "Active", ""],
    ["VS-DF-AL-1K", "California Almonds", "Dry Fruits & Nuts", "Pack size", "", "1 kg", 1, "kg", 1.08, "32×22×8", 1249, 1099, 0.12, "0802", 40, 10,
     "Bulk pack of premium California almonds.", "", "Almonds 100%", "Energy 579 kcal, Protein 21 g, Fat 50 g, Carbs 22 g, Fibre 12 g", "Contains tree nuts.", "Vegan", 9, "Refrigerate in summer after opening.", "USA", "", "VS-DF-AL-1K.jpg", "", "almonds bulk", "No", "No", "Active", ""],
    ["VS-GH-DD", "Diwali Delight Gift Hamper", "Diwali Gift Hampers", "No variants", "", "1 box", 1, "box", 1.4, "30×30×10", 1499, 1299, 0.12, "0802", 40, 10,
     "Almonds, cashews, raisins and roasted makhana in a festive keepsake box.", "Contents: California Almonds 200 g, Cashews W320 200 g, Golden Raisins 150 g, Roasted Makhana 80 g. Reusable velvet-finish box with greeting card.", "See contents", "", "Contains tree nuts.", "Vegan", 6, "Store in a cool, dry place.", "India", "", "VS-GH-DD.jpg", "VS-GH-DD-open.jpg, VS-GH-DD-contents.jpg", "diwali gift, hamper, corporate gift", "Yes", "Yes", "Active", "Mixed-GST hampers: confirm rate with CA. Bulk orders: custom branding."],
    ["VS-AR-TD-1K", "Unpolished Toor Dal", "Atta, Rice & Dals", "Pack size", "", "1 kg", 1, "kg", 1.05, "28×18×6", 189, 175, 0, "0713", 120, 25,
     "Naturally unpolished arhar dal — more protein, more taste.", "", "Toor dal (pigeon pea) 100%", "Energy 343 kcal, Protein 22 g, Fat 1.5 g, Carbs 63 g", "", "Vegan", 9, "Store in an airtight container.", "India", "", "VS-AR-TD-1K.jpg", "", "toor dal, arhar dal, pulses", "No", "No", "Active", "Branded/packed pulses may attract GST — confirm with CA."],
    ["VS-OG-MO-1L", "Cold Pressed Mustard Oil", "Oils & Ghee", "Pack size", "", "1 L", 1, "L", 1.05, "9×9×28", 249, 225, 0.05, "1514", 90, 20,
     "Pungent, pure kachi ghani mustard oil, cold pressed.", "Wood-pressed at low temperature to keep natural aroma and nutrients.", "Mustard oil 100%", "Energy 900 kcal, Fat 100 g (SFA 7 g, MUFA 60 g, PUFA 33 g)", "", "Vegan", 9, "Keep away from direct sunlight.", "India", "", "VS-OG-MO-1L.jpg", "", "sarson tel, mustard oil, kachi ghani", "Yes", "No", "Active", ""],
    ["VS-OG-MO-5L", "Cold Pressed Mustard Oil", "Oils & Ghee", "Pack size", "", "5 L", 5, "L", 4.9, "22×15×32", 1199, 1049, 0.05, "1514", 30, 5,
     "Family can of kachi ghani mustard oil.", "", "Mustard oil 100%", "Energy 900 kcal, Fat 100 g", "", "Vegan", 9, "Keep away from direct sunlight.", "India", "", "VS-OG-MO-5L.jpg", "", "mustard oil 5 litre", "No", "No", "Active", "Heavy item — check courier charges."],
    ["VS-OG-AG-500", "A2 Desi Cow Ghee", "Oils & Ghee", "Pack size", "", "500 ml", 500, "ml", 0.75, "10×10×12", 899, 799, 0.12, "0405", 45, 10,
     "Traditional bilona-churned A2 ghee with a grainy texture.", "Made from curd of A2 desi cow milk, hand-churned by the bilona method.", "A2 cow milk fat 100%", "Energy 897 kcal, Fat 99.7 g", "Contains milk.", "Veg", 12, "No refrigeration needed. Use a dry spoon.", "India", "", "VS-OG-AG-500.jpg", "", "a2 ghee, desi ghee, bilona", "Yes", "Yes", "Active", ""],
]


def style_header(cell, required):
    cell.font = Font(name=F, bold=True, color="FFFFFF", size=10)
    cell.fill = FILL_REQ if required else FILL_HEAD
    cell.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    cell.border = BORDER


def build():
    wb = Workbook()

    # ------------------------------------------------------------- How to Fill
    ws = wb.active
    ws.title = "How to Fill"
    ws.sheet_view.showGridLines = False
    ws.column_dimensions["A"].width = 3
    ws.column_dimensions["B"].width = 30
    ws.column_dimensions["C"].width = 12
    ws.column_dimensions["D"].width = 70
    ws.column_dimensions["E"].width = 34

    ws["B2"] = "Verda — Product Catalogue Template"
    ws["B2"].font = Font(name=F, bold=True, size=18, color=GREEN)
    ws["B3"] = "Fill this in and send it back. Each row becomes a product (or a size/flavour option) on the website."
    ws["B3"].font = Font(name=F, size=11, color="555555")

    steps = [
        "1. Go to the 'Products' sheet. Rows 3–17 are DEMO rows to show the format — overwrite or delete them.",
        "2. Make ONE ROW PER PACK SIZE / FLAVOUR. Example: Almonds 250 g, 500 g and 1 kg = 3 rows with the same Product Name.",
        "3. Rows with the same 'Product Name (Group)' become ONE product with a size/flavour selector on the website.",
        "4. Fill the yellow cells. Dark-green headers are REQUIRED; light-green headers are optional.",
        "5. Grey-green cells (Discount %, Price per kg/L) calculate themselves — do not type in them.",
        "6. Use the dropdowns for Category, Unit, GST, Veg/Vegan, Yes/No and Status.",
        "7. Photos: name each file exactly as in 'Main Image File' (we suggest SKU.jpg) and send them in one folder or zip.",
        "8. New category? Add it on the 'Categories' sheet first — it then appears in the Category dropdown.",
        "9. GST rates and HSN codes in the demo rows are examples only. Please confirm yours with your CA.",
    ]
    r = 5
    ws.cell(r, 2, "How to fill").font = Font(name=F, bold=True, size=13, color=DARK)
    for s in steps:
        r += 1
        c = ws.cell(r, 2, s)
        c.font = Font(name=F, size=10)
        ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=5)

    r += 2
    ws.cell(r, 2, "Colour legend").font = Font(name=F, bold=True, size=13, color=DARK)
    legend = [
        (FILL_REQ, "Required column (header)", True),
        (FILL_HEAD, "Optional column (header)", True),
        (FILL_INPUT, "Type here", False),
        (FILL_AUTO, "Calculated automatically — don't type", False),
        (FILL_SAMPLE, "Demo row — replace with your data", False),
    ]
    for fill, text, white in legend:
        r += 1
        ws.cell(r, 2).fill = fill
        ws.cell(r, 2).border = BORDER
        ws.cell(r, 3, text).font = Font(name=F, size=10)

    r += 2
    ws.cell(r, 2, "Column guide").font = Font(name=F, bold=True, size=13, color=DARK)
    r += 1
    for col, h in enumerate(("Column", "Required?", "What to enter", "Example"), start=2):
        style_header(ws.cell(r, col, h), True)
    for key, header, width, req, kind, help_text, example in COLUMNS:
        r += 1
        ws.cell(r, 2, header).font = Font(name=F, bold=True, size=10)
        ws.cell(r, 3, "Yes" if req else "Optional").font = Font(name=F, size=10, color=GREEN if req else "777777")
        ws.cell(r, 4, help_text).font = Font(name=F, size=10)
        ex = example
        if kind == "pct" or key == "gst":
            ex = "{:.0%}".format(example) if example is not None else ""
        ws.cell(r, 5, "" if ex is None else str(ex)).font = Font(name=F, size=10, color="555555")
        for col in range(2, 6):
            ws.cell(r, col).border = BORDER
            ws.cell(r, col).alignment = Alignment(wrap_text=True, vertical="top")

    # ------------------------------------------------------------------ Lists
    wl = wb.create_sheet("Lists")
    for ci, (name, values) in enumerate(LISTS.items(), start=1):
        wl.cell(1, ci, name).font = Font(name=F, bold=True)
        for ri, v in enumerate(values, start=2):
            c = wl.cell(ri, ci, v)
            c.font = Font(name=F)
            if name == "GST":
                c.number_format = "0%"
        wl.column_dimensions[get_column_letter(ci)].width = 18
    list_ref = {
        name: "Lists!$%s$2:$%s$%d" % (get_column_letter(ci), get_column_letter(ci), len(values) + 1)
        for ci, (name, values) in enumerate(LISTS.items(), start=1)
    }

    # ------------------------------------------------------------- Categories
    wc = wb.create_sheet("Categories")
    wc.sheet_view.showGridLines = False
    cat_headers = [("Category Name", 24, True), ("Parent Category (if sub-category)", 24, False), ("Description (shown on category page)", 50, False), ("Category Image File", 24, False), ("Display Order", 10, False)]
    for ci, (h, w, req) in enumerate(cat_headers, start=1):
        style_header(wc.cell(1, ci, h), req)
        wc.column_dimensions[get_column_letter(ci)].width = w
    wc.row_dimensions[1].height = 32
    cat_rows = 30
    for ri in range(2, 2 + cat_rows):
        data = CATEGORIES[ri - 2] if ri - 2 < len(CATEGORIES) else ("", "", "", "", None)
        for ci, v in enumerate(data, start=1):
            c = wc.cell(ri, ci, v if v not in ("", None) else None)
            c.font = Font(name=F, size=10)
            c.fill = FILL_INPUT
            c.border = BORDER
    wc.freeze_panes = "A2"
    cat_ref = "Categories!$A$2:$A$%d" % (1 + cat_rows)

    # --------------------------------------------------------------- Products
    wp = wb.create_sheet("Products", 1)
    wp.sheet_view.showGridLines = False
    col_of = {}
    ncols = len(COLUMNS)
    wp.cell(1, 1, "VERDA PRODUCT CATALOGUE — one row per pack size / flavour.  Dark headers = required.  Rows 3–17 are demo rows: replace them.").font = Font(name=F, bold=True, size=11, color=GOLD)
    wp.merge_cells(start_row=1, start_column=1, end_row=1, end_column=12)
    for ci, (key, header, width, req, kind, help_text, example) in enumerate(COLUMNS, start=1):
        col_of[key] = get_column_letter(ci)
        c = wp.cell(2, ci, header + (" *" if req else ""))
        style_header(c, req)
        c.comment = Comment(help_text + ("\nExample: %s" % example if example not in (None, "") else ""), "Verda")
        wp.column_dimensions[get_column_letter(ci)].width = width
    wp.row_dimensions[2].height = 42

    first, last = 3, 300
    n_samples = len(SAMPLES)
    keys = [c[0] for c in COLUMNS]
    for r in range(first, last + 1):
        sample = SAMPLES[r - first] if r - first < n_samples else None
        values = {}
        if sample:
            data_keys = [k for k in keys if k not in ("disc", "per_unit")]
            assert len(sample) == len(data_keys), (sample[0], len(sample), len(data_keys))
            values = dict(zip(data_keys, sample))
        for ci, (key, header, width, req, kind, help_text, example) in enumerate(COLUMNS, start=1):
            c = wp.cell(r, ci)
            c.font = Font(name=F, size=10, italic=bool(sample), color="333333")
            c.border = BORDER
            c.alignment = Alignment(vertical="top", wrap_text=key in ("short", "long", "ingredients", "nutrition", "notes"))
            if kind == "auto":
                c.fill = FILL_AUTO
                mrp, price, qty, unit = (col_of[k] + str(r) for k in ("mrp", "price", "qty", "unit"))
                if key == "disc":
                    c.value = '=IF(AND(ISNUMBER(%s),ISNUMBER(%s),%s>0),(%s-%s)/%s,"")' % (mrp, price, mrp, mrp, price, mrp)
                    c.number_format = "0%"
                else:
                    c.value = (
                        '=IF(AND(ISNUMBER(%s),ISNUMBER(%s),%s>0),'
                        'IF(OR(%s="g",%s="ml"),%s/%s*1000,IF(OR(%s="kg",%s="L"),%s/%s,"")),"")'
                    ) % (price, qty, qty, unit, unit, price, qty, unit, unit, price, qty)
                    c.number_format = "₹#,##0"
                continue
            c.fill = FILL_SAMPLE if sample else FILL_INPUT
            v = values.get(key)
            if v not in (None, ""):
                c.value = v
            if kind == "money":
                c.number_format = "₹#,##0"
            elif key == "gst":
                c.number_format = "0%"
            elif key == "hsn":
                c.number_format = "@"
            elif key == "ship_wt":
                c.number_format = "0.00"

    # Dropdowns and checks.
    def add_dv(dv, key):
        wp.add_data_validation(dv)
        dv.add("%s%d:%s%d" % (col_of[key], first, col_of[key], last))

    add_dv(DataValidation(type="list", formula1=cat_ref, allow_blank=True, showErrorMessage=True, errorTitle="Category", error="Pick a category from the list (add new ones on the Categories sheet)."), "category")
    for key, header, width, req, kind, help_text, example in COLUMNS:
        if kind.startswith("list:"):
            name = kind.split(":", 1)[1]
            add_dv(DataValidation(type="list", formula1=list_ref[name], allow_blank=True, showErrorMessage=True, errorTitle=header, error="Please pick from the dropdown."), key)
    for key in ("qty", "ship_wt", "mrp", "price", "stock", "low", "shelf"):
        add_dv(DataValidation(type="decimal", operator="greaterThanOrEqual", formula1="0", allow_blank=True, showErrorMessage=True, error="Enter a number (no ₹ sign, no text)."), key)
    p, m = col_of["price"], col_of["mrp"]
    add_dv(DataValidation(type="custom", formula1="OR(%s%d=\"\",%s%d=\"\",%s%d<=%s%d)" % (p, first, m, first, p, first, m, first), allow_blank=True, showErrorMessage=True, errorTitle="Selling price", error="Selling Price cannot be more than MRP."), "price")
    add_dv(DataValidation(type="textLength", operator="lessThanOrEqual", formula1="160", allow_blank=True, showErrorMessage=True, error="Keep the short description under 160 characters."), "short")

    # Highlight duplicate SKUs in red.
    s = col_of["sku"]
    wp.conditional_formatting.add(
        "%s%d:%s%d" % (s, first, s, last),
        FormulaRule(formula=['AND(%s%d<>"",COUNTIF($%s$%d:$%s$%d,%s%d)>1)' % (s, first, s, first, s, last, s, first)], fill=PatternFill("solid", fgColor="F8C9C9")),
    )

    wp.freeze_panes = "C3"
    wp.auto_filter.ref = "A2:%s%d" % (get_column_letter(ncols), last)

    # Lists sheet last and out of the way.
    wb.move_sheet("Lists", offset=10)
    wb.active = 0
    wb.save(OUT)
    print("saved", OUT)


if __name__ == "__main__":
    build()
