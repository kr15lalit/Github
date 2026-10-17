<?php
/**
 * Single post.
 *
 * @package FreshCart
 */

get_header();

while ( have_posts() ) :
	the_post();
	get_template_part( 'template-parts/page-header' );
	?>
	<div class="fc-container fc-layout<?php echo is_active_sidebar( 'sidebar-1' ) ? ' has-sidebar' : ''; ?>">
		<article id="post-<?php the_ID(); ?>" <?php post_class( 'fc-content fc-single' ); ?>>
			<?php if ( has_post_thumbnail() ) : ?>
				<div class="fc-single-thumb"><?php the_post_thumbnail( 'large' ); ?></div>
			<?php endif; ?>
			<?php freshcart_posted_on(); ?>
			<div class="entry-content">
				<?php
				the_content();
				wp_link_pages();
				?>
			</div>
			<footer class="fc-single-footer">
				<?php the_tags( '<div class="fc-tags">', '', '</div>' ); ?>
			</footer>
			<?php
			the_post_navigation(
				array(
					'prev_text' => '<small>' . esc_html__( 'Previous', 'freshcart' ) . '</small> %title',
					'next_text' => '<small>' . esc_html__( 'Next', 'freshcart' ) . '</small> %title',
				)
			);
			if ( comments_open() || get_comments_number() ) {
				comments_template();
			}
			?>
		</article>
		<?php get_sidebar(); ?>
	</div>
	<?php
endwhile;

get_footer();
