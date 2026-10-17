<?php
/**
 * Sets up the Verda proof-of-concept store in WordPress Playground (not part of the theme).
 *
 * Products come from verda/products.csv (the same file you can import on the live site
 * with WooCommerce → Products → Import). All prices and stock are SAMPLE values.
 */
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';
require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/media.php';

// The blueprint copies the repo's verda/ folder here.
const VERDA_DATA = '/wordpress/verda-data/';

// The source images are already web-sized, so skip generating resized copies:
// that is slow and memory-hungry in the in-browser PHP.
ini_set( 'memory_limit', '1024M' );
add_filter( 'intermediate_image_sizes_advanced', '__return_empty_array' );
add_filter( 'big_image_size_threshold', '__return_false' );

/**
 * Add an image from verda/images/ to the media library; returns the attachment ID (0 if missing).
 */
function verda_image( $relative, $title ) {
	$file = VERDA_DATA . 'images/' . $relative;
	if ( ! file_exists( $file ) ) {
		return 0;
	}
	$upload = wp_upload_bits( basename( $file ), null, file_get_contents( $file ) );
	if ( $upload['error'] ) {
		return 0;
	}
	$id = wp_insert_attachment(
		array(
			'post_mime_type' => wp_check_filetype( $upload['file'] )['type'],
			'post_title'     => $title,
			'post_status'    => 'inherit',
		),
		$upload['file']
	);
	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $upload['file'] ) );
	return $id;
}

// ---------------------------------------------------------------------------
// Store settings.
// ---------------------------------------------------------------------------
update_option( 'blogname', 'Verda' );
update_option( 'blogdescription', 'Nature. Purity. Life' );
update_option( 'woocommerce_currency', 'INR' );
update_option( 'woocommerce_currency_pos', 'left' );
update_option( 'woocommerce_price_num_decimals', 0 );
update_option( 'woocommerce_default_country', 'IN:UP' );
update_option( 'woocommerce_store_address', '561, Niti Khand-1, Indirapuram' );
update_option( 'woocommerce_store_city', 'Ghaziabad' );
update_option( 'woocommerce_store_postcode', '201014' );
update_option( 'woocommerce_specific_allowed_countries', array( 'IN' ) );
update_option( 'woocommerce_allowed_countries', 'specific' );
update_option( 'woocommerce_ship_to_countries', '' );
update_option( 'woocommerce_manage_stock', 'yes' );
update_option( 'woocommerce_weight_unit', 'kg' );

// Cash on delivery for the demo checkout.
update_option(
	'woocommerce_cod_settings',
	array(
		'enabled'      => 'yes',
		'title'        => 'Cash on Delivery',
		'description'  => 'Pay with cash or UPI when your order is delivered.',
		'instructions' => 'Pay with cash or UPI upon delivery.',
	)
);

// Shipping: ₹49 flat rate, free above ₹499 (sample rules).
$zone = new WC_Shipping_Zone();
$zone->set_zone_name( 'India' );
$zone->add_location( 'IN', 'country' );
$zone->save();
$flat = $zone->add_shipping_method( 'flat_rate' );
update_option( 'woocommerce_flat_rate_' . $flat . '_settings', array( 'title' => 'Standard Delivery', 'tax_status' => 'none', 'cost' => '49' ) );
$free = $zone->add_shipping_method( 'free_shipping' );
update_option( 'woocommerce_free_shipping_' . $free . '_settings', array( 'title' => 'Free Delivery', 'requires' => 'min_amount', 'min_amount' => '499' ) );

// ---------------------------------------------------------------------------
// Categories, in display order.
// ---------------------------------------------------------------------------
$category_names = array( 'Healthy Snacks', 'Makhana', 'Dry Fruits & Nuts', 'Diwali Gift Hampers', 'Atta, Rice & Dals', 'Oils & Ghee', 'Millets' );
$category_thumb = array(
	'Healthy Snacks'      => 'vs-jp-cs',
	'Makhana'             => 'vs-mk-ps',
	'Dry Fruits & Nuts'   => 'vs-df-al500',
	'Diwali Gift Hampers' => 'vs-gh-dd',
	'Atta, Rice & Dals'   => 'vs-ar-wa5',
	'Oils & Ghee'         => 'vs-og-ag500',
	'Millets'             => 'vs-ml-rf1',
);
$ids = array();
foreach ( $category_names as $order => $name ) {
	$term          = wp_insert_term( $name, 'product_cat' );
	$ids[ $name ] = $term['term_id'];
	update_term_meta( $term['term_id'], 'order', $order );
}

// ---------------------------------------------------------------------------
// Products from products.csv.
// ---------------------------------------------------------------------------
$csv = fopen( VERDA_DATA . 'products.csv', 'r' );
$head = fgetcsv( $csv, 0, ',', '"', '' );
$image_by_sku = array();
$i = 0;
while ( ( $row = fgetcsv( $csv, 0, ',', '"', '' ) ) !== false ) {
	$r       = array_combine( $head, $row );
	$product = new WC_Product_Simple();
	$product->set_name( $r['Name'] );
	$product->set_sku( $r['SKU'] );
	$product->set_short_description( $r['Short description'] );
	$product->set_description( $r['Description'] );
	$product->set_regular_price( $r['Regular price'] );
	if ( '' !== $r['Sale price'] ) {
		$product->set_sale_price( $r['Sale price'] );
	}
	$product->set_manage_stock( true );
	$product->set_stock_quantity( (int) $r['Stock'] );
	$product->set_featured( '1' === $r['Is featured?'] );
	$product->set_category_ids( array( $ids[ str_replace( '\\,', ',', $r['Categories'] ) ] ) );

	$attribute = new WC_Product_Attribute();
	$attribute->set_name( 'Pack size' );
	$attribute->set_options( array( $r['Attribute 1 value(s)'] ) );
	$attribute->set_visible( true );
	$product->set_attributes( array( $attribute ) );

	$image = verda_image( 'products/' . basename( $r['Images'] ), $r['Name'] );
	if ( $image ) {
		$product->set_image_id( $image );
		$image_by_sku[ strtolower( $r['SKU'] ) ] = $image;
	}
	// Sample sales numbers so "Trending Products" has an order; featured items sell most.
	$product->set_total_sales( ( '1' === $r['Is featured?'] ? 200 : 60 ) - $i );
	// Newest first follows the CSV order, so "Products With Discounts" starts with snacks.
	$product->set_date_created( time() - $i * HOUR_IN_SECONDS );
	$product->save();
	$i++;
}
fclose( $csv );

foreach ( $category_thumb as $name => $sku ) {
	if ( isset( $image_by_sku[ $sku ] ) ) {
		update_term_meta( $ids[ $name ], 'thumbnail_id', $image_by_sku[ $sku ] );
	}
}

// ---------------------------------------------------------------------------
// Blog posts.
// ---------------------------------------------------------------------------
$posts = array(
	array(
		'5 Reasons to Add Millets to Your Daily Diet',
		'vs-ml-ma1',
		'<p>Millets like jowar, bajra and ragi were staples in Indian kitchens for centuries. Here is why they deserve a place on your plate again:</p><ol><li><strong>Naturally gluten-free</strong> — gentle on digestion.</li><li><strong>High in fibre</strong> — keeps you full for longer.</li><li><strong>Rich in minerals</strong> — ragi is one of the best plant sources of calcium.</li><li><strong>Low glycaemic index</strong> — helps manage blood sugar.</li><li><strong>Good for the planet</strong> — millets need far less water than rice or wheat.</li></ol><p>Start simple: swap half your wheat atta for Verda Multi-Millet Atta.</p>',
	),
	array(
		'Makhana: The Superfood Snack From Bihar',
		'vs-mk-pl250',
		'<p>Makhana (fox nuts) are the seeds of the lotus plant, harvested by hand from the ponds of Mithila. Light, crunchy and naturally low in calories, they are high in protein and magnesium.</p><p>Roast them in a little ghee with salt and pepper, or try our ready-to-eat Roasted Makhana in four flavours.</p>',
	),
	array(
		'Healthy Diwali Gifting Ideas for 2026',
		'vs-gh-rd',
		'<p>This Diwali, gift health instead of sugar. Dry fruit boxes, millet snack hampers and roasted makhana make thoughtful gifts for family, friends and colleagues.</p><p>Ordering for your team? Our corporate hampers can be customised with your company branding — write to office@verdaessentials.com.</p>',
	),
	array(
		'How to Store Dry Fruits and Keep Them Fresh',
		'vs-df-cw500',
		'<p>Dry fruits stay fresh for months when stored right. Keep them in airtight glass jars, away from heat and sunlight. In summer, refrigerate walnuts and pistachios to stop their natural oils turning rancid.</p><p>Every Verda dry fruit pack is nitrogen-flushed to lock in freshness until you open it.</p>',
	),
);
foreach ( $posts as $p ) {
	$post_id = wp_insert_post(
		array(
			'post_title'   => $p[0],
			'post_content' => $p[2],
			'post_status'  => 'publish',
		)
	);
	if ( isset( $image_by_sku[ $p[1] ] ) ) {
		set_post_thumbnail( $post_id, $image_by_sku[ $p[1] ] );
	}
}
wp_delete_post( 1, true ); // "Hello world!"

// ---------------------------------------------------------------------------
// Pages (draft text for management review).
// ---------------------------------------------------------------------------
$company = 'Verda Essentials Pvt Ltd';
$address = '561, Niti Khand-1, Indirapuram, Ghaziabad – 201014, Uttar Pradesh, India';
$email   = 'office@verdaessentials.com';
$phones  = '+91-9266604099 | +91-7701830278';

$pages = array(
	'About Us'             => "<h2>Nature. Purity. Life.</h2><p>Verda is a brand of {$company}, built on a simple belief: everyday food should be pure, natural and good for you.</p><p>We bring you wholesome millet snacks, premium makhana, hand-picked dry fruits and honest kitchen staples — sourced from trusted Indian farms and packed with care in hygienic conditions.</p><h3>What we stand for</h3><ul><li><strong>Purity</strong> — no artificial colours, no palm oil, nothing you can't pronounce.</li><li><strong>Nature</strong> — traditional grains and time-tested methods like cold pressing and bilona churning.</li><li><strong>Life</strong> — food that fuels healthy families and supports Indian farmers.</li></ul><p>We deliver all over India.</p>",
	'Contact Us'           => "<p>We'd love to hear from you — for orders, bulk and corporate gifting, or partnerships.</p><p><strong>{$company}</strong><br>{$address}</p><p><strong>Phone:</strong> {$phones}<br><strong>Email:</strong> <a href=\"mailto:{$email}\">{$email}</a></p><p><strong>Hours:</strong> Monday to Saturday, 10:00 am – 7:00 pm</p><!-- wp:html --><iframe title=\"Verda on the map\" src=\"https://www.google.com/maps?q=Niti+Khand+1+Indirapuram+Ghaziabad&output=embed\" width=\"100%\" height=\"360\" style=\"border:0;border-radius:12px\" loading=\"lazy\"></iframe><!-- /wp:html -->",
	'FAQ'                  => '<h3>Where do you deliver?</h3><p>We deliver across India.</p><h3>How long does delivery take?</h3><p>Orders are dispatched within 1–2 working days. Delivery usually takes 3–7 working days depending on your location.</p><h3>What payment methods do you accept?</h3><p>UPI, credit and debit cards, net banking and Cash on Delivery (on eligible pincodes).</p><h3>Do you offer corporate or bulk Diwali hampers?</h3><p>Yes. We customise hampers with your branding. Email ' . $email . ' with your quantity and budget.</p><h3>Are your products preservative-free?</h3><p>Our snacks are roasted, not fried, and contain no artificial colours or palm oil. See each product page for full details.</p>',
	'Shipping Policy'      => "<p>{$company} ships to all serviceable pincodes in India.</p><ul><li>Orders are dispatched within 1–2 working days.</li><li>Typical delivery time is 3–7 working days.</li><li>Free shipping on orders above ₹499; a flat fee applies below that.</li><li>You will receive a tracking link by SMS/email once your order ships.</li></ul><p><em>Draft — please review the delivery charges and timelines.</em></p>",
	'Return & Refund Policy' => "<p>Because our products are food items, we cannot accept returns of opened packs. If your order arrives damaged, defective or incorrect, contact us within 48 hours of delivery at {$email} with photos, and we will send a replacement or a full refund.</p><p>Refunds are processed to the original payment method within 5–7 working days of approval.</p><p><em>Draft — please review.</em></p>",
	'Privacy Policy'       => "<p>{$company} respects your privacy. We collect only the information needed to process your orders and improve our service — such as your name, address, phone number and email. We never sell your personal data.</p><p>Payments are processed by secure third-party payment gateways; we do not store card details.</p><p>For any privacy questions, write to {$email}.</p><p><em>Draft — have this reviewed by your legal adviser.</em></p>",
	'Terms & Conditions'   => "<p>This website is operated by {$company}, {$address}. By placing an order you agree to these terms.</p><ul><li>Prices are in Indian Rupees and include applicable taxes unless stated otherwise.</li><li>We may cancel orders in case of pricing errors or stock unavailability, with a full refund.</li><li>Product images are for illustration; actual packaging may vary.</li><li>All disputes are subject to the jurisdiction of courts in Ghaziabad, Uttar Pradesh.</li></ul><p><em>Draft — have this reviewed by your legal adviser.</em></p>",
);
$page_ids = array();
foreach ( $pages as $title => $content ) {
	$page_ids[ $title ] = wp_insert_post(
		array(
			'post_title'   => $title,
			'post_content' => $content,
			'post_type'    => 'page',
			'post_status'  => 'publish',
		)
	);
}
update_option( 'wp_page_for_privacy_policy', $page_ids['Privacy Policy'] );
update_option( 'woocommerce_terms_page_id', $page_ids['Terms & Conditions'] );

$home = wp_insert_post( array( 'post_title' => 'Home', 'post_type' => 'page', 'post_status' => 'publish' ) );
$blog = wp_insert_post( array( 'post_title' => 'Blog', 'post_type' => 'page', 'post_status' => 'publish' ) );
update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $home );
update_option( 'page_for_posts', $blog );

// ---------------------------------------------------------------------------
// Menus.
// ---------------------------------------------------------------------------
function verda_menu( $name, $items ) {
	$menu = wp_create_nav_menu( $name );
	foreach ( $items as $item ) {
		wp_update_nav_menu_item( $menu, 0, $item + array( 'menu-item-status' => 'publish' ) );
	}
	return $menu;
}
function verda_page_item( $id ) {
	return array( 'menu-item-object' => 'page', 'menu-item-object-id' => $id, 'menu-item-type' => 'post_type' );
}
function verda_cat_item( $id ) {
	return array( 'menu-item-object' => 'product_cat', 'menu-item-object-id' => $id, 'menu-item-type' => 'taxonomy' );
}

$main = wp_create_nav_menu( 'Main Menu' );
wp_update_nav_menu_item( $main, 0, array( 'menu-item-title' => 'Home', 'menu-item-url' => home_url( '/' ), 'menu-item-status' => 'publish' ) );
$shop_item = wp_update_nav_menu_item( $main, 0, verda_page_item( wc_get_page_id( 'shop' ) ) + array( 'menu-item-status' => 'publish' ) );
foreach ( $category_names as $name ) {
	wp_update_nav_menu_item( $main, 0, verda_cat_item( $ids[ $name ] ) + array( 'menu-item-parent-id' => $shop_item, 'menu-item-status' => 'publish' ) );
}
wp_update_nav_menu_item( $main, 0, verda_cat_item( $ids['Diwali Gift Hampers'] ) + array( 'menu-item-title' => 'Diwali Gifting', 'menu-item-status' => 'publish' ) );
foreach ( array( 'About Us', 'Contact Us' ) as $title ) {
	wp_update_nav_menu_item( $main, 0, verda_page_item( $page_ids[ $title ] ) + array( 'menu-item-status' => 'publish' ) );
}
wp_update_nav_menu_item( $main, 0, verda_page_item( $blog ) + array( 'menu-item-status' => 'publish' ) );

$quick = verda_menu( 'Shop', array_map( function ( $n ) use ( $ids ) { return verda_cat_item( $ids[ $n ] ); }, array( 'Healthy Snacks', 'Makhana', 'Dry Fruits & Nuts', 'Diwali Gift Hampers', 'Millets' ) ) );
$help  = verda_menu(
	'Help',
	array(
		verda_page_item( wc_get_page_id( 'myaccount' ) ),
		verda_page_item( wc_get_page_id( 'cart' ) ),
		verda_page_item( $page_ids['FAQ'] ),
		verda_page_item( $page_ids['Contact Us'] ),
		verda_page_item( $page_ids['About Us'] ),
	)
);
$policy = verda_menu(
	'Policies',
	array_map(
		function ( $t ) use ( $page_ids ) {
			return verda_page_item( $page_ids[ $t ] );
		},
		array( 'Shipping Policy', 'Return & Refund Policy', 'Privacy Policy', 'Terms & Conditions' )
	)
);
set_theme_mod(
	'nav_menu_locations',
	array(
		'primary'  => $main,
		'footer-1' => $quick,
		'footer-2' => $help,
		'footer-3' => $policy,
	)
);

// ---------------------------------------------------------------------------
// Logo, colours and homepage content (Appearance → Customize).
// ---------------------------------------------------------------------------
$logo = verda_image( 'verda-logo.png', 'Verda logo' );
if ( $logo ) {
	set_theme_mod( 'custom_logo', $logo );
	update_option( 'site_icon', $logo );
}

$banner = function ( $file ) {
	$id = verda_image( 'banners/' . $file, 'Banner ' . $file );
	return $id ? wp_get_attachment_url( $id ) : '';
};

$mods = array(
	'color_primary'      => '#1f5f23',
	'color_secondary'    => '#0f3d12',
	'color_dark'         => '#13261a',
	'color_accent'       => '#9c6b12',
	'color_highlight'    => '#9c6b12',

	'topbar_address'     => '561, Niti Khand-1, Indirapuram, Ghaziabad – 201014',
	'topbar_email'       => $email,
	'topbar_text'        => 'Free delivery on orders above ₹499 · Delivering all over India',
	'header_phone_label' => 'Call Us',
	'header_phone'       => '+91-9266604099',

	'hero_banner'        => $banner( 'hero-diwali.jpg' ),
	'hero_banner_url'    => get_term_link( $ids['Diwali Gift Hampers'] ),
	'hero_banner_alt'    => 'Verda Premium Diwali Gifting – thoughtfully curated dry fruit gift boxes',
	'hero_tagline'       => '100% Natural',
	'hero_title'         => "Pure & Natural\nGoodness",
	'hero_text'          => 'Millet puffs, makhana, dry fruits and everyday staples — delivered all over India.',
	'hero_image'         => $banner( 'hero.png' ),
	'hero_price_label'   => 'Up to',
	'hero_price'         => '20%',
	'hero_price_old'     => '',
	'hero_b1_title'      => '',
	'hero_b1_text'       => 'Verda cold pressed oils – mustard, groundnut, sesame and coconut',
	'hero_b1_image'      => $banner( 'banner-oils-photo.jpg' ),
	'hero_b1_url'        => get_term_link( $ids['Oils & Ghee'] ),
	// Ready-made artwork: empty title shows the image only; the text is its description.
	'hero_b2_title'      => '',
	'hero_b2_text'       => 'Verda premium pulses – Chana, Toor, Moong and Masoor Dal',
	'hero_b2_image'      => $banner( 'banner-pulses.jpg' ),
	'hero_b2_url'        => get_term_link( $ids['Atta, Rice & Dals'] ),
	'hero_b3_title'      => "Dry Fruits\n& Nuts",
	'hero_b3_text'       => 'Premium quality',
	'hero_b3_image'      => $banner( 'banner-dryfruits.jpg' ),
	'hero_b3_url'        => get_term_link( $ids['Dry Fruits & Nuts'] ),

	'cats_include'       => 'healthy-snacks,makhana,dry-fruits-nuts,diwali-gift-hampers,atta-rice-dals,oils-ghee,millets',

	'promo_tagline'      => 'Millet Power',
	'promo_title'        => "Wholesome Millets\nFor Your Family",
	'promo_text'         => 'Jowar, bajra and ragi — the ancient grains for a healthier everyday diet.',
	'promo_image'        => $banner( 'banner-millets.jpg' ),
	'promo_btn_url'      => get_term_link( $ids['Millets'] ),

	'dual1_tagline'      => 'Healthy Snacks',
	'dual1_title'        => 'Jowar & Bajra Puffs',
	'dual1_text'         => 'Roasted, never fried',
	'dual1_image'        => $banner( 'banner-puffs.jpg' ),
	'dual1_url'          => get_term_link( $ids['Healthy Snacks'] ),
	'dual2_tagline'      => 'Festive Gifting',
	'dual2_title'        => 'Corporate Hampers',
	'dual2_text'         => 'Custom-branded gift boxes for Diwali',
	'dual2_image'        => $banner( 'banner-corporate.jpg' ),
	'dual2_url'          => get_term_link( $ids['Diwali Gift Hampers'] ),

	'blog_title'         => 'Healthy Living Blog',
	'feat1_text'         => 'On orders above ₹499',
	'feat2_text'         => 'Best prices, direct from us',
	'feat3_text'         => 'Easy replacement on damaged items',
	'feat4_text'         => 'Festive offers every week',
	'feat5_text'         => 'Call +91-9266604099',

	'footer_about'       => 'Verda brings you pure, natural and healthy foods — from wholesome staples to millet puffs, makhana, dry fruits and festive gift hampers.',
	'footer_address'     => $address,
	'footer_phone'       => $phones,
	'footer_email'       => $email,
	'news_text'          => 'Get offers, new launches and healthy recipes in your inbox.',
	'social_facebook'    => 'https://www.facebook.com/',
	'social_instagram'   => 'https://www.instagram.com/',
	'social_youtube'     => 'https://www.youtube.com/',
	'copyright'          => '© {year} Verda Essentials Pvt Ltd. All Rights Reserved.',
);
foreach ( $mods as $key => $value ) {
	set_theme_mod( 'freshcart_' . $key, $value );
}

flush_rewrite_rules();
