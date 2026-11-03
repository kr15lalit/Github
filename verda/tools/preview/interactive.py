"""Make the static export behave like the real store: cart, checkout (COD) and search.

usage: python3 -I interactive.py <export-dir> <real-products.json>

Idempotent: the injected block sits between <!--vp-start--> and <!--vp-end-->.
Run after finish_export.py and fix_variations.py, then rebuild export-files.json.
"""
import glob
import json
import os
import re
import shutil
import sys

OUT, CATALOG = sys.argv[1], sys.argv[2]
HERE = os.path.dirname(os.path.abspath(__file__))
UP = "wp-content/uploads/2026/11/"

# ---------- catalogue ----------
data = json.load(open(CATALOG, encoding="utf-8"))
products, missing = [], []
for p in data["products"]:
    page = "product-%s.html" % p["slug"]
    if not os.path.exists(os.path.join(OUT, page)):
        missing.append(page)
        continue
    vs = []
    for v in p["variants"]:
        img = UP + v["image"]
        if not os.path.exists(os.path.join(OUT, img)):
            missing.append(img)
        vs.append({"label": v["label"], "sku": v["sku"], "mrp": v["mrp"], "price": v["price"], "image": img})
    products.append({"slug": p["slug"], "name": p["name"], "cat": p["cat"], "attr": p.get("attr") or "Size", "url": page, "variants": vs})
cat = {"products": products, "freeFrom": 499, "shipping": 49}
with open(os.path.join(OUT, "verda-catalog.js"), "w", encoding="utf-8") as fh:
    fh.write("window.VERDA_CATALOG = " + json.dumps(cat, ensure_ascii=True, separators=(",", ":")) + ";\n")
shutil.copy(os.path.join(HERE, "verda-preview.js"), os.path.join(OUT, "verda-preview.js"))
shutil.copy(os.path.join(HERE, "verda-preview.css"), os.path.join(OUT, "verda-preview.css"))

# ---------- injected block ----------
BLOCK = """<!--vp-start-->
<link rel="stylesheet" href="verda-preview.css">
<div class="vp-bar"><b>Preview</b> of the Verda website &middot; estimated prices &middot; no real orders are placed</div>
<script>
document.addEventListener('change',function(e){
  if(!e.target.matches('select.orderby'))return;
  var file=(location.pathname.split('/').pop()||'index.html').replace(/\\.html$/,'');
  var base=file.replace(/-orderby-[a-z-]+$/,'').replace(/-page-\\d+$/,'');
  var v=e.target.value;
  location.href=base+(v&&v!=='menu_order'?'-orderby-'+v:'')+'.html';
});
</script>
<script src="verda-catalog.js"></script>
<script src="verda-preview.js"></script>
<!--vp-end-->
"""
OLD = re.compile(r"<!--vp-start-->.*?<!--vp-end-->\n?|<style>\s*\.vp-bar.*?</script>\n?", re.S)


def inject(h):
    h = OLD.sub("", h)
    if "</body>" in h:
        return h.replace("</body>", BLOCK + "</body>")
    # index.html is a fragment: put it before the trailing body-class script.
    i = h.rfind("<script>document.body.className")
    return h[:i] + BLOCK + h[i:] if i >= 0 else h + BLOCK


# ---------- cart and checkout pages from the About page ----------
tpl = open(os.path.join(OUT, "about-us.html"), encoding="utf-8").read()
for name, title, view in (("cart.html", "Cart", "cart"), ("checkout.html", "Checkout", "checkout")):
    main = (
        '<main id="primary" class="fc-main">\n<div class="fc-page-header">\n\t<div class="fc-container">\n'
        '\t\t<h1 class="fc-page-title">%s</h1>\n\t\t<nav class="fc-breadcrumb" aria-label="Breadcrumb">\n'
        '\t\t\t<a href="index.html">Home</a> / %s\t\t</nav>\n\t</div>\n</div>\n'
        '<div class="fc-container" id="vp-app" data-view="%s"><p>Loading…</p></div>\n</main>' % (title, title, view)
    )
    h = re.sub(r'<main id="primary" class="fc-main">.*?</main>', lambda m: main, tpl, count=1, flags=re.S)
    h = re.sub(r"<title>.*?</title>", "<title>%s – Verda</title>" % title, h, count=1, flags=re.S)
    h = re.sub(r"page-id-\d+", "woocommerce-%s" % view, h)
    open(os.path.join(OUT, name), "w", encoding="utf-8").write(h)

n = 0
for f in glob.glob(os.path.join(OUT, "*.html")):
    h = open(f, encoding="utf-8").read()
    h2 = inject(h)
    if h2 != h:
        open(f, "w", encoding="utf-8").write(h2)
        n += 1
print("products", len(products), "pages updated", n, "missing", missing)
