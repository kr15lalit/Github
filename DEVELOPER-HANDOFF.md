# Verda website — developer hand-off

Online store for **Verda** (Verda Essentials Pvt Ltd), built on **WordPress + WooCommerce** with a custom theme, **FreshCart**.

- Live preview of the agreed design (static, ordering off): https://claude.ai/artifact/XwCUjY2FrFEaFawFu3nvXv (ask the owner to share it with you)
- Full working demo (runs WordPress in your browser, admin access): https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/kr15lalit/Github/claude/funny-euler-c0bsfh/playground/blueprint.json
- Source: https://github.com/kr15lalit/Github, branch `claude/funny-euler-c0bsfh`

## What's in this repo

| Path | Contents |
|---|---|
| `freshcart/` | The theme. Zip this folder (zip must contain `freshcart/style.css`) and upload in Appearance → Themes → Add New → Upload, or copy it to `wp-content/themes/`. |
| `verda/products.csv` | **Sample** catalogue (39 products) in WooCommerce import format. Replace with the real list when it arrives. |
| `verda/images/products/` | Pack images for the sample products (the CSV links to them on GitHub). |
| `verda/images/verda-logo.png` | Logo (transparent PNG). |
| `verda/images/banners/` | Homepage banners (see the table below for which goes where). |
| `verda/store-details.md` | Business name, address, phones, email, categories. |
| `verda/Verda-Product-Catalogue-Template.xlsx` | Sheet the business will fill with real products. |
| `playground/seed.php` | The script that builds the demo. It holds the exact page texts (About, Contact, FAQ, policies), menus, shipping rules and every theme setting — use it as the reference. |
| `playground/blueprint.json` | Recipe for the WordPress Playground demo linked above. |
| `verda/tools/` | Python scripts that generated the sample images, CSV and Excel template (not needed on the server). |

## Requirements

- WordPress 6.0+ (tested on 6.6+), PHP 7.4+ (tested on 8.2/8.3), MySQL/MariaDB
- **WooCommerce** (required for the shop sections)
- HTTPS, and pretty permalinks (Settings → Permalinks → *Post name*)

## Setup steps

1. **Install** WooCommerce, then upload and activate the theme (`freshcart/` zipped).
2. **Store settings** (WooCommerce → Settings): country India (Uttar Pradesh), currency INR ₹, 0 decimals, store address *561, Niti Khand-1, Indirapuram, Ghaziabad 201014*. Sell/ship to India only.
3. **Categories** (Products → Categories), in this order: Healthy Snacks, Makhana, Dry Fruits & Nuts, Diwali Gift Hampers, Atta, Rice & Dals, Oils & Ghee, Millets. Add a thumbnail to each.
4. **Products**: Products → Import → `verda/products.csv` (map columns automatically). For the real catalogue, convert the filled Excel sheet: rows with the same Product Name become one *variable* product with Pack size / Flavour attributes.
5. **Pages**: create Home (blank, set as static front page), Blog (posts page), About Us, Contact Us, FAQ, Shipping Policy, Return & Refund Policy, Privacy Policy, Terms & Conditions. Texts are in `playground/seed.php`; policies are drafts for legal review.
6. **Menus** (Appearance → Menus) — the theme has 4 locations:
   - *Primary*: Home, Shop (with the 7 categories as sub-items), Diwali Gifting, About Us, Contact Us, Blog
   - *Footer: Quick Links* ("Shop"): Healthy Snacks, Makhana, Dry Fruits & Nuts, Diwali Gift Hampers, Millets
   - *Footer: Accounts* ("Help"): My account, Cart, FAQ, Contact Us, About Us
   - *Footer: Policies* ("Policies"): the 4 policy pages
   The footer column heading is the menu's name.
7. **Logo**: Appearance → Customize → Site Identity → upload `verda/images/verda-logo.png` (also as site icon).
8. **Theme settings**: Appearance → Customize → **FreshCart Theme Options** (table below).
9. **Shipping** (sample rule agreed for the demo): zone India — Flat rate ₹49 "Standard Delivery", Free shipping with minimum order ₹499.
10. **Payments**: Cash on Delivery for now; the business will choose a gateway (Razorpay / PayU / Cashfree for UPI and cards).
11. **Newsletter**: install a form plugin (e.g. Fluent Forms or Mailchimp for WP) and paste its shortcode in Customize → FreshCart Theme Options → Footer.

## Theme settings used in the demo

**Colors** (Customize → Colors): Primary `#1f5f23` · Secondary/hover `#0f3d12` · Heading `#13261a` · Sale badge & countdown `#9c6b12` · Tagline `#9c6b12`

**Header**: address *561, Niti Khand-1, Indirapuram, Ghaziabad – 201014* · email *office@verdaessentials.com* · top-bar text *Free delivery on orders above ₹499 · Delivering all over India* · phone label *Call Us* · phone *+91-9266604099*

**Homepage banners** — ready-made artwork: leave the banner *title empty* so only the image shows; the "text" field becomes the image description.

| Customizer field | Image (`verda/images/banners/`) | Link |
|---|---|---|
| Home: Hero → Ready-made banner image | `hero-diwali.jpg` | Diwali Gift Hampers category |
| Home: Hero → Banner 1 (top right) | `banner-oils-photo.jpg` | Oils & Ghee category |
| Home: Hero → Banner 2 (small middle) | `banner-pulses.jpg` | Atta, Rice & Dals category |
| Home: Hero → Banner 3 (small right) | `banner-ghee.jpg` | A2 Desi Cow Ghee product |
| Home: Wide Promo Banner → Ready-made full-width banner | `promo-oils-pure.jpg` (button text *Shop Now*) | Oils & Ghee category |
| Home: Two Banners → Left (with title *Jowar & Bajra Puffs*) | `banner-puffs.jpg` | Healthy Snacks category |
| Home: Two Banners → Right (with title *Corporate Hampers*) | `banner-corporate.jpg` | Diwali Gift Hampers category |

Banner sizes: hero 1500×1000 · top right 900×500 · small 600×500 · full-width strip 1920×600 (text in the left 40%) · bottom pair 900×450. Banner images are placeholders and will be replaced by the business.

**Other sections**: Popular Categories → only these slugs: `healthy-snacks,makhana,dry-fruits-nuts,diwali-gift-hampers,atta-rice-dals,oils-ghee,millets` · Blog title *Healthy Living Blog* · Features bar texts: *On orders above ₹499* / *Best prices, direct from us* / *Easy replacement on damaged items* / *Festive offers every week* / *Call +91-9266604099*.

**Footer**: about text, address, both phones, email (see `verda/store-details.md`) · copyright `© {year} Verda Essentials Pvt Ltd. All Rights Reserved.` · social links: placeholders until the business sends them.

## How the homepage data flows

- *Products With Discounts* and *Deal of the Week* = products with a sale price.
- *Trending Products* = sorted by WooCommerce `total_sales`.
- Deal countdown ends on the date set in Customizer (empty = end of the current week).
- Sale badge shows the real % discount.

## Theme code

`freshcart/` — plain PHP/HTML/CSS/JS, no build step, no page builder, no jQuery dependency.

```
functions.php              setup, menus, widget areas, assets, Customizer colours
inc/customizer.php         every option + defaults (freshcart_mod())
inc/woocommerce.php        shop wrapper, sale badge, product carousels
inc/template-tags.php      icons and helpers
front-page.php             homepage section order
template-parts/home/*.php  one file per homepage section
assets/css/main.css        all styles (CSS variables at the top)
assets/js/main.js          carousels, countdown, mobile menu, sticky menu
```

For bigger changes, use a child theme so theme updates don't overwrite them.

## Still to come from the business

Real product list + photos (template provided), GSTIN, GST rate & HSN per category (from their CA), FSSAI licence number, social media links, WhatsApp number, final banners, payment gateway choice, domain and hosting.
