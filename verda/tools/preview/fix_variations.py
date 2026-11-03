"""Rewrite local URLs inside WooCommerce variation JSON and fetch any images only referenced there."""
import glob, os, re, sys, urllib.request

E, BASE = sys.argv[1], sys.argv[2].rstrip("/")
host = BASE.split("//", 1)[1]
esc = "http:\\/\\/" + host + "\\/"
fetched = 0
for f in glob.glob(os.path.join(E, "*.html")):
    h = open(f, encoding="utf-8").read()
    if esc not in h and BASE not in h:
        continue
    for path in set(re.findall(re.escape(esc) + r"(wp-content\\/uploads\\/[^&\"]+?\.(?:jpe?g|png|webp))", h)):
        rel = path.replace("\\/", "/")
        dest = os.path.join(E, rel)
        if not os.path.exists(dest):
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            urllib.request.urlretrieve(BASE + "/" + rel, dest)
            fetched += 1
    h = h.replace(esc, "").replace(BASE + "/", "")
    open(f, "w", encoding="utf-8").write(h)
left = [f for f in glob.glob(os.path.join(E, "*.html")) if host in open(f, encoding="utf-8").read()]
print("fetched", fetched, "files still with local host:", len(left))
