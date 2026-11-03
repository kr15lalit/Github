# Shareable preview builder

Builds the static, shareable preview of the store (the claude.ai link) from a running WordPress Playground copy of the site.

1. Start Playground with `bp-export.json` (logged-out, seeded store).
2. `python3 -I export_site.py http://127.0.0.1:PORT out/`
3. `python3 -I finish_export.py out/` then `python3 -I fix_variations.py out/ http://127.0.0.1:PORT`
4. `python3 -I interactive.py out/ ../../real-products.json` adds the in-browser cart, checkout (Cash on Delivery) and search (`verda-preview.js`, `verda-preview.css`, generated `verda-catalog.js`, `cart.html`, `checkout.html`).
5. `python3 -I shop_filters.py out/` puts all products on the Shop page with the filter panel (`verda-filters.js`).
6. Serve `out/` on port 8765 and run `node interactive-test.mjs` to check the shopping flow.

The preview never sends anything anywhere: the cart lives in the visitor's browser and "orders" are only shown on screen. The real store uses WooCommerce instead.
