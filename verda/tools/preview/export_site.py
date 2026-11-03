"""
Crawl the running Verda demo (WordPress Playground) and write a static copy for an Artifact.

usage: python3 -I export_site.py <base-url> <out-dir>

- Every page is saved flat at the root (index.html, shop.html, product-<slug>.html ...).
- Assets keep their WordPress paths (wp-content/...), so relative url() refs inside CSS still work.
- WordPress/WooCommerce scripts are dropped; the theme's own main.js is kept, plus a small
  preview script that explains ordering is disabled.
- index.html is written as a fragment (the Artifact wraps the main page in its own skeleton).
"""
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from collections import deque

BASE = sys.argv[1].rstrip("/")
OUT = sys.argv[2]
HOST = urllib.parse.urlparse(BASE).netloc

SKIP = re.compile(r"^/(cart|checkout|my-account|wp-admin|wp-login|wp-json|feed|comments|xmlrpc)|/feed/?$|^/author/|^/\d{4}/")
assets = {}  # site path -> local relative path
pages = {}   # site path -> file name


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 export"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read(), r.headers.get_content_type()


LISTING = re.compile(r"^/(shop|product-category/[^/]+)/")
SORTS = ["popularity", "rating", "date", "price", "price-desc"]


def sort_of(query):
    """The orderby value if the query is just a shop sort (orderby=...), else None."""
    m = re.fullmatch(r"orderby=([a-z-]+)", query or "")
    return m.group(1) if m else None


def page_name(path, query=""):
    path = path.strip("/")
    if not path:
        return "index.html"
    name = re.sub(r"[^a-z0-9]+", "-", path.lower()).strip("-")
    if sort_of(query):
        name += "-orderby-" + sort_of(query)
    return name + ".html"


def norm(url):
    """Absolute site path (no host, no query) for an internal URL, else None."""
    url = url.replace("&#038;", "&").replace("&amp;", "&").strip()
    if url.startswith("//"):
        url = "http:" + url
    p = urllib.parse.urlparse(url)
    if p.scheme and p.scheme not in ("http", "https"):
        return None
    if p.netloc and p.netloc != HOST:
        return None
    return p.path or "/", p.query


def is_page(path, query):
    if query and not (sort_of(query) and LISTING.match(path)):
        return False
    if SKIP.search(path):
        return False
    return not re.search(r"\.[a-z0-9]{2,5}$", path)


def asset_local(path):
    return path.lstrip("/")


def grab_asset(path):
    if path in assets:
        return assets[path]
    local = asset_local(path)
    assets[path] = local
    try:
        data, ctype = fetch(BASE + path)
    except Exception as e:  # missing asset: keep the reference, report it
        print("  asset failed", path, e)
        return local
    dest = os.path.join(OUT, local)
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if path.endswith(".css"):
        css = data.decode("utf-8", "replace")
        css = rewrite_css(css, path)
        data = css.encode("utf-8")
    with open(dest, "wb") as fh:
        fh.write(data)
    return local


def rewrite_css(css, css_path):
    base_dir = os.path.dirname(css_path)

    def repl(m):
        raw = m.group(2).strip()
        if raw.startswith("data:") or raw.startswith("#"):
            return m.group(0)
        if re.match(r"^https?://", raw) and urllib.parse.urlparse(raw).netloc != HOST:
            return m.group(0)
        n = norm(urllib.parse.urljoin(BASE + css_path, raw))
        if not n:
            return m.group(0)
        target = grab_asset(n[0])
        rel = os.path.relpath(target, base_dir.lstrip("/"))
        return "url(%s%s%s)" % (m.group(1), rel, m.group(1))

    return re.sub(r"""url\((['"]?)([^'")]+)\1\)""", repl, css)


PREVIEW_JS = """
<style>
.vp-bar{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#13261a;color:#f3efe2;font:500 13px/1.4 Inter,system-ui,sans-serif;text-align:center;padding:9px max(16px,env(safe-area-inset-right,0px)) calc(9px + env(safe-area-inset-bottom,0px)) max(16px,env(safe-area-inset-left,0px))}
.vp-bar b{color:#e6c46a}
.vp-toast{position:fixed;left:50%;bottom:calc(64px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);z-index:10000;background:#1f5f23;color:#fff;font:500 14px/1.4 Inter,system-ui,sans-serif;padding:12px 18px;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.25);max-width:calc(100% - 32px);text-align:center}
body{padding-bottom:44px}
.woocommerce-product-gallery{opacity:1!important}
.woocommerce-tabs .reviews_tab,.woocommerce-Tabs-panel--reviews{display:none!important}
</style>
<div class="vp-bar"><b>Preview</b> of the Verda website · sample products and prices · ordering is switched off</div>
<script>
(function(){
  var t;
  function toast(msg){
    var el=document.querySelector('.vp-toast');
    if(!el){el=document.createElement('div');el.className='vp-toast';el.setAttribute('role','status');document.body.appendChild(el);}
    el.textContent=msg;el.hidden=false;clearTimeout(t);t=setTimeout(function(){el.hidden=true;},2600);
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('a,button');
    if(!a)return;
    if(a.matches('.add_to_cart_button,.single_add_to_cart_button,.fc-action-cart')||a.getAttribute('href')==='#vp-off'){
      e.preventDefault();toast('This is a preview — cart and checkout will work on the live website.');
    }
  });
  // "Sort by": open the same listing captured in the chosen order (page 1).
  document.addEventListener('change',function(e){
    if(!e.target.matches('select.orderby'))return;
    var file=(location.pathname.split('/').pop()||'index.html').replace(/\.html$/,'');
    var base=file.replace(/-orderby-[a-z-]+$/,'').replace(/-page-\d+$/,'');
    var v=e.target.value;
    location.href=base+(v&&v!=='menu_order'?'-orderby-'+v:'')+'.html';
  });
  document.addEventListener('submit',function(e){
    e.preventDefault();
    if(e.target.matches('.woocommerce-ordering'))return;
    var q=e.target.querySelector('input[type=search]');
    toast(q?'Search will work on the live website.':'This is a preview — this will work on the live website.');
  });
})();
</script>
"""


def rewrite_page(html, path):
    # Drop scripts except the theme's main.js; drop non-stylesheet <link>s and generator metas.
    # Product pages need WooCommerce's own scripts so the size/flavour dropdown switches the
    # price and photo, and the gallery works. These run entirely in the browser.
    keep_src = re.compile(r"wp-includes/js/(jquery/|underscore|wp-util)|woocommerce/assets/js/(frontend/(add-to-cart-variation|single-product)|flexslider|zoom|photoswipe|jquery-blockui)", re.I)
    keep_inline = re.compile(r"id=[\"'](wp-util|wc-add-to-cart-variation|wc-single-product|jquery-core|underscore)[^\"']*-js-(extra|before|after)[\"']", re.I)

    def keep_script(m):
        tag = m.group(0)
        if re.search(r'src=["\'][^"\']*freshcart/assets/js/main\.js', tag):
            return re.sub(r'<script', '<script defer', tag, count=1)
        if keep_src.search(tag) or keep_inline.search(tag) or re.search(r"type=[\"']text/template", tag):
            return tag
        return ""

    html = re.sub(r"<script\b[^>]*>.*?</script>", keep_script, html, flags=re.S | re.I)
    html = re.sub(r"<link\b(?![^>]*rel=['\"]stylesheet)[^>]*>", "", html, flags=re.I)
    html = re.sub(r"<meta name=['\"]generator['\"][^>]*>", "", html, flags=re.I)
    html = re.sub(r"<noscript>.*?</noscript>", "", html, flags=re.S | re.I)
    # Maps can't be embedded in an Artifact: link out instead.
    html = re.sub(
        r"<iframe[^>]*google\.com/maps[^>]*></iframe>",
        '<p><a class="fc-btn" href="https://www.google.com/maps/search/?api=1&amp;query=Niti+Khand+1+Indirapuram+Ghaziabad" target="_blank" rel="noopener">Open location in Google Maps</a></p>',
        html,
        flags=re.I,
    )

    def repl_attr(m):
        attr, q, val = m.group(1), m.group(2), m.group(3)
        if attr.lower() == "srcset":
            parts = []
            for item in val.split(","):
                bits = item.strip().split()
                if not bits:
                    continue
                n = norm(bits[0])
                if n:
                    bits[0] = grab_asset(n[0])
                parts.append(" ".join(bits))
            return '%s=%s%s%s' % (attr, q, ", ".join(parts), q)
        if val.startswith(("#", "mailto:", "tel:", "data:", "javascript:")):
            return m.group(0)
        n = norm(val)
        if not n:
            return m.group(0)
        p, query = n
        frag = urllib.parse.urlparse(val.replace("&#038;", "&")).fragment
        if re.search(r"\.(css|js|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|eot)$", p, re.I):
            return '%s=%s%s%s' % (attr, q, grab_asset(p), q)
        if attr.lower() == "href":
            if is_page(p, query):
                queue_page(p, query)
                return '%s=%s%s%s%s' % (attr, q, page_name(p, query), "#" + frag if frag else "", q)
            return '%s=%s#vp-off%s' % (attr, q, q)
        if attr.lower() == "action":
            return '%s=%s#%s' % (attr, q, q)
        return m.group(0)

    html = re.sub(r"""\b(href|src|srcset|action|data-src)=(["'])(.*?)\2""", repl_attr, html, flags=re.I | re.S)

    # Inline style url(...) (banner backgrounds).
    def repl_style_url(m):
        n = norm(m.group(2))
        if not n:
            return m.group(0)
        return "url(%s%s%s)" % (m.group(1), grab_asset(n[0]), m.group(1))

    html = re.sub(r"""url\((['"]?)(https?://[^'")]+)\1\)""", repl_style_url, html)
    html = html.replace("</body>", PREVIEW_JS + "</body>")
    return html


queue = deque()


def queue_page(p, query=""):
    key = p + ("?" + query if query else "")
    if key not in pages:
        pages[key] = page_name(p, query)
        queue.append(key)
    # Each shop/category listing is also captured in every sort order, so "Sort by" works.
    if not query and LISTING.match(p) and "/page/" not in p:
        for v in SORTS:
            queue_page(p, "orderby=" + v)


def main():
    os.makedirs(OUT, exist_ok=True)
    queue_page("/")
    while queue:
        p = queue.popleft()
        try:
            data, ctype = fetch(BASE + p)
        except Exception as e:
            print("page failed", p, e)
            pages[p] = None
            continue
        html = rewrite_page(data.decode("utf-8", "replace"), p.split("?")[0])
        with open(os.path.join(OUT, pages[p]), "w", encoding="utf-8") as fh:
            fh.write(html)
    ok = {k: v for k, v in pages.items() if v}
    print("pages", len(ok), "assets", len(assets))
    json.dump({"pages": ok, "assets": sorted(assets.values())}, open(os.path.join(OUT, "_manifest.json"), "w"), indent=1)


if __name__ == "__main__":
    main()
