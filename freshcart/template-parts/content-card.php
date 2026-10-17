<?php
/**
 * Post card used on the homepage and in archives.
 *
 * @package FreshCart
 */

?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'fc-post-card' ); ?>>
	<a class="fc-post-thumb" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
		<?php
		if ( has_post_thumbnail() ) {
			the_post_thumbnail( 'freshcart-blog', array( 'alt' => '' ) );
		}
		?>
	</a>
	<div class="fc-post-body">
		<?php freshcart_posted_on(); ?>
		<h3 class="fc-post-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		<a class="fc-link" href="<?php the_permalink(); ?>"><?php esc_html_e( 'Read More', 'freshcart' ); ?> <?php echo freshcart_icon( 'arrow-r' ); // phpcs:ignore ?></a>
	</div>
</article>
