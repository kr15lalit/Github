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
// Real Verda catalogue (verda/real-products.json, built from the product photos).
// Prices in that file are ESTIMATES until the business confirms its MRPs.
// ---------------------------------------------------------------------------
$catalogue      = json_decode( file_get_contents( VERDA_DATA . 'real-products.json' ), true );
$category_names = $catalogue['categories'];
$ids            = array();
foreach ( $category_names as $order => $name ) {
	$term = term_exists( $name, 'product_cat' );
	if ( ! $term ) {
		$term = wp_insert_term( $name, 'product_cat' );
	}
	if ( is_wp_error( $term ) ) {
		fwrite( STDERR, 'Category ' . $name . ': ' . $term->get_error_message() . "\n" );
		continue;
	}
	$ids[ $name ] = (int) $term['term_id'];
	update_term_meta( $ids[ $name ], 'order', $order );
}

$image_by_file = array();
$real_image    = function ( $file, $title ) use ( &$image_by_file ) {
	if ( ! $file ) {
		return 0;
	}
	if ( ! isset( $image_by_file[ $file ] ) ) {
		$image_by_file[ $file ] = verda_image( 'real/' . $file, $title );
	}
	return $image_by_file[ $file ];
};

$product_ids = array();
foreach ( $catalogue['products'] as $i => $c ) {
	$variants = $c['variants'];
	$gallery  = array();
	foreach ( $variants as $v ) {
		if ( $v['back'] ) {
			$gallery[] = $real_image( $v['back'], $c['name'] . ' – back of pack' );
		}
	}
	foreach ( $c['gallery'] as $g ) {
		$gallery[] = $real_image( $g, $c['name'] );
	}

	$attribute = new WC_Product_Attribute();
	$attribute->set_name( $c['attr'] );
	$attribute->set_options( wp_list_pluck( $variants, 'label' ) );
	$attribute->set_visible( true );
	$attribute->set_variation( count( $variants ) > 1 );

	$product = count( $variants ) > 1 ? new WC_Product_Variable() : new WC_Product_Simple();
	$product->set_name( $c['name'] );
	$product->set_short_description( $c['short'] );
	$product->set_description( '<p>' . $c['short'] . '</p><p>' . $c['note'] . '</p>' );
	$product->set_featured( (bool) $c['featured'] );
	$product->set_category_ids( array( $ids[ $c['cat'] ] ) );
	$product->set_attributes( array( $attribute ) );
	$product->set_image_id( $real_image( $variants[0]['image'], $c['name'] ) );
	$product->set_gallery_image_ids( array_values( array_filter( $gallery ) ) );
	// Sample sales numbers so "Trending Products" has an order; featured items first.
	$product->set_total_sales( ( $c['featured'] ? 200 : 60 ) - $i );
	$product->set_date_created( time() - $i * HOUR_IN_SECONDS );
	if ( 1 === count( $variants ) ) {
		$product->set_sku( $variants[0]['sku'] );
		$product->set_regular_price( $variants[0]['mrp'] );
		$product->set_sale_price( $variants[0]['price'] );
	}
	$product_id = $product->save();
	$product_ids[ $c['slug'] ] = $product_id;

	if ( count( $variants ) > 1 ) {
		foreach ( $variants as $v ) {
			$variation = new WC_Product_Variation();
			$variation->set_parent_id( $product_id );
			$variation->set_attributes( array( sanitize_title( $c['attr'] ) => $v['label'] ) );
			$variation->set_sku( $v['sku'] );
			$variation->set_regular_price( $v['mrp'] );
			$variation->set_sale_price( $v['price'] );
			$variation->set_image_id( $real_image( $v['image'], $c['name'] . ' ' . $v['label'] ) );
			$variation->set_stock_status( 'instock' );
			$variation->save();
		}
		WC_Product_Variable::sync( $product_id );
	}
}

$category_thumb = array(
	'Oils & Ghee'       => 'wood-pressed-coconut-oil-group-1.jpg',
	'Atta, Rice & Dals' => 'chana-dal-1-kg.jpg',
	'Healthy Snacks'    => 'jowar-puffs-group-1.jpg',
	'Makhana'           => 'roasted-makhana-cream-onion.jpg',
	'Millets'           => 'raagi-atta-1-kg.jpg',
);
foreach ( $category_thumb as $name => $file ) {
	update_term_meta( $ids[ $name ], 'thumbnail_id', $real_image( $file, $name ) );
}

// ---------------------------------------------------------------------------
// Blog posts.
// ---------------------------------------------------------------------------
$posts = array(
	array(
		'Wood-Pressed Oil: What Makes It Different?',
		'wood-pressed-coconut-oil-group-1.jpg',
		'<p>Wood pressing (the traditional <em>kolhu</em> or <em>ghani</em>) crushes seeds slowly at low temperature. Because the oil is not heated or chemically refined, it keeps its natural aroma, colour and taste.</p><p>Verda coconut, groundnut and sesame oils are wood pressed, lab tested at an NABL-certified lab and contain no added edible oils or preservatives.</p>',
	),
	array(
		'Yellow or Black Mustard Oil — Which Should You Use?',
		'cold-pressed-black-mustard-oil-group-1.jpg',
		'<p>Both are cold pressed from mustard seeds. <strong>Black mustard oil</strong> has the strong, pungent kachi ghani flavour loved in North Indian and Bengali cooking — perfect for pickles, sarson ka saag and fish. <strong>Yellow mustard oil</strong> is milder and works well for everyday cooking.</p><p>Verda mustard oils come in 1 L, 2 L and 5 L packs.</p>',
	),
	array(
		'Why Stone-Cleaned Pulses Matter',
		'chana-dal-1-kg.jpg',
		'<p>Stone cleaning removes grit, husk and small stones that ordinary sorting can miss — so your dal is cleaner before it ever reaches your kitchen.</p><p>Verda dals, rajma and chana are stone cleaned and freshly packed in 1 kg packs. Store them in a cool, dry place and always use a dry spoon.</p>',
	),
	array(
		'Millet Puffs: A Smarter Tea-Time Snack',
		'jowar-puffs-group-1.jpg',
		'<p>Jowar and bajra are traditional Indian millets, naturally rich in fibre. Verda Jowar Puffs and Bajra Puffs are roasted snacks that come in four flavours: Cream Onion, Peri Peri, Tandoori and Magic Masala.</p>',
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
	set_post_thumbnail( $post_id, $real_image( $p[1], $p[0] ) );
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
	'About Us'             => "<h2>Nature. Purity. Life.</h2><p>Verda is a brand of {$company}, built on a simple belief: everyday food should be pure, natural and good for you.</p><p>We bring you wood-pressed and cold-pressed oils, bilona desi cow ghee, stone-cleaned pulses, millet atta and roasted millet snacks — sourced with care and packed hygienically.</p><h3>What we stand for</h3><ul><li><strong>Purity</strong> — oils lab tested at an NABL-certified lab, with no added oils or preservatives.</li><li><strong>Nature</strong> — traditional grains and time-tested methods like cold pressing and bilona churning.</li><li><strong>Life</strong> — food that fuels healthy families and supports Indian farmers.</li></ul><p>We deliver all over India.</p>",
	'Contact Us'           => "<p>We'd love to hear from you — for orders, bulk and corporate gifting, or partnerships.</p><p><strong>{$company}</strong><br>{$address}</p><p><strong>Phone:</strong> {$phones}<br><strong>Email:</strong> <a href=\"mailto:{$email}\">{$email}</a></p><p><strong>Hours:</strong> Monday to Saturday, 10:00 am – 7:00 pm</p><!-- wp:html --><iframe title=\"Verda on the map\" src=\"https://www.google.com/maps?q=Niti+Khand+1+Indirapuram+Ghaziabad&output=embed\" width=\"100%\" height=\"360\" style=\"border:0;border-radius:12px\" loading=\"lazy\"></iframe><!-- /wp:html -->",
	'FAQ'                  => '<h3>Where do you deliver?</h3><p>We deliver across India.</p><h3>How long does delivery take?</h3><p>Orders are dispatched within 1–2 working days. Delivery usually takes 3–7 working days depending on your location.</p><h3>What payment methods do you accept?</h3><p>UPI, credit and debit cards, net banking and Cash on Delivery (on eligible pincodes).</p><h3>What is the difference between wood-pressed and cold-pressed oil?</h3><p>Both are pressed without high heat or chemical refining, so the oil keeps its natural aroma and nutrients. Our coconut, groundnut and sesame oils are wood pressed; our mustard oils are cold pressed.</p><h3>Do you supply in bulk?</h3><p>Yes. Email ' . $email . ' with the products and quantities you need.</p><h3>Are your oils lab tested?</h3><p>Yes — at an NABL-certified lab. They contain no added edible oils and no preservatives.</p>',
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
wp_update_nav_menu_item( $main, 0, verda_cat_item( $ids['Oils & Ghee'] ) + array( 'menu-item-title' => 'Oils & Ghee', 'menu-item-status' => 'publish' ) );
foreach ( array( 'About Us', 'Contact Us' ) as $title ) {
	wp_update_nav_menu_item( $main, 0, verda_page_item( $page_ids[ $title ] ) + array( 'menu-item-status' => 'publish' ) );
}
wp_update_nav_menu_item( $main, 0, verda_page_item( $blog ) + array( 'menu-item-status' => 'publish' ) );

$quick = verda_menu( 'Shop', array_map( function ( $n ) use ( $ids ) { return verda_cat_item( $ids[ $n ] ); }, $category_names ) );
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
	'hero_banner_url'    => wc_get_page_permalink( 'shop' ),
	'hero_banner_alt'    => 'Verda – pure oils, ghee, pulses and millet snacks',
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
	'hero_b3_title'      => '',
	'hero_b3_text'       => 'Verda Pure Desi Ghee – traditional bilona process',
	'hero_b3_image'      => $banner( 'banner-ghee.jpg' ),
	'hero_b3_url'        => get_permalink( $product_ids['desi-cow-ghee-bilona-danedar'] ),

	'cats_include'       => 'oils-ghee,atta-rice-dals,healthy-snacks,makhana,millets',

	'promo_tagline'      => 'Millet Power',
	'promo_title'        => "Wholesome Millets\nFor Your Family",
	'promo_text'         => 'Jowar, bajra and ragi — the ancient grains for a healthier everyday diet.',
	'promo_image'        => $banner( 'banner-millets.jpg' ),
	'promo_btn_url'      => get_term_link( $ids['Oils & Ghee'] ),
	'promo_banner'       => $banner( 'promo-oils-pure.jpg' ),
	'promo_banner_alt'   => 'Verda cold pressed oils – 100% pure, no adulteration',

	'dual1_tagline'      => 'Healthy Snacks',
	'dual1_title'        => 'Jowar & Bajra Puffs',
	'dual1_text'         => 'Roasted millet snacks · 4 flavours',
	'dual1_image'        => $banner( 'banner-real-puffs.jpg' ),
	'dual1_url'          => get_term_link( $ids['Healthy Snacks'] ),
	'dual2_tagline'      => 'Kitchen Staples',
	'dual2_title'        => 'Stone-Cleaned Pulses',
	'dual2_text'         => 'Dals, rajma, chana & besan',
	'dual2_image'        => $banner( 'banner-real-dals.jpg' ),
	'dual2_url'          => get_term_link( $ids['Atta, Rice & Dals'] ),

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
