<?php
/**
 * Blog index, archives and search results.
 *
 * @package FreshCart
 */

get_header();

if ( is_search() ) {
	/* translators: %s: search query */
	$freshcart_title = sprintf( __( 'Search results for: %s', 'freshcart' ), '<span>' . esc_html( get_search_query() ) . '</span>' );
} elseif ( is_archive() ) {
	$freshcart_title = get_the_archive_title();
} elseif ( is_home() && get_option( 'page_for_posts' ) ) {
	$freshcart_title = get_the_title( get_option( 'page_for_posts' ) );
} else {
	$freshcart_title = __( 'Blog', 'freshcart' );
}
get_template_part( 'template-parts/page-header', null, array( 'title' => $freshcart_title ) );
?>
<div class="fc-container fc-layout<?php echo is_active_sidebar( 'sidebar-1' ) ? ' has-sidebar' : ''; ?>">
	<div class="fc-content">
		<?php if ( have_posts() ) : ?>
			<div class="fc-post-grid">
				<?php
				while ( have_posts() ) {
					the_post();
					get_template_part( 'template-parts/content', 'card' );
				}
				?>
			</div>
			<?php freshcart_pagination(); ?>
		<?php else : ?>
			<?php get_template_part( 'template-parts/content', 'none' ); ?>
		<?php endif; ?>
	</div>
	<?php get_sidebar(); ?>
</div>
<?php
get_footer();
