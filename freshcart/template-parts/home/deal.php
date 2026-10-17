<?php
/**
 * Home: deal of the week with countdown.
 *
 * @package FreshCart
 */

$freshcart_tz  = wp_timezone();
$freshcart_end = freshcart_mod( 'deal_end' );
try {
	$freshcart_end = $freshcart_end
		? new DateTimeImmutable( $freshcart_end . ' 23:59:59', $freshcart_tz )
		: new DateTimeImmutable( 'sunday this week 23:59:59', $freshcart_tz );
} catch ( Exception $e ) {
	$freshcart_end = new DateTimeImmutable( 'sunday this week 23:59:59', $freshcart_tz );
}
$freshcart_units = array(
	'days'  => __( 'Days', 'freshcart' ),
	'hours' => __( 'Hours', 'freshcart' ),
	'mins'  => __( 'Mins', 'freshcart' ),
	'secs'  => __( 'Secs', 'freshcart' ),
);
?>
<section class="fc-section fc-deal">
	<div class="fc-container">
		<div class="fc-deal-box">
			<div class="fc-section-head">
				<div class="fc-deal-head-left">
					<h2 class="fc-section-title"><?php echo esc_html( freshcart_mod( 'deal_title' ) ); ?></h2>
					<div class="fc-countdown" data-end="<?php echo esc_attr( $freshcart_end->getTimestamp() ); ?>">
						<?php foreach ( $freshcart_units as $freshcart_unit => $freshcart_label ) : ?>
							<span class="fc-countdown-item"><b data-unit="<?php echo esc_attr( $freshcart_unit ); ?>">00</b><small><?php echo esc_html( $freshcart_label ); ?></small></span>
						<?php endforeach; ?>
					</div>
				</div>
				<div class="fc-section-tools">
					<?php if ( freshcart_mod( 'deal_more_text' ) ) : ?>
						<a class="fc-more" href="<?php echo esc_url( freshcart_link( '' ) ); ?>"><?php echo esc_html( freshcart_mod( 'deal_more_text' ) ); ?> <?php echo freshcart_icon( 'arrow-r' ); // phpcs:ignore ?></a>
					<?php endif; ?>
					<button type="button" class="fc-arrow" data-dir="-1" aria-label="<?php esc_attr_e( 'Previous', 'freshcart' ); ?>"><?php echo freshcart_icon( 'arrow-l' ); // phpcs:ignore ?></button>
					<button type="button" class="fc-arrow" data-dir="1" aria-label="<?php esc_attr_e( 'Next', 'freshcart' ); ?>"><?php echo freshcart_icon( 'arrow-r' ); // phpcs:ignore ?></button>
				</div>
			</div>
			<?php
			freshcart_product_carousel(
				array(
					'limit'   => absint( freshcart_mod( 'deal_number' ) ),
					'include' => freshcart_sale_ids(),
					'orderby' => 'rand',
				)
			);
			?>
		</div>
	</div>
</section>
