<?php
/**
 * Search form.
 *
 * @package FreshCart
 */

$freshcart_id = wp_unique_id( 'search-' );
?>
<form role="search" method="get" class="fc-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
	<label class="screen-reader-text" for="<?php echo esc_attr( $freshcart_id ); ?>"><?php esc_html_e( 'Search for:', 'freshcart' ); ?></label>
	<input type="search" id="<?php echo esc_attr( $freshcart_id ); ?>" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" placeholder="<?php esc_attr_e( 'Search…', 'freshcart' ); ?>">
	<button type="submit" aria-label="<?php esc_attr_e( 'Search', 'freshcart' ); ?>"><?php echo freshcart_icon( 'search' ); // phpcs:ignore ?></button>
</form>
