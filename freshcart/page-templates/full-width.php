<?php
/**
 * Template Name: Full Width (no title)
 * Template Post Type: page
 *
 * Use this for pages you build entirely with blocks or a page builder.
 *
 * @package FreshCart
 */

get_header();

while ( have_posts() ) :
	the_post();
	?>
	<article id="post-<?php the_ID(); ?>" <?php post_class( 'fc-full-width' ); ?>>
		<div class="entry-content">
			<?php the_content(); ?>
		</div>
	</article>
	<?php
endwhile;

get_footer();
