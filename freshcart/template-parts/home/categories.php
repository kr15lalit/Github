<?php
/**
 * Home: popular product categories.
 *
 * @package FreshCart
 */

$freshcart_args = array(
	'taxonomy'   => 'product_cat',
	'hide_empty' => false,
	'number'     => absint( freshcart_mod( 'cats_number' ) ),
	'exclude'    => array( absint( get_option( 'default_product_cat' ) ) ),
);

$freshcart_slugs = array_filter( array_map( 'trim', explode( ',', (string) freshcart_mod( 'cats_include' ) ) ) );
if ( $freshcart_slugs ) {
	$freshcart_args['slug']    = $freshcart_slugs;
	$freshcart_args['orderby'] = 'slug__in';
} else {
	$freshcart_args['parent']  = 0;
	$freshcart_args['orderby'] = 'count';
	$freshcart_args['order']   = 'DESC';
}

$freshcart_terms = get_terms( $freshcart_args );
if ( ! $freshcart_terms || is_wp_error( $freshcart_terms ) ) {
	return;
}
?>
<section class="fc-section fc-categories">
	<div class="fc-container">
		<?php freshcart_section_head( freshcart_mod( 'cats_title' ), array( 'arrows' => true ) ); ?>
		<div class="fc-carousel">
			<ul class="fc-carousel-track fc-cat-list">
				<?php foreach ( $freshcart_terms as $freshcart_term ) : ?>
					<?php $freshcart_thumb = get_term_meta( $freshcart_term->term_id, 'thumbnail_id', true ); ?>
					<li class="fc-cat">
						<a href="<?php echo esc_url( get_term_link( $freshcart_term ) ); ?>">
							<span class="fc-cat-img">
								<?php
								if ( $freshcart_thumb ) {
									echo wp_get_attachment_image( $freshcart_thumb, 'thumbnail', false, array( 'alt' => '' ) );
								} else {
									echo freshcart_icon( 'tag' ); // phpcs:ignore
								}
								?>
							</span>
							<span class="fc-cat-name"><?php echo esc_html( $freshcart_term->name ); ?></span>
							<span class="fc-cat-count">
								<?php
								/* translators: %d: number of products */
								echo esc_html( sprintf( _n( '%d Product', '%d Products', $freshcart_term->count, 'freshcart' ), $freshcart_term->count ) );
								?>
							</span>
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>
</section>
