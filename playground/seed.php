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
	'Vegetables'     => array( 90, 170, 70 ),
	'Fresh Fruits'   => array( 240, 120, 60 ),
	'Desserts'       => array( 230, 170, 200 ),
	'Drinks & Juice' => array( 250, 190, 60 ),
	'Fish & Meats'   => array( 220, 90, 90 ),
	'Pets & Animals' => array( 170, 130, 90 ),
	'Beverage'       => array( 120, 90, 60 ),
	'Toys'           => array( 80, 140, 230 ),
);
$ids = array();
foreach ( $cats as $name => $rgb ) {
	$term          = wp_insert_term( $name, 'product_cat' );
	$ids[ $name ] = $term['term_id'];
	update_term_meta( $term['term_id'], 'thumbnail_id', fc_demo_img( $name . ' category', $rgb ) );
}

$products = array(
	array( 'Russet Idaho Potatoes Fresh Premium, 4 lb case', 'Vegetables', 12, 9.5 ),
	array( 'Organic Giant Papaya', 'Fresh Fruits', 8, 6 ),
	array( 'Organic Trimmed Green Beans, 12 oz', 'Vegetables', 4.5, null ),
	array( 'Romaine Hearts Salad Bag Organic', 'Vegetables', 5, 3.99 ),
	array( 'Hawaiian Fruit Juicy Red Drink, 1 Gallon', 'Drinks & Juice', 7, 5.25 ),
	array( 'Diet Root Beer, 12 Cans Pack', 'Beverage', 9, null ),
	array( 'Greek Probiotic Plain Yogurt, 32 oz', 'Desserts', 6.5, 4.99 ),
	array( 'Baby Learning Puppy Music Toy', 'Toys', 25, 19 ),
	array( 'Remote Control Toy Car for Kids', 'Toys', 39, null ),
	array( 'Wild Caught Pacific Whiting Fillets', 'Fish & Meats', 15, 12 ),
	array( 'Dry Cat Food for Adult Cats', 'Pets & Animals', 18, 14.5 ),
	array( 'Garden Fresh Mango, 100% Premium', 'Fresh Fruits', 3, 2.25 ),
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
	$product->set_description( 'Fresh, healthy and delivered to your door.' );
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
foreach ( array( 'Vegetables', 'Fresh Fruits', 'Beverage', 'Toys' ) as $name ) {
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

flush_rewrite_rules();
