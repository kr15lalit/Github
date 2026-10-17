<?php
/**
 * Homepage. Sections are switched on/off and edited in
 * Appearance → Customize → FreshCart Theme Options.
 *
 * Anything you write in the page set as "Homepage" (Settings → Reading)
 * is shown after the Popular Categories section, so you can also add
 * blocks with the editor.
 *
 * @package FreshCart
 */

get_header();

$freshcart_wc = class_exists( 'WooCommerce' );

if ( freshcart_mod( 'hero_enable' ) ) {
	get_template_part( 'template-parts/home/hero' );
}
if ( $freshcart_wc && freshcart_mod( 'cats_enable' ) ) {
	get_template_part( 'template-parts/home/categories' );
}

if ( 'page' === get_option( 'show_on_front' ) ) {
	while ( have_posts() ) {
		the_post();
		if ( '' !== trim( get_the_content() ) ) {
			echo '<section class="fc-section"><div class="fc-container entry-content">';
			the_content();
			echo '</div></section>';
		}
	}
}

if ( $freshcart_wc && freshcart_mod( 'sale_enable' ) ) {
	get_template_part( 'template-parts/home/products', null, array( 'type' => 'sale' ) );
}
if ( freshcart_mod( 'promo_enable' ) ) {
	get_template_part( 'template-parts/home/promo' );
}
if ( $freshcart_wc && freshcart_mod( 'trend_enable' ) ) {
	get_template_part( 'template-parts/home/products', null, array( 'type' => 'trend' ) );
}
if ( $freshcart_wc && freshcart_mod( 'deal_enable' ) ) {
	get_template_part( 'template-parts/home/deal' );
}
if ( freshcart_mod( 'dual_enable' ) ) {
	get_template_part( 'template-parts/home/dual-banners' );
}
if ( freshcart_mod( 'blog_enable' ) ) {
	get_template_part( 'template-parts/home/blog' );
}
if ( freshcart_mod( 'features_enable' ) ) {
	get_template_part( 'template-parts/home/features' );
}

get_footer();
