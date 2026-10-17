<?php
/**
 * Footer.
 *
 * @package FreshCart
 */

$freshcart_columns = array(
	'footer-1' => __( 'Quick Links', 'freshcart' ),
	'footer-2' => __( 'Accounts', 'freshcart' ),
	'footer-3' => __( 'Privacy Policy', 'freshcart' ),
);
$freshcart_locations = get_nav_menu_locations();
?>
</main>

<footer class="fc-footer">
	<div class="fc-container fc-footer-grid">
		<div class="fc-footer-col fc-footer-about">
			<div class="fc-logo">
				<?php if ( has_custom_logo() ) : ?>
					<?php the_custom_logo(); ?>
				<?php else : ?>
					<a class="fc-site-title" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php bloginfo( 'name' ); ?></a>
				<?php endif; ?>
			</div>
			<?php if ( freshcart_mod( 'footer_about' ) ) : ?>
				<p><?php echo esc_html( freshcart_mod( 'footer_about' ) ); ?></p>
			<?php endif; ?>
			<ul class="fc-contact-list">
				<?php if ( freshcart_mod( 'footer_address' ) ) : ?>
					<li><?php echo freshcart_icon( 'pin' ); // phpcs:ignore ?> <?php echo esc_html( freshcart_mod( 'footer_address' ) ); ?></li>
				<?php endif; ?>
				<?php if ( freshcart_mod( 'footer_phone' ) ) : ?>
					<li><?php echo freshcart_icon( 'phone' ); // phpcs:ignore ?> <a href="tel:<?php echo esc_attr( preg_replace( '/[^0-9+]/', '', freshcart_mod( 'footer_phone' ) ) ); ?>"><?php echo esc_html( freshcart_mod( 'footer_phone' ) ); ?></a></li>
				<?php endif; ?>
				<?php if ( freshcart_mod( 'footer_email' ) ) : ?>
					<li><?php echo freshcart_icon( 'mail' ); // phpcs:ignore ?> <a href="mailto:<?php echo esc_attr( antispambot( freshcart_mod( 'footer_email' ) ) ); ?>"><?php echo esc_html( antispambot( freshcart_mod( 'footer_email' ) ) ); ?></a></li>
				<?php endif; ?>
			</ul>
		</div>

		<?php foreach ( $freshcart_columns as $freshcart_location => $freshcart_fallback_title ) : ?>
			<?php
			if ( empty( $freshcart_locations[ $freshcart_location ] ) ) {
				continue;
			}
			$freshcart_menu = wp_get_nav_menu_object( $freshcart_locations[ $freshcart_location ] );
			?>
			<div class="fc-footer-col">
				<h3 class="fc-footer-title"><?php echo esc_html( $freshcart_menu ? $freshcart_menu->name : $freshcart_fallback_title ); ?></h3>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => $freshcart_location,
						'menu_class'     => 'fc-footer-menu',
						'container'      => false,
						'depth'          => 1,
					)
				);
				?>
			</div>
		<?php endforeach; ?>

		<div class="fc-footer-col fc-footer-news">
			<?php if ( freshcart_mod( 'news_title' ) ) : ?>
				<h3 class="fc-footer-title"><?php echo esc_html( freshcart_mod( 'news_title' ) ); ?></h3>
			<?php endif; ?>
			<?php if ( freshcart_mod( 'news_text' ) ) : ?>
				<p><?php echo esc_html( freshcart_mod( 'news_text' ) ); ?></p>
			<?php endif; ?>
			<?php if ( freshcart_mod( 'news_shortcode' ) ) : ?>
				<div class="fc-news-form"><?php echo do_shortcode( freshcart_mod( 'news_shortcode' ) ); ?></div>
			<?php elseif ( current_user_can( 'edit_theme_options' ) ) : ?>
				<p class="fc-empty"><?php esc_html_e( 'Add a newsletter form shortcode in Customize → FreshCart Theme Options → Footer.', 'freshcart' ); ?></p>
			<?php endif; ?>

			<?php if ( freshcart_mod( 'app_ios_url' ) || freshcart_mod( 'app_android_url' ) ) : ?>
				<h4 class="fc-app-title"><?php echo esc_html( freshcart_mod( 'app_title' ) ); ?></h4>
				<p class="fc-app-text"><?php echo esc_html( freshcart_mod( 'app_text' ) ); ?></p>
				<div class="fc-app-links">
					<?php if ( freshcart_mod( 'app_ios_url' ) ) : ?>
						<a href="<?php echo esc_url( freshcart_mod( 'app_ios_url' ) ); ?>"><?php echo freshcart_icon( 'apple' ); // phpcs:ignore ?> <span><small><?php esc_html_e( 'Download on the', 'freshcart' ); ?></small> App Store</span></a>
					<?php endif; ?>
					<?php if ( freshcart_mod( 'app_android_url' ) ) : ?>
						<a href="<?php echo esc_url( freshcart_mod( 'app_android_url' ) ); ?>"><?php echo freshcart_icon( 'play' ); // phpcs:ignore ?> <span><small><?php esc_html_e( 'Get it on', 'freshcart' ); ?></small> Google Play</span></a>
					<?php endif; ?>
				</div>
			<?php endif; ?>
		</div>
	</div>

	<div class="fc-footer-bottom">
		<div class="fc-container fc-footer-bottom-inner">
			<p class="fc-copyright">
				<?php echo esc_html( str_replace( array( '{year}', '{site}' ), array( gmdate( 'Y' ), get_bloginfo( 'name' ) ), freshcart_mod( 'copyright' ) ) ); ?>
			</p>
			<ul class="fc-social">
				<?php foreach ( array( 'facebook', 'instagram', 'x', 'youtube' ) as $freshcart_network ) : ?>
					<?php if ( freshcart_mod( 'social_' . $freshcart_network ) ) : ?>
						<li><a href="<?php echo esc_url( freshcart_mod( 'social_' . $freshcart_network ) ); ?>" aria-label="<?php echo esc_attr( ucfirst( $freshcart_network ) ); ?>" target="_blank" rel="noopener"><?php echo freshcart_icon( $freshcart_network ); // phpcs:ignore ?></a></li>
					<?php endif; ?>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
