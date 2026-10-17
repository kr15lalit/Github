<?php
/**
 * Home: latest blog posts.
 *
 * @package FreshCart
 */

$freshcart_posts = new WP_Query(
	array(
		'post_type'           => 'post',
		'posts_per_page'      => absint( freshcart_mod( 'blog_number' ) ),
		'ignore_sticky_posts' => true,
		'no_found_rows'       => true,
	)
);
if ( ! $freshcart_posts->have_posts() ) {
	return;
}
?>
<section class="fc-section fc-blog">
	<div class="fc-container">
		<?php freshcart_section_head( freshcart_mod( 'blog_title' ), array( 'arrows' => true ) ); ?>
		<div class="fc-carousel">
			<div class="fc-carousel-track fc-post-list">
				<?php
				while ( $freshcart_posts->have_posts() ) {
					$freshcart_posts->the_post();
					get_template_part( 'template-parts/content', 'card' );
				}
				wp_reset_postdata();
				?>
			</div>
		</div>
	</div>
</section>
