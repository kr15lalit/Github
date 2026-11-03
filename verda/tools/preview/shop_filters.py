"""Give the preview's Shop page a filter panel (see verda-filters.js).

usage: python3 -I shop_filters.py <export-dir>

All products go on shop.html (no paging), each card tagged with its slug and its position
in every "Sort by" order (taken from the exported sort pages). Run after interactive.py.
Idempotent: works from shop.html.orig, saved on the first run.
"""
import os
import re
import shutil
import sys

OUT = sys.argv[1]
HERE = os.path.dirname(os.path.abspath(__file__))
CARD = re.compile(r'<li class="product[^"]*">.*?</li>', re.S)


def read(name):
    with open(os.path.join(OUT, name), encoding="utf-8") as fh:
        return fh.read()


def cards(prefix, suffix=""):
    out = []
    for page in ["", "-page-2", "-page-3"]:
        name = "%s%s%s.html" % (prefix, page, suffix)
        if os.path.exists(os.path.join(OUT, name)):
            out += CARD.findall(read(name))
    return out


def slug_of(card):
    return re.search(r'href="product-([a-z0-9-]+)\.html"', card).group(1)


orig = os.path.join(OUT, "shop.html.orig")
if not os.path.exists(orig):
    shutil.copy(os.path.join(OUT, "shop.html"), orig)
with open(orig, encoding="utf-8") as fh:
    html = fh.read()

base = cards("shop")
orders = {"menu_order": [slug_of(c) for c in base]}
for s in ["popularity", "rating", "date"]:
    orders[s] = [slug_of(c) for c in cards("shop", "-orderby-" + s)]

items = []
for c in base:
    sl = slug_of(c)
    attrs = ' data-slug="%s"' % sl + "".join(' data-o-%s="%d"' % (k, v.index(sl) if sl in v else 999) for k, v in orders.items())
    c = re.sub(r'<li class="product([^"]*)"', lambda m: '<li class="product%s"%s' % (re.sub(r"\s(first|last)\b", "", m.group(1)), attrs), c, count=1)
    items.append(c)
print("products", len(items))

grid = '<ul class="products columns-3" data-vp-filter>\n' + "\n".join(items) + "\n</ul>"
html = re.sub(r'<ul class="products columns-\d+">.*?</ul>\s*(?=<nav class="woocommerce-pagination")', lambda m: grid + "\n", html, count=1, flags=re.S)
html = re.sub(r'<nav class="woocommerce-pagination".*?</nav>',
              '<div id="vp-f-empty" class="vp-f-empty" hidden><p>No products match these filters.</p><button type="button" class="fc-btn vp-f-clear">Clear all filters</button></div>',
              html, count=1, flags=re.S)
html = html.replace('<div class="fc-container fc-layout fc-shop">',
                    '<div class="fc-container fc-layout fc-shop vp-has-filters">\n'
                    '<aside id="vp-filters" class="vp-filters" aria-label="Filter products"><div class="vp-f-body"></div>'
                    '<button type="button" class="fc-btn vp-f-done">Show results</button></aside>', 1)
toolbar = ('<div class="vp-f-bar"><button type="button" class="vp-f-toggle" aria-expanded="false" aria-controls="vp-filters">'
           '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M7 12h10M10 18h4"/></svg> <span>Filters</span></button>'
           '<div id="vp-f-chips" class="vp-f-chips" hidden></div></div>')
html = html.replace('<p class="woocommerce-result-count"', toolbar + '<p class="woocommerce-result-count"', 1)
html = html.replace('<script src="verda-preview.js"></script>', '<script src="verda-preview.js"></script>\n<script src="verda-filters.js"></script>', 1)
with open(os.path.join(OUT, "shop.html"), "w", encoding="utf-8") as fh:
    fh.write(html)
shutil.copy(os.path.join(HERE, "verda-filters.js"), os.path.join(OUT, "verda-filters.js"))
print("ok", "vp-filters" in html, "verda-filters.js" in html)
