"""Post-process the static export: strip leftovers, make index.html a fragment, list files."""
import glob, json, os, re, sys

S = sys.argv[1]
for f in glob.glob(os.path.join(S, "*.html")):
    h = open(f, encoding="utf-8").read()
    h = re.sub(r'<meta name="msapplication-TileImage"[^>]*>', "", h)
    h = re.sub(r"/\*# sourceURL=[^*]*\*/", "", h)
    h = re.sub(r'\sdata-large_image="[^"]*"', "", h)
    h = h.replace("website · sample products and prices · ordering", "website &middot; sample products and prices &middot; ordering")
    h = h.replace("'This is a preview — ", "'This is a preview \\u2014 ")
    open(f, "w", encoding="utf-8").write(h)

p = os.path.join(S, "index.html")
h = open(p, encoding="utf-8").read()
title = re.search(r"<title>.*?</title>", h, re.S).group(0)
head = re.search(r"<head[^>]*>(.*?)</head>", h, re.S).group(1).replace(title, "")
head = re.sub(r"<meta (charset|name=\"viewport\")[^>]*>", "", head)
m = re.search(r"<body([^>]*)>(.*)</body>", h, re.S)
classes = re.search(r'class="([^"]*)"', m.group(1)).group(1)
open(p, "w", encoding="utf-8").write(
    "<title>Verda Store Preview</title>\n" + head + m.group(2)
    + '\n<script>document.body.className += " %s";</script>\n' % classes
)
left = [f for f in glob.glob(os.path.join(S, "*.html")) if "127.0.0.1" in open(f, encoding="utf-8").read()]
files = sorted(
    os.path.relpath(os.path.join(r, n), S)
    for r, _, ns in os.walk(S) for n in ns
)
files = [f for f in files if f not in ("index.html", "_manifest.json")]
json.dump([{"path": f} for f in files], open(os.path.join(os.path.dirname(S), "export-files.json"), "w"))
print("local URLs left in", len(left), "files; supporting files:", len(files))
print([f for f in files if f.endswith(".js")])
