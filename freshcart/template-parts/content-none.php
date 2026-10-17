<?php
/**
 * Shown when no posts are found.
 *
 * @package FreshCart
 */

?>
<div class="fc-none">
	<h2><?php esc_html_e( 'Nothing found', 'freshcart' ); ?></h2>
	<p><?php esc_html_e( 'Sorry, nothing matched. Try a different search.', 'freshcart' ); ?></p>
	<?php get_search_form(); ?>
</div>
