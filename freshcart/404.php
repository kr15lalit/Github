<?php
/**
 * 404 page.
 *
 * @package FreshCart
 */

get_header();
?>
<div class="fc-container fc-404">
	<p class="fc-404-code">404</p>
	<h1><?php esc_html_e( 'Oops! Page not found', 'freshcart' ); ?></h1>
	<p><?php esc_html_e( 'The page you are looking for does not exist or has been moved.', 'freshcart' ); ?></p>
	<?php get_search_form(); ?>
	<a class="fc-btn" href="<?php echo esc_url( home_url( '/' ) ); ?>"><?php esc_html_e( 'Back to Home', 'freshcart' ); ?></a>
</div>
<?php
get_footer();
