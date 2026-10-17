# FreshCart — WordPress + WooCommerce grocery theme

FreshCart is a WordPress theme for an online grocery and organic food store. It is original code, laid out like the Zilly "Home 06" demo: hero banners, popular categories, discount and trending product carousels, a deal of the week with a countdown, promo banners, a blog section and a features bar.

The theme code is in the [`freshcart/`](freshcart) folder.

**Try it live:** [open FreshCart in WordPress Playground](https://playground.wordpress.net/?blueprint-url=https://raw.githubusercontent.com/kr15lalit/Github/claude/funny-euler-c0bsfh/playground/blueprint.json). This runs a full WordPress site with WooCommerce, FreshCart and sample products in your browser, and opens the Customizer. Changes stay in your browser tab and are lost when you close it.

## 1. Install

1. Zip the `freshcart` folder, so the zip contains `freshcart/style.css`, `freshcart/functions.php` and so on.
2. In WordPress, go to **Appearance → Themes → Add New → Upload Theme**, choose `freshcart.zip`, then **Install** and **Activate**.
3. Install and activate **WooCommerce** under **Plugins → Add New**. The theme works without it, but the shop sections only appear when it's active.
4. Go to **Settings → Reading**, choose **A static page** and pick any page (for example "Home") as the **Homepage**. The theme's homepage design is shown automatically.
5. Go to **Settings → Permalinks** and choose **Post name** for clean URLs.

## 2. What you can edit, and where

| What | Where in WordPress |
|---|---|
| Logo, site title, site icon | Appearance → Customize → **Site Identity** |
| Main colour, hover colour, heading colour, sale-badge colour | Appearance → Customize → **Colors** |
| Top bar address, email, text, and the hotline number | Customize → **FreshCart Theme Options → Header** |
| Hero title, text, button, image, price badge and the 3 side banners | Customize → FreshCart Theme Options → **Home: Hero** |
| Popular categories: title, how many, or exactly which ones | **Home: Popular Categories** |
| Products With Discounts, Trending Products: titles and counts | **Home: Products With Discounts** and **Home: Trending Products** |
| Green promo banner | **Home: Wide Promo Banner** |
| Deal of the week: title, countdown end date, product count | **Home: Deal Of The Week** |
| The two banners (Premium Mixed / Baby Diaper) | **Home: Two Banners** |
| Blog section | **Home: Latest News & Blog** |
| Free Shipping, Save Money and the other features | **Home: Features Bar** |
| Footer text, contact info, newsletter, app links, social links, copyright | Customize → FreshCart Theme Options → **Footer** |
| Top menu and the 3 footer link columns | Appearance → **Menus**: assign *Primary Menu*, *Footer: Quick Links*, *Footer: Accounts* and *Footer: Policies*. The footer column heading is the menu's name. |
| Blog sidebar and shop filter sidebar | Appearance → **Widgets** |
| Products, prices, sale prices, categories and category images | **Products** (WooCommerce) |
| Pages and posts | Pages / Posts, using the normal block editor. Choose the **Full Width (no title)** template for pages built entirely with blocks or a page builder. |

Every homepage section has a **Show section** checkbox, so you can hide any of them. Text you add to the page set as the Homepage in the block editor appears below the Popular Categories section.

### Where products come from

- **Popular Categories:** your WooCommerce product categories, most-used first, or the category slugs you list. Set each category's image under Products → Categories → Edit → Thumbnail.
- **Products With Discounts** and **Deal Of The Week:** products that have a **Sale price**.
- **Trending Products:** your best-selling products.
- **Sale badge:** shows the actual discount, e.g. `-25%`.

### Newsletter form

Create a form with any form plugin (Fluent Forms, Contact Form 7, Mailchimp for WP…). Copy its shortcode, e.g. `[fluentform id="1"]`, and paste it into Customize → FreshCart Theme Options → Footer → *Newsletter form shortcode*.

## 3. Changing the code (optional)

```
freshcart/
├── style.css                  theme name and details
├── functions.php              setup, menus, widget areas, scripts
├── inc/customizer.php         all Customizer options and their default text
├── inc/woocommerce.php        shop integration, sale badge, product carousels
├── inc/template-tags.php      icons and small helpers
├── header.php / footer.php    site header and footer
├── front-page.php             homepage section order
├── template-parts/home/*.php  one file per homepage section
├── assets/css/main.css        all styling (colours are CSS variables at the top)
└── assets/js/main.js          carousels, countdown, mobile menu, sticky menu
```

To rename the theme, change `Theme Name:` in `freshcart/style.css`.

Images are not bundled: upload your own photos through the Customizer and the product editor.
