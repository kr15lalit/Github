<?php
/**
 * Home: product carousel (discounted or trending products).
 *
 * @package FreshCart
 */

$freshcart_type = isset( $args['type'] ) ? $args['type'] : 'sale';

if ( 'trend' === $freshcart_type ) {
	$freshcart_title = freshcart_mod( 'trend_title' );
	$freshcart_query = array(
		'limit'    => absint( freshcart_mod( 'trend_number' ) ),
		'orderby'  => 'popularity',
		'order'    => 'DESC',
	);
} else {
	$freshcart_title = freshcart_mod( 'sale_title' );
	$freshcart_query = array(
		'limit'   => absint( freshcart_mod( 'sale_number' ) ),
		'include' => freshcart_sale_ids(),
		'orderby' => 'date',
		'order'   => 'DESC',
	);
}
?>
<section class="fc-section fc-products fc-products-<?php echo esc_attr( $freshcart_type ); ?>">
	<div class="fc-container">
		<?php freshcart_section_head( $freshcart_title, array( 'arrows' => true ) ); ?>
		<?php freshcart_product_carousel( $freshcart_query ); ?>
	</div>
</section>
