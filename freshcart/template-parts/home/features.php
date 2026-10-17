<?php
/**
 * Home: features bar (shipping, returns, support…).
 *
 * @package FreshCart
 */

$freshcart_icons = array( 1 => 'truck', 2 => 'wallet', 3 => 'refresh', 4 => 'tag', 5 => 'headset' );
?>
<section class="fc-section fc-features-wrap">
	<div class="fc-container">
		<ul class="fc-features">
			<?php foreach ( $freshcart_icons as $freshcart_i => $freshcart_icon ) : ?>
				<?php
				if ( ! freshcart_mod( 'feat' . $freshcart_i . '_title' ) ) {
					continue;
				}
				?>
				<li class="fc-feature">
					<span class="fc-feature-icon"><?php echo freshcart_icon( $freshcart_icon ); // phpcs:ignore ?></span>
					<span>
						<strong><?php echo esc_html( freshcart_mod( 'feat' . $freshcart_i . '_title' ) ); ?></strong>
						<small><?php echo esc_html( freshcart_mod( 'feat' . $freshcart_i . '_text' ) ); ?></small>
					</span>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>
</section>
