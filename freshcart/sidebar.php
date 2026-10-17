<?php
/**
 * Blog sidebar.
 *
 * @package FreshCart
 */

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}
?>
<aside class="fc-sidebar" aria-label="<?php esc_attr_e( 'Sidebar', 'freshcart' ); ?>">
	<?php dynamic_sidebar( 'sidebar-1' ); ?>
</aside>
