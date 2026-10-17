<?php
/**
 * Home: hero with main banner and three side banners.
 *
 * @package FreshCart
 */

?>
<section class="fc-hero">
	<div class="fc-container fc-hero-grid">
		<div class="fc-hero-main">
			<div class="fc-hero-content">
				<?php if ( freshcart_mod( 'hero_tagline' ) ) : ?>
					<span class="fc-tagline"><?php echo esc_html( freshcart_mod( 'hero_tagline' ) ); ?></span>
				<?php endif; ?>
				<h1 class="fc-hero-title"><?php echo freshcart_multiline( freshcart_mod( 'hero_title' ) ); // phpcs:ignore ?></h1>
				<?php if ( freshcart_mod( 'hero_text' ) ) : ?>
					<p class="fc-hero-text"><?php echo esc_html( freshcart_mod( 'hero_text' ) ); ?></p>
				<?php endif; ?>
				<?php if ( freshcart_mod( 'hero_btn_text' ) ) : ?>
					<a class="fc-btn" href="<?php echo esc_url( freshcart_link( freshcart_mod( 'hero_btn_url' ) ) ); ?>"><?php echo esc_html( freshcart_mod( 'hero_btn_text' ) ); ?> <?php echo freshcart_icon( 'arrow-r' ); // phpcs:ignore ?></a>
				<?php endif; ?>
			</div>
			<div class="fc-hero-media">
				<?php if ( freshcart_mod( 'hero_image' ) ) : ?>
					<img src="<?php echo esc_url( freshcart_mod( 'hero_image' ) ); ?>" alt="" loading="eager">
				<?php endif; ?>
				<?php if ( freshcart_mod( 'hero_price' ) ) : ?>
					<div class="fc-price-badge">
						<small><?php echo esc_html( freshcart_mod( 'hero_price_label' ) ); ?></small>
						<strong><?php echo esc_html( freshcart_mod( 'hero_price' ) ); ?></strong>
						<?php if ( freshcart_mod( 'hero_price_old' ) ) : ?>
							<del><?php echo esc_html( freshcart_mod( 'hero_price_old' ) ); ?></del>
						<?php endif; ?>
					</div>
				<?php endif; ?>
			</div>
		</div>

		<?php foreach ( array( 1, 2, 3 ) as $freshcart_i ) : ?>
			<?php
			$freshcart_key = 'hero_b' . $freshcart_i . '_';
			if ( ! freshcart_mod( $freshcart_key . 'title' ) ) {
				continue;
			}
			?>
			<a class="fc-banner fc-hero-banner fc-hero-banner-<?php echo esc_attr( $freshcart_i ); ?>" href="<?php echo esc_url( freshcart_link( freshcart_mod( $freshcart_key . 'url' ) ) ); ?>"<?php echo freshcart_bg( freshcart_mod( $freshcart_key . 'image' ) ); // phpcs:ignore ?>>
				<span class="fc-banner-body">
					<span class="fc-banner-title"><?php echo freshcart_multiline( freshcart_mod( $freshcart_key . 'title' ) ); // phpcs:ignore ?></span>
					<?php if ( freshcart_mod( $freshcart_key . 'text' ) ) : ?>
						<span class="fc-banner-text"><?php echo esc_html( freshcart_mod( $freshcart_key . 'text' ) ); ?></span>
					<?php endif; ?>
					<span class="fc-link"><?php esc_html_e( 'Shop Now', 'freshcart' ); ?> <?php echo freshcart_icon( 'arrow-r' ); // phpcs:ignore ?></span>
				</span>
			</a>
		<?php endforeach; ?>
	</div>
</section>
