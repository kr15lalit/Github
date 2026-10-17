<?php
/**
 * Home: two side-by-side banners.
 *
 * @package FreshCart
 */

?>
<section class="fc-section">
	<div class="fc-container fc-dual">
		<?php foreach ( array( 1, 2 ) as $freshcart_i ) : ?>
			<?php
			$freshcart_key = 'dual' . $freshcart_i . '_';
			if ( ! freshcart_mod( $freshcart_key . 'title' ) ) {
				continue;
			}
			?>
			<a class="fc-banner fc-dual-banner fc-dual-banner-<?php echo esc_attr( $freshcart_i ); ?>" href="<?php echo esc_url( freshcart_link( freshcart_mod( $freshcart_key . 'url' ) ) ); ?>"<?php echo freshcart_bg( freshcart_mod( $freshcart_key . 'image' ) ); // phpcs:ignore ?>>
				<span class="fc-banner-body">
					<?php if ( freshcart_mod( $freshcart_key . 'tagline' ) ) : ?>
						<span class="fc-tagline"><?php echo esc_html( freshcart_mod( $freshcart_key . 'tagline' ) ); ?></span>
					<?php endif; ?>
					<span class="fc-banner-title"><?php echo esc_html( freshcart_mod( $freshcart_key . 'title' ) ); ?></span>
					<?php if ( freshcart_mod( $freshcart_key . 'text' ) ) : ?>
						<span class="fc-banner-text"><?php echo esc_html( freshcart_mod( $freshcart_key . 'text' ) ); ?></span>
					<?php endif; ?>
					<span class="fc-btn fc-btn-sm"><?php esc_html_e( 'Shop Now', 'freshcart' ); ?></span>
				</span>
			</a>
		<?php endforeach; ?>
	</div>
</section>
