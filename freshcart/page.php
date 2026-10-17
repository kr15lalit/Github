<?php
/**
 * Default page.
 *
 * @package FreshCart
 */

get_header();

while ( have_posts() ) :
	the_post();
	get_template_part( 'template-parts/page-header' );
	?>
	<div class="fc-container">
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'fc-page' ); ?>>
			<div class="entry-content">
				<?php
				the_content();
				wp_link_pages();
				?>
			</div>
			<?php
			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}
			?>
		</article>
	</div>
	<?php
endwhile;

get_footer();
