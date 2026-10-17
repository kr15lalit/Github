<?php
/**
 * Home: wide promo banner.
 *
 * @package FreshCart
 */

?>
<section class="fc-section">
	<div class="fc-container">
		<div class="fc-promo">
			<div class="fc-promo-content">
				<?php if ( freshcart_mod( 'promo_tagline' ) ) : ?>
					<span class="fc-tagline"><?php echo esc_html( freshcart_mod( 'promo_tagline' ) ); ?></span>
				<?php endif; ?>
				<h2 class="fc-promo-title"><?php echo freshcart_multiline( freshcart_mod( 'promo_title' ) ); // phpcs:ignore ?></h2>
				<?php if ( freshcart_mod( 'promo_text' ) ) : ?>
					<p><?php echo esc_html( freshcart_mod( 'promo_text' ) ); ?></p>
				<?php endif; ?>
				<?php if ( freshcart_mod( 'promo_btn_text' ) ) : ?>
					<a class="fc-btn fc-btn-light" href="<?php echo esc_url( freshcart_link( freshcart_mod( 'promo_btn_url' ) ) ); ?>"><?php echo esc_html( freshcart_mod( 'promo_btn_text' ) ); ?> <?php echo freshcart_icon( 'arrow-r' ); // phpcs:ignore ?></a>
				<?php endif; ?>
			</div>
			<?php if ( freshcart_mod( 'promo_image' ) ) : ?>
				<div class="fc-promo-media"><img src="<?php echo esc_url( freshcart_mod( 'promo_image' ) ); ?>" alt="" loading="lazy"></div>
			<?php endif; ?>
		</div>
	</div>
</section>
