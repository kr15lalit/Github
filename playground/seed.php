<?php
/**
 * Sample data for the WordPress Playground preview (not part of the theme).
 */
require '/wordpress/wp-load.php';
require_once ABSPATH . 'wp-admin/includes/image.php';

function fc_demo_img( $name, $rgb ) {
	if ( ! function_exists( 'imagecreatetruecolor' ) ) {
		return 0;
	}
	$im = imagecreatetruecolor( 600, 600 );
	imagefill( $im, 0, 0, imagecolorallocate( $im, 247, 247, 247 ) );
	imagefilledellipse( $im, 300, 320, 380, 380, imagecolorallocate( $im, $rgb[0], $rgb[1], $rgb[2] ) );
	imagefilledellipse( $im, 330, 120, 80, 140, imagecolorallocate( $im, 60, 150, 80 ) );
	$file = wp_upload_dir()['path'] . '/' . sanitize_title( $name ) . '.png';
	imagepng( $im, $file );
	$id = wp_insert_attachment( array( 'post_mime_type' => 'image/png', 'post_title' => $name, 'post_status' => 'inherit' ), $file );
	wp_update_attachment_metadata( $id, wp_generate_attachment_metadata( $id, $file ) );
	return $id;
}

$cats = array(
	'Healthy Snacks'      => array( 214, 160, 60 ),
	'Makhana'             => array( 238, 228, 205 ),
	'Dry Fruits & Nuts'   => array( 170, 110, 60 ),
	'Diwali Gift Hampers' => array( 200, 60, 60 ),
	'Atta, Rice & Dals'   => array( 230, 200, 120 ),
	'Oils & Ghee'         => array( 240, 190, 40 ),
	'Millets'             => array( 190, 150, 90 ),
);
$ids = array();
foreach ( $cats as $name => $rgb ) {
	$term          = wp_insert_term( $name, 'product_cat' );
	$ids[ $name ] = $term['term_id'];
	update_term_meta( $term['term_id'], 'thumbnail_id', fc_demo_img( $name . ' category', $rgb ) );
}

// Placeholder products and prices: replaced by the real catalogue in step 4.
$products = array(
	array( 'Jowar Puffs – Classic Salted, 100 g', 'Healthy Snacks', 99, 85 ),
	array( 'Bajra Puffs – Masala, 100 g', 'Healthy Snacks', 99, 85 ),
	array( 'Roasted Makhana – Peri Peri, 80 g', 'Makhana', 149, 129 ),
	array( 'Premium Makhana – Plain, 250 g', 'Makhana', 399, 349 ),
	array( 'California Almonds, 500 g', 'Dry Fruits & Nuts', 649, 579 ),
	array( 'Whole Cashews W240, 500 g', 'Dry Fruits & Nuts', 699, null ),
	array( 'Diwali Delight Gift Hamper', 'Diwali Gift Hampers', 1499, 1299 ),
	array( 'Royal Dry Fruit Gift Box', 'Diwali Gift Hampers', 2499, 2199 ),
	array( 'Chakki Fresh Whole Wheat Atta, 5 kg', 'Atta, Rice & Dals', 299, 269 ),
	array( 'Unpolished Toor Dal, 1 kg', 'Atta, Rice & Dals', 189, null ),
	array( 'Cold Pressed Mustard Oil, 1 L', 'Oils & Ghee', 249, 225 ),
	array( 'Ragi (Finger Millet) Flour, 1 kg', 'Millets', 129, 115 ),
);
foreach ( $products as $i => $p ) {
	$product = new WC_Product_Simple();
	$product->set_name( $p[0] );
	$product->set_regular_price( $p[2] );
	if ( $p[3] ) {
		$product->set_sale_price( $p[3] );
	}
	$product->set_category_ids( array( $ids[ $p[1] ] ) );
	$product->set_image_id( fc_demo_img( $p[0], $cats[ $p[1] ] ) );
	$product->set_total_sales( 100 - $i * 7 );
	$product->set_description( 'Placeholder description — the real product details come in step 4.' );
	$product->save();
}

$titles = array( 'Experience The Essence Of Traditional Cuisine', 'Discover The Secrets Of House-made Pasta', 'Dive Into The Bold Flavors Of Grilled Meats', 'Satisfy Your Sweet Tooth With Desserts' );
foreach ( $titles as $i => $title ) {
	$post_id = wp_insert_post( array( 'post_title' => $title, 'post_content' => '<!-- wp:paragraph --><p>Sample blog post. Edit or delete it under Posts.</p><!-- /wp:paragraph -->', 'post_status' => 'publish' ) );
	set_post_thumbnail( $post_id, fc_demo_img( 'blog ' . $i, array( 130 + $i * 30, 180, 120 ) ) );
}

// Static homepage.
$home = wp_insert_post( array( 'post_title' => 'Home', 'post_type' => 'page', 'post_status' => 'publish' ) );
update_option( 'show_on_front', 'page' );
update_option( 'page_on_front', $home );

// Menus.
$main = wp_create_nav_menu( 'Main Menu' );
foreach ( array( 'Home' => home_url( '/' ), 'Shop' => wc_get_page_permalink( 'shop' ), 'Cart' => wc_get_cart_url(), 'My Account' => wc_get_page_permalink( 'myaccount' ) ) as $title => $url ) {
	wp_update_nav_menu_item( $main, 0, array( 'menu-item-title' => $title, 'menu-item-url' => $url, 'menu-item-status' => 'publish' ) );
}
$quick = wp_create_nav_menu( 'Quick Links' );
foreach ( array( 'Healthy Snacks', 'Makhana', 'Dry Fruits & Nuts', 'Diwali Gift Hampers' ) as $name ) {
	wp_update_nav_menu_item( $quick, 0, array( 'menu-item-title' => $name, 'menu-item-object' => 'product_cat', 'menu-item-object-id' => $ids[ $name ], 'menu-item-type' => 'taxonomy', 'menu-item-status' => 'publish' ) );
}
$accounts = wp_create_nav_menu( 'Accounts' );
foreach ( array( 'Cart' => wc_get_cart_url(), 'Checkout' => wc_get_checkout_url(), 'My Account' => wc_get_page_permalink( 'myaccount' ) ) as $title => $url ) {
	wp_update_nav_menu_item( $accounts, 0, array( 'menu-item-title' => $title, 'menu-item-url' => $url, 'menu-item-status' => 'publish' ) );
}
set_theme_mod( 'nav_menu_locations', array( 'primary' => $main, 'footer-1' => $quick, 'footer-2' => $accounts ) );

$hero = fc_demo_img( 'hero', array( 240, 140, 60 ) );
if ( $hero ) {
	set_theme_mod( 'freshcart_hero_image', wp_get_attachment_url( $hero ) );
}

// Verda branding (see verda/store-details.md).
update_option( 'blogname', 'Verda' );
update_option( 'blogdescription', 'Nature. Purity. Life' );
update_option( 'woocommerce_currency', 'INR' );
update_option( 'woocommerce_default_country', 'IN:UP' );
update_option( 'woocommerce_store_address', '561, Niti Khand-1, Indirapuram' );
update_option( 'woocommerce_store_city', 'Ghaziabad' );
update_option( 'woocommerce_store_postcode', '201014' );

$logo_file = '/wordpress/verda-logo.png';
if ( file_exists( $logo_file ) ) {
	$upload = wp_upload_bits( 'verda-logo.png', null, file_get_contents( $logo_file ) );
	$logo   = wp_insert_attachment( array( 'post_mime_type' => 'image/png', 'post_title' => 'Verda logo', 'post_status' => 'inherit' ), $upload['file'] );
	wp_update_attachment_metadata( $logo, wp_generate_attachment_metadata( $logo, $upload['file'] ) );
	set_theme_mod( 'custom_logo', $logo );
	unlink( $logo_file );
}

$verda = array(
	'color_primary'    => '#1f5f23',
	'color_secondary'  => '#0f3d12',
	'color_dark'       => '#13261a',
	'color_accent'     => '#9c6b12',
	'color_highlight'  => '#9c6b12',
	'topbar_address'   => '561, Niti Khand-1, Indirapuram, Ghaziabad – 201014',
	'topbar_email'     => 'office@verdaessentials.com',
	'topbar_text'      => 'Delivering all over India',
	'header_phone_label' => 'Call Us',
	'header_phone'     => '+91-9266604099',
	'footer_about'     => 'Verda brings you pure, natural and healthy foods — from wholesome staples to millet puffs, makhana, dry fruits and festive gift hampers.',
	'footer_address'   => '561, Niti Khand-1, Indirapuram, Ghaziabad – 201014, Uttar Pradesh',
	'footer_phone'     => '+91-9266604099 | +91-7701830278',
	'footer_email'     => 'office@verdaessentials.com',
	'feat1_text'       => 'Delivery all over India',
	'social_facebook'  => 'https://www.facebook.com/',
	'social_instagram' => 'https://www.instagram.com/',
	'social_youtube'   => 'https://www.youtube.com/',
	'copyright'        => '© {year} Verda Essentials Pvt Ltd. All Rights Reserved.',
	'hero_tagline'     => '100% Natural',
	'hero_title'       => "Pure, Healthy &\nNatural Goodness",
	'hero_text'        => 'Millet puffs, makhana, dry fruits and everyday staples — delivered all over India.',
	'hero_price'       => '',
	'hero_b1_title'    => "Diwali Gift\nHampers",
	'hero_b1_text'     => 'Festive & corporate gifting',
	'hero_b1_url'      => get_term_link( $ids['Diwali Gift Hampers'] ),
	'hero_b2_title'    => 'Roasted Makhana',
	'hero_b2_text'     => 'Guilt-free snacking',
	'hero_b2_url'      => get_term_link( $ids['Makhana'] ),
	'hero_b3_title'    => 'Dry Fruits & Nuts',
	'hero_b3_text'     => 'Premium quality',
	'hero_b3_url'      => get_term_link( $ids['Dry Fruits & Nuts'] ),
	'promo_tagline'    => 'Millet Power',
	'promo_title'      => "Wholesome Millets\nFor Your Family",
	'promo_text'       => 'Jowar, bajra and ragi — the ancient grains for a healthier everyday diet.',
	'promo_btn_url'    => get_term_link( $ids['Millets'] ),
	'dual1_tagline'    => 'Healthy Snacks',
	'dual1_title'      => 'Jowar & Bajra Puffs',
	'dual1_text'       => 'Light, crunchy and made from millets',
	'dual1_url'        => get_term_link( $ids['Healthy Snacks'] ),
	'dual2_tagline'    => 'Festive Gifting',
	'dual2_title'      => 'Corporate Hampers',
	'dual2_text'       => 'Custom gift boxes for Diwali',
	'dual2_url'        => get_term_link( $ids['Diwali Gift Hampers'] ),
	'feat2_text'       => 'Best prices, direct from us',
);
foreach ( $verda as $key => $value ) {
	set_theme_mod( 'freshcart_' . $key, $value );
}

flush_rewrite_rules();
