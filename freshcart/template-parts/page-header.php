<?php
/**
 * Page title banner with breadcrumb.
 *
 * @package FreshCart
 */

$freshcart_title = isset( $args['title'] ) ? $args['title'] : get_the_title();
?>
<div class="fc-page-header">
	<div class="fc-container">
		<h1 class="fc-page-title"><?php echo wp_kses_post( $freshcart_title ); ?></h1>
		<nav class="fc-breadcrumb" aria-label="<?php esc_attr_e( 'Breadcrumb', 'freshcart' ); ?>">
			<?php
			if ( function_exists( 'woocommerce_breadcrumb' ) ) {
				woocommerce_breadcrumb(
					array(
						'delimiter'   => ' / ',
						'wrap_before' => '',
						'wrap_after'  => '',
					)
				);
			} else {
				echo '<a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'freshcart' ) . '</a> / ' . wp_kses_post( $freshcart_title );
			}
			?>
		</nav>
	</div>
</div>
