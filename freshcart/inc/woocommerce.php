<?php
/**
 * WooCommerce integration. Loaded only when WooCommerce is active.
 *
 * @package FreshCart
 */

defined( 'ABSPATH' ) || exit;

// The theme wraps shop pages itself (see woocommerce.php in the theme root).
remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
remove_action( 'woocommerce_after_main_content', 'woocommerce_output_content_wrapper_end', 10 );
remove_action( 'woocommerce_sidebar', 'woocommerce_get_sidebar', 10 );

// The page title and breadcrumb are shown in the theme's page banner instead.
remove_action( 'woocommerce_before_main_content', 'woocommerce_breadcrumb', 20 );
add_filter( 'woocommerce_show_page_title', '__return_false' );

/**
 * Products per row / page.
 */
add_filter(
	'loop_shop_columns',
	function () {
		return is_active_sidebar( 'sidebar-shop' ) ? 3 : 4;
	}
);
add_filter(
	'loop_shop_per_page',
	function () {
		return 12;
	}
);
add_filter(
	'woocommerce_output_related_products_args',
	function ( $args ) {
		$args['posts_per_page'] = 4;
		$args['columns']        = 4;
		return $args;
	}
);

/**
 * Show "-25%" instead of "Sale!".
 *
 * @param string     $html    Badge HTML.
 * @param WP_Post    $post    Post.
 * @param WC_Product $product Product.
 * @return string
 */
function freshcart_sale_badge( $html, $post, $product ) {
	$percent = 0;
	if ( $product->is_type( 'variable' ) ) {
		foreach ( $product->get_children() as $child_id ) {
			$child = wc_get_product( $child_id );
			if ( $child && $child->is_on_sale() && (float) $child->get_regular_price() > 0 ) {
				$percent = max( $percent, round( 100 - ( (float) $child->get_sale_price() / (float) $child->get_regular_price() * 100 ) ) );
			}
		}
	} elseif ( (float) $product->get_regular_price() > 0 && '' !== $product->get_sale_price() ) {
		$percent = round( 100 - ( (float) $product->get_sale_price() / (float) $product->get_regular_price() * 100 ) );
	}
	if ( $percent <= 0 ) {
		return $html;
	}
	return '<span class="onsale">-' . esc_html( $percent ) . '%</span>';
}
add_filter( 'woocommerce_sale_flash', 'freshcart_sale_badge', 10, 3 );

/**
 * Show the product category above the title in product cards.
 */
function freshcart_loop_category() {
	global $product;
	$terms = get_the_terms( $product->get_id(), 'product_cat' );
	if ( $terms && ! is_wp_error( $terms ) ) {
		echo '<span class="fc-card-cat">' . esc_html( $terms[0]->name ) . '</span>';
	}
}
add_action( 'woocommerce_shop_loop_item_title', 'freshcart_loop_category', 5 );

/**
 * Keep the header cart count up to date after AJAX add-to-cart.
 *
 * @param array $fragments Fragments.
 * @return array
 */
function freshcart_cart_fragment( $fragments ) {
	$fragments['span.fc-cart-count'] = '<span class="fc-cart-count">' . esc_html( WC()->cart->get_cart_contents_count() ) . '</span>';
	$fragments['span.fc-cart-total'] = '<span class="fc-cart-total">' . wp_kses_post( WC()->cart->get_cart_subtotal() ) . '</span>';
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'freshcart_cart_fragment' );

/**
 * Render a horizontal product carousel.
 *
 * @param array $query_args WC_Product_Query-style args for wc_get_products().
 */
function freshcart_product_carousel( $query_args ) {
	$query_args = wp_parse_args(
		$query_args,
		array(
			'status'     => 'publish',
			'visibility' => 'catalog',
			'return'     => 'ids',
		)
	);
	$ids = wc_get_products( $query_args );

	if ( empty( $ids ) ) {
		if ( current_user_can( 'edit_products' ) ) {
			echo '<p class="fc-empty">' . esc_html__( 'No products match this section yet. Add products (or put some on sale) in WooCommerce → Products.', 'freshcart' ) . '</p>';
		}
		return;
	}

	global $post;
	echo '<div class="fc-carousel"><ul class="products fc-carousel-track">';
	foreach ( $ids as $id ) {
		$post = get_post( $id ); // phpcs:ignore WordPress.WP.GlobalVariablesOverride
		setup_postdata( $post );
		wc_get_template_part( 'content', 'product' );
	}
	echo '</ul></div>';
	wp_reset_postdata();
}

/**
 * IDs of products on sale, for an 'include' query arg.
 * Contains variation IDs too; wc_get_products() ignores those by type.
 * Returns array( 0 ) when nothing is on sale so the query matches nothing.
 *
 * @return int[]
 */
function freshcart_sale_ids() {
	$ids = array_map( 'absint', wc_get_product_ids_on_sale() );
	return $ids ? $ids : array( 0 );
}
